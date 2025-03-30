import { createError, defineEventHandler, getHeaders, readBody } from 'h3';
import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import { pool } from './db';

type QueryResult = [RowDataPacket[], FieldPacket[]];

interface PageView {
  url: string;
  title: string;
  timestamp: Date;
  userId: string;
  sessionId: string;
  deviceType: string;
  country: string;
  city: string;
  referrer: string;
  timeOnPage: number;
}

interface UserSession {
  userId: string;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  pages: string[];
  deviceType: string;
  country: string;
  city: string;
  referrer: string;
  isNewVisitor: boolean;
  hasConverted: boolean;
}

interface CountResult extends RowDataPacket {
  count: number;
}

interface AvgTimeResult extends RowDataPacket {
  avg_time: number;
}

interface TopPageResult extends RowDataPacket {
  url: string;
  title: string;
  views: number;
}

interface TrafficResult extends RowDataPacket {
  date: Date;
  count: number;
}

interface GeoResult extends RowDataPacket {
  country: string;
  city: string;
  count: number;
}

interface DeviceResult extends RowDataPacket {
  device_type: string;
  count: number;
}

interface BehaviorResult extends RowDataPacket {
  total_sessions: number;
  new_visitors: number;
  conversions: number;
  avg_time_on_site: number;
}

export default defineEventHandler(async (event) => {
  const method = event.method;
  console.log(`Requête ${method} vers /api/analytics`);

  let body;
  if (method === 'POST') {
    body = await readBody(event);

    if (!body || !body.type) {
      console.log('Requête POST sans données valides');
      return { success: false, message: 'Données invalides' };
    }

    console.log('Données reçues:', body.type);
  }

  if (method === 'POST' && body) {
    if (body.type === 'pageview') {
      const pageView: PageView = {
        url: body.url,
        title: body.title,
        timestamp: new Date(),
        userId: body.userId,
        sessionId: body.sessionId,
        deviceType: body.deviceType,
        country: body.country,
        city: body.city,
        referrer: body.referrer,
        timeOnPage: body.timeOnPage
      };

      try {
        const connection = await pool.getConnection();

        await connection.execute(
          `INSERT INTO page_views (url, title, timestamp, user_id, session_id, device_type, country, city, referrer, time_on_page)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pageView.url, pageView.title, pageView.timestamp, pageView.userId, pageView.sessionId,
          pageView.deviceType, pageView.country, pageView.city, pageView.referrer, pageView.timeOnPage]
        );

        const [existingSession] = await connection.execute<RowDataPacket[]>(
          'SELECT id FROM user_sessions WHERE session_id = ? AND user_id = ?',
          [pageView.sessionId, pageView.userId]
        );

        if (Array.isArray(existingSession) && existingSession.length === 0) {
          await connection.execute(
            `INSERT INTO user_sessions 
             (user_id, session_id, start_time, end_time, pages, device_type, country, city, referrer, is_new_visitor, has_converted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pageView.userId,
              pageView.sessionId,
              pageView.timestamp,
              pageView.timestamp,
              JSON.stringify([pageView.url]),
              pageView.deviceType,
              pageView.country,
              pageView.city,
              pageView.referrer,
              body.isNewVisitor ? 1 : 0,
              body.hasConverted ? 1 : 0
            ]
          );
        } else {
          await connection.execute(
            `UPDATE user_sessions 
             SET end_time = ?,
                 pages = JSON_ARRAY_APPEND(IF(JSON_VALID(pages), pages, JSON_ARRAY()), '$', ?),
                 time_on_site = TIMESTAMPDIFF(SECOND, start_time, ?),
                 has_converted = ? 
             WHERE session_id = ? AND user_id = ?`,
            [
              pageView.timestamp,
              pageView.url,
              pageView.timestamp,
              body.hasConverted ? 1 : 0,
              pageView.sessionId,
              pageView.userId
            ]
          );
        }

        connection.release();
        return { success: true };
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la vue:', error);
        throw createError({
          statusCode: 500,
          message: 'Erreur lors de l\'enregistrement de la vue'
        });
      }
    }
    else if (body.type === 'session') {
      try {
        const connection = await pool.getConnection();

        const startTime = new Date(body.startTime);
        const endTime = new Date(body.endTime);
        const timeOnSite = body.timeOnSite || Math.round((endTime.getTime() - startTime.getTime()) / 1000);

        const [existingSession] = await connection.execute<RowDataPacket[]>(
          'SELECT id FROM user_sessions WHERE session_id = ? AND user_id = ?',
          [body.sessionId, body.userId]
        );

        if (Array.isArray(existingSession) && existingSession.length === 0) {
          console.log('Insertion nouvelle session');
          await connection.execute(
            `INSERT INTO user_sessions 
             (user_id, session_id, start_time, end_time, pages, device_type, country, city, referrer, is_new_visitor, has_converted, time_on_site)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              body.userId,
              body.sessionId,
              startTime,
              endTime,
              JSON.stringify(body.pages || []),
              body.deviceType || 'unknown',
              body.country || 'unknown',
              body.city || 'unknown',
              body.referrer || '',
              body.isNewVisitor ? 1 : 0,
              body.hasConverted ? 1 : 0,
              timeOnSite
            ]
          );
          console.log('Session insérée avec time_on_site =', timeOnSite);
        } else {
          console.log('Mise à jour session existante');
          await connection.execute(
            `UPDATE user_sessions 
             SET end_time = ?,
                 pages = ?,
                 time_on_site = ?,
                 has_converted = ?
             WHERE session_id = ? AND user_id = ?`,
            [
              endTime,
              JSON.stringify(body.pages || []),
              timeOnSite,
              body.hasConverted ? 1 : 0,
              body.sessionId,
              body.userId
            ]
          );
          console.log('Session mise à jour avec time_on_site =', timeOnSite);
        }

        connection.release();
        return { success: true, message: 'Session traitée avec succès' };
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la session:', error);
        throw createError({
          statusCode: 500,
          message: 'Erreur lors de l\'enregistrement de la session'
        });
      }
    }
    else if (body.type === 'session_end') {
      try {
        const connection = await pool.getConnection();

        const [existingSession] = await connection.execute<RowDataPacket[]>(
          'SELECT id, start_time FROM user_sessions WHERE session_id = ? AND user_id = ?',
          [body.sessionId, body.userId || 'anonymous']
        );

        if (Array.isArray(existingSession) && existingSession.length > 0) {
          const sessionInfo = existingSession[0];
          const startTime = new Date(sessionInfo.start_time);
          const endTime = new Date();
          const timeOnSite = body.timeOnSite || Math.round((endTime.getTime() - startTime.getTime()) / 1000);

          console.log('Fin de session - temps sur site:', timeOnSite);

          await connection.execute(
            `UPDATE user_sessions 
             SET end_time = ?,
                 time_on_site = ?
             WHERE session_id = ? AND user_id = ?`,
            [
              endTime,
              timeOnSite,
              body.sessionId,
              body.userId || 'anonymous'
            ]
          );

          console.log('Session terminée et mise à jour avec succès');
        } else {
          console.log('Session non trouvée lors de la tentative de fin de session');
        }

        connection.release();
        return {
          success: true,
          message: 'Données de fin de session traitées avec succès'
        };
      } catch (error) {
        console.error('Erreur lors du traitement des données de fin de session:', error);
        throw createError({
          statusCode: 500,
          message: 'Erreur lors du traitement des données de fin de session'
        });
      }
    }
  }

  if (method === 'GET') {
    try {
      // Vérification de l'authentification
      const headers = getHeaders(event);
      const authHeader = headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          message: 'Non autorisé'
        };
      }

      // Récupération des données pour les derniers 30 jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateFilter = thirtyDaysAgo.toISOString().split('T')[0];

      // Visiteurs uniques et croissance
      const [uniqueVisitorsResult]: QueryResult = await pool.query(
        `SELECT 
          COUNT(DISTINCT user_id) as uniqueVisitors,
          (COUNT(DISTINCT user_id) / 
            (SELECT COUNT(DISTINCT user_id) FROM analytics_data 
             WHERE date BETWEEN DATE_SUB(?, INTERVAL 30 DAY) AND ?) - 1) * 100 as visitorGrowth
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter, dateFilter, dateFilter]
      );

      // Pages vues et moyenne par visite
      const [pageViewsResult]: QueryResult = await pool.query(
        `SELECT 
          COUNT(*) as pageViews,
          COUNT(*) / COUNT(DISTINCT session_id) as avgPagesPerVisit
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );

      // Temps moyen et taux de rebond
      const [timeAndBounceResult]: QueryResult = await pool.query(
        `SELECT 
          AVG(visit_duration) as avgTimeOnSite,
          SUM(is_bounce) / COUNT(DISTINCT session_id) * 100 as bounceRate
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );

      // Taux de conversion
      const [conversionResult]: QueryResult = await pool.query(
        `SELECT 
          SUM(is_conversion) / COUNT(DISTINCT session_id) * 100 as conversionRate
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );

      // Pages les plus visitées
      const [topPagesResult]: QueryResult = await pool.query(
        `SELECT 
          page_url as url, 
          page_title as title, 
          COUNT(*) as views 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY page_url, page_title
         ORDER BY views DESC
         LIMIT 5`,
        [dateFilter]
      );

      // Comportement des utilisateurs
      const [userBehaviorResult]: QueryResult = await pool.query(
        `SELECT
           CASE 
             WHEN is_new_visitor = 1 THEN 'Nouveau visiteur'
             ELSE 'Retour'
           END as type,
           COUNT(DISTINCT session_id) as count,
           COUNT(DISTINCT session_id) / (SELECT COUNT(DISTINCT session_id) FROM analytics_data WHERE date >= ?) * 100 as percentage
         FROM analytics_data
         WHERE date >= ?
         GROUP BY is_new_visitor
         
         UNION ALL
         
         SELECT
           'Conversion' as type,
           COUNT(DISTINCT session_id) as count,
           COUNT(DISTINCT session_id) / (SELECT COUNT(DISTINCT session_id) FROM analytics_data WHERE date >= ?) * 100 as percentage
         FROM analytics_data
         WHERE date >= ? AND is_conversion = 1
         
         UNION ALL
         
         SELECT
           'Abandon' as type,
           COUNT(DISTINCT session_id) as count,
           COUNT(DISTINCT session_id) / (SELECT COUNT(DISTINCT session_id) FROM analytics_data WHERE date >= ?) * 100 as percentage
         FROM analytics_data
         WHERE date >= ? AND is_bounce = 1`,
        [dateFilter, dateFilter, dateFilter, dateFilter, dateFilter, dateFilter]
      );

      // Trafic par jour
      const [trafficResult]: QueryResult = await pool.query(
        `SELECT 
          date, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY date 
         ORDER BY date`,
        [dateFilter]
      );

      // Répartition géographique
      const [geoResult]: QueryResult = await pool.query(
        `SELECT 
          country, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY country 
         ORDER BY count DESC
         LIMIT 5`,
        [dateFilter]
      );

      // Appareils utilisés
      const [deviceResult]: QueryResult = await pool.query(
        `SELECT 
          device_type as deviceType, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY device_type`,
        [dateFilter]
      );

      return {
        uniqueVisitors: uniqueVisitorsResult[0]?.uniqueVisitors || 0,
        visitorGrowth: Number(uniqueVisitorsResult[0]?.visitorGrowth || 0).toFixed(2),
        pageViews: pageViewsResult[0]?.pageViews || 0,
        avgPagesPerVisit: Number(pageViewsResult[0]?.avgPagesPerVisit || 0).toFixed(2),
        avgTimeOnSite: Number(timeAndBounceResult[0]?.avgTimeOnSite || 0).toFixed(0),
        bounceRate: Number(timeAndBounceResult[0]?.bounceRate || 0).toFixed(1),
        conversionRate: Number(conversionResult[0]?.conversionRate || 0).toFixed(1),
        topPages: topPagesResult,
        userBehavior: userBehaviorResult,
        traffic: trafficResult,
        geographicDistribution: geoResult,
        deviceUsage: deviceResult
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données analytiques:', error);
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la récupération des données analytiques'
      };
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Méthode non autorisée'
  });
}); 