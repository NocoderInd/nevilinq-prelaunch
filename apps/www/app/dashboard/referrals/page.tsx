export default function ReferralsPage() {
  return (
    <main>
      <h1 className="mb-2 text-xl font-semibold">Referrals</h1>
      <p className="text-sm text-[#667085]">
        Invite friends. 1 invite → Basic Booster (1 week). 3+ invites → Max Booster (1 week). You can activate one plan at a time.
      </p>
      <div className="mt-4 rounded-2xl border bg-white p-4" style={{ borderColor: "#E6E9F1" }}>
        <div className="text-sm">Your referral link</div>
        <div className="mt-1 rounded-lg border bg-[#F7F8FA] p-2 text-xs" style={{ borderColor: "#E6E9F1" }}>
          https://nevilinq.com/r/your-code
        </div>
        <a href="/dashboard/referrals/activate" className="mt-3 inline-block rounded-xl border px-3 py-2 text-sm" style={{ borderColor: "#E6E9F1" }}>
          Activate reward
        </a>
      </div>
    </main>
  );
}
