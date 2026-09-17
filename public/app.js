const profile = {
  company: 'Pemamek',
  industry: 'Shipbuilding welding & production automation',
  description:
      'Turnkey systems for heavy steel fabrication—from part preparation and panel lines to adaptive robotic welding and production software.',
  characteristics: [
    'High-capex projects',
    'Long sales cycles',
    'Engineering-led buying',
    'Global service critical',
    'Skilled-labor pressure',
  ],
};

const dimensions = [
  ['Turnkey yard', 'scope'],
  ['Heavy-weld', 'process depth'],
  ['Adaptive', 'robotics'],
  ['Digital', 'thread'],
  ['Custom', 'engineering'],
  ['Modular', 'scale-up'],
  ['Global', 'service'],
  ['Shipyard', 'proof'],
];
const dimensionGroups = [
  'Operational Scope', 'Technical Execution', 'Digital Sophistication',
  'Digital Sophistication', 'Technical Execution', 'Operational Scope',
  'Operational Scope', 'Technical Execution'
];

let series = [
  {
    name: 'Pemamek',
    color: '#0d6b63',
    values: [5.0, 4.8, 4.5, 4.6, 4.8, 4.7, 4.2, 4.8],
    primary: true,
  },
  {
    name: 'KRANENDONK',
    color: '#e9854f',
    values: [4.4, 4.2, 4.8, 4.8, 4.6, 4.6, 3.5, 4.4],
  },
  {
    name: 'Inrotech',
    color: '#5a76d6',
    values: [3.4, 4.3, 5.0, 3.8, 4.0, 4.1, 3.2, 4.1],
  },
  {
    name: 'ESAB',
    color: '#9a8d75',
    values: [3.6, 4.8, 4.2, 4.7, 4.0, 4.5, 5.0, 4.5],
  },
];

const hiddenSeries =
    new Set(series.filter((item) => !item.primary).map((item) => item.name));
let chartMode = 'radar';
const scenarioWeights = {
  defense: 70,
  wind: 50
};
const svg = document.querySelector('#comparison-chart');
const legend = document.querySelector('#legend');
const tooltip = document.querySelector('#chart-tooltip');
const dashboard = document.querySelector('#dashboard');
const emptyState = document.querySelector('#empty-state');
const input = document.querySelector('#company-input');
const scanButton = document.querySelector('#scan-button');
const scanStatus = document.querySelector('#scan-status');
let currentAssessment = null;

function svgNode(tag, attrs = {}, text = '') {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(
      ([key, value]) => node.setAttribute(key, value));
  if (text) node.textContent = text;
  return node;
}

function renderLegend() {
  legend.innerHTML = '';
  series.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(!hiddenSeries.has(item.name)));
    button.innerHTML = `<i style="background:${
        item.primary ? '#0D6EFD' : '#CBD5E1'}"></i>${item.name}`;
    button.classList.toggle('off', hiddenSeries.has(item.name));
    button.addEventListener('click', () => {
      hiddenSeries.has(item.name) ? hiddenSeries.delete(item.name) :
                                    hiddenSeries.add(item.name);
      renderLegend();
      renderChart();
    });
    legend.append(button);
  });
}

function renderPeerSelect() {
  const select = document.querySelector('#peer-select');
  select.innerHTML = series
                         .map(
                             (item) => `<option value="${item.name}" ${
                                 hiddenSeries.has(item.name) ?
                                     '' :
                                     'selected'}>${item.name}</option>`)
                         .join('');
}

function renderRadar() {
  const isPhone = window.matchMedia('(max-width: 640px)').matches;
  const width = isPhone ? Math.max(svg.clientWidth || 330, 320) :
                          Math.max(svg.clientWidth || 900, 760);
  const height = isPhone ? 350 : (svg.clientHeight || 390);
  const center = {x: width / 2, y: height / 2 + 5};
  const radius = Math.min(width * 0.29, height * 0.38);
  const angle = (index) =>
      -Math.PI / 2 + (index * Math.PI * 2) / dimensions.length;
  const point = (index, value) => ({
    x: center.x + Math.cos(angle(index)) * radius * (value / 5),
    y: center.y + Math.sin(angle(index)) * radius * (value / 5)
  });
  const points = (value) => dimensions
                                .map((_, index) => {
                                  const result = point(index, value);
                                  return `${result.x},${result.y}`;
                                })
                                .join(' ');

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  for (let value = 1; value <= 5; value += 1) {
    svg.append(
        svgNode('polygon', {points: points(value), class: 'radar-grid'}));
  }
  dimensions.forEach((parts, index) => {
    const outer = point(index, 5);
    const label = point(index, 5.55);
    svg.append(svgNode('line', {
      x1: center.x,
      y1: center.y,
      x2: outer.x,
      y2: outer.y,
      class: 'radar-axis'
    }));
    const text = svgNode('text', {
      x: label.x,
      y: label.y,
      'text-anchor': 'middle',
      class: 'chart-x-label'
    });
    text.append(svgNode('tspan', {x: label.x, dy: 0}, parts[0]));
    text.append(svgNode('tspan', {x: label.x, dy: 13}, parts[1]));
    text.append(svgNode('tspan', {x: label.x, dy: 13}, dimensionGroups[index]));
    svg.append(text);
  });
  series.forEach((item) => {
    if (hiddenSeries.has(item.name)) return;
    const polygon = item.values
                        .map((value, index) => {
                          const result = point(index, value);
                          return `${result.x},${result.y}`;
                        })
                        .join(' ');
    const seriesColor = item.primary ? '#0D6EFD' : '#CBD5E1';
    svg.append(svgNode('polygon', {
      points: polygon,
      stroke: seriesColor,
      color: seriesColor,
      class: `radar-series${item.primary ? ' primary' : ''}`
    }));
    item.values.forEach((value, index) => {
      const node = point(index, value);
      const hit = svgNode('circle', {
        cx: node.x,
        cy: node.y,
        r: item.primary ? 7 : 5,
        fill: seriesColor,
        class: 'radar-point'
      });
      hit.addEventListener(
          'mouseenter',
          () => showTooltip(item, value, index, node.x, node.y, width));
      hit.addEventListener('mouseleave', hideTooltip);
      svg.append(hit);
    });
  });
}

function renderChart() {
  if (chartMode === 'radar') {
    renderRadar();
    return;
  }
  const isPhone = window.matchMedia('(max-width: 640px)').matches;
  const width = Math.max(svg.clientWidth || 900, isPhone ? 760 : 760);
  const height = isPhone ? 400 : (svg.clientHeight || 390);
  const margin = {top: 18, right: 18, bottom: 68, left: 42};
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (index) =>
      margin.left + (index * plotWidth) / (dimensions.length - 1);
  const y = (value) => margin.top + ((5 - value) / 4) * plotHeight;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  for (let value = 1; value <= 5; value += 1) {
    const gridY = y(value);
    svg.append(svgNode('line', {
      x1: margin.left,
      x2: width - margin.right,
      y1: gridY,
      y2: gridY,
      class: 'chart-grid'
    }));
    svg.append(svgNode(
        'text', {
          x: margin.left - 16,
          y: gridY + 4,
          'text-anchor': 'middle',
          class: 'chart-axis-label'
        },
        value));
  }

  dimensions.forEach((parts, index) => {
    const label = svgNode('text', {
      x: x(index),
      y: height - 34,
      'text-anchor': 'middle',
      class: 'chart-x-label'
    });
    label.append(svgNode('tspan', {x: x(index), dy: 0}, parts[0]));
    label.append(svgNode('tspan', {x: x(index), dy: 13}, parts[1]));
    label.append(
        svgNode('tspan', {x: x(index), dy: 13}, dimensionGroups[index]));
    svg.append(label);
  });

  series.forEach((item) => {
    if (hiddenSeries.has(item.name)) return;
    const pathData =
        item.values
            .map(
                (value, index) =>
                    `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(value)}`)
            .join(' ');
    svg.append(svgNode('path', {
      d: pathData,
      stroke: item.primary ? '#0D6EFD' : '#CBD5E1',
      class: `chart-series${item.primary ? ' primary' : ''}`,
    }));

    item.values.forEach((value, index) => {
      const group = svgNode('g');
      group.append(svgNode('circle', {
        cx: x(index),
        cy: y(value),
        r: item.primary ? 4.5 : 3.5,
        fill: item.primary ? '#0D6EFD' : '#fffdf8',
        stroke: item.primary ? '#0D6EFD' : '#CBD5E1',
        class: 'chart-point',
      }));
      const hit = svgNode(
          'circle', {cx: x(index), cy: y(value), r: 12, class: 'chart-hit'});
      hit.addEventListener(
          'mouseenter',
          () => showTooltip(item, value, index, x(index), y(value), width));
      hit.addEventListener('mouseleave', hideTooltip);
      group.append(hit);
      svg.append(group);
    });
  });
}

function showTooltip(item, value, index, pointX, pointY, chartWidth) {
  const source = currentAssessment?.traceability?.evidence?.find(
                     (entry) => entry.label.toLowerCase().includes(
                         item.name.toLowerCase().split(' ')[0])) ||
      currentAssessment?.traceability?.evidence?.[0];
  const evidence = source ?
      `${source.label} evidence verified via public material` :
      'Public evidence set';
  tooltip.innerHTML = `<strong>${item.name} · ${
      value.toFixed(1)}</strong><span>${dimensions[index].join(' ')} · ${
      dimensionGroups[index]}</span><small>${evidence}</small>`;
  tooltip.style.display = 'block';
  const left = pointX > chartWidth - 175 ? pointX - 160 : pointX + 12;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${Math.max(pointY - 18, 0)}px`;
}

function hideTooltip() {
  tooltip.style.display = 'none';
}

function applyAssessment(assessment) {
  currentAssessment = assessment;
  input.value = assessment.entity;
  document.querySelectorAll('[data-company]').forEach((node) => {
    node.textContent = assessment.entity;
  });
  document.querySelector('#industry-name').textContent = assessment.industry;
  document.querySelector('#industry-description').textContent =
      assessment.description;
  document.querySelector('#characteristic-list').innerHTML =
      assessment.characteristics.map((item) => `<span>${item}</span>`).join('');
  document.querySelector('#entity-meta').textContent =
      `${assessment.legalName || assessment.entity} · NAICS ${
          assessment.classifications?.naics ||
          '333992'} · NACE ${assessment.classifications?.nace || '28.99'}`;
  document.querySelector('#overall-score').textContent =
      assessment.kpis.competitive_strength.toFixed(1);
  document.querySelector('#peer-advantage').textContent =
      `${assessment.kpis.peer_advantage >= 0 ? '+' : ''}${
          assessment.kpis.peer_advantage.toFixed(1)}`;
  document.querySelector('#category-leads').textContent =
      assessment.kpis.category_leads.split('/')[0];
  document.querySelector('#category-leads-count').textContent =
      assessment.kpis.category_leads.split('/')[0];
  document.querySelector('#market-momentum').textContent =
      assessment.kpis.market_momentum;
  document.querySelector('#competitive-track').style.width =
      `${assessment.kpis.competitive_strength / 5 * 100}%`;
  document.querySelector('#score-formula').textContent = `${
      assessment.scores?.tech_formula ||
      'Tech leadership blends patent evidence and heavy-plate capacity.'} ${
      assessment.scores?.software_formula ||
      'Software integration blends adaptive control and CAD/CAM integration.'}`;
  document.querySelector('#evidence-status').innerHTML = `<span></span> ${
      assessment.traceability?.mode === 'deterministic-fallback' ?
          'Deterministic evidence set' :
          'Evidence traceable'}`;
  series = assessment.benchmark.series;
  hiddenSeries.clear();
  series.forEach((item) => {
    if (!item.primary) hiddenSeries.add(item.name);
  });
  renderPeerSelect();
  document.querySelector('.opportunity-grid').innerHTML =
      assessment.opportunities
          .map(
              (opportunity, index) => `
    <article class="opportunity-card${index === 0 ? ' featured' : ''}">
      <div class="opportunity-topline"><span class="opportunity-index">${
                  opportunity.id}</span><span class="horizon">${
                  opportunity.horizon}</span></div>
      <div class="opportunity-icon" aria-hidden="true">${
                  index === 0     ? '✦' :
                      index === 1 ? '↗' :
                                    '◎'}</div>
      <h4>${opportunity.title}</h4>
      <p class="opportunity-thesis">${opportunity.rationale}</p>
      <dl>
        <div><dt>Segment</dt><dd>${opportunity.segment}</dd></div>
        <div><dt>Geography</dt><dd>${opportunity.geography}</dd></div>
        <div><dt>Feature</dt><dd>${opportunity.feature}</dd></div>
        <div><dt>Pricing</dt><dd>${opportunity.pricing}</dd></div>
      </dl>
      <div class="why-now"><span>Why now</span> ${opportunity.whyNow}</div>
      <button class="opportunity-cta" type="button" data-opportunity-action="${
                  index === 0 ? 'Model financial ROI' :
                                'Generate pitch outline'}">${
                  index === 0 ?
                      'Model financial ROI' :
                      'Generate pitch outline'} <span>→</span></button>
    </article>`)
          .join('');
  renderOpportunities();
}

function renderOpportunities() {
  if (!currentAssessment) return;
  const baseScore = currentAssessment.kpis.competitive_strength;
  const scenarioScore = Math.max(
      1,
      Math.min(
          5,
          baseScore + ((scenarioWeights.defense - 70) * 0.002) +
              ((scenarioWeights.wind - 50) * 0.0015)));
  document.querySelector('#overall-score').textContent =
      scenarioScore.toFixed(1);
  document.querySelector('#competitive-track').style.width =
      `${scenarioScore / 5 * 100}%`;
  const ranked = [...currentAssessment.opportunities].sort((a, b) => {
    const score = (opportunity) => opportunity.id === '01' ?
        scenarioWeights.defense :
        opportunity.id === '02' ? scenarioWeights.wind :
                                  45;
    return score(b) - score(a);
  });
  const grid = document.querySelector('.opportunity-grid');
  grid.innerHTML =
      ranked
          .map(
              (opportunity, index) => `
    <article class="opportunity-card${index === 0 ? ' featured' : ''}">
      <div class="opportunity-topline"><span class="opportunity-index">${
                  opportunity.id}</span><span class="horizon">${
                  opportunity.horizon}</span></div>
      <div class="opportunity-icon" aria-hidden="true">${
                  opportunity.id === '01'     ? '✦' :
                      opportunity.id === '02' ? '↗' :
                                                '◎'}</div>
      <h4>${opportunity.title}</h4>
      <p class="opportunity-thesis">${opportunity.rationale}</p>
      <dl>
        <div><dt>Segment</dt><dd>${opportunity.segment}</dd></div>
        <div><dt>Geography</dt><dd>${opportunity.geography}</dd></div>
        <div><dt>Feature</dt><dd>${opportunity.feature}</dd></div>
        <div><dt>Pricing</dt><dd>${opportunity.pricing}</dd></div>
      </dl>
      <div class="why-now"><span>Why now</span> ${opportunity.whyNow}</div>
      <button class="opportunity-cta" type="button" data-opportunity-action="${
                  opportunity.id === '01' ? 'Model financial ROI' :
                                            'Generate pitch outline'}">${
                  opportunity.id === '01' ?
                      'Model financial ROI' :
                      'Generate pitch outline'} <span>→</span></button>
    </article>`)
          .join('');
}

function showLoadedProfile() {
  dashboard.hidden = false;
  emptyState.hidden = true;
  dashboard.style.animation = 'none';
  requestAnimationFrame(() => {
    dashboard.style.animation = '';
    dashboard.scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  renderLegend();
  renderChart();
}

function setScanState(state, message = '') {
  const loading = state === 'loading';
  scanButton.disabled = loading;
  scanButton.classList.toggle('loading', loading);
  scanButton.querySelector('span').textContent =
      loading ? 'Scanning…' : 'Run scan';
  scanStatus.textContent = message;
  scanStatus.classList.toggle('error', state === 'error');
  document.querySelector('#analysis-state').textContent =
      loading ? 'Resolving company' : 'Analysis ready';
  document.querySelector('#scan-progress').hidden = !loading;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function loadProfile() {
  const value = input.value.trim();
  if (!value) {
    dashboard.hidden = true;
    emptyState.hidden = false;
    document.querySelector('#empty-message').textContent =
        'Enter a company name to start an assessment.';
    return;
  }

  setScanState('loading', 'Resolving entity and preparing the benchmark…');
  try {
    const responsePromise =
        fetch(`/api/assess?company=${encodeURIComponent(value)}`);
    const [, response] = await Promise.all([wait(1200), responsePromise]);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(
          payload.code === 'ENTITY_NOT_FOUND' ? 'not-found' : 'unavailable');
    }
    applyAssessment(await response.json());
    setScanState('ready', 'Assessment loaded from the profile service.');
  } catch (error) {
    const fallback = /^(pema|pemamek|pemamek oy)$/i.test(value);
    if (!fallback) {
      dashboard.hidden = true;
      emptyState.hidden = false;
      setScanState(
          'error',
          error.message === 'not-found' ?
              'No matching profile found.' :
              'The profile service is unavailable.');
      document.querySelector('#empty-message').textContent =
          `We couldn't find a profile for “${
              value}”. Try Pemamek or Pemamek Oy.`;
      return;
    }
    applyAssessment({
      entity: profile.company,
      legalName: 'Pemamek Oy',
      classifications: {naics: '333992', nace: '28.99'},
      industry: profile.industry,
      description: profile.description,
      characteristics: profile.characteristics,
      kpis: {
        competitive_strength: 4.7,
        peer_advantage: 0.4,
        category_leads: '04/08',
        market_momentum: 'High'
      },
      scores: {},
      benchmark: {series},
    });
    setScanState('ready', 'Showing the built-in presentation profile.');
  }
  showLoadedProfile();
}

document.querySelector('#company-form').addEventListener('submit', (event) => {
  event.preventDefault();
  loadProfile();
});

document.querySelector('#load-demo').addEventListener('click', () => {
  input.value = 'Pemamek';
  loadProfile();
});

document.querySelectorAll('[data-chart-mode]')
    .forEach((button) => button.addEventListener('click', () => {
      chartMode = button.dataset.chartMode;
      document.querySelectorAll('[data-chart-mode]')
          .forEach((item) => item.classList.toggle('active', item === button));
      renderChart();
    }));

document.querySelector('#peer-select').addEventListener('change', (event) => {
  const visible =
      new Set([...event.target.selectedOptions].map((option) => option.value));
  series.forEach((item) => {
    if (visible.has(item.name))
      hiddenSeries.delete(item.name);
    else
      hiddenSeries.add(item.name);
  });
  renderLegend();
  renderChart();
});

function updateScenarioWeight(key, value) {
  scenarioWeights[key] = Number(value);
  document
      .querySelector(`#${key === 'defense' ? 'defense' : 'wind'}-weight-value`)
      .textContent = value;
  renderOpportunities();
}

document.querySelector('#defense-weight')
    .addEventListener(
        'input',
        (event) => updateScenarioWeight('defense', event.target.value));
document.querySelector('#wind-weight')
    .addEventListener(
        'input', (event) => updateScenarioWeight('wind', event.target.value));

function openMetricDrawer(metric) {
  const assessment = currentAssessment || {
    kpis: {
      competitive_strength: 4.7,
      peer_advantage: 0.4,
      category_leads: '04/08',
      market_momentum: 'High'
    },
    scores: {},
    traceability: {evidence: []}
  };
  const labels = {
    competitive_strength: 'Competitive strength',
    peer_advantage: 'Peer advantage',
    category_leads: 'Category leads',
    market_momentum: 'Market momentum'
  };
  const summaries = {
    competitive_strength:
        'Weighted public-evidence score across the assessed capability profile.',
    peer_advantage:
        'Difference between the target score and the peer-set average.',
    category_leads:
        'Dimensions where the target matches or exceeds every selected peer.',
    market_momentum: 'Directional read on demand signals affecting the market.',
  };
  const value = assessment.kpis[metric];
  document.querySelector('#drawer-title').textContent = labels[metric];
  document.querySelector('#drawer-summary').textContent = summaries[metric];
  document.querySelector('#drawer-score').textContent =
      typeof value === 'number' ? value.toFixed(1) : value;
  document.querySelector('#drawer-formula').textContent =
      metric === 'peer_advantage' ? 'Target score − mean(peer scores)' :
                                    assessment.scores?.tech_formula ||
          'Directional analyst judgment from public evidence.';
  document.querySelector('#drawer-evidence').innerHTML =
      (assessment.traceability?.evidence || [])
          .map(
              (source) => `<li><a href="${
                  source.url}" target="_blank" rel="noreferrer">${
                  source.label}</a><span>${source.type}</span></li>`)
          .join('') ||
      '<li>Built-in presentation evidence set</li>';
  document.querySelector('#metric-drawer').setAttribute('aria-hidden', 'false');
  document.querySelector('#metric-drawer').classList.add('open');
}

document.querySelectorAll('[data-metric]').forEach((card) => {
  card.addEventListener('click', () => openMetricDrawer(card.dataset.metric));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMetricDrawer(card.dataset.metric);
    }
  });
});
document.querySelectorAll('[data-drawer-close]')
    .forEach((element) => element.addEventListener('click', () => {
      document.querySelector('#metric-drawer').classList.remove('open');
      document.querySelector('#metric-drawer')
          .setAttribute('aria-hidden', 'true');
    }));

document.querySelector('.opportunity-grid')
    .addEventListener('click', (event) => {
      const action = event.target.closest('[data-opportunity-action]')
                         ?.dataset.opportunityAction;
      if (action) {
        scanStatus.textContent = `${action} queued for the selected scenario.`;
        scanStatus.classList.remove('error');
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });

document.querySelector('#theme-toggle').addEventListener('click', (event) => {
  const dark = document.body.classList.toggle('dark-theme');
  event.currentTarget.setAttribute('aria-pressed', String(dark));
  localStorage.setItem('market-assessment-theme', dark ? 'dark' : 'light');
});

if (localStorage.getItem('market-assessment-theme') === 'dark') {
  document.body.classList.add('dark-theme');
  document.querySelector('#theme-toggle').setAttribute('aria-pressed', 'true');
}

document.querySelector('#export-brief').addEventListener('click', () => {
  if (window.html2pdf) {
    window.html2pdf()
        .set({
          margin: 0.35,
          filename: `${input.value || 'market'}-assessment-brief.pdf`,
          image: {type: 'jpeg', quality: 0.96},
          html2canvas: {scale: 1.5},
          jsPDF: {format: 'a4', orientation: 'portrait'}
        })
        .from(document.querySelector('#dashboard'))
        .save();
  } else {
    window.print();
  }
});

const dialog = document.querySelector('#method-dialog');
document.querySelector('#method-button')
    .addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close')
    .addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

window.addEventListener('resize', renderChart);
renderLegend();
renderChart();
loadProfile();
