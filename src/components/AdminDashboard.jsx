import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/authContext';
import { useNavigate } from 'react-router-dom';
import { getEventParticipants } from '../lib/eventService';
import { eventsData } from './Events';
import { Users, Download, Loader2, Search, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  const loadParticipants = async (eventId) => {
    setLoading(true);
    try {
      const data = await getEventParticipants(eventId);
      setParticipants(data);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const event = eventsData.find(e => e.id === selectedEvent);
    const csvContent = [
      ['Name', 'Roll Number', 'Email', 'Mobile Number', 'Registration Date', 'Status'],
      ...participants.map(p => [
        p.name,
        p.rollNumber,
        p.email,
        p.mobileNumber,
        new Date(p.registeredAt?.seconds * 1000).toLocaleString(),
        p.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.name || 'event'}_participants.csv`;
    a.click();
  };

  const filteredParticipants = participants.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <Loader2 size={48} className="text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="rounded-xl"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400 mt-1">Manage event registrations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-400 font-medium">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Events Grid */}
        {!selectedEvent ? (
          <div>
            <h2 className="text-xl font-heading font-bold mb-6">Select an Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsData.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadParticipants(event.id)}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${event.color}40, ${event.color}20)`,
                      }}
                    >
                      {event.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-lg text-white truncate">
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{event.category}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm font-medium">
                    <Users size={16} />
                    View Participants
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Participants List */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEvent(null);
                    setParticipants([]);
                    setSearchQuery('');
                  }}
                  className="mb-2"
                >
                  <ArrowLeft size={16} />
                  Back to Events
                </Button>
                <h2 className="text-2xl font-heading font-bold">
                  {eventsData.find(e => e.id === selectedEvent)?.name}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Total Participants: {participants.length}
                </p>
              </div>
              <Button
                onClick={downloadCSV}
                disabled={participants.length === 0}
                variant="primary"
                size="md"
                className="gap-2"
              >
                <Download size={18} />
                Export CSV
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, roll number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Participants Table */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={40} className="text-purple-500 animate-spin" />
              </div>
            ) : filteredParticipants.length > 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Mobile
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredParticipants.map((participant, index) => (
                        <motion.tr
                          key={participant.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {participant.photoURL ? (
                                <img
                                  src={participant.photoURL}
                                  alt={participant.name}
                                  className="w-10 h-10 rounded-full ring-2 ring-purple-500/30"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                  {participant.name?.charAt(0)}
                                </div>
                              )}
                              <span className="text-sm font-medium text-white">
                                {participant.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400 font-medium">
                            {participant.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {participant.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {participant.mobileNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(participant.registeredAt?.seconds * 1000).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                              {participant.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Users size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No participants found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
