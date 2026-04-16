'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/components/RequestDetail.tsx
// Expandable detail drawer shown when a request row is clicked.
// Shows full headers, cache info, and response metadata.
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestEntry } from '@/lib/types';

// ─── Types ───────────────────────────────────────────────────────────────────

// TODO 1: Define `RequestDetailProps`:
//           entry → RequestEntry

// ─── Helper ──────────────────────────────────────────────────────────────────

// TODO 2: Create a small component `HeaderTable`.
//         Props: { title: string; headers: Record<string, string> }
//         Renders a section with a title and a list of key → value pairs.
//         If the headers object is empty, show "No headers captured."
//         💡 Object.entries(headers).map(([key, value]) => ...)

// ─── Cache Explanation ───────────────────────────────────────────────────────

// TODO 3: Create a component `CacheExplainer`.
//         Props: { status: CacheStatus }
//         Returns a short paragraph explaining what the cache status means:
//           HIT         → "Served from Service Worker cache. No network request was made."
//           MISS        → "No cached version found. Full network request was made."
//           REVALIDATED → "Sent If-None-Match header. Server replied 304 — cached copy is still fresh."
//           UNKNOWN     → "Cache status could not be determined."

// ─── Main Component ──────────────────────────────────────────────────────────

// TODO 4: Export `RequestDetail` component.
//         It should show:
//           Section 1 — General Info (styled as a mini info grid):
//             Full URL, Method, Status, Duration (Xms), Size (X KB), Cache Status
//
//           Section 2 — Cache Explanation:
//             <CacheExplainer status={entry.cacheStatus} />
//
//           Section 3 — Request Headers:
//             <HeaderTable title="Request Headers" headers={entry.requestHeaders} />
//
//           Section 4 — Response Headers:
//             <HeaderTable title="Response Headers" headers={entry.responseHeaders} />
//
//         💡 Wrap everything in a div with a dark background and some padding.
//            This will sit below the selected RequestRow in the panel.
