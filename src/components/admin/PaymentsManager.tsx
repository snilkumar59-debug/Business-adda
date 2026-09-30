import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR, getTodayDateStr, getMonthName } from '../../utils/calculations';
import { PaymentType, PaymentMode } from '../../types';

interface PaymentsManagerProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({ onNavigate }) => {
  const { 
    employees, 
    payments, 
    selectedMonth, 
    setSelectedMonth, 
    addPaymentRecord, 
    deletePaymentRecord 
  } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('advance');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [date, setDate] = useState(getTodayDateStr());
  const [note, setNote] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Payments in selected month
  const monthPayments = payments
    .filter(p => p.month === selectedMonth || p.date.startsWith(selectedMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalAdvanceMonth = monthPayments
    .filter(p => p.type === 'advance')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalSalaryPaymentsMonth = monthPayments
    .filter(p => p.type !== 'advance')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const grandTotalMonth = totalAdvanceMonth + totalSalaryPaymentsMonth;

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !selectedEmpId) return;

    await addPaymentRecord({
      employeeId: selectedEmpId,
      amount: num,
      type: paymentType,
      paymentMode,
      date,
      note: note.trim()
    });

    setAmount('');
    setNote('');
    setShowAddModal(false);
  };

  const filteredPayments = monthPayments.filter(p => {
    const emp = employees.find(e => e.id === p.employeeId);
    const matchesSearch = !searchTerm || 
      emp?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp?.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.note?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-28">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-violet-600" />
            <span>Money & Advance Register</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record cash advances, mid-month payments, or final wage settlements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Select register month"
            className="bg-slate-100 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
            <option value="2026-07">July 2026</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-semibold block">Total Advances Given</span>
            <span className="text-2xl font-black text-amber-900 mt-1 block">
              {formatINR(totalAdvanceMonth)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200/80 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-blue-700 font-semibold block">Salary Settlements</span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">
              {formatINR(totalSalaryPaymentsMonth)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-700 font-semibold block">Grand Total Distributed</span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block">
              {formatINR(grandTotalMonth)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search transactions by worker name or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-violet-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('advance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'advance' ? 'bg-amber-600 text-white' : 'text-slate-600'
            }`}
          >
            Advance
          </button>
          <button
            onClick={() => setFilterType('salary_payment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'salary_payment' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Salary
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No transactions found for {getMonthName(selectedMonth)}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPayments.map(p => {
              const emp = employees.find(e => e.id === p.employeeId);
              return (
                <div key={p.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      p.type === 'advance' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.type === 'advance' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => emp && onNavigate('employee_profile', { employeeId: emp.id })}
                          className="font-extrabold text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {emp?.name || 'Worker'}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {emp?.employeeCode}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          p.type === 'advance' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {p.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{p.date}</span>
                        <span>•</span>
                        <span className="capitalize">{p.paymentMode || 'cash'}</span>
                        {p.note && (
                          <>
                            <span>•</span>
                            <span className="italic text-slate-600">"{p.note}"</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        {formatINR(p.amount)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete transaction of ${formatINR(p.amount)} for ${emp?.name}?`)) {
                          deletePaymentRecord(p.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Record Payment / Advance</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Employee *</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
                >
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeCode}) - {formatINR(emp.dailySalary)}/day
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="2000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-base font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as any)}
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
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes / Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Festival advance, emergency cash"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
