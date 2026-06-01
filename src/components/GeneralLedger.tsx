import React, { useState } from 'react';
import { Transaction } from '../types';
import { Search, Filter, Plus, ArrowUpRight, ArrowDownLeft, Check, AlertCircle, RefreshCw, Layers, Calendar, ChevronDown } from 'lucide-react';

interface GeneralLedgerProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'isNiboSynced'>) => void;
  onUpdateStatus: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  onSyncTransaction: (id: string) => void;
}

export default function GeneralLedger({ transactions, onAddTransaction, onUpdateStatus, onSyncTransaction }: GeneralLedgerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [newDesc, setNewDesc] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newCat, setNewCat] = useState('Honorários Mensais');
  const [newStatus, setNewStatus] = useState<'paid' | 'pending'>('paid');
  const [newDate, setNewDate] = useState('2026-06-01');

  // Filtered transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const categories = [
    'Honorários Mensais',
    'Êxito Judicial',
    'Consultoria Avulsa',
    'Acórdãos e Acordos',
    'Folha de Pagamento',
    'Aluguel',
    'Impostos e Taxas',
    'Softwares e SaaS',
    'Marketing',
    'Outros'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newValue || isNaN(Number(newValue))) return;

    onAddTransaction({
      description: newDesc,
      value: Number(newValue),
      type: newType,
      category: newCat,
      status: newStatus,
      date: newDate
    });

    // Reset Form
    setNewDesc('');
    setNewValue('');
    setIsFormOpen(false);
  };

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-4" id="section-tabela">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Módulo 05</span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-500" /> Tabela Financeira Geral
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Visão consolidada do fluxo físico administrativo e conciliações</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white rounded transition-colors shadow-xs uppercase font-sans shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Registrar Lançamento
        </button>
      </div>

      {/* Dynamic Add Transaction form drawer */}
      {isFormOpen && (
        <form onSubmit={handleFormSubmit} className="mt-3 p-3 bg-slate-50 border border-gray-200 rounded space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Novo Lançamento Financeiro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            {/* Description */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Descrição</label>
              <input
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Ex. Honorários Consultoria - Petrobras"
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Valor BRL */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="Ex: 12500"
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Tipo</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as 'income' | 'expense')}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="income">Entrada (Receita)</option>
                <option value="expense">Saída (Despesa)</option>
              </select>
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Categoria</label>
              <select
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Data de Vencimento</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 animate-none"
                required
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Status Inicial</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as 'paid' | 'pending')}
                className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="paid">Confirmado (Pago/Quitado)</option>
                <option value="pending">Pendente (Agendado)</option>
              </select>
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
              className="text-[10px] uppercase font-bold px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm"
            >
              Confirmar Lançamento
            </button>
          </div>
        </form>
      )}

      {/* Inputs Filters & Search Bar Section */}
      <div className="mt-3 flex flex-col md:flex-row gap-3 items-center justify-between pb-3 border-b border-slate-100">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por descrição, ID ou categoria..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Type filters */}
          <div className="flex border border-gray-200 rounded p-0.5 bg-slate-50 text-[10px]">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-2.5 py-1 rounded font-medium transition-all flex items-center gap-1 ${
                typeFilter === 'income' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-2.5 py-1 rounded font-medium transition-all flex items-center gap-1 ${
                typeFilter === 'expense' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              Saídas
            </button>
          </div>

          {/* Status filter select dropdown */}
          <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1 bg-slate-50/55 text-[10px] text-slate-650">
            <Filter className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-slate-500 uppercase tracking-normal">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-transparent focus:outline-none font-bold text-slate-800"
            >
              <option value="all">Ver Tudo</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="overdue">Atrasado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries General Datatable */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-50/50 text-slate-450 font-mono font-black tracking-wide uppercase">
              <th className="py-2 px-2.5">ID / Lancto</th>
              <th className="py-2 px-2.5 text-center">Vencimento</th>
              <th className="py-2 px-2.5">Categoria</th>
              <th className="py-2 px-2.5">Descrição</th>
              <th className="py-2 px-2.5 text-right">Valor</th>
              <th className="py-2 px-2.5 text-center">Status</th>
              <th className="py-2 px-2.5 text-center">Sincronia Nibo</th>
              <th className="py-2 px-2.5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic bg-slate-25/10">
                  Nenhuma transação atende aos filtros de pesquisa selecionados.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(tx => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                  {/* Ledger ID */}
                  <td className="py-2 px-2.5 font-mono font-bold text-slate-400 text-[10px]">{tx.id}</td>
                  
                  {/* Date format */}
                  <td className="py-2 px-2.5 whitespace-nowrap text-slate-600 text-center">
                    <span className="font-mono">{tx.date}</span>
                  </td>

                  {/* Category badge */}
                  <td className="py-2 px-2.5">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-normal bg-slate-100 text-slate-700">
                      {tx.category}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-2 px-2.5 font-bold text-slate-800 max-w-[200px] truncate" title={tx.description}>
                    {tx.description}
                  </td>

                  {/* Value */}
                  <td className={`py-2 px-2.5 font-mono font-bold text-right ${
                    tx.type === 'income' ? 'text-blue-700' : 'text-red-700'
                  }`}>
                    <span className="flex items-center justify-end gap-1">
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-500 shrink-0" />
                      ) : (
                        <ArrowDownLeft className="w-3 h-3 text-red-500 shrink-0" />
                      )}
                      <span>{formatBRL(tx.value)}</span>
                    </span>
                  </td>

                  {/* Status Badging */}
                  <td className="py-2 px-2.5 text-center">
                    {tx.status === 'paid' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 uppercase">
                        Pago
                      </span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-100 uppercase">
                        Agenda
                      </span>
                    )}
                    {tx.status === 'overdue' && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 bg-red-105 text-red-700 rounded border border-red-200 animate-pulse uppercase">
                        Atraso
                      </span>
                    )}
                  </td>

                  {/* Nibo Sync state indicator */}
                  <td className="py-2 px-2.5 text-center">
                    {tx.isNiboSynced ? (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded uppercase tracking-tight">
                        Integrado
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded uppercase tracking-tight">
                        Local
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-2 px-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {tx.status !== 'paid' && (
                        <button
                          onClick={() => onUpdateStatus(tx.id, 'paid')}
                          title="Faturar / Liquidar"
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!tx.isNiboSynced && (
                        <button
                          onClick={() => onSyncTransaction(tx.id)}
                          title="Sincronizar com Nibo"
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {tx.status === 'paid' && (
                        <span className="text-[9px] text-slate-400 font-mono italic">Conciliado</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
