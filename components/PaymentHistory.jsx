'use client';

import React, { useState } from 'react';
import { Search, DollarSign, Calendar, ArrowDownLeft } from 'lucide-react';

export default function PaymentHistory({ payments = [] }) {
  const [search, setSearch] = useState('');

  const filteredPayments = payments.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.usuarioId.toLowerCase().includes(search.toLowerCase())
  );

  const totalRecaudado = filteredPayments.reduce((acc, p) => acc + (p.monto || 0), 0);

  return (
    <div className="space-y-4">
      {/* Buscador de pagos */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por usuario o participante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131823] text-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 border border-gray-800 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Resumen rápido */}
        <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-emerald-300">
          <span>Pagos filtrados: <strong>{filteredPayments.length}</strong></span>
          <span>Suma Total: <strong>${totalRecaudado.toLocaleString('es-MX')}</strong></span>
        </div>
      </div>

      {/* Lista de Transacciones de Pago */}
      <div className="space-y-2">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm bg-gray-900/40 rounded-xl border border-gray-800">
            No se encontraron registros de pago.
          </div>
        ) : (
          filteredPayments.map((pay) => (
            <div
              key={pay.id}
              className="bg-[#121722] border border-gray-800/80 rounded-xl p-3.5 flex items-center justify-between hover:bg-gray-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    {pay.nombre}
                    <span className="text-[10px] text-gray-400 font-normal bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                      {pay.usuarioId}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    {pay.fecha ? String(pay.fecha).split('T')[0] : 'Sin fecha'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-emerald-400">
                  +${pay.monto}
                </div>
                <div className="text-[10px] text-emerald-500/80 font-medium">Abonado</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
