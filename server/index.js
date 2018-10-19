const express = require("express");
const fetch = require("node-fetch");

const port = process.env.PORT || 3000;

const app = express();
//serve client files
app.use(express.static("./client"));
//binance
app.get("/api/binance", async (req, res) => {
  var burl = "https://api.binance.com";
  var query = "/api/v1/depth";

  query += "?symbol=BTCUSDT";
  var url = burl + query;

  res.send(await fetch(url).then(data => data.json()));
});
//bittrex
app.get("/api/bittrex", async (req, res) => {
  var burl = "https://bittrex.com";
  var query = "/api/v1.1/public/getorderbook";

  query += "?market=USDT-BTC&type=both";
  var url = burl + query;

  res.send(await fetch(url).then(data => data.json()));
});
//bitfinex
app.get("/api/bitfinex", async (req, res) => {
  var burl = "https://api.bitfinex.com/v1";
  var query = "/book/btcusd";

  var url = burl + query;

  res.send(await fetch(url).then(data => data.json()));
});
//start server
app.listen(port, () => {
  console.log("[server] started");
});
