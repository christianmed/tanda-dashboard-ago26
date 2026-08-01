'use client';

import React from 'react';
import { LayoutDashboard, Users, History, AlertTriangle } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, errorCount = 0 }) {
  const tabs = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'participants', label: 'Participantes', icon: Users },
    { id: 'payments', label: 'Pagos', icon: History },
    { id: 'errors', label: 'Errores', icon: AlertTriangle, badge: errorCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f141d]/95 backdrop-blur-lg border-t border-gray-800/80 px-2 py-2 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
