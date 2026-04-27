// src/pages/FindingPersonPage.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiFilter, HiX } from "react-icons/hi";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { generateProviders, dhakaZones } from "../data/providers";
import ProviderCard from "../components/ProviderCard";

export default function FindingPersonPage() {
  const [zone, setZone] = useState(null);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nid, setNid] = useState("");
  const [confirmedAddress, setConfirmedAddress] = useState("");
  const [confirmedDetails, setConfirmedDetails] = useState(null);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const nidInputRef = useRef(null);
  const addressInputRef = useRef(null);
  const [gender, setGender] = useState(null);
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState({});
  const [loadingBookings, setLoadingBookings] = useState(false);

  const handleDetailsSubmit = (event) => {
    event.preventDefault();
    const trimmedAddress = address.trim();
    if (name.trim() && phone.trim() && nid.trim() && trimmedAddress) {
      setConfirmedDetails({ name: name.trim(), phone: phone.trim(), nid: nid.trim(), address: trimmedAddress });
    }
  };

  const handleInputEnter = (event, nextRef) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (nextRef?.current) {
      nextRef.current.focus();
    } else {
      handleDetailsSubmit(event);
    }
  };

  // Fetch all bookings from Firebase once zone+confirmedDetails+gender selected
  useEffect(() => {
    if (!zone || !confirmedDetails || !gender) return;
    setLoadingBookings(true);
    const bookRef = ref(db, "bookings");
    get(bookRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        // Group by providerId
        const grouped = {};
        Object.values(data).forEach((b) => {
          if (!grouped[b.providerId]) grouped[b.providerId] = [];
          grouped[b.providerId].push(b);
        });
        setBookings(grouped);
      }
      setLoadingBookings(false);
    }).catch(() => setLoadingBookings(false));
  }, [zone, confirmedDetails, gender]);

  const providers = useMemo(() => {
    if (!zone || !confirmedDetails || !gender) return [];
    return generateProviders(zone, gender, confirmedDetails.address);
  }, [zone, confirmedDetails, gender]);

  const filtered = useMemo(() => {
    if (!search.trim()) return providers;
    const q = search.toLowerCase();
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.workTypes.some((w) => w.toLowerCase().includes(q))
    );
  }, [providers, search]);

  const getBookingInfo = (providerId) => {
    const provBookings = bookings[providerId];
    if (!provBookings || provBookings.length === 0) return null;
    const now = Date.now();
    const active = provBookings.find((b) => b.endTime && b.endTime > now);
    if (!active) return null;
    const until = new Date(active.endTime).toLocaleDateString("en-BD");
    return { booked: true, until };
  };

  const reset = () => {
    setZone(null);
    setAddress("");
    setName("");
    setPhone("");
    setNid("");
    setConfirmedAddress("");
    setConfirmedDetails(null);
    setGender(null);
    setSearch("");
  };

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen page-enter relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="py-8">
          <h1 className="section-title mb-2">Find a Helper</h1>
          <p className="text-slate-400">Select your Dhaka zone and preferred gender to browse verified helpers.</p>
        </div>

        {/* Step 1: Zone selection */}
        {!zone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-sm flex items-center justify-center font-bold">1</span>
              Select Your Dhaka Zone
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {dhakaZones.map((z, index) => (
                <motion.button
                  key={z}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setZone(z)}
                  className="card p-6 text-center hover:border-brand-500/50 hover:bg-gradient-to-br hover:from-brand-500/10 hover:to-purple-500/10 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏙️</div>
                  <div className="font-semibold text-white text-sm relative z-10">{z}</div>
                  <div className="text-slate-500 text-xs mt-1 relative z-10">30+ helpers</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Address and details input */}
        {zone && !confirmedDetails && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setZone(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                ←
              </button>
              <div>
                <div className="text-slate-400 text-sm">Selected zone</div>
                <div className="font-semibold text-white">{zone}</div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-sm flex items-center justify-center font-bold">2</span>
              Enter Your Details
            </h2>
            <form onSubmit={handleDetailsSubmit} className="space-y-4 max-w-md mx-auto">
              <input
                ref={nameInputRef}
                type="text"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => handleInputEnter(e, phoneInputRef)}
                className="input-field"
              />
              <input
                ref={phoneInputRef}
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => handleInputEnter(e, nidInputRef)}
                className="input-field"
              />
              <input
                ref={nidInputRef}
                type="text"
                placeholder="NID Number"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                onKeyDown={(e) => handleInputEnter(e, addressInputRef)}
                className="input-field"
              />
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">📍</div>
                <input
                  ref={addressInputRef}
                  type="text"
                  placeholder="e.g., Gulshan-1, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => handleInputEnter(e, null)}
                  className="input-field pl-12"
                />
              </div>
              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                disabled={!name.trim() || !phone.trim() || !nid.trim() || !address.trim()}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Gender Selection
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Step 3: Gender selection */}
        {zone && confirmedDetails && !gender && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setConfirmedDetails(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                ←
              </button>
              <div>
                <div className="text-slate-400 text-sm">Selected zone & details</div>
                <div className="font-semibold text-white">{zone} · {confirmedDetails?.name}</div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-sm flex items-center justify-center font-bold">3</span>
              Select Gender Preference
            </h2>
            <div className="grid grid-cols-2 gap-6 max-w-sm">
              {["Male", "Female"].map((g, index) => (
                <motion.button
                  key={g}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGender(g)}
                  className="card p-10 text-center hover:border-brand-500/50 hover:bg-gradient-to-br hover:from-brand-500/10 hover:to-pink-500/10 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform relative z-10">{g === "Male" ? "👨‍💼" : "👩‍💼"}</div>
                  <div className="font-semibold text-white text-lg relative z-10">{g}</div>
                  <div className="text-slate-400 text-sm mt-2 relative z-10">Helpers</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Provider list */}
        {zone && confirmedDetails && gender && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Active filters bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5">
                <HiFilter className="text-brand-400 text-sm" />
                <span className="text-brand-300 text-sm font-medium">{zone}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                <span className="text-slate-300 text-sm">📍 {confirmedDetails?.address}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                <span className="text-sm text-slate-300">{gender === "Male" ? "👨" : "👩"} {gender}</span>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm transition-colors ml-auto"
              >
                <HiX size={14} />
                Reset filters
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, area, or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <HiX size={16} />
                </button>
              )}
            </div>

            {/* Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                Showing <span className="text-white font-semibold">{filtered.length}</span> helpers in {zone} near {confirmedDetails?.address}
              </p>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="text-5xl mb-4">🔍</div>
                <p>No helpers found matching your search.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filtered.map((provider, i) => (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ProviderCard
                        provider={provider}
                        bookingInfo={getBookingInfo(provider.id)}
                        extraState={confirmedDetails ? { confirmedDetails } : undefined}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
