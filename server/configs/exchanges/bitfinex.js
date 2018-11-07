const { PAIRS } = require("../pairs");

const bitfinex = {
  name: "bitfinex",
  url: "https://api.bitfinex.com",
  getOrderBook(pairIndex) {
    return `${this.url}/v1/book/${this.pairs[pairIndex]}`;
  },
  pairs: {
    //uppercased for ws!
    [PAIRS.BTC_USD]: "BTCUSD",
    [PAIRS.XRP_USD]: "XRPUSD",
    [PAIRS.ETH_USD]: "ETHUSD",
    [PAIRS.ETC_USD]: "ETCUSD",
    [PAIRS.XRP_BTC]: "XRPBTC",
    [PAIRS.ETH_BTC]: "ETHBTC",
    [PAIRS.NEO_USD]: "NEOUSD",
    [PAIRS.LTC_USD]: "LTCUSD",
    [PAIRS.XMR_BTC]: "XMRBTC",
    [PAIRS.ETC_BTC]: "ETCBTC",
    [PAIRS.LTC_BTC]: "LTCBTC",
    [PAIRS.NEO_BTC]: "NEOBTC",
    [PAIRS.TRX_USD]: "TRXUSD",
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
