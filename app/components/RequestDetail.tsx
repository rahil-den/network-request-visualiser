'use client';

import type { RequestEntry, CacheStatus } from '@/lib/types';

type RequestDetailProps = {
  entry: RequestEntry;
};

function HeaderTable({
  title,
  headers,
}: {
  title: string;
  headers: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </h3>
      {Object.keys(headers).length === 0 ? (
        <p className="text-xs font-mono text-gray-400">No headers captured.</p>
      ) : (
        <div className="space-y-1">
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="text-xs font-mono text-gray-500 shrink-0">{key}:</span>
              <span className="text-xs font-mono text-gray-800 break-all">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CacheExplainer({ status }: { status: CacheStatus }) {
  const explanationMap: Record<CacheStatus, string> = {
    HIT: 'Served from Service Worker cache. No network request was made.',
    MISS: 'No cached version found. Full network request was made.',
    REVALIDATED: 'Sent If-None-Match header. Server replied 304 — cached copy is still fresh.',
    UNKNOWN: 'Cache status could not be determined.',
  };
  const bgColorMap: Record<CacheStatus, string> = {
    HIT: 'bg-emerald-50 text-emerald-800',
    MISS: 'bg-red-50 text-red-800',
    REVALIDATED: 'bg-yellow-50 text-yellow-800',
    UNKNOWN: 'bg-gray-100 text-gray-600',
  };
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Cache
      </h3>
      <div className={`${bgColorMap[status]} rounded-lg p-3 text-xs font-medium`}>
        {explanationMap[status]}
      </div>
    </div>
  );
}

export function RequestDetail({ entry }: RequestDetailProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-100 px-4 py-4">
      {/* Row 1: General info + Cache explainer */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs content-start">
          <span className="text-gray-500 font-medium">URL</span>
          <span className="text-gray-800 font-mono break-all">{entry.url}</span>

          <span className="text-gray-500 font-medium">Method</span>
          <span className="text-gray-800 font-mono">{entry.method}</span>

          <span className="text-gray-500 font-medium">Status</span>
          <span className="text-gray-800 font-mono">{entry.status}</span>

          <span className="text-gray-500 font-medium">Duration</span>
          <span className="text-gray-800 font-mono">{entry.duration.toFixed(0)}ms</span>

          <span className="text-gray-500 font-medium">Size</span>
          <span className="text-gray-800 font-mono">
            {entry.size > 0 ? (entry.size / 1024).toFixed(1) + ' KB' : '—'}
          </span>
        </div>

        <CacheExplainer status={entry.cacheStatus} />
      </div>

      {/* Row 2: Request & Response headers */}
      <div className="grid grid-cols-2 gap-6">
        <HeaderTable title="Request Headers" headers={entry.requestHeaders} />
        <HeaderTable title="Response Headers" headers={entry.responseHeaders} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
//
// Renders the expandable detail drawer that appears below a selected RequestRow.
// It is a pure display component — no state, no hooks, just props in → JSX out.
//
// HeaderTable     — renders a titled section listing HTTP headers as key: value
//                   pairs. Shows a muted message when the headers object is empty
//                   (which happens for XHR request headers since the browser
//                   doesn't expose them to JS).
//
// CacheExplainer  — a coloured callout box that explains in plain English what
//                   the cache status means. Green for HIT, red for MISS,
//                   yellow for REVALIDATED, gray for UNKNOWN.
//
// RequestDetail   — the main export. Lays out two rows:
//                   Row 1: a 2-col grid — general info (URL/method/status/
//                          duration/size) on the left, CacheExplainer on the right.
//                   Row 2: request headers and response headers side by side.
// ─────────────────────────────────────────────────────────────────────────────
