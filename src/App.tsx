import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavRoute } from './components/layout/Sidebar';
import { ReceiptModal } from './components/common/ReceiptModal';
import { Payment, SchoolSettings } from './types';
import { INITIAL_SCHOOL_SETTINGS } from './constants/initialData';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { StudentsPage } from './pages/StudentsPage';
import { ClassesPage } from './pages/ClassesPage';
import { PaymentTypesPage } from './pages/PaymentTypesPage';
import { AcademicYearsPage } from './pages/AcademicYearsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { SrsAndDatabaseDocPage } from './pages/SrsAndDatabaseDocPage';

function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard');
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<Payment | null>(null);
  const [schoolSettings] = useState<SchoolSettings>(INITIAL_SCHOOL_SETTINGS);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-300 tracking-wide">Memuat Sistem Bendahara SMP NUHA MERGOSONO...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const handleViewReceipt = (payment: Payment) => {
    setActiveReceiptPayment(payment);
  };

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateToPayments={() => setCurrentRoute('payments')}
            onNavigateToReports={() => setCurrentRoute('reports')}
            onViewReceipt={handleViewReceipt}
          />
        );
      case 'payments':
        return <PaymentsPage onViewReceipt={handleViewReceipt} />;
      case 'students':
        return <StudentsPage />;
      case 'classes':
        return <ClassesPage />;
      case 'payment_types':
        return <PaymentTypesPage />;
      case 'academic_years':
        return <AcademicYearsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      case 'srs_db_docs':
        return <SrsAndDatabaseDocPage />;
      default:
        return (
          <DashboardPage
            onNavigateToPayments={() => setCurrentRoute('payments')}
            onNavigateToReports={() => setCurrentRoute('reports')}
            onViewReceipt={handleViewReceipt}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => {}}
        activeAcademicYearName="2025/2026 Ganjil"
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentRoute={currentRoute}
          onSelectRoute={(route) => setCurrentRoute(route)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(activeReceiptPayment)}
        onClose={() => setActiveReceiptPayment(null)}
        payment={activeReceiptPayment}
        schoolSettings={schoolSettings}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
