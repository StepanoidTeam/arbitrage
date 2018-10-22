const LIMIT_ORDERS = 3;

const PAIRS = {
  BTC_USDT: "BTC_USDT",
  ETH_USDT: "ETH_USDT",
  XRP_USDT: "XRP_USDT",
  EOS_USDT: "EOS_USDT",
  LTC_USDT: "LTC_USDT",
  ADA_USDT: "ADA_USDT",
  ZIL_BTC: "ZIL_BTC",
  RVN_BTC: "RVN/BTC",
  EOS_BTC: "EOS_BTC",


  //todo: add new global pair names here first!
  //names-values not important, just follow existing naming
  //then add new pair to all possible exchanges
};

const binance = {
  name: "binance",
  url: "https://api.binance.com",
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
      bids: data.bids.slice(0, LIMIT_ORDERS),
      asks: data.asks.slice(0, LIMIT_ORDERS),
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

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
      bids: data.result.buy.slice(0, LIMIT_ORDERS),
      asks: data.result.sell.slice(0, LIMIT_ORDERS),
    }),
    order: data => ({ price: data.Rate, volume: data.Quantity }),
  },
};

const bitfinex = {
  name: "bitfinex",
  url: "https://api.bitfinex.com",
  getOrderBook(pairIndex) {
    return `${this.url}/v1/book/${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "btcusd",
    [PAIRS.XRP_USDT]: "xrpusd",
  },
  fees: {
    taker: 0.2,
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids.slice(0, LIMIT_ORDERS),
      asks: data.asks.slice(0, LIMIT_ORDERS),
    }),
    order: data => ({ price: data.price, volume: data.amount }),
  },
};

const hitbtc = {
  name: "hitbtc",
  url: "https://api.hitbtc.com",
  getOrderBook(pairIndex) {
    return `${this.url}/api/2/public/orderbook/${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTCUSD", //weird thing, but seems USD=USDT on hitBTC, like bitfinex
    [PAIRS.XRP_USDT]: "XRPUSDT",
  },
  fees: {
    taker: 0.1,
  },
  mappers: {
    orderbook: data => ({
      bids: data.bid.slice(0, LIMIT_ORDERS),
      asks: data.ask.slice(0, LIMIT_ORDERS),
    }),
    order: data => ({ price: data.price, volume: data.size }),
  },
};


//https://www.okex.com/docs/en/#spot-data
//GET /api/spot/v3/instruments/<instrument-id>/book


//https://www.okex.com/api/spot/v3/instruments/LTC-USDT/book?size=10
const okex = {
  name: "okex",
  url: "https://www.okex.com/api",
  getOrderBook(pairIndex) {
    return `${this.url}/spot/v3/instruments/${this.pairs[pairIndex]}/book?size=10`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "BTC-USDT",
    [PAIRS.XRP_USDT]: "XRP-USDT",
  },
  fees: {
    taker: 0.15
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids.slice(0, LIMIT_ORDERS),
      asks: data.asks.slice(0, LIMIT_ORDERS),
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

//https://github.com/huobiapi/API_Docs_en/wiki/REST_Reference#get-marketdepth---market-depth
const huobi = {
  name: "huobi",
  url: "https://api.huobi.pro",
  getOrderBook(pairIndex) {
    return `${this.url}/market/depth?type=step1&symbol=${this.pairs[pairIndex]}`;
  },
  pairs: {
    //usdt pairs
    [PAIRS.BTC_USDT]: "btcusdt",
    [PAIRS.XRP_USDT]: "xrpusdt",
    [PAIRS.EOS_BTC]: "eosbtc",
   },
  fees: {
    taker: 0.2
  },
  mappers: {
    orderbook: data => ({
      bids: data.tick.bids.slice(0, LIMIT_ORDERS),
      asks: data.tick.asks.slice(0, LIMIT_ORDERS),
    }),
    order: data => ({ price: data[0], volume: data[1] }),

  },
};


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
      bids: data.data.BUY.slice(0, LIMIT_ORDERS),
      asks: data.data.SELL.slice(0, LIMIT_ORDERS),
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};




module.exports = {
  exchanges: {huobi, kucoin},
  PAIRS,
};

//todo: pairs to add
// BTC-USDT
// BTC-ETH
// ETH-USDT
// BTC-EOS
// ETH-EOS
// EOS-USDT

// FEES:
// -Bittrex - 0.25% / trade

// -Bitfinex
// 0.1% - Maker Fees/0.2% - Taker Fees

// -Binance
// 0.1000% - Maker/0.1000% - Taker (0.075/0.075, если юзается BNB)

// -Poloniex
// 0.1% - Maker Fees/0.2% - Taker Fees

// -OKex
// 0.1% - Maker Fees/0.15% - Taker Fees

// -Huobi
// 0.2% - Maker Fees/0.2% - Taker Fees

// -HitBTC
// +0.01% - Maker Fees/0.1% - Taker Fees

// -BitForex
// 0% - Maker Fees/0.05% - Taker Fees

// -Kucoin
// 0.1000% - Maker/0.1000% - Taker
