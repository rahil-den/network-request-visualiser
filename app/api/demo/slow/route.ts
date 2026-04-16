// ─────────────────────────────────────────────────────────────────────────────
// app/api/demo/slow/route.ts
// A Next.js API Route that deliberately waits 800ms before responding.
// This lets you see a visually longer bar in the waterfall panel.
// ─────────────────────────────────────────────────────────────────────────────

// TODO 1: Create a helper called `sleep`.
//         Signature: (ms: number) => Promise<void>
//         💡 Use: new Promise(resolve => setTimeout(resolve, ms))

// TODO 2: Export an async GET handler.
//         - Call await sleep(800) to simulate a slow database query
//         - Then return: { message: 'slow response (800ms delay)', timestamp: ... }
