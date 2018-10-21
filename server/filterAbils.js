const fs = require("fs");
const { maxBy, minBy, round, sortBy, uniqBy } = require("lodash");

const { progress } = require("./cli-progress");
const { appendJSONToFile, readLines } = require("./file");

let logFileName = process.argv[2];
const getFilePath = filename => `./logs/${filename}`;
const statsArr = readLines(getFilePath(logFileName));

let allProfits = [];
for (let statIndex in statsArr) {
  let statsRaw = statsArr[statIndex];
  if (statsRaw.length === 0) {
    console.log("end");
    break;
  }

  let stats = JSON.parse(statsRaw);

  allProfits.push(stats);

  progress({
    current: statIndex,
    max: statsArr.length - 1,
    message: "get profits"
  });
}

console.log("sorting");

let top10 = sortBy(allProfits, "availProfit");

top10 = uniqBy(top10, "availProfit")
  .reverse()
  .slice(0, 5);

console.log(
  top10.map(
    ({
      availProfit,
      exMinAsk: { ask, exName: askEx },
      exMaxBid: { bid, exName: bixEx }
    }) => ({
      availProfit,
      bid,
      bixEx,
      ask,
      askEx
    })
  )
);

console.log("done", statsArr.length);
