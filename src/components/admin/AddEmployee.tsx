import React, { useState } from 'react';
import { 
  UserPlus, 
  ArrowLeft, 
  Sparkles, 
  Phone, 
  Briefcase, 
  IndianRupee, 
  Calendar, 
  MapPin, 
  FileText, 
  AlertCircle, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateNextEmployeeCode, getTodayDateStr } from '../../utils/calculations';

interface AddEmployeeProps {
  onBack: () => void;
  onSuccess: (newEmployeeId: string) => void;
}

export const AddEmployee: React.FC<AddEmployeeProps> = ({ onBack, onSuccess }) => {
  const { employees, addEmployee } = useAuth();

  // Auto-generate unique EMP-XXX code
  const autoCode = generateNextEmployeeCode(employees.map(e => e.employeeCode));

  const [employeeCode, setEmployeeCode] = useState(autoCode);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [joiningDate, setJoiningDate] = useState(getTodayDateStr());
  const [jobType, setJobType] = useState('Welder');
  const [dailySalary, setDailySalary] = useState('800');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commonJobTypes = [
    'Welder',
    'CNC Operator',
    'Lathe Operator',
    'Fitter & Turner',
    'Workshop Helper',
    'Mechanic',
    'Electrician',
    'Painter',
    'Quality Inspector',
    'Supervisor'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter employee name.');
      return;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check if code or mobile already registered
    const codeExists = employees.some(e => e.employeeCode.toUpperCase() === employeeCode.trim().toUpperCase());
    if (codeExists) {
      setError(`Employee code "${employeeCode}" already in use. Please use a unique code.`);
      return;
    }

    const mobileExists = employees.some(e => e.mobileNumber.replace(/\D/g, '').slice(-10) === cleanMobile.slice(-10));
    if (mobileExists) {
      setError(`Mobile number "${cleanMobile}" is already linked to another employee.`);
      return;
    }

    const parsedSalary = parseFloat(dailySalary);
    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      setError('Please enter a valid daily salary rate (e.g. 800).');
      return;
    }

    try {
      setLoading(true);
      const newId = await addEmployee({
        employeeCode: employeeCode.trim().toUpperCase(),
        name: name.trim(),
        mobileNumber: cleanMobile,
        joiningDate,
        jobType: jobType.trim(),
        dailySalary: parsedSalary,
        address: address.trim(),
        notes: notes.trim(),
        photoUrl: photoUrl.trim() || undefined,
        status
      });
      setLoading(false);
      onSuccess(newId);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Failed to add employee. Please check connection.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <span>Add New Employee</span>
          </h1>
          <p className="text-xs text-slate-500">
            Generate unique code and register employee details into Business Adda
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Code & Mobile Linking Highlight Card */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Unique Code & Mobile Linking for Employee Login</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            The worker will login using this <strong>Mobile Number</strong> and <strong>Employee Code</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Employee Code (Unique)
              </label>
              <input
                type="text"
                required
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
                placeholder="e.g. EMP-007"
                className="w-full bg-white border border-blue-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-blue-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number (10 digits)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-white border border-blue-300 focus:border-blue-600 rounded-xl pl-11 pr-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Employee Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job / Work Type *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Welder, Fitter, Helper"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {commonJobTypes.slice(0, 5).map(job => (
                  <button
                    key={job}
                    type="button"
                    onClick={() => setJobType(job)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    {job}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Daily Salary Rate (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min={100}
                  step={50}
                  placeholder="800"
                  value={dailySalary}
                  onChange={(e) => setDailySalary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Used to calculate daily attendance salary</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Employment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none"
              >
                <option value="active">Active (Currently Working)</option>
                <option value="inactive">Inactive / Resigned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Near Hanuman Temple, Sector 3, Pune"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Owner Notes / Skills (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Reliable welder, brings own safety boots, night shift ok."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save & Create Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
