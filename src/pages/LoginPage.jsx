import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Lock,
  Mail,
  ArrowRight,
  UserPlus,
  LogIn,
  User,
  Sun,
  Moon,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Microscope,
  FileText,
  Receipt,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const { login, register, requestPasswordReset, resetPassword, clinicConfig } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clinicName = clinicConfig?.clinicName || 'RAJ JANCH GHAR';
  const clinicAddress = clinicConfig?.address || 'MAIN ROAD NETAJI CHOWK, SAHARGHAT';
  const regNumber = clinicConfig?.regNumber || 'Reg No - 430/2022';

  const handleQuickFill = () => {
    setEmail('admin@rajjanchghar.com');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      setLoading(true);
      if (isForgotMode && forgotStep === 'email') {
        const response = await requestPasswordReset(email);
        setForgotStep('otp');
        setSuccessMsg(response.message);
      } else if (isForgotMode) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        const response = await resetPassword({ email, otp: forgotOtp, password });
        setIsForgotMode(false);
        setForgotStep('email');
        setPassword('');
        setForgotOtp('');
        setConfirmPassword('');
        setSuccessMsg(response.message);
      } else if (isRegisterMode) {
        await register({ name, email, password });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-200">
      
      {/* 1. LEFT HERO & SHOWCASE PANEL (Desktop / Tablet Landscape) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-10 xl:p-12 flex-col justify-between relative overflow-hidden select-none border-r border-slate-800 shadow-2xl">
        
        {/* Ambient Decorative Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3.5 mb-8">
            {/* Authentic Rj Emblem Box */}
            <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-blue-200 shrink-0">
              <svg viewBox="0 0 44 44" className="w-10 h-10">
                <path d="M 6,14 C 14,4 30,4 38,14" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 12,18 C 18,10 28,10 34,18" fill="none" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
                <text x="10" y="34" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="22" fill="#1e3a8a">R</text>
                <text x="24" y="35" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="18" fill="#1e3a8a">j</text>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white leading-tight">
                {clinicName}
              </h2>
              <span className="text-[11px] font-semibold text-blue-300 tracking-wider uppercase block">
                {regNumber} • Fully Computerised Lab
              </span>
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <div className="space-y-3 mt-4">
            {/* <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full text-blue-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Gen Pathology & Clinic ERP</span>
            </div> */}
            <h1 className="text-xl xl:text-2xl font-black tracking-tight leading-tight text-white">
              Precision Diagnostics, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                Streamlined Practice.
              </span>
            </h1>
            <p className="text-slate-300 text-xs xl:text-sm leading-relaxed max-w-md pt-1">
              Integrated pathology management system for patient onboarding, automated test tariffs, biological reference evaluations, and pixel-perfect PDF diagnostic reporting.
            </p>
          </div>

          {/* Feature Showcase Glass Cards */}
          <div className="space-y-3 mt-8">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start space-x-3 transition hover:bg-white/10">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-400">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Standardized Pathology Tariffs</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Hematology, Biochemistry, Serology, Hormones, and Microbiology with automated age/sex reference ranges.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start space-x-3 transition hover:bg-white/10">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">A4 Reports & Pixel-Perfect PDF Export</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Authentic letterhead layout, discrete multi-page pagination, and dual pathologist/technologist signatures.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start space-x-3 transition hover:bg-white/10">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 text-purple-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">GST Billing & Instant UPI QR Payments</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Cash receipts, GST-ready invoicing, payment tracking logs, and patient dynamic QR codes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Server Status Strip */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">Clinic Local Server Connected</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">{clinicAddress.split(',')[0]}</div>
        </div>

      </div>

      {/* 2. RIGHT AUTHENTICATION FORM PANEL */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-10 relative overflow-y-auto">
        
        {/* Top Bar: Mobile Branding & Theme Switcher */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-4 select-none">
          {/* Mobile Only Logo */}
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-sm border border-blue-200 flex items-center justify-center">
              <svg viewBox="0 0 44 44" className="w-7 h-7">
                <path d="M 6,14 C 14,4 30,4 38,14" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 12,18 C 18,10 28,10 34,18" fill="none" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
                <text x="10" y="34" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="22" fill="#1e3a8a">R</text>
                <text x="24" y="35" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="18" fill="#1e3a8a">j</text>
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">{clinicName}</span>
              <span className="text-[10px] text-slate-500 font-medium">{regNumber}</span>
            </div>
          </div>

          <div className="hidden lg:block text-xs text-slate-500 dark:text-slate-400 font-medium">
            Staff & Technologist Authentication
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span className="text-xs font-semibold">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Main Login Card */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/90 dark:border-slate-800/90 relative">
            
            {/* Card Header Title */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isForgotMode ? 'Reset Your Password' : isRegisterMode ? 'Create Staff Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isForgotMode
                  ? forgotStep === 'email'
                    ? 'We will send a verification code to your registered email address.'
                    : `Enter the verification code sent to ${email} and choose a new password.`
                  : isRegisterMode
                  ? 'Register a new staff or technologist profile'
                  : 'Enter your credentials to access the laboratory workspace'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            {!isForgotMode && <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl mb-5 border border-slate-200/60 dark:border-slate-700/60 select-none">
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setIsForgotMode(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all duration-150 ${
                  !isRegisterMode
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setIsForgotMode(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all duration-150 ${
                  isRegisterMode
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>}

            {/* 1-Click Demo Login Pill (Only in Sign In mode) */}
            {/* {!isRegisterMode && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="w-full py-1.5 px-3 bg-blue-50/70 hover:bg-blue-100/80 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition group"
                  title="Auto-fill default staff login credentials"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Auto-Fill Demo Staff Credentials</span>
                </button>
              </div>}
            )} */}

            {/* Error Message Alert */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Full Name (Registration Only) */}
              {isRegisterMode && !isForgotMode && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name & Title
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. R.K. Mandal / Mr. R.K. Raut"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-white font-medium text-xs transition"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@rajjanchghar.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-white font-medium text-xs transition"
                  />
                </div>
              </div>

              {isForgotMode && forgotStep === 'otp' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      placeholder="6-digit code"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-white font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-white font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      placeholder="Enter the new password again"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-white font-medium text-xs"
                    />
                  </div>
                </>
              )}

              {/* Password with Eye Toggle */}
              {!isForgotMode && <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setForgotStep('email');
                        setError('');
                        setSuccessMsg('');
                        setPassword('');
                      }}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer select-none"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-white font-medium text-xs transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>}

              {/* Remember Me Checkbox */}
              {/* <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                    Keep me signed in
                  </span>
                </label>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 text-xs mt-2"
              >
                <span>{loading
                  ? isForgotMode && forgotStep === 'email' ? 'Sending code...' : isForgotMode ? 'Resetting password...' : 'Authenticating...'
                  : isForgotMode
                    ? forgotStep === 'email' ? 'Send Verification Code' : 'Verify Code & Reset Password'
                    : isRegisterMode ? 'Create Account & Access Portal' : 'Sign In to Laboratory'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {isForgotMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setForgotStep('email');
                    setError('');
                    setSuccessMsg('');
                    setPassword('');
                    setForgotOtp('');
                    setConfirmPassword('');
                  }}
                  className="w-full text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Back to sign in
                </button>
              )}
            </form>

            {/* Medico-Legal Security Note */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-center space-x-2 text-[11px] text-slate-400 dark:text-slate-500 select-none">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>256-Bit SSL Encrypted Healthcare Workstation</span>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 py-2 select-none">
          © {new Date().getFullYear()} {clinicName} • Diagnostic Pathology & Laboratory ERP
        </div>

      </div>

    </div>
  );
}
