const LIMIT_ORDERS = 5;

const binance = {
  name: "binance",
  url: "https://api.binance.com",
  query: "/api/v1/depth?symbol=",
  pairs: ["BTCUSDT"],
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
  pairs: ["USDT-BTC"],
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
  pairs: ["btcusd"],
  mappers: {
    orderbook: data => ({
      bids: data.bids.slice(0, LIMIT_ORDERS),
      asks: data.asks.slice(0, LIMIT_ORDERS)
    }),
    order: data => ({ price: data.price, volume: data.amount })
  }
};

module.exports = {
  binance,
  bittrex,
  bitfinex
};
