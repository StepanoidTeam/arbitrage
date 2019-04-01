// https://github.com/gateio/rest/blob/master/nodejs/lib/gate.js

const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");

const {
  exchanges: { gate: exConfig },
} = require("../configs");

const { apiKey, secretKey } = exConfig;

function setOrder() {
  const orderPath = "api2/1/private/buy";
  //const orderUrl = `https://api.gateio.io${orderPath}`;

  const BALANCE_URL = "api2/1/private/balances";
  const API_TRADE_URL = "https://api.gateio.co/";
  const TRADEHISTORY_URL = "api2/1/tradeHistory";
  const MYTRADEHISTORY_URL = "api2/1/private/tradeHistory";
  const orderUrl = `${API_TRADE_URL}${orderPath}`;

  const timestamp = Date.now();

  const requestBody = {
    currencyPair: "btc_usdt",
    amount: 0.1,
    rate: 3000, // price
    //orderType: "", // ioc - Immediate-Or-Cancel //timeInForce

    //...{ currencyPair: "usdt_cnyx", orderNumber: 1 },
  };

  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(`${new URLSearchParams(requestBody)}`, secretKey)
  );

  const fetchUrl = `${orderUrl}`;

  console.log(signature);
  console.log(fetchUrl);
  console.log(requestBody);

  return fetch(fetchUrl, {
    method: "POST",
    json: true,
    headers: {
      KEY: apiKey,
      SIGN: signature,
    },
    body: new URLSearchParams(requestBody),
    //form: requestBody,
  }).then(data => data.text());
}

setOrder().then(data => console.log(`>${data}<`));

//module.exports = {};
