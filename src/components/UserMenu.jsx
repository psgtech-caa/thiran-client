import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { getUserEvents } from '../lib/eventService';
import { eventsData } from './Events';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Refresh events when modal opens
  useEffect(() => {
    const loadUserEvents = async () => {
      if (user && isOpen) {
        setLoading(true);
        try {
          const userEventsList = await getUserEvents(user.uid);
          
          // Map event IDs to event details from eventsData
          const eventsWithDetails = userEventsList.map((userEvent) => {
            const eventDetails = eventsData.find(e => String(e.id) === String(userEvent.eventId));
            return {
              ...userEvent,
              name: eventDetails?.name || `Event ${userEvent.eventId}`,
              icon: eventDetails?.icon || '🎯',
              color: eventDetails?.color || '#a855f7'
            };
          });
          
          setRegisteredEvents(eventsWithDetails);
          setEventCount(eventsWithDetails.length);
        } catch (error) {
          console.error('Error loading user events:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserEvents();
  }, [user, isOpen]);
  
  // Load count even when closed
  useEffect(() => {
    const loadEventCount = async () => {
      if (user && !isOpen) {
        try {
          const userEventsList = await getUserEvents(user.uid);
          setEventCount(userEventsList.length);
        } catch (error) {
          console.error('Error loading event count:', error);
        }
      }
    };
    
    loadEventCount();
    
    // Poll every 3 seconds to check for new registrations
    const interval = setInterval(loadEventCount, 3000);
    return () => clearInterval(interval);
  }, [user, isOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-purple-500/30" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          )}
          <span className="text-sm font-medium text-white hidden md:block">{user.name?.split(' ')[0]}</span>
        </div>
        
        {/* Event count badge */}
        {eventCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0a0a0f]">
            {eventCount}
          </div>
        )}
        
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-80 bg-[#0f0f18]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-12 h-12 rounded-full ring-2 ring-purple-500/50" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-purple-400 font-medium">{user.rollNumber}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Registered Events */}
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Registered Events</h3>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="text-purple-400 animate-spin" />
                </div>
              ) : registeredEvents.length > 0 ? (
                <div className="space-y-2">
                  {registeredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${event.color}40, ${event.color}20)`,
                          }}
                        >
                          {event.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{event.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            <span className="text-green-400 capitalize">{event.status}</span> • {new Date(event.registeredAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No events registered yet</p>
                  <p className="text-xs text-gray-500 mt-1">Browse events below to register</p>
                </div>
              )}
            </div>

            {/* Sign Out */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              <motion.button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
