﻿TODO:

1. [ ] Разобраться с ошибками, которые вываливает финик и хуоби
2. [ ] добавлять оставшиеся биржи

Отчеты:

1. [ ] время (timestamp) в отчете выводить локальное
2. [ ] пересчитывать в валюту торговой пары объем сделки (min)?
3. [ ] вернуть top bid и top ask объемы в min отчет?

Analytics:

1. [ ] что делаем со второй и прочими строками стакана? - только первая строка мешает аналитике, т.к. забивает собой отчет
2. [ ] Протестить минордер, если мы берем из стакана. Поставить ордер на 2 поинта, купить на 1.5, и потом еще на 0.5
3. [ ] что происходит, если на двух и более биржах одинаковая цена? Надо брать ту, где больше вольюм
       брать все профитные сделки из одного таймштампа, а не только 1ну ту у которой макс разница в ценах

====
https://support.binance.com/hc/en-us/articles/115000594711-Trading-Rule

https://support.bitfinex.com/hc/en-us/articles/115003283709-What-is-the-minimum-order-size-

https://www.bitfinex.com/posts/226

https://huobiglobal.zendesk.com/hc/en-us/articles/360000400491-Trade-Limits