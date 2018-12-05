"use strict";
const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const pako = require("pako");
const { head } = require("lodash");

const {
  exchanges: { huobi: exConfig },
  getLocalPairs,
  logger,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  let pairs = getLocalPairs(globalPairs, exConfig);

  const wsUrl = "wss://api.huobi.pro/ws";

  const ws = new WebSocket(wsUrl);
  const subject = new Subject();

  function subscribe(ws) {
    for (let pair of pairs) {
      ws.send(
        JSON.stringify({
          sub: `market.${pair.localPair}.depth.step0`,
          id: `${pair.localPair}`,
        })
      );
    }
  }

  function handle(data) {
    let [, localPair, channel] = data.ch.split(".");

    let { globalPair } = pairs.find(p => p.localPair === localPair);

    const arrToPriceVolume = ([price, volume]) => ({
      price,
      volume,
    });

    let bid = arrToPriceVolume(head(data.tick.bids));
    let ask = arrToPriceVolume(head(data.tick.asks));

    switch (channel) {
      case "depth":
        const bookTop = {
          exName: exConfig.name,
          pair: globalPair,
          bid,
          ask,
        };

        subject.next(bookTop);
        break;
    }
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
    let text = pako.inflate(data, {
      to: "string",
    });
    let msg = JSON.parse(text);

    if (msg.ping) {
      ws.send(
        JSON.stringify({
          pong: msg.ping,
        })
      );
    } else if (msg.tick) {
      handle(msg);
    } else if (msg.subbed) {
      console.log(`✅  ${exConfig.name} - subscribed to: ${msg.id}`);
    } else {
      console.log(`❓   ${exConfig.name}`, text);
    }
  });

  return subject;
}

module.exports = { getSourceForPairs };
