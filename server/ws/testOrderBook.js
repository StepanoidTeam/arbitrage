const logUpdate = require("log-update");

const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex"); //buggy
const { getSourceForPairs: wsHuobi } = require("./wsHuobi");
const { getSourceForPairs: wsKucoin } = require("./wsKucoin"); //in progress
const { getSourceForPairs: wsOkex } = require("./wsOkex");
const { getSourceForPairs: wsGate } = require("./wsGate");
const { getSourceForPairs: wsHitbtc } = require("./wsHitbtc");

const { PAIRS } = require("../configs/globalPairs");

wsBittrex([PAIRS.ZEC_BTC]).subscribe(data => {
  if (data.exName) {
    logUpdate(
      `${data.exName} [${data.pair}]`,
      data.bid && `\n💹  bid: ${data.bid.price} \t|🅰️  ask: ${data.ask.price}`,
      data.ask && `\n    v: ${data.bid.volume} \t| v: ${data.ask.volume}`
    );
  } else {
    //console.log(data);
  }
});
