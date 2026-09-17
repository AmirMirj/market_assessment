function getHealth() {
  return {
    status: 'ok',
    pipeline: 'deterministic-fallback',
    services: {
      ingestion: 'ready',
      entityResolution: 'ready',
      analytics: 'ready',
      discovery: 'ready',
      delivery: 'ready',
    },
    checkedAt: new Date().toISOString(),
  };
}

function getSignals() {
  return {
    entity: 'Pemamek',
    alerts: [
      {
        id: 'signal-01',
        type: 'market',
        severity: 'high',
        title: 'Defense automation demand pocket',
        status: 'watching',
        source: 'Public trade and market signals'
      },
      {
        id: 'signal-02',
        type: 'technology',
        severity: 'medium',
        title: 'Adaptive welding software differentiation',
        status: 'watching',
        source: 'Product and patent evidence'
      },
      {
        id: 'signal-03',
        type: 'contract',
        severity: 'medium',
        title: 'Shipyard modernization activity',
        status: 'watching',
        source: 'Public company material'
      },
    ],
    delivery: {channels: ['REST API', 'dashboard'], subscriptions: false},
    mode: 'deterministic-fallback',
  };
}

module.exports = {
  getHealth,
  getSignals
};
