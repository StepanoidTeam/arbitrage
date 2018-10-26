const fetch = require("node-fetch");

const { binance } = require("./configs/exchanges/binance");
const { saveDataToFile } = require("./file");

let symbol = "BNBBTC";
let fromID = "fromId=";

fetch(
  `https://binance.com/api/v1/historicalTrades?symbol=${symbol}&limit=1000`,
  {
    headers: {
      "X-MBX-APIKEY": binance.apiKey,
    },
  }
)
  .then(data => data.json())
  .then(data => JSON.stringify(data))
  .then(data => saveDataToFile("logs/historicalTrades.json", data));
