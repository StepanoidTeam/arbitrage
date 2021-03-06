const { PAIRS } = require("../globalPairs");

// bug: bid greater than ask!!!

const bittrex = {
  name: "bittrex",
  url: "https://bittrex.com",
  getOrderBook(pairIndex) {
    return `${this.url}/api/v1.1/public/getorderbook?type=both&market=${
      this.pairs[pairIndex]
    }`;
  },
  pairs: {
    [PAIRS.BTC_USDT]: "USDT-BTC",
    [PAIRS.USDT_USD]: "USD-USDT",
    [PAIRS.ETH_USDT]: "USDT-ETH",
    [PAIRS.TRX_USDT]: "USDT-TRX",
    [PAIRS.DASH_USDT]: "USDT-DASH",
    [PAIRS.BCH_USDT]: "USDT-BCH",
    [PAIRS.XRP_USDT]: "USDT-XRP",
    [PAIRS.SC_USDT]: "USDT-SC",
    [PAIRS.LTC_USDT]: "USDT-LTC",
    [PAIRS.ADA_USDT]: "USDT-ADA",
    [PAIRS.NEO_USDT]: "USDT-NEO",
    [PAIRS.OMG_USDT]: "USDT-OMG",
    [PAIRS.TUSD_USDT]: "USDT-TUSD",
    [PAIRS.ZEC_USDT]: "USDT-ZEC",
    [PAIRS.XVG_USDT]: "USDT-XVG",
    [PAIRS.XMR_USDT]: "USDT-XMR",
    [PAIRS.ETC_USDT]: "USDT-ETC",
    [PAIRS.DOGE_USDT]: "USDT-DOGE",
    [PAIRS.ZRX_USDT]: "USDT-ZRX",
    [PAIRS.DGB_USDT]: "USDT-DGB",
    [PAIRS.DCR_USDT]: "USDT-DCR",
    [PAIRS.NXT_USDT]: "USDT-NXT",
    [PAIRS.RVN_BTC]: "BTC-RVN",
    [PAIRS.XRP_BTC]: "BTC-XRP",
    [PAIRS.HYDRO_BTC]: "BTC-HYDRO",
    [PAIRS.SALT_BTC]: "BTC-SALT",
    [PAIRS.BAT_BTC]: "BTC-BAT",
    [PAIRS.ETH_BTC]: "BTC-ETH",
    [PAIRS.SC_BTC]: "BTC-SC",
    [PAIRS.OCN_BTC]: "BTC-OCN",
    [PAIRS.QTUM_BTC]: "BTC-QTUM",
    [PAIRS.LOOM_BTC]: "BTC-LOOM",
    [PAIRS.ADA_BTC]: "BTC-ADA",
    [PAIRS.BTC_USD]: "USD-BTC",
    [PAIRS.MFT_BTC]: "BTC-MFT",
    [PAIRS.XVG_BTC]: "BTC-XVG",
    [PAIRS.BOXX_BTC]: "BTC-BOXX",
    [PAIRS.BCH_BTC]: "BTC-BCH",
    [PAIRS.GNT_BTC]: "BTC-GNT",
    [PAIRS.DMT_ETH]: "ETH-DMT",
    [PAIRS.LTC_BTC]: "BTC-LTC",
    [PAIRS.TRX_BTC]: "BTC-TRX",
    [PAIRS.DGB_BTC]: "BTC-DGB",
    [PAIRS.XLM_BTC]: "BTC-XLM",
    [PAIRS.XHV_BTC]: "BTC-XHV",
    [PAIRS.DTA_BTC]: "BTC-DTA",
    [PAIRS.XMR_BTC]: "BTC-XMR",
    [PAIRS.POLY_BTC]: "BTC-POLY",
    [PAIRS.ADX_BTC]: "BTC-ADX",
    [PAIRS.XEM_BTC]: "BTC-XEM",
    [PAIRS.STORM_BTC]: "BTC-STORM",
    [PAIRS.DMT_BTC]: "BTC-DMT",
    [PAIRS.XZC_BTC]: "BTC-XZC",
    [PAIRS.DOGE_BTC]: "BTC-DOGE",
    [PAIRS.XRP_USD]: "USD-XRP",
    [PAIRS.ZEC_ETH]: "ETH-ZEC",
    [PAIRS.SYS_BTC]: "BTC-SYS",
    [PAIRS.RDD_BTC]: "BTC-RDD",
    [PAIRS.SRN_BTC]: "BTC-SRN",
    [PAIRS.NEO_BTC]: "BTC-NEO",
    [PAIRS.RCN_BTC]: "BTC-RCN",
    [PAIRS.DCR_BTC]: "BTC-DCR",
    [PAIRS.ZEC_BTC]: "BTC-ZEC",
    [PAIRS.DASH_BTC]: "BTC-DASH",
    [PAIRS.LSK_BTC]: "BTC-LSK",
    [PAIRS.VIB_BTC]: "BTC-VIB",
    [PAIRS.NMR_BTC]: "BTC-NMR",
    [PAIRS.BRX_BTC]: "BTC-BRX",
    [PAIRS.ZRX_BTC]: "BTC-ZRX",
    [PAIRS.GO_BTC]: "BTC-GO",
    [PAIRS.WAX_BTC]: "BTC-WAX",
    [PAIRS.TUBE_BTC]: "BTC-TUBE",
    [PAIRS.ETC_BTC]: "BTC-ETC",
    [PAIRS.ARK_BTC]: "BTC-ARK",
    [PAIRS.KMD_BTC]: "BTC-KMD",
    [PAIRS.ETH_USD]: "USD-ETH",
    [PAIRS.REP_BTC]: "BTC-REP",
    [PAIRS.IHT_BTC]: "BTC-IHT",
    [PAIRS.ADT_BTC]: "BTC-ADT",
    [PAIRS.WAVES_BTC]: "BTC-WAVES",
    [PAIRS.ZCL_BTC]: "BTC-ZCL",
    [PAIRS.BAT_ETH]: "ETH-BAT",
    [PAIRS.TUSD_BTC]: "BTC-TUSD",
    [PAIRS.CRW_BTC]: "BTC-CRW",
    [PAIRS.OMG_BTC]: "BTC-OMG",
    [PAIRS.QTUM_ETH]: "ETH-QTUM",
    [PAIRS.POWR_BTC]: "BTC-POWR",
    [PAIRS.LUN_BTC]: "BTC-LUN",
    [PAIRS.VTC_BTC]: "BTC-VTC",
    [PAIRS.ARDR_BTC]: "BTC-ARDR",
    [PAIRS.STEEM_BTC]: "BTC-STEEM",
    [PAIRS.XRP_ETH]: "ETH-XRP",
    [PAIRS.MORE_ETH]: "ETH-MORE",
    [PAIRS.CVC_BTC]: "BTC-CVC",
    [PAIRS.ADA_ETH]: "ETH-ADA",
    [PAIRS.LBC_BTC]: "BTC-LBC",
    [PAIRS.MANA_BTC]: "BTC-MANA",
    [PAIRS.PART_BTC]: "BTC-PART",
    [PAIRS.ZEN_BTC]: "BTC-ZEN",
    [PAIRS.FLO_BTC]: "BTC-FLO",
    [PAIRS.STORJ_BTC]: "BTC-STORJ",
    [PAIRS.QRL_BTC]: "BTC-QRL",
    [PAIRS.PRO_BTC]: "BTC-PRO",
    [PAIRS.FCT_BTC]: "BTC-FCT",
    [PAIRS.CVC_ETH]: "ETH-CVC",
    [PAIRS.STRAT_BTC]: "BTC-STRAT",
    [PAIRS.XDN_BTC]: "BTC-XDN",
    [PAIRS.RLC_BTC]: "BTC-RLC",
    [PAIRS.RFR_BTC]: "BTC-RFR",
    [PAIRS.SC_ETH]: "ETH-SC",
    [PAIRS.PAY_BTC]: "BTC-PAY",
    [PAIRS.PIVX_BTC]: "BTC-PIVX",
    [PAIRS.BCH_USD]: "USD-BCH",
    [PAIRS.BLT_BTC]: "BTC-BLT",
    [PAIRS.NXT_BTC]: "BTC-NXT",
    [PAIRS.MER_BTC]: "BTC-MER",
    [PAIRS.FLDC_BTC]: "BTC-FLDC",
    [PAIRS.SALT_ETH]: "ETH-SALT",
    [PAIRS.XLM_ETH]: "ETH-XLM",
    [PAIRS.BLOCK_BTC]: "BTC-BLOCK",
    [PAIRS.GNT_ETH]: "ETH-GNT",
    [PAIRS.CLOAK_BTC]: "BTC-CLOAK",
    [PAIRS.BCY_BTC]: "BTC-BCY",
    [PAIRS.GBYTE_BTC]: "BTC-GBYTE",
    [PAIRS.ENRG_BTC]: "BTC-ENRG",
    [PAIRS.REP_ETH]: "ETH-REP",
    [PAIRS.NXS_BTC]: "BTC-NXS",
    [PAIRS.ANT_BTC]: "BTC-ANT",
    [PAIRS.ENJ_BTC]: "BTC-ENJ",
    [PAIRS.NLC2_BTC]: "BTC-NLC2",
    [PAIRS.IGNIS_BTC]: "BTC-IGNIS",
    [PAIRS.TIX_BTC]: "BTC-TIX",
    [PAIRS.NAV_BTC]: "BTC-NAV",
    [PAIRS.ZRX_ETH]: "ETH-ZRX",
    [PAIRS.VEE_BTC]: "BTC-VEE",
    [PAIRS.WINGS_BTC]: "BTC-WINGS",
    [PAIRS.GEO_BTC]: "BTC-GEO",
    [PAIRS.GAME_BTC]: "BTC-GAME",
    [PAIRS.PPC_BTC]: "BTC-PPC",
    [PAIRS.DNT_BTC]: "BTC-DNT",
    [PAIRS.NGC_BTC]: "BTC-NGC",
    [PAIRS.ENG_BTC]: "BTC-ENG",
    [PAIRS.SNT_BTC]: "BTC-SNT",
    [PAIRS.UP_BTC]: "BTC-UP",
    [PAIRS.BYC_BTC]: "BTC-BYC",
    [PAIRS.BNT_BTC]: "BTC-BNT",
    [PAIRS.XEL_BTC]: "BTC-XEL",
    [PAIRS.SPR_BTC]: "BTC-SPR",
    [PAIRS.BCH_ETH]: "ETH-BCH",
    [PAIRS.UBQ_BTC]: "BTC-UBQ",
    [PAIRS.MTL_BTC]: "BTC-MTL",
    [PAIRS.NLG_BTC]: "BTC-NLG",
    [PAIRS.CBC_BTC]: "BTC-CBC",
    [PAIRS.NEO_ETH]: "ETH-NEO",
    [PAIRS.SYNX_BTC]: "BTC-SYNX",
    [PAIRS.BITB_BTC]: "BTC-BITB",
    [PAIRS.MUSIC_BTC]: "BTC-MUSIC",
    [PAIRS.LRC_BTC]: "BTC-LRC",
    [PAIRS.XCP_BTC]: "BTC-XCP",
    [PAIRS.MCO_BTC]: "BTC-MCO",
    [PAIRS.OCN_ETH]: "ETH-OCN",
    [PAIRS.BCPT_BTC]: "BTC-BCPT",
    [PAIRS.GUP_BTC]: "BTC-GUP",
    [PAIRS.SLS_BTC]: "BTC-SLS",
    [PAIRS.BAY_BTC]: "BTC-BAY",
    [PAIRS.MONA_BTC]: "BTC-MONA",
    [PAIRS.GTO_BTC]: "BTC-GTO",
    [PAIRS.BURST_BTC]: "BTC-BURST",
    [PAIRS.EDR_BTC]: "BTC-EDR",
    [PAIRS.XMY_BTC]: "BTC-XMY",
    [PAIRS.BSD_BTC]: "BTC-BSD",
    [PAIRS.LTC_USD]: "USD-LTC",
    [PAIRS.AUR_BTC]: "BTC-AUR",
    [PAIRS.ETC_ETH]: "ETH-ETC",
    [PAIRS.ION_BTC]: "BTC-ION",
    [PAIRS.STORM_ETH]: "ETH-STORM",
    [PAIRS.ADX_ETH]: "ETH-ADX",
    [PAIRS.BLK_BTC]: "BTC-BLK",
    [PAIRS.EMC2_BTC]: "BTC-EMC2",
    [PAIRS.DTB_BTC]: "BTC-DTB",
    [PAIRS.XEM_ETH]: "ETH-XEM",
    [PAIRS.DCT_BTC]: "BTC-DCT",
    [PAIRS.VIA_BTC]: "BTC-VIA",
    [PAIRS.MUE_BTC]: "BTC-MUE",
    [PAIRS.CANN_BTC]: "BTC-CANN",
    [PAIRS.GRS_BTC]: "BTC-GRS",
    [PAIRS.GLD_BTC]: "BTC-GLD",
    [PAIRS.ADA_USD]: "USD-ADA",
    [PAIRS.DASH_ETH]: "ETH-DASH",
    [PAIRS.AMP_BTC]: "BTC-AMP",
    [PAIRS.POWR_ETH]: "ETH-POWR",
    [PAIRS.GRC_BTC]: "BTC-GRC",
    [PAIRS.SBD_BTC]: "BTC-SBD",
    [PAIRS.POLY_ETH]: "ETH-POLY",
    [PAIRS.VIB_ETH]: "ETH-VIB",
    [PAIRS.NBT_BTC]: "BTC-NBT",
    [PAIRS.LTC_ETH]: "ETH-LTC",
    [PAIRS.SRN_ETH]: "ETH-SRN",
    [PAIRS.AID_BTC]: "BTC-AID",
    [PAIRS.BFT_BTC]: "BTC-BFT",
    [PAIRS.THC_BTC]: "BTC-THC",
    [PAIRS.EDG_BTC]: "BTC-EDG",
    [PAIRS.MANA_ETH]: "ETH-MANA",
    [PAIRS.DGB_ETH]: "ETH-DGB",
    [PAIRS.BRK_BTC]: "BTC-BRK",
    [PAIRS.CRB_BTC]: "BTC-CRB",
    [PAIRS.POT_BTC]: "BTC-POT",
    [PAIRS.TX_BTC]: "BTC-TX",
    [PAIRS.FTC_BTC]: "BTC-FTC",
    [PAIRS.UPP_BTC]: "BTC-UPP",
    [PAIRS.XMR_ETH]: "ETH-XMR",
    [PAIRS.DOPE_BTC]: "BTC-DOPE",
    [PAIRS.SIB_BTC]: "BTC-SIB",
    [PAIRS.TRX_ETH]: "ETH-TRX",
    [PAIRS.ANT_ETH]: "ETH-ANT",
    [PAIRS.TKS_BTC]: "BTC-TKS",
    [PAIRS.MEME_BTC]: "BTC-MEME",
    [PAIRS.IOP_BTC]: "BTC-IOP",
    [PAIRS.EXP_BTC]: "BTC-EXP",
    [PAIRS.WAVES_ETH]: "ETH-WAVES",
    [PAIRS.BNT_ETH]: "ETH-BNT",
    [PAIRS.PTOY_BTC]: "BTC-PTOY",
    [PAIRS.GNO_BTC]: "BTC-GNO",
    [PAIRS.KORE_BTC]: "BTC-KORE",
    [PAIRS.COVAL_BTC]: "BTC-COVAL",
    [PAIRS.BKX_BTC]: "BTC-BKX",
    [PAIRS.INCNT_BTC]: "BTC-INCNT",
    [PAIRS.WAX_ETH]: "ETH-WAX",
    [PAIRS.RADS_BTC]: "BTC-RADS",
    [PAIRS.TUSD_USD]: "USD-TUSD",
    [PAIRS.AEON_BTC]: "BTC-AEON",
    [PAIRS.DYN_BTC]: "BTC-DYN",
    [PAIRS.SWT_BTC]: "BTC-SWT",
    [PAIRS.ZEC_USD]: "USD-ZEC",
    [PAIRS.MORE_BTC]: "BTC-MORE",
    [PAIRS.UKG_BTC]: "BTC-UKG",
    [PAIRS.EXCL_BTC]: "BTC-EXCL",
    [PAIRS.EBST_BTC]: "BTC-EBST",
    [PAIRS.HMQ_BTC]: "BTC-HMQ",
    [PAIRS.VRC_BTC]: "BTC-VRC",
    [PAIRS.IOC_BTC]: "BTC-IOC",
    [PAIRS.EFL_BTC]: "BTC-EFL",
    [PAIRS.MET_BTC]: "BTC-MET",
    [PAIRS.SHIFT_BTC]: "BTC-SHIFT",
    [PAIRS.PINK_BTC]: "BTC-PINK",
    [PAIRS.OMNI_BTC]: "BTC-OMNI",
    [PAIRS.MCO_ETH]: "ETH-MCO",
    [PAIRS.ABY_BTC]: "BTC-ABY",
    [PAIRS.TRX_USD]: "USD-TRX",
    [PAIRS.VRM_BTC]: "BTC-VRM",
    [PAIRS.RVR_BTC]: "BTC-RVR",
    [PAIRS.STRAT_ETH]: "ETH-STRAT",
    [PAIRS.QWARK_BTC]: "BTC-QWARK",
    [PAIRS.NEOS_BTC]: "BTC-NEOS",
    [PAIRS.OK_BTC]: "BTC-OK",
    [PAIRS.OMG_ETH]: "ETH-OMG",
    [PAIRS.RLC_ETH]: "ETH-RLC",
    [PAIRS.ENG_ETH]: "ETH-ENG",
    [PAIRS.SEQ_BTC]: "BTC-SEQ",
    [PAIRS.ETC_USD]: "USD-ETC",
    [PAIRS.XMG_BTC]: "BTC-XMG",
    [PAIRS.GOLOS_BTC]: "BTC-GOLOS",
    [PAIRS.EMC_BTC]: "BTC-EMC",
    [PAIRS.NXC_BTC]: "BTC-NXC",
    [PAIRS.PAY_ETH]: "ETH-PAY",
    [PAIRS.MLN_BTC]: "BTC-MLN",
    [PAIRS.GBG_BTC]: "BTC-GBG",
    [PAIRS.SPHR_BTC]: "BTC-SPHR",
    [PAIRS.SLR_BTC]: "BTC-SLR",
    [PAIRS.EGC_BTC]: "BTC-EGC",
    [PAIRS.TUSD_ETH]: "ETH-TUSD",
    [PAIRS.CURE_BTC]: "BTC-CURE",
    [PAIRS.TRUST_BTC]: "BTC-TRUST",
    [PAIRS.XST_BTC]: "BTC-XST",
    [PAIRS.GAM_BTC]: "BTC-GAM",
    [PAIRS.XWC_BTC]: "BTC-XWC",
    [PAIRS.DMD_BTC]: "BTC-DMD",
    [PAIRS.BITS_BTC]: "BTC-BITS",
    [PAIRS.GNO_ETH]: "ETH-GNO",
    [PAIRS.SNT_ETH]: "ETH-SNT",
    [PAIRS.UKG_ETH]: "ETH-UKG",
    [PAIRS.ATOM_BTC]: "BTC-ATOM",
    [PAIRS.ATOM_ETH]: "ETH-ATOM",
    [PAIRS.ATOM_USDT]: "USDT-ATOM",
  },
  fees: {
    taker: 0.25,
  },
  minOrder: {
    //todo: add min order volumes
    // BTC: 0.001,
    // ETH: 0.01,
    // USDT: 10,
  },
  mappers: {
    orderbook: data => ({
      bids: data.result.buy,
      asks: data.result.sell,
    }),
    order: data => ({ price: data.Rate, volume: data.Quantity }),
  },
};

module.exports = { bittrex };
