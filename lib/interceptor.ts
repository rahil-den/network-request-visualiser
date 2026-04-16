// ─────────────────────────────────────────────────────────────────────────────
// lib/interceptor.ts
// Monkey-patches window.fetch and XMLHttpRequest to capture every network request.
//
// 🧠 CONCEPT: Monkey-patching
//   JavaScript lets you replace any global function at runtime.
//   We save the original, replace it with our wrapper, do our work,
//   then call the original so the app still works normally.
//
//   This is exactly how Jest mocks, Sentry error tracking, and
//   browser extensions intercept network calls.
// ─────────────────────────────────────────────────────────────────────────────

import { bus } from './event-bus';
import type { RequestEntry, CacheStatus } from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

// TODO 1: Write a helper function called `headersToRecord`.
//         Signature: (headers: Headers) => Record<string, string>
//         It converts a browser `Headers` object into a plain object.
//         💡 Use headers.forEach((value, key) => { ... }) to iterate.
//            Headers is a special browser class, not a plain object.

// TODO 2: Write a helper function called `detectCacheStatus`.
//         Signature: (status: number, headers: Headers) => CacheStatus
//         Logic:
//           - If status === 304 → return "REVALIDATED"
//             (304 means the server said "nothing changed, use your cached copy")
//           - If the response header 'x-cache' === 'HIT' → return "HIT"
//             (our Service Worker will add this header)
//           - Otherwise → return "MISS"
//         💡 headers.get('x-cache') returns the header value or null.

// ─── Fetch Interceptor ───────────────────────────────────────────────────────

// TODO 3: Write an exported function called `interceptFetch`.
//         It should:
//           a. Save the original: const _fetch = window.fetch
//           b. Replace window.fetch with an async function that:
//              1. Records `startTime = performance.now()`
//              2. Calls the original _fetch with the same arguments
//              3. Records `duration = performance.now() - startTime`
//              4. Reads the response headers (careful: response.headers is a Headers object)
//              5. Reads Content-Length header for `size` (parse as number, default 0)
//              6. Builds a RequestEntry object (generate id with crypto.randomUUID())
//              7. Emits it: bus.emit('request', entry)
//              8. Returns the response (so the app still works!)
//           c. Handle errors: wrap in try/catch — if fetch throws, still emit
//              an entry with status: 0, duration: performance.now() - startTime
//
//         💡 `window.fetch` can accept (url, options) or (Request, options).
//            For simplicity, handle the URL as: String(input) where input is the first arg.
//         💡 To get the method: options?.method ?? 'GET'

// ─── XHR Interceptor ─────────────────────────────────────────────────────────

// TODO 4: Write an exported function called `interceptXHR`.
//         XMLHttpRequest is more complex than fetch — it's event-driven.
//         Steps:
//           a. Save originals:
//                const _open = XMLHttpRequest.prototype.open
//                const _send = XMLHttpRequest.prototype.send
//
//           b. Replace XMLHttpRequest.prototype.open with a function that:
//              - Stores `this._url` and `this._method` on the XHR instance
//              - Calls the original _open with the same arguments
//              (💡 use .apply(this, arguments) or spread the params)
//
//           c. Replace XMLHttpRequest.prototype.send with a function that:
//              - Records startTime = performance.now()
//              - Adds a 'loadend' event listener on `this` that fires when the request completes
//              - Inside the listener: build a RequestEntry and emit it via bus
//              - Then calls the original _send
//
//         💡 Inside the XHR prototype override, `this` refers to the XHR instance.
//            You'll need to use `function` (not arrow function) so `this` is correct.
//         💡 this.status → response status code
//            this.getResponseHeader('content-length') → size
//            You won't have a Headers object here — use getResponseHeader() instead.

// ─── Init ────────────────────────────────────────────────────────────────────

// TODO 5: Export a function called `initInterceptors`.
//         It should call interceptFetch() and interceptXHR().
//         Add a guard so it only runs in the browser (not during SSR):
//           if (typeof window === 'undefined') return;
//
//         💡 Next.js runs your code on the server during SSR.
//            `window` doesn't exist on the server, so we must guard against it.
