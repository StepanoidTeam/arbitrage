const { PAIRS } = require("./globalPairs");
const exchanges = require("./exchanges");
const { getLocalPairs } = require("../helpers/getLocalPairs");
const { pairs2use } = require("./pairs2use");

module.exports = {
  exchanges,
  PAIRS,
  pairs2use,
  logger: {
    connected: ({ name }) => {
      console.log(`✔️   ${name} connected at ${new Date().toLocaleString()}`);
    },
    disconnected: ({ name }) => {
      console.log(
        `❌   ${name} disconnected at ${new Date().toLocaleString()}`
      );
    },
  },
};
