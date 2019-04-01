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

function setOrder() {
  const orderPath = "/api/v3/order";
  const orderUrl = `https://api.binance.com${orderPath}`;

  const timestamp = Date.now();

  const requestBody = {
    symbol: "BNBBTC",
    side: "BUY", //SELL
    type: "LIMIT",
    timeInForce: "GTC", // IOC GTC - https://www.reddit.com/r/BinanceExchange/comments/8odvs4/question_about_time_in_force_binance_api/
    quantity: 1,
    price: 0.004,
    timestamp,
    //recvWindow: 5000,
    //signature,
  };
  //CryptoJS.enc.Base64.stringify(
  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA256(`${new URLSearchParams(requestBody)}`, secretKey)
  );
  //);

  const fetchUrl = `${orderUrl}?${new URLSearchParams({
    ...requestBody,
    timestamp,
    signature,
  })}`;

  console.log(signature, fetchUrl);

  return fetch(fetchUrl, {
    method: "POST",
    json: true,
    headers: {
      //"Content-Type": "application/json",
      "X-MBX-APIKEY": apiKey,
    },
    //body: requestBody,
  }).then(data => data.json());
}

setOrder().then(data => console.log(data));

//module.exports = {};
