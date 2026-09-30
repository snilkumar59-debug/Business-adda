import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Check, 
  Phone, 
  MapPin, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Database,
  CloudCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { appSettings, updateSettings } = useAuth();

  const [businessName, setBusinessName] = useState(appSettings?.businessName || 'Sharma Engineering Works');
  const [ownerName, setOwnerName] = useState(appSettings?.ownerName || 'Sunil Sharma');
  const [ownerMobile, setOwnerMobile] = useState(appSettings?.ownerMobile || '9876543210');
  const [address, setAddress] = useState(appSettings?.address || 'Plot 42, Industrial Area Phase 2, Pune');
  const [currency, setCurrency] = useState(appSettings?.currency || '₹');
  const [defaultLeaveIsPaid, setDefaultLeaveIsPaid] = useState(appSettings?.defaultLeaveIsPaid || false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateSettings({
      businessName,
      ownerName,
      ownerMobile,
      address,
      currency,
      defaultLeaveIsPaid
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Workshop & App Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure business profile and attendance defaults
          </p>
        </div>

        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
          <CloudCheck className="w-3.5 h-3.5" />
          <span>Synced to Cloud</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully and synced to all staff apps!</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Workshop / Business Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Owner / Admin Full Name
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Owner Registered Mobile
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={ownerMobile}
                onChange={(e) => setOwnerMobile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Workshop / Factory Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Attendance & Salary Configuration
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={defaultLeaveIsPaid}
                  onChange={(e) => setDefaultLeaveIsPaid(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Mark Approved Leaves as Paid by Default
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    When unchecked, leaves count as 0 paid days unless manually marked as paid for specific dates.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
