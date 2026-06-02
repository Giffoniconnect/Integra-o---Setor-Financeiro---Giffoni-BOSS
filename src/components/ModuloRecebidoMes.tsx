import React, { useState } from 'react';
import { 
  CheckCircle, 
  FileText, 
  History, 
  Layers, 
  Coins, 
  ArrowUpRight, 
  Download, 
  X, 
  Printer, 
  Check, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { Transaction } from '../types';

interface ModuloRecebidoMesProps {
  transactions: Transaction[];
  onUpdateStatus?: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
}

export default function ModuloRecebidoMes({
  transactions,
  onUpdateStatus
}: ModuloRecebidoMesProps) {

  // Paid income transactions only
  const receivedItems = transactions.filter(t => t.type === 'income' && t.status === 'paid');

  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<Transaction | null>(null);
  const [conciliationStatus, setConciliationStatus] = useState<{ [id: string]: boolean }>({
    'TX-001': true,
    'TX-003': true,
    'TX-006': true,
    'TX-008': true
  });

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  const handleToggleConciliation = (id: string) => {
    setConciliationStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Convert dates YYYY-MM-DD to DD/MM/AAAA format
  const formatToDDMMAAAA = (ymd: string) => {
    if (!ymd) return '';
    if (ymd.includes('/')) return ymd;
    const parts = ymd.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return ymd;
  };

  // Dynamic grouping by client/origem
  const clientSummary: { [client: string]: number } = {};
  receivedItems.forEach(item => {
    // Sanitize client name out of description e.g. "Honorários Mensais - Ambev S.A."
    const parts = item.description.split(' - ');
    const client = parts.length > 1 ? parts[1] : item.description;
    clientSummary[client] = (clientSummary[client] || 0) + item.value;
  });

  const totalReceivedValue = receivedItems.reduce((acc, current) => acc + current.value, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-recebido">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-emerald-650 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest">
            MÓDULO 04
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Valores Efetivamente Recebidos (Histórico de Caixa)
          </h2>
          <p className="text-[10px] text-slate-500 font-sans">
            Consulta consolidada de comprovações de transferências, auditoria e conciliação de caixa do escritório.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">Acumulado Recebido</span>
          <span className="text-base font-mono font-black text-emerald-600 leading-none">
            {formatBRL(totalReceivedValue)}
          </span>
        </div>
      </div>

      {/* TWO-COLUMN GRID: Left list, Right Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
        
        {/* Left list and controls (2/3 columns span) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-[11px] font-black text-slate-450 uppercase tracking-wider flex items-center gap-1">
            <History className="w-3.5 h-3.5 text-blue-500" /> Fluxograma Cronológico de Despachos
          </h3>

          <div className="space-y-1.5">
            {receivedItems.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed rounded text-slate-400 font-mono text-[10px]">
                Nenhum valor efetivamente liquidado no faturamento deste período.
              </div>
            ) : (
              receivedItems.map(tx => {
                const isConciliated = conciliationStatus[tx.id] ?? false;
                return (
                  <div 
                    key={tx.id} 
                    className="p-2.5 border border-slate-100 bg-white rounded-lg shadow-2xs hover:border-blue-150 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border">
                          {tx.id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 truncate" title={tx.description}>
                          {tx.description}
                        </h4>
                      </div>
                      <p className="text-[9px] text-slate-405 font-mono mt-0.5">
                        Liquidado em: {formatToDDMMAAAA(tx.date)} • Categoria: {tx.category}
                      </p>
                      
                      {/* Attached fake metadata files */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTxForReceipt(tx)}
                          className="text-[9px] text-blue-600 font-bold hover:underline flex items-center gap-0.5 uppercase"
                        >
                          <FileText className="w-2.5 h-2.5" /> Ver Comprovante Bancário
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-700 text-xs block">
                          {formatBRL(tx.value)}
                        </span>
                        
                        {/* Conciliacao toggle layout */}
                        <button
                          onClick={() => handleToggleConciliation(tx.id)}
                          className={`mt-1 inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase border transition-all ${
                            isConciliated 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          <Check className={`w-2 h-2 ${isConciliated ? 'opacity-100' : 'opacity-40'}`} />
                          <span>{isConciliated ? 'Conciliado NIBO' : 'Conciliação Manual'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right breakdown column (1/3 COLUMNS SPAN) */}
        <div className="space-y-4">
          
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 space-y-3">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Origem dos Recebimentos
            </h3>

            <div className="space-y-2.5">
              {Object.entries(clientSummary).map(([client, val]) => {
                const pct = ((val / (totalReceivedValue || 1)) * 100).toFixed(1);
                return (
                  <div key={client} className="text-[11px]">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold truncate max-w-[150px]">{client}</span>
                      <span className="font-mono text-slate-400 font-semibold">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                      <div className="bg-emerald-500 h-1 rounded-full animate-none" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-405 mt-0.5 inline-block">
                      Faturamento: {formatBRL(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-650 text-white rounded-lg p-3.5 text-xs relative overflow-hidden">
            <h3 className="font-bold uppercase tracking-wider">Conciliação de Diária</h3>
            <p className="text-[11px] text-blue-100 mt-1 pb-2 border-b border-blue-500/30">
              Todos os recebidos acima foram transmitidos à central de barramento de ERP Nibo Hub. 
            </p>
            <div className="pt-2 flex justify-between items-center text-[10px] text-blue-200">
              <span>Sincronizados Nibo:</span>
              <span className="font-mono font-bold text-white">4 / 4 Lotes</span>
            </div>
          </div>

        </div>

      </div>

      {/* COMPROVANTE DIGITAL INVOICE MODAL POPUP (BEAUTIFUL HIGH-MID DENSITY DESIGN) */}
      {selectedTxForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-350 max-w-lg w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-450" />
                <h3 className="text-xs font-black uppercase tracking-wider">Recibo do Comprovante de Pagamento</h3>
              </div>
              <button 
                onClick={() => setSelectedTxForReceipt(null)} 
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-4 space-y-4 font-sans text-xs">
              
              {/* Logo / Giffoni header */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-black text-slate-900 uppercase">GIFFONI ADVOGADOS ASSOCIADOS</h4>
                  <p className="text-[9px] text-slate-400">CNPJ: 14.502.193/0001-09 • OAB/MG nº 4.501</p>
                  <p className="text-[8px] text-slate-400">Belo Horizonte, MG • direito.rgr@gmail.com</p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] uppercase text-slate-404 block">Código Certificado</span>
                  <span className="font-mono font-bold text-slate-700 bg-slate-50 px-1.5 py-0.2 rounded border">
                    {selectedTxForReceipt.id}-CERT-2026
                  </span>
                </div>
              </div>

              {/* Receipt Declaration text */}
              <div className="bg-slate-25/40 p-3 rounded-md border border-slate-100 text-center space-y-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">QUITAÇÃO INTEGRAL</span>
                <h3 className="text-lg font-mono font-black text-slate-900 leading-none">
                  {formatBRL(selectedTxForReceipt.value)}
                </h3>
                <p className="text-[10px] text-emerald-700 font-bold font-mono">Status bancário: RECEBIDO E COMPENSADO VIA TEF</p>
              </div>

              {/* Data parameters */}
              <div className="space-y-1 text-[11px] text-slate-600">
                <p>Recebemos de <strong>{selectedTxForReceipt.description.split(' - ')[1] || selectedTxForReceipt.description}</strong> a importância líquida de <strong>{formatBRL(selectedTxForReceipt.value)}</strong> referente à quitação do título e conformidade da parcela.</p>
                
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-slate-100 text-[10px]">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block font-bold">Data de Liquidação</span>
                    <strong className="text-slate-800 font-mono">{formatToDDMMAAAA(selectedTxForReceipt.date)}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block font-bold">Tipo Recebimento</span>
                    <strong className="text-slate-800 font-mono">BOLETO REGISTRADO</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block font-bold">Meio Sincronizador</span>
                    <strong className="text-slate-800 font-mono">NIBO HUB API v4.1</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block font-bold">Situação da Conciliação</span>
                    <strong className="text-emerald-700 uppercase font-mono">RECONCILIADO INTEGRAL</strong>
                  </div>
                </div>
              </div>

              {/* Bottom footer print and export */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-[8px] font-mono text-slate-450">Fichamento gerado em 01/06/2026 • direito.rgr@gmail.com</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { window.print(); }}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded uppercase text-[9px]"
                  >
                    <Printer className="w-3 h-3 text-slate-400" /> Imprimir
                  </button>
                  <button 
                    onClick={() => { alert('Comprovante arquivado baixado como PDF!'); }}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white font-bold rounded uppercase text-[9px]"
                  >
                    <Download className="w-3 h-3 text-slate-300" /> Baixar PDF
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
