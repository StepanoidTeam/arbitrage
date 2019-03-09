"use strict";
const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map, bufferTime } = require("rxjs/operators");
const pako = require("pako");
const { head, intersectionBy } = require("lodash");

const {
  exchanges: { huobi: exConfig },
  logger,
} = require("../../configs");
const { getLocalPairs } = require("../../helpers/getLocalPairs");

const { getAllowedPairsAsync } = require("./assets");

function getSourceForPairs(globalPairs = []) {
  const wsUrl = "wss://api.huobi.pro/ws";
  const subject = new Subject();

  async function connect() {
    const pairs = getLocalPairs(globalPairs, exConfig);
    const allowedPairs = await getAllowedPairsAsync();
    const pairsToSubscribe = intersectionBy(pairs, allowedPairs, "localPair");

    const ws = new WebSocket(wsUrl);

    function subscribe(ws) {
      let pairsSubscribed = [];
      for (let pair of pairsToSubscribe) {
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

      let { globalPair } = pairsToSubscribe.find(
        p => p.localPair === localPair
      );

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
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: true });
      subscribe(ws);
    });

    ws.on("close", () => {
      logger.disconnected(exConfig);
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: false });

      //todo: reconnect!
      setTimeout(() => connect(), 10 * 1000);
    });

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    let subbedcount = 0;

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
        //console.log("huobi sub:", ++subbedcount);
      } else {
        console.log(`❓   ${exConfig.name}`, text);
      }
    });
  }

  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
