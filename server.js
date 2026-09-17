const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {buildAssessment} = require('./lib/assessment');
const {getHealth, getSignals} = require('./lib/intelligence/monitoring');

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json'
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(payload));
}

function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === '/api/assess') {
    const assessment = buildAssessment(url.searchParams.get('company'));
    if (!assessment)
      return sendJson(response, 404, {
        error: 'Profile not yet available',
        code: 'ENTITY_NOT_FOUND',
        fallback: true
      });
    return sendJson(response, 200, {...assessment, fallback: true});
  }
  if (url.pathname === '/api/health')
    return sendJson(response, 200, getHealth());
  if (url.pathname === '/api/signals')
    return sendJson(response, 200, getSignals());

  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.resolve(root, `.${requested}`);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) ||
      fs.statSync(filePath).isDirectory()) {
    response.writeHead(404);
    return response.end('Not found');
  }
  response.writeHead(200, {
    'Content-Type':
        contentTypes[path.extname(filePath)] || 'application/octet-stream'
  });
  fs.createReadStream(filePath).pipe(response);
}

if (!process.env.VERCEL) {
  const server = http.createServer(handleRequest);
  server.listen(
      port,
      () =>
          console.log(`Market Assessment running at http://localhost:${port}`));
}

module.exports = handleRequest;
