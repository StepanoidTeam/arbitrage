const express = require("express");
const fetch = require("node-fetch");

const { binance, bittrex, bitfinex } = require("./exchangeConfigs");
const { scheduler } = require("./scheduler");
const { appendDataToFile } = require("./file");

function getPairData({ url, query, pairs, mappers }, pairIndex = 0) {
  let requestUrl = `${url}${query}${pairs[pairIndex]}`;

  return fetch(requestUrl)
    .then(data => data.json())
    .then(mappers.orderbook)
    .then(({ bids, asks }) => {
      return {
        bids: bids.map(mappers.order),
        asks: asks.map(mappers.order),
        timestamp: Date.now()
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
  res.send(await getPairData(binance));
});
//bittrex
app.get("/api/bittrex", async (req, res) => {
  res.send(await getPairData(bittrex));
});
//bitfinex
app.get("/api/bitfinex", async (req, res) => {
  res.send(await getPairData(bitfinex));
});
//all
app.get("/api/all", async (req, res) => {
  res.send(await getAllExData());
});

//start server
app.listen(port, () => {
  console.log("[server] started");
});

function getAllExData() {
  return Promise.all([
    getPairData(binance),
    getPairData(bittrex),
    getPairData(bitfinex)
  ]);
}

const prep = data => {
  let rawData = JSON.stringify(data);
  return `let x${data.timestamp}=${rawData}\n`;
};
const apiCooldown = 2 * 1000;
async function runUpdate() {
  for await (let [binance, bittrex, bitfinex] of scheduler(
    getAllExData,
    apiCooldown
  )) {
    appendDataToFile("./logs/binance.js", prep(binance));
    appendDataToFile("./logs/bittrex.js", prep(bittrex));
    appendDataToFile("./logs/bitfinex.js", prep(bitfinex));
  }
}

/* BEWARE!!!! grabber runs here! */
//runUpdate(); //uncomment this and it will collect ALL THE DATA

//todo: pairs to add
// BTC-USDT
// BTC-ETH
// ETH-USDT
// BTC-EOS
// ETH-EOS
// EOS-USDT

// FEES:
// -Bittrex - 0.25% / trade

// -Bitfinex
// 0.1% - Maker Fees/0.2% - Taker Fees

// -Binance
// 0.1000% - Maker/0.1000% - Taker (0.075/0.075, если юзается BNB)

// -Poloniex
// 0.1% - Maker Fees/0.2% - Taker Fees

// -OKex
// 0.1% - Maker Fees/0.15% - Taker Fees

// -Huobi
// 0.2% - Maker Fees/0.2% - Taker Fees

// -HitBTC
// +0.01% - Maker Fees/0.1% - Taker Fees

// -BitForex
// 0% - Maker Fees/0.05% - Taker Fees
