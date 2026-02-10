import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, GraduationCap, Building2, Award, Info, ChevronRight, Sparkles } from 'lucide-react';

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

interface ProfileSetupModalProps {
  userName: string;
  rollNumber?: string;
  email?: string;
  onSubmit: (data: { mobile: string; department: string; year: number }) => Promise<void>;
}

export default function ProfileSetupModal({ userName, rollNumber, email, onSubmit }: ProfileSetupModalProps) {
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const mobileClean = mobile.replace(/\s/g, '');
  const isMobileValid = /^[6-9]\d{9}$/.test(mobileClean);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!isMobileValid) {
        setError('Enter a valid 10-digit Indian mobile number');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!department) {
        setError('Please select your department');
        return;
      }
      if (!year) {
        setError('Please select your year of study');
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ mobile: mobileClean, department, year });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg bg-background/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        >
          {/* Header */}
          <div className="relative p-6 pb-5 bg-gradient-to-br from-cosmic-purple/20 via-cosmic-pink/10 to-cosmic-cyan/10 border-b border-white/5">
            {/* Decorative dots */}
            <div className="absolute top-3 right-4 flex gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-cosmic-purple shadow-lg shadow-cosmic-purple/40' : 'bg-white/20'}`} />
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-cosmic-pink shadow-lg shadow-cosmic-pink/40' : 'bg-white/20'}`} />
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cosmic-purple to-cosmic-pink flex items-center justify-center shadow-lg shadow-cosmic-purple/30 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-0.5">Welcome to Thiran 2k26!</h2>
                <p className="text-sm text-muted-foreground">
                  Hey <span className="text-cosmic-cyan font-medium">{userName}</span>, let's set up your profile
                </p>
              </div>
            </div>

            {/* User info badge */}
            {(rollNumber || email) && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-white/5 rounded-lg px-3 py-2">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{rollNumber}{rollNumber && email && ' · '}{email}</span>
              </div>
            )}
          </div>

          {/* Certificate Warning */}
          <div className="mx-6 mt-5">
            <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
              <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-300">This info will appear on your certificate</p>
                <p className="text-xs text-amber-400/70 mt-0.5">Please fill in your details correctly — they cannot be changed later.</p>
              </div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="p-6 pt-5">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                    Step 1 of 2 — Contact
                  </p>

                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 text-cosmic-purple" />
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setError('');
                        setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                      }}
                      placeholder="98765 43210"
                      maxLength={10}
                      autoFocus
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-lg tracking-wider placeholder:text-gray-600 focus:outline-none focus:border-cosmic-purple/50 focus:ring-1 focus:ring-cosmic-purple/30 focus:bg-cosmic-purple/5 transition-all"
                    />
                    {isMobileValid && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter your 10-digit mobile number for event coordination
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                    Step 2 of 2 — Academic Info
                  </p>

                  {/* Department */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Building2 className="w-4 h-4 text-cosmic-pink" />
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => { setError(''); setDepartment(e.target.value); }}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cosmic-pink/50 focus:ring-1 focus:ring-cosmic-pink/30 focus:bg-cosmic-pink/5 transition-all appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                    >
                      <option value="" disabled className="bg-background text-gray-500">
                        Choose your department
                      </option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-background text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <GraduationCap className="w-4 h-4 text-cosmic-cyan" />
                      Year of Study
                    </label>
                    <div className="grid grid-cols-5 gap-2.5">
                      {[1, 2, 3, 4, 5].map((y) => (
                        <motion.button
                          key={y}
                          type="button"
                          onClick={() => { setError(''); setYear(y); }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`py-3 rounded-xl font-bold text-base transition-all border relative overflow-hidden ${
                            year === y
                              ? 'bg-gradient-to-br from-cosmic-purple to-cosmic-pink text-white border-transparent shadow-lg shadow-cosmic-purple/30'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {year === y && (
                            <motion.div
                              layoutId="yearHighlight"
                              className="absolute inset-0 bg-gradient-to-br from-cosmic-purple to-cosmic-pink rounded-xl"
                              transition={{ type: 'spring', bounce: 0.2 }}
                            />
                          )}
                          <span className="relative z-10">{y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm text-center mt-4 bg-red-400/10 rounded-lg py-2 px-3"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={() => { setError(''); setStep(step - 1); }}
                  className="px-5 py-3.5 rounded-xl font-medium text-sm text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
              )}

              <motion.button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cosmic-purple/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : step === 2 ? (
                  <>Complete Profile</>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
