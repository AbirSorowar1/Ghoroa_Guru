// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { ref, get, remove } from "firebase/database";
import { HiUser, HiMail, HiCalendar, HiTrash, HiRefresh } from "react-icons/hi";
import toast from "react-hot-toast";

function BookingCard({ booking, expanded, onToggleDetails, onCancel, onDelete }) {
  const now = Date.now();
  const isActive = booking.endTime > now;
  const startTimestamp = Number(booking.startTimestamp || booking.startTime || 0);
  const startDateTime = startTimestamp
    ? new Date(startTimestamp).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })
    : booking.startDate;
  const endDate = new Date(booking.endTime).toLocaleDateString("en-BD", {
    year: "numeric", month: "short", day: "numeric"
  });
  const sessionHours = booking.sessionHours || booking.durationValue;

  return (
    <div className={`card p-5 ${isActive ? "border-brand-500/20" : "opacity-60"}`}>
      <div className="flex items-start gap-4">
        <img
          src={booking.providerPhoto}
          alt={booking.providerName}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
          onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.providerName)}&background=334155&color=f1f5f9`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-white">{booking.providerName}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{Array.isArray(booking.workTypes) ? booking.workTypes.join(", ") : booking.workTypes}</p>
            </div>
            <span className={`badge flex-shrink-0 ${isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white/5 text-slate-400"}`}>
              {isActive ? "Active" : "Completed"}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-deep-700 rounded-lg p-2">
              <div className="text-slate-500">Duration</div>
              <div className="text-white font-medium">
                {booking.durationValue ? `${booking.durationValue} ${booking.durationType}` : `${sessionHours} hrs`}
              </div>
            </div>
            <div className="bg-deep-700 rounded-lg p-2">
              <div className="text-slate-500">Total Paid</div>
              <div className="text-brand-400 font-bold">৳{Number(booking.totalAmount).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 gap-2">
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <HiCalendar size={12} />
              {isActive ? `Active until ${endDate}` : `Ended ${endDate}`}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onToggleDetails(booking.bookingId)}
                className="text-brand-300 hover:text-white text-xs transition-colors"
              >
                {expanded ? "Hide Details" : "View Details"}
              </button>
              {isActive ? (
                <button
                  onClick={() => onCancel(booking.bookingId)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                >
                  <HiTrash size={12} />
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => onDelete(booking.bookingId)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                >
                  <HiTrash size={12} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 rounded-2xl bg-deep-800/70 p-4 text-sm text-slate-300 space-y-3 border border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-slate-500 text-xs">Session Hours</div>
              <div className="text-white">{sessionHours} hrs</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Start</div>
              <div className="text-white">{startDateTime}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-slate-500 text-xs">Work Types</div>
              <div className="text-white">{Array.isArray(booking.workTypes) ? booking.workTypes.join(", ") : booking.workTypes}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Total Paid</div>
              <div className="text-brand-400">৳{Number(booking.totalAmount).toLocaleString()}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-slate-500 text-xs">NID</div>
              <div className="text-white">{booking.userNid || "—"}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Phone</div>
              <div className="text-white">{booking.userPhone || "—"}</div>
            </div>
          </div>
          <div className="text-slate-500 text-xs">Address</div>
          <div className="text-white">{booking.userAddress || "—"}</div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const snap = await get(ref(db, `users/${user.uid}/bookings`));
      if (snap.exists()) {
        const data = snap.val();
        const arr = Object.values(data).sort((a, b) => (b.endTime || 0) - (a.endTime || 0));
        setBookings(arr);
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await remove(ref(db, `users/${user.uid}/bookings/${bookingId}`));
      await remove(ref(db, `bookings/${bookingId}`));
      toast.success("Booking cancelled.");
      fetchBookings();
    } catch (e) {
      toast.error("Failed to cancel.");
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Delete this completed booking?")) return;
    try {
      await remove(ref(db, `users/${user.uid}/bookings/${bookingId}`));
      await remove(ref(db, `bookings/${bookingId}`));
      toast.success("Booking deleted.");
      fetchBookings();
    } catch (e) {
      toast.error("Failed to delete booking.");
    }
  };

  const toggleExpanded = (bookingId) => {
    setExpandedBookingId((current) => (current === bookingId ? null : bookingId));
  };

  const activeBookings = bookings.filter(b => b.endTime > Date.now());
  const pastBookings = bookings.filter(b => b.endTime <= Date.now());
  const totalSpent = bookings.reduce((s, b) => s + Number(b.totalAmount || 0), 0);

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen page-enter">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title mb-8">My Profile</h1>

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=f97316&color=fff`}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-deep-800" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-white">{user?.displayName}</h2>
              <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                <HiMail size={14} />
                {user?.email}
              </div>
            </div>
            <button
              onClick={() => { logout(); }}
              className="text-slate-400 hover:text-red-400 text-sm transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-white">{bookings.length}</div>
              <div className="text-slate-400 text-xs">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-green-400">{activeBookings.length}</div>
              <div className="text-slate-400 text-xs">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-brand-400">৳{totalSpent.toLocaleString()}</div>
              <div className="text-slate-400 text-xs">Total Spent</div>
            </div>
          </div>
        </motion.div>

        {/* Bookings */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-white">My Bookings</h2>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <HiRefresh size={14} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="card p-5 h-32 skeleton rounded-2xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-slate-400">No bookings yet.</p>
            <p className="text-slate-500 text-sm mt-1">Find a helper and make your first booking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Active Bookings ({activeBookings.length})
                </h3>
                {activeBookings.map((b) => (
                  <BookingCard
                    key={b.bookingId}
                    booking={b}
                    expanded={expandedBookingId === b.bookingId}
                    onToggleDetails={toggleExpanded}
                    onCancel={cancelBooking}
                  />
                ))}
              </>
            )}
            {pastBookings.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-slate-400 mt-6">Past Bookings ({pastBookings.length})</h3>
                {pastBookings.map((b) => (
                  <BookingCard
                    key={b.bookingId}
                    booking={b}
                    expanded={expandedBookingId === b.bookingId}
                    onToggleDetails={toggleExpanded}
                    onDelete={deleteBooking}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
