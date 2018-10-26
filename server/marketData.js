const fetch = require("node-fetch");

const { apiKey } = require("./api-key");

let symbol = "BNBBTC";

fetch(`https://binance.com/api/v1/historicalTrades?symbol=${symbol}`, {
  headers: {
    "X-MBX-APIKEY": apiKey,
  },
})
  .then(data => data.json())
  .then(data => console.log(data));
