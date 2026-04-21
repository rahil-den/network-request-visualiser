'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/components/WaterfallPanel.tsx
// The "Network Inspector" card panel — matches the design in the reference image.
//
// 🎨 DESIGN REFERENCE:
//   - Light white/off-white background card with a subtle border and shadow
//   - NOT fixed to the bottom — it renders inline on the page
//   - Header row: bold "Network Inspector" title on the left,
//                 "Clear" | "Pause" | "Export" buttons on the right
//   - Stats row below header: coloured dot + count for each cache status
//       ● HIT 3  ● MISS 5  ● REVALIDATED 1
//   - Proportion bar: a full-width thin bar split into coloured segments
//       green = HIT share, red = MISS share, yellow = REVALIDATED share
//   - Scrollable list of <RequestRow> entries below the proportion bar
//   - If no entries yet, show a friendly empty-state message
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useVisualizer } from './VisualizerProvider';
import { RequestRow } from './RequestRow';
import { RequestDetail } from './RequestDetail';
import type { RequestEntry } from '@/lib/types';

// ─── Stat Dot ────────────────────────────────────────────────────────────────

// TODO 1: Create a small component called `StatDot`.
//         Props: { color: string; label: string; count: number }
//         Renders:  ● HIT 3
//         The dot (●) should use the `color` prop as a Tailwind text-color class
//         (e.g. "text-emerald-500", "text-red-400", "text-yellow-400").
//         Space the label and count with a small gap.
//         💡 Example output:  <span><span className="text-emerald-500">●</span> HIT 3</span>

// ─── Proportion Bar ──────────────────────────────────────────────────────────

// TODO 2: Create a component called `ProportionBar`.
//         Props: { entries: RequestEntry[] }
//         It renders a full-width bar (h-1.5 or h-2, rounded-full) divided into
//         three coloured segments representing the share of HIT / MISS / REVALIDATED.
//
//         Steps:
//           a. Count hits   = entries filtered where cacheStatus === 'HIT'
//              Count misses = entries filtered where cacheStatus === 'MISS'
//              Count revals = entries filtered where cacheStatus === 'REVALIDATED'
//              total        = entries.length (use 1 if 0 to avoid divide-by-zero)
//           b. Calculate percentages: (count / total) * 100 + '%'
//           c. Render a flex container with three child divs:
//                - green  (bg-emerald-400) with width = hit%
//                - red    (bg-red-400)     with width = miss%
//                - yellow (bg-yellow-400)  with width = reval%
//         💡 Use style={{ width: '...' }} for dynamic widths.
//         💡 The bar should be bg-gray-200 as the base (overflow hidden)
//            so any unaccounted remainder shows as gray.

// ─── Export Helper ───────────────────────────────────────────────────────────

// TODO 3: Create a helper function called `exportToJSON`.
//         Signature: (entries: RequestEntry[]) => void
//         It should:
//           a. Serialise entries to a JSON string (JSON.stringify with 2-space indent)
//           b. Create a Blob from it with type 'application/json'
//           c. Create an object URL: URL.createObjectURL(blob)
//           d. Programmatically click a temporary <a> element to trigger download
//              with filename "network-requests.json"
//           e. Revoke the object URL after: URL.revokeObjectURL(url)
//         💡 This is the standard browser download-without-a-server pattern.

// ─── Main Component ──────────────────────────────────────────────────────────

// TODO 4: Export the `WaterfallPanel` component (named export).
//
//         DATA:
//           a. Call `useVisualizer()` to get { state, dispatch }
//           b. useState<string | null>(null) for `selectedId`
//           c. Calculate maxDuration:
//                Math.max(1, ...state.entries.map(e => e.duration))
//
//         LAYOUT — render a white card:
//           className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full"
//           (This is an inline card, not a fixed panel.)
//
//         INSIDE THE CARD:
//
//         ① Header row (flex, items-center, justify-between, mb-4):
//             LEFT:  <h2> "Network Inspector" — font-bold text-gray-900
//             RIGHT: three buttons side by side with a small gap
//               - "Clear"  → dispatches { type: 'CLEAR' }
//                           style: border border-gray-300, rounded-lg, px-3 py-1, text-sm, text-gray-600
//                                  hover:bg-gray-50
//               - "Pause" / "Resume"  → dispatches { type: 'TOGGLE_PAUSE' }
//                           Same style as Clear. Show "Resume" when state.isPaused is true.
//               - "Export" → calls exportToJSON(state.entries)
//                           Same style as Clear.
//
//         ② Stats row (flex gap-4, mb-2):
//             <StatDot color="text-emerald-500" label="HIT"         count={...} />
//             <StatDot color="text-red-400"     label="MISS"        count={...} />
//             <StatDot color="text-yellow-400"  label="REVALIDATED" count={...} />
//           Count each by filtering state.entries on cacheStatus.
//
//         ③ Proportion bar (mb-4):
//             <ProportionBar entries={state.entries} />
//
//         ④ Request list:
//             If state.entries.length === 0:
//               Show a centered muted message:
//               "No requests captured yet. Fire one using the buttons above."
//               (text-sm text-gray-400 text-center py-8)
//
//             Otherwise, for each entry in state.entries:
//               - Render <RequestRow ... />
//               - If entry.id === selectedId, render <RequestDetail entry={entry} />
//                 directly below it (no wrapping — it slides in inline)
//
//         CLICK LOGIC for rows:
//           - If clicked row's id === selectedId → set selectedId to null (deselect)
//           - Otherwise → set selectedId to entry.id
