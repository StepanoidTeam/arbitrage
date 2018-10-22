const express = require("express");
const fetch = require("node-fetch");

const { exchanges, PAIRS } = require("./exchangeConfigs");
const { scheduler } = require("./scheduler");
const { appendJSONToFile } = require("./file");

function getPairData(exchange, pairIndex = PAIRS.BTC_USDT) {
  let { mappers, name } = exchange;

  let requestUrl = exchange.getOrderBook(pairIndex);

  return fetch(requestUrl)
    .then(data => data.json())
    .then(mappers.orderbook)
    .then(({ bids, asks }) => {
      return {
        bids: bids.map(mappers.order),
        asks: asks.map(mappers.order),
        name,
        timestamp: Date.now(),
      };
    });
}

const port = process.env.PORT || 3000;

const app = express();
//serve client files
app.use(express.static("./client"));
//binance
app.get("/api/binance", async (req, res) => {
  //const { hash, cache } = req.query;
  //console.log("[server] orders requested: ", req.query);
  res.send(await getPairData(exchanges.binance));
});
//bittrex
app.get("/api/bittrex", async (req, res) => {
  res.send(await getPairData(exchanges.bittrex));
});
//bitfinex
app.get("/api/bitfinex", async (req, res) => {
  res.send(await getPairData(exchanges.bitfinex));
});
//all
app.get("/api/all", async (req, res) => {
  res.send(await getAllExData());
});

//start server
app.listen(port, () => {
  console.log("[server] started");
});

function getAllExData(pair) {
  return Promise.all(Object.values(exchanges).map(ex => getPairData(ex, pair)));
}

function produceExchangeTF(exchangeData) {
  let exTF = {
    ask: exchangeData.asks[0],
    bid: exchangeData.bids[0],
    timestamp: exchangeData.timestamp,
    exName: exchangeData.name,
  };

  return exTF;
}

const apiCooldown = 2 * 1000;
async function runUpdate(pair) {
  const timeStarted = Date.now();

  const logFilePath = `./logs/tf-${pair}-${timeStarted}.log`;

  for await (let exRespArr of scheduler(
    () => getAllExData(pair),
    apiCooldown
  )) {
    let timeframe = exRespArr.map(produceExchangeTF);

    appendJSONToFile(logFilePath, timeframe);
  }
}

/* BEWARE!!!! grabber runs here! */
runUpdate(PAIRS.EOS_BTC); //uncomment this and it will collect ALL THE DATA
