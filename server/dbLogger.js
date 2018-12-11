const nosql = require("nosql");

function dbLogger(logName) {
  var DB = nosql.load(`./logs/log.${logName}.nosql`);

  return data => DB.insert(data);
}

module.exports = { dbLogger };
