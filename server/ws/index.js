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

function logAnalytics({ pairs, wsExchanges }) {
  const dateStarted = new Date();

  console.log(`🤖  bot started at: ${dateStarted.toLocaleString()}`);

  const progressStateSub = new Subject();

  function getPairsAggSource({ pairs, wsExchanges }) {
    //activate all exchanges
    let wsExchangeSources = wsExchanges.map(wsEx => wsEx(pairs));
    //merge all ex data into one source
    let globalWsexSource = merge(...wsExchangeSources);

    let timeframeSubs = pairs.map(pair => {
      let pairTimeframeSub = new Subject();
      let pairTimeframe = new Map();

      //sub for particular pair to make tf
      globalWsexSource
        .pipe(filter(({ isSystem }) => isSystem))
        .subscribe(exData => {
          progressStateSub.next({
            TYPE: "TOGGLE_STATE",
            PAYLOAD: { key: exData.exName, status: exData.isOnline },
          });

          if (!exData.isOnline) {
            pairTimeframe.delete(exData.exName);
          }
        });

      globalWsexSource
        .pipe(filter(exData => exData.pair === pair))
        .subscribe(exData => {
          pairTimeframe.set(exData.exName, exData);

          pairTimeframeSub.next(Array.from(pairTimeframe.values()));
        });

      return pairTimeframeSub;
    });

    return timeframeSubs;
  }

  let aggPairSources = getPairsAggSource({ pairs, wsExchanges });

  const aggStats = aggPairSources.map(aggPairSrc =>
    aggPairSrc.pipe(
      map(timeframe => getStatsFromTimeframe(timeframe)),
      mergeMap(stats => of(...stats)),
      tap(() =>
        progressStateSub.next({
          TYPE: "TICK",
          PAYLOAD: { key: "All" },
        })
      ),
      //skip non-profit deals
      filter(filterByProfit),
      tap(() =>
        progressStateSub.next({
          TYPE: "TICK",
          PAYLOAD: { key: "Profitable" },
        })
      ),
      //count profitable exchanges
      tap(({ exMinAsk: { exName: key } }) =>
        progressStateSub.next({
          TYPE: "TICK",
          PAYLOAD: { key },
        })
      ),
      tap(({ exMaxBid: { exName: key } }) =>
        progressStateSub.next({
          TYPE: "TICK",
          PAYLOAD: { key },
        })
      )
    )
  );

  //save each Stat into db
  merge(...aggStats).subscribe(dbLogger(Date.now()));

  //just for logging
  progressStateSub
    .pipe(
      scan((state, { TYPE, PAYLOAD }) => {
        //basic init
        if (!state[PAYLOAD.key]) {
          state[PAYLOAD.key] = { value: 0, status: false };
        }
        //reducer
        switch (TYPE) {
          case "TICK":
            state[PAYLOAD.key].value++;
            break;
          case "TOGGLE_STATE":
            state[PAYLOAD.key].status = PAYLOAD.status;
            break;
        }
        return state;
      }, {}),
      throttleTime(1000)
    )
    .subscribe(state => {
      let value = Object.entries(state)
        .map(
          ([key, { value, status }]) =>
            `${status ? "🌝" : "🌚"} ${key}: ${value}`
        )
        .sort()
        .join("\n")
        .trim();

      logUpdate(`log stats:\n${value}`);
    });
}

//todo: move config to config
logAnalytics({
  pairs: pairs2use,
  //pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
  wsExchanges: [wsBinance, wsBitfinex, wsGate, wsOkex, wsHuobi, wsHitbtc],
  //wsExchanges: [wsBinance, wsOkex, wsHitbtc, wsHuobi],
});
