import React, { useState } from 'react';
import { AgreementInstallment } from '../types';
import { Coins, Check, AlertCircle, Plus, Calendar, ArrowRight, TrendingUp } from 'lucide-react';

interface AgreementsInstallmentsProps {
  agreements: AgreementInstallment[];
  onAddAgreement: (ag: Omit<AgreementInstallment, 'id'>) => void;
  onPayInstallment: (id: string) => void;
}

export default function AgreementsInstallments({ agreements, onAddAgreement, onPayInstallment }: AgreementsInstallmentsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [debtor, setDebtor] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState('10');
  const [installmentValue, setInstallmentValue] = useState('');
  const [nextDueDate, setNextDueDate] = useState('2026-06-15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtor || !totalValue || !installmentsCount || !installmentValue) return;

    onAddAgreement({
      debtor,
      totalValue: Number(totalValue),
      installmentsCount: Number(installmentsCount),
      currentInstallment: 0,
      installmentValue: Number(installmentValue),
      nextDueDate,
      status: 'em_dia'
    });

    setDebtor('');
    setTotalValue('');
    setInstallmentValue('');
    setIsFormOpen(false);
  };

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  const getStatusBadge = (status: AgreementInstallment['status']) => {
    switch (status) {
      case 'em_dia':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full flex items-center gap-1">✨ EM DIA</span>;
      case 'atrasado':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full flex items-center gap-1 animate-pulse">⏰ ATRASADO</span>;
      case 'quitado':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-100 rounded-full flex items-center gap-1">🎉 QUITADO</span>;
    }
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-acordos">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 07</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Coins className="w-4 h-4 text-blue-500" /> Acordos e Parcelamentos Ativos
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Acompanhamento de repactuações, termos de confissão de dívida e recebíveis fracionados</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white rounded transition-colors shadow-xs uppercase font-sans shrink-0"
        >
          <Plus className="w-4 h-4" /> Pactuar Novo Acordo
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 bg-slate-50 border border-gray-200 rounded space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Formalizar Termo de Confissão / Acordo de Dívida</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Nome do Devedor / Cliente</label>
              <input
                type="text"
                value={debtor}
                onChange={e => setDebtor(e.target.value)}
                placeholder="Ex. Supermercados Guanabara"
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Valor Total do Acordo (R$)</label>
              <input
                type="number"
                value={totalValue}
                onChange={e => {
                  setTotalValue(e.target.value);
                  if (e.target.value && installmentsCount) {
                    setInstallmentValue((Number(e.target.value) / Number(installmentsCount)).toFixed(2));
                  }
                }}
                placeholder="Ex. 15000"
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Qtd de Parcelas</label>
              <input
                type="number"
                value={installmentsCount}
                onChange={e => {
                  setInstallmentsCount(e.target.value);
                  if (totalValue && e.target.value) {
                    setInstallmentValue((Number(totalValue) / Number(e.target.value)).toFixed(2));
                  }
                }}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Valor da Parcela (R$)</label>
              <input
                type="number"
                value={installmentValue}
                onChange={e => setInstallmentValue(e.target.value)}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Vencimento Parcela 1</label>
              <input
                type="date"
                value={nextDueDate}
                onChange={e => setNextDueDate(e.target.value)}
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
              Confirmar Parceria
            </button>
          </div>
        </form>
      )}

      {/* Grid of Restructured terms */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {agreements.length === 0 ? (
          <p className="col-span-2 text-xs text-slate-450 italic text-center py-4 bg-slate-50 rounded border">Nenhum termo de parcelamento ativo.</p>
        ) : (
          agreements.map(ag => (
            <div key={ag.id} className="p-3 border border-gray-250 bg-slate-50/20 hover:border-gray-355 hover:bg-slate-50/50 transition-all rounded relative flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2.5">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">{ag.id}</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">{ag.debtor}</h4>
                  </div>
                  <div className="shrink-0">{getStatusBadge(ag.status)}</div>
                </div>

                {/* Progress parameters */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 border-dashed">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-bold text-[10px]">Evolução do Saldo Adimplido:</span>
                    <span className="font-mono font-bold text-slate-800 text-[10px]">{ag.currentInstallment} de {ag.installmentsCount} parcelas</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded transition-all duration-500" 
                      style={{ width: `${(ag.currentInstallment / ag.installmentsCount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Core metrics values */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-[10px] sm:text-xs bg-white/70 p-2 rounded border border-gray-200 relative">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase font-black">Acordo Total</span>
                    <p className="font-mono font-bold text-slate-700 text-[11px] leading-tight mt-0.5">{formatBRL(ag.totalValue)}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase font-black">Valor Parcela</span>
                    <p className="font-mono font-bold text-blue-600 text-[11px] leading-tight mt-0.5">{formatBRL(ag.installmentValue)}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-black">Restante</span>
                    <p className="font-mono font-bold text-slate-600 text-[11px] leading-tight mt-0.5">{formatBRL(ag.totalValue - (ag.currentInstallment * ag.installmentValue))}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 mt-2.5 pt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> 
                  <span>Próximo vencimento: <strong className="text-slate-600">{ag.nextDueDate}</strong></span>
                </div>
              </div>

              {/* Action area */}
              {ag.status !== 'quitado' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onPayInstallment(ag.id)}
                    className="text-[9px] font-bold px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded transition-all flex items-center gap-1 hover:gap-1.5 shadow-sm uppercase tracking-wider"
                  >
                    Confirmar Parcela {ag.currentInstallment + 1}/{ag.installmentsCount} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {ag.status === 'quitado' && (
                <div className="mt-3 pt-2 border-t border-slate-100 text-center text-[10px] font-bold text-emerald-700 bg-emerald-50/40 p-1.5 rounded border border-dashed border-emerald-100 uppercase tracking-wide">
                  🏆 Confissão Quitada com Sucesso!
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
