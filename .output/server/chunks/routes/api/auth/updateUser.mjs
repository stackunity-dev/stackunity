globalThis.__timing__.logStart('Load chunks/routes/api/auth/updateUser');import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const updateUser = defineEventHandler(async (event) => {
  const { email, username, company, website, bio } = await readBody(event);
  const userId = event.context.user.id;
  if (!userId) {
    return {
      success: false,
      message: "User not found"
    };
  }
  try {
    const result = await pool.execute("UPDATE users SET email = ?, username = ?, company = ?, website = ?, bio = ? WHERE id = ?", [email, username, company, website, bio, userId]);
    return {
      success: true,
      message: "User updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: "Error updating user"
    };
  }
});

export { updateUser as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/auth/updateUser');
