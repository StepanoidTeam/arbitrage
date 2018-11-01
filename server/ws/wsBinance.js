const WebSocket = require("ws");
const { fromEvent } = require("rxjs");
const { map } = require("rxjs/operators");

const {
  exchanges: { binance },
} = require("../configs");

const depth = 5; // 5, 10

function getStreamName(pair) {
  let stream = `${binance.pairs[pair].toLowerCase()}@depth${depth}`;

  return {
    pair,
    stream,
  };
}

function getSourceForPairs(pairs = []) {
  let pairStreams = pairs.map(getStreamName);

  let wsUrl = `wss://stream.binance.com:9443/stream?streams=${pairStreams
    .map(ps => ps.stream)
    .join("/")}`;

  const ws = new WebSocket(wsUrl);

  let source = fromEvent(ws, "message").pipe(
    map(event => event.data),
    map(data => JSON.parse(data)),
    map(({ data: orderbook, stream }) => {
      //todo: optimize/replace find by dictionary
      let { pair } = pairStreams.find(ps => ps.stream === stream);

      let bookTop = {
        pair,
        bid: orderbook.bids.map(([a, b]) => [+a, +b]).shift(),
        ask: orderbook.asks.map(([a, b]) => [+a, +b]).shift(),
      };

      return bookTop;
    })
  );

  return source;
}

module.exports = { getSourceForPairs };
