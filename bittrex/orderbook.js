var burl = 'https://bittrex.com';
var query = '/api/v1.1/public/getorderbook';

query += '?market=USDT-BTC&type=both';
var url = burl + query;

var ourRequest = new XMLHttpRequest();
ourRequest.open('GET',url,true);

ourRequest.onload = function(){
	var json4ik = JSON.parse(ourRequest.responseText);
	console.log(JSON.parse(ourRequest.responseText));

}

ourRequest.send();
