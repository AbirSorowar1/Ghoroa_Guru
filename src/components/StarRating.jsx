// src/components/StarRating.jsx
import { HiStar } from "react-icons/hi";

export default function StarRating({ rating, count, size = "sm" }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const s = size === "sm" ? 14 : 18;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => (
          <HiStar
            key={star}
            size={s}
            className={star <= Math.round(rating) ? "text-yellow-400" : "text-slate-600"}
          />
        ))}
      </div>
      <span className="text-yellow-400 font-medium text-xs">{rating}</span>
      {count && <span className="text-slate-500 text-xs">({count})</span>}
    </div>
  );
}
