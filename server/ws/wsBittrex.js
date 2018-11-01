const signalR = require("signalr-client");
const jsonic = require("jsonic");
const zlib = require("zlib");

const sortBy = require("lodash/sortBy");

const client = new signalR.client("wss://beta.bittrex.com/signalr", ["c2"]);

let symbol = "USDT-BTC";
const depth = 5;

let orderBook = {};

function drawBook() {
  console.clear();

  // const orderbook = {
  //   bids: bids.slice(0, depth).map(([price, count, amount]) => [price, amount]),
  //   asks: asks.slice(0, depth).map(([price, count, amount]) => [price, amount]),
  // };

  console.log({
    time: Date.now().toString(),
    bids: sortBy([...orderBook.bids.values()], x => x[0])
      .reverse()
      .slice(0, depth),
    asks: sortBy([...orderBook.asks.values()], x => x[0]).slice(0, depth),
  });
}

function initBook(json) {
  let bidArr = json.Z.map(({ R: price, Q: amount }) => [price, amount]);
  let askArr = json.S.map(({ R: price, Q: amount }) => [price, amount]);

  const mapOrder = data => [data[0], data];

  orderBook = {
    bids: new Map(bidArr.map(mapOrder)),
    asks: new Map(askArr.map(mapOrder)),
  };
}

function updateBook(json) {
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
    Q: amount,
  }) => {
    if (updateType === 0 || updateType === 2) {
      //0 = ADD, 2 = UPDATE
      bookpart.set(price, [price, amount]);
    } else {
      // 1 = REMOVE
      bookpart.delete(price);
    }
  };

  asks.forEach(applyUpdates(orderBook.asks));
  bids.forEach(applyUpdates(orderBook.bids));
}

client.serviceHandlers.connected = function(connection) {
  console.log("connected");

  //get initial orderbook
  client.call("c2", "QueryExchangeState", symbol).done((err, result) => {
    if (err) {
      return console.error(err);
    }
    if (result) {
      let raw = new Buffer.from(result, "base64");
      zlib.inflateRaw(raw, function(err, inflated) {
        if (!err) {
          json = JSON.parse(inflated.toString("utf8"));

          initBook(json);

          drawBook();
        }
      });
    }
  });

  //subscribe to orderbook changes
  client.call("c2", "SubscribeToExchangeDeltas", symbol).done((err, result) => {
    if (err) {
      return console.error(err);
    }
    if (result === true) {
      console.log("Subscribed to " + symbol);
    }
  });

  //subscribe to orderbook changes
  // client
  //   .call("c2", "SubscribeToExchangeDeltas", "USDT-ETH")
  //   .done((err, result) => {
  //     if (err) {
  //       return console.error(err);
  //     }
  //     if (result === true) {
  //       console.log("Subscribed to " + "USDT-ETH");
  //     }
  //   });
};

client.serviceHandlers.messageReceived = function(message) {
  let data = jsonic(message.utf8Data);
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

              updateBook(json);
              drawBook();
            }
          });
        }
      }
    }
  }
};
