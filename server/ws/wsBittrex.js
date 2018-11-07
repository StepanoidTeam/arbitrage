const { Subject } = require("rxjs");

const signalR = require("signalr-client");
const jsonic = require("jsonic");
const zlib = require("zlib");

const sortBy = require("lodash/sortBy");

const {
  exchanges: { bittrex },
} = require("../configs");

function getSourceForPairs(pairs = []) {
  //todo: make some common apporoach for that cases

  const pairMapping = pairs.map(globalPair => ({
    localPair: bittrex.pairs[globalPair],
    globalPair,
  }));
  //todo: rx-ify this
  let orderBooks = {};

  const subject = new Subject();

  const client = new signalR.client("wss://beta.bittrex.com/signalr", ["c2"]);

  function produceBook(pair) {
    const bid = sortBy([...orderBooks[pair].bids.values()], x => x.price)
      .reverse()
      .shift();

    const ask = sortBy(
      [...orderBooks[pair].asks.values()],
      x => x.price
    ).shift();

    subject.next({
      exName: bittrex.name,
      pair,
      bid,
      ask,
    });
  }

  function initBook(json, pair) {
    //todo: how can i understand what pair came?
    let bidArr = json.Z.map(({ R: price, Q: volume }) => ({
      price,
      volume,
    }));
    let askArr = json.S.map(({ R: price, Q: volume }) => ({
      price,
      volume,
    }));

    const mapOrder = data => [data.price, data];

    orderBooks[pair] = {
      bids: new Map(bidArr.map(mapOrder)),
      asks: new Map(askArr.map(mapOrder)),
    };
  }

  function updateBook(json, pair) {
    //todo: how can i understand what pair came?

    //   Z:
    //   [ { TY: 0, R: 0.030909, Q: 1.60805 },
    //     { TY: 1, R: 0.030908, Q: 0 },
    //     { TY: 1, R: 0.03090601, Q: 0 },
    //     { TY: 0, R: 0.02422006, Q: 0.20644048 } ],
    //  S: [ { TY: 2, R: 0.03095308, Q: 0.06539122 } ],

    let { S: asks, Z: bids } = json;

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

    //console.log(orderBooks[pair]);

    asks.forEach(applyUpdates(orderBooks[pair].asks));
    bids.forEach(applyUpdates(orderBooks[pair].bids));
  }

  client.serviceHandlers.connected = function(connection) {
    console.log("connected");

    pairs.map(pair => bittrex.pairs[pair]).forEach(pair => {
      //get initial orderbook
      client.call("c2", "QueryExchangeState", pair).done((err, result) => {
        if (err) {
          return console.error(err);
        }
        if (result) {
          let raw = new Buffer.from(result, "base64");
          zlib.inflateRaw(raw, function(err, inflated) {
            if (!err) {
              json = JSON.parse(inflated.toString("utf8"));

              let localPair = json.M;
              let { globalPair } = pairMapping.find(
                p => p.localPair === localPair
              );
              initBook(json, globalPair);

              produceBook(globalPair);
            }
          });
        }
      });

      //subscribe to orderbook changes
      client
        .call("c2", "SubscribeToExchangeDeltas", pair)
        .done((err, result) => {
          if (err) {
            return console.error(err);
          }
          if (result === true) {
            console.log("Subscribed to " + pair);
          }
        });
    });
  };

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
            let b64 = data.M[0].A[0];
            let raw = new Buffer.from(b64, "base64");

            zlib.inflateRaw(raw, function(err, inflated) {
              if (!err) {
                let json = JSON.parse(inflated.toString("utf8"));
                //console.log(json);

                let localPair = json.M;
                let { globalPair } = pairMapping.find(
                  p => p.localPair === localPair
                );

                updateBook(json, globalPair);

                produceBook(globalPair);
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
