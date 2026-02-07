import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyThiran from './components/WhyThiran';
import Events from './components/Events';
import EventModal from './components/EventModal';
import StarField from './components/StarField';
import Footer from './components/Footer';
import MobileInputModal from './components/MobileInputModal';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './lib/authContext';
import './index.css';

// Lazy load Admin Dashboard
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

gsap.registerPlugin(ScrollTrigger);

// Protected route component for admin
function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-purple-500 text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppContent() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const appRef = useRef(null);
  const { showMobileInput } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
      
      if (appRef.current) {
        appRef.current.style.setProperty('--mouse-x', `${x}%`);
        appRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div ref={appRef} className="relative min-h-screen bg-[#050508] text-white selection:bg-purple-500/30">
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={
          <>
            <StarField />
            <div className="relative z-10">
              <Navbar />
              <Hero mousePosition={mousePosition} />
              <WhyThiran />
              <Events onEventClick={handleEventClick} mousePosition={mousePosition} />
              <Footer />
            </div>
            <AnimatePresence>
              {selectedEvent && (
                <EventModal event={selectedEvent} onClose={handleCloseModal} />
              )}
              {showMobileInput && <MobileInputModal />}
            </AnimatePresence>
          </>
        } />
        
        {/* Admin Dashboard - Protected Route */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <Suspense fallback={
              <div className="min-h-screen bg-[#050508] flex items-center justify-center">
                <div className="text-purple-500 text-center">
                  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-gray-400">Loading Dashboard...</p>
                </div>
              </div>
            }>
              <AdminDashboard />
            </Suspense>
          </ProtectedAdminRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
