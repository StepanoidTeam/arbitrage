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
  };
  const books = [];

  const filePath = await selectFromDir("logs", /log\.orderbook(.+)\.nosql$/);

  readFileLineStream(filePath).subscribe(
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
        console.log(bookState ? "✅   ok" : "🅱️   broken");
        console.log(book);
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
