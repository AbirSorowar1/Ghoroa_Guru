// src/pages/ProviderDetailPage.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiLocationMarker, HiClock, HiPhone, HiArrowLeft,
  HiBadgeCheck, HiStar, HiCalendar
} from "react-icons/hi";
import StarRating from "../components/StarRating";

export default function ProviderDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const provider = state?.provider;
  const confirmedDetails = state?.confirmedDetails;
  const [imgError, setImgError] = useState(false);

  if (!provider) {
    return (
      <div className="pt-24 text-center text-slate-400 min-h-screen">
        <p className="text-xl mb-4">Provider not found.</p>
        <Link to="/finding" className="btn-primary">Back to Finding</Link>
      </div>
    );
  }

  const workingYears = Math.floor(provider.workingMonths / 12);
  const workingMo = provider.workingMonths % 12;

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen page-enter">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <HiArrowLeft />
          Back to results
        </button>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden mb-6"
        >
          <div className="relative h-64 sm:h-80">
            <img
              src={imgError
                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&size=600&background=334155&color=f1f5f9&bold=true`
                : provider.photoUrl}
              alt={provider.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-800 via-deep-800/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
              <span className="bg-brand-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {provider.experience.label} Level
              </span>
              <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                <HiBadgeCheck />
                Verified
              </span>
            </div>

            {/* Name and rating */}
            <div className="absolute bottom-4 left-6 right-6">
              <h1 className="font-display text-3xl font-bold text-white mb-1">{provider.name}</h1>
              <StarRating rating={provider.rating} count={provider.ratingCount} size="lg" />
            </div>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <HiLocationMarker className="text-brand-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Address</div>
                <div className="text-white text-sm font-medium">{provider.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <HiClock className="text-purple-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Working Duration</div>
                <div className="text-white text-sm font-medium">
                  {workingYears > 0 ? `${workingYears} years ` : ""}
                  {workingMo > 0 ? `${workingMo} months` : ""}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-fuchsia-500/10 flex items-center justify-center flex-shrink-0">
                <HiPhone className="text-fuchsia-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Age</div>
                <div className="text-white text-sm font-medium">{provider.age} years</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <HiStar className="text-yellow-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Experience Level</div>
                <div className="text-white text-sm font-medium">{provider.experience.years} years • {provider.experience.label}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <HiCalendar className="text-green-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Hourly Rate</div>
                <div className="text-white text-sm font-medium">৳{provider.experience.rate}/hour</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Work types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <h2 className="font-semibold text-white mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {provider.workTypes.map((w) => (
              <span key={w} className="badge bg-brand-500/10 border border-brand-500/20 text-brand-300 py-1.5 px-4 text-sm">
                {w}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-6 mb-6"
        >
          <h2 className="font-semibold text-white mb-4">Pricing</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Hourly", price: `৳${provider.experience.rate}` },
              { label: "Daily (8hr)", price: `৳${provider.experience.rate * 8}` },
              { label: "Monthly", price: `৳${provider.experience.rate * 200}` },
            ].map(({ label, price }) => (
              <div key={label} className="bg-deep-700 rounded-xl p-4 text-center">
                <div className="text-slate-400 text-xs mb-1">{label}</div>
                <div className="text-brand-400 font-bold font-display text-lg">{price}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Book Now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 bg-gradient-to-br from-brand-500/10 to-transparent"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-white text-xl">Ready to hire {provider.name.split(" ")[0]}?</h3>
              <p className="text-slate-400 text-sm">Choose your work type and duration to book now.</p>
            </div>
            <Link
              to={`/book/${provider.id}`}
              state={{ provider, confirmedDetails }}
              className="btn-primary whitespace-nowrap text-base px-8 py-3.5"
            >
              📅 Book Now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
