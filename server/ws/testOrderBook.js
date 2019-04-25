const logUpdate = require("log-update");

const { getSourceForPairs: wsBinance } = require("./wsBinance");
const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex"); //buggy
const { getSourceForPairs: wsHuobi } = require("./wsHuobi");
const { getSourceForPairs: wsKucoin } = require("./wsKucoin"); //in progress
const { getSourceForPairs: wsOkex } = require("./wsOkex");
const { getSourceForPairs: wsGate } = require("./wsGate");
const { getSourceForPairs: wsHitbtc } = require("./wsHitbtc");
const { getSourceForPairs: wsBibox } = require("./wsBibox");

const { PAIRS } = require("../configs/globalPairs");

const wsToTest = wsBibox;

wsToTest([PAIRS.BTC_USDT]).subscribe(data => {
  if (data.exName) {
    if (data.bid && data.ask && data.bid.price > data.ask.price) {
      console.error("❌bid FAIL");
    }

    if (!data.bid || !data.ask) {
      debugger;
    }

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
