'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/components/VisualizerProvider.tsx
// React Context + useReducer that glues the interceptor to the UI.
//
// 🧠 CONCEPT: React Context + useReducer
//   This is the React alternative to Redux for sharing state across components.
//   - Context  = the "pipe" that carries state to any component that needs it
//   - Reducer  = a pure function that decides how state changes given an action
//   - Provider = the component that "wraps" your app and makes state available
//
// 🧠 CONCEPT: 'use client'
//   Next.js renders components on the server by default (SSR).
//   'use client' tells Next.js: "this component uses browser APIs (window, etc.)
//   and should only run in the browser."
//   The interceptor patches window.fetch — that's a browser-only thing.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { bus } from '@/lib/event-bus';
import { requestCache } from '@/lib/lru-cache';
import { initInterceptors } from '@/lib/interceptor';
import type { RequestEntry } from '@/lib/types';

// ─── State & Actions ─────────────────────────────────────────────────────────

// TODO 1: Define a type called `State`.
//         Fields:
//           entries  → RequestEntry[]    (list of captured requests)
//           isPaused → boolean           (when true, new requests are ignored)

// TODO 2: Define a type called `Action` — a discriminated union with 3 variants:
//           { type: 'ADD';   payload: RequestEntry }
//           { type: 'CLEAR' }
//           { type: 'TOGGLE_PAUSE' }
//
//         💡 Discriminated unions let TypeScript narrow the type in a switch statement.
//            Inside `case 'ADD':` TypeScript knows `action.payload` exists.

// ─── Reducer ─────────────────────────────────────────────────────────────────

// TODO 3: Write the reducer function.
//         Signature: (state: State, action: Action): State
//
//         Use a switch on action.type:
//           'ADD':
//             - If state.isPaused, return state unchanged
//             - Otherwise, put the entry in requestCache (key = entry.id)
//             - Return new state with entries = requestCache.values()
//           'CLEAR':
//             - Return state with entries = []
//             (you can also clear the cache: requestCache is a singleton)
//           'TOGGLE_PAUSE':
//             - Return state with isPaused flipped (!state.isPaused)
//
//         💡 Always return a NEW object — never mutate state directly.
//            React detects changes by reference equality.

// ─── Context ─────────────────────────────────────────────────────────────────

// TODO 4: Define a type `VisualizerContextValue` with:
//           state    → State
//           dispatch → React.Dispatch<Action>
//
// TODO 5: Create the context:
//           const VisualizerContext = createContext<VisualizerContextValue | null>(null);
//           (Start as null — we'll throw if used outside the provider)

// ─── Provider ────────────────────────────────────────────────────────────────

// TODO 6: Create and export the `VisualizerProvider` component.
//         Props: { children: ReactNode }
//
//         Inside:
//           a. Call useReducer(reducer, { entries: [], isPaused: false })
//              to get [state, dispatch]
//
//           b. useEffect(() => {
//                initInterceptors();              // start patching window.fetch
//                const handler = (entry: RequestEntry) => {
//                  dispatch({ type: 'ADD', payload: entry });
//                };
//                bus.on('request', handler);
//                return () => bus.off('request', handler);  // cleanup on unmount
//              }, []);
//              💡 The empty [] means "run once when the component mounts".
//                 The return function is the "cleanup" — it runs on unmount.
//
//           c. Return:
//              <VisualizerContext.Provider value={{ state, dispatch }}>
//                {children}
//              </VisualizerContext.Provider>

// ─── Hook ────────────────────────────────────────────────────────────────────

// TODO 7: Export a custom hook called `useVisualizer`.
//         It should:
//           - Call useContext(VisualizerContext)
//           - If the result is null, throw new Error('useVisualizer must be used within VisualizerProvider')
//           - Otherwise return the context value
//
//         💡 This pattern ensures you get a helpful error message instead of a
//            confusing "cannot read property of null" if you forget the provider.
