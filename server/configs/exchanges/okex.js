const { PAIRS } = require("../pairs");

//https://www.okex.com/docs/en/#spot-data
//GET /api/spot/v3/instruments/<instrument-id>/book

//https://www.okex.com/api/spot/v3/instruments/LTC-USDT/book?size=10
const okex = {
  name: "okex",
  url: "https://www.okex.com/api",
  getOrderBook(pairIndex) {
    return `${this.url}/spot/v3/instruments/${
      this.pairs[pairIndex]
    }/book?size=10`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTC-USDT",
    [PAIRS.XRP_USDT]: "XRP-USDT",
  },
  fees: {
    taker: 0.15,
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids,
      asks: data.asks,
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

module.exports = { okex };
