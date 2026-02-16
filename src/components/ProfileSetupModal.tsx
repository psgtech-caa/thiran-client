import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Award, Info, Sparkles } from 'lucide-react';

interface ProfileSetupModalProps {
  userName: string;
  rollNumber?: string;
  email?: string;
  detectedDepartment?: string;
  detectedYear?: number;
  onSubmit: (data: { mobile: string; department: string; year: number }) => Promise<void>;
}

export default function ProfileSetupModal({ userName, rollNumber, email, detectedDepartment, detectedYear, onSubmit }: ProfileSetupModalProps) {
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const mobileClean = mobile.replace(/\s/g, '');
  const isMobileValid = /^[6-9]\d{9}$/.test(mobileClean);

  const handleSubmit = async () => {
    setError('');
    if (!isMobileValid) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        mobile: mobileClean,
        department: detectedDepartment || 'MCA',
        year: detectedYear || 1,
      });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cosmic-purple to-cosmic-pink flex items-center justify-center shadow-lg shadow-cosmic-purple/30 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-0.5">Welcome to Thiran 2k26!</h2>
                <p className="text-sm text-muted-foreground">
                  Hey <span className="text-cosmic-cyan font-medium">{userName}</span>, just one quick step
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

            {/* Auto-detected info */}
            {(detectedDepartment || detectedYear) && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-400/80 bg-green-400/5 rounded-lg px-3 py-2">
                <span>✓ Auto-detected: {detectedDepartment}{detectedDepartment && detectedYear ? `, Year ${detectedYear}` : detectedYear ? `Year ${detectedYear}` : ''}</span>
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

          {/* Form - Just Mobile */}
          <div className="p-6 pt-5">
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
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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

            {/* Submit */}
            <div className="mt-6">
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cosmic-purple/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  'Complete Profile'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
