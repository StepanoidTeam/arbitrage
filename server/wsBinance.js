const WebSocket = require("ws");

const endpoint = "wss://stream.binance.com:9443";

const getStreamUrl = streamName => `${endpoint}/ws/${streamName}`;

const symbol = "btcusdt";
const depth = 5; //10

let tradeStreamName = `${symbol}@depth${depth}`;

const ws = new WebSocket(getStreamUrl(tradeStreamName));
ws.on("open", () => {
  console.log("opened");
});

ws.on("message", data => {
  let orderbook = JSON.parse(data);
  console.clear();
  console.log({
    bids: orderbook.bids.map(([a, b]) => [+a, +b]),
    asks: orderbook.asks.map(([a, b]) => [+a, +b]),
  });
});
