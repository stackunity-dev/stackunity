import { createError, defineEventHandler } from 'h3';
import { pool } from './db';

export default defineEventHandler(async (event) => {
  // Vérifier que cette API ne soit pas accessible en production
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 403,
      message: 'Cette API est désactivée en production'
    });
  }

  try {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    // Nettoyer les tables existantes
    await pool.execute('TRUNCATE TABLE marketing_metrics');
    await pool.execute('TRUNCATE TABLE purchase_journey');
    await pool.execute('TRUNCATE TABLE premium_features');
    await pool.execute('TRUNCATE TABLE daily_subscriptions');
    await pool.execute('TRUNCATE TABLE regional_users');
    await pool.execute('TRUNCATE TABLE click_rates');

    // Générer des données pour les 30 derniers jours
    for (let i = 0; i < 30; i++) {
      const date = new Date(year, month, today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];

      // Données aléatoires avec tendance croissante (valeurs plus élevées pour les dates récentes)
      const factor = 1 + ((30 - i) / 30);
      const checkoutVisits = Math.floor(500 * factor * (0.9 + Math.random() * 0.2));
      const premiumUsers = Math.floor(200 * factor * (0.9 + Math.random() * 0.2));
      const totalUsers = Math.floor(1400 * factor * (0.9 + Math.random() * 0.2));
      const conversionRate = 10 + (i / 3) + (Math.random() * 5);

      // Insérer les métriques marketing
      await pool.execute(
        `INSERT INTO marketing_metrics (metric_date, checkout_visits, premium_users, total_users, conversion_rate)
         VALUES (?, ?, ?, ?, ?)`,
        [formattedDate, checkoutVisits, premiumUsers, totalUsers, conversionRate]
      );

      // Insérer le parcours d'achat
      const stages = [
        { name: 'Visite du site', dropoff: 0 },
        { name: 'Visite page tarifs', dropoff: 30 + Math.floor(Math.random() * 10) },
        { name: 'Ajout au panier', dropoff: 20 + Math.floor(Math.random() * 10) },
        { name: 'Checkout', dropoff: 15 + Math.floor(Math.random() * 5) },
        { name: 'Paiement complété', dropoff: 50 + Math.floor(Math.random() * 15) }
      ];

      let previousCount = totalUsers;
      for (const stage of stages) {
        const dropoff = stage.dropoff;
        const count = stage.name === 'Visite du site'
          ? previousCount
          : Math.floor(previousCount * (1 - (dropoff / 100)));

        await pool.execute(
          `INSERT INTO purchase_journey (metric_date, stage, count, dropoff)
           VALUES (?, ?, ?, ?)`,
          [formattedDate, stage.name, count, dropoff]
        );

        previousCount = count;
      }

      // Insérer les fonctionnalités premium
      const features = [
        { name: 'SQL Generator', usage: 80 + Math.floor(Math.random() * 15) },
        { name: 'SEO Audit', usage: 60 + Math.floor(Math.random() * 15) },
        { name: 'Robots & Schema', usage: 40 + Math.floor(Math.random() * 15) },
        { name: 'Studio Pro', usage: 70 + Math.floor(Math.random() * 15) }
      ];

      for (const feature of features) {
        const subscribers = Math.floor(premiumUsers * (feature.usage / 100));
        const revenue = subscribers * 20;

        await pool.execute(
          `INSERT INTO premium_features (metric_date, name, usage_percent, subscribers, revenue)
           VALUES (?, ?, ?, ?, ?)`,
          [formattedDate, feature.name, feature.usage, subscribers, revenue]
        );
      }

      // Insérer les abonnements quotidiens
      const subscriptionCount = Math.floor(5 + (Math.random() * 10) + (i % 7 === 0 ? 5 : 0));
      await pool.execute(
        `INSERT INTO daily_subscriptions (subscription_date, count)
         VALUES (?, ?)`,
        [formattedDate, subscriptionCount]
      );

      // Insérer les utilisateurs par région
      const regions = [
        { name: 'France', percentage: 35 + Math.floor(Math.random() * 10) },
        { name: 'États-Unis', percentage: 25 + Math.floor(Math.random() * 10) },
        { name: 'Allemagne', percentage: 15 + Math.floor(Math.random() * 10) },
        { name: 'Canada', percentage: 10 + Math.floor(Math.random() * 10) }
      ];

      let remainingPercentage = 100;
      for (const region of regions) {
        remainingPercentage -= region.percentage;
        const userCount = Math.floor(totalUsers * (region.percentage / 100));

        await pool.execute(
          `INSERT INTO regional_users (metric_date, region_name, user_count)
           VALUES (?, ?, ?)`,
          [formattedDate, region.name, userCount]
        );
      }

      // Ajouter "Autres" pour le reste
      if (remainingPercentage > 0) {
        const otherUserCount = Math.floor(totalUsers * (remainingPercentage / 100));
        await pool.execute(
          `INSERT INTO regional_users (metric_date, region_name, user_count)
           VALUES (?, ?, ?)`,
          [formattedDate, 'Autres', otherUserCount]
        );
      }

      // Insérer les taux de clic par page
      const pages = [
        { name: "Page d'accueil", baseRate: 90 },
        { name: "Produits", baseRate: 75 },
        { name: "Tarifs", baseRate: 60 },
        { name: "Checkout", baseRate: 40 },
        { name: "Paiement", baseRate: 15 }
      ];

      for (const page of pages) {
        const clickRate = page.baseRate + Math.floor(Math.random() * 10);

        await pool.execute(
          `INSERT INTO click_rates (metric_date, page_name, click_rate)
           VALUES (?, ?, ?)`,
          [formattedDate, page.name, clickRate]
        );
      }
    }

    return {
      success: true,
      message: 'Données marketing générées avec succès',
      dataCount: {
        days: 30,
        metrics: 30,
        journeySteps: 30 * 5,
        features: 30 * 4,
        subscriptions: 30,
        regions: 30 * 5,
        clickRates: 30 * 5
      }
    };
  } catch (error) {
    console.error('Erreur lors de la génération des données marketing:', error);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la génération des données marketing'
    });
  }
}); 