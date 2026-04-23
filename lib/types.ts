// ─────────────────────────────────────────────────────────────────────────────
// lib/types.ts
// Shared TypeScript types used across the entire project.
// ─────────────────────────────────────────────────────────────────────────────

// TODO 1 ✅ — CacheStatus union type
//
// A union type restricts a value to one of several specific string literals.
// TypeScript will error if you accidentally write "hit" or "HITS" — great for safety.
//
//   type Alias = "A" | "B" | "C"
//
export type CacheStatus = "HIT" | "MISS" | "REVALIDATED" | "UNKNOWN";

// TODO 2 ✅ — RequestEntry interface
//
// An interface (or `type`) describes the shape of an object — what fields it
// has and what type each field is.
//
// Key patterns used here:
//   number          → a numeric value (int or float)
//   string          → any text
//   Record<K, V>    → an object whose every key is type K and every value is V
//                     e.g. Record<string, string> == { [key: string]: string }
//   CacheStatus     → the union type we defined just above (reused here!)
//
export interface RequestEntry {
  id: string;                            // crypto.randomUUID()
  url: string;                           // e.g. "https://api.example.com/data"
  method: string;                        // e.g. "GET" | "POST"
  status: number;                        // e.g. 200, 304, 404, 500
  startTime: number;                     // performance.now() when the request began
  duration: number;                      // elapsed milliseconds until response
  cacheStatus: CacheStatus;             // reuses our union type from above
  requestHeaders: Record<string, string>;  // headers sent with the request
  responseHeaders: Record<string, string>; // headers received in the response
  size: number;                          // response body size in bytes
}
