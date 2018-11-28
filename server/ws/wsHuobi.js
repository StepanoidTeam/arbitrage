const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");
const pako = require("pako");

const {
  exchanges: { huobi: exConfig },
  getLocalPairs,
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

    switch (channel) {
      case "depth":
        const bookTop = {
          exName: exConfig.name,
          pair: globalPair,
          bid: data.tick.bids.shift(),
          ask: data.tick.asks.shift(),
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
    console.log(`❌   ${exConfig.name} disconnected`);
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
    } else {
      console.log(`❓`, text);
    }
  });

  return subject;
}

module.exports = { getSourceForPairs };
