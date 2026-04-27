// src/pages/ServicesPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

const services = [
  { emoji: "🧹", title: "House Cleaning", desc: "Deep cleaning, regular cleaning, organizing, and sanitization of your entire home.", price: "From ৳200/hr", tags: ["Daily", "Weekly", "One-time"] },
  { emoji: "🍳", title: "Cooking", desc: "Home-cooked Bangladeshi and continental meals prepared fresh in your kitchen.", price: "From ৳250/hr", tags: ["Breakfast", "Lunch", "Dinner"] },
  { emoji: "👶", title: "Babysitting", desc: "Safe and caring supervision for your children by experienced caregivers.", price: "From ৳300/hr", tags: ["Infant", "Toddler", "School-age"] },
  { emoji: "🌿", title: "Gardening", desc: "Plant care, lawn mowing, landscaping, and outdoor maintenance services.", price: "From ৳200/hr", tags: ["Watering", "Pruning", "Planting"] },
  { emoji: "🚗", title: "Personal Driver", desc: "Reliable personal drivers for daily commute, errands, and appointments.", price: "From ৳400/hr", tags: ["Commute", "Errands", "Airport"] },
  { emoji: "👴", title: "Elder Care", desc: "Compassionate care and companionship for elderly family members at home.", price: "From ৳350/hr", tags: ["Medical", "Companionship", "Daily Care"] },
  { emoji: "👕", title: "Laundry", desc: "Washing, drying, ironing, and folding clothes with care.", price: "From ৳150/hr", tags: ["Washing", "Ironing", "Dry Clean"] },
  { emoji: "📚", title: "Home Tutoring", desc: "Academic support for children from experienced home tutors.", price: "From ৳300/hr", tags: ["Primary", "Secondary", "HSC"] },
  { emoji: "🔒", title: "Security Guard", desc: "Trained security personnel for residential and small business premises.", price: "From ৳500/day", tags: ["24/7", "Day Shift", "Night Shift"] },
  { emoji: "🛒", title: "Grocery Shopping", desc: "Reliable help with grocery shopping and home delivery assistance.", price: "From ৳200/trip", tags: ["Bazar", "Supermarket", "Delivery"] },
];

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen page-enter">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="section-title mb-2">Our Services</h1>
          <p className="text-slate-400">Professional household services available across all Dhaka zones.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(({ emoji, title, desc, price, tags }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6 hover:border-brand-500/30 hover:bg-brand-500/2 transition-all group"
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.map((t) => (
                  <span key={t} className="badge bg-white/5 text-slate-400">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-400 font-semibold text-sm">{price}</span>
                <Link
                  to="/finding"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors group-hover:text-brand-400"
                >
                  Find Helper <HiArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 card p-8 text-center bg-gradient-to-br from-brand-500/10 to-transparent"
        >
          <h2 className="font-display text-2xl font-bold text-white mb-3">Need a custom service?</h2>
          <p className="text-slate-400 mb-6">Browse all our helpers and find the perfect match for your specific needs.</p>
          <Link to="/finding" className="btn-primary inline-flex items-center gap-2">
            Find a Helper <HiArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
