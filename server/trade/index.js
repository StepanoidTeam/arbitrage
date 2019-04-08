const tradeConfig = {
  binance: {
    USDT: {
      balance: 10,
      minProfitPt: 0.5, //%
      lowBalance: 600, //$
      lowBalanceMinProfit: 0.2, //%
    },
    BTC: {
      balance: 10,
      minProfitPt: 0.5, //%
      lowBalance: 0.15, //btc
    },
  },
  gate: {},
};

/**
 * после каждой произведенной сделки
 * сравниваем баланс монеты на бирже
 * (переменная balanceAmount) с lowBalanceXXX.
 * Если баланс на бирже ниже $600, //?
 * то меняем minProfitPt до 0.2%
 * или вообще до 0.001% каких-нибудь
 * до 0% короч
 */

const binance = require("./binance");
const gate = require("./gate");
const hitbtc = require("./hitbtc");

binance.getBalances().then(coins => console.log("binance", coins));
gate.getBalances().then(coins => console.log("gate", coins));
hitbtc.getBalances().then(coins => console.log("hitbtc", coins));
