const noLocalPairMessage = (globalPair, exConfig) =>
  `⚠️  pair ${globalPair} not exists for ${exConfig.name}`;

function getLocalPairs(globalPairs, exConfig) {
  return globalPairs
    .filter(globalPair => {
      if (exConfig.pairs[globalPair] === undefined) {
        console.warn(noLocalPairMessage(globalPair, exConfig));
        return false;
      } else return true;
    })
    .map(globalPair => ({
      localPair: exConfig.pairs[globalPair],
      globalPair,
    }));
}

module.exports = { getLocalPairs };
