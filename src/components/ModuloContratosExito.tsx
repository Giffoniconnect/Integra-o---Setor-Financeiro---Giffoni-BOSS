import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  Percent, 
  HelpCircle, 
  Calculator, 
  Check, 
  RefreshCw, 
  Info,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { SuccessContract } from '../types';

interface ModuloContratosExitoProps {
  successContracts: SuccessContract[];
  onAddContract?: (contract: Omit<SuccessContract, 'id'>) => void;
}

export default function ModuloContratosExito({
  successContracts,
  onAddContract
}: ModuloContratosExitoProps) {

  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulation simulator state values
  const [simBaseValue, setSimBaseValue] = useState<number>(150000.00);
  const [simPercentFee, setSimPercentFee] = useState<number>(20);
  const [simClientRateio, setSimClientRateio] = useState<number>(80);

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

  const filteredContracts = successContracts.filter(c => {
    const term = searchTerm.toLowerCase();
    return c.client.toLowerCase().includes(term) || c.processNumber.toLowerCase().includes(term);
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-exito">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-purple-600 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest">
            MÓDULO 09
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <Sparkles className="w-4 h-4 text-purple-650" /> Contratos de Êxito "Ad Exitum" e Modelagens
          </h2>
          <p className="text-[10px] text-slate-500 font-sans">
            Mapeamento analítico de repasses de contingência, apuração de créditos, rateio advogado/cliente e projeções de faturamento.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Êxito Previsto Geral</span>
          <span className="text-base font-mono font-black text-purple-600 leading-none">
            {formatBRL(successContracts.reduce((acc, c) => acc + c.expectedFee, 0))}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-start col-span-12">
        
        {/* Left Column: Contracts list (7/12 col span) */}
        <div className="lg:col-span-7 space-y-3.5">
          <h3 className="text-[11px] font-black text-slate-450 uppercase tracking-wider flex items-center justify-between">
            <span>Fichas Judiciais de Probabilidade e Contingência</span>
            <span className="text-[9.5px] font-mono text-slate-400">Total: {filteredContracts.length} contratos</span>
          </h3>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Fórmula Todoist, devedor, cliente..."
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5">
            {filteredContracts.map(c => {
              // Standard client/office breakdown simulation layout
              const officeWeight = c.expectedFee;
              const clientWeight = c.baseValue - officeWeight;
              
              return (
                <div key={c.id} className="p-3 border border-slate-150 bg-white rounded-lg shadow-2xs hover:border-purple-200 transition-all text-[11px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 leading-tight">{c.client}</h4>
                      <p className="text-[9.5px] text-slate-404 font-mono mt-0.5">Proc: {c.processNumber} • Data Êxito: {formatToDDMMAAAA(c.expectedDate)}</p>
                    </div>

                    <span className="font-mono font-black text-purple-700 text-xs">
                      {formatBRL(c.expectedFee)}
                    </span>
                  </div>

                  {/* Distribution breakdown formula representation */}
                  <div className="mt-3 grid grid-cols-3 gap-2 py-2 px-2.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-mono text-slate-600">
                    <div>
                      <span className="text-[7.5px] text-slate-400 block font-sans uppercase">Base Estimada</span>
                      <strong>{formatBRL(c.baseValue)}</strong>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-400 block font-sans uppercase">Proporção BOSS ({c.percentFee}%)</span>
                      <strong className="text-purple-700">{formatBRL(officeWeight)}</strong>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-400 block font-sans uppercase">Repasse Mandante ({100 - c.percentFee}%)</span>
                      <strong className="text-slate-700">{formatBRL(clientWeight)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] text-slate-450">Fase processual:</span>
                    <span className="text-[9px] font-bold text-slate-700">Sentença Liquidada / Cálculo Homologado</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Rateio modeling simulator (5/12 col span) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Modeling Simulation Frame */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
            <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Calculator className="w-4 h-4 text-purple-650" /> Simulador de Divisão de Êxito (Simula Rateio)
            </h3>

            <div className="space-y-3 text-[11px] text-slate-600">
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-500 uppercase">Valor do Ganho da Causa (R$)</span>
                  <span className="font-mono text-slate-405 font-bold">{formatBRL(simBaseValue)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={simBaseValue}
                  onChange={e => setSimBaseValue(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-1 bg-slate-200 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-500 uppercase">Percentual do Advogado ({simPercentFee}%)</span>
                  <span className="font-mono text-slate-405 font-bold">{simPercentFee}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={simPercentFee}
                  onChange={e => setSimPercentFee(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-1 bg-slate-200 rounded-lg"
                />
              </div>

            </div>

            {/* Calculations representation */}
            <div className="border-t border-slate-200 pt-3 space-y-2 font-mono">
              <h4 className="text-[9px] uppercase font-bold text-slate-400">Proporções de Liquidação Estimada:</h4>
              
              <div className="p-2.5 bg-white border border-slate-100 rounded flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-[8px] font-sans text-slate-450 block uppercase">Feriado Especialist / BOSS Honorários</span>
                  <strong className="text-purple-700 text-xs">{formatBRL((simBaseValue * simPercentFee) / 100)}</strong>
                </div>
                <span className="text-slate-400 font-bold">{simPercentFee}%</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-100 rounded flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-[8px] font-sans text-slate-450 block uppercase">Repasse Mandante Cliente</span>
                  <strong className="text-slate-700 text-xs">{formatBRL((simBaseValue * (100 - simPercentFee)) / 100)}</strong>
                </div>
                <span className="text-slate-400 font-bold">{100 - simPercentFee}%</span>
              </div>
            </div>

            <p className="text-[9.5px] leading-relaxed text-slate-450 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>O faturamento ad exitum é gerado em parcelas pelo judiciário no momento da expedição do alvará de quitação e do respectivo precatório.</span>
            </p>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-100 text-[10px] text-purple-900 rounded space-y-1">
            <span className="font-bold uppercase tracking-widest block text-[8.5px]">RECOVA ALVARÁ DETECTOR</span>
            <p className="leading-snug">
              A conferência eletrônica de alvarás do tribunal de Minas Gerais está integrada simetricamente. Alavancamento de créditos futuros de êxito ocorre a cada 24 horas.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
