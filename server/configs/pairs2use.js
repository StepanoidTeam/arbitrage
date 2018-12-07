const { PAIRS } = require("./globalPairs");

const pairs2use = [
  //pairs to use for current arbitrage run
  // PAIRS.BTC_USDT,
  // PAIRS.XRP_USDT,
  // PAIRS.ETH_USDT,
  // PAIRS.ETC_USDT,
  // PAIRS.XRP_BTC,
  // PAIRS.ETH_BTC,
  // PAIRS.NEO_USDT,
  // PAIRS.LTC_USDT,
  // PAIRS.XMR_BTC,
  // PAIRS.ETC_BTC,
  // PAIRS.LTC_BTC,
  // PAIRS.NEO_BTC,
  // PAIRS.TRX_USDT,
  // PAIRS.ZEC_BTC,
  // PAIRS.DASH_BTC,
  // PAIRS.QTUM_BTC,
  // PAIRS.NEO_ETH,
  // PAIRS.XLM_BTC,
  // PAIRS.TRX_BTC,
  // PAIRS.QTUM_ETH,
  // PAIRS.TRX_ETH,
  // PAIRS.XVG_BTC,
  // PAIRS.XLM_ETH,
  // PAIRS.ZRX_ETH,
  // PAIRS.OMG_BTC,
  // PAIRS.BAT_BTC,
  // PAIRS.ZRX_BTC,
  // PAIRS.BAT_ETH,
  // PAIRS.REP_ETH,
  // PAIRS.OMG_ETH,
  // PAIRS.RLC_ETH,
  // PAIRS.SNT_ETH,
  // PAIRS.GNT_BTC,
  // PAIRS.RLC_BTC,
  // PAIRS.REP_BTC,
  // PAIRS.GNT_ETH,
  // PAIRS.SNT_BTC,
  // PAIRS.LRC_BTC,
  // PAIRS.BNT_BTC,
  // PAIRS.RCN_BTC,
  // PAIRS.BNT_ETH,

  //test pairs
  PAIRS.BTC_USDT,
  PAIRS.ETH_USDT,
  PAIRS.ONT_USDT,
  PAIRS.ADA_ETH,
  PAIRS.AGI_BTC,
  PAIRS.AION_ETH,
  PAIRS.ARDR_ETH,
  PAIRS.AST_ETH,
  PAIRS.BCC_ETH,
  PAIRS.BCPT_BTC,
  PAIRS.BCPT_ETH,
  PAIRS.BLZ_ETH,
  PAIRS.BTG_BTC,
  PAIRS.BTG_ETH,
  PAIRS.CLOAK_BTC,
  PAIRS.CMT_ETH,
  PAIRS.DENT_ETH,
  PAIRS.ELF_ETH,
  PAIRS.MOD_BTC,
  PAIRS.NCASH_ETH,
  PAIRS.NEO_ETH,
  PAIRS.NPXS_BTC,
  PAIRS.QTUM_USDT,
  PAIRS.AMB_BTC,
  PAIRS.BRD_BTC,
  PAIRS.ENG_ETH,
  PAIRS.ICN_BTC,
  PAIRS.KNC_BTC,
  PAIRS.MDA_BTC,
  PAIRS.NEO_BTC,
  PAIRS.RCN_ETH,
  PAIRS.SKY_ETH,
  PAIRS.ADA_USDT,
  PAIRS.IOTA_USDT,
  PAIRS.LTC_USDT,
  PAIRS.NEO_USDT,
  PAIRS.ADX_ETH,
  PAIRS.AE_BTC,
  PAIRS.AE_ETH,
  PAIRS.AGI_ETH,
  PAIRS.APPC_ETH,
  PAIRS.ARN_BTC,
  PAIRS.ARN_ETH,
  PAIRS.AST_BTC,
  PAIRS.BAT_ETH,
  PAIRS.BCD_BTC,
  PAIRS.BLZ_BTC,
  PAIRS.BQX_BTC,
  PAIRS.BQX_ETH,
  PAIRS.BRD_ETH,
  PAIRS.BTS_BTC,
  PAIRS.CDT_ETH,
  PAIRS.CHAT_ETH,
  PAIRS.CMT_BTC,
  PAIRS.CND_ETH,
  PAIRS.CVC_BTC,
  PAIRS.DASH_BTC,
  PAIRS.DASH_ETH,
  PAIRS.DATA_ETH,
  PAIRS.DGD_ETH,
  PAIRS.DNT_BTC,
  PAIRS.DNT_ETH,
  PAIRS.DOCK_ETH,
  PAIRS.EDO_ETH,
  PAIRS.EOS_BTC,
  PAIRS.ETC_BTC,
  PAIRS.EVX_ETH,
  PAIRS.FUEL_BTC,
  PAIRS.FUN_BTC,
  PAIRS.GNT_BTC,
  PAIRS.GNT_ETH,
  PAIRS.GO_BTC,
  PAIRS.GTO_BTC,
  PAIRS.GVT_BTC,
  PAIRS.GVT_ETH,
  PAIRS.HC_BTC,
  PAIRS.ICN_ETH,
  PAIRS.ICX_ETH,
  PAIRS.IOST_ETH,
  PAIRS.IOTA_BTC,
  PAIRS.IOTX_BTC,
  PAIRS.KMD_ETH,
  PAIRS.LOOM_ETH,
  PAIRS.LRC_BTC,
  PAIRS.LSK_ETH,
  PAIRS.LTC_BTC,
  PAIRS.LUN_ETH,
  PAIRS.MCO_ETH,
  PAIRS.MFT_BTC,
  PAIRS.NAV_ETH,
  PAIRS.PIVX_ETH,
  PAIRS.POE_ETH,
  PAIRS.POWR_BTC,
  PAIRS.POWR_ETH,
  PAIRS.PPT_BTC,
  PAIRS.REQ_ETH,
  PAIRS.BCC_USDT,
  PAIRS.EOS_USDT,
  PAIRS.ETC_USDT,
  PAIRS.ICX_USDT,
  PAIRS.NULS_USDT,
  PAIRS.PAX_USDT,
  PAIRS.TRX_USDT,
  PAIRS.VET_USDT,
  PAIRS.XLM_USDT,
  PAIRS.XRP_USDT,
  PAIRS.ADA_BTC,
  PAIRS.ADX_BTC,
  PAIRS.AION_BTC,
  PAIRS.AMB_ETH,
  PAIRS.APPC_BTC,
  PAIRS.ARDR_BTC,
  PAIRS.ARK_BTC,
  PAIRS.ARK_ETH,
  PAIRS.BAT_BTC,
  PAIRS.BCC_BTC,
  PAIRS.BCD_ETH,
  PAIRS.BNT_BTC,
  PAIRS.BNT_ETH,
  PAIRS.BTS_ETH,
  PAIRS.CDT_BTC,
  PAIRS.CHAT_BTC,
  PAIRS.CLOAK_ETH,
  PAIRS.CND_BTC,
  PAIRS.CVC_ETH,
  PAIRS.DATA_BTC,
  //PAIRS.DENT_BTC, //this pair ruins OKex
  PAIRS.DGD_BTC,
  PAIRS.DLT_BTC,
  PAIRS.DLT_ETH,
  PAIRS.DOCK_BTC,
  PAIRS.EDO_BTC,
  PAIRS.ELF_BTC,
  PAIRS.ENG_BTC,
  PAIRS.ENJ_BTC,
  PAIRS.ENJ_ETH,
  PAIRS.EOS_ETH,
  PAIRS.ETC_ETH,
  PAIRS.ETH_BTC,
  PAIRS.EVX_BTC,
  PAIRS.FUEL_ETH,
  PAIRS.FUN_ETH,
  PAIRS.GAS_BTC,
  PAIRS.GRS_BTC,
  PAIRS.GRS_ETH,
  PAIRS.GTO_ETH,
  PAIRS.GXS_BTC,
  PAIRS.GXS_ETH,
  PAIRS.HC_ETH,
  //PAIRS.HOT_BTC,
  //PAIRS.HOT_ETH,
  PAIRS.HOLO_BTC, // for Binance
  PAIRS.HOLO_ETH, // for Binance
  PAIRS.HydroProtocol_USDT, // for Huobi, OKex and Bitfinex
  PAIRS.HydroProtocol_BTC, // for Huobi, OKex and Bitfinex
  PAIRS.HydroProtocol_ETH, // for Huobi, OKex and Bitfinex
  PAIRS.ICX_BTC,
  PAIRS.INS_BTC,
  PAIRS.INS_ETH,
  PAIRS.IOST_BTC,
  PAIRS.IOTA_ETH,
  PAIRS.IOTX_ETH,
  PAIRS.KEY_BTC,
  PAIRS.KEY_ETH,
  PAIRS.KMD_BTC,
  PAIRS.KNC_ETH,
  PAIRS.LEND_BTC,
  PAIRS.LEND_ETH,
  PAIRS.LINK_BTC,
  PAIRS.LINK_ETH,
  PAIRS.LOOM_BTC,
  PAIRS.LRC_ETH,
  PAIRS.LSK_BTC,
  PAIRS.LTC_ETH,
  PAIRS.LUN_BTC,
  PAIRS.MANA_BTC,
  PAIRS.MANA_ETH,
  PAIRS.MCO_BTC,
  PAIRS.MDA_ETH,
  PAIRS.MFT_ETH,
  PAIRS.MOD_ETH,
  PAIRS.MTH_BTC,
  PAIRS.MTH_ETH,
  PAIRS.MTL_BTC,
  PAIRS.MTL_ETH,
  PAIRS.NANO_BTC,
  PAIRS.NANO_ETH,
  PAIRS.NAS_BTC,
  PAIRS.NAS_ETH,
  PAIRS.NAV_BTC,
  PAIRS.NCASH_BTC,
  PAIRS.NEBL_BTC,
  PAIRS.NEBL_ETH,
  PAIRS.NPXS_ETH,
  PAIRS.NULS_BTC,
  PAIRS.NULS_ETH,
  PAIRS.NXS_BTC,
  PAIRS.NXS_ETH,
  PAIRS.OAX_BTC,
  PAIRS.OAX_ETH,
  PAIRS.OMG_BTC,
  PAIRS.OMG_ETH,
  PAIRS.ONT_BTC,
  PAIRS.ONT_ETH,
  PAIRS.OST_BTC,
  PAIRS.OST_ETH,
  PAIRS.PAX_BTC,
  PAIRS.PAX_ETH,
  PAIRS.PHX_BTC,
  PAIRS.PHX_ETH,
  PAIRS.PIVX_BTC,
  PAIRS.POA_BTC,
  PAIRS.POA_ETH,
  PAIRS.POE_BTC,
  PAIRS.POLY_BTC,
  PAIRS.PPT_ETH,
  PAIRS.QKC_BTC,
  PAIRS.QKC_ETH,
  PAIRS.QLC_BTC,
  PAIRS.QLC_ETH,
  PAIRS.QSP_BTC,
  PAIRS.QSP_ETH,
  PAIRS.QTUM_BTC,
  PAIRS.QTUM_ETH,
  PAIRS.RCN_BTC,
  PAIRS.RDN_BTC,
  PAIRS.RDN_ETH,
  PAIRS.REP_BTC,
  PAIRS.REP_ETH,
  PAIRS.REQ_BTC,
  PAIRS.RLC_BTC,
  PAIRS.RLC_ETH,
  PAIRS.RVN_BTC,
  PAIRS.SALT_BTC,
  PAIRS.SALT_ETH,
  PAIRS.SC_BTC,
  PAIRS.SC_ETH,
  PAIRS.SKY_BTC,
  PAIRS.SNGLS_BTC,
  PAIRS.SNGLS_ETH,
  PAIRS.SNM_BTC,
  PAIRS.SNM_ETH,
  PAIRS.SNT_BTC,
  PAIRS.SNT_ETH,
  PAIRS.STEEM_BTC,
  PAIRS.STEEM_ETH,
  PAIRS.STORJ_BTC,
  PAIRS.STORJ_ETH,
  PAIRS.STORM_BTC,
  PAIRS.STORM_ETH,
  PAIRS.STRAT_BTC,
  PAIRS.STRAT_ETH,
  PAIRS.SUB_BTC,
  PAIRS.SUB_ETH,
  PAIRS.SYS_BTC,
  PAIRS.SYS_ETH,
  PAIRS.THETA_BTC,
  PAIRS.THETA_ETH,
  PAIRS.TNB_BTC,
  PAIRS.TNB_ETH,
  PAIRS.TNT_BTC,
  PAIRS.TNT_ETH,
  PAIRS.TRIG_BTC,
  PAIRS.TRIG_ETH,
  PAIRS.TRX_BTC,
  PAIRS.TRX_ETH,
  PAIRS.TUSDT_BTC,
  PAIRS.TUSDT_ETH,
  PAIRS.VET_BTC,
  PAIRS.VET_ETH,
  PAIRS.VIA_BTC,
  PAIRS.VIA_ETH,
  PAIRS.VIB_BTC,
  PAIRS.VIB_ETH,
  PAIRS.VIBE_BTC,
  PAIRS.VIBE_ETH,
  PAIRS.WABI_BTC,
  PAIRS.WABI_ETH,
  PAIRS.WAN_BTC,
  PAIRS.WAN_ETH,
  PAIRS.WAVES_BTC,
  PAIRS.WAVES_ETH,
  PAIRS.WINGS_BTC,
  PAIRS.WINGS_ETH,
  PAIRS.WPR_BTC,
  PAIRS.WPR_ETH,
  PAIRS.WTC_BTC,
  PAIRS.WTC_ETH,
  PAIRS.XEM_BTC,
  PAIRS.XEM_ETH,
  PAIRS.XLM_BTC,
  PAIRS.XLM_ETH,
  PAIRS.XMR_BTC,
  PAIRS.XMR_ETH,
  PAIRS.XRP_BTC,
  PAIRS.XRP_ETH,
  PAIRS.XVG_BTC,
  PAIRS.XVG_ETH,
  PAIRS.XZC_BTC,
  PAIRS.XZC_ETH,
  PAIRS.YOYO_BTC,
  PAIRS.YOYO_ETH,
  PAIRS.ZEC_BTC,
  PAIRS.ZEC_ETH,
  PAIRS.ZEN_BTC,
  PAIRS.ZEN_ETH,
  PAIRS.ZIL_BTC,
  PAIRS.ZIL_ETH,
  PAIRS.ZRX_BTC,
  PAIRS.ZRX_ETH,
  PAIRS.USDT_USDT,
  PAIRS.DASH_USDT,
  PAIRS.BCH_USDT,
  PAIRS.SC_USDT,
  PAIRS.OMG_USDT,
  PAIRS.ZEC_USDT,
  PAIRS.XVG_USDT,
  PAIRS.XMR_USDT,
  PAIRS.DOGE_USDT,
  PAIRS.ZRX_USDT,
  PAIRS.DGB_USDT,
  PAIRS.DCR_USDT,
  PAIRS.NXT_USDT,
  PAIRS.HYDRO_BTC,
  PAIRS.OCN_BTC,
  PAIRS.BOXX_BTC,
  PAIRS.BCH_BTC,
  PAIRS.DMT_ETH,
  PAIRS.DGB_BTC,
  PAIRS.XHV_BTC,
  PAIRS.DTA_BTC,
  PAIRS.DMT_BTC,
  PAIRS.DOGE_BTC,
  PAIRS.RDD_BTC,
  PAIRS.SRN_BTC,
  PAIRS.DCR_BTC,
  PAIRS.NMR_BTC,
  PAIRS.BRX_BTC,
  PAIRS.WAX_BTC,
  PAIRS.TUBE_BTC,
  PAIRS.IHT_BTC,
  PAIRS.ADT_BTC,
  PAIRS.ZCL_BTC,
  PAIRS.CRW_BTC,
  PAIRS.VTC_BTC,
  PAIRS.MORE_ETH,
  PAIRS.LBC_BTC,
  PAIRS.PART_BTC,
  PAIRS.FLO_BTC,
  PAIRS.QRL_BTC,
  PAIRS.PRO_BTC,
  PAIRS.FCT_BTC,
  PAIRS.XDN_BTC,
  PAIRS.RFR_BTC,
  PAIRS.PAY_BTC,
  PAIRS.BLT_BTC,
  PAIRS.NXT_BTC,
  PAIRS.MER_BTC,
  PAIRS.FLDC_BTC,
  PAIRS.BLOCK_BTC,
  PAIRS.BCY_BTC,
  PAIRS.GBYTE_BTC,
  PAIRS.ENRG_BTC,
  PAIRS.ANT_BTC,
  PAIRS.NLC2_BTC,
  PAIRS.IGNIS_BTC,
  PAIRS.TIX_BTC,
  PAIRS.VEE_BTC,
  PAIRS.GEO_BTC,
  PAIRS.GAME_BTC,
  PAIRS.PPC_BTC,
  PAIRS.NGC_BTC,
  PAIRS.UP_BTC,
  PAIRS.BYC_BTC,
  PAIRS.XEL_BTC,
  PAIRS.SPR_BTC,
  PAIRS.BCH_ETH,
  PAIRS.UBQ_BTC,
  PAIRS.NLG_BTC,
  PAIRS.CBC_BTC,
  PAIRS.SYNX_BTC,
  PAIRS.BITB_BTC,
  PAIRS.MUSIC_BTC,
  PAIRS.XCP_BTC,
  PAIRS.OCN_ETH,
  PAIRS.GUP_BTC,
  PAIRS.SLS_BTC,
  PAIRS.BAY_BTC,
  PAIRS.MONA_BTC,
  PAIRS.BURST_BTC,
  PAIRS.EDR_BTC,
  PAIRS.XMY_BTC,
  PAIRS.BSD_BTC,
  PAIRS.AUR_BTC,
  PAIRS.ION_BTC,
  PAIRS.BLK_BTC,
  PAIRS.EMC2_BTC,
  PAIRS.DTB_BTC,
  PAIRS.DCT_BTC,
  PAIRS.MUE_BTC,
  PAIRS.CANN_BTC,
  PAIRS.GLD_BTC,
  PAIRS.AMP_BTC,
  PAIRS.GRC_BTC,
  PAIRS.SBD_BTC,
  PAIRS.POLY_ETH,
  PAIRS.NBT_BTC,
  PAIRS.SRN_ETH,
  PAIRS.AID_BTC,
  PAIRS.BFT_BTC,
  PAIRS.THC_BTC,
  PAIRS.EDG_BTC,
  PAIRS.DGB_ETH,
  PAIRS.BRK_BTC,
  PAIRS.CRB_BTC,
  PAIRS.POT_BTC,
  PAIRS.TX_BTC,
  PAIRS.FTC_BTC,
  PAIRS.UPP_BTC,
  PAIRS.DOPE_BTC,
  PAIRS.SIB_BTC,
  PAIRS.ANT_ETH,
  PAIRS.TKS_BTC,
  PAIRS.MEME_BTC,
  PAIRS.IOP_BTC,
  PAIRS.EXP_BTC,
  PAIRS.PTOY_BTC,
  PAIRS.GNO_BTC,
  PAIRS.KORE_BTC,
  PAIRS.COVAL_BTC,
  PAIRS.BKX_BTC,
  PAIRS.INCNT_BTC,
  PAIRS.WAX_ETH,
  PAIRS.RADS_BTC,
  PAIRS.AEON_BTC,
  PAIRS.DYN_BTC,
  PAIRS.SWT_BTC,
  PAIRS.MORE_BTC,
  PAIRS.UKG_BTC,
  PAIRS.EXCL_BTC,
  PAIRS.EBST_BTC,
  PAIRS.HMQ_BTC,
  PAIRS.VRC_BTC,
  PAIRS.IOC_BTC,
  PAIRS.EFL_BTC,
  PAIRS.MET_BTC,
  PAIRS.SHIFT_BTC,
  PAIRS.PINK_BTC,
  PAIRS.OMNI_BTC,
  PAIRS.ABY_BTC,
  PAIRS.VRM_BTC,
  PAIRS.RVR_BTC,
  PAIRS.QWARK_BTC,
  PAIRS.NEOS_BTC,
  PAIRS.OK_BTC,
  PAIRS.SEQ_BTC,
  PAIRS.XMG_BTC,
  PAIRS.GOLOS_BTC,
  PAIRS.EMC_BTC,
  PAIRS.NXC_BTC,
  PAIRS.PAY_ETH,
  PAIRS.MLN_BTC,
  PAIRS.GBG_BTC,
  PAIRS.SPHR_BTC,
  PAIRS.SLR_BTC,
  PAIRS.EGC_BTC,
  PAIRS.CURE_BTC,
  PAIRS.TRUST_BTC,
  PAIRS.XST_BTC,
  PAIRS.GAM_BTC,
  PAIRS.XWC_BTC,
  PAIRS.DMD_BTC,
  PAIRS.BITS_BTC,
  PAIRS.GNO_ETH,
  PAIRS.UKG_ETH,
  // PAIRS.BTC_EUR,
  // PAIRS.ETH_EUR,
  PAIRS.ETP_USDT,
];

module.exports = { pairs2use };
