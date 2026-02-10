import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, Download, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getEventRegistrations, EventRegistration } from '@/lib/registrationService';
import { events } from '@/data/events';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminPanel() {
  const { user, isAdmin: userIsAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !userIsAdmin)) {
      navigate('/');
    }
  }, [user, userIsAdmin, authLoading, navigate]);

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadEventRegistrations = async (eventId: number) => {
    setLoading(true);
    setSelectedEventId(eventId);
    const regs = await getEventRegistrations(eventId);
    setRegistrations(regs);
    setLoading(false);
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = ['Roll Number', 'Name', 'Email', 'Mobile', 'Department', 'Year', 'Registered At'];
    const rows = registrations.map(reg => [
      reg.userRoll,
      reg.userName,
      reg.userEmail,
      reg.userMobile,
      reg.department,
      reg.year,
      new Date(reg.registeredAt.seconds * 1000).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const eventName = events.find(e => e.id === selectedEventId)?.name || 'event';
    a.download = `${eventName}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-cosmic-purple border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!userIsAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-visible"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            View and manage event registrations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {events.map((event, index) => (
            <motion.button
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => loadEventRegistrations(event.id)}
              className={`glass rounded-2xl p-6 text-left transition-all hover:scale-[1.02] ${
                selectedEventId === event.id ? 'ring-2 ring-cosmic-purple' : ''
              }`}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold gradient-text mb-2">{event.name}</h3>
              <p className="text-sm text-muted-foreground">{event.category}</p>
            </motion.button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-cosmic-purple border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {!loading && selectedEventId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-cosmic-purple" />
                <h2 className="text-2xl font-bold">
                  {events.find(e => e.id === selectedEventId)?.name} Registrations
                </h2>
                <span className="glass rounded-full px-4 py-1 text-sm font-semibold">
                  {registrations.length} participants
                </span>
              </div>
              {registrations.length > 0 && (
                <motion.button
                  onClick={exportToCSV}
                  className="btn-cosmic text-white flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
              )}
            </div>

            {registrations.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No registrations yet for this event
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Roll Number</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Mobile</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Year</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <motion.tr
                        key={`${reg.userId}_${reg.eventId}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">{reg.userRoll}</td>
                        <td className="py-3 px-4 text-sm font-medium">{reg.userName}</td>
                        <td className="py-3 px-4 text-sm">{reg.userEmail}</td>
                        <td className="py-3 px-4 text-sm">{reg.userMobile}</td>
                        <td className="py-3 px-4 text-sm">{reg.department}</td>
                        <td className="py-3 px-4 text-sm">{reg.year}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(reg.registeredAt.seconds * 1000).toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>

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
  );
}
