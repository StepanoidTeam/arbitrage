const { PAIRS } = require("../globalPairs");

const hitbtc = {
  name: "hitbtc",
  url: "https://api.hitbtc.com",
  getOrderBook(pairIndex) {
    return `${this.url}/api/2/public/orderbook/${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTCUSD", //weird thing, but seems USD=USDT on hitBTC, like bitfinex
    [PAIRS.XRP_USDT]: "XRPUSDT",
  },
  fees: {
    taker: 0.1,
  },
  mappers: {
    orderbook: data => ({
      bids: data.bid,
      asks: data.ask,
    }),
    order: data => ({ price: data.price, volume: data.size }),
  },
};

module.exports = { hitbtc };
