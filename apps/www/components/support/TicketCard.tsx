"use client";
import React from "react";
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import type { Ticket } from "@/lib/types";

export default function TicketCard({ t }: { t: Ticket }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#0E1324]">{t.title}</h3>
          {t.category && <p className="mt-0.5 text-xs text-gray-500">{t.category}</p>}
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={t.priority} />
          <StatusBadge status={t.status} />
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{t.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Updated {new Date(t.updatedAt).toLocaleString()}</span>
        <Link href={`/dashboard/support/${t.id}`} className="rounded-lg border px-3 py-1.5 text-[#0E1324] hover:bg-gray-50">
          View
        </Link>
      </div>
    </div>
  );
}
