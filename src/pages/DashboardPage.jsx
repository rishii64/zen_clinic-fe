import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Receipt,
  FileText,
  Clock,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  Printer,
  Activity,
  AlertCircle
} from 'lucide-react';
import PrintModal from '../components/PrintModal';
import ReportLetterhead from '../components/ReportLetterhead';
import InvoiceTemplate from '../components/InvoiceTemplate';

export default function DashboardPage({ setActiveTab, onSelectReport, onSelectBill }) {
  const { user, clinicConfig } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printDoc, setPrintDoc] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading clinic analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 px-3 py-1 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400 mb-2.5">
              <span>🏥 {clinicConfig?.clinicName || 'Zen Clinic'}</span>
              <span>•</span>
              <span className="text-slate-500 dark:text-slate-400">{clinicConfig?.address ? clinicConfig.address.split(',')[0] : 'Clinical Pathology Lab'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Doctor'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Diagnostic report pipelines, test orders, and billing ledger are operational.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('billing')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Bill</span>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-300 font-medium text-xs px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-300 font-medium text-xs px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Patients */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patients</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalPatients}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Registered patient profiles</span>
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">₹{stats.todayRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Month to date: <strong className="text-slate-700 dark:text-slate-200">₹{stats.monthlyRevenue.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Reports</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">{stats.pendingReportsCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              In progress / awaiting approval
            </div>
          </div>
        </div>

        {/* Unpaid / Due Bills */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Outstanding Dues</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight font-mono">₹{stats.totalOutstandingDue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-medium mt-1">
              Across {stats.unpaidBillsCount} unpaid or partial bills
            </div>
          </div>
        </div>

      </div>

      {/* Revenue Split & Diagnostic Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Payment Channels Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3.5 flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Collection Channels</span>
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Cash Collection</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                ₹{(stats.paymentModes?.Cash || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="font-medium text-slate-700 dark:text-slate-300">UPI / QR Code</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                ₹{(stats.paymentModes?.UPI || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Card / Net Banking</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                ₹{(stats.paymentModes?.Card || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800 pt-3 flex justify-between items-center text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Total Invoiced:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Top Diagnostic Tests */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Top Prescribed Tests</span>
            </h2>
            <button
              onClick={() => setActiveTab('tests')}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              View Tariff →
            </button>
          </div>

          <div className="space-y-2">
            {stats.topTests && stats.topTests.length > 0 ? (
              stats.topTests.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  <div className="flex items-center space-x-2.5 truncate pr-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{t.name}</span>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold shrink-0">
                    {t.count} orders
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No test orders registered yet</div>
            )}
          </div>
        </div>

        {/* Report Pipeline Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3.5 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Diagnostic Report Pipeline</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-medium border border-amber-200/60 dark:border-amber-900/30">
              <span>Sample Collected:</span>
              <span className="font-bold font-mono">{stats.reportStatusCounts?.['Sample Collected'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/60 dark:border-blue-900/30">
              <span>Lab Testing In Progress:</span>
              <span className="font-bold font-mono">{stats.reportStatusCounts?.['In Progress'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 font-medium border border-purple-200/60 dark:border-purple-900/30">
              <span>Awaiting Doctor Verification:</span>
              <span className="font-bold font-mono">{stats.reportStatusCounts?.['Completed'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/60 dark:border-emerald-900/30">
              <span>Doctor Approved & Ready:</span>
              <span className="font-bold font-mono">{stats.reportStatusCounts?.['Approved'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-medium border border-slate-200/60 dark:border-slate-800">
              <span>Delivered to Patient:</span>
              <span className="font-bold font-mono">{stats.reportStatusCounts?.['Delivered'] || 0}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity: Bills & Reports Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Recent Invoices & Bills</span>
            </h2>
            <button
              onClick={() => setActiveTab('billing')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {stats.recentBills && stats.recentBills.length > 0 ? (
              stats.recentBills.map((bill) => (
                <div key={bill._id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold text-xs text-blue-600 dark:text-blue-400">{bill.invoiceNumber}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        bill.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : bill.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {bill.paymentStatus}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1 truncate">
                      {bill.patientSnapshot?.name || 'Patient'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {bill.items?.length || 0} test(s) • {bill.isGstBill ? 'GST Tax Invoice' : 'Non-GST Exempt'}
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-2.5 shrink-0">
                    <div>
                      <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">₹{bill.grandTotal}</div>
                      {bill.dueAmount > 0 && (
                        <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">Due: ₹{bill.dueAmount}</div>
                      )}
                    </div>
                    <button
                      onClick={() => setPrintDoc({ type: 'bill', data: bill })}
                      title="Print Invoice"
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">No bills generated yet</div>
            )}
          </div>
        </div>

        {/* Recent Diagnostic Reports */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Recent Diagnostic Reports</span>
            </h2>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {stats.recentReports && stats.recentReports.length > 0 ? (
              stats.recentReports.map((report) => (
                <div key={report._id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold text-xs text-emerald-600 dark:text-emerald-400">{report.reportNumber}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        report.status === 'Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : report.status === 'In Progress'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1 truncate">
                      {report.patientSnapshot?.name || 'Patient'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {report.tests?.map(t => t.testCode).join(', ')}
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setPrintDoc({ type: 'report', data: report })}
                      title="Print Report"
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (onSelectReport) onSelectReport(report);
                        setActiveTab('reports');
                      }}
                      className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold px-3 py-1.5 rounded-xl transition"
                    >
                      Results
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">No reports generated yet</div>
            )}
          </div>
        </div>

      </div>

      {/* Print / Download Modal */}
      <PrintModal
        isOpen={!!printDoc}
        onClose={() => setPrintDoc(null)}
        title={printDoc?.type === 'bill' ? `Print Invoice: ${printDoc?.data?.invoiceNumber}` : `Diagnostic Report: ${printDoc?.data?.reportNumber}`}
        documentType={printDoc?.type || 'report'}
      >
        {(showLetterhead) => (
          printDoc?.type === 'bill' ? (
            <InvoiceTemplate bill={printDoc.data} config={clinicConfig} showLetterhead={showLetterhead} />
          ) : (
            <ReportLetterhead config={clinicConfig} report={printDoc?.data} showLetterhead={showLetterhead}>
              <div className="text-xs space-y-4">
                {/* Patient Summary Header inside Report */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800">
                  <div>
                    <div><strong>Patient:</strong> {printDoc?.data?.patientSnapshot?.name}</div>
                    <div><strong>ID:</strong> {printDoc?.data?.patientSnapshot?.patientId}</div>
                    <div><strong>Age/Sex:</strong> {printDoc?.data?.patientSnapshot?.age} {printDoc?.data?.patientSnapshot?.ageUnit} / {printDoc?.data?.patientSnapshot?.gender}</div>
                  </div>
                  <div className="text-right">
                    <div><strong>Report No:</strong> {printDoc?.data?.reportNumber}</div>
                    <div><strong>Ref. Doctor:</strong> {printDoc?.data?.referringDoctor}</div>
                    <div><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</div>
                  </div>
                </div>

                {/* Tests Table */}
                {(printDoc?.data?.tests || []).map((t, idx) => (
                  <div key={idx} className="border border-slate-300 rounded overflow-hidden mb-3">
                    <div className="bg-slate-200 border-b border-slate-300 px-3 py-1.5 flex justify-between items-center">
                      <span className="font-extrabold text-blue-900 uppercase tracking-wide">
                        {t.testName}
                      </span>
                      <span className="text-[10px] text-slate-600 font-medium">
                        Method: {t.method || 'Standard Clinical Pathology Method'}
                      </span>
                    </div>
                    <table className="w-full text-left text-xs border-collapse table-fixed">
                      <colgroup>
                        <col style={{ width: '38%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '10%' }} />
                      </colgroup>
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                        <tr>
                          <th className="py-1.5 px-3">Test Investigation</th>
                          <th className="py-1.5 px-3">Observed Value</th>
                          <th className="py-1.5 px-3">Units</th>
                          <th className="py-1.5 px-3">Biological Ref. Range</th>
                          <th className="py-1.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(t.results || []).map((r, rIdx) => {
                          const isAbnormal = r.flag && r.flag !== 'Normal';
                          return (
                            <tr key={rIdx} className={isAbnormal ? 'bg-amber-50/70' : ''}>
                              <td className="py-1.5 px-3 text-slate-900 font-medium">{r.paramName}</td>
                              <td className="py-1.5 px-3 font-bold font-mono text-slate-950">{r.resultValue || '---'}</td>
                              <td className="py-1.5 px-3 text-slate-600 font-mono text-[11px]">{r.unit || '-'}</td>
                              <td className="py-1.5 px-3 text-slate-600 font-mono text-[11px]">{r.refRange || '-'}</td>
                              <td className="py-1.5 px-3 text-center">
                                {isAbnormal ? (
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                    r.flag === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {r.flag}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[10px]">Normal</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}

                {/* Impressions & Notes */}
                {(printDoc?.data?.overallImpression || printDoc?.data?.doctorRemarks) && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                    {printDoc.data.overallImpression && (
                      <div>
                        <strong className="text-slate-900">Impression:</strong>
                        <span className="text-slate-800 ml-1.5">{printDoc.data.overallImpression}</span>
                      </div>
                    )}
                    {printDoc.data.doctorRemarks && (
                      <div>
                        <strong className="text-slate-900">Clinical Advice:</strong>
                        <span className="text-slate-800 ml-1.5">{printDoc.data.doctorRemarks}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* End of Report Divider */}
                <div className="text-center pt-2 text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                  *** END OF DIAGNOSTIC REPORT ***
                </div>
              </div>
            </ReportLetterhead>
          )
        )}
      </PrintModal>

    </div>
  );
}
