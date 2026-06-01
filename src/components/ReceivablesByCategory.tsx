import React from 'react';
import { Transaction } from '../types';
import { PieChart, Landmark, Scale, Coins, Lightbulb, TrendingUp } from 'lucide-react';

interface ReceivablesByCategoryProps {
  transactions: Transaction[];
}

export default function ReceivablesByCategory({ transactions }: ReceivablesByCategoryProps) {
  // Filter for income types
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const totalIncomeValue = incomeTransactions.reduce((sum, t) => sum + t.value, 0) || 1;

  // Group by category
  const categoryTotals: { [key: string]: { total: number; paid: number; pending: number; count: number } } = {};

  incomeTransactions.forEach(t => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = { total: 0, paid: 0, pending: 0, count: 0 };
    }
    categoryTotals[t.category].total += t.value;
    if (t.status === 'paid') {
      categoryTotals[t.category].paid += t.value;
    } else {
      categoryTotals[t.category].pending += t.value;
    }
    categoryTotals[t.category].count += 1;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([name, data]) => ({
      name,
      ...data,
      percentage: (data.total / totalIncomeValue) * 100
    }))
    .sort((a, b) => b.total - a.total);

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  // Assign distinct icons to legal/financial categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Honorários Mensais':
        return <Landmark className="w-4 h-4 text-sky-600" />;
      case 'Êxito Judicial':
        return <Scale className="w-4 h-4 text-emerald-600" />;
      case 'Acórdãos e Acordos':
      case 'Acordo Judicial':
        return <Coins className="w-4 h-4 text-amber-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-indigo-600" />;
    }
  };

  // Get progressive badge styling
  const getCategoryTheme = (idx: number) => {
    const themes = [
      { bg: 'bg-sky-500', text: 'text-sky-700', lightBg: 'bg-sky-50' },
      { bg: 'bg-emerald-500', text: 'text-emerald-700', lightBg: 'bg-emerald-50' },
      { bg: 'bg-amber-500', text: 'text-amber-700', lightBg: 'bg-amber-50' },
      { bg: 'bg-indigo-500', text: 'text-indigo-700', lightBg: 'bg-indigo-50' },
    ];
    return themes[idx % themes.length];
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-recebiveis">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 03</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <PieChart className="w-4 h-4 text-blue-500" /> Recebíveis por Categoria
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Composição do faturamento e distribuição de receitas</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 font-mono uppercase font-black">Total Mapeado</p>
          <p className="text-xs font-bold font-mono text-slate-800">{formatBRL(totalIncomeValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Progress bar list of categories */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ranking de Receitas</h3>
          {sortedCategories.map((cat, idx) => {
            const theme = getCategoryTheme(idx);
            return (
              <div key={cat.name} className="p-2 border border-slate-100 rounded bg-slate-50/15 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded ${theme.lightBg}`}>
                      {getCategoryIcon(cat.name)}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">{formatBRL(cat.total)}</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${theme.bg}`} style={{ width: `${cat.percentage}%` }}></div>
                </div>

                <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-slate-400">
                  <span>{cat.count} lançamentos</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className="text-emerald-600 bg-emerald-50 px-1 rounded">P: {formatBRL(cat.paid)}</span>
                    <span className="text-blue-600 bg-blue-50 px-1 rounded">Pr: {formatBRL(cat.pending)}</span>
                    <span className="font-bold text-slate-600">{cat.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic visual infographic displaying shares of cashflow */}
        <div className="flex flex-col items-center justify-center p-3 border border-gray-250 bg-slate-50/20 rounded">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
            Distribuição de Liquidez de Faturamento
          </h3>

          {/* SVG Pie Chart representing structural components */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
              {/* Ground Circle representing 100% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="2.8"></circle>

              {/* Progressive Ring Segments */}
              {(() => {
                let accumulatedPercent = 0;
                return sortedCategories.map((cat, idx) => {
                  const theme = getCategoryTheme(idx);
                  const strokeWidth = 3;
                  const strokeDashArray = `${cat.percentage} ${100 - cat.percentage}`;
                  const strokeDashOffset = 100 - accumulatedPercent;
                  accumulatedPercent += cat.percentage;

                  let colorValue = '#0ea5e9'; // fallback sky-500
                  if (idx === 0) colorValue = '#2563eb'; // blue-600
                  else if (idx === 1) colorValue = '#10b981'; // emerald-500
                  else if (idx === 2) colorValue = '#f59e0b'; // amber-500
                  else colorValue = '#6366f1'; // indigo-500

                  return (
                    <circle
                      key={cat.name}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={colorValue}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDashArray}
                      strokeDashoffset={strokeDashOffset}
                      className="transition-all duration-500 hover:stroke-[3.5]"
                    />
                  );
                });
              })()}
            </svg>

            {/* Inner text metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1.5">
              <span className="text-[8px] text-slate-400 uppercase tracking-normal">Maior Stream</span>
              <span className="text-[10px] font-bold text-slate-800 truncate max-w-[90px]">
                {sortedCategories[0] ? sortedCategories[0].name : 'Nenhum'}
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-bold leading-none mt-0.5">
                {sortedCategories[0] ? sortedCategories[0].percentage.toFixed(0) : '0'}% share
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[10px]">
            {sortedCategories.map((cat, idx) => {
              let colorCircle = 'bg-blue-600';
              if (idx === 0) colorCircle = 'bg-blue-800';
              else if (idx === 1) colorCircle = 'bg-emerald-500';
              else if (idx === 2) colorCircle = 'bg-amber-500';
              else colorCircle = 'bg-indigo-500';

              return (
                <div key={cat.name} className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${colorCircle}`}></span>
                  <span className="truncate">{cat.name}: {cat.percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
