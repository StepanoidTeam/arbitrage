const { PAIRS } = require("../pairs");

const kucoin = {
  name: "kucoin",
  url: "https://api.kucoin.com",
  getOrderBook(pairIndex) {
    return `${this.url}/v1/${this.pairs[pairIndex]}/open/orders/`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTC-USDT",
    [PAIRS.EOS_BTC]: "EOS-BTC",
  },
  fees: {
    taker: 0.1,
  },
  mappers: {
    orderbook: data => ({
      bids: data.data.BUY,
      asks: data.data.SELL,
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

module.exports = { kucoin };
