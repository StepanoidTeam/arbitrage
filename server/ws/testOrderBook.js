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

  const logRecordLimit = 300;
  const limitAfterFirstFail = 300;
  let brokenHappened = true;
  let afterFailOrders = 0;
  const stats = {
    errors: 0,
    warns: 0,
  };

  const pair = PAIRS.BTC_USDT;
  const pairs = [PAIRS[pair]];

  const orderBookBuffer = createBuffer(logRecordLimit);
  const log = dbLogger(
    `orderbook-test.${wsToTest.exConfig.name}.${pair}.${Date.now()}`
  );

  wsToTest(pairs).subscribe(data => {
    //console.log(data.type);
    if (data.type === "warn") {
      stats.warns++;
    }
    if (data.type === "error") {
      stats.errors++;
    }

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

      if (afterFailOrders >= limitAfterFirstFail) {
        orderBookBuffer.buffer.forEach(log);
        console.error("👉 orderbook LOG DONE");

        process.exit();
      }
    }

    console.log(
      `book updates: ${++bookCount}`,
      //`❌  FAILs: ${afterFailOrders}`,
      `⛔  errors: ${stats.errors}`,
      `⚠  warns: ${stats.warns}`
    );
  });
})();
