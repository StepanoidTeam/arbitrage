const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const pako = require("pako");
const { last, head } = require("lodash");

//https://www.gate.io/api2#depth
//https://github.com/gateio/WebSocket-API/blob/master/nodejs/ws.js

const {
  exchanges: { gate: exConfig },
  getLocalPairs,
  logger,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  let pairs = getLocalPairs(globalPairs, exConfig);

  const wsUrl = "wss://ws.gate.io/v3/";

  const ws = new WebSocket(wsUrl);
  const subject = new Subject();

  //const channel2pairMapping = {};

  function subscribe(ws) {
    let msg = {
      id: 12312, //random?
      method: "depth.subscribe",
      params: pairs.map(pair => [pair.localPair, 1, "0"]),
    };

    ws.send(JSON.stringify(msg));
  }

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
    console.log(`${exConfig.name} connected:`, wsUrl);
    subscribe(ws);
  });

  //todo: reconnect!
  ws.onclose = () => {
    logger.disconnect(exConfig);
  };

  ws.onerror = err => {
    console.log(`⛔️   ${exConfig.name} error ${err}`);
  };

  ws.on("message", data => {
    let msg = JSON.parse(data);

    switch (msg.method) {
      case "depth.update":
        handle(msg.params);
        break;
      default:
        console.log(`❓`, msg);
        break;
    }
  });

  return subject;
}

module.exports = { getSourceForPairs };
