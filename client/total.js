import { html, render } from "https://unpkg.com/lit-html";

function createTable(platform, data, type) {
  let tableName = `${type.toUpperCase()}s (${platform})`;

  var table = html`
  <table class=${type}>
    <thead><tr><th>${tableName}</th></tr></thead>
    <tbody>
    ${data.map(
      order => html`<tr><td>${order.price}</td><td>${order.volume}</td></tr>`
    )}
    </tbody>
  </table>`;

  return table;
}

fetch("/api/binance")
  .then(data => data.json())
  .then(function(json4ik) {
    render(
      [
        createTable("Binance", json4ik.bids.slice(0, 10), "bid"),
        createTable("Binance", json4ik.asks.slice(0, 10), "ask")
      ],
      document.querySelector(".binance")
    );
  });

//////////Bitfinex////////////////////////
fetch("/api/bitfinex")
  .then(data => data.json())
  .then(function(json4ik) {
    render(
      [
        createTable("BitFinEx", json4ik.bids.slice(0, 10), "bid"),
        createTable("BitFinEx", json4ik.asks.slice(0, 10), "ask")
      ],
      document.querySelector(".bitfinex")
    );
  });

//////////Bittrex////////////////////////
fetch("/api/bittrex")
  .then(data => data.json())
  .then(function(json4ik) {
    render(
      [
        createTable("Bittrex", json4ik.bids.slice(0, 10), "bid"),
        createTable("Bittrex", json4ik.asks.slice(0, 10), "ask")
      ],
      document.querySelector(".bittrex")
    );
  });
