import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LogIn, User, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/authContext';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Events', href: '#events' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const { user, signInWithGoogle, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center',
          isScrolled ? 'pt-4' : 'pt-6'
        )}
      >
        <nav
          className={cn(
            'relative flex items-center justify-between rounded-full transition-all duration-500 border border-white/10 backdrop-blur-xl shadow-lg shadow-purple-500/5',
            isScrolled 
              ? 'bg-[#0a0a0f]/80 w-[90%] md:w-[70%] max-w-5xl py-3 pl-5 pr-3' 
              : 'bg-[#0a0a0f]/60 w-[95%] md:w-[85%] max-w-7xl py-4 pl-6 pr-4'
          )}
        >
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-3 group z-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-purple-400 group-hover:text-pink-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-wide text-white group-hover:text-purple-300 transition-colors">
                THIRAN
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveLink(link.name)}
                className={cn(
                  'relative text-sm font-medium transition-colors hover:text-purple-400',
                  activeLink === link.name ? 'text-white' : 'text-gray-400'
                )}
              >
                {link.name}
                {activeLink === link.name && (
                  <motion.div
                    layoutId="activeNavDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500"
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
             {/* Admin Dashboard Link */}
             {isAdmin && (
               <motion.button
                 onClick={() => navigate('/admin')}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors"
               >
                 <Shield size={16} />
                 <span className="text-sm font-medium">Admin</span>
               </motion.button>
             )}
             
             {/* CTA Button - Desktop */}
             {!user ? (
               <div className="hidden md:block">
                 <Button 
                   variant="primary" 
                   size="sm"
                   className="rounded-full px-6 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg shadow-purple-500/25"
                   onClick={signInWithGoogle}
                   disabled={loading}
                 >
                   <LogIn size={16} />
                   <span className="font-semibold">Sign In</span>
                 </Button>
               </div>
             ) : (
               <div className="hidden md:block">
                 <UserMenu />
               </div>
             )}

             {/* Mobile Menu Button */}
             <motion.button
               className="md:hidden relative z-10 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               whileTap={{ scale: 0.95 }}
               aria-label="Toggle menu"
             >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden"
            >
              <div className="bg-[#0f0f18]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl shadow-black/40">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={() => {
                        setActiveLink(link.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'flex items-center justify-between px-4 py-4 rounded-xl font-medium transition-all border border-transparent',
                        activeLink === link.name
                          ? 'bg-purple-500/10 text-white border-purple-500/20 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="text-base tracking-wide">{link.name}</span>
                      {activeLink === link.name && (
                        <motion.div 
                          layoutId="activeMobile"
                          className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                        />
                      )}
                    </motion.a>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  {!user ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signInWithGoogle();
                      }}
                      disabled={loading}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In with Google</span>
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full justify-center"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate('/admin');
                          }}
                        >
                          <Shield className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </Button>
                      )}
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} className="w-12 h-12 rounded-full ring-2 ring-purple-500/50" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <User size={24} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-base truncate">{user.name}</p>
                          <p className="text-purple-400 text-sm font-medium">{user.rollNumber}</p>
                          <p className="text-gray-400 text-xs truncate mt-0.5">{user.mobileNumber}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
