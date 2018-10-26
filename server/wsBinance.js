const WebSocket = require("ws");

const endpoint = "wss://stream.binance.com:9443";

const getStreamUrl = streamName => `${endpoint}/ws/${streamName}`;

let symbol = "bnbbtc";

let tradeStreamName = `${symbol}@depth`;

const ws = new WebSocket(getStreamUrl(tradeStreamName));

ws.on("open", function open() {
  console.log("opened");
  //ws.send("connection open");
});

ws.on("message", function(data) {
  console.log(data);
});
