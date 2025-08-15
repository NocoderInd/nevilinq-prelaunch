import Link from "next/link";
import StatusToggle from "@/components/import-export/StatusToggle";
import CountdownPill from "@/components/ui/CountdownPill";

export const revalidate = 0;

type Status = "draft" | "scheduled" | "published";
type ImportExportRow = {
  id: string;
  title: string;
  role: "Buyer" | "Seller" | "Both";
  categories: string[];
  country: string;
  verified?: boolean;
  status: Status;
  publishAt?: string; // ISO when scheduled
};

const BRAND_BORDER = "#E6E9F1";

async function getMyImportExport(): Promise<ImportExportRow[]> {
  // TODO: DB call filtered by current user
  const in10 = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  return [
    {
      id: "iex_1",
      title: "Teak Wood Boards — Bulk",
      role: "Seller",
      categories: ["Wood", "Boards"],
      country: "IN",
      verified: true,
      status: "published",
    },
    {
      id: "iex_2",
      title: "Looking to Buy — Bamboo Sheets",
      role: "Buyer",
      categories: ["Bamboo"],
      country: "SG",
      status: "scheduled",
      publishAt: in10,
    },
    {
      id: "iex_3",
      title: "Cocoa Beans (Monthly Contracts)",
      role: "Both",
      categories: ["Cocoa"],
      country: "GH",
      status: "draft",
    },
  ];
}

function StatusPill({ s, publishAt }: { s: Status; publishAt?: string }) {
  if (s === "scheduled" && publishAt) return <CountdownPill publishAt={publishAt} />;
  if (s === "published")
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        Published
      </span>
    );
  return (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
      Draft
    </span>
  );
}

export default async function ImportExportPage() {
  const rows = await getMyImportExport();

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Import &amp; Export</h1>
        <Link
          href="/dashboard/import-export/new"
          className="rounded-xl border px-3 py-2 text-sm"
          style={{ borderColor: BRAND_BORDER }}
        >
          + Add Listing
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-[#667085]" style={{ borderColor: BRAND_BORDER }}>
          No listings yet. Click “Add Listing” to create your first Import/Export post.
        </div>
      ) : (
        <div className="grid gap-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border bg-white p-4" style={{ borderColor: BRAND_BORDER }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{r.title}</div>
                    <StatusPill s={r.status} publishAt={r.publishAt} />
                  </div>
                  <div className="text-xs text-[#667085]">
                    {r.role} • {r.country} {r.verified ? "• ✅ Verified" : ""}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {r.categories.map((c) => (
                      <span key={c} className="rounded-md border px-2 py-0.5 text-[11px]" style={{ borderColor: BRAND_BORDER, background: "#F7F8FA" }}>
                        #{c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <StatusToggle status={r.status} id={r.id} />
                  <Link href={`/dashboard/import-export/${r.id}`} className="rounded-xl border px-3 py-1.5 text-sm" style={{ borderColor: BRAND_BORDER }}>
                    View
                  </Link>
                  <Link href={`/dashboard/import-export/${r.id}/edit`} className="rounded-xl border px-3 py-1.5 text-sm" style={{ borderColor: BRAND_BORDER }}>
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
