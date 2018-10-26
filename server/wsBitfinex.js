const WebSocket = require("ws");

const endpoint = "wss://api.bitfinex.com";

const ws = new WebSocket("wss://api.bitfinex.com/ws/2");

ws.on("open", () => {
  console.log("opened");

  let msg = JSON.stringify({
    event: "subscribe",
    channel: "book",
    symbol: "tBTCUSD",
  });

  ws.send(msg);
});

let orderBook = {};

function initBook(data) {
  let half = data.length / 2;

  orderBook = {
    bids: data.slice(0, half),
    asks: data.slice(half),
  };

  console.log("init", orderBook);
}

function updateBook(data) {
  console.log(data);
}

function onWsMessage(message) {
  if (message.event) return;

  let [id, data] = message;
  if (Array.isArray(data[0])) {
    initBook(data);
  } else {
    updateBook(data);
  }
}

ws.on("message", data => onWsMessage(JSON.parse(data)));
