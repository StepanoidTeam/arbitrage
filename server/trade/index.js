const binance = require("./binance");
const gate = require("./gate");
const hitbtc = require("./hitbtc");

binance.getBalances().then(coins => console.log("binance", coins));
gate.getBalances().then(coins => console.log("gate", coins));
hitbtc.getBalances().then(coins => console.log("hitbtc", coins));
