globalThis.__timing__.logStart('Load chunks/routes/api/newsletter/update-stats');import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
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

const updateStats = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Mise \xE0 jour des statistiques:", body);
    if (!body.action || !body.name) {
      return {
        success: false,
        message: "Donn\xE9es manquantes pour la mise \xE0 jour des statistiques"
      };
    }
    if (body.action === "email_sent") {
      console.log(`Statistiques mises \xE0 jour pour la newsletter "${body.name}"`);
      return {
        success: true,
        message: "Statistiques mises \xE0 jour avec succ\xE8s"
      };
    }
    return {
      success: false,
      message: "Action non reconnue"
    };
  } catch (error) {
    console.error("Erreur lors de la mise \xE0 jour des statistiques:", error);
    return {
      success: false,
      message: "Erreur lors de la mise \xE0 jour des statistiques",
      error: error.message
    };
  }
});

export { updateStats as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/newsletter/update-stats');
