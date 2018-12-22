const fetch = require("node-fetch");

function getCoins() {
  const assetsInfoUrl =
    "https://www.binance.com/assetWithdraw/getAllAsset.html";

  return fetch(assetsInfoUrl).then(data => data.json());
}

function getPairs() {
  const pairsUrl = "https://api.binance.com/api/v1/exchangeInfo";

  return fetch(pairsUrl)
    .then(data => data.json())
    .then(data => data.symbols);
}

async function getAllowedPairsAsync() {
  const [coins, pairs] = [await getCoins(), await getPairs()];

  //todo: what would be faster: check suspended, or check opened?
  const enabledChargeWithdraw = ({ enableCharge, enableWithdraw }) =>
    enableCharge && enableWithdraw;

  // remove suspended coins
  const suspendedCoinCodes = coins
    // deposit?
    .filter(coin => !enabledChargeWithdraw(coin))
    .map(({ assetCode }) => assetCode);

  //todo: remove symbol status === break pairs
  const allowedPairs = pairs
    // trading is open
    .filter(({ status }) => status === "TRADING")
    //no suspended coins
    .filter(({ baseAsset }) => !suspendedCoinCodes.includes(baseAsset))
    .map(({ symbol }) => symbol);

  return allowedPairs;
}

module.exports = { getAllowedPairsAsync };
