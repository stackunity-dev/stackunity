import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import crypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders as setHeaders$1, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send as send$2, getRequestHeaders, setResponseHeader, getRequestURL, getResponseHeader, createError, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, readBody, getQuery as getQuery$1, getHeaders, setCookie, getCookie, deleteCookie, setHeader, getHeader, getResponseStatusText } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/h3/dist/index.mjs';
import axios from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/axios/index.js';
import bcrypt from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/bcrypt/bcrypt.js';
import jwt from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/jsonwebtoken/index.js';
import si from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/systeminformation/lib/index.js';
import { Resend } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/resend/dist/index.mjs';
import Stripe from 'file://C:/Users/djedi/node_modules/stripe/esm/stripe.esm.node.js';
import PDFDocument from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/pdfkit/js/pdfkit.js';
import chromium from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/@sparticuz/chromium/build/index.js';
import { XMLParser } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/fast-xml-parser/src/fxp.js';
import puppeteer from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { S3Client, PutObjectCommand } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/@aws-sdk/client-s3/dist-cjs/index.js';
import fs from 'node:fs';
import { IncomingForm } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/formidable/src/index.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import destr from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/destr/dist/index.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, joinRelativeURL } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/ufo/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/unhead/dist/server.mjs';
import { isVNode, toValue, isRef } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/vue/index.mjs';
import { walkResolver } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/unhead/dist/utils.mjs';
import { renderToString } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/scule/dist/index.mjs';
import { stringify, uneval } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/devalue/index.js';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/unhead/dist/plugins.mjs';
import { createHooks } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/youch-core/build/index.js';
import { Youch } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/errx/dist/index.js';
import * as mysql from 'file://C:/Users/djedi/Documents/.vscode/devroid/node_modules/mysql2/promise.js';

const serverAssets = [{"baseName":"server","dir":"C:/Users/djedi/Documents/.vscode/devroid/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/djedi/Documents/.vscode/devroid","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/djedi/Documents/.vscode/devroid/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/djedi/Documents/.vscode/devroid/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/djedi/Documents/.vscode/devroid/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"C:/Users/djedi/Documents/.vscode/devroid/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "stripe": {
      "publishableKey": "pk_test_TYooMQauvdEDq54NiTphI7jx"
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config$1.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders$1(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send$2(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = url.pathname + url.search + url.hash;
  errorObject.message ||= "Server Error";
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send$2(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send$2(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send$2(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const rootDir = "C:/Users/djedi/Documents/.vscode/devroid";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"},{"name":"crossorigin","content":"use-credentials"}],"link":[{"rel":"preload","as":"fetch","crossorigin":"use-credentials"}],"style":[],"script":[],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _hxCUfPzLT5944vsFoZkUFwwsOsEZdfAbngfoNZq5Z9k = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

const plugins = [
  _hxCUfPzLT5944vsFoZkUFwwsOsEZdfAbngfoNZq5Z9k
];

const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement ${envVar} manquante`);
  }
}
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "25060"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connexion \xE0 la base de donn\xE9es \xE9tablie avec succ\xE8s");
    connection.release();
    return true;
  } catch (error) {
    console.error("Erreur de connexion \xE0 la base de donn\xE9es:", error);
    return false;
  }
}
pool.on("connection", (connection) => {
  connection.on("error", (err) => {
    console.error("Erreur de connexion \xE0 la base de donn\xE9es:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Connexion \xE0 la base de donn\xE9es perdue");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("La base de donn\xE9es a trop de connexions");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("La connexion \xE0 la base de donn\xE9es a \xE9t\xE9 refus\xE9e");
    }
  });
});

const db = /*#__PURE__*/Object.freeze({
  __proto__: null,
  pool: pool,
  testConnection: testConnection
});

const ACCESS_TOKEN_SECRET = "access_token_secret_key";
const REFRESH_TOKEN_SECRET = "refresh_token_secret_key";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  // Important: empêche l'accès par JavaScript (protection XSS)
  path: "/",
  maxAge: REFRESH_TOKEN_MAX_AGE,
  sameSite: "strict",
  // Protection CSRF
  secure: true
  // Toujours HTTPS
};

const publicRoutes = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/newsletter/unsubscribe",
  "/api/newsletter/subscribe",
  "/signup",
  "/login",
  "/",
  "/api/health",
  "/api/public",
  "/api/auth/forgot-password",
  "/api/cookies",
  "/api/analytics",
  "/api/auth/session",
  "/api/analytics/collect",
  "/api/marketing/collect",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/favicon.ico",
  "/assets/",
  "/_nuxt/"
];
const adminRoutes = [
  "/newsletter-admin",
  "/api/newsletter/stats",
  "/api/admin",
  "/api/analytics",
  "/admin/analytics",
  "/admin/marketing",
  "/api/marketing",
  "/api/cookies"
];
const premiumRoutes = [
  "/sql-generator",
  "/seo-audit",
  "/robots",
  "/api/seo-audit",
  "/api/seo-audit.pdf",
  "/api/sql-schema"
];
process.env.JWT_SECRET || "secret";
const _P9I9Nd = defineEventHandler(async (event) => {
  const url = event.path;
  console.log("Middleware auth - URL:", url);
  if (publicRoutes.some((route) => url.startsWith(route))) {
    return;
  }
  const headers = getRequestHeaders(event);
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token d'authentification manquant"
    });
  }
  const token = authHeader.split(" ")[1];
  console.log("Token re\xE7u:", token.substring(0, 20) + "...");
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log("Token d\xE9cod\xE9:", { userId: decoded.userId, isAdmin: decoded.isAdmin, isPremium: decoded.isPremium });
    const [rows] = await pool.execute(
      "SELECT id, username, email, is_admin, is_premium FROM users WHERE id = ?",
      [decoded.userId]
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: "Utilisateur non trouv\xE9"
      });
    }
    const user = rows[0];
    if (adminRoutes.some((route) => url.startsWith(route)) && !user.is_admin) {
      throw createError({
        statusCode: 403,
        message: "Acc\xE8s non autoris\xE9"
      });
    }
    if (premiumRoutes.some((route) => url.startsWith(route)) && !user.is_premium) {
      throw createError({
        statusCode: 403,
        message: "Fonctionnalit\xE9 premium requise"
      });
    }
    event.context.auth = {
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: Boolean(user.is_admin),
      isPremium: Boolean(user.is_premium)
    };
    setHeaders(event);
  } catch (error) {
    console.error("Token invalide ou expir\xE9:", token.substring(0, 20) + "...");
    if (error instanceof jwt.TokenExpiredError) {
      throw createError({
        statusCode: 401,
        message: "Session expir\xE9e"
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({
        statusCode: 401,
        message: "Token invalide"
      });
    }
    throw createError({
      statusCode: 401,
      message: "Erreur d'authentification"
    });
  }
});
function setHeaders(event) {
  event.node.res.setHeader("Access-Control-Allow-Origin", "*");
  event.node.res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  event.node.res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  event.node.res.setHeader("Access-Control-Max-Age", "86400");
}

const _SMaJUI = defineEventHandler((event) => {
  event.node.res.setHeader("Access-Control-Allow-Origin", "*");
  event.node.res.setHeader("Access-Control-Allow-Credentials", "true");
  event.node.res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  event.node.res.setHeader("Access-Control-Allow-Headers", "Content-Type");
});

const _lazy_OBOGTm = () => Promise.resolve().then(function () { return analytics$1; });
const _lazy_Pmfqoj = () => Promise.resolve().then(function () { return collect$1; });
const _lazy_VhW_QU = () => Promise.resolve().then(function () { return audit$1; });
const _lazy_mJO9II = () => Promise.resolve().then(function () { return deleteAccount$1; });
const _lazy_Kbt8IY = () => Promise.resolve().then(function () { return login$1; });
const _lazy_3kY9Rh = () => Promise.resolve().then(function () { return logout$1; });
const _lazy_F24rHc = () => Promise.resolve().then(function () { return refresh$1; });
const _lazy_KnUWBM = () => Promise.resolve().then(function () { return resetPassword$1; });
const _lazy_6u5Smn = () => Promise.resolve().then(function () { return session$1; });
const _lazy_CTSmy_ = () => Promise.resolve().then(function () { return signup$1; });
const _lazy_6Jv7b8 = () => Promise.resolve().then(function () { return updateUser$1; });
const _lazy_mUFkuh = () => Promise.resolve().then(function () { return cookies$1; });
const _lazy_LPSFG5 = () => Promise.resolve().then(function () { return db; });
const _lazy_L_GoMK = () => Promise.resolve().then(function () { return system$1; });
const _lazy_CE8ZnI = () => Promise.resolve().then(function () { return createNewsletter$1; });
const _lazy_USw7qh = () => Promise.resolve().then(function () { return history$1; });
const _lazy_g_pRjz = () => Promise.resolve().then(function () { return send$1; });
const _lazy_FrhKgJ = () => Promise.resolve().then(function () { return stats$1; });
const _lazy_emXLN8 = () => Promise.resolve().then(function () { return subscribe$1; });
const _lazy_V6gwph = () => Promise.resolve().then(function () { return subscribers$1; });
const _lazy_eecCbi = () => Promise.resolve().then(function () { return unsubscribe$1; });
const _lazy_e07_Wb = () => Promise.resolve().then(function () { return updateStats$1; });
const _lazy_IZWTvI = () => Promise.resolve().then(function () { return createIntent$1; });
const _lazy_bRtRgE = () => Promise.resolve().then(function () { return ipapi$1; });
const _lazy_bD49h1 = () => Promise.resolve().then(function () { return seedAnalyticsData$1; });
const _lazy_NuJsmD = () => Promise.resolve().then(function () { return seedMarketingData$1; });
const _lazy_3M9n6I = () => Promise.resolve().then(function () { return seoAudit_pdf_post$1; });
const _lazy_9_KdIG = () => Promise.resolve().then(function () { return seoAudit$1; });
const _lazy_OILQF9 = () => Promise.resolve().then(function () { return addFavorite$1; });
const _lazy_pETFpc = () => Promise.resolve().then(function () { return addSnippets$1; });
const _lazy_Sf0fg_ = () => Promise.resolve().then(function () { return deleteSnippet$1; });
const _lazy_TjQeR2 = () => Promise.resolve().then(function () { return loadSnippets$1; });
const _lazy_7vzK_J = () => Promise.resolve().then(function () { return removeFavorite$1; });
const _lazy_cVXlyV = () => Promise.resolve().then(function () { return updateSnippet$1; });
const _lazy_uVDfxP = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_7zvQAX = () => Promise.resolve().then(function () { return loadSQLSchemas$1; });
const _lazy_GmlFeb = () => Promise.resolve().then(function () { return saveSQLSchema$1; });
const _lazy_ahe0vz = () => Promise.resolve().then(function () { return _id_$1; });
const _lazy_3Pxp4R = () => Promise.resolve().then(function () { return saveTemplate$1; });
const _lazy_mmR3HB = () => Promise.resolve().then(function () { return upload$1; });
const _lazy_1lwWga = () => Promise.resolve().then(function () { return checkAdmin$1; });
const _lazy_dJE7jX = () => Promise.resolve().then(function () { return loadData$1; });
const _lazy_1AzbyB = () => Promise.resolve().then(function () { return updatePremium$1; });
const _lazy_RZMI4n = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _P9I9Nd, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _SMaJUI, lazy: false, middleware: true, method: undefined },
  { route: '/api/analytics', handler: _lazy_OBOGTm, lazy: true, middleware: false, method: undefined },
  { route: '/api/analytics/collect', handler: _lazy_Pmfqoj, lazy: true, middleware: false, method: undefined },
  { route: '/api/audit', handler: _lazy_VhW_QU, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/deleteAccount', handler: _lazy_mJO9II, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/login', handler: _lazy_Kbt8IY, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/logout', handler: _lazy_3kY9Rh, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/refresh', handler: _lazy_F24rHc, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/resetPassword', handler: _lazy_KnUWBM, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/session', handler: _lazy_6u5Smn, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/signup', handler: _lazy_CTSmy_, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/updateUser', handler: _lazy_6Jv7b8, lazy: true, middleware: false, method: undefined },
  { route: '/api/cookies', handler: _lazy_mUFkuh, lazy: true, middleware: false, method: undefined },
  { route: '/api/db', handler: _lazy_LPSFG5, lazy: true, middleware: false, method: undefined },
  { route: '/api/monitoring/system', handler: _lazy_L_GoMK, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/createNewsletter', handler: _lazy_CE8ZnI, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/history', handler: _lazy_USw7qh, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/send', handler: _lazy_g_pRjz, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/stats', handler: _lazy_FrhKgJ, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/subscribe', handler: _lazy_emXLN8, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/subscribers', handler: _lazy_V6gwph, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/unsubscribe', handler: _lazy_eecCbi, lazy: true, middleware: false, method: undefined },
  { route: '/api/newsletter/update-stats', handler: _lazy_e07_Wb, lazy: true, middleware: false, method: undefined },
  { route: '/api/payment/create-intent', handler: _lazy_IZWTvI, lazy: true, middleware: false, method: undefined },
  { route: '/api/proxy/ipapi', handler: _lazy_bRtRgE, lazy: true, middleware: false, method: undefined },
  { route: '/api/seed-analytics-data', handler: _lazy_bD49h1, lazy: true, middleware: false, method: undefined },
  { route: '/api/seed-marketing-data', handler: _lazy_NuJsmD, lazy: true, middleware: false, method: undefined },
  { route: '/api/seo-audit.pdf', handler: _lazy_3M9n6I, lazy: true, middleware: false, method: "post" },
  { route: '/api/seo-audit', handler: _lazy_9_KdIG, lazy: true, middleware: false, method: undefined },
  { route: '/api/snippets/addFavorite', handler: _lazy_OILQF9, lazy: true, middleware: false, method: undefined },
  { route: '/api/snippets/addSnippets', handler: _lazy_pETFpc, lazy: true, middleware: false, method: undefined },
  { route: '/api/snippets/deleteSnippet', handler: _lazy_Sf0fg_, lazy: true, middleware: false, method: undefined },
  { route: '/api/snippets/loadSnippets', handler: _lazy_TjQeR2, lazy: true, middleware: false, method: undefined },
  { route: '/api/snippets/removeFavorite', handler: _lazy_7vzK_J, lazy: true, middleware: false, method: undefined },
  { route: '/api/snippets/updateSnippet', handler: _lazy_cVXlyV, lazy: true, middleware: false, method: undefined },
  { route: '/api/sql/:id', handler: _lazy_uVDfxP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/sql/loadSQLSchemas', handler: _lazy_7zvQAX, lazy: true, middleware: false, method: undefined },
  { route: '/api/sql/saveSQLSchema', handler: _lazy_GmlFeb, lazy: true, middleware: false, method: undefined },
  { route: '/api/studio/removeTemplate/:id', handler: _lazy_ahe0vz, lazy: true, middleware: false, method: undefined },
  { route: '/api/studio/saveTemplate', handler: _lazy_3Pxp4R, lazy: true, middleware: false, method: undefined },
  { route: '/api/upload', handler: _lazy_mmR3HB, lazy: true, middleware: false, method: undefined },
  { route: '/api/user/check-admin', handler: _lazy_1lwWga, lazy: true, middleware: false, method: undefined },
  { route: '/api/user/loadData', handler: _lazy_dJE7jX, lazy: true, middleware: false, method: undefined },
  { route: '/api/users/update-premium', handler: _lazy_1AzbyB, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_RZMI4n, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_RZMI4n, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send$2(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send$2(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + messages.statusCode + " - " + (messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + messages.statusCode + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + messages.description + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + messages.stack + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template$1
});

const analytics = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const method = event.method;
  console.log(`Requ\xEAte ${method} vers /api/analytics`);
  let body;
  if (method === "POST") {
    body = await readBody(event);
    if (!body || !body.type) {
      console.log("Requ\xEAte POST sans donn\xE9es valides");
      return { success: false, message: "Donn\xE9es invalides" };
    }
    console.log("Donn\xE9es re\xE7ues:", body.type);
  }
  if (method === "POST" && body) {
    if (body.type === "pageview") {
      const pageView = {
        url: body.url,
        title: body.title,
        timestamp: /* @__PURE__ */ new Date(),
        userId: body.userId,
        sessionId: body.sessionId,
        deviceType: body.deviceType,
        country: body.country,
        city: body.city,
        referrer: body.referrer,
        timeOnPage: body.timeOnPage
      };
      try {
        const connection = await pool.getConnection();
        await connection.execute(
          `INSERT INTO page_views (url, title, timestamp, user_id, session_id, device_type, country, city, referrer, time_on_page)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pageView.url,
            pageView.title,
            pageView.timestamp,
            pageView.userId,
            pageView.sessionId,
            pageView.deviceType,
            pageView.country,
            pageView.city,
            pageView.referrer,
            pageView.timeOnPage
          ]
        );
        const [existingSession] = await connection.execute(
          "SELECT id FROM user_sessions WHERE session_id = ? AND user_id = ?",
          [pageView.sessionId, pageView.userId]
        );
        if (Array.isArray(existingSession) && existingSession.length === 0) {
          await connection.execute(
            `INSERT INTO user_sessions 
             (user_id, session_id, start_time, end_time, pages, device_type, country, city, referrer, is_new_visitor, has_converted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pageView.userId,
              pageView.sessionId,
              pageView.timestamp,
              pageView.timestamp,
              JSON.stringify([pageView.url]),
              pageView.deviceType,
              pageView.country,
              pageView.city,
              pageView.referrer,
              body.isNewVisitor ? 1 : 0,
              body.hasConverted ? 1 : 0
            ]
          );
        } else {
          await connection.execute(
            `UPDATE user_sessions 
             SET end_time = ?,
                 pages = JSON_ARRAY_APPEND(IF(JSON_VALID(pages), pages, JSON_ARRAY()), '$', ?),
                 time_on_site = TIMESTAMPDIFF(SECOND, start_time, ?),
                 has_converted = ? 
             WHERE session_id = ? AND user_id = ?`,
            [
              pageView.timestamp,
              pageView.url,
              pageView.timestamp,
              body.hasConverted ? 1 : 0,
              pageView.sessionId,
              pageView.userId
            ]
          );
        }
        connection.release();
        return { success: true };
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la vue:", error);
        throw createError({
          statusCode: 500,
          message: "Erreur lors de l'enregistrement de la vue"
        });
      }
    } else if (body.type === "session") {
      try {
        const connection = await pool.getConnection();
        const startTime = new Date(body.startTime);
        const endTime = new Date(body.endTime);
        const timeOnSite = body.timeOnSite || Math.round((endTime.getTime() - startTime.getTime()) / 1e3);
        const [existingSession] = await connection.execute(
          "SELECT id FROM user_sessions WHERE session_id = ? AND user_id = ?",
          [body.sessionId, body.userId]
        );
        if (Array.isArray(existingSession) && existingSession.length === 0) {
          console.log("Insertion nouvelle session");
          await connection.execute(
            `INSERT INTO user_sessions 
             (user_id, session_id, start_time, end_time, pages, device_type, country, city, referrer, is_new_visitor, has_converted, time_on_site)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              body.userId,
              body.sessionId,
              startTime,
              endTime,
              JSON.stringify(body.pages || []),
              body.deviceType || "unknown",
              body.country || "unknown",
              body.city || "unknown",
              body.referrer || "",
              body.isNewVisitor ? 1 : 0,
              body.hasConverted ? 1 : 0,
              timeOnSite
            ]
          );
          console.log("Session ins\xE9r\xE9e avec time_on_site =", timeOnSite);
        } else {
          console.log("Mise \xE0 jour session existante");
          await connection.execute(
            `UPDATE user_sessions 
             SET end_time = ?,
                 pages = ?,
                 time_on_site = ?,
                 has_converted = ?
             WHERE session_id = ? AND user_id = ?`,
            [
              endTime,
              JSON.stringify(body.pages || []),
              timeOnSite,
              body.hasConverted ? 1 : 0,
              body.sessionId,
              body.userId
            ]
          );
          console.log("Session mise \xE0 jour avec time_on_site =", timeOnSite);
        }
        connection.release();
        return { success: true, message: "Session trait\xE9e avec succ\xE8s" };
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la session:", error);
        throw createError({
          statusCode: 500,
          message: "Erreur lors de l'enregistrement de la session"
        });
      }
    } else if (body.type === "session_end") {
      try {
        const connection = await pool.getConnection();
        const [existingSession] = await connection.execute(
          "SELECT id, start_time FROM user_sessions WHERE session_id = ? AND user_id = ?",
          [body.sessionId, body.userId || "anonymous"]
        );
        if (Array.isArray(existingSession) && existingSession.length > 0) {
          const sessionInfo = existingSession[0];
          const startTime = new Date(sessionInfo.start_time);
          const endTime = /* @__PURE__ */ new Date();
          const timeOnSite = body.timeOnSite || Math.round((endTime.getTime() - startTime.getTime()) / 1e3);
          console.log("Fin de session - temps sur site:", timeOnSite);
          await connection.execute(
            `UPDATE user_sessions 
             SET end_time = ?,
                 time_on_site = ?
             WHERE session_id = ? AND user_id = ?`,
            [
              endTime,
              timeOnSite,
              body.sessionId,
              body.userId || "anonymous"
            ]
          );
          console.log("Session termin\xE9e et mise \xE0 jour avec succ\xE8s");
        } else {
          console.log("Session non trouv\xE9e lors de la tentative de fin de session");
        }
        connection.release();
        return {
          success: true,
          message: "Donn\xE9es de fin de session trait\xE9es avec succ\xE8s"
        };
      } catch (error) {
        console.error("Erreur lors du traitement des donn\xE9es de fin de session:", error);
        throw createError({
          statusCode: 500,
          message: "Erreur lors du traitement des donn\xE9es de fin de session"
        });
      }
    }
  }
  if (method === "GET") {
    try {
      const headers = getHeaders(event);
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
          statusCode: 401,
          message: "Non autoris\xE9"
        };
      }
      const thirtyDaysAgo = /* @__PURE__ */ new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateFilter = thirtyDaysAgo.toISOString().split("T")[0];
      const [uniqueVisitorsResult] = await pool.query(
        `SELECT 
          COUNT(DISTINCT user_id) as uniqueVisitors,
          (COUNT(DISTINCT user_id) / 
            (SELECT COUNT(DISTINCT user_id) FROM analytics_data 
             WHERE date BETWEEN DATE_SUB(?, INTERVAL 30 DAY) AND ?) - 1) * 100 as visitorGrowth
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter, dateFilter, dateFilter]
      );
      const [pageViewsResult] = await pool.query(
        `SELECT 
          COUNT(*) as pageViews,
          COUNT(*) / COUNT(DISTINCT session_id) as avgPagesPerVisit
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );
      const [timeAndBounceResult] = await pool.query(
        `SELECT 
          AVG(visit_duration) as avgTimeOnSite,
          SUM(is_bounce) / COUNT(DISTINCT session_id) * 100 as bounceRate
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );
      const [conversionResult] = await pool.query(
        `SELECT 
          SUM(is_conversion) / COUNT(DISTINCT session_id) * 100 as conversionRate
         FROM analytics_data 
         WHERE date >= ?`,
        [dateFilter]
      );
      const [topPagesResult] = await pool.query(
        `SELECT 
          page_url as url, 
          page_title as title, 
          COUNT(*) as views 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY page_url, page_title
         ORDER BY views DESC
         LIMIT 5`,
        [dateFilter]
      );
      const [userBehaviorResult] = await pool.query(
        `SELECT
           CASE 
             WHEN is_new_visitor = 1 THEN 'Nouveau visiteur'
             ELSE 'Retour'
           END as type,
           COUNT(DISTINCT session_id) as count,
           COUNT(DISTINCT session_id) / (SELECT COUNT(DISTINCT session_id) FROM analytics_data WHERE date >= ?) * 100 as percentage
         FROM analytics_data
         WHERE date >= ?
         GROUP BY is_new_visitor
         
         UNION ALL
         
         SELECT
           'Conversion' as type,
           COUNT(DISTINCT session_id) as count,
           COUNT(DISTINCT session_id) / (SELECT COUNT(DISTINCT session_id) FROM analytics_data WHERE date >= ?) * 100 as percentage
         FROM analytics_data
         WHERE date >= ? AND is_conversion = 1
         
         UNION ALL
         
         SELECT
           'Abandon' as type,
           COUNT(DISTINCT session_id) as count,
           COUNT(DISTINCT session_id) / (SELECT COUNT(DISTINCT session_id) FROM analytics_data WHERE date >= ?) * 100 as percentage
         FROM analytics_data
         WHERE date >= ? AND is_bounce = 1`,
        [dateFilter, dateFilter, dateFilter, dateFilter, dateFilter, dateFilter]
      );
      const [trafficResult] = await pool.query(
        `SELECT 
          date, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY date 
         ORDER BY date`,
        [dateFilter]
      );
      const [geoResult] = await pool.query(
        `SELECT 
          country, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY country 
         ORDER BY count DESC
         LIMIT 5`,
        [dateFilter]
      );
      const [deviceResult] = await pool.query(
        `SELECT 
          device_type as deviceType, 
          COUNT(DISTINCT session_id) as count 
         FROM analytics_data 
         WHERE date >= ?
         GROUP BY device_type`,
        [dateFilter]
      );
      return {
        uniqueVisitors: ((_a = uniqueVisitorsResult[0]) == null ? void 0 : _a.uniqueVisitors) || 0,
        visitorGrowth: Number(((_b = uniqueVisitorsResult[0]) == null ? void 0 : _b.visitorGrowth) || 0).toFixed(2),
        pageViews: ((_c = pageViewsResult[0]) == null ? void 0 : _c.pageViews) || 0,
        avgPagesPerVisit: Number(((_d = pageViewsResult[0]) == null ? void 0 : _d.avgPagesPerVisit) || 0).toFixed(2),
        avgTimeOnSite: Number(((_e = timeAndBounceResult[0]) == null ? void 0 : _e.avgTimeOnSite) || 0).toFixed(0),
        bounceRate: Number(((_f = timeAndBounceResult[0]) == null ? void 0 : _f.bounceRate) || 0).toFixed(1),
        conversionRate: Number(((_g = conversionResult[0]) == null ? void 0 : _g.conversionRate) || 0).toFixed(1),
        topPages: topPagesResult,
        userBehavior: userBehaviorResult,
        traffic: trafficResult,
        geographicDistribution: geoResult,
        deviceUsage: deviceResult
      };
    } catch (error) {
      console.error("Erreur lors de la r\xE9cup\xE9ration des donn\xE9es analytiques:", error);
      return {
        statusCode: 500,
        message: "Erreur serveur lors de la r\xE9cup\xE9ration des donn\xE9es analytiques"
      };
    }
  }
  throw createError({
    statusCode: 405,
    message: "M\xE9thode non autoris\xE9e"
  });
});

const analytics$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: analytics
});

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

const collect$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: collect
});

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

const audit$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: audit
});

const deleteAccount = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    await pool.execute("DELETE FROM users WHERE id = ?", [userId]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return { success: false, error: "Erreur lors de la suppression du compte" };
  }
});

const deleteAccount$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: deleteAccount
});

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

const native = {
  randomUUID: crypto.randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  return unsafeStringify(rnds);
}

const login = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email || !body.password) {
    return {
      success: false,
      error: "Email et mot de passe requis"
    };
  }
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [body.email]
    );
    if (rows.length === 0) {
      return {
        success: false,
        error: "Utilisateur non trouv\xE9"
      };
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Mot de passe incorrect"
      };
    }
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium === 1,
        isAdmin: user.isAdmin === 1
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshTokenId = v4();
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: refreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    await pool.execute(
      "INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [refreshTokenId, user.id]
    );
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin === 1,
        isPremium: user.isPremium === 1,
        company: user.company || "",
        bio: user.bio || "",
        website: user.website || ""
      }
    };
  } catch (err) {
    console.error("Erreur de connexion:", err);
    return {
      success: false,
      error: "Erreur serveur lors de la connexion"
    };
  }
});

const login$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: login
});

const logout = defineEventHandler(async (event) => {
  try {
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        await pool.execute(
          "UPDATE refresh_tokens SET revoked = 1 WHERE token_id = ? AND user_id = ?",
          [decoded.tokenId, decoded.userId]
        );
      } catch (error) {
        console.warn("Impossible de d\xE9coder le token de rafra\xEEchissement lors de la d\xE9connexion:", error);
      }
    }
    deleteCookie(event, REFRESH_TOKEN_COOKIE_NAME);
    return {
      success: true
    };
  } catch (error) {
    console.error("Erreur lors de la d\xE9connexion:", error);
    return {
      success: false,
      error: "Erreur serveur lors de la d\xE9connexion"
    };
  }
});

const logout$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: logout
});

const refresh = defineEventHandler(async (event) => {
  try {
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);
    if (!refreshToken) {
      return {
        success: false,
        error: "Token de rafra\xEEchissement manquant"
      };
    }
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return {
        success: false,
        error: "Token de rafra\xEEchissement invalide"
      };
    }
    const [tokenRows] = await pool.execute(
      "SELECT * FROM refresh_tokens WHERE token_id = ? AND user_id = ? AND revoked = 0 AND expires_at > NOW()",
      [decoded.tokenId, decoded.userId]
    );
    if (!Array.isArray(tokenRows) || tokenRows.length === 0) {
      return {
        success: false,
        error: "Token de rafra\xEEchissement r\xE9voqu\xE9 ou expir\xE9"
      };
    }
    const [userRows] = await pool.execute(
      "SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?",
      [decoded.userId]
    );
    if (!Array.isArray(userRows) || userRows.length === 0) {
      return {
        success: false,
        error: "Utilisateur non trouv\xE9"
      };
    }
    const user = userRows[0];
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium === 1,
        isAdmin: user.isAdmin === 1
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const newRefreshTokenId = v4();
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: newRefreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        "UPDATE refresh_tokens SET revoked = 1, replaced_by = ? WHERE token_id = ?",
        [newRefreshTokenId, decoded.tokenId]
      );
      await connection.execute(
        "INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
        [newRefreshTokenId, user.id]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin === 1,
        isPremium: user.isPremium === 1
      }
    };
  } catch (error) {
    console.error("Erreur lors du rafra\xEEchissement du token:", error);
    return {
      success: false,
      error: "Erreur serveur lors du rafra\xEEchissement du token"
    };
  }
});

const refresh$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: refresh
});

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

const resetPassword$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: resetPassword
});

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
const JWT_SECRET = ACCESS_TOKEN_SECRET;
const TOKEN_EXPIRY = ACCESS_TOKEN_EXPIRY;
const session = defineEventHandler(async (event) => {
  const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "strict",
    secure: true
  };
  if (event.method === "GET") {
    try {
      const authHeader = getRequestHeaders(event).authorization;
      const token = (authHeader == null ? void 0 : authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
      const sessionCookie = getCookie(event, "devunity_secure_session");
      const sessionToken = token || sessionCookie;
      if (!sessionToken) {
        return {
          success: false,
          message: "Aucune session active"
        };
      }
      try {
        const decoded = jwt.verify(sessionToken, JWT_SECRET);
        if (decoded.userId) {
          const [rows] = await pool.execute(
            "SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?",
            [decoded.userId]
          );
          if (!Array.isArray(rows) || rows.length === 0) {
            deleteCookie(event, "devunity_secure_session", cookieOptions);
            return {
              success: false,
              message: "Utilisateur non trouv\xE9"
            };
          }
          const user = rows[0];
          const newToken = jwt.sign(
            {
              userId: user.id,
              username: user.username,
              email: user.email,
              isPremium: user.isPremium === 1,
              isAdmin: user.isAdmin === 1
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
          );
          setCookie(event, "devunity_secure_session", newToken, cookieOptions);
          return {
            success: true,
            token: newToken,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              isAdmin: user.isAdmin === 1,
              isPremium: user.isPremium === 1
            }
          };
        }
        return {
          success: true,
          token: sessionToken,
          user: decoded
        };
      } catch (jwtError) {
        deleteCookie(event, "devunity_secure_session", cookieOptions);
        return {
          success: false,
          message: "Session invalide"
        };
      }
    } catch (error) {
      console.error("Erreur lors de la r\xE9cup\xE9ration de la session:", error);
      return {
        success: false,
        message: "Erreur serveur"
      };
    }
  }
  if (event.method === "POST") {
    try {
      const body = await readBody(event);
      const { token } = body;
      if (!token) {
        const authHeader = getRequestHeaders(event).authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const headerToken = authHeader.substring(7);
          if (headerToken) {
            try {
              jwt.verify(headerToken, JWT_SECRET);
              setCookie(event, "devunity_secure_session", headerToken, cookieOptions);
              return {
                success: true,
                message: "Session cr\xE9\xE9e avec succ\xE8s"
              };
            } catch (jwtError) {
              return {
                success: false,
                message: "Token invalide"
              };
            }
          }
        }
        return {
          success: false,
          message: "Token manquant"
        };
      }
      try {
        jwt.verify(token, JWT_SECRET);
      } catch (jwtError) {
        return {
          success: false,
          message: "Token invalide"
        };
      }
      setCookie(event, "devunity_secure_session", token, cookieOptions);
      return {
        success: true,
        message: "Session cr\xE9\xE9e avec succ\xE8s"
      };
    } catch (error) {
      console.error("Erreur lors de la cr\xE9ation de la session:", error);
      return {
        success: false,
        message: "Erreur serveur"
      };
    }
  }
  if (event.method === "DELETE") {
    try {
      deleteCookie(event, "devunity_secure_session", cookieOptions);
      return {
        success: true,
        message: "Session supprim\xE9e avec succ\xE8s"
      };
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error);
      return {
        success: false,
        message: "Erreur serveur"
      };
    }
  }
  return {
    success: false,
    message: "M\xE9thode non prise en charge"
  };
});

const session$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: session
});

const signup = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.username || !body.email || !body.password) {
    return {
      success: false,
      error: "Tous les champs sont requis"
    };
  }
  try {
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [body.email]
    );
    if (existingUsers.length > 0) {
      return {
        success: false,
        error: "Cet email est d\xE9j\xE0 utilis\xE9"
      };
    }
    const [existingUsernames] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [body.username]
    );
    if (existingUsernames.length > 0) {
      return {
        success: false,
        error: "Ce nom d'utilisateur est d\xE9j\xE0 utilis\xE9"
      };
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const [userRows] = await pool.execute(
      "INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)",
      [body.username, body.email, hashedPassword, 0]
    );
    const userId = userRows.insertId;
    const accessToken = jwt.sign(
      {
        userId,
        username: body.username,
        email: body.email,
        isPremium: false,
        isAdmin: false
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshTokenId = v4();
    const refreshToken = jwt.sign(
      {
        userId,
        tokenId: refreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    await pool.execute(
      "INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [refreshTokenId, userId]
    );
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    const sessionCookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      // 30 jours
      sameSite: "strict",
      secure: true
    };
    setCookie(event, "devunity_secure_session", accessToken, sessionCookieOptions);
    return {
      success: true,
      accessToken,
      user: {
        id: userId,
        username: body.username,
        email: body.email,
        isAdmin: false,
        isPremium: false
      }
    };
  } catch (err) {
    console.error("Error api signup : ", err.message, err.stack);
    return {
      success: false,
      error: err.message || "Erreur lors de l'inscription"
    };
  }
});

const signup$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: signup
});

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

const updateUser$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: updateUser
});

const cookies = defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "OPTIONS") {
    event.node.res.statusCode = 204;
    return;
  }
  if (method === "POST") {
    const body = await readBody(event);
    try {
      const { userId, cookiePreferences } = body;
      if (!userId || !cookiePreferences) {
        throw createError({
          statusCode: 400,
          message: "Donn\xE9es manquantes"
        });
      }
      const preferences = cookiePreferences.preferences ? cookiePreferences : { preferences: { essential: true }, ...cookiePreferences };
      const connection = await pool.getConnection();
      const [existingUser] = await connection.execute(
        "SELECT id FROM cookie_preferences WHERE user_id = ?",
        [userId]
      );
      if (Array.isArray(existingUser) && existingUser.length > 0) {
        await connection.execute(
          `UPDATE cookie_preferences 
           SET preferences = ?, updated_at = NOW() 
           WHERE user_id = ?`,
          [JSON.stringify(preferences), userId]
        );
      } else {
        await connection.execute(
          `INSERT INTO cookie_preferences (user_id, preferences, created_at, updated_at)
           VALUES (?, ?, NOW(), NOW())`,
          [userId, JSON.stringify(preferences)]
        );
      }
      connection.release();
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des pr\xE9f\xE9rences de cookies:", error);
      throw createError({
        statusCode: 500,
        message: "Erreur lors de l'enregistrement des pr\xE9f\xE9rences de cookies"
      });
    }
  }
  if (method === "GET") {
    try {
      const query = getQuery$1(event);
      const { userId } = query;
      if (!userId) {
        throw createError({
          statusCode: 400,
          message: "ID utilisateur manquant"
        });
      }
      const connection = await pool.getConnection();
      const [preferences] = await connection.execute(
        "SELECT preferences FROM cookie_preferences WHERE user_id = ?",
        [userId]
      );
      connection.release();
      if (Array.isArray(preferences) && preferences.length > 0) {
        return {
          success: true,
          preferences: JSON.parse(preferences[0].preferences)
        };
      }
      return {
        success: true,
        preferences: null
      };
    } catch (error) {
      console.error("Erreur lors de la r\xE9cup\xE9ration des pr\xE9f\xE9rences de cookies:", error);
      throw createError({
        statusCode: 500,
        message: "Erreur lors de la r\xE9cup\xE9ration des pr\xE9f\xE9rences de cookies"
      });
    }
  }
  throw createError({
    statusCode: 405,
    message: "M\xE9thode non autoris\xE9e"
  });
});

const cookies$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: cookies
});

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

const system$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: system
});

const createNewsletter = defineEventHandler(async (event) => {
  const { name } = await readBody(event);
  try {
    const [result] = await pool.execute("INSERT INTO newsletters (name) VALUES (?)", [name]);
    return result;
  } catch (error) {
    console.error("Erreur lors de la cr\xE9ation de la newsletter:", error);
    return { error: "Erreur lors de la cr\xE9ation de la newsletter" };
  }
});

const createNewsletter$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: createNewsletter
});

const history = defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM newsletters_emails");
    return { success: true, data: rows };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration de l'historique des emails:", error);
    return { success: false, error: "Erreur lors de la r\xE9cup\xE9ration de l'historique des emails" };
  }
});

const history$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: history
});

const send = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const body = await readBody(event);
    console.log("Donn\xE9es re\xE7ues:", body);
    if (!body.subject || !body.html || !body.text) {
      console.error("Donn\xE9es manquantes:", body);
      return {
        success: false,
        message: "Donn\xE9es manquantes pour l'envoi de l'email"
      };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: "noreply@portfolionurdjedd.com",
      to: "djedidinur@gmail.com",
      subject: body.subject,
      html: body.html,
      text: body.text
    });
    const emailData = {
      body: {
        subject: body.subject,
        html: body.html,
        text: body.text
      }
    };
    await pool.execute("INSERT INTO newsletters_emails (subject, content) VALUES (?, ?)", [emailData.body.subject, emailData.body.html]);
    await pool.execute("UPDATE newsletters SET emails_sent = emails_sent + 1");
    return {
      success: true,
      message: "Email envoy\xE9 avec succ\xE8s",
      data: result
    };
  } catch (error) {
    console.error("Erreur d\xE9taill\xE9e:", {
      message: error.message,
      stack: error.stack,
      response: (_a = error.response) == null ? void 0 : _a.data
    });
    return {
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: error.message,
      details: (_b = error.response) == null ? void 0 : _b.data
    };
  }
});

const send$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: send
});

const stats = defineEventHandler(async (event) => {
  var _a;
  try {
    const token = (_a = getRequestHeader(event, "Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
      return {
        statusCode: 401,
        body: { error: "Non autoris\xE9" }
      };
    }
    const [statsRows] = await pool.execute("SELECT * FROM newsletters");
    const stats = statsRows.map((row) => ({
      id: row.id,
      name: row.name,
      emails_sent: row.emails_sent,
      subscribers: row.subscribers,
      content: row.content
    }));
    return {
      stats,
      total: stats.length
    };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration des statistiques:", error);
    return {
      stats: [],
      total: 0
    };
  }
});

const stats$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: stats
});

const subscribe = defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  try {
    const [result] = await pool.execute("INSERT INTO newsletters_subscribers (email) VALUES (?)", [email]);
    await pool.execute("UPDATE newsletters SET subscribers = subscribers + 1");
    return result;
  } catch (error) {
    console.error("Erreur lors de l'inscription \xE0 la newsletter:", error);
    return { error: "Erreur lors de l'inscription \xE0 la newsletter" };
  }
});

const subscribe$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: subscribe
});

const subscribers = defineEventHandler(async (event) => {
  try {
    const [subscribersRows] = await pool.execute("SELECT * FROM newsletters_subscribers");
    const subscribers = subscribersRows.map((row) => ({
      id: row.id,
      email: row.email,
      date: row.date
    }));
    return {
      subscribers,
      total: subscribers.length
    };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration des abonn\xE9s:", error);
    return {
      statusCode: 500,
      body: {
        error: "Erreur lors de la r\xE9cup\xE9ration des abonn\xE9s",
        message: error.message
      }
    };
  }
});

const subscribers$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: subscribers
});

const unsubscribe = defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  try {
    const subscriber = await pool.execute("DELETE FROM newsletters_subscribers WHERE email = ?", [email]);
    const count = await pool.execute("UPDATE newsletters SET subscribers = GREATEST(subscribers - 1, 0)");
    return { success: true, message: "Email d\xE9sinscrit avec succ\xE8s", subscriber, count };
  } catch (error) {
    return { success: false, message: "Erreur lors de la d\xE9sinscription" };
  }
});

const unsubscribe$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: unsubscribe
});

const updateStats = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Mise \xE0 jour des statistiques:", body);
    if (!body.action || !body.name) {
      return {
        success: false,
        message: "Donn\xE9es manquantes pour la mise \xE0 jour des statistiques"
      };
    }
    if (body.action === "email_sent") {
      console.log(`Statistiques mises \xE0 jour pour la newsletter "${body.name}"`);
      return {
        success: true,
        message: "Statistiques mises \xE0 jour avec succ\xE8s"
      };
    }
    return {
      success: false,
      message: "Action non reconnue"
    };
  } catch (error) {
    console.error("Erreur lors de la mise \xE0 jour des statistiques:", error);
    return {
      success: false,
      message: "Erreur lors de la mise \xE0 jour des statistiques",
      error: error.message
    };
  }
});

const updateStats$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: updateStats
});

const TAX_RATES = {
  "FR": 0.2,
  // France
  "DE": 0.19,
  // Germany
  "IT": 0.22,
  // Italy
  "ES": 0.21,
  // Spain
  "GB": 0.2,
  // United Kingdom
  "BE": 0.21,
  // Belgium
  "NL": 0.21,
  // Netherlands
  "LU": 0.17,
  // Luxembourg
  "AT": 0.2,
  // Austria
  "US": 0,
  // United States (may vary by state)
  "CA": 0.05,
  // Canada (may vary by province)
  "CH": 0.077,
  // Switzerland
  "PT": 0.23,
  // Portugal
  "DK": 0.25,
  // Denmark
  "SE": 0.25,
  // Sweden
  "NO": 0.25,
  // Norway
  "FI": 0.24
  // Finland
};
function getTaxRate(countryCode) {
  return TAX_RATES[countryCode] || 0.2;
}
const createIntent = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { currency, customer_name, country_code = "FR" } = body;
    if (!currency) {
      return {
        success: false,
        error: "Missing parameters: currency required"
      };
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-09-30.acacia"
    });
    const baseAmount = 3e4;
    const taxRate = getTaxRate(country_code);
    const taxAmount = Math.round(baseAmount * taxRate);
    const totalAmount = baseAmount + taxAmount;
    console.log(`Tax calculation for ${country_code}:`, {
      baseAmount,
      taxRate,
      taxAmount,
      totalAmount,
      taxPercentage: Math.round(taxRate * 100)
    });
    const customer = await stripe.customers.create({
      name: customer_name || "DevUnity Client",
      address: {
        country: country_code
      }
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
      customer: customer.id,
      metadata: {
        customer_name: customer_name || "Unidentified client",
        country_code,
        base_amount: baseAmount.toString(),
        tax_amount: taxAmount.toString(),
        tax_rate: `${Math.round(taxRate * 100)}%`
      }
    });
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      taxDetails: {
        baseAmount: baseAmount / 100,
        taxAmount: taxAmount / 100,
        totalAmount: totalAmount / 100,
        taxPercentage: Math.round(taxRate * 100)
      }
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment intent"
    };
  }
});

const createIntent$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: createIntent
});

const cache = /* @__PURE__ */ new Map();
const CACHE_TTL = 60 * 60 * 1e3;
const ipapi = defineEventHandler(async (event) => {
  try {
    const clientIP = event.req.headers["x-forwarded-for"] || event.req.socket.remoteAddress || "127.0.0.1";
    const ip = Array.isArray(clientIP) ? clientIP[0] : String(clientIP).split(",")[0].trim();
    const now = Date.now();
    const cachedResult = cache.get(ip);
    if (cachedResult && now - cachedResult.timestamp < CACHE_TTL) {
      return cachedResult.data;
    }
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      console.error(`Erreur API ipapi: ${response.status} - ${response.statusText}`);
      throw createError({
        statusCode: response.status,
        statusMessage: "Erreur lors de la r\xE9cup\xE9ration des donn\xE9es de localisation"
      });
    }
    const data = await response.json();
    cache.set(ip, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error("Erreur proxy ipapi:", error);
    return {
      country_name: "Unknown",
      city: "Unknown",
      ip: "Unknown",
      error: true
    };
  }
});

const ipapi$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: ipapi
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getRandomBoolean(probability = 0.5) {
  return Math.random() < probability;
}
function getRandomDate(daysBack = 30) {
  const date = /* @__PURE__ */ new Date();
  date.setDate(date.getDate() - getRandomInt(0, daysBack));
  return date;
}
const seedAnalyticsData = defineEventHandler(async (event) => {
  try {
    const userCount = 500;
    const sessionsPerUser = 3;
    const pagesPerSession = 4;
    const deviceTypes = ["desktop", "mobile", "tablet"];
    const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
    const countries = ["France", "USA", "Germany", "UK", "Spain", "Italy", "Canada", "Japan"];
    const regions = ["\xCEle-de-France", "California", "Bavaria", "London", "Catalonia", "Lombardy", "Ontario", "Tokyo"];
    const pages = [
      { url: "/", title: "Accueil" },
      { url: "/produits", title: "Nos Produits" },
      { url: "/services", title: "Services" },
      { url: "/blog", title: "Blog" },
      { url: "/contact", title: "Contact" },
      { url: "/a-propos", title: "\xC0 Propos" },
      { url: "/inscription", title: "Inscription" },
      { url: "/connexion", title: "Connexion" },
      { url: "/checkout", title: "Paiement" },
      { url: "/profil", title: "Profil Utilisateur" }
    ];
    await pool.query("TRUNCATE TABLE analytics_data");
    let insertedCount = 0;
    for (let i = 1; i <= userCount; i++) {
      const userId = `user_${i}`;
      const countryIndex = getRandomInt(0, countries.length - 1);
      for (let j = 1; j <= getRandomInt(1, sessionsPerUser); j++) {
        const sessionId = `session_${i}_${j}`;
        const date = getRandomDate();
        const deviceType = getRandomItem(deviceTypes);
        const browser = getRandomItem(browsers);
        const country = countries[countryIndex];
        const region = regions[countryIndex];
        const isNewVisitor = j === 1 ? true : false;
        const isBounce = isNewVisitor ? getRandomBoolean(0.3) : getRandomBoolean(0.1);
        const pageCount = isBounce ? 1 : getRandomInt(1, pagesPerSession);
        const isConversion = pageCount > 2 ? getRandomBoolean(0.4) : getRandomBoolean(0.05);
        const visitedPages = [];
        let usedPageIndices = /* @__PURE__ */ new Set();
        for (let k = 0; k < pageCount; k++) {
          let pageIndex;
          do {
            pageIndex = getRandomInt(0, pages.length - 1);
          } while (usedPageIndices.has(pageIndex));
          usedPageIndices.add(pageIndex);
          visitedPages.push(pages[pageIndex]);
        }
        for (let k = 0; k < visitedPages.length; k++) {
          const page = visitedPages[k];
          const visitDuration = getRandomInt(5, 300);
          const referrerUrl = k === 0 ? "https://www.google.com" : null;
          await pool.query(
            `INSERT INTO analytics_data 
             (date, user_id, session_id, page_url, page_title, visit_duration, 
              device_type, browser, country, region, is_new_visitor, is_bounce, is_conversion, referrer_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              date.toISOString().split("T")[0],
              userId,
              sessionId,
              page.url,
              page.title,
              visitDuration,
              deviceType,
              browser,
              country,
              region,
              isNewVisitor,
              isBounce,
              isConversion,
              referrerUrl
            ]
          );
          insertedCount++;
        }
      }
    }
    return {
      success: true,
      message: `${insertedCount} enregistrements analytiques de test g\xE9n\xE9r\xE9s avec succ\xE8s`
    };
  } catch (error) {
    console.error("Erreur lors de la g\xE9n\xE9ration des donn\xE9es de test:", error);
    return {
      success: false,
      message: "Erreur lors de la g\xE9n\xE9ration des donn\xE9es de test",
      error: error instanceof Error ? error.message : String(error)
    };
  }
});

const seedAnalyticsData$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: seedAnalyticsData
});

const seedMarketingData = defineEventHandler(async (event) => {
  try {
    const today = /* @__PURE__ */ new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    await pool.execute("TRUNCATE TABLE marketing_metrics");
    await pool.execute("TRUNCATE TABLE purchase_journey");
    await pool.execute("TRUNCATE TABLE premium_features");
    await pool.execute("TRUNCATE TABLE daily_subscriptions");
    await pool.execute("TRUNCATE TABLE regional_users");
    await pool.execute("TRUNCATE TABLE click_rates");
    for (let i = 0; i < 30; i++) {
      const date = new Date(year, month, today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      const factor = 1 + (30 - i) / 30;
      const checkoutVisits = Math.floor(500 * factor * (0.9 + Math.random() * 0.2));
      const premiumUsers = Math.floor(200 * factor * (0.9 + Math.random() * 0.2));
      const totalUsers = Math.floor(1400 * factor * (0.9 + Math.random() * 0.2));
      const conversionRate = 10 + i / 3 + Math.random() * 5;
      await pool.execute(
        `INSERT INTO marketing_metrics (metric_date, checkout_visits, premium_users, total_users, conversion_rate)
         VALUES (?, ?, ?, ?, ?)`,
        [formattedDate, checkoutVisits, premiumUsers, totalUsers, conversionRate]
      );
      const stages = [
        { name: "Visite du site", dropoff: 0 },
        { name: "Visite page tarifs", dropoff: 30 + Math.floor(Math.random() * 10) },
        { name: "Ajout au panier", dropoff: 20 + Math.floor(Math.random() * 10) },
        { name: "Checkout", dropoff: 15 + Math.floor(Math.random() * 5) },
        { name: "Paiement compl\xE9t\xE9", dropoff: 50 + Math.floor(Math.random() * 15) }
      ];
      let previousCount = totalUsers;
      for (const stage of stages) {
        const dropoff = stage.dropoff;
        const count = stage.name === "Visite du site" ? previousCount : Math.floor(previousCount * (1 - dropoff / 100));
        await pool.execute(
          `INSERT INTO purchase_journey (metric_date, stage, count, dropoff)
           VALUES (?, ?, ?, ?)`,
          [formattedDate, stage.name, count, dropoff]
        );
        previousCount = count;
      }
      const features = [
        { name: "SQL Generator", usage: 80 + Math.floor(Math.random() * 15) },
        { name: "SEO Audit", usage: 60 + Math.floor(Math.random() * 15) },
        { name: "Robots & Schema", usage: 40 + Math.floor(Math.random() * 15) },
        { name: "Studio Pro", usage: 70 + Math.floor(Math.random() * 15) }
      ];
      for (const feature of features) {
        const subscribers = Math.floor(premiumUsers * (feature.usage / 100));
        const revenue = subscribers * 20;
        await pool.execute(
          `INSERT INTO premium_features (metric_date, name, usage_percent, subscribers, revenue)
           VALUES (?, ?, ?, ?, ?)`,
          [formattedDate, feature.name, feature.usage, subscribers, revenue]
        );
      }
      const subscriptionCount = Math.floor(5 + Math.random() * 10 + (i % 7 === 0 ? 5 : 0));
      await pool.execute(
        `INSERT INTO daily_subscriptions (subscription_date, count)
         VALUES (?, ?)`,
        [formattedDate, subscriptionCount]
      );
      const regions = [
        { name: "France", percentage: 35 + Math.floor(Math.random() * 10) },
        { name: "\xC9tats-Unis", percentage: 25 + Math.floor(Math.random() * 10) },
        { name: "Allemagne", percentage: 15 + Math.floor(Math.random() * 10) },
        { name: "Canada", percentage: 10 + Math.floor(Math.random() * 10) }
      ];
      let remainingPercentage = 100;
      for (const region of regions) {
        remainingPercentage -= region.percentage;
        const userCount = Math.floor(totalUsers * (region.percentage / 100));
        await pool.execute(
          `INSERT INTO regional_users (metric_date, region_name, user_count)
           VALUES (?, ?, ?)`,
          [formattedDate, region.name, userCount]
        );
      }
      if (remainingPercentage > 0) {
        const otherUserCount = Math.floor(totalUsers * (remainingPercentage / 100));
        await pool.execute(
          `INSERT INTO regional_users (metric_date, region_name, user_count)
           VALUES (?, ?, ?)`,
          [formattedDate, "Autres", otherUserCount]
        );
      }
      const pages = [
        { name: "Page d'accueil", baseRate: 90 },
        { name: "Produits", baseRate: 75 },
        { name: "Tarifs", baseRate: 60 },
        { name: "Checkout", baseRate: 40 },
        { name: "Paiement", baseRate: 15 }
      ];
      for (const page of pages) {
        const clickRate = page.baseRate + Math.floor(Math.random() * 10);
        await pool.execute(
          `INSERT INTO click_rates (metric_date, page_name, click_rate)
           VALUES (?, ?, ?)`,
          [formattedDate, page.name, clickRate]
        );
      }
    }
    return {
      success: true,
      message: "Donn\xE9es marketing g\xE9n\xE9r\xE9es avec succ\xE8s",
      dataCount: {
        days: 30,
        metrics: 30,
        journeySteps: 30 * 5,
        features: 30 * 4,
        subscriptions: 30,
        regions: 30 * 5,
        clickRates: 30 * 5
      }
    };
  } catch (error) {
    console.error("Erreur lors de la g\xE9n\xE9ration des donn\xE9es marketing:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la g\xE9n\xE9ration des donn\xE9es marketing"
    });
  }
});

const seedMarketingData$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: seedMarketingData
});

const seoAudit_pdf_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url, report } = body;
  if (!url || !report) {
    throw createError({
      statusCode: 400,
      message: "URL and report required"
    });
  }
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    bufferPages: true,
    info: {
      Title: `SEO Audit - ${url}`,
      Author: "SEO Audit Tool",
      Subject: "SEO Audit Report",
      Keywords: "SEO, audit, analysis"
    }
  });
  setHeader(event, "Content-Type", "application/pdf");
  setHeader(event, "Content-Disposition", `attachment; filename=seo-audit-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`);
  const chunks = [];
  doc.on("data", chunks.push.bind(chunks));
  const calculateOverallScore = (result) => {
    let score = 100;
    const warnings = result.warnings || [];
    warnings.forEach((warning) => {
      if (typeof warning === "string") return;
      switch (warning.severity) {
        case "critical":
          score -= 20;
          break;
        case "high":
          score -= 15;
          break;
        case "medium":
          score -= 10;
          break;
        case "low":
          score -= 5;
          break;
      }
    });
    if (result.coreWebVitals.LCP > 2500) score -= 10;
    if (result.coreWebVitals.FCP > 1e3) score -= 5;
    if (result.coreWebVitals.TTFB > 500) score -= 5;
    if (!result.mobileCompatibility.hasViewport) score -= 10;
    if (result.mobileCompatibility.smallTouchTargets > 0) score -= 5;
    if (!result.securityChecks.https) score -= 15;
    return Math.max(0, Math.min(100, score));
  };
  const ensureSpace = (requiredSpace, nextSectionTitle) => {
    const currentPosition = doc.y;
    if (currentPosition + requiredSpace > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      if (nextSectionTitle) {
        doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text(nextSectionTitle, { underline: true }).moveDown();
        return true;
      }
      return false;
    }
    return false;
  };
  const createTable = (data, options = {}) => {
    var _a;
    const cellPadding2 = 12;
    const columnWidths = options.columnWidths || [120, 300, 100];
    const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
    const rowHeight2 = 50;
    if (doc.y + rowHeight2 * data.length > doc.page.height - 100) {
      doc.addPage();
    }
    const startY = doc.y;
    doc.fillColor(options.headerColor || "#E3F2FD").rect(50, startY, totalWidth, rowHeight2).fill();
    for (let i = 0; i < data[0].length; i++) {
      const x = 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.fillColor("#1976D2").font("Helvetica-Bold").text(data[0][i], x + cellPadding2, startY + (rowHeight2 - 20) / 2, {
        width: columnWidths[i] - cellPadding2 * 2,
        align: "left"
      });
    }
    doc.y = startY + rowHeight2;
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      if (doc.y + rowHeight2 > doc.page.height - 100) {
        doc.addPage();
      }
      const rowY = doc.y;
      doc.fillColor(((_a = options.rowColors) == null ? void 0 : _a[rowIndex - 1]) || "#FFFFFF").rect(50, rowY, totalWidth, rowHeight2).fill();
      for (let colIndex = 0; colIndex < data[rowIndex].length; colIndex++) {
        const x = 50 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        doc.fillColor("#000000").font("Helvetica").text(data[rowIndex][colIndex], x + cellPadding2, rowY + (rowHeight2 - 20) / 2, {
          width: columnWidths[colIndex] - cellPadding2 * 2,
          align: "left"
        });
      }
      doc.strokeColor("#E0E0E0").moveTo(50, rowY + rowHeight2).lineTo(50 + totalWidth, rowY + rowHeight2).stroke();
      doc.y = rowY + rowHeight2;
    }
    doc.y += 20;
  };
  const createBarChart = (data, title) => {
    const startY = doc.y;
    const chartHeight = 150;
    const barWidth = 40;
    const spacing = 200;
    const startX = 150;
    doc.font("Helvetica-Bold").fontSize(14).text(title, { align: "center" }).moveDown();
    data.forEach((item, index) => {
      const x = startX + (barWidth + spacing) * index;
      const barHeight = item.value / item.max * chartHeight;
      const color = item.value > item.max * 0.8 ? "#F44336" : item.value > item.max * 0.6 ? "#FF9800" : "#4CAF50";
      doc.fillColor(color).rect(x, startY + chartHeight - barHeight + 30, barWidth, barHeight).fill();
      doc.font("Helvetica").fontSize(11).fillColor("#000000").text(item.label, x - 50, startY + chartHeight + 40, {
        width: barWidth + 100,
        align: "center"
      });
      doc.font("Helvetica").fontSize(11).fillColor("#000000").text(item.value.toString(), x - 50, startY + chartHeight + 60, {
        width: barWidth + 100,
        align: "center"
      });
    });
    doc.y = startY + chartHeight + 90;
  };
  doc.font("Helvetica-Bold").fontSize(24).fillColor("#2196F3").text("SEO Audit Report", { align: "center" }).moveDown();
  doc.font("Helvetica").fontSize(14).fillColor("#000000").text(`Analyzed URL: ${url}`, { align: "left" }).text(`Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`, { align: "left" }).moveDown();
  doc.moveDown();
  const titleWritten = ensureSpace(400, "Summary");
  if (!titleWritten) {
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Summary", { underline: true }).moveDown();
  }
  doc.font("Helvetica").fontSize(12).fillColor("#000000");
  const summaryData = [
    ["Metric", "Value"],
    ["Pages analyzed", report.summary.totalPages.toString()],
    ["Average loading time", `${(report.summary.averageLoadTime / 1e3).toFixed(2)}s`],
    ["Total warnings", report.summary.totalWarnings.toString()],
    ["Pages without title", report.summary.missingTitles.toString()],
    ["Pages without description", report.summary.missingDescriptions.toString()],
    ["Images without alt", report.summary.missingAltTags.toString()],
    ["Average First Contentful Paint", `${(report.summary.averageFCP / 1e3).toFixed(2)}s`],
    ["Average Largest Contentful Paint", `${(report.summary.averageLCP / 1e3).toFixed(2)}s`],
    ["Average Time to First Byte", `${(report.summary.averageTTFB / 1e3).toFixed(2)}s`],
    ["Pages with structured data", `${report.summary.pagesWithStructuredData} (${Math.round(report.summary.pagesWithStructuredData / report.summary.totalPages * 100)}%)`],
    ["Pages with social tags", `${report.summary.pagesWithSocialTags} (${Math.round(report.summary.pagesWithSocialTags / report.summary.totalPages * 100)}%)`],
    ["Mobile compatible pages", `${report.summary.mobileCompatiblePages} (${Math.round(report.summary.mobileCompatiblePages / report.summary.totalPages * 100)}%)`],
    ["Secure pages (HTTPS)", `${report.summary.securePages} (${Math.round(report.summary.securePages / report.summary.totalPages * 100)}%)`]
  ];
  let yPosition = doc.y;
  const cellPadding = 8;
  const columnWidth = 200;
  doc.fillColor("#E3F2FD").rect(50, yPosition, columnWidth * 2, 30).fill();
  doc.fillColor("#1976D2").text(summaryData[0][0], 50 + cellPadding, yPosition + cellPadding).text(summaryData[0][1], 50 + columnWidth, yPosition + cellPadding);
  yPosition += 30;
  const rowHeight = 30;
  const totalTableHeight = rowHeight * (summaryData.length - 1);
  if (yPosition + totalTableHeight > doc.page.height - 100) {
    doc.addPage();
    yPosition = 50;
    doc.fillColor("#E3F2FD").rect(50, yPosition, columnWidth * 2, 30).fill();
    doc.fillColor("#1976D2").text(summaryData[0][0], 50 + cellPadding, yPosition + cellPadding).text(summaryData[0][1], 50 + columnWidth, yPosition + cellPadding);
    yPosition += 30;
  }
  for (let i = 1; i < summaryData.length; i++) {
    doc.fillColor("#000000").text(summaryData[i][0], 50 + cellPadding, yPosition + cellPadding).text(summaryData[i][1], 50 + columnWidth, yPosition + cellPadding);
    doc.strokeColor("#E0E0E0").moveTo(50, yPosition + 30).lineTo(50 + columnWidth * 2, yPosition + 30).stroke();
    yPosition += 30;
    if (yPosition > doc.page.height - 100) {
      doc.addPage();
      yPosition = 50;
    }
  }
  if (yPosition + 150 > doc.page.height - 100) {
    doc.addPage();
    yPosition = 50;
  } else {
    doc.moveDown(2);
  }
  ensureSpace(200, "Performance Metrics");
  if (!titleWritten) {
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Performance Metrics", { underline: true }).moveDown();
  }
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("The Core Web Vitals and performance metrics are crucial for SEO because they affect user experience and ranking in search engines.", { align: "left" }).moveDown();
  const createPerformanceMeter = (label, value, good, poor, unit = "ms") => {
    const y = doc.y;
    doc.text(`${label}: ${(value / 1e3).toFixed(2)}s`, 50, y);
    doc.strokeColor("#E0E0E0").lineWidth(10).moveTo(50, y + 15).lineTo(450, y + 15).stroke();
    let color = "#4CAF50";
    if (value > poor) color = "#F44336";
    else if (value > good) color = "#FF9800";
    const barLength = Math.min(400, value / poor * 400);
    doc.strokeColor(color).lineWidth(10).moveTo(50, y + 15).lineTo(50 + barLength, y + 15).stroke();
    doc.moveDown(1.5);
  };
  createPerformanceMeter("First Contentful Paint (FCP)", report.summary.averageFCP, 1e3, 3e3);
  createPerformanceMeter("Largest Contentful Paint (LCP)", report.summary.averageLCP, 2500, 4e3);
  createPerformanceMeter("Time to First Byte (TTFB)", report.summary.averageTTFB, 500, 1500);
  ensureSpace(500, "Page Analysis");
  if (!titleWritten) {
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Page Analysis", { underline: true }).moveDown();
  }
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("Here is the detailed analysis of your site pages, sorted by the number of issues detected. This analysis helps quickly identify pages that need special attention.", { align: "left" }).moveDown();
  const pagesData = Object.entries(report.seoResults).map(([url2, result]) => ({
    url: url2,
    warnings: result.warnings.length,
    score: calculateOverallScore(result)
  })).sort((a, b) => b.warnings - a.warnings).slice(0, 5);
  const pagesTableData = [
    ["URL", "Issues", "SEO Score"],
    ...pagesData.map((page) => [
      page.url.length > 40 ? page.url.substring(0, 37) + "..." : page.url,
      page.warnings.toString(),
      `${page.score}%`
    ])
  ];
  createTable(pagesTableData, {
    headerColor: "#E3F2FD",
    rowColors: ["#FFFFFF", "#F5F5F5", "#FFFFFF", "#F5F5F5", "#FFFFFF"],
    columnWidths: [300, 100, 100]
  });
  ensureSpace(300, "Mobile Compatibility");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("Mobile compatibility is a crucial factor for SEO. A well-optimized site for mobile offers a better user experience and is favored by Google.", { align: "left" }).moveDown();
  const mobileData = [
    { label: "Optimized Pages", value: report.summary.mobileCompatiblePages, max: report.summary.totalPages },
    { label: "Pages to Optimize", value: report.summary.totalPages - report.summary.mobileCompatiblePages, max: report.summary.totalPages }
  ];
  createBarChart(mobileData, "Mobile Compatibility Status");
  ensureSpace(300, "Structured Data & Social Tags");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  const socialText = "Structured data and social tags improve the visibility of your content in search results and on social networks.";
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text(socialText, 50, doc.y, { align: "left", width: 500 }).moveDown();
  const socialPercentage = Math.round(report.summary.pagesWithSocialTags / report.summary.totalPages * 100);
  const structuredDataPercentage = Math.round(report.summary.pagesWithStructuredData / report.summary.totalPages * 100);
  const socialData = [
    ["Type", "Status", "Details"],
    ["Social Tags", socialPercentage === 100 ? "Optimized" : "To Improve", `${socialPercentage}% of pages have social tags`],
    ["Structured Data", structuredDataPercentage === 100 ? "Optimized" : "To Improve", `${structuredDataPercentage}% of pages have structured data`]
  ];
  createTable(socialData, {
    headerColor: "#E3F2FD",
    rowColors: ["#FFFFFF", "#F5F5F5"],
    columnWidths: [150, 150, 220]
  });
  ensureSpace(300, "Security Evaluation");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  const securityText = "Security is essential for SEO and user trust. A secure site is better ranked by Google.";
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text(securityText, 50, doc.y, { align: "left", width: 500 }).moveDown();
  const securePercentage = Math.round(report.summary.securePages / report.summary.totalPages * 100);
  const securityData = [
    ["Metric", "Status", "Details"],
    ["HTTPS", securePercentage === 100 ? "Secure" : "To Secure", `${securePercentage}% of pages`],
    ["SSL Certificate", report.summary.securePages === report.summary.totalPages ? "Valid" : "To Verify", "Required Configuration"]
  ];
  createTable(securityData, {
    headerColor: "#E3F2FD",
    rowColors: ["#FFFFFF", "#F5F5F5"],
    columnWidths: [150, 150, 220]
  });
  ensureSpace(400, "SEO Recommendations");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  const recommendationsText = "Here are the top priority recommendations to improve your site ranking and user experience. Start with critical points for the best results.";
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text(recommendationsText, 50, doc.y, { align: "left", width: 500 }).moveDown();
  const recommendations = [];
  if (report.summary.missingTitles > 0) {
    recommendations.push(`Add title tags to the ${report.summary.missingTitles} pages that are missing them.`);
  }
  if (report.summary.missingDescriptions > 0) {
    recommendations.push(`Add meta descriptions to the ${report.summary.missingDescriptions} pages that are missing them.`);
  }
  if (report.summary.missingAltTags > 0) {
    recommendations.push(`Add alt attributes to the ${report.summary.missingAltTags} images that are missing them.`);
  }
  if (report.summary.averageLCP > 2500) {
    recommendations.push("Improve the Largest Contentful Paint (LCP) by optimizing image loading and server response time.");
  }
  if (report.summary.pagesWithStructuredData < report.summary.totalPages) {
    recommendations.push("Add structured data (Schema.org) for better rich snippets in search results.");
  }
  if (report.summary.mobileCompatiblePages < report.summary.totalPages) {
    recommendations.push("Ensure all pages have appropriate viewport meta tags for mobile compatibility.");
  }
  if (report.summary.securePages < report.summary.totalPages) {
    recommendations.push("Migrate all pages to HTTPS for improved security and SEO ranking.");
  }
  if (report.summary.pagesWithSocialTags < report.summary.totalPages) {
    recommendations.push("Add Open Graph and Twitter Card tags for better sharing on social networks.");
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Continue monitoring your site performance and making gradual improvements.",
      "Regularly check broken links and fix them quickly.",
      "Consider adding more quality content to improve authority and relevance."
    );
  }
  const recommendationsData = [
    ["Priority", "Recommendation"],
    ...recommendations.map((rec, index) => [
      index < 3 ? "High" : index < 6 ? "Medium" : "Low",
      rec
    ])
  ];
  createTable(recommendationsData, {
    headerColor: "#E3F2FD",
    columnWidths: [100, 400],
    rowColors: recommendations.map(
      (_, index) => index < 3 ? "#FFF3E0" : index < 6 ? "#E3F2FD" : "#E8F5E9"
    )
  });
  doc.addPage();
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Conclusion", { underline: true }).moveDown();
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("This SEO audit report provides a complete overview of your website. The proposed recommendations aim to improve your visibility in search engines and user experience.", { align: "left" }).moveDown().text("For optimal results, it is recommended to:", { align: "left" }).moveDown(0.5).text("\u2022 Implement the top priority recommendations first", { align: "left" }).text("\u2022 Regularly monitor your site performance", { align: "left" }).text("\u2022 Perform periodic SEO audits to track progress", { align: "left" }).text("\u2022 Stay up-to-date with the latest SEO trends and best practices", { align: "left" }).moveDown(2);
  doc.font("Helvetica").fontSize(10).fillColor("#666666").text("This report was automatically generated by the SEO audit tool.", { align: "center" }).text(`\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} DevUnity - All rights reserved`, { align: "center" });
  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
});

const seoAudit_pdf_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: seoAudit_pdf_post
});

const seoAudit = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url;
  const options = body.options || {};
  if (!url) {
    throw createError({
      statusCode: 400,
      message: "Missing URL"
    });
  }
  const MAX_DEPTH = options.maxDepth || 2;
  const SAME_DOMAIN_ONLY = options.sameDomainOnly !== false;
  const TIMEOUT = options.timeout || 3e4;
  const visitedURLs = /* @__PURE__ */ new Set();
  const urlMap = {};
  const seoResults = {};
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const protocol = urlObj.protocol;
  const baseUrl = `${protocol}//${domain}`;
  let robotsTxtContent = "";
  let robotsTxtFound = false;
  try {
    const robotsUrl = `${baseUrl}/robots.txt`;
    const robotsResponse = await axios.get(robotsUrl, { timeout: 5e3 });
    if (robotsResponse.status === 200) {
      robotsTxtContent = robotsResponse.data;
      robotsTxtFound = true;
    }
  } catch (error) {
    console.error("Error fetching robots.txt:", error);
  }
  let sitemapFound = false;
  let sitemapUrl = "";
  let sitemapUrls = 0;
  if (robotsTxtFound) {
    const sitemapMatches = robotsTxtContent.match(/Sitemap:\s*(.+)/gi);
    if (sitemapMatches && sitemapMatches.length > 0) {
      const sitemapLine = sitemapMatches[0];
      sitemapUrl = sitemapLine.replace(/Sitemap:\s*/i, "").trim();
      sitemapFound = true;
    }
  }
  if (!sitemapFound) {
    const commonSitemapPaths = [
      "/sitemap.xml",
      "/sitemap_index.xml",
      "/sitemap-index.xml",
      "/sitemap.php",
      "/sitemap.txt"
    ];
    for (const path of commonSitemapPaths) {
      try {
        const potentialSitemapUrl = `${baseUrl}${path}`;
        const response = await axios.get(potentialSitemapUrl, { timeout: 5e3 });
        if (response.status === 200 && response.data && (response.data.includes("<urlset") || response.data.includes("<sitemapindex"))) {
          sitemapUrl = potentialSitemapUrl;
          sitemapFound = true;
          break;
        }
      } catch (error) {
      }
    }
  }
  if (sitemapFound && sitemapUrl) {
    try {
      const sitemapResponse = await axios.get(sitemapUrl, { timeout: 1e4 });
      if (sitemapResponse.status === 200) {
        const xmlData = sitemapResponse.data;
        try {
          const parser = new XMLParser({ ignoreAttributes: false });
          const parsedXml = parser.parse(xmlData);
          if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
            const sitemaps = Array.isArray(parsedXml.sitemapindex.sitemap) ? parsedXml.sitemapindex.sitemap : [parsedXml.sitemapindex.sitemap];
            sitemapUrls = sitemaps.length;
          } else if (parsedXml.urlset && parsedXml.urlset.url) {
            const urls = Array.isArray(parsedXml.urlset.url) ? parsedXml.urlset.url : [parsedXml.urlset.url];
            sitemapUrls = urls.length;
          }
        } catch (error) {
          console.error("Error parsing sitemap XML:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching sitemap:", error);
    }
  }
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true
  });
  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(TIMEOUT);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
    const analyzePage = async (pageUrl) => {
      var _a;
      const startTime = Date.now();
      let response;
      try {
        response = await page.goto(pageUrl, {
          waitUntil: "networkidle0",
          timeout: TIMEOUT
        });
      } catch (error) {
        console.error(`Error loading ${pageUrl}:`, error.message);
        return {
          url: pageUrl,
          title: "",
          description: "",
          h1: [],
          h2: [],
          h3: [],
          metaTags: [],
          robotsMeta: {
            index: true,
            follow: true,
            noindex: false,
            nofollow: false,
            noarchive: false,
            nosnippet: false,
            noodp: false
          },
          imageAlt: [],
          videoInfo: [],
          loadTime: 0,
          statusCode: 0,
          internalLinks: [],
          externalLinks: [],
          warnings: [{
            message: `Loading error: ${error.message}`,
            severity: "high",
            type: "loading"
          }],
          coreWebVitals: {
            FCP: 0,
            LCP: 0,
            TTFB: 0,
            domLoad: 0
          },
          headingStructure: {
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: []
          },
          structuredData: [],
          socialTags: {
            ogTags: [],
            twitterTags: []
          },
          mobileCompatibility: {
            hasViewport: false,
            viewportContent: "",
            smallTouchTargets: 0
          },
          securityChecks: {
            https: pageUrl.startsWith("https"),
            validCertificate: false,
            securityHeaders: []
          },
          links: {
            internal: [],
            external: []
          },
          contentStats: {
            wordCount: 0,
            keywordDensity: 0,
            readabilityScore: 0
          },
          technicalSEO: {
            sitemapFound,
            sitemapUrl,
            sitemapUrls,
            robotsTxtFound,
            robotsTxtContent,
            schemaTypeCount: {}
          }
        };
      }
      const loadTime = Date.now() - startTime;
      const result = {
        url: pageUrl,
        title: "",
        description: "",
        h1: [],
        h2: [],
        h3: [],
        metaTags: [],
        robotsMeta: {
          index: true,
          follow: true,
          noindex: false,
          nofollow: false,
          noarchive: false,
          nosnippet: false,
          noodp: false
        },
        imageAlt: [],
        videoInfo: [],
        loadTime,
        statusCode: response ? response.status() : 0,
        internalLinks: [],
        externalLinks: [],
        warnings: [],
        coreWebVitals: {
          FCP: 0,
          LCP: 0,
          TTFB: 0,
          domLoad: 0
        },
        headingStructure: {
          h1: [],
          h2: [],
          h3: [],
          h4: [],
          h5: [],
          h6: []
        },
        structuredData: [],
        socialTags: {
          ogTags: [],
          twitterTags: []
        },
        mobileCompatibility: {
          hasViewport: false,
          viewportContent: "",
          smallTouchTargets: 0
        },
        securityChecks: {
          https: pageUrl.startsWith("https"),
          validCertificate: response ? !((_a = response.securityDetails()) == null ? void 0 : _a.validTo) : false,
          securityHeaders: []
        },
        links: {
          internal: [],
          external: []
        },
        contentStats: {
          wordCount: 0,
          keywordDensity: 0,
          readabilityScore: 0
        },
        technicalSEO: {
          sitemapFound,
          sitemapUrl,
          sitemapUrls,
          robotsTxtFound,
          robotsTxtContent,
          schemaTypeCount: {}
        }
      };
      result.title = await page.title();
      result.description = await page.$eval('meta[name="description"]', (el) => el.getAttribute("content") || "").catch(() => "");
      result.h1 = await page.$$eval("h1", (elements) => elements.map((el) => el.textContent || ""));
      result.h2 = await page.$$eval("h2", (elements) => elements.map((el) => el.textContent || ""));
      result.h3 = await page.$$eval("h3", (elements) => elements.map((el) => el.textContent || ""));
      result.metaTags = await page.$$eval(
        "meta",
        (elements) => elements.map((el) => ({
          name: el.getAttribute("name") || "",
          content: el.getAttribute("content") || ""
        })).filter((tag) => tag.name && tag.content)
      );
      result.imageAlt = await page.$$eval("img", (elements, pageUrl2) => {
        return elements.map((el) => {
          const src = el.getAttribute("src") || "";
          const alt = el.getAttribute("alt") || "";
          const title = el.getAttribute("title") || "";
          const width = el.getAttribute("width") || "";
          const height = el.getAttribute("height") || "";
          let fullSrc = src;
          if (src && !src.startsWith("data:") && !src.match(/^(http|https):\/\//)) {
            try {
              if (src.startsWith("/")) {
                const urlObj2 = new URL(pageUrl2);
                fullSrc = `${urlObj2.protocol}//${urlObj2.host}${src}`;
              } else {
                const baseUrl2 = pageUrl2.endsWith("/") ? pageUrl2 : pageUrl2.substring(0, pageUrl2.lastIndexOf("/") + 1);
                fullSrc = new URL(src, baseUrl2).href;
              }
            } catch (e) {
              console.error("Error resolving image URL:", e);
              fullSrc = src;
            }
          }
          return {
            src: fullSrc,
            alt,
            title: title || alt,
            width,
            height,
            hasDimensions: !!(width && height)
          };
        });
      }, pageUrl);
      result.videoInfo = await page.$$eval("video", (elements, pageUrl2) => {
        return elements.map((el) => {
          const src = el.getAttribute("src") || "";
          const type = el.getAttribute("type") || "";
          const width = el.getAttribute("width") || "";
          const height = el.getAttribute("height") || "";
          const title = el.getAttribute("title") || "";
          const description = el.getAttribute("data-description") || "";
          const thumbnail = el.getAttribute("poster") || "";
          let fullSrc = src;
          if (src && !src.startsWith("data:") && !src.match(/^(http|https):\/\//)) {
            try {
              if (src.startsWith("/")) {
                const urlObj2 = new URL(pageUrl2);
                fullSrc = `${urlObj2.protocol}//${urlObj2.host}${src}`;
              } else {
                const baseUrl2 = pageUrl2.endsWith("/") ? pageUrl2 : pageUrl2.substring(0, pageUrl2.lastIndexOf("/") + 1);
                fullSrc = new URL(src, baseUrl2).href;
              }
            } catch (e) {
              console.error("Error resolving video URL:", e);
              fullSrc = src;
            }
          }
          return {
            src: fullSrc,
            type,
            width,
            height,
            title,
            description,
            thumbnail,
            hasDimensions: !!(width && height)
          };
        });
      }, pageUrl);
      const links = await page.$$eval(
        "a",
        (elements) => elements.map((el) => el.href).filter((href) => href && !href.startsWith("javascript:"))
      );
      const pageUrlObj = new URL(pageUrl);
      result.internalLinks = links.filter((link) => {
        try {
          const linkUrl = new URL(link);
          return linkUrl.hostname === pageUrlObj.hostname;
        } catch {
          return false;
        }
      });
      result.externalLinks = links.filter((link) => !result.internalLinks.includes(link));
      result.coreWebVitals = await page.evaluate(() => {
        var _a2;
        const performanceEntries = performance.getEntriesByType("navigation");
        const paintEntries = performance.getEntriesByType("paint");
        const FCP = ((_a2 = paintEntries.find((entry) => entry.name === "first-contentful-paint")) == null ? void 0 : _a2.startTime) || 0;
        const navEntry = performanceEntries[0];
        const LCP = (navEntry == null ? void 0 : navEntry.domContentLoadedEventEnd) || 0;
        return {
          FCP,
          LCP,
          TTFB: (navEntry == null ? void 0 : navEntry.responseStart) || 0,
          domLoad: (navEntry == null ? void 0 : navEntry.domContentLoadedEventEnd) || 0
        };
      });
      result.headingStructure = await page.evaluate(() => {
        const headings = {};
        ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
          headings[tag] = Array.from(document.querySelectorAll(tag)).map((el) => {
            var _a2;
            return ((_a2 = el.textContent) == null ? void 0 : _a2.trim()) || "";
          }).filter((text) => text);
        });
        return headings;
      });
      result.structuredData = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((script) => {
          try {
            return JSON.parse(script.textContent || "{}");
          } catch (e) {
            return null;
          }
        }).filter((data) => data);
      });
      const schemaTypeCount = {};
      for (const schema of result.structuredData) {
        try {
          if (schema && schema["@type"]) {
            const type = schema["@type"];
            if (Array.isArray(type)) {
              type.forEach((t) => {
                schemaTypeCount[t] = (schemaTypeCount[t] || 0) + 1;
              });
            } else {
              schemaTypeCount[type] = (schemaTypeCount[type] || 0) + 1;
            }
          }
        } catch (error) {
          console.error("Error parsing schema type:", error);
        }
      }
      result.technicalSEO.schemaTypeCount = schemaTypeCount;
      result.socialTags = await page.evaluate(() => {
        const ogTags = Array.from(document.querySelectorAll('meta[property^="og:"]')).map((tag) => ({
          property: tag.getAttribute("property"),
          content: tag.getAttribute("content")
        }));
        const twitterTags = Array.from(document.querySelectorAll('meta[name^="twitter:"]')).map((tag) => ({
          name: tag.getAttribute("name"),
          content: tag.getAttribute("content")
        }));
        return { ogTags, twitterTags };
      });
      result.mobileCompatibility = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        const touchTargets = document.querySelectorAll("a, button, input, select, textarea");
        const smallTouchTargets = Array.from(touchTargets).filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        }).length;
        return {
          hasViewport: !!viewport,
          viewportContent: (viewport == null ? void 0 : viewport.getAttribute("content")) || "",
          smallTouchTargets
        };
      });
      if (response) {
        const headers = response.headers();
        result.securityChecks.securityHeaders = Object.entries(headers).filter(([name]) => [
          "content-security-policy",
          "strict-transport-security",
          "x-content-type-options",
          "x-frame-options",
          "x-xss-protection"
        ].includes(name.toLowerCase())).map(([name, value]) => ({ name, value: String(value) }));
      }
      const robotsMeta = result.metaTags.filter((tag) => tag.name.toLowerCase() === "robots");
      if (robotsMeta.length > 0) {
        const content = robotsMeta[0].content.toLowerCase();
        const hasIndex = !content.includes("noindex");
        const hasFollow = !content.includes("nofollow");
        if (!hasIndex) {
          result.warnings.push({
            message: "The page is configured to not be indexed (noindex)",
            severity: "high",
            type: "meta"
          });
        }
        if (!hasFollow) {
          result.warnings.push({
            message: "The page is configured to not follow links (nofollow)",
            severity: "medium",
            type: "meta"
          });
        }
      }
      if (!result.title) result.warnings.push({
        message: "Missing title",
        severity: "high",
        type: "title"
      });
      if (!result.description) result.warnings.push({
        message: "Missing meta description",
        severity: "high",
        type: "description"
      });
      if (result.h1.length === 0) result.warnings.push({
        message: "Missing H1 tag",
        severity: "high",
        type: "h1"
      });
      if (result.h1.length > 1) result.warnings.push({
        message: "Multiple H1 tags detected",
        severity: "medium",
        type: "h1"
      });
      result.imageAlt.forEach((img) => {
        if (!img.alt) result.warnings.push({
          message: `Image without alt attribute: ${img.src}`,
          severity: "medium",
          type: "image"
        });
      });
      if (!result.mobileCompatibility.hasViewport) result.warnings.push({
        message: "Missing viewport meta tag",
        severity: "high",
        type: "mobile"
      });
      if (result.mobileCompatibility.smallTouchTargets > 0) {
        result.warnings.push({
          message: `${result.mobileCompatibility.smallTouchTargets} touch targets too small for mobile`,
          severity: "medium",
          type: "mobile"
        });
      }
      if (!result.securityChecks.https) result.warnings.push({
        message: "Site not using HTTPS",
        severity: "high",
        type: "security"
      });
      if (result.socialTags.ogTags.length === 0 && result.socialTags.twitterTags.length === 0) {
        result.warnings.push({
          message: "Missing social media tags (Open Graph / Twitter Cards)",
          severity: "medium",
          type: "social"
        });
      }
      if (result.structuredData.length === 0) {
        result.warnings.push({
          message: "No structured data (Schema.org) detected",
          severity: "medium",
          type: "structured-data"
        });
      }
      if (result.coreWebVitals.LCP > 2500) {
        result.warnings.push({
          message: "Largest Contentful Paint (LCP) too slow (> 2.5s)",
          severity: "high",
          type: "performance"
        });
      }
      if (result.coreWebVitals.FCP > 1e3) {
        result.warnings.push({
          message: "First Contentful Paint (FCP) too slow (> 1s)",
          severity: "medium",
          type: "performance"
        });
      }
      const bodyText = await page.$eval("body", (el) => el.textContent || "");
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
      let keywordDensity = 1.5;
      if (result.title) {
        const titleWords = result.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const h1Words = result.h1.join(" ").toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const potentialKeywords = [...titleWords, ...h1Words];
        if (potentialKeywords.length > 0 && wordCount > 0) {
          const keywordCounts = potentialKeywords.reduce((acc, word) => {
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            const matches = bodyText.match(regex) || [];
            return acc + matches.length;
          }, 0);
          keywordDensity = Math.min(4, Math.max(0.5, keywordCounts / wordCount * 100));
        }
      }
      const readabilityScore = 65 + (result.headingStructure.h2.length > 1 ? 10 : 0) + (result.headingStructure.h3.length > 2 ? 5 : 0) + (result.description ? 10 : 0) + (result.headingStructure.h2.length > 0 && result.headingStructure.h3.length > 0 ? 10 : 0);
      result.contentStats = {
        wordCount,
        keywordDensity,
        readabilityScore: Math.min(100, readabilityScore)
      };
      result.links = {
        internal: result.internalLinks,
        external: result.externalLinks
      };
      if (!sitemapFound) {
        result.warnings.push({
          message: "No sitemap.xml found",
          severity: "medium",
          type: "general"
        });
      }
      if (!robotsTxtFound) {
        result.warnings.push({
          message: "No robots.txt found",
          severity: "medium",
          type: "general"
        });
      }
      if (Object.keys(schemaTypeCount).length === 0) {
        result.warnings.push({
          message: "No Schema.org markup found",
          severity: "medium",
          type: "structured-data"
        });
      }
      return result;
    };
    const crawlPage = async (pageUrl, depth = 0) => {
      if (depth > MAX_DEPTH || visitedURLs.has(pageUrl)) return;
      try {
        visitedURLs.add(pageUrl);
        const result = await analyzePage(pageUrl);
        seoResults[pageUrl] = result;
        urlMap[pageUrl] = result.internalLinks;
        if (depth < MAX_DEPTH) {
          const linksToVisit = SAME_DOMAIN_ONLY ? result.internalLinks : [...result.internalLinks, ...result.externalLinks];
          for (const link of linksToVisit) {
            if (!visitedURLs.has(link)) {
              await crawlPage(link, depth + 1);
            }
          }
        }
      } catch (error) {
        console.error(`Error crawling ${pageUrl}:`, error);
      }
    };
    await crawlPage(url);
    const totalPages = Object.keys(seoResults).length;
    const totalLoadTime = Object.values(seoResults).reduce((sum, result) => sum + result.loadTime, 0);
    const totalWarnings = Object.values(seoResults).reduce((sum, result) => sum + result.warnings.length, 0);
    const missingTitles = Object.values(seoResults).filter((result) => !result.title).length;
    const missingDescriptions = Object.values(seoResults).filter((result) => !result.description).length;
    const missingAltTags = Object.values(seoResults).reduce(
      (sum, result) => sum + result.imageAlt.filter((img) => !img.alt).length,
      0
    );
    const totalFCP = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.FCP, 0);
    const totalLCP = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.LCP, 0);
    const totalTTFB = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.TTFB, 0);
    const pagesWithStructuredData = Object.values(seoResults).filter((result) => result.structuredData.length > 0).length;
    const pagesWithSocialTags = Object.values(seoResults).filter(
      (result) => result.socialTags.ogTags.length > 0 || result.socialTags.twitterTags.length > 0
    ).length;
    const mobileCompatiblePages = Object.values(seoResults).filter((result) => result.mobileCompatibility.hasViewport).length;
    const securePages = Object.values(seoResults).filter((result) => result.securityChecks.https).length;
    const report = {
      urlMap,
      visitedURLs: Array.from(visitedURLs),
      seoResults,
      summary: {
        totalPages,
        averageLoadTime: totalPages > 0 ? totalLoadTime / totalPages : 0,
        totalWarnings,
        missingTitles,
        missingDescriptions,
        missingAltTags,
        averageFCP: totalPages > 0 ? totalFCP / totalPages : 0,
        averageLCP: totalPages > 0 ? totalLCP / totalPages : 0,
        averageTTFB: totalPages > 0 ? totalTTFB / totalPages : 0,
        pagesWithStructuredData,
        pagesWithSocialTags,
        mobileCompatiblePages,
        securePages
      }
    };
    return report;
  } finally {
    await browser.close();
  }
});

const seoAudit$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: seoAudit
});

const addFavorite = defineEventHandler(async (event) => {
  const { snippetId } = await readBody(event);
  const userId = event.context.user.id;
  try {
    const insertFavorite = await pool.execute("INSERT INTO favorites_snippets (snippet_id, user_id) VALUES (?, ?)", [snippetId, userId]);
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const addFavorite$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: addFavorite
});

const addSnippets = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  console.log(body);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  try {
    if (body.publishWorld === true) {
      const [worldSnippetsRows] = await pool.execute("INSERT INTO world_snippets (img, title, description, username, framework, snippet_date) VALUES (?, ?, ?, ?, ?, ?)", [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date
      ]);
      const [personalSnippetsRows] = await pool.execute("INSERT INTO personal_snippets (img, title, description, username, framework, snippet_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date,
        userId
      ]);
      return {
        success: true
      };
    } else {
      const [personalSnippetsRows] = await pool.execute("INSERT INTO personal_snippets (img, title, description, username, framework, snippet_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date,
        userId
      ]);
      return {
        success: true
      };
    }
  } catch (err) {
    console.error("Error add snippets :", err.message, err.stack);
  }
});

const addSnippets$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: addSnippets
});

const deleteSnippet = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  if (!userId) {
    return {
      success: false,
      error: "Utilisateur non authentifi\xE9"
    };
  }
  if (!body.id) {
    return {
      success: false,
      error: "ID du snippet manquant"
    };
  }
  try {
    if (body.type === "world") {
      const [ownerCheck] = await pool.execute(
        "SELECT user_id FROM world_snippets WHERE id = ?",
        [body.id]
      );
      if (!ownerCheck.length || ownerCheck[0].user_id !== userId) {
        return {
          success: false,
          error: "Vous n'\xEAtes pas autoris\xE9 \xE0 supprimer ce snippet"
        };
      }
      await pool.execute("DELETE FROM world_snippets WHERE id = ?", [body.id]);
      return {
        success: true,
        message: "Snippet mondial supprim\xE9 avec succ\xE8s"
      };
    } else {
      const [result] = await pool.execute(
        "DELETE FROM personal_snippets WHERE id = ? AND user_id = ?",
        [body.id, userId]
      );
      if (result.affectedRows === 0) {
        return {
          success: false,
          error: "Snippet personnel non trouv\xE9 ou non autoris\xE9"
        };
      }
      return {
        success: true,
        message: "Snippet personnel supprim\xE9 avec succ\xE8s"
      };
    }
  } catch (err) {
    console.error("Erreur lors de la suppression du snippet:", err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const deleteSnippet$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: deleteSnippet
});

const loadSnippets = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    const [personalSnippetsRows] = await pool.execute("SELECT * FROM personal_snippets WHERE user_id = ?", [userId]);
    const [worldSnippetsRows] = await pool.execute("SELECT * FROM world_snippets");
    const [favoritesRows] = await pool.execute("SELECT * FROM favorites_snippets WHERE user_id = ?", [userId]);
    return {
      success: true,
      data: {
        personalSnippets: personalSnippetsRows,
        worldSnippets: worldSnippetsRows,
        favoritesSnippets: favoritesRows
      }
    };
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const loadSnippets$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: loadSnippets
});

const removeFavorite = defineEventHandler(async (event) => {
  const { snippetId } = await readBody(event);
  const userId = event.context.user.id;
  try {
    await pool.execute(
      "DELETE FROM favorites_snippets WHERE snippet_id = ? AND user_id = ?",
      [snippetId, userId]
    );
    return {
      success: true,
      message: "Favori supprim\xE9 avec succ\xE8s"
    };
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const removeFavorite$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: removeFavorite
});

const updateSnippet = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  console.log(body);
  try {
    if (body.type === "world") {
      const [worldSnippetsRows] = await pool.execute("UPDATE world_snippets SET content = ? WHERE id = ?", [body.code, body.id]);
      return {
        success: true,
        data: {
          worldSnippets: worldSnippetsRows
        }
      };
    } else {
      const [personalSnippetsRows] = await pool.execute("UPDATE personal_snippets SET content = ? WHERE id = ? AND user_id = ?", [body.code, body.id, userId]);
      return {
        success: true,
        data: {
          personalSnippet: personalSnippetsRows
        }
      };
    }
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const updateSnippet$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: updateSnippet
});

const _id__delete = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  const id = getRouterParam(event, "id");
  if (!id) {
    return {
      success: false,
      error: "ID manquant"
    };
  }
  try {
    const [schemas] = await pool.execute(
      "SELECT id FROM sql_schemas WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (!schemas.length) {
      return {
        success: false,
        error: "Sch\xE9ma non trouv\xE9 ou non autoris\xE9"
      };
    }
    await pool.execute(
      "DELETE FROM sql_schemas WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return {
      success: true
    };
  } catch (err) {
    console.error("Erreur lors de la suppression du sch\xE9ma SQL:", err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const _id__delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete
});

const loadSQLSchemas = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    const result = await pool.execute(
      "SELECT * FROM sql_schemas WHERE user_id = ?",
      [userId]
    );
    return {
      success: true,
      schemas: result[0]
    };
  } catch (err) {
    console.error("Erreur lors du chargement des sch\xE9mas SQL:", err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const loadSQLSchemas$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: loadSQLSchemas
});

const saveSQLSchema = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.user.id;
  try {
    const result = await pool.execute(
      "INSERT INTO sql_schemas (user_id, database_name, schema_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE schema_data = ?, updated_at = NOW()",
      [userId, body.databaseName, JSON.stringify(body), JSON.stringify(body)]
    );
    const insertId = result[0].insertId || result[0].affectedRows;
    return {
      success: true,
      id: insertId
    };
  } catch (err) {
    console.error("Erreur lors de la sauvegarde du sch\xE9ma SQL:", err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

const saveSQLSchema$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: saveSQLSchema
});

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

const _id_$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id_
});

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

const saveTemplate$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: saveTemplate
});

const config = {
  api: {
    bodyParser: false
  }
};
const upload = defineEventHandler(async (event) => {
  const client = new S3Client({
    region: "lon1",
    endpoint: "https://lon1.digitaloceanspaces.com",
    credentials: {
      accessKeyId: "DO00WJ394ATTR7FTRZCG",
      secretAccessKey: "G9jYkuDcfry2PMKHBLrUPCjTlLSHxf+p+axMK8Ri+X4"
    }
  });
  const form = new IncomingForm();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields2, files2) => {
      if (err) return reject(err);
      resolve({ fields: fields2, files: files2 });
    });
  });
  const file = Array.isArray(files.file) ? files.file[0] : files.file;
  if (!file) {
    return { success: false, error: "Aucun fichier envoy\xE9." };
  }
  const filePath = file.filepath;
  const fileName = `${Date.now()}-${file.originalFilename}`;
  const mimetype = file.mimetype;
  async function uploadFile(filePath2, fileName2, mimetype2) {
    const fileBuffer = fs.readFileSync(filePath2);
    const command = new PutObjectCommand({
      Bucket: "devroid",
      Key: fileName2,
      Body: fileBuffer,
      ACL: "public-read",
      ContentType: mimetype2
    });
    try {
      const result = await client.send(command);
      console.log("Upload r\xE9ussi :", result);
      return `https://devroid.lon1.digitaloceanspaces.com/${fileName2}`;
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      return { success: false, error: error.message };
    }
  }
  const uploadResult = await uploadFile(filePath, fileName, mimetype);
  if (typeof uploadResult === "string") {
    return { success: true, url: uploadResult };
  } else {
    return uploadResult;
  }
});

const upload$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  config: config,
  default: upload
});

const checkAdmin = defineEventHandler(async (event) => {
  var _a;
  try {
    const user = event.context.user;
    if (!user) {
      console.log("Utilisateur non authentifi\xE9 - check-admin");
      return {
        isAdmin: false,
        message: "Utilisateur non authentifi\xE9"
      };
    }
    const [rows] = await pool.execute(
      "SELECT isAdmin FROM users WHERE id = ?",
      [user.id]
    );
    const isAdmin = Array.isArray(rows) && rows.length > 0 && rows[0].isAdmin === 1;
    console.log(`V\xE9rification admin pour ${user.username} (${user.id}): ${isAdmin ? "OUI" : "NON"}`);
    return {
      isAdmin,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdminInDb: ((_a = rows[0]) == null ? void 0 : _a.isAdmin) === 1,
        isAdminInContext: user.isAdmin === 1
      },
      message: isAdmin ? "Utilisateur a le r\xF4le admin" : "Utilisateur n'a pas le r\xF4le admin"
    };
  } catch (error) {
    console.error("Erreur lors de la v\xE9rification du r\xF4le admin:", error);
    return {
      isAdmin: false,
      message: "Erreur lors de la v\xE9rification du r\xF4le admin"
    };
  }
});

const checkAdmin$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: checkAdmin
});

const loadData = defineEventHandler(async (event) => {
  var _a;
  const authHeader = getHeader(event, "authorization");
  console.log("Authorization header dans loadData:", authHeader ? "Pr\xE9sent" : "Absent");
  console.log("event.context:", event.context);
  console.log("event.context.user:", event.context.user);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  console.log("userId dans loadData:", userId);
  if (userId === void 0) {
    console.error("Erreur: userId est undefined dans loadData.ts");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        console.log("Tentative d'extraction de l'ID utilisateur depuis le token");
        return {
          success: false,
          error: "Utilisateur non authentifi\xE9 ou session expir\xE9e (token pr\xE9sent mais pas d'ID dans le contexte)"
        };
      } catch (err) {
        console.error("Erreur lors de l'extraction du token:", err);
      }
    }
    return {
      success: false,
      error: "Utilisateur non authentifi\xE9 ou session expir\xE9e"
    };
  }
  try {
    console.log("Ex\xE9cution des requ\xEAtes SQL avec userId:", userId);
    const [userRows] = await pool.execute("SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?", [userId]);
    console.log("userRows:", userRows);
    const [studioComponentsRows] = await pool.execute("SELECT * FROM studio_components WHERE user_id = ?", [userId]);
    console.log("Donn\xE9es r\xE9cup\xE9r\xE9es avec succ\xE8s");
    return {
      success: true,
      data: {
        userData: userRows,
        studioComponents: studioComponentsRows
      }
    };
  } catch (err) {
    console.error("Erreur lors du chargement des donn\xE9es :", err.message, err.stack);
    return {
      success: false,
      error: err.message || "Erreur lors du chargement des donn\xE9es"
    };
  }
});

const loadData$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: loadData
});

const updatePremium = defineEventHandler(async (event) => {
  var _a;
  try {
    console.log("API update-premium appel\xE9e");
    const token = (_a = getRequestHeader(event, "Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
      console.log("Token manquant dans la requ\xEAte");
      return {
        success: false,
        error: "Non autoris\xE9: token manquant"
      };
    }
    const body = await readBody(event);
    const { isPremium } = body;
    console.log(`Mise \xE0 jour du statut premium \xE0: ${isPremium ? "Premium" : "Standard"}`);
    if (isPremium === void 0) {
      return {
        success: false,
        error: "Param\xE8tre isPremium requis"
      };
    }
    console.log(`Mise \xE0 jour du statut premium pour l'utilisateur avec token \xE0 ${isPremium ? "Premium" : "Standard"}`);
    return {
      success: true,
      message: `Le statut premium a \xE9t\xE9 mis \xE0 jour avec succ\xE8s: ${isPremium ? "activ\xE9" : "d\xE9sactiv\xE9"}`
    };
  } catch (error) {
    console.error("Erreur lors de la mise \xE0 jour du statut premium:", error);
    return {
      success: false,
      error: "Erreur lors de la mise \xE0 jour du statut premium"
    };
  }
});

const updatePremium$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: updatePremium
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getClientManifest = () => import('file://C:/Users/djedi/Documents/.vscode/devroid/.nuxt/dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getServerEntry = () => import('file://C:/Users/djedi/Documents/.vscode/devroid/.nuxt/dist/server/server.mjs').then((r) => r.default || r);
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}

function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && ssrError.statusCode) {
    ssrError.statusCode = Number.parseInt(ssrError.statusCode);
  }
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const isRenderingIsland = event.path.startsWith("/__nuxt_island");
  const islandContext = isRenderingIsland ? await getIslandContext(event) : void 0;
  let url = ssrError?.url || islandContext?.url || event.path;
  const routeOptions = getRouteRules(event);
  const head = createHead(unheadOptions);
  const headEntryOptions = { mode: "server" };
  if (!isRenderingIsland) {
    head.push(appHead, headEntryOptions);
  }
  const ssrContext = {
    url,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || routeOptions.ssr === false && !isRenderingIsland || (false),
    head,
    error: !!ssrError,
    nuxt: void 0,
    /* NuxtApp */
    payload: ssrError ? { error: ssrError } : {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set(),
    islandContext
  };
  const renderer = ssrContext.noSSR ? await getSPARenderer() : await getSSRRenderer();
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  const inlinedStyles = isRenderingIsland ? await renderInlineStyles(ssrContext.modules ?? []) : [];
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest) {
    head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    head.push({ style: inlinedStyles });
  }
  {
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (!isRenderingIsland || resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      head.push({ link }, headEntryOptions);
    }
  }
  if (isRenderingIsland && islandContext) {
    const islandHead = {};
    for (const entry of head.entries.values()) {
      for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
        const currentValue = islandHead[key];
        if (Array.isArray(currentValue)) {
          currentValue.push(...value);
        }
        islandHead[key] = value;
      }
    }
    islandHead.link ||= [];
    islandHead.style ||= [];
    const islandResponse = {
      id: islandContext.id,
      head: islandHead,
      html: getServerComponentHTML(_rendered.html),
      components: getClientIslandResponse(ssrContext),
      slots: getSlotIslandResponse(ssrContext)
    };
    await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
    const response2 = {
      body: JSON.stringify(islandResponse, null, 2),
      statusCode: getResponseStatus(event),
      statusMessage: getResponseStatusText(event),
      headers: {
        "content-type": "application/json;charset=utf-8",
        "x-powered-by": "Nuxt"
      }
    };
    return response2;
  }
  if (!NO_SCRIPTS) {
    head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition: "head",
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(head, renderSSRHeadOptions);
  const htmlContext = {
    island: isRenderingIsland,
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  const response = {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
  return response;
});
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const renderer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: renderer
});

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: styles
});

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template
});
//# sourceMappingURL=index.mjs.map
