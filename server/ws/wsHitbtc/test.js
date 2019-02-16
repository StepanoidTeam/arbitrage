const { dbLogger } = require("../../helpers/dbLogger");
const { getAllowedPairsAsync, getPairs, getCoins } = require("./assets");

// TEST
getCoins().then(data => {
  const enabledChargeWithdraw = ({ payinEnabled, payoutEnabled }) =>
    payinEnabled && payoutEnabled;

  console.log("total coins", data.length);
  console.log(
    "disabled coins",
    data.filter(x => !enabledChargeWithdraw(x)).length
  );
});

getAllowedPairsAsync().then(data => {
  console.log("allowedPairs", data.length);
});
