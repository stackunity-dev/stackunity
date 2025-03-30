globalThis.__timing__.logStart('Load chunks/routes/api/monitoring/system');import { d as defineEventHandler } from '../../../_/nitro.mjs';
import si from 'systeminformation';
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

const system = defineEventHandler(async () => {
  var _a;
  try {
    const [cpu, mem, disk, speed] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.cpu()
    ]);
    return {
      success: true,
      data: {
        cpu: {
          usage: cpu.currentLoad,
          cores: ((_a = cpu.cpus) == null ? void 0 : _a.map((core) => core.load)) || [],
          speed: speed.speed
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          swapUsed: mem.swapused,
          swapTotal: mem.swaptotal
        },
        disks: disk.map((d) => ({
          fs: d.fs,
          size: d.size,
          used: d.used,
          use: d.use,
          mount: d.mount
        }))
      }
    };
  } catch (err) {
    console.error("Erreur monitoring:", err);
    return {
      success: false,
      error: err.message
    };
  }
});

export { system as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/monitoring/system');
