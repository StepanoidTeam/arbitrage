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
const { filterByProfit, filterByRoi } = require("../helpers/filters");

const { getStatsFromTimeframe } = require("../analytics");
const { pairs2use } = require("../configs");
const { PAIRS } = require("../configs/globalPairs");

const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex"); //buggy
const { getSourceForPairs: wsHuobi } = require("./wsHuobi");
const { getSourceForPairs: wsKucoin } = require("./wsKucoin"); //in progress
const { getSourceForPairs: wsOkex } = require("./wsOkex");
const { getSourceForPairs: wsGate } = require("./wsGate");
const { getSourceForPairs: wsHitbtc } = require("./wsHitbtc");
const { getSourceForPairs: wsBibox } = require("./wsBibox");
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
        .pipe(filter(({ type }) => type === "system"))
        .subscribe(exData => {
          progressStateSub.next({
            TYPE: "EXCHANGES",
            PAYLOAD: {
              name: exData.exName,
              PAYLOAD: { TYPE: "ONLINE", PAYLOAD: exData.isOnline },
            },
          });

          // todo: check whether we need to add exchange again(?)
          if (!exData.isOnline) {
            pairTimeframe.delete(exData.exName);
          }
        });

      globalWsexSource
        .pipe(
          filter(exData => exData.type === "top"),
          filter(exData => exData.pair === pair)
        )
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
      //todo: agg similar stats
      tap(() =>
        progressStateSub.next({
          TYPE: "DEALS.ALL",
          PAYLOAD: null,
        })
      ),
      //skip non-profit deals
      filter(filterByProfit),
      //skip low-roi deals
      filter(filterByRoi),
      //count profitable exchanges
      tap(() => {
        progressStateSub.next({
          TYPE: "DEALS.PROFITABLE",
          PAYLOAD: null,
        });
      }),
      tap(({ exMinAsk: { exName: key } }) =>
        progressStateSub.next({
          TYPE: "EXCHANGES",
          PAYLOAD: { name: key, PAYLOAD: { TYPE: "DEALS", PAYLOAD: null } },
        })
      ),
      tap(({ exMaxBid: { exName: key } }) =>
        progressStateSub.next({
          TYPE: "EXCHANGES",
          PAYLOAD: { name: key, PAYLOAD: { TYPE: "DEALS", PAYLOAD: null } },
        })
      )
    )
  );
  //save each Stat into db
  merge(...aggStats).subscribe(dbLogger(Date.now()));

  //todo: get from those subscribed/config
  const exchanges = [
    "Binance",
    "Bitfinex",
    "Gate",
    "Okex",
    "Huobi",
    "Hitbtc",
    "Bittrex",
    "Bibox",
  ].map(name => ({
    name,
    online: false,
    deals: 0,
    pairs: {
      config: 0,
      allowed: 0,
      connected: 0,
    },
  }));

  const basicState = {
    deals: {
      all: 0,
      profitable: 0,
    },
    exchanges,
  };

  function exchangeReducer(state, { TYPE, PAYLOAD }) {
    switch (TYPE) {
      case "ONLINE":
        state.online = PAYLOAD;
        break;
      case "DEALS":
        state.deals++;
        break;

      case "PAIRS.CONFIG":
        state.pairs.config = PAYLOAD;
        break;
      case "PAIRS.ALLOWED":
        state.pairs.allowed = PAYLOAD;
        break;
      case "PAIRS.CONNECTED":
        state.pairs.connected = PAYLOAD;
        break;
    }

    return state;
  }

  //just for logging - kinda reducer
  progressStateSub
    .pipe(
      scan((state, { TYPE, PAYLOAD }) => {
        //reducer
        switch (TYPE) {
          case "DEALS.ALL":
            state.deals.all++;
            break;
          case "DEALS.PROFITABLE":
            state.deals.profitable++;
            break;
          case "EXCHANGES":
            const ex = state.exchanges.find(
              x => x.name.toLowerCase() === PAYLOAD.name.toLowerCase()
            );

            exchangeReducer(ex, PAYLOAD.PAYLOAD);
            break;
        }

        return state;
      }, basicState),
      throttleTime(1000)
    )
    .subscribe(state => {
      const exMessage = state.exchanges
        .map(ex =>
          [
            `${ex.online ? "🌝" : "🌚"} ${ex.name.padEnd(10) +
              `[${ex.deals}]`.padEnd(10)}`,
            `pairs: ${[
              ex.pairs.config,
              ex.pairs.allowed,
              ex.pairs.connected,
            ].join(" : ")}`,
          ].join("")
        )
        .join("\n");

      const message = [
        `STATS`,
        `⏺ All: ${state.deals.all}`,
        `❇️ Profitable: ${state.deals.profitable}`,
        `Exchanges:`,
        `${exMessage}`,
      ].join("\n");

      logUpdate(message);
    });
}

//todo: move config to config
logAnalytics({
  pairs: pairs2use,
  //pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
  //wsExchanges: [wsBinance, wsBitfinex, wsGate, wsOkex, wsHuobi, wsHitbtc], //

  // pairs: [PAIRS.BTC_USDT, PAIRS.XRP_USDT],
  wsExchanges: [wsBinance, wsBibox, wsBittrex, wsGate, wsHuobi], //

  //wsExchanges: [wsBinance, wsHitbtc],
});
