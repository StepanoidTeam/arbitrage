const fetch = require("node-fetch");

function getCoins() {
  const assetsInfoUrl = "https://api.hitbtc.com/api/2/public/currency";

  return fetch(assetsInfoUrl).then(data => data.json());
}

function getPairs() {
  const pairsUrl = "https://api.hitbtc.com/api/2/public/symbol";

  return fetch(pairsUrl).then(data => data.json());
  //.then(data => data.symbols);
}

async function getAllowedPairsAsync() {
  const [coins, pairs] = [await getCoins(), await getPairs()];

  //todo: what would be faster: check suspended, or check opened?
  const enabledChargeWithdraw = ({ payinEnabled, payoutEnabled }) =>
    payinEnabled && payoutEnabled;

  // remove suspended coins
  const suspendedCoinCodes = coins
    // deposit?
    .filter(coin => !enabledChargeWithdraw(coin))
    .map(({ id }) => id);

  //todo: remove symbol status === break pairs
  const allowedPairs = pairs
    // trading is open
    // no info about pair is trading or not for HITBTC
    //.filter(({ status }) => status === "TRADING")
    //no suspended coins
    .filter(({ baseCurrency }) => !suspendedCoinCodes.includes(baseCurrency))
    .map(({ id: localPair }) => ({ localPair }));

  return allowedPairs;
}

module.exports = { getAllowedPairsAsync, getCoins, getPairs };
