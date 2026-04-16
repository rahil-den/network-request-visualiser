// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — REPLACE THIS FILE
// The demo page: explains concepts and provides buttons to fire test requests.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

// TODO 1: Import `useState` from 'react'

// ─── Demo Button ──────────────────────────────────────────────────────────────

// TODO 2: Create a component called `DemoButton`.
//         Props: { label: string; description: string; onClick: () => void; color: string }
//         It renders a styled card with:
//           - The label as a title (e.g. "⚡ Fast Request")
//           - The description as small text below
//           - Clicking the whole card fires onClick
//         Give it a nice hover effect.

// ─── Main Page ───────────────────────────────────────────────────────────────

// TODO 3: Export the default `Home` component.
//         It should:
//
//         a. Have useState for a `log` array (string[]) to show a mini activity log
//            below the buttons when you fire requests.
//
//         b. Define 4 async handler functions (wrap each in try/catch):
//              handleFast    → fetch('/api/demo/fast')
//              handleSlow    → fetch('/api/demo/slow')
//              handleCached  → fetch('/api/demo/cached')
//                             💡 For ETag to work, fetch it TWICE in a row.
//                                The 2nd call should trigger 304 REVALIDATED.
//              handleError   → fetch('/api/demo/error')
//
//            Each handler should push a string to the log like:
//              "Fast → 200 OK (42ms)"
//
//         c. Render the page layout:
//
//            HEADER:
//              h1: "Network Request Visualiser"
//              Subtitle explaining what the app does
//
//            CONCEPT CARDS (4 cards in a grid, read-only info):
//              1. "🐒 Monkey-patching"  → "We override window.fetch before your code runs..."
//              2. "💾 LRU Cache"        → "Request metadata is stored in an LRU cache (LC-146)..."
//              3. "🔄 ETag / 304"       → "Click 'Cached' twice to see 304 Not Modified..."
//              4. "📡 Event Bus"        → "The interceptor emits events, React listens..."
//
//            DEMO BUTTONS (using your DemoButton component):
//              ⚡ Fast Request   → fires handleFast
//              🐌 Slow Request   → fires handleSlow
//              💾 Cached + ETag  → fires handleCached (fires twice automatically)
//              💥 Error (500)    → fires handleError
//
//            ACTIVITY LOG:
//              A small scrollable box showing the last ~5 log entries
//
//         💡 The WaterfallPanel at the bottom is already there (mounted in layout.tsx).
//            The page just needs to fire the requests — the panel captures them automatically.
