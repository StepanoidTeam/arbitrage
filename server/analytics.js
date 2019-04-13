const { exchanges } = require("./configs");

//timeframe is an array with data about 1 pair, for all related exchanges, in 1 moment of time
//it contains top bid/ask for each exchange, for 1 pair

/* 
  not our case - https://en.wikipedia.org/wiki/Triangular_number

  T = n*n-n
*/

function getExPairsFromTimeframe(timeframe) {
  let result = timeframe
    //filter when ask lost - ie bitfinex
    .filter(exAsk => exAsk.ask !== undefined)
    //flatmap
    .reduce(
      (acc, exAsk) =>
        acc.concat(
          timeframe
            //filter when bid lost - ie bitfinex
            .filter(exBid => exBid.bid !== undefined)
            //get ex pair
            .map(exBid => ({ exAsk, exBid }))
        ),
      []
    )
    //filter same ex
    .filter(({ exAsk, exBid }) => exAsk.exName !== exBid.exName)
    //filter negative deals
    .filter(({ exAsk, exBid }) => exAsk.ask.price < exBid.bid.price);

  return result;
}

function getStatsForExPair({ exAsk, exBid }) {
  let priceDiff = exBid.bid.price - exAsk.ask.price;
  let priceDiffPt = (priceDiff / exAsk.ask.price) * 100;

  //todo: minimalo4ka calc
  let availVolume = Math.min(exAsk.ask.volume, exBid.bid.volume);

  let availProfit = availVolume * priceDiff;

  let avgPrice = (exBid.bid.price + exAsk.ask.price) / 2;

  let availVolumeByAvgPrice = availVolume * avgPrice;

  //get net profit
  let buyFeePt = exchanges[exAsk.exName].fees.taker;
  let sellFeePt = exchanges[exBid.exName].fees.taker;

  let buyFee = (exAsk.ask.price * availVolume * buyFeePt) / 100;
  let sellFee = (exBid.bid.price * availVolume * sellFeePt) / 100;

  let netProfit = availProfit - buyFee - sellFee;

  let { pair } = exAsk;

  let [altCoin, mainCoin] = pair.split("_");

  let stats = {
    timestamp: Date.now(),
    altCoin,
    mainCoin,
    pair,
    exMinAsk: exAsk,
    exMaxBid: exBid,
    priceDiff,
    priceDiffPt,
    availVolume,
    availVolumeByAvgPrice,
    availProfit,
    netProfit,
  };

  return stats;
}

function getStatsFromTimeframe(timeframe) {
  let exPairs = getExPairsFromTimeframe(timeframe);

  let statsArr = exPairs.map(getStatsForExPair);

  return statsArr;
}

module.exports = { getStatsFromTimeframe };
