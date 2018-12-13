const nosql = require("nosql");

const { makeDir } = require("./file");
// viewer - https://nosql.totaljs.com/
function dbLogger(logName) {
  makeDir(`./logs`);
  var DB = nosql.load(`./logs/log.${logName}.nosql`);

  return data => DB.insert(data);
}

module.exports = { dbLogger };
