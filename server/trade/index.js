const binance = require("./binance");
const gate = require("./gate");
const hitbtc = require("./hitbtc");

//binance.getBalances().then(d => console.log(d));
hitbtc.getBalances().then(d => console.log(d));
