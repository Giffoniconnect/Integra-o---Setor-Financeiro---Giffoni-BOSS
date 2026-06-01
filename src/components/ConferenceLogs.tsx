import React, { useState } from 'react';
import { ConferenceLog } from '../types';
import { Terminal, Search, Filter, Trash2, Plus, Sparkles, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

interface ConferenceLogsProps {
  logs: ConferenceLog[];
  onAddManualLog: (note: string) => void;
  onClearLogs: () => void;
}

export default function ConferenceLogs({ logs, onAddManualLog, onClearLogs }: ConferenceLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'info' | 'warning' | 'error'>('all');
  const [manualNote, setManualNote] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesLevel;
  });

  const getLogStatusConfig = (status: ConferenceLog['status']) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />,
          bgColor: 'bg-emerald-500/10',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-100',
          label: 'SUCESSO'
        };
      case 'info':
        return {
          icon: <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />,
          bgColor: 'bg-sky-500/10',
          textColor: 'text-sky-700',
          borderColor: 'border-sky-100',
          label: 'INFO'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />,
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-100',
          label: 'AVISO'
        };
      case 'error':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />,
          bgColor: 'bg-rose-500/10',
          textColor: 'text-rose-700',
          borderColor: 'border-rose-100',
          label: 'FALHA'
        };
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNote.trim()) return;
    onAddManualLog(manualNote);
    setManualNote('');
    setIsFormOpen(false);
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-logs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 09</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-blue-500" /> Logs de Conferência e Auditoria
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Rastreabilidade completa de conciliações em conformidade regulatória</p>
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-[10px] font-bold px-2.5 py-1.5 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded transition-colors bg-white shadow-xs uppercase font-sans shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Escrever Nota
          </button>
          <button
            onClick={onClearLogs}
            className="p-1.5 border border-gray-200 hover:border-red-300 text-slate-400 hover:text-red-600 rounded transition-all"
            title="Limpar logs de auditoria"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={handleNoteSubmit} className="mt-3 p-3 bg-slate-50 border border-gray-200 rounded space-y-2.5">
          <h3 className="text-[10px] font-bold text-slate-700 uppercase">Anotar Auditoria de Conciliação Manual</h3>
          <div className="flex flex-col gap-1">
            <textarea
              value={manualNote}
              onChange={e => setManualNote(e.target.value)}
              placeholder="Escreva detalhes técnicos da conferência de caixa. Ex: 'Feita conferência manual da Guia do Simples com Extrato do Banco Itaú.'"
              rows={3}
              className="text-xs p-2 bg-white border border-gray-250 rounded focus:outline-none select-text"
              required
            />
          </div>
          <div className="flex justify-end gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-2 py-1 border border-slate-200 text-slate-600 rounded hover:bg-slate-100 uppercase font-sans font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-slate-900 border border-slate-850 text-white rounded hover:bg-slate-800 font-bold uppercase font-sans"
            >
              Salvar Nota
            </button>
          </div>
        </form>
      )}

      {/* Inputs filters dashboard logs */}
      <div className="mt-3 flex flex-col md:flex-row gap-3 items-center justify-between pb-3 border-b border-slate-100">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar logs, mensagens ou operadores..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Severity level selector tab buttons */}
        <div className="flex flex-wrap items-center gap-0.5 bg-slate-100/70 p-0.5 rounded text-[10px] font-semibold text-slate-500 border border-slate-200 select-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-1 rounded transition-all ${statusFilter === 'all' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'hover:text-slate-800'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('success')}
            className={`px-2 py-1 rounded transition-all ${statusFilter === 'success' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-emerald-700'}`}
          >
            Sucessos
          </button>
          <button
            onClick={() => setStatusFilter('info')}
            className={`px-2 py-1 rounded transition-all ${statusFilter === 'info' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'hover:text-blue-700'}`}
          >
            Informativos
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`px-2 py-1 rounded transition-all ${statusFilter === 'warning' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'hover:text-amber-705'}`}
          >
            Avisos
          </button>
          <button
            onClick={() => setStatusFilter('error')}
            className={`px-2 py-1 rounded transition-all ${statusFilter === 'error' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'hover:text-rose-700'}`}
          >
            Falhas
          </button>
        </div>
      </div>

      {/* Terminal Display timeline list */}
      <div className="mt-3 bg-slate-950 text-slate-205 p-3 rounded border border-slate-850 font-mono text-[10pt] sm:text-[10px] leading-relaxed max-h-56 overflow-y-auto shadow-inner">
        <div className="flex items-center justify-between text-slate-500 pb-1.5 mb-2 border-b border-white/5 select-none">
          <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-gray-500" /> SHELL AUDIT TRACE</span>
          <span className="text-[9px] uppercase tracking-wider">OPERATOR: direito.rgr@gmail.com</span>
        </div>

        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <p className="text-slate-500 italic py-3 text-center text-[10px]">Nenhum rastro correspondente cadastrado.</p>
          ) : (
            filteredLogs.map(log => {
              const cfg = getLogStatusConfig(log.status);
              return (
                <div key={log.id} className="flex items-start gap-1.5 pt-0.5">
                  <span className="text-slate-500 whitespace-nowrap shrink-0">[{log.timestamp}]</span>
                  <span className={`text-[8.5px] font-bold px-1 py-0.1 leading-none rounded font-mono shrink-0 uppercase border ${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor}`}>
                    {cfg.label}
                  </span>
                  <div className="flex-1">
                    <span className="text-slate-100">{log.action}</span>
                    <span className="text-slate-500 block text-[9px] mt-0.5">Operator: {log.user} • Trace: #{log.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
