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

  pairs.forEach(pair => {
    //all exchanges sources for 1 pair
    let pairSources = sources.map(s =>
      s.pipe(filter(data => data.pair === pair))
    );

    combineLatest(...pairSources).subscribe(srcDatas => {
      //all exchanges data for 1 pair

      //todo: analyse all data for 1 pair
      //save that info into file?

      console.clear();
      srcDatas.forEach(data => console.log(data));

      //todo: somehow concat diff pairs into one tick?
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
