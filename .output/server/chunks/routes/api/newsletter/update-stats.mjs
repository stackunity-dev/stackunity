import { c as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2';

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

export { updateStats as default };
//# sourceMappingURL=update-stats.mjs.map
