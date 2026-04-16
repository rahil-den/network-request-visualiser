// ─────────────────────────────────────────────────────────────────────────────
// app/api/demo/fast/route.ts
// A Next.js API Route that responds instantly.
//
// 🧠 CONCEPT: Next.js Route Handlers
//   Files named `route.ts` inside `app/api/` become HTTP endpoints.
//   You export named functions (GET, POST, etc.) — Next.js maps them to HTTP methods.
//   No Express needed!
// ─────────────────────────────────────────────────────────────────────────────

// TODO 1: Export an async function called `GET`.
//         It should return a JSON response with this body:
//           { message: 'fast response', timestamp: new Date().toISOString() }
//
//         💡 Use `Response.json(data)` — this is the standard Web API way.
//            Next.js 16 uses Web standard Request/Response, not Node's req/res.
