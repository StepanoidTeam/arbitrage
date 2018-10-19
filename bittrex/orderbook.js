var burl = 'https://bittrex.com';
var query = '/api/v1.1/public/getorderbook';

query += '?market=USDT-BTC&type=both';
var url = burl + query;

var ourRequest = new XMLHttpRequest();
ourRequest.open('GET',url,true);

ourRequest.onload = function(){
	var json4ik = JSON.parse(ourRequest.responseText);
	console.log(json4ik.result.buy[0].Rate);
	console.log(json4ik.result.buy[0].Quantity);
	//console.log(json4ik.result);

  addTable("Asks (Sale)" ,json4ik.result.sell, "pink");
  addTable("Bids (Buy)" ,json4ik.result.buy, "LightGreen");
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
	  c.innerHTML = orderType[i].Rate;
	  c = r.insertCell(1);
	  c.innerHTML = orderType[i].Quantity;
	}
  
	document.body.appendChild(t);
  }

