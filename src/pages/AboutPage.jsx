// src/pages/AboutPage.jsx
import { motion } from "framer-motion";
import { HiShieldCheck, HiUsers, HiHeart, HiGlobe } from "react-icons/hi";

const team = [
  { name: "Ghoroa Guru Team", role: "Founded 2024", emoji: "🏠", desc: "Built with passion to solve real household needs in Bangladesh." },
];

const values = [
  { icon: HiShieldCheck, title: "Safety First", desc: "Every helper undergoes thorough background verification before joining our platform.", color: "text-green-400 bg-green-400/10" },
  { icon: HiUsers, title: "Community Driven", desc: "We connect neighbors with trusted helpers from their own community.", color: "text-blue-400 bg-blue-400/10" },
  { icon: HiHeart, title: "Care & Respect", desc: "We believe in dignified work relationships between employers and helpers.", color: "text-pink-400 bg-pink-400/10" },
  { icon: HiGlobe, title: "Accessible to All", desc: "Simple, affordable service available across all Dhaka zones.", color: "text-purple-400 bg-purple-400/10" },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-4xl shadow-lg shadow-brand-500/30">
            🏠
          </div>
          <h1 className="section-title mb-4">About Ghoroa Guru</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            <span className="font-bengali text-white">ঘরোয়া গুরু</span> — "Home Expert" in Bengali. 
            We are Bangladesh's first smart household helper management platform, 
            connecting families with trusted domestic professionals across Dhaka.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 mb-10 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-40 h-40 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="font-display text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            In Bangladesh, millions of households rely on domestic helpers, yet finding trustworthy, 
            experienced professionals remains a challenge. Ghoroa Guru digitizes this process — 
            making it transparent, safe, and convenient for both families and helpers.
          </p>
          <p className="text-slate-300 leading-relaxed mt-4">
            We believe every home deserves professional, reliable care — and every helper deserves 
            fair pay, recognition, and dignity. Our platform bridges that gap.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-white mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: "01", title: "Login with Google", desc: "Secure, one-click authentication via your Google account." },
              { step: "02", title: "Select Your Zone", desc: "Choose your Dhaka area and preferred service type." },
              { step: "03", title: "Browse Helpers", desc: "View verified profiles with ratings, experience, and availability." },
              { step: "04", title: "Book & Pay", desc: "Choose hours/days, select work type, and confirm your booking instantly." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-brand-400">{step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
