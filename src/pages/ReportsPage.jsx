import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Edit3,
  Check,
  AlertTriangle,
  UserCheck,
  X,
  Sparkles,
  Send,
  Eye,
  ShieldCheck
} from 'lucide-react';
import PrintModal from '../components/PrintModal';
import ReportLetterhead from '../components/ReportLetterhead';
import ModalPortal from '../components/ModalPortal';

export default function ReportsPage({ selectedReportFromProps }) {
  const { clinicConfig, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Result Entry / Edit Modal State
  const [activeReport, setActiveReport] = useState(null);
  const [editingTests, setEditingTests] = useState([]);
  const [overallImpression, setOverallImpression] = useState('');
  const [doctorRemarks, setDoctorRemarks] = useState('');
  const [reportStatus, setReportStatus] = useState('In Progress');
  const [savingResults, setSavingResults] = useState(false);

  // Doctor Approval Modal State
  const [approvingReport, setApprovingReport] = useState(null);
  const [approveImpression, setApproveImpression] = useState('');
  const [approveRemarks, setApproveRemarks] = useState('');
  const [processingApprove, setProcessingApprove] = useState(false);

  // Print Report Modal State
  const [printReport, setPrintReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (selectedReportFromProps) {
      handleOpenResultEntry(selectedReportFromProps);
    }
  }, [selectedReportFromProps]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.getReports({ status: statusFilter, search: searchTerm });
      if (res.success) {
        setReports(res.reports);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResultEntry = (report) => {
    setActiveReport(report);
    setEditingTests(JSON.parse(JSON.stringify(report.tests || [])));
    setOverallImpression(report.overallImpression || '');
    setDoctorRemarks(report.doctorRemarks || '');
    setReportStatus(report.status || 'In Progress');
  };

  const handleResultChange = (testIdx, resultIdx, value) => {
    const updated = [...editingTests];
    const item = updated[testIdx].results[resultIdx];
    item.resultValue = value;

    // Auto-flagging logic for numeric tests
    const num = parseFloat(value);
    if (!isNaN(num) && item.refRange) {
      const matchRange = item.refRange.match(/([0-9.]+)\s*-\s*([0-9.]+)/);
      if (matchRange) {
        const min = parseFloat(matchRange[1]);
        const max = parseFloat(matchRange[2]);
        if (num < min) {
          item.flag = 'Low';
        } else if (num > max) {
          item.flag = 'High';
        } else {
          item.flag = 'Normal';
        }
      }
    } else if (value.toLowerCase().includes('positive') || value.toLowerCase().includes('reactive')) {
      item.flag = 'Positive';
    } else if (value.toLowerCase().includes('negative') || value.toLowerCase().includes('non-reactive')) {
      item.flag = 'Normal';
    }

    setEditingTests(updated);
  };

  const handleFlagChange = (testIdx, resultIdx, flag) => {
    const updated = [...editingTests];
    updated[testIdx].results[resultIdx].flag = flag;
    setEditingTests(updated);
  };

  const handleSaveResults = async () => {
    if (!activeReport) return;
    try {
      setSavingResults(true);
      const res = await api.updateReportResults(activeReport._id, {
        tests: editingTests,
        overallImpression,
        doctorRemarks,
        status: reportStatus
      });
      if (res.success) {
        setActiveReport(null);
        fetchReports();
      }
    } catch (err) {
      alert(err.message || 'Failed to save test results');
    } finally {
      setSavingResults(false);
    }
  };

  const handleDoctorApprove = async () => {
    if (!approvingReport) return;
    try {
      setProcessingApprove(true);
      const res = await api.approveReport(approvingReport._id, {
        overallImpression: approveImpression,
        doctorRemarks: approveRemarks
      });
      if (res.success) {
        setApprovingReport(null);
        fetchReports();
        setPrintReport(res.report);
      }
    } catch (err) {
      alert(err.message || 'Failed to approve report');
    } finally {
      setProcessingApprove(false);
    }
  };

  const handleDeliver = async (reportId) => {
    try {
      const res = await api.deliverReport(reportId);
      if (res.success) {
        fetchReports();
      }
    } catch (err) {
      alert(err.message || 'Failed to mark delivered');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1F1F] tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#CEEAD6] text-[#0D652D] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>Diagnostic Report Management</span>
          </h1>
          <p className="text-xs text-[#74777F] mt-1">
            Test findings entry, normal reference range verification, doctor sign-off, and letterhead PDF generation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-[#1F1F1F] bg-[#F0F4F9] px-4 py-2 rounded-full border border-[#E0E2EC]">
            Consultant: <strong className="text-[#0B57D0]">{clinicConfig?.doctorDetails?.name || 'Dr. R.K. MANDAL'}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E0E2EC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Status Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <span className="font-bold text-[#74777F] uppercase text-[11px] mr-1">Status:</span>
          {['All', 'Sample Collected', 'In Progress', 'Completed', 'Approved', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition text-xs whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#C2E7FF] text-[#001D35] border border-[#7FCFFF] shadow-xs'
                  : 'bg-[#F0F4F9] text-[#444746] hover:bg-[#E3E8EF]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            placeholder="Search report #, patient name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#F0F4F9] border border-[#E0E2EC] rounded-full w-72 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B57D0] font-medium"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-[#E0E2EC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#F8FAFD] border-b border-[#E0E2EC] text-[#444746] font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Report #</th>
                <th className="py-4 px-6 whitespace-nowrap">Patient Details</th>
                <th className="py-4 px-6 whitespace-nowrap">Investigations Prescribed</th>
                <th className="py-4 px-6 whitespace-nowrap">Sample Collected</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Current Status</th>
                <th className="py-4 px-6 whitespace-nowrap">Doctor Verification</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F9] whitespace-nowrap">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#74777F] whitespace-nowrap">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-[#0B57D0] border-t-transparent rounded-full animate-spin" />
                      <span>Loading diagnostic reports...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((rpt) => {
                  const isApproved = rpt.status === 'Approved' || rpt.status === 'Delivered';
                  return (
                    <tr key={rpt._id} className="hover:bg-[#F8FAFD] transition">
                      <td className="py-4 px-6 font-mono font-bold text-[#137333] whitespace-nowrap">
                        <span className="inline-block bg-[#E6F4EA] px-2.5 py-1 rounded-full border border-[#CEEAD6] whitespace-nowrap">
                          {rpt.reportNumber}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-[#1F1F1F] text-sm whitespace-nowrap">{rpt.patientSnapshot?.name}</div>
                        <div className="text-[11px] text-[#74777F] font-mono whitespace-nowrap mt-0.5">
                          {rpt.patientSnapshot?.patientId} • {rpt.patientSnapshot?.age} {rpt.patientSnapshot?.ageUnit} / {rpt.patientSnapshot?.gender}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-[#1F1F1F] font-semibold whitespace-nowrap" title={rpt.tests?.map(t => t.testName).join(', ')}>
                          {rpt.tests?.map(t => t.testName).join(', ')}
                        </div>
                        <div className="text-[11px] text-[#74777F] whitespace-nowrap mt-0.5">
                          {rpt.tests?.length || 0} Test panel(s)
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#444746] whitespace-nowrap">
                        {new Date(rpt.sampleCollectedAt || rpt.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                          rpt.status === 'Approved'
                            ? 'bg-[#CEEAD6] text-[#0D652D]'
                            : rpt.status === 'Delivered'
                            ? 'bg-[#E8DEF8] text-[#4A4458]'
                            : rpt.status === 'Completed'
                            ? 'bg-[#D3E3FD] text-[#041E49]'
                            : rpt.status === 'In Progress'
                            ? 'bg-[#FFE082] text-[#8C4A00]'
                            : 'bg-[#F0F4F9] text-[#444746] border border-[#E0E2EC]'
                        }`}>
                          ● {rpt.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#1F1F1F] whitespace-nowrap">
                        {isApproved ? (
                          <div className="flex items-center space-x-1.5 text-[#0D652D] font-semibold text-[11px] whitespace-nowrap">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#137333] shrink-0" />
                            <span>Dr. R.K. MANDAL</span>
                          </div>
                        ) : (
                          <span className="text-[#74777F] text-[11px] italic whitespace-nowrap">Pending Doctor Review</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
                          
                          {/* Enter Results */}
                          <button
                            onClick={() => handleOpenResultEntry(rpt)}
                            className="bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#0B57D0] font-bold px-3.5 py-1.5 rounded-full transition inline-flex items-center space-x-1.5 text-xs whitespace-nowrap shrink-0"
                            title="Enter test findings and parameters"
                          >
                            <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            <span>Results</span>
                          </button>

                          {/* Doctor Approval */}
                          {!isApproved && (
                            <button
                              onClick={() => {
                                setApprovingReport(rpt);
                                setApproveImpression(rpt.overallImpression || '');
                                setApproveRemarks(rpt.doctorRemarks || '');
                              }}
                              className="bg-[#137333] hover:bg-[#0E5826] text-white font-bold px-3.5 py-1.5 rounded-full transition inline-flex items-center space-x-1.5 shadow-sm text-xs whitespace-nowrap shrink-0"
                              title="Doctor verification and signature"
                            >
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Mark Delivered */}
                          {rpt.status === 'Approved' && (
                            <button
                              onClick={() => handleDeliver(rpt._id)}
                              className="bg-[#F0F4F9] hover:bg-[#E3E8EF] text-[#444746] font-bold px-3.5 py-1.5 rounded-full text-xs transition whitespace-nowrap shrink-0"
                              title="Mark as delivered to patient"
                            >
                              Deliver
                            </button>
                          )}

                          {/* Print / Download Button */}
                          <button
                            onClick={() => setPrintReport(rpt)}
                            className="bg-[#F0F4F9] hover:bg-[#CEEAD6] text-[#444746] hover:text-[#0D652D] font-bold p-2 rounded-full transition shrink-0"
                            title="Print Authentic Letterhead PDF Report"
                          >
                            <Printer className="w-4 h-4 shrink-0" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#74777F] whitespace-nowrap">
                    No diagnostic reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEST RESULT ENTRY MODAL (Material Light Theme) */}
      {activeReport && (
        <ModalPortal isOpen={!!activeReport} onClose={() => setActiveReport(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveReport(null);
            }}
          >
            <div className="bg-white rounded-3xl shadow-m3-4 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#E0E2EC] my-auto">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between text-[#1F1F1F]">
              <div>
                <h3 className="font-bold text-base flex items-center space-x-2 text-[#1F1F1F]">
                  <Edit3 className="w-4 h-4 text-[#0B57D0]" />
                  <span>Enter Diagnostic Test Results</span>
                  <span className="font-mono text-xs bg-[#C2E7FF] text-[#001D35] px-2.5 py-0.5 rounded-full font-bold">
                    {activeReport.reportNumber}
                  </span>
                </h3>
                <div className="text-xs text-[#74777F] mt-0.5">
                  Patient: <strong className="text-[#1F1F1F]">{activeReport.patientSnapshot?.name}</strong> • {activeReport.patientSnapshot?.age} {activeReport.patientSnapshot?.ageUnit} / {activeReport.patientSnapshot?.gender}
                </div>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="p-1.5 rounded-full text-[#444746] hover:bg-[#E9EEF6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Parameters Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {editingTests.map((test, tIdx) => (
                <div key={tIdx} className="border border-[#E0E2EC] rounded-2xl overflow-hidden shadow-xs bg-white">
                  <div className="bg-[#F8FAFD] px-4 py-2.5 border-b border-[#E0E2EC] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#0B57D0]">{test.testName}</span>
                      <span className="text-[11px] text-[#74777F] font-mono ml-2">({test.testCode})</span>
                    </div>
                    <span className="bg-white border border-[#E0E2EC] text-[#444746] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                      Specimen: {test.sampleType || 'Venous Blood'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-[#F0F4F9] text-[#444746] text-[11px] font-bold uppercase tracking-wider border-b border-[#E0E2EC] whitespace-nowrap">
                        <tr>
                          <th className="py-2.5 px-3.5 whitespace-nowrap">Test Parameter</th>
                          <th className="py-2.5 px-3.5 w-48 whitespace-nowrap">Observed Result</th>
                          <th className="py-2.5 px-3.5 w-28 whitespace-nowrap">Unit</th>
                          <th className="py-2.5 px-3.5 whitespace-nowrap">Biological Reference Range</th>
                          <th className="py-2.5 px-3.5 text-center w-28 whitespace-nowrap">Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0F4F9] whitespace-nowrap">
                      {(test.results || []).map((param, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#F8FAFD]">
                          <td className="py-2 px-3 font-semibold text-[#1F1F1F]">
                            {param.paramName}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={param.resultValue}
                              onChange={(e) => handleResultChange(tIdx, rIdx, e.target.value)}
                              placeholder="Enter value"
                              className="w-full px-3 py-1.5 border border-[#C4C7C5] rounded-xl font-bold text-[#0B57D0] focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-mono"
                            />
                          </td>
                          <td className="py-2 px-3 font-mono text-[#444746]">
                            {param.unit || '---'}
                          </td>
                          <td className="py-2 px-3 text-[#74777F] font-mono text-[11px]">
                            {param.refRange || 'Clinical Correlation'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <select
                              value={param.flag}
                              onChange={(e) => handleFlagChange(tIdx, rIdx, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                param.flag === 'High'
                                  ? 'bg-[#FFDAD6] text-[#93000A] border-[#FFB4AB]'
                                  : param.flag === 'Low'
                                  ? 'bg-[#FFE082] text-[#8C4A00] border-[#FFD54F]'
                                  : param.flag === 'Positive'
                                  ? 'bg-[#FFDAD6] text-[#93000A] border-[#FFB4AB]'
                                  : 'bg-[#CEEAD6] text-[#0D652D] border-[#A8DAB5]'
                              }`}
                            >
                              <option value="Normal">Normal</option>
                              <option value="High">High</option>
                              <option value="Low">Low</option>
                              <option value="Abnormal">Abnormal</option>
                              <option value="Positive">Positive</option>
                              <option value="Negative">Negative</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

              {/* Impressions and Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1F1F1F] mb-1">
                    Pathological Impression / Summary
                  </label>
                  <textarea
                    rows="3"
                    value={overallImpression}
                    onChange={(e) => setOverallImpression(e.target.value)}
                    placeholder="e.g. Mild Microcytic Hypochromic Anemia. Blood sugar within reference limits."
                    className="w-full p-3 border border-[#C4C7C5] rounded-2xl focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1F1F1F] mb-1">
                    Doctor Advice & Clinical Notes
                  </label>
                  <textarea
                    rows="3"
                    value={doctorRemarks}
                    onChange={(e) => setDoctorRemarks(e.target.value)}
                    placeholder="e.g. Advised Iron and Vitamin B12 supplementation. Repeat CBC in 4 weeks."
                    className="w-full p-3 border border-[#C4C7C5] rounded-2xl focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                  />
                </div>
              </div>

              {/* Status Update Option */}
              <div className="bg-[#F0F4F9] p-3.5 rounded-2xl border border-[#E0E2EC] flex items-center justify-between">
                <span className="font-bold text-[#1F1F1F]">Workflow Progress:</span>
                <select
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                  className="px-3.5 py-1.5 border border-[#C4C7C5] rounded-full font-bold bg-white text-[#1F1F1F]"
                >
                  <option value="In Progress">In Progress (Lab testing underway)</option>
                  <option value="Completed">Completed (Ready for Doctor Review)</option>
                  <option value="Approved">Approved (Doctor verified & signed)</option>
                </select>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-3.5 bg-[#F8FAFD] border-t border-[#E0E2EC] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveReport(null)}
                className="px-5 py-2 border border-[#C4C7C5] rounded-full font-bold text-[#444746] hover:bg-[#E9EEF6]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveResults}
                disabled={savingResults}
                className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-sm transition disabled:opacity-50"
              >
                {savingResults ? 'Saving Results...' : 'Save Test Results'}
              </button>
            </div>

          </div>
        </div>
      </ModalPortal>
    )}

      {/* DOCTOR APPROVAL MODAL (Material Light Theme) */}
      {approvingReport && (
        <ModalPortal isOpen={!!approvingReport} onClose={() => setApprovingReport(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setApprovingReport(null);
            }}
          >
            <div className="bg-white rounded-3xl shadow-m3-4 max-w-lg w-full overflow-hidden border border-[#E0E2EC] my-auto">
            <div className="px-6 py-4 bg-[#E6F4EA] border-b border-[#CEEAD6] flex items-center justify-between text-[#0D652D]">
              <div>
                <h3 className="font-bold text-base flex items-center space-x-2 text-[#0D652D]">
                  <ShieldCheck className="w-5 h-5 text-[#137333]" />
                  <span>Doctor Verification & Sign-Off</span>
                </h3>
                <div className="text-xs text-[#0D652D] mt-0.5">
                  Report #{approvingReport.reportNumber} • Dr. R.K. MANDAL (M.B.B.S, Reg: 18840)
                </div>
              </div>
              <button
                onClick={() => setApprovingReport(null)}
                className="p-1.5 rounded-full text-[#0D652D] hover:bg-[#CEEAD6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-[#E6F4EA]/60 border border-[#CEEAD6] p-3.5 rounded-2xl text-[#0D652D] leading-relaxed">
                By approving, you electronically sign this diagnostic report on behalf of <strong>Dr. R.K. MANDAL, M.B.B.S (Reg. No: 18840)</strong>. The report will be stamped with credentials and released for print.
              </div>

              <div>
                <label className="block font-bold text-[#1F1F1F] mb-1">Final Clinical Impression</label>
                <textarea
                  rows="3"
                  value={approveImpression}
                  onChange={(e) => setApproveImpression(e.target.value)}
                  placeholder="Clinical diagnosis based on findings..."
                  className="w-full p-3 border border-[#C4C7C5] rounded-2xl focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F1F1F] mb-1">Doctor Remarks / Recommendations</label>
                <textarea
                  rows="2"
                  value={approveRemarks}
                  onChange={(e) => setApproveRemarks(e.target.value)}
                  placeholder="Advised clinical correlation, repeat test, diet, or medication..."
                  className="w-full p-3 border border-[#C4C7C5] rounded-2xl focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                />
              </div>

              <div className="pt-3 border-t border-[#E0E2EC] flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setApprovingReport(null)}
                  className="px-5 py-2 border border-[#C4C7C5] rounded-full font-bold text-[#444746] hover:bg-[#F0F4F9]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDoctorApprove}
                  disabled={processingApprove}
                  className="bg-[#137333] hover:bg-[#0E5826] text-white font-bold px-6 py-2 rounded-full shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{processingApprove ? 'Signing...' : 'Approve & Sign Report'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    )}

      {/* PRINT FULL LETTERHEAD PDF REPORT MODAL */}
      <PrintModal
        isOpen={!!printReport}
        onClose={() => setPrintReport(null)}
        title={`Diagnostic Laboratory Report: ${printReport?.reportNumber}`}
        documentType="diagnostic_report"
      >
        {(showLetterhead) => (
          <ReportLetterhead
            config={clinicConfig}
            report={printReport}
            showLetterhead={showLetterhead}
          >
            <div className="space-y-4 text-xs font-sans text-slate-800">
              
              {/* Patient Bar */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-3 rounded-lg border border-slate-300 leading-relaxed">
                <div className="space-y-0.5">
                  <div><strong className="text-slate-500">Patient Name:</strong> <span className="font-bold text-slate-950 text-sm">{printReport?.patientSnapshot?.name}</span></div>
                  <div><strong className="text-slate-500">Patient ID:</strong> <span className="font-mono font-semibold">{printReport?.patientSnapshot?.patientId}</span></div>
                  <div><strong className="text-slate-500">Age / Gender:</strong> {printReport?.patientSnapshot?.age} {printReport?.patientSnapshot?.ageUnit} / {printReport?.patientSnapshot?.gender}</div>
                  <div><strong className="text-slate-500">Phone:</strong> {printReport?.patientSnapshot?.phone}</div>
                </div>

                <div className="text-right space-y-0.5">
                  <div><strong className="text-slate-500">Report No:</strong> <span className="font-mono font-bold text-blue-900">{printReport?.reportNumber}</span></div>
                  <div><strong className="text-slate-500">Ref. Doctor:</strong> <span className="font-semibold text-slate-900">{printReport?.referringDoctor || 'Dr. R.K. MANDAL'}</span></div>
                  <div><strong className="text-slate-500">Sample Date:</strong> {new Date(printReport?.sampleCollectedAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  <div><strong className="text-slate-500">Reporting Date:</strong> {new Date(printReport?.reportedAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              {/* Tests Results Panels */}
              {(printReport?.tests || []).map((testItem, tIdx) => (
                <div key={tIdx} className="border border-slate-300 rounded overflow-hidden mb-4">
                  
                  {/* Test Title Header */}
                  <div className="bg-slate-200 border-b border-slate-300 px-3 py-1.5 flex justify-between items-center">
                    <span className="font-extrabold text-blue-900 uppercase tracking-wide">
                      {testItem.testName}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      Method: {testItem.method || 'Standard Clinical Pathology Method'}
                    </span>
                  </div>

                  {/* Results Table */}
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="py-1.5 px-3">Test Investigation</th>
                        <th className="py-1.5 px-3 w-40">Observed Value</th>
                        <th className="py-1.5 px-3 w-28">Units</th>
                        <th className="py-1.5 px-3 w-44">Biological Ref. Range</th>
                        <th className="py-1.5 px-3 text-center w-20">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(testItem.results || []).map((res, rIdx) => {
                        const isAbnormal = res.flag && res.flag !== 'Normal';
                        return (
                          <tr key={rIdx} className={isAbnormal ? 'bg-amber-50/70' : ''}>
                            <td className="py-1.5 px-3 text-slate-900 font-medium">
                              {res.paramName}
                            </td>
                            <td className="py-1.5 px-3 font-bold font-mono text-slate-950">
                              {res.resultValue || '---'}
                            </td>
                            <td className="py-1.5 px-3 text-slate-600 font-mono text-[11px]">
                              {res.unit || '-'}
                            </td>
                            <td className="py-1.5 px-3 text-slate-600 font-mono text-[11px]">
                              {res.refRange || '-'}
                            </td>
                            <td className="py-1.5 px-3 text-center">
                              {isAbnormal ? (
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                  res.flag === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {res.flag}
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
              {(printReport?.overallImpression || printReport?.doctorRemarks) && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  {printReport.overallImpression && (
                    <div>
                      <strong className="text-slate-900">Impression:</strong>
                      <span className="text-slate-800 ml-1.5">{printReport.overallImpression}</span>
                    </div>
                  )}
                  {printReport.doctorRemarks && (
                    <div>
                      <strong className="text-slate-900">Clinical Advice:</strong>
                      <span className="text-slate-800 ml-1.5">{printReport.doctorRemarks}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Doctor & Technologist Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs page-break-inside-avoid">
                <div>
                  <div className="w-48 border-b border-slate-400 mx-auto pb-4 mb-1">
                    <span className="font-serif italic font-bold text-slate-700">Mr. R.K. Raut</span>
                  </div>
                  <strong className="block text-slate-900">{clinicConfig?.technicianDetails?.name || 'Mr. R.K. Raut'}</strong>
                  <div className="text-[11px] text-slate-600">{clinicConfig?.technicianDetails?.qualifications || '(BMLT) Jaipur'}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Chief Lab Technologist</div>
                </div>

                <div>
                  <div className="w-48 border-b border-slate-400 mx-auto pb-4 mb-1">
                    <span className="font-serif italic font-bold text-blue-900">Dr. R.K. Mandal</span>
                  </div>
                  <strong className="block text-slate-900">{clinicConfig?.doctorDetails?.name || 'Dr. R.K. MANDAL'}</strong>
                  <div className="text-[11px] text-slate-600">{clinicConfig?.doctorDetails?.qualifications || 'M.B.B.S'} (Reg. No: {clinicConfig?.doctorDetails?.regNo || '18840'})</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Consultant Pathologist & Medical Officer</div>
                </div>
              </div>

              {/* End of Report Divider */}
              <div className="text-center pt-4 text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                *** END OF DIAGNOSTIC REPORT ***
              </div>

            </div>
          </ReportLetterhead>
        )}
      </PrintModal>

    </div>
  );
}
