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
    //todo: rx-ify this
    let orderBooks = {};

    const ws = new WebSocket("wss://api.bitfinex.com/ws/2");

    ws.on("close", () => {
      logger.disconnected(exConfig);
      //todo: reconnect!
      setTimeout(() => connect(), 3000);
    });

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

    function produceBook(orderBook, localPair) {
      const ob = Array.from(orderBook).map(x => x[1]);
      const bids = sortBy(ob.filter(x => x[2] > 0), x => x[0]).reverse();
      const asks = sortBy(ob.filter(x => x[2] < 0), x => x[0]);

      let { globalPair } = pairs.find(p => p.localPair === localPair);

      const bookTop = {
        exName: exConfig.name,
        pair: globalPair,
        bid: bids
          .slice(0, depth)
          .map(([price, count, volume]) => ({ price, volume }))
          .shift(),
        ask: asks
          .slice(0, depth)
          .map(([price, count, volume]) => ({ price, volume: -volume }))
          .shift(),
      };

      //todo: bitfinex loosing bid sometimes - investigate this shit!
      if (!bookTop.bid || !bookTop.ask) {
        console.log(`💩  ${exConfig.name} bid/ask lost!`);
        console.log(bookTop);
        console.log(orderBook);
        console.log(ob);
      }

      subject.next(bookTop);
      return bookTop;
    }

    let source = fromEvent(ws, "message").pipe(
      map(event => event.data),
      map(data => JSON.parse(data))
    );

    const pairStreams = [];

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
    //save opened streams
    source
      .pipe(
        filter(data => data.event === "subscribed"),
        map(({ chanId, pair }) => ({
          chanId,
          pair,
        }))
        //tap(data => console.log(data))
      )
      .subscribe(stream => pairStreams.push(stream));

    /* 
    //update
    [ 1220186,
      [ [ 0.45861, 2, 1591.47202851 ],...]
  */
    //map orderbooks to opened streams
    source
      .pipe(
        filter(data => Array.isArray(data)),
        map(([chanId, orderBook]) => {
          let stream = pairStreams.find(stream => stream.chanId === chanId);
          // console.log("@stream", stream);
          return {
            pair: stream.pair,
            orderBook,
          };
        })
      )
      .subscribe(data => onWsMessage(data));

    function onWsMessage({ pair, orderBook }) {
      if (Array.isArray(orderBook[0])) {
        initBook(orderBook, pair);
      } else {
        updateBook(orderBook, pair);
      }
    }

    function initBook(orderBook, pair) {
      const mapOrder = data => [data[0], data];
      orderBooks[pair] = new Map(orderBook.map(mapOrder));
    }

    function updateBook(data, pair) {
      let [price, count, amount] = data;

      if (count > 0) {
        //add or update
        orderBooks[pair].set(price, [price, count, amount]);
      } else {
        //delete
        orderBooks[pair].delete(price);
      }

      produceBook(orderBooks[pair], pair);
    }
  }

  setImmediate(() => connect());

  return subject;
}

module.exports = { getSourceForPairs };
