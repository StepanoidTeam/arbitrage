const activeCoins = ["BTC", "USDT", "ETH", "EOS"];
const activeExchanges = ["binance", "gate", "hitbtc"];

const minProfitPtNormal = 1; // %
const minProfitPtLow = 0.1; // %
const lowBalanceUSD = 100; // $

//todo: rename in normal way
const basicState = activeExchanges.reduce((state, exName) => {
  state[exName] = {
    ...activeCoins.reduce((set, coin) => {
      set[coin] = 0;
      return set;
    }, {}),
  };
  return state;
}, {});

module.exports = {
  activeCoins,
  activeExchanges,
  minProfitPtNormal,
  minProfitPtLow,
  lowBalanceUSD,
  basicState,
};
