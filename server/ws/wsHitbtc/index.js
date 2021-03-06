const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const { last, head, intersectionBy } = require("lodash");

//https://api.hitbtc.com/#subscribe-to-orderbook

const {
  exchanges: { hitbtc: exConfig },
} = require("../../configs");
const { getLocalPairs } = require("../../helpers/getLocalPairs");

const { getAllowedPairsAsync } = require("./assets");

getSourceForPairs.exConfig = exConfig;

function getSourceForPairs(globalPairs = []) {
  const subject = new Subject();
  const wsUrl = "wss://api.hitbtc.com/api/2/ws";

  async function connect() {
    const pairs = getLocalPairs(globalPairs, exConfig);
    const allowedPairs = await getAllowedPairsAsync();
    const pairsToSubscribe = intersectionBy(pairs, allowedPairs, "localPair");

    const ws = new WebSocket(wsUrl);

    function subscribe(ws) {
      pairsToSubscribe.forEach(({ localPair }) => {
        let msg = {
          id: localPair, //random?
          method: "subscribeOrderbook",
          params: {
            symbol: localPair,
          },
        };

        ws.send(JSON.stringify(msg));
      });

      let subscribedPairs = pairsToSubscribe.map(p => p.localPair);

      console.log(
        `✅  ${exConfig.name} - subscribed (tried) to ${
          subscribedPairs.length
        } pairs: ${subscribedPairs.join(", ").substr(0, 100)}`
      );
    }

    ws.on("open", () => {
      subject.next({ type: "system", exName: exConfig.name, isOnline: true });
      subscribe(ws);
    });

    ws.onclose = () => {
      subject.next({ type: "system", exName: exConfig.name, isOnline: false });
      //todo: reconnect!
      setTimeout(() => connect(), 3 * 1000);
    };

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    const orderBooks = new Map();

    const rawToNums = ({ price, size }) => ({
      price: +price,
      volume: +size,
    });
    const getKeyValue = ({ price, volume }) => [price, { price, volume }];

    function initBook({ ask, bid, symbol }) {
      const orderbook = {
        bids: new Map(bid.map(rawToNums).map(getKeyValue)),
        asks: new Map(ask.map(rawToNums).map(getKeyValue)),
      };

      orderBooks.set(symbol, orderbook);
      produceBookTop(symbol);
    }

    function updateBook({ ask, bid, symbol }) {
      const orderbook = orderBooks.get(symbol);

      function updateBookPart(partMap, { price, volume }) {
        if (volume === 0) {
          partMap.delete(price);
        } else {
          partMap.set(price, { price, volume });
        }
      }

      bid.map(rawToNums).forEach(data => updateBookPart(orderbook.bids, data));
      ask.map(rawToNums).forEach(data => updateBookPart(orderbook.asks, data));

      produceBookTop(symbol);
    }

    function produceBookTop(symbol) {
      const orderbook = orderBooks.get(symbol);

      let { globalPair } = pairsToSubscribe.find(p => p.localPair === symbol);

      let maxBidPrice = Math.max(...orderbook.bids.keys());
      let minAskPrice = Math.min(...orderbook.asks.keys());

      const bookTop = {
        type: "top",
        timestamp: Date.now(),
        exName: exConfig.name,
        pair: globalPair,
        bid: orderbook.bids.get(maxBidPrice),
        ask: orderbook.asks.get(minAskPrice),
      };

      subject.next(bookTop);
    }

    ws.on("message", data => {
      let msg = JSON.parse(data);

      switch (msg.method) {
        case "snapshotOrderbook":
          initBook(msg.params);
          break;
        case "updateOrderbook":
          updateBook(msg.params);
          break;
        case undefined:
          break;
        default:
          console.log(`❓   ${exConfig.name}`, msg);
          break;
      }

      // subscribed?
      if ((msg.jsonrpc = "2.0" && msg.result === true && msg.id)) {
        //TODO: calc these
        console.log("*️⃣ hitbtc subscribed?", msg);
      }
    });
  }

  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
