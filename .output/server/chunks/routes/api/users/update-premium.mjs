import { c as defineEventHandler, q as getRequestHeader, r as readBody } from '../../../_/nitro.mjs';
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

const updatePremium = defineEventHandler(async (event) => {
  var _a;
  try {
    console.log("API update-premium appel\xE9e");
    const token = (_a = getRequestHeader(event, "Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
      console.log("Token manquant dans la requ\xEAte");
      return {
        success: false,
        error: "Non autoris\xE9: token manquant"
      };
    }
    const body = await readBody(event);
    const { isPremium } = body;
    console.log(`Mise \xE0 jour du statut premium \xE0: ${isPremium ? "Premium" : "Standard"}`);
    if (isPremium === void 0) {
      return {
        success: false,
        error: "Param\xE8tre isPremium requis"
      };
    }
    console.log(`Mise \xE0 jour du statut premium pour l'utilisateur avec token \xE0 ${isPremium ? "Premium" : "Standard"}`);
    return {
      success: true,
      message: `Le statut premium a \xE9t\xE9 mis \xE0 jour avec succ\xE8s: ${isPremium ? "activ\xE9" : "d\xE9sactiv\xE9"}`
    };
  } catch (error) {
    console.error("Erreur lors de la mise \xE0 jour du statut premium:", error);
    return {
      success: false,
      error: "Erreur lors de la mise \xE0 jour du statut premium"
    };
  }
});

export { updatePremium as default };
//# sourceMappingURL=update-premium.mjs.map
