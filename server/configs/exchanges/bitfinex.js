const { PAIRS } = require("../pairs");

const bitfinex = {
  name: "bitfinex",
  url: "https://api.bitfinex.com",
  getOrderBook(pairIndex) {
    return `${this.url}/v1/book/${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTCUSD", //uppercased for ws!
    [PAIRS.XRP_USDT]: "XRPUSD",
  },
  fees: {
    taker: 0.2,
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids,
      asks: data.asks,
    }),
    order: data => ({ price: data.price, volume: data.amount }),
  },
};

module.exports = { bitfinex };
