import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  Briefcase, 
  IndianRupee, 
  MapPin, 
  FileText, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle,
  History,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR, getMonthName } from '../../utils/calculations';
import { AttendanceStatus, PaymentType, PaymentMode } from '../../types';

interface EmployeeProfileViewProps {
  employeeId: string;
  onBack: () => void;
  onNavigate: (tab: string, extra?: any) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({ 
  employeeId, 
  onBack,
  onNavigate 
}) => {
  const { 
    employees, 
    updateEmployee, 
    deleteEmployee, 
    attendance, 
    payments, 
    selectedMonth,
    setSelectedMonth,
    setAttendanceRecord,
    addPaymentRecord,
    deletePaymentRecord,
    getSalaryForEmployee
  } = useAuth();

  const employee = employees.find(e => e.id === employeeId);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(employee?.name || '');
  const [mobileNumber, setMobileNumber] = useState(employee?.mobileNumber || '');
  const [jobType, setJobType] = useState(employee?.jobType || '');
  const [dailySalary, setDailySalary] = useState(String(employee?.dailySalary || '800'));
  const [address, setAddress] = useState(employee?.address || '');
  const [notes, setNotes] = useState(employee?.notes || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(employee?.status || 'active');

  // Confirmation dialogs
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // New payment modal state
  const [payAmount, setPayAmount] = useState('');
  const [payType, setPayType] = useState<PaymentType>('advance');
  const [payMode, setPayMode] = useState<PaymentMode>('cash');
  const [payNote, setPayNote] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  if (!employee) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-600 font-bold">Employee not found.</p>
        <button onClick={onBack} className="mt-3 text-blue-600 font-bold text-sm">Return to Employee List</button>
      </div>
    );
  }

  // Monthly summary
  const salary = getSalaryForEmployee(employee.id, selectedMonth);

  // Month attendance list for this employee
  const monthAttendance = attendance
    .filter(a => a.employeeId === employee.id && a.date.startsWith(selectedMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Month payments for this employee
  const monthPayments = payments
    .filter(p => p.employeeId === employee.id && (p.month === selectedMonth || p.date.startsWith(selectedMonth)))
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleSaveProfile = async () => {
    try {
      await updateEmployee(employee.id, {
        name,
        mobileNumber: mobileNumber.replace(/\D/g, ''),
        jobType,
        dailySalary: parseFloat(dailySalary) || employee.dailySalary,
        address,
        notes,
        status
      });
      setIsEditing(false);
    } catch (err) {
      alert('Error updating employee');
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(employee.id);
      onBack();
    } catch (err) {
      alert('Error deleting employee');
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return;

    await addPaymentRecord({
      employeeId: employee.id,
      amount: amt,
      date: payDate,
      type: payType,
      paymentMode: payMode,
      note: payNote.trim()
    });

    setPayAmount('');
    setPayNote('');
    setShowAddPaymentModal(false);
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to List</span>
        </button>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
            title="Delete Employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        {!isEditing ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                  {employee.photoUrl ? (
                    <img src={employee.photoUrl} alt={employee.name} className="w-full h-full object-cover" />
                  ) : (
                    employee.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{employee.name}</h2>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      employee.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {employee.employeeCode}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{employee.jobType}</span>
                  </div>
                </div>
              </div>

              {/* Login Credentials Box */}
              <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 text-xs">
                <span className="text-blue-900 font-bold block mb-1">Employee App Login Details:</span>
                <div className="flex items-center gap-3 text-slate-700">
                  <span>Mobile: <strong className="font-mono text-slate-900">+91 {employee.mobileNumber}</strong></span>
                  <span>Code: <strong className="font-mono text-blue-700">{employee.employeeCode}</strong></span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Daily Wage</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  {formatINR(employee.dailySalary)} <span className="text-xs font-normal text-slate-400">/ day</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Joining Date</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{employee.joiningDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Address</span>
                <span className="text-xs font-medium text-slate-800 mt-0.5 block truncate">
                  {employee.address || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Notes</span>
                <span className="text-xs font-medium text-slate-800 mt-0.5 block truncate">
                  {employee.notes || 'None'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Edit Employee Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Type</label>
                <input
                  type="text"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daily Salary (₹)</label>
                <input
                  type="number"
                  value={dailySalary}
                  onChange={(e) => setDailySalary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Salary & Register Banner for Selected Month */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-blue-300">Monthly Salary Calculation</div>
            <h3 className="text-xl font-black text-white mt-0.5">{getMonthName(selectedMonth)}</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Select salary month"
              className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
            >
              <option value="2026-09" className="bg-slate-900">September 2026</option>
              <option value="2026-08" className="bg-slate-900">August 2026</option>
              <option value="2026-07" className="bg-slate-900">July 2026</option>
            </select>

            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Money</span>
            </button>
          </div>
        </div>

        {/* Days count breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center mb-5">
          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
            <div className="text-[11px] text-emerald-300 font-semibold">Present Days</div>
            <div className="text-xl font-black text-white mt-0.5">{salary?.presentDays || 0}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
            <div className="text-[11px] text-amber-300 font-semibold">Half Days (0.5)</div>
            <div className="text-xl font-black text-white mt-0.5">{salary?.halfDays || 0}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
            <div className="text-[11px] text-rose-300 font-semibold">Absent</div>
            <div className="text-xl font-black text-white mt-0.5">{salary?.absentDays || 0}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
            <div className="text-[11px] text-blue-300 font-semibold">Leaves</div>
            <div className="text-xl font-black text-white mt-0.5">{salary?.leaveDays || 0}</div>
          </div>
          <div className="bg-blue-600/30 rounded-2xl p-2.5 border border-blue-400/30 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-blue-200 font-bold">Total Paid Days</div>
            <div className="text-xl font-black text-white mt-0.5">{salary?.paidDays || 0}</div>
          </div>
        </div>

        {/* Financial Equation Box */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-[11px] text-slate-300">Basic Calculated</span>
              <div className="text-base sm:text-lg font-black text-white mt-0.5">
                {formatINR(salary?.basicSalary)}
              </div>
              <span className="text-[10px] text-slate-400">({salary?.paidDays} days × {formatINR(employee.dailySalary)})</span>
            </div>

            <div>
              <span className="text-[11px] text-amber-300">Advances Paid</span>
              <div className="text-base sm:text-lg font-black text-amber-400 mt-0.5">
                {formatINR(salary?.advance)}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-emerald-300">Total Money Given</span>
              <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">
                {formatINR(salary?.totalPaid)}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-cyan-300">Pending Remaining</span>
              <div className={`text-base sm:text-lg font-black mt-0.5 ${
                (salary?.pendingAmount || 0) > 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                {formatINR(salary?.pendingAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Attendance list & Payment history */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Attendance History */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Attendance ({monthAttendance.length} Entries)</span>
            </h3>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Modify Attendance
            </button>
          </div>

          {monthAttendance.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No attendance marked yet for {getMonthName(selectedMonth)}.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {monthAttendance.map(att => (
                <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{att.date}</span>
                    {att.notes && <span className="text-[11px] text-slate-400 block">{att.notes}</span>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                    att.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    att.status === 'half_day' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    att.status === 'leave' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {att.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Payments & Advances ({monthPayments.length})</span>
            </h3>
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              + Add Payment
            </button>
          </div>

          {monthPayments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No payments given yet for {getMonthName(selectedMonth)}.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {monthPayments.map(pay => (
                <div key={pay.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{formatINR(pay.amount)}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        pay.type === 'advance' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {pay.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {pay.date} • {pay.paymentMode || 'cash'} {pay.note ? `• ${pay.note}` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete this payment transaction?')) {
                        deletePaymentRecord(pay.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Employee Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Delete Employee?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to permanently remove <strong>{employee.name}</strong> ({employee.employeeCode})?
              All attendance records and salary records will be inaccessible.
            </p>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Money / Advance Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Record Payment to {employee.name}</h3>
              <button onClick={() => setShowAddPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="2000"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-base font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Type</label>
                  <select
                    value={payType}
                    onChange={(e) => setPayType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="advance">Advance</option>
                    <option value="salary_payment">Salary Payment</option>
                    <option value="final_settlement">Final Settlement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="cash">Cash In Hand</option>
                    <option value="upi">UPI / GPay / PhonePe</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Festival advance, emergency cash"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
