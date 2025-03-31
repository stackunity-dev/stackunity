import { c as defineEventHandler, e as createError, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const collect = defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({
      statusCode: 405,
      message: "M\xE9thode non autoris\xE9e"
    });
  }
  try {
    const body = await readBody(event);
    console.log("Donn\xE9es analytics re\xE7ues:", body);
    if (!body.session_id) {
      throw createError({
        statusCode: 400,
        message: "session_id est requis"
      });
    }
    await pool.execute(
      `INSERT INTO analytics_data (
        user_id,
        session_id,
        page_url,
        page_title,
        visit_duration,
        device_type,
        browser,
        is_new_visitor,
        is_bounce,
        is_conversion,
        referrer_url,
        date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.user_id || "anonymous",
        body.session_id,
        body.page_url || "",
        body.page_title || "",
        body.visit_duration || 0,
        body.device_type || "unknown",
        body.browser || "unknown",
        body.is_new_visitor ? 1 : 0,
        body.is_bounce ? 1 : 0,
        body.is_conversion ? 1 : 0,
        body.referrer_url || "",
        (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      ]
    );
    return { success: true, message: "Donn\xE9es analytics enregistr\xE9es avec succ\xE8s" };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des donn\xE9es analytics:", error);
    return {
      statusCode: 500,
      message: "Erreur lors de l'enregistrement des donn\xE9es analytics",
      error: error.message
    };
  }
});

export { collect as default };
//# sourceMappingURL=collect.mjs.map
