# Market Assessment 0.0

A polished, static hackathon demo for an executive market-assessment product. The included profile analyzes Pemamek in the global shipbuilding welding and production automation market and proposes three greenfield growth hypotheses.

## Run locally

Use Node 22.5+ to run the frontend and API together. The app uses Node's built-in SQLite module, so no native database package installation is required:

```bash
cd market-assessment-0-0
npm start
```

Then open `http://localhost:8000`. The assessment endpoint is available at
`GET /api/assess?company=Pemamek` and accepts the aliases `pema`, `pemamek`,
and `pemamek oy`.

For a static-only presentation, `index.html` can still be opened directly in a browser.

## Demo flow

1. Enter `Pemamek` in the company field.
2. Press Enter or select **Run scan**.
3. The industry profile, market characteristics, scorecard, competitive line chart, greenfield opportunities, and strategic takeaway appear immediately.

## Assessment note

The 1–5 scores are directional analyst judgments based on public company materials linked in the dashboard. They are not audited market-share data or vendor-supplied ratings.

## Backend shape

- `lib/assessment.js` contains entity normalization, scoring, peer benchmarking, opportunity rules, and traceability metadata.
- `lib/database.js` owns the SQLite database at `data/market-assessment.sqlite`, including companies, scores, dimensions, sources, signals, and opportunities.
- `api/assess.js` is the Vercel-compatible serverless route.
- `api/health.js` and `api/signals.js` expose pipeline readiness and alert-ready market signals.
- `server.js` serves the static frontend and the same API locally without external dependencies.
- The API returns deterministic structured data with `fallback: true` when the presentation profile is served from the local evidence set.
