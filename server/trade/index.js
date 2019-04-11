const { Subject } = require("rxjs");
const { scan } = require("rxjs/operators");
const logUpdate = require("log-update");

const {
  activeCoins,
  activeExchanges,
  minProfitPtNormal,
  minProfitPtLow,
  lowBalanceUSD,
  basicState,
} = require("./config");

const binance = require("./binance");
const gate = require("./gate");
const hitbtc = require("./hitbtc");

const balancesReducer = new Subject();

balancesReducer
  .pipe(
    scan((state, { TYPE, PAYLOAD }) => {
      //reducer
      switch (TYPE) {
        // TODO: add events:
        // basic init structure
        // update balances for 1 exchange?
        // make deal?
        // update trade limits?
        // request balance updates?nf
        case "UPDATE_BALANCE": {
          const { exName, coin, balance } = PAYLOAD;
          state[exName][coin] = balance;
          break;
        }
        case "UPDATE_EXCHANGE": {
          const { exName, exBalanceSet } = PAYLOAD;
          Object.assign(state[exName], exBalanceSet);
          break;
        }
      }

      return state;
    }, basicState)
    //throttleTime(1000)
  )
  .subscribe(state => {
    const exMessages = Object.entries(state).map(([exName, value]) => {
      const balances = Object.entries(value).map(([coin, balance]) => {
        return `💲  ${coin}: ${balance}`;
      });
      return [`💹  ${exName}:`, ...balances];
    });

    const message = [`⭕️  BALANCES`, ...exMessages.flat()].join("\n");
    logUpdate(message);
  });
/**
 * после каждой произведенной сделки
 * сравниваем баланс монеты на бирже
 * (переменная balanceAmount) с lowBalanceXXX.
 * Если баланс на бирже ниже $600, //?
 * то меняем minProfitPt до 0.2%
 * или вообще до 0.001% каких-нибудь
 * до 0% короч
 */

function init() {
  const tradeExchanges = {
    binance,
    gate,
    hitbtc,
  };

  activeExchanges.map(async exName => {
    const availableBalances = await tradeExchanges[exName].getBalances();

    const activeBalances = availableBalances.filter(balance =>
      activeCoins.includes(balance.name)
    );

    const exBalanceSet = activeBalances.reduce((state, { name, value }) => {
      state[name] = value;
      return state;
    }, {});

    balancesReducer.next({
      TYPE: "UPDATE_EXCHANGE",
      PAYLOAD: {
        exName,
        exBalanceSet,
      },
    });
  });
}

init();
