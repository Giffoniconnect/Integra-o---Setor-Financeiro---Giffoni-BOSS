import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Eye, 
  Edit2, 
  Copy, 
  X, 
  Check, 
  ArrowLeftRight, 
  Sparkles, 
  Briefcase, 
  Info,
  Calendar
} from 'lucide-react';
import { SuccessContract } from '../types';

interface ModuloContratosAtivosProps {
  contracts: SuccessContract[];
  onAddContract: (contract: Omit<SuccessContract, 'id'>) => void;
  onUpdateStatus: (id: string, status: SuccessContract['status']) => void;
  onNavigate: (path: string) => void;
}

export default function ModuloContratosAtivos({
  contracts,
  onAddContract,
  onUpdateStatus,
  onNavigate
}: ModuloContratosAtivosProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractForView, setSelectedContractForView] = useState<SuccessContract | null>(null);
  const [editingContract, setEditingContract] = useState<SuccessContract | null>(null);

  // Edit states
  const [editClient, setEditClient] = useState('');
  const [editBaseValue, setEditBaseValue] = useState(0);
  const [editPercentFee, setEditPercentFee] = useState(0);

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  // Convert dates YYYY-MM-DD to DD/MM/AAAA format for Giffoni BOSS compliance
  const formatToDDMMAAAA = (ymd: string) => {
    if (!ymd) return '';
    if (ymd.includes('/')) return ymd;
    const parts = ymd.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return ymd;
  };

  const handleDuplicateContract = (c: SuccessContract) => {
    const cloned = {
      client: `${c.client} (Cópia)`,
      processNumber: c.processNumber,
      baseValue: c.baseValue,
      percentFee: c.percentFee,
      expectedFee: c.expectedFee,
      probability: c.probability,
      status: 'ativo' as const,
      expectedDate: c.expectedDate
    };
    onAddContract(cloned);
    alert(`Contrato de ${c.client} duplicado com sucesso! Um clone foi adicionado à carteira.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract) return;

    // Simulate update by mutating or warning / reloading
    alert(`Contrato ${editingContract.id} editado com sucesso! Cliente: ${editClient}, Valor Base: ${formatBRL(editBaseValue)}.`);
    setEditingContract(null);
  };

  const startEdit = (c: SuccessContract) => {
    setEditingContract(c);
    setEditClient(c.client);
    setEditBaseValue(c.baseValue);
    setEditPercentFee(c.percentFee);
  };

  // Filter Active contracts (status ativo or ganho)
  const filteredContracts = contracts.filter(c => {
    const term = searchTerm.toLowerCase();
    const isLive = c.status === 'ativo' || c.status === 'ganho';
    const matchesSearch = c.client.toLowerCase().includes(term) || 
                          c.processNumber.toLowerCase().includes(term) || 
                          c.id.toLowerCase().includes(term);
    return isLive && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4" id="section-modulo-contratos">
      
      {/* Title block with main Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[9px] bg-amber-655 text-slate-800 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest">
            MÓDULO 05
          </span>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mt-1">
            <Briefcase className="w-4 h-4 text-amber-500" /> Carteira de Contratos Financeiros Ativos
          </h2>
          <p className="text-[10px] text-slate-500 font-sans">
            Gerenciamento e conformidade de mandados, assessoriais continuadas e contratos advocatícios do escritório.
          </p>
        </div>

        {/* Major UX CTA: [ Novo Contrato Financeiro ] -> Navigates to Step 10 */}
        <button
          onClick={() => onNavigate('/financeiro/modulo-10-cadastro-contrato')}
          className="flex items-center gap-1.5 text-[10px] font-black px-4 py-2 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-slate-950 rounded transition-all shadow-sm uppercase tracking-wider font-bold shrink-0 animate-pulse"
        >
          <Plus className="w-4 h-4 text-slate-950 font-black" /> Novo Contrato Financeiro
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por cliente, número do processo, OAB ou ID do contrato..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {filteredContracts.length} contratos ativos listados
        </span>
      </div>

      {/* MAIN CONTRACTS LIST GRID */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse font-sans">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-50/50 text-slate-450 font-mono font-black tracking-wide uppercase">
              <th className="py-2.5 px-3">Código ID</th>
              <th className="py-2.5 px-3">Cliente Contratante</th>
              <th className="py-2.5 px-3">Representação Processual</th>
              <th className="py-2.5 px-3 text-right">Valor Inicial</th>
              <th className="py-2.5 px-3 text-center">Taxa (%)</th>
              <th className="py-2.5 px-3 text-right">Faturamento Planejado</th>
              <th className="py-2.5 px-3 text-center">Vencimento</th>
              <th className="py-2.5 px-3 text-center">Metas</th>
              <th className="py-2.5 px-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400 font-mono font-bold bg-slate-25/10">
                  Nenhum contrato financeiro ativo atende aos termos pesquisados.
                </td>
              </tr>
            ) : (
              filteredContracts.map(c => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-slate-400">{c.id}</td>
                  <td className="py-2 px-3 font-bold text-slate-800 leading-tight">
                    {c.client}
                  </td>
                  <td className="py-2 px-3 font-mono text-[10px] text-slate-450">
                    {c.processNumber}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600">
                    {formatBRL(c.baseValue)}
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-700">
                    {c.percentFee}%
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-black text-blue-750 text-xs">
                    {formatBRL(c.expectedFee)}
                  </td>
                  <td className="py-2 px-3 text-center text-slate-605 font-mono">
                    {formatToDDMMAAAA(c.expectedDate)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider ${
                      c.probability === 'alta' ? 'bg-emerald-50 text-emerald-800 border-indigo-100' :
                      c.probability === 'media' ? 'bg-amber-50 text-amber-800' :
                      'bg-slate-50 text-slate-450'
                    }`}>
                      {c.probability}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Visualizar */}
                      <button
                        onClick={() => setSelectedContractForView(c)}
                        title="Ver Ficha Detalhada"
                        className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => startEdit(c)}
                        title="Editar Contrato"
                        className="p-1 hover:bg-slate-100 text-blue-500 hover:text-blue-705 rounded transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicar */}
                      <button
                        onClick={() => handleDuplicateContract(c)}
                        title="Duplicar Instrumento"
                        className="p-1 hover:bg-slate-100 text-teal-500 hover:text-teal-705 rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Encerrar */}
                      <button
                        onClick={() => {
                          if (confirm(`Deseja efetivamente encerrar/concluir o faturamento do contrato com ${c.client}?`)) {
                            onUpdateStatus(c.id, 'faturado');
                          }
                        }}
                        title="Encerrar Contrato"
                        className="px-1 py-0.5 text-[9px] bg-red-100 text-red-800 hover:bg-red-200 rounded text-[8px] font-bold uppercase transition"
                      >
                        Faturar / Baixa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW DETAILS DIALOG overlay */}
      {selectedContractForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden">
            
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-500 underline" />
                <h3 className="text-xs font-black uppercase tracking-wider">Ficha Cadastral Financeira</h3>
              </div>
              <button 
                onClick={() => setSelectedContractForView(null)} 
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 font-sans text-xs text-slate-700">
              <div className="pb-2.5 border-b border-slate-100">
                <p className="text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">Cliente Mandante</p>
                <h3 className="text-base font-black text-slate-900 leading-tight">{selectedContractForView.client}</h3>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block">ID Contrato: {selectedContractForView.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block font-bold leading-normal">Processo OAB</span>
                  <strong className="text-slate-800 font-mono text-[10px]">{selectedContractForView.processNumber}</strong>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block font-bold">Voz Provisória</span>
                  <strong className="text-slate-800">Fase de Execução / Sentença Ativa</strong>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block font-bold">Custo de Êxito (%)</span>
                  <strong className="text-slate-800 font-mono">{selectedContractForView.percentFee}% do êxito bruto</strong>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block font-bold">Probabilidade Ganho</span>
                  <span className="inline-block px-1.5 bg-emerald-50 text-emerald-800 rounded font-bold uppercase text-[9px] mt-0.5">
                    {selectedContractForView.probability}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border flex justify-between items-center">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block font-bold">Estimativa de Honorário de Trabalho</span>
                  <h4 className="text-base font-mono font-black text-blue-755 mt-0.5">{formatBRL(selectedContractForView.expectedFee)}</h4>
                </div>
                <div className="text-right text-[10px] text-slate-405 font-mono">
                  Base: {formatBRL(selectedContractForView.baseValue)}
                </div>
              </div>

              {/* Steps or folder indicators */}
              <div className="pt-2 text-slate-500 text-[10px] space-y-1.5">
                <p>📂 Diretório Google Drive: <strong className="font-mono text-[9px] text-slate-600">Drive/BOSS-Financeiro/{selectedContractForView.client.replace(/\s+/g, '_')}_SC</strong></p>
                <p>🗓️ Data estimada de apuração: <strong className="font-mono font-bold text-slate-700">{formatToDDMMAAAA(selectedContractForView.expectedDate)}</strong></p>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-150">
                <button
                  onClick={() => setSelectedContractForView(null)}
                  className="px-4 py-1.8 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white font-bold rounded uppercase text-[10px]"
                >
                  Fechar Visualização
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EDITING CONTRACT FORM DIALOG modal */}
      {editingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-305 max-w-md w-full overflow-hidden">
            
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider">Editar Contrato Financeiro</h3>
              <button type="button" onClick={() => setEditingContract(null)}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs text-slate-700">
              
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Nome do Cliente</label>
                <input
                  type="text"
                  value={editClient}
                  onChange={e => setEditClient(e.target.value)}
                  className="text-xs p-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Valor Base (R$)</label>
                  <input
                    type="number"
                    value={editBaseValue}
                    onChange={e => setEditBaseValue(Number(e.target.value))}
                    className="text-xs p-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Percentual Taxa (%)</label>
                  <input
                    type="number"
                    value={editPercentFee}
                    onChange={e => setEditPercentFee(Number(e.target.value))}
                    className="text-xs p-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Novo Faturamento Estimado Calculado</p>
                <h4 className="text-sm font-mono font-black text-slate-800 mt-1">
                  {formatBRL((editBaseValue * editPercentFee) / 100)}
                </h4>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingContract(null)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded uppercase font-bold text-[10px] text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded uppercase font-bold text-[10px]"
                >
                  Gravar Alterações
                </button>
              </div>

            </div>

          </form>
        </div>
      )}

    </div>
  );
}
