const logUpdate = require("log-update");
const { dbLogger } = require("../helpers/dbLogger");
const { selectFromList } = require("./selectFromList");

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

const { checkBrokenBook } = require("./checkBrokenBook");

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

let bookCount = 0;
/**
 * set PAIR to test here (only 1 for now ⚠️)
 */

(async () => {
  // const pair = await selectFromList(
  //   Object.entries(PAIRS)
  //   .map(([key]) => key)
  // );

  const limitAfterFirstFail = 1000;
  let brokenHappened = true;
  let afterFailOrders = 0;

  const pair = PAIRS.NEO_BTC;
  const pairs = [PAIRS[pair]];

  const orderBookBuffer = createBuffer(1000);
  const log = dbLogger(
    `orderbook-test.${wsToTest.exConfig.name}.${pair}.${Date.now()}`
  );

  wsToTest(pairs).subscribe(data => {
    if (data.type === "orderbook") {
      //todo: do all
      //data.exName, data.pair, data.bids, data.asks.price, volume;

      orderBookBuffer.push(data);

      console.clear();

      if (checkBrokenBook(data)) {
        brokenHappened = true;
      }

      if (brokenHappened) {
        afterFailOrders++;
      }

      console.log(
        `book updates: ${++bookCount}`,
        `❌  FAILs: ${afterFailOrders}`
      );

      if (afterFailOrders >= limitAfterFirstFail) {
        orderBookBuffer.buffer.forEach(log);
        console.error("👉 orderbook LOG DONE");

        process.exit();
      }
    }
  });
})();
