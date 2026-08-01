'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, Bike } from 'lucide-react';

export default function Header({ semanaActual, totalSemanas, onRefresh, isRefreshing }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0f141d]/90 backdrop-blur-md border-b border-gray-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Tanda Moto Dashboard
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Semana <span className="text-emerald-300 font-semibold">{semanaActual}</span>/{totalSemanas}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-gray-300 active:scale-95 transition-all disabled:opacity-50"
          title="Actualizar datos"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>
    </header>
  );
}
