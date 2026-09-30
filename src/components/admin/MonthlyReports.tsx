import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Download, 
  IndianRupee, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR, getMonthName } from '../../utils/calculations';

interface MonthlyReportsProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const MonthlyReports: React.FC<MonthlyReportsProps> = ({ onNavigate }) => {
  const { 
    employees, 
    selectedMonth, 
    setSelectedMonth, 
    appSettings, 
    getSalaryForEmployee,
    attendance,
    payments 
  } = useAuth();

  const activeEmployees = employees.filter(e => e.status === 'active');

  const monthList = [
    { label: 'September 2026', value: '2026-09' },
    { label: 'August 2026', value: '2026-08' },
    { label: 'July 2026', value: '2026-07' },
  ];

  let totalWorkingDays = 0;
  let totalSalary = 0;
  let totalPaid = 0;
  let totalAdvance = 0;
  let totalPending = 0;
  let totalPresentDays = 0;
  let totalHalfDays = 0;

  const employeeData = activeEmployees.map(emp => {
    const sal = getSalaryForEmployee(emp.id, selectedMonth);
    if (sal) {
      totalSalary += sal.basicSalary;
      totalAdvance += sal.advance;
      totalPaid += sal.totalPaid;
      totalPending += sal.pendingAmount;
      totalPresentDays += sal.presentDays;
      totalHalfDays += sal.halfDays;
    }
    return {
      emp,
      sal
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-600" />
            <span>Monthly Business Report</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready monthly statement for {appSettings?.businessName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Select report month"
            className="bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
          >
            {monthList.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Business Statement Card (Requirement 16) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700">
        <div className="border-b border-white/10 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              MONTHLY BUSINESS STATEMENT
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              {getMonthName(selectedMonth)}
            </h2>
            <p className="text-xs text-slate-300">
              {appSettings?.businessName || 'Sharma Engineering Works'} • Owner: {appSettings?.ownerName || 'Sunil Sharma'}
            </p>
          </div>
          <div className="text-right sm:self-end">
            <span className="text-[10px] text-slate-400 block font-mono">Date Generated: 2026-09-29</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block mt-1">
              Verified Records
            </span>
          </div>
        </div>

        {/* 6 Key Metrics (Requirement 16) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Staff</span>
            <span className="text-xl font-black text-white mt-1 block">{activeEmployees.length}</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Days Worked</span>
            <span className="text-xl font-black text-blue-400 mt-1 block">
              {totalPresentDays + (totalHalfDays * 0.5)}
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Salary</span>
            <span className="text-xl font-black text-white mt-1 block">{formatINR(totalSalary)}</span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
            <span className="text-[11px] text-amber-300 font-semibold block">Total Advance</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">{formatINR(totalAdvance)}</span>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
            <span className="text-[11px] text-emerald-300 font-semibold block">Salary Paid</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{formatINR(totalPaid)}</span>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3">
            <span className="text-[11px] text-rose-300 font-semibold block">Pending Balance</span>
            <span className="text-xl font-black text-rose-400 mt-1 block">{formatINR(totalPending)}</span>
          </div>
        </div>
      </div>

      {/* Employee-wise Breakdown Table (Requirement 16) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Employee-wise Breakdown ({getMonthName(selectedMonth)})
          </h3>
          <span className="text-xs text-slate-500">Tap worker row to inspect</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Present</th>
                <th className="py-3 px-3">Half Day</th>
                <th className="py-3 px-3">Paid Days</th>
                <th className="py-3 px-3">Salary</th>
                <th className="py-3 px-3">Paid</th>
                <th className="py-3 px-4 text-right">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {employeeData.map(({ emp, sal }) => (
                <tr
                  key={emp.id}
                  onClick={() => onNavigate('employee_profile', { employeeId: emp.id })}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{emp.employeeCode} • {emp.jobType}</div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">{sal?.presentDays || 0}</td>
                  <td className="py-3.5 px-3 font-semibold text-amber-700">{sal?.halfDays || 0}</td>
                  <td className="py-3.5 px-3 font-bold text-blue-700">{sal?.paidDays || 0}</td>
                  <td className="py-3.5 px-3 font-bold">{formatINR(sal?.basicSalary)}</td>
                  <td className="py-3.5 px-3 text-emerald-700 font-bold">{formatINR(sal?.totalPaid)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`font-black px-2 py-0.5 rounded ${
                      (sal?.pendingAmount || 0) > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
                    }`}>
                      {formatINR(sal?.pendingAmount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
