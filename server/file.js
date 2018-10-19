const fs = require("fs");

function getDataFromFile(filepath) {
  if (!fs.existsSync(filepath)) {
    return Promise.reject(new Error(`path not exist: '${filepath}'`));
  }
  const data = fs.readFileSync(filepath);
  return Promise.resolve(data);
}

function saveDataToFile(filepath, data) {
  fs.writeFileSync(filepath, data);
  return Promise.resolve(data);
}

function appendDataToFile(filepath, data) {
  fs.appendFileSync(filepath, data);
}

module.exports = { getDataFromFile, saveDataToFile, appendDataToFile };
