export async function POST(req: Request) {
  try {
    const data = await req.json(); // { type, slug, ts }
    // TODO: write to DB/queue/log
    return Response.json({ ok: true });
  } catch {
    return new Response("bad request", { status: 400 });
  }
}
