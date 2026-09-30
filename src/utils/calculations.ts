import { AttendanceRecord, PaymentRecord, SalaryRecord, Employee } from '../types';

/**
 * Calculates the monthly salary summary for an employee given their attendance and payments.
 * Rules:
 * Present Day = 1.0 paid day
 * Half Day = 0.5 paid day
 * Absent Day = 0 paid day
 * Leave = 1.0 if marked leavePaid, else 0 paid day
 * Basic Salary = paidDays * dailySalary
 * Pending = (BasicSalary + adjustments) - totalPaid
 */
export function calculateMonthlySalaryRecord(
  employee: Employee,
  month: string, // YYYY-MM
  attendances: AttendanceRecord[],
  payments: PaymentRecord[],
  adjustmentAmount: number = 0,
  adjustmentNote: string = ''
): SalaryRecord {
  // Filter for employee and month
  const empAtts = attendances.filter(a => a.employeeId === employee.id && a.date.startsWith(month));
  const empPays = payments.filter(p => p.employeeId === employee.id && (p.month === month || p.date.startsWith(month)));

  let presentDays = 0;
  let halfDays = 0;
  let absentDays = 0;
  let leaveDays = 0;
  let paidLeaveDays = 0;

  empAtts.forEach(att => {
    switch (att.status) {
      case 'present':
        presentDays += 1;
        break;
      case 'half_day':
        halfDays += 1;
        break;
      case 'absent':
        absentDays += 1;
        break;
      case 'leave':
        leaveDays += 1;
        if (att.leavePaid) {
          paidLeaveDays += 1;
        }
        break;
    }
  });

  const paidDays = Number((presentDays + (halfDays * 0.5) + paidLeaveDays).toFixed(1));
  const basicSalary = Math.round(paidDays * (employee.dailySalary || 0));

  let advance = 0;
  let otherPayments = 0;

  empPays.forEach(pay => {
    const amount = Number(pay.amount) || 0;
    if (pay.type === 'advance') {
      advance += amount;
    } else {
      otherPayments += amount;
    }
  });

  const totalPaid = advance + otherPayments;
  const finalSalary = basicSalary + adjustmentAmount;
  const pendingAmount = finalSalary - totalPaid;

  return {
    id: `${employee.id}_${month}`,
    employeeId: employee.id,
    month,
    dailyRate: employee.dailySalary,
    presentDays,
    halfDays,
    absentDays,
    leaveDays,
    paidDays,
    basicSalary,
    advance,
    otherPayments,
    totalPaid,
    pendingAmount,
    finalSalary,
    adjustmentAmount,
    adjustmentNote,
    updatedAt: new Date().toISOString()
  };
}

export function formatINR(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
}

export function getMonthName(monthStr: string): string {
  // monthStr is YYYY-MM
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function getCurrentMonthStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${m < 10 ? '0' + m : m}`;
}

export function getTodayDateStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${m < 10 ? '0' + m : m}-${day < 10 ? '0' + day : day}`;
}

export function generateNextEmployeeCode(existingCodes: string[]): string {
  let highestNum = 0;
  const regex = /^EMP-(\d+)$/i;
  existingCodes.forEach(code => {
    const match = code.trim().match(regex);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > highestNum) highestNum = num;
    }
  });
  const nextNum = highestNum + 1;
  return `EMP-${nextNum < 10 ? '00' + nextNum : nextNum < 100 ? '0' + nextNum : nextNum}`;
}
