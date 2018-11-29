const { PAIRS } = require("./globalPairs");
const exchanges = require("./exchanges");
const { getLocalPairs } = require("./getLocalPairs");
const { pairs2use } = require("./pairs2use");

module.exports = {
  exchanges,
  PAIRS,
  getLocalPairs,
  pairs2use,
};
