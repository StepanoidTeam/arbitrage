const WebSocket = require("ws");
const pako = require("pako");
const { fromEvent, Subject } = require("rxjs");
const { map, filter } = require("rxjs/operators");
const { intersectionBy } = require("lodash");

const {
  exchanges: { bibox: exConfig },
  logger,
} = require("../../configs");
const { getLocalPairs } = require("../../helpers/getLocalPairs");

function getStreamName({ globalPair, localPair }) {
  return `bibox_sub_spot_${localPair}_depth`;
}

getSourceForPairs.exConfig = exConfig;

function getSourceForPairs(globalPairs = []) {
  const subject = new Subject();

  async function connect() {
    //todo: sub only for pairs where coins charge/withdraw enabled

    const pairs = getLocalPairs(globalPairs, exConfig);
    const allowedPairs = pairs; //TODO: USE await getAllowedPairsAsync();

    //remove not allowed pairs
    const pairsToSubscribe = intersectionBy(pairs, allowedPairs, "localPair");

    let pairStreams = pairsToSubscribe.map(getStreamName);

    //todo: intersect with allowed pairs

    const wsUrl = "wss://push.bibox.com/";

    const ws = new WebSocket(wsUrl);

    function handle(msg) {
      //todo: cleanup
      let channel = msg.channel;
      let data = msg.data;
      let text = data;
      let recvMsg = data;
      if (typeof data == "string") {
        text = pako.inflate(Buffer.from(data, "base64"), {
          to: "string",
        });
        recvMsg = JSON.parse(text);
      }
      //console.log(channel);
      let channelArr = channel.split("_");
      let localPair = channelArr[3] + "_" + channelArr[4];
      let channelType = channelArr[5];

      let { globalPair } = pairs.find(p => p.localPair === localPair);

      if (channelType === "depth") {
        //console.log("⭕️ depth ", localPair, recvMsg.asks[0], recvMsg.bids[0]);

        const bid = recvMsg.bids[0];
        const ask = recvMsg.asks[0];

        const bookTop = {
          exName: exConfig.name,
          pair: globalPair,
          bid,
          ask,
        };

        subject.next(bookTop);
      } else {
        console.error(" invalid channel. ", msg);
      }
    }

    function getChannelName(pair) {
      return `bibox_sub_spot_${pair}_depth`;
    }

    function subscribe(ws) {
      for (let { localPair } of pairs) {
        ws.send(
          JSON.stringify({
            event: "addChannel",
            channel: getChannelName(localPair),
          })
        );
      }

      let subscribedPairs = pairs.map(p => p.localPair);

      console.log(
        `✅  ${exConfig.name} - subscribed (tried) to ${
          subscribedPairs.length
        } pairs: ${subscribedPairs.join(", ").substr(0, 100)}`
      );
    }

    //BIBOX SPECIFIC PING-PONG
    function ping(ws) {
      let now = new Date().getTime();
      ws.send(JSON.stringify({ ping: now }));
    }

    function pong(ws, msg) {
      ws.send(JSON.stringify({ pong: msg }));
    }

    ws.on("ping", ts => {
      let msg = ts.toString("utf8");
      console.log("ping ", msg);
    });

    ws.on("pong", ts => {
      let msg = ts.toString("utf8");
      console.log("pong ", msg);
    });

    ws.on("close", (code, msg) => {
      logger.disconnected(exConfig);
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: false });
      //todo: reconnect!
      setTimeout(() => connect(), 3000);
    });

    ws.on("error", err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
      //TODO: reconnect?
    });

    ws.on("open", () => {
      logger.connected(exConfig);
      subject.next({ exName: exConfig.name, isSystem: true, isOnline: true });
      subscribe(ws);
      ping(ws);
    });

    ws.on("message", data => {
      let msg = JSON.parse(data);

      //
      if (msg.ping) {
        pong(ws, msg.ping);
        return;
      } else if (msg.pong) {
        return;
      }

      if (msg[0]) {
        handle(msg[0]);
      } else {
        console.error("msg err: ", msg);
      }
    });
  }

  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
