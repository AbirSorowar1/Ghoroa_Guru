// src/components/ProviderCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiLocationMarker, HiClock, HiBadgeCheck } from "react-icons/hi";
import StarRating from "./StarRating";

export default function ProviderCard({ provider, bookingInfo, extraState }) {
  const [imgError, setImgError] = useState(false);

  const isBooked = bookingInfo?.booked;
  const workingYears = Math.floor(provider.workingMonths / 12);
  const workingMo = provider.workingMonths % 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card overflow-hidden group relative"
    >
      {isBooked && (
        <div className="absolute inset-0 z-20 bg-deep-900/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-5 py-3 text-center">
            <div className="text-red-400 font-semibold">Currently Booked</div>
            <div className="text-slate-400 text-xs mt-1">Until {bookingInfo?.until}</div>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          src={imgError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&size=300&background=334155&color=f1f5f9&bold=true` : provider.photoUrl}
          alt={provider.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-800/90 via-transparent to-transparent group-hover:from-deep-800/70 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Service segment badge */}
        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {provider.serviceSegment.label.split(' (')[0]}
        </div>

        {/* Gender badge */}
        <div className="absolute top-3 left-3 bg-deep-800/80 backdrop-blur-sm text-slate-300 text-xs px-2.5 py-1 rounded-full">
          {provider.gender === "Male" ? "👨" : "👩"} {provider.gender}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-semibold text-white text-lg leading-tight">{provider.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 gap-2 text-slate-400 text-xs">
          <div className="flex items-center gap-1">
            <HiLocationMarker size={13} className="text-brand-400 flex-shrink-0" />
            <span className="truncate max-w-[140px]">{provider.address}</span>
          </div>
          <span>Age {provider.age}</span>
          <StarRating rating={provider.rating} count={provider.ratingCount} />
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
          <HiClock size={13} className="text-blue-400" />
          <span>
            Working: {workingYears > 0 ? `${workingYears}yr ` : ""}{workingMo > 0 ? `${workingMo}mo` : ""}
          </span>
          <span className="mx-1">·</span>
          <span className="text-brand-400 font-medium">{provider.experience.years} yrs exp.</span>
        </div>

        {/* Work types */}
        <div className="flex flex-wrap gap-1 mb-4">
          {provider.workTypes.map((w) => (
            <span key={w} className="badge bg-deep-700 text-slate-400 text-xs">{w}</span>
          ))}
        </div>

        {/* Rate + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-lg font-display">৳{provider.monthlyRate.toLocaleString()}</span>
            <span className="text-slate-400 text-xs">/month</span>
          </div>
          <Link
            to={`/provider/${provider.id}`}
            state={{ provider, ...(extraState || {}) }}
            className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-1.5"
          >
            <HiBadgeCheck size={15} />
            View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
