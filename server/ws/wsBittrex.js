const { Subject } = require("rxjs");

const signalR = require("signalr-client");
const jsonic = require("jsonic");
const zlib = require("zlib");

const sortBy = require("lodash/sortBy");

const {
  exchanges: { bittrex: exConfig },
  logger,
} = require("../configs");
const { getLocalPairs } = require("../helpers/getLocalPairs");

getSourceForPairs.exConfig = exConfig;

function getSourceForPairs(globalPairs = []) {
  //todo: make some common apporoach for that cases

  const pairs = getLocalPairs(globalPairs, exConfig);

  //todo: rx-ify this
  let orderBooks = {};

  const subject = new Subject();

  const client = new signalR.client("wss://beta.bittrex.com/signalr", ["c2"]);

  function produceBook(pair, jsonDebugData) {
    let orderBook = orderBooks[pair];
    if (!orderBook) {
      console.warn(`⛔️  ${exConfig.name}: orderbook not exists for ${pair}`);
      return;
    }

    const bids = sortBy([...orderBook.bids.values()], x => -x.price).slice(
      0,
      10
    );
    const asks = sortBy([...orderBook.asks.values()], x => x.price).slice(
      0,
      10
    );

    const bid = bids[0];
    const ask = asks[0];

    const timestamp = Date.now();

    subject.next({
      type: "top",
      timestamp,
      exName: exConfig.name,
      pair,
      bid,
      ask,
    });

    subject.next({
      type: "orderbook",
      timestamp,
      exName: exConfig.name,
      pair,
      bids,
      asks,
      jsonDebugData,
    });
  }

  function initBook({ Z: bids, S: asks }, pair) {
    //todo: how can i understand what pair came?
    let bidArr = bids.map(({ R: price, Q: volume }) => ({
      price,
      volume,
    }));
    let askArr = asks.map(({ R: price, Q: volume }) => ({
      price,
      volume,
    }));

    const mapOrder = data => [data.price, data];

    orderBooks[pair] = {
      bids: new Map(bidArr.map(mapOrder)),
      asks: new Map(askArr.map(mapOrder)),
    };
  }

  function updateBook({ Z: bids, S: asks }, pair) {
    //   Z:
    //   [ { TY: 0, R: 0.030909, Q: 1.60805 },
    //     { TY: 1, R: 0.030908, Q: 0 },
    //     { TY: 1, R: 0.03090601, Q: 0 },
    //     { TY: 0, R: 0.02422006, Q: 0.20644048 } ],
    //  S: [ { TY: 2, R: 0.03095308, Q: 0.06539122 } ],

    const applyUpdates = bookpart => ({
      TY: updateType,
      R: price,
      Q: volume,
    }) => {
      if (updateType === 0 || updateType === 2) {
        //0 = ADD, 2 = UPDATE
        bookpart.set(price, { price, volume });
      } else {
        // 1 = REMOVE
        bookpart.delete(price);
      }
    };

    if (!orderBooks[pair]) {
      console.warn(
        `⛔️  ${exConfig.name}: shit! ${pair} not found for ${JSON.stringify(
          orderBooks
        )}`
      );
      return;
    }

    bids.forEach(applyUpdates(orderBooks[pair].bids));
    asks.forEach(applyUpdates(orderBooks[pair].asks));
  }

  client.serviceHandlers.disconnected = function() {
    //todo: reconnect!
    logger.disconnected(exConfig);
    subject.next({ exName: exConfig.name, isSystem: true, isOnline: false });
  };

  function getBookForPair(pair) {
    //get initial orderbook
    client
      .call("c2", "QueryExchangeState", pair.localPair)
      .done((err, result) => {
        if (err) {
          return console.error(err);
        }
        if (result) {
          let raw = new Buffer.from(result, "base64");
          zlib.inflateRaw(raw, function(err, inflated) {
            if (!err) {
              // console.log(
              //   `${exConfig.name} - got orderbook for: ${pair.localPair}`
              // );
              json = JSON.parse(inflated.toString("utf8"));

              initBook(json, pair.globalPair);
              produceBook(pair.globalPair, json);
            }
          });
        }
      });
  }

  function reInitAllPairs() {
    pairs.forEach(pair => {
      getBookForPair(pair);
    });

    setTimeout(() => {
      reInitAllPairs(); //410174,
    }, 50);
  }

  client.serviceHandlers.connected = function(connection) {
    logger.connected(exConfig);
    subject.next({ exName: exConfig.name, isSystem: true, isOnline: true });

    pairs.forEach(pair => {
      getBookForPair(pair);

      subscribeToBookUpdate(pair);
    });

    //reInitAllPairs();
  };

  function subscribeToBookUpdate(pair) {
    //subscribe to orderbook changes
    client
      .call("c2", "SubscribeToExchangeDeltas", pair.localPair)
      .done((err, result) => {
        if (err) {
          return console.error(err);
        }
        if (result === true) {
          //todo: rewrite as at bitfinex?
          console.log(
            `✅${exConfig.name} - subscribed (tried) to: ${pair.localPair}`
          );
        }
      });
  }

  client.serviceHandlers.messageReceived = function(message) {
    let data = jsonic(message.utf8Data);
    //todo: get rid of this bittrex shit
    if (data.hasOwnProperty("M")) {
      if (data.M[0]) {
        if (data.M[0].hasOwnProperty("A")) {
          if (data.M[0].A[0]) {
            /**
             *  handling the GZip and base64 compression
             *  https://github.com/Bittrex/beta#response-handling
             */

            //❎ TODO: https://bittrex.github.io/api/v1-1#/definitions/Market%20Delta%20-%20uE
            /**
             * Websocket connections may occasionally need to be recycled.
             * If, for example, you're maintinaing local order book state,
             * and you stop receiving updates even though you know trade
             * activity is occurring, it may be time to resynchronize.
             */

            let b64 = data.M[0].A[0];
            let raw = new Buffer.from(b64, "base64");

            zlib.inflateRaw(raw, function(err, inflated) {
              if (!err) {
                let json = JSON.parse(inflated.toString("utf8"));

                if (!json.M) return; // no pair name

                let localPair = json.M;
                let { globalPair } = pairs.find(p => p.localPair === localPair);

                //bid or ask exists
                if (json.S || json.Z) {
                  //❎ TODO: IF nonce diff > 1 comparing to prev nonce (gap)
                  // THEN re-init orderbook, continue

                  // TODO: push all diff updates to separate diff SUBJECT
                  // apply ALL diffs >= nonce+1 after re-init orderbook from diff SUBJECT

                  updateBook(json, globalPair);
                  produceBook(globalPair, json);
                } else {
                  console.log("@", exConfig.name, json);
                }
              }
            });
          }
        }
      }
    }
  };

  return subject;
}

module.exports = { getSourceForPairs };
