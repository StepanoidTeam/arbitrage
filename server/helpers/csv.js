const flatten = require("flat");

const separator = ";";

function getCsvHeaders(data) {
  return Object.keys(flatten(data)).join(separator);
}

function getCsvValues(data) {
  return Object.values(flatten(data)).join(separator);
}

module.exports = { getCsvHeaders, getCsvValues };
