import { d as defineEventHandler, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';

const seedMarketingData = defineEventHandler(async (event) => {
  {
    throw createError({
      statusCode: 403,
      message: "Cette API est d\xE9sactiv\xE9e en production"
    });
  }
});

export { seedMarketingData as default };
//# sourceMappingURL=seed-marketing-data.mjs.map
