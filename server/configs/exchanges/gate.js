const { PAIRS } = require("../pairs");

const gate = {
  name: "gate",
  url: "https://data.gate.io",
  getOrderBook(pairIndex) {
    return `${this.url}/api2/1/orderBook/${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "btc_usdt",
    [PAIRS.EOS_BTC]: "eos_btc",
  },
  fees: {
    taker: 0.1, //0.05% if we'll use Bibox token
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids,
      asks: data.asks,
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

module.exports = { gate };
