const fetch = require("node-fetch");
const WebSocket = require("ws");
const { fromEvent, Subject } = require("rxjs");
const { map } = require("rxjs/operators");

/*
  https://kucoinapidocs.docs.apiary.io/#introduction/websocket/overview

  очень задроченный ордербук
  нужно получить фулл бук по ресту,
  а потом накатывать изменения из соков
  
*/

const {
  exchanges: { kucoin: exConfig },
  logger,
} = require("../configs");
const { getLocalPairs } = require("../helpers/getLocalPairs");

const depth = 5; // 5, 10

var orderbook = {};

getSourceForPairs.exConfig = exConfig;

function getSourceForPairs(globalPairs = []) {
  const httpUrl = `https://kitchen.kucoin.com/v1/bullet/usercenter/loginUser?protocol=websocket&encrypt=true`;

  fetch(httpUrl)
    .then(data => data.json())
    .then(({ data: { bulletToken } }) => {
      console.log(`${exConfig.name} token received:`, bulletToken);
      connect(bulletToken);
    });

  let pairs = getLocalPairs(globalPairs, exConfig);
  const subject = new Subject();

  function connect(bulletToken) {
    const wsUrl = `wss://push1.kucoin.com/endpoint?format=json&resource=api&bulletToken=${bulletToken}`;

    const ws = new WebSocket(wsUrl);

    function subscribe(ws) {
      for (let pair of pairs) {
        let msg = {
          id: 123,
          type: "subscribe",
          topic: `/trade/${pair.localPair}_TRADE`,
          req: 1,
        };

        ws.send(JSON.stringify(msg));
      }
    }

    function handle(data) {
      subject.next(data);

      // let symbol = data.ch.split(".")[1];
      // let channel = data.ch.split(".")[2];

      // let { globalPair } = pairs.find(p => p.localPair === symbol);

      // switch (channel) {
      //   case "depth":
      //     orderbook[symbol] = data.tick;

      //     const bookTop = {
      //       exName: exConfig.name,
      //       pair: globalPair,
      //       bid: orderbook[symbol].bids.shift(),
      //       ask: orderbook[symbol].asks.shift(),
      //     };

      //     subject.next(bookTop);
      //     break;
      // }
    }

    ws.on("open", () => {
      logger.connected(exConfig);
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: true });
      subscribe(ws);
    });

    //todo: reconnect!
    ws.onclose = () => {
      logger.disconnected(exConfig);
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: false });
    };

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    ws.on("message", data => {
      subject.next(data);
      return;

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
        console.log(`❓   ${exConfig.name}`, text);
      }
    });
  }

  return subject;
}

module.exports = { getSourceForPairs };
