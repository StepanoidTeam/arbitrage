const nosql = require("nosql");
// viewer - https://nosql.totaljs.com/
function dbLogger(logName) {
  var DB = nosql.load(`./logs/log.${logName}.nosql`);

  return data => DB.insert(data);
}

module.exports = { dbLogger };
