import React, { useState } from 'react';
import { SuccessContract } from '../types';
import { Scale, Award, Trophy, TrendingUp, AlertCircle, Plus, Sparkles, DollarSign } from 'lucide-react';

interface SuccessContractsProps {
  contracts: SuccessContract[];
  onAddContract: (contract: Omit<SuccessContract, 'id'>) => void;
  onUpdateStatus: (id: string, status: SuccessContract['status']) => void;
}

export default function SuccessContracts({ contracts, onAddContract, onUpdateStatus }: SuccessContractsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [client, setClient] = useState('');
  const [processNumber, setProcessNumber] = useState('');
  const [baseValue, setBaseValue] = useState('');
  const [percentFee, setPercentFee] = useState('15');
  const [probability, setProbability] = useState<'alta' | 'media' | 'baixa'>('alta');
  const [expectedDate, setExpectedDate] = useState('2026-07-01');

  const activeContracts = contracts.filter(c => c.status === 'ativo' || c.status === 'ganho');
  const closedContracts = contracts.filter(c => c.status === 'perdido' || c.status === 'faturado');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !processNumber || !baseValue) return;

    const baseValNumber = Number(baseValue);
    const percentNum = Number(percentFee);
    const expectedFee = (baseValNumber * percentNum) / 100;

    onAddContract({
      client,
      processNumber,
      baseValue: baseValNumber,
      percentFee: percentNum,
      expectedFee,
      probability,
      status: 'ativo',
      expectedDate
    });

    // Reset fields
    setClient('');
    setProcessNumber('');
    setBaseValue('');
    setIsFormOpen(false);
  };

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  const getProbabilityBadge = (prob: 'alta' | 'media' | 'baixa') => {
    switch (prob) {
      case 'alta':
        return <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">ALTA</span>;
      case 'media':
        return <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full">MÉDIA</span>;
      case 'baixa':
        return <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full">BAIXA</span>;
    }
  };

  const getStatusBadge = (status: SuccessContract['status']) => {
    switch (status) {
      case 'ativo':
        return <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-100 rounded-full">ATIVO (EM CURSO)</span>;
      case 'ganho':
        return <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full flex items-center gap-1"><Trophy className="w-3 h-3 text-emerald-600" /> GANHO</span>;
      case 'faturado':
        return <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full">FATURADO E PAGO</span>;
      case 'perdido':
        return <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full">PERDIDO / NEGADO</span>;
    }
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-contratos">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 06</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Scale className="w-4 h-4 text-blue-500" /> Contratos de Êxito (Honorários Variáveis)
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Gestão de honorários advocatícios ou de consultoria vinculados a resultados</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white rounded transition-colors shadow-xs uppercase font-sans shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Mapear Contrato de Êxito
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 bg-slate-50 border border-gray-200 rounded space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Novo Contrato com Cláusula de Êxito</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Nome do Cliente</label>
              <input
                type="text"
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="Ex. Petróleo Brasileiro S.A."
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Processo / Ação Judicial</label>
              <input
                type="text"
                value={processNumber}
                onChange={e => setProcessNumber(e.target.value)}
                placeholder="Ex. 500294-88.2025.8.21.0001"
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Valor da Causa / Proveito (R$)</label>
              <input
                type="number"
                value={baseValue}
                onChange={e => setBaseValue(e.target.value)}
                placeholder="Ex. 500000"
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Porcentagem (Quota-Litis %)</label>
              <input
                type="number"
                value={percentFee}
                onChange={e => setPercentFee(e.target.value)}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Probabilidade de Êxito</label>
              <select
                value={probability}
                onChange={e => setProbability(e.target.value as any)}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded"
              >
                <option value="alta">Alta Probabilidade</option>
                <option value="media">Média Probabilidade</option>
                <option value="baixa">Baixa Probabilidade</option>
              </select>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Previsão Resolutiva</label>
              <input
                type="date"
                value={expectedDate}
                onChange={e => setExpectedDate(e.target.value)}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-[10px] uppercase font-bold px-2.5 py-1.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-[10px] uppercase font-bold px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Mapear Honorário
            </button>
          </div>
        </form>
      )}

      {/* Contracts Showcase */}
      <div className="mt-4 space-y-3">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contratos em Progresso ({activeContracts.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeContracts.length === 0 ? (
            <p className="col-span-2 text-xs text-slate-450 italic text-center py-4 bg-slate-50 rounded border">Nenhum contrato ativo em andamento.</p>
          ) : (
            activeContracts.map(c => (
              <div key={c.id} className="p-3 bg-slate-50/50 border border-gray-250 rounded relative overflow-hidden flex flex-col justify-between hover:border-gray-355 hover:bg-slate-50/70 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 font-bold">{c.id}</span>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight mt-0.5">{c.client}</h4>
                      <p className="text-[9px] font-mono text-slate-500 mt-0.5">Nº Proc: {c.processNumber}</p>
                    </div>
                    <div className="shrink-0">{getStatusBadge(c.status)}</div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-y border-dashed border-slate-200 py-1.5 my-2 bg-white/70 p-2 rounded">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Val. Causa / Base</p>
                      <p className="font-mono font-bold text-slate-700">{formatBRL(c.baseValue)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Quota Fee ({c.percentFee}%)</p>
                      <p className="font-mono font-bold text-blue-600">{formatBRL(c.expectedFee)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs my-1.5">
                    <span className="text-slate-500">Probabilidade de Lucro:</span>
                    <div>{getProbabilityBadge(c.probability)}</div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-1">
                    Previsão de Desfecho: <span className="font-bold text-slate-600">{c.expectedDate}</span>
                  </div>
                </div>

                {/* State transitioning actions */}
                {c.status === 'ativo' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onUpdateStatus(c.id, 'perdido')}
                      className="text-[9px] font-bold px-2 py-1.5 border border-red-200 text-red-700 hover:bg-rose-50 rounded uppercase font-sans tracking-wide"
                    >
                      Improcedente
                    </button>
                    <button
                      onClick={() => onUpdateStatus(c.id, 'ganho')}
                      className="text-[9px] font-bold px-2.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors flex items-center gap-1 uppercase font-sans tracking-wide"
                    >
                      <Trophy className="w-3 h-3 text-emerald-100" /> Sentença Favorável
                    </button>
                  </div>
                )}

                {c.status === 'ganho' && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 bg-emerald-50/50 p-2 rounded border border-dashed border-emerald-100">
                    <span className="text-[9px] text-emerald-800 font-bold flex items-center gap-0.5">
                      <Award className="w-3 h-3 animate-bounce" /> Sentença favorável!
                    </span>
                    <button
                      onClick={() => onUpdateStatus(c.id, 'faturado')}
                      className="text-[9px] font-bold px-2 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded transition-colors uppercase font-sans tracking-wide"
                    >
                      Faturar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Historico / Quitados */}
        {closedContracts.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Histórico Resolutivo ({closedContracts.length})</h4>
            <div className="space-y-1.5">
              {closedContracts.map(c => (
                <div key={c.id} className="p-2 border border-slate-200 rounded bg-white flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-700">{c.client} - <span className="font-mono text-slate-400 text-[10px] font-bold">{c.id}</span></p>
                    <p className="text-[9px] text-slate-400 font-mono">Proc: {c.processNumber} • Res: {c.expectedDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[8px] text-slate-400 uppercase font-bold leading-none">Resultado</p>
                      <span className="font-mono font-bold text-slate-700 text-[11px] leading-tight block mt-0.5">{formatBRL(c.expectedFee)}</span>
                    </div>
                    <div className="shrink-0">{getStatusBadge(c.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
