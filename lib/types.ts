// ─────────────────────────────────────────────────────────────────────────────
// lib/types.ts
// Shared TypeScript types used across the entire project.
// ─────────────────────────────────────────────────────────────────────────────

// TODO 1: Create a type alias called `CacheStatus`.
//         It should be a union of 4 string literals:
//         "HIT" | "MISS" | "REVALIDATED" | "UNKNOWN"
//
//         💡 A union type means a value can be one of several specific options.
//            This is better than using a plain `string` because TypeScript will
//            warn you if you typo it (e.g. "hit" or "HITS").



// TODO 2: Create a type called `RequestEntry`.
//         This is the shape of ONE captured network request.
//
//         Fields to include:
//           id              → string          (a unique ID, use crypto.randomUUID())
//           url             → string          (the full URL of the request)
//           method          → string          (HTTP method: "GET", "POST", etc.)
//           status          → number          (HTTP response status code: 200, 404, 500…)
//           startTime       → number          (performance.now() timestamp when request started)
//           duration        → number          (how long the request took, in milliseconds)
//           cacheStatus     → CacheStatus     (use the type you just defined above)
//           requestHeaders  → Record<string, string>   (headers sent with the request)
//           responseHeaders → Record<string, string>   (headers received in the response)
//           size            → number          (response body size in bytes)
//
//         💡 Record<string, string> is a TypeScript built-in that means
//            "an object whose keys and values are both strings".
//            It's equivalent to { [key: string]: string }.
