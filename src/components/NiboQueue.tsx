import React, { useState } from 'react';
import { NiboQueueItem } from '../types';
import { RefreshCw, Play, CheckCircle2, AlertTriangle, Clock, Server, CloudLightning, ShieldCheck } from 'lucide-react';

interface NiboQueueProps {
  queue: NiboQueueItem[];
  onSyncItem: (id: string) => void;
  onSyncAll: () => void;
  onResetToken: () => void;
}

export default function NiboQueue({ queue, onSyncItem, onSyncAll, onResetToken }: NiboQueueProps) {
  const [isSyncingAllState, setIsSyncingAllState] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'valido' | 'expirado'>('expirado');

  const pendingItems = queue.filter(q => q.status === 'pending');
  const failedItems = queue.filter(q => q.status === 'failed');
  const syncedItems = queue.filter(q => q.status === 'synced');

  const handleSyncAllClick = async () => {
    setIsSyncingAllState(true);
    // Mimic API delay
    setTimeout(() => {
      onSyncAll();
      setIsSyncingAllState(false);
      if (tokenStatus === 'expirado') {
        // If token was expired, syncAll might fail or succeed depending on user action.
        // We let the action update it.
      }
    }, 1200);
  };

  const handleResetTokenClick = () => {
    setTokenStatus('valido');
    onResetToken();
  };

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-nibo">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 04</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Server className="w-4 h-4 text-blue-500" /> Fila de Integração NIBO
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Sincronização de contas a pagar e receber com o ERP Nibo</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Token Status Badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] bg-slate-50">
            <span className="text-slate-450 uppercase font-black tracking-normal">Token API:</span>
            {tokenStatus === 'valido' ? (
              <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                <ShieldCheck className="w-3 h-3" /> VÁLIDO
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-red-600 font-bold animate-pulse">
                <CloudLightning className="w-3 h-3" /> EXPIRADO
              </span>
            )}
          </div>

          {tokenStatus === 'expirado' && (
            <button
              onClick={handleResetTokenClick}
              className="text-[10px] font-bold px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-xs uppercase font-sans"
            >
              Renovar Token
            </button>
          )}

          {pendingItems.length + failedItems.length > 0 && (
            <button
              onClick={handleSyncAllClick}
              disabled={isSyncingAllState}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded transition-all shadow-xs uppercase font-sans"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingAllState ? 'animate-spin' : ''}`} />
              {isSyncingAllState ? 'Sincronizando...' : 'Sincronizar Tudo'}
            </button>
          )}
        </div>
      </div>

      {/* Integration Queue Grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        
        {/* Status columns */}
        {/* PENDENTES */}
        <div className="border border-gray-200 rounded bg-slate-50/40 p-2.5">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wilder flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Pendentes ({pendingItems.length})
            </span>
            <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded font-mono uppercase">Aguardando</span>
          </div>

          <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
            {pendingItems.length === 0 ? (
              <p className="text-[10px] text-slate-400 py-4 text-center italic">Nenhuma remessa pendente.</p>
            ) : (
              pendingItems.map(item => (
                <div key={item.id} className="p-2 bg-white border border-gray-250 rounded hover:border-blue-500 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 font-semibold">{item.id}</span>
                    <span className={`text-[8px] px-1 font-bold rounded uppercase ${
                      item.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {item.type === 'income' ? 'Crédito' : 'Débito'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{item.description}</p>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-850">{formatBRL(item.value)}</span>
                    <button
                      onClick={() => onSyncItem(item.id)}
                      className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-all flex items-center gap-0.5"
                    >
                      <Play className="w-2 h-2" /> Sync
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FALHAS */}
        <div className="border border-gray-200 rounded bg-slate-50/40 p-2.5">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-wilder flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Falhas da API ({failedItems.length})
            </span>
            <span className="text-[8px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded font-mono uppercase">Erro</span>
          </div>

          <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
            {failedItems.length === 0 ? (
              <p className="text-[10px] text-slate-400 py-4 text-center italic">Nenhuma falha de conciliação.</p>
            ) : (
              failedItems.map(item => (
                <div key={item.id} className="p-2 bg-white border border-red-150 rounded hover:border-gray-300 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 font-semibold">{item.id}</span>
                    <span className="text-[8px] font-mono text-red-600 bg-red-50 px-1 rounded uppercase">
                      Tentativas: {item.attempts}/3
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-850 mt-0.5 truncate">{item.description}</p>
                  <p className="text-[9px] text-red-700 bg-red-50/60 p-1 rounded mt-0.5 leading-normal font-mono border border-dashed border-red-100">
                    {item.errorDescription}
                  </p>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-800">{formatBRL(item.value)}</span>
                    <button
                      onClick={() => onSyncItem(item.id)}
                      className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-900 text-white hover:bg-slate-800 rounded transition-all flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Re-envio
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SINCRONIZADOS */}
        <div className="border border-gray-200 rounded bg-slate-50/40 p-2.5">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wilder flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Envios OK ({syncedItems.length})
            </span>
            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded font-mono uppercase">Conciliado</span>
          </div>

          <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
            {syncedItems.length === 0 ? (
              <p className="text-[10px] text-slate-400 py-4 text-center italic">Nenhum envio conciliado hoje.</p>
            ) : (
              syncedItems.map(item => (
                <div key={item.id} className="p-2 bg-white/70 border border-slate-200 rounded opacity-85">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 font-semibold">{item.id}</span>
                    <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1 font-mono font-bold rounded uppercase">
                      Nibo Link #OK
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 truncate line-through">{item.description}</p>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100">
                    <span className="text-xs font-mono text-slate-600">{formatBRL(item.value)}</span>
                    <span className="text-[9px] font-mono text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Integrado
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
