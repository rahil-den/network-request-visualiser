export async function GET() {
  return Response.json(
    { error: 'Internal Server Error', message: 'This error is intentional for demo purposes' },
    { status: 500 }
  );
}
