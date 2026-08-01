'use client';

import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Bike, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Users, 
  History, 
  AlertTriangle 
} from 'lucide-react';

export default function Header({ 
  semanaActual, 
  totalSemanas, 
  onRefresh, 
  isRefreshing, 
  theme, 
  toggleTheme, 
  activeTab, 
  setActiveTab, 
  errorCount = 0 
}) {
  const tabs = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'participants', label: 'Participantes', icon: Users },
    { id: 'payments', label: 'Pagos', icon: History },
    { id: 'errors', label: 'Errores', icon: AlertTriangle, badge: errorCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-main)] px-4 py-3 theme-transition">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Identificador del Proyecto */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--text-main)] flex items-center gap-1.5">
              Tanda Moto Dashboard
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </h1>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Semana <span className="text-emerald-500 font-bold">{semanaActual}</span>/{totalSemanas}
              </span>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación para Vista de Escritorio (md:flex) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[var(--bg-input)] p-1.5 rounded-xl border border-[var(--border-main)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive ? 'bg-white text-emerald-600' : 'bg-rose-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Acciones del Sistema: Alternador de Tema y Recarga */}
        <div className="flex items-center gap-2">
          
          {/* Botón de Alternancia Tema Claro / Oscuro */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] text-[var(--text-main)] active:scale-95 transition-all shadow-sm"
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Botón de Recarga de Datos */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] text-[var(--text-main)] active:scale-95 transition-all disabled:opacity-50 shadow-sm"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

        </div>

      </div>
    </header>
  );
}
