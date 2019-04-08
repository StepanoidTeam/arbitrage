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

  const requestParams = endpoint.isPublic
    ? new URLSearchParams(body)
    : new URLSearchParams({ ...body, timestamp, signature });

  const fetchUrl = `${requestUrl}?${new URLSearchParams(requestParams)}`;

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

  return processRequest(endpoint, requestBody);
}

function getAccountInfo() {
  const endpoint = { method: "GET", uri: "/api/v3/account" };

  return processRequest(endpoint);
}

function mapBalances(balances) {
  return balances
    .map(({ asset, free }) => ({
      name: asset,
      value: +free,
    }))
    .filter(coin => +coin.value > 0);
}

function getBalances() {
  return getAccountInfo()
    .then(data => data.balances)
    .then(mapBalances);
}

function getAvgPrice(symbol) {
  const endpoint = { method: "GET", uri: "/api/v3/avgPrice", isPublic: true };

  const body = {
    symbol: exConfig.pairs[symbol],
  };

  return processRequest(endpoint, body).then(data => ({
    symbol,
    price: +data.price,
  }));
}

module.exports = {
  setOrder,
  getBalances,
  getAvgPrice,
};
