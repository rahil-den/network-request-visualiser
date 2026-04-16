'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/components/WaterfallPanel.tsx
// The floating DevTools-style panel that shows all captured requests.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useVisualizer } from './VisualizerProvider';
import { RequestRow } from './RequestRow';
import { RequestDetail } from './RequestDetail';

// ─── Main Component ──────────────────────────────────────────────────────────

// TODO 1: Export the `WaterfallPanel` component.
//         It should:
//           a. Call `useVisualizer()` to get { state, dispatch }
//
//           b. Use useState<string | null>(null) for `selectedId`
//              (the id of the currently expanded request, or null)
//
//           c. Calculate `maxDuration`:
//              Math.max(1, ...state.entries.map(e => e.duration))
//              (The Math.max(1, ...) avoids division by zero)
//
//           d. Render a panel fixed to the BOTTOM of the screen:
//              - Dark background (e.g. bg-zinc-900)
//              - Full width, ~300px tall
//              - A header bar with:
//                  - Title: "🌐 Network (X requests)" where X = state.entries.length
//                  - A "Pause/Resume" button that dispatches { type: 'TOGGLE_PAUSE' }
//                  - A "Clear" button that dispatches { type: 'CLEAR' }
//              - A scrollable list of <RequestRow> for each entry in state.entries
//              - Below a selected row, render <RequestDetail entry={selectedEntry} />
//
//         💡 Fixed positioning: className="fixed bottom-0 left-0 right-0 z-50"
//         💡 For the scrollable list: className="overflow-y-auto" with a max height
//
// TODO 2: Handle the "empty state" — if state.entries.length === 0, show:
//         A centered message: "No requests captured yet. Fire one using the buttons above."
//
// TODO 3: Handle the selected/expanded state:
//         When a RequestRow is clicked:
//           - If it's already selected → deselect (set selectedId to null)
//           - Otherwise → select it (set selectedId to entry.id)
//         Show <RequestDetail> only for the selected entry.
