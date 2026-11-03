import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ModalPortal from '../components/ModalPortal';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Calendar,
  FileText,
  Receipt,
  X,
  CheckCircle,
  Eye,
  PlusCircle,
  Clock,
  MapPin,
  Heart
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
      
      {/* Top Material Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1F1F] tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span>Patient Registry</span>
          </h1>
          <p className="text-xs text-[#74777F] mt-1">
            Register new patients, manage medical records, and access historical laboratory test files.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Material Search Pill */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              placeholder="Search name, phone, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#F0F4F9] border border-[#E0E2EC] rounded-full text-xs w-64 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B57D0] font-medium"
            />
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm flex items-center space-x-2 transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-[#E0E2EC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#F8FAFD] border-b border-[#E0E2EC] text-[#444746] font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Patient ID</th>
                <th className="py-4 px-6 whitespace-nowrap">Patient Name & Demographics</th>
                <th className="py-4 px-6 whitespace-nowrap">Contact Phone</th>
                <th className="py-4 px-6 whitespace-nowrap">Blood Group</th>
                <th className="py-4 px-6 whitespace-nowrap">Address</th>
                <th className="py-4 px-6 whitespace-nowrap">Visits</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F9] whitespace-nowrap">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#74777F] whitespace-nowrap">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-[#0B57D0] border-t-transparent rounded-full animate-spin" />
                      <span>Loading patient records...</span>
                    </div>
                  </td>
                </tr>
              ) : patients.length > 0 ? (
                patients.map((pat) => (
                  <tr key={pat._id} className="hover:bg-[#F8FAFD] transition">
                    <td className="py-4 px-6 font-mono font-bold text-[#0B57D0] whitespace-nowrap">
                      <span className="inline-block bg-[#E8F0FE] px-2.5 py-1 rounded-full border border-[#D2E3FC] whitespace-nowrap">
                        {pat.patientId}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-[#1F1F1F] text-sm whitespace-nowrap">{pat.name}</div>
                      <div className="text-[11px] text-[#74777F] whitespace-nowrap mt-0.5">
                        {pat.age} {pat.ageUnit} • {pat.gender}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#1F1F1F] whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 whitespace-nowrap">
                        <Phone className="w-3.5 h-3.5 text-[#74777F] shrink-0" />
                        <span className="whitespace-nowrap">{pat.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {pat.bloodGroup ? (
                        <span className="inline-block bg-[#FFDAD6] text-[#93000A] font-bold px-2.5 py-0.5 rounded-full border border-[#FFB4AB] text-[11px] whitespace-nowrap">
                          {pat.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-[#74777F] whitespace-nowrap">---</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#444746] whitespace-nowrap">
                      <span className="whitespace-nowrap">{pat.address || 'Local Saharghat'}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-block bg-[#F0F4F9] text-[#444746] font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-[#E0E2EC] whitespace-nowrap">
                        {pat.totalVisits || 1} visit{pat.totalVisits > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleViewPatientHistory(pat)}
                          className="bg-[#F0F4F9] hover:bg-[#E3E8EF] text-[#444746] font-bold px-3.5 py-1.5 rounded-full text-xs inline-flex items-center space-x-1.5 transition whitespace-nowrap shrink-0"
                          title="View patient history and linked records"
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">History</span>
                        </button>
                        <button
                          onClick={() => onOrderTestsForPatient && onOrderTestsForPatient(pat)}
                          className="bg-[#CEEAD6] hover:bg-[#A8DAB5] text-[#0D652D] font-bold px-4 py-1.5 rounded-full text-xs inline-flex items-center space-x-1.5 transition whitespace-nowrap shrink-0"
                          title="Generate new invoice and order tests"
                        >
                          <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">Order Tests</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#74777F] whitespace-nowrap">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Patient Modal (Material Light Theme) */}
      {showRegisterModal && (
        <ModalPortal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowRegisterModal(false);
            }}
          >
            <div className="bg-white rounded-3xl shadow-m3-4 max-w-lg w-full overflow-hidden border border-[#E0E2EC] my-auto">
            <div className="px-6 py-4 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between text-[#1F1F1F]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#1F1F1F]">Register New Patient</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-full text-[#444746] hover:bg-[#E9EEF6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-2xl bg-[#FFDAD6] text-[#93000A] border border-[#FFB4AB] font-medium">
                  {formError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block font-bold text-[#444746] mb-1">
                  Full Name <span className="text-[#BA1A1A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Jha"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                />
              </div>

              {/* Age, Unit & Gender */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#444746] mb-1">
                    Age <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="125"
                    required
                    placeholder="e.g. 45"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#444746] mb-1">Age Unit</label>
                  <select
                    value={formData.ageUnit}
                    onChange={(e) => setFormData({ ...formData, ageUnit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] font-medium"
                  >
                    <option value="Years">Years</option>
                    <option value="Months">Months</option>
                    <option value="Days">Days</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#444746] mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] font-medium"
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
                  <label className="block font-bold text-[#444746] mb-1">
                    Mobile Number <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98350..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#444746] mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] font-medium"
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
                <label className="block font-bold text-[#444746] mb-1">Address / Village / City</label>
                <input
                  type="text"
                  placeholder="e.g. Ward No. 4, Saharghat, Madhubani"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] font-medium"
                />
              </div>

              {/* Clinical Notes / Symptoms */}
              <div>
                <label className="block font-bold text-[#444746] mb-1">Medical Notes / Symptoms</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Continuous fever, fatigue, joint ache..."
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  className="w-full p-3 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E0E2EC] flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-5 py-2.5 border border-[#C4C7C5] rounded-full text-[#444746] font-bold hover:bg-[#F0F4F9] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold rounded-full shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
    )}

      {/* Patient History Modal (Material Light Theme) */}
      {selectedPatient && (
        <ModalPortal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedPatient(null);
            }}
          >
            <div className="bg-white rounded-3xl shadow-m3-4 max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-[#E0E2EC] my-auto">
            <div className="px-6 py-4 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between text-[#1F1F1F]">
              <div>
                <h3 className="font-bold text-base flex items-center space-x-2 text-[#1F1F1F]">
                  <span>{selectedPatient.name}</span>
                  <span className="text-xs bg-[#C2E7FF] text-[#001D35] px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {selectedPatient.patientId}
                  </span>
                </h3>
                <div className="text-xs text-[#74777F] mt-0.5">
                  {selectedPatient.age} {selectedPatient.ageUnit} • {selectedPatient.gender} • {selectedPatient.phone}
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 text-[#444746] hover:bg-[#E9EEF6] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Profile Card */}
              <div className="bg-[#F0F4F9] p-4 rounded-2xl border border-[#E0E2EC] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#74777F] font-medium block">Address:</span>
                  <span className="font-semibold text-[#1F1F1F]">{selectedPatient.address || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#74777F] font-medium block">Blood Group:</span>
                  <span className="font-bold text-[#BA1A1A]">{selectedPatient.bloodGroup || 'Not Recorded'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#74777F] font-medium block">Known Medical Conditions / Symptoms:</span>
                  <span className="text-[#1F1F1F]">{selectedPatient.medicalHistory || 'None reported'}</span>
                </div>
              </div>

              {/* Linked Reports */}
              <div>
                <h4 className="font-bold text-[#1F1F1F] text-sm mb-2.5 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#137333]" />
                  <span>Diagnostic Lab Reports ({patientHistory?.reports?.length || 0})</span>
                </h4>
                {loadingHistory ? (
                  <div className="text-[#74777F] py-3">Loading reports...</div>
                ) : patientHistory?.reports?.length > 0 ? (
                  <div className="space-y-2">
                    {patientHistory.reports.map((rpt) => (
                      <div key={rpt._id} className="p-3.5 bg-white border border-[#E0E2EC] rounded-2xl flex items-center justify-between shadow-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-[#137333]">{rpt.reportNumber}</span>
                            <span className="bg-[#CEEAD6] text-[#0D652D] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              {rpt.status}
                            </span>
                          </div>
                          <div className="text-[#1F1F1F] font-semibold mt-1">
                            {rpt.tests?.map(t => t.testName).join(', ')}
                          </div>
                          <div className="text-[11px] text-[#74777F]">
                            Doctor: {rpt.referringDoctor || 'Dr. R.K. MANDAL'}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (onViewReport) onViewReport(rpt);
                            setSelectedPatient(null);
                          }}
                          className="bg-[#E8F0FE] text-[#0B57D0] hover:bg-[#D2E3FC] font-bold px-4 py-1.5 rounded-full text-xs transition"
                        >
                          View / Print
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#74777F] py-3 italic">No diagnostic reports on record.</div>
                )}
              </div>

              {/* Linked Invoices */}
              <div>
                <h4 className="font-bold text-[#1F1F1F] text-sm mb-2.5 flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-[#0B57D0]" />
                  <span>Billing Invoices ({patientHistory?.bills?.length || 0})</span>
                </h4>
                {loadingHistory ? (
                  <div className="text-[#74777F] py-3">Loading invoices...</div>
                ) : patientHistory?.bills?.length > 0 ? (
                  <div className="space-y-2">
                    {patientHistory.bills.map((b) => (
                      <div key={b._id} className="p-3.5 bg-white border border-[#E0E2EC] rounded-2xl flex items-center justify-between shadow-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-[#0B57D0]">{b.invoiceNumber}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              b.paymentStatus === 'Paid' ? 'bg-[#CEEAD6] text-[#0D652D]' : 'bg-[#FFDAD6] text-[#93000A]'
                            }`}>
                              {b.paymentStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#74777F] mt-1">
                            Total: ₹{b.grandTotal} • Paid: ₹{b.paidAmount} • Due: ₹{b.dueAmount}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-[#1F1F1F] text-sm">
                          ₹{b.grandTotal}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#74777F] py-3 italic">No billing history on record.</div>
                )}
              </div>

            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFD] border-t border-[#E0E2EC] flex justify-between items-center">
              <button
                onClick={() => {
                  if (onOrderTestsForPatient) onOrderTestsForPatient(selectedPatient);
                  setSelectedPatient(null);
                }}
                className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-5 py-2 rounded-full transition"
              >
                + Create New Bill for Patient
              </button>
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 border border-[#C4C7C5] rounded-full text-[#444746] font-semibold text-xs hover:bg-[#E9EEF6]"
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
