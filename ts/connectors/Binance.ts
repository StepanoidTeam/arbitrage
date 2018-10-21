import IProxyRequest from "../models/IProxyRequest";

const Connector = require("Connector");
const HttpMethod = require("HttpMethod");

class Binance extends Connector {
  private readonly _proxyUrl: string;

  constructor(proxyUrl?: string) {
    super();
    this._proxyUrl = proxyUrl;
    this._limits = [5, 10, 20, 50, 100, 500, 1000];

    // this._publicUrl = `${"https://api.binance.com"}${"/api/v1/"}`;
    // this._privateUrl = `${"https://api.binance.com"}${"/wapi/v3/"}`;
  }

  async getTradePairs(): Promise<any> {
    if (this._proxyUrl) {
      var request: IProxyRequest = {
        Action: "asda",
        ApiName: "sadas",
        Params: { "": "" }
      };
      var response = await fetch(this._proxyUrl, {
        method: HttpMethod.Post,
        body: JSON.stringify(request)
      });
    }

    // var content = await fetch(`${this._publicUrl}${"exchangeInfo"}`);

    // if (this.proxyUrl) {
    //   console.log(`Make request to the ${this.proxyUrl}`);
    // }

    return "";
  }
}
