const fs = require('node:fs');
const path = require('node:path');
const {DatabaseSync} = require('node:sqlite');

const dataDirectory = path.join(__dirname, '..', 'data');
const databasePath = path.join(dataDirectory, 'market-assessment.sqlite');
fs.mkdirSync(dataDirectory, {recursive: true});
const database = new DatabaseSync(databasePath);

database.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS dimensions (position INTEGER PRIMARY KEY, label TEXT NOT NULL, detail TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, legal_name TEXT NOT NULL, industry TEXT NOT NULL,
    naics TEXT NOT NULL, nace TEXT NOT NULL, description TEXT NOT NULL, characteristics_json TEXT NOT NULL,
    color TEXT NOT NULL, is_target INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS company_scores (
    company_id TEXT PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
    tech_leadership REAL NOT NULL, market_share REAL NOT NULL, software_integration REAL NOT NULL,
    esg_focus REAL NOT NULL, benchmark_json TEXT NOT NULL, factors_json TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT, company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    label TEXT NOT NULL, url TEXT NOT NULL, type TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT, company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL, value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT NOT NULL, company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL, timeframe TEXT NOT NULL, horizon TEXT NOT NULL, segment TEXT NOT NULL,
    geography TEXT NOT NULL, feature TEXT NOT NULL, pricing TEXT NOT NULL, rationale TEXT NOT NULL,
    why_now TEXT NOT NULL, PRIMARY KEY (company_id, id)
  );
`);

const companySeeds = [
  {
    id: 'pemamek-oy', name: 'Pemamek', legalName: 'Pemamek Oy', color: '#0d6b63', target: 1,
    industry: 'Shipbuilding welding & production automation', naics: '333992', nace: '28.99',
    description: 'Turnkey systems for heavy steel fabrication—from part preparation and panel lines to adaptive robotic welding and production software.',
    characteristics: ['High-capex projects', 'Long sales cycles', 'Engineering-led buying', 'Global service critical', 'Skilled-labor pressure'],
    scores: {techLeadership: 4.9, marketShare: 4.6, softwareIntegration: 4.6, esgFocus: 4.7, benchmark: [5.0, 4.8, 4.5, 4.6, 4.8, 4.7, 4.2, 4.8]},
    factors: {patentCount: 4.8, heavyPlateCapacity: 5.0, adaptiveControl: 4.5, cadCam: 4.6}
  },
  {
    id: 'kranendonk', name: 'KRANENDONK', legalName: 'KRANENDONK Production Systems B.V.', color: '#e9854f',
    industry: 'Shipbuilding welding & production automation', naics: '333992', nace: '28.99',
    description: 'Robotic production systems and welding automation for shipyards and heavy fabrication.', characteristics: [], scores: {benchmark: [4.7, 4.6, 4.8, 4.5, 4.8, 4.2, 4.1, 4.8]}
  },
  {
    id: 'inrotech', name: 'Inrotech', legalName: 'Inrotech A/S', color: '#5a76d6',
    industry: 'Shipbuilding welding & production automation', naics: '333992', nace: '28.99',
    description: 'Adaptive robotic welding and autonomous programming solutions for industrial fabrication.', characteristics: [], scores: {benchmark: [3.4, 4.1, 4.9, 4.2, 4.5, 4.0, 3.7, 4.6]}
  },
  {
    id: 'esab', name: 'ESAB', legalName: 'ESAB Corporation', color: '#9a8d75',
    industry: 'Shipbuilding welding & production automation', naics: '333992', nace: '28.99',
    description: 'Welding equipment, consumables, and automation solutions for industrial production.', characteristics: [], scores: {benchmark: [4.6, 4.9, 4.0, 4.2, 4.2, 4.5, 4.9, 4.6]}
  },
  {
    id: 'abb', name: 'ABB', legalName: 'ABB Ltd', color: '#c84b3c',
    industry: 'Industrial robotics & automation', naics: '333249', nace: '28.99',
    description: 'Public industrial technology company providing robotics, automation, and digital production systems.', characteristics: [], scores: {benchmark: [4.2, 4.2, 4.8, 4.7, 4.1, 4.8, 4.9, 4.1]}
  },
  {
    id: 'lincoln-electric', name: 'Lincoln Electric', legalName: 'Lincoln Electric Holdings, Inc.', color: '#8b5bb7',
    industry: 'Welding equipment & industrial automation', naics: '333992', nace: '28.99',
    description: 'Public welding manufacturer with automation, consumables, and production technology capabilities.', characteristics: [], scores: {benchmark: [4.5, 4.8, 4.2, 4.1, 4.3, 4.6, 4.9, 4.4]}
  },
  {
    id: 'yaskawa', name: 'Yaskawa Electric', legalName: 'Yaskawa Electric Corporation', color: '#2f8f9d',
    industry: 'Industrial robotics & motion automation', naics: '333249', nace: '28.99',
    description: 'Public robotics and motion-control company serving welding, material handling, and factory automation.', characteristics: [], scores: {benchmark: [4.1, 4.3, 4.9, 4.4, 4.0, 4.7, 4.8, 4.2]}
  },
  {
    id: 'fanuc', name: 'FANUC', legalName: 'FANUC Corporation', color: '#d49b35', industry: 'Factory automation & robotics', naics: '333249', nace: '28.99',
    description: 'Public factory automation company with ARC Mate welding robots and integrated machine vision.', characteristics: [], scores: {benchmark: [4.0, 4.1, 4.9, 4.6, 3.9, 4.9, 5.0, 4.0]}
  },
  {
    id: 'fronius', name: 'Fronius International', legalName: 'Fronius International GmbH', color: '#e05a47', industry: 'Advanced welding power sources', naics: '333992', nace: '28.99',
    description: 'Advanced welding systems company known for TPS/i robotics, CMT, and WeldCube analytics.', characteristics: [], scores: {benchmark: [3.6, 4.7, 4.6, 4.8, 4.0, 4.3, 4.6, 4.2]}
  },
  {
    id: 'cloos', name: 'Cloos', legalName: 'Carl Cloos Schweisstechnik GmbH', color: '#6e7bb8', industry: 'Automated welding systems', naics: '333992', nace: '28.99',
    description: 'Automated welding systems company providing QIROX robot gantries and heavy positioners.', characteristics: [], scores: {benchmark: [4.4, 4.7, 4.4, 4.1, 4.7, 4.1, 4.2, 4.5]}
  },
  {
    id: 'otc-daihen', name: 'OTC Daihen', legalName: 'OTC DAIHEN Corporation', color: '#4c9b72', industry: 'Welding power & robotic automation', naics: '333992', nace: '28.99',
    description: 'Welding power and robotic automation company behind TAWERS and thick-plate arc welding systems.', characteristics: [], scores: {benchmark: [4.1, 4.5, 4.5, 4.0, 4.1, 4.4, 4.4, 4.3]}
  },
  {
    id: 'igm', name: 'IGM', legalName: 'IGM Robotersysteme AG', color: '#aa6f45', industry: 'Heavy machinery robotic welding', naics: '333992', nace: '28.99',
    description: 'Customized long-reach gantry welding robots for shipyards and heavy structural fabricators.', characteristics: [], scores: {benchmark: [4.3, 4.8, 4.5, 3.9, 4.9, 3.8, 4.1, 4.7]}
  },
  {
    id: 'intecro', name: 'Intecro Robotics', legalName: 'Intecro Robotics Ltd', color: '#8c6fb1', industry: 'Shipyard 4.0 & custom robotics', naics: '333249', nace: '28.99',
    description: 'Vision-guided panel, micro-panel, and spool welding lines for connected shipyard production.', characteristics: [], scores: {benchmark: [4.2, 4.0, 4.7, 4.3, 4.6, 4.0, 3.5, 4.1]}
  },
  {
    id: 'zhouxiang', name: 'Zhouxiang Enterprise', legalName: 'Zhejiang Zhouxiang Steel Structure Co., Ltd.', color: '#b47d50', industry: 'Structural steel & shipyard machinery', naics: '333120', nace: '28.99',
    description: 'Structural steel and shipyard machinery supplier for H-beam, panel line, and heavy plate fabrication.', characteristics: [], scores: {benchmark: [4.1, 4.4, 3.3, 3.1, 3.8, 4.2, 3.8, 4.3]}
  },
  {
    id: 'gullco', name: 'Gullco International', legalName: 'Gullco International Inc.', color: '#5f8c9c', industry: 'Welding automation & travel carriages', naics: '333992', nace: '28.99',
    description: 'Welding automation company providing travel carriages, beveling machinery, and seam tracking.', characteristics: [], scores: {benchmark: [3.2, 4.2, 3.0, 3.2, 3.5, 4.5, 4.3, 4.5]}
  }
];

const dimensions = [['Turnkey yard', 'scope'], ['Heavy-weld', 'process depth'], ['Adaptive', 'robotics'], ['Digital', 'thread'], ['Custom', 'engineering'], ['Modular', 'scale-up'], ['Global', 'service'], ['Shipyard', 'proof']];
const sources = [
  ['pemamek-oy', 'Pemamek', 'https://pemamek.com/welding-solutions/shipbuilding/', 'public company material'],
  ['kranendonk', 'KRANENDONK', 'https://kranendonk.com/', 'public company material'],
  ['inrotech', 'Inrotech', 'https://www.inrotech.com/', 'public company material'],
  ['esab', 'ESAB', 'https://esab.com/us/nam_en/products-solutions/categories/welding-automation/', 'public company material'],
  ['abb', 'ABB Robotics', 'https://new.abb.com/products/robotics', 'public company material'],
  ['lincoln-electric', 'Lincoln Electric Automation', 'https://www.lincolnelectric.com/en/welding-automation', 'public company material'],
  ['yaskawa', 'Yaskawa Motoman', 'https://www.yaskawa.com/products/robotics', 'public company material'],
  ['fanuc', 'FANUC ARC Mate', 'https://www.fanucamerica.com/products/robots/robot-application/arc-welding', 'public company material'],
  ['fronius', 'Fronius Welding', 'https://www.fronius.com/en/welding-technology', 'public company material'],
  ['cloos', 'CLOOS QIROX', 'https://www.cloos.de/en/robotic-welding-technology', 'public company material'],
  ['otc-daihen', 'OTC Daihen Robotics', 'https://www.daihen-usa.com/robotics', 'public company material'],
  ['igm', 'IGM Robotersysteme', 'https://www.igm-group.com/', 'public company material'],
  ['intecro', 'Intecro Robotics', 'https://www.intecro-robotics.com/', 'public company material'],
  ['zhouxiang', 'Zhouxiang Enterprise', 'https://www.zxsteel.com/', 'public company material'],
  ['gullco', 'Gullco International', 'https://www.gullco.com/', 'public company material']
];
const signals = [['patentVelocity', 'stable'], ['hiringMomentum', 'elevated'], ['contractActivity', 'elevated'], ['marketMomentum', 'High']];
const opportunities = [
  ['01', 'Autonomous naval module lines', 'NOW-3 YEARS', '0–3 years', 'Naval & icebreaker yards', 'Nordics · North America', 'Low-operator autonomous line', 'Phased capex + lifecycle software', 'Defense capacity, labor scarcity, and delivery pressure are converging.', 'Defense capacity, labor scarcity, and delivery pressure are converging.'],
  ['02', 'Floating-wind factory blueprint', '2-5 YEARS', '2–5 years', 'Floating wind fabricators', 'North Sea · East Asia', 'Adaptive multipass + material flow', 'Capacity-tiered line packages', 'XL structures are moving from prototypes toward repeatable production.', 'XL structures are moving from prototypes toward repeatable production.'],
  ['03', 'Automation-as-a-service', '1-4 YEARS', '1–4 years', 'Mid-size yards & fabricators', 'Baltics · Iberia · Southeast Asia', 'No-code cells + remote intelligence', 'Lease + usage-based service', 'Easier programming and connected service reduce adoption barriers.', 'Easier programming and connected service reduce adoption barriers.']
];

function seedDatabase() {
  const insertDimension = database.prepare('INSERT OR IGNORE INTO dimensions VALUES (?, ?, ?)');
  dimensions.forEach(([label, detail], position) => insertDimension.run(position, label, detail));
  const insertCompany = database.prepare(`INSERT INTO companies (id, name, legal_name, industry, naics, nace, description, characteristics_json, color, is_target)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name, legal_name=excluded.legal_name, industry=excluded.industry, naics=excluded.naics, nace=excluded.nace, description=excluded.description, characteristics_json=excluded.characteristics_json, color=excluded.color, is_target=excluded.is_target`);
  const insertScore = database.prepare(`INSERT INTO company_scores (company_id, tech_leadership, market_share, software_integration, esg_focus, benchmark_json, factors_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(company_id) DO UPDATE SET tech_leadership=excluded.tech_leadership, market_share=excluded.market_share, software_integration=excluded.software_integration, esg_focus=excluded.esg_focus, benchmark_json=excluded.benchmark_json, factors_json=excluded.factors_json`);
  companySeeds.forEach((company) => {
    insertCompany.run(company.id, company.name, company.legalName, company.industry, company.naics || '333992', company.nace || '28.99', company.description, JSON.stringify(company.characteristics || []), company.color, company.target || 0);
    const scores = company.scores;
    insertScore.run(company.id, scores.techLeadership || 0, scores.marketShare || 0, scores.softwareIntegration || 0, scores.esgFocus || 0, JSON.stringify(scores.benchmark), JSON.stringify(company.factors || {}));
  });
  const insertSource = database.prepare('INSERT INTO sources (company_id, label, url, type) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM sources WHERE url = ?)');
  sources.forEach((source) => insertSource.run(...source, source[2]));
  const insertSignal = database.prepare('INSERT INTO signals (company_id, name, value) VALUES (?, ?, ?)');
  signals.forEach(([name, value]) => insertSignal.run('pemamek-oy', name, value));
  const insertOpportunity = database.prepare('INSERT OR IGNORE INTO opportunities VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  opportunities.forEach((opportunity) => insertOpportunity.run(opportunity[0], 'pemamek-oy', ...opportunity.slice(1)));
}

seedDatabase();

function getDimensions() { return database.prepare('SELECT label, detail FROM dimensions ORDER BY position').all().map((row) => [row.label, row.detail]); }
function hydrateCompany(row) {
  if (!row) return null;
  const score = database.prepare('SELECT * FROM company_scores WHERE company_id = ?').get(row.id);
  return {...row, classifications: {naics: row.naics, nace: row.nace}, characteristics: JSON.parse(row.characteristics_json), scores: {...score, benchmark: JSON.parse(score.benchmark_json), factors: JSON.parse(score.factors_json)}};
}
function findCompany(input) {
  const key = String(input || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const row = database.prepare("SELECT * FROM companies WHERE replace(replace(lower(name), ' ', ''), '-', '') = ? OR replace(replace(lower(legal_name), ' ', ''), '-', '') = ?").get(key, key);
  if (row) return hydrateCompany(row);
  if (['pema', 'pemamekoy'].includes(key)) return hydrateCompany(database.prepare('SELECT * FROM companies WHERE id = ?').get('pemamek-oy'));
  return null;
}
function getPeers() { return database.prepare('SELECT c.name, c.color, s.benchmark_json FROM companies c JOIN company_scores s ON s.company_id = c.id WHERE c.is_target = 0 ORDER BY c.name').all().map((row) => ({name: row.name, color: row.color, values: JSON.parse(row.benchmark_json)})); }
function getSources(companyId) { return database.prepare('SELECT label, url, type FROM sources WHERE company_id = ? OR company_id IN (SELECT id FROM companies WHERE is_target = 0)').all(companyId); }
function getSignals(companyId) { return Object.fromEntries(database.prepare('SELECT name, value FROM signals WHERE company_id = ?').all(companyId).map((row) => [row.name, row.value])); }
function getOpportunities(companyId) { return database.prepare('SELECT id, title, timeframe, horizon, segment, geography, feature, pricing, rationale, why_now AS whyNow FROM opportunities WHERE company_id = ? ORDER BY id').all(companyId); }

module.exports = {getDimensions, findCompany, getPeers, getSources, getSignals, getOpportunities, databasePath};
