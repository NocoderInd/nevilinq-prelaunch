export default function VerificationPage() {
  return (
    <main>
      <h1 className="mb-2 text-xl font-semibold">Verification</h1>
      <p className="text-sm text-[#667085]">
        Available only for paid admins. Submit ID as per your country. We will email a video meeting link to confirm identity.
      </p>
      <a href="/dashboard/verification/start" className="mt-3 inline-block rounded-xl border px-3 py-2 text-sm" style={{ borderColor: "#E6E9F1" }}>
        Start Verification
      </a>
    </main>
  );
}
