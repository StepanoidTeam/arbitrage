"use strict";
const { combineLatest, merge, Subject } = require("rxjs");
const {
  map,
  distinctUntilChanged,
  groupBy,
  filter,
  first,
  tap,
  mergeMap,
  throttleTime,
  scan, //reduce-like
} = require("rxjs/operators");
const { toArray } = require("lodash");

const { appendTextToFile, makeDir } = require("../helpers/file");
const { getCsvHeaders, getCsvValues } = require("../helpers/csv");
const { getStatsFromTimeframe } = require("../analytics");
const { PAIRS, pairs2use } = require("../configs");
const { consoleRewrite } = require("../helpers/cli-progress");

const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex");
const { getSourceForPairs: wsHuobi } = require("./wsHuobi");
const { getSourceForPairs: wsKucoin } = require("./wsKucoin");
const { getSourceForPairs: wsOkex } = require("./wsOkex");
const { getSourceForPairs: wsGate } = require("./wsGate");

function getPairsAggSource({ pairs, wsex }) {
  //activate all exchanges
  let exSources = wsex.map(ex => ex(pairs));
  let exSrc = merge(...exSources);

  let subjects = pairs.map(pair => {
    let subject = new Subject();
    let agg = {};

    //group by pair
    exSrc.pipe(filter(exData => exData.pair === pair)).subscribe(exData => {
      //agg.pair = pair;
      agg[exData.exName] = exData;

      subject.next(toArray(agg));
    });

    return subject;
  });

  return subjects;
}

function listenAllPairs({ pairs, wsex }) {
  let exSources = wsex.map(ex => ex(pairs));

  let aggPairs = pairs.map(pair => {
    //all exchanges sources for 1 pair
    let pairSources = exSources.map(s =>
      s.pipe(filter(data => data.pair === pair))
    );

    //combine all exchanges data for 1 pair into 1 stream
    return combineLatest(...pairSources);
  });

  return aggPairs;
}

function getMiniStats({
  timestamp,
  pair,
  exMinAsk: {
    exName: minAskExName,
    ask: { price: minAskPrice },
  },
  exMaxBid: {
    exName: maxBidExName,
    bid: { price: maxBidPrice },
  },
  availVolume,
  netProfit,
}) {
  return {
    date: new Date(timestamp).toISOString(),
    pair,
    minAskExName,
    minAskPrice,
    maxBidExName,
    maxBidPrice,
    availVolume,
    netProfit,
  };
}

function sameMiniStats(ms1, ms2) {
  return (
    ms1.minAskExName === ms2.minAskExName &&
    ms1.minAskPrice === ms2.minAskPrice &&
    ms1.maxBidExName === ms2.maxBidExName &&
    ms1.maxBidPrice === ms2.maxBidPrice &&
    ms1.availVolume === ms2.availVolume &&
    ms1.netProfit === ms2.netProfit
  );
}

function logAnalytics({ pairs, wsex }) {
  const timeStarted = new Date().toISOString();
  const progressSub = new Subject();

  let aggPairSources = getPairsAggSource({ pairs, wsex });

  const aggStats = aggPairSources.map(aggPairSrc =>
    aggPairSrc.pipe(
      map(aggPair => getStatsFromTimeframe(aggPair)),
      filter(stats => stats !== null),
      tap(() => progressSub.next({ key: "all" })),
      //skip shit deals
      filter(stats => stats.netProfit > 0),
      tap(() => progressSub.next({ key: ">0" }))
    )
  );

  const getLogName = (subdir, pair) =>
    `./logs/${subdir}/stats-${pair}-${timeStarted.replace(":", ";")}.csv`;

  aggStats.forEach(aggPairSource => {
    aggPairSource.pipe(first()).subscribe(stats => {
      makeDir("./logs/max");
      makeDir("./logs/min");
      appendTextToFile(getLogName("max", stats.pair), getCsvHeaders(stats));
      appendTextToFile(
        getLogName("min", stats.pair),
        getCsvHeaders(getMiniStats(stats))
      );
    });

    aggPairSource.subscribe(stats => {
      appendTextToFile(getLogName("max", stats.pair), getCsvValues(stats));
    });

    aggPairSource
      .pipe(
        map(getMiniStats),
        //log only diff mini stats
        distinctUntilChanged(sameMiniStats),
        tap(() => progressSub.next({ key: "min" }))
      )
      .subscribe(minStats => {
        appendTextToFile(
          getLogName("min", minStats.pair),
          getCsvValues(minStats)
        );
      });

    progressSub
      .pipe(
        scan((acc, { key }) => {
          if (acc[key]) {
            acc[key]++;
          } else {
            acc[key] = 1;
          }
          return acc;
        }, {}),
        throttleTime(300)
      )
      .subscribe(value => {
        consoleRewrite(`log stats: ${JSON.stringify(value)}`);
      });

    console.log(`bot started at ${timeStarted}`);
  });
}

function debugPairs({ pairs, wsex }) {
  let aggPairSources = listenAllPairs({ pairs, wsex });
  //todo: this combine is just for test purposes!!!
  combineLatest(...aggPairSources).subscribe(allPairsDataAgg => {
    //all pairs data aggregated from all ex's by pair
    //todo: analyse all data for 1 pair
    //save that info into file?

    console.clear();

    allPairsDataAgg.forEach(aggPair => {
      console.log(aggPair[0].pair);
      aggPair.forEach(ex => console.log(ex.exName, ex.bid, ex.ask));
    });
  });
}

//debugPairs();

// wsBinance([PAIRS.BTC_USDT, PAIRS.XRP_USDT]).subscribe(data => {
//   console.clear();
//   console.log(`✳️`, data);
// });

// debugPairs({
//   pairs,
//   wsex: [wsBinance], // wsBitfinex, wsHuobi, wsOkex, wsGate
// });

// getPairsAggSource({
//   pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
//   wsex: [wsBinance, wsBitfinex, wsGate],
// })[0].subscribe(x => {
//   console.log(x);
// });

logAnalytics({
  //pairs: pairs2use,
  pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
  // wsex: [wsBinance, wsBitfinex, wsGate, wsOkex, wsHuobi],
  wsex: [wsGate, wsOkex],
});
