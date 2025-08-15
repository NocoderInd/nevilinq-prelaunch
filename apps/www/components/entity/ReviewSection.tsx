"use client";

import { useState } from "react";

type Review = {
  id: string;
  author: string;
  rating: number; // 1–5
  comment: string;
  date: string;   // ISO
};

export default function ReviewSection({ slug, title }: { slug: string; title: string }) {
  // TODO: fetch real reviews by slug
  const [reviews] = useState<Review[]>([]);

  return (
    <section className="mt-6 rounded-2xl border bg-white p-4" style={{ borderColor: "#E6E9F1" }}>
      <div className="mb-1 text-sm font-semibold">Reviews for “{title}”</div>
      <div className="text-xs text-[#667085]">Listing ID: {slug}</div>

      {reviews.length === 0 ? (
        <div className="mt-3 text-sm text-[#667085]">No reviews yet.</div>
      ) : (
        <ul className="mt-3 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border p-3" style={{ borderColor: "#E6E9F1" }}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.author}</div>
                <div className="text-xs text-[#667085]">{new Date(r.date).toLocaleDateString()}</div>
              </div>
              <div className="my-1 text-xs leading-none">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>
              <p className="text-sm text-[#0E1324]">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
