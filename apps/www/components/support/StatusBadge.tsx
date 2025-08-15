import React from "react";
import type { TicketPriority, TicketStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, string> = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
    waiting_on_user: "bg-amber-50 text-amber-700 border-amber-200",
    resolved: "bg-teal-50 text-teal-700 border-teal-200",
    closed: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${map[status]}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const map: Record<TicketPriority, string> = {
    low: "bg-gray-50 text-gray-700 border-gray-200",
    medium: "bg-sky-50 text-sky-700 border-sky-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    urgent: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[priority]}`}>
      {priority}
    </span>
  );
}
