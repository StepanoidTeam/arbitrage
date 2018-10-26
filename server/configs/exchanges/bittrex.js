const { PAIRS } = require("../pairs");

const bittrex = {
  name: "bittrex",
  url: "https://bittrex.com",
  getOrderBook(pairIndex) {
    return `${this.url}/api/v1.1/public/getorderbook?type=both&market=${
      this.pairs[pairIndex]
    }`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "USDT-BTC",
    [PAIRS.XRP_USDT]: "USDT-XRP",
    [PAIRS.RVN_BTC]: "BTC-RVN",
  },
  fees: {
    taker: 0.25,
  },
  mappers: {
    orderbook: data => ({
      bids: data.result.buy,
      asks: data.result.sell,
    }),
    order: data => ({ price: data.Rate, volume: data.Quantity }),
  },
};

module.exports = { bittrex };
