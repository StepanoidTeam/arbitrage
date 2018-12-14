"use strict";
const { combineLatest, merge, Subject, of } = require("rxjs");
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

const { dbLogger } = require("../helpers/dbLogger");
const { filterByProfit } = require("../helpers/filterByProfit");

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
const { getSourceForPairs: wsHitbtc } = require("./wsHitbtc");
//to prevent node eventEmitter warning about memory leak. 11 used, 10 is default
//upd: 17 used
require("events").EventEmitter.defaultMaxListeners = 20;

function getPairsAggSource({ pairs, wsex }) {
  //activate all exchanges
  let wsexSources = wsex.map(ex => ex(pairs));
  //merge all ex data into one source
  let globalWsexSource = merge(...wsexSources);

  let timeframeSubs = pairs.map(pair => {
    let timeframeSub = new Subject();
    let timeframe = {};

    //sub for particular pair to make tf
    globalWsexSource
      .pipe(filter(exData => exData.pair === pair))
      .subscribe(exData => {
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

function logAnalytics({ pairs, wsex }) {
  const dateStarted = new Date();

  console.log(`🤖  bot started at: ${dateStarted.toLocaleString()}`);

  const progressSub = new Subject();

  let aggPairSources = getPairsAggSource({ pairs, wsex });

  const aggStats = aggPairSources.map(aggPairSrc =>
    aggPairSrc.pipe(
      map(timeframe => getStatsFromTimeframe(timeframe)),
      mergeMap(stats => of(...stats)),
      tap(() => progressSub.next({ key: "all" })),
      //skip shit deals
      filter(filterByProfit),
      tap(() => progressSub.next({ key: "profitable" })),
      //count profitable exchanges
      tap(({ exMinAsk: { exName: key } }) => progressSub.next({ key })),
      tap(({ exMaxBid: { exName: key } }) => progressSub.next({ key }))
    )
  );

  //todo: subscribe to aggstats and log to somewhere

  //TODO: try to merge all sources into one?
  //or group by main symbol?
  merge(...aggStats).subscribe(dbLogger(Date.now()));

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
//   pairs: [PAIRS.EOS_USDT, PAIRS.XRP_BTC],
//   wsex: [wsBinance, wsHitbtc], // wsBitfinex, wsHuobi, wsOkex, wsGate
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
  wsex: [wsBinance, wsBitfinex, wsGate, wsOkex, wsHuobi, wsHitbtc],
  //wsex: [wsBinance, wsOkex, wsHitbtc, wsHuobi],
});
