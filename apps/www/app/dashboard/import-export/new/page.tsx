"use client";

import { useState } from "react";
import Link from "next/link";
import { scheduleTime } from "@/lib/publish";

type Status = "draft" | "scheduled" | "published";
type Draft = {
  title: string;
  role: "Buyer" | "Seller" | "Both";
  categories: string;
  country: string;
  contact: string;
  description?: string;
  incoterms?: string;
  certifications?: string;
  minQty?: string;
  maxQty?: string;
  hashtags?: string;
  status: Status;
  publishAt?: string;
};

const BRAND_BORDER = "#E6E9F1";

export default function NewImportExportPage() {
  const [d, setD] = useState<Draft>({
    title: "",
    role: "Seller",
    categories: "",
    country: "",
    contact: "",
    description: "",
    incoterms: "",
    certifications: "",
    minQty: "",
    maxQty: "",
    hashtags: "",
    status: "draft",
  });

  const validate = () => d.title && d.categories && d.country && d.contact;

  const saveDraft = async () => {
    if (!validate()) return alert("Please fill all required fields.");
    const payload = { ...d, status: "draft", publishAt: undefined };
    // TODO: POST /api/import-export
    console.log("create draft", payload);
    alert("Saved as Draft");
    window.location.href = "/dashboard/import-export";
  };

  const schedulePublish = async () => {
    if (!validate()) return alert("Please fill all required fields.");
    const payload = { ...d, status: "scheduled", publishAt: scheduleTime() };
    // TODO: POST /api/import-export
    console.log("create scheduled", payload);
    alert(`Scheduled to publish at ${new Date(payload.publishAt!).toLocaleString()}`);
    window.location.href = "/dashboard/import-export";
  };

  return (
    <main>
      <div className="sticky top-0 z-10 mb-4 flex items-center justify-between border-b bg-white/80 p-3 backdrop-blur" style={{ borderColor: BRAND_BORDER }}>
        <h1 className="text-base font-semibold">Add Import &amp; Export Listing</h1>
        <div className="flex gap-2">
          <button type="button" onClick={saveDraft} className="rounded-xl border px-3 py-2 text-sm font-medium" style={{ borderColor: BRAND_BORDER }}>
            Save Draft
          </button>
          <button type="button" onClick={schedulePublish} className="rounded-xl bg-[#030027] px-3 py-2 text-sm font-semibold text-white">
            Publish (after 15 min)
          </button>
          <Link href="/dashboard/import-export" className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: BRAND_BORDER }}>
            Cancel
          </Link>
        </div>
      </div>
      {/* form (unchanged)… keep your fields */}
      {/* Replace your bottom actions with the same three buttons calling saveDraft / schedulePublish */}
    </main>
  );
}
