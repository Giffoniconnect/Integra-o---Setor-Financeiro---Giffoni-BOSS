import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Check, 
  FileSpreadsheet, 
  FileJson, 
  Upload, 
  Copy, 
  ArrowLeftRight, 
  Percent, 
  PiggyBank, 
  ArrowLeft, 
  Briefcase, 
  History, 
  Edit3, 
  Sparkles, 
  DollarSign, 
  AlertCircle, 
  XCircle, 
  Info,
  Building2,
  Calendar,
  Layers,
  Coins,
  Send,
  HelpCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  CheckCircle,
  FileCheck
} from 'lucide-react';

// Subcomponents & Interface Types local to Giffoni Contract
export interface GiffoniContract {
  id: string;
  client: string;
  caseLinked: string;
  processNumber: string;
  payingParty: string;
  contractType: string;
  internalResponsible: string;
  creationDate: string;
  contractStatus: 'Rascunho' | 'Ativo' | 'Suspenso' | 'Finalizado';
  
  // Finance
  totalValue: number;
  installmentsCount: number;
  installmentValue: number;
  fixedDueDay: number;
  firstInstallmentDate: string;
  paymentMethod: string;
  destinationAccount: string;
  financialNotes: string;

  // Rateio Split
  clientPercent: number;
  officePercent: number;
  totalClientAmount: number;
  totalOfficeAmount: number;
}

export interface ContractInstallment {
  id: string;
  number: number;
  dueDate: string;
  grossValue: number;
  clientAmount: number;
  officeAmount: number;
  status: 'A vencer' | 'Vence hoje' | 'Atrasada' | 'Paga' | 'Rateio pendente' | 'Rateio realizado' | 'Lançada no NIBO' | 'Divergente' | 'Cancelada';
  voucherName?: string;
  isNiboSynced: boolean;
}

interface ContractRegistrationProps {
  onBackToDashboard: () => void;
  onLogAction?: (action: string, status?: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function ContractRegistration({ onBackToDashboard, onLogAction }: ContractRegistrationProps) {
  // 1. Initial State showing the MANDATORY visual example:
  // Contrato de êxito de R$ 5.000,00 em 10 parcelas, vencíveis todo dia 10, com rateio de 70% para o cliente e 30% para o escritório.
  const [client, setClient] = useState<string>('Petroquímica União - Giffoni Ref.');
  const [caseLinked, setCaseLinked] = useState<string>('Recuperação Tributária de ICMS Combustível');
  const [processNumber, setProcessNumber] = useState<string>('500294-88.2025.8.21.0001');
  const [payingParty, setPayingParty] = useState<string>('Fazenda Pública Estadual RS');
  const [contractType, setContractType] = useState<string>('Contrato de êxito com rateio');
  const [internalResponsible, setInternalResponsible] = useState<string>('Dr. Manoel Giffoni Filho');
  const [creationDate, setCreationDate] = useState<string>('2026-06-01');
  const [contractStatus, setContractStatus] = useState<'Rascunho' | 'Ativo' | 'Suspenso' | 'Finalizado'>('Ativo');

  // Finance Fields
  const [totalValue, setTotalValue] = useState<number>(5000);
  const [installmentsCount, setInstallmentsCount] = useState<number>(10);
  const [fixedDueDay, setFixedDueDay] = useState<number>(10);
  const [firstInstallmentDate, setFirstInstallmentDate] = useState<string>('2026-06-10');
  const [paymentMethod, setPaymentMethod] = useState<string>('Boleto');
  const [destinationAccount, setDestinationAccount] = useState<string>('Itaú Giffoni Advogados - PJ Conta Escrow');
  const [financialNotes, setFinancialNotes] = useState<string>(
    'Exemplo Visual Obrigatório Giffoni BOSS: Rateio de êxito com 70% do saldo ao cliente e 30% como receita real do escritório.'
  );

  // Rateio splits
  const [clientPercent, setClientPercent] = useState<number>(70);
  const [officePercent, setOfficePercent] = useState<number>(30);

  // Calculated variables
  const [installmentValue, setInstallmentValue] = useState<number>(500);
  const [totalClientAmount, setTotalClientAmount] = useState<number>(3500);
  const [totalOfficeAmount, setTotalOfficeAmount] = useState<number>(1500);
  const [clientInstallmentValue, setClientInstallmentValue] = useState<number>(350);
  const [officeInstallmentValue, setOfficeInstallmentValue] = useState<number>(150);

  // List of generated installments
  const [installments, setInstallments] = useState<ContractInstallment[]>([]);
  
  // Notification states
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto Calculations when numeric inputs change
  useEffect(() => {
    const grossInstallment = installmentsCount > 0 ? Number((totalValue / installmentsCount).toFixed(2)) : 0;
    setInstallmentValue(grossInstallment);

    const clientTot = Number((totalValue * (clientPercent / 100)).toFixed(2));
    const officeTot = Number((totalValue * (officePercent / 100)).toFixed(2));
    
    setTotalClientAmount(clientTot);
    setTotalOfficeAmount(officeTot);

    const clientInst = installmentsCount > 0 ? Number((clientTot / installmentsCount).toFixed(2)) : 0;
    const officeInst = installmentsCount > 0 ? Number((officeTot / installmentsCount).toFixed(2)) : 0;

    setClientInstallmentValue(clientInst);
    setOfficeInstallmentValue(officeInst);
  }, [totalValue, installmentsCount, clientPercent, officePercent]);

  // Handle Percentage constraints - if client changes, office auto-updates to sum 100%
  const handleClientPercentChange = (val: number) => {
    setClientPercent(val);
    const officeVal = Math.max(0, 100 - val);
    setOfficePercent(officeVal);
  };

  const handleOfficePercentChange = (val: number) => {
    setOfficePercent(val);
    const clientVal = Math.max(0, 100 - val);
    setClientPercent(clientVal);
  };

  // Pre-generate standard set of installments showcasing various default statuses
  const generateInitialInstallments = () => {
    const arr: ContractInstallment[] = [];
    const baseDate = new Date(firstInstallmentDate + 'T00:00:00');
    
    // Status candidates to populate the demo list beautifully
    const demoStatuses: ContractInstallment['status'][] = [
      'Paga',             // 1
      'Rateio realizado', // 2
      'Rateio pendente',  // 3
      'Vence hoje',       // 4
      'A vencer',         // 5
      'Atrasada',         // 6
      'Lançada no NIBO',  // 7
      'Divergente',       // 8
      'A vencer',         // 9
      'Cancelada'         // 10
    ];

    for (let i = 1; i <= installmentsCount; i++) {
      // Calculate due dates: increment by i-1 months
      const curDate = new Date(baseDate);
      curDate.setMonth(baseDate.getMonth() + (i - 1));
      
      // Force specific fixed due day if specified
      if (fixedDueDay > 0 && fixedDueDay <= 31) {
        curDate.setDate(fixedDueDay);
      }

      // Formatting
      const yyyy = curDate.getFullYear();
      const mm = String(curDate.getMonth() + 1).padStart(2, '0');
      const dd = String(curDate.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      // Pick index from pre-designed statuses list or default to 'A vencer'
      const customStatus = i <= demoStatuses.length ? demoStatuses[i - 1] : 'A vencer';
      const isPaid = customStatus === 'Paga' || customStatus === 'Rateio realizado' || customStatus === 'Lançada no NIBO';
      
      arr.push({
        id: `PARC-${100 + i}`,
        number: i,
        dueDate: formattedDate,
        grossValue: installmentValue,
        clientAmount: clientInstallmentValue,
        officeAmount: officeInstallmentValue,
        status: customStatus,
        voucherName: isPaid ? `COMPROVANTE_PAGO_PARC_${i}.pdf` : undefined,
        isNiboSynced: customStatus === 'Lançada no NIBO'
      });
    }

    setInstallments(arr);
    triggerFeedback('Parcelas geradas com sucesso com base nas diretrizes fiscais Giffoni!', 'success');
    if (onLogAction) {
      onLogAction(`Lote de ${installmentsCount} parcelas sincronizadas visualmente para o contrato do cliente "${client}".`, 'success');
    }
  };

  // Generate on load once
  useEffect(() => {
    generateInitialInstallments();
  }, []);

  const triggerFeedback = (text: string, type: 'success' | 'info' | 'error') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 5000);
  };

  // Actions
  const handleGerarParcelasManual = (e: React.FormEvent) => {
    e.preventDefault();
    generateInitialInstallments();
  };

  const handleUpdateStatusParcela = (id: string, newStatus: ContractInstallment['status']) => {
    setInstallments(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, status: newStatus };
        if (newStatus === 'Paga' || newStatus === 'Rateio realizado' || newStatus === 'Lançada no NIBO') {
          updated.voucherName = p.voucherName || `RECIBO_SAD_REF_${p.number}.pdf`;
        }
        if (newStatus === 'Lançada no NIBO') {
          updated.isNiboSynced = true;
        }
        return updated;
      }
      return p;
    }));
    triggerFeedback(`Status da Parcela ${id.replace('PARC-', '')} alterado para "${newStatus}".`, 'info');
    if (onLogAction) {
      onLogAction(`Contrato Giffoni: Parcela ${id} atualizada para ${newStatus.toUpperCase()}`, 'info');
    }
  };

  const handleUploadVoucher = (id: string) => {
    setInstallments(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          voucherName: `PDF_COMPROVANTE_CONFERIDO_${Math.floor(1000 + Math.random() * 9000)}.pdf`
        };
      }
      return p;
    }));
    triggerFeedback('Comprovante bancário anexado à parcela de confissão com sucesso!', 'success');
    if (onLogAction) {
      onLogAction(`Anexo de comprovante de quitação validado na Parcela ${id}.`, 'success');
    }
  };

  const handleCopyResumo = () => {
    const text = `=== GIFFONI BOSS: RESUMO FINANCEIRO DE CONTRATO ===
Cliente: ${client}
Caso Vinculado: ${caseLinked}
Processo: ${processNumber}
Tipo de Contrato: ${contractType}
--------------------------------------------------
Valor Total do Contrato: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Total de Parcelas: ${installmentsCount} parcelas de R$ ${installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Vencimento: Todo dia ${fixedDueDay} (Próxima: ${firstInstallmentDate})
--------------------------------------------------
Regra de Rateio / Quota-Litis:
- Cliente: ${clientPercent}% | Total Cliente: R$ ${totalClientAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Escritório: ${officePercent}% | Receita Real Escritório: R$ ${totalOfficeAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Parcela Cliente: R$ ${clientInstallmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Parcela Escritório (Honorários): R$ ${officeInstallmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
--------------------------------------------------
Conta de Deposito: ${destinationAccount}
Responsável: ${internalResponsible}
Pauta: Notificação e conciliação preparatória para ERP Nibo.`;

    navigator.clipboard.writeText(text);
    triggerFeedback('Resumo financeiro estruturado copiado para a área de transferência!', 'success');
    if (onLogAction) {
      onLogAction('Resumo consolidado do contrato copiado para integração externa.', 'info');
    }
  };

  const handleExportPlanilha = () => {
    // Generate CSV contents
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID Parcela;Numero Parcela;Vencimento;Valor Bruto (BRL);Destinado Cliente (BRL);Destinado Escritorio (BRL);Status;Comprovante;Sincronia NIBO\n';
    
    installments.forEach(p => {
      csvContent += `${p.id};${p.number};${p.dueDate};${p.grossValue};${p.clientAmount};${p.officeAmount};${p.status};${p.voucherName || 'Nenhum'};${p.isNiboSynced ? 'SIM' : 'NAO'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Giffoni_BOSS_Contrato_${client.replace(/\s+/g, '_')}_Parcelas.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerFeedback('CSV de faturamento exportado com sucesso para conformidade contábil!', 'success');
    if (onLogAction) {
      onLogAction(`Planilha de parcelas de rateio exportada para o cliente "${client}".`, 'success');
    }
  };

  const formatBRL = (num: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-0 sm:p-2 flex flex-col font-sans">
      
      {/* Upper Navigation and Giffoni BOSS Title Panel */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-4 px-2">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition duration-150 border border-slate-250 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Dashboard
          </button>
          
          <div className="h-6 w-[1px] bg-slate-300 hidden sm:block"></div>
          
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-blue-600 text-white font-mono px-1.5 py-0.2 rounded font-black tracking-normal uppercase">Giffoni BOSS</span>
              <span className="text-[9px] text-slate-400 font-mono font-bold tracking-widest uppercase">MÓDULO DE ADMISSÃO EXTRAORDINÁRIA</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
              Cadastro de Contrato Financeiro Giffoni
            </h1>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleCopyResumo}
            className="flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 rounded shadow-xs uppercase tracking-wider"
            title="Copiar resumo textual para Nibo/Emails"
          >
            <Copy className="w-3.5 h-3.5 text-blue-500" /> Copiar Resumo
          </button>
          
          <button
            onClick={handleExportPlanilha}
            className="flex items-center gap-1 text-[9px] font-extrabold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-xs uppercase tracking-wider"
            title="Exportar parcelamento para planilha Excel/CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-100" /> Exportar Planilha
          </button>
        </div>
      </div>

      {/* Floating feedback message alert bar */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 mb-4 rounded text-xs font-bold font-mono tracking-wide shadow-sm flex items-center justify-between mx-2 ${
              feedbackMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' 
                : feedbackMsg.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
              <span>GIFFONI ADVISORY: {feedbackMsg.text}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-[10px] font-bold hover:opacity-75 uppercase">Concluir</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Contents - Forms Left, Interactive Simulator Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-2 items-start">
        
        {/* Left Side: General and Financial Inputs */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Form wrapper */}
          <form onSubmit={handleGerarParcelasManual} className="space-y-4">
            
            {/* 1. Dados Gerais Card */}
            <div className="bg-white rounded border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-3">
                <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  01. Dados Gerais do Contrato Legal
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cliente */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Cliente / Contratante</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-medium select-text"
                    placeholder="Ex: Petrobras S.A."
                    required
                  />
                </div>

                {/* Caso Vinculado */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Nome do Caso / Pasta judicial</label>
                  <input
                    type="text"
                    value={caseLinked}
                    onChange={(e) => setCaseLinked(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 select-text"
                    placeholder="Ex: Tributário Geral - ICMS"
                    required
                  />
                </div>

                {/* Número do Processo */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Nº Processo Judicial (Se aplicável)</label>
                  <input
                    type="text"
                    value={processNumber}
                    onChange={(e) => setProcessNumber(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-mono select-text"
                    placeholder="Ex: 500294-88.2025.8.21.0001"
                  />
                </div>

                {/* Parte Pagadora */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Parte Devedora / Parte Pagadora</label>
                  <input
                    type="text"
                    value={payingParty}
                    onChange={(e) => setPayingParty(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 select-text"
                    placeholder="Ex: Real Ex-Adverso Ltda"
                    required
                  />
                </div>

                {/* Tipo de Contrato */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Tipo Absoluto do Contrato Financeiro</label>
                  <select
                    value={contractType}
                    onChange={(e) => {
                      setContractType(e.target.value);
                      // Custom helper: default rateio changes based on type
                      if (e.target.value === 'Contrato de êxito com rateio') {
                        handleClientPercentChange(70);
                      } else if (e.target.value === 'Contrato de êxito' || e.target.value === 'Honorários sucumbenciais') {
                        handleClientPercentChange(0); // 100% to office
                      } else {
                        handleClientPercentChange(0); // fallback non-rateio
                      }
                    }}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Contrato de honorários fixos">Contrato de honorários fixos</option>
                    <option value="Contrato de êxito">Contrato de êxito</option>
                    <option value="Contrato de êxito com rateio">Contrato de êxito com rateio (Membro e Cliente)</option>
                    <option value="Acordo judicial">Acordo judicial</option>
                    <option value="Acordo extrajudicial">Acordo extrajudicial</option>
                    <option value="Pagamento parcelado por ex-adverso">Pagamento parcelado por ex-adverso</option>
                    <option value="Honorários sucumbenciais">Honorários sucumbenciais</option>
                    <option value="Recebimento avulso">Recebimento avulso extraordinário</option>
                  </select>
                </div>

                {/* Responsavel Interno */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Patrono / Responsável Interno Principal</label>
                  <input
                    type="text"
                    value={internalResponsible}
                    onChange={(e) => setInternalResponsible(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 select-text"
                    placeholder="Ex: Dra. Marta Giffoni"
                    required
                  />
                </div>

                {/* Data de Criacao */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Data de Criação do Vínculo</label>
                  <input
                    type="date"
                    value={creationDate}
                    onChange={(e) => setCreationDate(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                {/* Status do Contrato */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Status Operacional do Contrato</label>
                  <select
                    value={contractStatus}
                    onChange={(e) => setContractStatus(e.target.value as any)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Rascunho">Rascunho / Proposta</option>
                    <option value="Ativo">Ativo / Em Execução</option>
                    <option value="Suspenso">Suspenso / Sob Análise</option>
                    <option value="Finalizado">Finalizado / Baixado no Nibo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Dados Financeiros Card */}
            <div className="bg-white rounded border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-3">
                <Coins className="w-4 h-4 text-blue-500 shrink-0" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  02. Dados Financeiros & Parâmetros de Amortização
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Valor Total */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Valor Total do Pacto (R$)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-[10px] text-slate-400 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={totalValue}
                      onChange={(e) => setTotalValue(Math.max(0, Number(e.target.value)))}
                      className="text-xs p-1.5 pl-7 w-full bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-mono font-bold"
                      placeholder="Ex: 5000"
                      required
                    />
                  </div>
                </div>

                {/* Qtd Parcelas */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Quantidade de Parcelas</label>
                  <input
                    type="number"
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(Math.max(1, Number(e.target.value)))}
                    className="text-xs p-1.5 w-full bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-mono font-bold"
                    placeholder="Ex: 10"
                    required
                  />
                </div>

                {/* Valor por Parcela */}
                <div className="flex flex-col gap-0.5 bg-slate-50 p-1 rounded border border-slate-150 inline-block">
                  <label className="text-[8px] font-black text-slate-400 uppercase">Valor Parcela Bruta (Auto)</label>
                  <span className="text-xs font-mono font-black text-slate-700 block mt-1">
                    {formatBRL(installmentValue)}
                  </span>
                </div>

                {/* Dia Vencimento */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Dia Fixo de Vencimento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={fixedDueDay}
                    onChange={(e) => setFixedDueDay(Math.min(31, Math.max(1, Number(e.target.value))))}
                    className="text-xs p-1.5 w-full bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Ex: 10"
                    required
                  />
                </div>

                {/* Data 1ª Parcela */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Data da Primeira Parcela</label>
                  <input
                    type="date"
                    value={firstInstallmentDate}
                    onChange={(e) => setFirstInstallmentDate(e.target.value)}
                    className="text-xs p-1.5 w-full bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                {/* Forma de Pagamento */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Forma de Liquidação</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-xs p-1.5 w-full bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="Boleto">Boleto Bancário</option>
                    <option value="Pix">PIX Trânsito Comercial</option>
                    <option value="Transferência">TED / DOC Interbancário</option>
                    <option value="Dinheiro">Dinheiro Físico / Caixa-Forte</option>
                    <option value="Debito Geral">Débito em Conta</option>
                  </select>
                </div>
              </div>

              {/* Destination Account and Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Conta Bancária de Destino</label>
                  <input
                    type="text"
                    value={destinationAccount}
                    onChange={(e) => setDestinationAccount(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 select-text"
                    placeholder="Ex: Caixa Econômica Escrow"
                    required
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase font-bold text-amber-750">Observações Operacionais Financeiras</label>
                  <input
                    type="text"
                    value={financialNotes}
                    onChange={(e) => setFinancialNotes(e.target.value)}
                    className="text-xs p-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-blue-500 select-text"
                    placeholder="Ex: Cláusula quota-litis adicional pactuada expressamente"
                  />
                </div>
              </div>

              {/* Manual Generation Trigger Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-[10px] font-black px-4 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white rounded transition shadow-xs uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" /> Re-calcular & Gerar Cronograma
                </button>
              </div>

            </div>
          </form>

        </div>

        {/* Right Side: Rateio Breakdown Interactive Panel and Live Metrics Screen */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card: 03. Campo específico para contrato de êxito com rateio */}
          <div className="bg-white rounded border border-gray-200 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Percent className="w-16 h-16 text-blue-500" />
            </div>

            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-3">
              <ArrowLeftRight className="w-4 h-4 text-blue-600 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                03. Simulador de Rateio de Quota-Litis (Live Split)
              </h3>
            </div>

            {/* Warn message if contract is not rateio type */}
            {contractType !== 'Contrato de êxito com rateio' && (
              <div className="bg-amber-50 text-amber-800 p-2.5 border border-amber-200 rounded text-[11px] mb-3 leading-snug">
                <strong className="block mb-0.5">💡 Observação do Consultor:</strong>
                O tipo selecionado no momento não é &quot;Contrato de êxito com rateio&quot;, mas você pode simular o split de qualquer maneira para planejar repasses!
              </div>
            )}

            {/* Slider/Input split section */}
            <div className="bg-slate-50 p-3 rounded border border-slate-150 space-y-3.5">
              
              {/* Split control inputs */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Client percent input */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-0.5">
                    Percentual Cliente (%) <HelpCircle className="w-2.5 h-2.5 opacity-55" title="Parte de repasse obrigatória" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={clientPercent}
                    onChange={(e) => handleClientPercentChange(Number(e.target.value))}
                    className="text-xs p-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                {/* Office percent input */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-0.5">
                    Percentual Escritório (%) <HelpCircle className="w-2.5 h-2.5 opacity-55" title="Remuneração real efetiva do Giffoni Advs" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={officePercent}
                    onChange={(e) => handleOfficePercentChange(Number(e.target.value))}
                    className="text-xs p-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

              </div>

              {/* Mini visual slider representation of the percentages split */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                  <span>Cliente ({clientPercent}%)</span>
                  <span>Escritório ({officePercent}%)</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-200 overflow-hidden flex">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${clientPercent}%` }}></div>
                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${officePercent}%` }}></div>
                </div>
              </div>

            </div>

            {/* REGRA FINANCEIRA ESSENCIAL: Demonstrate Cash Split in Connected Flow Boxes */}
            <div className="mt-4 space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0.5">
                Regra Financeira Absoluta (Giffoni BOSS Strategy)
              </div>

              {/* Dynamic Connected Flow chart */}
              <div className="space-y-2">
                
                {/* 1. Entrada bruta box */}
                <div className="p-3 bg-slate-900 text-white rounded border border-slate-800 text-center relative shadow-xs">
                  <p className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest">A. Entrada Bruta Transitória (Conta jurídica)</p>
                  <h4 className="text-base font-mono font-black text-white mt-1">
                    {formatBRL(totalValue)} <span className="text-[10px] text-slate-400 font-sans font-normal lowercase">(ou {formatBRL(installmentValue)}/parcela)</span>
                  </h4>
                  <div className="text-[8px] text-slate-350 mt-1 uppercase tracking-wide font-medium">Este é o saldo recebido total na comarca das comissões</div>
                </div>

                {/* Arrow sign */}
                <div className="flex justify-center -my-1 text-blue-500">
                  <span className="bg-white p-1 rounded-full border shadow-xs text-[10px] font-bold">⬇ RATEIO EXTRAORDINÁRIO</span>
                </div>

                {/* Split columns */}
                <div className="grid grid-cols-2 gap-3.5 relative">
                  
                  {/* Outflow column (Repasse) */}
                  <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded flex flex-col justify-between">
                    <div>
                      <p className="text-[8px] text-blue-500 uppercase font-black tracking-wider mb-1">B. Repasse ao Cliente (Obrigatório)</p>
                      <span className="text-[9px] font-mono font-semibold bg-blue-200 px-1 py-0.2 rounded inline-block text-blue-800">
                        quota-litis de {clientPercent}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-black font-mono text-blue-900">{formatBRL(totalClientAmount)}</p>
                      <p className="text-[9px] text-blue-600 font-mono mt-0.5">{formatBRL(clientInstallmentValue)} /parc</p>
                    </div>
                  </div>

                  {/* Net revenue column (Receita Escritório) */}
                  <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded flex flex-col justify-between relative">
                    <span className="absolute top-1.5 right-1.5 bg-amber-200 text-amber-800 text-[8px] font-black px-1 rounded animate-pulse">RECEITA LIQUIDA</span>
                    <div>
                      <p className="text-[8px] text-amber-600 uppercase font-black tracking-wider mb-1">C. Receita Real (Escritório)</p>
                      <span className="text-[9px] font-mono font-semibold bg-amber-200 px-1 py-0.2 rounded inline-block text-amber-800">
                        taxa líquida de {officePercent}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-black font-mono text-amber-900">{formatBRL(totalOfficeAmount)}</p>
                      <p className="text-[9px] text-amber-750 font-mono mt-0.5">{formatBRL(officeInstallmentValue)} /parc</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Disclaimer reminding that gross is not net */}
              <div className="flex gap-2 p-2 bg-slate-100 border border-slate-200 rounded text-[9.5px] text-slate-500 leading-normal items-start select-none">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Atenção Auditoria:</strong> A entrada faturada do escritório representa apenas a cota correspondente ao <strong>Módulo C (Receita do Escritório)</strong>. O saldo do <strong>Módulo B (Cliente)</strong> é um mero repasse em trâmite e não deve compor a base de tributos fiscais de notas emitidas da empresa.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. Tabela de parcelas simulada (Comprehensive bottom section) */}
      <div className="mt-4 bg-white rounded border border-gray-200 shadow-xs p-4 mx-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-3">
          <div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Cronograma de Conferência Geral</span>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-500" /> 04. Demonstrativo Simulado Calendário de Parcelas
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Valores individuais por quota-litis de cada recebimento planejado em comarca.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 border rounded select-none text-[9px] font-bold text-slate-400 uppercase tracking-wide">
            <span className="w-2 h-2 rounded bg-emerald-500"></span> Exemplo Visual Ativo ({installments.length} Registros)
          </div>
        </div>

        {/* Parcel datatable */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50/50 text-slate-450 font-mono font-black tracking-wide uppercase">
                <th className="py-2 px-2.5">Parcela / Vínculo</th>
                <th className="py-2 px-2.5 text-center">Vencimento</th>
                <th className="py-2 px-2.5 text-right">Valor Bruto</th>
                <th className="py-2 px-2.5 text-right">Cliente Repasse ({clientPercent}%)</th>
                <th className="py-2 px-2.5 text-right">Escritório Receita ({officePercent}%)</th>
                <th className="py-2 px-2.5 text-center">Status</th>
                <th className="py-2 px-2.5 text-center">Voucher/Comprovante</th>
                <th className="py-2 px-2.5 text-center">NIBO ERP?</th>
                <th className="py-2 px-2.5 text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {installments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic bg-slate-25/10">
                    Nenhuma parcela gerada. Clique em &quot;Calcular &amp; Gerar Cronograma&quot; para carregar os registros de exemplo.
                  </td>
                </tr>
              ) : (
                installments.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                    {/* Parcela id */}
                    <td className="py-2.5 px-2.5 font-mono font-bold text-slate-800 text-[10px]">
                      Parcela {String(p.number).padStart(2, '0')}/{String(installmentsCount).padStart(2, '0')}
                      <span className="text-[8px] text-slate-400 block font-normal">{p.id}</span>
                    </td>

                    {/* Vencimento */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-600 text-center font-mono">
                      {p.dueDate}
                    </td>

                    {/* Valor bruto */}
                    <td className="py-2.5 px-2.5 font-mono font-black text-right text-slate-700">
                      {formatBRL(p.grossValue)}
                    </td>

                    {/* Destinado ao cliente */}
                    <td className="py-2.5 px-2.5 font-mono text-right text-blue-700">
                      {formatBRL(p.clientAmount)}
                    </td>

                    {/* Destinado ao escritorio */}
                    <td className="py-2.5 px-2.5 font-mono font-bold text-right text-amber-700">
                      {formatBRL(p.officeAmount)}
                    </td>

                    {/* Custom Status format */}
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      {p.status === 'Paga' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded uppercase font-mono">
                          Paga
                        </span>
                      )}
                      {p.status === 'Rateio realizado' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded uppercase font-mono">
                          Rateio Realizado
                        </span>
                      )}
                      {p.status === 'Rateio pendente' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-orange-50 text-orange-850 border border-orange-200 rounded uppercase font-mono">
                          Rateio Pendente
                        </span>
                      )}
                      {p.status === 'A vencer' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-300 rounded uppercase font-mono">
                          A Vencer
                        </span>
                      )}
                      {p.status === 'Vence hoje' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-350 rounded uppercase font-mono animate-pulse">
                          Vence Hoje
                        </span>
                      )}
                      {p.status === 'Atrasada' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded uppercase font-mono animate-bounce">
                          Atrasada
                        </span>
                      )}
                      {p.status === 'Lançada no NIBO' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded uppercase font-mono">
                          Lançada no Nibo
                        </span>
                      )}
                      {p.status === 'Divergente' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded uppercase font-mono">
                          Divergente (Alerta)
                        </span>
                      )}
                      {p.status === 'Cancelada' && (
                        <span className="text-[8.5px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-400 border border-slate-250 line-through rounded uppercase font-mono">
                          Cancelada
                        </span>
                      )}
                    </td>

                    {/* Voucher com comprovante */}
                    <td className="py-2.5 px-2.5 text-center">
                      {p.voucherName ? (
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-mono" title={p.voucherName}>
                          <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="truncate max-w-[120px]">{p.voucherName}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUploadVoucher(p.id)}
                          className="inline-flex items-center gap-1 text-[8.5px] font-bold px-1.5 py-0.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-500 font-sans uppercase"
                        >
                          <Upload className="w-2.5 h-2.5 text-slate-400" /> Anexar
                        </button>
                      )}
                    </td>

                    {/* Sincronizado no NIBO */}
                    <td className="py-2.5 px-2.5 text-center">
                      {p.isNiboSynced ? (
                        <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1 py-0.1.5 rounded inline-block uppercase">
                          Sincronizado
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-1 py-0.1.5 rounded inline-block uppercase">
                          Local Only
                        </span>
                      )}
                    </td>

                    {/* Row Fast Actions */}
                    <td className="py-2.5 px-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        
                        {/* Mark Paid */}
                        <button
                          onClick={() => handleUpdateStatusParcela(p.id, 'Paga')}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Marcar como Pago"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        {/* Mark Rateio Realized */}
                        <button
                          onClick={() => handleUpdateStatusParcela(p.id, 'Rateio realizado')}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Rateio Concluido"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Mark Nibo Sync */}
                        <button
                          onClick={() => handleUpdateStatusParcela(p.id, 'Lançada no NIBO')}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Sinalizar lançamento no NIBO"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        {/* Mark Overdue */}
                        <button
                          onClick={() => handleUpdateStatusParcela(p.id, 'Atrasada')}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          title="Registrar Atraso"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Cancel */}
                        <button
                          onClick={() => handleUpdateStatusParcela(p.id, 'Cancelada')}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          title="Cancelar Parcela"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Corporate disclaimer for audit and reduce manual work */}
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded text-slate-650 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs font-sans">
          <div className="flex gap-2 items-center">
            <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
            <p>
              <strong>Planejador Giffoni BOSS:</strong> Este demonstrativo reflete uma simulação evolutiva do caixa. Use os botões rápidos na linha correspondente da tabela para testar as conciliações antes de consolidar.
            </p>
          </div>
          
          <button
            onClick={onBackToDashboard}
            className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded shrink-0 duration-150 shadow-xs flex items-center gap-1"
          >
            Voltar ao Dashboard Geral <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

      </div>

    </div>
  );
}
