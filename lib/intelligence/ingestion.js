const {getSources, getSignals} = require('../database');

function collectSignals() {
  const stored = getSignals('pemamek-oy');
  return {
    sourceCount: getSources('pemamek-oy').length,
    patentVelocity: stored.patentVelocity,
    hiringMomentum: stored.hiringMomentum,
    contractActivity: stored.contractActivity,
    marketMomentum: stored.marketMomentum,
    mode: 'deterministic-fallback',
  };
}

module.exports = {
  evidenceSources : getSources('pemamek-oy'), collectSignals
};
