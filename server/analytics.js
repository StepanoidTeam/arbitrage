const { maxBy, minBy } = require("lodash");

const { exchanges } = require("./configs");

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

  //get net profit
  let buyFeePt = exchanges[exMinAsk.exName].fees.taker;
  let sellFeePt = exchanges[exMaxBid.exName].fees.taker;

  let buyFee = (exMinAsk.ask.price * availVolume * buyFeePt) / 100;
  let sellFee = (exMaxBid.bid.price * availVolume * sellFeePt) / 100;

  let netProfit = availProfit - buyFee - sellFee;

  let { pair } = exMinAsk;

  let stats = {
    timestamp: Date.now(),
    pair,
    exMinAsk,
    exMaxBid,
    priceDiff,
    priceDiffPt,
    availVolume,
    availProfit,
    netProfit,
  };

  return stats;
}

module.exports = { getStatsFromTimeframe };
