import { pool } from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { name, url, analyzisUrls, sitemapContent, userId } = await readBody(event);

  try {
    const result = await pool.execute('UPDATE website_data SET website_name = ?, main_url = ?, all_urls = ?, generated_sitemap = ? WHERE user_id = ?', [name, url, analyzisUrls, sitemapContent, userId]);
    return {
      success: true,
      message: 'Données mises à jour avec succès',
      data: result
    };
  } catch (error) {
    console.error('Erreur lors de l\'opération :', error);
    return {
      success: false,
      error: 'Erreur lors de l\'opération sur les données du site web'
    };
  }
});
