import type { NextRequest } from 'next/server';

const ETAG = '"demo-v1"';

export async function GET(request: NextRequest) {
  const ifNoneMatch = request.headers.get('if-none-match');

  // If the browser already has this version cached, send back 304 — no body needed
  if (ifNoneMatch === ETAG) {
    return new Response(null, {
      status: 304,
      headers: { ETag: ETAG },
    });
  }

  // First time asking — send the full response with ETag
  return Response.json(
    { message: 'cached response', etag: ETAG, timestamp: new Date().toISOString() },
    {
      headers: {
        ETag: ETAG,
        'Cache-Control': 'max-age=30, must-revalidate',
      },
    }
  );
}
