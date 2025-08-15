import { NextRequest, NextResponse } from "next/server";
import { listTickets, createTicket } from "@/lib/support.store";
import type { TicketPriority, TicketStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as TicketStatus | null;
  const search = searchParams.get("q") || undefined;
  const data = listTickets({ status: status ?? undefined, search });
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const title = (body?.title ?? "").toString().trim();
  const description = (body?.description ?? "").toString();
  if (!title) {
    return NextResponse.json({ ok: false, error: "Title is required." }, { status: 400 });
  }
  const priority = (body?.priority ?? "medium") as TicketPriority;
  const ticket = createTicket({
    title, description, priority,
    category: body?.category,
    requesterId: body?.requesterId,
    requesterName: body?.requesterName,
    requesterEmail: body?.requesterEmail,
  });
  return NextResponse.json({ ok: true, data: ticket }, { status: 201 });
}
