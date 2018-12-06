const WebSocket = require("ws");
const { fromEvent } = require("rxjs");
const { map } = require("rxjs/operators");

const {
  exchanges: { binance: exConfig },
  getLocalPairs,
  logger,
} = require("../configs");

const depth = 5; // 5, 10

function getStreamName({ globalPair, localPair }) {
  let stream = `${localPair.toLowerCase()}@depth${depth}`;
  return {
    localPair,
    globalPair,
    stream,
  };
}

function getSourceForPairs(globalPairs = []) {
  let pairStreams = getLocalPairs(globalPairs, exConfig).map(getStreamName);

  let wsUrl = `wss://stream.binance.com:9443/stream?streams=${pairStreams
    .map(ps => ps.stream)
    .join("/")}`;

  const ws = new WebSocket(wsUrl);

  ws.onclose = () => {
    logger.disconnected(exConfig);
    //todo: reconnect!
  };

  ws.on("open", () => {
    logger.connected(exConfig);
    //already subscribed using url
  });

  let source = fromEvent(ws, "message").pipe(
    map(event => event.data),
    map(data => JSON.parse(data)),
    map(({ data: orderbook, stream }) => {
      //todo: optimize/replace find by dictionary
      let { globalPair: pair } = pairStreams.find(ps => ps.stream === stream);

      let bookTop = {
        exName: exConfig.name,
        pair,
        bid: orderbook.bids
          .map(([price, volume]) => ({ price: +price, volume: +volume }))
          .shift(),
        ask: orderbook.asks
          .map(([price, volume]) => ({ price: +price, volume: +volume }))
          .shift(),
      };

      return bookTop;
    })
  );

  return source;
}

module.exports = { getSourceForPairs };
