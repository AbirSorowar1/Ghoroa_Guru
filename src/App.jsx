// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import FindingPersonPage from "./pages/FindingPersonPage";
import ProfilePage from "./pages/ProfilePage";
import ProviderDetailPage from "./pages/ProviderDetailPage";
import BookingPage from "./pages/BookingPage";
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/LoadingScreen";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-black">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <LandingPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
        <Route path="/services" element={<PrivateRoute><ServicesPage /></PrivateRoute>} />
        <Route path="/finding" element={<PrivateRoute><FindingPersonPage /></PrivateRoute>} />
        <Route path="/provider/:id" element={<PrivateRoute><ProviderDetailPage /></PrivateRoute>} />
        <Route path="/book/:id" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
