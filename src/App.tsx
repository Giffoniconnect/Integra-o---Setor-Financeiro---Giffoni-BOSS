import React, { useState } from 'react';
import { 
  Transaction, 
  NiboQueueItem, 
  SuccessContract, 
  AgreementInstallment, 
  CriticalAlert, 
  ConferenceLog 
} from './types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_NIBO_QUEUE, 
  INITIAL_SUCCESS_CONTRACTS, 
  INITIAL_AGREEMENTS, 
  INITIAL_ALERTS, 
  INITIAL_LOGS 
} from './data';

// Components
import MonthlySummary from './components/MonthlySummary';
import CriticalAlerts from './components/CriticalAlerts';
import ReceivablesByCategory from './components/ReceivablesByCategory';
import NiboQueue from './components/NiboQueue';
import GeneralLedger from './components/GeneralLedger';
import SuccessContracts from './components/SuccessContracts';
import AgreementsInstallments from './components/AgreementsInstallments';
import ReportsExports from './components/ReportsExports';
import ConferenceLogs from './components/ConferenceLogs';

// Icons
import { 
  Building2, 
  Calendar, 
  ShieldAlert, 
  PieChart, 
  Server, 
  Layers, 
  Scale, 
  Coins, 
  Download, 
  Terminal, 
  User, 
  ChevronRight, 
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

export default function App() {
  // Unified Core States
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [niboQueue, setNiboQueue] = useState<NiboQueueItem[]>(INITIAL_NIBO_QUEUE);
  const [successContracts, setSuccessContracts] = useState<SuccessContract[]>(INITIAL_SUCCESS_CONTRACTS);
  const [agreements, setAgreements] = useState<AgreementInstallment[]>(INITIAL_AGREEMENTS);
  const [alerts, setAlerts] = useState<CriticalAlert[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<ConferenceLog[]>(INITIAL_LOGS);

  // Quick State Filters / Active Anchor
  const [activeSection, setActiveSection] = useState<string>('Overview');

  // Logs append helper
  const addTimelineLog = (action: string, status: ConferenceLog['status'] = 'info') => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: ConferenceLog = {
      id: `LG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp,
      action,
      user: 'direito.rgr@gmail.com',
      status
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Section 1 & 5: Add a new custom transaction
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'isNiboSynced'>) => {
    const nextId = `TX-${Math.floor(100 + Math.random() * 900)}`;
    const addedTx: Transaction = {
      ...newTx,
      id: nextId,
      isNiboSynced: false
    };

    setTransactions(prev => [addedTx, ...prev]);
    addTimelineLog(`Novo lançamento registrado: "${newTx.description}" de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newTx.value)}`, 'success');
  };

  // Section 5: Update a transaction's status manually
  const handleUpdateTransactionStatus = (id: string, status: 'paid' | 'pending' | 'overdue') => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        addTimelineLog(`Lançamento ${id} status atualizado para: ${status.toUpperCase()} ("${t.description}")`, 'info');
        return { ...t, status };
      }
      return t;
    }));

    // If marked as paid, automatically dismiss any related alert
    if (status === 'paid') {
      const matchTx = transactions.find(t => t.id === id);
      if (matchTx) {
        setAlerts(prev => prev.map(a => {
          if (a.subtext.includes(matchTx.description) || (a.type === 'overdue' && matchTx.description.includes('Carrefour'))) {
            return { ...a, dismissed: true };
          }
          return a;
        }));
      }
    }
  };

  // Section 5: Send single transaction to NIBO queue
  const handleSyncTransactionToNibo = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    // Check if already in queue
    const inQueue = niboQueue.some(q => q.description.includes(tx.description));
    if (inQueue) {
      addTimelineLog(`Transação "${tx.description}" já consta na Fila NIBO.`, 'warning');
      return;
    }

    const newQueueItem: NiboQueueItem = {
      id: `NQ-${Math.floor(100 + Math.random() * 900)}`,
      type: tx.type,
      description: tx.description,
      value: tx.value,
      date: tx.date,
      status: 'synced', // automatic synced as the user pushed
      attempts: 1
    };

    setNiboQueue(prev => [newQueueItem, ...prev]);
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, isNiboSynced: true } : t));
    addTimelineLog(`Transação ${id} ("${tx.description}") emparelhada de imediato com a Fila NIBO.`, 'success');
  };

  // Section 2: Dismiss alert
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
    addTimelineLog(`Alerta crítico ${id} dispensado da tela de operações.`, 'info');
  };

  // Section 2: Resolve specific alerts dynamically
  const handleResolveAlert = (alertType: string, alertId: string) => {
    if (alertType === 'sync_fail') {
      // 1. Mark token as valid
      // 2. Synchronize all failed NIBO queue items
      setNiboQueue(prev => prev.map(item => {
        if (item.status === 'failed') {
          // Find trans in transaction list
          setTransactions(txs => txs.map(t => t.description.includes(item.description) ? { ...t, isNiboSynced: true } : t));
          return { ...item, status: 'synced', errorDescription: undefined, attempts: item.attempts + 1 };
        }
        return item;
      }));
      setAlerts(prev => prev.map(a => a.type === 'sync_fail' ? { ...a, dismissed: true } : a));
      addTimelineLog('Token NIBO API re-validado. Sincronização automática forçada com sucesso.', 'success');
    } 
    else if (alertType === 'overdue') {
      // Find overdue transaction (Carrefour Brasil)
      const overdueCarrefour = transactions.find(t => t.status === 'overdue' && t.description.includes('Carrefour'));
      if (overdueCarrefour) {
        handleUpdateTransactionStatus(overdueCarrefour.id, 'paid');
      }
      setAlerts(prev => prev.map(a => a.type === 'overdue' ? { ...a, dismissed: true } : a));
      addTimelineLog('Recebível Carrefour Brasil compensado manualmente via link de atalho.', 'success');
    } 
    else if (alertType === 'agreement_delay') {
      // Notify Distribuidora Fenix S/A
      const fenixAgreement = agreements.find(a => a.debtor.includes('Fenix'));
      if (fenixAgreement) {
        // Automatically make them pay that installment!
        handlePayInstallment(fenixAgreement.id);
      }
      setAlerts(prev => prev.map(a => a.type === 'agreement_delay' ? { ...a, dismissed: true } : a));
      addTimelineLog('Lembrete de cobrança disparado via WhatsApp para Distribuidora Fenix S/A.', 'success');
    }
    else if (alertType === 'high_success_fee') {
      // Just focus on contract
      scrollToSection('section-contratos');
      addTimelineLog('Foco redirecionado para contratos de êxito.', 'info');
    }
  };

  // Section 4: Sync single Nibo Queue item
  const handleSyncNiboItem = (id: string) => {
    setNiboQueue(prev => prev.map(item => {
      if (item.id === id) {
        // Sync related transactions
        setTransactions(txs => txs.map(t => t.description.includes(item.description) ? { ...t, isNiboSynced: true } : t));
        addTimelineLog(`Item da fila Nibo ${id} ("${item.description}") sincronizado com sucesso.`, 'success');
        return { ...item, status: 'synced', attempts: item.attempts + 1, errorDescription: undefined };
      }
      return item;
    }));
  };

  // Section 4: Sync all Nibo Queue items bulk
  const handleSyncNiboAll = () => {
    setNiboQueue(prev => prev.map(item => {
      if (item.status !== 'synced') {
        // Sync corresponding transactions
        setTransactions(txs => txs.map(t => t.description.includes(item.description) ? { ...t, isNiboSynced: true } : t));
        return { ...item, status: 'synced', attempts: item.attempts + 1, errorDescription: undefined };
      }
      return item;
    }));
    // Dismiss failing sync alerts if any
    setAlerts(prev => prev.map(a => a.type === 'sync_fail' ? { ...a, dismissed: true } : a));
    addTimelineLog('Lote completo de faturamento sincronizado com o ERP Nibo.', 'success');
  };

  // Section 4: Reset expired Nibo API token
  const handleResetNiboToken = () => {
    // Re-sync failed accounts
    setNiboQueue(prev => prev.map(item => {
      if (item.status === 'failed') {
        setTransactions(txs => txs.map(t => t.description.includes(item.description) ? { ...t, isNiboSynced: true } : t));
        return { ...item, status: 'synced', errorDescription: undefined };
      }
      return item;
    }));
    setAlerts(prev => prev.map(a => a.type === 'sync_fail' ? { ...a, dismissed: true } : a));
    addTimelineLog('Token de autenticação NIBO API re-estabelecido por direito.rgr@gmail.com.', 'success');
  };

  // Section 6: Add modular success fee contract
  const handleAddSuccessContract = (contract: Omit<SuccessContract, 'id'>) => {
    const nextId = `SC-${Math.floor(205 + Math.random() * 900)}`;
    setSuccessContracts(prev => [...prev, { ...contract, id: nextId }]);
    addTimelineLog(`Novo contrato de êxito mapeado para cliente: "${contract.client}" com estimativa de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.expectedFee)}`, 'success');
  };

  // Section 6: Update success fee status (e.g. mark as ganar, or mark as billed)
  const handleUpdateSuccessContractStatus = (id: string, status: SuccessContract['status']) => {
    setSuccessContracts(prev => prev.map(c => {
      if (c.id === id) {
        addTimelineLog(`Contrato ${id} (${c.client}) atualizado para: ${status.toUpperCase()}`, 'info');
        
        // If changed to billed (faturado): append a real paid transaction income automatically!
        if (status === 'faturado') {
          handleAddTransaction({
            description: `Recebimento Êxito - ${c.client}`,
            category: 'Êxito Judicial',
            value: c.expectedFee,
            type: 'income',
            status: 'paid',
            date: new Date().toISOString().substring(0, 10)
          });
        }
        
        return { ...c, status };
      }
      return c;
    }));
  };

  // Section 7: Add a new repayment agreement
  const handleAddAgreement = (newAg: Omit<AgreementInstallment, 'id'>) => {
    const nextId = `AG-${Math.floor(305 + Math.random() * 900)}`;
    setAgreements(prev => [...prev, { ...newAg, id: nextId }]);
    addTimelineLog(`Novo pacto de termo parcelado firmado com devedor: "${newAg.debtor}" por ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newAg.totalValue)}`, 'success');
  };

  // Section 7: Pay a specific installment on an agreement term
  const handlePayInstallment = (id: string) => {
    setAgreements(prev => prev.map(ag => {
      if (ag.id === id) {
        const nextInstallmentNum = ag.currentInstallment + 1;
        const reachedLimit = nextInstallmentNum >= ag.installmentsCount;
        
        // Append entry to general ledger automatically representing payment collection
        handleAddTransaction({
          description: `Acordo Judicial - ${ag.debtor} (Parc. ${nextInstallmentNum}/${ag.installmentsCount})`,
          category: 'Acórdãos e Acordos',
          value: ag.installmentValue,
          type: 'income',
          status: 'paid',
          date: new Date().toISOString().substring(0, 10)
        });

        const updatedStatus = reachedLimit ? 'quitado' : 'em_dia';
        addTimelineLog(`Parcela ${nextInstallmentNum}/${ag.installmentsCount} recebida de "${ag.debtor}".`, 'success');

        // Dismiss late alerts if paid
        if (ag.debtor.includes('Fenix')) {
          setAlerts(prev => prev.map(a => a.type === 'agreement_delay' ? { ...a, dismissed: true } : a));
        }

        return {
          ...ag,
          currentInstallment: nextInstallmentNum,
          status: updatedStatus,
          nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10) // bump date by 1 month
        };
      }
      return ag;
    }));
  };

  // Section 9: Clear audit timeline
  const handleClearLogs = () => {
    setLogs([]);
    addTimelineLog('Terminal de auditoria zerado por direito.rgr@gmail.com.', 'warning');
  };

  // Direct scrolls to anchor elements
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col font-sans">
      
      {/* High Density Header bar */}
      <header className="bg-[#1E293B] text-white shadow-sm sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white p-1.5 rounded shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight flex items-center gap-2">
                FINANCEIRO PRO <span className="text-[9px] bg-blue-500/20 text-blue-400 font-mono px-1.5 py-0.2 rounded border border-blue-500/30 font-bold">NIBO HUB v4.1</span>
              </h1>
              <p className="text-[10px] text-slate-400 leading-none">Sincronização e Auditoria Operacional Corporativa</p>
            </div>
          </div>

          {/* User Email Info / Status */}
          <div className="flex items-center gap-3">
            
            {/* Live Connection Badges */}
            <div className="hidden md:flex items-center gap-2 text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700">
              <span className="flex items-center gap-1 text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                API LINK: ONLINE
              </span>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/50">
              <div className="w-5.5 h-5.5 rounded bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                R
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-bold text-slate-100 leading-tight">Gestor Financeiro</p>
                <p className="text-[9px] text-slate-400 font-mono leading-none">direito.rgr@gmail.com</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col lg:flex-row gap-4">
        
        {/* Compact Right Drawer Navigation Panel based on High Density Theme */}
        <aside className="lg:w-56 shrink-0 flex flex-col gap-4 self-stretch">
          
          <div className="bg-[#1E293B] text-white rounded border border-slate-700/80 p-3 sticky top-16 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <LayoutDashboard className="w-3 h-3 text-slate-400" /> ÍNDICE OPERACIONAL
            </h3>

            {/* Anchor button listing */}
            <nav className="flex flex-col gap-1 text-xs">
              
              {/* Module 1: Resumo */}
              <button 
                onClick={() => { setActiveSection('resumo'); scrollToSection('section-resumo'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'resumo' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" /> Resumo do Mês</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

              {/* Module 2: Alertas */}
              <button 
                onClick={() => { setActiveSection('alertas'); scrollToSection('section-alertas'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between relative ${
                  activeSection === 'alertas' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> Alertas Críticos
                </span>
                <span className="bg-rose-900/60 text-rose-300 px-1 py-0.2 text-[9px] font-mono font-bold rounded">
                  {alerts.filter(a => !a.dismissed).length}
                </span>
              </button>

              {/* Module 3: Recebíveis */}
              <button 
                onClick={() => { setActiveSection('recebiveis'); scrollToSection('section-recebiveis'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'recebiveis' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><PieChart className="w-3.5 h-3.5 shrink-0" /> Recebíveis Categoria</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

              {/* Module 4: Fila Nibo */}
              <button 
                onClick={() => { setActiveSection('nibo'); scrollToSection('section-nibo'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'nibo' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 shrink-0" /> Fila NIBO Sync</span>
                <span className="bg-blue-900/60 text-blue-300 px-1 py-0.2 text-[9px] font-mono font-bold rounded">
                  {niboQueue.filter(q => q.status === 'pending').length}
                </span>
              </button>

              {/* Module 5: Tabela */}
              <button 
                onClick={() => { setActiveSection('tabela'); scrollToSection('section-tabela'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'tabela' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 shrink-0" /> Tabela Financeira</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

              {/* Module 6: Contratos */}
              <button 
                onClick={() => { setActiveSection('contratos'); scrollToSection('section-contratos'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'contratos' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 shrink-0" /> Contratos de Êxito</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

              {/* Module 7: Acordos */}
              <button 
                onClick={() => { setActiveSection('acordos'); scrollToSection('section-acordos'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'acordos' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 shrink-0" /> Acordos / Parcelas</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

              {/* Module 8: Relatorios */}
              <button 
                onClick={() => { setActiveSection('relatorios'); scrollToSection('section-relatorios'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'relatorios' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5 shrink-0" /> Relatórios Export</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

              {/* Module 9: Logs */}
              <button 
                onClick={() => { setActiveSection('logs'); scrollToSection('section-logs'); }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all flex items-center justify-between ${
                  activeSection === 'logs' ? 'bg-blue-600 text-white' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 shrink-0" /> Logs Auditoria</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

            </nav>

            {/* Quick real logs preview at the bottom of the sidebar */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 text-[10px]">
              <div className="uppercase text-slate-500 font-bold mb-1.5 tracking-wider px-1">Últimas Ações</div>
              <div className="space-y-1 font-mono text-slate-400">
                {logs.slice(0, 3).map((item, idx) => (
                  <div key={item.id} className="truncate px-0.5" title={item.action}>
                    • {item.action}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics helper inside sidebar */}
          <div className="bg-[#1E293B] border border-slate-700/80 text-white rounded p-3 text-xs space-y-2.5">
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-semibold">Saldo Confirmado</p>
              <h4 className="text-sm font-mono font-bold tracking-tight text-emerald-400 mt-0.5">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((acc, current) => acc + current.value, 0) -
                  transactions.filter(t => t.type === 'expense' && t.status === 'paid').reduce((acc, current) => acc + current.value, 0)
                )}
              </h4>
            </div>
            
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span>Lançamentos</span>
              <span className="font-mono text-slate-200">
                {transactions.filter(t => t.status === 'paid').length} pagos
              </span>
            </div>
          </div>

        </aside>

        {/* Right workspace displaying the modules sequence */}
        <main className="flex-1 flex flex-col gap-4">
          
          {/* Welcome Dashboard Banner banner */}
          <div className="p-4 bg-white text-slate-800 rounded border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 p-8 opacity-5 flex items-center">
              <Building2 className="w-32 h-32 text-slate-800" />
            </div>
            <div className="relative z-10">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Console de Controladoria Operacional de Êxito
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-normal font-sans">
                Este console de controladoria possibilita auditar receitas advocatícias, contratos de êxito judicial, planos de amortização/acordos, sincronizar pendências com a Fila Nibo, e auditar conformidade de conciliação diária de caixa. 
                Utilizando uma visualização compacta, com espaçamento denso e visualização de alta densidade de dados.
              </p>
            </div>
          </div>

          {/* MODULE 1: Resumo do Mês */}
          <MonthlySummary transactions={transactions} />

          {/* MODULE 2: Alertas Críticos */}
          <CriticalAlerts 
            alerts={alerts} 
            onDismiss={handleDismissAlert} 
            onResolveAlert={handleResolveAlert}
          />

          {/* Two-Column split for Receivables breakdown and Connection Queue */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* MODULE 3: Recebíveis por Categoria */}
            <ReceivablesByCategory transactions={transactions} />

            {/* MODULE 4: Fila NIBO */}
            <NiboQueue 
              queue={niboQueue} 
              onSyncItem={handleSyncNiboItem} 
              onSyncAll={handleSyncNiboAll}
              onResetToken={handleResetNiboToken}
            />
          </div>

          {/* MODULE 5: Tabela Financeira Geral */}
          <GeneralLedger 
            transactions={transactions} 
            onAddTransaction={handleAddTransaction}
            onUpdateStatus={handleUpdateTransactionStatus}
            onSyncTransaction={handleSyncTransactionToNibo}
          />

          {/* MODULE 6: Contratos de Êxito */}
          <SuccessContracts 
            contracts={successContracts}
            onAddContract={handleAddSuccessContract}
            onUpdateStatus={handleUpdateSuccessContractStatus}
          />

          {/* MODULE 7: Acordos e Parcelamentos */}
          <AgreementsInstallments 
            agreements={agreements}
            onAddAgreement={handleAddAgreement}
            onPayInstallment={handlePayInstallment}
          />

          {/* MODULE 8: Relatórios e Exportações */}
          <ReportsExports 
            transactions={transactions}
            onLogAction={addTimelineLog}
          />

          {/* MODULE 9: Logs de Conferência */}
          <ConferenceLogs 
            logs={logs}
            onAddManualLog={(note) => addTimelineLog(`[OPERATIONAL NOTE MANUAL] ${note}`, 'warning')}
            onClearLogs={handleClearLogs}
          />

        </main>

      </div>

      {/* Corporate footer */}
      <footer className="bg-[#1E293B] text-slate-400 py-4 border-t border-slate-700 text-center text-[10px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p>© 2026 Dashboard Financeiro Integrado. Operado por <strong>direito.rgr@gmail.com</strong></p>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">Terminal ID: F-1024</span>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 font-bold uppercase">Live Data</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
