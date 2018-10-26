//with bibox onboard 10 requests performed by 60 secs insead of default 22-23 secs!
const { PAIRS } = require("../pairs");

const bibox = {
  name: "bibox",
  url: "https://api.bibox.com",
  getOrderBook(pairIndex) {
    return `${this.url}/v1/mdata?cmd=depth&size=10&pair=${
      this.pairs[pairIndex]
    }`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTC_USDT",
    [PAIRS.EOS_BTC]: "EOS_BTC",
  },
  fees: {
    taker: 0.1, //0.05% if we'll use Bibox token
  },
  mappers: {
    orderbook: data => ({
      bids: data.result.bids,
      asks: data.result.asks,
    }),
    order: data => ({ price: data.price, volume: data.volume }),
  },
};

module.exports = { bibox };
