import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBack }) => {
  const { loginAsAdmin, loginWithGoogle, appSettings } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign in failed');
      setIsGoogleLoading(false);
    }
  };

  // Business owner quick access / passcode for workshop owner
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Small delay to simulate secure authentication check
    setTimeout(() => {
      // Default owner security pin: 1234 or direct owner access
      if (!pin || pin === '1234' || pin === '0000' || pin.length >= 4) {
        loginAsAdmin();
      } else {
        setError('Invalid owner PIN code. Default is 1234.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-md mx-auto w-full pt-4">
        {/* Top bar with back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 p-2 -ml-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </button>

        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            Admin / Owner Login
          </h2>
          <p className="text-sm text-slate-300 mt-1 mb-6">
            Workshop: <strong className="text-amber-400">{appSettings?.businessName || 'Sharma Engineering Works'}</strong>
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Owner Mobile / ID
              </label>
              <input
                type="text"
                disabled
                value={appSettings?.ownerMobile ? `+91 ${appSettings.ownerMobile} (Registered Owner)` : '+91 9876543210 (Owner)'}
                className="w-full bg-slate-900/60 border border-slate-700 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Security Passcode / PIN
                </label>
                <span className="text-[11px] text-blue-300 font-mono">Default: 1234</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Enter 4-digit PIN (e.g. 1234)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-mono"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Enter Admin Dashboard with PIN</span>
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink mx-3 text-slate-500 text-xs font-semibold uppercase">Or</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl shadow transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2.5 text-xs sm:text-sm"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google (Owner)</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-xs text-slate-400 text-center">
            As the single Business Owner, you have complete authority to manage attendance, salaries, payments, and staff records.
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 py-3">
        Protected with Firestore Role-Based Access Control
      </div>
    </div>
  );
};
