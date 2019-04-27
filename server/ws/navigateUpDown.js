const readline = require("readline");

function navigateUpDown() {
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    readline.emitKeypressEvents(process.stdin);

    process.stdin.setRawMode(true);

    process.stdin.once("keypress", (str, key) => {
      process.stdin.pause();
      switch (key.name) {
        case "up": {
          resolve("up");
          break;
        }
        case "down": {
          resolve("down");
          break;
        }
        case "c": {
          if (key.ctrl) process.exit();
          break;
        }
        default: {
          reject();
        }
      }
    });
  });
}

module.exports = { navigateUpDown };
