import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../lib/authContext';

const MobileInputModal = () => {
  const { completeProfile } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateMobile = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateMobile(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      await completeProfile(mobileNumber);
    } catch (err) {
      setError(err.message || 'Failed to save mobile number');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal content */}
        <motion.div
          className="relative w-full max-w-md bg-[#0f0f18]/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <Phone className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
              Complete Your Profile
            </h2>
            <p className="text-gray-400 text-sm">
              Please provide your mobile number to complete registration
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobileNumber(value);
                    setError('');
                  }}
                  placeholder="9876543210"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-14 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  maxLength={10}
                  autoFocus
                />
              </div>
              {mobileNumber && (
                <p className="mt-2 text-xs text-gray-500">
                  {validateMobile(mobileNumber) ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Valid mobile number
                    </span>
                  ) : (
                    <span className="text-gray-400">Enter 10-digit mobile number</span>
                  )}
                </p>
              )}
            </div>

            {error && (
              <motion.div
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading || !validateMobile(mobileNumber)}
              variant="primary"
              size="lg"
              className="w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>

          <p className="text-gray-600 text-xs mt-4 text-center">
            Your mobile number will be used for event updates and notifications
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileInputModal;
