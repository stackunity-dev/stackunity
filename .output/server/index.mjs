import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { t as trapUnhandledNodeErrors, a as toNodeListener, u as useNitroApp } from './chunks/_/nitro.mjs';
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

const nitroApp = useNitroApp();
const listener = toNodeListener(nitroApp.h3App);
const websocket = void 0;
const handler = listener;
trapUnhandledNodeErrors();

export { handler, listener, websocket };
//# sourceMappingURL=index.mjs.map
