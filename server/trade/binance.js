// https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
// https://github.com/binance-exchange/binance-api-node/blob/master/src/http.js

const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");

// Too many parameters; expected '6'
// https://github.com/baitercel/binance-api-php/issues/1

const {
  exchanges: { binance: exConfig },
} = require("../configs");

const { apiKey, secretKey } = exConfig;

function processRequest(endpoint, body = {}) {
  const requestUrl = `https://api.binance.com${endpoint.uri}`;
  const timestamp = Date.now();

  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA256(
      `${new URLSearchParams({ ...body, timestamp })}`,
      secretKey
    )
  );

  const fetchUrl = `${requestUrl}?${new URLSearchParams({
    ...body,
    timestamp,
    signature,
  })}`;

  console.log(fetchUrl);

  return fetch(fetchUrl, {
    method: endpoint.method,
    json: true,
    headers: {
      //"Content-Type": "application/json",
      "X-MBX-APIKEY": apiKey,
    },
    //body: requestBody,
  }).then(data => data.json());
}

function setOrder() {
  const endpoint = { method: "POST", uri: "/api/v3/order" };

  const requestBody = {
    symbol: "BNBBTC",
    side: "BUY", //SELL
    type: "LIMIT",
    timeInForce: "GTC", // IOC GTC - https://www.reddit.com/r/BinanceExchange/comments/8odvs4/question_about_time_in_force_binance_api/
    quantity: 1,
    price: 0.004,
  };
}

function getAccountInfo() {
  const endpoint = { method: "GET", uri: "/api/v3/account" };

  return processRequest(endpoint);
}

function mapBalances(balances) {
  return balances.filter(a => +a.free > 0);
}

function getBalances() {
  return getAccountInfo().then(mapBalances);
}

//setOrder().then(data => console.log(data));

module.exports = {
  setOrder,
  getBalances,
};
