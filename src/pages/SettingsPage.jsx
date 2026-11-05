import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Building2,
  Stethoscope,
  Receipt,
  Save,
  Check,
  Loader2
} from 'lucide-react';

export default function SettingsPage() {
  const { clinicConfig, reloadConfig } = useAuth();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (clinicConfig) {
      setFormData(JSON.parse(JSON.stringify(clinicConfig)));
    }
  }, [clinicConfig]);

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] space-x-2 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-xs">Loading clinic configuration...</span>
      </div>
    );
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span>Clinic Branding & Tax Configuration</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Clinic letterhead branding, doctor credentials, GST parameters, disclaimers, and invoice prefixes.
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>Saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        
        {/* 1. Clinic Branding & Identity */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Clinic Identity & Letterhead Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Clinic Name (Header Banner)</label>
              <input
                type="text"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Number Badge</label>
              <input
                type="text"
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Laboratory Subtitle / Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Clinic Full Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Phone(s)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Watermark Text</label>
              <input
                type="text"
                value={formData.watermarkText}
                onChange={(e) => setFormData({ ...formData, watermarkText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center pt-4">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.showWatermark}
                  onChange={(e) => setFormData({ ...formData, showWatermark: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Display Microscope Watermark on PDF</span>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Doctor & Laboratory Technologist Sign-Off Details */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Medical Consultant & Technologist Credentials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Doctor */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-xs block">
                Pathologist / Medical Officer (Left Header)
              </span>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={formData.doctorDetails?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    doctorDetails: { ...formData.doctorDetails, name: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Degree / Qualification</label>
                  <input
                    type="text"
                    value={formData.doctorDetails?.qualifications || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, qualifications: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Medical Reg. No</label>
                  <input
                    type="text"
                    value={formData.doctorDetails?.regNo || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, regNo: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Technologist */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs block">
                Chief Lab Technologist (Right Header)
              </span>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Technologist Name</label>
                <input
                  type="text"
                  value={formData.technicianDetails?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    technicianDetails: { ...formData.technicianDetails, name: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.technicianDetails?.qualifications || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      technicianDetails: { ...formData.technicianDetails, qualifications: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Technician Code</label>
                  <input
                    type="text"
                    value={formData.technicianDetails?.regNo || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      technicianDetails: { ...formData.technicianDetails, regNo: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. GST, Tax & Numbering Configuration */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Receipt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">GST Settings & Invoicing Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            
            <div className="flex items-center pt-2">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isGstEnabled}
                  onChange={(e) => setFormData({ ...formData, isGstEnabled: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Enable GST by Default on Invoices
                </span>
              </label>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Clinic GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">State & Code</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Bihar (10)"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Default GST Rate (%)</label>
              <input
                type="number"
                value={formData.defaultGstRate}
                onChange={(e) => setFormData({ ...formData, defaultGstRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Report Prefix</label>
              <input
                type="text"
                value={formData.reportPrefix}
                onChange={(e) => setFormData({ ...formData, reportPrefix: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

          </div>

          <div className="pt-2">
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Invoice Footer Notice</label>
            <textarea
              rows="2"
              value={formData.invoiceNotes}
              onChange={(e) => setFormData({ ...formData, invoiceNotes: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
