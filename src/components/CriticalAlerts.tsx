import React from 'react';
import { CriticalAlert } from '../types';
import { ShieldAlert, X, RefreshCw, Smartphone, DollarSign, ArrowRight, UserCheck } from 'lucide-react';

interface CriticalAlertsProps {
  alerts: CriticalAlert[];
  onDismiss: (id: string) => void;
  onResolveAlert: (alertType: string, id: string) => void;
}

export default function CriticalAlerts({ alerts, onDismiss, onResolveAlert }: CriticalAlertsProps) {
  const activeAlerts = alerts.filter(a => !a.dismissed);

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-alertas">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 02</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-500" /> Alertas Críticos e Notificações
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Pendências imediatas necessitando atenção ou reprocessamento</p>
        </div>
        <span className="px-2 py-0.5 bg-red-105 text-red-700 text-[10px] font-mono font-bold rounded">
          {activeAlerts.length} ativo{activeAlerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-50 rounded border border-dashed border-slate-200">
            <UserCheck className="w-6 h-6 text-emerald-500 mb-1" />
            <p className="text-xs font-medium text-slate-700">Tudo sob controle!</p>
            <p className="text-[10px] text-slate-455">Nenhum alerta pendente no fluxo de caixa no momento.</p>
          </div>
        ) : (
          activeAlerts.map(alert => (
            <div
              key={alert.id}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-2.5 rounded border transition-all ${
                alert.severity === 'high'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-2.5 max-w-2xl">
                <div className={`p-1.5 rounded mt-0.5 whitespace-nowrap ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-800">{alert.message}</h4>
                    <span className="text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded font-bold">
                      {alert.category || alert.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-650 mt-0.5 leading-snug">{alert.subtext}</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Registrado em: {alert.date}</p>
                </div>
              </div>

              {/* Action Buttons inside alerts */}
              <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto self-stretch md:self-auto justify-end">
                {alert.type === 'sync_fail' && (
                  <button
                    onClick={() => onResolveAlert('sync_fail', alert.id)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-red-650 hover:bg-red-700 text-white rounded transition-colors shadow-xs uppercase font-sans"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin" /> Atualizar Token API
                  </button>
                )}
                {alert.type === 'overdue' && (
                  <button
                    onClick={() => onResolveAlert('overdue', alert.id)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors shadow-xs uppercase font-sans"
                  >
                    <DollarSign className="w-3 h-3" /> Registrar Pagamento
                  </button>
                )}
                {alert.type === 'agreement_delay' && (
                  <button
                    onClick={() => onResolveAlert('agreement_delay', alert.id)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors shadow-xs uppercase font-sans"
                  >
                    <Smartphone className="w-3 h-3" /> Cobrar via WhatsApp
                  </button>
                )}
                {alert.type === 'high_success_fee' && (
                  <button
                    onClick={() => onResolveAlert('high_success_fee', alert.id)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-xs uppercase font-sans"
                  >
                    Visualizar Processo <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => onDismiss(alert.id)}
                  title="Dispensar alerta"
                  className="p-1 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
