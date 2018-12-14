"use strict";
const { combineLatest, merge, Subject, of } = require("rxjs");
const {
  map,
  distinctUntilChanged,
  filter,
  tap,
  mergeMap,
  throttleTime,
  scan, //reduce-like
} = require("rxjs/operators");
const { toArray } = require("lodash");
const logUpdate = require("log-update");

const { dbLogger } = require("../helpers/dbLogger");
const { filterByProfit } = require("../helpers/filterByProfit");

const { getStatsFromTimeframe } = require("../analytics");
const { pairs2use } = require("../configs");

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

function getPairsAggSource({ pairs, wsExchanges }) {
  //activate all exchanges
  let wsExchangeSources = wsExchanges.map(wsEx => wsEx(pairs));
  //merge all ex data into one source
  let globalWsexSource = merge(...wsExchangeSources);

  let timeframeSubs = pairs.map(pair => {
    let pairTimeframeSub = new Subject();
    let pairTimeframe = {};

    //sub for particular pair to make tf
    globalWsexSource
      .pipe(filter(exData => exData.pair === pair))
      .subscribe(exData => {
        pairTimeframe[exData.exName] = exData;

        pairTimeframeSub.next(toArray(pairTimeframe));
      });

    return pairTimeframeSub;
  });

  return timeframeSubs;
}

function logAnalytics({ pairs, wsExchanges }) {
  const dateStarted = new Date();

  console.log(`🤖  bot started at: ${dateStarted.toLocaleString()}`);

  const progressSub = new Subject();

  let aggPairSources = getPairsAggSource({ pairs, wsExchanges });

  const aggStats = aggPairSources.map(aggPairSrc =>
    aggPairSrc.pipe(
      map(timeframe => getStatsFromTimeframe(timeframe)),
      mergeMap(stats => of(...stats)),
      tap(() => progressSub.next({ key: "all" })),
      //skip non-profit deals
      filter(filterByProfit),
      tap(() => progressSub.next({ key: "profitable" })),
      //count profitable exchanges
      tap(({ exMinAsk: { exName: key } }) => progressSub.next({ key })),
      tap(({ exMaxBid: { exName: key } }) => progressSub.next({ key }))
    )
  );

  //save each Stat into db
  merge(...aggStats).subscribe(dbLogger(Date.now()));

  //just for logging
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
    .subscribe(stats => {
      let value = Object.entries(stats)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      logUpdate(`log stats:\n`, value);
    });
}

//todo: move config to config
logAnalytics({
  pairs: pairs2use,
  //pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
  wsExchanges: [wsBinance, wsBitfinex, wsGate, wsOkex, wsHuobi, wsHitbtc],
  //wsExchanges: [wsBinance, wsOkex, wsHitbtc, wsHuobi],
});
