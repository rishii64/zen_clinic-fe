import React from 'react';
import {
  LayoutDashboard,
  Users,
  Receipt,
  FileText,
  ListOrdered,
  Settings,
  HeartPulse
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: Users,
      badge: null
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: Receipt,
      badge: 'Core'
    },
    {
      id: 'reports',
      label: 'Diagnostic Reports',
      icon: FileText,
      badge: 'Core'
    },
    {
      id: 'tests',
      label: 'Test Tariff (74)',
      icon: ListOrdered,
      badge: 'Tariff'
    },
    {
      id: 'settings',
      label: 'Clinic & GST Config',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-[#F8FAFD] border-r border-[#E0E2EC] flex flex-col shrink-0 min-h-[calc(100vh-61px)] no-print">
      
      {/* Navigation Links in Material 3 Navigation Drawer Style */}
      <div className="p-3 space-y-1.5 flex-1">
        <div className="text-[11px] font-bold text-[#74777F] uppercase tracking-wider px-4 py-2">
          Clinical Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between h-12 px-4 rounded-full text-xs transition-all ${
                isActive
                  ? 'bg-[#C2E7FF] text-[#001D35] font-bold shadow-sm'
                  : 'text-[#444746] hover:bg-[#E9EEF6] hover:text-[#1F1F1F] font-medium'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#001D35]' : 'text-[#444746]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#0B57D0] text-white'
                      : 'bg-[#E0E2EC] text-[#444746]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box (Material 3 Tonal Container) */}
      <div className="p-4 m-3 rounded-2xl bg-white border border-[#E0E2EC] shadow-sm text-xs">
        <div className="flex items-center space-x-2 text-[#0B57D0] font-bold mb-1">
          <HeartPulse className="w-4 h-4 text-[#137333]" />
          <span className="text-[#1F1F1F]">Raj Janch Ghar</span>
        </div>
        <p className="text-[11px] text-[#444746] leading-relaxed">
          Diagnostic Pathology Laboratory & GST Invoicing System.
        </p>
      </div>

    </aside>
  );
}
