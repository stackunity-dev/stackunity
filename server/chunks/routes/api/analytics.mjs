import { c as defineEventHandler, r as readBody, p as pool, e as createError, g as getHeaders } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';

const analytics = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const method = event.method;
  console.log(`Requ\xEAte ${method} vers /api/analytics`);
  let body;
  if (method === "POST") {
    body = await readBody(event);
    if (!body || !body.type) {
      console.log("Requ\xEAte POST sans donn\xE9es valides");
      return { success: false, message: "Donn\xE9es invalides" };
    }
    console.log("Donn\xE9es re\xE7ues:", body.type);
  }
  if (method === "POST" && body) {
    if (body.type === "pageview") {
      const pageView = {
        url: body.url,
        title: body.title,
        timestamp: /* @__PURE__ */ new Date(),
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
          [
            pageView.url,
            pageView.title,
            pageView.timestamp,
            pageView.userId,
            pageView.sessionId,
            pageView.deviceType,
            pageView.country,
            pageView.city,
            pageView.referrer,
            pageView.timeOnPage
          ]
        );
        const [existingSession] = await connection.execute(
          "SELECT id FROM user_sessions WHERE session_id = ? AND user_id = ?",
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
        console.error("Erreur lors de l'enregistrement de la vue:", error);
        throw createError({
          statusCode: 500,
          message: "Erreur lors de l'enregistrement de la vue"
        });
      }
    } else if (body.type === "session") {
      try {
        const connection = await pool.getConnection();
        const startTime = new Date(body.startTime);
        const endTime = new Date(body.endTime);
        const timeOnSite = body.timeOnSite || Math.round((endTime.getTime() - startTime.getTime()) / 1e3);
        const [existingSession] = await connection.execute(
          "SELECT id FROM user_sessions WHERE session_id = ? AND user_id = ?",
          [body.sessionId, body.userId]
        );
        if (Array.isArray(existingSession) && existingSession.length === 0) {
          console.log("Insertion nouvelle session");
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
              body.deviceType || "unknown",
              body.country || "unknown",
              body.city || "unknown",
              body.referrer || "",
              body.isNewVisitor ? 1 : 0,
              body.hasConverted ? 1 : 0,
              timeOnSite
            ]
          );
          console.log("Session ins\xE9r\xE9e avec time_on_site =", timeOnSite);
        } else {
          console.log("Mise \xE0 jour session existante");
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
          console.log("Session mise \xE0 jour avec time_on_site =", timeOnSite);
        }
        connection.release();
        return { success: true, message: "Session trait\xE9e avec succ\xE8s" };
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la session:", error);
        throw createError({
          statusCode: 500,
          message: "Erreur lors de l'enregistrement de la session"
        });
      }
    } else if (body.type === "session_end") {
      try {
        const connection = await pool.getConnection();
        const [existingSession] = await connection.execute(
          "SELECT id, start_time FROM user_sessions WHERE session_id = ? AND user_id = ?",
          [body.sessionId, body.userId || "anonymous"]
        );
        if (Array.isArray(existingSession) && existingSession.length > 0) {
          const sessionInfo = existingSession[0];
          const startTime = new Date(sessionInfo.start_time);
          const endTime = /* @__PURE__ */ new Date();
          const timeOnSite = body.timeOnSite || Math.round((endTime.getTime() - startTime.getTime()) / 1e3);
          console.log("Fin de session - temps sur site:", timeOnSite);
          await connection.execute(
            `UPDATE user_sessions 
             SET end_time = ?,
                 time_on_site = ?
             WHERE session_id = ? AND user_id = ?`,
            [
              endTime,
              timeOnSite,
              body.sessionId,
              body.userId || "anonymous"
            ]
          );
          console.log("Session termin\xE9e et mise \xE0 jour avec succ\xE8s");
        } else {
          console.log("Session non trouv\xE9e lors de la tentative de fin de session");
        }
        connection.release();
        return {
          success: true,
          message: "Donn\xE9es de fin de session trait\xE9es avec succ\xE8s"
        };
      } catch (error) {
        console.error("Erreur lors du traitement des donn\xE9es de fin de session:", error);
        throw createError({
          statusCode: 500,
          message: "Erreur lors du traitement des donn\xE9es de fin de session"
        });
      }
    }
  }
  if (method === "GET") {
    try {
      const headers = getHeaders(event);
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
          statusCode: 401,
          message: "Non autoris\xE9"
        };
      }
      const thirtyDaysAgo = /* @__PURE__ */ new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateFilter = thirtyDaysAgo.toISOString().split("T")[0];
      const [uniqueVisitorsResult] = await pool.query(
        `SELECT 
          COUNT(DISTINCT user_id) as uniqueVisitors,
          (COUNT(DISTINCT user_id) / 
            (SELECT COUNT(DISTINCT user_id) FROM analytics_data 
             WHERE date BETWEEN DATE_SUB(?, INTERVAL 30 DAY) AND ?) - 1) * 100 as visitorGrowth
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter, dateFilter, dateFilter]
      );
      const [pageViewsResult] = await pool.query(
        `SELECT 
          COUNT(*) as pageViews,
          COUNT(*) / COUNT(DISTINCT session_id) as avgPagesPerVisit
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );
      const [timeAndBounceResult] = await pool.query(
        `SELECT 
          AVG(visit_duration) as avgTimeOnSite,
          SUM(is_bounce) / COUNT(DISTINCT session_id) * 100 as bounceRate
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );
      const [conversionResult] = await pool.query(
        `SELECT 
          SUM(is_conversion) / COUNT(DISTINCT session_id) * 100 as conversionRate
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );
      const [topPagesResult] = await pool.query(
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
      const [userBehaviorResult] = await pool.query(
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
      const [trafficResult] = await pool.query(
        `SELECT 
          date, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY date 
         ORDER BY date`,
        [dateFilter]
      );
      const [geoResult] = await pool.query(
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
      const [deviceResult] = await pool.query(
        `SELECT 
          device_type as deviceType, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY device_type`,
        [dateFilter]
      );
      return {
        uniqueVisitors: ((_a = uniqueVisitorsResult[0]) == null ? void 0 : _a.uniqueVisitors) || 0,
        visitorGrowth: Number(((_b = uniqueVisitorsResult[0]) == null ? void 0 : _b.visitorGrowth) || 0).toFixed(2),
        pageViews: ((_c = pageViewsResult[0]) == null ? void 0 : _c.pageViews) || 0,
        avgPagesPerVisit: Number(((_d = pageViewsResult[0]) == null ? void 0 : _d.avgPagesPerVisit) || 0).toFixed(2),
        avgTimeOnSite: Number(((_e = timeAndBounceResult[0]) == null ? void 0 : _e.avgTimeOnSite) || 0).toFixed(0),
        bounceRate: Number(((_f = timeAndBounceResult[0]) == null ? void 0 : _f.bounceRate) || 0).toFixed(1),
        conversionRate: Number(((_g = conversionResult[0]) == null ? void 0 : _g.conversionRate) || 0).toFixed(1),
        topPages: topPagesResult,
        userBehavior: userBehaviorResult,
        traffic: trafficResult,
        geographicDistribution: geoResult,
        deviceUsage: deviceResult
      };
    } catch (error) {
      console.error("Erreur lors de la r\xE9cup\xE9ration des donn\xE9es analytiques:", error);
      return {
        statusCode: 500,
        message: "Erreur serveur lors de la r\xE9cup\xE9ration des donn\xE9es analytiques"
      };
    }
  }
  throw createError({
    statusCode: 405,
    message: "M\xE9thode non autoris\xE9e"
  });
});

export { analytics as default };
//# sourceMappingURL=analytics.mjs.map
