import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, ArrowRight, UserPlus, LogIn, User } from 'lucide-react';

export default function LoginPage() {
  const { login, register, clinicConfig } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      setLoading(true);
      if (isRegisterMode) {
        await register({ name, email, password });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Logo & Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center mx-auto shadow-sm mb-3">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight">
            {clinicConfig?.clinicName || 'Zen Clinic'}
          </h1>
          <p className="text-xs text-[#444746] mt-0.5">
            {clinicConfig?.address || clinicConfig?.tagline || 'Diagnostic Pathology & Clinic ERP'}
          </p>
          <div className="inline-block mt-2 bg-[#E8F0FE] text-[#0B57D0] text-[11px] font-bold px-3 py-1 rounded-full border border-[#D2E3FC]">
            {clinicConfig?.regNumber ? `Reg: ${clinicConfig.regNumber}` : 'Diagnostic Pathology & Invoicing Management'}
          </div>
        </div>

        {/* Login / Register Card */}
        <div className="bg-white rounded-3xl p-8 shadow-m3-2 border border-[#E0E2EC] text-xs">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#F0F4F9] p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
                !isRegisterMode ? 'bg-white text-[#0B57D0] shadow-xs' : 'text-[#444746] hover:text-[#1F1F1F]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
                isRegisterMode ? 'bg-white text-[#0B57D0] shadow-xs' : 'text-[#444746] hover:text-[#1F1F1F]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          <h2 className="text-sm font-bold text-[#1F1F1F] mb-4 text-center">
            {isRegisterMode ? 'Create User Account' : 'Portal Sign In'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-[#FFDAD6] text-[#93000A] border border-[#FFB4AB] rounded-2xl font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[#C4EED0] text-[#072711] border border-[#6DD58C] rounded-2xl font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block font-bold text-[#444746] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#74777F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Doe / Staff"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#444746] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#74777F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#444746] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#74777F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFD] border border-[#C4C7C5] rounded-2xl focus:bg-white focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold rounded-full shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
            >
              <span>{loading ? 'Processing...' : (isRegisterMode ? 'Create Account & Sign In' : 'Sign In to Portal')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        <div className="text-center text-[11px] text-[#74777F]">
          {clinicConfig?.clinicName || 'Zen Clinic'} ERP Management System
        </div>

      </div>
    </div>
  );
}
