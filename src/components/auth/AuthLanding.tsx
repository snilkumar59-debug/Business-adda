import React from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  IndianRupee, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone,
  Eye,
  Lock,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  onSelectAdmin: () => void;
  onSelectEmployee: () => void;
}

export const AuthLanding: React.FC<AuthModalProps> = ({ onSelectAdmin, onSelectEmployee }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Brand Header */}
      <div className="max-w-md mx-auto w-full pt-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-2xl tracking-tighter">
              BA
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Business Adda
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Mobile Register
                </span>
              </h1>
              <p className="text-xs text-blue-200">Digital Attendance & Salary for Indian Workshops</p>
            </div>
          </div>
        </div>

        {/* Feature Badges Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md mb-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-blue-300 mb-3">
            Simple • Fast • 100% Cloud-Synced
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1 Business Owner Admin</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict Read-Only Staff</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Auto Salary Calculation</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Advance & Payment Ledger</span>
            </div>
          </div>
        </div>

        {/* Role Selection Options */}
        <div className="space-y-4">
          {/* Admin / Owner Option */}
          <button
            onClick={onSelectAdmin}
            className="w-full text-left p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-xl shadow-blue-600/25 transition-all duration-200 border border-blue-400/30 active:scale-[0.98] group"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Business Owner / Admin</span>
                    <span className="text-[11px] px-2 py-0.5 bg-amber-400 text-slate-950 font-bold rounded-md uppercase">
                      Full Control
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Manage employees, daily attendance, salary sheets, advances, and cash payments.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 group-hover:text-white transition-all shrink-0 mt-2" />
            </div>
          </button>

          {/* Employee Option */}
          <button
            onClick={onSelectEmployee}
            className="w-full text-left p-5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white font-medium shadow-lg border border-slate-700 hover:border-slate-600 transition-all duration-200 active:scale-[0.98] group"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Employee Login</span>
                    <span className="text-[11px] px-2 py-0.5 bg-slate-700 text-emerald-400 font-semibold rounded-md flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Login with Mobile Number & Unique Employee Code. View your attendance, pay slips, and advances.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all shrink-0 mt-2" />
            </div>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md mx-auto w-full text-center pt-6 pb-2">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Strict Role-Based Security: Employees cannot alter business records</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-2">
          Business Adda v2.4 • Sharma Engineering Works
        </div>
      </div>
    </div>
  );
};
