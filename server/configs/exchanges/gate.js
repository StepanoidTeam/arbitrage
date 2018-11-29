const { PAIRS } = require("../globalPairs");

const gate = {
  name: "gate",
  url: "https://data.gate.io",
  getOrderBook(pairIndex) {
    return `${this.url}/api2/1/orderBook/${this.pairs[pairIndex]}`;
  },
  pairs: {
    [PAIRS.BTM_USDT]: "BTM_USDT",
    [PAIRS.ETH_USDT]: "ETH_USDT",
    [PAIRS.DOGE_USDT]: "DOGE_USDT",
    [PAIRS.AE_USDT]: "AE_USDT",
    [PAIRS.BTC_USDT]: "BTC_USDT",
    [PAIRS.QTUM_USDT]: "QTUM_USDT",
    [PAIRS.EOS_USDT]: "EOS_USDT",
    [PAIRS.MDA_USDT]: "MDA_USDT",
    [PAIRS.BU_USDT]: "BU_USDT",
    [PAIRS.BCD_USDT]: "BCD_USDT",
    [PAIRS.GTC_USDT]: "GTC_USDT",
    [PAIRS.ETC_USDT]: "ETC_USDT",
    [PAIRS.OCN_USDT]: "OCN_USDT",
    [PAIRS.BU_ETH]: "BU_ETH",
    [PAIRS.TCT_USDT]: "TCT_USDT",
    [PAIRS.XRP_USDT]: "XRP_USDT",
    [PAIRS.ONT_USDT]: "ONT_USDT",
    [PAIRS.LYM_USDT]: "LYM_USDT",
    [PAIRS.IHT_USDT]: "IHT_USDT",
    [PAIRS.GSE_USDT]: "GSE_USDT",
    [PAIRS.LRN_USDT]: "LRN_USDT",
    [PAIRS.XTZ_BTC]: "XTZ_BTC",
    [PAIRS.NAS_USDT]: "NAS_USDT",
    [PAIRS.BTO_USDT]: "BTO_USDT",
    [PAIRS.DBC_USDT]: "DBC_USDT",
    [PAIRS.ADA_USDT]: "ADA_USDT",
    [PAIRS.BU_BTC]: "BU_BTC",
    [PAIRS.HIT_USDT]: "HIT_USDT",
    [PAIRS.KICK_USDT]: "KICK_USDT",
    [PAIRS.FTI_USDT]: "FTI_USDT",
    [PAIRS.XTZ_USDT]: "XTZ_USDT",
    [PAIRS.ZEC_USDT]: "ZEC_USDT",
    [PAIRS.AE_BTC]: "AE_BTC",
    [PAIRS.SOP_USDT]: "SOP_USDT",
    [PAIRS.TSL_USDT]: "TSL_USDT",
    [PAIRS.XTZ_ETH]: "XTZ_ETH",
    [PAIRS.LTC_USDT]: "LTC_USDT",
    [PAIRS.SKM_USDT]: "SKM_USDT",
    [PAIRS.BCH_USDT]: "BCH_USDT",
    [PAIRS.BTS_USDT]: "BTS_USDT",
    [PAIRS.BAT_USDT]: "BAT_USDT",
    [PAIRS.PAX_USDT]: "PAX_USDT",
    [PAIRS.HAV_USDT]: "HAV_USDT",
    [PAIRS.ELF_USDT]: "ELF_USDT",
    [PAIRS.ZIL_USDT]: "ZIL_USDT",
    [PAIRS.CDT_USDT]: "CDT_USDT",
    [PAIRS.LYM_ETH]: "LYM_ETH",
    [PAIRS.PST_USDT]: "PST_USDT",
    [PAIRS.TOMO_ETH]: "TOMO_ETH",
    [PAIRS.LYM_BTC]: "LYM_BTC",
    [PAIRS.TOMO_USDT]: "TOMO_USDT",
    [PAIRS.TRX_USDT]: "TRX_USDT",
    [PAIRS.RED_USDT]: "RED_USDT",
    [PAIRS.SOP_ETH]: "SOP_ETH",
    [PAIRS.XMC_USDT]: "XMC_USDT",
    [PAIRS.HC_USDT]: "HC_USDT",
    [PAIRS.ETH_BTC]: "ETH_BTC",
    [PAIRS.VET_USDT]: "VET_USDT",
    [PAIRS.QTUM_BTC]: "QTUM_BTC",
    [PAIRS.STX_USDT]: "STX_USDT",
    [PAIRS.BTM_ETH]: "BTM_ETH",
    [PAIRS.ZSC_ETH]: "ZSC_ETH",
    [PAIRS.GXS_USDT]: "GXS_USDT",
    [PAIRS.HAV_ETH]: "HAV_ETH",
    [PAIRS.AE_ETH]: "AE_ETH",
    [PAIRS.BTM_BTC]: "BTM_BTC",
    [PAIRS.EOS_ETH]: "EOS_ETH",
    [PAIRS.LEMO_ETH]: "LEMO_ETH",
    [PAIRS.DX_ETH]: "DX_ETH",
    [PAIRS.QBT_USDT]: "QBT_USDT",
    [PAIRS.XLM_USDT]: "XLM_USDT",
    [PAIRS.DPY_USDT]: "DPY_USDT",
    [PAIRS.ETC_BTC]: "ETC_BTC",
    [PAIRS.XMR_USDT]: "XMR_USDT",
    [PAIRS.ICX_USDT]: "ICX_USDT",
    [PAIRS.RDN_USDT]: "RDN_USDT",
    [PAIRS.NEO_USDT]: "NEO_USDT",
    [PAIRS.RUFF_USDT]: "RUFF_USDT",
    [PAIRS.REM_USDT]: "REM_USDT",
    [PAIRS.MAN_USDT]: "MAN_USDT",
    [PAIRS.ABT_USDT]: "ABT_USDT",
    [PAIRS.JNT_USDT]: "JNT_USDT",
    [PAIRS.LRC_USDT]: "LRC_USDT",
    [PAIRS.DOGE_BTC]: "DOGE_BTC",
    [PAIRS.ZRX_USDT]: "ZRX_USDT",
    [PAIRS.NKN_USDT]: "NKN_USDT",
    [PAIRS.DASH_USDT]: "DASH_USDT",
    [PAIRS.BLZ_USDT]: "BLZ_USDT",
    [PAIRS.TNT_USDT]: "TNT_USDT",
    [PAIRS.GARD_USDT]: "GARD_USDT",
    [PAIRS.LEND_USDT]: "LEND_USDT",
    [PAIRS.DDD_USDT]: "DDD_USDT",
    [PAIRS.MDT_USDT]: "MDT_USDT",
    [PAIRS.TIPS_ETH]: "TIPS_ETH",
    [PAIRS.SBTC_USDT]: "SBTC_USDT",
    [PAIRS.MDT_ETH]: "MDT_ETH",
    [PAIRS.RFR_USDT]: "RFR_USDT",
    [PAIRS.FTI_ETH]: "FTI_ETH",
    [PAIRS.BCN_USDT]: "BCN_USDT",
    [PAIRS.MCO_USDT]: "MCO_USDT",
    [PAIRS.BOT_USDT]: "BOT_USDT",
    [PAIRS.KNC_USDT]: "KNC_USDT",
    [PAIRS.MDT_BTC]: "MDT_BTC",
    [PAIRS.MAN_ETH]: "MAN_ETH",
    [PAIRS.LEMO_USDT]: "LEMO_USDT",
    [PAIRS.BCDN_USDT]: "BCDN_USDT",
    [PAIRS.LUN_USDT]: "LUN_USDT",
    [PAIRS.BCX_USDT]: "BCX_USDT",
    [PAIRS.SENC_USDT]: "SENC_USDT",
    [PAIRS.GNX_USDT]: "GNX_USDT",
    [PAIRS.MTN_USDT]: "MTN_USDT",
    [PAIRS.STX_ETH]: "STX_ETH",
    [PAIRS.XRP_BTC]: "XRP_BTC",
    [PAIRS.QKC_USDT]: "QKC_USDT",
    [PAIRS.OMG_USDT]: "OMG_USDT",
    [PAIRS.MANA_USDT]: "MANA_USDT",
    [PAIRS.QSP_USDT]: "QSP_USDT",
    [PAIRS.TIO_USDT]: "TIO_USDT",
    [PAIRS.RED_ETH]: "RED_ETH",
    [PAIRS.KICK_ETH]: "KICK_ETH",
    [PAIRS.THETA_USDT]: "THETA_USDT",
    [PAIRS.GAS_USDT]: "GAS_USDT",
    [PAIRS.ETC_ETH]: "ETC_ETH",
    [PAIRS.INK_USDT]: "INK_USDT",
    [PAIRS.BCN_BTC]: "BCN_BTC",
    [PAIRS.BAT_BTC]: "BAT_BTC",
    [PAIRS.QASH_USDT]: "QASH_USDT",
    [PAIRS.IHT_ETH]: "IHT_ETH",
    [PAIRS.MDA_ETH]: "MDA_ETH",
    [PAIRS.ZIL_ETH]: "ZIL_ETH",
    [PAIRS.DOCK_USDT]: "DOCK_USDT",
    [PAIRS.SALT_USDT]: "SALT_USDT",
    [PAIRS.MOBI_USDT]: "MOBI_USDT",
    [PAIRS.NAS_ETH]: "NAS_ETH",
    [PAIRS.BCH_BTC]: "BCH_BTC",
    [PAIRS.TNC_USDT]: "TNC_USDT",
    [PAIRS.BIFI_USDT]: "BIFI_USDT",
    [PAIRS.IOTX_USDT]: "IOTX_USDT",
    [PAIRS.RCN_USDT]: "RCN_USDT",
    [PAIRS.REM_ETH]: "REM_ETH",
    [PAIRS.GTC_BTC]: "GTC_BTC",
    [PAIRS.SNT_USDT]: "SNT_USDT",
    [PAIRS.EOSDAC_ETH]: "EOSDAC_ETH",
    [PAIRS.QTUM_ETH]: "QTUM_ETH",
    [PAIRS.HSC_USDT]: "HSC_USDT",
    [PAIRS.ONT_ETH]: "ONT_ETH",
    [PAIRS.SMT_USDT]: "SMT_USDT",
    [PAIRS.SOUL_USDT]: "SOUL_USDT",
    [PAIRS.PAY_USDT]: "PAY_USDT",
    [PAIRS.HIT_ETH]: "HIT_ETH",
    [PAIRS.BCD_BTC]: "BCD_BTC",
    [PAIRS.CS_USDT]: "CS_USDT",
    [PAIRS.GTC_ETH]: "GTC_ETH",
    [PAIRS.NKN_ETH]: "NKN_ETH",
    [PAIRS.LSK_USDT]: "LSK_USDT",
    [PAIRS.RATING_USDT]: "RATING_USDT",
    [PAIRS.ZEC_BTC]: "ZEC_BTC",
    [PAIRS.JNT_ETH]: "JNT_ETH",
    [PAIRS.FUEL_USDT]: "FUEL_USDT",
    [PAIRS.DX_USDT]: "DX_USDT",
    [PAIRS.FIL_USDT]: "FIL_USDT",
    [PAIRS.EOSDAC_USDT]: "EOSDAC_USDT",
    [PAIRS.LRN_ETH]: "LRN_ETH",
    [PAIRS.PST_ETH]: "PST_ETH",
    [PAIRS.LBA_USDT]: "LBA_USDT",
    [PAIRS.RLC_USDT]: "RLC_USDT",
    [PAIRS.FUN_USDT]: "FUN_USDT",
    [PAIRS.MDS_USDT]: "MDS_USDT",
    [PAIRS.MOBI_ETH]: "MOBI_ETH",
    [PAIRS.SBTC_BTC]: "SBTC_BTC",
    [PAIRS.EOS_BTC]: "EOS_BTC",
    [PAIRS.OST_ETH]: "OST_ETH",
    [PAIRS.ZSC_USDT]: "ZSC_USDT",
    [PAIRS.GNT_USDT]: "GNT_USDT",
    [PAIRS.GARD_ETH]: "GARD_ETH",
    [PAIRS.NAS_BTC]: "NAS_BTC",
    [PAIRS.MED_USDT]: "MED_USDT",
    [PAIRS.DBC_BTC]: "DBC_BTC",
    [PAIRS.IOTA_USDT]: "IOTA_USDT",
    [PAIRS.STORJ_USDT]: "STORJ_USDT",
    [PAIRS.DCR_USDT]: "DCR_USDT",
    [PAIRS.QLC_USDT]: "QLC_USDT",
    [PAIRS.GEM_USDT]: "GEM_USDT",
    [PAIRS.BNB_USDT]: "BNB_USDT",
    [PAIRS.TCT_ETH]: "TCT_ETH",
    [PAIRS.QBT_QTUM]: "QBT_QTUM",
    [PAIRS.KNC_ETH]: "KNC_ETH",
    [PAIRS.DRGN_ETH]: "DRGN_ETH",
    [PAIRS.XVG_USDT]: "XVG_USDT",
    [PAIRS.MITH_USDT]: "MITH_USDT",
    [PAIRS.CVC_USDT]: "CVC_USDT",
    [PAIRS.NEO_BTC]: "NEO_BTC",
    [PAIRS.SNET_USDT]: "SNET_USDT",
    [PAIRS.OCN_ETH]: "OCN_ETH",
    [PAIRS.DDD_ETH]: "DDD_ETH",
    [PAIRS.QBT_ETH]: "QBT_ETH",
    [PAIRS.TRX_ETH]: "TRX_ETH",
    [PAIRS.XLM_BTC]: "XLM_BTC",
    [PAIRS.LSK_BTC]: "LSK_BTC",
    [PAIRS.TNC_ETH]: "TNC_ETH",
    [PAIRS.BNTY_USDT]: "BNTY_USDT",
    [PAIRS.DBC_ETH]: "DBC_ETH",
    [PAIRS.COFI_USDT]: "COFI_USDT",
    [PAIRS.CDT_ETH]: "CDT_ETH",
    [PAIRS.QKC_ETH]: "QKC_ETH",
    [PAIRS.BAT_ETH]: "BAT_ETH",
    [PAIRS.OPEN_USDT]: "OPEN_USDT",
    [PAIRS.SALT_ETH]: "SALT_ETH",
    [PAIRS.MCO_ETH]: "MCO_ETH",
    [PAIRS.LTC_BTC]: "LTC_BTC",
    [PAIRS.OST_USDT]: "OST_USDT",
    [PAIRS.ADA_BTC]: "ADA_BTC",
    [PAIRS.LINK_USDT]: "LINK_USDT",
    [PAIRS.BFT_USDT]: "BFT_USDT",
    [PAIRS.REQ_USDT]: "REQ_USDT",
    [PAIRS.DATA_ETH]: "DATA_ETH",
    [PAIRS.BTG_BTC]: "BTG_BTC",
    [PAIRS.BTO_ETH]: "BTO_ETH",
    [PAIRS.LRC_ETH]: "LRC_ETH",
    [PAIRS.DRGN_USDT]: "DRGN_USDT",
    [PAIRS.RDN_ETH]: "RDN_ETH",
    [PAIRS.GXS_BTC]: "GXS_BTC",
    [PAIRS.OMG_ETH]: "OMG_ETH",
    [PAIRS.ICX_ETH]: "ICX_ETH",
    [PAIRS.DADI_USDT]: "DADI_USDT",
    [PAIRS.VET_ETH]: "VET_ETH",
    [PAIRS.TIO_ETH]: "TIO_ETH",
    [PAIRS.SENC_ETH]: "SENC_ETH",
    [PAIRS.ZPT_USDT]: "ZPT_USDT",
    [PAIRS.BTG_USDT]: "BTG_USDT",
    [PAIRS.MEDX_ETH]: "MEDX_ETH",
    [PAIRS.TNC_BTC]: "TNC_BTC",
    [PAIRS.BTS_BTC]: "BTS_BTC",
    [PAIRS.SWTH_USDT]: "SWTH_USDT",
    [PAIRS.HT_USDT]: "HT_USDT",
    [PAIRS.RUFF_ETH]: "RUFF_ETH",
    [PAIRS.MET_ETH]: "MET_ETH",
    [PAIRS.XMR_BTC]: "XMR_BTC",
    [PAIRS.BOE_USDT]: "BOE_USDT",
    [PAIRS.OCN_BTC]: "OCN_BTC",
    [PAIRS.MED_ETH]: "MED_ETH",
    [PAIRS.DATA_USDT]: "DATA_USDT",
    [PAIRS.CS_ETH]: "CS_ETH",
    [PAIRS.NANO_BTC]: "NANO_BTC",
    [PAIRS.IOTX_ETH]: "IOTX_ETH",
    [PAIRS.MKR_USDT]: "MKR_USDT",
    [PAIRS.SNET_ETH]: "SNET_ETH",
    [PAIRS.ELEC_USDT]: "ELEC_USDT",
    [PAIRS.SKM_ETH]: "SKM_ETH",
    [PAIRS.WAVES_USDT]: "WAVES_USDT",
    [PAIRS.GNX_ETH]: "GNX_ETH",
    [PAIRS.ZRX_BTC]: "ZRX_BTC",
    [PAIRS.RFR_ETH]: "RFR_ETH",
    [PAIRS.MEDX_USDT]: "MEDX_USDT",
    [PAIRS.LRC_BTC]: "LRC_BTC",
    [PAIRS.MANA_ETH]: "MANA_ETH",
    [PAIRS.HSC_ETH]: "HSC_ETH",
    [PAIRS.LEND_ETH]: "LEND_ETH",
    [PAIRS.SMT_ETH]: "SMT_ETH",
    [PAIRS.ARN_ETH]: "ARN_ETH",
    [PAIRS.BNTY_ETH]: "BNTY_ETH",
    [PAIRS.ZPT_ETH]: "ZPT_ETH",
    [PAIRS.GSE_ETH]: "GSE_ETH",
    [PAIRS.MET_USDT]: "MET_USDT",
    [PAIRS.LBA_ETH]: "LBA_ETH",
    [PAIRS.JNT_BTC]: "JNT_BTC",
    [PAIRS.OMG_BTC]: "OMG_BTC",
    [PAIRS.ABT_ETH]: "ABT_ETH",
    [PAIRS.NANO_USDT]: "NANO_USDT",
    [PAIRS.INK_ETH]: "INK_ETH",
    [PAIRS.BOT_QTUM]: "BOT_QTUM",
    [PAIRS.BFT_ETH]: "BFT_ETH",
    [PAIRS.ZRX_ETH]: "ZRX_ETH",
    [PAIRS.HC_BTC]: "HC_BTC",
    [PAIRS.BNT_ETH]: "BNT_ETH",
    [PAIRS.MTN_ETH]: "MTN_ETH",
    [PAIRS.DNT_ETH]: "DNT_ETH",
    [PAIRS.DCR_BTC]: "DCR_BTC",
    [PAIRS.ELF_ETH]: "ELF_ETH",
    [PAIRS.QASH_ETH]: "QASH_ETH",
    [PAIRS.XLM_ETH]: "XLM_ETH",
    [PAIRS.LUN_ETH]: "LUN_ETH",
    [PAIRS.OPEN_ETH]: "OPEN_ETH",
    [PAIRS.SOUL_ETH]: "SOUL_ETH",
    [PAIRS.BLZ_ETH]: "BLZ_ETH",
    [PAIRS.MKR_ETH]: "MKR_ETH",
    [PAIRS.XVG_BTC]: "XVG_BTC",
    [PAIRS.GOD_USDT]: "GOD_USDT",
    [PAIRS.INK_BTC]: "INK_BTC",
    [PAIRS.QSP_ETH]: "QSP_ETH",
    [PAIRS.BCDN_ETH]: "BCDN_ETH",
    [PAIRS.FUN_ETH]: "FUN_ETH",
    [PAIRS.SWTH_ETH]: "SWTH_ETH",
    [PAIRS.ELEC_ETH]: "ELEC_ETH",
    [PAIRS.ZPT_BTC]: "ZPT_BTC",
    [PAIRS.BIFI_BTC]: "BIFI_BTC",
    [PAIRS.HC_ETH]: "HC_ETH",
    [PAIRS.MOBI_BTC]: "MOBI_BTC",
    [PAIRS.IQ_ETH]: "IQ_ETH",
    [PAIRS.QASH_BTC]: "QASH_BTC",
    [PAIRS.RLC_ETH]: "RLC_ETH",
    [PAIRS.TNT_ETH]: "TNT_ETH",
    [PAIRS.OAX_ETH]: "OAX_ETH",
    [PAIRS.FUEL_ETH]: "FUEL_ETH",
    [PAIRS.SNT_ETH]: "SNT_ETH",
    [PAIRS.RCN_ETH]: "RCN_ETH",
    [PAIRS.LEDU_ETH]: "LEDU_ETH",
    [PAIRS.MEETONE_ETH]: "MEETONE_ETH",
    [PAIRS.LEDU_BTC]: "LEDU_BTC",
    [PAIRS.GAS_BTC]: "GAS_BTC",
    [PAIRS.STORJ_ETH]: "STORJ_ETH",
    [PAIRS.DGD_USDT]: "DGD_USDT",
    [PAIRS.TSL_QTUM]: "TSL_QTUM",
    [PAIRS.REQ_ETH]: "REQ_ETH",
    [PAIRS.IOTA_BTC]: "IOTA_BTC",
    [PAIRS.DOCK_ETH]: "DOCK_ETH",
    [PAIRS.INK_QTUM]: "INK_QTUM",
    [PAIRS.POWR_USDT]: "POWR_USDT",
    [PAIRS.QLC_BTC]: "QLC_BTC",
    [PAIRS.GNT_ETH]: "GNT_ETH",
    [PAIRS.COFI_ETH]: "COFI_ETH",
    [PAIRS.QLC_ETH]: "QLC_ETH",
    [PAIRS.DAI_USDT]: "DAI_USDT",
    [PAIRS.RATING_ETH]: "RATING_ETH",
    [PAIRS.THETA_ETH]: "THETA_ETH",
    [PAIRS.BOT_ETH]: "BOT_ETH",
    [PAIRS.LINK_ETH]: "LINK_ETH",
    [PAIRS.GEM_ETH]: "GEM_ETH",
    [PAIRS.PAY_ETH]: "PAY_ETH",
    [PAIRS.POWR_BTC]: "POWR_BTC",
    [PAIRS.DASH_BTC]: "DASH_BTC",
    [PAIRS.REP_ETH]: "REP_ETH",
    [PAIRS.XMC_BTC]: "XMC_BTC",
    [PAIRS.MITH_ETH]: "MITH_ETH",
    [PAIRS.WINGS_ETH]: "WINGS_ETH",
    [PAIRS.DGD_ETH]: "DGD_ETH",
    [PAIRS.DDD_BTC]: "DDD_BTC",
    [PAIRS.STORJ_BTC]: "STORJ_BTC",
    [PAIRS.RUFF_BTC]: "RUFF_BTC",
    [PAIRS.BOE_ETH]: "BOE_ETH",
    [PAIRS.DADI_ETH]: "DADI_ETH",
    [PAIRS.DPY_ETH]: "DPY_ETH",
    [PAIRS.MDS_ETH]: "MDS_ETH",
    [PAIRS.CVC_ETH]: "CVC_ETH",
    [PAIRS.BCX_BTC]: "BCX_BTC",
    [PAIRS.SNT_BTC]: "SNT_BTC",
    [PAIRS.WAVES_BTC]: "WAVES_BTC",
    [PAIRS.PAY_BTC]: "PAY_BTC",
    [PAIRS.PLY_ETH]: "PLY_ETH",
    [PAIRS.MED_QTUM]: "MED_QTUM",
    [PAIRS.POWR_ETH]: "POWR_ETH",
    [PAIRS.GOD_BTC]: "GOD_BTC",
  },
  fees: {
    taker: 0.1, //0.05% if we'll use Bibox token
  },
  mappers: {
    orderbook: data => ({
      bids: data.bids,
      asks: data.asks,
    }),
    order: ([price, volume]) => ({ price, volume }),
  },
};

module.exports = { gate };
