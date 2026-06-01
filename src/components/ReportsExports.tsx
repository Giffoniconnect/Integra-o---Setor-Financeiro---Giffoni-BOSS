import React, { useState } from 'react';
import { Transaction } from '../types';
import { Download, FileSpreadsheet, FileJson, Calendar, Sparkles, Filter, ChevronRight, DollarSign } from 'lucide-react';

interface ReportsExportsProps {
  transactions: Transaction[];
  onLogAction: (activity: string, status: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function ReportsExports({ transactions, onLogAction }: ReportsExportsProps) {
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const categories = ['Todas', ...Array.from(new Set(transactions.map(t => t.category)))];

  // Match list filter calculations
  const matches = transactions.filter(t => {
    const matchesStart = startDate ? t.date >= startDate : true;
    const matchesEnd = endDate ? t.date <= endDate : true;
    const matchesCategory = categoryFilter === 'Todas' || t.category === categoryFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesStart && matchesEnd && matchesCategory && matchesType;
  });

  const matchingIncome = matches.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0);
  const matchingExpense = matches.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0);
  const matchingNet = matchingIncome - matchingExpense;

  const handleExportCSV = () => {
    // Generate simple compliant CSV template
    const headers = ['ID', 'Data', 'Descricao', 'Categoria', 'Valor (RS)', 'Tipo', 'Status', 'Sincronizado Nibo'].join(';');
    const rows = matches.map(t => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.value.toFixed(2),
      t.type === 'income' ? 'CREDITO' : 'DEBITO',
      t.status.toUpperCase(),
      t.isNiboSynced ? 'SIM' : 'NAO'
    ].join(';'));
    
    const csvContent = '\ufeff' + [headers, ...rows].join('\n'); // Add UTF-8 BOM
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download hook
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Relatorio_Financeiro_${startDate}_a_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Timeline Log Trigger
    onLogAction(`Exportação de relatório CSV gerada: ${matches.length} registros no período ${startDate} a ${endDate}.`, 'success');
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(matches, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Export_Financeiro_${startDate}_a_${endDate}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction(`Exportação de registros JSON gerada: ${matches.length} registros exportados.`, 'info');
  };

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-relatorios">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 08</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Download className="w-4 h-4 text-blue-500" /> Relatórios e Exportações Dinâmicas
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Filtragem cirúrgica de faturamento para declarações e contabilidade</p>
        </div>
      </div>

      {/* Advanced dynamic filters panel */}
      <div className="mt-3.5 p-3 bg-slate-50 border border-gray-200 rounded">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-400" /> Parâmetros de Filtro de Relatório
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
          {/* Start Date */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] text-slate-400 uppercase font-bold">De (Início)</label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] text-slate-400 uppercase font-bold">Até (Término)</label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Categories select */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] text-slate-400 uppercase font-bold">Classificação Categoria</label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="p-1.5 bg-white border border-gray-200 rounded focus:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Type selective */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] text-slate-400 uppercase font-bold">Tipo Fluxo</label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="all">Receitas e Despesas (Geral)</option>
              <option value="income">Entradas Clientes</option>
              <option value="expense">Despesas Operacionais</option>
            </select>
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[10px] text-slate-400 font-mono">
            <strong>{matches.length}</strong> lançamentos correspondentes encontrados.
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-705 bg-white rounded transition-colors uppercase font-sans tracking-wide"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-600" /> Exportar JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white rounded transition-colors shadow-xs uppercase font-sans tracking-wide"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> Exportar CSV para Nibo
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate review panel for the matching query */}
      {matches.length > 0 && (
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-gray-200 bg-slate-50/10 rounded p-2.5 text-center">
            <p className="text-[8px] text-slate-400 font-black uppercase mb-0.5">Operações Consolidada De Crédito</p>
            <p className="text-base font-mono font-bold text-blue-700">{formatBRL(matchingIncome)}</p>
          </div>
          <div className="border border-gray-200 bg-slate-50/10 rounded p-2.5 text-center">
            <p className="text-[8px] text-slate-400 font-black uppercase mb-0.5">Operações Consolidada De Débito</p>
            <p className="text-base font-mono font-bold text-slate-600">{formatBRL(matchingExpense)}</p>
          </div>
          <div className={`border rounded p-2.5 text-center ${
            matchingNet >= 0 ? 'bg-slate-50 border-gray-250' : 'bg-red-25 border-red-200'
          }`}>
            <p className="text-[8px] text-slate-400 font-black uppercase mb-0.5">Balanço do Período Selecionado</p>
            <p className={`text-base font-mono font-bold ${matchingNet >= 0 ? 'text-slate-850' : 'text-red-700'}`}>{formatBRL(matchingNet)}</p>
          </div>
        </div>
      )}

      {/* Micro matching rows panel overview */}
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">Pré-visualização dos registros exportáveis</h3>
      <div className="border border-gray-200 rounded overflow-hidden bg-slate-50/20 max-h-48 overflow-y-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-100/60 text-slate-500 font-mono font-bold">
              <th className="py-2 px-2.5">Data</th>
              <th className="py-2 px-2.5">Descrição</th>
              <th className="py-2 px-2.5">Categoria</th>
              <th className="py-2 px-2.5 text-right">Valor</th>
              <th className="py-2 px-2.5">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-white text-slate-600">
                <td className="py-1.5 px-2.5 font-mono font-bold">{m.date}</td>
                <td className="py-1.5 px-2.5 font-bold text-slate-800 max-w-[200px] truncate">{m.description}</td>
                <td className="py-1.5 px-2.5 text-slate-550">{m.category}</td>
                <td className={`py-1.5 px-2.5 font-mono font-bold text-right ${m.type === 'income' ? 'text-blue-700' : 'text-red-700'}`}>
                  {formatBRL(m.value)}
                </td>
                <td className="py-1.5 px-2.5 font-mono text-[9px] uppercase font-bold">{m.type === 'income' ? 'Credito' : 'Debito'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
