export async function GET() {
  return new Response(`Build Time: ${new Date().toISOString()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
