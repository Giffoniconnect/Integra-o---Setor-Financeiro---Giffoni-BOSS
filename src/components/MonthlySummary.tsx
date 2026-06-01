import React, { useState } from 'react';
import { Transaction } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign, Wallet, Calendar } from 'lucide-react';

interface MonthlySummaryProps {
  transactions: Transaction[];
}

export default function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const [selectedMonth, setSelectedMonth] = useState<'all' | '2026-05' | '2026-06'>('all');

  // Filter transaction by month helper
  const filtered = transactions.filter(t => {
    if (selectedMonth === 'all') return true;
    return t.date.startsWith(selectedMonth);
  });

  const incomePaid = filtered
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((sum, t) => sum + t.value, 0);

  const incomePending = filtered
    .filter(t => t.type === 'income' && t.status !== 'paid')
    .reduce((sum, t) => sum + t.value, 0);

  const expensePaid = filtered
    .filter(t => t.type === 'expense' && t.status === 'paid')
    .reduce((sum, t) => sum + t.value, 0);

  const expensePending = filtered
    .filter(t => t.type === 'expense' && t.status !== 'paid')
    .reduce((sum, t) => sum + t.value, 0);

  const totalIncome = incomePaid + incomePending;
  const totalExpense = expensePaid + expensePending;
  const netPaidProfit = incomePaid - expensePaid;
  const netEstimatedProfit = totalIncome - totalExpense;

  // Let's create an elegant visual bar representation of cashflow
  const categoriesMap: { [key: string]: { income: number; expense: number } } = {};
  filtered.forEach(t => {
    if (!categoriesMap[t.category]) {
      categoriesMap[t.category] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      categoriesMap[t.category].income += t.value;
    } else {
      categoriesMap[t.category].expense += t.value;
    }
  });

  // Calculate percentage of budget utilized for top 4 categories
  const topCategories = Object.entries(categoriesMap)
    .map(([name, val]) => ({ name, ...val, total: val.income + val.expense }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  // Format currency
  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-resumo">
      {/* Header section with month filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 01</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-blue-500" /> Resumo Financeiro do Mês
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Visão ampla de caixa de liquidez e provisões</p>
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded self-stretch sm:self-auto text-[10px]">
          <button
            onClick={() => setSelectedMonth('all')}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded font-medium transition-colors ${
              selectedMonth === 'all'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos Períodos
          </button>
          <button
            onClick={() => setSelectedMonth('2026-05')}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded font-medium transition-colors ${
              selectedMonth === '2026-05'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Maio / 2026
          </button>
          <button
            onClick={() => setSelectedMonth('2026-06')}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded font-medium transition-colors ${
              selectedMonth === '2026-06'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Junho / 2026
          </button>
        </div>
      </div>

      {/* Grid containing monetary card totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {/* Revenue Card */}
        <div className="bg-white p-3 rounded shadow-sm border border-gray-200 border-l-4 border-blue-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Receita Total</span>
            <div className="p-1 bg-blue-50 text-blue-500 rounded">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <h3 className="text-lg font-bold text-gray-950 font-mono tracking-tight">{formatBRL(totalIncome)}</h3>
            <div className="flex flex-col sm:flex-row mt-1 gap-x-3 text-[10px]">
              <span className="text-emerald-600 font-semibold">Realizado: {formatBRL(incomePaid)}</span>
              <span className="text-slate-400">A receber: {formatBRL(incomePending)}</span>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-3 rounded shadow-sm border border-gray-200 border-l-4 border-red-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="w-24 h-24 text-red-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Despesa Total</span>
            <div className="p-1 bg-red-50 text-red-500 rounded">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <h3 className="text-lg font-bold text-gray-955 font-mono tracking-tight">{formatBRL(totalExpense)}</h3>
            <div className="flex flex-col sm:flex-row mt-1 gap-x-3 text-[10px]">
              <span className="text-rose-600 font-semibold font-mono">Pago: {formatBRL(expensePaid)}</span>
              <span className="text-slate-400 font-mono">Provisões: {formatBRL(expensePending)}</span>
            </div>
          </div>
        </div>

        {/* Net Cashflow (Saldo) Card */}
        <div className={`bg-white p-3 rounded shadow-sm border border-gray-200 border-l-4 relative overflow-hidden group ${
          netPaidProfit >= 0 ? 'border-emerald-500' : 'border-rose-500'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
            <Wallet className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Saldo de Caixa (Líquido)</span>
            <div className={`p-1 rounded ${netPaidProfit >= 0 ? 'bg-emerald-55 text-emerald-500' : 'bg-red-55 text-red-500'}`}>
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <h3 className={`text-lg font-bold font-mono tracking-tight ${netPaidProfit >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
              {formatBRL(netPaidProfit)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Se provisionado recebido: <strong className="font-mono text-slate-600">{formatBRL(netEstimatedProfit)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Visual representation of current monthly Cashflow Balance using responsive SVG */}
      <div className="mt-5">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Fluxo Diário Simulativo de Caixa (Julong de Eventos)
        </h4>
        <div className="bg-slate-50 border border-slate-100 rounded p-4 relative">
          <div className="w-full h-44 flex items-end justify-between gap-1 sm:gap-2 pt-2 relative">
            
            {/* Guide Gridlines */}
            <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-50">
              <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
              <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
              <div className="border-b border-gray-300 w-full h-0"></div>
              <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
            </div>

            {/* Rendered SVG Chart representing income streams */}
            {filtered.length === 0 ? (
              <div className="w-full flex items-center justify-center text-xs text-slate-400">
                Nenhuma transação anotada para este período
              </div>
            ) : (
              filtered.map((tx, idx) => {
                const maxVal = Math.max(...filtered.map(t => t.value), 40000);
                const heightPercentage = Math.min((tx.value / maxVal) * 100, 100);
                const isIncome = tx.type === 'income';

                return (
                  <div key={tx.id} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white p-2 rounded text-[10px] sm:text-xs z-10 whitespace-nowrap shadow-md pointer-events-none">
                      <p className="font-bold">{tx.description}</p>
                      <p className="font-mono">{formatBRL(tx.value)} ({tx.type === 'income' ? 'Crédito' : 'Débito'})</p>
                      <p className="text-slate-400 text-[9px]">{tx.date} • {tx.category}</p>
                    </div>

                    {/* Bar Pillar */}
                    <div 
                      className={`w-full max-w-[24px] sm:max-w-[40px] rounded-t transition-all duration-300 ${
                        isIncome 
                          ? tx.status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-400 border border-emerald-600' : 'bg-emerald-300/40 border border-dashed border-emerald-400'
                          : tx.status === 'paid' ? 'bg-rose-500 hover:bg-rose-400 border border-rose-600' : 'bg-rose-300/40 border border-dashed border-rose-400'
                      }`}
                      style={{ height: `${heightPercentage}%` }}
                    ></div>

                    {/* Mini code representation for dates */}
                    <span className="text-[8px] font-mono text-slate-400 mt-1 leading-none hidden sm:block">
                      {tx.date.substring(8, 10)}/{tx.date.substring(5, 7)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Chart Legends */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-200/60 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600 inline-block"></span>
              Recebidos
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-emerald-300/30 border border-dashed border-emerald-400 inline-block"></span>
              Metas / Previstos
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-rose-500 border border-rose-600 inline-block"></span>
              Pagos
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-rose-300/30 border border-dashed border-rose-400 inline-block"></span>
              Provisões / Contas a Pagar
            </span>
          </div>
        </div>
      </div>

      {/* Top Categories simple stats breakdown */}
      <div className="mt-6">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Relevância De Operação Geral</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topCategories.map(cat => {
            const totalSum = filtered.reduce((acc, current) => acc + current.value, 0) || 1;
            const progressPct = ((cat.total / totalSum) * 100).toFixed(1);
            return (
              <div key={cat.name} className="border border-slate-100 bg-slate-50/20 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-medium truncate">{cat.name}</p>
                <p className="text-base font-mono font-bold text-slate-800 mt-1 truncate">{formatBRL(cat.total)}</p>
                <div className="w-full bg-slate-100 rounded-full h-1 mt-2 overflow-hidden">
                  <div className="bg-sky-500 h-1 rounded-full" style={{ width: `${progressPct}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">{progressPct}% do total</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
