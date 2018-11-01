const { bibox } = require("./bibox");
const { binance } = require("./binance");
const { bitfinex } = require("./bitfinex");
const { bittrex } = require("./bittrex");
const { gate } = require("./gate");
const { hitbtc } = require("./hitbtc");
const { huobi } = require("./huobi");
const { kucoin } = require("./kucoin");
const { okex } = require("./okex");

module.exports = {
  bibox,
  binance,
  bitfinex,
  bittrex,
  gate,
  hitbtc,
  huobi,
  kucoin,
  okex,
};

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

// -Kucoin
// 0.1000% - Maker/0.1000% - Taker

// -Bibox
// 0.1% Trading Fee will be deducted from your balance. If you pay using BIX, you may enjoy a 50% discount on the trading fee.

// -Gate.io
// 0.2% on default, but some pairs have 0 comission - https://www.gate.io/fee
