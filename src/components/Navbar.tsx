import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, User, LogOut, ListChecks, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import MagneticButton from './MagneticButton';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/hooks/use-sound';

const navLinks = [
  { name: 'Home', href: '/', isRoute: true },
  { name: 'Events', href: '/#events', isRoute: false },
  { name: 'Schedule', href: '/#schedule', isRoute: false },
  { name: 'Why Thiran', href: '/#why-thiran', isRoute: false },
  { name: 'Contact', href: '/#contact', isRoute: false },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, userProfile, isAdmin, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const { playSound } = useSound();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active link based on scroll position
      const sections = navLinks.map(link => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveLink(`#${section}`);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotateY: 360,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    }
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-strong py-2 shadow-2xl' : 'bg-transparent py-4'
          }`}
      >
        <div className="mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              ref={logoRef}
              href="/"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1 group perspective-container"
            >
              <motion.span
                className="text-xl md:text-2xl font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--silver)), hsl(var(--glossy-blue)))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Thiran
              </motion.span>
              <motion.span
                className="text-sm md:text-base font-bold px-2 py-0.5 rounded-md border border-cosmic-cyan/50 text-cosmic-cyan"
                animate={{
                  boxShadow: [
                    '0 0 5px hsl(187 94% 55% / 0.3)',
                    '0 0 15px hsl(187 94% 55% / 0.5)',
                    '0 0 5px hsl(187 94% 55% / 0.3)',
                  ],
                  borderColor: [
                    'hsl(187 94% 55% / 0.5)',
                    'hsl(187 94% 55% / 0.8)',
                    'hsl(187 94% 55% / 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.1 }}
              >
                2k26
              </motion.span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.isRoute) {
                      // If it's the home route
                      if (link.href === '/' && window.location.pathname !== '/') {
                        navigate('/');
                      }
                    } else {
                      // For hash links, navigate to home first if not already there
                      if (window.location.pathname !== '/') {
                        e.preventDefault();
                        navigate('/');
                        // Wait for navigation, then scroll
                        setTimeout(() => {
                          const hash = link.href.startsWith('#') ? link.href : link.href.substring(link.href.indexOf('#'));
                          const element = document.querySelector(hash);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      }
                    }
                  }}
                  onMouseEnter={() => playSound('hover')}
                  className={`relative text-foreground/80 hover:text-foreground transition-colors duration-300 group ${activeLink === link.href ? 'text-foreground' : ''
                    }`}
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-cosmic"
                    initial={{ width: activeLink === link.href ? '100%' : '0%' }}
                    animate={{ width: activeLink === link.href ? '100%' : '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* CTA Button / User Menu */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center glass p-2 rounded-full hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Show roll number instead of profile pic in navbar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-purple/70 to-cosmic-pink/70 flex items-center justify-center text-[10px] font-semibold tracking-tight text-white">
                      {userProfile?.rollNumber ?? <User className="w-4 h-4 text-white" />}
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-background/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50 shadow-2xl"
                      >
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3 mb-2">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={userProfile?.name || 'User'}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-cosmic flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold">{userProfile?.name}</p>
                              <p className="text-xs text-muted-foreground">{userProfile?.rollNumber}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                          {userProfile?.mobile && (
                            <p className="text-xs text-muted-foreground mt-1">{userProfile.mobile}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{userProfile?.department} • Year {userProfile?.year}</p>
                        </div>
                        <div className="p-2">
                          <motion.button
                            onClick={() => {
                              navigate('/my-registrations');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left"
                            whileHover={{ x: 5 }}
                          >
                            <ListChecks className="w-4 h-4" />
                            <span className="text-sm">My Registrations</span>
                          </motion.button>
                          {isAdmin && (
                            <motion.button
                              onClick={() => {
                                navigate('/admin');
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cosmic-purple/20 to-cosmic-pink/20 hover:from-cosmic-purple/30 hover:to-cosmic-pink/30 transition-all border border-cosmic-purple/30 text-left"
                              whileHover={{ x: 5 }}
                            >
                              <Shield className="w-4 h-4 text-cosmic-purple" />
                              <div>
                                <span className="text-sm font-semibold">Admin Panel</span>
                                <p className="text-xs text-muted-foreground">Coordinators only</p>
                              </div>
                            </motion.button>
                          )}
                          <motion.button
                            onClick={async () => {
                              await signOut();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left text-red-400"
                            whileHover={{ x: 5 }}
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <MagneticButton onClick={signInWithGoogle} className="btn-cosmic text-white">
                  Register Now
                </MagneticButton>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={28} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu size={28} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm glass-strong overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
                  <motion.span
                    className="text-lg font-bold gradient-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Menu
                  </motion.span>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 p-4 md:p-6 flex flex-col gap-3">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);

                        if (link.isRoute) {
                          if (link.href === '/' && window.location.pathname !== '/') {
                            navigate('/');
                          }
                        } else {
                          if (window.location.pathname !== '/') {
                            e.preventDefault();
                            navigate('/');
                            setTimeout(() => {
                              const hash = link.href.startsWith('#') ? link.href : link.href.substring(link.href.indexOf('#'));
                              const element = document.querySelector(hash);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }
                        }
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-lg md:text-xl font-medium text-foreground/80 hover:text-foreground hover:bg-white/10 transition-all duration-300 group"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </motion.a>
                  ))}
                </div>

                {/* User Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="border-t border-white/10 p-4 md:p-6 space-y-3"
                >
                  {user ? (
                    <>
                      <div className="glass rounded-xl p-3 md:p-4 mb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-cosmic-purple/70 to-cosmic-pink/70 flex items-center justify-center text-xs md:text-sm font-semibold text-white flex-shrink-0">
                            {userProfile?.rollNumber ?? <User className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm md:text-base truncate">{userProfile?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{userProfile?.rollNumber}</p>
                          </div>
                        </div>
                        {userProfile?.mobile && (
                          <p className="text-xs text-muted-foreground">{userProfile.mobile}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{userProfile?.department} • Year {userProfile?.year}</p>
                      </div>
                      <MagneticButton
                        onClick={() => {
                          navigate('/my-registrations');
                          setIsMobileMenuOpen(false);
                        }}
                        className="btn-cosmic text-white w-full text-sm md:text-base py-2.5 md:py-3"
                      >
                        My Registrations
                      </MagneticButton>
                      {isAdmin && (
                        <motion.button
                          onClick={() => {
                            navigate('/admin');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-cosmic-purple/20 to-cosmic-pink/20 border border-cosmic-purple/30 text-left text-sm md:text-base"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 md:w-5 md:h-5 text-cosmic-purple flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-xs md:text-sm">Admin Panel</p>
                              <p className="text-xs text-muted-foreground">Coordinators only</p>
                            </div>
                          </div>
                        </motion.button>
                      )}
                      <button
                        onClick={async () => {
                          await signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full btn-cosmic-outline text-xs md:text-sm py-2.5 md:py-3"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <MagneticButton onClick={signInWithGoogle} className="btn-cosmic text-white w-full text-sm md:text-base py-2.5 md:py-3">
                      Register Now
                    </MagneticButton>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
