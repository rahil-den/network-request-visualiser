export async function GET() {
  return Response.json(
    { message: 'fast response', timestamp: new Date().toISOString() },
    { headers: { 'x-demo': 'fast' } }
  );
}
