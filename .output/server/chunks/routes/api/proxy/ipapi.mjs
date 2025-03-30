globalThis.__timing__.logStart('Load chunks/routes/api/proxy/ipapi');import { c as defineEventHandler, e as createError } from '../../../_/nitro.mjs';
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

const cache = /* @__PURE__ */ new Map();
const CACHE_TTL = 60 * 60 * 1e3;
const ipapi = defineEventHandler(async (event) => {
  try {
    const clientIP = event.req.headers["x-forwarded-for"] || event.req.socket.remoteAddress || "127.0.0.1";
    const ip = Array.isArray(clientIP) ? clientIP[0] : String(clientIP).split(",")[0].trim();
    const now = Date.now();
    const cachedResult = cache.get(ip);
    if (cachedResult && now - cachedResult.timestamp < CACHE_TTL) {
      return cachedResult.data;
    }
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      console.error(`Erreur API ipapi: ${response.status} - ${response.statusText}`);
      throw createError({
        statusCode: response.status,
        statusMessage: "Erreur lors de la r\xE9cup\xE9ration des donn\xE9es de localisation"
      });
    }
    const data = await response.json();
    cache.set(ip, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error("Erreur proxy ipapi:", error);
    return {
      country_name: "Unknown",
      city: "Unknown",
      ip: "Unknown",
      error: true
    };
  }
});

export { ipapi as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/proxy/ipapi');
