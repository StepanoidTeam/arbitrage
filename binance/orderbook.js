(function (){

var burl = 'https://api.binance.com';
var query = '/api/v1/depth';

query += '?symbol=BTCUSDT';
var url = burl + query;


var ourRequest = new XMLHttpRequest();
ourRequest.open('GET',url,true);

ourRequest.onload = function(){
	var json4ik = JSON.parse(ourRequest.responseText);
	console.log(JSON.parse(ourRequest.responseText));
	
	function addDiv (divName){
		var divBinanceWrapper = document.createElement('div');
		//divBinanceWrapper.style.backgroundColor = "blue";	
		divBinanceWrapper.innerHTML = divName;
		document.body.appendChild(divBinanceWrapper);
}
	
	function addTable(tableName ,orderType, color) {
		var c, r, t;
		t = document.createElement('table');
		t.innerHTML = '<tr><th>'+tableName+'<tr></th>';
		t.style.backgroundColor = color;
		t.style.cssFloat = "left";
		t.style.marginLeft = '15px';

		for (i=0;i<10;i++){
			r = t.insertRow(i+1); 
			c = r.insertCell(0);
			c.innerHTML = orderType[i][0];
			c = r.insertCell(1);
			c.innerHTML = orderType[i][1];
		}

		document.body.appendChild(t);
	}
	
	addTable("Asks (Sale)" ,json4ik.asks, "pink");
	addTable("Bids (Buy)" ,json4ik.bids, "LightGreen");
	addDiv("Binance");
}

ourRequest.send();
})()

//////////Bitfinex////////////////////////


var burl = "https://api.bitfinex.com/v1";
var query = '/book/btcusd';

var url = burl + query;

var ourRequest = new XMLHttpRequest();
ourRequest.open('GET',url,true);

ourRequest.onload = function(){
	var json4ik = JSON.parse(ourRequest.responseText);
	console.log(json4ik.asks[0].price);
  console.log(json4ik.asks[0].amount);


  addTable("Asks (Sale)" ,json4ik.asks, "pink");
  addTable("Bids (Buy)" ,json4ik.bids, "LightGreen");
}
ourRequest.send();

function addTable(tableName ,orderType, color) {
  var c, r, t;
  t = document.createElement('table');
  t.innerHTML = '<tr><th>'+tableName+'<tr></th>';
  t.style.backgroundColor = color;
  t.style.cssFloat = "left";
  t.style.marginLeft = '15px';

  for (i=0;i<10;i++){
    r = t.insertRow(i+1); 
    c = r.insertCell(0);
    c.innerHTML = orderType[i].price;
    c = r.insertCell(1);
    c.innerHTML = orderType[i].amount;
  }

  document.body.appendChild(t);
}


//////////Bittrex////////////////////////