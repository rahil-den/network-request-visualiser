// ─────────────────────────────────────────────────────────────────────────────
// app/api/demo/cached/route.ts
// A Next.js API Route demonstrating HTTP caching with ETags.
//
// 🧠 CONCEPT: ETag + 304 Not Modified
//   1st request:  Client asks for /api/demo/cached
//                 Server responds: 200 OK, body: {...}, ETag: "abc123"
//
//   2nd request:  Client sends: GET /api/demo/cached, If-None-Match: "abc123"
//                 Server checks: does "abc123" match the current ETag?
//                 If YES → 304 Not Modified (no body sent — saves bandwidth!)
//                 If NO  → 200 OK with new body and new ETag
//
//   This is how browsers avoid re-downloading unchanged resources.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from 'next/server';

// TODO 1: Define a constant ETAG = '"demo-v1"'
//         (ETag values are always wrapped in double quotes per the HTTP spec)

// TODO 2: Export an async GET handler that receives a `request: NextRequest`.
//
//         Step A: Read the 'if-none-match' header from the incoming request.
//                 💡 request.headers.get('if-none-match')
//
//         Step B: If it matches ETAG, return a 304 response.
//                 💡 new Response(null, {
//                      status: 304,
//                      headers: { 'ETag': ETAG }
//                    })
//                 Note: 304 must have NO body (that's the point — no data transferred!)
//
//         Step C: Otherwise, return 200 with JSON body AND these headers:
//                   'ETag'          → ETAG
//                   'Cache-Control' → 'max-age=30, must-revalidate'
//                 💡 Response.json(data, { headers: { ... } })
//
//         Body should be: { message: 'cached response', etag: ETAG, timestamp: ... }
