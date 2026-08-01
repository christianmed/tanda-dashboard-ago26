'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Bike, 
  Calendar, 
  DollarSign, 
  ExternalLink 
} from 'lucide-react';

export default function ParticipantAccordion({ participants = [] }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, MORA, ADELANTADO, AL_DIA
  const [expandedId, setExpandedId] = useState(null);

  // Filtrar participantes por búsqueda y chip de estatus
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = 
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.modeloMoto.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'MORA') return p.estado.toLowerCase().includes('atraso') || p.estado.toLowerCase().includes('mora');
    if (filterStatus === 'ADELANTADO') return p.estado.toLowerCase().includes('adelantado');
    if (filterStatus === 'AL_DIA') return p.estado.toLowerCase().includes('día') || p.estado.toLowerCase().includes('dia');

    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (estado) => {
    const est = (estado || '').toLowerCase();
    if (est.includes('adelantado')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Adelantado
        </span>
      );
    }
    if (est.includes('día') || est.includes('dia')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <CheckCircle2 className="w-3 h-3" /> Al Día
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertTriangle className="w-3 h-3" /> Atraso
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Buscador e Interfaz de Filtros */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar participante o modelo de moto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131823] text-sm text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 border border-gray-800 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Chips de filtro */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              filterStatus === 'ALL'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Todos ({participants.length})
          </button>
          <button
            onClick={() => setFilterStatus('MORA')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              filterStatus === 'MORA'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            En Mora ({participants.filter(p => p.estado.toLowerCase().includes('atraso')).length})
          </button>
          <button
            onClick={() => setFilterStatus('ADELANTADO')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              filterStatus === 'ADELANTADO'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Adelantados ({participants.filter(p => p.estado.toLowerCase().includes('adelantado')).length})
          </button>
        </div>
      </div>

      {/* Lista Acordeón de Participantes */}
      <div className="space-y-2.5">
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm bg-gray-900/40 rounded-xl border border-gray-800">
            No se encontraron participantes que coincidan con los filtros.
          </div>
        ) : (
          filteredParticipants.map((p) => {
            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id || `participant-${p.noAsignado}-${p.nombre}`}
                className="bg-[#121722] border border-gray-800/90 rounded-2xl overflow-hidden transition-all duration-200 shadow-md"
              >
                {/* Cabecera del Acordeón */}
                <button
                  onClick={() => toggleExpand(p.id)}
                  className="w-full p-4 text-left flex flex-col gap-3 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold flex items-center justify-center border border-gray-700/50">
                        #{p.noAsignado || p.id}
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {p.nombre}
                        </h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Bike className="w-3 h-3 text-emerald-400/70" /> {p.modeloMoto}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(p.estado)}
                      <div className="text-gray-400 p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso rápida */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-400">Progreso de Pago</span>
                      <span className="text-emerald-400 font-semibold">${p.totalPagado} ({p.porcentajeProgreso}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          p.estado.toLowerCase().includes('atraso') ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${p.porcentajeProgreso}%` }}
                      ></div>
                    </div>
                  </div>
                </button>

                {/* Detalle Desplegable */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-800/60 bg-[#0d1119] space-y-4">
                    
                    {/* Imagen de la motocicleta y estado de entrega */}
                    <div className="flex items-center gap-4 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                      {p.imagenMoto && (
                        <img
                          src={p.imagenMoto}
                          alt={p.modeloMoto}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-700 bg-gray-800 shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="space-y-1 text-xs">
                        <div className="text-gray-400">
                          Estatus Moto: <span className="text-white font-semibold">{p.estatusMoto}</span>
                        </div>
                        <div className="text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-400" /> Entrega calculada:{' '}
                          <span className="text-gray-200">
                            {p.fechaEntregaCalculada ? String(p.fechaEntregaCalculada).split('T')[0] : 'N/A'}
                          </span>
                        </div>
                        {p.registroEntrega && (
                          <div className="text-emerald-400 font-medium text-[11px]">
                            ✓ Entregada el: {String(p.registroEntrega).split('T')[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Grilla de Métricas Financieras del Usuario */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      
                      <div className="bg-[#141a27] p-2.5 rounded-xl border border-gray-800">
                        <div className="text-gray-400 text-[11px]">Target al Día</div>
                        <div className="text-sm font-bold text-white">${p.targetAlDia}</div>
                      </div>

                      <div className="bg-[#141a27] p-2.5 rounded-xl border border-gray-800">
                        <div className="text-gray-400 text-[11px]">Deuda Total</div>
                        <div className={`text-sm font-bold ${p.deudaTotal > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          ${p.deudaTotal}
                        </div>
                      </div>

                      <div className="bg-[#141a27] p-2.5 rounded-xl border border-gray-800">
                        <div className="text-gray-400 text-[11px]">Saldo / Diferencia</div>
                        <div className={`text-sm font-bold ${p.saldo < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          ${p.saldo}
                        </div>
                      </div>

                      <div className="bg-[#141a27] p-2.5 rounded-xl border border-gray-800">
                        <div className="text-gray-400 text-[11px]">Cuota Semanal</div>
                        <div className="text-sm font-bold text-white">${p.cuotaSemanal}/sem</div>
                      </div>

                    </div>

                    {/* Cuotas Completadas vs Vencidas */}
                    <div className="flex items-center justify-between text-xs bg-gray-900/50 p-2.5 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Cuotas completadas: <span className="font-bold text-white">{p.cuotasCompletadas}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                        <Clock className="w-4 h-4" /> Vencidas: <span className="font-bold text-white">{p.cuotasVencidas}</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
