// src/pages/HomePage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiSearch, HiSparkles, HiClock, HiShieldCheck, HiStar, HiArrowRight } from "react-icons/hi";

const stats = [
  { icon: "👥", val: "300+", label: "Verified Helpers", color: "text-blue-400" },
  { icon: "⭐", val: "4.8", label: "Average Rating", color: "text-yellow-400" },
  { icon: "🏘️", val: "10", label: "Dhaka Zones", color: "text-green-400" },
  { icon: "✅", val: "1200+", label: "Bookings Done", color: "text-brand-400" },
];

const features = [
  { icon: HiSearch, title: "Easy Search", desc: "Find helpers by zone, gender, and service type with smart filters.", color: "bg-blue-500/10 text-blue-400" },
  { icon: HiShieldCheck, title: "Verified Profiles", desc: "Every helper is background-checked and verified before listing.", color: "bg-green-500/10 text-green-400" },
  { icon: HiClock, title: "Flexible Booking", desc: "Book by hour, day, or month. Cancel or reschedule anytime.", color: "bg-purple-500/10 text-purple-400" },
  { icon: HiStar, title: "Rated & Reviewed", desc: "Real ratings from real users help you make the best choice.", color: "bg-yellow-500/10 text-yellow-400" },
];

const services = [
  { emoji: "🧹", label: "Cleaning" },
  { emoji: "🍳", label: "Cooking" },
  { emoji: "👶", label: "Babysitting" },
  { emoji: "🌿", label: "Gardening" },
  { emoji: "🚗", label: "Driver" },
  { emoji: "👴", label: "Elder Care" },
  { emoji: "👕", label: "Laundry" },
  { emoji: "📚", label: "Tutoring" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function HomePage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "there";

  return (
    <div className="relative min-h-screen page-enter overflow-hidden">
      <div className="fixed inset-0 -z-50">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80')",
            filter: "blur(10px) brightness(0.15) saturate(0.6)",
          }}
        />
        <div className="absolute inset-0 bg-black/85" />
      </div>

      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 grid-pattern opacity-20 z-0" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/6 rounded-full blur-3xl z-0" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <HiSparkles className="text-brand-400 text-sm" />
            <span className="text-brand-300 text-sm">Welcome back, {firstName}! 👋</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold text-white leading-tight"
          >
            Your Home, <span className="text-gradient">Our Care</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-400 text-xl max-w-2xl mx-auto"
          >
            Find trusted household helpers in your Dhaka neighborhood within minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/finding" className="btn-primary inline-flex items-center gap-2">
              <HiSearch size={18} />
              Find a Helper Now
              <HiArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn-secondary inline-flex items-center gap-2">
              <HiSparkles size={18} />
              View Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map(({ icon, val, label, color }) => (
            <motion.div key={label} variants={item} className="card p-6 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <div className={`text-3xl font-bold font-display ${color}`}>{val}</div>
              <div className="text-slate-400 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Services grid */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <h2 className="section-title mb-2">Our Services</h2>
        <p className="text-slate-400 mb-6">Everything your home needs, under one roof.</p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {services.map(({ emoji, label }) => (
            <Link
              key={label}
              to={`/finding`}
              className="card p-4 text-center hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group"
            >
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{emoji}</div>
              <div className="text-xs text-slate-400 group-hover:text-white transition-colors">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <h2 className="section-title mb-2">Why Ghoroa Guru?</h2>
        <p className="text-slate-400 mb-8">Built with your safety and convenience in mind.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card p-6 flex gap-4 hover:border-white/10 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <div className="relative card p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to find your helper?</h2>
            <p className="text-slate-400 mb-6">Browse 300+ verified helpers across all Dhaka zones.</p>
            <Link to="/finding" className="btn-primary inline-flex items-center gap-2">
              Start Searching <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
