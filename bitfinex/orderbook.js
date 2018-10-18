// All examples assume the following:
// 1. You already have the request object available
// 2. You have the url variable
// 3. Will use BTCUSD as the default symbol

var burl = "https://api.bitfinex.com/v1";
var query = '/book/btcusd';

var url = burl + query;

var ourRequest = new XMLHttpRequest();
ourRequest.open('GET',url,true);

ourRequest.onload = function(){
	var json4ik = JSON.parse(ourRequest.responseText);
	console.log(json4ik.asks[0].price);
  console.log(json4ik.asks[0].amount);


  addTable("Asks" ,json4ik.asks, "pink");
  addTable("Bids" ,json4ik.bids, "LightGreen");
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