import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  Briefcase, 
  IndianRupee, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Filter,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/calculations';

interface EmployeeListProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ onNavigate }) => {
  const { employees, selectedMonth, getSalaryForEmployee } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      emp.name.toLowerCase().includes(term) ||
      emp.employeeCode.toLowerCase().includes(term) ||
      emp.mobileNumber.includes(term) ||
      emp.jobType.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {employees.length} workers registered ({employees.filter(e => e.status === 'active').length} active)
          </p>
        </div>

        <button
          onClick={() => onNavigate('add_employee')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by Name, EMP Code, or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({employees.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'inactive' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Employees Grid / Cards */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No employees found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm ? `No matches for "${searchTerm}". Try another search term.` : 'Get started by adding your first employee.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-xs font-bold text-blue-600 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredEmployees.map((emp) => {
            const salary = getSalaryForEmployee(emp.id, selectedMonth);
            return (
              <div
                key={emp.id}
                onClick={() => onNavigate('employee_profile', { employeeId: emp.id })}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-black text-slate-700 text-base overflow-hidden shrink-0 shadow-inner">
                        {emp.photoUrl ? (
                          <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                          emp.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                            {emp.name}
                          </h3>
                          {emp.status === 'active' ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                          ) : (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                            {emp.employeeCode}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {emp.jobType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 flex items-center justify-center shrink-0 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Mobile & Salary details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 rounded-2xl p-3 border border-slate-100 mt-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mobile</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        +91 {emp.mobileNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Daily Rate</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">
                        {formatINR(emp.dailySalary)} / day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Ledger summary bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">This Month ({emp.status === 'active' ? 'Active' : 'Inactive'}):</span>
                    <span className="font-bold text-slate-900 ml-1.5">
                      {formatINR(salary?.basicSalary)} ({salary?.paidDays || 0} Paid Days)
                    </span>
                  </div>
                  <div>
                    <span className={`font-bold px-2 py-0.5 rounded-md ${
                      (salary?.pendingAmount || 0) > 0 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {(salary?.pendingAmount || 0) > 0 ? `Due: ${formatINR(salary?.pendingAmount)}` : 'Cleared'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
