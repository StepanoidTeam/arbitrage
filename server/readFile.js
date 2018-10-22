const { maxBy, minBy, round } = require("lodash");

const { exchanges } = require("./exchangeConfigs");
const { progress } = require("./cli-progress");
const { appendJSONToFile, readLines } = require("./file");

function appendNetProfit(stats) {
  let { exMinAsk, exMaxBid, availVolume, availProfit } = stats;

  let buyFeePt = exchanges[exMinAsk.exName].fees.taker;
  let sellFeePt = exchanges[exMaxBid.exName].fees.taker;

  let buyFee = (exMinAsk.ask.price * availVolume * buyFeePt) / 100;
  let sellFee = (exMaxBid.bid.price * availVolume * sellFeePt) / 100;

  let netProfit = availProfit - buyFee - sellFee;

  return { ...stats, netProfit };
}

function getStatsFromTimeframe(timeframe) {
  let exMinAsk = minBy(timeframe, exTF => +exTF.ask.price);
  let exMaxBid = maxBy(timeframe, exTF => +exTF.bid.price);

  let priceDiff = exMaxBid.bid.price - exMinAsk.ask.price;
  let priceDiffPt = (priceDiff / exMinAsk.ask.price) * 100;
  let availVolume = Math.min(exMinAsk.ask.volume, exMaxBid.bid.volume);
  let availProfit = availVolume * priceDiff;

  if (exMinAsk.exName === exMaxBid.exName) {
    //console.log("no profit", availProfit);
    return null;
  }

  let stats = {
    exMinAsk,
    exMaxBid,
    priceDiff,
    priceDiffPt,
    availVolume,
    availProfit,
  };

  return appendNetProfit(stats);
}

const getFilePath = fileName => `./logs/${fileName}.log`;

function updateStatsWithNetProfit(fileName) {
  const statsArr = readLines(getFilePath(fileName));
  const outputFilename = `./logs/upd.${fileName}.${Date.now()}.log`;

  for (let statsIndex in statsArr) {
    if (statsArr[statsIndex].length === 0) break;
    let stats = JSON.parse(statsArr[statsIndex]);

    let updatedStats = appendNetProfit(stats);

    appendJSONToFile(outputFilename, updatedStats);

    progress({
      current: statsIndex,
      max: statsArr.length - 1,
      message: "update stats",
    });
  }

  console.log("done", statsArr.length);
}

function processTimeframes(fileName) {
  const timeframeArr = readLines(getFilePath(fileName));
  const outputFileName = `./logs/upd.stats.${fileName}.${Date.now()}.log`;

  for (let tfIndex in timeframeArr) {
    if (timeframeArr[tfIndex].length === 0) break;
    let timeframe = JSON.parse(timeframeArr[tfIndex]);
    let diffStats = getStatsFromTimeframe(timeframe);
    if (diffStats) {
      appendJSONToFile(outputFileName, diffStats);
    }

    progress({
      current: tfIndex,
      max: timeframeArr.length - 1,
      message: "calc stats",
    });
  }

  console.log("done", timeframeArr.length);
}

function filterStats(fileName, predicates) {
  const statsArr = readLines(getFilePath(fileName));
  const outputFilename = `./logs/f.${fileName}.log`;
  let matched = 0;

  for (let statsIndex in statsArr) {
    if (statsArr[statsIndex].length === 0) break;
    let stats = JSON.parse(statsArr[statsIndex]);

    let ustats = appendNetProfit(stats);

    let matchAll = predicates.map(p => p(ustats)).every(r => r === true);

    if (matchAll) {
      appendJSONToFile(outputFilename, ustats);
      matched++;
    }

    progress({
      current: statsIndex,
      max: statsArr.length - 1,
      message: "update stats",
    });
  }

  console.log(`done, matched ${matched} of ${statsArr.length}`);
}

let logFileName = process.argv[2];

//updateStatsWithNetProfit(logFileName);

function uniqueExchanges({ exMaxBid, exMinAsk }) {
  //return true;
  return exMaxBid.exName !== exMinAsk.exName;
}

function nonZeroProfit({ netProfit }) {
  return netProfit > 0;
}

filterStats(logFileName, [uniqueExchanges, nonZeroProfit]);
//processTimeframes(logFileName);
