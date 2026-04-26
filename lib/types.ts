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

// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS
// ─────────────────────────────────────────────────────────────────────────────
//
// In a project where many files need to share the same data shapes, you have
// two choices:
//   1. Re-define the types in every file that needs them   ← leads to drift & bugs
//   2. Define them ONCE here and import them everywhere    ← what we do
//
// This file is the single source of truth for:
//
//   CacheStatus  — tells every part of the app what the valid cache outcomes are.
//                  Without this, one file might use "hit", another "HIT", another
//                  "cache_hit" — TypeScript can't catch those mismatches.
//
//   RequestEntry — the exact shape of a captured network request.
//                  The interceptor CREATES these objects, the LRU cache STORES them,
//                  and the React UI READS them. All three files need to agree on the
//                  shape — this file is that agreement.
//
// This pattern is called a "shared type contract" and is standard in any
// TypeScript codebase larger than one file.
// ─────────────────────────────────────────────────────────────────────────────
