const express = require("express");
const fetch = require("node-fetch");

const { binance, bittrex, bitfinex } = require("./exchangeConfigs");
const { scheduler } = require("./scheduler");
const { appendJSONToFile } = require("./file");

function getPairData({ url, query, pairs, mappers, name }, pairIndex = 0) {
  let requestUrl = `${url}${query}${pairs[pairIndex]}`;

  return fetch(requestUrl)
    .then(data => data.json())
    .then(mappers.orderbook)
    .then(({ bids, asks }) => {
      return {
        bids: bids.map(mappers.order),
        asks: asks.map(mappers.order),
        name,
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
  return Promise.all(
    [binance, bittrex, bitfinex].map(ex => getPairData(ex, 1))
  );
}

function produceExchangeTF(exchangeData) {
  let exTF = {
    ask: exchangeData.asks[0],
    bid: exchangeData.bids[0],
    timestamp: exchangeData.timestamp,
    exName: exchangeData.name
  };

  return exTF;
}

const apiCooldown = 2 * 1000;
async function runUpdate() {
  for await (let exRespArr of scheduler(getAllExData, apiCooldown)) {
    let timeframe = exRespArr.map(produceExchangeTF);

    appendJSONToFile("./logs/timeframe.js", timeframe);
  }
}

/* BEWARE!!!! grabber runs here! */
runUpdate(); //uncomment this and it will collect ALL THE DATA
