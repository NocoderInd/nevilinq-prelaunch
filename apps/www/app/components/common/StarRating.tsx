"use client";

type Props = {
  value: number;
  onChange?: (n: number) => void;
  readOnly?: boolean;
  size?: number; // px
};

export default function StarRating({ value, onChange, readOnly, size = 24 }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div role="radiogroup" aria-label="Rating" className="inline-flex items-center gap-1">
      {stars.map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={filled}
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(n)}
            className="cursor-pointer select-none disabled:cursor-default"
            style={{ lineHeight: 1, fontSize: size }}
            title={`${n} star${n > 1 ? "s" : ""}`}
          >
            <span style={{ color: filled ? "#C16E70" : "#E6E9F1" }}>★</span>
          </button>
        );
      })}
    </div>
  );
}
