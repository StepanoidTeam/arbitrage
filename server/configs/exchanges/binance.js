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
    [PAIRS.ETH_USDT]: "ETHUSDT",
    [PAIRS.ETC_USDT]: "ETCUSDT",
    [PAIRS.XRP_BTC]: "XRPBTC",
    [PAIRS.ETH_BTC]: "ETHBTC",
    [PAIRS.NEO_USDT]: "NEOUSDT",
    [PAIRS.LTC_USDT]: "LTCUSDT",
    [PAIRS.XMR_BTC]: "XMRBTC",
    [PAIRS.ETC_BTC]: "ETCBTC",
    [PAIRS.LTC_BTC]: "LTCBTC",
    [PAIRS.NEO_BTC]: "NEOBTC",
    [PAIRS.TRX_USDT]: "TRXUSDT",
    [PAIRS.ZEC_BTC]: "ZECBTC",
    [PAIRS.DASH_BTC]: "DASHBTC",
    [PAIRS.QTUM_BTC]: "QTUMBTC",
    [PAIRS.NEO_ETH]: "NEOETH",
    [PAIRS.XLM_BTC]: "XLMBTC",
    [PAIRS.TRX_BTC]: "TRXBTC",
    [PAIRS.QTUM_ETH]: "QTUMETH",
    [PAIRS.TRX_ETH]: "TRXETH",
    [PAIRS.XVG_BTC]: "XVGBTC",
    [PAIRS.XLM_ETH]: "XLMETH",
    [PAIRS.ZRX_ETH]: "ZRXETH",
    [PAIRS.OMG_BTC]: "OMGBTC",
    [PAIRS.BAT_BTC]: "BATBTC",
    [PAIRS.ZRX_BTC]: "ZRXBTC",
    [PAIRS.BAT_ETH]: "BATETH",
    [PAIRS.REP_ETH]: "REPETH",
    [PAIRS.OMG_ETH]: "OMGETH",
    [PAIRS.RLC_ETH]: "RLCETH",
    [PAIRS.SNT_ETH]: "SNTETH",
    [PAIRS.GNT_BTC]: "GNTBTC",
    [PAIRS.RLC_BTC]: "RLCBTC",
    [PAIRS.REP_BTC]: "REPBTC",
    [PAIRS.GNT_ETH]: "GNTETH",
    [PAIRS.SNT_BTC]: "SNTBTC",
    [PAIRS.LRC_BTC]: "LRCBTC",
    [PAIRS.BNT_BTC]: "BNTBTC",
    [PAIRS.RCN_BTC]: "RCNBTC",
    [PAIRS.BNT_ETH]: "BNTETH",
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
