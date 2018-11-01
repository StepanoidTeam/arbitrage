const WebSocket = require("ws");

const endpoint = "wss://stream.binance.com:9443";

const getStreamUrl = streamName => `${endpoint}/ws/${streamName}`;

const symbol = "BTCUSDT";
const depth = 5; //10

let tradeStreamName = symbol => `${symbol.toLowerCase()}@depth${depth}`;

//let wsUrl =`${endpoint}/ws/${tradeStreamName}`;

let wsStreams = [symbol].map(tradeStreamName); //, "eosbtc", "zrxeth"

let wsUrl = `${endpoint}/stream?streams=${wsStreams.join("/")}`;

const ws = new WebSocket(wsUrl);
ws.on("open", () => {
  console.log("opened");
});

ws.on("message", data => {
  let { data: orderbook } = JSON.parse(data);
  //   console.log(orderbook);
  //   return;
  console.clear();
  console.log({
    bids: orderbook.bids.map(([a, b]) => [+a, +b]),
    asks: orderbook.asks.map(([a, b]) => [+a, +b]),
  });
});
