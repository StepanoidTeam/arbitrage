const { combineLatest } = require("rxjs");
const { map } = require("rxjs/operators");

const { filter } = require("rxjs/operators");

const { appendJSONToFile } = require("../helpers/file");
const { getStatsFromTimeframe } = require("../analytics");
const { PAIRS } = require("../configs");
const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex");

const pairs = [
  PAIRS.BTC_USDT,
  PAIRS.XRP_USDT,
  PAIRS.ETH_USDT,
  PAIRS.ETC_USDT,
  PAIRS.XRP_BTC,
  PAIRS.ETH_BTC,
  PAIRS.NEO_USDT,
  PAIRS.LTC_USDT,
  PAIRS.XMR_BTC,
  PAIRS.ETC_BTC,
  PAIRS.LTC_BTC,
  PAIRS.NEO_BTC,
  PAIRS.TRX_USDT,
  PAIRS.ZEC_BTC,
  PAIRS.DASH_BTC,
  PAIRS.QTUM_BTC,
  PAIRS.NEO_ETH,
  PAIRS.XLM_BTC,
  PAIRS.TRX_BTC,
  PAIRS.QTUM_ETH,
  PAIRS.TRX_ETH,
  PAIRS.XVG_BTC,
  PAIRS.XLM_ETH,
  PAIRS.ZRX_ETH,
  PAIRS.OMG_BTC,
  PAIRS.BAT_BTC,
  PAIRS.ZRX_BTC,
  PAIRS.BAT_ETH,
  PAIRS.REP_ETH,
  PAIRS.OMG_ETH,
  PAIRS.RLC_ETH,
  PAIRS.SNT_ETH,
  PAIRS.GNT_BTC,
  PAIRS.RLC_BTC,
  PAIRS.REP_BTC,
  PAIRS.GNT_ETH,
  PAIRS.SNT_BTC,
  PAIRS.LRC_BTC,
  PAIRS.BNT_BTC,
  PAIRS.RCN_BTC,
  PAIRS.BNT_ETH,
];

let sources = [wsBinance, wsBitfinex, wsBittrex].map(ex => ex(pairs));

function listenAllPairs(pairs) {
  let aggPairs = pairs.map(pair => {
    //all exchanges sources for 1 pair
    let pairSources = sources.map(s =>
      s.pipe(filter(data => data.pair === pair))
    );

    //combine all exchanges data for 1 pair into 1 stream
    return combineLatest(...pairSources);
  });

  return aggPairs;
}

let aggPairSources = listenAllPairs(pairs).map(aggPairSrc =>
  aggPairSrc.pipe(map(aggPair => getStatsFromTimeframe(aggPair)))
);

function logAnalytics() {
  const timeStarted = Date.now();
  aggPairSources.forEach(aggPairSource => {
    aggPairSource.subscribe(stats => {
      const logFilePath = `./logs/stats-${stats.pair}-${timeStarted}.log`;
      appendJSONToFile(logFilePath, stats);
    });
  });
}

function debugPairs() {
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
logAnalytics();
