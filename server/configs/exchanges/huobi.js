const { PAIRS } = require("../globalPairs");
const { secret } = require("./huobi.secret");

//https://github.com/huobiapi/API_Docs_en/wiki/REST_Reference#get-marketdepth---market-depth
const huobi = {
  name: "huobi",
  url: "https://api.huobi.pro",
  ...secret,
  getOrderBook(pairIndex) {
    return `${this.url}/market/depth?type=step1&symbol=${
      this.pairs[pairIndex]
      }`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "btcusdt",
    [PAIRS.ETH_BTC]: "ethbtc",
    [PAIRS.ETH_USDT]: "ethusdt",
    [PAIRS.EOS_USDT]: "eosusdt",
    [PAIRS.EOS_BTC]: "eosbtc",
    [PAIRS.EOS_ETH]: "eoseth",

    // [PAIRS.OMG_ETH]: "omgeth",
    // [PAIRS.MTN_ETH]: "mtneth",
    // [PAIRS.TRX_ETH]: "trxeth",
    // [PAIRS.PAI_ETH]: "paieth",
    // [PAIRS.POWR_ETH]: "powreth",
    // [PAIRS.EDU_ETH]: "edueth",
    // [PAIRS.BTM_ETH]: "btmeth",
    // [PAIRS.ELF_ETH]: "elfeth",
    // [PAIRS.DGB_ETH]: "dgbeth",
    // [PAIRS.BOX_ETH]: "boxeth",
    // [PAIRS.NCASH_ETH]: "ncasheth",
    // [PAIRS.CTXC_ETH]: "ctxceth",
    // [PAIRS.SWFTC_ETH]: "swftceth",
    // [PAIRS.GNX_ETH]: "gnxeth",
    // [PAIRS.IOST_ETH]: "iosteth",
    // [PAIRS.HT_ETH]: "hteth",
    // [PAIRS.ZLA_ETH]: "zlaeth",
    // [PAIRS.GXS_ETH]: "gxceth",
    // [PAIRS.HIT_ETH]: "hiteth",
    // [PAIRS.REQ_ETH]: "reqeth",
    // [PAIRS.KAN_ETH]: "kaneth",
    // [PAIRS.ITC_ETH]: "itceth",
    // [PAIRS.LBA_ETH]: "lbaeth",
    // [PAIRS.QTUM_ETH]: "qtumeth",
    // [PAIRS.TOPC_ETH]: "topceth",
    // [PAIRS.ARDR_ETH]: "ardreth",
    // [PAIRS.XMR_ETH]: "xmreth",
    // [PAIRS.POLY_ETH]: "polyeth",
    // [PAIRS.TNT_ETH]: "tnteth",
    // [PAIRS.ONT_ETH]: "onteth",
    // [PAIRS.DBC_ETH]: "dbceth",
    // [PAIRS.CMT_ETH]: "cmteth",
    // [PAIRS.OCN_ETH]: "ocneth",
    // [PAIRS.DTA_ETH]: "dtaeth",
    // [PAIRS.ZIL_ETH]: "zileth",
    // [PAIRS.XLM_ETH]: "xlmeth",
    // [PAIRS.XVG_ETH]: "xvgeth",
    // [PAIRS.DAT_ETH]: "dateth",
    // [PAIRS.ADA_ETH]: "adaeth",
    // [PAIRS.XZC_ETH]: "xzceth",
    // [PAIRS.AIDOC_ETH]: "aidoceth",
    // [PAIRS.GRS_ETH]: "grseth",
    // [PAIRS.SNC_ETH]: "snceth",
    // [PAIRS.NAS_ETH]: "naseth",
    // [PAIRS.YEE_ETH]: "yeeeth",
    // [PAIRS.WTC_ETH]: "wtceth",
    // [PAIRS.DCR_ETH]: "dcreth",
    // [PAIRS.ELA_ETH]: "elaeth",
    // [PAIRS.RCN_ETH]: "rcneth",
    // [PAIRS.ACT_ETH]: "acteth",
    // [PAIRS.PROPY_ETH]: "propyeth",
    // [PAIRS.QASH_ETH]: "qasheth",
    // [PAIRS.AST_ETH]: "asteth",
    // [PAIRS.IOTA_ETH]: "iotaeth",
    // [PAIRS.CHAT_ETH]: "chateth",
    // [PAIRS.LUN_ETH]: "luneth",
    // [PAIRS.BAT_ETH]: "bateth",
    // [PAIRS.MANA_ETH]: "manaeth",
    // [PAIRS.TNB_ETH]: "tnbeth",
    // [PAIRS.UTK_ETH]: "utketh",
    // [PAIRS.SOC_ETH]: "soceth",
    // [PAIRS.ABT_ETH]: "abteth",
    // [PAIRS.EKO_ETH]: "ekoeth",
    // [PAIRS.LET_ETH]: "leteth",
    // [PAIRS.WICC_ETH]: "wicceth",
    // [PAIRS.VET_ETH]: "veteth",
    // [PAIRS.GNT_ETH]: "gnteth",
    // [PAIRS.RDN_ETH]: "rdneth",
    // [PAIRS.ZRX_ETH]: "zrxeth",
    // [PAIRS.BTS_ETH]: "btseth",
    // [PAIRS.SALT_ETH]: "salteth",
    // [PAIRS.RUFF_ETH]: "ruffeth",
    // [PAIRS.THETA_ETH]: "thetaeth",
    // [PAIRS.BLZ_ETH]: "blzeth",
    // [PAIRS.BIX_ETH]: "bixeth",
    // [PAIRS.HC_ETH]: "hceth",
    // [PAIRS.MTX_ETH]: "mtxeth",
    // [PAIRS.WAX_ETH]: "waxeth",
    // [PAIRS.WAVES_ETH]: "waveseth",
    // [PAIRS.PAY_ETH]: "payeth",
    // [PAIRS.MCO_ETH]: "mcoeth",
    // [PAIRS.LINK_ETH]: "linketh",
    // [PAIRS.ICX_ETH]: "icxeth",
    // [PAIRS.STK_ETH]: "stketh",
    // [PAIRS.APPC_ETH]: "appceth",
    // [PAIRS.WAN_ETH]: "waneth",
    // [PAIRS.CVC_ETH]: "cvceth",
    // [PAIRS.KNC_ETH]: "knceth",
    // [PAIRS.SRN_ETH]: "srneth",
    // [PAIRS.QUN_ETH]: "quneth",
    // [PAIRS.MDS_ETH]: "mdseth",
    // [PAIRS.MEET_ETH]: "meeteth",
    // [PAIRS.DGD_ETH]: "dgdeth",
    // [PAIRS.ADX_ETH]: "adxeth",
    // [PAIRS.LSK_ETH]: "lsketh",
    // [PAIRS.SMT_ETH]: "smteth",
    // [PAIRS.WPR_ETH]: "wpreth",
    // [PAIRS.OST_ETH]: "osteth",
    // [PAIRS.EVX_ETH]: "evxeth",
    // [PAIRS.QSP_ETH]: "qspeth",
    // [PAIRS.GAS_ETH]: "gaseth",
    // [PAIRS.ENG_ETH]: "engeth",
    // [PAIRS.BFT_ETH]: "bfteth",
    // [PAIRS.STEEM_ETH]: "steemeth",
    // [PAIRS.BCH_BTC]: "bchbtc",
    // [PAIRS.XRP_BTC]: "xrpbtc",
    // [PAIRS.ZEC_BTC]: "zecbtc",
    // [PAIRS.LTC_BTC]: "ltcbtc",
    // [PAIRS.DASH_BTC]: "dashbtc",
    // [PAIRS.TRX_BTC]: "trxbtc",
    // [PAIRS.MEET_BTC]: "meetbtc",
    // [PAIRS.BTM_BTC]: "btmbtc",
    // [PAIRS.MTN_BTC]: "mtnbtc",
    // [PAIRS.PROPY_BTC]: "propybtc",
    // [PAIRS.ZLA_BTC]: "zlabtc",
    // [PAIRS.PAI_BTC]: "paibtc",
    // [PAIRS.EDU_BTC]: "edubtc",
    // [PAIRS.POWR_BTC]: "powrbtc",
    // [PAIRS.HT_BTC]: "htbtc",
    // [PAIRS.CTXC_BTC]: "ctxcbtc",
    // [PAIRS.QTUM_BTC]: "qtumbtc",
    // [PAIRS.HIT_BTC]: "hitbtc",
    // [PAIRS.BOX_BTC]: "boxbtc",
    // [PAIRS.GXS_BTC]: "gxcbtc",
    // [PAIRS.OCN_BTC]: "ocnbtc",
    // [PAIRS.SWFTC_BTC]: "swftcbtc",
    // [PAIRS.REQ_BTC]: "reqbtc",
    // [PAIRS.DGB_BTC]: "dgbbtc",
    // [PAIRS.NCASH_BTC]: "ncashbtc",
    // [PAIRS.ELF_BTC]: "elfbtc",
    // [PAIRS.ITC_BTC]: "itcbtc",
    // [PAIRS.KAN_BTC]: "kanbtc",
    // [PAIRS.ETC_BTC]: "etcbtc",
    // [PAIRS.POLY_BTC]: "polybtc",
    // [PAIRS.DBC_BTC]: "dbcbtc",
    // [PAIRS.GNX_BTC]: "gnxbtc",
    // [PAIRS.BAT_BTC]: "batbtc",
    // [PAIRS.DCR_BTC]: "dcrbtc",
    // [PAIRS.ELA_BTC]: "elabtc",
    // [PAIRS.ADA_BTC]: "adabtc",
    // [PAIRS.SBTC_BTC]: "sbtcbtc",
    // [PAIRS.DTA_BTC]: "dtabtc",
    // [PAIRS.LBA_BTC]: "lbabtc",
    // [PAIRS.DAT_BTC]: "datbtc",
    // [PAIRS.XEM_BTC]: "xembtc",
    // [PAIRS.AIDOC_BTC]: "aidocbtc",
    // [PAIRS.ARDR_BTC]: "ardrbtc",
    // [PAIRS.CMT_BTC]: "cmtbtc",
    // [PAIRS.MTX_BTC]: "mtxbtc",
    // [PAIRS.SNC_BTC]: "sncbtc",
    // [PAIRS.ZRX_BTC]: "zrxbtc",
    // [PAIRS.YEE_BTC]: "yeebtc",
    // [PAIRS.SALT_BTC]: "saltbtc",
    // [PAIRS.IOST_BTC]: "iostbtc",
    // [PAIRS.LUN_BTC]: "lunbtc",
    // [PAIRS.TNT_BTC]: "tntbtc",
    // [PAIRS.ONT_BTC]: "ontbtc",
    // [PAIRS.RCN_BTC]: "rcnbtc",
    // [PAIRS.CHAT_BTC]: "chatbtc",
    // [PAIRS.NEO_BTC]: "neobtc",
    // [PAIRS.BTS_BTC]: "btsbtc",
    // [PAIRS.SOC_BTC]: "socbtc",
    // [PAIRS.GNT_BTC]: "gntbtc",
    // [PAIRS.XLM_BTC]: "xlmbtc",
    // [PAIRS.XMR_BTC]: "xmrbtc",
    // [PAIRS.OMG_BTC]: "omgbtc",
    // [PAIRS.ZIL_BTC]: "zilbtc",
    // [PAIRS.XZC_BTC]: "xzcbtc",
    // [PAIRS.STORJ_BTC]: "storjbtc",
    // [PAIRS.NAS_BTC]: "nasbtc",
    // [PAIRS.BLZ_BTC]: "blzbtc",
    // [PAIRS.XVG_BTC]: "xvgbtc",
    // [PAIRS.ABT_BTC]: "abtbtc",
    // [PAIRS.RDN_BTC]: "rdnbtc",
    // [PAIRS.EKO_BTC]: "ekobtc",
    // [PAIRS.LET_BTC]: "letbtc",
    // [PAIRS.AST_BTC]: "astbtc",
    // [PAIRS.MANA_BTC]: "manabtc",
    // [PAIRS.ACT_BTC]: "actbtc",
    // [PAIRS.STK_BTC]: "stkbtc",
    // [PAIRS.GRS_BTC]: "grsbtc",
    // [PAIRS.WICC_BTC]: "wiccbtc",
    // [PAIRS.VET_BTC]: "vetbtc",
    // [PAIRS.SRN_BTC]: "srnbtc",
    // [PAIRS.TNB_BTC]: "tnbbtc",
    // [PAIRS.IOTA_BTC]: "iotabtc",
    // [PAIRS.MTL_BTC]: "mtlbtc",
    // [PAIRS.KNC_BTC]: "kncbtc",
    // [PAIRS.ADX_BTC]: "adxbtc",
    // [PAIRS.WTC_BTC]: "wtcbtc",
    // [PAIRS.LSK_BTC]: "lskbtc",
    // [PAIRS.HC_BTC]: "hcbtc",
    // [PAIRS.CVC_BTC]: "cvcbtc",
    // [PAIRS.MDS_BTC]: "mdsbtc",
    // [PAIRS.QASH_BTC]: "qashbtc",
    // [PAIRS.ICX_BTC]: "icxbtc",
    // [PAIRS.DGD_BTC]: "dgdbtc",
    // [PAIRS.APPC_BTC]: "appcbtc",
    // [PAIRS.WAX_BTC]: "waxbtc",
    // [PAIRS.RUFF_BTC]: "ruffbtc",
    // [PAIRS.SNT_BTC]: "sntbtc",
    // [PAIRS.QUN_BTC]: "qunbtc",
    // [PAIRS.THETA_BTC]: "thetabtc",
    // [PAIRS.WAN_BTC]: "wanbtc",
    // [PAIRS.OST_BTC]: "ostbtc",
    // [PAIRS.UTK_BTC]: "utkbtc",
    // [PAIRS.BIX_BTC]: "bixbtc",
    // [PAIRS.PAY_BTC]: "paybtc",
    // [PAIRS.BCD_BTC]: "bcdbtc",
    // [PAIRS.LINK_BTC]: "linkbtc",
    // [PAIRS.BCX_BTC]: "bcxbtc",
    // [PAIRS.GAS_BTC]: "gasbtc",
    // [PAIRS.MCO_BTC]: "mcobtc",
    // [PAIRS.ENG_BTC]: "engbtc",
    // [PAIRS.WPR_BTC]: "wprbtc",
    // [PAIRS.TOPC_BTC]: "topcbtc",
    // [PAIRS.SMT_BTC]: "smtbtc",
    // [PAIRS.EVX_BTC]: "evxbtc",
    // [PAIRS.PHX_BTC]: "phxbtc",
    // [PAIRS.BFT_BTC]: "bftbtc",
    // [PAIRS.QSP_BTC]: "qspbtc",
    // [PAIRS.BIFI_BTC]: "bifibtc",
    // [PAIRS.STEEM_BTC]: "steembtc",
    // [PAIRS.WAVES_BTC]: "wavesbtc",
    // [PAIRS.BTG_BTC]: "btgbtc",
    // [PAIRS.BCH_USDT]: "bchusdt",
    // [PAIRS.XRP_USDT]: "xrpusdt",
    // [PAIRS.BTM_USDT]: "btmusdt",
    // [PAIRS.TRX_USDT]: "trxusdt",
    // [PAIRS.ZEC_USDT]: "zecusdt",
    // [PAIRS.OMG_USDT]: "omgusdt",
    // [PAIRS.PAI_USDT]: "paiusdt",
    // [PAIRS.ETC_USDT]: "etcusdt",
    // [PAIRS.QTUM_USDT]: "qtumusdt",
    // [PAIRS.DASH_USDT]: "dashusdt",
    // [PAIRS.LTC_USDT]: "ltcusdt",
    // [PAIRS.HT_USDT]: "htusdt",
    // [PAIRS.CTXC_USDT]: "ctxcusdt",
    // [PAIRS.ONT_USDT]: "ontusdt",
    // [PAIRS.IOST_USDT]: "iostusdt",
    // [PAIRS.OCN_USDT]: "ocnusdt",
    // [PAIRS.WICC_USDT]: "wiccusdt",
    // [PAIRS.ADA_USDT]: "adausdt",
    // [PAIRS.ELF_USDT]: "elfusdt",
    // [PAIRS.ZIL_USDT]: "zilusdt",
    // [PAIRS.NAS_USDT]: "nasusdt",
    // [PAIRS.NEO_USDT]: "neousdt",
    // [PAIRS.ITC_USDT]: "itcusdt",
    // [PAIRS.CMT_USDT]: "cmtusdt",
    // [PAIRS.DTA_USDT]: "dtausdt",
    // [PAIRS.GNT_USDT]: "gntusdt",
    // [PAIRS.BTS_USDT]: "btsusdt",
    // [PAIRS.SOC_USDT]: "socusdt",
    // [PAIRS.STORJ_USDT]: "storjusdt",
    // [PAIRS.LET_USDT]: "letusdt",
    // [PAIRS.ELA_USDT]: "elausdt",
    // [PAIRS.THETA_USDT]: "thetausdt",
    // [PAIRS.VET_USDT]: "vetusdt",
    // [PAIRS.XEM_USDT]: "xemusdt",
    // [PAIRS.IOTA_USDT]: "iotausdt",
    // [PAIRS.CVC_USDT]: "cvcusdt",
    // [PAIRS.RUFF_USDT]: "ruffusdt",
    // [PAIRS.HC_USDT]: "hcusdt",
    // [PAIRS.ACT_USDT]: "actusdt",
    // [PAIRS.SMT_USDT]: "smtusdt",
    // [PAIRS.SNT_USDT]: "sntusdt",
    // [PAIRS.MDS_USDT]: "mdsusdt",
    // [PAIRS.STEEM_USDT]: "steemusdt",
    // [PAIRS.EKT_BTC]: "ektbtc",
    // [PAIRS.MAN_BTC]: "manbtc",
    // [PAIRS.MAN_ETH]: "maneth",
    // [PAIRS.EKT_ETH]: "ekteth",
    // [PAIRS.UUU_ETH]: "uuueth",
    // [PAIRS.AE_BTC]: "aebtc",
    // [PAIRS.GSC_ETH]: "gsceth",
    // [PAIRS.GSC_BTC]: "gscbtc",
    // [PAIRS.AE_ETH]: "aeeth",
    // [PAIRS.CNN_BTC]: "cnnbtc",
    // [PAIRS.CVCOIN_BTC]: "cvcoinbtc",
    // [PAIRS.UUU_BTC]: "uuubtc",
    // [PAIRS.SHE_BTC]: "shebtc",
    // [PAIRS.AAC_BTC]: "aacbtc",
    // [PAIRS.SHE_ETH]: "sheeth",
    // [PAIRS.UIP_BTC]: "uipbtc",
    // [PAIRS.PNT_ETH]: "pnteth",
    // [PAIRS.CNN_ETH]: "cnneth",
    // [PAIRS.UIP_ETH]: "uipeth",
    // [PAIRS.SSP_BTC]: "sspbtc",
    // [PAIRS.TOS_BTC]: "tosbtc",
    // [PAIRS.IIC_ETH]: "iiceth",
    // [PAIRS.SSP_ETH]: "sspeth",
    // [PAIRS.YCC_BTC]: "yccbtc",
    // [PAIRS.IIC_BTC]: "iicbtc",
    // [PAIRS.BUT_BTC]: "butbtc",
    // [PAIRS.GVE_BTC]: "gvebtc",
    // [PAIRS.DAC_ETH]: "daceth",
    // [PAIRS.MEX_BTC]: "mexbtc",
    // [PAIRS.LXT_BTC]: "lxtbtc",
    // [PAIRS.FTI_BTC]: "ftibtc",
    // [PAIRS.SEELE_BTC]: "seelebtc",
    // [PAIRS.AAC_ETH]: "aaceth",
    // [PAIRS.XMX_ETH]: "xmxeth",
    //[PAIRS.HOT_BTC]: "hotbtc",
    //[PAIRS.HOT_ETH]: "hoteth",
    // [PAIRS.HydroProtocol_BTC]: "hotbtc", // for Huobi and OKex
    // [PAIRS.HydroProtocol_ETH]: "hoteth", // for Huobi and OKex
    // [PAIRS.TOS_ETH]: "toseth",
    // [PAIRS.KCASH_BTC]: "kcashbtc",
    // [PAIRS.CDC_BTC]: "cdcbtc",

    // [PAIRS.SEELE_ETH]: "seeleeth",
    // [PAIRS.IDT_BTC]: "idtbtc",
    // [PAIRS.GTC_BTC]: "gtcbtc",
    // [PAIRS.YCC_ETH]: "ycceth",
    // [PAIRS.RTE_BTC]: "rtebtc",
    // [PAIRS.GVE_ETH]: "gveeth",
    // [PAIRS.BUT_ETH]: "buteth",
    // [PAIRS.FTI_ETH]: "ftieth",
    // [PAIRS.IDT_ETH]: "idteth",
    // [PAIRS.GET_BTC]: "getbtc",
    // [PAIRS.PNT_BTC]: "pntbtc",
    // [PAIRS.PC_ETH]: "pceth",
    // [PAIRS.MEX_ETH]: "mexeth",
    // [PAIRS.PC_BTC]: "pcbtc",
    // [PAIRS.RTE_ETH]: "rteeth",
    // [PAIRS.TRIO_ETH]: "trioeth",
    // [PAIRS.TRIO_BTC]: "triobtc",
    // [PAIRS.XMX_BTC]: "xmxbtc",
    // [PAIRS.GET_ETH]: "geteth",
    // [PAIRS.CVCOIN_ETH]: "cvcoineth",
    // [PAIRS.LYM_ETH]: "lymeth",
    // [PAIRS.LXT_ETH]: "lxteth",
    // [PAIRS.BKBT_BTC]: "bkbtbtc",
    // [PAIRS.LYM_BTC]: "lymbtc",
    // [PAIRS.DATX_ETH]: "datxeth",
    // [PAIRS.NCC_BTC]: "nccbtc",
    // [PAIRS.MT_ETH]: "mteth",
    // [PAIRS.GTC_ETH]: "gtceth",
    // [PAIRS.DAC_BTC]: "dacbtc",
    // [PAIRS.BCV_BTC]: "bcvbtc",
    // [PAIRS.UC_BTC]: "ucbtc",
    // [PAIRS.BKBT_ETH]: "bkbteth",
    // [PAIRS.MT_BTC]: "mtbtc",
    // [PAIRS.DATX_BTC]: "datxbtc",
    // [PAIRS.NCC_ETH]: "ncceth",
    // [PAIRS.CDC_ETH]: "cdceth",
    // [PAIRS.EGCC_BTC]: "egccbtc",
    // [PAIRS.KCASH_ETH]: "kcasheth",
    // [PAIRS.BCV_ETH]: "bcveth",
    // [PAIRS.UC_ETH]: "uceth",
    // [PAIRS.EGCC_ETH]: "egcceth",
    // [PAIRS.REN_ETH]: "reneth",
    // [PAIRS.FAIR_BTC]: "fairbtc",
    // [PAIRS.REN_BTC]: "renbtc",
    // [PAIRS.FAIR_ETH]: "faireth",
  },
  fees: {
    taker: 0.2,
  },
  minOrder: {
    //todo: add min order volumes
    // no limits
  },
  mappers: {
    orderbook: data => ({
      bids: data.tick.bids,
      asks: data.tick.asks,
    }),
    order: data => ({ price: data[0], volume: data[1] }),
  },
};

module.exports = { huobi };
