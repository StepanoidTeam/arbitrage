const { makeDir, appendJSONToFile } = require("./file");

function dbLogger(logName) {
  makeDir(`./logs`);
  const filePath = `./logs/log.${logName}.nosql`;

  return data => appendJSONToFile(filePath, data);
}

module.exports = { dbLogger };
