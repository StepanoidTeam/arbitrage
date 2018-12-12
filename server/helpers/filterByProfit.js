//todo: update prices here
const BTCUSDT = 3400;
const ETHUSDT = 90;
//todo: minimal limit in usd set here
const USDT = 0.05;

// minimal profit calculated to coins equivalent
const minProfit = {
  USDT,
  BTC: USDT / BTCUSDT,
  ETH: USDT / ETHUSDT,
};

function filterByProfit({ netProfit, mainCoin }) {
  return netProfit > minProfit[mainCoin];
}

module.exports = { filterByProfit };
