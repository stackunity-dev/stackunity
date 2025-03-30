import { defineEventHandler } from 'h3';
import { pool } from './db';

// Fonction pour générer des données aléatoires
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

// Génère une date aléatoire dans les 30 derniers jours
function getRandomDate(daysBack = 30): Date {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(0, daysBack));
  return date;
}

export default defineEventHandler(async (event) => {
  try {
    // Paramètres pour la génération de données
    const userCount = 500;
    const sessionsPerUser = 3;
    const pagesPerSession = 4;
    const deviceTypes = ['desktop', 'mobile', 'tablet'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const countries = ['France', 'USA', 'Germany', 'UK', 'Spain', 'Italy', 'Canada', 'Japan'];
    const regions = ['Île-de-France', 'California', 'Bavaria', 'London', 'Catalonia', 'Lombardy', 'Ontario', 'Tokyo'];

    const pages = [
      { url: '/', title: 'Accueil' },
      { url: '/produits', title: 'Nos Produits' },
      { url: '/services', title: 'Services' },
      { url: '/blog', title: 'Blog' },
      { url: '/contact', title: 'Contact' },
      { url: '/a-propos', title: 'À Propos' },
      { url: '/inscription', title: 'Inscription' },
      { url: '/connexion', title: 'Connexion' },
      { url: '/checkout', title: 'Paiement' },
      { url: '/profil', title: 'Profil Utilisateur' }
    ];

    // Vider la table existante
    await pool.query('TRUNCATE TABLE analytics_data');

    // Générer les données
    let insertedCount = 0;

    // Pour chaque utilisateur
    for (let i = 1; i <= userCount; i++) {
      const userId = `user_${i}`;
      const countryIndex = getRandomInt(0, countries.length - 1);

      // Pour chaque session de cet utilisateur
      for (let j = 1; j <= getRandomInt(1, sessionsPerUser); j++) {
        const sessionId = `session_${i}_${j}`;
        const date = getRandomDate();
        const deviceType = getRandomItem(deviceTypes);
        const browser = getRandomItem(browsers);
        const country = countries[countryIndex];
        const region = regions[countryIndex];
        const isNewVisitor = j === 1 ? true : false;

        // Probabilité plus élevée d'abandon si c'est un nouveau visiteur
        const isBounce = isNewVisitor ? getRandomBoolean(0.3) : getRandomBoolean(0.1);

        // Si c'est un abandon, on ne visite qu'une seule page
        const pageCount = isBounce ? 1 : getRandomInt(1, pagesPerSession);

        // Déterminer si la session aboutit à une conversion (plus probable si plusieurs pages)
        const isConversion = pageCount > 2 ? getRandomBoolean(0.4) : getRandomBoolean(0.05);

        // Générer les pages visitées dans cette session
        const visitedPages = [];
        let usedPageIndices = new Set<number>();

        for (let k = 0; k < pageCount; k++) {
          let pageIndex;
          // Assurer que nous ne visitons pas la même page deux fois dans une session
          do {
            pageIndex = getRandomInt(0, pages.length - 1);
          } while (usedPageIndices.has(pageIndex));

          usedPageIndices.add(pageIndex);
          visitedPages.push(pages[pageIndex]);
        }

        // Pour chaque page visitée dans cette session
        for (let k = 0; k < visitedPages.length; k++) {
          const page = visitedPages[k];
          const visitDuration = getRandomInt(5, 300); // 5 à 300 secondes
          const referrerUrl = k === 0 ? 'https://www.google.com' : null;

          await pool.query(
            `INSERT INTO analytics_data 
             (date, user_id, session_id, page_url, page_title, visit_duration, 
              device_type, browser, country, region, is_new_visitor, is_bounce, is_conversion, referrer_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              date.toISOString().split('T')[0],
              userId,
              sessionId,
              page.url,
              page.title,
              visitDuration,
              deviceType,
              browser,
              country,
              region,
              isNewVisitor,
              isBounce,
              isConversion,
              referrerUrl
            ]
          );

          insertedCount++;
        }
      }
    }

    return {
      success: true,
      message: `${insertedCount} enregistrements analytiques de test générés avec succès`
    };
  } catch (error) {
    console.error('Erreur lors de la génération des données de test:', error);
    return {
      success: false,
      message: 'Erreur lors de la génération des données de test',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}); 