const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const { last } = require("lodash");

//https://www.gate.io/api2#depth
//https://github.com/gateio/WebSocket-API/blob/master/nodejs/ws.js

const {
  exchanges: { gate: exConfig },

  logger,
} = require("../configs");
const { getLocalPairs } = require("../helpers/getLocalPairs");

function getSourceForPairs(globalPairs = []) {
  let pairs = getLocalPairs(globalPairs, exConfig);

  const subject = new Subject();
  const wsUrl = "wss://ws.gate.io/v3/";

  function subscribe(ws) {
    let msg = {
      id: 12312, //random?
      method: "depth.subscribe",
      params: pairs.map(pair => [pair.localPair, 1, "0"]),
    };

    ws.send(JSON.stringify(msg));

    let subscribedPairs = pairs.map(p => p.localPair);

    console.log(
      `✅  ${exConfig.name} - subscribed (tried) to ${
        subscribedPairs.length
      } pairs: ${subscribedPairs.join(", ").substr(0, 100)}`
    );
  }

  function connect() {
    const ws = new WebSocket(wsUrl);

    const orderbook = {};

    function handle(params) {
      let [, data, localPair] = params;

      let { globalPair } = pairs.find(p => p.localPair === localPair);

      orderbook[globalPair] = {
        bid: data.bids ? last(data.bids) : orderbook[globalPair].bid,
        ask: data.asks ? last(data.asks) : orderbook[globalPair].ask,
      };

      const arrToPriceVolume = ([price, volume]) => ({
        price,
        volume,
      });

      let bid = arrToPriceVolume(orderbook[globalPair].bid.map(x => +x));
      let ask = arrToPriceVolume(orderbook[globalPair].ask.map(x => +x));

      const bookTop = {
        exName: exConfig.name,
        pair: globalPair,
        bid,
        ask,
      };

      subject.next(bookTop);
    }

    ws.on("open", () => {
      logger.connected(exConfig);
      subscribe(ws);
    });

    ws.onclose = () => {
      logger.disconnected(exConfig);
      //todo: reconnect!
      setTimeout(() => connect(), 10 * 1000);
    };

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    ws.on("message", data => {
      let msg = JSON.parse(data);

      switch (msg.method) {
        case "depth.update":
          handle(msg.params);
          break;
        default:
          if (msg.error === null) {
            //no error, some success?
          } else {
            console.log(`❓   ${exConfig.name}`, msg);
          }
          break;
      }
    });
  }

  setImmediate(() => connect());
  //const channel2pairMapping = {};

  return subject;
}

module.exports = { getSourceForPairs };
