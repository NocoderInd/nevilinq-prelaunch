import Link from "next/link";
import { notFound } from "next/navigation";
import CountdownPill from "@/components/ui/CountdownPill";

type Status = "draft" | "scheduled" | "published";
type Row = {
  id: string;
  title: string;
  role: "Buyer" | "Seller" | "Both";
  categories: string[];
  country: string;
  contact: string;
  description?: string;
  verified?: boolean;
  status: Status;
  publishAt?: string;
};

const BRAND_BORDER = "#E6E9F1";

// stub
const DB: Record<string, Row> = {
  iex_1: {
    id: "iex_1",
    title: "Teak Wood Boards — Bulk",
    role: "Seller",
    categories: ["Wood", "Boards"],
    country: "IN",
    contact: "https://wa.me/919000000123",
    description: "Export-grade teak boards. Consistent grain, kiln-dried. Loading from Chennai.",
    verified: true,
    status: "scheduled",
    publishAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
  },
};

function safeUrl(u: string) { try { return new URL(u).toString(); } catch { return u; } }

export default function ImportExportDetail({ params }: { params: { id: string } }) {
  const row = DB[params.id];
  if (!row) return notFound();
  const contactHref = safeUrl(row.contact);
  const isScheduled = row.status === "scheduled" && row.publishAt && Date.now() < new Date(row.publishAt).getTime();

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Import &amp; Export</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/import-export/${row.id}/edit`} className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: BRAND_BORDER }}>
            Edit
          </Link>
          <Link href="/dashboard/import-export" className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: BRAND_BORDER }}>
            Back
          </Link>
        </div>
      </div>

      {isScheduled && (
        <div className="mb-3 rounded-2xl border bg-[#FFFBEB] p-3 text-sm" style={{ borderColor: BRAND_BORDER }}>
          <div className="flex items-center justify-between">
            <div>Scheduled to publish.</div>
            <CountdownPill publishAt={row.publishAt!} />
          </div>
        </div>
      )}

      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: BRAND_BORDER }}>
        <div className="flex items-center justify-between text-xs text-[#667085]">
          <span>{row.country} • {row.role}</span>
          {!isScheduled && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Published</span>}
          {isScheduled && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">Scheduled</span>}
        </div>
        <h2 className="mt-1 text-xl font-semibold text-[#0E1324]">{row.title}</h2>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {row.verified && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Verified</span>}
          {row.categories.map((c) => (
            <span key={c} className="rounded-md border px-2 py-0.5 text-xs" style={{ borderColor: BRAND_BORDER, background: "#F7F8FA" }}>
              #{c}
            </span>
          ))}
        </div>

        {row.description && <p className="mt-3 text-sm text-[#0E1324]">{row.description}</p>}

        <div className="mt-6">
          <a href={contactHref} target="_blank" rel="noopener noreferrer nofollow ugc"
             className="block w-full rounded-xl bg-[#030027] px-4 py-2 text-center text-sm font-semibold text-white">
            {contactHref.includes("t.me") ? "Contact on Telegram" : "Contact on WhatsApp"}
          </a>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border bg-white p-4 text-sm" style={{ borderColor: BRAND_BORDER }}>
        <div className="font-semibold">Important safety note</div>
        <p className="mt-1 text-[#667085]">
          NEVILINQ is a marketplace. Always use escrow or stage-wise payments and validate documents.
          Report suspicious activity via Support. We are a platform where we share only the contact number —
          we never act as a middleman and never handle transactions between seller and buyer.
        </p>
      </div>
    </main>
  );
}
