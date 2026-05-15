// Simulates a Service Worker cache HIT by adding the x-cache: HIT header.
// In a real app, this header would be added by a Service Worker — not the server.
// We fake it here so you can see what a HIT looks like in the panel.
export async function GET() {
  return Response.json(
    { message: 'served from cache (simulated HIT)', timestamp: new Date().toISOString() },
    {
      headers: {
        'x-cache': 'HIT',
        'content-type': 'application/json',
      },
    }
  );
}
