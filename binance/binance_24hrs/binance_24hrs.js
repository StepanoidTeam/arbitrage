var burl = 'https://api.binance.com';
var query = '/api/v1/ticker/24hr';

query += '?symbol=BTCUSDT';
var url = burl + query;

var ourRequest = new XMLHttpRequest();
ourRequest.open('GET',url,true);

ourRequest.onload = function(){
	var json4ik = JSON.parse(ourRequest.responseText);
	console.log(JSON.parse(ourRequest.responseText));
	

	var div = document.createElement('div');
	div.innerHTML = json4ik.askPrice;
	document.body.appendChild(div);

}

ourRequest.send();

function createDiv(){
	var div1 = document.createElement('div1');
	var div2 = document.createElement('div2');
	div1.innerHTML = json4ik.asks[0][0];
	div2.innerHTML = json4ik.asks[1][0];
	document.body.appendChild(div1);
	document.body.appendChild(div2);
}

	//table1
	//var tableOrderBook1 = document.createElement('table');
	//tableOrderBook1.innerHTML = '<tr><td>jack</td><td>Bob</td></tr>';
	//document.body.appendChild(tableOrderBook1);