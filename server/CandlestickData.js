const fetch = require("node-fetch");

const { binance } = require("./configs/exchanges/binance");
const { saveDataToFile } = require("./file");

let symbol = "QKCBTC";
let interval = "1h";
let limit = "1000";

fetch(
  `https://binance.com/api/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
)
  .then(data => data.json())
  .then(data => JSON.stringify(data))
  .then(data => saveDataToFile("logs/CandlestickData.json", data));
