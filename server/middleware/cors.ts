import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  const origin = event.node.req.headers.origin || '';

  // Définir une liste d'origines autorisées
  const allowedOrigins = [
    'https://stackunity.tech',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ];

  // Vérifier si l'origine est dans la liste des origines autorisées
  if (allowedOrigins.includes(origin)) {
    event.node.res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Si l'origine n'est pas dans la liste, utiliser * pour les requêtes sans credentials
    event.node.res.setHeader('Access-Control-Allow-Origin', '*');
  }

  event.node.res.setHeader('Access-Control-Allow-Credentials', 'true');
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.end();
    return;
  }
});