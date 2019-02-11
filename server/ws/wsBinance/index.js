const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const { intersectionBy } = require("lodash");

const {
  exchanges: { binance: exConfig },
  logger,
} = require("../../configs");
const { getLocalPairs } = require("../../helpers/getLocalPairs");

const { getAllowedPairsAsync } = require("./assets");

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
  const subject = new Subject();

  async function connect() {
    //todo: sub only for pairs where coins charge/withdraw enabled

    const pairs = getLocalPairs(globalPairs, exConfig);
    const allowedPairs = await getAllowedPairsAsync();

    //remove not allowed pairs
    const pairsToSubscribe = intersectionBy(pairs, allowedPairs, "localPair");

    let pairStreams = pairsToSubscribe.map(getStreamName);

    //todo: intersect with allowed pairs

    let wsUrl = `wss://stream.binance.com:9443/stream?streams=${pairStreams
      .map(ps => ps.stream)
      .join("/")}`;

    const ws = new WebSocket(wsUrl);

    ws.onclose = () => {
      logger.disconnected(exConfig);
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: false });
      //todo: reconnect!
      setTimeout(() => connect(), 3000);
    };

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    ws.on("open", () => {
      logger.connected(exConfig);
      //already subscribed using url
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: true });
    });

    fromEvent(ws, "message")
      .pipe(
        map(event => event.data),
        map(data => JSON.parse(data)),
        map(({ data: orderbook, stream }) => {
          //todo: optimize/replace find by dictionary
          let { globalPair: pair } = pairStreams.find(
            ps => ps.stream === stream
          );

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
      )
      .subscribe(data => subject.next(data));
  }

  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
