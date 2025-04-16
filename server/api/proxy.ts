import { defineEventHandler, getQuery, getRequestHeaders, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  // Configurer les méthodes HTTP autorisées
  if (event.method === 'OPTIONS') {
    return {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  const query = getQuery(event);
  const headers = getRequestHeaders(event);
  const method = event.method;
  const startTime = Date.now();

  // Récupérer l'URL cible depuis les paramètres
  const targetUrl = query.url as string;
  if (!targetUrl) {
    throw new Error('URL cible manquante');
  }

  try {
    // Préparer les headers pour la requête
    const requestHeaders = {
      ...headers,
      host: new URL(targetUrl).host,
      origin: new URL(targetUrl).origin,
      referer: targetUrl,
    };

    // Créer un nouvel objet headers sans les propriétés indésirables
    const filteredHeaders = Object.fromEntries(
      Object.entries(requestHeaders).filter(([key]) =>
        !['content-length', 'content-type', 'host', 'origin', 'referer'].includes(key)
      )
    );

    // Lire le body uniquement pour les méthodes qui en ont besoin
    let body;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await readBody(event);
        // Si le body est une chaîne, essayer de le parser en JSON
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            // Si ce n'est pas du JSON valide, garder la chaîne telle quelle
          }
        }
      } catch (e) {
        console.error('Erreur lecture body:', e);
        body = null;
      }
    }

    // Faire la requête vers l'API cible
    const response = await fetch(targetUrl, {
      method,
      headers: {
        ...filteredHeaders,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Récupérer le contenu de la réponse
    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    // Retourner la réponse simplifiée
    const responseData = {
      data: data
    };

    return responseData;
  } catch (error) {
    console.error('Erreur proxy:', error);
    return {
      status: 500,
      time: `${Date.now() - startTime}ms`,
      error: error.message
    };
  }
}); 