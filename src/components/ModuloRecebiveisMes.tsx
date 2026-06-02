import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  Calendar,
  Layers,
  ArrowUpRight,
  Info,
  ChevronDown
} from 'lucide-react';
import { Transaction, AgreementInstallment, SuccessContract } from '../types';

interface ModuloRecebiveisMesProps {
  transactions: Transaction[];
  agreements: AgreementInstallment[];
  successContracts: SuccessContract[];
}

export default function ModuloRecebiveisMes({
  transactions,
  agreements,
  successContracts
}: ModuloRecebiveisMesProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'contrato' | 'acordo' | 'honorarios' | 'exito'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'overdue'>('all');
  const [showReport, setShowReport] = useState<boolean>(false);

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  // Compile unified list of forecasted receivables
  // Include:
  // - transactions with status 'pending' or 'overdue' and type 'income'
  // - predicted installments from agreements that are not fully paid
  // - predicted expected fees from successContracts that are active

  const items: Array<{
    id: string;
    client: string;
    category: string;
    type: 'contrato' | 'acordo' | 'honorarios' | 'exito';
    value: number;
    dueDate: string;
    status: 'pending' | 'overdue';
  }> = [];

  // 1. Transactions
  transactions
    .filter(t => t.type === 'income' && t.status !== 'paid')
    .forEach(t => {
      let mappedType: typeof items[0]['type'] = 'honorarios';
      if (t.category.includes('Êxito')) mappedType = 'exito';
      else if (t.category.includes('Acordo')) mappedType = 'acordo';
      
      items.push({
        id: t.id,
        client: t.description.replace('Atrasado - ', '').replace('Futuro - ', ''),
        category: t.category,
        type: mappedType,
        value: t.value,
        dueDate: t.date, // YYYY-MM-DD
        status: t.status === 'overdue' ? 'overdue' : 'pending'
      });
    });

  // 2. Agreement installments (next due)
  agreements
    .filter(a => a.status !== 'quitado')
    .forEach(a => {
      // Find out if already mapped in transactions to prevent duplicate
      const hasTx = items.some(it => it.client.includes(a.debtor) && it.type === 'acordo');
      if (!hasTx) {
        items.push({
          id: a.id,
          client: `Pacto Judicial — ${a.debtor}`,
          category: 'Acórdãos e Acordos',
          type: 'acordo',
          value: a.installmentValue,
          dueDate: a.nextDueDate,
          status: a.status === 'atrasado' ? 'overdue' : 'pending'
        });
      }
    });

  // 3. Success contracts estimated
  successContracts
    .filter(c => c.status === 'ativo' || c.status === 'ganho')
    .forEach(c => {
      items.push({
        id: c.id,
        client: `Êxito — ${c.client}`,
        category: 'Êxito Judicial',
        type: 'exito',
        value: c.expectedFee,
        dueDate: c.expectedDate,
        status: 'pending'
      });
    });

  // Filters application
  const filteredItems = items.filter(it => {
    const term = searchTerm.toLowerCase();
    const matchSearch = it.client.toLowerCase().includes(term) || 
                        it.category.toLowerCase().includes(term) ||
                        it.id.toLowerCase().includes(term);
    const matchType = typeFilter === 'all' || it.type === typeFilter;
    const matchStatus = statusFilter === 'all' || it.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalFilteredValue = filteredItems.reduce((acc, it) => acc + it.value, 0);

  // CSV Export implementation
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Fichamento ID;Devedor/Cliente;Categoria;Tipo;Valor Previsto (BRL);Data Estimada;Status\n';
    
    filteredItems.forEach(it => {
      // Clean commas or semicolons
      const cleanClient = it.client.replace(/[;,]/g, ' ');
      const cleanCat = it.category.replace(/[;,]/g, ' ');
      // Formata data em formato humanizado DD/MM/AAAA para conformidade
      const parts = it.dueDate.split('-');
      const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : it.dueDate;

      csvContent += `${it.id};${cleanClient};${cleanCat};${it.type.toUpperCase()};${it.value};${formattedDate};${it.status.toUpperCase()}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Recebiveis_Previstos_BOSS_' + new Date().toISOString().substring(0, 10) + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Humanize YYYY-MM-DD date to DD/MM/AAAA
  const formatDateDDMMAAAA = (ymd: string) => {
    if (!ymd) return '-';
    if (ymd.includes('/')) return ymd; // Already correct format
    const parts = ymd.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return ymd;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-recebiveis">
      
      {/* Header section with Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-sky-600 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest animate-none">
            MÓDULO 03
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <TrendingUp className="w-4 h-4 text-sky-600" /> Previsão de Recebíveis do Mês (Valores a Receber)
          </h2>
          <p className="text-[10px] text-slate-500 font-sans">
            Visão detalhada de ingressos financeiros estimados relativos a contratos, acordos, termos e êxitos.
          </p>
        </div>
        
        {/* Export & Report Operations */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReport(!showReport)}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded uppercase transition-all"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" /> {showReport ? 'Esconder Análise' : 'Análise Executiva'}
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded uppercase transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Exportar Planilha CSV
          </button>
        </div>
      </div>

      {/* QUICK KPI METRICS STRIP */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 border border-slate-100 rounded">
        <div>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Volume de Prospecção</p>
          <h4 className="text-sm font-mono font-black text-slate-800 mt-0.5">{formatBRL(totalFilteredValue)}</h4>
          <span className="text-[9px] text-slate-405 font-mono">Filtro ativo</span>
        </div>
        <div className="border-l border-slate-200 pl-3">
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Acordos Consolidados</p>
          <h4 className="text-sm font-mono font-black text-slate-800 mt-0.5">
            {formatBRL(filteredItems.filter(it => it.type === 'acordo').reduce((acc, current) => acc + current.value, 0))}
          </h4>
          <span className="text-[9px] text-slate-405">
            {filteredItems.filter(it => it.type === 'acordo').length} repasses
          </span>
        </div>
        <div className="border-l border-slate-200 pl-3">
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Contratos de Êxito</p>
          <h4 className="text-sm font-mono font-black text-slate-800 mt-0.5">
            {formatBRL(filteredItems.filter(it => it.type === 'exito').reduce((acc, current) => acc + current.value, 0))}
          </h4>
          <span className="text-[9px] text-slate-405">
            {filteredItems.filter(it => it.type === 'exito').length} marcos
          </span>
        </div>
        <div className="border-l border-slate-200 pl-3">
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Critério de Atraso (Em Mora)</p>
          <span className="text-red-700 text-sm font-mono font-black block mt-0.5">
            {formatBRL(filteredItems.filter(it => it.status === 'overdue').reduce((acc, current) => acc + current.value, 0))}
          </span>
          <span className="text-[9px] text-slate-405 font-mono">Correção em curso</span>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY REPORT DRAWER */}
      {showReport && (
        <div className="mt-4 p-4 border border-blue-150 bg-blue-50/15 rounded-lg space-y-2.5 animate-fade-in">
          <h3 className="text-xs font-bold text-slate-850 flex items-center gap-1 uppercase tracking-wide">
            <Info className="w-4 h-4 text-blue-500" /> Relatório Executivo de Provisão de Caixa
          </h3>
          <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
            A projeção financeira ativa do Giffoni BOSS para o fluxo de caixa consolidado revela um montante potencial de <strong>{formatBRL(totalFilteredValue)}</strong> elegível para liquidação no trimestre. O percentual de faturamento ad exitum das causas judiciais representa a maior relevância orçamentária do escritório (estimativas de êxitos).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-mono pt-2 border-t border-slate-100">
            <div>
              <p className="text-slate-500">• Ingressos por Atendimentos/Honorários: <strong>{formatBRL(filteredItems.filter(it => it.type === 'honorarios').reduce((acc, current) => acc + current.value, 0))}</strong></p>
              <p className="text-slate-500">• Amortizações de Acordos Firmados: <strong>{formatBRL(filteredItems.filter(it => it.type === 'acordo').reduce((acc, current) => acc + current.value, 0))}</strong></p>
            </div>
            <div>
              <p className="text-slate-500">• Taxa de Adimplência Líquida: <strong>{((1 - (filteredItems.filter(it => it.status === 'overdue').length / (filteredItems.length || 1))) * 100).toFixed(1)}%</strong></p>
              <p className="text-slate-500">• Status de Conformidade: <span>Conforme Diretriz Operacional</span></p>
            </div>
          </div>
        </div>
      )}

      {/* FILTER PANEL AND SEARCH INPUT */}
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
            placeholder="Pesquisar devedor, caso ou categoria..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Filter Type tabs */}
          <div className="flex border border-gray-200 rounded p-0.5 bg-slate-50 text-[10px]">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-805'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('honorarios')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                typeFilter === 'honorarios' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              Honorários
            </button>
            <button
              onClick={() => setTypeFilter('acordo')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                typeFilter === 'acordo' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              Acordos
            </button>
            <button
              onClick={() => setTypeFilter('exito')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                typeFilter === 'exito' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              Êxitos
            </button>
          </div>

          {/* Status filtering selection dropdown */}
          <div className="flex items-center gap-1 border border-gray-200 rounded px-2.5 py-1 bg-slate-50/55 text-[10px]">
            <Filter className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-slate-500">Atraso:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-transparent focus:outline-none font-bold text-slate-800"
            >
              <option value="all">Ver Tudo</option>
              <option value="pending">Apenas Pontuais (Em Dia)</option>
              <option value="overdue">Apenas Vencidos (Em Mora)</option>
            </select>
          </div>

        </div>
      </div>

      {/* COMPACT DETAILED TABLE */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse font-sans">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-50/50 text-slate-450 font-mono font-black tracking-wide uppercase">
              <th className="py-2.5 px-3">Código</th>
              <th className="py-2.5 px-3">Cliente / Devedor</th>
              <th className="py-2.5 px-3">Categoria</th>
              <th className="py-2.5 px-3 text-center">Tipo</th>
              <th className="py-2.5 px-3 text-center">Formato Data</th>
              <th className="py-2.5 px-3 text-right">Valor Estimado</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-mono font-bold bg-slate-25/10">
                  Nenhum recebível previsto registrado para estes critérios.
                </td>
              </tr>
            ) : (
              filteredItems.map(it => (
                <tr key={it.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-slate-400 text-[10px]">{it.id}</td>
                  <td className="py-2 px-3 font-bold text-slate-800 leading-tight">
                    {it.client}
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-normal bg-slate-100 text-slate-700 border border-slate-150">
                      {it.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      it.type === 'exito' ? 'bg-purple-100 text-purple-800' :
                      it.type === 'acordo' ? 'bg-teal-100 text-teal-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {it.type}
                    </span>
                  </td>
                  {/* Date column (mandatory format DD/MM/AAAA) */}
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 whitespace-nowrap">
                    {formatDateDDMMAAAA(it.dueDate)}
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-right text-slate-800 text-xs">
                    {formatBRL(it.value)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {it.status === 'overdue' ? (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-extrabold px-1.5 py-0.2 bg-red-100 text-red-800 rounded border border-red-200 uppercase animate-pulse">
                        Mora / Atraso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-extrabold px-1.5 py-0.2 bg-sky-50 text-sky-700 rounded border border-sky-100 uppercase">
                        Previsto
                      </span>
                    )}
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
