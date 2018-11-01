const { PAIRS } = require("../configs");
const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");

const pairs = [PAIRS.BTC_USDT]; //, PAIRS.EOS_BTC

// wsBinance(pairs).subscribe(val => {
//   console.clear();
//   console.log(val);
// });

wsBitfinex(pairs).subscribe(val => {
  console.clear();
  console.log(val);
});
