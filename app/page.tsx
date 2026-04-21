// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — REPLACE THIS FILE
// The demo page: concept intro cards, demo buttons, activity log,
// and the Network Inspector panel rendered inline below everything.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

// TODO 1: Import `useState` from 'react'
// TODO 2: Import `WaterfallPanel` from '@/app/components/WaterfallPanel'
//         (The panel is rendered HERE on the page, not in layout.tsx)

// ─── Demo Button ──────────────────────────────────────────────────────────────

// TODO 3: Create a component called `DemoButton`.
//         Props: { label: string; description: string; onClick: () => void; color: string }
//
//         Renders a small card / button with:
//           - `label` as the main text (e.g. "⚡ Fast Request")
//           - `description` as a smaller subtitle below
//           - Clicking anywhere fires onClick
//
//         Style: white bg, rounded-xl, border border-gray-200, px-4 py-3,
//                hover:shadow-md hover:border-gray-300 cursor-pointer transition-all
//         Use `color` as the accent for the label text (e.g. "text-emerald-600").

// ─── Main Page ────────────────────────────────────────────────────────────────

// TODO 4: Export the default `Home` component.
//
//         a. useState for `log` (string[]) — activity log entries
//
//         b. Define 4 async handlers (each wrapped in try/catch):
//              handleFast    → fetch('/api/demo/fast')
//              handleSlow    → fetch('/api/demo/slow')
//              handleCached  → fetch('/api/demo/cached') TWICE in a row
//                              (2nd call triggers 304 → REVALIDATED)
//              handleError   → fetch('/api/demo/error')
//
//            Each handler appends a string to the log like:
//              "Fast → 200 OK (42ms)"
//            Keep only the last 5 log entries (use .slice(-5)).
//
//         c. Page layout wrapper:
//              className="min-h-screen bg-gray-100 p-8 max-w-5xl mx-auto space-y-8"
//
//         d. HEADER section:
//              <h1> "Network Request Visualiser"
//                   font-bold text-2xl text-gray-900
//              <p>  Subtitle: "A live DevTools-style inspector. Intercepts every fetch & XHR call."
//                   text-gray-500 text-sm mt-1
//
//         e. CONCEPT CARDS — a 2×2 grid (grid grid-cols-2 gap-4):
//              Each card: white bg, rounded-xl, border border-gray-200, p-4
//              4 cards:
//                1. "🐒 Monkey-patching"  → "We override window.fetch before your code runs..."
//                2. "💾 LRU Cache"        → "Request metadata stored in an LRU cache (LC-146)."
//                3. "🔄 ETag / 304"       → "Click 'Cached' twice to see 304 Not Modified."
//                4. "📡 Event Bus"        → "The interceptor emits events; React listens."
//              Card title: font-semibold text-gray-800 text-sm mb-1
//              Card body:  text-xs text-gray-500
//
//         f. DEMO BUTTONS row (flex gap-3 flex-wrap):
//              <DemoButton label="⚡ Fast"        color="text-emerald-600" description="~5ms response"      onClick={handleFast}    />
//              <DemoButton label="🐌 Slow"        color="text-blue-600"    description="~1.5s delay"        onClick={handleSlow}    />
//              <DemoButton label="💾 Cached+ETag" color="text-violet-600"  description="Fires twice → 304"  onClick={handleCached}  />
//              <DemoButton label="💥 Error 500"   color="text-red-500"     description="Server error"       onClick={handleError}   />
//
//         g. ACTIVITY LOG (shown only if log.length > 0):
//              A small box: bg-white border border-gray-200 rounded-xl p-4
//              Heading: "Activity Log" — text-xs font-semibold text-gray-500 uppercase mb-2
//              List of log lines (most recent last):
//                font-mono text-xs text-gray-700, each on its own line
//
//         h. NETWORK INSPECTOR PANEL:
//              <WaterfallPanel />
//              This is the main "Network Inspector" card from the reference image.
//              It lives here on the page (not fixed at the bottom).
