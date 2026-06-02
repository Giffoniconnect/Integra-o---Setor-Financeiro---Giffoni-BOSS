import React, { useState } from 'react';
import { 
  Coins, 
  Search, 
  PlusCircle, 
  CheckCircle, 
  X, 
  FileText, 
  Smartphone, 
  History,
  TrendingUp,
  Info,
  Calendar
} from 'lucide-react';
import { AgreementInstallment } from '../types';

interface ModuloAcordosAtivosProps {
  agreements: AgreementInstallment[];
  onAmortizeAgreement?: (id: string) => void;
  onNavigate: (path: string) => void;
}

export default function ModuloAcordosAtivos({
  agreements,
  onAmortizeAgreement,
  onNavigate
}: ModuloAcordosAtivosProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'regular' | 'atrasado' | 'quitado'>('all');

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  const formatToDDMMAAAA = (ymd: string) => {
    if (!ymd) return '';
    if (ymd.includes('/')) return ymd;
    const parts = ymd.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return ymd;
  };

  // Filter agreements
  const filteredAgreements = agreements.filter(ag => {
    const term = searchTerm.toLowerCase();
    const matchSearch = ag.debtor.toLowerCase().includes(term) || 
                        ag.id.toLowerCase().includes(term);
    const matchStatus = statusFilter === 'all' || ag.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-acordos">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-teal-600 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest">
            MÓDULO 08
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <Coins className="w-4 h-4 text-teal-600" /> Acordos Ativos (Amortizações e Pactuações)
          </h2>
          <p className="text-[10px] text-slate-500 font-sans">
            Acompanhamento de acordos judiciais e extrajudiciais, termos de parcelamento por ex-adverso e adimplência.
          </p>
        </div>
        
        {/* Navigation to creation */}
        <button
          onClick={() => onNavigate('/financeiro/modulo-10-cadastro-contrato')}
          className="px-3.5 py-1.8 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white font-bold text-[10px] rounded uppercase flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Paturar Acordo (Módulo 10)
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="mt-4 flex flex-col md:flex-row gap-3 items-center justify-between pb-3 border-b border-slate-100">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar devedor, número do acordo..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status filtering selection dropdown */}
        <div className="flex items-center gap-1 border border-gray-200 rounded px-2.5 py-1 bg-slate-50/55 text-[10px]">
          <span className="font-bold text-slate-500">Filtrar por Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-transparent focus:outline-none font-bold text-slate-805"
          >
            <option value="all">Ver Todos Módulos</option>
            <option value="regular">Regular / Em Dia</option>
            <option value="atrasado">Atrasado / Em Mora</option>
            <option value="quitado">Quitado / Concluído</option>
          </select>
        </div>

      </div>

      {/* LIST OF AGREEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredAgreements.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-slate-50 border border-dashed rounded text-slate-400 font-mono text-[10px]">
            Nenhum acordo cadastrado para os parâmetros pesquisados.
          </div>
        ) : (
          filteredAgreements.map(ag => {
            // Calculate repayment percentage index
            const amortizedPercent = Math.round((ag.currentInstallment / ag.installmentsCount) * 100);
            
            return (
              <div 
                key={ag.id} 
                className="p-3.5 border border-slate-200/80 bg-white hover:border-teal-200 rounded-lg shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[8px] font-mono bg-slate-50 border px-1 rounded text-slate-400 font-bold">
                        PACTO {ag.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{ag.debtor} (Devedor Ex-Adverso)</h4>
                    </div>
                    
                    <span className={`text-[8.5px] font-extrabold px-1.8 py-0.5 rounded uppercase ${
                      ag.status === 'quitado' ? 'bg-emerald-100 text-emerald-800' :
                      ag.status === 'atrasado' ? 'bg-red-100 text-red-800 animate-pulse' :
                      'bg-teal-50 text-teal-800 border border-teal-150'
                    }`}>
                      {ag.status}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 mt-1">Acordo Judicial • Amortização recorrente amortizável do escritório.</p>

                  {/* Amortization Progress Bar representation */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500">
                      <span>Progresso Amortização</span>
                      <span>{ag.currentInstallment} de {ag.installmentsCount} parcelas ({amortizedPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${amortizedPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Financial metrics list */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10.5px] bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase block font-sans font-bold">Valor Total Acordado</span>
                      <strong className="text-slate-800">{formatBRL(ag.totalValue)}</strong>
                    </div>
                    <div className="border-l border-slate-200 pl-2">
                      <span className="text-[8px] text-slate-400 uppercase block font-sans font-bold">Valor da Parcela</span>
                      <strong className="text-slate-800">{formatBRL(ag.installmentValue)}</strong>
                    </div>
                    <div className="pt-1.5 border-t border-slate-150">
                      <span className="text-[8px] text-slate-400 uppercase block font-sans font-bold">Próximo Vencimento</span>
                      <strong className="text-slate-700">{formatToDDMMAAAA(ag.nextDueDate)}</strong>
                    </div>
                    <div className="pt-1.5 border-t border-slate-150 border-l border-slate-200 pl-2">
                      <span className="text-[8px] text-slate-400 uppercase block font-sans font-bold">Amortizado Acumulado</span>
                      <strong className="text-emerald-700 font-black">{formatBRL(ag.currentInstallment * ag.installmentValue)}</strong>
                    </div>
                  </div>
                </div>

                {/* Interactive action buttons */}
                <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between">
                  {/* Fake Amortization history review overlay link */}
                  <button
                    onClick={() => {
                      alert(`Histórico de Amortização do Acordo ${ag.id}:\n- Parcela 1 paga em 20/04/2026 via Pix\n- Parcela 2 paga em 20/05/2026 via Boleto Caixa`);
                    }}
                    className="text-[9px] text-blue-600 font-bold hover:underline font-mono uppercase flex items-center gap-0.5"
                  >
                    <History className="w-3 h-3 text-slate-400" /> Histórico Amortização
                  </button>

                  {/* Action Quitar next parcel */}
                  {ag.status !== 'quitado' && (
                    <button
                      onClick={() => {
                        if (onAmortizeAgreement) {
                          onAmortizeAgreement(ag.id);
                        } else {
                          alert(`Amortização de título de ${ag.debtor} processada! Parcela computada no faturamento.`);
                        }
                      }}
                      className="px-2.5 py-1.2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[9px] rounded uppercase transition-colors"
                    >
                      Liquidar Próxima Parcela
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
