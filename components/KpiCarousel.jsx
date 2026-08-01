'use client';

import React from 'react';
import { Wallet, TrendingDown, Bike, UserCheck, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function KpiCarousel({ kpis }) {
  if (!kpis) return null;

  const {
    cajaTotal = 0,
    saldoActual = 0,
    proximoParticipante = 'N/A',
    proximaMoto = 'N/A',
    costoProximaMoto = 0,
    fondoProximaMoto = 0,
    faltante = 0,
    alDiaCount = 0,
    adelantadosCount = 0,
    enMoraCount = 0,
    semanaActual = 0,
    semanasRestantes = 0,
  } = kpis;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Métricas Globales (Semana {semanaActual})
        </h2>
        <span className="text-xs text-gray-400 font-medium">{semanasRestantes} semanas restantes</span>
      </div>

      {/* Carrusel deslizable horizontal sin scrollbar visible */}
      <div className="flex overflow-x-auto snap-x snap-mandatory space-x-3 no-scrollbar pb-2 pt-1 -mx-4 px-4">
        
        {/* Tarjeta 1: Caja Total */}
        <div className="snap-align-start shrink-0 w-[240px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/90 border border-gray-800 p-4 relative overflow-hidden shadow-lg shadow-black/40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Caja Total</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ${cajaTotal.toLocaleString('es-MX')}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> Recaudación acumulada
          </div>
        </div>

        {/* Tarjeta 2: Fondo y Próxima Moto */}
        <div className="snap-align-start shrink-0 w-[270px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/90 border border-gray-800 p-4 relative overflow-hidden shadow-lg shadow-black/40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Próxima Entrega</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-white truncate">
            {proximaMoto}
          </div>
          <div className="text-xs text-blue-300 font-medium mb-2">
            Para: <span className="text-white font-semibold">{proximoParticipante}</span>
          </div>

          {/* Barra de progreso de fondo */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>Fondo: ${fondoProximaMoto}</span>
              <span className="text-amber-400">Falta: ${faltante}</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((fondoProximaMoto / (costoProximaMoto || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Saldo Actual */}
        <div className="snap-align-start shrink-0 w-[230px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/90 border border-gray-800 p-4 relative overflow-hidden shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Saldo Actual</span>
            <div className={`p-1.5 rounded-lg ${saldoActual < 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black tracking-tight ${saldoActual < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ${saldoActual.toLocaleString('es-MX')}
          </div>
          <div className="mt-2 text-[11px] text-gray-400 font-medium">
            {saldoActual < 0 ? 'Déficit temporal acumulado' : 'Balance positivo'}
          </div>
        </div>

        {/* Tarjeta 4: Resumen de Mora */}
        <div className="snap-align-start shrink-0 w-[240px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/90 border border-gray-800 p-4 relative overflow-hidden shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Estado General</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-center mt-1">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1.5">
              <div className="text-sm font-bold text-emerald-400">{adelantadosCount}</div>
              <div className="text-[9px] text-gray-400 font-medium truncate">Adelanto</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-1.5">
              <div className="text-sm font-bold text-blue-400">{alDiaCount}</div>
              <div className="text-[9px] text-gray-400 font-medium truncate">Al Día</div>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-1.5">
              <div className="text-sm font-bold text-rose-400">{enMoraCount}</div>
              <div className="text-[9px] text-gray-400 font-medium truncate">En Mora</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
