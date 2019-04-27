const { consoleReducer } = require("./consoleReducer");

const LIST_MAX_LENGTH = 10;

async function selectFromList(options = []) {
  const selectedOption = await consoleReducer({
    initialState: {
      options,
      total: options.length,
      current: 0,
    },
    callback: state => {
      const from = Math.max(0, state.current - LIST_MAX_LENGTH / 2);
      const to = Math.min(state.total, state.current + LIST_MAX_LENGTH / 2);

      const menu = state.options
        .map((option, index) => {
          const char = index === state.current ? "👉 " : "  ";
          return char + option;
        })
        .slice(from, to)
        .join("\n");

      console.clear();
      console.log(
        `select one from list ⬆️ ⬇️ `,
        { cur: state.current, total: state.total },
        `[ENTER] to select (ctrl-c to exit)`
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
