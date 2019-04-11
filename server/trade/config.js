/** coins to trade */
const activeCoins = ["BTC", "USDT", "ETH", "EOS"]; // TODO: use named constants instead
/** exchanges to trade on */
const activeExchanges = ["binance", "gate", "hitbtc"]; // TODO: set names from ex config

/**
 * min profits
 * set in pt(%)
 * if Deal net profit pt >= minProfitPtNormal
 * then Deal will be executed by trading bot
 */
const minProfitPtNormal = 1; // %
/**
 * if Deal coin balance is low
 * and Deal net profit pt >= minProfitPtLow
 * then Deal will be executed by trading bot
 */
const minProfitPtLow = 0.1; // %
/**
 * if Deal coin balance <= lowBalanceUSD
 * then activate 'minProfitPtLow' rule protocol
 */
const lowBalanceUSD = 100; // $

module.exports = {
  activeCoins,
  activeExchanges,
  minProfitPtNormal,
  minProfitPtLow,
  lowBalanceUSD,
};
