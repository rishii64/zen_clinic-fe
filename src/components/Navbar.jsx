import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  LogOut,
  Clock
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, clinicConfig } = useAuth();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);



  return (
    <header className="bg-white border-b border-[#E0E2EC] sticky top-0 z-30 shrink-0 no-print shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: Material Brand Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-[#1F1F1F] tracking-tight">
                {clinicConfig?.clinicName || 'Zen Clinic'}
              </span>
              <span className="text-[11px] bg-[#FFDAD6] text-[#93000A] font-bold px-2 py-0.5 rounded-full border border-[#FFB4AB]">
                {clinicConfig?.regNumber || 'Diagnostic Lab'}
              </span>
            </div>
            <p className="text-[11px] text-[#444746] font-medium">
              Diagnostic Pathology & Invoicing Management
            </p>
          </div>
        </div>

        {/* Center: Live Clinic Time */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-[#444746] bg-[#F0F4F9] px-4 py-1.5 rounded-full border border-[#E0E2EC]">
          <Clock className="w-3.5 h-3.5 text-[#0B57D0]" />
          <span>{timeStr}</span>
        </div>

        {/* Right: User Role & Profile */}
        <div className="flex items-center space-x-3">
          
          {user?.designation && (
            <span className="text-[11px] bg-[#E8F0FE] text-[#0B57D0] px-2.5 py-0.5 rounded-full font-bold border border-[#D2E3FC]">
              {user.designation}
            </span>
          )}

          {/* User Profile */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-[#E0E2EC]">
            <div className="w-9 h-9 rounded-full bg-[#E8DEF8] text-[#4A4458] font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-[#1F1F1F]">
                {user?.name || 'Staff User'}
              </div>
              <div className="text-[10px] text-[#74777F]">
                {user?.designation || user?.role || 'Staff'}
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-[#444746] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/50 rounded-full transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
