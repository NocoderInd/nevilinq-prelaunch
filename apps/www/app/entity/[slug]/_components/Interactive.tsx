// frontend/src/app/entity/[slug]/_components/Interactive.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, Share2, Flag } from "lucide-react";

type Review = { id: string; rating: number; comment: string; author?: string; createdAt: string };

export default function Interactive(props: {
  slug: string;
  entityName: string;
  initialReviews: Review[];
  reportEmail: string;
  brand: { primary: string; accent: string; surface: string; text: string; bg: string; border: string };
}) {
  const { slug, entityName, initialReviews, reportEmail, brand } = props;

  // Persist reviews locally for demo; replace with API later.
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    const saved = localStorage.getItem(`nv-reviews:${slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Review[];
        if (Array.isArray(parsed) && parsed.length >= initialReviews.length) {
          setReviews(parsed);
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`nv-reviews:${slug}`, JSON.stringify(reviews));
  }, [slug, reviews]);

  const { avg, count } = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    const count = reviews.length;
    return { avg: Math.round((sum / count) * 10) / 10, count };
  }, [reviews]);

  // Review form state
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  function submitReview() {
    if (!rating) return alert("Please select a star rating.");
    if (!comment.trim()) return alert("Please add a short comment.");
    const newReview: Review = {
      id: crypto.randomUUID(),
      rating,
      comment: comment.trim(),
      author: "Anonymous",
      createdAt: new Date().toISOString(),
    };
    setReviews((r) => [newReview, ...r]);
    setRating(0);
    setComment("");
  }

  function copyLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  }

  function openReportModal() {
    const reason = prompt("Tell us briefly what's wrong with this listing (spam, scam, incorrect info, etc.)");
    if (!reason) return;
    const mailto = `mailto:${reportEmail}?subject=${encodeURIComponent(
      "Report: " + entityName
    )}&body=${encodeURIComponent(`Slug: ${slug}\nReason: ${reason}\nLink: ${window.location.href}\n`)}`;
    window.location.href = mailto;
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: brand.primary }}>Reviews & Feedback</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
            style={{ borderColor: brand.border, background: "#fff" }}
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={openReportModal}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm"
            style={{ background: brand.accent, color: "#fff" }}
          >
            <Flag className="h-4 w-4" />
            Report
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 text-sm text-slate-600">
        Average <span className="font-semibold">{avg.toFixed(1)}</span>/5 • {count} review{count === 1 ? "" : "s"}
      </div>

      {/* Form */}
      <div className="mt-6 rounded-2xl border bg-white p-4" style={{ borderColor: brand.border }}>
        <div className="text-sm font-medium" style={{ color: brand.primary }}>Leave a review</div>
        <div className="mt-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const v = i + 1;
            const active = (hoverRating || rating) >= v;
            return (
              <button
                key={v}
                type="button"
                aria-label={`${v} star`}
                onClick={() => setRating(v)}
                onMouseEnter={() => setHoverRating(v)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star className="h-7 w-7" fill={active ? brand.accent : "none"} stroke={active ? brand.accent : "#94a3b8"} />
              </button>
            );
          })}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What stood out? Be specific and respectful."
          className="mt-3 w-full rounded-xl border p-3 text-sm outline-none"
          style={{ borderColor: brand.border }}
          rows={3}
        />
        <div className="mt-3">
          <button
            onClick={submitReview}
            className="rounded-xl px-4 py-2 text-sm font-semibold shadow-sm"
            style={{ background: `linear-gradient(90deg, indigo, aqua)`, color: "#fff" }}
          >
            Submit review
          </button>
        </div>
      </div>

      {/* Reviews list */}
      <div className="mt-6 space-y-3">
        {reviews.length === 0 ? (
          <div className="text-sm text-slate-600">No reviews yet. Be the first to write one.</div>
        ) : (
          reviews.map((r) => (
            <article key={r.id} className="rounded-2xl border bg-white p-4" style={{ borderColor: brand.border }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const active = i < r.rating;
                    return <Star key={i} className="h-4 w-4" fill={active ? brand.accent : "none"} stroke={active ? brand.accent : "#94a3b8"} />;
                  })}
                </div>
                <div className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <p className="mt-2 text-sm text-slate-800">{r.comment}</p>
              {r.author && <div className="mt-1 text-xs text-slate-500">— {r.author}</div>}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
