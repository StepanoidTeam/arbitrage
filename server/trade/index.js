const { Subject } = require("rxjs");
const { scan } = require("rxjs/operators");
const logUpdate = require("log-update");

const {
  activeCoins,
  activeExchanges,
  minProfitPtNormal,
  minProfitPtLow,
  lowBalanceUSD,
} = require("./config");

const binance = require("./binance");
const gate = require("./gate");
const hitbtc = require("./hitbtc");

const USDT = "USDT";

const balancesBasicState = activeExchanges.reduce((state, exName) => {
  state[exName] = {
    ...activeCoins.reduce((set, coin) => {
      set[coin] = 0;
      return set;
    }, {}),
  };
  return state;
}, {});

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
    }, balancesBasicState)
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

async function init() {
  const tradeExchanges = {
    binance,
    gate,
    hitbtc,
  };

  /**
   * Ну и ещё нужно в трейд боте сделать запросы цен
   * на торгуемые монеты,
   * чтобы мочь считать Лоу баланс фильтр
   */

  const mainExchange = binance;

  const activeCoinPrices = [{ name: USDT, price: 1 }];

  await Promise.all(
    activeCoins
      .filter(coin => coin !== USDT)
      .map(coin => {
        return mainExchange
          .getAvgPrice(`${coin}_${USDT}`)
          .then(({ price }) => activeCoinPrices.push({ name: coin, price }));
      })
  );

  console.log(activeCoinPrices);

  return;

  activeExchanges.forEach(async exName => {
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
