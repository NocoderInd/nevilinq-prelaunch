export default function ChannelsPage() {
  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Channels</h1>
        <a href="/dashboard/channels/new" className="rounded-xl border px-3 py-2" style={{ borderColor: "#E6E9F1" }}>+ Create Channel</a>
      </div>
      <div className="text-sm text-[#667085]">List and manage your WhatsApp/Telegram channels here.</div>
    </main>
  );
}
