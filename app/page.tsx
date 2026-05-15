'use client';

import { useState } from 'react';
import { WaterfallPanel } from '@/app/components/WaterfallPanel';

const concepts = [
  {
    icon: '🐒',
    title: 'Monkey-patching',
    body: 'We override window.fetch before your code runs. The original is still called — we just record what happened.',
  },
  {
    icon: '💾',
    title: 'LRU Cache',
    body: 'Request metadata is stored in an LRU cache (same as LC-146). HashMap for O(1) lookup + doubly-linked list for O(1) eviction.',
  },
  {
    icon: '🔄',
    title: 'ETag / 304',
    body: "Click 'Cached' twice to see 304 Not Modified. The server says \"nothing changed\" — no body is sent, saving bandwidth.",
  },
  {
    icon: '📡',
    title: 'Event Bus',
    body: 'The interceptor emits events; React listens. Neither side knows about the other — this is called loose coupling.',
  },
];

function DemoButton({
  label,
  description,
  onClick,
  color,
}: {
  label: string;
  description: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
    >
      <p className={`font-semibold text-sm ${color}`}>{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
  );
}

export default function Home() {
  const [log, setLog] = useState<string[]>([]);

  function addLog(entry: string) {
    setLog((prev) => [...prev, entry].slice(-5));
  }

  async function handleFast() {
    try {
      const t = performance.now();
      const res = await fetch('/api/demo/fast');
      addLog(`Fast → ${res.status} OK (${(performance.now() - t).toFixed(0)}ms)`);
    } catch {
      addLog('Fast → network error');
    }
  }

  async function handleSlow() {
    try {
      const t = performance.now();
      const res = await fetch('/api/demo/slow');
      addLog(`Slow → ${res.status} OK (${(performance.now() - t).toFixed(0)}ms)`);
    } catch {
      addLog('Slow → network error');
    }
  }

  async function handleCached() {
    try {
      const t1 = performance.now();
      const r1 = await fetch('/api/demo/cached');
      addLog(`Cached (1st) → ${r1.status} (${(performance.now() - t1).toFixed(0)}ms)`);

      const t2 = performance.now();
      const r2 = await fetch('/api/demo/cached');
      addLog(`Cached (2nd) → ${r2.status} (${(performance.now() - t2).toFixed(0)}ms)`);
    } catch {
      addLog('Cached → network error');
    }
  }

  async function handleError() {
    try {
      const t = performance.now();
      const res = await fetch('/api/demo/error');
      addLog(`Error → ${res.status} (${(performance.now() - t).toFixed(0)}ms)`);
    } catch {
      addLog('Error → network error');
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl text-gray-900">Network Request Visualiser</h1>
        <p className="text-gray-500 text-sm mt-1">
          A live DevTools-style inspector. Intercepts every fetch &amp; XHR call.
        </p>
      </div>

      {/* Concept cards */}
      <div className="grid grid-cols-2 gap-4">
        {concepts.map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <p className="font-semibold text-gray-800 text-sm mb-1">
              {c.icon} {c.title}
            </p>
            <p className="text-xs text-gray-500">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Demo buttons */}
      <div className="flex gap-3 flex-wrap">
        <DemoButton label="⚡ Fast"        color="text-emerald-600" description="~5ms response"     onClick={handleFast}    />
        <DemoButton label="🐌 Slow"        color="text-blue-600"   description="~1.5s delay"        onClick={handleSlow}    />
        <DemoButton label="💾 Cached+ETag" color="text-violet-600" description="Fires twice → 304"  onClick={handleCached}  />
        <DemoButton label="💥 Error 500"   color="text-red-500"    description="Server error"        onClick={handleError}   />
      </div>

      {/* Activity log */}
      {log.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Activity Log</p>
          {log.map((entry, i) => (
            <p key={i} className="font-mono text-xs text-gray-700">
              {entry}
            </p>
          ))}
        </div>
      )}

      {/* Network Inspector panel */}
      <WaterfallPanel />
    </main>
  );
}
