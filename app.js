const profile = {
  company: "Pemamek",
  industry: "Shipbuilding welding & production automation",
  description:
    "Turnkey systems for heavy steel fabrication—from part preparation and panel lines to adaptive robotic welding and production software.",
  characteristics: [
    "High-capex projects",
    "Long sales cycles",
    "Engineering-led buying",
    "Global service critical",
    "Skilled-labor pressure",
  ],
};

const dimensions = [
  ["Turnkey yard", "scope"],
  ["Heavy-weld", "process depth"],
  ["Adaptive", "robotics"],
  ["Digital", "thread"],
  ["Custom", "engineering"],
  ["Modular", "scale-up"],
  ["Global", "service"],
  ["Shipyard", "proof"],
];

const series = [
  {
    name: "Pemamek",
    color: "#0d6b63",
    values: [5.0, 4.8, 4.5, 4.6, 4.8, 4.7, 4.2, 4.8],
    primary: true,
  },
  {
    name: "KRANENDONK",
    color: "#e9854f",
    values: [4.4, 4.2, 4.8, 4.8, 4.6, 4.6, 3.5, 4.4],
  },
  {
    name: "Inrotech",
    color: "#5a76d6",
    values: [3.4, 4.3, 5.0, 3.8, 4.0, 4.1, 3.2, 4.1],
  },
  {
    name: "ESAB",
    color: "#9a8d75",
    values: [3.6, 4.8, 4.2, 4.7, 4.0, 4.5, 5.0, 4.5],
  },
];

const hiddenSeries = new Set();
const svg = document.querySelector("#comparison-chart");
const legend = document.querySelector("#legend");
const tooltip = document.querySelector("#chart-tooltip");
const dashboard = document.querySelector("#dashboard");
const emptyState = document.querySelector("#empty-state");
const input = document.querySelector("#company-input");

function svgNode(tag, attrs = {}, text = "") {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  if (text) node.textContent = text;
  return node;
}

function renderLegend() {
  legend.innerHTML = "";
  series.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-pressed", String(!hiddenSeries.has(item.name)));
    button.innerHTML = `<i style="background:${item.color}"></i>${item.name}`;
    button.classList.toggle("off", hiddenSeries.has(item.name));
    button.addEventListener("click", () => {
      hiddenSeries.has(item.name) ? hiddenSeries.delete(item.name) : hiddenSeries.add(item.name);
      renderLegend();
      renderChart();
    });
    legend.append(button);
  });
}

function renderChart() {
  const width = Math.max(svg.clientWidth || 900, 760);
  const height = svg.clientHeight || 390;
  const margin = { top: 18, right: 18, bottom: 68, left: 42 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (index) => margin.left + (index * plotWidth) / (dimensions.length - 1);
  const y = (value) => margin.top + ((5 - value) / 4) * plotHeight;

  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  for (let value = 1; value <= 5; value += 1) {
    const gridY = y(value);
    svg.append(svgNode("line", { x1: margin.left, x2: width - margin.right, y1: gridY, y2: gridY, class: "chart-grid" }));
    svg.append(svgNode("text", { x: margin.left - 16, y: gridY + 4, "text-anchor": "middle", class: "chart-axis-label" }, value));
  }

  dimensions.forEach((parts, index) => {
    const label = svgNode("text", { x: x(index), y: height - 34, "text-anchor": "middle", class: "chart-x-label" });
    label.append(svgNode("tspan", { x: x(index), dy: 0 }, parts[0]));
    label.append(svgNode("tspan", { x: x(index), dy: 13 }, parts[1]));
    svg.append(label);
  });

  series.forEach((item) => {
    if (hiddenSeries.has(item.name)) return;
    const pathData = item.values.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`).join(" ");
    svg.append(svgNode("path", {
      d: pathData,
      stroke: item.color,
      class: `chart-series${item.primary ? " primary" : ""}`,
    }));

    item.values.forEach((value, index) => {
      const group = svgNode("g");
      group.append(svgNode("circle", {
        cx: x(index), cy: y(value), r: item.primary ? 4.5 : 3.5,
        fill: item.primary ? item.color : "#fffdf8", stroke: item.color, class: "chart-point",
      }));
      const hit = svgNode("circle", { cx: x(index), cy: y(value), r: 12, class: "chart-hit" });
      hit.addEventListener("mouseenter", () => showTooltip(item, value, index, x(index), y(value), width));
      hit.addEventListener("mouseleave", hideTooltip);
      group.append(hit);
      svg.append(group);
    });
  });
}

function showTooltip(item, value, index, pointX, pointY, chartWidth) {
  tooltip.innerHTML = `<strong>${item.name} · ${value.toFixed(1)}</strong><span>${dimensions[index].join(" ")}</span>`;
  tooltip.style.display = "block";
  const left = pointX > chartWidth - 175 ? pointX - 160 : pointX + 12;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${Math.max(pointY - 18, 0)}px`;
}

function hideTooltip() {
  tooltip.style.display = "none";
}

function loadProfile() {
  const value = input.value.trim();
  const isPemamek = /^(pema|pemamek|pemamek oy)$/i.test(value);

  if (!isPemamek) {
    dashboard.hidden = true;
    emptyState.hidden = false;
    return;
  }

  input.value = profile.company;
  document.querySelectorAll("[data-company]").forEach((node) => { node.textContent = profile.company; });
  document.querySelector("#industry-name").textContent = profile.industry;
  document.querySelector("#industry-description").textContent = profile.description;
  document.querySelector("#characteristic-list").innerHTML = profile.characteristics.map((item) => `<span>${item}</span>`).join("");
  dashboard.hidden = false;
  emptyState.hidden = true;
  dashboard.style.animation = "none";
  requestAnimationFrame(() => {
    dashboard.style.animation = "";
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  renderChart();
}

document.querySelector("#company-form").addEventListener("submit", (event) => {
  event.preventDefault();
  loadProfile();
});

document.querySelector("#load-demo").addEventListener("click", () => {
  input.value = "Pemamek";
  loadProfile();
});

const dialog = document.querySelector("#method-dialog");
document.querySelector("#method-button").addEventListener("click", () => dialog.showModal());
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

window.addEventListener("resize", renderChart);
renderLegend();
renderChart();
