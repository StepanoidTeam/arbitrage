function checkBrokenBook(data) {
  return ![
    () => data,
    () => data.asks,
    () => data.bids,
    () => data.asks.length > 0,
    () => data.bids.length > 0,
    () => data.bids[0],
    () => data.asks[0],
    () => data.bids[0].price < data.asks[0].price,
  ].every(x => x());
}

module.exports = { checkBrokenBook };
