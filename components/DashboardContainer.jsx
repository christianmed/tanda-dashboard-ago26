'use client';

import React, { useState } from 'react';
import Header from './Header';
import KpiCarousel from './KpiCarousel';
import ParticipantAccordion from './ParticipantAccordion';
import PaymentHistory from './PaymentHistory';
import ErrorLogs from './ErrorLogs';
import BottomNav from './BottomNav';

export default function DashboardContainer({ initialData }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
      }
    } catch (err) {
      console.error('Error al actualizar datos:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const { kpis, participants, payments, logs } = data;

  return (
    <div className="min-h-screen bg-[#0b0e14] pb-24 text-gray-100 flex flex-col antialiased">
      {/* Encabezado Principal */}
      <Header
        semanaActual={kpis?.semanaActual || 0}
        totalSemanas={kpis?.totalSemanas || 40}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Contenido Principal con ancho max para vista móvil limpia */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-6">
        
        {/* Vista: Resumen General / Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Carrusel de Métricas Globales */}
            <KpiCarousel kpis={kpis} />

            {/* Participantes Destacados / Lista Rápida */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Participantes ({participants?.length || 0})
                </h2>
                <button
                  onClick={() => setActiveTab('participants')}
                  className="text-xs text-emerald-400 hover:underline font-medium"
                >
                  Ver todos →
                </button>
              </div>
              <ParticipantAccordion participants={participants} />
            </div>
          </div>
        )}

        {/* Vista: Todos los Participantes */}
        {activeTab === 'participants' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider px-1">
              Lista Completa de Participantes
            </h2>
            <ParticipantAccordion participants={participants} />
          </div>
        )}

        {/* Vista: Historial de Pagos */}
        {activeTab === 'payments' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider px-1">
              Registro de Pagos Recibidos
            </h2>
            <PaymentHistory payments={payments} />
          </div>
        )}

        {/* Vista: Log de Errores del Bot */}
        {activeTab === 'errors' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider px-1">
              Monitor de Incidencias
            </h2>
            <ErrorLogs logs={logs} />
          </div>
        )}

      </main>

      {/* Barra de Navegación Inferior Móvil Fija */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        errorCount={logs?.length || 0}
      />
    </div>
  );
}
