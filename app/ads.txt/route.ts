export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return new Response("", { headers: { "content-type": "text/plain; charset=utf-8" } });
  const publisher = client.replace(/^ca-/, "");
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
