const { connector } = require("connector");

class binance extends connector {
  constructor() {
    super();
    this._publicUrl = `${"https://api.binance.com"}${"/api/v1/"}`;
    this._privateUrl = `${"https://api.binance.com"}${"/wapi/v3/"}`;
    this._limits = [5, 10, 20, 50, 100, 500, 1000];
  }

  async getTradePairs() {
    var content = await fetch(`${this._publicUrl}${"exchangeInfo"}`);

    return "";
  }
}

module.exports = {
  binance
};
