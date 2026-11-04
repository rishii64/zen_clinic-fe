import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import BillingPage from './pages/BillingPage';
import ReportsPage from './pages/ReportsPage';
import TestsCatalogPage from './pages/TestsCatalogPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientForBill, setSelectedPatientForBill] = useState(null);
  const [selectedReportForView, setSelectedReportForView] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#0B57D0] border-t-transparent rounded-full animate-spin" />
        <div className="text-[#1F1F1F] font-semibold text-sm tracking-wide">
          Initializing Clinic Management System...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
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
    <div className="h-screen h-[100dvh] bg-[#F8FAFD] text-[#1F1F1F] flex flex-col font-sans overflow-hidden">
      {/* Top Header - Fixed & Sticky */}
      <Navbar />

      {/* Main Container below Header */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Fixed */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Content Area - Independently Scrollable */}
        <main className="flex-1 h-full overflow-y-auto p-6 focus:outline-none">
          <div className="max-w-7xl mx-auto w-full">
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
          </div>
        </main>
      </div>
    </div>
  );
}
