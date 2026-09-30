import React, { useState } from 'react';
import { 
  Building2, 
  CalendarCheck, 
  IndianRupee, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  ArrowUpRight, 
  ChevronRight, 
  Phone, 
  Briefcase, 
  Sparkles,
  Calendar,
  Lock,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR, getMonthName } from '../../utils/calculations';

interface EmployeeDashboardProps {
  onNavigateTab: (tab: string) => void;
  activeTab: string;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigateTab, activeTab }) => {
  const { 
    currentUser, 
    employees, 
    attendance, 
    payments, 
    selectedMonth, 
    setSelectedMonth, 
    appSettings, 
    logout,
    getSalaryForEmployee 
  } = useAuth();

  // Find linked employee profile
  const employee = employees.find(e => e.id === currentUser?.employeeId || e.employeeCode === currentUser?.employeeCode);

  const monthOptions = [
    { label: 'September 2026', value: '2026-09' },
    { label: 'August 2026', value: '2026-08' },
    { label: 'July 2026', value: '2026-07' },
  ];

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Employee Record Not Found</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          Your account could not be matched with an active employee file. Please check with your business owner.
        </p>
        <button
          onClick={logout}
          className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold"
        >
          Logout & Try Again
        </button>
      </div>
    );
  }

  // Monthly calculated figures
  const salary = getSalaryForEmployee(employee.id, selectedMonth);

  // Filter attendance for this employee in selected month
  const empAttendance = attendance
    .filter(a => a.employeeId === employee.id && a.date.startsWith(selectedMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Filter payments for this employee in selected month
  const empPayments = payments
    .filter(p => p.employeeId === employee.id && (p.month === selectedMonth || p.date.startsWith(selectedMonth)))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 pb-28">
      {/* Top Employee Profile Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-200 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 overflow-hidden">
              {employee.photoUrl ? (
                <img src={employee.photoUrl} alt={employee.name} className="w-full h-full object-cover" />
              ) : (
                employee.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">
                  Welcome, {employee.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> View Only
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-black text-emerald-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                  {employee.employeeCode}
                </span>
                <span className="text-xs text-emerald-200 font-medium">{employee.jobType}</span>
                <span className="text-xs text-emerald-300/80">• Daily: {formatINR(employee.dailySalary)}</span>
              </div>
            </div>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-emerald-300 ml-2" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Select register month"
              className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none pr-3 cursor-pointer"
            >
              {monthOptions.map(m => (
                <option key={m.value} value={m.value} className="bg-slate-900 text-white">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Month Summary Highlights (Requirement 14) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-2xl p-2.5">
            <span className="text-[11px] text-emerald-200 block font-medium">Present Days</span>
            <span className="text-xl font-black text-white mt-0.5 block">{salary?.presentDays || 0}</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-2.5">
            <span className="text-[11px] text-amber-200 block font-medium">Half Days</span>
            <span className="text-xl font-black text-white mt-0.5 block">{salary?.halfDays || 0}</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-2.5">
            <span className="text-[11px] text-rose-200 block font-medium">Absent Days</span>
            <span className="text-xl font-black text-white mt-0.5 block">{salary?.absentDays || 0}</span>
          </div>

          <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-2.5">
            <span className="text-[11px] text-emerald-300 block font-bold">Total Paid Days</span>
            <span className="text-xl font-black text-emerald-300 mt-0.5 block">{salary?.paidDays || 0}</span>
          </div>
        </div>

        {/* Financial Highlights (Requirement 14: Current Salary, Paid Amount, Pending Amount) */}
        <div className="grid grid-cols-3 gap-3 mt-3 text-center">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">Earned Salary</span>
            <span className="text-base sm:text-lg font-black text-white mt-1 block">
              {formatINR(salary?.basicSalary)}
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-300 block font-medium">Paid To You</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 mt-1 block">
              {formatINR(salary?.totalPaid)}
            </span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3">
            <span className="text-[11px] text-amber-300 block font-medium">Pending Balance</span>
            <span className="text-base sm:text-lg font-black text-amber-400 mt-1 block">
              {formatINR(salary?.pendingAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Read-Only Banner Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Read-Only Mode:</strong> This digital register is maintained by <strong>{appSettings?.businessName}</strong>. If you notice any discrepancy, contact your workshop owner.
          </span>
        </div>
      </div>

      {/* TABS FOR EMPLOYEE */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => onNavigateTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'attendance'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          My Attendance ({empAttendance.length})
        </button>

        <button
          onClick={() => onNavigateTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          My Payments & Advances ({empPayments.length})
        </button>

        <button
          onClick={() => onNavigateTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          My Profile
        </button>
      </div>

      {/* TAB CONTENT: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Attendance for {getMonthName(selectedMonth)}
              </h3>
              <p className="text-xs text-slate-500">Real-time daily status recorded by owner</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {salary?.paidDays || 0} Paid Days
            </span>
          </div>

          {empAttendance.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No attendance recorded yet for {getMonthName(selectedMonth)}.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {empAttendance.map(att => (
                <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900">
                      {new Date(att.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    {att.notes && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">"{att.notes}"</span>
                    )}
                  </div>

                  <span className={`px-3 py-1 rounded-xl font-bold uppercase text-[11px] ${
                    att.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                    att.status === 'half_day' ? 'bg-amber-100 text-amber-800' :
                    att.status === 'leave' ? 'bg-blue-100 text-blue-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {att.status === 'half_day' ? 'Half Day (0.5)' : att.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Money Received ({getMonthName(selectedMonth)})
              </h3>
              <p className="text-xs text-slate-500">Record of cash or online transfers received</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Total: {formatINR(salary?.totalPaid)}
              </span>
            </div>
          </div>

          {empPayments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No money transactions recorded for {getMonthName(selectedMonth)}.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {empPayments.map(p => (
                <div key={p.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      p.type === 'advance' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.type === 'advance' ? <ArrowUpRight className="w-5 h-5" /> : <IndianRupee className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{formatINR(p.amount)}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          p.type === 'advance' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {p.date} • {p.paymentMode || 'cash'} {p.note ? `• "${p.note}"` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Official Employee Profile (Read-Only)</h3>
          
          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{employee.name}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Employee Code</span>
              <span className="font-mono font-bold text-blue-700 text-sm mt-0.5 block">{employee.employeeCode}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Mobile Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">+91 {employee.mobileNumber}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Work / Trade</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{employee.jobType}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Daily Salary</span>
              <span className="font-black text-slate-900 text-base mt-0.5 block">{formatINR(employee.dailySalary)}</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Joining Date</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{employee.joiningDate}</span>
            </div>

            <div className="col-span-2">
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Address</span>
              <span className="font-medium text-slate-800 text-xs mt-0.5 block">{employee.address || 'Registered on file'}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Workshop: <strong>{appSettings?.businessName}</strong></span>
            <span>Contact Owner: <strong>+91 {appSettings?.ownerMobile}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
