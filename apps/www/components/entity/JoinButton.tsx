"use client";

export default function JoinButton({
  href,
  label,
  slug
}: {
  href: string;
  label: string;
  slug: string;
}) {
  const onClick = () => {
    const payload = JSON.stringify({ type: "join_click", slug, ts: Date.now() });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/events", blob);
      } else {
        fetch("/api/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch {}
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow ugc"
      onClick={onClick}
      aria-label={label}
      className="block w-full rounded-xl bg-[#030027] px-4 py-2 text-center text-sm font-semibold text-white"
    >
      {label}
    </a>
  );
}
