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

function createOrderbook(platform, data) {
  let bids = createTable(platform, data.bids, "bid");
  let asks = createTable(platform, data.asks, "ask");

  return html`<div class="orderbook">${[bids, asks]}</div>`;
}

fetch("/api/all")
  .then(data => data.json())
  .then(function([binance, bittrex, bitfinex]) {
    render(
      [
        createOrderbook("binance", binance),
        createOrderbook("bittrex", bittrex),
        createOrderbook("bitfinex", bitfinex)
      ],
      document.body
    );
  });
