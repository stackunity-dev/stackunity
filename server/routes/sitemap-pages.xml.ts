import fs from 'fs';
import { defineEventHandler } from 'h3';
import path from 'path';

export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
  event.node.res.setHeader('Cache-Control', 'max-age=3600, public');

  const filePath = path.resolve(process.cwd(), 'public', 'sitemap-pages.xml');

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Erreur lors de la lecture du sitemap:', error);
    event.node.res.statusCode = 404;
    return 'Sitemap not found';
  }
}); 