export default interface IProxyRequest {
  ApiName: string;
  Action: string;
  Params: { [key: string]: string };
}
