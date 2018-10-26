const WebSocket = require("ws");

const endpoint = "wss://stream.binance.com:9443";

const getStreamUrl = streamName => `${endpoint}/ws/${streamName}`;

let symbol = "bnbbtc";

let tradeStreamName = `${symbol}@depth`;

const ws = new WebSocket(getStreamUrl(tradeStreamName));

ws.on("open", () => console.log("opened"));
ws.on("message", data => console.log(data));
