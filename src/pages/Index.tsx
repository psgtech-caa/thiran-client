import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Events from '@/components/Events';
import WhyThiran from '@/components/WhyThiran';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Timeline from '@/components/Timeline';
import IntroLoader from '@/components/IntroLoader';
import LoadingScreen from '@/components/LoadingScreen';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { loading: authLoading } = useAuth();

  // Show scroll to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Intro Loader */}
      {!introComplete && (
        <IntroLoader onComplete={() => setIntroComplete(true)} />
      )}

      <div className={`min-h-screen bg-background text-foreground overflow-x-hidden scrollbar-cosmic transition-opacity duration-500 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
        <CustomCursor />

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main>
          <Hero />
          <Events />
          <Timeline />
          <WhyThiran />
          <FAQ />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 p-4 glass-strong rounded-full hover:bg-white/20 transition-colors group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
