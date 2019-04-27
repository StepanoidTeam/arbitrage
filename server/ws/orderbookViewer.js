const { navigateUpDown } = require("./navigateUpDown");
const { checkBrokenBook } = require("./checkBrokenBook");
const { readFileLineStream } = require("../helpers/readFileLineStream");

const stats = {
  ok: 0,
  broken: 0,
  total: 0,
  current: 0,
};
const books = [];

readFileLineStream(
  "logs/log.orderbook-test.bittrex.1556292501580.nosql" //btc mine
  //"logs/log.orderbook-test.bittrex_BAT.1556313842451.nosql" //bat norb
  //"logs/log.orderbook-test.bittrex.1556315220867.nosql" //dash norb
).subscribe(
  data => {
    data = JSON.parse(data);
    if (checkBrokenBook(data)) {
      stats.broken++;
    } else {
      stats.ok++;
    }
    stats.total++;
    books.push(data);
  },
  () => {
    //error
  },
  () => {
    //done
    console.log(stats);
    console.log("navigate using arrows (ctrl-c to exit)");

    (async () => {
      let key;
      while (
        ((key = await navigateUpDown().catch(e => {
          console.log("stopped");
          return false;
        })),
        key)
      ) {
        switch (key) {
          case "up": {
            stats.current--;
            break;
          }
          case "down": {
            stats.current++;
            break;
          }
        }
        if (stats.current < 0) stats.current = stats.total - 1;
        if (stats.current >= stats.total) stats.current = 0;
        console.clear();
        const book = books[stats.current];
        const bookState = !checkBrokenBook(book);
        console.log(`📒   ${stats.current} / ${stats.total}`);
        console.log(bookState ? "✅   ok" : "🅱️   broken");
        console.log(book);
      }
    })();
  }
);
