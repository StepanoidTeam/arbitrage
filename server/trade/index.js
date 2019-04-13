const { Subject } = require("rxjs");
const { scan } = require("rxjs/operators");
const logUpdate = require("log-update");

const {
  activeCoins,
  activeExchanges,
  minProfitNormalUSDT,
  minProfitLowUSDT,
  lowBalanceLimitUSDT,
} = require("./config");

const binance = require("./binance");
const gate = require("./gate");
const hitbtc = require("./hitbtc");

const USDT = "USDT";

const activeCoinPrices = [
  { name: USDT, price: 1 },
  // { name: "EOS", price: 5.26276307 },
  // { name: "BTC", price: 5038.75649181 },
  // { name: "ETH", price: 162.14361024 },
];

function toUSDT(coinName, coinValue) {
  const coin = activeCoinPrices.find(({ name }) => name === coinName);

  return coinValue * coin.price;
}

const balancesBasicState = activeExchanges.reduce(
  (state, exName) => {
    state[exName] = {
      ...activeCoins.reduce((set, coin) => {
        set[coin] = 0;
        return set;
      }, {}),
    };
    return state;
  },
  { _deals: { lowProfit: 0, placedOrders: 0 } }
);

const balancesReducer = new Subject();

balancesReducer
  .pipe(
    scan((state, { TYPE, PAYLOAD }) => {
      //reducer
      switch (TYPE) {
        // TODO: add events:
        // make deal?
        // request balance updates?
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
        case "PROFITABLE_DEAL": {
          const {
            timestamp,
            altCoin,
            mainCoin,
            pair,
            exMinAsk,
            exMaxBid,
            priceDiff,
            priceDiffPt,
            availVolume,
            availVolumeByAvgPrice,
            availProfit,
            netProfit,
          } = PAYLOAD;
          const deal = PAYLOAD;

          const netProfitUSDT = toUSDT(deal.mainCoin, deal.netProfit);

          // skip unprofitable
          if (netProfitUSDT < 0) return;
          //skip low profit
          if (netProfitUSDT < minProfitNormalUSDT) {
            //todo: log low
            return;
          }

          const exMaxBidBalances = state[deal.exMaxBid.exName];
          const exMinAskBalances = state[deal.exMinAsk.exName];

          {
            //main coin polu4aem (+USDT) tratim alt (-BTC)
            const exMaxBidCoinBalanceUSDT = toUSDT(
              deal.mainCoin,
              exMaxBidBalances[deal.mainCoin]
            );
            //main coin tratim (-USDT) poluchaem alt (+BTC)
            const exMinAskCoinBalanceUSDT = toUSDT(
              deal.altCoin,
              exMinAskBalances[deal.altCoin]
            );

            //TODO: discuss this part, all 4 balances should be checked
            const isLowBalance =
              exMaxBidCoinBalanceUSDT < lowBalanceLimitUSDT ||
              exMinAskCoinBalanceUSDT < lowBalanceLimitUSDT;
          }
          /**
           * - далее сверяем объемы сделки с текущими балансами,
           * можем ли мы ее провести (хватает ли балансов на обеих биржах)
           * - если нет, то возможно есть смысл откусить кусок
           * - провести сделку на доступный объем
           */

          //bid sells alt
          const exMaxBidBalanceSufficient =
            exMaxBidBalances[deal.altCoin] > deal.availVolume;

          //ask sells main
          const exMinAskBalanceSufficient =
            exMinAskBalances[deal.mainCoin] >
            deal.exMinAsk.ask.price * deal.availVolume;

          const canTrade =
            exMaxBidBalanceSufficient && exMinAskBalanceSufficient;

          if (canTrade) {
            //todo: trade - place orders
          }
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

  return balancesReducer;
}

init();
