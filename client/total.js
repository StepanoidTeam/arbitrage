fetch("/api/binance")
  .then(data => data.json())
  .then(function(json4ik) {
    function addDiv(divName) {
      var divBinanceWrapper = document.createElement("div");
      //divBinanceWrapper.style.backgroundColor = "blue";
      divBinanceWrapper.innerHTML = divName;
      document.body.appendChild(divBinanceWrapper);
    }

    function addTable(tableName, orderType, color) {
      var c, r, t;
      t = document.createElement("table");
      t.innerHTML = "<tr><th>" + tableName + "<tr></th>";
      t.style.backgroundColor = color;
      t.style.cssFloat = "left";
      t.style.marginLeft = "15px";

      for (i = 0; i < 10; i++) {
        r = t.insertRow(i + 1);
        c = r.insertCell(0);
        c.innerHTML = orderType[i][0];
        c = r.insertCell(1);
        c.innerHTML = orderType[i][1];
      }

      document.body.appendChild(t);
    }

    addTable("Asks (Binance)", json4ik.asks, "pink");
    addTable("Bids (Binance)", json4ik.bids, "LightGreen");
  });

//////////Bitfinex////////////////////////
fetch("/api/bitfinex")
  .then(data => data.json())
  .then(function(json4ik) {
    console.log(json4ik.asks[0].price);
    console.log(json4ik.asks[0].amount);

    addTable("Asks (Bitfinex)", json4ik.asks, "pink");
    addTable("Bids (Bitfinex)", json4ik.bids, "LightGreen");

    function addTable(tableName, orderType, color) {
      var c, r, t;
      t = document.createElement("table");
      t.innerHTML = "<tr><th>" + tableName + "<tr></th>";
      t.style.backgroundColor = color;
      t.style.cssFloat = "left";
      t.style.marginLeft = "15px";

      for (i = 0; i < 10; i++) {
        r = t.insertRow(i + 1);
        c = r.insertCell(0);
        c.innerHTML = orderType[i].price;
        c = r.insertCell(1);
        c.innerHTML = orderType[i].amount;
      }

      document.body.appendChild(t);
    }
  });

//////////Bittrex////////////////////////
fetch("/api/bittrex")
  .then(data => data.json())
  .then(function(json4ik) {
    console.log(json4ik.result.buy[0].Rate);
    console.log(json4ik.result.buy[0].Quantity);
    //console.log(json4ik.result);

    addTable("Asks (Bittrex)", json4ik.result.sell, "pink");
    addTable("Bids (Bittrex)", json4ik.result.buy, "LightGreen");

    addDiv(json4ik.result.buy);
    function addDiv(orderType) {
      div = document.createElement("div");
      div.innerHTML = orderType[0].Rate;
      document.body.appendChild(div);
    }

    function addTable(tableName, orderType, color) {
      var c, r, t;
      t = document.createElement("table");
      t.innerHTML = "<tr><th>" + tableName + "<tr></th>";
      t.style.backgroundColor = color;
      t.style.cssFloat = "left";
      t.style.marginLeft = "15px";

      for (i = 0; i < 10; i++) {
        r = t.insertRow(i + 1);
        c = r.insertCell(0);
        c.innerHTML = orderType[i].Rate;
        c = r.insertCell(1);
        c.innerHTML = orderType[i].Quantity;
      }

      document.body.appendChild(t);
    }
  });
