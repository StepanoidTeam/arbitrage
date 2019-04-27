const { consoleReducer } = require("./consoleReducer");

(async () => {
  let result = await consoleReducer({
    initialState: { index: 0 },
    callback: state => {
      console.log(state);
    },
    keyBindings: [
      {
        key: "up",
        callback: (state, resolve) => {
          state.index++;
        },
      },
      {
        key: "down",
        callback: (state, resolve) => {
          state.index--;
        },
      },
      {
        key: "return",
        callback: (state, resolve) => {
          resolve(state.index);
        },
      },
    ],
  });
})();
