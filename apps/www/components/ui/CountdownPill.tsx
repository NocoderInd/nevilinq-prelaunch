// apps/www/components/ui/CountdownPill.tsx
"use client";

import { useEffect, useState } from "react";

export default function CountdownPill({ publishAt }: { publishAt: string }) {
  const [leftMs, setLeftMs] = useState(() => new Date(publishAt).getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setLeftMs(new Date(publishAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [publishAt]);

  if (leftMs <= 0) {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        Published
      </span>
    );
  }

  const mins = Math.floor(leftMs / 60000);
  const secs = Math.floor((leftMs % 60000) / 1000).toString().padStart(2, "0");

  return (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
      Scheduled · {mins}:{secs}
    </span>
  );
}
