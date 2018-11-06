const { combineLatest, Subject } = require("rxjs");

const { filter, bufferCount } = require("rxjs/operators");

const { PAIRS } = require("../configs");
const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex");

const pairs = [PAIRS.BTC_USDT, PAIRS.XRP_USDT]; //, PAIRS.EOS_BTC

let sources = [wsBinance, wsBitfinex, wsBittrex].map(ex => ex(pairs));

function listenAllPairs(pairs) {
  //const subject = new Subject();

  let aggPairs = pairs.map(pair => {
    //all exchanges sources for 1 pair
    let pairSources = sources.map(s =>
      s.pipe(filter(data => data.pair === pair))
    );

    //combine all exchanges data for 1 pair into 1 stream
    return combineLatest(...pairSources);
  });

  //todo: this combine is just for test purposes!!!
  combineLatest(...aggPairs).subscribe(allPairsDataAgg => {
    //all pairs data aggregated from all ex's by pair
    //todo: analyse all data for 1 pair
    //save that info into file?

    console.clear();
    allPairsDataAgg.forEach(aggPair => {
      console.log(aggPair[0].pair);
      aggPair.forEach(ex => console.log(ex.bid, ex.ask));
    });
  });
}

listenAllPairs(pairs);

// wsBinance(pairs).subscribe(val => {
//   console.clear();
//   console.log(val);
// });

// wsBitfinex(pairs).subscribe(val => {
//   console.clear();
//   console.log(val);
// });

// wsBittrex(pairs)
//   .pipe(bufferCount(pairs.length))
//   .subscribe(data => {
//     console.clear();
//     data.forEach(d => console.log(d));
//   });
