import { defineEventHandler, getQuery, H3Event, readBody } from 'h3';
import { generateSitemap } from './website-analyzer';

interface SitemapRequest {
  url: string;
  report: {
    visitedURLs: string[];
    seoResults: Record<string, any>;
  };
}

export default defineEventHandler(async (event: H3Event) => {
  try {

    const body = await readBody(event) as SitemapRequest;
    const query = getQuery(event);
    const isPreview = query.preview === 'true';

    if (!body.url || !body.report) {
      return {
        statusCode: 400,
        body: 'URL et rapport requis'
      };
    }

    const urls = body.report.visitedURLs || [];
    if (urls.length === 0) {
      return {
        statusCode: 400,
        body: 'Aucune URL trouvée dans le rapport'
      };
    }

    const imagesData = body.report.seoResults || {};

    const xml = generateSitemap(urls, imagesData);

    if (isPreview) {
      return xml;
    }

    event.node.res.setHeader('Content-Type', 'application/xml');
    event.node.res.setHeader('Content-Disposition', `attachment; filename="sitemap-${new Date().toISOString().split('T')[0]}.xml"`);

    return xml;
  } catch (error: any) {
    console.error('Erreur lors de la génération du sitemap:', error);

    return {
      statusCode: 500,
      body: `Erreur lors de la génération du sitemap: ${error.message}`
    };
  }
}); 