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
  const inputLogPath = `./logs/log.${logName}.nosql`;
  const maxLogPath = `./logs/log.${logName}.max.csv`;
  const minLogPath = `./logs/log.${logName}.min.csv`;

  //var DB = nosql.load(logPath);

  let count = 0;
  let statsStream = getFileLineStream(inputLogPath).pipe(
    map(raw => JSON.parse(raw)),
    map(stats => ({
      datetime: new Date(stats.timestamp).toLocaleString().replace(",", ""),
      ...stats,
    })),
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
  altCoin,
  mainCoin,
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
  availVolumeByAvgPrice,
  netProfit,
}) {
  return {
    datetime,
    altCoin,
    mainCoin,
    pair,
    minAskExName,
    minAskPrice,
    maxBidExName,
    maxBidPrice,
    priceDiffPt,
    availVolume,
    availVolumeByAvgPrice,
    netProfit,
  };
}

// timeframe gets from 1st argument
dbToCsv(process.argv[2]);
