//todo: server for future

const express = require("express");
const port = process.env.PORT || 3000;

const app = express();
//serve client files
app.use(express.static("./client"));

//all
app.get("/api/all", async (req, res) => {
  res.send(await "somedata");
});

//start server
app.listen(port, () => {
  console.log("🌐  [server] started");
});
