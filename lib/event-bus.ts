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

// TODO 1 ✅ — Typed event map
//
// An object type that maps event names → the function signature for that event.
// This lets TypeScript know: "if you listen to 'request', you get a RequestEntry."
//
//   type EventMap = {
//     eventName: (payload: PayloadType) => void;
//   }
//
type BusEvents = {
  request: (entry: RequestEntry) => void;
};

// TODO 2 ✅ — EventBus class
//
// A Map is used to store listeners because:
//   - O(1) lookup by event name (faster than iterating an array of event strings)
//   - It's a built-in data structure: Map<Key, Value>
//
// The key is a string (event name), the value is an array of handler functions.
//
class EventBus {
  // Map<eventName, list of handlers for that event>
  private listeners: Map<string, Function[]> = new Map();

  // TODO 3 ✅ — on(): Subscribe to an event
  //
  // Pattern: if no array exists for this event yet, create one first.
  // Then push the handler into it.
  //
  on(event: string, handler: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  // TODO 4 ✅ — off(): Unsubscribe from an event
  //
  // Array.filter() returns a NEW array excluding the handler we want to remove.
  // This is the standard way to immutably remove an item from an array.
  //
  off(event: string, handler: Function): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    this.listeners.set(event, handlers.filter((h) => h !== handler));
  }

  // TODO 5 ✅ — emit(): Fire an event, calling all subscribed handlers
  //
  // If nobody is listening yet, we do nothing (no error).
  // forEach() calls each handler with the payload.
  //
  emit(event: string, payload: RequestEntry): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.forEach((handler) => handler(payload));
  }
}

// TODO 6 ✅ — Singleton export
//
// By exporting ONE instance (not the class), every file that imports `bus`
// gets the exact same object. This means the interceptor and React share
// the same listener list — they can actually communicate.
//
// If we exported the class and each file did `new EventBus()`, they'd each
// have their own isolated instance and nothing would work.
//
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
