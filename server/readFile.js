const fs = require("fs");
const { maxBy, minBy, round } = require("lodash");

const { progress } = require("./cli-progress");
const { appendJSONToFile, readLines } = require("./file");

let logFileName = process.argv[2];
const getFilePath = fileName => `./logs/${fileName}`;
const timeframeArr = readLines(getFilePath(logFileName));

function getStatsFromTimeframe(timeframe) {
  let exMinAsk = minBy(timeframe, exTF => +exTF.ask.price);
  let exMaxBid = maxBy(timeframe, exTF => +exTF.bid.price);

  let priceDiff = exMaxBid.bid.price - exMinAsk.ask.price;
  let priceDiffPt = (priceDiff / exMinAsk.ask.price) * 100;
  let availVolume = Math.min(exMinAsk.ask.volume, exMaxBid.bid.volume);
  let availProfit = availVolume * priceDiff;

  // console.log(
  //   `[BUY] min ask:`,
  //   [+exMinAsk.ask.price],
  //   [+exMinAsk.ask.volume],
  //   [exMinAsk.exName]
  // );
  // console.log(
  //   `[SEL] max bid:`,
  //   [+exMaxBid.bid.price],
  //   [+exMaxBid.bid.volume],
  //   [exMaxBid.exName]
  // );

  // console.log(
  //   `
  //     max.price diff: $${round(priceDiff, 3)} (${round(priceDiffPt, 3)}%)
  //     avail. volume: ${round(availVolume, 3)}btc
  //     avail. vigoda: ${round(availProfit, 3)}$
  //     `
  // );

  return {
    exMinAsk,
    exMaxBid,
    priceDiff,
    priceDiffPt,
    availVolume,
    availProfit
  };
}

for (let tfIndex in timeframeArr) {
  let timeframe = JSON.parse(timeframeArr[tfIndex]);
  let diffStats = getStatsFromTimeframe(timeframe);
  appendJSONToFile("./logs/stats.js", diffStats);

  progress({
    current: tfIndex,
    max: timeframeArr.length - 1,
    message: "calc stats"
  });
}

console.log("done", timeframeArr.length);
