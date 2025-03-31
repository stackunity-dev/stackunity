import { d as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const saveTemplate = defineEventHandler(async (event) => {
  const { templateName, templateData, componentType } = await readBody(event);
  console.log(templateName, templateData, componentType);
  const userId = event.context.user.id;
  try {
    const result = await pool.execute("INSERT INTO studio_components (name, content, user_id, component_type) VALUES (?, ?, ?, ?)", [templateName, templateData, userId, componentType]);
    console.log(result);
    return {
      success: true,
      message: "Template saved successfully"
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to save template"
    };
  }
});

export { saveTemplate as default };
//# sourceMappingURL=saveTemplate.mjs.map
