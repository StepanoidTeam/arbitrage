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
      data.exName,
      `[${data.pair}]\n`,
      "💹".padEnd(3),
      ` bid: `,
      data.bid && data.bid.price.toString().padEnd(10),
      ` |`,
      `🅰️  ask: `,
      data.ask && data.ask.price,
      "\n",
      "    vol: ",
      data.bid && data.bid.volume.toString().padEnd(10),
      `|`,
      "   vol: ",
      data.ask && data.ask.volume
    );
  } else {
    //console.log(data);
  }
});
