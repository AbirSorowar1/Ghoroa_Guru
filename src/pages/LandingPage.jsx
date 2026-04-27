// src/pages/LandingPage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { HiSparkles, HiShieldCheck, HiStar } from "react-icons/hi";
import toast from "react-hot-toast";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 8 + 4,
  left: Math.random() * 100,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 10,
}));

const FEATURES = [
  { icon: "🧹", label: "Cleaning", color: "from-blue-500/20 to-blue-600/10" },
  { icon: "🍳", label: "Cooking", color: "from-orange-500/20 to-orange-600/10" },
  { icon: "👶", label: "Babysitting", color: "from-pink-500/20 to-pink-600/10" },
  { icon: "🌿", label: "Gardening", color: "from-green-500/20 to-green-600/10" },
  { icon: "🚗", label: "Driver", color: "from-purple-500/20 to-purple-600/10" },
  { icon: "👴", label: "Elder Care", color: "from-yellow-500/20 to-yellow-600/10" },
];

const heroImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
];

export default function LandingPage() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % heroImages.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Welcome to Ghoroa Guru! 🎉");
    } catch (e) {
      console.error("Login error:", e);
      toast.error(`Login failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Intro splash */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-deep-900 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/40"
              >
                <span className="text-5xl">🏠</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="font-display text-4xl font-bold text-white">Ghoroa Guru</h1>
                <p className="text-brand-400 mt-2 text-lg font-bengali">ঘরোয়া গুরু</p>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                className="mt-8 h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-slate-400 mt-4 text-sm"
              >
                Smart Helping Hand Management
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main landing */}
      <div className="min-h-screen bg-deep-900 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-pattern opacity-50" />

        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.9 }}
            className="flex items-center justify-between py-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-lg">🏠</span>
              </div>
              <span className="font-display text-xl font-bold text-white">
                Ghoroa<span className="text-gradient"> Guru</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Available in Dhaka
            </div>
          </motion.header>

          {/* Hero section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-100px)] py-12">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-2 mb-6">
                <HiSparkles className="text-brand-400" />
                <span className="text-brand-300 text-sm font-medium">Bangladesh's #1 Helping Hand Platform</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Find Your
                <span className="block text-gradient">Trusted</span>
                <span className="block">Helper</span>
              </h1>

              <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-lg">
                Connect with verified, experienced domestic helpers in your area. 
                Cleaning, cooking, caregiving – find the perfect match near you in Dhaka.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mt-8 mb-10">
                {[
                  { val: "300+", label: "Verified Helpers" },
                  { val: "4.8★", label: "Avg Rating" },
                  { val: "10+", label: "Dhaka Zones" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-white font-display">{val}</div>
                    <div className="text-slate-400 text-sm">{label}</div>
                  </div>
                ))}
              </div>

              {/* Login button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogin}
                disabled={loading}
                className="flex items-center gap-3 bg-white text-deep-900 font-semibold px-8 py-4 rounded-2xl shadow-2xl shadow-white/10 hover:bg-slate-100 transition-all text-base disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-deep-900/30 border-t-deep-900 rounded-full animate-spin" />
                ) : (
                  <FcGoogle size={24} />
                )}
                {loading ? "Signing in..." : "Continue with Google"}
              </motion.button>

              <p className="mt-4 text-slate-500 text-xs">
                Free to use · Secure login · No spam
              </p>
            </motion.div>

            {/* Right side - image carousel + feature badges */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.2, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              {/* Main image */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={heroIdx}
                      src={heroImages[heroIdx]}
                      alt="Helper"
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-900/60 to-transparent" />
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-6 -left-4 glass rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <HiShieldCheck className="text-green-400 text-xl" />
                    <div>
                      <div className="text-white text-xs font-semibold">Verified</div>
                      <div className="text-slate-400 text-xs">Background Checked</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-12 -right-4 glass rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <HiStar className="text-yellow-400 text-xl" />
                    <div>
                      <div className="text-white text-xs font-semibold">Top Rated</div>
                      <div className="text-slate-400 text-xs">4.8/5 Average</div>
                    </div>
                  </div>
                </motion.div>

                {/* Image dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroImages.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? "bg-brand-400 w-6" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Service types */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5 }}
            className="pb-16"
          >
            <p className="text-center text-slate-400 text-sm mb-6">Available Services</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {FEATURES.map(({ icon, label, color }) => (
                <div
                  key={label}
                  className={`bg-gradient-to-br ${color} border border-white/5 rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-default`}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-xs text-slate-300 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
