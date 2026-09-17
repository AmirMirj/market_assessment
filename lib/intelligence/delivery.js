function buildTraceability(evidence, signals) {
  return {
    mode: signals.mode,
    generatedAt: new Date().toISOString(),
    evidence,
    signalSummary: signals,
    notes:
        'Directional analyst judgments based on public evidence; not audited market-share data.',
  };
}

module.exports = {buildTraceability};
