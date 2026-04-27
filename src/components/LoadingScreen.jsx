// src/components/LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-deep-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-brand-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-brand-500/10 flex items-center justify-center">
            <span className="text-2xl">🏠</span>
          </div>
        </div>
        <p className="font-display text-xl text-white">Ghoroa Guru</p>
        <p className="text-slate-400 text-sm mt-1">Loading...</p>
      </div>
    </div>
  );
}
