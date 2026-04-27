// src/pages/BookingPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiCheck, HiCalendar } from "react-icons/hi";
import { db } from "../firebase";
import { ref, get, push, set } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { workCategories } from "../data/providers";
import toast from "react-hot-toast";

const bookingRanges = {
  "part-time": { min: 1, max: 2, label: "Hours" },
  "half-day": { min: 3, max: 5, label: "Hours" },
  "full-time": { min: 10, max: 12, label: "Hours" },
  "full-time-plus": { min: 10, max: 12, label: "Hours" },
};

function calcEndTime(startDate, startTime, hours) {
  const [hh, mm] = startTime.split(":").map(Number);
  const start = new Date(startDate);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return start.getTime() + hours * 3600000;
  start.setHours(hh, mm, 0, 0);
  return start.getTime() + hours * 3600000;
}

function calcTotal(hourlyRate, hours, selectedWorkCount) {
  const baseRate = hourlyRate * hours;
  const extraWorkSurcharge = selectedWorkCount > 2 ? (selectedWorkCount - 2) * 1000 : 0;
  return baseRate + extraWorkSurcharge;
}

export default function BookingPage() {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const provider = state?.provider;

  const [selectedWork, setSelectedWork] = useState([]);
  const [confirmedDetails, setConfirmedDetails] = useState(state?.confirmedDetails || null);
  const bookingRange = bookingRanges[provider?.serviceSegment?.key] || { min: 1, max: 8, label: "Hours" };
  const [bookingHours, setBookingHours] = useState(bookingRange.min);
  const [startTime, setStartTime] = useState("09:00");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [providerBookings, setProviderBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [nextAvailableTime, setNextAvailableTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  if (!provider) {
    return (
      <div className="pt-24 text-center text-slate-400 min-h-screen">
        <p className="text-xl mb-4">Provider not found.</p>
        <Link to="/finding" className="btn-primary">Back to Finding</Link>
      </div>
    );
  }

  const toggleWork = (w) => {
    setSelectedWork((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  };

  const total = calcTotal(provider.experience.rate, bookingHours, selectedWork.length);
  const endTime = calcEndTime(startDate, startTime, bookingHours);

  useEffect(() => {
    if (!provider?.id) return;
    setLoadingBookings(true);
    const bookRef = ref(db, "bookings");
    get(bookRef)
      .then((snap) => {
        const allBookings = snap.exists() ? Object.values(snap.val()) : [];
        const filteredBookings = allBookings.filter((b) => b.providerId === provider.id);
        setProviderBookings(filteredBookings);
        const now = Date.now();
        const activeOrFuture = filteredBookings
          .filter((b) => b.endTime && Number(b.endTime) > now)
          .sort((a, b) => Number(a.endTime) - Number(b.endTime));
        if (activeOrFuture.length) {
          setNextAvailableTime(new Date(Math.max(...activeOrFuture.map((b) => Number(b.endTime)))));
        } else {
          setNextAvailableTime(null);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingBookings(false));
  }, [provider?.id]);

  const handleBook = async () => {
    if (selectedWork.length === 0) {
      toast.error("Please select at least one work type.");
      return;
    }
    if (!confirmedDetails?.name || !confirmedDetails?.phone || !confirmedDetails?.nid || !confirmedDetails?.address) {
      toast.error("Please enter your details first on the Find a Helper page.");
      return;
    }
    const startTimestamp = new Date(`${startDate}T${startTime}`).getTime();
    if (!Number.isFinite(startTimestamp)) {
      toast.error("Please choose a valid start date and time.");
      return;
    }
    const newEnd = endTime;
    const overlappingBookings = providerBookings.filter((b) => {
      const existingStart = Number(b.startTimestamp || b.startTime || 0);
      const existingEnd = Number(b.endTime || 0);
      if (!existingStart || !existingEnd) return false;
      return startTimestamp < existingEnd && newEnd > existingStart;
    });

    if (overlappingBookings.length > 0) {
      const latestEnd = Math.max(...overlappingBookings.map((b) => Number(b.endTime) || 0));
      const sameUserConflict = overlappingBookings.some((b) => b.userEmail === user.email);
      if (sameUserConflict) {
        toast.error("You already have a booking for this helper during the selected time. Please choose another time or helper.");
      } else {
        toast.error(`This helper is already booked for the selected time by another account. Please choose a start time after ${new Date(latestEnd).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })}.`);
      }
      return;
    }
    try {
      setLoading(true);
      const bookingRef = ref(db, "bookings");
      const newRef = push(bookingRef);
      await set(newRef, {
        bookingId: newRef.key,
        userId: user.uid,
        userName: confirmedDetails.name,
        userEmail: user.email,
        userPhone: confirmedDetails.phone,
        userNid: confirmedDetails.nid,
        userAddress: confirmedDetails.address,
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photoUrl,
        zone: provider.zone,
        workTypes: selectedWork,
        serviceSegment: provider.serviceSegment.label,
        sessionHours: bookingHours,
        startDate: startDate,
        startTime: startTime,
        startTimestamp: startTimestamp,
        endTime: endTime,
        totalAmount: total,
        status: "active",
        createdAt: Date.now(),
      });

      // Also save to user's bookings
      const userBookRef = ref(db, `users/${user.uid}/bookings/${newRef.key}`);
      await set(userBookRef, {
        bookingId: newRef.key,
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photoUrl,
        userName: confirmedDetails.name,
        userPhone: confirmedDetails.phone,
        userNid: confirmedDetails.nid,
        userAddress: confirmedDetails.address,
        workTypes: selectedWork,
        serviceSegment: provider.serviceSegment.label,
        sessionHours: bookingHours,
        totalAmount: total,
        startDate: startDate,
        startTime: startTime,
        endTime: endTime,
        status: "active",
      });

      setBooked(true);
      toast.success("Booking confirmed! 🎉");
    } catch (e) {
      toast.error("Booking failed. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-10 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <HiCheck className="text-green-400 text-4xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-slate-400 mb-2">{provider.name} has been booked starting {new Date(startDate).toLocaleDateString('en-BD')}.</p>
          <p className="text-slate-500 text-sm mb-6">
            {bookingHours} {bookingRange.label.toLowerCase()} · {selectedWork.join(", ")} · ৳{total.toLocaleString()}
          </p>
          <div className="flex gap-3">
            <Link to="/profile" className="btn-primary flex-1 text-center">View My Bookings</Link>
            <Link to="/finding" className="btn-secondary flex-1 text-center">Find More</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen page-enter">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <HiArrowLeft />
          Back to profile
        </button>

        <h1 className="section-title mb-2">Book Now</h1>
        <p className="text-slate-400 mb-8">Booking {provider.name} from {provider.zone}</p>

        {/* Provider summary */}
        <div className="card p-5 mb-6 flex items-center gap-4">
          <img
            src={provider.photoUrl}
            alt={provider.name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=334155&color=f1f5f9`}
          />
          <div>
            <h3 className="font-semibold text-white">{provider.name}</h3>
            <p className="text-slate-400 text-sm">{provider.address}</p>
            <p className="text-brand-400 text-sm font-medium">{provider.serviceSegment.label}</p>
          </div>
        </div>

        {loadingBookings ? (
          <div className="card p-6 mb-4 text-slate-400">Checking helper availability…</div>
        ) : nextAvailableTime ? (
          <div className="card p-6 mb-4 text-slate-400">
            This helper is currently booked until <span className="text-white">{new Date(nextAvailableTime).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })}</span>. Choose a later start time.
          </div>
        ) : (
          <div className="card p-6 mb-4 text-slate-400">This helper is available now for the selected session.</div>
        )}

        {confirmedDetails ? (
          <div className="card p-6 mb-4">
            <h2 className="font-semibold text-white mb-4">Booking Details</h2>
            <div className="grid gap-3 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Name</span>
                <span className="text-white">{confirmedDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone</span>
                <span className="text-white">{confirmedDetails.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>NID</span>
                <span className="text-white">{confirmedDetails.nid}</span>
              </div>
              <div className="flex justify-between">
                <span>Address</span>
                <span className="text-white">{confirmedDetails.address}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 mb-4 text-slate-400">
            Please enter your details first on the Find a Helper page before confirming a booking.
          </div>
        )}

        {/* Work type */}
        <div className="card p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-white">Select Work Type(s)</h2>
              <p className="text-slate-400 text-xs mt-1">Max 2 types included • Extra types +৳1000 each</p>
            </div>
            <span className="text-xl font-bold text-brand-300">{selectedWork.length}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {workCategories.map((w, idx) => (
              <motion.button
                key={w}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWork(w)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedWork.includes(w)
                    ? "bg-brand-500/25 border-2 border-brand-500 text-brand-200 shadow-lg shadow-brand-500/20"
                    : "bg-deep-700 border border-white/5 text-slate-400 hover:border-brand-500/30 hover:text-white"
                }`}
              >
                {selectedWork.includes(w) && <HiCheck className="inline mr-1.5 text-brand-400" />}
                {w}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Booking time */}
        <div className="card p-6 mb-4">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <HiCalendar className="text-brand-400" />
            Booking Time
          </h2>
          <div className="grid gap-4">
            <div>
              <div className="flex items-center justify-between mb-3 text-slate-400 text-sm">
                <span>{bookingRange.label} this session</span>
                <span className="text-white font-semibold">{bookingHours} {bookingRange.label.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBookingHours(Math.max(bookingRange.min, bookingHours - 1))}
                  className="w-10 h-10 rounded-lg bg-deep-700 text-white hover:bg-deep-600 transition-colors text-xl font-bold"
                >
                  −
                </button>
                <input
                  type="range"
                  min={bookingRange.min}
                  max={bookingRange.max}
                  value={bookingHours}
                  onChange={(e) => setBookingHours(Number(e.target.value))}
                  className="flex-1 accent-brand-500"
                />
                <button
                  onClick={() => setBookingHours(Math.min(bookingRange.max, bookingHours + 1))}
                  className="w-10 h-10 rounded-lg bg-deep-700 text-white hover:bg-deep-600 transition-colors text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="space-y-2 text-sm">
                <span className="text-slate-400">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-400">Start Time</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                />
              </label>
            </div>
            <p className="text-slate-500 text-sm">
              This helper will be reserved from {new Date(`${startDate}T${startTime}`).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })} for {bookingHours} {bookingRange.label.toLowerCase()}. Others can book again after the session ends.
            </p>
          </div>
        </div>

        {/* Payment summary */}
        <div className="card p-6 mb-6 bg-gradient-to-br from-brand-500/5 via-deep-800/30 to-purple-500/5 border border-brand-500/10">
          <h2 className="font-semibold text-white mb-5">Price Breakdown</h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-deep-800/50">
              <div>
                <div className="text-slate-500 text-xs mb-1">Hourly Rate</div>
                <div className="text-brand-400 font-semibold">৳{provider.experience.rate.toLocaleString()}/hr</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">Session Hours</div>
                <div className="text-white font-semibold">{bookingHours} hrs</div>
              </div>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Base Rate ({bookingHours} hrs × ৳{provider.experience.rate})</span>
                <span className="text-white">৳{(provider.experience.rate * bookingHours).toLocaleString()}</span>
              </div>
              {selectedWork.length > 2 && (
                <div className="flex justify-between text-amber-300">
                  <span>Extra Work Types ({selectedWork.length - 2} × ৳1000)</span>
                  <span className="text-white">+৳{((selectedWork.length - 2) * 1000).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-3 mt-3 flex justify-between">
              <span className="font-semibold text-white">Total Amount</span>
              <span className="font-bold text-lg text-brand-300">৳{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={loading || selectedWork.length === 0 || !confirmedDetails}
          className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>✅ Confirm Booking · ৳{total.toLocaleString()}</>
          )}
        </button>
      </div>
    </div>
  );
}
