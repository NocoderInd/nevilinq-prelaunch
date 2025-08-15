"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { scheduleTime } from "@/lib/publish";

type Status = "draft" | "scheduled" | "published";
type Draft = {
  title: string;
  role: "Buyer" | "Seller" | "Both";
  categories: string;
  country: string;
  contact: string;
  description?: string;
  verified?: boolean;
  status: Status;
  publishAt?: string;
};

const BRAND_BORDER = "#E6E9F1";

// stub loader
async function loadListing(id: string): Promise<Draft | null> {
  if (id === "iex_1") {
    return {
      title: "Teak Wood Boards — Bulk",
      role: "Seller",
      categories: "Wood, Boards",
      country: "IN",
      contact: "https://wa.me/919000000123",
      description: "Export-grade teak boards. Consistent grain, kiln-dried. Loading from Chennai.",
      verified: true,
      status: "draft",
    };
  }
  return null;
}

export default function EditImportExportPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [d, setD] = useState<Draft | null>(null);

  useEffect(() => { loadListing(params.id).then(setD); }, [params.id]);
  if (!d) return <main>Loading…</main>;

  const saveDraft = async () => {
    const payload = { ...d, status: "draft", publishAt: undefined };
    // TODO: PATCH /api/import-export/:id
    console.log("save draft", payload);
    alert("Saved as Draft");
    router.push(`/dashboard/import-export/${params.id}`);
  };

  const schedulePublish = async () => {
    const payload = { ...d, status: "scheduled", publishAt: scheduleTime() };
    // TODO: PATCH /api/import-export/:id
    console.log("schedule publish", payload);
    alert(`Scheduled to publish at ${new Date(payload.publishAt!).toLocaleString()}`);
    router.push(`/dashboard/import-export/${params.id}`);
  };

  const publishNow = async () => {
    const payload = { ...d, status: "published", publishAt: new Date().toISOString() };
    // TODO: PATCH /api/import-export/:id
    console.log("publish now", payload);
    alert("Published now");
    router.push(`/dashboard/import-export/${params.id}`);
  };

  return (
    <main>
      <div className="sticky top-0 z-10 mb-4 flex items-center justify-between border-b bg-white/80 p-3 backdrop-blur" style={{ borderColor: BRAND_BORDER }}>
        <h1 className="text-base font-semibold">Edit Import &amp; Export</h1>
        <div className="flex gap-2">
          <button type="button" onClick={saveDraft} className="rounded-xl border px-3 py-2 text-sm font-medium" style={{ borderColor: BRAND_BORDER }}>
            Save Draft
          </button>
          <button type="button" onClick={schedulePublish} className="rounded-xl bg-[#030027] px-3 py-2 text-sm font-semibold text-white">
            Publish (after 15 min)
          </button>
          <button type="button" onClick={publishNow} className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: BRAND_BORDER }}>
            Publish now
          </button>
          <Link href={`/dashboard/import-export/${params.id}`} className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: BRAND_BORDER }}>
            Cancel
          </Link>
        </div>
      </div>
      {/* form … keep your inputs; bottom actions can mirror the same buttons */}
    </main>
  );
}
