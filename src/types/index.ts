export interface Employee {
  id: string;
  employeeCode: string; // e.g. "EMP-001"
  name: string;
  mobileNumber: string; // 10-digit or with country code
  joiningDate: string; // YYYY-MM-DD
  jobType: string; // e.g. "Welder", "Machinist", "Helper", "Mechanic"
  dailySalary: number; // e.g. 800
  photoUrl?: string;
  address?: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  status: AttendanceStatus;
  leavePaid?: boolean; // if leave, is it paid by Admin? default false
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentType = 'advance' | 'salary_payment' | 'final_settlement' | 'other';
export type PaymentMode = 'cash' | 'upi' | 'bank_transfer';

export interface PaymentRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  amount: number;
  type: PaymentType;
  paymentMode?: PaymentMode;
  note?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryRecord {
  id: string; // employeeId_month (e.g. EMP123_2026-09)
  employeeId: string;
  month: string; // YYYY-MM
  dailyRate: number;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  leaveDays: number;
  paidDays: number; // present + (halfDays * 0.5) + (paidLeaves)
  basicSalary: number; // paidDays * dailyRate
  advance: number; // sum of 'advance' payments in this month
  otherPayments: number; // sum of 'salary_payment', 'final_settlement', 'other'
  totalPaid: number; // advance + otherPayments
  pendingAmount: number; // basicSalary + adjustments - totalPaid
  finalSalary: number; // basicSalary + adjustments
  adjustmentAmount?: number; // bonus, overtime, penalty (+ or -)
  adjustmentNote?: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  role: 'admin' | 'employee';
  employeeId?: string;
  employeeCode?: string;
  mobileNumber?: string;
  displayName: string;
  businessName?: string;
  createdAt: string;
}

export interface AppSettings {
  businessName: string;
  ownerName: string;
  ownerMobile: string;
  currency: string;
  defaultLeaveIsPaid: boolean;
  address?: string;
}
