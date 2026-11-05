import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Search,
  Printer,
  Edit3,
  Check,
  X,
  ShieldCheck,
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import PrintModal from '../components/PrintModal';
import ReportLetterhead from '../components/ReportLetterhead';
import DiagnosticReportView from '../components/DiagnosticReportView';
import ModalPortal from '../components/ModalPortal';
import { evaluateResultFlag, generateMedicalImpression } from '../data/reportTemplates';

export default function ReportsPage({ selectedReportFromProps }) {
  const { clinicConfig } = useAuth();
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

  // Delete Report State
  const [deletingReport, setDeletingReport] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteReport = async () => {
    if (!deletingReport) return;
    try {
      setDeleting(true);
      await api.deleteReport(deletingReport._id);
      setDeletingReport(null);
      fetchReports();
    } catch (err) {
      alert(err.message || 'Failed to delete report');
    } finally {
      setDeleting(false);
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
    item.flag = evaluateResultFlag(value, item.refRange);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>Diagnostic Report Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Parameter result entry, reference range verification, doctor review, and letterhead PDF printing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
            Consultant: <strong className="text-blue-600 dark:text-blue-400">{clinicConfig?.doctorDetails?.name || 'Dr. R.K. MANDAL'}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Status Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase text-[10px] mr-1">Status:</span>
          {['All', 'Sample Collected', 'In Progress', 'Completed', 'Approved', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl font-medium transition text-xs whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/40 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search report #, patient name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs w-full md:w-64 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Report #</th>
                <th className="py-3.5 px-5">Patient Details</th>
                <th className="py-3.5 px-5">Investigations</th>
                <th className="py-3.5 px-5">Sample Collected</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5">Doctor Verification</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      <span>Loading diagnostic reports...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((rpt) => {
                  const isApproved = rpt.status === 'Approved' || rpt.status === 'Delivered';
                  return (
                    <tr key={rpt._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="inline-block bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/40">
                          {rpt.reportNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{rpt.patientSnapshot?.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {rpt.patientSnapshot?.patientId} • {rpt.patientSnapshot?.age} {rpt.patientSnapshot?.ageUnit} / {rpt.patientSnapshot?.gender}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 max-w-xs truncate">
                        <div className="text-slate-800 dark:text-slate-200 font-medium truncate" title={rpt.tests?.map(t => t.testName).join(', ')}>
                          {rpt.tests?.map(t => t.testName).join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {rpt.tests?.length || 0} Test panel(s)
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400">
                        {new Date(rpt.sampleCollectedAt || rpt.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          rpt.status === 'Approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : rpt.status === 'Delivered'
                            ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                            : rpt.status === 'Completed'
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : rpt.status === 'In Progress'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          ● {rpt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-800 dark:text-slate-200">
                        {isApproved ? (
                          <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-300 font-medium text-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Dr. R.K. MANDAL</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Pending Doctor Review</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Enter Results */}
                          <button
                            onClick={() => handleOpenResultEntry(rpt)}
                            className="bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-semibold px-2.5 py-1 rounded-lg transition inline-flex items-center space-x-1 text-xs"
                            title="Enter findings"
                          >
                            <Edit3 className="w-3 h-3" />
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
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg transition inline-flex items-center space-x-1 shadow-xs text-xs"
                              title="Doctor sign-off"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Mark Delivered */}
                          {rpt.status === 'Approved' && (
                            <button
                              onClick={() => handleDeliver(rpt._id)}
                              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-2.5 py-1 rounded-lg text-xs transition"
                              title="Mark delivered"
                            >
                              Deliver
                            </button>
                          )}

                          {/* Print / Download Button */}
                          <button
                            onClick={() => setPrintReport(rpt)}
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition"
                            title="Print Letterhead PDF Report"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Report Button */}
                          <button
                            onClick={() => setDeletingReport(rpt)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Delete diagnostic report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No diagnostic reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEST RESULT ENTRY MODAL */}
      {activeReport && (
        <ModalPortal isOpen={!!activeReport} onClose={() => setActiveReport(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveReport(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
            
              {/* Header */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center space-x-2 text-slate-900 dark:text-white">
                    <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Enter Diagnostic Test Results</span>
                    <span className="font-mono text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md font-semibold">
                      {activeReport.reportNumber}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Patient: <strong className="text-slate-800 dark:text-slate-200">{activeReport.patientSnapshot?.name}</strong> • {activeReport.patientSnapshot?.age} {activeReport.patientSnapshot?.ageUnit} / {activeReport.patientSnapshot?.gender}
                  </div>
                </div>
                <button
                  onClick={() => setActiveReport(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Test Parameters Form */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                
                {editingTests.map((test, tIdx) => (
                  <div key={tIdx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs sm:text-sm text-blue-600 dark:text-blue-400">{test.testName}</span>
                        <span className="text-[11px] text-slate-400 font-mono ml-2">({test.testCode})</span>
                      </div>
                      <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-medium">
                        Specimen: {test.sampleType || 'Venous Blood'}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50/60 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3.5">Parameter</th>
                            <th className="py-2.5 px-3.5 w-44">Observed Result</th>
                            <th className="py-2.5 px-3.5 w-24">Unit</th>
                            <th className="py-2.5 px-3.5">Biological Ref. Range</th>
                            <th className="py-2.5 px-3.5 text-center w-28">Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {(test.results || []).map((param, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-2 px-3.5 font-medium text-slate-900 dark:text-white">
                              {param.paramName}
                            </td>
                            <td className="py-2 px-3.5">
                              <input
                                type="text"
                                value={param.resultValue}
                                onChange={(e) => handleResultChange(tIdx, rIdx, e.target.value)}
                                placeholder="Value"
                                className="w-full px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                              />
                            </td>
                            <td className="py-2 px-3.5 font-mono text-slate-500 dark:text-slate-400">
                              {param.unit || '---'}
                            </td>
                            <td className="py-2 px-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                              {param.refRange || 'Clinical Correlation'}
                            </td>
                            <td className="py-2 px-3.5 text-center">
                              <select
                                value={param.flag}
                                onChange={(e) => handleFlagChange(tIdx, rIdx, e.target.value)}
                                className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${
                                  param.flag === 'High'
                                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                    : param.flag === 'Low'
                                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                    : param.flag === 'Positive'
                                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-medium text-slate-800 dark:text-slate-200">
                        Pathological Impression / Summary
                      </label>
                      <button
                        type="button"
                        onClick={() => setOverallImpression(generateMedicalImpression(editingTests))}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        title="Auto-suggest medical impression based on tested parameters"
                      >
                        ⚡ Auto-Suggest
                      </button>
                    </div>
                    <textarea
                      rows="3"
                      value={overallImpression}
                      onChange={(e) => setOverallImpression(e.target.value)}
                      placeholder="e.g. Mild Microcytic Hypochromic Anemia. Blood sugar within reference limits."
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
                      Doctor Advice & Clinical Notes
                    </label>
                    <textarea
                      rows="3"
                      value={doctorRemarks}
                      onChange={(e) => setDoctorRemarks(e.target.value)}
                      placeholder="e.g. Advised Iron and Vitamin B12 supplementation. Repeat CBC in 4 weeks."
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                </div>

                {/* Status Update Option */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Pipeline Status:</span>
                  <select
                    value={reportStatus}
                    onChange={(e) => setReportStatus(e.target.value)}
                    className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="In Progress">In Progress (Lab testing underway)</option>
                    <option value="Completed">Completed (Ready for Doctor Review)</option>
                    <option value="Approved">Approved (Doctor verified & signed)</option>
                  </select>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveResults}
                  disabled={savingResults}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {savingResults ? 'Saving Results...' : 'Save Results'}
                </button>
              </div>

            </div>
          </div>
        </ModalPortal>
      )}

      {/* DOCTOR APPROVAL MODAL */}
      {approvingReport && (
        <ModalPortal isOpen={!!approvingReport} onClose={() => setApprovingReport(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setApprovingReport(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
              <div className="px-5 py-3.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-200">
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Doctor Verification & Sign-Off</span>
                  </h3>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Report #{approvingReport.reportNumber} • Dr. R.K. MANDAL (M.B.B.S, Reg: 18840)
                  </div>
                </div>
                <button
                  onClick={() => setApprovingReport(null)}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800 p-3 rounded-xl text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  By approving, you electronically sign this diagnostic report on behalf of <strong>Dr. R.K. MANDAL, M.B.B.S (Reg. No: 18840)</strong>. The report will be stamped with credentials and released for print.
                </div>

                <div>
                  <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">Final Clinical Impression</label>
                  <textarea
                    rows="3"
                    value={approveImpression}
                    onChange={(e) => setApproveImpression(e.target.value)}
                    placeholder="Clinical diagnosis based on findings..."
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">Doctor Remarks / Recommendations</label>
                  <textarea
                    rows="2"
                    value={approveRemarks}
                    onChange={(e) => setApproveRemarks(e.target.value)}
                    placeholder="Advised clinical correlation, repeat test, diet, or medication..."
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setApprovingReport(null)}
                    className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDoctorApprove}
                    disabled={processingApprove}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-1.5 rounded-xl shadow-xs transition disabled:opacity-50 flex items-center space-x-1.5"
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
        reportNumber={printReport?.reportNumber}
      >
        {(showLetterhead) => (
          <DiagnosticReportView
            report={printReport}
            clinicConfig={clinicConfig}
            showLetterhead={showLetterhead}
          />
        )}
      </PrintModal>

      {/* Delete Report Confirmation Modal */}
      {deletingReport && (
        <ModalPortal isOpen={!!deletingReport} onClose={() => setDeletingReport(null)}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingReport(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-auto p-5 space-y-4">
              <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Delete Diagnostic Report</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div>Are you sure you want to delete Diagnostic Report:</div>
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">#{deletingReport.reportNumber}</div>
                <div>Patient: <strong className="text-slate-900 dark:text-white">{deletingReport.patientSnapshot?.name}</strong></div>
                <div className="text-slate-500 dark:text-slate-400">Tests: {(deletingReport.tests || []).map(t => t.testName).join(', ')}</div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingReport(null)}
                  disabled={deleting}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteReport}
                  disabled={deleting}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? 'Deleting...' : 'Delete Report'}</span>
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

    </div>
  );
}
