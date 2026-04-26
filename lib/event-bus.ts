// ─────────────────────────────────────────────────────────────────────────────
// lib/event-bus.ts
// A tiny typed pub/sub Event Bus.
//
// 🧠 CONCEPT: Observer Pattern
//   The interceptor doesn't know about React. React doesn't know about the
//   interceptor. The Event Bus sits between them — the interceptor *emits*
//   events, and React *listens* for them. This is called loose coupling.
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestEntry } from './types';

type BusEvents = {
  request: (entry: RequestEntry) => void;
};


class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, handler: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    this.listeners.set(event, handlers.filter((h) => h !== handler));
  }

  emit(event: string, payload: RequestEntry): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.forEach((handler) => handler(payload));
  }
}

export const bus = new EventBus();

// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS
// ─────────────────────────────────────────────────────────────────────────────
//
// The interceptor (lib/interceptor.ts) knows about network requests.
// The UI (VisualizerProvider.tsx) knows about React state.
// The problem: how do you connect them WITHOUT making them directly depend on each other?
//
// If the interceptor imported React, it would:
//   - Only work inside React components
//   - Break server-side rendering (SSR)
//   - Be impossible to test in isolation
//
// The Event Bus solves this with the OBSERVER PATTERN:
//   - The interceptor just calls  bus.emit('request', entry)     ← "something happened"
//   - The UI just calls           bus.on('request', handler)     ← "tell me when it does"
//   - Neither file imports the other. They only share the bus.
//
// This is called LOOSE COUPLING — two systems communicate through a shared
// channel (the bus) rather than directly. It's used everywhere:
//   - Node.js's EventEmitter
//   - Redux's action dispatch
//   - The DOM's addEventListener
//   - Even hardware interrupts in operating systems
//
// The singleton export is critical: every file that does `import { bus }`
// gets the EXACT SAME instance, so the interceptor's emits and the UI's
// listeners are registered on the same object.
// ─────────────────────────────────────────────────────────────────────────────
