const { PAIRS } = require("../pairs");

const gate = {
  name: "gate",
  url: "https://data.gate.io",
  getOrderBook(pairIndex) {
    return `${this.url}/api2/1/orderBook/${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTC_USDT",
    [PAIRS.XRP_USDT]: "XRP_USDT",
    [PAIRS.EOS_BTC]: "EOS_BTC",
  },
  fees: {
    taker: 0.1, //0.05% if we'll use Bibox token
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids,
      asks: data.asks,
    }),
    order: ([price, volume]) => ({ price, volume }),
  },
};

module.exports = { gate };
