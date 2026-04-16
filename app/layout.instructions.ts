// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx — MODIFY THIS FILE
// Root layout: wraps the whole app with VisualizerProvider and mounts the panel.
// ─────────────────────────────────────────────────────────────────────────────

// CURRENT STATE: This file already exists with the default Next.js layout.
// YOUR JOBS:
//
// TODO 1: Import `VisualizerProvider` from '@/app/components/VisualizerProvider'
//         Import `WaterfallPanel`    from '@/app/components/WaterfallPanel'
//
// TODO 2: Wrap the existing {children} in <VisualizerProvider>:
//           <VisualizerProvider>
//             {children}
//             <WaterfallPanel />
//           </VisualizerProvider>
//
//         💡 <WaterfallPanel /> goes INSIDE the provider (so it can access context)
//            but OUTSIDE {children} (so it sits on top of every page).
//
// TODO 3: Update the metadata:
//           title: "Network Request Visualiser"
//           description: "A live DevTools-style network panel built with Next.js"
