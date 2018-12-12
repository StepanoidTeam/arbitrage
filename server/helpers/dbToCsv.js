//todo: optimize & refac, cause now it's main bottleneck for bot
const { Subject } = require("rxjs");
const { map, tap, first, distinctUntilChanged } = require("rxjs/operators");
const nosql = require("nosql");
const fs = require("fs");
const readline = require("readline");

const { appendTextToFile } = require("./file");
const { getCsvHeaders, getCsvValues } = require("./csv");

const { consoleRewrite } = require("./cli-progress");

function getFileLineStream(filepath) {
  const subject = new Subject();
  const fileStream = fs.createReadStream(filepath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // for (const line of rl) {
  //   subject.next(line);
  // }

  rl.on("line", line => {
    subject.next(line);
  });

  return subject;
}

function dbToCsv(logName) {
  //makeDir(`./logs/kek`);

  const inputLogPath = `./logs/log.${logName}.nosql`;
  const maxLogPath = `./logs/log.${logName}.max.csv`;
  const minLogPath = `./logs/log.${logName}.min.csv`;

  //var DB = nosql.load(logPath);

  let count = 0;
  let statsStream = getFileLineStream(inputLogPath).pipe(
    map(raw => JSON.parse(raw)),
    tap(() => consoleRewrite(`processed: ${++count} lines`))
  );

  statsStream.pipe(first()).subscribe(stats => {
    appendTextToFile(maxLogPath, getCsvHeaders(stats));
    appendTextToFile(minLogPath, getCsvHeaders(getMiniStats(stats)));
  });

  statsStream.subscribe(stats => {
    appendTextToFile(maxLogPath, getCsvValues(stats));
  });

  statsStream.pipe(distinctUntilChanged(sameMiniStats)).subscribe(stats => {
    appendTextToFile(minLogPath, getCsvValues(getMiniStats(stats)));
  });
}

//do we need this?
const getMainCoin = pair => {
  let [, mainCoin] = pair.split("_");
  return mainCoin;
};

function sameMiniStats(ms1, ms2) {
  return (
    ms1.minAskExName === ms2.minAskExName &&
    ms1.minAskPrice === ms2.minAskPrice &&
    ms1.maxBidExName === ms2.maxBidExName &&
    ms1.maxBidPrice === ms2.maxBidPrice &&
    ms1.availVolume === ms2.availVolume &&
    ms1.netProfit === ms2.netProfit
  );
}

function getMiniStats({
  datetime,
  pair,
  exMinAsk: {
    exName: minAskExName,
    ask: { price: minAskPrice },
  },
  exMaxBid: {
    exName: maxBidExName,
    bid: { price: maxBidPrice },
  },
  priceDiffPt,
  availVolume,
  mainAvailVolumeAvg,
  netProfit,
}) {
  return {
    datetime,
    pair,
    minAskExName,
    minAskPrice,
    maxBidExName,
    maxBidPrice,
    priceDiffPt,
    availVolume,
    mainAvailVolumeAvg,
    netProfit,
  };
}

//todo: set log timeframe here
dbToCsv("1544564969969");
