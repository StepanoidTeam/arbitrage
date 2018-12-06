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
const { getSourceForPairs: wsBittrex } = require("./wsBittrex"); //buggy
const { getSourceForPairs: wsHuobi } = require("./wsHuobi");
const { getSourceForPairs: wsKucoin } = require("./wsKucoin"); //in progress
const { getSourceForPairs: wsOkex } = require("./wsOkex");
const { getSourceForPairs: wsGate } = require("./wsGate");
//to prevent node eventEmitter warning about memory leak. 11 used, 10 is default
//upd: 17 used
require("events").EventEmitter.defaultMaxListeners = 20;

function getPairsAggSource({ pairs, wsex }) {
  //activate all exchanges
  let wsexSources = wsex.map(ex => ex(pairs));
  let globalWsexSource = merge(...wsexSources);

  let timeframeSubs = pairs.map(pair => {
    let timeframeSub = new Subject();
    let timeframe = {};

    //group by pair
    globalWsexSource
      .pipe(filter(exData => exData.pair === pair))
      .subscribe(exData => {
        //timeframe.pair = pair;
        timeframe[exData.exName] = exData;

        timeframeSub.next(toArray(timeframe));
      });

    return timeframeSub;
  });

  return timeframeSubs;
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
  const dateStarted = new Date();

  console.log(`🤖  bot started at: ${dateStarted.toLocaleString()}`);

  const progressSub = new Subject();

  let aggPairSources = getPairsAggSource({ pairs, wsex });

  const aggStats = aggPairSources.map(aggPairSrc =>
    aggPairSrc.pipe(
      map(aggPair => getStatsFromTimeframe(aggPair)),
      filter(stats => stats !== null),
      tap(() => progressSub.next({ key: "all" })),
      //skip shit deals
      filter(stats => stats.netProfit > 0),
      // tap(() => progressSub.next({ key: ">0" })),
      //count profitable exchanges
      tap(({ exMinAsk: { exName: key } }) => progressSub.next({ key })),
      tap(({ exMaxBid: { exName: key } }) => progressSub.next({ key }))
    )
  );

  const getMainCoin = pair => {
    let [, mainCoin] = pair.split("_");
    return mainCoin;
  };

  const getLogName = (subdir, pair) =>
    `./logs/${subdir}/${getMainCoin(pair)}/stats-${pair}-${+dateStarted}.csv`;

  makeDir(`./logs/max`);
  makeDir(`./logs/min`);

  aggStats.forEach(aggPairSource => {
    aggPairSource.pipe(first()).subscribe(stats => {
      let mainCoin = getMainCoin(stats.pair);

      makeDir(`./logs/max/${mainCoin}`);
      makeDir(`./logs/min/${mainCoin}`);

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
        distinctUntilChanged(sameMiniStats)
        //tap(() => progressSub.next({ key: "min" }))
      )
      .subscribe(minStats => {
        appendTextToFile(
          getLogName("min", minStats.pair),
          getCsvValues(minStats)
        );
      });
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
      throttleTime(1000)
    )
    .subscribe(value => {
      consoleRewrite(`log stats: ${JSON.stringify(value)}`);
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
//   pairs: [PAIRS.ETH_BTC, PAIRS.BTC_USDT],
//   wsex: [wsBitfinex], // wsBitfinex, wsHuobi, wsOkex, wsGate
// });

// getPairsAggSource({
//   pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
//   wsex: [wsBinance, wsBitfinex, wsGate],
// })[0].subscribe(x => {
//   console.log(x);
// });

logAnalytics({
  pairs: pairs2use,
  //pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
  wsex: [wsBinance, wsBitfinex, wsGate, wsOkex, wsHuobi],
  //wsex: [wsGate, wsOkex],
});
