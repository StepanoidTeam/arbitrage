const { PAIRS } = require("../pairs");

const binance = {
  name: "binance",
  url: "https://api.binance.com",
  apiKey: "qls1H8lMhIyCzzmItJPRlUGZJz58eHZcOKds9grow0iWEOj8PP7C2CoWO5cJqScB",
  getOrderBook(pairIndex) {
    return `${this.url}/api/v1/depth?symbol=${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTCUSDT",
    [PAIRS.XRP_USDT]: "XRPUSDT",
    [PAIRS.RVN_BTC]: "RVNBTC",
  },
  fees: {
    taker: 0.1, //0.075 bnb
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids,
      asks: data.asks,
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

module.exports = { binance };
