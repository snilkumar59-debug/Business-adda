import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  IndianRupee, 
  UserPlus, 
  Clock, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  PlusCircle, 
  Sparkles,
  Phone,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR, getMonthName } from '../../utils/calculations';

interface AdminDashboardProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { 
    employees, 
    attendance, 
    payments, 
    selectedMonth, 
    setSelectedMonth, 
    selectedDate, 
    setSelectedDate,
    appSettings,
    logout,
    getSalaryForEmployee
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  // 1. Calculations for Today's Attendance
  const activeEmployees = employees.filter(e => e.status === 'active');
  const todayAttendance = attendance.filter(a => a.date === selectedDate);
  
  let presentTodayCount = 0;
  let absentTodayCount = 0;
  let halfDayTodayCount = 0;
  let leaveTodayCount = 0;

  todayAttendance.forEach(a => {
    if (a.status === 'present') presentTodayCount += 1;
    else if (a.status === 'absent') absentTodayCount += 1;
    else if (a.status === 'half_day') halfDayTodayCount += 1;
    else if (a.status === 'leave') leaveTodayCount += 1;
  });

  // Unmarked today
  const markedEmployeeIds = new Set(todayAttendance.map(a => a.employeeId));
  const unmarkedTodayCount = activeEmployees.filter(e => !markedEmployeeIds.has(e.id)).length;

  // 2. Calculations for Selected Month Financials
  let currentMonthTotalSalary = 0;
  let currentMonthTotalPaid = 0;
  let currentMonthTotalPending = 0;
  let currentMonthTotalAdvance = 0;

  activeEmployees.forEach(emp => {
    const salary = getSalaryForEmployee(emp.id, selectedMonth);
    if (salary) {
      currentMonthTotalSalary += salary.basicSalary;
      currentMonthTotalPaid += salary.totalPaid;
      currentMonthTotalPending += salary.pendingAmount;
      currentMonthTotalAdvance += salary.advance;
    }
  });

  // Recent payments
  const recentPayments = [...payments]
    .filter(p => p.month === selectedMonth || p.date.startsWith(selectedMonth))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  // Month navigation options
  const monthOptions = [
    { label: 'Sep 2026', value: '2026-09' },
    { label: 'Aug 2026', value: '2026-08' },
    { label: 'Jul 2026', value: '2026-07' },
    { label: 'Jun 2026', value: '2026-06' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Business Owner / Admin
              </span>
              <span className="text-xs text-blue-200">
                {selectedDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              {appSettings?.businessName || 'Sharma Engineering Works'}
            </h1>
            <p className="text-xs text-blue-200 mt-0.5">
              Welcome, {appSettings?.ownerName || 'Sunil Sharma'} • {activeEmployees.length} Active Staff
            </p>
          </div>

          {/* Month Selector Pill */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
            <Calendar className="w-4 h-4 text-blue-300 ml-2" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Select register month"
              className="bg-transparent text-sm font-bold text-white focus:outline-none pr-3 cursor-pointer"
            >
              {monthOptions.map(m => (
                <option key={m.value} value={m.value} className="bg-slate-900 text-white">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Month Financial Banner */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-sm">
            <div className="text-[11px] text-blue-200 font-medium">Month Salary</div>
            <div className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              {formatINR(currentMonthTotalSalary)}
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-2.5 backdrop-blur-sm">
            <div className="text-[11px] text-emerald-300 font-medium">Total Paid</div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-400 mt-0.5">
              {formatINR(currentMonthTotalPaid)}
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-2.5 backdrop-blur-sm">
            <div className="text-[11px] text-amber-300 font-medium">Pending Due</div>
            <div className="text-base sm:text-lg font-extrabold text-amber-400 mt-0.5">
              {formatINR(currentMonthTotalPending)}
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S ATTENDANCE SUMMARY CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <span>Today's Attendance Status</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Status for {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
          >
            Mark Daily
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-700 font-semibold">Present</div>
              <div className="text-2xl font-black text-emerald-800 mt-0.5">{presentTodayCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              P
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs text-rose-700 font-semibold">Absent</div>
              <div className="text-2xl font-black text-rose-800 mt-0.5">{absentTodayCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              A
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-700 font-semibold">Half Day</div>
              <div className="text-2xl font-black text-amber-800 mt-0.5">{halfDayTodayCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              HD
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs text-indigo-700 font-semibold">Leave / Holiday</div>
              <div className="text-2xl font-black text-indigo-800 mt-0.5">{leaveTodayCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              L
            </div>
          </div>
        </div>

        {unmarkedTodayCount > 0 && (
          <div className="mt-3.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span><strong>{unmarkedTodayCount}</strong> employees not yet marked for today</span>
            </span>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-blue-600 font-bold hover:underline"
            >
              Fill Now →
            </button>
          </div>
        )}
      </div>

      {/* QUICK ACTION BUTTONS (Requirement 4) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigate('add_employee')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Add Staff</span>
          </button>

          <button
            onClick={() => onNavigate('attendance')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-2">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Attendance</span>
          </button>

          <button
            onClick={() => onNavigate('salary')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors mb-2">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Salary Sheet</span>
          </button>

          <button
            onClick={() => onNavigate('payments')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-violet-500 hover:shadow-md transition-all group active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Pay Advances</span>
          </button>

          <button
            onClick={() => onNavigate('employees')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500 hover:shadow-md transition-all group active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">All Staff</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-rose-500 hover:shadow-md transition-all group active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Reports</span>
          </button>
        </div>
      </div>

      {/* RECENT EMPLOYEES & SALARY STATUS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Employee Salary & Status ({getMonthName(selectedMonth)})
            </h3>
            <p className="text-xs text-slate-500">Tap any worker card to view full register</p>
          </div>
          <button
            onClick={() => onNavigate('employees')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All ({employees.length})
          </button>
        </div>

        <div className="space-y-3">
          {activeEmployees.slice(0, 5).map(emp => {
            const sal = getSalaryForEmployee(emp.id, selectedMonth);
            return (
              <div
                key={emp.id}
                onClick={() => onNavigate('employee_profile', { employeeId: emp.id })}
                className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden shrink-0">
                    {emp.photoUrl ? (
                      <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" />
                    ) : (
                      emp.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {emp.name}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {emp.employeeCode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{emp.jobType}</span>
                      <span>•</span>
                      <span>{formatINR(emp.dailySalary)}/day</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    {formatINR(sal?.basicSalary)}
                  </div>
                  <div className={`text-[11px] font-semibold mt-0.5 ${
                    (sal?.pendingAmount || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {(sal?.pendingAmount || 0) > 0 ? `Pending: ${formatINR(sal?.pendingAmount)}` : 'Fully Paid'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT ADVANCES & PAYMENTS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Cash & UPI Transactions</h3>
            <p className="text-xs text-slate-500">Latest advances and salary settlements recorded</p>
          </div>
          <button
            onClick={() => onNavigate('payments')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Record Payment
          </button>
        </div>

        {recentPayments.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No payments recorded yet for {getMonthName(selectedMonth)}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentPayments.map(pay => {
              const emp = employees.find(e => e.id === pay.employeeId);
              return (
                <div key={pay.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      pay.type === 'advance' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {pay.type === 'advance' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {emp?.name || 'Employee'} ({emp?.employeeCode})
                      </div>
                      <div className="text-[11px] text-slate-500 capitalize">
                        {pay.date} • {pay.type.replace('_', ' ')} • {pay.paymentMode || 'cash'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">
                      {formatINR(pay.amount)}
                    </div>
                    {pay.note && (
                      <div className="text-[10px] text-slate-400 max-w-[120px] truncate">
                        {pay.note}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
