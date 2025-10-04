/**
 * Simple Ping Route
 * Tests basic API functionality without any imports
 */
export async function GET() {
  return new Response('pong', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache'
    }
  });
}
