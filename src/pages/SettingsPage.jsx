import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Building2,
  Stethoscope,
  Receipt,
  FileText,
  Save,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const { clinicConfig, reloadConfig, user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (clinicConfig) {
      setFormData(JSON.parse(JSON.stringify(clinicConfig)));
    }
  }, [clinicConfig]);

  if (!formData) {
    return <div className="p-8 text-center text-[#74777F]">Loading clinic configuration...</div>;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateConfig(formData);
      if (res.success) {
        setSaveSuccess(true);
        reloadConfig();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update clinic configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1F1F] tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span>Clinic Branding & Tax Configuration</span>
          </h1>
          <p className="text-xs text-[#74777F] mt-1">
            Configure clinic letterhead branding, doctor credentials, GST parameters, disclaimers, and invoice prefixes.
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-[#CEEAD6] text-[#0D652D] font-bold text-xs px-4 py-2 rounded-full border border-[#A8DAB5] flex items-center space-x-1.5 shadow-xs">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* 1. Clinic Branding & Identity */}
        <div className="bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#E0E2EC] pb-3.5">
            <Building2 className="w-5 h-5 text-[#0B57D0]" />
            <h2 className="text-sm font-bold text-[#1F1F1F]">Clinic Identity & Letterhead Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#444746] mb-1">Clinic Name (Header Banner)</label>
              <input
                type="text"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl font-bold text-[#1F1F1F] focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Registration Number Badge</label>
              <input
                type="text"
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl font-mono focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Laboratory Subtitle / Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block font-bold text-[#444746] mb-1">Clinic Full Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Contact Phone(s)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Report Center Watermark Text</label>
              <input
                type="text"
                value={formData.watermarkText}
                onChange={(e) => setFormData({ ...formData, watermarkText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.showWatermark}
                  onChange={(e) => setFormData({ ...formData, showWatermark: e.target.checked })}
                  className="rounded text-[#0B57D0] w-4 h-4"
                />
                <span className="font-bold text-[#1F1F1F]">Display Microscope Watermark on PDF</span>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Doctor & Laboratory Technologist Sign-Off Details */}
        <div className="bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#E0E2EC] pb-3.5">
            <Stethoscope className="w-5 h-5 text-[#137333]" />
            <h2 className="text-sm font-bold text-[#1F1F1F]">Medical Consultant & Technologist Credentials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Doctor */}
            <div className="p-5 bg-[#E6F4EA]/40 rounded-2xl border border-[#CEEAD6] space-y-3">
              <span className="font-extrabold text-[#0D652D] text-xs block">
                Pathologist / Medical Officer (Left Header in Letterhead)
              </span>

              <div>
                <label className="block font-semibold text-[#444746] mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={formData.doctorDetails?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    doctorDetails: { ...formData.doctorDetails, name: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 border border-[#C4C7C5] rounded-xl font-bold bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#444746] mb-1">Degree / Qualification</label>
                  <input
                    type="text"
                    value={formData.doctorDetails?.qualifications || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, qualifications: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 border border-[#C4C7C5] rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#444746] mb-1">Medical Reg. No</label>
                  <input
                    type="text"
                    value={formData.doctorDetails?.regNo || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, regNo: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 border border-[#C4C7C5] rounded-xl font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Technologist */}
            <div className="p-5 bg-[#E8F0FE]/40 rounded-2xl border border-[#D2E3FC] space-y-3">
              <span className="font-extrabold text-[#0B57D0] text-xs block">
                Chief Lab Technologist (Right Header in Letterhead)
              </span>

              <div>
                <label className="block font-semibold text-[#444746] mb-1">Technologist Name</label>
                <input
                  type="text"
                  value={formData.technicianDetails?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    technicianDetails: { ...formData.technicianDetails, name: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 border border-[#C4C7C5] rounded-xl font-bold bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#444746] mb-1">Qualification / Training</label>
                  <input
                    type="text"
                    value={formData.technicianDetails?.qualifications || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      technicianDetails: { ...formData.technicianDetails, qualifications: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 border border-[#C4C7C5] rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#444746] mb-1">Technician Code</label>
                  <input
                    type="text"
                    value={formData.technicianDetails?.regNo || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      technicianDetails: { ...formData.technicianDetails, regNo: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 border border-[#C4C7C5] rounded-xl font-mono bg-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. GST, Tax & Numbering Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#E0E2EC] pb-3.5">
            <Receipt className="w-5 h-5 text-[#6750A4]" />
            <h2 className="text-sm font-bold text-[#1F1F1F]">GST Settings & Invoicing Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="flex items-center pt-2">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isGstEnabled}
                  onChange={(e) => setFormData({ ...formData, isGstEnabled: e.target.checked })}
                  className="rounded text-[#0B57D0] w-4 h-4"
                />
                <span className="font-bold text-[#1F1F1F]">
                  Enable GST by Default on Invoices
                </span>
              </label>
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Clinic GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl font-mono uppercase focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">State & Code</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Bihar (10)"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Default GST Rate (%)</label>
              <input
                type="number"
                value={formData.defaultGstRate}
                onChange={(e) => setFormData({ ...formData, defaultGstRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl font-mono focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl font-mono uppercase focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Report Prefix</label>
              <input
                type="text"
                value={formData.reportPrefix}
                onChange={(e) => setFormData({ ...formData, reportPrefix: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl font-mono uppercase focus:bg-white focus:border-[#0B57D0]"
              />
            </div>

          </div>

          <div className="pt-2">
            <label className="block font-bold text-[#444746] mb-1">Invoice Footer Note / Tax Exemption Notice</label>
            <textarea
              rows="2"
              value={formData.invoiceNotes}
              onChange={(e) => setFormData({ ...formData, invoiceNotes: e.target.value })}
              className="w-full p-3 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0]"
            />
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-8 py-3 rounded-full shadow-sm flex items-center space-x-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Configuration...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
