import { useState } from "react";
import { motion } from "framer-motion";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Chat from "./Chat";
import { AuthProvider, useAuth } from "./config/AuthContext";
import AuthModal from "./config/AuthModal";
import LandingPage from "./Landingpage";



// ─────────────────────────────────────────────
// PROTECTED ROUTE
// ─────────────────────────────────────────────
const ProtectedRoute = ({ children, onOpenAuth }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d14] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/10 border-t-emerald-500 rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    onOpenAuth("login");
    return <Navigate to="/" replace />;
  }

  return children;
};

// ─────────────────────────────────────────────
// APP CONTENT
// ─────────────────────────────────────────────
const AppContent = () => {
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const openAuth = (mode = "login") => setAuthModal({ open: true, mode });
  const closeAuth = () => setAuthModal(s => ({ ...s, open: false }));

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              onOpenAuth={openAuth} 
            />
          } 
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute onOpenAuth={openAuth}>
              <Chat onOpenSubscription={() => setShowSubscriptionModal(true)} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <AuthModal
        isOpen={authModal.open}
        onClose={closeAuth}
        initialMode={authModal.mode}
        onSuccess={() => {
          closeAuth();
          window.location.href = "/chat";
        }}
      />

     
    </>
  );
};

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;