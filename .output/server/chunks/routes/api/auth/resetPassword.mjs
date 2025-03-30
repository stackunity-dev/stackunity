globalThis.__timing__.logStart('Load chunks/routes/api/auth/resetPassword');import { d as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import bcrypt from 'bcrypt';
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

const resetPassword = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { newPassword } = body;
  const userId = event.context.user.id;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
    return {
      success: true,
      message: "Mot de passe r\xE9initialis\xE9 avec succ\xE8s"
    };
  } catch (error) {
    console.error("Erreur lors de la r\xE9initialisation du mot de passe:", error);
    return {
      success: false,
      message: "Erreur lors de la r\xE9initialisation du mot de passe"
    };
  }
});

export { resetPassword as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/auth/resetPassword');
