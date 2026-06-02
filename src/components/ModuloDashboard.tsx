import React from 'react';
import { 
  TrendingUp, 
  CheckCircle, 
  ShieldAlert, 
  Briefcase, 
  AlertCircle, 
  Server, 
  Coins, 
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Transaction, NiboQueueItem, SuccessContract, AgreementInstallment, CriticalAlert } from '../types';

interface ModuloDashboardProps {
  transactions: Transaction[];
  niboQueue: NiboQueueItem[];
  successContracts: SuccessContract[];
  agreements: AgreementInstallment[];
  alerts: CriticalAlert[];
  onNavigate: (path: string) => void;
}

export default function ModuloDashboard({
  transactions,
  niboQueue,
  successContracts,
  agreements,
  alerts,
  onNavigate
}: ModuloDashboardProps) {

  const formatBRL = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  // 5. Contratos Inadimplentes (Overdue and late installments)
  const overdueTransactions = transactions.filter(t => t.status === 'overdue' && t.type === 'income');
  const lateAgreements = agreements.filter(a => a.status === 'atrasado');
  const totalInadimplentesValue = overdueTransactions.reduce((acc, t) => acc + t.value, 0) + lateAgreements.reduce((acc, a) => acc + a.installmentValue, 0);
  const totalInadimplentesQty = overdueTransactions.length + lateAgreements.length;

  // 1. Recebíveis do Mês (Junho 2026 - future and pending transactions)
  const currentMonthReceivables = transactions.filter(t => t.type === 'income' && t.status !== 'paid');
  const totalReceivablesValue = currentMonthReceivables.reduce((acc, t) => acc + t.value, 0);
  const totalReceivablesQty = currentMonthReceivables.length;

  // 2. Recebido no Mês (Paid income transactions)
  const receivedThisMonth = transactions.filter(t => t.type === 'income' && t.status === 'paid');
  const totalReceivedValue = receivedThisMonth.reduce((acc, t) => acc + t.value, 0);
  const totalReceivedQty = receivedThisMonth.length;

  // 3. Alertas Críticos (Active non-dismissed alerts)
  const activeAlerts = alerts.filter(a => !a.dismissed);
  const totalAlertsQty = activeAlerts.length;
  // Let's summarize the financial weight of these alerts from actual overdue values and late agreements
  const totalAlertsValue = overdueTransactions.reduce((acc, t) => acc + t.value, 0) + lateAgreements.reduce((acc, a) => acc + a.installmentValue, 0);

  // 4. Contratos Ativos (Gerdau, Tenda, Sindicato, etc.)
  // Let's calculate active contract estimates
  const activeContractsList = successContracts.filter(c => c.status === 'ativo' || c.status === 'ganho');
  const totalContractsValue = activeContractsList.reduce((acc, c) => acc + c.baseValue, 0);
  const totalContractsQty = activeContractsList.length;

  // 6. Aguardando NIBO (Nibo queue pending/failed syncs)
  const awaitingNibo = niboQueue.filter(q => q.status === 'pending' || q.status === 'failed');
  const totalNiboValue = awaitingNibo.reduce((acc, q) => acc + q.value, 0);
  const totalNiboQty = awaitingNibo.length;

  // 7. Acordos Ativos (Agreements in-progress, non-quitado)
  const activeAgreementsList = agreements.filter(a => a.status !== 'quitado');
  const totalAgreementsValue = activeAgreementsList.reduce((acc, a) => acc + a.totalValue, 0);
  const totalAgreementsQty = activeAgreementsList.length;

  // 8. Contratos de Êxito (Faturamento do Escritório previsto de Gerdau, Tenda, Sicredi, Sindicato RS)
  const totalSuccessExpectedFee = successContracts.reduce((acc, c) => acc + c.expectedFee, 0);
  const totalSuccessQty = successContracts.length;

  // Build high-concept styling configuration for the cards
  const cards = [
    {
      id: 'recebiveis_mes',
      title: 'Recebíveis do Mês',
      path: '/financeiro/modulo-03-recebiveis-mes',
      value: totalReceivablesValue,
      qty: totalReceivablesQty,
      qtyLabel: 'parcelas previstas',
      icon: TrendingUp,
      colorClass: 'border-l-4 border-sky-500 bg-white hover:bg-slate-50/50',
      iconBg: 'bg-sky-50 text-sky-600',
      badge: 'PROVISÃO EM JOGO',
      badgeColor: 'bg-sky-100 text-sky-800',
      description: 'Previsões e cronogramas de faturamento ativo.'
    },
    {
      id: 'recebido_mes',
      title: 'Recebido no Mês',
      path: '/financeiro/modulo-04-recebido-mes',
      value: totalReceivedValue,
      qty: totalReceivedQty,
      qtyLabel: 'comprovantes conciliados',
      icon: CheckCircle,
      colorClass: 'border-l-4 border-emerald-500 bg-white hover:bg-slate-50/50',
      iconBg: 'bg-emerald-50 text-emerald-600',
      badge: 'SINCALIZADO',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Valores recebidos e conciliação bancária de caixa.'
    },
    {
      id: 'alertas_criticos',
      title: 'Alertas Críticos',
      path: '/financeiro/modulo-02-alertas-criticos',
      value: totalAlertsValue,
      qty: totalAlertsQty,
      qtyLabel: 'pendências urgentes',
      icon: ShieldAlert,
      colorClass: `border-l-4 border-rose-500 bg-white hover:bg-slate-50/50 ${totalAlertsQty > 0 ? 'animate-pulse' : ''}`,
      iconBg: 'bg-rose-50 text-rose-600',
      badge: totalAlertsQty > 0 ? 'CONFLITO DETECTADO' : 'SEM CONFLITOS',
      badgeColor: totalAlertsQty > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-850',
      description: 'Vencimentos atrasados, comprovações e divergências.'
    },
    {
      id: 'contratos_ativos',
      title: 'Contratos Ativos',
      path: '/financeiro/modulo-05-contratos-ativos',
      value: totalContractsValue,
      qty: totalContractsQty,
      qtyLabel: 'instrumentos jurídicos',
      icon: Briefcase,
      colorClass: 'border-l-4 border-amber-500 bg-white hover:bg-slate-50/50',
      iconBg: 'bg-amber-50 text-amber-600',
      badge: 'CARTEIRA ATIVA',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Contratos vigentes de honorários e assessoria continuada.'
    },
    {
      id: 'contratos_inadimplentes',
      title: 'Contratos Inadimplentes',
      path: '/financeiro/modulo-06-contratos-inadimplentes',
      value: totalInadimplentesValue,
      qty: totalInadimplentesQty,
      qtyLabel: 'em atraso recorrente',
      icon: AlertCircle,
      colorClass: 'border-l-4 border-red-600 bg-white hover:bg-slate-50/50',
      iconBg: 'bg-red-50 text-red-600',
      badge: totalInadimplentesQty > 0 ? 'COBRANÇA EM CURSO' : 'EM DIA',
      badgeColor: totalInadimplentesQty > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-50 text-emerald-800',
      description: 'Amortizações atrasadas, dias de mora e régua automatizada.'
    },
    {
      id: 'aguardando_nibo',
      title: 'Aguardando NIBO',
      path: '/financeiro/modulo-07-nibo',
      value: totalNiboValue,
      qty: totalNiboQty,
      qtyLabel: 'lançamentos na fila',
      icon: Server,
      colorClass: 'border-l-4 border-indigo-500 bg-white hover:bg-slate-50/50',
      iconBg: 'bg-indigo-50 text-indigo-600',
      badge: totalNiboQty > 0 ? 'FALTA CONCILIAR' : 'DESPACHADO',
      badgeColor: totalNiboQty > 0 ? 'bg-indigo-100 text-indigo-800 animate-pulse' : 'bg-slate-100 text-slate-800',
      description: 'Fila de lançamento corporativa e log de conexões.'
    },
    {
      id: 'acordos_ativos',
      title: 'Acordos Ativos',
      path: '/financeiro/modulo-08-acordos-ativos',
      value: totalAgreementsValue,
      qty: totalAgreementsQty,
      qtyLabel: 'parcelas de acordos',
      icon: Coins,
      colorClass: 'border-l-4 border-teal-500 bg-white hover:bg-slate-50/50',
      iconBg: 'bg-teal-50 text-teal-600',
      badge: 'RENEGOCIAÇÃO',
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Resoluções amigáveis judiciais e amortizações.'
    },
    {
      id: 'contratos_exito',
      title: 'Contratos de Êxito',
      path: '/financeiro/modulo-09-contratos-exito',
      value: totalSuccessExpectedFee,
      qty: totalSuccessQty,
      qtyLabel: 'ações de êxito',
      icon: Sparkles,
      colorClass: 'border-l-4 border-purple-500 bg-white hover:bg-slate-50/50',
      iconBg: 'bg-purple-50 text-purple-600',
      badge: 'PROBABILIDADE ALTA',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Projeções honorários ad-exitum e rateio escritório-cliente.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Intro visual banner */}
      <div className="bg-[#1E293B] text-white rounded-lg p-5 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 p-8 opacity-[0.03] flex items-center">
          <TrendingUp className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest font-bold">
            Portal BOSS • Central de Comando Financeiro
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1.5 uppercase font-display">
            CENTRAL DE NAVEGAÇÃO E INDICADORES CORPORATIVOS
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Bem-vindo à nova arquitetura financeira descentralizada. Esta tela funciona estritamente como um portal consolidado para indicadores globais de liquidez, riscos e metas de êxito. Para preencher dados, consultar tabelas, gerar rateios ou conferir logs operacionais, utilize os atalhos ou adentre nos módulos correspondentes.
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('/financeiro/modulo-10-cadastro-contrato')}
              className="px-3.5 py-1.8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> Novo Contrato Financeiro (Módulo 10)
            </button>
            <button
              onClick={() => onNavigate('/financeiro/configuracoes')}
              className="px-3.5 py-1.8 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] rounded uppercase tracking-wider transition-all shadow-sm flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5 shrink-0 text-purple-200" /> Configurações BOSS (M11)
            </button>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700/50">
              <span className="w-2 h-2 rounded bg-emerald-500 animate-ping"></span>
              <span>Banco de Dados: Sincronia Real-Time Integrada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 8 dynamic cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map(card => {
          const CardIcon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.path)}
              className={`rounded-lg border border-slate-100 p-4 transition-all duration-200 cursor-pointer shadow-md select-none flex flex-col justify-between h-[180px] group relative transform hover:-translate-y-0.5 ${card.colorClass}`}
              id={`card-${card.id}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[9px] font-bold px-1.8 py-0.5 rounded ${card.badgeColor}`}>
                  {card.badge}
                </span>
                <div className={`p-1.5 rounded-md transition-colors ${card.iconBg} group-hover:scale-105 transform duration-150`}>
                  <CardIcon className="w-4 h-4 shrink-0" />
                </div>
              </div>

              <div className="mt-2 flex-1">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-snug line-clamp-2">
                  {card.description}
                </p>
              </div>

              <div className="border-t border-slate-50 pt-2 flex items-end justify-between mt-auto">
                <div>
                  <h4 className="text-sm font-mono font-black text-slate-900 tracking-tight">
                    {formatBRL(card.value)}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-mono">
                    {card.qty} {card.qtyLabel}
                  </p>
                </div>
                <div className="text-[9px] font-bold text-blue-600 flex items-center gap-0.5 uppercase tracking-wider group-hover:underline">
                  <span>Acessar</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Corporate Compliance Notice */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-400 flex items-center justify-between">
        <span>© 2026 Giffoni BOSS • Todos os direitos de faturamento e repasse sob conformidade da Ordem de Serviços.</span>
        <span className="font-mono">IP: 10.12.94.1 • SSL: ACTIVE</span>
      </div>
    </div>
  );
}
