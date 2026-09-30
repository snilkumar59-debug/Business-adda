import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  Employee, 
  AttendanceRecord, 
  PaymentRecord, 
  SalaryRecord, 
  AppSettings, 
  UserProfile, 
  AttendanceStatus, 
  PaymentType, 
  PaymentMode 
} from '../types';
import { calculateMonthlySalaryRecord, getCurrentMonthStr, getTodayDateStr } from '../utils/calculations';
import { seedInitialDatabaseIfEmpty } from '../services/seedData';
import { signInWithGoogle, logoutFirebase } from '../services/firebase';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  isEmployee: boolean;
  loginAsAdmin: () => void;
  loginWithGoogle: () => Promise<void>;
  loginAsEmployee: (mobileNumber: string, employeeCode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  // Firestore state
  employees: Employee[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  appSettings: AppSettings | null;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  loading: boolean;
  // Admin Operations
  addEmployee: (emp: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  setAttendanceRecord: (employeeId: string, date: string, status: AttendanceStatus, leavePaid?: boolean, notes?: string) => Promise<void>;
  deleteAttendanceRecord: (attendanceId: string) => Promise<void>;
  addPaymentRecord: (payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'month'> & { month?: string }) => Promise<void>;
  updatePaymentRecord: (id: string, payment: Partial<PaymentRecord>) => Promise<void>;
  deletePaymentRecord: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  // Derived data
  getSalaryForEmployee: (employeeId: string, month?: string) => SalaryRecord | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session persistence in localStorage for instant seamless reload
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('business_adda_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default initial experience: logged in as Admin for easy testing, or null
    return {
      uid: 'admin_owner',
      role: 'admin',
      displayName: 'Sunil Sharma (Owner)',
      businessName: 'Sharma Engineering Works',
      createdAt: new Date().toISOString()
    };
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthStr());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateStr());
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize seed data on load
  useEffect(() => {
    seedInitialDatabaseIfEmpty().catch(console.error);
  }, []);

  // Sync settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'app_settings', 'general'), (snap) => {
      if (snap.exists()) {
        setAppSettings(snap.data() as AppSettings);
      }
    }, (err) => {
      console.warn('Settings listener:', err);
    });
    return () => unsub();
  }, []);

  // Sync employees
  useEffect(() => {
    const q = query(collection(db, 'employees'));
    const unsub = onSnapshot(q, (snap) => {
      const list: Employee[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      // Sort by employeeCode
      list.sort((a, b) => a.employeeCode.localeCompare(b.employeeCode));
      setEmployees(list);
      setLoading(false);
    }, (err) => {
      console.warn('Employees listener error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Sync attendance
  useEffect(() => {
    const q = query(collection(db, 'attendance'));
    const unsub = onSnapshot(q, (snap) => {
      const list: AttendanceRecord[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      setAttendance(list);
    }, (err) => {
      console.warn('Attendance listener error:', err);
    });
    return () => unsub();
  }, []);

  // Sync payments
  useEffect(() => {
    const q = query(collection(db, 'payments'));
    const unsub = onSnapshot(q, (snap) => {
      const list: PaymentRecord[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      setPayments(list);
    }, (err) => {
      console.warn('Payments listener error:', err);
    });
    return () => unsub();
  }, []);

  // Save user session
  const saveUserSession = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('business_adda_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('business_adda_user');
    }
  };

  const loginAsAdmin = () => {
    const adminUser: UserProfile = {
      uid: 'admin_owner',
      role: 'admin',
      displayName: 'Sunil Sharma (Owner)',
      businessName: appSettings?.businessName || 'Sharma Engineering Works',
      createdAt: new Date().toISOString()
    };
    saveUserSession(adminUser);
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithGoogle();
      const user = res.user;
      const adminUser: UserProfile = {
        uid: user.uid,
        role: 'admin',
        displayName: user.displayName || 'Sunil Sharma (Owner)',
        businessName: appSettings?.businessName || 'Sharma Engineering Works',
        createdAt: new Date().toISOString()
      };
      saveUserSession(adminUser);
    } catch (err: any) {
      console.warn('Google sign in note (fallback to owner login):', err?.message || err);
      loginAsAdmin();
    }
  };

  const loginAsEmployee = async (mobileNumber: string, employeeCode: string) => {
    // Normalise mobile and code
    const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
    const cleanCode = employeeCode.trim().toUpperCase();

    // Check against employees collection
    const matched = employees.find(e => {
      const empMob = e.mobileNumber.replace(/\D/g, '').slice(-10);
      return empMob === cleanMobile && e.employeeCode.toUpperCase() === cleanCode;
    });

    if (!matched) {
      return {
        success: false,
        message: 'No matching employee found with this Mobile Number and Employee Code. Please contact your Admin.'
      };
    }

    if (matched.status === 'inactive') {
      return {
        success: false,
        message: 'This employee account is marked Inactive by Admin. Please contact workshop owner.'
      };
    }

    const empUser: UserProfile = {
      uid: `emp_${matched.id}`,
      role: 'employee',
      employeeId: matched.id,
      employeeCode: matched.employeeCode,
      mobileNumber: matched.mobileNumber,
      displayName: matched.name,
      createdAt: new Date().toISOString()
    };

    saveUserSession(empUser);
    return { success: true };
  };

  const logout = () => {
    logoutFirebase().catch(() => {});
    saveUserSession(null);
  };

  // ADMIN ACTIONS - STRICT CHECK
  const checkAdminAuth = () => {
    if (currentUser?.role !== 'admin') {
      throw new Error('Unauthorized action. Only Admin has write permissions.');
    }
  };

  const addEmployee = async (empData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    checkAdminAuth();
    const newId = `emp_${Date.now()}`;
    const now = new Date().toISOString();
    const newDoc: Employee = {
      ...empData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    await setDoc(doc(db, 'employees', newId), newDoc);
    return newId;
  };

  const updateEmployee = async (id: string, empData: Partial<Employee>) => {
    checkAdminAuth();
    const ref = doc(db, 'employees', id);
    await updateDoc(ref, {
      ...empData,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteEmployee = async (id: string) => {
    checkAdminAuth();
    await deleteDoc(doc(db, 'employees', id));
  };

  const setAttendanceRecord = async (
    employeeId: string, 
    date: string, 
    status: AttendanceStatus, 
    leavePaid: boolean = false, 
    notes: string = ''
  ) => {
    checkAdminAuth();
    const month = date.slice(0, 7); // YYYY-MM
    const attId = `att_${employeeId}_${date}`;
    const now = new Date().toISOString();
    const attRef = doc(db, 'attendance', attId);

    await setDoc(attRef, {
      id: attId,
      employeeId,
      date,
      month,
      status,
      leavePaid: status === 'leave' ? leavePaid : false,
      notes: notes || '',
      createdBy: 'admin',
      updatedAt: now,
      createdAt: now
    }, { merge: true });
  };

  const deleteAttendanceRecord = async (attendanceId: string) => {
    checkAdminAuth();
    await deleteDoc(doc(db, 'attendance', attendanceId));
  };

  const addPaymentRecord = async (paymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'month'> & { month?: string }) => {
    checkAdminAuth();
    const id = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const month = paymentData.month || paymentData.date.slice(0, 7);
    const newPay: PaymentRecord = {
      ...paymentData,
      id,
      month,
      createdBy: 'admin',
      createdAt: now,
      updatedAt: now
    };
    await setDoc(doc(db, 'payments', id), newPay);
  };

  const updatePaymentRecord = async (id: string, paymentData: Partial<PaymentRecord>) => {
    checkAdminAuth();
    const ref = doc(db, 'payments', id);
    const updates: any = {
      ...paymentData,
      updatedAt: new Date().toISOString()
    };
    if (paymentData.date) {
      updates.month = paymentData.date.slice(0, 7);
    }
    await updateDoc(ref, updates);
  };

  const deletePaymentRecord = async (id: string) => {
    checkAdminAuth();
    await deleteDoc(doc(db, 'payments', id));
  };

  const updateSettings = async (settings: Partial<AppSettings>) => {
    checkAdminAuth();
    const ref = doc(db, 'app_settings', 'general');
    await setDoc(ref, settings, { merge: true });
  };

  const getSalaryForEmployee = (employeeId: string, month: string = selectedMonth): SalaryRecord | null => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return null;
    return calculateMonthlySalaryRecord(emp, month, attendance, payments);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        isEmployee: currentUser?.role === 'employee',
        loginAsAdmin,
        loginWithGoogle,
        loginAsEmployee,
        logout,
        employees,
        attendance,
        payments,
        appSettings,
        selectedMonth,
        setSelectedMonth,
        selectedDate,
        setSelectedDate,
        loading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        setAttendanceRecord,
        deleteAttendanceRecord,
        addPaymentRecord,
        updatePaymentRecord,
        deletePaymentRecord,
        updateSettings,
        getSalaryForEmployee
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
