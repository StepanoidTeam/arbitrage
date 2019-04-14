//todo: update prices here
const BTC_USDT = 5000;
const ETH_USDT = 165;

// TODO: fetch last avg prices from exchange

//await getAvgPrice(PAIRS.ETH_USDT).then(data => data.price);
//await getAvgPrice(PAIRS.BTC_USDT).then(data => data.price);

//todo: minimal limit in usd set here
const USDT = 0.0;

// minimal profit calculated to coins equivalent
const minProfit = {
  USDT,
  BTC: USDT / BTC_USDT,
  ETH: USDT / ETH_USDT,
};

function filterByProfit({ netProfit, mainCoin }) {
  return netProfit > minProfit[mainCoin];
}

module.exports = { filterByProfit };
