const { consoleReadKey } = require("./consoleReadKey");

async function consoleReducer({
  initialState: state = {},
  keyBindings = [],
  callback = () => {},
}) {
  return new Promise(async resolve => {
    let exit = false;
    do {
      callback(state);

      const key = await consoleReadKey();

      const binding = keyBindings.find(kb => kb.key === key.name);

      if (binding)
        binding.callback(state, value => {
          exit = true;
          resolve(value);
        });
    } while (!exit);
  });
}

module.exports = { consoleReducer };
