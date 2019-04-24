const { PAIRS } = require("../globalPairs");

const bitfinex = {
  name: "bitfinex",
  url: "https://api.bitfinex.com",
  getOrderBook(pairIndex) {
    return `${this.url}/v1/book/${this.pairs[pairIndex]}`;
  },
  pairs: {
    //Starting September 15th, 2018, 00:00 UTC
    //All websocket connections will have a limit of 250 subscriptions
    //uppercased for ws!

    [PAIRS.ETH_BTC]: "ETHBTC",
    [PAIRS.XMR_BTC]: "XMRBTC",
    [PAIRS.LTC_BTC]: "LTCBTC",
    [PAIRS.EOS_BTC]: "EOSBTC",
    [PAIRS.ZEC_BTC]: "ZECBTC",
    [PAIRS.EOS_ETH]: "EOSETH",
    [PAIRS.XLM_BTC]: "XLMBTC",
    [PAIRS.TRX_BTC]: "TRXBTC",
    [PAIRS.TRX_ETH]: "TRXETH",
    //[PAIRS.USDT_USDT]: "USDTUSD",
    //[PAIRS.BTC_USDT]: "BTCUSD",
    //todo: update all usd to usdt
    //[PAIRS.ETH_USDT]: "ETHUSD",
    //[PAIRS.XRP_USDT]: "XRPUSD",
    //[PAIRS.BCH_USDT]: "BABUSD",
    //[PAIRS.EOS_USDT]: "EOSUSD",
    //[PAIRS.BTC_EUR]: "BTCEUR",
    //[PAIRS.ETC_USDT]: "ETCUSD",
    //[PAIRS.XRP_BTC]: "XRPBTC",

    ////[PAIRS.NEO_USDT]: "NEOUSD",
    //[PAIRS.ETH_EUR]: "ETHEUR",
    ////[PAIRS.LTC_USDT]: "LTCUSD",
    ////[PAIRS.IOTA_USDT]: "IOTUSD",
    ////[PAIRS.ZEC_USDT]: "ZECUSD",

    //[PAIRS.BCH_BTC]: "BABBTC",
    ////[PAIRS.XMR_USDT]: "XMRUSD",
    //[PAIRS.ETC_BTC]: "ETCBTC",
    ////[PAIRS.ETP_USDT]: "ETPUSD",

    //[PAIRS.BTC_JPY]: "BTCJPY",
    //[PAIRS.IOTA_BTC]: "IOTBTC",

    ////[PAIRS.DASH_USDT]: "DSHUSD",
    ////[PAIRS.QTUM_USDT]: "QTMUSD",
    ////[PAIRS.BTG_USDT]: "BTGUSD",
    [PAIRS.NEO_BTC]: "NEOBTC",
    //[PAIRS.BTC_GBP]: "BTCGBP",
    //[PAIRS.ETH_GBP]: "ETHGBP",
    //[PAIRS.TRX_USDT]: "TRXUSD",
    [PAIRS.EOS_EUR]: "EOSEUR",
    [PAIRS.DASH_BTC]: "DSHBTC",
    //[PAIRS.XLM_USDT]: "XLMUSD",
    [PAIRS.QTUM_BTC]: "QTMBTC",
    [PAIRS.ETH_JPY]: "ETHJPY",

    [PAIRS.XTZ_BTC]: "XTZBTC",
    [PAIRS.ETP_BTC]: "ETPBTC",
    [PAIRS.IOTA_ETH]: "IOTETH",
    [PAIRS.NEO_ETH]: "NEOETH",

    //[PAIRS.NEO_EUR]: "NEOEUR",
    [PAIRS.BTG_BTC]: "BTGBTC",
    //[PAIRS.BCH_ETH]: "BABETH", // no such pair for bitfinex

    //[PAIRS.IOTA_EUR]: "IOTEUR",
    //[PAIRS.EOS_GBP]: "EOSGBP",
    [PAIRS.QTUM_ETH]: "QTMETH",

    //[PAIRS.IOTA_JPY]: "IOTJPY",
    //[PAIRS.XTZ_USDT]: "XTZUSD",
    //[PAIRS.BCI_USDT]: "BCIUSD",
    //[PAIRS.GOT_USDT]: "GOTUSD",
    [PAIRS.IOTA_GBP]: "IOTGBP",
    [PAIRS.ETP_ETH]: "ETPETH",
    [PAIRS.XVG_BTC]: "XVGBTC",
    //[PAIRS.EOS_JPY]: "EOSJPY",
    //[PAIRS.NEO_GBP]: "NEOGBP",
    //[PAIRS.XRA_USDT]: "XRAUSD",
    [PAIRS.XRA_ETH]: "XRAETH",
    [PAIRS.GOT_EUR]: "GOTEUR",
    [PAIRS.XLM_ETH]: "XLMETH",
    //[PAIRS.XVG_USDT]: "XVGUSD",
    [PAIRS.VET_ETH]: "VETETH",
    [PAIRS.XLM_EUR]: "XLMEUR",
    [PAIRS.VET_BTC]: "VETBTC",
    //[PAIRS.NEO_JPY]: "NEOJPY",
    [PAIRS.XVG_ETH]: "XVGETH",
    //[PAIRS.VET_USDT]: "VETUSD",
    [PAIRS.BCI_BTC]: "BCIBTC",
    //[PAIRS.IQX_USDT]: "IQXUSD",
    [PAIRS.IQX_BTC]: "IQXBTC",
    [PAIRS.XVG_GBP]: "XVGGBP",
    [PAIRS.PAI_BTC]: "PAIBTC",
    [PAIRS.ANT_ETH]: "ANTETH",
    //[PAIRS.PAI_USDT]: "PAIUSD",
    [PAIRS.XLM_JPY]: "XLMJPY",
    [PAIRS.ANT_BTC]: "ANTBTC",
    //[PAIRS.ANT_USDT]: "ANTUSD",
    [PAIRS.IQX_EOS]: "IQXEOS",
    [PAIRS.GOT_ETH]: "GOTETH",
    [PAIRS.XVG_JPY]: "XVGJPY",
    [PAIRS.XVG_EUR]: "XVGEUR",
    [PAIRS.XLM_GBP]: "XLMGBP",
    //[PAIRS.MGO_USDT]: "MGOUSD",
    //[PAIRS.OMG_USDT]: "OMGUSD",
    //[PAIRS.ZRX_USDT]: "ZRXUSD",
    //[PAIRS.EDO_USDT]: "EDOUSD",
    [PAIRS.MGO_ETH]: "MGOETH",
    //[PAIRS.BAT_USDT]: "BATUSD",
    [PAIRS.EDO_BTC]: "EDOBTC",
    [PAIRS.ZRX_ETH]: "ZRXETH",
    [PAIRS.OMG_BTC]: "OMGBTC",
    [PAIRS.CNN_ETH]: "CNNETH",
    [PAIRS.BAT_BTC]: "BATBTC",
    [PAIRS.ZRX_BTC]: "ZRXBTC",
    [PAIRS.BAT_ETH]: "BATETH",
    [PAIRS.DAD_BTC]: "DADBTC",
    [PAIRS.DAD_ETH]: "DADETH",
    [PAIRS.LYM_ETH]: "LYMETH",
    //[PAIRS.ELF_USDT]: "ELFUSD",
    //[PAIRS.LYM_USDT]: "LYMUSD",
    [PAIRS.REP_ETH]: "REPETH",
    [PAIRS.LYM_BTC]: "LYMBTC",
    //[PAIRS.YGG_USDT]: "YGGUSD",
    [PAIRS.ELF_BTC]: "ELFBTC",
    //[PAIRS.QSH_USDT]: "QSHUSD",
    [PAIRS.EDO_ETH]: "EDOETH",
    [PAIRS.YGG_ETH]: "YGGETH",
    [PAIRS.UTK_ETH]: "UTKETH",
    [PAIRS.OMG_ETH]: "OMGETH",
    [PAIRS.UTK_BTC]: "UTKBTC",
    //[PAIRS.SEE_USDT]: "SEEUSD",
    [PAIRS.MAN_ETH]: "MANETH",
    [PAIRS.MKR_ETH]: "MKRETH",
    [PAIRS.DAI_BTC]: "DAIBTC",
    [PAIRS.ELF_ETH]: "ELFETH",
    //[PAIRS.SAN_USDT]: "SANUSD",
    //[PAIRS.GNT_USDT]: "GNTUSD",
    [PAIRS.SEN_BTC]: "SENBTC",
    [PAIRS.RLC_ETH]: "RLCETH",
    //[PAIRS.MAN_USDT]: "MANUSD",
    [PAIRS.ESS_ETH]: "ESSETH",
    //[PAIRS.BBN_USDT]: "BBNUSD",
    [PAIRS.SEN_ETH]: "SENETH",
    //[PAIRS.MNA_USDT]: "MNAUSD",
    //[PAIRS.POA_USDT]: "POAUSD",
    //[PAIRS.DAT_USDT]: "DATUSD",
    //[PAIRS.YYW_USDT]: "YYWUSD",
    //[PAIRS.DTH_USDT]: "DTHUSD",
    [PAIRS.DTH_ETH]: "DTHETH",
    [PAIRS.MKR_BTC]: "MKRBTC",
    [PAIRS.WAX_BTC]: "WAXBTC",
    [PAIRS.DAT_BTC]: "DATBTC",
    [PAIRS.YYW_BTC]: "YYWBTC",
    [PAIRS.SNT_ETH]: "SNTETH",
    [PAIRS.QSH_ETH]: "QSHETH",
    //[PAIRS.ORS_USDT]: "ORSUSD",
    //[PAIRS.WAX_USDT]: "WAXUSD",
    //[PAIRS.XRA_USDT]: "XRAUSD",
    //[PAIRS.ODE_USDT]: "ODEUSD",
    //[PAIRS.RLC_USDT]: "RLCUSD",
    [PAIRS.XRA_ETH]: "XRAETH",
    //[PAIRS.BFT_USDT]: "BFTUSD",
    //[PAIRS.NIO_USDT]: "NIOUSD",
    [PAIRS.DTH_BTC]: "DTHBTC",
    [PAIRS.FUN_BTC]: "FUNBTC",
    [PAIRS.QSH_BTC]: "QSHBTC",
    //[PAIRS.TNB_USDT]: "TNBUSD",
    [PAIRS.DAI_ETH]: "DAIETH",
    //[PAIRS.HOT_BTC]: "HOTBTC",
    //[PAIRS.HOT_ETH]: "HOTETH",
    ////[PAIRS.HOT_USDT]: "HOTUSD",
    [PAIRS.HydroProtocol_BTC]: "HOTBTC", // for Huobi, OKex and Bitfinex
    //[PAIRS.HydroProtocol_USDT]: "HOTUSD", // for Huobi, OKex and Bitfinex
    [PAIRS.HydroProtocol_ETH]: "HOTETH", // for Huobi, OKex and Bitfinex
    //[PAIRS.ZIL_USDT]: "ZILUSD",
    //[PAIRS.FUN_USDT]: "FUNUSD",
    [PAIRS.GNT_BTC]: "GNTBTC",
    [PAIRS.RLC_BTC]: "RLCBTC",
    [PAIRS.TKN_ETH]: "TKNETH",
    //[PAIRS.DTA_USDT]: "DTAUSD",
    //[PAIRS.DAI_USDT]: "DAIUSD",
    [PAIRS.REQ_BTC]: "REQBTC",
    [PAIRS.ORS_ETH]: "ORSETH",
    //[PAIRS.CNN_USDT]: "CNNUSD",
    //[PAIRS.IOS_USDT]: "IOSUSD",
    [PAIRS.CSX_ETH]: "CSXETH",
    [PAIRS.ZCN_ETH]: "ZCNETH",
    //[PAIRS.REP_USDT]: "REPUSD",
    [PAIRS.NEC_ETH]: "NECETH",
    [PAIRS.MNA_BTC]: "MNABTC",
    //[PAIRS.AGI_USDT]: "AGIUSD",
    [PAIRS.KNC_BTC]: "KNCBTC",
    [PAIRS.POY_BTC]: "POYBTC",
    [PAIRS.YYW_ETH]: "YYWETH",
    //[PAIRS.RDN_USDT]: "RDNUSD",
    [PAIRS.BFT_BTC]: "BFTBTC",
    [PAIRS.REP_BTC]: "REPBTC",
    [PAIRS.SAN_BTC]: "SANBTC",
    //[PAIRS.UTN_USDT]: "UTNUSD",
    [PAIRS.AGI_BTC]: "AGIBTC",
    [PAIRS.SNG_BTC]: "SNGBTC",
    [PAIRS.TNB_BTC]: "TNBBTC",
    //[PAIRS.CTX_USDT]: "CTXUSD",
    //[PAIRS.NCA_USDT]: "NCAUSD",
    [PAIRS.FUN_ETH]: "FUNETH",
    //[PAIRS.ABS_USDT]: "ABSUSD",
    [PAIRS.DAT_ETH]: "DATETH",
    //[PAIRS.RCN_USDT]: "RCNUSD",
    [PAIRS.GNT_ETH]: "GNTETH",
    [PAIRS.IOS_BTC]: "IOSBTC",
    [PAIRS.ODE_ETH]: "ODEETH",
    [PAIRS.CFI_ETH]: "CFIETH",
    [PAIRS.FSN_BTC]: "FSNBTC",
    [PAIRS.POA_ETH]: "POAETH",
    //[PAIRS.AVT_USDT]: "AVTUSD",
    [PAIRS.IOS_ETH]: "IOSETH",
    [PAIRS.POA_BTC]: "POABTC",
    [PAIRS.BFT_ETH]: "BFTETH",
    [PAIRS.FSN_ETH]: "FSNETH",
    [PAIRS.BOX_ETH]: "BOXETH",
    [PAIRS.ZIL_BTC]: "ZILBTC",
    [PAIRS.VEE_BTC]: "VEEBTC",
    //[PAIRS.SEN_USDT]: "SENUSD",
    [PAIRS.WPR_BTC]: "WPRBTC",
    [PAIRS.SNT_BTC]: "SNTBTC",
    //[PAIRS.SNT_USDT]: "SNTUSD",
    //[PAIRS.MKR_USDT]: "MKRUSD",
    //[PAIRS.UTK_USDT]: "UTKUSD",
    [PAIRS.TNB_ETH]: "TNBETH",
    //[PAIRS.ATM_USDT]: "ATMUSD",
    //[PAIRS.BNT_USDT]: "BNTUSD",
    [PAIRS.AID_ETH]: "AIDETH",
    //[PAIRS.RTE_USDT]: "RTEUSD",
    //[PAIRS.LRC_USDT]: "LRCUSD",
    [PAIRS.RTE_ETH]: "RTEETH",
    [PAIRS.WAX_ETH]: "WAXETH",
    [PAIRS.ORS_BTC]: "ORSBTC",
    //[PAIRS.ZCN_USDT]: "ZCNUSD",
    //[PAIRS.SNG_USDT]: "SNGUSD",
    [PAIRS.ABS_ETH]: "ABSETH",
    [PAIRS.LRC_BTC]: "LRCBTC",
    [PAIRS.AGI_ETH]: "AGIETH",
    //[PAIRS.TKN_USDT]: "TKNUSD",
    [PAIRS.AUC_BTC]: "AUCBTC",
    [PAIRS.STJ_BTC]: "STJBTC",
    [PAIRS.ODE_BTC]: "ODEBTC",
    [PAIRS.BNT_BTC]: "BNTBTC",
    [PAIRS.MNA_ETH]: "MNAETH",
    [PAIRS.STJ_ETH]: "STJETH",
    //[PAIRS.MTN_USDT]: "MTNUSD",
    //[PAIRS.BOX_USDT]: "BOXUSD",
    [PAIRS.NIO_ETH]: "NIOETH",
    //[PAIRS.AID_USDT]: "AIDUSD",
    //[PAIRS.MLN_USDT]: "MLNUSD",
    //[PAIRS.MIT_USDT]: "MITUSD",
    //[PAIRS.SPK_USDT]: "SPKUSD",
    [PAIRS.SAN_ETH]: "SANETH",
    //[PAIRS.WTC_USDT]: "WTCUSD",
    [PAIRS.DGX_ETH]: "DGXETH",
    //[PAIRS.CND_USDT]: "CNDUSD",
    //[PAIRS.CSX_USDT]: "CSXUSD",
    //[PAIRS.POY_USDT]: "POYUSD",
    //[PAIRS.ESS_USDT]: "ESSUSD",
    [PAIRS.SPK_ETH]: "SPKETH",
    //[PAIRS.KNC_USDT]: "KNCUSD",
    [PAIRS.NEC_BTC]: "NECBTC",
    [PAIRS.KNC_ETH]: "KNCETH",
    [PAIRS.ATM_ETH]: "ATMETH",
    [PAIRS.MIT_BTC]: "MITBTC",
    [PAIRS.CTX_BTC]: "CTXBTC",
    [PAIRS.MTN_ETH]: "MTNETH",
    //[PAIRS.REQ_USDT]: "REQUSD",
    //[PAIRS.STJ_USDT]: "STJUSD",
    [PAIRS.SNG_ETH]: "SNGETH",
    [PAIRS.POY_ETH]: "POYETH",
    [PAIRS.CND_BTC]: "CNDBTC",
    [PAIRS.SEE_ETH]: "SEEETH",
    [PAIRS.ZCN_BTC]: "ZCNBTC",
    [PAIRS.NCA_BTC]: "NCABTC",
    [PAIRS.AUC_ETH]: "AUCETH",
    [PAIRS.ESS_BTC]: "ESSBTC",
    [PAIRS.VEE_ETH]: "VEEETH",
    [PAIRS.ATM_BTC]: "ATMBTC",
    //[PAIRS.AIO_USDT]: "AIOUSD",
    [PAIRS.REQ_ETH]: "REQETH",
    //[PAIRS.DGX_USDT]: "DGXUSD",
    [PAIRS.MTN_BTC]: "MTNBTC",
    [PAIRS.UTN_ETH]: "UTNETH",
    [PAIRS.SPK_BTC]: "SPKBTC",
    [PAIRS.AIO_BTC]: "AIOBTC",
    [PAIRS.BBN_ETH]: "BBNETH",
    //[PAIRS.CFI_USDT]: "CFIUSD",
    [PAIRS.RCN_BTC]: "RCNBTC",
    //[PAIRS.DAD_USDT]: "DADUSD",
    //[PAIRS.VEE_USDT]: "VEEUSD",
    //[PAIRS.FSN_USDT]: "FSNUSD",
    [PAIRS.CBT_BTC]: "CBTBTC",
    [PAIRS.NCA_ETH]: "NCAETH",
    [PAIRS.WPR_ETH]: "WPRETH",
    [PAIRS.AID_BTC]: "AIDBTC",
    [PAIRS.DTA_ETH]: "DTAETH",
    //[PAIRS.NEC_USDT]: "NECUSD",
    [PAIRS.ZIL_ETH]: "ZILETH",
    [PAIRS.AVT_BTC]: "AVTBTC",
    [PAIRS.MLN_ETH]: "MLNETH",
    [PAIRS.RDN_ETH]: "RDNETH",
    [PAIRS.CND_ETH]: "CNDETH",
    [PAIRS.SEE_BTC]: "SEEBTC",
    //[PAIRS.WPR_USDT]: "WPRUSD",
    [PAIRS.AIO_ETH]: "AIOETH",
    [PAIRS.DTA_BTC]: "DTABTC",
    [PAIRS.CFI_BTC]: "CFIBTC",
    [PAIRS.BNT_ETH]: "BNTETH",
    [PAIRS.LRC_ETH]: "LRCETH",
    [PAIRS.RCN_ETH]: "RCNETH",
    [PAIRS.CTX_ETH]: "CTXETH",
    //[PAIRS.CBT_USDT]: "CBTUSD",
    //[PAIRS.AUC_USDT]: "AUCUSD",
    [PAIRS.AVT_ETH]: "AVTETH",
    [PAIRS.MIT_ETH]: "MITETH",
    [PAIRS.CBT_ETH]: "CBTETH",
    [PAIRS.WTC_ETH]: "WTCETH",
    [PAIRS.RDN_BTC]: "RDNBTC",
  },
  fees: {
    taker: 0.2,
  },
  minOrder: {
    //todo: add min order volumes
    //based on:
    //  10 mod token_usd - 1
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids,
      asks: data.asks,
    }),
    order: data => ({ price: data.price, volume: data.amount }),
  },
};

module.exports = { bitfinex };
