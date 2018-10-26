const fetch = require("node-fetch");

const { binance } = require("./configs/exchanges/binance");

let symbol = "BNBBTC";

fetch(`https://binance.com/api/v1/historicalTrades?symbol=${symbol}`, {
  headers: {
    "X-MBX-APIKEY": binance.apiKey,
  },
})
  .then(data => data.json())
  .then(data => console.log(data));
