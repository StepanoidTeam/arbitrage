// APIv1
// https://github.com/mjesuele/hitbtc-api-node/blob/master/src/index.js
// Off shitty docs
// https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv2.md#authentication-session
// swagger
// https://api.hitbtc.com/api/2/explore/
// ccxt
// https://github.com/ccxt/ccxt/blob/master/js/hitbtc2.js
// https://github.com/ccxt/ccxt/blob/master/js/hitbtc.js
//

const fetch = require("node-fetch");

const {
  exchanges: { hitbtc: exConfig },
} = require("../configs");

const { apiKey, secretKey } = exConfig;

const API_TRADE_URL = "https://api.hitbtc.com";

function processRequest(endpoint, body = {}) {
  const requestUrl = `${API_TRADE_URL}${endpoint.uri}`;

  const timestamp = Date.now();

  // const authParams = {
  //   apikey: apiKey,
  //   nonce: timestamp,
  // };

  const fetchUrl = `${requestUrl}`; //?${new URLSearchParams(authParams)}`;

  signature = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  return fetch(fetchUrl, {
    method: endpoint.method,
    json: true,
    headers: {
      authorization: `Basic ${signature}`,
    },
    //body: new URLSearchParams(requestBody),
    //form: requestBody,
  }).then(data => data.json());
}

function setOrder() {
  const endpoint = { method: "POST", uri: "/api/2/order" };

  const body = {
    currencyPair: "btc_usdt",
    amount: 0.1,
    rate: 3000, // price
    //orderType: "", // ioc - Immediate-Or-Cancel //timeInForce
    ...authParams,
    //...{ currencyPair: "usdt_cnyx", orderNumber: 1 },
  };

  return processRequest(endpoint, body);
}

function mapBalances(balances) {
  return balances
    .map(({ currency, available }) => ({
      name: currency,
      value: available,
    }))
    .filter(coin => +coin.value > 0);
}

function getBalances() {
  const BALANCE_URL = "/api/2/trading/balance";
  const endpoint = { method: "GET", uri: BALANCE_URL };

  return processRequest(endpoint).then(mapBalances);
}

module.exports = {
  setOrder,
  getBalances,
};
