export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9550629898092318";
  const publisher = client.replace(/^ca-/, "");
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
