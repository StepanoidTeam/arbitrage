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

function appendJSONToFile(filepath, objData) {
  appendTextToFile(filepath, JSON.stringify(objData));
}

function appendTextToFile(filepath, textData) {
  let rawData = `${textData}\n`;
  appendDataToFile(filepath, rawData);
}

function appendDataToFile(filepath, data) {
  fs.appendFileSync(filepath, data);
}

function readLines(filepath) {
  return fs
    .readFileSync(filepath)
    .toString()
    .split("\n");
}

module.exports = {
  getDataFromFile,
  saveDataToFile,
  appendDataToFile,
  appendJSONToFile,
  readLines,
};
