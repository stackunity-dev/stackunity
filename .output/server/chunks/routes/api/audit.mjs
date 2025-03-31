import { d as defineEventHandler, r as readBody, c as createError } from '../../_/nitro.mjs';
import axios from 'axios';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';

const audit = defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);
  const WAVE_API_KEY = "h8HACJQA5088";
  const WAVE_API_URL = "https://wave.webaim.org/api/request";
  try {
    const response = await axios.post(WAVE_API_URL, null, {
      params: {
        key: WAVE_API_KEY,
        url: body.url,
        reporttype: "3"
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Erreur lors de l'audit de l'accessibilit\xE9:", error);
    throw createError({ statusCode: 500, statusMessage: "Erreur lors de l'audit de l'accessibilit\xE9" });
  }
});

export { audit as default };
//# sourceMappingURL=audit.mjs.map
