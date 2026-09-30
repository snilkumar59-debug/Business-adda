import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { Employee, AttendanceRecord, PaymentRecord, AppSettings } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  businessName: 'Sharma Engineering Works',
  ownerName: 'Sunil Sharma',
  ownerMobile: '9876543210',
  currency: '₹',
  defaultLeaveIsPaid: false,
  address: 'Plot 42, Industrial Area Phase 2, Pune, Maharashtra'
};

export const INITIAL_EMPLOYEES: Omit<Employee, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'emp_001',
    employeeCode: 'EMP-001',
    name: 'Rahul Kumar',
    mobileNumber: '9876500001',
    joiningDate: '2026-01-10',
    jobType: 'Senior Welder',
    dailySalary: 850,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: 'Near Shanti Nagar, Pune',
    notes: 'Expert in TIG and MIG welding. Highly reliable.',
    status: 'active'
  },
  {
    id: 'emp_002',
    employeeCode: 'EMP-002',
    name: 'Amit Verma',
    mobileNumber: '9876500002',
    joiningDate: '2026-02-15',
    jobType: 'CNC Machinist',
    dailySalary: 900,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: 'Sector 4, Bhosari, Pune',
    notes: 'Handles 3-axis milling machines.',
    status: 'active'
  },
  {
    id: 'emp_003',
    employeeCode: 'EMP-003',
    name: 'Ramesh Patel',
    mobileNumber: '9876500003',
    joiningDate: '2026-03-01',
    jobType: 'Lathe Operator',
    dailySalary: 750,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    address: 'Chinchwad Station Road, Pune',
    notes: 'Precision turning and thread cutting.',
    status: 'active'
  },
  {
    id: 'emp_004',
    employeeCode: 'EMP-004',
    name: 'Suresh Yadav',
    mobileNumber: '9876500004',
    joiningDate: '2026-04-12',
    jobType: 'Workshop Helper',
    dailySalary: 550,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    address: 'Dapodi Market, Pune',
    notes: 'Material handling and cleaning.',
    status: 'active'
  },
  {
    id: 'emp_005',
    employeeCode: 'EMP-005',
    name: 'Manoj Chauhan',
    mobileNumber: '9876500005',
    joiningDate: '2026-05-20',
    jobType: 'Electrician & Fitter',
    dailySalary: 800,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    address: 'Nigdi Pradhikaran, Pune',
    notes: 'Panel wiring and motor maintenance.',
    status: 'active'
  },
  {
    id: 'emp_006',
    employeeCode: 'EMP-006',
    name: 'Dinesh Sawant',
    mobileNumber: '9876500006',
    joiningDate: '2026-06-05',
    jobType: 'Quality Inspector',
    dailySalary: 950,
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    address: 'Pimpri Colony, Pune',
    notes: 'Vernier and micrometer dimension checking.',
    status: 'active'
  }
];

export async function seedInitialDatabaseIfEmpty() {
  try {
    const settingsDoc = await getDoc(doc(db, 'app_settings', 'general'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'app_settings', 'general'), INITIAL_SETTINGS);
    }

    const empSnap = await getDocs(query(collection(db, 'employees')));
    if (empSnap.empty) {
      console.log('Seeding initial employees and records into Firestore...');
      const now = new Date().toISOString();
      const currentMonth = '2026-09';
      const prevMonth = '2026-08';

      const batch = writeBatch(db);

      // Add employees
      for (const emp of INITIAL_EMPLOYEES) {
        const empRef = doc(db, 'employees', emp.id);
        batch.set(empRef, {
          ...emp,
          createdAt: now,
          updatedAt: now
        });
      }

      await batch.commit();

      // Seed attendance and payments for September 2026
      const secondBatch = writeBatch(db);

      // Seed attendance for 1st through 29th Sep 2026
      INITIAL_EMPLOYEES.forEach((emp, empIdx) => {
        // Generate daily attendance for Sep 1 to Sep 29
        for (let day = 1; day <= 29; day++) {
          const dayStr = day < 10 ? `0${day}` : `${day}`;
          const dateStr = `2026-09-${dayStr}`;
          const attId = `att_${emp.id}_${dateStr}`;
          
          let status: 'present' | 'absent' | 'half_day' | 'leave' = 'present';
          
          // Realistic variation:
          // Sunday off/leave or present
          const dayOfWeek = (day + 1) % 7; // Sep 1 was Tuesday
          if (day % 7 === 6) { // weekend off
            status = 'leave';
          } else if (empIdx === 0 && (day === 3 || day === 15)) {
            status = 'absent';
          } else if (empIdx === 0 && (day === 4 || day === 18)) {
            status = 'half_day';
          } else if (empIdx === 1 && day === 11) {
            status = 'half_day';
          } else if (empIdx === 2 && (day === 8 || day === 22)) {
            status = 'absent';
          } else if (empIdx === 3 && day === 14) {
            status = 'half_day';
          }

          const attRef = doc(db, 'attendance', attId);
          secondBatch.set(attRef, {
            id: attId,
            employeeId: emp.id,
            date: dateStr,
            month: currentMonth,
            status,
            leavePaid: false,
            notes: status === 'half_day' ? 'Half day morning shift' : '',
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          });
        }

        // Add payment records for September
        if (empIdx === 0) {
          // Rahul: Advance 3,000 on Sep 5, salary payment 15,000 on Sep 20
          const p1 = doc(db, 'payments', `pay_${emp.id}_1`);
          secondBatch.set(p1, {
            id: `pay_${emp.id}_1`,
            employeeId: emp.id,
            date: '2026-09-05',
            month: currentMonth,
            amount: 3000,
            type: 'advance',
            paymentMode: 'cash',
            note: 'Advance for medical expenses',
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          });

          const p2 = doc(db, 'payments', `pay_${emp.id}_2`);
          secondBatch.set(p2, {
            id: `pay_${emp.id}_2`,
            employeeId: emp.id,
            date: '2026-09-20',
            month: currentMonth,
            amount: 15000,
            type: 'salary_payment',
            paymentMode: 'upi',
            note: 'Mid-month settlement',
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          });
        } else if (empIdx === 1) {
          // Amit: Advance 4,000
          const p1 = doc(db, 'payments', `pay_${emp.id}_1`);
          secondBatch.set(p1, {
            id: `pay_${emp.id}_1`,
            employeeId: emp.id,
            date: '2026-09-08',
            month: currentMonth,
            amount: 4000,
            type: 'advance',
            paymentMode: 'upi',
            note: 'Festival advance',
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          });
        } else if (empIdx === 2) {
          // Ramesh: 2,000 advance
          const p1 = doc(db, 'payments', `pay_${emp.id}_1`);
          secondBatch.set(p1, {
            id: `pay_${emp.id}_1`,
            employeeId: emp.id,
            date: '2026-09-10',
            month: currentMonth,
            amount: 2000,
            type: 'advance',
            paymentMode: 'cash',
            note: 'Tools purchase advance',
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          });
        }
      });

      await secondBatch.commit();
      console.log('Seeding completed successfully!');
    }
  } catch (err: any) {
    // If documents already exist or offline persistence serves data, log info
    console.warn('Seeding check note:', err?.message || err);
  }
}
