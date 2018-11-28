const { PAIRS } = require("../pairs");

// bug: bid greater than ask!!!

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
    [PAIRS.ETH_USDT]: "USDT-ETH",
    [PAIRS.ETC_USDT]: "USDT-ETC",
    [PAIRS.XRP_BTC]: "BTC-XRP",
    [PAIRS.ETH_BTC]: "BTC-ETH",
    [PAIRS.NEO_USDT]: "USDT-NEO",
    [PAIRS.LTC_USDT]: "USDT-LTC",
    [PAIRS.XMR_BTC]: "BTC-XMR",
    [PAIRS.ETC_BTC]: "BTC-ETC",
    [PAIRS.LTC_BTC]: "BTC-LTC",
    [PAIRS.NEO_BTC]: "BTC-NEO",
    [PAIRS.TRX_USDT]: "USDT-TRX",
    [PAIRS.ZEC_BTC]: "BTC-ZEC",
    [PAIRS.DASH_BTC]: "BTC-DASH",
    [PAIRS.QTUM_BTC]: "BTC-QTUM",
    [PAIRS.NEO_ETH]: "ETH-NEO",
    [PAIRS.XLM_BTC]: "BTC-XLM",
    [PAIRS.TRX_BTC]: "BTC-TRX",
    [PAIRS.QTUM_ETH]: "ETH-QTUM",
    [PAIRS.TRX_ETH]: "ETH-TRX",
    [PAIRS.XVG_BTC]: "BTC-XVG",
    [PAIRS.XLM_ETH]: "ETH-XLM",
    [PAIRS.ZRX_ETH]: "ETH-ZRX",
    [PAIRS.OMG_BTC]: "BTC-OMG",
    [PAIRS.BAT_BTC]: "BTC-BAT",
    [PAIRS.ZRX_BTC]: "BTC-ZRX",
    [PAIRS.BAT_ETH]: "ETH-BAT",
    [PAIRS.REP_ETH]: "ETH-REP",
    [PAIRS.OMG_ETH]: "ETH-OMG",
    [PAIRS.RLC_ETH]: "ETH-RLC",
    [PAIRS.SNT_ETH]: "ETH-SNT",
    [PAIRS.GNT_BTC]: "BTC-GNT",
    [PAIRS.RLC_BTC]: "BTC-RLC",
    [PAIRS.REP_BTC]: "BTC-REP",
    [PAIRS.GNT_ETH]: "ETH-GNT",
    [PAIRS.SNT_BTC]: "BTC-SNT",
    [PAIRS.LRC_BTC]: "BTC-LRC",
    [PAIRS.BNT_BTC]: "BTC-BNT",
    [PAIRS.RCN_BTC]: "BTC-RCN",
    [PAIRS.BNT_ETH]: "ETH-BNT",
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
