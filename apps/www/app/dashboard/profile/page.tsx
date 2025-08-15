export default function ProfilePage() {
  return (
    <main>
      <h1 className="mb-4 text-xl font-semibold">Profile</h1>
      <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#E6E9F1" }}>
        {/* CRUD fields: name, email, phone, country… + "Delete account" button */}
        <button className="mt-3 rounded-xl border px-3 py-2 text-sm" style={{ borderColor: "#E6E9F1" }}>
          Delete Account
        </button>
      </div>
    </main>
  );
}
