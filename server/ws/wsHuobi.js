"use strict";
const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map, bufferTime } = require("rxjs/operators");
const pako = require("pako");
const { head } = require("lodash");

const {
  exchanges: { huobi: exConfig },
  getLocalPairs,
  logger,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  const pairs = getLocalPairs(globalPairs, exConfig);
  const wsUrl = "wss://api.huobi.pro/ws";
  const subject = new Subject();

  function connect() {
    const ws = new WebSocket(wsUrl);

    function subscribe(ws) {
      let pairsSubscribed = [];
      for (let pair of pairs) {
        ws.send(
          JSON.stringify({
            sub: `market.${pair.localPair}.depth.step0`,
            id: `${pair.localPair}`,
          })
        );
        pairsSubscribed.push(pair.localPair);
      }

      console.log(
        `✅  ${exConfig.name} - subscribed (tried) to ${
          pairsSubscribed.length
        } pairs: ${pairsSubscribed.join(", ").substr(0, 100)}`
      );
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
      logger.connected(exConfig);
      subscribe(ws);
    });

    ws.onclose = () => {
      logger.disconnected(exConfig);
      //todo: reconnect!

      setTimeout(() => connect(), 3000);
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
        //todo: do real subscribed log here + buffer it
      } else {
        console.log(`❓   ${exConfig.name}`, text);
      }
    });
  }

  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
