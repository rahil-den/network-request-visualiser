import { bus } from './event-bus';
import type { RequestEntry, CacheStatus } from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function headersToRecord(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// Parses the raw string returned by XHR.getAllResponseHeaders() into a plain object.
// The raw string looks like:  "content-type: application/json\r\ncontent-length: 42\r\n"
function xhrHeadersToRecord(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  raw
    .trim()
    .split('\r\n')
    .forEach((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      result[key] = value;
    });
  return result;
}

function detectCacheStatus(status: number, headers: Headers): CacheStatus {
  if (status === 304) return 'REVALIDATED';
  if (headers.get('x-cache') === 'HIT') return 'HIT';
  return 'MISS';
}

// ─── Fetch Interceptor ────────────────────────────────────────────────────────

export function interceptFetch() {
  const _fetch = window.fetch;

  window.fetch = async (...args) => {
    const startTime = performance.now();
    const [input, options] = args;
    const url = String(input);
    const method = (options?.method ?? 'GET').toUpperCase();

    try {
      const response = await _fetch(...args);
      const duration = performance.now() - startTime;

      const responseHeaders = headersToRecord(response.headers);
      const size = Number(responseHeaders['content-length']) || 0;
      const cacheStatus = detectCacheStatus(response.status, response.headers);

      const entry: RequestEntry = {
        id: crypto.randomUUID(),
        url,
        method,
        status: response.status,
        startTime,
        duration,
        cacheStatus,
        requestHeaders: options?.headers
          ? headersToRecord(new Headers(options.headers as HeadersInit))
          : {},
        responseHeaders,
        size,
      };

      bus.emit('request', entry);
      return response;
    } catch (e) {
      const duration = performance.now() - startTime;

      const entry: RequestEntry = {
        id: crypto.randomUUID(),
        url,
        method,
        status: 0,
        startTime,
        duration,
        cacheStatus: 'MISS',
        requestHeaders: {},
        responseHeaders: {},
        size: 0,
      };

      bus.emit('request', entry);
      throw e;
    }
  };
}

// ─── XHR Interceptor ──────────────────────────────────────────────────────────

export function interceptXHR() {
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;

  // We use `function` (not arrow) so that `this` refers to the XHR instance.
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest & { _url: string; _method: string },
    method: string,
    url: string | URL,
    ...rest: [boolean?, string?, string?]
  ) {
    this._url = String(url);
    this._method = method.toUpperCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_open as any).call(this, method, url, ...rest);
  } as typeof XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.send = function (
    this: XMLHttpRequest & { _url: string; _method: string },
    body?: Document | XMLHttpRequestBodyInit | null,
  ) {
    const startTime = performance.now();

    const onLoadEnd = () => {
      const duration = performance.now() - startTime;

      // XHR gives back a raw header string — we parse it ourselves.
      const rawHeaders = this.getAllResponseHeaders();
      const responseHeaders = xhrHeadersToRecord(rawHeaders);
      const size = Number(responseHeaders['content-length']) || 0;

      // Wrap in a Headers object so detectCacheStatus can use .get()
      const cacheStatus = detectCacheStatus(
        this.status,
        new Headers(responseHeaders),
      );

      const entry: RequestEntry = {
        id: crypto.randomUUID(),
        url: this._url ?? '',
        method: this._method ?? 'GET',
        status: this.status,
        startTime,
        duration,
        cacheStatus,
        requestHeaders: {},   // XHR doesn't expose sent headers to JS
        responseHeaders,
        size,
      };

      bus.emit('request', entry);
      this.removeEventListener('loadend', onLoadEnd);
    };

    this.addEventListener('loadend', onLoadEnd);
    _send.call(this, body);
  };
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initInterceptors() {
  // Guard: window doesn't exist on the server (Next.js SSR).
  // Without this check, the module would crash during the server-side render.
  if (typeof window === 'undefined') return;

  interceptFetch();
  interceptXHR();
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
//
// This file silently wraps the two ways a browser can make network requests —
// fetch() and XMLHttpRequest — so every outgoing call is captured and sent to
// the Event Bus, without breaking any of the original behaviour.
//
// The technique is called monkey-patching:
//   1. Save the original global (window.fetch / XHR.prototype.open+send)
//   2. Replace it with our wrapper function
//   3. Inside the wrapper: record timing, build a RequestEntry, emit it
//   4. Call through to the original so the rest of the app is unaffected
//
// headersToRecord  — converts the browser's Headers object → plain JS object
// xhrHeadersToRecord — parses XHR's raw "key: value\r\n" header string → plain object
// detectCacheStatus — reads status code and x-cache header to decide HIT/MISS/REVALIDATED
// interceptFetch   — patches window.fetch
// interceptXHR     — patches XMLHttpRequest.prototype.open and .send
// initInterceptors — entry point called once on mount; skips if running on the server (SSR)
// ─────────────────────────────────────────────────────────────────────────────
