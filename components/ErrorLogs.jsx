'use client';

import React, { useState } from 'react';
import { AlertCircle, Search, Terminal, Cpu, Clock } from 'lucide-react';

export default function ErrorLogs({ logs = [] }) {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l => 
    l.workflow.toLowerCase().includes(search.toLowerCase()) ||
    l.nodo.toLowerCase().includes(search.toLowerCase()) ||
    l.detalleError.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Buscador de errores */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar error, workflow o nodo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#131823] text-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500/50 transition-colors"
        />
      </div>

      {/* Monitor de errores */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-emerald-400">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
              ✓
            </div>
            <p className="font-semibold text-sm">Sin incidencias registradas</p>
            <p className="text-xs text-gray-400 mt-1">El sistema y los workflows de autogestión funcionan con normalidad.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-[#141219] border border-rose-500/30 rounded-2xl p-4 space-y-2.5 shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs leading-tight">
                      {log.workflow}
                    </h4>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Cpu className="w-3 h-3 text-rose-400" /> Nodo: <span className="text-gray-200 font-medium">{log.nodo}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-500/30">
                  ID #{log.executionId}
                </span>
              </div>

              {/* Detalle del error */}
              <div className="bg-black/60 p-2.5 rounded-xl border border-gray-800 text-[11px] font-mono text-rose-300 break-words leading-relaxed">
                {log.detalleError}
              </div>

              <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-600" /> {log.fechaHora}
                </span>
                <span>Modo: {log.modo}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
