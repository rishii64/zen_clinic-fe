import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Receipt,
  PlusCircle,
  Search,
  Printer,
  Check,
  X,
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import PrintModal from '../components/PrintModal';
import InvoiceTemplate from '../components/InvoiceTemplate';
import ModalPortal from '../components/ModalPortal';

export default function BillingPage({ preselectedPatient, onGoToReports }) {
  const { clinicConfig } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // New Bill Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [patientsList, setPatientsList] = useState([]);
  const [testsList, setTestsList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [referringDoctor, setReferringDoctor] = useState(clinicConfig?.doctorDetails?.name || '');
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [testSearch, setTestSearch] = useState('');
  const [testCategoryFilter, setTestCategoryFilter] = useState('All');

  // Discount & GST Settings on Bill
  const [discountType, setDiscountType] = useState('flat');
  const [discountValue, setDiscountValue] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [isGstBill, setIsGstBill] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [isInterState, setIsInterState] = useState(false);

  // Initial Payment on Bill
  const [initialPaymentAmount, setInitialPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [billingNotes, setBillingNotes] = useState('');
  const [creatingBill, setCreatingBill] = useState(false);
  const [createError, setCreateError] = useState('');

  // Add Payment Modal State
  const [paymentModalBill, setPaymentModalBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI');
  const [payTxnId, setPayTxnId] = useState('');
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Print Invoice Modal State
  const [printBill, setPrintBill] = useState(null);

  // Delete Bill State
  const [deletingBill, setDeletingBill] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBills();
    fetchPatientsAndTests();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (preselectedPatient) {
      setSelectedPatientId(preselectedPatient._id);
      setShowCreateModal(true);
    }
  }, [preselectedPatient]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.getBills({ status: statusFilter, search: searchTerm });
      if (res.success) {
        setBills(res.bills);
      }
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async () => {
    if (!deletingBill) return;
    try {
      setDeleting(true);
      await api.deleteBill(deletingBill._id);
      setDeletingBill(null);
      fetchBills();
    } catch (err) {
      alert(err.message || 'Failed to delete bill');
    } finally {
      setDeleting(false);
    }
  };

  const fetchPatientsAndTests = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        api.getPatients(''),
        api.getTests({ activeOnly: 'true' })
      ]);
      if (pRes.success) setPatientsList(pRes.patients);
      if (tRes.success) setTestsList(tRes.tests);
    } catch (err) {
      console.error('Error fetching patients/tests for billing:', err);
    }
  };

  // Calculations for Create Bill Form
  const selectedTests = testsList.filter(t => selectedTestIds.includes(t._id));
  const subtotal = selectedTests.reduce((acc, t) => acc + (t.price || 0), 0);

  let discountAmount = 0;
  const dVal = Number(discountValue || 0);
  if (discountType === 'percentage') {
    discountAmount = Math.round((subtotal * Math.min(100, Math.max(0, dVal))) / 100);
  } else {
    discountAmount = Math.min(subtotal, Math.max(0, dVal));
  }
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  if (isGstBill) {
    if (isInterState) {
      igstAmount = Number(((taxableAmount * gstRate) / 100).toFixed(2));
    } else {
      cgstAmount = Number(((taxableAmount * (gstRate / 2)) / 100).toFixed(2));
      sgstAmount = Number(((taxableAmount * (gstRate / 2)) / 100).toFixed(2));
    }
  }
  const grandTotal = Number((taxableAmount + cgstAmount + sgstAmount + igstAmount).toFixed(2));

  const handleToggleTest = (testId) => {
    if (selectedTestIds.includes(testId)) {
      setSelectedTestIds(selectedTestIds.filter(id => id !== testId));
    } else {
      setSelectedTestIds([...selectedTestIds, testId]);
    }
  };

  const handleCreateBillSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!selectedPatientId) {
      setCreateError('Please select a patient.');
      return;
    }
    if (selectedTestIds.length === 0) {
      setCreateError('Please select at least one diagnostic test.');
      return;
    }

    try {
      setCreatingBill(true);
      const payload = {
        patientId: selectedPatientId,
        referringDoctor,
        testIds: selectedTestIds,
        discountType,
        discountValue: Number(discountValue || 0),
        discountReason,
        isGstBill,
        customGstRate: Number(gstRate),
        isInterState,
        initialPaymentAmount: initialPaymentAmount === '' ? grandTotal : Number(initialPaymentAmount),
        paymentMode,
        transactionId,
        notes: billingNotes
      };

      const res = await api.createBill(payload);
      if (res.success) {
        setShowCreateModal(false);
        setSelectedTestIds([]);
        setDiscountValue(0);
        setInitialPaymentAmount('');
        setBillingNotes('');
        fetchBills();
        setPrintBill(res.bill);
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create invoice');
    } finally {
      setCreatingBill(false);
    }
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) return;

    try {
      setRecordingPayment(true);
      const res = await api.addPayment(paymentModalBill._id, {
        amount: Number(paymentAmount),
        mode: payMode,
        transactionId: payTxnId
      });
      if (res.success) {
        setPaymentModalBill(null);
        setPaymentAmount('');
        setPayTxnId('');
        fetchBills();
      }
    } catch (err) {
      alert(err.message || 'Payment recording failed');
    } finally {
      setRecordingPayment(false);
    }
  };

  const filteredModalTests = testsList.filter(t => {
    const matchesCat = testCategoryFilter === 'All' || t.category === testCategoryFilter;
    const matchesSearch = !testSearch || t.name.toLowerCase().includes(testSearch.toLowerCase()) || t.code.toLowerCase().includes(testSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <span>Diagnostic Invoices & Billing</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Investigation order entry, automatic tariff lookup, GST compliance, and payment settlement.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Bill</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">

        {/* Status Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase text-[10px] mr-1">Status:</span>
          {['All', 'Paid', 'Partially Paid', 'Unpaid'].map((st) => (
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

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search invoice #, patient, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs w-full md:w-64 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Invoice #</th>
                <th className="py-3.5 px-5">Patient & ID</th>
                <th className="py-3.5 px-5">Investigations</th>
                <th className="py-3.5 px-5">Billing Mode</th>
                <th className="py-3.5 px-5 text-right">Total</th>
                <th className="py-3.5 px-5 text-right">Paid</th>
                <th className="py-3.5 px-5 text-right">Due</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      <span>Loading invoices...</span>
                    </div>
                  </td>
                </tr>
              ) : bills.length > 0 ? (
                bills.map((bill) => {
                  const isPaid = bill.paymentStatus === 'Paid';
                  const isPartial = bill.paymentStatus === 'Partially Paid';
                  return (
                    <tr key={bill._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                        <span className="inline-block bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/40">
                          {bill.invoiceNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{bill.patientSnapshot?.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {bill.patientSnapshot?.patientId} • {bill.patientSnapshot?.phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 max-w-xs truncate">
                        <div className="text-slate-800 dark:text-slate-200 font-medium truncate" title={bill.items?.map(i => i.testName).join(', ')}>
                          {bill.items?.map(i => i.testName).join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {bill.items?.length || 0} item(s) • Ref: {bill.referringDoctor || 'Attending Physician'}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md ${
                          bill.isGstBill
                            ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900/50'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {bill.isGstBill ? `GST (${bill.gstRate}%)` : 'Non-GST'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{Number(bill.grandTotal).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        ₹{Number(bill.paidAmount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        ₹{Number(bill.dueAmount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : isPartial
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {bill.dueAmount > 0 && (
                            <button
                              onClick={() => {
                                setPaymentModalBill(bill);
                                setPaymentAmount(bill.dueAmount);
                              }}
                              className="bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold px-2.5 py-1 rounded-lg text-xs transition"
                              title="Record payment"
                            >
                              + Pay
                            </button>
                          )}
                          <button
                            onClick={() => setPrintBill(bill)}
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition"
                            title="Print tax-compliant receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingBill(bill)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Delete invoice"
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
                  <td colSpan="9" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No diagnostic bills found. Click "Generate New Bill" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GENERATE NEW BILL MODAL */}
      {showCreateModal && (
        <ModalPortal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreateModal(false);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">

              {/* Modal Header */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Generate Diagnostic Invoice</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Select patient, pick tests, set GST/discount, and record receipt.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateBillSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">

                {createError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl font-medium">
                    {createError}
                  </div>
                )}

                {/* 1. Patient & Doctor Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Select Patient <span className="text-rose-600">*</span>
                    </label>
                    <select
                      required
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="">-- Choose Patient --</option>
                      {patientsList.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.patientId}) - {p.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Referring Doctor</label>
                    <input
                      type="text"
                      value={referringDoctor}
                      onChange={(e) => setReferringDoctor(e.target.value)}
                      placeholder="e.g. Dr. R.K. MANDAL"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                {/* 2. Diagnostic Test Selection Catalog */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <label className="font-semibold text-slate-900 dark:text-white text-xs flex items-center space-x-2">
                      <span>Select Investigations</span>
                      <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                        {selectedTestIds.length} Selected
                      </span>
                    </label>

                    {/* Filter & Search */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={testCategoryFilter}
                        onChange={(e) => setTestCategoryFilter(e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300"
                      >
                        <option value="All">All Categories</option>
                        <option value="Hematology">Hematology</option>
                        <option value="Biochemistry">Biochemistry</option>
                        <option value="Liver Function">Liver Function (LFT)</option>
                        <option value="Kidney & Renal">Kidney & Renal (KFT)</option>
                        <option value="Lipid & Cardiac">Lipid & Cardiac</option>
                        <option value="Endocrine & Thyroid">Thyroid & Hormones</option>
                        <option value="Serology & Immunology">Serology & Widal</option>
                        <option value="Card Tests">Card Rapid Tests</option>
                        <option value="Clinical Pathology">Urine / Stool / Sputum</option>
                        <option value="Radiology & Diagnostic">USG & ECG</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Search test..."
                        value={testSearch}
                        onChange={(e) => setTestSearch(e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs w-32 text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Test Selection Grid */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl max-h-52 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-50/50 dark:bg-slate-950/40">
                    {filteredModalTests.map((t) => {
                      const isSelected = selectedTestIds.includes(t._id);
                      return (
                        <div
                          key={t._id}
                          onClick={() => handleToggleTest(t._id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between select-none ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 shadow-xs'
                              : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="font-semibold text-xs truncate">{t.name}</div>
                            <div className={`text-[10px] truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                              {t.code} • {t.category}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={`font-mono font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                              ₹{t.price}
                            </div>
                            {isSelected && <Check className="w-3 h-3 inline text-blue-600 dark:text-blue-400" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Selected Tests Pills */}
                {selectedTests.length > 0 && (
                  <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3">
                    <div className="font-semibold text-blue-700 dark:text-blue-300 text-xs mb-1.5">Selected Investigations:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTests.map((t) => (
                        <span
                          key={t._id}
                          className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200 font-medium px-2.5 py-0.5 rounded-lg text-[11px] flex items-center space-x-1"
                        >
                          <span>{t.name} (₹{t.price})</span>
                          <X
                            className="w-3 h-3 cursor-pointer text-slate-400 hover:text-rose-600"
                            onClick={() => handleToggleTest(t._id)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. GST & Discount Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">

                  {/* GST Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">GST Billing Mode</span>
                      <button
                        type="button"
                        onClick={() => setIsGstBill(!isGstBill)}
                        className={`px-3 py-1 rounded-lg font-medium text-xs transition ${
                          isGstBill
                            ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isGstBill ? 'GST Enabled' : 'Non-GST (Exempt)'}
                      </button>
                    </div>

                    {isGstBill && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">GST Rate</label>
                          <select
                            value={gstRate}
                            onChange={(e) => setGstRate(Number(e.target.value))}
                            className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="5">5% (2.5% CGST + 2.5% SGST)</option>
                            <option value="12">12% (6% CGST + 6% SGST)</option>
                            <option value="18">18% (9% CGST + 9% SGST)</option>
                          </select>
                        </div>

                        <div className="flex items-center pt-4">
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isInterState}
                              onChange={(e) => setIsInterState(e.target.checked)}
                              className="rounded text-blue-600"
                            />
                            <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200">Inter-State (IGST)</span>
                          </label>
                        </div>
                      </div>
                    )}
                    {!isGstBill && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                        Standard Diagnostic Pathology Exemption applied.
                      </p>
                    )}
                  </div>

                  {/* Discount */}
                  <div className="space-y-2">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">Discount Waiver</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex">
                        <select
                          value={discountType}
                          onChange={(e) => setDiscountType(e.target.value)}
                          className="px-2 py-1 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                        >
                          <option value="flat">₹ Flat</option>
                          <option value="percentage">%</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-r-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Reason"
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                  </div>

                </div>

                {/* 5. Payment Collection Section */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI / QR Code</option>
                      <option value="Card">Debit / Credit Card</option>
                      <option value="Net Banking">Net Banking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Initial Paid Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder={`Full (₹${grandTotal})`}
                      value={initialPaymentAmount}
                      onChange={(e) => setInitialPaymentAmount(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400">Leave blank for full advance payment</span>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Transaction Ref #</label>
                    <input
                      type="text"
                      placeholder="e.g. UPI Ref / Txn ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* 6. Price Summary & Submit Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <span>Subtotal: <strong className="font-mono text-slate-900 dark:text-white">₹{subtotal}</strong></span>
                    {discountAmount > 0 && <span>Discount: <strong className="font-mono text-rose-600">-₹{discountAmount}</strong></span>}
                    {isGstBill && <span>GST: <strong className="font-mono text-violet-600">+₹{(cgstAmount + sgstAmount + igstAmount).toFixed(2)}</strong></span>}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Net Payable:</span>
                      <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">₹{grandTotal.toFixed(2)}</div>
                    </div>

                    <button
                      type="submit"
                      disabled={creatingBill || selectedTestIds.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-xs transition disabled:opacity-50"
                    >
                      {creatingBill ? 'Generating...' : 'Confirm & Generate'}
                    </button>
                  </div>
                </div>

              </form>

            </div>
          </div>
        </ModalPortal>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalBill && (
        <ModalPortal isOpen={!!paymentModalBill} onClose={() => setPaymentModalBill(null)}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPaymentModalBill(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Record Payment</h3>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold">{paymentModalBill.invoiceNumber}</div>
                </div>
                <button
                  onClick={() => setPaymentModalBill(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="p-5 space-y-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex justify-between">
                  <div>
                    <span className="text-slate-400 block">Patient:</span>
                    <strong className="text-slate-900 dark:text-white">{paymentModalBill.patientSnapshot?.name}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Pending Due:</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-mono text-sm">₹{paymentModalBill.dueAmount}</strong>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Payment Amount (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={paymentModalBill.dueAmount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Transaction Ref / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI Ref # 92384..."
                    value={payTxnId}
                    onChange={(e) => setPayTxnId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalBill(null)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recordingPayment}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    {recordingPayment ? 'Recording...' : 'Accept Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* PRINT INVOICE MODAL */}
      <PrintModal
        isOpen={!!printBill}
        onClose={() => setPrintBill(null)}
        title={`Tax Invoice Receipt: ${printBill?.invoiceNumber}`}
        documentType="invoice"
      >
        {(showLetterhead) => (
          <InvoiceTemplate bill={printBill} config={clinicConfig} showLetterhead={showLetterhead} />
        )}
      </PrintModal>

      {/* Delete Invoice Confirmation Modal */}
      {deletingBill && (
        <ModalPortal isOpen={!!deletingBill} onClose={() => setDeletingBill(null)}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingBill(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-auto p-5 space-y-4">
              <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Delete Invoice Receipt</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div>Are you sure you want to delete Invoice:</div>
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">#{deletingBill.invoiceNumber}</div>
                <div>Patient: <strong className="text-slate-900 dark:text-white">{deletingBill.patientSnapshot?.name}</strong></div>
                <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">Amount: ₹{Number(deletingBill.grandTotal || 0).toFixed(2)} • Status: {deletingBill.paymentStatus}</div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingBill(null)}
                  disabled={deleting}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteBill}
                  disabled={deleting}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? 'Deleting...' : 'Delete Invoice'}</span>
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

    </div>
  );
}
