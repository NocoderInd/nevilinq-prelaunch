export default function BusinessPage() {
  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Business Listings</h1>
        <a href="/dashboard/business/new" className="rounded-xl border px-3 py-2" style={{ borderColor: "#E6E9F1" }}>+ Add Business</a>
      </div>
      <div className="text-sm text-[#667085]">Add your WhatsApp/Telegram business number and details. Users can contact you directly.</div>
    </main>
  );
}
