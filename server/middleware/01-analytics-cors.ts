import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  const url = event.node.req.url || '';

  if (url.includes('/api/analytics/')) {
    event.node.res.setHeader('Access-Control-Allow-Origin', '*');
    event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (event.node.req.method === 'OPTIONS') {
      event.node.res.statusCode = 204;
      event.node.res.end();
      return;
    }

    return;
  }
}); 