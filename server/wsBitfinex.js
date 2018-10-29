const WebSocket = require("ws");
const sortBy = require("lodash/sortBy");

const endpoint = "wss://api.bitfinex.com";
const depth = 5;
const ws = new WebSocket("wss://api.bitfinex.com/ws/2");

ws.on("open", () => {
  console.log("opened");

  let msg = JSON.stringify({
    event: "subscribe",
    channel: "book",
    symbol: "BTCUSD", //"ZRXBTC"
  });

  ws.send(msg);
});

let orderBook = {};

function drawBook() {
  console.clear();

  const ob = Array.from(orderBook).map(x => x[1]);
  const bids = sortBy(ob.filter(x => x[2] > 0), [x => x[0]]).reverse();
  const asks = sortBy(ob.filter(x => x[2] < 0), x => x[0]);

  const orderbook = {
    bids: bids.slice(0, depth).map(([price, count, amount]) => [price, amount]),
    asks: asks.slice(0, depth).map(([price, count, amount]) => [price, amount]),
  };

  console.log(orderbook);
}

function initBook(data) {
  const mapOrder = data => [data[0], data];
  orderBook = new Map(data.map(mapOrder));
}

function updateBook(data) {
  let [price, count, amount] = data;

  if (count > 0) {
    //add or update
    orderBook.set(price, [price, count, amount]);
  } else {
    //delete
    orderBook.delete(price);
  }

  drawBook();
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
