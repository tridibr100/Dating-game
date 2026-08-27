import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, KeyRound, Eye, EyeOff, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { ADMIN_PASSWORD } from '../../config/backend';

interface AdminPasswordGateProps {
  onAuthenticated: () => void;
}

export const AdminPasswordGate: React.FC<AdminPasswordGateProps> = ({
  onAuthenticated,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setError(false);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        try {
          sessionStorage.setItem('date_night_admin_auth', 'true');
        } catch {
          // ignore
        }
        onAuthenticated();
      } else {
        setError(true);
        setIsSubmitting(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#FDFBF7] text-[#1c1c17] relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFD1DC] rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#800020] rounded-full opacity-10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(128,0,32,0.12)] border border-[#800020]/10 text-center relative z-10"
      >
        {/* Crest icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#FFD1DC]/40 border border-[#FFD1DC] flex items-center justify-center mx-auto mb-5 text-[#800020] shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/5 text-[#800020] text-[11px] font-bold tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Restricted Access</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] tracking-tight mb-2">
          DATE NIGHT HQ ❤️
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Creator Investigation &amp; Analytics Dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5"
            >
              Master Passcode
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter creator password..."
                autoFocus
                className={`w-full pl-10 pr-12 py-3 bg-[#FDFBF7] border rounded-2xl text-sm font-medium text-[#1c1c17] outline-none transition-all ${
                  error
                    ? 'border-red-400 ring-2 ring-red-200'
                    : 'border-gray-200 focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs text-red-600 font-medium px-1"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Incorrect password. Please verify the code in configuration.</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#800020] hover:bg-[#660019] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Unlock HQ Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
          <p>Confidential Date Night Operations</p>
          <p className="text-[10px] text-gray-300">
            Default pass: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">CHANGE_THIS_PASSWORD</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
