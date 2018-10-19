const express = require('express');

const app = express();
app.use(express.static('public'));
app.use(express.static('binance_24hrs'));
app.use(express.static('orderbook'));

app.get("/test", sendText);

/*
app.get('/', (req, res) => {
  res.send('Hello Express app!')
});
*/

function sendText(request, response){
  response.send("jack");
  //console.log("jack");
}

function gotData(data) {
  console.log(data);
  var keys = Object.keys(data);
  for (var i = 0; i<keys.length; i++){

  }
  console.log(keys);
}

app.get("/users", (req, res) => {
var user1 = {firstName: "Jack", lastName: "Bob"};
const user2 = {firstName: "Bob", lastName: "Jack"};
res.json([user1, user2]);

 // res.send("Nodemon auto updates when I save this file");
})

//localhost:3003
app.listen(3003, () => {
  console.log('server started');
});