globalThis.__timing__.logStart('Load chunks/routes/api/seed-analytics-data');import { c as defineEventHandler, p as pool } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'node:url';
import 'jsonwebtoken';
import 'sqlstring';
import 'net';
import 'tls';
import 'timers';
import 'events';
import 'stream';
import 'denque';
import 'lru.min';
import 'buffer';
import 'long';
import 'iconv-lite';
import 'process';
import 'crypto';
import 'zlib';
import 'seq-queue';
import 'generate-function';
import 'url';
import 'aws-ssl-profiles';
import 'named-placeholders';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getRandomBoolean(probability = 0.5) {
  return Math.random() < probability;
}
function getRandomDate(daysBack = 30) {
  const date = /* @__PURE__ */ new Date();
  date.setDate(date.getDate() - getRandomInt(0, daysBack));
  return date;
}
const seedAnalyticsData = defineEventHandler(async (event) => {
  try {
    const userCount = 500;
    const sessionsPerUser = 3;
    const pagesPerSession = 4;
    const deviceTypes = ["desktop", "mobile", "tablet"];
    const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
    const countries = ["France", "USA", "Germany", "UK", "Spain", "Italy", "Canada", "Japan"];
    const regions = ["\xCEle-de-France", "California", "Bavaria", "London", "Catalonia", "Lombardy", "Ontario", "Tokyo"];
    const pages = [
      { url: "/", title: "Accueil" },
      { url: "/produits", title: "Nos Produits" },
      { url: "/services", title: "Services" },
      { url: "/blog", title: "Blog" },
      { url: "/contact", title: "Contact" },
      { url: "/a-propos", title: "\xC0 Propos" },
      { url: "/inscription", title: "Inscription" },
      { url: "/connexion", title: "Connexion" },
      { url: "/checkout", title: "Paiement" },
      { url: "/profil", title: "Profil Utilisateur" }
    ];
    await pool.query("TRUNCATE TABLE analytics_data");
    let insertedCount = 0;
    for (let i = 1; i <= userCount; i++) {
      const userId = `user_${i}`;
      const countryIndex = getRandomInt(0, countries.length - 1);
      for (let j = 1; j <= getRandomInt(1, sessionsPerUser); j++) {
        const sessionId = `session_${i}_${j}`;
        const date = getRandomDate();
        const deviceType = getRandomItem(deviceTypes);
        const browser = getRandomItem(browsers);
        const country = countries[countryIndex];
        const region = regions[countryIndex];
        const isNewVisitor = j === 1 ? true : false;
        const isBounce = isNewVisitor ? getRandomBoolean(0.3) : getRandomBoolean(0.1);
        const pageCount = isBounce ? 1 : getRandomInt(1, pagesPerSession);
        const isConversion = pageCount > 2 ? getRandomBoolean(0.4) : getRandomBoolean(0.05);
        const visitedPages = [];
        let usedPageIndices = /* @__PURE__ */ new Set();
        for (let k = 0; k < pageCount; k++) {
          let pageIndex;
          do {
            pageIndex = getRandomInt(0, pages.length - 1);
          } while (usedPageIndices.has(pageIndex));
          usedPageIndices.add(pageIndex);
          visitedPages.push(pages[pageIndex]);
        }
        for (let k = 0; k < visitedPages.length; k++) {
          const page = visitedPages[k];
          const visitDuration = getRandomInt(5, 300);
          const referrerUrl = k === 0 ? "https://www.google.com" : null;
          await pool.query(
            `INSERT INTO analytics_data 
             (date, user_id, session_id, page_url, page_title, visit_duration, 
              device_type, browser, country, region, is_new_visitor, is_bounce, is_conversion, referrer_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              date.toISOString().split("T")[0],
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
      message: `${insertedCount} enregistrements analytiques de test g\xE9n\xE9r\xE9s avec succ\xE8s`
    };
  } catch (error) {
    console.error("Erreur lors de la g\xE9n\xE9ration des donn\xE9es de test:", error);
    return {
      success: false,
      message: "Erreur lors de la g\xE9n\xE9ration des donn\xE9es de test",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});

export { seedAnalyticsData as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/seed-analytics-data');
