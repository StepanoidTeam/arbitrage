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
    function binanceMapper(order) {
      return { price: order[0], volume: order[1] };
    }

    render(
      [
        createTable(
          "Binance",
          json4ik.asks.slice(0, 10).map(binanceMapper),
          "ask"
        ),
        createTable(
          "Binance",
          json4ik.bids.slice(0, 10).map(binanceMapper),
          "bid"
        )
      ],
      document.querySelector(".binance")
    );
  });

//////////Bitfinex////////////////////////
fetch("/api/bitfinex")
  .then(data => data.json())
  .then(function(json4ik) {
    function bitfinexMapper(order) {
      return { price: order.price, volume: order.amount };
    }

    render(
      [
        createTable(
          "BitFinEx",
          json4ik.asks.slice(0, 10).map(bitfinexMapper),
          "ask"
        ),
        createTable(
          "BitFinEx",
          json4ik.bids.slice(0, 10).map(bitfinexMapper),
          "bid"
        )
      ],
      document.querySelector(".bitfinex")
    );
  });

//////////Bittrex////////////////////////
fetch("/api/bittrex")
  .then(data => data.json())
  .then(function(json4ik) {
    function bittrexMapper(order) {
      return { price: order.Rate, volume: order.Quantity };
    }

    render(
      [
        createTable(
          "Bittrex",
          json4ik.result.sell.slice(0, 10).map(bittrexMapper),
          "ask"
        ),
        createTable(
          "Bittrex",
          json4ik.result.buy.slice(0, 10).map(bittrexMapper),
          "bid"
        )
      ],
      document.querySelector(".bittrex")
    );
  });
