'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/components/RequestRow.tsx
// Renders a single row in the waterfall panel.
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestEntry } from '@/lib/types';

// ─── Types ───────────────────────────────────────────────────────────────────

// TODO 1: Define a type `RequestRowProps`:
//           entry      → RequestEntry
//           maxDuration → number        (the longest request duration in the list — used to scale bars)
//           isSelected → boolean        (true if this row is currently expanded)
//           onSelect   → () => void     (called when the row is clicked)

// ─── Helper Components ───────────────────────────────────────────────────────

// TODO 2: Create a small component called `StatusBadge`.
//         Props: { status: number }
//         It renders a coloured pill showing the HTTP status code.
//         Colour logic:
//           - 2xx (status >= 200 && status < 300) → green
//           - 3xx (304 etc.)                      → blue
//           - 4xx                                 → yellow/orange
//           - 5xx                                 → red
//           - 0 (network error)                   → gray
//         💡 Use a simple if/else or a lookup object for the Tailwind class.

// TODO 3: Create a small component called `CacheBadge`.
//         Props: { status: CacheStatus } (import CacheStatus from @/lib/types)
//         Renders a coloured pill:
//           HIT         → emerald/teal
//           MISS        → gray
//           REVALIDATED → violet/purple
//           UNKNOWN     → gray/muted

// ─── Waterfall Bar ───────────────────────────────────────────────────────────

// TODO 4: Create a component called `WaterfallBar`.
//         Props: { duration: number; maxDuration: number }
//         Renders a horizontal bar whose WIDTH represents relative duration.
//         Width formula: Math.max(2, (duration / maxDuration) * 100) + '%'
//         (The Math.max(2, ...) ensures the bar is at least 2% wide — visible even for fast requests)
//         💡 Apply the width as an inline style: style={{ width: '...' }}

// ─── Main Component ──────────────────────────────────────────────────────────

// TODO 5: Export the `RequestRow` component (named export).
//         It renders a table row (or a div styled as a row) showing:
//           - Method badge (GET, POST etc.) — small monospace text
//           - URL (truncated with overflow-hidden if too long)
//           - StatusBadge
//           - CacheBadge
//           - Duration in ms (e.g. "823ms")
//           - Size in KB (e.g. "1.2 KB")
//           - WaterfallBar
//         
//         It should be clickable (onClick → onSelect).
//         If isSelected, apply a highlighted background.
//
//         💡 For the URL, you can use new URL(entry.url).pathname to show just the path
//            instead of the full URL.
