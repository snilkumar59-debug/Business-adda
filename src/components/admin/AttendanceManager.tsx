import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  Users, 
  Sparkles, 
  Search, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceStatus } from '../../types';
import { formatINR, getTodayDateStr } from '../../utils/calculations';

interface AttendanceManagerProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ onNavigate }) => {
  const { 
    employees, 
    attendance, 
    selectedDate, 
    setSelectedDate, 
    setAttendanceRecord,
    deleteAttendanceRecord 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const activeEmployees = employees.filter(e => e.status === 'active');

  // Change selected date
  const handleDateChange = (daysDelta: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + daysDelta);
    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    const d = current.getDate();
    setSelectedDate(`${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`);
  };

  // Find attendance for selected date
  const getAttendanceForEmp = (employeeId: string) => {
    return attendance.find(a => a.employeeId === employeeId && a.date === selectedDate);
  };

  const handleSetStatus = async (employeeId: string, status: AttendanceStatus) => {
    try {
      await setAttendanceRecord(employeeId, selectedDate, status);
      setSaveSuccessMsg('Updated!');
      setTimeout(() => setSaveSuccessMsg(''), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  // Mark all un-marked as Present with one click
  const handleMarkAllPresent = async () => {
    for (const emp of activeEmployees) {
      const existing = getAttendanceForEmp(emp.id);
      if (!existing) {
        await setAttendanceRecord(emp.id, selectedDate, 'present');
      }
    }
    setSaveSuccessMsg('All unmarked staff marked as Present!');
    setTimeout(() => setSaveSuccessMsg(''), 2000);
  };

  const filteredEmployees = activeEmployees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-28">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-blue-600" />
            <span>Attendance Register</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin can mark Present (1.0), Half Day (0.5), Absent (0), or Leave. Synced automatically.
          </p>
        </div>

        {/* Date Selector Box */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => handleDateChange(-1)}
            aria-label="Previous Day"
            className="p-1.5 rounded-xl hover:bg-white text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Attendance Date"
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleDateChange(1)}
            aria-label="Next Day"
            className="p-1.5 rounded-xl hover:bg-white text-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(getTodayDateStr())}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Quick Attendance Rule Pill & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/60 border border-blue-200/70 p-3.5 rounded-2xl text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Salary Rule:</strong> Present = <strong>1 full day</strong> • Half Day = <strong>0.5 day</strong> • Absent = <strong>0 day</strong>
          </span>
        </div>
        <button
          onClick={handleMarkAllPresent}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm self-start sm:self-auto transition-all active:scale-95"
        >
          ✓ Mark All Unmarked as Present
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Filter staff by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
        />
      </div>

      {/* Staff Attendance Cards */}
      <div className="space-y-3">
        {filteredEmployees.map(emp => {
          const record = getAttendanceForEmp(emp.id);
          const currentStatus = record?.status;

          return (
            <div
              key={emp.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Employee info */}
              <div 
                onClick={() => onNavigate('employee_profile', { employeeId: emp.id })}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden shrink-0">
                  {emp.photoUrl ? (
                    <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" />
                  ) : (
                    emp.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {emp.name}
                    </h3>
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {emp.employeeCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{emp.jobType}</span>
                    <span>•</span>
                    <span className="font-medium">{formatINR(emp.dailySalary)}/day</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto w-full sm:w-auto">
                <button
                  onClick={() => handleSetStatus(emp.id, 'present')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStatus === 'present'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  Present
                </button>

                <button
                  onClick={() => handleSetStatus(emp.id, 'half_day')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStatus === 'half_day'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  Half Day (0.5)
                </button>

                <button
                  onClick={() => handleSetStatus(emp.id, 'absent')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStatus === 'absent'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  Absent
                </button>

                <button
                  onClick={() => handleSetStatus(emp.id, 'leave')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStatus === 'leave'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Leave
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
