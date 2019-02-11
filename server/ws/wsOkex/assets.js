// https://www.okex.com/docs/en/#account-currencies

// server time - https://www.okex.com/api/general/v3/time
// crypto-js - https://github.com/brix/crypto-js

const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");

const {
  exchanges: { okex: exConfig },
} = require("../../configs");

const { apiKey, secretKey, passphrase } = exConfig;

function getCoins() {
  const assetsPath = "/api/account/v3/currencies";
  const assetsInfoUrl = `https://www.okex.com${assetsPath}`;

  const timestamp = Date.now() / 1000;

  sign = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(timestamp + "GET" + assetsPath, secretKey)
  );

  return fetch(assetsInfoUrl, {
    headers: {
      "Content-Type": "application/json",
      "OK-ACCESS-KEY": apiKey,
      "OK-ACCESS-SIGN": sign,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-PASSPHRASE": passphrase,
    },
  }).then(data => data.json());
}

async function getPairs() {
  const { data } = await fetch(
    "https://www.okex.com/v2/spot/markets/products"
  ).then(response => response.json());

  const pairs = data;

  return pairs;
}

async function getAllowedPairsAsync() {
  const [coins, pairs] = [await getCoins(), await getPairs()];

  //todo: what would be faster: check suspended, or check opened?
  const enabledChargeWithdraw = ({ can_deposit, can_withdraw }) =>
    can_deposit && can_withdraw;

  const suspendedCoinCodes = coins
    .filter(coin => !enabledChargeWithdraw(coin))
    .map(({ currency }) => currency.toLowerCase());

  const allowedPairs = pairs
    // trading is open?
    .filter(({ online }) => online === 1)
    //no suspended coins
    .filter(({ symbol }) => !suspendedCoinCodes.includes(symbol.split("_")[0]))
    .map(({ symbol: localPair }) => ({ localPair }));

  return allowedPairs;
}

module.exports = { getAllowedPairsAsync, getPairs, getCoins };
