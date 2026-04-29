'use client';

import type { RequestEntry, CacheStatus } from '@/lib/types';

type RequestRowProps = {
  entry: RequestEntry;
  maxDuration: number;
  isSelected: boolean;
  onSelect: () => void;
};

function borderColor(status: CacheStatus): string {
  switch (status) {
    case 'HIT':         return 'border-emerald-400';
    case 'MISS':        return 'border-red-400';
    case 'REVALIDATED': return 'border-yellow-400';
    default:            return 'border-gray-300';
  }
}

function statusColor(status: number): string {
  if (status === 0)           return 'text-gray-400';
  if (status >= 200 && status < 300) return 'text-emerald-600';
  if (status >= 300 && status < 400) return 'text-blue-500';
  return 'text-red-500';
}

const CacheBadge = ({ status }: { status: CacheStatus }) => {
  const map: Record<CacheStatus, { label: string; className: string }> = {
    HIT:         { label: 'HIT',  className: 'bg-emerald-100 text-emerald-700' },
    MISS:        { label: 'MISS', className: 'bg-red-100 text-red-600' },
    REVALIDATED: { label: 'REVAL', className: 'bg-yellow-100 text-yellow-700' },
    UNKNOWN:     { label: '—',    className: 'bg-gray-100 text-gray-500' },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${className}`}>
      {label}
    </span>
  );
};

const WaterfallBar = ({
  duration,
  maxDuration,
  status,
}: {
  duration: number;
  maxDuration: number;
  status: CacheStatus;
}) => {
  const barColor: Record<CacheStatus, string> = {
    HIT:         'bg-emerald-300',
    MISS:        'bg-blue-300',
    REVALIDATED: 'bg-yellow-300',
    UNKNOWN:     'bg-gray-300',
  };
  const width = Math.max(2, (duration / maxDuration) * 100) + '%';
  return (
    <div className="flex-1 min-w-[80px] bg-gray-100 rounded-sm h-4">
      <div
        className={`h-4 rounded-sm ${barColor[status]}`}
        style={{ width }}
      />
    </div>
  );
};

export const RequestRow = ({
  entry,
  maxDuration,
  isSelected,
  onSelect,
}: RequestRowProps) => {
  const pathname = (() => {
    try {
      return new URL(entry.url, 'http://x').pathname;
    } catch {
      return entry.url;
    }
  })();

  const sizeLabel =
    entry.size > 0 ? (entry.size / 1024).toFixed(1) + 'KB' : '—';

  return (
    <div
      onClick={onSelect}
      className={`border-l-4 ${borderColor(entry.cacheStatus)} flex items-center gap-4 px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      {/* 1. URL path */}
      <div className="flex-1 truncate font-mono text-sm text-gray-800 font-medium">
        {pathname}
      </div>

      {/* 2. Status code */}
      <div className={`w-10 text-center font-mono text-sm ${statusColor(entry.status)}`}>
        {entry.status === 0 ? 'ERR' : entry.status}
      </div>

      {/* 3. Duration */}
      <div className="w-14 text-right font-mono text-sm text-gray-600">
        {entry.duration.toFixed(0)}ms
      </div>

      {/* 4. Size */}
      <div className="w-14 text-right font-mono text-sm text-gray-600">
        {sizeLabel}
      </div>

      {/* 5. Cache badge */}
      <div className="w-16">
        <CacheBadge status={entry.cacheStatus} />
      </div>

      {/* 6. Waterfall bar */}
      <WaterfallBar
        duration={entry.duration}
        maxDuration={maxDuration}
        status={entry.cacheStatus}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
//
// Renders a single row inside the Network Inspector panel for one captured request.
//
// borderColor    — maps CacheStatus → a Tailwind border-left colour class.
//                  The coloured left stripe is the fastest visual signal of
//                  whether a request was a cache HIT, MISS, or REVALIDATED.
//
// statusColor    — maps HTTP status number → text colour (green=2xx, blue=3xx, red=4xx/5xx).
//
// CacheBadge     — small pill label (HIT / MISS / REVAL / —) with matching background.
//
// WaterfallBar   — a horizontal bar inside a gray track whose width is proportional
//                  to (duration / maxDuration). maxDuration is passed in from the
//                  parent so all rows share the same scale.
//                  Colour matches the cache status so the waterfall is scannable
//                  without reading the badge.
//
// RequestRow     — the main exported component. Composes all the above into one
//                  clickable row showing: path | status | duration | size | badge | bar.
//                  isSelected controls the blue highlight; onSelect is called on click
//                  so the parent (WaterfallPanel) can toggle the detail drawer.
// ─────────────────────────────────────────────────────────────────────────────