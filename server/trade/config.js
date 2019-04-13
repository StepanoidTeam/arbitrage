/** coins to trade */
const activeCoins = ["BTC", "USDT", "ETH", "EOS"]; // TODO: use named constants instead
/** exchanges to trade on */
const activeExchanges = ["binance", "gate", "hitbtc"]; // TODO: set names from ex config

/**
 * min profits
 * set in USDT
 * IF Deal netProfit >= minProfitNormalUSDT
 * THEN Deal will be executed by trading bot
 */
const minProfitNormalUSDT = 0.05; // $
/**
 * IF Deal coin balance is low
 * AND Deal netProfit >= minProfitLowUSDT
 * THEN Deal will be executed by trading bot
 */
const minProfitLowUSDT = 0; // $
/**
 * IF Deal coin balance <= lowBalanceLimitUSDT
 * THEN activate 'minProfitLowUSDT' rule protocol
 */
const lowBalanceLimitUSDT = 100; // $

module.exports = {
  activeCoins,
  activeExchanges,
  minProfitNormalUSDT,
  minProfitLowUSDT,
  lowBalanceLimitUSDT,
};
