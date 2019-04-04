// https://github.com/gateio/rest/blob/master/nodejs/lib/gate.js

const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");

const {
  exchanges: { gate: exConfig },
} = require("../configs");

const { apiKey, secretKey } = exConfig;

const API_TRADE_URL = "https://api.gateio.co/";

function processRequest(endpoint, body = {}) {
  const requestUrl = `${API_TRADE_URL}${endpoint.uri}`;

  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(`${new URLSearchParams(body)}`, secretKey)
  );

  const fetchUrl = `${requestUrl}`;

  console.log(fetchUrl);

  return fetch(fetchUrl, {
    method: "POST",
    json: true,
    headers: {
      KEY: apiKey,
      SIGN: signature,
    },
    body: new URLSearchParams(body),
    //form: requestBody,
  }).then(data => data.json());
}

function setOrder() {
  const endpoint = { method: "POST", uri: "api2/1/private/buy" };
  //const orderUrl = `https://api.gateio.io${orderPath}`;

  const body = {
    currencyPair: "btc_usdt",
    amount: 0.1,
    rate: 3000, // price
    //orderType: "", // ioc - Immediate-Or-Cancel //timeInForce

    //...{ currencyPair: "usdt_cnyx", orderNumber: 1 },
  };

  return processRequest(endpoint, body);
}

function mapBalances(balances) {
  return Object.entries(balances)
    .map(([asset, value]) => ({
      name: asset,
      value,
    }))
    .filter(coin => +coin.value > 0);
}

function getBalances() {
  const BALANCE_URL = "api2/1/private/balances";

  const endpoint = { method: "GET", uri: BALANCE_URL };
  const body = {};

  return processRequest(endpoint, body)
    .then(data => data.available)
    .then(mapBalances);
}

module.exports = {
  setOrder,
  getBalances,
};
