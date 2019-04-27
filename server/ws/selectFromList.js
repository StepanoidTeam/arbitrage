const { consoleReducer } = require("./consoleReducer");

async function selectFromList(options = []) {
  const selectedOption = await consoleReducer({
    initialState: {
      options,
      total: options.length,
      current: 0,
    },
    callback: state => {
      const menu = state.options
        .map((option, index) => {
          const char = index === state.current ? "👉 " : "  ";
          return char + option;
        })
        .join("\n");

      console.clear();
      console.log(
        "select one from list ⬆️ ⬇️ (ctrl-c to exit) [ENTER] to select"
      );
      console.log(menu);
    },
    keyBindings: [
      {
        key: "down",
        callback: (state, resolve) => {
          state.current++;
          if (state.current >= state.total) state.current = 0;
        },
      },
      {
        key: "up",
        callback: (state, resolve) => {
          state.current--;
          if (state.current < 0) state.current = state.total - 1;
        },
      },
      {
        key: "return",
        callback: (state, resolve) => {
          resolve(state.options[state.current]);
        },
      },
    ],
  });

  return selectedOption;
}

module.exports = { selectFromList };

(async () => {
  console.log(await selectFromList(["some", "options", "here"]));
})();
