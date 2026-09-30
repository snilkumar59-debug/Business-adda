import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  IndianRupee, 
  CreditCard, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  ShieldCheck,
  Smartphone,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { AuthLanding } from './components/auth/AuthLanding';
import { AdminLogin } from './components/auth/AdminLogin';
import { EmployeeLogin } from './components/auth/EmployeeLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmployeeList } from './components/admin/EmployeeList';
import { AddEmployee } from './components/admin/AddEmployee';
import { EmployeeProfileView } from './components/admin/EmployeeProfileView';
import { AttendanceManager } from './components/admin/AttendanceManager';
import { SalarySheetView } from './components/admin/SalarySheetView';
import { PaymentsManager } from './components/admin/PaymentsManager';
import { MonthlyReports } from './components/admin/MonthlyReports';
import { SettingsView } from './components/admin/SettingsView';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';

export default function App() {
  const { 
    currentUser, 
    isAdmin, 
    isEmployee, 
    logout, 
    appSettings, 
    loading 
  } = useAuth();

  // Navigation state for Admin
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);

  // Navigation state for Employee
  const [employeeTab, setEmployeeTab] = useState<string>('attendance');

  // Auth flow states (when logged out)
  const [authView, setAuthView] = useState<'landing' | 'admin_login' | 'employee_login'>('landing');

  // Quick Role Switcher (for preview/demo convenience)
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xl mb-4 animate-pulse">
          BA
        </div>
        <h2 className="text-lg font-bold">Business Adda</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to Firestore Cloud Database...</p>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    if (authView === 'admin_login') {
      return <AdminLogin onBack={() => setAuthView('landing')} />;
    }
    if (authView === 'employee_login') {
      return <EmployeeLogin onBack={() => setAuthView('landing')} />;
    }
    return (
      <AuthLanding
        onSelectAdmin={() => setAuthView('admin_login')}
        onSelectEmployee={() => setAuthView('employee_login')}
      />
    );
  }

  // Handler for Admin navigation
  const handleAdminNavigate = (tab: string, extra?: any) => {
    if (extra?.employeeId) {
      setActiveEmployeeId(extra.employeeId);
    }
    setAdminTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Application Bar (Android App Header) */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 shadow-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => isAdmin ? setAdminTab('dashboard') : setEmployeeTab('attendance')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-lg tracking-tighter shadow-md cursor-pointer"
            >
              BA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  {appSettings?.businessName || 'Business Adda'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isAdmin 
                    ? 'bg-amber-400 text-slate-950 font-black' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isAdmin ? 'Owner (Admin)' : 'Staff (View Only)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {currentUser.displayName} • {isAdmin ? 'Single Admin Control' : 'Strict Read-Only'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Switch between Admin and Employee view"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Switch Role</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 text-xs">
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setAuthView('admin_login');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-700 flex items-center gap-2 text-white font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Business Owner</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setAuthView('employee_login');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-700 flex items-center gap-2 text-white font-medium"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Employee (Read-Only)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                logout();
                setAuthView('landing');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6">
        {isAdmin ? (
          /* ADMIN SCREENS ROUTER */
          <div>
            {adminTab === 'dashboard' && <AdminDashboard onNavigate={handleAdminNavigate} />}
            {adminTab === 'employees' && <EmployeeList onNavigate={handleAdminNavigate} />}
            {adminTab === 'add_employee' && (
              <AddEmployee
                onBack={() => setAdminTab('employees')}
                onSuccess={(newId) => {
                  setActiveEmployeeId(newId);
                  setAdminTab('employee_profile');
                }}
              />
            )}
            {adminTab === 'employee_profile' && activeEmployeeId && (
              <EmployeeProfileView
                employeeId={activeEmployeeId}
                onBack={() => setAdminTab('employees')}
                onNavigate={handleAdminNavigate}
              />
            )}
            {adminTab === 'attendance' && <AttendanceManager onNavigate={handleAdminNavigate} />}
            {adminTab === 'salary' && <SalarySheetView onNavigate={handleAdminNavigate} />}
            {adminTab === 'payments' && <PaymentsManager onNavigate={handleAdminNavigate} />}
            {adminTab === 'reports' && <MonthlyReports onNavigate={handleAdminNavigate} />}
            {adminTab === 'settings' && <SettingsView />}
          </div>
        ) : (
          /* EMPLOYEE SCREENS ROUTER (STRICT READ ONLY) */
          <div>
            <EmployeeDashboard onNavigateTab={setEmployeeTab} activeTab={employeeTab} />
          </div>
        )}
      </main>

      {/* Bottom Android Navigation Bar (Mobile Native Bar) */}
      {isAdmin && (
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-1.5 px-3">
          <div className="max-w-lg mx-auto flex items-center justify-around text-center">
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                adminTab === 'dashboard' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Dashboard</span>
            </button>

            <button
              onClick={() => setAdminTab('attendance')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                adminTab === 'attendance' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarCheck className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Attendance</span>
            </button>

            <button
              onClick={() => setAdminTab('salary')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                adminTab === 'salary' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <IndianRupee className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Salary Sheet</span>
            </button>

            <button
              onClick={() => setAdminTab('payments')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                adminTab === 'payments' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Advances</span>
            </button>

            <button
              onClick={() => setAdminTab('employees')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                adminTab === 'employees' || adminTab === 'employee_profile' || adminTab === 'add_employee'
                  ? 'text-blue-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Employees</span>
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                adminTab === 'settings' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <SettingsIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Settings</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
