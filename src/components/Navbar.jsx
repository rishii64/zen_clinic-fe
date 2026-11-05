import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Activity,
  LogOut,
  Clock,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { user, logout, clinicConfig } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }) + ' • ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 shrink-0 no-print transition-colors duration-200">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: Mobile Toggle & Brand Identity */}
        <div className="flex items-center space-x-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Icon */}
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                {clinicConfig?.clinicName || 'Zen Clinic'}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {clinicConfig?.regNumber || 'Diagnostic Lab'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Pathology & Clinical ERP
            </p>
          </div>
        </div>

        {/* Center: Live Clinic Time */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{timeStr}</span>
        </div>

        {/* Right: Theme Toggle & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-all focus:outline-none"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2.5 pl-2 sm:border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user?.name || 'Staff User'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {user?.designation || user?.role || 'Staff'}
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
