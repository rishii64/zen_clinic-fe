import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Activity, Lock, Mail, ArrowRight, UserPlus, LogIn, User, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const { login, register, clinicConfig } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative transition-colors duration-200">
      
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      <div className="max-w-md w-full space-y-6">
        
        {/* Logo & Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mx-auto shadow-xs mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {clinicConfig?.clinicName || 'Zen Clinic'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {clinicConfig?.address ? clinicConfig.address.split(',')[0] : 'Diagnostic Pathology & Clinic ERP'}
          </p>
          <div className="inline-block mt-2 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/80">
            {clinicConfig?.regNumber ? `Reg: ${clinicConfig.regNumber}` : 'Clinical Pathology System'}
          </div>
        </div>

        {/* Login / Register Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-card border border-slate-200/80 dark:border-slate-800 text-xs">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg font-medium text-xs flex items-center justify-center space-x-1.5 transition ${
                !isRegisterMode ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg font-medium text-xs flex items-center justify-center space-x-1.5 transition ${
                isRegisterMode ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-4 text-center">
            {isRegisterMode ? 'Create New Account' : 'Portal Sign In'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegisterMode && (
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-50 text-xs mt-2"
            >
              <span>{loading ? 'Processing...' : (isRegisterMode ? 'Create Account & Sign In' : 'Sign In to Portal')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          {clinicConfig?.clinicName || 'Zen Clinic'} Clinical Pathology & ERP System
        </div>

      </div>
    </div>
  );
}
