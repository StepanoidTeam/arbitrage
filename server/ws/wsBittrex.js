const { Subject } = require("rxjs");

const signalR = require("signalr-client");
const jsonic = require("jsonic");
const zlib = require("zlib");

const sortBy = require("lodash/sortBy");

const {
  exchanges: { bittrex },
  getLocalPairs,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  //todo: make some common apporoach for that cases

  const pairs = getLocalPairs(globalPairs, bittrex);

  //todo: rx-ify this
  let orderBooks = {};

  const subject = new Subject();

  const client = new signalR.client("wss://beta.bittrex.com/signalr", ["c2"]);

  function produceBook(pair) {
    let orderBook = orderBooks[pair];
    if (!orderBook) {
      console.warn(`⛔️  bittrex: orderbook not exists for ${pair}`);
      return;
    }

    const bid = sortBy([...orderBook.bids.values()], x => x.price)
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

    if (!orderBooks[pair]) {
      console.warn(
        `⛔️  bittrex: shit! ${pair} not found for ${JSON.stringify(
          orderBooks
        )}`
      );
      return;
    }

    asks.forEach(applyUpdates(orderBooks[pair].asks));
    bids.forEach(applyUpdates(orderBooks[pair].bids));
  }

  client.serviceHandlers.connected = function(connection) {
    console.log(`${bittrex.name} connected`);

    pairs.forEach(pair => {
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
                //   `${bittrex.name} - got orderbook for: ${pair.localPair}`
                // );
                json = JSON.parse(inflated.toString("utf8"));

                initBook(json, pair.globalPair);
                produceBook(pair.globalPair);
              }
            });
          }
        });

      //subscribe to orderbook changes
      client
        .call("c2", "SubscribeToExchangeDeltas", pair.localPair)
        .done((err, result) => {
          if (err) {
            return console.error(err);
          }
          if (result === true) {
            console.log(`${bittrex.name} - subscribed to: ${pair.localPair}`);
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
                let { globalPair } = pairs.find(p => p.localPair === localPair);

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
