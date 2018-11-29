const WebSocket = require("ws");
const sortBy = require("lodash/sortBy");

const { fromEvent, Subject } = require("rxjs");
const { map, filter } = require("rxjs/operators");

const {
  exchanges: { bitfinex },
  getLocalPairs,
} = require("../configs");

function getSourceForPairs(globalPairs = []) {
  let pairs = getLocalPairs(globalPairs, bitfinex);
  //limitation just because bitfinex
  // gives different response when sub to 1 or 2-n pairs
  if (pairs.length < 2)
    throw new Error("bitfinex ws works with 2 pairs minimum, sorry");

  const subject = new Subject();

  //todo: rx-ify this
  let orderBooks = {};
  const depth = 5;
  const ws = new WebSocket("wss://api.bitfinex.com/ws/2");

  //todo: reconnect!
  ws.onclose = () => {
    console.log(`❌   ${bitfinex.name} disconnected`);
  };

  ws.on("open", () => {
    console.log(`${bitfinex.name} - connected`);
    pairs
      .map(({ localPair: symbol }) => ({
        event: "subscribe",
        channel: "book",
        symbol,
      }))
      .forEach(msg => {
        ws.send(JSON.stringify(msg));
        //todo: debounce these messages
        console.log(`✅  ${bitfinex.name} - subscribed for: ${msg.symbol}`);
      });
  });

  function produceBook(orderBook, localPair) {
    const ob = Array.from(orderBook).map(x => x[1]);
    const bids = sortBy(ob.filter(x => x[2] > 0), [x => x[0]]).reverse();
    const asks = sortBy(ob.filter(x => x[2] < 0), x => x[0]);

    let { globalPair } = pairs.find(p => p.localPair === localPair);

    const bookTop = {
      exName: bitfinex.name,
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

  //source.subscribe(data => console.log(data));

  return subject;
}

module.exports = { getSourceForPairs };
