import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import * as mysql from 'mysql2/promise';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=g(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function g(...n){return function(...e){for(const t of n)t(...e);}}const m=_();class A extends m{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function S(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const C=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(C.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function O(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:S(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, undefined, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
const getHeaders = getRequestHeaders;
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(undefined);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return undefined;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== undefined) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [
    name,
    opts.domain || "",
    opts.path || "/",
    Boolean(opts.secure),
    Boolean(opts.httpOnly),
    Boolean(opts.sameSite)
  ].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => undefined);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== undefined) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : undefined;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : undefined;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === undefined ? undefined : await val;
      if (_body !== undefined) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, undefined);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, undefined);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, undefined)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, undefined, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, undefined, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, undefined, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === undefined && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

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

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

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
    "buildId": "2845db00-0d2d-4e92-b045-75df1e83f651",
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
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "stripe": {
      "publishableKey": "pk_test_TYooMQauvdEDq54NiTphI7jx"
    },
    "persistedState": {
      "storage": "cookies",
      "debug": false,
      "cookieOptions": {}
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

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
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
        const query = getQuery$1(event.path);
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
        const query = getQuery$1(event.path);
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
    return send(event, JSON.stringify(defaultRes.body, null, 2));
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
    const { template } = await import('./error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
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
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
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

const plugins = [
  
];

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"2a8de-E7knagobTcIc/SVSzZuilD8zNuk\"",
    "mtime": "2025-03-25T10:21:50.453Z",
    "size": 174302,
    "path": "../public/favicon.ico"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2-uoq1oCgLlTqpdDX/iUbLy7J1Wic\"",
    "mtime": "2025-03-23T10:53:11.055Z",
    "size": 2,
    "path": "../public/robots.txt"
  },
  "/images/preview-devunity.avif": {
    "type": "image/avif",
    "etag": "\"19e8b-yvmtBIvJGsTv3zxTb7dM64LKOjk\"",
    "mtime": "2025-03-27T08:48:57.381Z",
    "size": 106123,
    "path": "../public/images/preview-devunity.avif"
  },
  "/logo/devunity-letter.png": {
    "type": "image/png",
    "etag": "\"2030-7qryKRBoCqtdnab6vp6fwzrbnLg\"",
    "mtime": "2025-03-23T10:53:11.055Z",
    "size": 8240,
    "path": "../public/logo/devunity-letter.png"
  },
  "/logo/devunity-title.png": {
    "type": "image/png",
    "etag": "\"3bf6-562VSsVWOUNlpOi2/sl0hBUGYU4\"",
    "mtime": "2025-03-23T10:53:11.055Z",
    "size": 15350,
    "path": "../public/logo/devunity-title.png"
  },
  "/logo/devunity.png": {
    "type": "image/png",
    "etag": "\"6ea6-UneQ4eYJUXLyj0ciSFpkQPwGGS0\"",
    "mtime": "2025-03-23T10:53:11.055Z",
    "size": 28326,
    "path": "../public/logo/devunity.png"
  },
  "/logo/PRT RES FILE.jpg": {
    "type": "image/jpeg",
    "etag": "\"b50a-myqCXhQlrgNIqb/qjoJx/DfKLAY\"",
    "mtime": "2025-03-23T10:53:11.053Z",
    "size": 46346,
    "path": "../public/logo/PRT RES FILE.jpg"
  },
  "/logo/SOURCE FILE.ai": {
    "type": "application/postscript",
    "etag": "\"2c991-604aDuazsudzdwaQ4yceC5Y1nl8\"",
    "mtime": "2025-03-23T10:53:11.055Z",
    "size": 182673,
    "path": "../public/logo/SOURCE FILE.ai"
  },
  "/_nuxt/0cvrggvQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"efc-rJI3FM4KVma04TQa/TVKqWTGkFc\"",
    "mtime": "2025-03-31T14:41:32.527Z",
    "size": 3836,
    "path": "../public/_nuxt/0cvrggvQ.js"
  },
  "/_nuxt/0zLX3tMP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e30-lHbwcRyc2kKky61bmh2+ldkCzNM\"",
    "mtime": "2025-03-31T14:41:32.023Z",
    "size": 3632,
    "path": "../public/_nuxt/0zLX3tMP.js"
  },
  "/_nuxt/25W9uPmb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f0e-s0SnIjkaMLmzWyoV0ImrAXt7Y1g\"",
    "mtime": "2025-03-31T14:41:32.738Z",
    "size": 12046,
    "path": "../public/_nuxt/25W9uPmb.js"
  },
  "/_nuxt/315exbs3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b80-trNnmRCMH3HF1SktE1RLfBhVDmY\"",
    "mtime": "2025-03-31T14:41:31.941Z",
    "size": 2944,
    "path": "../public/_nuxt/315exbs3.js"
  },
  "/_nuxt/4Ik7cdeQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19ff-d6ynD3zNQz9bTQmZKuIswpuPEoU\"",
    "mtime": "2025-03-31T14:41:32.759Z",
    "size": 6655,
    "path": "../public/_nuxt/4Ik7cdeQ.js"
  },
  "/_nuxt/5Rap-vPy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"681-j8rGZtox85UZWKM+JE7/0Rrh3UA\"",
    "mtime": "2025-03-31T14:41:32.450Z",
    "size": 1665,
    "path": "../public/_nuxt/5Rap-vPy.js"
  },
  "/_nuxt/8KqVuFht.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a5-WmZ9JpWdOs4qviwCSAvgboVXcw4\"",
    "mtime": "2025-03-31T14:41:31.881Z",
    "size": 421,
    "path": "../public/_nuxt/8KqVuFht.js"
  },
  "/_nuxt/9AG6cIdP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ce3-BTQN5eibywcbGMPEzuueMohCfIk\"",
    "mtime": "2025-03-31T14:41:32.206Z",
    "size": 7395,
    "path": "../public/_nuxt/9AG6cIdP.js"
  },
  "/_nuxt/9tMEfMDz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"385-C67fAfLFr5wTPlhY0VTcJXoTLxA\"",
    "mtime": "2025-03-31T14:41:31.877Z",
    "size": 901,
    "path": "../public/_nuxt/9tMEfMDz.js"
  },
  "/_nuxt/A7gB5MRo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3ff2-IOfxgqtCGYnys7T3lIVaolzbNaM\"",
    "mtime": "2025-03-31T14:41:32.484Z",
    "size": 16370,
    "path": "../public/_nuxt/A7gB5MRo.js"
  },
  "/_nuxt/about.D9x4qs_Q.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"645-GQ4iVq4tNNv8vWwJfjgwc5Awu1E\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 1605,
    "path": "../public/_nuxt/about.D9x4qs_Q.css"
  },
  "/_nuxt/accessibility.B-Lm5FZs.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13cc-PpnTFYneKlquBCzqhWbjzO4dIoM\"",
    "mtime": "2025-03-31T14:41:31.637Z",
    "size": 5068,
    "path": "../public/_nuxt/accessibility.B-Lm5FZs.css"
  },
  "/_nuxt/analytics.D85yazT9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"26-Md0SZDuzDSoENUoswWWe4nsJxn4\"",
    "mtime": "2025-03-31T14:41:31.641Z",
    "size": 38,
    "path": "../public/_nuxt/analytics.D85yazT9.css"
  },
  "/_nuxt/AyH1SY-E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2344-ZvLWIlI1z4WAUI0oMhAk0ns9G48\"",
    "mtime": "2025-03-31T14:41:32.269Z",
    "size": 9028,
    "path": "../public/_nuxt/AyH1SY-E.js"
  },
  "/_nuxt/B-1e735K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d6e-MDDGKmG7qqpujVxPhuZjh+ZGRu0\"",
    "mtime": "2025-03-31T14:41:31.750Z",
    "size": 11630,
    "path": "../public/_nuxt/B-1e735K.js"
  },
  "/_nuxt/B03wrqEc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"789-Q1rHnR5vqUT5G3Wr3x9KXLNulkM\"",
    "mtime": "2025-03-31T14:41:32.663Z",
    "size": 1929,
    "path": "../public/_nuxt/B03wrqEc.js"
  },
  "/_nuxt/B0Za0rsQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11e5-GbNZ2DvOkq2UKkGLkSxnudZqqrI\"",
    "mtime": "2025-03-31T14:41:31.905Z",
    "size": 4581,
    "path": "../public/_nuxt/B0Za0rsQ.js"
  },
  "/_nuxt/B17zHlzz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"56f6-aeg8nrXLUAqQLS//5pXJDwD5tmI\"",
    "mtime": "2025-03-31T14:41:32.389Z",
    "size": 22262,
    "path": "../public/_nuxt/B17zHlzz.js"
  },
  "/_nuxt/B5zXfXm9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a58-3IZ6RqicFk7B5svb/zCOxHcgXzk\"",
    "mtime": "2025-03-31T14:41:32.637Z",
    "size": 2648,
    "path": "../public/_nuxt/B5zXfXm9.js"
  },
  "/_nuxt/B8gKUaZn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"aee-nxJFCd0PIwGoRK8eMQ57EBlIFnQ\"",
    "mtime": "2025-03-31T14:41:32.341Z",
    "size": 2798,
    "path": "../public/_nuxt/B8gKUaZn.js"
  },
  "/_nuxt/B8wUtamR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"81b-tqCWtbs/VQDZBE9ZWY77x7QnK+Q\"",
    "mtime": "2025-03-31T14:41:32.282Z",
    "size": 2075,
    "path": "../public/_nuxt/B8wUtamR.js"
  },
  "/_nuxt/B93vd7LV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1398-M87g1OQmCPcYVip1EbSL48jnoDA\"",
    "mtime": "2025-03-31T14:41:31.732Z",
    "size": 5016,
    "path": "../public/_nuxt/B93vd7LV.js"
  },
  "/_nuxt/B9VOqAmU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1605-O7fvte8W3P60sLhyCIc4xfonSgw\"",
    "mtime": "2025-03-31T14:41:32.200Z",
    "size": 5637,
    "path": "../public/_nuxt/B9VOqAmU.js"
  },
  "/_nuxt/B9Xyijhd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ea9-2VcUEOUz8T0vpibwI7mpeZvUzVA\"",
    "mtime": "2025-03-31T14:41:32.785Z",
    "size": 7849,
    "path": "../public/_nuxt/B9Xyijhd.js"
  },
  "/_nuxt/BA6hSHTM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d8c-y0iUjkSFmVsWIo188xIIfQ4P6CQ\"",
    "mtime": "2025-03-31T14:41:32.301Z",
    "size": 7564,
    "path": "../public/_nuxt/BA6hSHTM.js"
  },
  "/_nuxt/BaJupSGV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13d2-oHQ+WoyeOdX453C1t18DuA7yUiw\"",
    "mtime": "2025-03-31T14:41:32.671Z",
    "size": 5074,
    "path": "../public/_nuxt/BaJupSGV.js"
  },
  "/_nuxt/BaLxmfj-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"446-DfwxHi1Nkvq1wUEp3wYw7R1nVsI\"",
    "mtime": "2025-03-31T14:41:32.398Z",
    "size": 1094,
    "path": "../public/_nuxt/BaLxmfj-.js"
  },
  "/_nuxt/BbaQ2fYF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13cb-Y18ALUmbyUaj/Eqa4q50P5T9zCk\"",
    "mtime": "2025-03-31T14:41:31.738Z",
    "size": 5067,
    "path": "../public/_nuxt/BbaQ2fYF.js"
  },
  "/_nuxt/BBCzpdqv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d94-VaPyd2MsncpxN+lkEavrZGKdGnc\"",
    "mtime": "2025-03-31T14:41:31.732Z",
    "size": 15764,
    "path": "../public/_nuxt/BBCzpdqv.js"
  },
  "/_nuxt/BBlD454A.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2fd-6+y5lxdWI4IQnh1A1UUd1B6cWOE\"",
    "mtime": "2025-03-31T14:41:32.020Z",
    "size": 765,
    "path": "../public/_nuxt/BBlD454A.js"
  },
  "/_nuxt/Bc-ZgV77.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8c6-4wKGjOyNZ9Owd6sxuXqrFp0kNww\"",
    "mtime": "2025-03-31T14:41:32.660Z",
    "size": 2246,
    "path": "../public/_nuxt/Bc-ZgV77.js"
  },
  "/_nuxt/BfEKNvv3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ade-yeSBdhNR8jepAh6/fGH1krfMtuA\"",
    "mtime": "2025-03-31T14:41:32.418Z",
    "size": 2782,
    "path": "../public/_nuxt/BfEKNvv3.js"
  },
  "/_nuxt/BFG1Mk7z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"97f-hKpzMDxwfN8HiMW5IW0nfLCgYuw\"",
    "mtime": "2025-03-31T14:41:32.420Z",
    "size": 2431,
    "path": "../public/_nuxt/BFG1Mk7z.js"
  },
  "/_nuxt/BfGoriko.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b8b-KfpeOwkZRcaN+LZ9D07X7pTa7JA\"",
    "mtime": "2025-03-31T14:41:31.840Z",
    "size": 2955,
    "path": "../public/_nuxt/BfGoriko.js"
  },
  "/_nuxt/BfkaFpKA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11fd-MJPEcm8sojNDMLAifyHZXn8ER8o\"",
    "mtime": "2025-03-31T14:41:31.873Z",
    "size": 4605,
    "path": "../public/_nuxt/BfkaFpKA.js"
  },
  "/_nuxt/BG_IYHn2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2afe-mN5xE4KLGpHUCXw/eJDxszsANEg\"",
    "mtime": "2025-03-31T14:41:31.875Z",
    "size": 11006,
    "path": "../public/_nuxt/BG_IYHn2.js"
  },
  "/_nuxt/BHw03n-1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1190-g9rtlY9HPDPt7O0cO8I+ZPMzToQ\"",
    "mtime": "2025-03-31T14:41:32.086Z",
    "size": 4496,
    "path": "../public/_nuxt/BHw03n-1.js"
  },
  "/_nuxt/Bhzvs7bI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4321-m7JWyPeAWCVLrCl1gc38gCU5P3g\"",
    "mtime": "2025-03-31T14:41:32.669Z",
    "size": 17185,
    "path": "../public/_nuxt/Bhzvs7bI.js"
  },
  "/_nuxt/BI3swxpe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cf7-DHKYf6w7bey5VsBpVaAGuS4M/k4\"",
    "mtime": "2025-03-31T14:41:32.329Z",
    "size": 3319,
    "path": "../public/_nuxt/BI3swxpe.js"
  },
  "/_nuxt/Bio4gycK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7dd-LtMCBf2r+H05bMIkS5FijYeOh5o\"",
    "mtime": "2025-03-31T14:41:32.757Z",
    "size": 2013,
    "path": "../public/_nuxt/Bio4gycK.js"
  },
  "/_nuxt/BIv9DU6q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1da8-z3EQ4lf08ORcPvcJ2tz3OE4VVUs\"",
    "mtime": "2025-03-31T14:41:32.801Z",
    "size": 7592,
    "path": "../public/_nuxt/BIv9DU6q.js"
  },
  "/_nuxt/BJYI0myt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bc2-9O0DVFmxxSUaz6m7wpujWlXMy8w\"",
    "mtime": "2025-03-31T14:41:32.334Z",
    "size": 3010,
    "path": "../public/_nuxt/BJYI0myt.js"
  },
  "/_nuxt/BkfqZVw6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19fc-IoFHhdRh6S8KpCkE27RYGMQAokk\"",
    "mtime": "2025-03-31T14:41:32.303Z",
    "size": 6652,
    "path": "../public/_nuxt/BkfqZVw6.js"
  },
  "/_nuxt/BKlk5iyT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fa6-0hzSfuGSBvnY/exsOChmzKTbIcg\"",
    "mtime": "2025-03-31T14:41:32.669Z",
    "size": 8102,
    "path": "../public/_nuxt/BKlk5iyT.js"
  },
  "/_nuxt/BlJt6Myq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3c0-3CFlGz/IuDUVB05+6uNQGWVfnmI\"",
    "mtime": "2025-03-31T14:41:31.738Z",
    "size": 960,
    "path": "../public/_nuxt/BlJt6Myq.js"
  },
  "/_nuxt/BLPWZ-W2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"595a-xRgLkGg7JSd7eWGoDobPN3WKQ9U\"",
    "mtime": "2025-03-31T14:41:32.888Z",
    "size": 22874,
    "path": "../public/_nuxt/BLPWZ-W2.js"
  },
  "/_nuxt/BLvcnRgy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a7f-3tR9YbRwW/rOxecTxmFb8aMYLBo\"",
    "mtime": "2025-03-31T14:41:32.798Z",
    "size": 2687,
    "path": "../public/_nuxt/BLvcnRgy.js"
  },
  "/_nuxt/BmcMzYFF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"843-LXwZBEmdAjE0gkOxqqabkKA1NmY\"",
    "mtime": "2025-03-31T14:41:32.088Z",
    "size": 2115,
    "path": "../public/_nuxt/BmcMzYFF.js"
  },
  "/_nuxt/BncnBaqE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"286efb-JwvJCXO69ulsfTPJ7ognh3tiusM\"",
    "mtime": "2025-03-31T14:41:32.097Z",
    "size": 2649851,
    "path": "../public/_nuxt/BncnBaqE.js"
  },
  "/_nuxt/BoFRg7Ot.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d8c-x7eoF6/B5LJBQC45QcS+X82hwXg\"",
    "mtime": "2025-03-31T14:41:32.757Z",
    "size": 7564,
    "path": "../public/_nuxt/BoFRg7Ot.js"
  },
  "/_nuxt/BoI1fyGX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ed3-fVFKMFOgmZcO2FEBFhHKXRFsCwE\"",
    "mtime": "2025-03-31T14:41:31.812Z",
    "size": 3795,
    "path": "../public/_nuxt/BoI1fyGX.js"
  },
  "/_nuxt/BPBjobQr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"efd-BoD04vin5CCOsqL8Lp3vlpFYZpE\"",
    "mtime": "2025-03-31T14:41:32.256Z",
    "size": 3837,
    "path": "../public/_nuxt/BPBjobQr.js"
  },
  "/_nuxt/Bqgm2twL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ce3-2qEJX7PQQQUSX23UkO9qRvEtOOw\"",
    "mtime": "2025-03-31T14:41:32.592Z",
    "size": 7395,
    "path": "../public/_nuxt/Bqgm2twL.js"
  },
  "/_nuxt/BqNCtGhx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1413-JME0yE1MTy7Kk3cic9EyXl/krjE\"",
    "mtime": "2025-03-31T14:41:32.625Z",
    "size": 5139,
    "path": "../public/_nuxt/BqNCtGhx.js"
  },
  "/_nuxt/BqWUJ68r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3157-6Q70xk8eO9ZirDp7l11SXwWzAQI\"",
    "mtime": "2025-03-31T14:41:31.838Z",
    "size": 12631,
    "path": "../public/_nuxt/BqWUJ68r.js"
  },
  "/_nuxt/BRETWCw_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"efc-HmvtpbC4/TuizL8/aIFFM95atT8\"",
    "mtime": "2025-03-31T14:41:32.179Z",
    "size": 3836,
    "path": "../public/_nuxt/BRETWCw_.js"
  },
  "/_nuxt/BrGtgdUF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3e0-FwNnEOEY5oQl5QA+BCk34h4cPTU\"",
    "mtime": "2025-03-31T14:41:31.842Z",
    "size": 992,
    "path": "../public/_nuxt/BrGtgdUF.js"
  },
  "/_nuxt/BrgZPUOV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3849-icb4pT04ATOyvhm69I+tvfu18vM\"",
    "mtime": "2025-03-31T14:41:32.398Z",
    "size": 14409,
    "path": "../public/_nuxt/BrgZPUOV.js"
  },
  "/_nuxt/BrPbxvpd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1983-5VmxCBS8+ccpbLL6y9IQdFM7ZNE\"",
    "mtime": "2025-03-31T14:41:31.746Z",
    "size": 6531,
    "path": "../public/_nuxt/BrPbxvpd.js"
  },
  "/_nuxt/BSkB5QuD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e65-VWmvRcrrl3PagVc7kpAE3aDeccU\"",
    "mtime": "2025-03-31T14:41:32.590Z",
    "size": 3685,
    "path": "../public/_nuxt/BSkB5QuD.js"
  },
  "/_nuxt/BSshlkr5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2cef-3bJzneTWHi6UxRSjB+rL0TiAEbY\"",
    "mtime": "2025-03-31T14:41:32.215Z",
    "size": 11503,
    "path": "../public/_nuxt/BSshlkr5.js"
  },
  "/_nuxt/BsTHnhdd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1030-7KDisvL9YUyd7qbbHO1wzr27YJE\"",
    "mtime": "2025-03-31T14:41:32.590Z",
    "size": 4144,
    "path": "../public/_nuxt/BsTHnhdd.js"
  },
  "/_nuxt/BtEFHWei.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b57-Hwifz1ZONgsULtbyEoYoM5VjDFo\"",
    "mtime": "2025-03-31T14:41:32.135Z",
    "size": 2903,
    "path": "../public/_nuxt/BtEFHWei.js"
  },
  "/_nuxt/Bup6ni4c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b88-v11iBIeKMpWframlQ/+TFm9TRow\"",
    "mtime": "2025-03-31T14:41:32.518Z",
    "size": 7048,
    "path": "../public/_nuxt/Bup6ni4c.js"
  },
  "/_nuxt/BUxLlBSM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1066-zt8cekdp9DFcinU/bEvhbRQ62VM\"",
    "mtime": "2025-03-31T14:41:32.029Z",
    "size": 4198,
    "path": "../public/_nuxt/BUxLlBSM.js"
  },
  "/_nuxt/BW7R3LBI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"97f-Fy0p3y5QhGlRkBJ27cqJ9KcZ6Ro\"",
    "mtime": "2025-03-31T14:41:32.062Z",
    "size": 2431,
    "path": "../public/_nuxt/BW7R3LBI.js"
  },
  "/_nuxt/BwwzOsSy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a84-uWH/rwB3/OZHZxBl15O+f46cCxI\"",
    "mtime": "2025-03-31T14:41:31.834Z",
    "size": 10884,
    "path": "../public/_nuxt/BwwzOsSy.js"
  },
  "/_nuxt/Bypmsi9g.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a80-/mRSPa6uOmbxxksoAfUVaQZdFsA\"",
    "mtime": "2025-03-31T14:41:32.020Z",
    "size": 2688,
    "path": "../public/_nuxt/Bypmsi9g.js"
  },
  "/_nuxt/BYu9MfXW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1066-8470gqdQotB+TID6N5gv05xl9ho\"",
    "mtime": "2025-03-31T14:41:31.830Z",
    "size": 4198,
    "path": "../public/_nuxt/BYu9MfXW.js"
  },
  "/_nuxt/ByV54v1F.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15d4-WSsS1CxseMx5cpVN//KKp9IINBQ\"",
    "mtime": "2025-03-31T14:41:32.101Z",
    "size": 5588,
    "path": "../public/_nuxt/ByV54v1F.js"
  },
  "/_nuxt/ByY8twkA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2715-HhQYvkgYrcu3prnLVCIoGxN9fho\"",
    "mtime": "2025-03-31T14:41:32.097Z",
    "size": 10005,
    "path": "../public/_nuxt/ByY8twkA.js"
  },
  "/_nuxt/Bz0XSvB7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"789-eNV8zLBCcPxhLE879ae9DgzaLss\"",
    "mtime": "2025-03-31T14:41:32.023Z",
    "size": 1929,
    "path": "../public/_nuxt/Bz0XSvB7.js"
  },
  "/_nuxt/BZc01zi6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a67-3HWkxwJ8tneCE8ZNm8fI1D0GMIk\"",
    "mtime": "2025-03-31T14:41:32.363Z",
    "size": 2663,
    "path": "../public/_nuxt/BZc01zi6.js"
  },
  "/_nuxt/B_c3zf-v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b09-AniztXTCW2EZ7bLCjEh6Pzr19Uw\"",
    "mtime": "2025-03-31T14:41:32.627Z",
    "size": 2825,
    "path": "../public/_nuxt/B_c3zf-v.js"
  },
  "/_nuxt/B_fMsGYe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d8b-wdaYMOcILU5ZsiUc6j5Yz/vvZT8\"",
    "mtime": "2025-03-31T14:41:32.579Z",
    "size": 3467,
    "path": "../public/_nuxt/B_fMsGYe.js"
  },
  "/_nuxt/C0fPk3AA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2135-zZjRJMf5EnxpAGtVhoN1S5diVxE\"",
    "mtime": "2025-03-31T14:41:32.228Z",
    "size": 8501,
    "path": "../public/_nuxt/C0fPk3AA.js"
  },
  "/_nuxt/C19sOa1p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"102b-zlQbwMweYgbHJ1i/j75HBSUzVIw\"",
    "mtime": "2025-03-31T14:41:32.280Z",
    "size": 4139,
    "path": "../public/_nuxt/C19sOa1p.js"
  },
  "/_nuxt/C1Mz_abc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"efc-QdJZNnZ279QriW9O4v09txKR2mQ\"",
    "mtime": "2025-03-31T14:41:32.077Z",
    "size": 3836,
    "path": "../public/_nuxt/C1Mz_abc.js"
  },
  "/_nuxt/c2hA8jvi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12a2-AV60Ml2hPFlnvBS1CNYqoCk7dvQ\"",
    "mtime": "2025-03-31T14:41:32.080Z",
    "size": 4770,
    "path": "../public/_nuxt/c2hA8jvi.js"
  },
  "/_nuxt/C31pVz_a.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"83e-2V/yjzATJZ1+D3ZIme4qtttvenk\"",
    "mtime": "2025-03-31T14:41:31.838Z",
    "size": 2110,
    "path": "../public/_nuxt/C31pVz_a.js"
  },
  "/_nuxt/C54bi_-Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1408-nl19bKjYdAKmHtdN3fjT79kb3s0\"",
    "mtime": "2025-03-31T14:41:31.742Z",
    "size": 5128,
    "path": "../public/_nuxt/C54bi_-Q.js"
  },
  "/_nuxt/C5pImIUS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14a8-Mzj6SV4Y2edY8vNjnAat1BGt4e0\"",
    "mtime": "2025-03-31T14:41:32.579Z",
    "size": 5288,
    "path": "../public/_nuxt/C5pImIUS.js"
  },
  "/_nuxt/C5WLch3f.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bc2-qGSUhYfhvOJwmpIaIMIvzbhl9D4\"",
    "mtime": "2025-03-31T14:41:32.762Z",
    "size": 3010,
    "path": "../public/_nuxt/C5WLch3f.js"
  },
  "/_nuxt/C6GTbAYz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"163e-RX4x6x+562IYiLBK0DQNYE22WVw\"",
    "mtime": "2025-03-31T14:41:32.075Z",
    "size": 5694,
    "path": "../public/_nuxt/C6GTbAYz.js"
  },
  "/_nuxt/C6qjZiaU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ece-7Nhj3CuOZr3WJUDpcUDAQttKIC8\"",
    "mtime": "2025-03-31T14:41:32.367Z",
    "size": 3790,
    "path": "../public/_nuxt/C6qjZiaU.js"
  },
  "/_nuxt/CB9Oz3-y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7e7b-CPd0gZCCruJwr0WvCB+nPKwsfM8\"",
    "mtime": "2025-03-31T14:41:32.851Z",
    "size": 32379,
    "path": "../public/_nuxt/CB9Oz3-y.js"
  },
  "/_nuxt/CBfG6JPf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eda-mhey/PSfg/eGWe+wUdmbsGW62fM\"",
    "mtime": "2025-03-31T14:41:32.264Z",
    "size": 3802,
    "path": "../public/_nuxt/CBfG6JPf.js"
  },
  "/_nuxt/CbfpPqiF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2672-yroWXKhkxDXMlfLTOgqYL0UYzAw\"",
    "mtime": "2025-03-31T14:41:31.830Z",
    "size": 9842,
    "path": "../public/_nuxt/CbfpPqiF.js"
  },
  "/_nuxt/CBNCqq56.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ee9-floaYQJlLqzS6aMo40KI80Dy7Xk\"",
    "mtime": "2025-03-31T14:41:32.363Z",
    "size": 3817,
    "path": "../public/_nuxt/CBNCqq56.js"
  },
  "/_nuxt/Cbxen0VC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7dc0-NDDLO7nCe0uOCQ33iogXtXLdJvA\"",
    "mtime": "2025-03-31T14:41:31.738Z",
    "size": 32192,
    "path": "../public/_nuxt/Cbxen0VC.js"
  },
  "/_nuxt/CCSDG5nI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"292f-Pke4IVT3PZYEP6wHLq+u8Ghq4os\"",
    "mtime": "2025-03-31T14:41:32.762Z",
    "size": 10543,
    "path": "../public/_nuxt/CCSDG5nI.js"
  },
  "/_nuxt/CDbiwXvt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"133-5dsnBaFXlYSqVrmjvcWQtXRz1so\"",
    "mtime": "2025-03-31T14:41:31.872Z",
    "size": 307,
    "path": "../public/_nuxt/CDbiwXvt.js"
  },
  "/_nuxt/CDGzqUPQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"efc-Yv/rg2gfTTWYMTlvkYomAqsoyio\"",
    "mtime": "2025-03-31T14:41:32.450Z",
    "size": 3836,
    "path": "../public/_nuxt/CDGzqUPQ.js"
  },
  "/_nuxt/CDntyWJ8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"81b-rz2B8NskY2hBKQP1ozorJrPLIqo\"",
    "mtime": "2025-03-31T14:41:32.749Z",
    "size": 2075,
    "path": "../public/_nuxt/CDntyWJ8.js"
  },
  "/_nuxt/CdQndTaG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d31-2sYV2Pa9sj22Mg8J5eQisaRrrNY\"",
    "mtime": "2025-03-31T14:41:32.736Z",
    "size": 3377,
    "path": "../public/_nuxt/CdQndTaG.js"
  },
  "/_nuxt/CE2Dd2ik.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7bc5-aSLWXAdHR0Rqh1eoBcnYaIAK1rU\"",
    "mtime": "2025-03-31T14:41:31.838Z",
    "size": 31685,
    "path": "../public/_nuxt/CE2Dd2ik.js"
  },
  "/_nuxt/Ce3n6wWz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15d4-wdVJAn7TRWtJZFuUu855HOGzJu0\"",
    "mtime": "2025-03-31T14:41:32.455Z",
    "size": 5588,
    "path": "../public/_nuxt/Ce3n6wWz.js"
  },
  "/_nuxt/CemYLz2q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a344-zYG6hrggRWFJqtMpBLqCWT8IIb0\"",
    "mtime": "2025-03-31T14:41:32.888Z",
    "size": 41796,
    "path": "../public/_nuxt/CemYLz2q.js"
  },
  "/_nuxt/CEVZQGLR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a00-YW4Cd7eDUK0WWWMSMFj5h8Juuxk\"",
    "mtime": "2025-03-31T14:41:31.944Z",
    "size": 10752,
    "path": "../public/_nuxt/CEVZQGLR.js"
  },
  "/_nuxt/CF7p3SqZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15d2-IFK25lr6yTYxH3DbuazrOFZzqns\"",
    "mtime": "2025-03-31T14:41:31.734Z",
    "size": 5586,
    "path": "../public/_nuxt/CF7p3SqZ.js"
  },
  "/_nuxt/CFKIUWau.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1190-t4tOX4CzeQDYK7wfoXoHlBKNeIw\"",
    "mtime": "2025-03-31T14:41:32.455Z",
    "size": 4496,
    "path": "../public/_nuxt/CFKIUWau.js"
  },
  "/_nuxt/CFOPXBzS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"82b-rLhbwmJOfKjpGFcT0QLKgPj84SQ\"",
    "mtime": "2025-03-31T14:41:32.412Z",
    "size": 2091,
    "path": "../public/_nuxt/CFOPXBzS.js"
  },
  "/_nuxt/CfQTfsdm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3849-NP5eNpdCKc28x+v+bKuRrjzNqjA\"",
    "mtime": "2025-03-31T14:41:32.027Z",
    "size": 14409,
    "path": "../public/_nuxt/CfQTfsdm.js"
  },
  "/_nuxt/Cg7bfA9N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9ca-xsj0QDi5DjJNLbrS7iOPZXl0WJo\"",
    "mtime": "2025-03-31T14:41:32.521Z",
    "size": 2506,
    "path": "../public/_nuxt/Cg7bfA9N.js"
  },
  "/_nuxt/CgBXIIYx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"177-y0ZLatn9yW+DBfCNmpwJmKKjaZ8\"",
    "mtime": "2025-03-31T14:41:31.893Z",
    "size": 375,
    "path": "../public/_nuxt/CgBXIIYx.js"
  },
  "/_nuxt/Ch7yxlMo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"681-/4sMG+ues8C44mqKnVbEhfnzvX0\"",
    "mtime": "2025-03-31T14:41:32.086Z",
    "size": 1665,
    "path": "../public/_nuxt/Ch7yxlMo.js"
  },
  "/_nuxt/checkout.Q_Up968R.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"893-6Q5KRgKDRx4H1N0SiRhOM9tmj64\"",
    "mtime": "2025-03-31T14:41:31.619Z",
    "size": 2195,
    "path": "../public/_nuxt/checkout.Q_Up968R.css"
  },
  "/_nuxt/CHf2vQvp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"61014-ogEWuHYWeZesu+Ie/BA3hC8PRSQ\"",
    "mtime": "2025-03-31T14:41:31.728Z",
    "size": 397332,
    "path": "../public/_nuxt/CHf2vQvp.js"
  },
  "/_nuxt/CIJ_UyQp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ade-fcQ2ibqUa0qI5rRl+Y0zg/XBCj4\"",
    "mtime": "2025-03-31T14:41:32.055Z",
    "size": 2782,
    "path": "../public/_nuxt/CIJ_UyQp.js"
  },
  "/_nuxt/CJ5CIvsd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"67284-Hq2gFdGx4ZShVGQt8kaQAVa+rAE\"",
    "mtime": "2025-03-31T14:41:31.738Z",
    "size": 422532,
    "path": "../public/_nuxt/CJ5CIvsd.js"
  },
  "/_nuxt/CkTy9rz1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"108a-/pSqaErxWy5lF20dOXwL9k8Cryo\"",
    "mtime": "2025-03-31T14:41:32.625Z",
    "size": 4234,
    "path": "../public/_nuxt/CkTy9rz1.js"
  },
  "/_nuxt/CKwSXfQg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2469-XBQt7dPDU+L3ao8k+Pl+CIEwgMU\"",
    "mtime": "2025-03-31T14:41:31.893Z",
    "size": 9321,
    "path": "../public/_nuxt/CKwSXfQg.js"
  },
  "/_nuxt/CLLBncYj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15aa-BmXptzaHA8OcOjHRWHqLyMw+4qI\"",
    "mtime": "2025-03-31T14:41:32.450Z",
    "size": 5546,
    "path": "../public/_nuxt/CLLBncYj.js"
  },
  "/_nuxt/Clx7Fbmx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"38b5-xV3xD33Kuc0RzSQHmw/Nmfb3TGk\"",
    "mtime": "2025-03-31T14:41:31.810Z",
    "size": 14517,
    "path": "../public/_nuxt/Clx7Fbmx.js"
  },
  "/_nuxt/CNvyoDs1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d52-B8x5r4/4ga7R69UEQyKcBuiM5uo\"",
    "mtime": "2025-03-31T14:41:31.728Z",
    "size": 3410,
    "path": "../public/_nuxt/CNvyoDs1.js"
  },
  "/_nuxt/codicon.DCmgc-ay.ttf": {
    "type": "font/ttf",
    "etag": "\"139d4-58fQ8Ohjcapek6AgDzlcXTeWfi4\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 80340,
    "path": "../public/_nuxt/codicon.DCmgc-ay.ttf"
  },
  "/_nuxt/codicon.DcSIACem.ttf": {
    "type": "font/ttf",
    "etag": "\"11478-8Tnng1MI/GHiIe+DuRgGpSRf3Bg\"",
    "mtime": "2025-03-31T14:41:31.557Z",
    "size": 70776,
    "path": "../public/_nuxt/codicon.DcSIACem.ttf"
  },
  "/_nuxt/contact.DI3b3m-5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"96-f0mhKLOw+quTqvB1l4hBB6JWJ0c\"",
    "mtime": "2025-03-31T14:41:31.616Z",
    "size": 150,
    "path": "../public/_nuxt/contact.DI3b3m-5.css"
  },
  "/_nuxt/cookies.CdThgKK2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ce-HPO7lShCm+SGLhH9IS05/sPitJY\"",
    "mtime": "2025-03-31T14:41:31.617Z",
    "size": 206,
    "path": "../public/_nuxt/cookies.CdThgKK2.css"
  },
  "/_nuxt/Coo_lhCq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b09-pddEEtvOHCvoSZOJH53OEgzluwQ\"",
    "mtime": "2025-03-31T14:41:32.210Z",
    "size": 2825,
    "path": "../public/_nuxt/Coo_lhCq.js"
  },
  "/_nuxt/CoXizQOP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"222e-DuKRbtgxb1X6g6PQ+Nnl1dpvUB8\"",
    "mtime": "2025-03-31T14:41:32.280Z",
    "size": 8750,
    "path": "../public/_nuxt/CoXizQOP.js"
  },
  "/_nuxt/COyEY5Pt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"244c-sVdjQcz+5gNm2dTCoRVru1PFIwE\"",
    "mtime": "2025-03-31T14:41:32.671Z",
    "size": 9292,
    "path": "../public/_nuxt/COyEY5Pt.js"
  },
  "/_nuxt/Cp1zYvxS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"222e-nOOrp7RMhTDtjnwFsnq0rumowPM\"",
    "mtime": "2025-03-31T14:41:32.743Z",
    "size": 8750,
    "path": "../public/_nuxt/Cp1zYvxS.js"
  },
  "/_nuxt/CP9vGHhX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9ca-2Mexmjp4NXbDJztnPwfn/jG2oIE\"",
    "mtime": "2025-03-31T14:41:32.103Z",
    "size": 2506,
    "path": "../public/_nuxt/CP9vGHhX.js"
  },
  "/_nuxt/CPajHgWi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"184b-0mnXppglu4funVUyTKRU9wVM51o\"",
    "mtime": "2025-03-31T14:41:32.785Z",
    "size": 6219,
    "path": "../public/_nuxt/CPajHgWi.js"
  },
  "/_nuxt/Cpb6xl2v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bf7-9azmYcI2peWZp6TQCQm1u9keDX4\"",
    "mtime": "2025-03-31T14:41:32.593Z",
    "size": 3063,
    "path": "../public/_nuxt/Cpb6xl2v.js"
  },
  "/_nuxt/Cphgjts3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b57-sUDXc9V38mpJy/VoZF16IPK2jZQ\"",
    "mtime": "2025-03-31T14:41:32.498Z",
    "size": 2903,
    "path": "../public/_nuxt/Cphgjts3.js"
  },
  "/_nuxt/CpIb_Oan.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2051-rgRgtw3zWjZRZjudCbF33AGeECo\"",
    "mtime": "2025-03-31T14:41:32.663Z",
    "size": 8273,
    "path": "../public/_nuxt/CpIb_Oan.js"
  },
  "/_nuxt/CQ5fUn-M.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1072-Yi2kEhmQLTVnFye262cQk93ST8c\"",
    "mtime": "2025-03-31T14:41:32.210Z",
    "size": 4210,
    "path": "../public/_nuxt/CQ5fUn-M.js"
  },
  "/_nuxt/CR5cQsSs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"260-8boo42GeeV9luYd9K27O9go/E2I\"",
    "mtime": "2025-03-31T14:41:31.956Z",
    "size": 608,
    "path": "../public/_nuxt/CR5cQsSs.js"
  },
  "/_nuxt/CrWVR4ZC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c9d-EF5MJ3H/JRD9aHwxusuAiuEGqmI\"",
    "mtime": "2025-03-31T14:41:32.103Z",
    "size": 3229,
    "path": "../public/_nuxt/CrWVR4ZC.js"
  },
  "/_nuxt/css.worker.WS04UMDh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"131322-X+2H3EOjwFIz5m2b6oUGhAyTBG4\"",
    "mtime": "2025-03-31T14:41:31.572Z",
    "size": 1250082,
    "path": "../public/_nuxt/css.worker.WS04UMDh.js"
  },
  "/_nuxt/CSWOuLb7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"32d3e4-EN+0ROA27vytsQ6HIIiUzXF7QNQ\"",
    "mtime": "2025-03-31T14:41:32.105Z",
    "size": 3331044,
    "path": "../public/_nuxt/CSWOuLb7.js"
  },
  "/_nuxt/ctJgw0HP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a7b-ahVVIr9z9ck74JtMaElizU0ZpwM\"",
    "mtime": "2025-03-31T14:41:32.206Z",
    "size": 2683,
    "path": "../public/_nuxt/ctJgw0HP.js"
  },
  "/_nuxt/CuLUFvXu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4103-TVpn1tVyURQZdyx5OuC8PlZKtac\"",
    "mtime": "2025-03-31T14:41:31.814Z",
    "size": 16643,
    "path": "../public/_nuxt/CuLUFvXu.js"
  },
  "/_nuxt/CUQrbFtE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c62-7FR/6HkNr//WGI8aeQJT6Y1JJSA\"",
    "mtime": "2025-03-31T14:41:32.264Z",
    "size": 3170,
    "path": "../public/_nuxt/CUQrbFtE.js"
  },
  "/_nuxt/CU_dwqs8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"446-mwfy0YNIO2OKUp88XaVygN35zEE\"",
    "mtime": "2025-03-31T14:41:32.055Z",
    "size": 1094,
    "path": "../public/_nuxt/CU_dwqs8.js"
  },
  "/_nuxt/CVwtpugi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eda-V1UhNGZrP5fONJChkn+jlW9Ta9E\"",
    "mtime": "2025-03-31T14:41:32.736Z",
    "size": 3802,
    "path": "../public/_nuxt/CVwtpugi.js"
  },
  "/_nuxt/CvyFRe5M.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e65-BprhSHypXoYK5XbGCJ/VaGFP3EA\"",
    "mtime": "2025-03-31T14:41:32.206Z",
    "size": 3685,
    "path": "../public/_nuxt/CvyFRe5M.js"
  },
  "/_nuxt/Cw4ZXGva.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"857e-mIjR4G86qbf5EUfD9wK7kVNUtcQ\"",
    "mtime": "2025-03-31T14:41:32.367Z",
    "size": 34174,
    "path": "../public/_nuxt/Cw4ZXGva.js"
  },
  "/_nuxt/CwNk8-XU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2135-/Qcx0wAi+4LGxI3qUDtHmm9/x+Q\"",
    "mtime": "2025-03-31T14:41:32.662Z",
    "size": 8501,
    "path": "../public/_nuxt/CwNk8-XU.js"
  },
  "/_nuxt/CX-rkNHf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cf7-4tnpSwdJzMGOYoTdyObiOt0dHWM\"",
    "mtime": "2025-03-31T14:41:32.759Z",
    "size": 3319,
    "path": "../public/_nuxt/CX-rkNHf.js"
  },
  "/_nuxt/CXh6Fez7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12fe-97n4SYc6dFC1fxcbHCC14k3CBlc\"",
    "mtime": "2025-03-31T14:41:31.866Z",
    "size": 4862,
    "path": "../public/_nuxt/CXh6Fez7.js"
  },
  "/_nuxt/CXHpW9GZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1795-dvA0XH246J5aaNI+DyQou9f1Qf4\"",
    "mtime": "2025-03-31T14:41:32.365Z",
    "size": 6037,
    "path": "../public/_nuxt/CXHpW9GZ.js"
  },
  "/_nuxt/CXOwvkN_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ca9-uRMf1coJqqNXNeXD9Ej5kus6azo\"",
    "mtime": "2025-03-31T14:41:32.651Z",
    "size": 3241,
    "path": "../public/_nuxt/CXOwvkN_.js"
  },
  "/_nuxt/CxsvThpH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ec9-mOkkwiD1LHdY6m0gkydvkJP9Q38\"",
    "mtime": "2025-03-31T14:41:31.726Z",
    "size": 3785,
    "path": "../public/_nuxt/CxsvThpH.js"
  },
  "/_nuxt/Cybr7fmw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49e-eKqkkaEEYBKgGT15n/1xmfOqlCc\"",
    "mtime": "2025-03-31T14:41:32.206Z",
    "size": 1182,
    "path": "../public/_nuxt/Cybr7fmw.js"
  },
  "/_nuxt/CYf7XeSj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1426-YxpbK7MwjixCCYpEEBepmbA5rx4\"",
    "mtime": "2025-03-31T14:41:32.215Z",
    "size": 5158,
    "path": "../public/_nuxt/CYf7XeSj.js"
  },
  "/_nuxt/CzKuDChf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c9d-XY7TDPHcaLK8YmDWccNEPGnZe7A\"",
    "mtime": "2025-03-31T14:41:32.461Z",
    "size": 3229,
    "path": "../public/_nuxt/CzKuDChf.js"
  },
  "/_nuxt/Czv0KDuC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"200-1ddEc8Pg8MTJg8/YHYOwrcKMXW4\"",
    "mtime": "2025-03-31T14:41:31.905Z",
    "size": 512,
    "path": "../public/_nuxt/Czv0KDuC.js"
  },
  "/_nuxt/Czw6wXmo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2357-CKNlLA7K7fA8UjmJ1xyl3eQnQ9w\"",
    "mtime": "2025-03-31T14:41:32.738Z",
    "size": 9047,
    "path": "../public/_nuxt/Czw6wXmo.js"
  },
  "/_nuxt/C_kxGqGh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"244c-p8XFYCXemEOMJ/ejLDsoQqbKRNs\"",
    "mtime": "2025-03-31T14:41:32.251Z",
    "size": 9292,
    "path": "../public/_nuxt/C_kxGqGh.js"
  },
  "/_nuxt/D-lQ8LkD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"789-3YSDHKykdI9PLMh/bz7mz69XrJg\"",
    "mtime": "2025-03-31T14:41:32.236Z",
    "size": 1929,
    "path": "../public/_nuxt/D-lQ8LkD.js"
  },
  "/_nuxt/D-MeaMDU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"be2-xiWLcmanCIP8fOEu9HVUVUr+aWw\"",
    "mtime": "2025-03-31T14:41:32.784Z",
    "size": 3042,
    "path": "../public/_nuxt/D-MeaMDU.js"
  },
  "/_nuxt/D-PcXljh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8287-OE4+p5zsbXvOHvG+CcNn3tnT4o4\"",
    "mtime": "2025-03-31T14:41:32.367Z",
    "size": 33415,
    "path": "../public/_nuxt/D-PcXljh.js"
  },
  "/_nuxt/D1l8QYaL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9f-Ak8TXLgkiwtp6f/aeMBocOAycRg\"",
    "mtime": "2025-03-31T14:41:32.018Z",
    "size": 159,
    "path": "../public/_nuxt/D1l8QYaL.js"
  },
  "/_nuxt/D1s2EF6z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9ae4-ne6UijMHcEQjMn5uELBVfuBmw0A\"",
    "mtime": "2025-03-31T14:41:32.393Z",
    "size": 39652,
    "path": "../public/_nuxt/D1s2EF6z.js"
  },
  "/_nuxt/D1wYjNV8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d4-AXQw5VIH2Q5EuGhL1Se9G0zoJVc\"",
    "mtime": "2025-03-31T14:41:31.866Z",
    "size": 724,
    "path": "../public/_nuxt/D1wYjNV8.js"
  },
  "/_nuxt/D2Pe1aYt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13bf-h87gJh4YvcBVXvRIQPAlu/JhWCQ\"",
    "mtime": "2025-03-31T14:41:32.020Z",
    "size": 5055,
    "path": "../public/_nuxt/D2Pe1aYt.js"
  },
  "/_nuxt/D3h14YRZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1294-6d50YJMYH5eiulIhlDOPQdy6ZV8\"",
    "mtime": "2025-03-31T14:41:32.452Z",
    "size": 4756,
    "path": "../public/_nuxt/D3h14YRZ.js"
  },
  "/_nuxt/D4yCNWHu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3a0b-cv+nB0QfL6xUp9NdxmskuzO64/o\"",
    "mtime": "2025-03-31T14:41:31.742Z",
    "size": 14859,
    "path": "../public/_nuxt/D4yCNWHu.js"
  },
  "/_nuxt/D5C2fndG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1136-mXipPz1mCKcAf7IPYjFnGWjeRjk\"",
    "mtime": "2025-03-31T14:41:32.741Z",
    "size": 4406,
    "path": "../public/_nuxt/D5C2fndG.js"
  },
  "/_nuxt/D9tzKAGE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26a1-pu+VPTkUCdN3LsIGAxZZzgQaFxM\"",
    "mtime": "2025-03-31T14:41:32.064Z",
    "size": 9889,
    "path": "../public/_nuxt/D9tzKAGE.js"
  },
  "/_nuxt/dashboard.BxszyoXp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"914-jCrcOJtcN1aYpPC4Ue2yKkwQRSo\"",
    "mtime": "2025-03-31T14:41:31.621Z",
    "size": 2324,
    "path": "../public/_nuxt/dashboard.BxszyoXp.css"
  },
  "/_nuxt/dashboard.CMPlV4u1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4da-clqGT0MnglIHmzfZGYrPk/ciiOM\"",
    "mtime": "2025-03-31T14:41:31.673Z",
    "size": 1242,
    "path": "../public/_nuxt/dashboard.CMPlV4u1.css"
  },
  "/_nuxt/DAvyxDif.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10c1-1pJDPhkRKNVcAlgf2PVmEbF7SJw\"",
    "mtime": "2025-03-31T14:41:32.801Z",
    "size": 4289,
    "path": "../public/_nuxt/DAvyxDif.js"
  },
  "/_nuxt/DC0rMj3G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13d2-kiOEaNCkl8j+wmNAJHKLweBkQQU\"",
    "mtime": "2025-03-31T14:41:32.256Z",
    "size": 5074,
    "path": "../public/_nuxt/DC0rMj3G.js"
  },
  "/_nuxt/Dd3NCNK9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"dbb-BL2YGPNp0pJZI5sBLvKEV/VNutI\"",
    "mtime": "2025-03-31T14:41:32.669Z",
    "size": 3515,
    "path": "../public/_nuxt/Dd3NCNK9.js"
  },
  "/_nuxt/DDhVJIKa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"102d-MdBAIS0SXcSVI2pS8UJYwvuaKxw\"",
    "mtime": "2025-03-31T14:41:32.206Z",
    "size": 4141,
    "path": "../public/_nuxt/DDhVJIKa.js"
  },
  "/_nuxt/DdnQrJJW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"808-rXy+Y42zST4tkZR7L8daP+e89L0\"",
    "mtime": "2025-03-31T14:41:32.096Z",
    "size": 2056,
    "path": "../public/_nuxt/DdnQrJJW.js"
  },
  "/_nuxt/DDwshQtU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d00-jz/0rwo3/1zr9O1qpGkppGRYj0c\"",
    "mtime": "2025-03-31T14:41:32.637Z",
    "size": 11520,
    "path": "../public/_nuxt/DDwshQtU.js"
  },
  "/_nuxt/DEonEf7Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"165c-KlEnX68vwuOUahiznJop+Fw8IiI\"",
    "mtime": "2025-03-31T14:41:31.814Z",
    "size": 5724,
    "path": "../public/_nuxt/DEonEf7Q.js"
  },
  "/_nuxt/deUWdS0T.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2907-3ZCDnQWierm8758gx+xuKtgepf8\"",
    "mtime": "2025-03-31T14:41:32.455Z",
    "size": 10503,
    "path": "../public/_nuxt/deUWdS0T.js"
  },
  "/_nuxt/DfWb3tHC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4321-cx7NsfjKMBFMMp4OsYZ96LZXa0A\"",
    "mtime": "2025-03-31T14:41:32.243Z",
    "size": 17185,
    "path": "../public/_nuxt/DfWb3tHC.js"
  },
  "/_nuxt/DfzH4Xui.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"102b-wepaSEW2W4Que/z/1mzhV7R4hCM\"",
    "mtime": "2025-03-31T14:41:32.738Z",
    "size": 4139,
    "path": "../public/_nuxt/DfzH4Xui.js"
  },
  "/_nuxt/DgyLZaXg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1795-cfyCJPyF4vOcXLix07/vfssQgeY\"",
    "mtime": "2025-03-31T14:41:32.793Z",
    "size": 6037,
    "path": "../public/_nuxt/DgyLZaXg.js"
  },
  "/_nuxt/DHaeiCBh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"aee-ESrMw6IMSTb61CCMrqIf26ElWd0\"",
    "mtime": "2025-03-31T14:41:32.762Z",
    "size": 2798,
    "path": "../public/_nuxt/DHaeiCBh.js"
  },
  "/_nuxt/DHaF6oaz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"292f-mRIt2sFEN/fb/akSeeEbd2t2VnU\"",
    "mtime": "2025-03-31T14:41:32.343Z",
    "size": 10543,
    "path": "../public/_nuxt/DHaF6oaz.js"
  },
  "/_nuxt/DhvbxItG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4a7-pnHEQLxzHGuGb5z1eESlKffkygY\"",
    "mtime": "2025-03-31T14:41:32.590Z",
    "size": 1191,
    "path": "../public/_nuxt/DhvbxItG.js"
  },
  "/_nuxt/DJafF9z-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f9c-oOUzqaBRA+1ZxfzYmGkJUhvYOoc\"",
    "mtime": "2025-03-31T14:41:31.820Z",
    "size": 12188,
    "path": "../public/_nuxt/DJafF9z-.js"
  },
  "/_nuxt/DK-lM5Ch.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bf7-SEY016LKI7hED+QU8QhdXpaT1+s\"",
    "mtime": "2025-03-31T14:41:32.210Z",
    "size": 3063,
    "path": "../public/_nuxt/DK-lM5Ch.js"
  },
  "/_nuxt/DLSD6EIt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"dbb-NhZSDNRfK8FDg48uWr+SC+Nkz7E\"",
    "mtime": "2025-03-31T14:41:32.249Z",
    "size": 3515,
    "path": "../public/_nuxt/DLSD6EIt.js"
  },
  "/_nuxt/DM3UtKzw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eca4d-tZ4SfL/+wI1mVulkgpidNGr0nM4\"",
    "mtime": "2025-03-31T14:41:31.844Z",
    "size": 969293,
    "path": "../public/_nuxt/DM3UtKzw.js"
  },
  "/_nuxt/DM8K2yAt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7dd-6tehR2hLsHvJqpTarWsZeI+IFRs\"",
    "mtime": "2025-03-31T14:41:32.303Z",
    "size": 2013,
    "path": "../public/_nuxt/DM8K2yAt.js"
  },
  "/_nuxt/Dmk2iwcq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1165-9nXAZioiFytdYkO/Qeovnnqmruk\"",
    "mtime": "2025-03-31T14:41:32.027Z",
    "size": 4453,
    "path": "../public/_nuxt/Dmk2iwcq.js"
  },
  "/_nuxt/DnHyzjbg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ee9-p6U584ZsOSDUCu7f/WYSFPHAzAk\"",
    "mtime": "2025-03-31T14:41:32.784Z",
    "size": 3817,
    "path": "../public/_nuxt/DnHyzjbg.js"
  },
  "/_nuxt/DNQimTgr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13e0-BHJLAAByoO/COD5LgIBWfMJ3568\"",
    "mtime": "2025-03-31T14:41:32.179Z",
    "size": 5088,
    "path": "../public/_nuxt/DNQimTgr.js"
  },
  "/_nuxt/DqITWiql.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"543-HCwJ5pW/dOfo0wLO0CRDdRBJh4M\"",
    "mtime": "2025-03-31T14:41:32.183Z",
    "size": 1347,
    "path": "../public/_nuxt/DqITWiql.js"
  },
  "/_nuxt/Drc7WvVn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"543-VxiaQueavWaUxN54xIhdS3J11EQ\"",
    "mtime": "2025-03-31T14:41:32.586Z",
    "size": 1347,
    "path": "../public/_nuxt/Drc7WvVn.js"
  },
  "/_nuxt/DrFmvdMM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7b-xl8MszLDjTQiVZuimKYOFxMjJ1Y\"",
    "mtime": "2025-03-31T14:41:32.023Z",
    "size": 123,
    "path": "../public/_nuxt/DrFmvdMM.js"
  },
  "/_nuxt/DrGOV_E_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"184a-1tWw6hhy5/+nH4N5Uz9MyOq0PGY\"",
    "mtime": "2025-03-31T14:41:32.361Z",
    "size": 6218,
    "path": "../public/_nuxt/DrGOV_E_.js"
  },
  "/_nuxt/DrQuvNYM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e2f-Hi6ee13MJ41g0r5dDUX8ibxSDig\"",
    "mtime": "2025-03-31T14:41:32.453Z",
    "size": 3631,
    "path": "../public/_nuxt/DrQuvNYM.js"
  },
  "/_nuxt/Ds1fOIw5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1dd0-R8g28AI5LtwBswCKXZyAtxBylYE\"",
    "mtime": "2025-03-31T14:41:32.344Z",
    "size": 7632,
    "path": "../public/_nuxt/Ds1fOIw5.js"
  },
  "/_nuxt/DS2XYUlK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24e6-jfHBAQuys92WVD9BWGGLiB3+ZQ0\"",
    "mtime": "2025-03-31T14:41:31.956Z",
    "size": 9446,
    "path": "../public/_nuxt/DS2XYUlK.js"
  },
  "/_nuxt/DsMJFJH-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"893b-gKuDuOf0bU39TV2W7+q6RhhIL58\"",
    "mtime": "2025-03-31T14:41:31.877Z",
    "size": 35131,
    "path": "../public/_nuxt/DsMJFJH-.js"
  },
  "/_nuxt/DSZPf7rp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fc2-JySsH5mq/KjcPjJw+bUGl2IRN2U\"",
    "mtime": "2025-03-31T14:41:32.625Z",
    "size": 4034,
    "path": "../public/_nuxt/DSZPf7rp.js"
  },
  "/_nuxt/DTECt2xU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26a1-ThvAAqyI33IkeBdcWyX2PC++Sts\"",
    "mtime": "2025-03-31T14:41:32.420Z",
    "size": 9889,
    "path": "../public/_nuxt/DTECt2xU.js"
  },
  "/_nuxt/DtxJlGys.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5a3-FwuOzNHpH2gEs2QNbF1kugvJf3o\"",
    "mtime": "2025-03-31T14:41:31.866Z",
    "size": 1443,
    "path": "../public/_nuxt/DtxJlGys.js"
  },
  "/_nuxt/dUCx_-0o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12a2-1V/ZFPnJ9eaEu0BsdaW9GFpzVao\"",
    "mtime": "2025-03-31T14:41:32.452Z",
    "size": 4770,
    "path": "../public/_nuxt/dUCx_-0o.js"
  },
  "/_nuxt/DuTYt8XJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f0e-4KhkhKeGGP9X744VQEy2O2FbYtI\"",
    "mtime": "2025-03-31T14:41:32.273Z",
    "size": 12046,
    "path": "../public/_nuxt/DuTYt8XJ.js"
  },
  "/_nuxt/Dv0QRyOL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"52-nJYmB3UpU1SL8fotGYXfeKrwxhE\"",
    "mtime": "2025-03-31T14:41:31.812Z",
    "size": 82,
    "path": "../public/_nuxt/Dv0QRyOL.js"
  },
  "/_nuxt/DvSLgmry.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"499b-HDFkLL9KgmDmRmW09jdVQA7no0U\"",
    "mtime": "2025-03-31T14:41:32.334Z",
    "size": 18843,
    "path": "../public/_nuxt/DvSLgmry.js"
  },
  "/_nuxt/DVVq2vc_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"262c-LkCI1YmzcYr67mDuJs1Fc4thGQk\"",
    "mtime": "2025-03-31T14:41:31.903Z",
    "size": 9772,
    "path": "../public/_nuxt/DVVq2vc_.js"
  },
  "/_nuxt/DWFODfDz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"82b-TL9gT2zEty7iectFgBE91TqVMeE\"",
    "mtime": "2025-03-31T14:41:32.048Z",
    "size": 2091,
    "path": "../public/_nuxt/DWFODfDz.js"
  },
  "/_nuxt/DwIaVK08.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"58-79/dK4vg7Wdy7RYG1FTBrfs1rPU\"",
    "mtime": "2025-03-31T14:41:31.746Z",
    "size": 88,
    "path": "../public/_nuxt/DwIaVK08.js"
  },
  "/_nuxt/DwJ7jVG9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1529-SoyYHSor0XMw7l/ikS3lFJNmKyk\"",
    "mtime": "2025-03-31T14:41:32.767Z",
    "size": 5417,
    "path": "../public/_nuxt/DwJ7jVG9.js"
  },
  "/_nuxt/DxfsymmB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ca9-gDNB9JXKsPEqsQ2DcPNS9brMoG4\"",
    "mtime": "2025-03-31T14:41:32.226Z",
    "size": 3241,
    "path": "../public/_nuxt/DxfsymmB.js"
  },
  "/_nuxt/DxRPqudL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1631-0qsRG88HFWfHM0ncrEvKAGVd1mc\"",
    "mtime": "2025-03-31T14:41:32.590Z",
    "size": 5681,
    "path": "../public/_nuxt/DxRPqudL.js"
  },
  "/_nuxt/DXyYeYxl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d6b-sGcrGYRsW9PkSr0hPYr/OCH89WA\"",
    "mtime": "2025-03-31T14:41:32.710Z",
    "size": 3435,
    "path": "../public/_nuxt/DXyYeYxl.js"
  },
  "/_nuxt/DYjwkT-j.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cac-Ym2/alqQsZ7alBlsf3wQRPGyT3Q\"",
    "mtime": "2025-03-31T14:41:31.927Z",
    "size": 3244,
    "path": "../public/_nuxt/DYjwkT-j.js"
  },
  "/_nuxt/DyP6w7ZV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1066-fJ0kHM8xQ/aKGZ4dw6sq8RzRSog\"",
    "mtime": "2025-03-31T14:41:32.398Z",
    "size": 4198,
    "path": "../public/_nuxt/DyP6w7ZV.js"
  },
  "/_nuxt/DZ2wmCvZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1136-nzAR1i7/eJzZcmTBtPJW3ntg3kM\"",
    "mtime": "2025-03-31T14:41:32.282Z",
    "size": 4406,
    "path": "../public/_nuxt/DZ2wmCvZ.js"
  },
  "/_nuxt/e9n0i_a3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b09-n6RRH7oMYXRc+qPwH2xLv2zSwXA\"",
    "mtime": "2025-03-31T14:41:31.881Z",
    "size": 2825,
    "path": "../public/_nuxt/e9n0i_a3.js"
  },
  "/_nuxt/editor.KTE2po9A.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2033d-UUEEQcPbpHgg41Xm3NT/Mmhfbig\"",
    "mtime": "2025-03-31T14:41:31.730Z",
    "size": 131901,
    "path": "../public/_nuxt/editor.KTE2po9A.css"
  },
  "/_nuxt/EN6Ksa-I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"22c-pMxO9vVzkv46locUjbGhnuff9ec\"",
    "mtime": "2025-03-31T14:41:32.018Z",
    "size": 556,
    "path": "../public/_nuxt/EN6Ksa-I.js"
  },
  "/_nuxt/entry.Bcf4y2Io.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9ca9f-w7vrWDMAApydJqinxYo4cRNUUyM\"",
    "mtime": "2025-03-31T14:41:31.562Z",
    "size": 641695,
    "path": "../public/_nuxt/entry.Bcf4y2Io.css"
  },
  "/_nuxt/eOfeW_Ug.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"941-WQqZjGiM/1DJ3IX6Dj3sGkpNVus\"",
    "mtime": "2025-03-31T14:41:32.206Z",
    "size": 2369,
    "path": "../public/_nuxt/eOfeW_Ug.js"
  },
  "/_nuxt/error-404.C3V-3Mc4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"de4-tk05rgubWwonEl8hX4lgLuosKN0\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 3556,
    "path": "../public/_nuxt/error-404.C3V-3Mc4.css"
  },
  "/_nuxt/error-500.dGVH929u.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75c-KF6NWZfD3QI/4EI5b2MfK1uNuAg\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 1884,
    "path": "../public/_nuxt/error-500.dGVH929u.css"
  },
  "/_nuxt/FFIopbBW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d31-dwMdtZDjOWqK3N0cBaXogpcAuh4\"",
    "mtime": "2025-03-31T14:41:32.256Z",
    "size": 3377,
    "path": "../public/_nuxt/FFIopbBW.js"
  },
  "/_nuxt/Fmrez-Io.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3552-AnesxnsVxZ5Bk48d1RuIOk/Pfgg\"",
    "mtime": "2025-03-31T14:41:32.234Z",
    "size": 13650,
    "path": "../public/_nuxt/Fmrez-Io.js"
  },
  "/_nuxt/fZlaJSUp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2051-nZthJ5Xnxj0yyv1h5cnG6Bj0zP8\"",
    "mtime": "2025-03-31T14:41:32.234Z",
    "size": 8273,
    "path": "../public/_nuxt/fZlaJSUp.js"
  },
  "/_nuxt/gh_EzRfA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8c6-2lXy6VMwxbqAZ0XQO7pVYyEKuOY\"",
    "mtime": "2025-03-31T14:41:32.226Z",
    "size": 2246,
    "path": "../public/_nuxt/gh_EzRfA.js"
  },
  "/_nuxt/GQ31Xt24.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fa6-JGTYwq6hVvFXOzRfq0US+PkoXYk\"",
    "mtime": "2025-03-31T14:41:32.242Z",
    "size": 8102,
    "path": "../public/_nuxt/GQ31Xt24.js"
  },
  "/_nuxt/html.worker.CgShHVgd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a5b77-lqOFHsfE/xT2hGTZ932oWKmH6ts\"",
    "mtime": "2025-03-31T14:41:31.562Z",
    "size": 678775,
    "path": "../public/_nuxt/html.worker.CgShHVgd.js"
  },
  "/_nuxt/i9-g7ZhI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"808-vjR89VB50h49Ha8qKqho4bXlkxg\"",
    "mtime": "2025-03-31T14:41:32.456Z",
    "size": 2056,
    "path": "../public/_nuxt/i9-g7ZhI.js"
  },
  "/_nuxt/index.BemvBnJ7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17d7-avcd1J+oBQ9do6xP/Zp5WUnXgRw\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 6103,
    "path": "../public/_nuxt/index.BemvBnJ7.css"
  },
  "/_nuxt/j9Ctmaa7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1529-iolNyzK0vmQ+YO3rNP2uY3g4KKw\"",
    "mtime": "2025-03-31T14:41:32.361Z",
    "size": 5417,
    "path": "../public/_nuxt/j9Ctmaa7.js"
  },
  "/_nuxt/json.worker.BdzgVb0v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"45e79-s+hyNQPmAVudh31dO028P2hylEk\"",
    "mtime": "2025-03-31T14:41:31.535Z",
    "size": 286329,
    "path": "../public/_nuxt/json.worker.BdzgVb0v.js"
  },
  "/_nuxt/login.qDjrbwVw.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"413-BYmTBiSuWM0C2cFoiDePYMIcj6M\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 1043,
    "path": "../public/_nuxt/login.qDjrbwVw.css"
  },
  "/_nuxt/M3P88Ces.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"400b-m9o35cemwxRPWXzrhg0Og96NGNo\"",
    "mtime": "2025-03-31T14:41:31.889Z",
    "size": 16395,
    "path": "../public/_nuxt/M3P88Ces.js"
  },
  "/_nuxt/materialdesignicons-webfont.B7mPwVP_.ttf": {
    "type": "font/ttf",
    "etag": "\"13f40c-T1Gk3HWmjT5XMhxEjv3eojyKnbA\"",
    "mtime": "2025-03-31T14:41:31.573Z",
    "size": 1307660,
    "path": "../public/_nuxt/materialdesignicons-webfont.B7mPwVP_.ttf"
  },
  "/_nuxt/materialdesignicons-webfont.CSr8KVlo.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"13f4e8-ApygSKV9BTQg/POr5dCUzjU5OZw\"",
    "mtime": "2025-03-31T14:41:31.565Z",
    "size": 1307880,
    "path": "../public/_nuxt/materialdesignicons-webfont.CSr8KVlo.eot"
  },
  "/_nuxt/materialdesignicons-webfont.Dp5v-WZN.woff2": {
    "type": "font/woff2",
    "etag": "\"62710-TiD2zPQxmd6lyFsjoODwuoH/7iY\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 403216,
    "path": "../public/_nuxt/materialdesignicons-webfont.Dp5v-WZN.woff2"
  },
  "/_nuxt/materialdesignicons-webfont.PXm3-2wK.woff": {
    "type": "font/woff",
    "etag": "\"8f8d0-zD3UavWtb7zNpwtFPVWUs57NasQ\"",
    "mtime": "2025-03-31T14:41:31.565Z",
    "size": 587984,
    "path": "../public/_nuxt/materialdesignicons-webfont.PXm3-2wK.woff"
  },
  "/_nuxt/monaco-editor-vue3.D06pSbay.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12c36-ijg+hdyUrTTgjAXPtHRwH0pa9CY\"",
    "mtime": "2025-03-31T14:41:31.726Z",
    "size": 76854,
    "path": "../public/_nuxt/monaco-editor-vue3.D06pSbay.css"
  },
  "/_nuxt/N--KTuNj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"496-QROzdx+9FAnOZku28MtMuEiO/tA\"",
    "mtime": "2025-03-31T14:41:31.742Z",
    "size": 1174,
    "path": "../public/_nuxt/N--KTuNj.js"
  },
  "/_nuxt/newsletter-admin.Cwhmcas1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1588-Nc+Jcm4Dc9pf2PoZVJsrqr0Y7RA\"",
    "mtime": "2025-03-31T14:41:31.661Z",
    "size": 5512,
    "path": "../public/_nuxt/newsletter-admin.Cwhmcas1.css"
  },
  "/_nuxt/nf6ki56Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"941-JxOKAmhVxTjoK4S7GtjR5Q3bs6o\"",
    "mtime": "2025-03-31T14:41:32.592Z",
    "size": 2369,
    "path": "../public/_nuxt/nf6ki56Z.js"
  },
  "/_nuxt/niPK7UV1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1291-dvbRJq9ndKtpZLAV8ncXgjwwAyM\"",
    "mtime": "2025-03-31T14:41:32.094Z",
    "size": 4753,
    "path": "../public/_nuxt/niPK7UV1.js"
  },
  "/_nuxt/OdQqwJQJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b995-Gl9DpRp+/VyyqOErztmuIUzspuA\"",
    "mtime": "2025-03-31T14:41:31.822Z",
    "size": 47509,
    "path": "../public/_nuxt/OdQqwJQJ.js"
  },
  "/_nuxt/oh6kpzaa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fc2-JyK/pW6c4+OjbSr0kcAvR50UeBw\"",
    "mtime": "2025-03-31T14:41:32.210Z",
    "size": 4034,
    "path": "../public/_nuxt/oh6kpzaa.js"
  },
  "/_nuxt/Pb9tSMRi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"80a2-O7gMdKucD2lW9SV09E8xZwIig/c\"",
    "mtime": "2025-03-31T14:41:32.874Z",
    "size": 32930,
    "path": "../public/_nuxt/Pb9tSMRi.js"
  },
  "/_nuxt/pnP8ivHi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ddd-UGxKj6HS6GsHtUUQC3pwYBj1KXQ\"",
    "mtime": "2025-03-31T14:41:32.762Z",
    "size": 7645,
    "path": "../public/_nuxt/pnP8ivHi.js"
  },
  "/_nuxt/PremiumFeature.B5psH5s8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a04-G8nbX0rtgMFIj2ewSMG8PNlIqsI\"",
    "mtime": "2025-03-31T14:41:31.687Z",
    "size": 2564,
    "path": "../public/_nuxt/PremiumFeature.B5psH5s8.css"
  },
  "/_nuxt/privacy.Byi58teo.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"72-+yCWJ+UoToIKzDPWjXhLiZpY9UM\"",
    "mtime": "2025-03-31T14:41:31.617Z",
    "size": 114,
    "path": "../public/_nuxt/privacy.Byi58teo.css"
  },
  "/_nuxt/q4at8ZKZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1174-jPbfAZEnnJuUp1rJTS81ULbqg4A\"",
    "mtime": "2025-03-31T14:41:32.680Z",
    "size": 4468,
    "path": "../public/_nuxt/q4at8ZKZ.js"
  },
  "/_nuxt/QdLKpUbr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bf7-Hp1nRLkpdEnOCdcb+oXIoGW9dF4\"",
    "mtime": "2025-03-31T14:41:31.832Z",
    "size": 3063,
    "path": "../public/_nuxt/QdLKpUbr.js"
  },
  "/_nuxt/responsive.DAKPTiaV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"679-PVrGFf62E0SstGIKU58FoDIGR7g\"",
    "mtime": "2025-03-31T14:41:31.621Z",
    "size": 1657,
    "path": "../public/_nuxt/responsive.DAKPTiaV.css"
  },
  "/_nuxt/robots.BR9qd3mr.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e1-wiyBeSVzAriLILdSngzaqhsN7ro\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 481,
    "path": "../public/_nuxt/robots.BR9qd3mr.css"
  },
  "/_nuxt/rUNN04Wq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1426-2ukGkxGdVD5OdDQiiaX5WNoVx1w\"",
    "mtime": "2025-03-31T14:41:32.625Z",
    "size": 5158,
    "path": "../public/_nuxt/rUNN04Wq.js"
  },
  "/_nuxt/seo-audit.CRWGJKZQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"50f-Z3MAIb4mUYIvGAnDoStgH9Fw4jc\"",
    "mtime": "2025-03-31T14:41:31.621Z",
    "size": 1295,
    "path": "../public/_nuxt/seo-audit.CRWGJKZQ.css"
  },
  "/_nuxt/settings.BYYUTlWl.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"42-T7iZHnwkSoogl+/Hkpad9jcIY/w\"",
    "mtime": "2025-03-31T14:41:31.617Z",
    "size": 66,
    "path": "../public/_nuxt/settings.BYYUTlWl.css"
  },
  "/_nuxt/signup.wqjtapV_.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3e5-p2snsAGlM3byGWCAb5xf8x62yZU\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 997,
    "path": "../public/_nuxt/signup.wqjtapV_.css"
  },
  "/_nuxt/snackbar.ChZSsda1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1b8-EclXcCzcpXnxnnOUKYBim+Ke2PI\"",
    "mtime": "2025-03-31T14:41:31.641Z",
    "size": 440,
    "path": "../public/_nuxt/snackbar.ChZSsda1.css"
  },
  "/_nuxt/snippets.Dx5nIY82.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"501-BtHJeAjXNEH2idnEQX7AhP2xIGA\"",
    "mtime": "2025-03-31T14:41:31.619Z",
    "size": 1281,
    "path": "../public/_nuxt/snippets.Dx5nIY82.css"
  },
  "/_nuxt/snippetsView.DYtszVqW.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8c2-zQfNOUd5vLMLXWShU79oAh/U5Dw\"",
    "mtime": "2025-03-31T14:41:31.625Z",
    "size": 2242,
    "path": "../public/_nuxt/snippetsView.DYtszVqW.css"
  },
  "/_nuxt/sql-generator.CYyuISfs.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"50c-j5XK4k4j9D5xEnfzBU2SLXf3IGk\"",
    "mtime": "2025-03-31T14:41:31.641Z",
    "size": 1292,
    "path": "../public/_nuxt/sql-generator.CYyuISfs.css"
  },
  "/_nuxt/studio.BH6C-zu6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4039-Rr1xvTNxAUI5x+l7cPAFN4W8hh8\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 16441,
    "path": "../public/_nuxt/studio.BH6C-zu6.css"
  },
  "/_nuxt/subscription.WuC3DulS.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2f-YNfkUNLdsznzIA3Ij/GcJPV2u8c\"",
    "mtime": "2025-03-31T14:41:31.625Z",
    "size": 47,
    "path": "../public/_nuxt/subscription.WuC3DulS.css"
  },
  "/_nuxt/terms.6Av-50LR.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e4-9iDu35DDoS1XEfR9NcvZKdmenak\"",
    "mtime": "2025-03-31T14:41:31.559Z",
    "size": 484,
    "path": "../public/_nuxt/terms.6Av-50LR.css"
  },
  "/_nuxt/tGk8EFnU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"358e-u4kNxCRvmu8Xfuy+ozQ8RBPGXJQ\"",
    "mtime": "2025-03-31T14:41:32.665Z",
    "size": 13710,
    "path": "../public/_nuxt/tGk8EFnU.js"
  },
  "/_nuxt/timjmmDh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"81c83-z5NqA8P0ytOxixuatyOxaoSSEpc\"",
    "mtime": "2025-03-31T14:41:31.850Z",
    "size": 531587,
    "path": "../public/_nuxt/timjmmDh.js"
  },
  "/_nuxt/ts.worker.7CkXc5qG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"aac179-Re2u/dBpf+EfMG3xZIQsJeqtqn0\"",
    "mtime": "2025-03-31T14:41:31.814Z",
    "size": 11190649,
    "path": "../public/_nuxt/ts.worker.7CkXc5qG.js"
  },
  "/_nuxt/Tw7wswEv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"499b-ShgFKXXCUnT0uAhY6eB8K/X2JbA\"",
    "mtime": "2025-03-31T14:41:32.762Z",
    "size": 18843,
    "path": "../public/_nuxt/Tw7wswEv.js"
  },
  "/_nuxt/U-9V1rhU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ea9-XmFB9DjFmM0LeRkmBlBnjCNIj4c\"",
    "mtime": "2025-03-31T14:41:32.344Z",
    "size": 7849,
    "path": "../public/_nuxt/U-9V1rhU.js"
  },
  "/_nuxt/UAr4owVR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d8b-3SY7W1Q0zNrapDcQCRbsoTgDPZE\"",
    "mtime": "2025-03-31T14:41:32.189Z",
    "size": 3467,
    "path": "../public/_nuxt/UAr4owVR.js"
  },
  "/_nuxt/UJcnvmYG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bd27-PJRWXX9H/cqSu7xXQsYgzVxMNjk\"",
    "mtime": "2025-03-31T14:41:31.844Z",
    "size": 48423,
    "path": "../public/_nuxt/UJcnvmYG.js"
  },
  "/_nuxt/VAlert.BlJspLtK.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"106e-xLL8mlu99dxmjtGJryHf+xopXAU\"",
    "mtime": "2025-03-31T14:41:31.641Z",
    "size": 4206,
    "path": "../public/_nuxt/VAlert.BlJspLtK.css"
  },
  "/_nuxt/VAppBar.CtzDvqhp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e4-hknLGgY2bCmc7YC3WrLaJNKIFgg\"",
    "mtime": "2025-03-31T14:41:31.683Z",
    "size": 484,
    "path": "../public/_nuxt/VAppBar.CtzDvqhp.css"
  },
  "/_nuxt/VCheckbox.CvH8ekHL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"6d-0CbFad/TQeJ4x6jaztFtqpweNjY\"",
    "mtime": "2025-03-31T14:41:31.583Z",
    "size": 109,
    "path": "../public/_nuxt/VCheckbox.CvH8ekHL.css"
  },
  "/_nuxt/VChip.BgnjZCg3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b57-ZVLZFK7VeoNiADmnWotGDKdrsHQ\"",
    "mtime": "2025-03-31T14:41:31.687Z",
    "size": 11095,
    "path": "../public/_nuxt/VChip.BgnjZCg3.css"
  },
  "/_nuxt/VDataTable.KyR7Jagd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1b06-SlRAfORoCY7Tq8zh2/TQaEQrmJY\"",
    "mtime": "2025-03-31T14:41:31.671Z",
    "size": 6918,
    "path": "../public/_nuxt/VDataTable.KyR7Jagd.css"
  },
  "/_nuxt/VExpansionPanels.BlzZGA8i.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1829-P98AjnAHeozdSUdGcFBq/MZJ9tk\"",
    "mtime": "2025-03-31T14:41:31.692Z",
    "size": 6185,
    "path": "../public/_nuxt/VExpansionPanels.BlzZGA8i.css"
  },
  "/_nuxt/VFileInput.C7ovZLho.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"36b-3uThVk1v7dRc7X6fQ5nSYvLcBLw\"",
    "mtime": "2025-03-31T14:41:31.619Z",
    "size": 875,
    "path": "../public/_nuxt/VFileInput.C7ovZLho.css"
  },
  "/_nuxt/VFooter.CtZSY16K.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31d-NGxQqbBpQt18kaQkUgB6oIZUxiU\"",
    "mtime": "2025-03-31T14:41:31.617Z",
    "size": 797,
    "path": "../public/_nuxt/VFooter.CtZSY16K.css"
  },
  "/_nuxt/VKWw1kvT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3fda-0DZrqxgNsgWEI2oiurrnBxGFOyY\"",
    "mtime": "2025-03-31T14:41:32.101Z",
    "size": 16346,
    "path": "../public/_nuxt/VKWw1kvT.js"
  },
  "/_nuxt/VMain.BIPNqcQO.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1cb-kPl0EPgrtg8oT4/AquyXupUaTns\"",
    "mtime": "2025-03-31T14:41:31.692Z",
    "size": 459,
    "path": "../public/_nuxt/VMain.BIPNqcQO.css"
  },
  "/_nuxt/VNavigationDrawer.-BkHTg-_.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"85a-cInigacGI0cDRW9o1YofyL1fdhA\"",
    "mtime": "2025-03-31T14:41:31.671Z",
    "size": 2138,
    "path": "../public/_nuxt/VNavigationDrawer.-BkHTg-_.css"
  },
  "/_nuxt/VSelect.bEynARP7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"713-2uT11swIiFMjAC1WW4HuasDO1Ko\"",
    "mtime": "2025-03-31T14:41:31.673Z",
    "size": 1811,
    "path": "../public/_nuxt/VSelect.bEynARP7.css"
  },
  "/_nuxt/VSheet.BOaw1GDg.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2a7-zfqDAwvwv4zh7k4J31uj+r6hY6E\"",
    "mtime": "2025-03-31T14:41:31.692Z",
    "size": 679,
    "path": "../public/_nuxt/VSheet.BOaw1GDg.css"
  },
  "/_nuxt/VSlider.DSBTv41H.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"281c-bfECh+abbTk/i1GOX2Tpnf3o/Q8\"",
    "mtime": "2025-03-31T14:41:31.667Z",
    "size": 10268,
    "path": "../public/_nuxt/VSlider.DSBTv41H.css"
  },
  "/_nuxt/VTable.C9uvOfDc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e76-Lr6YchJh3trRflyHEEFTdTR9/Ns\"",
    "mtime": "2025-03-31T14:41:31.671Z",
    "size": 3702,
    "path": "../public/_nuxt/VTable.C9uvOfDc.css"
  },
  "/_nuxt/VTabs.uUUnl-Bb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"6f4-MiJEyNsHn8NGnJTrdXIMJK2tlgw\"",
    "mtime": "2025-03-31T14:41:31.669Z",
    "size": 1780,
    "path": "../public/_nuxt/VTabs.uUUnl-Bb.css"
  },
  "/_nuxt/VTextarea.C6yB-CbO.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"49a-XTDbZQ6O4AQVrKoeJy2/7Av7kUo\"",
    "mtime": "2025-03-31T14:41:31.667Z",
    "size": 1178,
    "path": "../public/_nuxt/VTextarea.C6yB-CbO.css"
  },
  "/_nuxt/VTextField.BjfbVQgJ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4908-JOHfc5+WHg5FGTV71aZ6beQTrt8\"",
    "mtime": "2025-03-31T14:41:31.692Z",
    "size": 18696,
    "path": "../public/_nuxt/VTextField.BjfbVQgJ.css"
  },
  "/_nuxt/VTimeline.DIGMV1n3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"341c-lys4jLAvNabzNwRc8apKe59fHq0\"",
    "mtime": "2025-03-31T14:41:31.619Z",
    "size": 13340,
    "path": "../public/_nuxt/VTimeline.DIGMV1n3.css"
  },
  "/_nuxt/VToolbar.CUYickqT.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9b9-bdgqQoxxYxLPBp4QSAsvTBLP28w\"",
    "mtime": "2025-03-31T14:41:31.687Z",
    "size": 2489,
    "path": "../public/_nuxt/VToolbar.CUYickqT.css"
  },
  "/_nuxt/VTooltip.DtANW6X5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"250-DgODvwT7kinzpsMkhFfH94zceM8\"",
    "mtime": "2025-03-31T14:41:31.661Z",
    "size": 592,
    "path": "../public/_nuxt/VTooltip.DtANW6X5.css"
  },
  "/_nuxt/VWindowItem.D49w9jIi.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"743-L3w5ilmw+RaFEXGW2iHG6KrriOA\"",
    "mtime": "2025-03-31T14:41:31.667Z",
    "size": 1859,
    "path": "../public/_nuxt/VWindowItem.D49w9jIi.css"
  },
  "/_nuxt/Ww5fUqwT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"37b-1ccEyY9gwIJn1hsd6LCL33d61Mw\"",
    "mtime": "2025-03-31T14:41:31.877Z",
    "size": 891,
    "path": "../public/_nuxt/Ww5fUqwT.js"
  },
  "/_nuxt/WWUajodx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1754-wKxQQK5VOwp+mp7PE2v6ESB26tg\"",
    "mtime": "2025-03-31T14:41:31.872Z",
    "size": 5972,
    "path": "../public/_nuxt/WWUajodx.js"
  },
  "/_nuxt/YKwM1h37.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"166c-jEemmqgVZEKMz+8KjpPZtJiE8Pk\"",
    "mtime": "2025-03-31T14:41:31.732Z",
    "size": 5740,
    "path": "../public/_nuxt/YKwM1h37.js"
  },
  "/_nuxt/yurC-brj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a58-7ndYeL23BrFukSGaByysjMn2aIc\"",
    "mtime": "2025-03-31T14:41:32.226Z",
    "size": 2648,
    "path": "../public/_nuxt/yurC-brj.js"
  },
  "/_nuxt/YWi4-JPR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a7b-30G1uyS9B4ih29ASw11LmnEHXcA\"",
    "mtime": "2025-03-31T14:41:32.592Z",
    "size": 2683,
    "path": "../public/_nuxt/YWi4-JPR.js"
  },
  "/_nuxt/zHgrgSpo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b70-llHrtc3gCla+Ly+0MzA68N/or/k\"",
    "mtime": "2025-03-31T14:41:32.177Z",
    "size": 7024,
    "path": "../public/_nuxt/zHgrgSpo.js"
  },
  "/_nuxt/Zznr-cwX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"843-kDCj3SHg3KwlN+8QlTEoCcxJw3M\"",
    "mtime": "2025-03-31T14:41:32.455Z",
    "size": 2115,
    "path": "../public/_nuxt/Zznr-cwX.js"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-lOXm5dY4UWNrmCYDTqm2J5OUWZU\"",
    "mtime": "2025-03-31T14:42:30.864Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/2845db00-0d2d-4e92-b045-75df1e83f651.json": {
    "type": "application/json",
    "etag": "\"8b-fM/TxujRSAA8eYe68nRvfhavKJc\"",
    "mtime": "2025-03-31T14:42:30.866Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/2845db00-0d2d-4e92-b045-75df1e83f651.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _OLQYPM = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "25060"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const db = /*#__PURE__*/Object.freeze({
  __proto__: null,
  pool: pool
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
  try {
    const url = event.path || "";
    if (url.startsWith("/api/")) {
      console.log(`Middleware auth - URL: ${url}`);
    }
    const isStaticFile = url.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/i);
    if (isStaticFile) {
      if (false) ;
      return;
    }
    if (event.node.req.method === "OPTIONS") {
      setResponseHeaders(event, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      });
      event.node.res.statusCode = 204;
      return;
    }
    setResponseHeaders(event, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    if (publicRoutes.some((route) => {
      if (route === "/") return url === "/";
      const normalizedRoute = route.toLowerCase();
      const normalizedUrl = url.toLowerCase();
      return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(`${normalizedRoute}/`);
    })) {
      if (false) ;
      return;
    }
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader == null ? void 0 : authHeader.substring(7);
    if (!token) {
      console.log(`Authentication requise pour: ${url} - Token manquant`);
      throw createError$1({
        statusCode: 401,
        statusMessage: "Authentification requise"
      });
    }
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
      if (false) ;
      const [rows] = await pool.execute(
        "SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?",
        [payload.userId]
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        console.log(`Utilisateur non trouv\xE9 pour le token: ${token.substring(0, 10)}...`);
        throw createError$1({
          statusCode: 401,
          message: "Non autoris\xE9 - Utilisateur non trouv\xE9"
        });
      }
      const user = rows[0];
      if (false) ;
      if (premiumRoutes.some((route) => {
        const normalizedRoute = route.toLowerCase();
        const normalizedUrl = url.toLowerCase();
        return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(`${normalizedRoute}/`);
      })) {
        const userRow = rows[0];
        const isPremium = userRow.isPremium === 1;
        if (!isPremium) {
          console.log(`Acc\xE8s premium requis pour: ${url} - L'utilisateur n'est pas premium`);
          if (url.startsWith("/api/")) {
            throw createError$1({
              statusCode: 403,
              message: "Interdit - Abonnement premium requis"
            });
          } else {
            return {
              statusCode: 302,
              headers: {
                "Location": "/subscription"
              }
            };
          }
        }
      }
      if (adminRoutes.some((route) => {
        const normalizedRoute = route.toLowerCase();
        const normalizedUrl = url.toLowerCase();
        return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(`${normalizedRoute}/`);
      })) {
        const userRow = rows[0];
        const isAdmin = userRow.isAdmin === 1;
        if (!isAdmin) {
          console.log(`Acc\xE8s admin requis pour: ${url} - L'utilisateur n'est pas admin`);
          throw createError$1({
            statusCode: 404,
            message: "Non trouv\xE9"
          });
        }
      }
      event.context.user = {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
        isPremium: payload.isPremium,
        isAdmin: payload.isAdmin
      };
      if (false) ;
    } catch (tokenError) {
      console.log(`Token invalide ou expir\xE9: ${token.substring(0, 10)}...`);
      if (false) ;
      throw createError$1({
        statusCode: 401,
        statusMessage: "Token invalide ou expir\xE9"
      });
    }
  } catch (error) {
    {
      console.error("Erreur d'authentification:", error.statusCode || 500);
    }
  }
});

const _lazy_OBOGTm = () => import('../routes/api/analytics.mjs');
const _lazy_Pmfqoj = () => import('../routes/api/analytics/collect.mjs');
const _lazy_VhW_QU = () => import('../routes/api/audit.mjs');
const _lazy_mJO9II = () => import('../routes/api/auth/deleteAccount.mjs');
const _lazy_Kbt8IY = () => import('../routes/api/auth/login.mjs');
const _lazy_3kY9Rh = () => import('../routes/api/auth/logout.mjs');
const _lazy_F24rHc = () => import('../routes/api/auth/refresh.mjs');
const _lazy_KnUWBM = () => import('../routes/api/auth/resetPassword.mjs');
const _lazy_6u5Smn = () => import('../routes/api/auth/session.mjs');
const _lazy_CTSmy_ = () => import('../routes/api/auth/signup.mjs');
const _lazy_6Jv7b8 = () => import('../routes/api/auth/updateUser.mjs');
const _lazy_mUFkuh = () => import('../routes/api/cookies.mjs');
const _lazy_LPSFG5 = () => Promise.resolve().then(function () { return db; });
const _lazy_L_GoMK = () => import('../routes/api/monitoring/system.mjs');
const _lazy_CE8ZnI = () => import('../routes/api/newsletter/createNewsletter.mjs');
const _lazy_USw7qh = () => import('../routes/api/newsletter/history.mjs');
const _lazy_g_pRjz = () => import('../routes/api/newsletter/send.mjs');
const _lazy_FrhKgJ = () => import('../routes/api/newsletter/stats.mjs');
const _lazy_emXLN8 = () => import('../routes/api/newsletter/subscribe.mjs');
const _lazy_V6gwph = () => import('../routes/api/newsletter/subscribers.mjs');
const _lazy_eecCbi = () => import('../routes/api/newsletter/unsubscribe.mjs');
const _lazy_e07_Wb = () => import('../routes/api/newsletter/update-stats.mjs');
const _lazy_IZWTvI = () => import('../routes/api/payment/create-intent.mjs');
const _lazy_bRtRgE = () => import('../routes/api/proxy/ipapi.mjs');
const _lazy_bD49h1 = () => import('../routes/api/seed-analytics-data.mjs');
const _lazy_NuJsmD = () => import('../routes/api/seed-marketing-data.mjs');
const _lazy_3M9n6I = () => import('../routes/api/seo-audit.pdf.post.mjs');
const _lazy_9_KdIG = () => import('../routes/api/seo-audit.mjs');
const _lazy_OILQF9 = () => import('../routes/api/snippets/addFavorite.mjs');
const _lazy_pETFpc = () => import('../routes/api/snippets/addSnippets.mjs');
const _lazy_Sf0fg_ = () => import('../routes/api/snippets/deleteSnippet.mjs');
const _lazy_TjQeR2 = () => import('../routes/api/snippets/loadSnippets.mjs');
const _lazy_7vzK_J = () => import('../routes/api/snippets/removeFavorite.mjs');
const _lazy_cVXlyV = () => import('../routes/api/snippets/updateSnippet.mjs');
const _lazy_uVDfxP = () => import('../routes/api/sql/_id_.delete.mjs');
const _lazy_7zvQAX = () => import('../routes/api/sql/loadSQLSchemas.mjs');
const _lazy_GmlFeb = () => import('../routes/api/sql/saveSQLSchema.mjs');
const _lazy_ahe0vz = () => import('../routes/api/studio/removeTemplate/_id_.mjs');
const _lazy_3Pxp4R = () => import('../routes/api/studio/saveTemplate.mjs');
const _lazy_mmR3HB = () => import('../routes/api/upload.mjs');
const _lazy_1lwWga = () => import('../routes/api/user/check-admin.mjs');
const _lazy_dJE7jX = () => import('../routes/api/user/loadData.mjs');
const _lazy_1AzbyB = () => import('../routes/api/users/update-premium.mjs');
const _lazy_RZMI4n = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _OLQYPM, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _P9I9Nd, lazy: false, middleware: true, method: undefined },
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
    debug: destr(false),
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
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return O(
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
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
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

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

export { ACCESS_TOKEN_SECRET as A, getResponseStatus as B, defineRenderHandler as C, getRouteRules as D, createHooks as E, getContext as F, toRouteMatcher as G, createRouter$1 as H, defu as I, hasProtocol as J, joinURL as K, withQuery as L, sanitizeStatusCode as M, isScriptProtocol as N, executeAsync as O, klona as P, isEqual as Q, REFRESH_TOKEN_SECRET as R, parseQuery as S, withTrailingSlash as T, withoutTrailingSlash as U, trapUnhandledNodeErrors as a, useNitroApp as b, defineEventHandler as c, destr as d, createError$1 as e, ACCESS_TOKEN_EXPIRY as f, getHeaders as g, REFRESH_TOKEN_EXPIRY as h, setCookie as i, REFRESH_TOKEN_COOKIE_NAME as j, REFRESH_TOKEN_COOKIE_OPTIONS as k, getCookie as l, deleteCookie as m, getRequestHeaders as n, getQuery as o, pool as p, getRequestHeader as q, readBody as r, setupGracefulShutdown as s, toNodeListener as t, useRuntimeConfig as u, setHeader as v, getRouterParam as w, getHeader as x, joinRelativeURL as y, getResponseStatusText as z };
//# sourceMappingURL=nitro.mjs.map
