const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const pako = require("pako");
const { last, head } = require("lodash");

//https://github.com/okcoin-okex/API-docs-OKEx.com/blob/master/API-For-Spot-EN/WEBSOCKET%20API%20for%20SPOT.md

const {
  exchanges: { okex: exConfig },
  getLocalPairs,
  logger,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  let pairs = getLocalPairs(globalPairs, exConfig);

  const wsUrl = "wss://real.okex.com:10441/websocket?compress=true";

  const ws = new WebSocket(wsUrl);
  const subject = new Subject();

  const channel2pairMapping = {};

  const pingPongInterval = 30 * 1000;
  function ping() {
    ws.send(JSON.stringify({ event: "ping" }));
  }
  const noop = () => void 0;
  let stopPing = noop;
  function startPing() {
    const timerId = setInterval(ping, pingPongInterval);

    return () => clearInterval(timerId);
  }

  function subscribe(ws) {
    for (let pair of pairs) {
      let channel = `ok_sub_spot_${pair.localPair}_depth_5`;

      channel2pairMapping[channel] = pair;

      let msg = {
        event: "addChannel",
        channel,
      };

      ws.send(JSON.stringify(msg));
    }

    stopPing = startPing();
  }

  function handleWsMessage([{ channel, data }]) {
    let pair = channel2pairMapping[channel];

    //skip addChannel events
    if (!pair) return;

    const arrToPriceVolume = ([price, volume]) => ({
      price,
      volume,
    });

    let bid = arrToPriceVolume(head(data.bids).map(x => +x));
    let ask = arrToPriceVolume(last(data.asks).map(x => +x));

    const bookTop = {
      exName: exConfig.name,
      pair: pair.globalPair,
      bid,
      ask,
    };

    subject.next(bookTop);
  }

  ws.on("open", () => {
    console.log(`${exConfig.name} connected:`, wsUrl);
    subscribe(ws);
  });

  ws.onclose = () => {
    logger.disconnect(exConfig);
    stopPing();
    //todo: reconnect!
  };

  ws.onerror = err => {
    console.log(`⛔️   ${exConfig.name} error ${err}`);
  };

  ws.on("message", data => {
    let text = pako.inflateRaw(data, {
      to: "string",
    });

    let msg = JSON.parse(text);
    if (Array.isArray(msg)) {
      handleWsMessage(msg);
    } else if (msg.event === "pong") {
      //pong received
    } else {
      console.log("❓ msg", msg);
    }
  });

  return subject;
}

module.exports = { getSourceForPairs };
