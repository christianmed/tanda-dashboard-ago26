'use client';

import React, { useState } from 'react';
import { AlertCircle, Search, Cpu, Clock } from 'lucide-react';

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
        <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Buscar error, workflow o nodo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[var(--bg-input)] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] rounded-xl pl-9 pr-4 py-2.5 border border-[var(--border-main)] focus:outline-none focus:border-rose-500 transition-colors shadow-sm"
        />
      </div>

      {/* Monitor de errores */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-emerald-500 font-semibold">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2 font-bold">
              ✓
            </div>
            <p className="font-bold text-sm">Sin incidencias registradas</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">El sistema y los workflows de autogestión funcionan con normalidad.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-[var(--bg-card)] border border-rose-500/30 rounded-2xl p-4 space-y-2.5 shadow-sm theme-transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-main)] text-xs leading-tight">
                      {log.workflow}
                    </h4>
                    <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5 font-medium">
                      <Cpu className="w-3.5 h-3.5 text-rose-500" /> Nodo: <span className="text-[var(--text-main)] font-semibold">{log.nodo}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] bg-rose-500/10 text-rose-500 font-mono font-bold px-2 py-0.5 rounded-md border border-rose-500/20">
                  ID #{log.executionId}
                </span>
              </div>

              {/* Detalle del error */}
              <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-main)] text-[11px] font-mono text-rose-500 break-words leading-relaxed">
                {log.detalleError}
              </div>

              <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {log.fechaHora}
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
