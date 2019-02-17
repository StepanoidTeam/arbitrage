const fetch = require("node-fetch");

function getCoins() {
  const assetsInfoUrl = "https://www.hbg.com/-/x/pro/v2/beta/common/currencies";

  return fetch(assetsInfoUrl)
    .then(data => data.json())
    .then(({ data }) => data);
}

function getPairs() {
  const pairsUrl = "https://www.hbg.com/-/x/pro/v2/beta/common/symbols";

  return fetch(pairsUrl)
    .then(data => data.json())
    .then(({ data }) => data);
}

async function getAllowedPairsAsync() {
  const [coins, pairs] = [await getCoins(), await getPairs()];

  //todo: what would be faster: check suspended, or check opened?
  const enabledChargeWithdraw = ({ deposit_enabled, withdraw_enabled }) =>
    deposit_enabled && withdraw_enabled;

  // remove suspended coins
  const suspendedCoinCodes = coins
    // deposit?
    .filter(coin => !enabledChargeWithdraw(coin))
    .map(({ currency_code }) => currency_code);

  //todo: remove symbol status === break pairs
  const allowedPairs = pairs
    // trading is open
    .filter(({ trade_enabled }) => trade_enabled === true)
    //no suspended coins
    .filter(({ base_currency }) => !suspendedCoinCodes.includes(base_currency))
    .map(({ symbol_code: localPair }) => ({ localPair }));

  return allowedPairs;
}

module.exports = { getAllowedPairsAsync };
