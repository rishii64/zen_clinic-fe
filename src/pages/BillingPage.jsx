import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Receipt,
  PlusCircle,
  Search,
  Printer,
  CreditCard,
  QrCode,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  ChevronRight,
  Percent,
  Check,
  FileText
} from 'lucide-react';
import PrintModal from '../components/PrintModal';
import InvoiceTemplate from '../components/InvoiceTemplate';
import ModalPortal from '../components/ModalPortal';

export default function BillingPage({ preselectedPatient, onGoToReports }) {
  const { clinicConfig, user } = useAuth();
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
  const [payNote, setPayNote] = useState('');
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Print Invoice Modal State
  const [printBill, setPrintBill] = useState(null);

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

  // Live Calculations for Create Bill Form
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
        transactionId: payTxnId,
        note: payNote
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1F1F] tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <span>Diagnostic Billing & Invoices</span>
          </h1>
          <p className="text-xs text-[#74777F] mt-1">
            Prescription test ordering, automated rate lookups, GST & Non-GST modes, payment tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setShowCreateModal(true);
            }}
            className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm flex items-center space-x-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Bill</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E0E2EC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">

        {/* Material Status Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <span className="font-bold text-[#74777F] uppercase text-[11px] mr-1">Status:</span>
          {['All', 'Paid', 'Partially Paid', 'Unpaid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition text-xs ${statusFilter === st
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
            placeholder="Search invoice #, patient, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#F0F4F9] border border-[#E0E2EC] rounded-full w-72 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B57D0] font-medium"
          />
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-3xl border border-[#E0E2EC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#F8FAFD] border-b border-[#E0E2EC] text-[#444746] font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Invoice #</th>
                <th className="py-4 px-6 whitespace-nowrap">Patient Name & ID</th>
                <th className="py-4 px-6 whitespace-nowrap">Tests Ordered</th>
                <th className="py-4 px-6 whitespace-nowrap">Billing Mode</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Grand Total</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Paid</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Due Balance</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Payment Status</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F9] whitespace-nowrap">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-[#74777F] whitespace-nowrap">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-[#0B57D0] border-t-transparent rounded-full animate-spin" />
                      <span>Loading invoices...</span>
                    </div>
                  </td>
                </tr>
              ) : bills.length > 0 ? (
                bills.map((bill) => {
                  const isPaid = bill.paymentStatus === 'Paid';
                  const isPartial = bill.paymentStatus === 'Partially Paid';
                  return (
                    <tr key={bill._id} className="hover:bg-[#F8FAFD] transition">
                      <td className="py-4 px-6 font-mono font-bold text-[#0B57D0] whitespace-nowrap">
                        <span className="inline-block bg-[#E8F0FE] px-2.5 py-1 rounded-full border border-[#D2E3FC] whitespace-nowrap">
                          {bill.invoiceNumber}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-[#1F1F1F] text-sm whitespace-nowrap">{bill.patientSnapshot?.name}</div>
                        <div className="text-[11px] text-[#74777F] font-mono whitespace-nowrap mt-0.5">
                          {bill.patientSnapshot?.patientId} • {bill.patientSnapshot?.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-[#1F1F1F] font-medium whitespace-nowrap" title={bill.items?.map(i => i.testName).join(', ')}>
                          {bill.items?.map(i => i.testName).join(', ')}
                        </div>
                        <div className="text-[10px] text-[#74777F] whitespace-nowrap mt-0.5">
                          {bill.items?.length || 0} item(s) • Ref: {bill.referringDoctor}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${bill.isGstBill ? 'bg-[#E8DEF8] text-[#4A4458] border border-[#CAC4D0]' : 'bg-[#F0F4F9] text-[#444746] border border-[#E0E2EC]'
                          }`}>
                          {bill.isGstBill ? `GST (${bill.gstRate}%)` : 'Non-GST'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-[#1F1F1F] text-sm whitespace-nowrap">
                        ₹{Number(bill.grandTotal).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-semibold text-[#0D652D] whitespace-nowrap">
                        ₹{Number(bill.paidAmount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-[#BA1A1A] whitespace-nowrap">
                        ₹{Number(bill.dueAmount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${isPaid
                          ? 'bg-[#CEEAD6] text-[#0D652D]'
                          : isPartial
                            ? 'bg-[#FFE082] text-[#8C4A00]'
                            : 'bg-[#FFDAD6] text-[#93000A]'
                          }`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
                          {bill.dueAmount > 0 && (
                            <button
                              onClick={() => {
                                setPaymentModalBill(bill);
                                setPaymentAmount(bill.dueAmount);
                              }}
                              className="bg-[#CEEAD6] hover:bg-[#A8DAB5] text-[#0D652D] font-bold px-3.5 py-1.5 rounded-full text-xs transition whitespace-nowrap shrink-0"
                              title="Record cash or UPI payment"
                            >
                              + Pay
                            </button>
                          )}
                          <button
                            onClick={() => setPrintBill(bill)}
                            className="bg-[#F0F4F9] hover:bg-[#E3E8EF] text-[#444746] hover:text-[#0B57D0] font-bold p-2 rounded-full transition shrink-0"
                            title="Print tax-compliant receipt / invoice"
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
                  <td colSpan="9" className="py-12 text-center text-[#74777F] whitespace-nowrap">
                    No diagnostic bills found. Click "Generate New Bill" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GENERATE NEW BILL MODAL (Material Light Theme) */}
      {showCreateModal && (
    <ModalPortal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowCreateModal(false);
        }}
      >
        <div className="bg-white rounded-3xl shadow-m3-4 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#E0E2EC] my-auto">

          {/* Modal Header */}
          <div className="px-6 py-4 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between text-[#1F1F1F]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1F1F1F]">Generate Test-Based Diagnostic Invoice</h3>
                <p className="text-xs text-[#74777F]">
                  Select patient, pick investigations with standard tariff rates, apply GST/discount, and record receipt.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-1.5 rounded-full text-[#444746] hover:bg-[#E9EEF6]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateBillSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">

            {createError && (
              <div className="p-3 bg-[#FFDAD6] text-[#93000A] border border-[#FFB4AB] rounded-2xl font-medium">
                {createError}
              </div>
            )}

            {/* 1. Patient & Doctor Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F0F4F9] p-4 rounded-2xl border border-[#E0E2EC]">
              <div>
                <label className="block font-bold text-[#444746] mb-1">
                  Select Registered Patient <span className="text-[#BA1A1A]">*</span>
                </label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C4C7C5] rounded-2xl focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
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
                <label className="block font-bold text-[#444746] mb-1">Referring Doctor / Consultant</label>
                <input
                  type="text"
                  value={referringDoctor}
                  onChange={(e) => setReferringDoctor(e.target.value)}
                  placeholder="e.g. Dr. R.K. MANDAL"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C4C7C5] rounded-2xl focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                />
              </div>
            </div>

            {/* 2. Diagnostic Test Selection Catalog */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <label className="font-bold text-[#1F1F1F] text-sm flex items-center space-x-2">
                  <span>Select Investigations (From 74-Test Tariff)</span>
                  <span className="bg-[#C2E7FF] text-[#001D35] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    {selectedTestIds.length} Selected
                  </span>
                </label>

                {/* Filter & Search */}
                <div className="flex items-center space-x-2">
                  <select
                    value={testCategoryFilter}
                    onChange={(e) => setTestCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#F0F4F9] border border-[#E0E2EC] rounded-full text-xs font-medium"
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
                    className="px-3 py-1.5 bg-[#F0F4F9] border border-[#E0E2EC] rounded-full text-xs w-36"
                  />
                </div>
              </div>

              {/* Test Selection Grid */}
              <div className="border border-[#E0E2EC] rounded-2xl max-h-56 overflow-y-auto p-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-[#F8FAFD]">
                {filteredModalTests.map((t) => {
                  const isSelected = selectedTestIds.includes(t._id);
                  return (
                    <div
                      key={t._id}
                      onClick={() => handleToggleTest(t._id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between select-none ${isSelected
                        ? 'bg-[#E8F0FE] border-2 border-[#0B57D0] text-[#001D35] shadow-xs'
                        : 'bg-white hover:bg-[#F0F4F9] border-[#E0E2EC] text-[#1F1F1F]'
                        }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-bold text-xs truncate">{t.name}</div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-[#0B57D0]' : 'text-[#74777F]'}`}>
                          {t.code} • {t.category}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`font-mono font-bold ${isSelected ? 'text-[#0B57D0]' : 'text-[#1F1F1F]'}`}>
                          ₹{t.price}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 inline text-[#0B57D0]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Selected Tests Pills */}
            {selectedTests.length > 0 && (
              <div className="bg-[#E8F0FE] border border-[#D2E3FC] rounded-2xl p-3.5">
                <div className="font-bold text-[#0B57D0] mb-2">Prescribed Investigations:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTests.map((t) => (
                    <span
                      key={t._id}
                      className="bg-white border border-[#D2E3FC] text-[#001D35] font-semibold px-3 py-1 rounded-full text-[11px] flex items-center space-x-1.5 shadow-xs"
                    >
                      <span>{t.name} (₹{t.price})</span>
                      <X
                        className="w-3.5 h-3.5 cursor-pointer text-[#74777F] hover:text-[#BA1A1A]"
                        onClick={() => handleToggleTest(t._id)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GST & Discount Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F0F4F9] p-4 rounded-2xl border border-[#E0E2EC]">

              {/* GST Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F1F1F]">GST Billing Mode</span>
                  <button
                    type="button"
                    onClick={() => setIsGstBill(!isGstBill)}
                    className={`px-3.5 py-1 rounded-full font-bold text-xs transition ${isGstBill
                      ? 'bg-[#E8DEF8] text-[#4A4458] border border-[#CAC4D0]'
                      : 'bg-[#E0E2EC] text-[#444746]'
                      }`}
                  >
                    {isGstBill ? 'GST Enabled' : 'Non-GST (Exempt)'}
                  </button>
                </div>

                {isGstBill && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E0E2EC]">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#444746] mb-1">GST Slab Rate</label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-[#C4C7C5] rounded-xl bg-white"
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
                          className="rounded text-[#0B57D0]"
                        />
                        <span className="text-[11px] font-semibold text-[#1F1F1F]">Inter-State (IGST)</span>
                      </label>
                    </div>
                  </div>
                )}
                {!isGstBill && (
                  <p className="text-[11px] text-[#74777F] italic">
                    Standard Diagnostic Health Service GST Exemption applied.
                  </p>
                )}
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <span className="font-bold text-[#1F1F1F] block">Discount Waiver</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex">
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="px-2 py-1.5 border border-r-0 border-[#C4C7C5] rounded-l-xl bg-white"
                    >
                      <option value="flat">₹ Flat</option>
                      <option value="percentage">% Pct</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full px-2 py-1.5 border border-[#C4C7C5] rounded-r-xl"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Reason (e.g. Senior Citizen)"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    className="px-3 py-1.5 border border-[#C4C7C5] rounded-xl"
                  />
                </div>
              </div>

            </div>

            {/* 5. Payment Collection Section */}
            <div className="bg-[#F0F4F9] p-4 rounded-2xl border border-[#E0E2EC] grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#444746] mb-1">Payment Channel</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C4C7C5] rounded-xl bg-white font-medium"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#444746] mb-1">
                  Initial Paid Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder={`Full (₹${grandTotal})`}
                  value={initialPaymentAmount}
                  onChange={(e) => setInitialPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C4C7C5] rounded-xl font-mono font-bold"
                />
                <span className="text-[10px] text-[#74777F]">Leave blank for full advance payment</span>
              </div>

              <div>
                <label className="block font-bold text-[#444746] mb-1">Transaction Ref #</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref ID / Card Txn"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C4C7C5] rounded-xl font-mono"
                />
              </div>
            </div>

            {/* 6. Material 3 Tonal Price Preview Bar */}
            <div className="bg-[#E8F0FE] border border-[#D2E3FC] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-[#1F1F1F]">
              <div className="space-x-4 text-xs font-medium">
                <span>Subtotal: <strong className="font-mono text-[#0B57D0]">₹{subtotal}</strong></span>
                {discountAmount > 0 && <span>Discount: <strong className="font-mono text-[#BA1A1A]">-₹{discountAmount}</strong></span>}
                {isGstBill && <span>GST: <strong className="font-mono text-[#6750A4]">+₹{(cgstAmount + sgstAmount + igstAmount).toFixed(2)}</strong></span>}
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-[#74777F]">Net Payable:</span>
                  <div className="text-xl font-black font-mono text-[#0B57D0]">₹{grandTotal.toFixed(2)}</div>
                </div>

                <button
                  type="submit"
                  disabled={creatingBill || selectedTestIds.length === 0}
                  className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-sm transition disabled:opacity-50"
                >
                  {creatingBill ? 'Generating...' : 'Confirm & Generate Invoice'}
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    </ModalPortal>
  )
}

{/* RECORD PAYMENT MODAL (Material Light Theme) */ }
{
  paymentModalBill && (
    <ModalPortal isOpen={!!paymentModalBill} onClose={() => setPaymentModalBill(null)}>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) setPaymentModalBill(null);
        }}
      >
        <div className="bg-white rounded-3xl shadow-m3-4 max-w-md w-full overflow-hidden border border-[#E0E2EC] my-auto">
          <div className="px-6 py-4 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between text-[#1F1F1F]">
            <div>
              <h3 className="font-bold text-sm text-[#1F1F1F]">Record Payment</h3>
              <div className="text-xs text-[#0B57D0] font-mono font-bold">{paymentModalBill.invoiceNumber}</div>
            </div>
            <button
              onClick={() => setPaymentModalBill(null)}
              className="p-1.5 rounded-full text-[#444746] hover:bg-[#E9EEF6]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
            <div className="bg-[#F0F4F9] p-3.5 rounded-2xl border border-[#E0E2EC] flex justify-between">
              <div>
                <span className="text-[#74777F] block">Patient:</span>
                <strong className="text-[#1F1F1F] text-sm">{paymentModalBill.patientSnapshot?.name}</strong>
              </div>
              <div className="text-right">
                <span className="text-[#74777F] block">Pending Due:</span>
                <strong className="text-[#BA1A1A] font-mono text-sm">₹{paymentModalBill.dueAmount}</strong>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">
                Payment Amount (₹) <span className="text-[#BA1A1A]">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max={paymentModalBill.dueAmount}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl font-mono font-bold text-sm bg-[#F8FAFD] focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Payment Channel</label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Card">Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Transaction Ref / Note</label>
              <input
                type="text"
                placeholder="e.g. UPI Ref # 92384..."
                value={payTxnId}
                onChange={(e) => setPayTxnId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setPaymentModalBill(null)}
                className="px-5 py-2 border border-[#C4C7C5] rounded-full font-bold text-[#444746] hover:bg-[#F0F4F9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={recordingPayment}
                className="px-5 py-2 bg-[#137333] hover:bg-[#0E5826] text-white font-bold rounded-full shadow-sm transition disabled:opacity-50"
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

    </div>
  );
}
