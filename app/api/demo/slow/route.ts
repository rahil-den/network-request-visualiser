const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await sleep(800);
  return Response.json(
    { message: 'slow response (800ms delay)', timestamp: new Date().toISOString() },
    { headers: { 'x-demo': 'slow' } }
  );
}
