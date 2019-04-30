const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const { intersectionBy } = require("lodash");

const {
  exchanges: { binance: exConfig },
} = require("../../configs");
const { getLocalPairs } = require("../../helpers/getLocalPairs");

const { getAllowedPairsAsync } = require("./assets");

const depth = 5;

function getStreamName({ globalPair, localPair }) {
  let stream = `${localPair.toLowerCase()}@depth${depth}`;
  return {
    localPair,
    globalPair,
    stream,
  };
}

getSourceForPairs.exConfig = exConfig;

function getSourceForPairs(globalPairs = []) {
  const subject = new Subject();

  async function connect() {
    //todo: sub only for pairs where coins charge/withdraw enabled

    const pairs = getLocalPairs(globalPairs, exConfig);
    const allowedPairs = await getAllowedPairsAsync();

    //remove not allowed pairs
    const pairsToSubscribe = intersectionBy(pairs, allowedPairs, "localPair");

    let pairStreams = pairsToSubscribe.map(getStreamName);

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${pairStreams
      .map(ps => ps.stream)
      .join("/")}`;

    const ws = new WebSocket(wsUrl);

    ws.onclose = () => {
      subject.next({ type: "system", exName: exConfig.name, isOnline: false });
      //todo: reconnect!
      setTimeout(() => connect(), 3000);
    };

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    ws.on("open", () => {
      //already subscribed using url
      subject.next({ type: "system", exName: exConfig.name, isOnline: true });
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
            type: "top",
            timestamp: Date.now(),
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
