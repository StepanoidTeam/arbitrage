﻿# TODO:

1. [x] Разобраться с ошибками, которые вываливает финик
       particularly done? ошибка с фиником возникает при дампах/пампах когда разбирают весь стакан
2. [-] прописать для каждоый биржи минимальные возможные размеры трейд-ордера
   эффорт по срезанию лишних сделок минимален
3. [ ] реализовать настоящую покупку/продажу ботом на 4х биржах (binance, bitfinex, huobi, OKex)
4. [ ] добавлять оставшиеся биржи
5. [ ] проверить финик на соответствие названий пар
6. [x] add hitbtc

# Dev:

1. [ ] сделать вывод логов через вебсайт вместо консоли
2. [ ] не использовать данные для анализа с отключенных бирж
3. [x] почему фризится консольный лог - изза нагрузки на файловую систему
4. [x] сделать лог в БД вместо файловой системы

noSQL - https://www.npmjs.com/package/nosql
couchDB - http://docs.couchdb.org/en/stable/index.html

# Отчеты:

1. [ ] дабы избежать повторяющихся данных (которые занимают 90%-95% всех строк), можем ли мы сравнивать новые данные с предыдущими, и если там совпадает все, кроме таймфрейма, то игнорить их? Или это будет очень сильно нагружать сервер?

# Analytics:

1. [-] Для отчетов по финику для USDT умножать цену на курс usd/usdt? плохой адхок
2. [ ] что делаем со второй и прочими строками стакана? - только первая строка мешает аналитике, т.к. забивает собой отчет
3. [x] что происходит, если на двух и более биржах одинаковая цена? Надо брать ту, где больше вольюм?
       брать все профитные сделки из одного таймштампа, а не только 1ну ту у которой макс разница в ценах
4. [-] игнорировать пары, у которых PriceDiffPt > n. Например если там больше условных 60%, то дело там не чисто - либо вывод закрыт, либо пара кривая, етц. (не нужно, есть проверка на вывод монет)
5. [+] реализовать проверку возможности deposit/withdrawal c каждой биржи перед стартом аналитического скрипта:
   - Запрашиваем для каждой биржи инфу по коину (либо bulk инфо по монетам, если биржа такое предоставляет),
   - накладываем маской на список наших монет,
   - дизейблим пары в которых присутствует такой коин (биржа + коин),
   - записываем куда-то список задезейбленных пар для ручной проверки,
   - запускаем основной скрипт аналитики, без учета ранее упомянутых пар

# Exchange Withdrawal API

## BINANCE

https://api.binance.com/api/v1/exchangeInfo - pairs info
https://www.binance.com/assetWithdraw/getAllAsset.html - coins info

## HUOBI

https://github.com/huobiapi/API_Docs_en/wiki/REST_Reference#withdraw-api

## OKex

https://github.com/okcoin-okex/API-docs-OKEx.com/blob/master/API-For-Spot-EN/REST%20API%20for%20SPOT.md // - пункт №8
https://github.com/okcoin-okex/API-docs-OKEx.com/blob/master/API-For-Spot-EN/Error%20Code%20For%20Spot.md // - список error-кодов, наш видимо 10052

## HitBTC

https://api.hitbtc.com/#rest-api-reference
https://api.hitbtc.com/api/2/public/currency //весь список, интересует параметр payoutEnabled
https://api.hitbtc.com/api/2/public/currency/btc

## GATE

https://www.gate.io/api2#coininfo
https://data.gateio.io/api2/1/coininfo // весь список

## Binfinex

https://docs.bitfinex.com/v2/reference#movements // не очень понял, получится ли получить инфу о выводе через API v2
https://docs.bitfinex.com/v1/reference#rest-auth-withdrawal

# Minimum orders and trading rules

https://support.binance.com/hc/en-us/articles/115000594711-Trading-Rule

https://support.bitfinex.com/hc/en-us/articles/115003283709-What-is-the-minimum-order-size-

https://www.bitfinex.com/posts/226

https://huobiglobal.zendesk.com/hc/en-us/articles/360000400491-Trade-Limits

OKex - нет ограничения в бтц, только по 1 токену по супер дешевым монетам

kukoin - нет ограничения в бтц, только по 1 токену по супер дешевым монетам

https://bittrex.zendesk.com/hc/en-us/articles/115003004171-What-are-my-trade-limits-
