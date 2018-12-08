const WebSocket = require("ws");
const sortBy = require("lodash/sortBy");

const { fromEvent, Subject } = require("rxjs");
const { map, filter, tap } = require("rxjs/operators");

const {
  exchanges: { bitfinex: exConfig },
  getLocalPairs,
  logger,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  const pairs = getLocalPairs(globalPairs, exConfig);
  //limitation just because bitfinex
  // gives different response when sub to 1 or 2-n pairs
  if (pairs.length < 2)
    throw new Error(`${exConfig.name} ws works with 2 pairs minimum, sorry`);

  const subject = new Subject();
  const depth = 5;

  function connect() {
    const ws = new WebSocket("wss://api.bitfinex.com/ws/2");

    ws.on("close", () => {
      logger.disconnected(exConfig);
      //todo: reconnect!
      setTimeout(() => connect(), 3000);
    });

    ws.onerror = err => {
      console.log(`⛔️   ${exConfig.name} error`, err);
    };

    ws.on("open", () => {
      logger.connected(exConfig);

      let pairsSubscribed = [];
      pairs
        .map(({ localPair: symbol }) => ({
          event: "subscribe",
          channel: "book",
          symbol,
        }))
        .forEach(msg => {
          ws.send(JSON.stringify(msg));
          pairsSubscribed.push(msg.symbol);
        });

      //todo: do these when subscribe ok received from ws instead - as at Huobi
      console.log(
        `✅  ${exConfig.name} - subscribed (tried) to ${
          pairsSubscribed.length
        } pairs: ${pairsSubscribed.join(", ").substr(0, 100)}`
      );
    });

    const pairStreams = new Map();

    /*
  //connect
  { event: 'subscribed',
    channel: 'book',
    chanId: 1220186,
    symbol: 'tXRPUSD',
    prec: 'P0',
    freq: 'F0',
    len: '25',
    pair: 'XRPUSD' }
  */

    let source = fromEvent(ws, "message").pipe(
      map(event => event.data),
      map(data => JSON.parse(data))
    );

    source
      .pipe(filter(data => data.event === "error"))
      .subscribe(err => console.log(`⭕️   ${exConfig.name} ws error`, err));

    //save subscribed pairs/streams
    source
      .pipe(
        filter(data => data.event === "subscribed"),
        map(({ chanId, pair }) => [chanId, pair])
      )
      .subscribe(([chanId, pair]) => pairStreams.set(chanId, pair));

    /* 
    //update
    [ 1220186,
      [ [ 0.45861, 2, 1591.47202851 ],...]
  */
    //map order-books to opened streams
    source
      .pipe(
        filter(data => Array.isArray(data)),
        filter(([, message]) => message !== "hb"), //heartbeat
        map(([chanId, message]) => {
          let pair = pairStreams.get(chanId);

          return {
            pair,
            message,
          };
        })
      )
      .subscribe(data => {
        let { pair, message } = data;

        if (Array.isArray(message[0])) {
          initBook(message, pair);
        } else {
          updateBook(message, pair);
        }
      });

    //todo: rx-ify this
    const orderBooks = new Map();

    function initBook(initData, pair) {
      const toKeyValue = ([price, count, amount]) => [
        //key
        price,
        //value
        { price, volume: Math.abs(amount) },
      ];

      const bidsKeyValues = initData
        .filter(([price, count, amount]) => amount > 0)
        .map(toKeyValue);
      const asksKeyValues = initData
        .filter(([price, count, amount]) => amount < 0)
        .map(toKeyValue);

      const orderbook = {
        bids: new Map(bidsKeyValues),
        asks: new Map(asksKeyValues),
      };

      orderBooks.set(pair, orderbook);
    }

    function updateBook(updateData, pair) {
      let [price, count, amount] = updateData;
      let orderbook = orderBooks.get(pair);

      if (count > 0) {
        //add or update
        if (amount > 0) {
          //update bids
          orderbook.bids.set(price, { price, volume: Math.abs(amount) });
        } else if (amount < 0) {
          //update asks
          orderbook.asks.set(price, { price, volume: Math.abs(amount) });
        }
      } else if (count === 0) {
        //delete price level
        if (amount === 1) {
          //remove bid
          orderbook.bids.delete(price);
        } else if (amount === -1) {
          //remove ask
          orderbook.asks.delete(price);
        }
      }

      if (orderbook.asks.size < 2) {
        console.log("📕  low ask", new Date().toLocaleString(), orderbook);
      }

      if (orderbook.bids.size < 2) {
        console.log("📗  low bid", new Date().toLocaleString(), orderbook);
      }

      produceBook(orderbook, pair);
    }

    function produceBook(orderbook, localPair) {
      let maxBidPrice = Math.max(...orderbook.bids.keys());
      let minAskPrice = Math.min(...orderbook.asks.keys());

      let { globalPair } = pairs.find(p => p.localPair === localPair);

      const bookTop = {
        exName: exConfig.name,
        pair: globalPair,
        bid: orderbook.bids.get(maxBidPrice),
        ask: orderbook.asks.get(minAskPrice),
      };

      //todo: bitfinex loosing bid sometimes - investigate this shit!
      if (!bookTop.bid || !bookTop.ask) {
        console.log(`💩  ${exConfig.name} bid/ask lost!`);
        console.log(`bid:${maxBidPrice}, ask: ${minAskPrice}`);
        console.log(bookTop);
        console.log(orderbook);
      }

      subject.next(bookTop);
    }
  } //connect

  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
