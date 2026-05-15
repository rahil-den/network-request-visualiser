'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/components/RequestDetail.tsx
// Expandable detail drawer rendered inline below a selected RequestRow.
// Shows full headers, cache explanation, and response metadata.
//
// 🎨 DESIGN:
//   - Light background (bg-gray-50 or bg-slate-50), no dark theme
//   - Sits directly below its parent row (no border-left from the row carried over)
//   - Divided into a 2-column grid: left = general info, right = cache explainer
//   - Below that: request headers and response headers side by side
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestEntry, CacheStatus } from '@/lib/types';

// ─── Types ───────────────────────────────────────────────────────────────────

// TODO 1: Define `RequestDetailProps`:
//           entry → RequestEntry
type RequestDetailProps = {
    entry: RequestEntry;
}
// ─── Header Table ────────────────────────────────────────────────────────────

// TODO 2: Create a component `HeaderTable`.
//         Props: { title: string; headers: Record<string, string> }
//
//         Renders:
//           - A small section heading (text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1)
//           - If headers object is empty: show "No headers captured." in muted text
//           - Otherwise, a list of key → value pairs:
//               key:   text-xs font-mono text-gray-500
//               value: text-xs font-mono text-gray-800 break-all
function HeaderTable({title, headers}: {title: string, headers: Record<string, string>}) {
    return (
        <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</h2>
            {Object.keys(headers).length === 0 ? (
                <p className="text-xs font-mono text-gray-400">No headers captured.</p>
            ) : (
                <div className="space-y-1">
                    {Object.entries(headers).map(([key, value]) => (
                        <div key={key} className="flex">
                            <span className="text-xs font-mono text-gray-500">{key}:</span>
                            <span className="text-xs font-mono text-gray-800 break-all ml-2">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Cache Explainer ─────────────────────────────────────────────────────────

// TODO 3: Create a component `CacheExplainer`.
//         Props: { status: CacheStatus }
//         Renders a small coloured callout box explaining what the status means:
//           HIT         → green bg   "Served from Service Worker cache. No network request was made."
//           MISS        → red bg     "No cached version found. Full network request was made."
//           REVALIDATED → yellow bg  "Sent If-None-Match header. Server replied 304 — cached copy is still fresh."
//           UNKNOWN     → gray bg    "Cache status could not be determined."
//
//         Style the box: rounded-lg p-3 text-xs font-medium
//           Use light bg variants: bg-emerald-50 text-emerald-800 /
//                                  bg-red-50 text-red-800 /
//                                  bg-yellow-50 text-yellow-800 /
//                                  bg-gray-100 text-gray-600
function CacheExplainer({status}: {status: CacheStatus}) {
        const explnationMap: Record<CacheStatus, string> = {
            HIT: 'Served from Service Worker cache. No network request was made.',
            MISS: 'No cached version found. Full network request was made.',
            REVALIDATED: 'Sent If-None-Match header. Server replied 304 — cached copy is still fresh.',
            UNKNOWN: 'Cache status could not be determined.'
        }
        const bgColorMap: Record<CacheStatus, string> = {
            HIT: 'bg-emerald-50 text-emerald-800',
            MISS: 'bg-red-50 text-red-800',
            REVALIDATED: 'bg-yellow-50 text-yellow-800',
            UNKNOWN: 'bg-gray-100 text-gray-600'
        }
        const message = explnationMap[status];
        const bgColor = bgColorMap[status];
        return (
            <div className={`${bgColor} rounded-lg p-3 text-xs font-medium`}>
                {message}
            </div>
        );
}
// ─── Main Component ──────────────────────────────────────────────────────────

// TODO 4: Export `RequestDetail` component (named export).
//
//         Outer wrapper: bg-gray-50 border-b border-gray-100 px-4 py-4
//
//         STRUCTURE:
//
//         Row 1 — two columns (grid grid-cols-2 gap-6 mb-4):
//           LEFT column — General Info:
//             Label + value pairs in a small grid (grid grid-cols-2 gap-x-4 gap-y-1 text-xs):
//               "URL"      → entry.url         (text-gray-800 font-mono break-all)
//               "Method"   → entry.method
//               "Status"   → entry.status
//               "Duration" → entry.duration + "ms"
//               "Size"     → entry.size > 0 ? (entry.size / 1024).toFixed(1) + " KB" : "—"
//             Labels: text-gray-500 font-medium
//             Values: text-gray-800 font-mono
//
//           RIGHT column — Cache:
//             Small heading "Cache"
//             <CacheExplainer status={entry.cacheStatus} />
//
//         Row 2 — two columns (grid grid-cols-2 gap-6):
//           <HeaderTable title="Request Headers"  headers={entry.requestHeaders}  />
//           <HeaderTable title="Response Headers" headers={entry.responseHeaders} />
function RequestDetail ({entry}: {entry: RequestEntry}) {
    return (
        <div className="bg-gray-50 border-b border-gray-100 px-4 py-4">
            <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-gray-500 font-medium">URL</span>
                    <span className="text-gray-800 font-mono break-all">{entry.url}</span>
                    <span className="text-gray-500 font-medium">Method</span>
                    <span className="text-gray-800 font-mono">{entry.method}</span>
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className="text-gray-800 font-mono">{entry.status}</span>
                    <span className="text-gray-500 font-medium">Duration</span>
                    <span className="text-gray-800 font-mono">{entry.duration}ms</span>
                    <span className="text-gray-500 font-medium">Size</span>
                    <span className="text-gray-800 font-mono">
                        {entry.size > 0 ? (entry.size / 1024).toFixed(1) + " KB" : "—"}
                    </span>
                </div>
                <CacheExplainer status={entry.cacheStatus} />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <HeaderTable title="Request Headers" headers={entry.requestHeaders} />
                <HeaderTable title="Response Headers" headers={entry.responseHeaders} />
            </div>
        </div>
    );
}

export default RequestDetail;
