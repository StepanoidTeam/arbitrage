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
<<<<<<< HEAD
    [PAIRS.RVN_BTC]: "RVNBTC",

=======
>>>>>>> 1364b69b3b23b304acc9775bef80ec4178723f35
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
<<<<<<< HEAD
    [PAIRS.RVN_BTC]: "BTC-RVN",
=======
>>>>>>> 1364b69b3b23b304acc9775bef80ec4178723f35
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
    [PAIRS.BTC_USDT]: "BTCUSDT",
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

/*
//https://github.com/huobiapi/API_Docs_en/wiki/REST_Reference#get-marketdepth---market-depth
//https://api.huobi.pro/market/depth?symbol=btcusdt&type=step1
const huobi = {
  name: "huobi",
  url: "https://api.huobi.pro",
  query: "/market/depth?symbol=",
  pairs: {
    //usdt pairs
    [PAIRS.BTC_USDT]: "btcusdt",
    [PAIRS.BTC_USDT]: "eosusdt",
   },
  fees: {
    taker: 0.2
  },
  mappers: {
    orderbook: data => ({
    //  bids: data.bids.slice(0, LIMIT_ORDERS),
    //  asks: data.asks.slice(0, LIMIT_ORDERS)
    }),
    //order: data => ({ price: data.price, volume: data.amount })
  }
};


//https://www.okex.com/docs/en/#spot-data
//GET /api/spot/v3/instruments/<instrument-id>/book

https://www.okex.com/api/spot/v3/instruments/LTC-USDT/book?size=10
const okex = {
  name: "okex",
  url: "https://www.okex.com/api",
  query: "/api/spot/v3/instruments/",
  pairs: {
    [PAIRS.BTC_USDT]: "zzz",
    [PAIRS.XRP_USDT]: "zzz"
  },
  fees: {
    taker: 0.2
  },
  mappers: {
    orderbook: data => ({
    //  bids: data.bids.slice(0, LIMIT_ORDERS),
    //  asks: data.asks.slice(0, LIMIT_ORDERS)
    }),
    //order: data => ({ price: data.price, volume: data.amount })
  }
};


*/

module.exports = {
  exchanges: { binance, bittrex, bitfinex, hitbtc },
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
