import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, Download, Users, CheckSquare, Square, CheckCircle, LogOut, Shield, UserCog, GraduationCap, BarChart3, Search, Filter, RefreshCw, UserPlus, Phone, Hash, BookOpen, Edit, Trash2, X, Save, Table, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getEventRegistrations, markAttendance, markBulkAttendance, EventRegistration, removeRegistration, getAllRegistrations, adminAddRegistration, deleteUserByRoll, updateUserDetails } from '@/lib/registrationService';
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
  email: string;
  eventCount: number;
}

type AdminTab = 'dashboard' | 'events' | 'participants' | 'adduser';

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

  // Add User form state — single student, multi-event checkboxes
  const [addUserForm, setAddUserForm] = useState({
    rollNumber: '', name: '', mobile: '', department: '', year: 1, email: '',
  });
  const [selectedEventIds, setSelectedEventIds] = useState<Set<number>>(new Set());
  const [addingUser, setAddingUser] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Edit User State
  const [editingUser, setEditingUser] = useState<StudentAggregated | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    name: '', email: '', mobile: '', department: '', year: 1
  });
  const [updatingUser, setUpdatingUser] = useState(false);

  const handleRollChange = (val: string) => {
    val = val.toUpperCase();
    const updates: any = { rollNumber: val };
    const match = val.match(/^(\d{2})([A-Z]+)(\d+)$/);
    if (match) {
      const yearPrefix = parseInt(match[1]);
      const currentYear = new Date().getFullYear() % 100;
      updates.department = match[2];
      updates.year = currentYear - yearPrefix;
      updates.email = `${val.toLowerCase()}@psgtech.ac.in`;
    }
    setAddUserForm(prev => ({ ...prev, ...updates }));
  };

  const toggleEvent = (eventId: number) => {
    setSelectedEventIds(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

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
          email: reg.userEmail,
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

  const handleDeleteUser = async (student: StudentAggregated) => {
    if (!userIsAdmin) {
      toast.error('Only admins can delete users');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${student.name} (${student.rollNumber})? This will remove ALL their event registrations and cannot be undone.`)) {
      return;
    }

    const success = await deleteUserByRoll(student.rollNumber);
    if (success) {
      toast.success(`User ${student.rollNumber} deleted successfully`);
      const newParticipants = { ...allParticipants };
      delete newParticipants[student.rollNumber];
      setAllParticipants(newParticipants);
    } else {
      toast.error('Failed to delete user');
    }
  };

  const openEditModal = (student: StudentAggregated) => {
    setEditingUser(student);
    setEditUserForm({
      name: student.name,
      email: `${student.rollNumber.toLowerCase()}@psgtech.ac.in`, // default or fetch if available in aggregated? 
      // Note: aggregated doesn't store email currently, let's assume standard format or we might need to fetch one registration to get it. 
      // Actually StudentAggregated doesn't have email in the interface def but the registrations do. 
      // Let's add email to StudentAggregated in loadAllParticipants first.
      mobile: student.mobile,
      department: student.department,
      year: student.year
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setUpdatingUser(true);
    const success = await updateUserDetails(editingUser.rollNumber, {
      name: editUserForm.name,
      email: editUserForm.email,
      mobile: editUserForm.mobile,
      department: editUserForm.department,
      year: editUserForm.year
    });

    if (success) {
      toast.success('User details updated successfully');
      // Update local state
      setAllParticipants(prev => ({
        ...prev,
        [editingUser.rollNumber]: {
          ...prev[editingUser.rollNumber],
          name: editUserForm.name,
          mobile: editUserForm.mobile,
          department: editUserForm.department,
          year: editUserForm.year
        }
      }));
      setShowEditModal(false);
      setEditingUser(null);
    } else {
      toast.error('Failed to update user details');
    }
    setUpdatingUser(false);
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
  const dashboardDepartments = [...new Set(allRegistrations.map(r => r.department))].sort();

  // Dashboard stats — filtered by department
  const dashboardFiltered = departmentFilter === 'all'
    ? allRegistrations
    : allRegistrations.filter(r => r.department === departmentFilter);
  const totalRegistrations = dashboardFiltered.length;
  const totalAttended = dashboardFiltered.filter(r => r.attended).length;
  const uniqueParticipants = new Set(dashboardFiltered.map(r => r.userRoll)).size;
  const eventStats = events.map(event => ({
    ...event,
    registrationCount: dashboardFiltered.filter(r => r.eventId === event.id).length,
    attendedCount: dashboardFiltered.filter(r => r.eventId === event.id && r.attended).length,
  }));

  // Department-wise breakdown
  const departmentBreakdown = dashboardDepartments.map(dept => ({
    name: dept,
    count: allRegistrations.filter(r => r.department === dept).length,
    attended: allRegistrations.filter(r => r.department === dept && r.attended).length,
    unique: new Set(allRegistrations.filter(r => r.department === dept).map(r => r.userRoll)).size,
  })).sort((a, b) => b.count - a.count);

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
            ...(userIsAdmin ? [{ id: 'adduser' as AdminTab, label: 'Add User', icon: UserPlus }] : []),
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => {
                setDepartmentFilter('all');
                setSearchQuery('');
                if (tab.id === 'dashboard') {
                  setActiveTab('dashboard');
                  loadDashboardData();
                } else if (tab.id === 'events') {
                  setActiveTab('events');
                  if (!selectedEventId) {
                    setSelectedEventId(events[0].id);
                    loadEventRegistrations(events[0].id);
                  }
                } else if (tab.id === 'participants') {
                  loadAllParticipants();
                } else if (tab.id === 'adduser') {
                  setActiveTab('adduser');
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
            {/* Department Filter Chips */}
            {dashboardDepartments.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-muted-foreground mr-1" />
                <motion.button
                  onClick={() => setDepartmentFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${departmentFilter === 'all'
                    ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white shadow-lg shadow-cosmic-purple/20'
                    : 'glass hover:bg-white/10 text-muted-foreground'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All ({allRegistrations.length})
                </motion.button>
                {dashboardDepartments.map(dept => {
                  const count = allRegistrations.filter(r => r.department === dept).length;
                  return (
                    <motion.button
                      key={dept}
                      onClick={() => setDepartmentFilter(departmentFilter === dept ? 'all' : dept)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${departmentFilter === dept
                        ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white shadow-lg shadow-cosmic-purple/20'
                        : 'glass hover:bg-white/10 text-muted-foreground'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {dept} ({count})
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(() => {
                // Calculate today's registrations
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayTimestamp = today.getTime() / 1000;
                const todayRegistrations = dashboardFiltered.filter(r => {
                  const regTime = r.registeredAt?.seconds || 0;
                  return regTime >= todayTimestamp;
                }).length;
                const todayUniqueParticipants = new Set(
                  dashboardFiltered.filter(r => {
                    const regTime = r.registeredAt?.seconds || 0;
                    return regTime >= todayTimestamp;
                  }).map(r => r.userRoll)
                ).size;

                return [
                  { label: 'Total Registrations', value: totalRegistrations, icon: Users, color: 'text-cosmic-purple' },
                  { label: 'Unique Participants', value: uniqueParticipants, icon: GraduationCap, color: 'text-cosmic-cyan' },
                  { label: 'Total Attended', value: totalAttended, icon: CheckCircle, color: 'text-green-400' },
                  { label: 'Attendance Rate', value: totalRegistrations > 0 ? `${Math.round((totalAttended / totalRegistrations) * 100)}%` : '0%', icon: BarChart3, color: 'text-yellow-400' },
                  { label: "Today's Registrations", value: todayRegistrations, icon: UserPlus, color: 'text-orange-400' },
                  { label: "Today's Unique Students", value: todayUniqueParticipants, icon: GraduationCap, color: 'text-pink-400' },
                ];
              })().map((stat, index) => (
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

            {/* Department Breakdown */}
            {departmentFilter === 'all' && departmentBreakdown.length > 1 && (
              <div className="glass-strong rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                  <GraduationCap className="w-5 h-5 text-cosmic-cyan" />
                  Department Breakdown
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {departmentBreakdown.map((dept, index) => {
                    const maxCount = departmentBreakdown[0]?.count || 1;
                    const barWidth = (dept.count / maxCount) * 100;
                    return (
                      <motion.div
                        key={dept.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setDepartmentFilter(dept.name)}
                        className="glass rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm group-hover:text-cosmic-cyan transition-colors">{dept.name}</span>
                          <span className="text-xs text-muted-foreground">{dept.unique} students</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold">{dept.count}</span>
                          <span className="text-xs text-muted-foreground">registrations</span>
                          <span className="text-xs text-green-400 ml-auto">
                            <CheckCircle className="w-3 h-3 inline mr-0.5" />
                            {dept.attended}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            className="h-full bg-gradient-to-r from-cosmic-cyan to-cosmic-purple rounded-full"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Event Registration Overview */}
            <div className="glass-strong rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cosmic-purple" />
                  Event Overview
                  {departmentFilter !== 'all' && (
                    <span className="text-xs font-normal text-cosmic-cyan ml-2">({departmentFilter})</span>
                  )}
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
            className="space-y-6"
          >
            {/* Header & Actions */}
            <div className="glass-strong rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                    <Users className="w-6 h-6 text-cosmic-purple" />
                    All Participants
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {Object.keys(allParticipants).length} unique students registered across all events
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex bg-white/5 rounded-lg p-1 gap-1 mr-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-cosmic-purple text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-cosmic-purple text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                      title="Spreadsheet View"
                    >
                      <Table className="w-4 h-4" />
                    </button>
                  </div>
                  <motion.button
                    onClick={loadAllParticipants}
                    className="glass rounded-lg px-3 py-2 text-xs flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </motion.button>
                  {Object.keys(allParticipants).length > 0 && (
                    <motion.button
                      onClick={exportAllToCSV}
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

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Total Students', value: Object.keys(allParticipants).length, color: 'text-cosmic-purple' },
                  { label: 'Multi-Event', value: Object.values(allParticipants).filter(p => p.eventCount > 1).length, color: 'text-cosmic-cyan' },
                  { label: 'Single Event', value: Object.values(allParticipants).filter(p => p.eventCount === 1).length, color: 'text-yellow-400' },
                ].map(s => (
                  <div key={s.label} className="glass rounded-xl p-3 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Search & Filter */}
              {Object.keys(allParticipants).length > 0 && (
                <div className="flex gap-3 flex-wrap">
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
            </div>

            {/* Participant Cards Grid or Table */}
            {filteredParticipants.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 glass-strong rounded-2xl">
                No participants found
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParticipants.map((student, index) => (
                  <motion.div
                    key={student.rollNumber}
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                    className="glass-strong rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all group hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cosmic-purple/30 to-cosmic-pink/30 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span className="text-sm font-bold text-cosmic-cyan">
                          {student.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate group-hover:text-cosmic-cyan transition-colors">{student.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{student.rollNumber}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-cosmic-purple/15 text-cosmic-purple text-[10px] font-bold border border-cosmic-purple/20">
                            {student.department}
                          </span>
                          <span className="text-[10px] text-muted-foreground">Year {student.year}</span>
                        </div>
                      </div>

                      {/* Event Count Badge */}
                      <div className={`px-2.5 py-1 rounded-lg text-center flex-shrink-0 ${student.eventCount >= 3 ? 'bg-green-500/15 border border-green-500/20' :
                        student.eventCount >= 2 ? 'bg-cosmic-cyan/15 border border-cosmic-cyan/20' :
                          'bg-white/5 border border-white/10'
                        }`}>
                        <p className={`text-lg font-bold ${student.eventCount >= 3 ? 'text-green-400' :
                          student.eventCount >= 2 ? 'text-cosmic-cyan' :
                            'text-white'
                          }`}>{student.eventCount}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">events</p>
                      </div>
                    </div>

                    {/* Mobile & Actions */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      {student.mobile ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span className="font-mono">{student.mobile}</span>
                        </div>
                      ) : <div></div>}

                      {userIsAdmin && (
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={(e) => { e.stopPropagation(); openEditModal(student); }}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-cosmic-cyan transition-colors"
                            title="Edit User"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(student); }}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                            title="Delete User"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto glass-strong rounded-2xl border border-white/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Roll Number</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Department</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Mobile</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Events</th>
                      {userIsAdmin && <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredParticipants.map((student, index) => (
                      <motion.tr
                        key={student.rollNumber}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.01 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-4 text-sm font-mono text-cosmic-cyan">{student.rollNumber}</td>
                        <td className="p-4 text-sm font-medium text-white">{student.name}</td>
                        <td className="p-4 text-sm text-gray-300">{student.department}</td>
                        <td className="p-4 text-sm text-gray-300">{student.year}</td>
                        <td className="p-4 text-sm font-mono text-gray-400">{student.mobile || '-'}</td>
                        <td className="p-4 text-sm text-gray-400 lowercase">{student.email || '-'}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${student.eventCount >= 3 ? 'bg-green-500/20 text-green-400' :
                            student.eventCount >= 1 ? 'bg-cosmic-purple/20 text-cosmic-purple' : 'bg-white/5 text-gray-500'
                            }`}>
                            {student.eventCount}
                          </span>
                        </td>
                        {userIsAdmin && (
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(student)}
                                className="p-1.5 hover:bg-white/10 rounded text-cosmic-cyan transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(student)}
                                className="p-1.5 hover:bg-white/10 rounded text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Results count */}
            {searchQuery || departmentFilter !== 'all' ? (
              <p className="text-xs text-muted-foreground text-center">
                Showing {filteredParticipants.length} of {Object.keys(allParticipants).length} participants
              </p>
            ) : null}
          </motion.div>
        )}

        {/* Add User Tab */}
        {activeTab === 'adduser' && userIsAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 border border-white/5 max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-6 h-6 text-cosmic-purple" />
              <h2 className="text-2xl font-bold">Add User to Events</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Register a student to one or more events at once. Roll number auto-fills department, year &amp; email.
            </p>

            <div className="space-y-5">
              {/* Roll Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Hash className="w-4 h-4 text-cosmic-purple" />
                  Roll Number
                </label>
                <input
                  type="text"
                  value={addUserForm.rollNumber}
                  onChange={(e) => handleRollChange(e.target.value)}
                  placeholder="e.g. 25MCA312"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/30 transition-all"
                />
                {addUserForm.department && (
                  <p className="text-xs text-green-400/80 mt-1.5">✓ Dept: {addUserForm.department} · Year: {addUserForm.year} · Email: {addUserForm.email}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 text-cosmic-purple" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Student's full name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/30 transition-all"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4 text-cosmic-purple" />
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                  <input
                    type="tel"
                    value={addUserForm.mobile}
                    onChange={(e) => setAddUserForm(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/30 transition-all"
                  />
                </div>
              </div>

              {/* Event Selection (Checkboxes) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <BookOpen className="w-4 h-4 text-cosmic-purple" />
                  Select Events
                  {selectedEventIds.size > 0 && (
                    <span className="text-xs text-cosmic-cyan ml-1">({selectedEventIds.size} selected)</span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {events.map(event => (
                    <label
                      key={event.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedEventIds.has(event.id)
                        ? 'bg-cosmic-purple/15 border-cosmic-purple/40'
                        : 'bg-white/3 border-white/5 hover:border-white/15 hover:bg-white/5'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEventIds.has(event.id)}
                        onChange={() => toggleEvent(event.id)}
                        className="w-4 h-4 accent-cosmic-purple rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{event.name}</p>
                        <p className="text-[10px] text-muted-foreground">{event.category}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                onClick={async () => {
                  if (!addUserForm.rollNumber.match(/^\d{2}[A-Z]+\d+$/)) {
                    toast.error('Enter a valid roll number (e.g. 25MCA312)');
                    return;
                  }
                  if (!addUserForm.name.trim()) {
                    toast.error('Enter the student\'s name');
                    return;
                  }
                  if (!/^[6-9]\d{9}$/.test(addUserForm.mobile)) {
                    toast.error('Enter a valid 10-digit mobile number');
                    return;
                  }
                  if (selectedEventIds.size === 0) {
                    toast.error('Select at least one event');
                    return;
                  }

                  setAddingUser(true);
                  let successCount = 0;
                  let failCount = 0;
                  for (const eventId of Array.from(selectedEventIds)) {
                    const selectedEvent = events.find(e => e.id === eventId);
                    if (!selectedEvent) continue;
                    const success = await adminAddRegistration(selectedEvent, {
                      rollNumber: addUserForm.rollNumber,
                      name: addUserForm.name.trim(),
                      email: addUserForm.email,
                      mobile: addUserForm.mobile,
                      department: addUserForm.department,
                      year: addUserForm.year,
                    });
                    if (success) successCount++;
                    else failCount++;
                  }
                  if (successCount > 0) {
                    toast.success(`Added to ${successCount} event(s)${failCount > 0 ? `, ${failCount} failed/duplicate` : ''}`);
                    setAddUserForm({ rollNumber: '', name: '', mobile: '', department: '', year: 1, email: '' });
                    setSelectedEventIds(new Set());
                  }
                  setAddingUser(false);
                }}
                disabled={addingUser}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cosmic-purple/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {addingUser ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Add User to {selectedEventIds.size > 0 ? `${selectedEventIds.size} Event${selectedEventIds.size > 1 ? 's' : ''}` : 'Events'}
                  </>
                )}
              </motion.button>
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
            className="fixed bottom-8 right-8 z-50 p-4 glass-strong rounded-full hover:bg-white/20 transition-colors group text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-cosmic-purple" />
                  Edit User Details
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Roll Number</label>
                    <input
                      disabled
                      value={editingUser.rollNumber}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Department</label>
                    <input
                      value={editUserForm.department}
                      onChange={e => setEditUserForm(prev => ({ ...prev, department: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-cosmic-purple/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Full Name</label>
                  <input
                    value={editUserForm.name}
                    onChange={e => setEditUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-cosmic-purple/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email Address</label>
                  <input
                    value={editUserForm.email}
                    onChange={e => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-cosmic-purple/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Mobile Number</label>
                    <input
                      value={editUserForm.mobile}
                      onChange={e => setEditUserForm(prev => ({ ...prev, mobile: e.target.value }))}
                      maxLength={10}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-cosmic-purple/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Year</label>
                    <select
                      value={editUserForm.year}
                      onChange={e => setEditUserForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-cosmic-purple/50 focus:outline-none [&>option]:bg-gray-900"
                    >
                      {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={updatingUser}
                  className="px-4 py-2 text-sm font-bold bg-cosmic-purple hover:bg-cosmic-purple/80 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {updatingUser ? 'Saving...' : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

