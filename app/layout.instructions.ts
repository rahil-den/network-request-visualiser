// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx — MODIFY THIS FILE
// Root layout: wraps the whole app with VisualizerProvider.
// ─────────────────────────────────────────────────────────────────────────────

// CURRENT STATE: This file already exists with the default Next.js layout.
// YOUR JOBS:
//
// TODO 1: Import `VisualizerProvider` from '@/app/components/VisualizerProvider'
//
// TODO 2: Wrap the existing {children} with <VisualizerProvider>:
//           <VisualizerProvider>
//             {children}
//           </VisualizerProvider>
//
//         ⚠️  DO NOT mount <WaterfallPanel /> here anymore.
//             The panel is rendered inline on the page (page.tsx), not fixed at the bottom.
//             Only the provider needs to be here so the context is available app-wide.
//
// TODO 3: Update the metadata:
//           title: "Network Request Visualiser"
//           description: "A live DevTools-style network panel built with Next.js"
//
// TODO 4: The <body> className should give the page a light gray background:
//           className="min-h-full flex flex-col bg-gray-100"
//           (This matches the light card-on-gray-bg look from the design.)
