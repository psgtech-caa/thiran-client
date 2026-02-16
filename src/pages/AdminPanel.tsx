import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, Download, Users, CheckSquare, Square, CheckCircle, LogOut, Shield, UserCog, GraduationCap, BarChart3, Search, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getEventRegistrations, markAttendance, markBulkAttendance, EventRegistration, removeRegistration, getAllRegistrations } from '@/lib/registrationService';
import { events } from '@/data/events';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { ROLE_LABELS, ROLE_COLORS, canManageEvent } from '@/lib/userUtils';

interface StudentAggregated {
  name: string;
  rollNumber: string;
  department: string;
  year: number;
  mobile: string;
  eventCount: number;
}

type AdminTab = 'dashboard' | 'events' | 'participants';

export default function AdminPanel() {
  const { user, isAdmin: userIsAdmin, isCoordinator: userIsCoordinator, userRole, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<EventRegistration[]>([]);
  const [allParticipants, setAllParticipants] = useState<Record<string, StudentAggregated>>({});
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [attendanceUpdating, setAttendanceUpdating] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && (!user || !userIsCoordinator)) {
      navigate('/');
    }
  }, [user, userIsCoordinator, authLoading, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load all registrations for dashboard on mount
  useEffect(() => {
    if (userIsCoordinator && activeTab === 'dashboard') {
      loadDashboardData();
    }
  }, [userIsCoordinator, activeTab]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadDashboardData = async () => {
    setLoading(true);
    const allRegs = await getAllRegistrations();
    setAllRegistrations(allRegs);
    setLoading(false);
  };

  const loadEventRegistrations = async (eventId: number) => {
    setLoading(true);
    setSelectedEventId(eventId);
    setActiveTab('events');
    const regs = await getEventRegistrations(eventId);
    setRegistrations(regs);
    setLoading(false);
  };

  const loadAllParticipants = async () => {
    setLoading(true);
    setActiveTab('participants');
    setSelectedEventId(null);
    const allRegs = await getAllRegistrations();

    const aggregated: Record<string, StudentAggregated> = {};
    allRegs.forEach(reg => {
      if (!aggregated[reg.userRoll]) {
        aggregated[reg.userRoll] = {
          name: reg.userName,
          rollNumber: reg.userRoll,
          department: reg.department,
          year: reg.year,
          mobile: reg.userMobile,
          eventCount: 0
        };
      }
      aggregated[reg.userRoll].eventCount++;
    });

    setAllParticipants(aggregated);
    setLoading(false);
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = ['Roll Number', 'Name', 'Email', 'Mobile', 'Department', 'Year', 'Registered At', 'Attended'];
    const rows = registrations.map(reg => [
      reg.userRoll,
      reg.userName,
      reg.userEmail,
      reg.userMobile,
      reg.department,
      reg.year,
      new Date(reg.registeredAt.seconds * 1000).toLocaleString(),
      reg.attended ? 'Yes' : 'No',
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

  const exportAllToCSV = () => {
    const participants = Object.values(allParticipants);
    if (participants.length === 0) return;

    const headers = ['Roll Number', 'Name', 'Department', 'Year', 'Mobile', 'Events Registered'];
    const rows = participants.map(p => [
      p.rollNumber,
      p.name,
      p.department,
      p.year,
      p.mobile,
      p.eventCount,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_participants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleAttendance = async (reg: EventRegistration) => {
    // Check if user can manage this event
    if (!canManageEvent(userRole, reg.eventId, userProfile?.assignedEvents)) {
      toast.error('You do not have permission to manage this event');
      return;
    }

    const key = `${reg.userId}_${reg.eventId}`;
    setAttendanceUpdating(prev => new Set(prev).add(key));

    const newVal = !reg.attended;
    const success = await markAttendance(reg.userId, reg.eventId, newVal);
    if (success) {
      setRegistrations(prev =>
        prev.map(r => r.userId === reg.userId && r.eventId === reg.eventId ? { ...r, attended: newVal } : r)
      );
    } else {
      toast.error('Failed to update attendance');
    }

    setAttendanceUpdating(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const markAllPresent = async () => {
    if (!selectedEventId) return;
    if (!canManageEvent(userRole, selectedEventId, userProfile?.assignedEvents)) {
      toast.error('You do not have permission to manage this event');
      return;
    }

    const unattended = registrations.filter(r => !r.attended);
    if (unattended.length === 0) {
      toast.info('All participants are already marked present');
      return;
    }

    const userIds = unattended.map(r => r.userId);
    const success = await markBulkAttendance(selectedEventId, userIds, true);
    if (success) {
      setRegistrations(prev => prev.map(r => ({ ...r, attended: true })));
      toast.success(`Marked ${unattended.length} participants as present`);
    } else {
      toast.error('Failed to mark all as present');
    }
  };

  const handleRemoveRegistration = async (userId: string, eventId: number) => {
    if (!canManageEvent(userRole, eventId, userProfile?.assignedEvents)) {
      toast.error('You do not have permission to remove registrations for this event');
      return;
    }

    const success = await removeRegistration(userId, eventId);
    if (success) {
      setRegistrations(prev => prev.filter(r => !(r.userId === userId && r.eventId === eventId)));
      toast.success('Registration removed successfully');
    } else {
      toast.error('Failed to remove registration');
    }
  };

  const attendedCount = registrations.filter(r => r.attended).length;

  // Filter registrations by search query
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = !searchQuery ||
      reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'all' || reg.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const filteredParticipants = Object.values(allParticipants).filter(student => {
    const matchesSearch = !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'all' || student.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  // Get unique departments from registrations
  const departments = [...new Set(registrations.map(r => r.department))].sort();
  const allDepartments = [...new Set(Object.values(allParticipants).map(p => p.department))].sort();

  // Dashboard stats
  const totalRegistrations = allRegistrations.length;
  const totalAttended = allRegistrations.filter(r => r.attended).length;
  const uniqueParticipants = new Set(allRegistrations.map(r => r.userRoll)).size;
  const eventStats = events.map(event => ({
    ...event,
    registrationCount: allRegistrations.filter(r => r.eventId === event.id).length,
    attendedCount: allRegistrations.filter(r => r.eventId === event.id && r.attended).length,
  }));

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

  if (!userIsCoordinator) {
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

        {/* Header with Role Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-visible"
        >
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text leading-tight">
              Admin Panel
            </h1>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${ROLE_COLORS[userRole]} text-white shadow-lg`}>
              {userRole === 'admin' && <Shield className="w-3 h-3 inline mr-1" />}
              {userRole === 'event_coordinator' && <UserCog className="w-3 h-3 inline mr-1" />}
              {userRole === 'student_coordinator' && <GraduationCap className="w-3 h-3 inline mr-1" />}
              {ROLE_LABELS[userRole]}
            </span>
          </div>
          <p className="text-muted-foreground">
            {userRole === 'admin' && 'Full access to all events and registrations'}
            {userRole === 'event_coordinator' && 'Manage registrations and attendance for your assigned events'}
            {userRole === 'student_coordinator' && 'View registrations and event statistics'}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: BarChart3 },
            { id: 'events' as AdminTab, label: 'By Event', icon: Users },
            { id: 'participants' as AdminTab, label: 'All Participants', icon: GraduationCap },
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'dashboard') {
                  setActiveTab('dashboard');
                  loadDashboardData();
                } else if (tab.id === 'events') {
                  setActiveTab('events');
                  if (!selectedEventId) {
                    setSelectedEventId(events[0].id);
                    loadEventRegistrations(events[0].id);
                  }
                } else {
                  loadAllParticipants();
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white shadow-lg shadow-cosmic-purple/20'
                  : 'glass hover:bg-white/10 text-muted-foreground'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Registrations', value: totalRegistrations, icon: Users, color: 'text-cosmic-purple' },
                { label: 'Unique Participants', value: uniqueParticipants, icon: GraduationCap, color: 'text-cosmic-cyan' },
                { label: 'Total Attended', value: totalAttended, icon: CheckCircle, color: 'text-green-400' },
                { label: 'Attendance Rate', value: totalRegistrations > 0 ? `${Math.round((totalAttended / totalRegistrations) * 100)}%` : '0%', icon: BarChart3, color: 'text-yellow-400' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-strong rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group"
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
                  <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Event Registration Overview */}
            <div className="glass-strong rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cosmic-purple" />
                  Event Overview
                </h2>
                <motion.button
                  onClick={loadDashboardData}
                  className="glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </motion.button>
              </div>

              <div className="space-y-3">
                {eventStats.map((event, index) => {
                  const percentage = event.registrationCount > 0 ? (event.attendedCount / event.registrationCount) * 100 : 0;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => loadEventRegistrations(event.id)}
                      className="glass rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold group-hover:gradient-text transition-all">{event.name}</span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 glass rounded-full">{event.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            <Users className="w-3 h-3 inline mr-1" />
                            {event.registrationCount}
                          </span>
                          <span className="text-green-400">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            {event.attendedCount}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-cosmic-purple to-green-400 rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            {/* Event Cards Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {events.map((event, index) => {
                const isManageable = canManageEvent(userRole, event.id, userProfile?.assignedEvents);
                return (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => loadEventRegistrations(event.id)}
                    className={`glass rounded-2xl p-5 text-left transition-all hover:scale-[1.02] relative overflow-hidden ${selectedEventId === event.id ? 'ring-2 ring-cosmic-purple' : ''
                      } ${!isManageable ? 'opacity-70' : ''}`}
                    whileHover={{ y: -3 }}
                  >
                    {!isManageable && (
                      <span className="absolute top-3 right-3 text-xs glass rounded-full px-2 py-1 text-muted-foreground">
                        View Only
                      </span>
                    )}
                    <h3 className="text-lg font-bold gradient-text mb-1">{event.name}</h3>
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  </motion.button>
                );
              })}
            </div>

            {/* Event Registrations Table */}
            {!loading && selectedEventId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 border border-white/5"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Users className="w-6 h-6 text-cosmic-purple" />
                    <h2 className="text-2xl font-bold">
                      {events.find(e => e.id === selectedEventId)?.name}
                    </h2>
                    <span className="glass rounded-full px-4 py-1 text-sm font-semibold">
                      {registrations.length} registered
                    </span>
                    <span className="glass rounded-full px-4 py-1 text-sm font-semibold text-green-400">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      {attendedCount} attended
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {registrations.length > 0 && canManageEvent(userRole, selectedEventId!, userProfile?.assignedEvents) && (
                      <>
                        <motion.button
                          onClick={markAllPresent}
                          className="btn-cosmic-outline flex items-center gap-2 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckSquare className="w-4 h-4" />
                          Mark All Present
                        </motion.button>
                      </>
                    )}
                    {registrations.length > 0 && (
                      <motion.button
                        onClick={exportToCSV}
                        className="btn-cosmic text-white flex items-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Search & Filter */}
                {registrations.length > 0 && (
                  <div className="flex gap-3 mb-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, roll number..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cosmic-purple/50 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="pl-10 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cosmic-purple/50 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="all" className="bg-background">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept} className="bg-background">{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {filteredRegistrations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    {registrations.length === 0 ? 'No registrations yet for this event' : 'No results match your search'}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Attended</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Roll Number</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Mobile</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Department</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Year</th>
                          {canManageEvent(userRole, selectedEventId!, userProfile?.assignedEvents) && (
                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRegistrations.map((reg, index) => {
                          const key = `${reg.userId}_${reg.eventId}`;
                          const isUpdating = attendanceUpdating.has(key);
                          const isManageable = canManageEvent(userRole, reg.eventId, userProfile?.assignedEvents);
                          return (
                            <motion.tr
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className={`border-b border-white/5 transition-colors ${isManageable ? 'cursor-pointer' : ''
                                } ${reg.attended ? 'bg-green-500/5 hover:bg-green-500/10' : 'hover:bg-white/5'}`}
                              onClick={() => isManageable && toggleAttendance(reg)}
                            >
                              <td className="py-3 px-4">
                                <button
                                  disabled={isUpdating || !isManageable}
                                  className="transition-all disabled:opacity-50"
                                >
                                  {isUpdating ? (
                                    <motion.div
                                      className="w-5 h-5 border-2 border-cosmic-purple border-t-transparent rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                                    />
                                  ) : reg.attended ? (
                                    <CheckSquare className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <Square className="w-5 h-5 text-gray-500" />
                                  )}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-sm">{reg.userRoll}</td>
                              <td className="py-3 px-4 text-sm font-medium">{reg.userName}</td>
                              <td className="py-3 px-4 text-sm">{reg.userMobile}</td>
                              <td className="py-3 px-4 text-sm">{reg.department}</td>
                              <td className="py-3 px-4 text-sm">{reg.year}</td>
                              {isManageable && (
                                <td className="py-3 px-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm(`Are you sure you want to remove ${reg.userName} from this event?`)) {
                                        handleRemoveRegistration(reg.userId, reg.eventId);
                                      }
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                    title="Remove registration"
                                  >
                                    <LogOut className="w-4 h-4" />
                                  </button>
                                </td>
                              )}
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-cosmic-purple" />
                All Participants ({Object.keys(allParticipants).length})
              </h2>
              {Object.keys(allParticipants).length > 0 && (
                <motion.button
                  onClick={exportAllToCSV}
                  className="btn-cosmic text-white flex items-center gap-2 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Export All
                </motion.button>
              )}
            </div>

            {/* Search & Filter */}
            {Object.keys(allParticipants).length > 0 && (
              <div className="flex gap-3 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, roll number..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cosmic-purple/50 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="pl-10 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cosmic-purple/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-background">All Departments</option>
                    {allDepartments.map(dept => (
                      <option key={dept} value={dept} className="bg-background">{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Roll Number</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Year</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Mobile</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground text-center">Events Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((student, index) => (
                    <motion.tr
                      key={student.rollNumber}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">{student.rollNumber}</td>
                      <td className="py-3 px-4 text-sm font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-sm">{student.department}</td>
                      <td className="py-3 px-4 text-sm">{student.year}</td>
                      <td className="py-3 px-4 text-sm">{student.mobile}</td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="bg-cosmic-purple/20 text-cosmic-purple px-2 py-1 rounded-full text-xs font-bold">
                          {student.eventCount}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-cosmic-purple border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
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
