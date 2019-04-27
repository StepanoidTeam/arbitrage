const readline = require("readline");

function consoleReadKey() {
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.once("keypress", (str, key) => {
      process.stdin.pause();
      process.stdin.setRawMode(false);
      // stop on ctrl+c
      if (key.ctrl && key.name === "c") process.exit();

      resolve(key);
    });
  });
}

module.exports = { consoleReadKey };
