import React, { useState } from 'react';
import { 
  Server, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  History, 
  Download, 
  Cpu, 
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { NiboQueueItem } from '../types';

interface ModuloNiboProps {
  niboQueue: NiboQueueItem[];
  onSyncItem: (id: string) => void;
  onSyncAll: () => void;
  onResetToken: () => void;
}

export default function ModuloNibo({
  niboQueue,
  onSyncItem,
  onSyncAll,
  onResetToken
}: ModuloNiboProps) {

  const [activeSegment, setActiveSegment] = useState<'conferencia' | 'lancamento' | 'historico'>('lancamento');
  
  // Future automation space state
  const [scheduledSync, setScheduledSync] = useState(false);
  const [webhookSync, setWebhookSync] = useState(false);

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  // 1. Fila de lançamento (Status pending)
  const incomingLaunches = niboQueue.filter(q => q.status === 'pending');
  // 2. Fila de conferência (Status failed)
  const conferenceQueue = niboQueue.filter(q => q.status === 'failed');
  // 3. Histórico (Status synced)
  const historyQueue = niboQueue.filter(q => q.status === 'synced');

  const handleExportNiboJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(niboQueue, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'NIBO_Queue_Export_BOSS.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-nibo">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-indigo-600 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest">
            MÓDULO 07
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <Server className="w-4 h-4 text-indigo-600" /> Dashboard de Integração NIBO Hub
          </h2>
          <p className="text-[10px] text-slate-500 font-sans">
            Barramento unificado de movimentação física do faturamento interligado com o ERP Nibo.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetToken}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-[10px] font-bold uppercase transition"
          >
            Re-validar Credenciais API
          </button>
          
          <button
            onClick={onSyncAll}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-black uppercase transition shadow-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-none" /> Sincronizar Lote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-start">
        
        {/* Left Column - Segments & Queues (7/12 span) */}
        <div className="lg:col-span-7 space-y-3.5">
          
          {/* Segment controls */}
          <div className="flex border border-slate-150 p-0.5 bg-slate-50 rounded text-[10px] font-bold">
            <button
              onClick={() => setActiveSegment('conferencia')}
              className={`flex-1 py-1.5 rounded transition ${
                activeSegment === 'conferencia' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Fila de Conferência ({conferenceQueue.length})
            </button>
            <button
              onClick={() => setActiveSegment('lancamento')}
              className={`flex-1 py-1.5 rounded transition ${
                activeSegment === 'lancamento' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Fila de Lançamento ({incomingLaunches.length})
            </button>
            <button
              onClick={() => setActiveSegment('historico')}
              className={`flex-1 py-1.5 rounded transition ${
                activeSegment === 'historico' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Histórico Sincronizado ({historyQueue.length})
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            
            {/* SEGMENT 1: CONFERÊNCIA (FAILED IN NIBO) */}
            {activeSegment === 'conferencia' && (
              conferenceQueue.length === 0 ? (
                <div className="text-center py-10 bg-slate-25/50 border border-dashed rounded text-slate-400 font-mono text-[10px]">
                  Nenhum lote pendente de conferência ou parado por erro.
                </div>
              ) : (
                conferenceQueue.map(item => (
                  <div key={item.id} className="p-3 bg-red-50/20 border border-red-200 rounded-lg text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 leading-tight">{item.description}</strong>
                      <span className="font-mono font-bold text-red-700">{formatBRL(item.value)}</span>
                    </div>
                    {item.errorDescription && (
                      <div className="p-2 bg-red-105/5 border border-red-100 rounded text-[10px] text-red-600 font-mono">
                        ⚠️ Gárgula Erro: {item.errorDescription}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[9px] text-slate-405 font-mono pt-1">
                      <span>Vencimento original: {item.date} • Tentativas: {item.attempts}/3</span>
                      <button
                        onClick={() => onSyncItem(item.id)}
                        className="px-2 py-0.8 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase text-[8px]"
                      >
                        Corrigir e Forçar Sincronizar
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {/* SEGMENT 2: FILA DE LANÇAMENTO (PENDING IN NIBO) */}
            {activeSegment === 'lancamento' && (
              incomingLaunches.length === 0 ? (
                <div className="text-center py-10 bg-slate-25/50 border border-dashed rounded text-slate-400 font-mono text-[10px]">
                  Nenhum lançamento pronto parado na fila de envio de lote.
                </div>
              ) : (
                incomingLaunches.map(item => (
                  <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-lg text-[11px] hover:border-indigo-150 transition-all shadow-2xs flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.description}</h4>
                      <p className="text-[10px] text-slate-405 mt-0.5">Vencimento Planejado: {item.date} • Tipo: {item.type.toUpperCase()}</p>
                      <span className="text-[8px] bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-1.5 py-0.2 rounded font-bold mt-1 inline-block uppercase">
                        Aguardando Sincronismo
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-800 text-xs block">{formatBRL(item.value)}</span>
                      <button
                        onClick={() => onSyncItem(item.id)}
                        className="mt-1 px-2.5 py-0.8 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold uppercase rounded font-mono"
                      >
                        Sincronizar
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {/* SEGMENT 3: HISTÓRICO INTEGRADO */}
            {activeSegment === 'historico' && (
              historyQueue.length === 0 ? (
                <div className="text-center py-10 bg-slate-25/50 border border-dashed rounded text-slate-400 font-mono text-[10px]">
                  Nenhum log no banco local de histórico integrado.
                </div>
              ) : (
                historyQueue.map(item => (
                  <div key={item.id} className="p-2.5 bg-slate-25/40 border border-slate-100 rounded-lg text-[11px] flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <h4 className="font-medium text-slate-700 truncate max-w-[200px]">{item.description}</h4>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">ID Nibo Trans: {item.id} • Data: {item.date}</p>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-500 shrink-0">
                      <span>{formatBRL(item.value)}</span>
                      <span className="text-[8.5px] block text-emerald-600 uppercase font-bold font-sans">Enviado com sucesso</span>
                    </div>
                  </div>
                ))
              )
            )}

          </div>

          {/* EXPORTS WRAP */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Formato dos dados compatível com Nibo Import v3.5 SP</span>
            <button
              onClick={handleExportNiboJSON}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 border border-slate-200 hover:bg-slate-100 rounded uppercase font-sans text-slate-750"
            >
              <Download className="w-3.5 h-3.5" /> Baixar Lotes JSON
            </button>
          </div>

        </div>

        {/* Right Column - Future Automation Toggles & Explanations (5/12 span) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-indigo-950 text-white rounded-lg p-3.5 border border-indigo-900 space-y-3 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
              <Cpu className="w-24 h-24 text-white" />
            </div>
            
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
              <h3 className="text-[10px] font-black uppercase tracking-wider text-indigo-305">Estrutura de Autocompany (Automação Futura)</h3>
            </div>
            
            <p className="text-[10px] text-indigo-200 leading-normal font-sans">
              Está reservado o barramento local de acionamentos para automação direta via barramento do Giffoni BOSS. Ative as chaves simulativas do motor e configure o agendamento futuro:
            </p>

            <div className="space-y-3 pt-2 text-[11px]">
              {/* Toggle Auto 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-white">Cron Agendador Diário</span>
                  <span className="text-[9px] text-indigo-300">Sincronizar faturamento às 05:00 todos os dias</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduledSync(!scheduledSync)}
                  className={`w-9 h-5 rounded-full p-0.5 transition duration-200 ${scheduledSync ? 'bg-indigo-400' : 'bg-slate-800 border-indigo-800 border'}`}
                >
                  <div className={`w-3.8 h-3.8 rounded-full bg-slate-950 transition-all ${scheduledSync ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Toggle Auto 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-white">Webhooks Instantâneos</span>
                  <span className="text-[9px] text-indigo-300">Transmitir lançamentos e comprovantes na hora</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWebhookSync(!webhookSync)}
                  className={`w-9 h-5 rounded-full p-0.5 transition duration-200 ${webhookSync ? 'bg-indigo-400' : 'bg-slate-800 border-indigo-800 border'}`}
                >
                  <div className={`w-3.8 h-3.8 rounded-full bg-slate-950 transition-all ${webhookSync ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="p-2 border-t border-indigo-900 bg-indigo-900/40 rounded text-[9.5px] leading-relaxed text-indigo-200">
              <strong className="text-white">Escopo Futuro NIBO Webhooks:</strong> Integra-se diretamente ao barramento de API oficial do Nibo, recebendo confirmações de boleto e gerando baixa operacional automaticamente.
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded text-[10.5px] space-y-2 text-slate-500">
            <h4 className="font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-500" /> Nota de Auditoria ERP
            </h4>
            <p className="leading-normal">
              A conferência das parcelas do Giffoni BOSS deve respeitar o prazo legal para repasse de comissões. Ao sincronizar um lote com o ERP, o status financeiro de "Local" passará para "Integrado".
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
