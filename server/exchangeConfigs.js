const LIMIT_ORDERS = 3;

const PAIRS = {
  BTC_USDT: "BTC_USDT",
  XRP_USDT: "XRP_USDT"
  //todo: add new global pair names here first!
  //names-values not important, just follow existing naming
  //then add new pair to all possible exchanges
};

const binance = {
  name: "binance",
  url: "https://api.binance.com",
  query: "/api/v1/depth?symbol=",
  pairs: {
    [PAIRS.BTC_USDT]: "BTCUSDT",
    [PAIRS.XRP_USDT]: "XRPUSDT"
  },
  fees: {
    taker: 0.1 //0.075 bnb
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids.slice(0, LIMIT_ORDERS),
      asks: data.asks.slice(0, LIMIT_ORDERS)
    }),
    order: data => ({ price: data[0], volume: data[1] })
  }
};

const bittrex = {
  name: "bittrex",
  url: "https://bittrex.com",
  query: "/api/v1.1/public/getorderbook?type=both&market=",
  pairs: {
    [PAIRS.BTC_USDT]: "USDT-BTC",
    [PAIRS.XRP_USDT]: "USDT-XRP"
  },
  fees: {
    taker: 0.25
  },
  mappers: {
    orderbook: data => ({
      bids: data.result.buy.slice(0, LIMIT_ORDERS),
      asks: data.result.sell.slice(0, LIMIT_ORDERS)
    }),
    order: data => ({ price: data.Rate, volume: data.Quantity })
  }
};

const bitfinex = {
  name: "bitfinex",
  url: "https://api.bitfinex.com",
  query: "/v1/book/",
  pairs: {
    [PAIRS.BTC_USDT]: "btcusd",
    [PAIRS.XRP_USDT]: "xrpusd"
  },
  fees: {
    taker: 0.2
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids.slice(0, LIMIT_ORDERS),
      asks: data.asks.slice(0, LIMIT_ORDERS)
    }),
    order: data => ({ price: data.price, volume: data.amount })
  }
};

module.exports = {
  exchanges: { binance, bittrex, bitfinex },
  PAIRS
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
