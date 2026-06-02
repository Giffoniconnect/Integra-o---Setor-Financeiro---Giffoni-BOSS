import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Filter, 
  X, 
  RefreshCw, 
  DollarSign, 
  Smartphone, 
  CheckCircle, 
  FileText, 
  AlertCircle,
  Clock,
  ArrowRight,
  Upload,
  UserCheck
} from 'lucide-react';
import { CriticalAlert, Transaction, AgreementInstallment, NiboQueueItem } from '../types';

interface ModuloAlertasCriticosProps {
  alerts: CriticalAlert[];
  transactions: Transaction[];
  agreements: AgreementInstallment[];
  niboQueue: NiboQueueItem[];
  onDismiss: (id: string) => void;
  onResolveAlert: (alertType: string, id: string) => void;
  onUpdateTransactionStatus: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  onUploadReceipt: (txId: string, fileName: string) => void;
}

export default function ModuloAlertasCriticos({
  alerts,
  transactions,
  agreements,
  niboQueue,
  onDismiss,
  onResolveAlert,
  onUpdateTransactionStatus,
  onUploadReceipt
}: ModuloAlertasCriticosProps) {
  
  const [activeTab, setActiveTab] = useState<'todos' | 'vencidos' | 'comprovante' | 'rateio' | 'nibo' | 'conferenca'>('todos');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium'>('all');
  
  // Simulated file input trigger
  const [uploadingTxId, setUploadingTxId] = useState<string | null>(null);

  // Helper formats
  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  const handleSimulatedUpload = (txId: string) => {
    onUploadReceipt(txId, 'comprovante_transacao_boss_' + txId.toLowerCase() + '.pdf');
    setUploadingTxId(null);
  };

  // Compile pending categories list
  // 1. Overdue/Atrazadas
  const overdueTransactions = transactions.filter(t => t.status === 'overdue');
  const lateAgreements = agreements.filter(a => a.status === 'atrasado');

  // 2. Contratos sem comprovante (transactions that are paid but need file upload indicator)
  // Let's filter transaction type income where value > 10000 and status paid (simulating needing document proof)
  const missingReceipts = transactions.filter(t => t.type === 'income' && t.status === 'paid' && t.value >= 12000);

  // 3. Rateios pendentes (Clean state for system tests)
  const pendingRateios: any[] = [];

  // 4. Divergências Financeiras (Clean state for system tests)
  const financialDivergences: any[] = [];

  // 5. Lançamentos não conciliados
  const nonConciliatedTxs = transactions.filter(t => !t.isNiboSynced && t.status === 'paid');

  // 6. Nibo queue items that are pending or failed
  const failedNiboItems = niboQueue.filter(q => q.status === 'failed' || q.status === 'pending');

  // Active alarms (non dismissed alerts)
  const activeAlarms = alerts.filter(a => !a.dismissed);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-alertas">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-red-600 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest">
            MÓDULO 02
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <ShieldAlert className="w-4 h-4 text-red-600" /> Alertas Críticos e Central de Pendências
          </h2>
          <p className="text-[10px] text-slate-500">
            Monitor de riscos financeiros, comprovações, rateios e conciliações de caixa do Giffoni BOSS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-mono font-bold rounded">
            {activeAlarms.length} Sinais Urgentes
          </span>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-mono font-bold rounded">
            {overdueTransactions.length + lateAgreements.length} Parcelas Vencidas
          </span>
        </div>
      </div>

      {/* Navigation Filter Tabs for Pending Areas */}
      <div className="flex flex-wrap gap-1.5 mt-4 p-1 bg-slate-50 border border-slate-100 rounded text-[10px]">
        <button
          onClick={() => setActiveTab('todos')}
          className={`px-3 py-1.5 rounded font-bold transition-all ${
            activeTab === 'todos' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Alertas Ativos ({activeAlarms.length})
        </button>
        <button
          onClick={() => setActiveTab('vencidos')}
          className={`px-3 py-1.5 rounded font-bold transition-all ${
            activeTab === 'vencidos' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Parcelas Vencidas ({overdueTransactions.length + lateAgreements.length})
        </button>
        <button
          onClick={() => setActiveTab('comprovante')}
          className={`px-3 py-1.5 rounded font-bold transition-all ${
            activeTab === 'comprovante' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sem Comprovante ({missingReceipts.length})
        </button>
        <button
          onClick={() => setActiveTab('rateio')}
          className={`px-3 py-1.5 rounded font-bold transition-all ${
            activeTab === 'rateio' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Rateios & Divergências ({pendingRateios.length + financialDivergences.length})
        </button>
        <button
          onClick={() => setActiveTab('nibo')}
          className={`px-3 py-1.5 rounded font-bold transition-all ${
            activeTab === 'nibo' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Pendências NIBO ({failedNiboItems.length})
        </button>
      </div>

      {/* Sub-Filters option */}
      <div className="mt-3 flex items-center justify-between pb-2 border-b border-slate-50 text-[10px]">
        <span className="text-slate-400 font-mono">Filtros operacionais aplicados</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold">Criticidade:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="bg-transparent focus:outline-none border-b border-dotted border-slate-400 font-bold py-0.5 text-slate-800"
          >
            <option value="all">Ver Todas</option>
            <option value="high">Apenas Alta Urgência</option>
            <option value="medium">Média Importância</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        
        {/* TAB 1: ALERTS ATIVOS */}
        {activeTab === 'todos' && (
          activeAlarms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 bg-slate-25/50 border border-dashed border-slate-200 rounded text-center">
              <UserCheck className="w-8 h-8 text-emerald-500 mb-2" />
              <h4 className="text-xs font-bold text-slate-700">Tudo em conformidade!</h4>
              <p className="text-[10px] text-slate-450">Nenhum sinal crítico disparado no sistema financeiro.</p>
            </div>
          ) : (
            activeAlarms
              .filter(a => severityFilter === 'all' || a.severity === severityFilter)
              .map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] ${
                    alert.severity === 'high' ? 'bg-red-50/50 border-red-150' : 'bg-amber-50/40 border-amber-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`p-1 rounded mt-0.5 ${alert.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800">{alert.message}</strong>
                        <span className="text-[8px] font-mono bg-white border border-slate-200/60 px-1.5 py-0.2 rounded text-slate-500">
                          {alert.id}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{alert.subtext}</p>
                      <span className="text-[9px] text-slate-405 font-mono">Registrado: {alert.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {alert.type === 'sync_fail' && (
                      <button
                        onClick={() => onResolveAlert('sync_fail', alert.id)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[9px] uppercase transition-colors"
                      >
                        Re-tentar Autenticar NIBO
                      </button>
                    )}
                    {alert.type === 'overdue' && (
                      <button
                        onClick={() => onResolveAlert('overdue', alert.id)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-[9px] uppercase transition-colors"
                      >
                        Registrar Compensação
                      </button>
                    )}
                    {alert.type === 'agreement_delay' && (
                      <button
                        onClick={() => onResolveAlert('agreement_delay', alert.id)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[9px] uppercase transition-colors"
                      >
                        Disparar WhatsApp
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
          )
        )}

        {/* TAB 2: PARCELAS VENCIDAS */}
        {activeTab === 'vencidos' && (
          <div className="space-y-2">
            {/* Table of overdue invoices */}
            {overdueTransactions.length === 0 && lateAgreements.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed rounded text-slate-400 font-mono text-[11px]">
                Nenhum lançamento físico ou acordo em atraso.
              </div>
            ) : (
              <>
                <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-600 font-mono leading-relaxed border border-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>
                    Atenção: Os recebimentos identificados abaixo ultrapassaram o vencimento sem indicação de pagamento ou upload de comprovantes no Portal BOSS.
                  </span>
                </div>
                {overdueTransactions.map(tx => (
                  <div key={tx.id} className="p-2.5 border border-red-150 bg-red-50/15 rounded flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-slate-800">{tx.description}</p>
                      <p className="text-[10px] text-slate-500">Mola de Atendimento • Categoria: {tx.category}</p>
                      <p className="text-[9px] text-red-650 font-mono">Diferença de Dias: Vencido em {tx.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-red-700 text-xs">{formatBRL(tx.value)}</span>
                      <button
                        onClick={() => onUpdateTransactionStatus(tx.id, 'paid')}
                        className="px-2 py-0.8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[9px] uppercase"
                      >
                        Quitar Parcela
                      </button>
                    </div>
                  </div>
                ))}
                {lateAgreements.map(ag => (
                  <div key={ag.id} className="p-2.5 border border-red-150 bg-red-50/15 rounded flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-slate-800">Acordo Devedor — {ag.debtor}</p>
                      <p className="text-[10px] text-slate-500">Fichamento {ag.id} • Parcela {ag.currentInstallment + 1} de {ag.installmentsCount}</p>
                      <p className="text-[9px] text-red-650 font-mono">Próxima Vencimento: {ag.nextDueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-red-700 text-xs">{formatBRL(ag.installmentValue)}</span>
                      <button
                        onClick={() => onResolveAlert('agreement_delay', ag.id)}
                        className="px-2 py-0.8 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[9px] uppercase"
                      >
                        Cobrar WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* TAB 3: SEM COMPROVANTE */}
        {activeTab === 'comprovante' && (
          <div className="space-y-2">
            {missingReceipts.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed rounded text-slate-400 font-mono text-[11px]">
                Nenhum lançamento pago relevante aguardando comprovante.
              </div>
            ) : (
              <>
                <div className="bg-slate-50 p-2 text-[10px] text-slate-500 border border-slate-100 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Lançamentos pagos necessitando arquivo físico (.PDF, .PNG) de comprovante bancário ou recibo outorgado.</span>
                </div>
                {missingReceipts.map(tx => (
                  <div key={tx.id} className="p-2.5 border border-slate-100/80 bg-slate-50/10 rounded flex items-center justify-between text-[11px] hover:border-blue-200 transition-all">
                    <div>
                      <p className="font-bold text-slate-800">{tx.description}</p>
                      <p className="text-[9px] text-slate-405 font-mono">Data do Pagamento: {tx.date} • ID: {tx.id}</p>
                      {/* Attached file status representation */}
                      <span className="text-[9px] bg-red-100 text-red-800 px-1 py-0.2 rounded font-bold mt-1 inline-block">
                        Falta Arquivo Comprovante
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-800">{formatBRL(tx.value)}</span>
                      
                      {uploadingTxId === tx.id ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleSimulatedUpload(tx.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-1 rounded text-[9px] uppercase transition-colors"
                          >
                            Simular Arquivo
                          </button>
                          <button
                            onClick={() => setUploadingTxId(null)}
                            className="border border-slate-200 p-1 rounded text-[9px] text-slate-500 hover:bg-slate-100"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUploadingTxId(tx.id)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white text-[9px] font-bold uppercase rounded font-mono"
                        >
                          <Upload className="w-3 h-3 text-slate-300" /> Selecionar PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* TAB 4: RATEIOS E DIVERGÊNCIAS */}
        {activeTab === 'rateio' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-wider mb-2">Divisões de Rateio Sob Auditoria</h4>
              <div className="space-y-1.5">
                {pendingRateios.map(rt => (
                  <div key={rt.id} className="p-2.5 bg-slate-25/40 border border-slate-150 rounded text-[11px]">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 leading-tight">{rt.name}</strong>
                      <span className="font-mono font-bold text-slate-700">{formatBRL(rt.value)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{rt.desc}</p>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex justify-end gap-1.5">
                      <button className="px-2 py-0.5 max-h-5.5 text-[9px] font-black uppercase text-blue-600 border border-blue-500/10 hover:bg-blue-50 rounded">
                        Processar Rateio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-wider mb-2">Divergências e Inconsistências de Lançamento</h4>
              <div className="space-y-1.5">
                {financialDivergences.map(div => (
                  <div key={div.id} className="p-2.5 bg-amber-50/15 border border-amber-200 rounded text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                        Origem: {div.source}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400">{div.id}</span>
                    </div>
                    <p className="text-slate-700 mt-1">{div.message}</p>
                    <div className="mt-2 text-right">
                      <button className="px-2 py-0.5 text-[9px] font-black bg-amber-600 hover:bg-amber-700 text-white rounded uppercase">
                        Ignorar / Conciliar Manul
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PENDÊNCIAS NIBO */}
        {activeTab === 'nibo' && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded text-[10px] text-slate-600 font-mono leading-relaxed">
              <strong>Sincronização ERP Nibo:</strong> Para as falhas relatadas abaixo, certifique-se de que a conta bancária do cliente está validada no ERP e o token de barramento local está renovado.
            </div>
            
            {failedNiboItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-mono text-[10px]">
                Nenhuma pendência na fila Nibo. Todos os lotes sincronizados!
              </div>
            ) : (
              <div className="space-y-2">
                {failedNiboItems.map(item => (
                  <div key={item.id} className="p-2.5 border border-slate-100 bg-white rounded shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between text-[11px] gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{item.description}</span>
                        <span className={`text-[8px] font-bold px-1.5 rounded uppercase ${
                          item.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status === 'failed' ? 'Falhou Sincronia' : 'Envio Pendente'}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Vencimento original: {item.date} • Tentativas: {item.attempts}</p>
                      {item.errorDescription && (
                        <p className="text-[10px] text-red-600 font-mono bg-red-50/20 p-1 border border-red-100 rounded mt-1">
                          {item.errorDescription}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      <span className="font-mono font-bold text-slate-800 mr-2">{formatBRL(item.value)}</span>
                      <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold uppercase rounded">
                        Forçar Sincronizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
