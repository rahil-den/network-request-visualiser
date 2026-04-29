'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { bus } from '@/lib/event-bus';
import { requestCache } from '@/lib/lru-cache';
import { initInterceptors } from '@/lib/interceptor';
import type { RequestEntry } from '@/lib/types';

type State = {
    entries: RequestEntry[];
    isPaused: boolean;
};

type Action =
    | { type: 'ADD'; payload: RequestEntry }
    | { type: 'CLEAR' }
    | { type: 'TOGGLE_PAUSE' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD':
            if (state.isPaused) return state;
            requestCache.put(action.payload.id, action.payload); // LRUCache uses .put(), not .set()
            return { ...state, entries: [...requestCache.values()] };
        case 'CLEAR':
            // LRUCache has no .clear() — we just stop showing entries in React state.
            // The cache will naturally evict old entries as new ones come in.
            return { ...state, entries: [] };
        case 'TOGGLE_PAUSE':
            return { ...state, isPaused: !state.isPaused };
        default:
            return state;
    }
}

type VisualizerContext = {
    state:State;
    dispatch:React.Dispatch<Action>;
}

const VisualizerContext = createContext<VisualizerContext | null>(null);

export function VisualizerProvider({children}: { children: ReactNode }) {
    const [state,dispatch] = useReducer(reducer,{entries:[],isPaused:false})
    useEffect(()=>{
        initInterceptors();
        const handler=(entry:RequestEntry)=>{
            dispatch({type:'ADD',payload:entry})
        }
        bus.on('request',handler)
        return ()=>bus.off('request',handler)
    },[])
    return (
        <VisualizerContext.Provider value={{ state, dispatch }}>
            {children}
        </VisualizerContext.Provider>
    )
}

export function useVisualizer() {
    const context = useContext(VisualizerContext);
    if (!context) {
        throw new Error('useVisualizer must be used within VisualizerProvider');
    }
    return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
//
// This file is the bridge between the network interceptor and the React UI.
// It has three jobs:
//
// 1. STATE MANAGEMENT (State + Action + reducer)
//    Defines what the app remembers: a list of captured requests and whether
//    capture is paused. The reducer decides how that state changes in response
//    to three actions — ADD a new request, CLEAR the list, TOGGLE_PAUSE.
//
// 2. WIRING (VisualizerProvider component)
//    On mount it calls initInterceptors() to start patching window.fetch/XHR.
//    It then subscribes to the event bus so every emitted RequestEntry is
//    dispatched into React state. On unmount the listener is cleaned up.
//    It wraps the app in a Context.Provider so any child component can read
//    the captured requests without prop-drilling.
//
// 3. ACCESS (useVisualizer hook)
//    Any component that needs the request list or the dispatch function just
//    calls useVisualizer(). If it's used outside the provider it throws a
//    clear error instead of silently returning null.
//
// DATA FLOW:
//   window.fetch (patched) → interceptor → bus.emit('request', entry)
//     → handler in useEffect → dispatch({ type: 'ADD', payload: entry })
//       → reducer → new state → React re-renders WaterfallPanel
// ─────────────────────────────────────────────────────────────────────────────