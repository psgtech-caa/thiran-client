import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, Trophy, Phone, User, ArrowRight, CheckCircle, AlertCircle, Building2, GraduationCap } from 'lucide-react';
import { Event } from '@/data/events';
import { useAuth } from '@/contexts/AuthContext';
import { registerForEvent, checkIfRegistered } from '@/lib/registrationService';
import gsap from 'gsap';
import { toast } from 'sonner';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  showRegistration?: boolean;
  onClose: () => void;
}

const rules = [
  'Participants must register before the deadline',
  'Valid college ID is mandatory',
  'Decision of judges will be final',
  'No use of external resources unless specified',
  'Plagiarism will lead to disqualification',
];

const coordinators = [
  { name: 'Arun Kumar', phone: '+91 98765 43210' },
  { name: 'Priya Sharma', phone: '+91 87654 32109' },
];

const DEPARTMENTS = [
  'MCA',
  'Computer Science',
  'Information Technology',
  'Electronics and Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Automobile Engineering',
  'Biomedical Engineering',
  'Industrial Engineering',
  'Production Engineering',
  'Textile Engineering',
];

export default function EventModal({ event, isOpen, showRegistration = false, onClose }: EventModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDetailsInput, setShowDetailsInput] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState<number>(0);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { user, userProfile, signInWithGoogle, updateMobileNumber, completeProfile } = useAuth();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current.querySelectorAll('.modal-item'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', delay: 0.2 }
      );
    }

    if (isOpen && user && event) {
      checkIfRegistered(user.uid, event.id).then(setIsAlreadyRegistered);
    }

    if (isOpen && userProfile?.mobile) {
      setMobileNumber(userProfile.mobile);
    }
    if (isOpen && userProfile?.department) {
      setDepartment(userProfile.department);
    }
    if (isOpen && userProfile?.year) {
      setYearOfStudy(userProfile.year);
    }

    // Show details input when showRegistration is true and user is missing mobile/dept/year
    if (isOpen && showRegistration && user && (!userProfile?.mobile || !userProfile?.department || !userProfile?.year)) {
      setShowDetailsInput(true);
    } else {
      setShowDetailsInput(false);
    }
  }, [isOpen, user, event, userProfile, showRegistration]);

  if (!event) return null;

  const handleRegister = async () => {
    if (!user) {
      toast.info('Please sign in to register');
      await signInWithGoogle();
      return;
    }

    if (!userProfile) {
      toast.error('Profile not loaded. Please try again.');
      return;
    }

    // Validate mobile
    if (!userProfile.mobile && !mobileNumber) {
      setShowDetailsInput(true);
      toast.error('Please enter your mobile number');
      return;
    }
    if (mobileNumber && !/^[6-9]\d{9}$/.test(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    // Validate department
    const finalDept = department || userProfile.department;
    if (!finalDept) {
      setShowDetailsInput(true);
      toast.error('Please select your department');
      return;
    }

    // Validate year
    const finalYear = yearOfStudy || userProfile.year;
    if (!finalYear) {
      setShowDetailsInput(true);
      toast.error('Please select your year of study');
      return;
    }

    // Save profile data if not already saved
    if (mobileNumber && (!userProfile.mobile || !userProfile.department || !userProfile.year)) {
      try {
        await completeProfile({ mobile: mobileNumber, department: finalDept, year: finalYear });
      } catch {
        return;
      }
    }

    setShowConfirmation(true);
  };

  const confirmRegistration = async () => {
    if (!user || !userProfile || !event) return;

    setIsRegistering(true);
    const success = await registerForEvent(user.uid, event, {
      ...userProfile,
      mobile: mobileNumber || userProfile.mobile || '',
      department: department || userProfile.department,
      year: yearOfStudy || userProfile.year,
    });

    if (success) {
      setIsAlreadyRegistered(true);
      setTimeout(() => {
        setIsRegistering(false);
        setShowConfirmation(false);
        onClose();
      }, 1500);
    } else {
      setIsRegistering(false);
      setShowConfirmation(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div 
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden"
            style={{ perspective: 1000 }}
          >
            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-24">
            {/* Subtle border */}
            <div className="absolute -inset-[1px] rounded-3xl bg-white/10 pointer-events-none" />
            
            <div className="relative glass-strong rounded-3xl overflow-hidden">
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 glass rounded-full hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header Image */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${event.image})`,
                    backgroundColor: 'hsl(var(--cosmic-surface))',
                  }}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-cosmic text-white mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {event.category}
                  </motion.span>
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold gradient-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {event.name}
                  </motion.h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Event Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Calendar, label: 'Date', value: event.date },
                    { icon: Clock, label: 'Time', value: event.time },
                    { icon: MapPin, label: 'Venue', value: event.venue },
                    { icon: Trophy, label: 'Prize Pool', value: event.prizePool, valueColor: 'text-yellow-400' },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label}
                      className="modal-item glass rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                      whileHover={{ scale: 1.05, y: -3 }}
                    >
                      <item.icon className="w-5 h-5 text-muted-foreground mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={`font-semibold text-sm ${item.valueColor || ''}`}>{item.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div className="modal-item mb-8">
                  <h3 className="text-lg font-bold mb-3 gradient-text">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Participants will have the opportunity to showcase their skills and compete 
                    for exciting prizes.
                  </p>
                </div>

                {/* Rules */}
                <div className="modal-item mb-8">
                  <h3 className="text-lg font-bold mb-3 gradient-text">Rules & Regulations</h3>
                  <ul className="space-y-2">
                    {rules.map((rule, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3 text-sm text-muted-foreground group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-foreground text-xs flex-shrink-0 group-hover:scale-110 transition-transform">
                          {index + 1}
                        </span>
                        <span className="group-hover:text-foreground transition-colors">{rule}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Coordinators */}
                <div className="modal-item mb-8">
                  <h3 className="text-lg font-bold mb-3 gradient-text">Event Coordinators</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {coordinators.map((coordinator, index) => (
                      <motion.div 
                        key={index} 
                        className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold group-hover:gradient-text transition-all">{coordinator.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {coordinator.phone}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Team Size */}
                <div className="modal-item flex items-center gap-3 mb-8 glass rounded-xl p-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Team Size:</span>
                  <span className="font-semibold">{event.teamSize} {event.isRegistrationOpen !== false && 'members'}</span>
                </div>

                {/* Special Note for Flagship Events */}
                {event.specialNote && (
                  <div className="modal-item mb-8 glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-400 mb-1">Flagship Event</p>
                        <p className="text-sm text-muted-foreground">{event.specialNote}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA - Now removed from scroll area, will be sticky */}
              </div>
            </div>
            </div>

            {/* Sticky Footer with Actions */}
            <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/10 p-4 z-10">
              {event.isRegistrationOpen === false ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">Winners Only Event</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">No direct registration - Win other events to qualify!</p>
                </div>
              ) : isAlreadyRegistered ? (
                <div className="flex items-center justify-center gap-3 text-green-400 py-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">You are registered for this event!</span>
                </div>
              ) : showRegistration ? (
                <>
                  {showDetailsInput && (
                    <div className="mb-3 space-y-2 max-h-48 overflow-y-auto">
                      {/* Mobile */}
                      {!userProfile?.mobile && (
                        <div className="flex items-center gap-3 glass rounded-xl p-3">
                          <Phone className="w-4 h-4 text-cosmic-purple flex-shrink-0" />
                          <input
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="Mobile number (10 digits)"
                            className="flex-1 bg-transparent outline-none text-sm"
                            maxLength={10}
                          />
                        </div>
                      )}

                      {/* Department */}
                      {!userProfile?.department && (
                        <div className="flex items-center gap-3 glass rounded-xl p-3">
                          <Building2 className="w-4 h-4 text-cosmic-pink flex-shrink-0" />
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-background text-gray-500">
                              Select department
                            </option>
                            {DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept} className="bg-background text-white">
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Year of Study */}
                      {!userProfile?.year && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-cosmic-cyan flex-shrink-0 ml-1" />
                          <div className="flex gap-1.5 flex-1">
                            {[1, 2, 3, 4, 5].map((y) => (
                              <button
                                key={y}
                                type="button"
                                onClick={() => setYearOfStudy(y)}
                                className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all border ${
                                  yearOfStudy === y
                                    ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white border-transparent'
                                    : 'glass text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                Y{y}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button 
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="flex-1 btn-cosmic text-white py-3 text-base flex items-center justify-center gap-2 group disabled:opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isRegistering ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          {user ? 'Register Now' : 'Sign In to Register'}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                <motion.button 
                  onClick={onClose} 
                  className="w-full btn-cosmic-outline py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="glass-strong rounded-3xl p-8 max-w-md mx-4">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold">Confirm Registration</h3>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    You are about to register for <span className="font-semibold gradient-text">{event?.name}</span>.
                  </p>
                  <p className="text-sm text-red-400 mb-6">
                    ⚠️ Once registered, you cannot undo this action.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={confirmRegistration}
                      disabled={isRegistering}
                      className="flex-1 btn-cosmic text-white py-3 disabled:opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isRegistering ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        'Confirm'
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 btn-cosmic-outline py-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
