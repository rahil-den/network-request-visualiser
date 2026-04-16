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

// TODO 1: Define the shape of all events this bus can handle.
//         Create a type called `BusEvents`.
//         It should be an object type with ONE key:
//           'request' → a function that receives a RequestEntry and returns void
//
//         💡 This is a "typed event map" — it tells TypeScript what payload
//            each event name carries. No more guessing what data comes with an event.



// TODO 2: Create a class called `EventBus`.
//         It needs one private field:
//           `listeners` — a Map where:
//             - Key is a string (the event name, e.g. 'request')
//             - Value is an array of functions (the handlers)
//
//         💡 Map<string, Function[]> works but is loose. For a challenge,
//            try making it generic: Map<keyof BusEvents, BusEvents[keyof BusEvents][]>

// TODO 3: Add an `on` method to EventBus.
//         Signature: on(event: string, handler: Function): void
//         It should add the handler to the listeners map for that event.
//         If no array exists for that event yet, create one first.

// TODO 4: Add an `off` method to EventBus.
//         Signature: off(event: string, handler: Function): void
//         It should remove the handler from the listeners array for that event.
//         💡 Use Array.filter() to remove it.

// TODO 5: Add an `emit` method to EventBus.
//         Signature: emit(event: string, payload: RequestEntry): void
//         It should call each registered handler with the payload.
//         If there are no listeners for that event, do nothing.

// TODO 6: Export a singleton instance of EventBus called `bus`.
//         💡 A singleton means one shared instance used by the whole app.
//            This way the interceptor and React all talk to the SAME bus.
