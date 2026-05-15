'use client';

import { useState } from 'react';
import { useVisualizer } from './VisualizerProvider';
import { RequestRow } from './RequestRow';
import { RequestDetail } from './RequestDetail';
import type { RequestEntry } from '@/lib/types';

const StatDot = ({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) => (
  <span className="flex items-center gap-1 text-xs text-gray-600 font-medium">
    <span className={color}>●</span>
    {label} {count}
  </span>
);

const ProportionBar = ({ entries }: { entries: RequestEntry[] }) => {
  const total = entries.length || 1;
  const hits   = entries.filter((e) => e.cacheStatus === 'HIT').length;
  const misses = entries.filter((e) => e.cacheStatus === 'MISS').length;
  const revals = entries.filter((e) => e.cacheStatus === 'REVALIDATED').length;

  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex mb-4">
      <div className="bg-emerald-400 h-full" style={{ width: `${(hits / total) * 100}%` }} />
      <div className="bg-red-400 h-full"     style={{ width: `${(misses / total) * 100}%` }} />
      <div className="bg-yellow-400 h-full"  style={{ width: `${(revals / total) * 100}%` }} />
    </div>
  );
};

function exportToJSON(entries: RequestEntry[]): void {
  const json = JSON.stringify(entries, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'network-requests.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function WaterfallPanel() {
  const { state, dispatch } = useVisualizer();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const maxDuration = Math.max(1, ...state.entries.map((e) => e.duration));

  const hits   = state.entries.filter((e) => e.cacheStatus === 'HIT').length;
  const misses = state.entries.filter((e) => e.cacheStatus === 'MISS').length;
  const revals = state.entries.filter((e) => e.cacheStatus === 'REVALIDATED').length;

  const btnClass =
    'border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 transition-colors';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
      {/* ① Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">Network Inspector</h2>
        <div className="flex gap-2">
          <button className={btnClass} onClick={() => dispatch({ type: 'CLEAR' })}>
            Clear
          </button>
          <button className={btnClass} onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}>
            {state.isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className={btnClass} onClick={() => exportToJSON(state.entries)}>
            Export
          </button>
        </div>
      </div>

      {/* ② Stats row */}
      <div className="flex gap-4 mb-2">
        <StatDot color="text-emerald-500" label="HIT"         count={hits}   />
        <StatDot color="text-red-400"     label="MISS"        count={misses} />
        <StatDot color="text-yellow-400"  label="REVALIDATED" count={revals} />
      </div>

      {/* ③ Proportion bar */}
      <ProportionBar entries={state.entries} />

      {/* ④ Request list */}
      {state.entries.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No requests captured yet. Fire one using the buttons above.
        </p>
      ) : (
        <div className="overflow-y-auto max-h-72">
          {state.entries.map((entry) => (
            <div key={entry.id}>
              <RequestRow
                entry={entry}
                maxDuration={maxDuration}
                isSelected={selectedId === entry.id}
                onSelect={() =>
                  setSelectedId(selectedId === entry.id ? null : entry.id)
                }
              />
              {selectedId === entry.id && <RequestDetail entry={entry} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
//
// The top-level UI component for the Network Inspector panel. Reads shared
// state from VisualizerProvider and renders the full panel inline on the page.
//
// StatDot         — a coloured ● dot + label + count (e.g. ● HIT 3).
//                   Used to summarise how many requests fell into each cache category.
//
// ProportionBar   — a full-width segmented bar showing the share of HIT / MISS /
//                   REVALIDATED visually. Useful for spotting cache health at a glance.
//
// exportToJSON    — downloads all captured request entries as a .json file using
//                   the standard Blob → object URL → programmatic <a> click pattern.
//
// WaterfallPanel  — the main export. Composes everything into the white card:
//                   header (title + Clear/Pause/Export buttons)
//                   → stats row → proportion bar → scrollable request list.
//                   Manages selectedId locally so clicking a row expands its
//                   RequestDetail drawer inline below it.
// ─────────────────────────────────────────────────────────────────────────────
