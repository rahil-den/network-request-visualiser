'use client';

import { useState } from 'react';
import { WaterfallPanel } from '@/app/components/WaterfallPanel';
import { Zap, Timer, Database, AlertTriangle, Code2, HardDrive, RefreshCw, Radio, Send, ShieldCheck } from 'lucide-react';

const concepts = [
  {
    icon: <Code2 size={14} className="text-gray-500" />,
    title: 'Monkey-patching',
    body: 'We override window.fetch before your code runs. The original is still called — we just record what happened.',
  },
  {
    icon: <HardDrive size={14} className="text-gray-500" />,
    title: 'LRU Cache',
    body: 'Request metadata is stored in an LRU cache (same as LC-146). HashMap for O(1) lookup + doubly-linked list for O(1) eviction.',
  },
  {
    icon: <RefreshCw size={14} className="text-gray-500" />,
    title: 'ETag / 304',
    body: "Click 'Cached' twice to see 304 Not Modified. The server says \"nothing changed\" — no body is sent, saving bandwidth.",
  },
  {
    icon: <Radio size={14} className="text-gray-500" />,
    title: 'Event Bus',
    body: 'The interceptor emits events; React listens. Neither side knows about the other — this is called loose coupling.',
  },
];

function DemoButton({
  label,
  description,
  onClick,
  color,
  icon,
}: {
  label: string;
  description: string;
  onClick: () => void;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
    >
      <p className={`font-semibold text-sm flex items-center gap-1.5 ${color}`}>
        {icon}
        {label}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
  );
}

export default function Home() {
  const [log, setLog] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState('');

  function addLog(entry: string) {
    setLog((prev) => [...prev, entry].slice(-5));
  }

  async function handleFast() {
    try {
      const t = performance.now();
      const res = await fetch('/api/demo/fast');
      addLog(`Fast → ${res.status} (${(performance.now() - t).toFixed(0)}ms)`);
    } catch {
      addLog('Fast → network error');
    }
  }

  async function handleSlow() {
    try {
      const t = performance.now();
      const res = await fetch('/api/demo/slow');
      addLog(`Slow → ${res.status} (${(performance.now() - t).toFixed(0)}ms)`);
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

  async function handleHit() {
    try {
      const t = performance.now();
      const res = await fetch('/api/demo/hit');
      addLog(`Cache HIT → ${res.status} (${(performance.now() - t).toFixed(0)}ms)`);
    } catch {
      addLog('Cache HIT → network error');
    }
  }

  async function handleCustomUrl() {
    const url = customUrl.trim();
    if (!url) return;
    try {
      const t = performance.now();
      const res = await fetch(url);
      addLog(`Custom → ${res.status} (${(performance.now() - t).toFixed(0)}ms) ${url}`);
    } catch {
      addLog(`Custom → failed (CORS or network error) ${url}`);
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
          <div key={c.title} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-1.5">
              {c.icon}
              {c.title}
            </p>
            <p className="text-xs text-gray-500">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Demo buttons */}
      <div className="flex gap-3 flex-wrap">
        <DemoButton label="Fast"        color="text-emerald-600" description="~5ms response"       icon={<Zap size={13} />}           onClick={handleFast}    />
        <DemoButton label="Slow"        color="text-blue-600"   description="800ms delay"           icon={<Timer size={13} />}         onClick={handleSlow}    />
        <DemoButton label="Cached+ETag" color="text-violet-600" description="Fires twice → 304"    icon={<Database size={13} />}      onClick={handleCached}  />
        <DemoButton label="Error 500"   color="text-red-500"    description="Server error"           icon={<AlertTriangle size={13} />} onClick={handleError}   />
        <DemoButton label="Cache HIT"   color="text-teal-600"   description="Simulated HIT response" icon={<ShieldCheck size={13} />}   onClick={handleHit}     />
      </div>

      {/* Custom URL input */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Custom Request</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomUrl()}
            placeholder="https://jsonplaceholder.typicode.com/todos/1"
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
          />
          <button
            onClick={handleCustomUrl}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Send size={13} />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Note: some URLs will fail due to CORS — try public APIs like jsonplaceholder.typicode.com
        </p>
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

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 pb-4">
        Made by <span className="font-semibold text-gray-600">Rahil</span>
      </footer>
    </main>
  );
}
