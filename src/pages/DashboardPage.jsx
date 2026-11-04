import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Receipt,
  FileText,
  DollarSign,
  AlertCircle,
  Clock,
  TrendingUp,
  CreditCard,
  QrCode,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  Printer,
  Activity
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0B57D0] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#444746]">Loading clinic analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Material 3 Light Surface Banner */}
      <div className="bg-gradient-to-r from-[#E8F0FE] via-[#EEF4FE] to-[#F5EEFD] rounded-3xl p-6 border border-[#D2E3FC] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/80 border border-[#D2E3FC] px-3.5 py-1 rounded-full text-xs font-bold text-[#0B57D0] mb-2 shadow-xs">
              <span>🏥 {clinicConfig?.clinicName || 'Zen Clinic'}</span>
              <span>•</span>
              <span className="text-[#444746]">{clinicConfig?.address || 'Clinical Laboratory'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1F1F1F] tracking-tight">
              Welcome back, {user?.name || 'Staff Member'}!
            </h1>
            <p className="text-[#444746] text-xs mt-1 max-w-xl leading-relaxed">
              Diagnostic report pipelines, billing registers, and test tariffs are active.
            </p>
          </div>

          {/* Material 3 Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('billing')}
              className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm flex items-center space-x-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Bill</span>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className="bg-white hover:bg-[#F0F4F9] text-[#0B57D0] border border-[#A8C7FA] font-bold text-xs px-4 py-2.5 rounded-full transition shadow-xs"
            >
              <Users className="w-4 h-4 inline mr-1.5" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-white hover:bg-[#F0F4F9] text-[#137333] border border-[#CEEAD6] font-bold text-xs px-4 py-2.5 rounded-full transition shadow-xs"
            >
              <FileText className="w-4 h-4 inline mr-1.5" />
              <span>Diagnostic Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Material 3 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0E2EC] shadow-sm hover:shadow-m3-1 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#74777F] uppercase tracking-wider">Total Patients</span>
            <div className="w-10 h-10 rounded-2xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#1F1F1F]">{stats.totalPatients}</div>
            <div className="text-[11px] text-[#137333] font-semibold flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Registered clinic patients</span>
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0E2EC] shadow-sm hover:shadow-m3-1 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#74777F] uppercase tracking-wider">Today's Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-[#CEEAD6] text-[#0D652D] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#1F1F1F]">₹{stats.todayRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-[#444746] font-medium mt-1">
              Month to date: <strong className="text-[#1F1F1F]">₹{stats.monthlyRevenue.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0E2EC] shadow-sm hover:shadow-m3-1 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#74777F] uppercase tracking-wider">Pending Reports</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFE082] text-[#8C4A00] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#B06000]">{stats.pendingReportsCount}</div>
            <div className="text-[11px] text-[#444746] font-medium mt-1">
              Sample collected / testing in progress
            </div>
          </div>
        </div>

        {/* Unpaid / Due Bills */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0E2EC] shadow-sm hover:shadow-m3-1 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#74777F] uppercase tracking-wider">Outstanding Dues</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFDAD6] text-[#93000A] flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#BA1A1A]">₹{stats.totalOutstandingDue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-[#BA1A1A] font-semibold mt-1">
              Across {stats.unpaidBillsCount} unpaid or partial bills
            </div>
          </div>
        </div>

      </div>

      {/* Revenue Split & Diagnostic Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payment Channels Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0E2EC] shadow-sm">
          <h2 className="text-sm font-bold text-[#1F1F1F] mb-3 flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-[#0B57D0]" />
            <span>Collection Channels</span>
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-[#F0F4F9] border border-[#E0E2EC]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#137333]"></span>
                <span className="font-semibold text-[#1F1F1F]">Cash Collection</span>
              </div>
              <span className="font-bold text-[#1F1F1F] font-mono">
                ₹{(stats.paymentModes?.Cash || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-[#F0F4F9] border border-[#E0E2EC]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B57D0]"></span>
                <span className="font-semibold text-[#1F1F1F]">UPI / QR Code</span>
              </div>
              <span className="font-bold text-[#1F1F1F] font-mono">
                ₹{(stats.paymentModes?.UPI || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-[#F0F4F9] border border-[#E0E2EC]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6750A4]"></span>
                <span className="font-semibold text-[#1F1F1F]">Card / Net Banking</span>
              </div>
              <span className="font-bold text-[#1F1F1F] font-mono">
                ₹{(stats.paymentModes?.Card || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="border-t border-[#E0E2EC] pt-3 flex justify-between items-center text-xs">
              <span className="font-bold text-[#444746]">Total Invoiced:</span>
              <span className="font-black text-[#0B57D0] font-mono text-base">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Top Diagnostic Tests */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0E2EC] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#1F1F1F] flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-[#137333]" />
              <span>Most Prescribed Tests</span>
            </h2>
            <button
              onClick={() => setActiveTab('tests')}
              className="text-[11px] text-[#0B57D0] font-bold hover:underline"
            >
              View Tariff →
            </button>
          </div>

          <div className="space-y-2">
            {stats.topTests && stats.topTests.length > 0 ? (
              stats.topTests.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#F0F4F9] last:border-0">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0FE] text-[#0B57D0] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-[#1F1F1F] truncate">{t.name}</span>
                  </div>
                  <span className="bg-[#F0F4F9] text-[#444746] px-2.5 py-0.5 rounded-full font-mono font-bold shrink-0 text-[11px]">
                    {t.count} orders
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#74777F] text-center py-6">No test orders yet</div>
            )}
          </div>
        </div>

        {/* Report Pipeline Status */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0E2EC] shadow-sm">
          <h2 className="text-sm font-bold text-[#1F1F1F] mb-3 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#6750A4]" />
            <span>Diagnostic Report Pipeline</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-2xl bg-[#FFF8E1] text-[#8C4A00] font-medium border border-[#FFE082]/60">
              <span>Sample Collected:</span>
              <span className="font-bold">{stats.reportStatusCounts?.['Sample Collected'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-2xl bg-[#E8F0FE] text-[#0B57D0] font-medium border border-[#D2E3FC]">
              <span>Lab Testing In Progress:</span>
              <span className="font-bold">{stats.reportStatusCounts?.['In Progress'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-2xl bg-[#F3E8FD] text-[#6750A4] font-medium border border-[#E8DEF8]">
              <span>Awaiting Doctor Verification:</span>
              <span className="font-bold">{stats.reportStatusCounts?.['Completed'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-2xl bg-[#E6F4EA] text-[#0D652D] font-medium border border-[#CEEAD6]">
              <span>Doctor Approved & Ready:</span>
              <span className="font-bold">{stats.reportStatusCounts?.['Approved'] || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-2xl bg-[#F0F4F9] text-[#444746] font-medium border border-[#E0E2EC]">
              <span>Delivered to Patient:</span>
              <span className="font-bold">{stats.reportStatusCounts?.['Delivered'] || 0}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity: Bills & Reports Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Invoices */}
        <div className="bg-white rounded-3xl border border-[#E0E2EC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E0E2EC] flex items-center justify-between bg-[#F8FAFD]">
            <h2 className="text-sm font-bold text-[#1F1F1F] flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-[#0B57D0]" />
              <span>Recent Invoices & Bills</span>
            </h2>
            <button
              onClick={() => setActiveTab('billing')}
              className="text-xs font-bold text-[#0B57D0] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F0F4F9]">
            {stats.recentBills && stats.recentBills.length > 0 ? (
              stats.recentBills.map((bill) => (
                <div key={bill._id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFD] transition whitespace-nowrap">
                  <div className="whitespace-nowrap">
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-[#0B57D0] whitespace-nowrap">{bill.invoiceNumber}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        bill.paymentStatus === 'Paid'
                          ? 'bg-[#CEEAD6] text-[#0D652D]'
                          : bill.paymentStatus === 'Partially Paid'
                          ? 'bg-[#FFE082] text-[#8C4A00]'
                          : 'bg-[#FFDAD6] text-[#93000A]'
                      }`}>
                        {bill.paymentStatus}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#1F1F1F] mt-0.5 whitespace-nowrap">
                      {bill.patientSnapshot?.name || 'Patient'}
                    </div>
                    <div className="text-[11px] text-[#74777F] whitespace-nowrap">
                      {bill.items?.length || 0} test(s) • {bill.isGstBill ? 'GST Registered' : 'Non-GST Exempt'}
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-3 whitespace-nowrap shrink-0">
                    <div className="whitespace-nowrap">
                      <div className="font-mono font-bold text-sm text-[#1F1F1F] whitespace-nowrap">₹{bill.grandTotal}</div>
                      {bill.dueAmount > 0 && (
                        <div className="text-[10px] font-bold text-[#BA1A1A] whitespace-nowrap">Due: ₹{bill.dueAmount}</div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setPrintDoc({ type: 'bill', data: bill });
                      }}
                      title="Print Invoice"
                      className="p-2 bg-[#F0F4F9] hover:bg-[#E3E8EF] text-[#444746] hover:text-[#0B57D0] rounded-full transition shrink-0"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#74777F]">No bills generated yet</div>
            )}
          </div>
        </div>

        {/* Recent Diagnostic Reports */}
        <div className="bg-white rounded-3xl border border-[#E0E2EC] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E0E2EC] flex items-center justify-between bg-[#F8FAFD]">
            <h2 className="text-sm font-bold text-[#1F1F1F] flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#137333]" />
              <span>Recent Diagnostic Reports</span>
            </h2>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-bold text-[#0B57D0] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F0F4F9]">
            {stats.recentReports && stats.recentReports.length > 0 ? (
              stats.recentReports.map((report) => (
                <div key={report._id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFD] transition whitespace-nowrap">
                  <div className="whitespace-nowrap">
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-[#137333] whitespace-nowrap">{report.reportNumber}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        report.status === 'Approved'
                          ? 'bg-[#CEEAD6] text-[#0D652D]'
                          : report.status === 'In Progress'
                          ? 'bg-[#D3E3FD] text-[#041E49]'
                          : 'bg-[#FFE082] text-[#8C4A00]'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#1F1F1F] mt-0.5 whitespace-nowrap">
                      {report.patientSnapshot?.name || 'Patient'}
                    </div>
                    <div className="text-[11px] text-[#74777F] whitespace-nowrap">
                      {report.tests?.map(t => t.testCode).join(', ')}
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-2 whitespace-nowrap shrink-0">
                    <button
                      onClick={() => {
                        setPrintDoc({ type: 'report', data: report });
                      }}
                      title="Print Diagnostic Report (Letterhead PDF)"
                      className="p-2 bg-[#F0F4F9] hover:bg-[#E8F0FE] text-[#444746] hover:text-[#0B57D0] rounded-full transition shrink-0"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (onSelectReport) onSelectReport(report);
                        setActiveTab('reports');
                      }}
                      className="text-xs bg-[#E8F0FE] text-[#0B57D0] hover:bg-[#D2E3FC] font-bold px-3.5 py-1.5 rounded-full transition whitespace-nowrap shrink-0"
                    >
                      Results
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#74777F]">No reports generated yet</div>
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
                <div className="grid grid-cols-2 gap-3 bg-[#F0F4F9] p-3 rounded-xl border border-[#E0E2EC]">
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
                  <div key={idx} className="border border-[#E0E2EC] rounded-xl overflow-hidden">
                    <div className="bg-[#0B57D0] text-white px-3 py-1 font-bold text-xs uppercase">
                      {t.testName}
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F0F4F9] text-[#444746] border-b border-[#E0E2EC]">
                        <tr>
                          <th className="p-2">Investigation</th>
                          <th className="p-2">Observed Result</th>
                          <th className="p-2">Unit</th>
                          <th className="p-2">Biological Ref. Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E0E2EC]">
                        {(t.results || []).map((r, rIdx) => (
                          <tr key={rIdx} className={r.flag !== 'Normal' ? 'bg-[#FFF8E1] font-semibold' : ''}>
                            <td className="p-2 text-[#1F1F1F]">{r.paramName}</td>
                            <td className="p-2 font-bold text-[#0B57D0]">{r.resultValue || '---'}</td>
                            <td className="p-2 text-[#444746]">{r.unit || '-'}</td>
                            <td className="p-2 text-[#444746]">{r.refRange || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </ReportLetterhead>
          )
        )}
      </PrintModal>

    </div>
  );
}
