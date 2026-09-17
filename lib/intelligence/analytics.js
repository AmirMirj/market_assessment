function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function calculateBenchmark(dimensions, entity, peers) {
  const targetAverage = average(entity.scores.benchmark);
  const peerAverage = average(peers.map((peer) => average(peer.values)));
  const matrix = dimensions.map(([label, detail], index) => {
    const row = {
      axis: `${label} ${detail}`,
      [entity.name.toLowerCase().replace(/[^a-z0-9]/g, '_')]:
          entity.scores.benchmark[index],
    };
    peers.forEach((peer) => {
      row[peer.name.toLowerCase().replace(/[^a-z0-9]/g, '_')] =
          peer.values[index];
    });
    return row;
  });
  const categoryLeads = entity.scores.benchmark
                            .filter(
                                (score, index) => peers.every(
                                    (peer) => score >= peer.values[index]))
                            .length;
  return {targetAverage, peerAverage, matrix, categoryLeads};
}

module.exports = {
  average,
  round,
  calculateBenchmark
};
