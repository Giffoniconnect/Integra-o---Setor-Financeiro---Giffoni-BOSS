import React, { useState } from 'react';
import { 
  AlertCircle, 
  Search, 
  Smartphone, 
  Mail, 
  FileText, 
  CheckCircle, 
  Clock, 
  X, 
  Plus, 
  Bell, 
  Settings, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { Transaction, AgreementInstallment } from '../types';

interface ModuloContratosInadimplentesProps {
  transactions: Transaction[];
  agreements: AgreementInstallment[];
  onUpdateStatus?: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  onLogAction?: (action: string, status?: 'info' | 'success' | 'warning' | 'error') => void;
}

interface CollectionHistoryItem {
  id: string;
  date: string;
  action: string;
  responsible: string;
  targetClient: string;
}

export default function ModuloContratosInadimplentes({
  transactions,
  agreements,
  onUpdateStatus,
  onLogAction
}: ModuloContratosInadimplentesProps) {

  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom collection log state
  const [collectionLogs, setCollectionLogs] = useState<CollectionHistoryItem[]>([
    { id: 'COB-01', date: '30/05/2026', action: 'Geração de aviso de faturamento em atraso e envio via WhatsApp para Distribuidora Fenix S/A.', responsible: 'Gestor Financeiro', targetClient: 'Fenix S/A' },
    { id: 'COB-02', date: '31/05/2026', action: 'Notificação extrajudicial despachada por e-mail corporativo para Carrefour Brasil.', responsible: 'Sistema Automático', targetClient: 'Carrefour' }
  ]);

  const [newNote, setNewNote] = useState('');
  const [targetNoteClient, setTargetNoteClient] = useState('Carrefour Brasil');

  // Automation future settings Toggles
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(false);
  const [autoWhatsappEnabled, setAutoWhatsappEnabled] = useState(false);
  const [protestCartorioEnabled, setProtestCartorioEnabled] = useState(false);

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  const calculateDaysLate = (dueDateStr: string) => {
    // Current local time simulation date is 2026-06-01
    const simDate = new Date('2026-06-01');
    const dueDate = new Date(dueDateStr);
    const diffTime = simDate.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleTriggerCobrança = (client: string, contactType: 'whatsapp' | 'email') => {
    const text = contactType === 'whatsapp' 
      ? `Disparo instantâneo efetuado via WhatsApp para ${client}: "Prezado cliente, lembramos que consta pendente em nosso sistema o título..."` 
      : `Notificação e-mail disparada para assessoria de conciliação de ${client}.`;

    const nextId = `COB-${Math.floor(100 + Math.random() * 900)}`;
    const newHistory: CollectionHistoryItem = {
      id: nextId,
      date: '01/06/2026',
      action: text,
      responsible: 'direito.rgr@gmail.com',
      targetClient: client
    };

    setCollectionLogs(prev => [newHistory, ...prev]);
    if (onLogAction) {
      onLogAction(`AUTOMATION COBRANÇA: ${text}`, 'info');
    }
  };

  const handleAddManualNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const nextId = `COB-${Math.floor(100 + Math.random() * 900)}`;
    const newHistory: CollectionHistoryItem = {
      id: nextId,
      date: '01/06/2026',
      action: `[NOTA OPERACIONAL] ${newNote}`,
      responsible: 'direito.rgr@gmail.com',
      targetClient: targetNoteClient
    };

    setCollectionLogs(prev => [newHistory, ...prev]);
    setNewNote('');
    alert('Nota de cobrança registrada no dossiê de inadimplência!');
  };

  // 1. Compile Overdue Items from transactions
  const overdueTxs = transactions.filter(t => t.status === 'overdue' && t.type === 'income');
  // 2. Compile Overdue agreements
  const lateAgs = agreements.filter(a => a.status === 'atrasado');

  const totalInadimplênciaValue = overdueTxs.reduce((acc, t) => acc + t.value, 0) + lateAgs.reduce((acc, a) => acc + a.installmentValue, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-inadimplencia">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-red-700 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest">
            MÓDULO 06
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <AlertCircle className="w-4 h-4 text-red-650 animate-pulse" /> Central de Inadimplência e Cobrança
          </h2>
          <p className="text-[10px] text-slate-500 font-sans">
            Mapeamento completo de parcelas em aberto, dias de mora acumulados, dossiê e régua de automação futura.
          </p>
        </div>
        <div className="bg-red-50 p-2 rounded border border-red-100 text-right">
          <span className="text-[8px] text-red-700 font-bold uppercase tracking-wider block">Total Retido (Em Atraso)</span>
          <span className="text-base font-mono font-black text-rose-700 leading-none">
            {formatBRL(totalInadimplênciaValue)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-start">
        
        {/* Left Column - List of defaulters (7/12 span) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-[11px] font-black text-slate-450 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-slate-400" /> Títulos Líquidos Vencidos e Dias de Mora
          </h3>

          <div className="space-y-2.5">
            {overdueTxs.length === 0 && lateAgs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded border border-dashed text-slate-400 font-mono text-[10px]">
                Nenhum inadimplente detectado na carteira ativa. Parabéns!
              </div>
            ) : (
              <>
                {overdueTxs.map(tx => {
                  const daysLate = calculateDaysLate(tx.date);
                  const client = tx.description.replace('Atrasado - ', '').replace('Honorários Consultoria - ', '');
                  return (
                    <div key={tx.id} className="p-3 bg-red-105/10 border border-red-200/60 hover:border-red-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-sans text-xs">{client}</strong>
                          <span className="text-[8px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                            Cobrança Ativa
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-520 mt-0.5">Motivo Original: {tx.description}</p>
                        <p className="text-[9px] text-slate-405 font-mono mt-1">
                          Vencido em: {tx.date} • <strong className="text-red-700 font-bold">{daysLate} dias em atraso</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 justify-end shrink-0">
                        <span className="font-mono font-black text-red-700 text-xs">{formatBRL(tx.value)}</span>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleTriggerCobrança(client, 'whatsapp')}
                            title="Disparar Whatsapp"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition border border-emerald-200"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleTriggerCobrança(client, 'email')}
                            title="Disparar Email"
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition border border-blue-200"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {lateAgs.map(ag => {
                  const daysLate = calculateDaysLate(ag.nextDueDate);
                  return (
                    <div key={ag.id} className="p-3 bg-red-105/10 border border-red-200/60 hover:border-red-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-sans text-xs">{ag.debtor}</strong>
                          <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                            Termo em Atraso
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-520 mt-0.5">Renegociação {ag.id} • Parcela {ag.currentInstallment + 1}/{ag.installmentsCount}</p>
                        <p className="text-[9px] text-slate-405 font-mono mt-1">
                          Próximo Parcela: {ag.nextDueDate} • <strong className="text-red-700 font-bold">{daysLate} dias em atraso</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 justify-end shrink-0">
                        <span className="font-mono font-black text-red-700 text-xs">{formatBRL(ag.installmentValue)}</span>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleTriggerCobrança(ag.debtor, 'whatsapp')}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition border border-emerald-200"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleTriggerCobrança(ag.debtor, 'email')}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition border border-blue-200"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Core Collection Logs */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Histórico de Cobrança e Notificações</span>
              <span className="font-mono font-bold text-slate-400">{collectionLogs.length} anotados</span>
            </h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {collectionLogs.map(log => (
                <div key={log.id} className="p-2 border border-slate-100 bg-slate-50/40 rounded text-[10px] space-y-1">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-500">
                    <span>Para: {log.targetClient}</span>
                    <span>{log.date} • {log.id}</span>
                  </div>
                  <p className="text-slate-700">{log.action}</p>
                  <p className="text-[9px] text-slate-400 font-mono font-bold text-right">Por: {log.responsible}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Manual Note Input + Future Automation setup (5/12 span) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Action form */}
          <form onSubmit={handleAddManualNote} className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 space-y-3">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Adicionar Nota de Contato Manual
            </h3>
            
            <div className="flex flex-col gap-1 text-[11px]">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Selecione o Devedor</label>
              <select
                value={targetNoteClient}
                onChange={e => setTargetNoteClient(e.target.value)}
                className="p-1.5 bg-white border border-slate-205 rounded font-bold text-slate-800 focus:outline-none"
              >
                <option value="Carrefour Brasil">Carrefour Brasil S/A</option>
                <option value="Distribuidora Fenix S/A">Distribuidora Fenix S/A</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 text-[11px]">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Anotar Dossiê de Cobrança</label>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Ex. Devedor prometeu purgar a mora e pagar até 10/06..."
                rows={2}
                className="p-1.5 bg-white border border-slate-205 rounded focus:outline-none focus:border-blue-500 text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.8 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] rounded uppercase font-mono tracking-wider"
            >
              Gravar em Log de Auditoria
            </button>
          </form>

          {/* Future automation setup spaces */}
          <div className="bg-slate-900 text-white rounded-lg p-3.5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-amber-500 animate-spin" />
              <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-400">Régua Automática (Preparo Futuro)</h3>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal">
              Habilite os gatilhos abaixo para automatizar mensagens no momento em que as faturas entrarem em inadimplência de conciliação. Em conformidade BOSS:
            </p>

            <div className="space-y-2.5 pt-2 text-[11px]">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block">Gatilho de SMS Cobrança</span>
                  <span className="text-[9px] text-slate-500">Enviar SMS no 2º dia de mora</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSmsEnabled(!autoSmsEnabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition duration-200 ${autoSmsEnabled ? 'bg-amber-500' : 'bg-slate-800 border'}`}
                >
                  <div className={`w-3.8 h-3.8 rounded-full bg-slate-950 transition-all ${autoSmsEnabled ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block">Notificador Whatsapp Automático</span>
                  <span className="text-[9px] text-slate-500">Disparar link de fatura após vencimento</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoWhatsappEnabled(!autoWhatsappEnabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition duration-200 ${autoWhatsappEnabled ? 'bg-amber-500' : 'bg-slate-800 border'}`}
                >
                  <div className={`w-3.8 h-3.8 rounded-full bg-slate-950 transition-all ${autoWhatsappEnabled ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block">Análise de Protesto Automático</span>
                  <span className="text-[9px] text-slate-500">Análise jurídica no 30º dia de mora</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProtestCartorioEnabled(!protestCartorioEnabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition duration-200 ${protestCartorioEnabled ? 'bg-amber-500' : 'bg-slate-800 border'}`}
                >
                  <div className={`w-3.8 h-3.8 rounded-full bg-slate-950 transition-all ${protestCartorioEnabled ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-[8px] text-slate-500 font-mono border-t border-slate-800/80">
              Gatilhos sob supervisão da régua Giffoni BOSS
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
