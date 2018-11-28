const { combineLatest } = require("rxjs");
const { map, distinctUntilChanged } = require("rxjs/operators");

const { filter, first } = require("rxjs/operators");

const { appendTextToFile, makeDir } = require("../helpers/file");
const { getCsvHeaders, getCsvValues } = require("../helpers/csv");
const { getStatsFromTimeframe } = require("../analytics");
const { PAIRS } = require("../configs");

const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex");
const { getSourceForPairs: wsHuobi } = require("./wsHuobi");
const { getSourceForPairs: wsKucoin } = require("./wsKucoin");
const { getSourceForPairs: wsOkex } = require("./wsOkex");
const { getSourceForPairs: wsGate } = require("./wsGate");

const pairs = [
  PAIRS.BTC_USDT,
  PAIRS.XRP_USDT,
  // PAIRS.ETH_USDT,
  // PAIRS.ETC_USDT,
  // PAIRS.XRP_BTC,
  // PAIRS.ETH_BTC,
  // PAIRS.NEO_USDT,
  // PAIRS.LTC_USDT,
  // PAIRS.XMR_BTC,
  // PAIRS.ETC_BTC,
  // PAIRS.LTC_BTC,
  // PAIRS.NEO_BTC,
  // PAIRS.TRX_USDT,
  // PAIRS.ZEC_BTC,
  // PAIRS.DASH_BTC,
  // PAIRS.QTUM_BTC,
  // PAIRS.NEO_ETH,
  // PAIRS.XLM_BTC,
  // PAIRS.TRX_BTC,
  // PAIRS.QTUM_ETH,
  // PAIRS.TRX_ETH,
  // PAIRS.XVG_BTC,
  // PAIRS.XLM_ETH,
  // PAIRS.ZRX_ETH,
  // PAIRS.OMG_BTC,
  // PAIRS.BAT_BTC,
  // PAIRS.ZRX_BTC,
  // PAIRS.BAT_ETH,
  // PAIRS.REP_ETH,
  // PAIRS.OMG_ETH,
  // PAIRS.RLC_ETH,
  // PAIRS.SNT_ETH,
  // PAIRS.GNT_BTC,
  // PAIRS.RLC_BTC,
  // PAIRS.REP_BTC,
  // PAIRS.GNT_ETH,
  // PAIRS.SNT_BTC,
  // PAIRS.LRC_BTC,
  // PAIRS.BNT_BTC,
  // PAIRS.RCN_BTC,
  // PAIRS.BNT_ETH,
];

function listenAllPairs(pairs) {
  let sources = [wsGate].map(ex => ex(pairs));

  // let sources = [wsBinance, wsBitfinex, wsBittrex, wsHuobi].map(ex =>
  //   ex(pairs)
  // );

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

function logAnalytics() {
  const timeStarted = Date.now();

  let aggPairSources = listenAllPairs(pairs);

  const aggStats = aggPairSources.map(aggPairSrc =>
    aggPairSrc.pipe(
      map(aggPair => getStatsFromTimeframe(aggPair)),
      filter(stats => stats !== null),
      //skip shit deals
      filter(stats => stats.netProfit > 0)
    )
  );

  const getLogName = (subdir, pair) =>
    `./logs/${subdir}/stats-${pair}-${timeStarted}.csv`;

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
        distinctUntilChanged(sameMiniStats)
      )
      .subscribe(minStats => {
        appendTextToFile(
          getLogName("min", minStats.pair),
          getCsvValues(minStats)
        );
      });
  });
}

function debugPairs() {
  let aggPairSources = listenAllPairs(pairs);
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
//logAnalytics();

// wsHuobi(["ZIL_BTC"]).subscribe(data => {
//   console.clear();
//   console.log(`✳️`,data);
// });

// wsKucoin(["EOS_BTC"]).subscribe(data => {
//kukan not working
//   //console.clear();
//   console.log(`✳️`, data);
// });

// //PAIRS.BTC_USDT,
// wsOkex([PAIRS.XRP_USDT]).subscribe(data => {
//   console.clear();
//   console.log(`✳️`, data);
// });

//, PAIRS.XRP_BTC
// wsGate([PAIRS.BTC_USDT]).subscribe(data => {
//   console.clear();
//   console.log(`✳️`, data);
// });

debugPairs();
