// apps/www/components/import-export/StatusToggle.tsx
"use client";

import { scheduleTime } from "@/lib/publish";

type Status = "draft" | "scheduled" | "published";

export default function StatusToggle({ status, id }: { status: Status; id: string }) {
  let label = "Publish now";
  let next: Status = "published";

  if (status === "draft") {
    label = "Schedule (15 min)";
    next = "scheduled";
  } else if (status === "scheduled") {
    label = "Publish now";
    next = "published";
  } else if (status === "published") {
    label = "Unpublish";
    next = "draft";
  }

  const onClick = async () => {
    // TODO: PATCH /api/import-export/:id { status: next, publishAt?: ISO }
    const payload: Record<string, any> = { status: next };
    if (next === "scheduled") payload.publishAt = scheduleTime();
    console.log("toggle status", { id, ...payload });
    alert(`${label} — stub`);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-1.5 text-sm ${
        status === "draft" ? "bg-[#030027] text-white" : "border"
      }`}
      style={status === "draft" ? {} : { borderColor: "#E6E9F1" }}
    >
      {label}
    </button>
  );
}
