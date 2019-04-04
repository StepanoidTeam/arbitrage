const { dbLogger } = require("../../helpers/dbLogger");
const { getAllowedPairsAsync, getPairs, getCoins } = require("./assets");

// TEST
getCoins().then(data => {
  const log = dbLogger("okex-coins-disabled");

  const enabledChargeWithdraw = ({ can_deposit, can_withdraw }) =>
    can_deposit && can_withdraw;

  data.filter(x => !enabledChargeWithdraw(x)).forEach(log);
});

getPairs().then(data => {
  const log = dbLogger("okex-pairs-offline");

  data.filter(({ online }) => online === 0).forEach(log);
});

//getPairs().then(data => console.log(data));

//getAllowedPairsAsync().then(data => console.log(data));
