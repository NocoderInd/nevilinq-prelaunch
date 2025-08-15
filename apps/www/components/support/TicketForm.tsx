"use client";
import React, { useState } from "react";
import { BRAND } from "@/lib/types";

type Props = {
  onCreated?: (id: string) => void;
  compact?: boolean;
};

export default function TicketForm({ onCreated, compact }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Support");
  const [priority, setPriority] = useState<"low"|"medium"|"high"|"urgent">("medium");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!title.trim()) { setErr("Title is required"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, priority }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Failed");
      onCreated?.(j.data.id as string);
      setTitle(""); setDescription("");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className={compact ? "" : "rounded-2xl border bg-white p-4"}>
      <div className="grid gap-3">
        <input
          className="w-full rounded-xl border px-3 py-2 outline-none"
          placeholder="Title (e.g., Unable to verify my group)"
          value={title} onChange={e=>setTitle(e.target.value)}
        />
        <textarea
          className="min-h-[100px] w-full rounded-xl border px-3 py-2 outline-none"
          placeholder="Describe the issue. Include steps to reproduce and any links."
          value={description} onChange={e=>setDescription(e.target.value)}
        />
        <div className="flex flex-wrap gap-3">
          <select className="rounded-xl border px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}>
            <option>Support</option>
            <option>Billing</option>
            <option>Verification</option>
            <option>Bug</option>
            <option>Feature</option>
            <option>Other</option>
          </select>
          <select className="rounded-xl border px-3 py-2" value={priority} onChange={e=>setPriority(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {err && <p className="text-sm text-rose-600">{err}</p>}

        <button
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-white"
          style={{ background: loading ? "#9aa4b2" : BRAND.accent }}
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </form>
  );
}
