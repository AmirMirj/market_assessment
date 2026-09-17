const {
  getDimensions,
  findCompany,
  getPeers,
  getSources,
} = require('./database');
const {collectSignals} = require('./intelligence/ingestion');
const {round, calculateBenchmark} = require('./intelligence/analytics');
const {buildOpportunities} = require('./intelligence/discovery');
const {buildTraceability} = require('./intelligence/delivery');

function resolveEntity(input) {
  return findCompany(input);
}

function buildAssessment(input) {
  const entity = resolveEntity(input);
  if (!entity) return null;

  const dimensions = getDimensions();
  const peers = getPeers();
  const benchmark = calculateBenchmark(dimensions, entity, peers);
  const signals = collectSignals();
  return {
    entity: entity.name,
    entityId: entity.id,
    legalName: entity.legal_name,
    industry: entity.industry,
    classifications: entity.classifications,
    description: entity.description,
    characteristics: entity.characteristics,
    kpis: {
      competitive_strength: round(benchmark.targetAverage),
      peer_advantage: round(benchmark.targetAverage - benchmark.peerAverage),
      category_leads: `${String(benchmark.categoryLeads).padStart(2, '0')}/${
          String(dimensions.length).padStart(2, '0')}`,
      market_momentum: signals.marketMomentum,
    },
    scores: {
      tech_leadership:
          entity.scores.tech_leadership || entity.scores.techLeadership,
      market_share: entity.scores.market_share || entity.scores.marketShare,
      software_integration: round(
          0.6 * entity.scores.factors.adaptiveControl +
          0.4 * entity.scores.factors.cadCam),
      esg_focus: entity.scores.esg_focus || entity.scores.esgFocus,
      tech_formula: '0.50 × patent count + 0.50 × heavy plate capacity',
      software_formula: '0.60 × adaptive control + 0.40 × CAD/CAM integration',
    },
    benchmark: {
      dimensions,
      series: [
        {
          name: entity.name,
          color: entity.color,
          values: entity.scores.benchmark,
          primary: true
        },
        ...peers,
      ],
      matrix: benchmark.matrix,
    },
    opportunities: buildOpportunities(entity),
    traceability: buildTraceability(getSources(entity.id), signals),
  };
}

module.exports = {
  buildAssessment,
  resolveEntity
};
