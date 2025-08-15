"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

import { BRAND } from "../../../../lib/types";
import type {
  Ticket,
  TicketComment,
  TicketPriority,
  TicketStatus,
} from "../../../../lib/types";
import { PriorityBadge, StatusBadge } from "../../../../components/support/StatusBadge";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/support/tickets/${id}`);
    const j = await res.json();
    setTicket(j?.data?.ticket ?? null);
    setComments(j?.data?.comments ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  async function addComment() {
    if (!message.trim()) return;
    setSaving(true);
    await fetch(`/api/support/tickets/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, author: "user" }),
    });
    setMessage("");
    setSaving(false);
    load();
  }

  async function onStatusChange(v: TicketStatus) {
    setSaving(true);
    await fetch(`/api/support/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: v }),
    });
    setSaving(false);
    load();
  }

  async function onPriorityChange(v: TicketPriority) {
    setSaving(true);
    await fetch(`/api/support/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: v }),
    });
    setSaving(false);
    load();
  }

  if (loading || !ticket) {
    return <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link
        href="/dashboard/support"
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={16} /> Back to tickets
      </Link>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-[#0E1324]">{ticket.title}</h1>
            {ticket.category && <p className="text-sm text-gray-500">{ticket.category}</p>}
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700">{ticket.description}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            value={ticket.status}
            onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="waiting_on_user">Waiting on you</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            value={ticket.priority}
            onChange={(e) => onPriorityChange(e.target.value as TicketPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <span className="ml-auto text-xs text-gray-500">
            Updated {new Date(ticket.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-[#0E1324]">Conversation</h3>
        <div className="space-y-4">
          {comments.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <div
                className="h-8 w-8 shrink-0 rounded-full text-center text-xs leading-8 text-white"
                style={{ background: c.author === "admin" ? BRAND.primary : BRAND.accent }}
              >
                {c.author === "admin" ? "A" : "U"}
              </div>
              <div className="rounded-xl border bg-gray-50 px-3 py-2">
                <div className="mb-1 text-xs text-gray-500">
                  {c.author === "admin" ? "NEVILINQ Support" : c.authorName || "You"} ·{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div className="whitespace-pre-wrap text-sm text-gray-800">{c.message}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            placeholder="Write a reply…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={addComment}
            disabled={saving || !message.trim()}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-white"
            style={{ background: saving ? "#9aa4b2" : BRAND.accent }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
