const BUILD_TIME = new Date().toISOString();

export async function GET() {
  return new Response(`Build Time: ${BUILD_TIME}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
