import { c as defineEventHandler, e as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';

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
