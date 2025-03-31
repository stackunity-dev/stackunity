import { d as defineEventHandler, c as createError, p as pool } from '../../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
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

const _id_ = defineEventHandler(async (event) => {
  var _a, _b;
  const templateId = (_a = event.context.params) == null ? void 0 : _a.id;
  const userId = (_b = event.context.user) == null ? void 0 : _b.id;
  console.log("Deleting template with ID:", templateId);
  console.log("User ID:", userId);
  if (!templateId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Template ID is required"
    });
  }
  try {
    const result = await pool.query("DELETE FROM studio_components WHERE id = ? AND user_id = ?", [templateId, userId]);
    console.log("Delete result:", result);
    return {
      success: true,
      message: "Template deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting template:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error deleting template"
    });
  }
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
