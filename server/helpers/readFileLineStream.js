const fs = require("fs");
const readline = require("readline");

const { Subject } = require("rxjs");

function readFileLineStream(filepath) {
  const subject = new Subject();
  const fileStream = fs.createReadStream(filepath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  rl.on("line", line => {
    subject.next(line);
  });

  rl.on("close", () => {
    subject.complete();
  });

  return subject;
}

module.exports = { readFileLineStream };
