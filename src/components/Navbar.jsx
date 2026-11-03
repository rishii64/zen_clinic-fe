import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import {
  Activity,
  LogOut,
  Clock,
  Sparkles,
  ChevronDown,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, switchRole, clinicConfig } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);

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

  const getRoleChipStyle = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-[#E8DEF8] text-[#4A4458] border border-[#CAC4D0]';
      case 'Doctor':
        return 'bg-[#CEEAD6] text-[#0D652D] border border-[#A8DAB5]';
      case 'Technician':
        return 'bg-[#FFE082] text-[#8C4A00] border border-[#FFD54F]';
      case 'Receptionist':
        return 'bg-[#C2E7FF] text-[#004A77] border border-[#7FCFFF]';
      default:
        return 'bg-[#F0F4F9] text-[#444746] border border-[#C4C7C5]';
    }
  };

  return (
    <header className="bg-white border-b border-[#E0E2EC] sticky top-0 z-30 no-print shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: Material Brand Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-[#1F1F1F] tracking-tight">
                {clinicConfig?.clinicName || 'RAJ JANCH GHAR'}
              </span>
              <span className="text-[11px] bg-[#FFDAD6] text-[#93000A] font-bold px-2 py-0.5 rounded-full border border-[#FFB4AB]">
                {clinicConfig?.regNumber || 'Reg.No - 430/2022'}
              </span>
            </div>
            <p className="text-[11px] text-[#444746] font-medium">
              Diagnostic Pathology & Invoicing Management
            </p>
          </div>
        </div>

        {/* Center: Live Clinic Time (Material Tonal Pill) */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-[#444746] bg-[#F0F4F9] px-4 py-1.5 rounded-full border border-[#E0E2EC]">
          <Clock className="w-3.5 h-3.5 text-[#0B57D0]" />
          <span>{timeStr}</span>
        </div>

        {/* Right: Material 3 Role Switcher + User Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Quick 1-Click Role Switcher (Material Filter Chip / Menu) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 bg-[#F0F4F9] hover:bg-[#E3E8EF] border border-[#C4C7C5] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1F1F1F] transition shadow-sm"
              title="Click to switch role (Admin, Doctor, Technician, Receptionist)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0B57D0]" />
              <span>Role: <strong className="text-[#0B57D0]">{user?.role || 'Guest'}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-[#444746]" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-m3-3 border border-[#E0E2EC] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#74777F] border-b border-[#F0F4F9]">
                  Switch Role (Instant 1-Click)
                </div>
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.role}
                    onClick={() => {
                      switchRole(demo.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#F0F4F9] transition ${
                      user?.role === demo.role ? 'bg-[#E8F0FE] font-bold text-[#0B57D0]' : 'text-[#1F1F1F]'
                    }`}
                  >
                    <span>{demo.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getRoleChipStyle(demo.role)}`}>
                      {demo.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
