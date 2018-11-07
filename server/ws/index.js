const { combineLatest } = require("rxjs");
const { map } = require("rxjs/operators");

const { filter } = require("rxjs/operators");

const { appendJSONToFile } = require("../helpers/file");
const { getStatsFromTimeframe } = require("../analytics");
const { PAIRS } = require("../configs");
const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex");

const pairs = [PAIRS.BTC_USDT, PAIRS.XRP_USDT]; //, PAIRS.EOS_BTC

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
