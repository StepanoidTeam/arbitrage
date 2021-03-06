const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const pako = require("pako");
const { last, head, intersectionBy } = require("lodash");

//https://github.com/okcoin-okex/API-docs-OKEx.com/blob/master/API-For-Spot-EN/WEBSOCKET%20API%20for%20SPOT.md

const {
  exchanges: { okex: exConfig },
} = require("../../configs");
const { getLocalPairs } = require("../../helpers/getLocalPairs");

const { getAllowedPairsAsync } = require("./assets");

getSourceForPairs.exConfig = exConfig;

function getSourceForPairs(globalPairs = []) {
  const subject = new Subject();

  const wsUrl = "wss://real.okex.com:10441/websocket?compress=true";

  const pingPongInterval = 30 * 1000;

  function ping(ws) {
    ws.send(JSON.stringify({ event: "ping" }));
  }

  const noop = () => void 0;

  function startPing(ws) {
    const timerId = setInterval(() => ping(ws), pingPongInterval);

    return () => clearInterval(timerId);
  }

  async function connect() {
    const pairs = getLocalPairs(globalPairs, exConfig);
    const allowedPairs = await getAllowedPairsAsync();
    const pairsToSubscribe = intersectionBy(pairs, allowedPairs, "localPair");

    const ws = new WebSocket(wsUrl);

    const channel2pairMapping = {};

    let stopPing = noop;

    function subscribe(ws) {
      for (let pair of pairsToSubscribe) {
        let channel = `ok_sub_spot_${pair.localPair}_depth_5`;

        channel2pairMapping[channel] = pair;

        let msg = {
          event: "addChannel",
          channel,
        };

        ws.send(JSON.stringify(msg));
      }

      stopPing = startPing(ws);
    }

    function handleWsMessage([{ channel, data }]) {
      let pair = channel2pairMapping[channel];

      //skip addChannel events
      if (!pair) {
        console.log(
          `⚠️  ${
            exConfig.name
          }: pair not found - ${channel}; data: ${JSON.stringify(
            data
          )}; channels: ${Object.keys(channel2pairMapping)}`
        );
        return;
      }

      if (data.bids === undefined || data.bids === undefined) {
        console.log(`💩  ${exConfig.name} bid/ask lost! ${pair.globalPair}`);
        console.log(data);
        return;
      }

      const arrToPriceVolume = ([price, volume]) => ({
        price,
        volume,
      });

      let bid = arrToPriceVolume(head(data.bids).map(x => +x));
      let ask = arrToPriceVolume(last(data.asks).map(x => +x));

      const bookTop = {
        type: "top",
        timestamp: Date.now(),
        exName: exConfig.name,
        pair: pair.globalPair,
        bid,
        ask,
      };

      subject.next(bookTop);
    }

    ws.on("open", () => {
      subject.next({ type: "system", exName: exConfig.name, isOnline: true });
      subscribe(ws);
    });

    ws.on("close", () => {
      subject.next({ type: "system", exName: exConfig.name, isOnline: false });
      stopPing();
      //todo: reconnect!
      setTimeout(() => connect(), 10 * 1000);
    });

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    ws.on("message", data => {
      let text = pako.inflateRaw(data, {
        to: "string",
      });

      let msg = JSON.parse(text);
      if (Array.isArray(msg)) {
        let [{ channel: event }] = msg;
        if (event === "addChannel") {
          //todo: pair subscribed
        } else {
          //todo: add specific condition, else - log warning
          handleWsMessage(msg);
        }
      } else if (msg.event === "pong") {
        //pong received
      } else {
        console.log(`❓   ${exConfig.name}`, msg);
      }
    });
  }
  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
