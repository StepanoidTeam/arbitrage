const { selectFromDir } = require("./selectFromDir");
const { checkBrokenBook } = require("./checkBrokenBook");
const { readFileLineStream } = require("../helpers/readFileLineStream");
const { consoleReducer } = require("./consoleReducer");

(async () => {
  const stats = {
    ok: 0,
    broken: 0,
    total: 0,
    current: 0,
    skipped: 0,
    lastNonce: null,
    firstNonce: null,
  };
  const books = [];

  const filePath = await selectFromDir("logs", /log\.orderbook(.+)\.nosql$/);

  readFileLineStream(filePath).subscribe(
    data => {
      data = JSON.parse(data);

      if (data.jsonDebugData) {
        if (stats.lastNonce !== null) {
          // next - current
          const diff = stats.lastNonce - data.jsonDebugData.N;

          if (diff > 1) {
            stats.skipped += diff - 1;
          }
        } else {
          stats.firstNonce = data.jsonDebugData.N;
        }

        stats.lastNonce = data.jsonDebugData.N;
      }

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
    navigateOrderbooks
  );

  async function navigateOrderbooks() {
    await consoleReducer({
      initialState: stats,
      callback: state => {
        console.clear();

        const book = books[state.current];
        const bookState = !checkBrokenBook(book);
        console.log("navigate using arrows (ctrl-c to exit)");
        console.log(state);
        console.log(
          "skip %",
          stats.skipped / (stats.firstNonce - stats.lastNonce)
        );
        console.log(bookState ? "✅   ok" : "❌   broken");
        console.log({ ...book, jsonDebugData: "" });
        console.log({
          N: book.jsonDebugData.N,
          Z: book.jsonDebugData.Z.slice(0, 10),
          S: book.jsonDebugData.S.slice(0, 10),
        });
      },
      keyBindings: [
        {
          key: "up",
          callback: (state, resolve) => {
            state.current++;
            if (state.current >= state.total) state.current = 0;
          },
        },
        {
          key: "down",
          callback: (state, resolve) => {
            state.current--;
            if (state.current < 0) state.current = state.total - 1;
          },
        },
        {
          key: "return",
          callback: (state, resolve) => {
            resolve(null);
          },
        },
      ],
    });
  }
})();
