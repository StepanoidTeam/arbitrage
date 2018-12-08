const { maxBy, minBy } = require("lodash");

const { exchanges } = require("./configs");

//timeframe is data about 1 pair, for all related exchanges, in 1 moment of time
//it contains top bid/ask for each exchange, for 1 pair

/* 
  https://en.wikipedia.org/wiki/Triangular_number

  T = n*(n-1)/2

  1 2 3 4 5  6
  0 1 3 6 10 15
*/

function getStatsFromTimeframe(timeframe) {
  if (
    !timeframe.every(exTF => exTF.bid) ||
    !timeframe.every(exTF => exTF.ask)
  ) {
    //todo: we need to go deeper, to understand this error, when bid is empty
    console.log(`🤬  timeframe bid/ask lost error`);
    console.log(JSON.stringify(timeframe));
    return [];
  }

  //todo: get all avail profitable deals, not only the best, return as array/observable?

  //get all bids
  //get all asks

  //get min ask
  //get max bid

  //todo: netprofit at first!
  let exMinAsk = minBy(timeframe, exTF => +exTF.ask.price);
  let exMaxBid = maxBy(timeframe, exTF => +exTF.bid.price);

  let priceDiff = exMaxBid.bid.price - exMinAsk.ask.price;
  let priceDiffPt = (priceDiff / exMinAsk.ask.price) * 100;
  let availVolume = Math.min(exMinAsk.ask.volume, exMaxBid.bid.volume);
  let availProfit = availVolume * priceDiff;

  let avgPrice = (exMaxBid.bid.price + exMinAsk.ask.price) / 2;

  let mainAvailVolumeAvg = availVolume * avgPrice;

  //todo: minimalo4ka

  //todo: bad proverka
  if (exMinAsk.exName === exMaxBid.exName) {
    //same exchange
    return [];
  }

  //get net profit
  let buyFeePt = exchanges[exMinAsk.exName].fees.taker;
  let sellFeePt = exchanges[exMaxBid.exName].fees.taker;

  let buyFee = (exMinAsk.ask.price * availVolume * buyFeePt) / 100;
  let sellFee = (exMaxBid.bid.price * availVolume * sellFeePt) / 100;

  let netProfit = availProfit - buyFee - sellFee;

  let { pair } = exMinAsk;

  let stats = {
    datetime: new Date().toLocaleString().replace(",", ""),
    pair,
    exMinAsk,
    exMaxBid,
    priceDiff,
    priceDiffPt,
    availVolume,
    mainAvailVolumeAvg,
    availProfit,
    netProfit,
  };

  //only one for now
  return [stats];
}

module.exports = { getStatsFromTimeframe };
