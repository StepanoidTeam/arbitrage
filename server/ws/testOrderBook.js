const logUpdate = require("log-update");
const { dbLogger } = require("../helpers/dbLogger");
const { selectFromList } = require("./selectFromList");

// const { getSourceForPairs: wsBinance } = require("./wsBinance");
// const { getSourceForPairs: wsBitfinex } = require("./wsBitfinex");
const { getSourceForPairs: wsBittrex } = require("./wsBittrex"); //buggy
// const { getSourceForPairs: wsHuobi } = require("./wsHuobi");
// const { getSourceForPairs: wsKucoin } = require("./wsKucoin"); //in progress
// const { getSourceForPairs: wsOkex } = require("./wsOkex");
// const { getSourceForPairs: wsGate } = require("./wsGate");
// const { getSourceForPairs: wsHitbtc } = require("./wsHitbtc");
// const { getSourceForPairs: wsBibox } = require("./wsBibox");

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

/**
 * set PAIR to test here (only 1 for now ⚠️)
 */

(async () => {
  const stats = {
    errors: [],
    warns: 0,
    otsylkas: [],
  };

  const pair = PAIRS.BTC_USDT;
  const pairs = [PAIRS[pair]];

  const orderBookBuffer = createBuffer(Infinity);
  const log = dbLogger(
    `orderbook-test.${wsToTest.exConfig.name}.${pair}.${Date.now()}`
  );

  wsToTest(pairs).subscribe(data => {
    //console.log(data.type);
    if (data.type === "warn") {
      stats.warns++;
    }
    if (data.type === "error") {
      stats.errors.unshift(data);
    }
    if (data.type === "otsylka") {
      stats.otsylkas.unshift(data);
    }

    if (data.type === "orderbook") {
      //todo: do all
      //data.exName, data.pair, data.bids, data.asks.price, volume;

      orderBookBuffer.push(data);

      console.clear();

      //TODO: save on exit?

      if (orderBookBuffer.buffer.length > 1000) {
        orderBookBuffer.buffer.forEach(log);
        console.error("👉 orderbook LOG DONE");

        process.exit();
      }
    }

    console.log(
      `book updates: ${orderBookBuffer.buffer.length}`,
      `⚠  warns: ${stats.warns}`,
      `⛔  errors: ${stats.errors.length}`,
      `➡  otsylkas: ${stats.otsylkas.length}`,
      stats.otsylkas.slice(0, 5),
      stats.errors.slice(0, 5)
    );
  });
})();
