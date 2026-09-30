import React, { useState } from 'react';
import { Smartphone, ArrowLeft, KeyRound, Check, AlertCircle, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface EmployeeLoginProps {
  onBack: () => void;
}

export const EmployeeLogin: React.FC<EmployeeLoginProps> = ({ onBack }) => {
  const { loginAsEmployee, employees } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanMob = mobileNumber.replace(/\D/g, '');
    if (cleanMob.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!employeeCode.trim()) {
      setError('Please enter your Employee Code (e.g. EMP-001).');
      return;
    }

    setLoading(true);
    // Simulate instant SMS OTP delivery
    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
      setOtpValue('4589'); // Pre-fill mock OTP for smooth testing
    }, 450);
  };

  // Step 2: Verify OTP and linked credentials
  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpValue.trim().length < 4) {
      setError('Please enter the 4-digit verification code.');
      return;
    }

    setLoading(true);
    const result = await loginAsEmployee(mobileNumber, employeeCode);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Verification failed. Incorrect mobile or employee code.');
    }
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
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
            <Smartphone className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            Employee Login
          </h2>
          <p className="text-xs text-slate-400 mt-1 mb-5 leading-relaxed">
            Enter your mobile number registered with workshop owner, and your unique code (e.g., EMP-001).
          </p>

          {!otpStep ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 text-slate-400 text-sm font-semibold select-none">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876500001"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 focus:border-emerald-500 rounded-xl pl-13 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Employee Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. EMP-001"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-600 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono uppercase"
                />
              </div>

              {/* Quick Demo Helper */}
              {employees.length > 0 && (
                <div className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Fill Demo Staff:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {employees.slice(0, 3).map((emp) => (
                      <button
                        type="button"
                        key={emp.id}
                        onClick={() => {
                          setMobileNumber(emp.mobileNumber);
                          setEmployeeCode(emp.employeeCode);
                        }}
                        className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-200 transition-colors"
                      >
                        {emp.name.split(' ')[0]} ({emp.employeeCode})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Send Verification Code</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyLogin} className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                OTP sent to <strong>+91 {mobileNumber}</strong> for Code <strong>{employeeCode}</strong>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Enter 4-Digit OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="4589"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-500 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-emerald-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                  Verification Code: <span className="font-mono text-emerald-400 font-bold">4589</span> (Auto-generated)
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-1/3 py-3 px-3 rounded-xl border border-slate-600 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Change No.
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Verify & Login</span>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Strict Read-Only Guarantee: Employees can inspect their attendance and salary records at any time, but cannot edit or add records.
            </span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 py-3">
        Business Adda Cloud Security
      </div>
    </div>
  );
};
