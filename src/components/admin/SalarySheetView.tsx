import React, { useState } from 'react';
import { 
  IndianRupee, 
  Calendar, 
  Download, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  CreditCard, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR, getMonthName } from '../../utils/calculations';

interface SalarySheetViewProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const SalarySheetView: React.FC<SalarySheetViewProps> = ({ onNavigate }) => {
  const { 
    employees, 
    selectedMonth, 
    setSelectedMonth, 
    getSalaryForEmployee,
    payments 
  } = useAuth();

  const [filterPendingOnly, setFilterPendingOnly] = useState(false);

  const activeEmployees = employees.filter(e => e.status === 'active');

  // Month navigation list
  const monthList = [
    { label: 'September 2026', value: '2026-09' },
    { label: 'August 2026', value: '2026-08' },
    { label: 'July 2026', value: '2026-07' },
  ];

  // Totals for the whole workshop this month
  let grandBasic = 0;
  let grandAdvance = 0;
  let grandPaid = 0;
  let grandPending = 0;
  let grandPaidDays = 0;

  const salaryRows = activeEmployees.map(emp => {
    const sal = getSalaryForEmployee(emp.id, selectedMonth);
    if (sal) {
      grandBasic += sal.basicSalary;
      grandAdvance += sal.advance;
      grandPaid += sal.totalPaid;
      grandPending += sal.pendingAmount;
      grandPaidDays += sal.paidDays;
    }
    return {
      employee: emp,
      salary: sal
    };
  });

  const displayedRows = filterPendingOnly 
    ? salaryRows.filter(r => (r.salary?.pendingAmount || 0) > 0)
    : salaryRows;

  return (
    <div className="space-y-6 pb-28">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-emerald-600" />
            <span>Monthly Salary Sheet</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-calculated: (Present + 0.5 × HalfDay) × Daily Rate − Total Advances Paid
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <Calendar className="w-4 h-4 text-slate-500 ml-1.5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Select salary month"
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none pr-2 cursor-pointer"
            >
              {monthList.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Workshop Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-200/80 rounded-3xl p-4">
          <span className="text-xs text-blue-700 font-semibold block">Total Basic Earned</span>
          <span className="text-xl sm:text-2xl font-black text-blue-900 mt-1 block">
            {formatINR(grandBasic)}
          </span>
          <span className="text-[11px] text-blue-600 mt-1 block">
            For {activeEmployees.length} workers ({grandPaidDays} paid days)
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-4">
          <span className="text-xs text-amber-700 font-semibold block">Advances Given</span>
          <span className="text-xl sm:text-2xl font-black text-amber-900 mt-1 block">
            {formatINR(grandAdvance)}
          </span>
          <span className="text-[11px] text-amber-600 mt-1 block">
            Pre-payments during month
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-4">
          <span className="text-xs text-emerald-700 font-semibold block">Total Money Paid</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-900 mt-1 block">
            {formatINR(grandPaid)}
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            Advances + Settlements
          </span>
        </div>

        <div className="bg-rose-50 border border-rose-200/80 rounded-3xl p-4">
          <span className="text-xs text-rose-700 font-semibold block">Net Pending Balance</span>
          <span className="text-xl sm:text-2xl font-black text-rose-900 mt-1 block">
            {formatINR(grandPending)}
          </span>
          <span className="text-[11px] text-rose-600 mt-1 block">
            Workshop liability to clear
          </span>
        </div>
      </div>

      {/* Filter and Quick Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterPendingOnly(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !filterPendingOnly ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            All Workers ({activeEmployees.length})
          </button>
          <button
            onClick={() => setFilterPendingOnly(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPendingOnly ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Pending Only ({salaryRows.filter(r => (r.salary?.pendingAmount || 0) > 0).length})
          </button>
        </div>

        <button
          onClick={() => onNavigate('payments')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Pay Advance / Salary</span>
        </button>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-3">Daily Rate</th>
                <th className="py-3.5 px-3">Present</th>
                <th className="py-3.5 px-3">Half Day</th>
                <th className="py-3.5 px-3">Paid Days</th>
                <th className="py-3.5 px-3">Basic Salary</th>
                <th className="py-3.5 px-3">Advance</th>
                <th className="py-3.5 px-3">Total Paid</th>
                <th className="py-3.5 px-4 text-right">Pending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {displayedRows.map(({ employee, salary }) => (
                <tr 
                  key={employee.id}
                  onClick={() => onNavigate('employee_profile', { employeeId: employee.id })}
                  className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{employee.name}</div>
                    <div className="font-mono text-[10px] text-blue-700 font-bold">{employee.employeeCode}</div>
                  </td>
                  <td className="py-3.5 px-3">{formatINR(employee.dailySalary)}</td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">{salary?.presentDays || 0}</td>
                  <td className="py-3.5 px-3 font-semibold text-amber-700">{salary?.halfDays || 0}</td>
                  <td className="py-3.5 px-3 font-bold text-blue-700 bg-blue-50/50">{salary?.paidDays || 0}</td>
                  <td className="py-3.5 px-3 font-bold">{formatINR(salary?.basicSalary)}</td>
                  <td className="py-3.5 px-3 text-amber-700 font-semibold">{formatINR(salary?.advance)}</td>
                  <td className="py-3.5 px-3 text-emerald-700 font-bold">{formatINR(salary?.totalPaid)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`font-black px-2 py-1 rounded-lg ${
                      (salary?.pendingAmount || 0) > 0 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {formatINR(salary?.pendingAmount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Requirement 8) */}
      <div className="sm:hidden space-y-3">
        {displayedRows.map(({ employee, salary }) => (
          <div
            key={employee.id}
            onClick={() => onNavigate('employee_profile', { employeeId: employee.id })}
            className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{employee.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    {employee.employeeCode}
                  </span>
                  <span className="text-[11px] text-slate-500">{employee.jobType}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pending</span>
                <span className={`text-sm font-black px-2 py-0.5 rounded-lg block ${
                  (salary?.pendingAmount || 0) > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
                }`}>
                  {formatINR(salary?.pendingAmount)}
                </span>
              </div>
            </div>

            {/* Attendance & Calculation breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2.5 bg-slate-50 rounded-2xl my-2.5 border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Paid Days</span>
                <span className="font-bold text-blue-800 text-sm">{salary?.paidDays}</span>
                <span className="text-[9px] text-slate-400 block">(P:{salary?.presentDays}, HD:{salary?.halfDays})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Basic Salary</span>
                <span className="font-bold text-slate-900 text-sm">{formatINR(salary?.basicSalary)}</span>
                <span className="text-[9px] text-slate-400 block">@{formatINR(employee.dailySalary)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Total Paid</span>
                <span className="font-bold text-emerald-700 text-sm">{formatINR(salary?.totalPaid)}</span>
                <span className="text-[9px] text-slate-400 block">(Adv: {formatINR(salary?.advance)})</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-blue-600 font-bold pt-1">
              <span>View Full History & Modify</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
