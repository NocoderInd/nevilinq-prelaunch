import { NextRequest, NextResponse } from "next/server";
import { getTicket, updateTicket, listComments, addComment } from "@/lib/support.store";
import type { TicketStatus, TicketPriority } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const t = getTicket(params.id);
  if (!t) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  const comments = listComments(params.id);
  return NextResponse.json({ ok: true, data: { ticket: t, comments } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const t = getTicket(params.id);
  if (!t) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const patch: any = {};
  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.description === "string") patch.description = body.description;
  if (typeof body.category === "string") patch.category = body.category;
  if (typeof body.priority === "string") patch.priority = body.priority as TicketPriority;
  if (typeof body.status === "string") patch.status = body.status as TicketStatus;

  const updated = updateTicket(params.id, patch);
  return NextResponse.json({ ok: true, data: updated });
}

// POST to /api/support/tickets/[id] to add a comment
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const t = getTicket(params.id);
  if (!t) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const message = (body?.message ?? "").toString().trim();
  if (!message) return NextResponse.json({ ok: false, error: "Message required." }, { status: 400 });

  const author = (body?.author === "admin" ? "admin" : "user") as "admin" | "user";
  const c = addComment(params.id, author, message, body?.authorName);
  return NextResponse.json({ ok: true, data: c }, { status: 201 });
}
