// https://github.com/mjesuele/hitbtc-api-node/blob/master/src/index.js
// https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv2.md#authentication-session

const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");

const {
  exchanges: { hitbtc: exConfig },
} = require("../configs");

const { apiKey, secretKey } = exConfig;

function setOrder() {
  const API_TRADE_URL = "https://api.hitbtc.com";

  const orderPath = "/api/2/order";
  const BALANCE_URL = "/api/2/trading/balance";

  const orderUrl = `${API_TRADE_URL}${BALANCE_URL}`;

  const timestamp = Date.now();

  const authParams = {
    apikey: apiKey,
    nonce: timestamp,
  };

  const requestBody = {
    currencyPair: "btc_usdt",
    amount: 0.1,
    rate: 3000, // price
    //orderType: "", // ioc - Immediate-Or-Cancel //timeInForce
    ...authParams,
    //...{ currencyPair: "usdt_cnyx", orderNumber: 1 },
  };

  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(
      `${BALANCE_URL}?${new URLSearchParams(requestBody)}`,
      secretKey
    )
  );

  const fetchUrl = `${orderUrl}?${new URLSearchParams(authParams)}`;

  console.log(signature);
  console.log(fetchUrl);
  console.log(requestBody);

  return fetch(fetchUrl, {
    method: "GET",
    json: true,
    headers: {
      "X-Signature": signature,
    },
    //body: new URLSearchParams(requestBody),
    //form: requestBody,
  }).then(data => data.text());
}

setOrder().then(data => console.log(`>${data}<`));

//module.exports = {};
