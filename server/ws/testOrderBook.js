const logUpdate = require("log-update");
const { dbLogger } = require("../helpers/dbLogger");

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

function createBuffer(limit) {
  const buffer = [];

  return {
    buffer,
    push(data) {
      buffer.unshift(data);
      buffer.splice(limit);
    },
  };
}
/**
 * change to test another exchange
 */
const wsToTest = wsBittrex;

const orderBookBuffer = createBuffer(100);

const log = dbLogger(`orderbook-test.${wsToTest.exConfig.name}.${Date.now()}`);

/**
 * set PAIR to test here (only 1 for now ⚠️)
 */
wsToTest([PAIRS.BTC_USDT]).subscribe(data => {
  if (data.type === "orderbook") {
    //todo: do all
    //data.exName, data.pair, data.bids, data.asks.price, volume;

    if (
      [
        !data.bids,
        !data.asks,
        data.asks.length === 0,
        data.bids.length === 0,
        data.bids[0].price > data.asks[0].price,
      ].some(x => x)
    ) {
      console.error("❌ orderbook FAIL");

      orderBookBuffer.buffer.forEach(log);
      console.error("👉 orderbook LOG DONE");

      console.info("end in 3 seconds...");
      setTimeout(() => process.exit(), 3000);
    }

    orderBookBuffer.push(data);

    console.log(data);
  } else if (data.exName) {
    return;
    if (data.bid && data.ask && data.bid.price > data.ask.price) {
      console.error("❌ bid FAIL");
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
    console.log(data);
  }
});
