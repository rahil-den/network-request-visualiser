'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/components/RequestRow.tsx
// Renders a single row in the Network Inspector panel.
//
// 🎨 DESIGN REFERENCE (from image):
//   - White row with a subtle bottom border dividing rows
//   - A 3-4px coloured LEFT BORDER indicating cache status:
//       HIT         → emerald/green  (border-emerald-400)
//       MISS        → red            (border-red-400)
//       REVALIDATED → yellow/amber   (border-yellow-400)
//       UNKNOWN     → gray           (border-gray-300)
//   - Row columns (left → right):
//       [path]   [status]   [duration]   [size]   [CacheBadge]   [WaterfallBar]
//   - Monospace font for path, status, duration, size
//   - Clicking a row highlights it (light blue/gray bg)
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestEntry, CacheStatus } from '@/lib/types';

// ─── Types ───────────────────────────────────────────────────────────────────

// TODO 1: Define a type `RequestRowProps`:
//           entry       → RequestEntry
//           maxDuration → number   (longest duration in the list — used to scale bars)
//           isSelected  → boolean  (true if this row is currently expanded)
//           onSelect    → () => void

// ─── Left Border ─────────────────────────────────────────────────────────────

// TODO 2: Create a helper function `borderColor` (not a component).
//         Signature: (status: CacheStatus) => string
//         Returns the Tailwind border-left class for each cache status:
//           'HIT'         → 'border-emerald-400'
//           'MISS'        → 'border-red-400'
//           'REVALIDATED' → 'border-yellow-400'
//           'UNKNOWN'     → 'border-gray-300'
//         💡 Use this on the row's className as a left border:
//            border-l-4 + the returned class.

// ─── Cache Badge ─────────────────────────────────────────────────────────────

// TODO 3: Create a component called `CacheBadge`.
//         Props: { status: CacheStatus }
//         Renders a small rounded pill showing an abbreviated label.
//         Labels and colours (match the image exactly):
//           HIT         → text "HIT"   bg-emerald-100 text-emerald-700
//           MISS        → text "MISS"  bg-red-100     text-red-600
//           REVALIDATED → text "REVAL" bg-yellow-100  text-yellow-700
//           UNKNOWN     → text "—"     bg-gray-100    text-gray-500
//         Style: text-xs font-semibold px-2 py-0.5 rounded

// ─── Waterfall Bar ───────────────────────────────────────────────────────────

// TODO 4: Create a component called `WaterfallBar`.
//         Props: { duration: number; maxDuration: number; status: CacheStatus }
//         Renders a horizontal bar whose WIDTH represents relative duration:
//           width = Math.max(2, (duration / maxDuration) * 100) + '%'
//           (Math.max(2, ...) keeps even instant requests visible)
//
//         Bar colour by cache status (match the image):
//           HIT         → bg-emerald-300   (teal/green bar)
//           MISS        → bg-blue-300      (blue bar)
//           REVALIDATED → bg-yellow-300    (small amber bar)
//           UNKNOWN     → bg-gray-300
//
//         Height: h-4, rounded-sm
//         The bar sits inside a full-width gray track (bg-gray-100 rounded-sm)
//         💡 Apply width as inline style: style={{ width: '...' }}

// ─── Main Component ──────────────────────────────────────────────────────────

// TODO 5: Export the `RequestRow` component (named export).
//
//         Outer wrapper: a <div> with:
//           - border-l-4 + borderColor(entry.cacheStatus)   ← coloured left border
//           - flex items-center gap-4 px-4 py-3
//           - border-b border-gray-100                      ← subtle row divider
//           - cursor-pointer
//           - If isSelected → bg-blue-50, else hover:bg-gray-50
//           - onClick → onSelect
//
//         COLUMNS inside (use font-mono text-sm text-gray-700 for data values):
//
//         1. URL path — flex-1 truncate
//              Display: new URL(entry.url, 'http://x').pathname
//              Style: font-mono text-sm text-gray-800 font-medium
//              (The 'http://x' base handles relative URLs without throwing)
//
//         2. Status code — w-10 text-center
//              Plain number, e.g. "200"
//              Colour: 2xx → text-emerald-600, 3xx → text-blue-500,
//                      4xx/5xx → text-red-500, 0 → text-gray-400
//
//         3. Duration — w-14 text-right
//              e.g. "42ms"
//
//         4. Size — w-14 text-right
//              If size > 0: show in KB with 1 decimal, e.g. "2.4KB"
//              If size === 0: show "—"
//
//         5. CacheBadge — w-16
//              <CacheBadge status={entry.cacheStatus} />
//
//         6. WaterfallBar — flex-1 min-w-[80px]
//              <WaterfallBar duration={entry.duration}
//                            maxDuration={maxDuration}
//                            status={entry.cacheStatus} />
