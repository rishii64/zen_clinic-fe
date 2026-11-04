import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ModalPortal from '../components/ModalPortal';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  FileText,
  Receipt,
  X,
  Eye,
  PlusCircle,
  Loader2
} from 'lucide-react';

export default function PatientsPage({ onOrderTestsForPatient, onViewReport }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    ageUnit: 'Years',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalHistory: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.getPatients(searchTerm);
      if (res.success) {
        setPatients(res.patients);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.age || !formData.phone.trim()) {
      setFormError('Name, Age, and Contact Phone number are mandatory.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createPatient(formData);
      if (res.success) {
        setShowRegisterModal(false);
        setFormData({
          name: '',
          age: '',
          ageUnit: 'Years',
          gender: 'Male',
          phone: '',
          email: '',
          address: '',
          bloodGroup: '',
          emergencyContact: '',
          medicalHistory: ''
        });
        fetchPatients();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to register patient');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewPatientHistory = async (patient) => {
    setSelectedPatient(patient);
    try {
      setLoadingHistory(true);
      const res = await api.getPatientById(patient._id);
      if (res.success) {
        setPatientHistory(res.history);
      }
    } catch (err) {
      console.error('Failed to load patient history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span>Patient Registry</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Register new patients, access historical laboratory results, and order diagnostic tests.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search name, phone, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs w-full sm:w-60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Patient ID</th>
                <th className="py-3.5 px-5">Name & Demographics</th>
                <th className="py-3.5 px-5">Contact Phone</th>
                <th className="py-3.5 px-5">Blood Group</th>
                <th className="py-3.5 px-5">Address</th>
                <th className="py-3.5 px-5">Visits</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      <span>Loading patient records...</span>
                    </div>
                  </td>
                </tr>
              ) : patients.length > 0 ? (
                patients.map((pat) => (
                  <tr key={pat._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                      <span className="inline-block bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/40">
                        {pat.patientId}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{pat.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {pat.age} {pat.ageUnit} • {pat.gender}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-700 dark:text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{pat.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      {pat.bloodGroup ? (
                        <span className="inline-block bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/50 text-[11px]">
                          {pat.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">---</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400">
                      <span>{pat.address || '---'}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-2 py-0.5 rounded-md text-[11px]">
                        {pat.totalVisits || 1} visit{pat.totalVisits > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewPatientHistory(pat)}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-3 py-1.5 rounded-xl text-xs inline-flex items-center space-x-1 transition"
                          title="View patient history and linked records"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>History</span>
                        </button>
                        <button
                          onClick={() => onOrderTestsForPatient && onOrderTestsForPatient(pat)}
                          className="bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-1.5 rounded-xl text-xs inline-flex items-center space-x-1 transition"
                          title="Generate new invoice and order tests"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Order Tests</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Patient Modal */}
      {showRegisterModal && (
        <ModalPortal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowRegisterModal(false);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
              <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Register New Patient</h3>
                </div>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="p-5 space-y-4 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
                    {formError}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Age, Unit & Gender */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Age <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="125"
                      required
                      placeholder="e.g. 45"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                    <select
                      value={formData.ageUnit}
                      onChange={(e) => setFormData({ ...formData, ageUnit: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Years">Years</option>
                      <option value="Months">Months</option>
                      <option value="Days">Days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Contact Phone & Blood Group */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98350..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="">Unknown / None</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Address / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Street Address, City"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Clinical Notes / Symptoms */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Medical Notes / Symptoms</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Continuous fever, fatigue, joint ache..."
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    {submitting ? 'Registering...' : 'Register Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Patient History Modal */}
      {selectedPatient && (
        <ModalPortal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedPatient(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center space-x-2 text-slate-900 dark:text-white">
                    <span>{selectedPatient.name}</span>
                    <span className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 px-2 py-0.5 rounded-md font-mono font-semibold">
                      {selectedPatient.patientId}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedPatient.age} {selectedPatient.ageUnit} • {selectedPatient.gender} • {selectedPatient.phone}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-5 text-xs">
                {/* Profile Card */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Address:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.address || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Blood Group:</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">{selectedPatient.bloodGroup || 'Not Recorded'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Medical Conditions / Symptoms:</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedPatient.medicalHistory || 'None reported'}</span>
                  </div>
                </div>

                {/* Linked Reports */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mb-2.5 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Diagnostic Lab Reports ({patientHistory?.reports?.length || 0})</span>
                  </h4>
                  {loadingHistory ? (
                    <div className="text-slate-400 py-3 flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Loading reports...</span>
                    </div>
                  ) : patientHistory?.reports?.length > 0 ? (
                    <div className="space-y-2">
                      {patientHistory.reports.map((rpt) => (
                        <div key={rpt._id} className="p-3 bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-center justify-between shadow-xs">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{rpt.reportNumber}</span>
                              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                {rpt.status}
                              </span>
                            </div>
                            <div className="text-slate-900 dark:text-white font-medium mt-1">
                              {rpt.tests?.map(t => t.testName).join(', ')}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Doctor: {rpt.referringDoctor || 'Attending Physician'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (onViewReport) onViewReport(rpt);
                              setSelectedPatient(null);
                            }}
                            className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold px-3 py-1.5 rounded-xl text-xs transition"
                          >
                            View / Print
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 py-3 italic">No diagnostic reports on record.</div>
                  )}
                </div>

                {/* Linked Invoices */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mb-2.5 flex items-center space-x-2">
                    <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Billing Invoices ({patientHistory?.bills?.length || 0})</span>
                  </h4>
                  {loadingHistory ? (
                    <div className="text-slate-400 py-3 flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Loading invoices...</span>
                    </div>
                  ) : patientHistory?.bills?.length > 0 ? (
                    <div className="space-y-2">
                      {patientHistory.bills.map((b) => (
                        <div key={b._id} className="p-3 bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-center justify-between shadow-xs">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{b.invoiceNumber}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                b.paymentStatus === 'Paid'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              }`}>
                                {b.paymentStatus}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              Total: ₹{b.grandTotal} • Paid: ₹{b.paidAmount} • Due: ₹{b.dueAmount}
                            </div>
                          </div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            ₹{b.grandTotal}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 py-3 italic">No billing history on record.</div>
                  )}
                </div>

              </div>

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => {
                    if (onOrderTestsForPatient) onOrderTestsForPatient(selectedPatient);
                    setSelectedPatient(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition shadow-xs"
                >
                  + Create Bill for Patient
                </button>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

    </div>
  );
}
