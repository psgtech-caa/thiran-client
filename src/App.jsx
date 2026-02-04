import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyThiran from './components/WhyThiran';
import Events from './components/Events';
import EventModal from './components/EventModal';
import StarField from './components/StarField';
import Footer from './components/Footer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

// Replace with your Google OAuth Client ID
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const appRef = useRef(null);

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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div ref={appRef} className="relative min-h-screen bg-[#050508] text-white selection:bg-purple-500/30">
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
        </AnimatePresence>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
