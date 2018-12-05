const noLocalPairMessage = (exConfig, pairs) =>
  `⚠️  ${exConfig.name}: no local pairs for: ${pairs.join(", ")}`;

function getLocalPairs(globalPairs, exConfig) {
  let pairs = globalPairs.map(globalPair => ({
    localPair: exConfig.pairs[globalPair],
    globalPair,
  }));

  let missingPairs = pairs
    .filter(p => p.localPair === undefined)
    .map(p => p.globalPair);
  console.log(noLocalPairMessage(exConfig, missingPairs));

  return pairs.filter(p => p.localPair);
}

module.exports = { getLocalPairs };
