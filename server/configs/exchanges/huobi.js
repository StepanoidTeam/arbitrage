const { PAIRS } = require("../pairs");

//https://github.com/huobiapi/API_Docs_en/wiki/REST_Reference#get-marketdepth---market-depth
const huobi = {
  name: "huobi",
  url: "https://api.huobi.pro",
  getOrderBook(pairIndex) {
    return `${this.url}/market/depth?type=step1&symbol=${
      this.pairs[pairIndex]
    }`;
  },
  pairs: {
    //usdt pairs
    [PAIRS.BTC_USDT]: "btcusdt",
    [PAIRS.XRP_USDT]: "xrpusdt",
    [PAIRS.EOS_BTC]: "eosbtc",
    [PAIRS.ZIL_BTC]: "zilbtc",
  },
  fees: {
    taker: 0.2,
  },
  mappers: {
    orderbook: data => ({
      bids: data.tick.bids,
      asks: data.tick.asks,
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

module.exports = { huobi };
