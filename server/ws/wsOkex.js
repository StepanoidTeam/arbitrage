const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const pako = require("pako");

//https://github.com/okcoin-okex/API-docs-OKEx.com/blob/master/API-For-Spot-EN/WEBSOCKET%20API%20for%20SPOT.md

const {
  exchanges: { okex: exConfig },
  getLocalPairs,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  let pairs = getLocalPairs(globalPairs, exConfig);

  const wsUrl = "wss://real.okex.com:10441/websocket?compress=true";

  const ws = new WebSocket(wsUrl);
  const subject = new Subject();

  const channel2pairMapping = {};

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
  }

  function handle([{ channel, data }]) {
    let pair = channel2pairMapping[channel];

    //skip addChannel events
    if (!pair) return;

    const bookTop = {
      exName: exConfig.name,
      pair: pair.globalPair,
      bid: data.bids.shift().map(x => +x),
      ask: data.asks.shift().map(x => +x),
    };

    subject.next(bookTop);
  }

  ws.on("open", () => {
    console.log(`${exConfig.name} connected:`, wsUrl);
    subscribe(ws);
  });

  //todo: reconnect!
  ws.onclose = () => {
    console.log(`❌   ${exConfig.name} disconnected`);
  };

  ws.onerror = err => {
    console.log(`⛔️   ${exConfig.name} error ${err}`);
  };

  ws.on("message", data => {
    let text = pako.inflateRaw(data, {
      to: "string",
    });

    let msg = JSON.parse(text);
    handle(msg);
  });

  return subject;
}

module.exports = { getSourceForPairs };
