import React, { useState, lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Loader2 } from 'lucide-react';

// Code-split pages for faster initial load
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const TestsCatalogPage = lazy(() => import('./pages/TestsCatalogPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
      <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading module...</span>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPatientForBill, setSelectedPatientForBill] = useState(null);
  const [selectedReportForView, setSelectedReportForView] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-slate-700 dark:text-slate-300 font-medium text-xs tracking-wide">
          Initializing Clinic System...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    );
  }

  const handleOrderTestsForPatient = (patient) => {
    setSelectedPatientForBill(patient);
    setActiveTab('billing');
  };

  const handleViewReport = (report) => {
    setSelectedReportForView(report);
    setActiveTab('reports');
  };

  return (
    <div className="h-screen h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-hidden transition-colors duration-200">
      {/* Top Header - Fixed & Sticky */}
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Container below Header */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Fixed on desktop, Drawer on mobile */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Right Content Area - Independently Scrollable */}
        <main className="flex-1 h-full overflow-y-auto px-4 sm:px-6 py-5 focus:outline-none">
          <div className="max-w-7xl mx-auto w-full pb-8">
            <Suspense fallback={<PageLoader />}>
              {activeTab === 'dashboard' && (
                <DashboardPage
                  setActiveTab={setActiveTab}
                  onSelectReport={handleViewReport}
                  onSelectBill={() => setActiveTab('billing')}
                />
              )}

              {activeTab === 'patients' && (
                <PatientsPage
                  onOrderTestsForPatient={handleOrderTestsForPatient}
                  onViewReport={handleViewReport}
                />
              )}

              {activeTab === 'billing' && (
                <BillingPage
                  preselectedPatient={selectedPatientForBill}
                  onGoToReports={() => setActiveTab('reports')}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsPage
                  selectedReportFromProps={selectedReportForView}
                />
              )}

              {activeTab === 'tests' && (
                <TestsCatalogPage />
              )}

              {activeTab === 'settings' && (
                <SettingsPage />
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
