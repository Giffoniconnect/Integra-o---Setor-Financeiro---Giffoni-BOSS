import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Trash2, 
  FileText, 
  Check, 
  FileSpreadsheet, 
  Copy, 
  ArrowLeftRight, 
  Percent, 
  ArrowLeft, 
  Briefcase, 
  History, 
  Edit3, 
  Sparkles, 
  DollarSign, 
  AlertCircle, 
  Info,
  Building2,
  Calendar,
  Layers,
  Coins,
  Send,
  HelpCircle,
  Clock,
  ArrowUpRight,
  CheckCircle,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  X,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

// Define the structure of a case inherited from Portal BOSS
interface BossCase {
  id: string;
  todoistFormula: string;
  clientName: string;
  opponentName: string;
  subject: string;
  processNumber: string;
  comarca: string;
  vara: string;
  responsibleAttorney: string;
  status: string;
  driveFolder: string;
  registrationDate: string;
}

// Preloaded Portal BOSS Database of Cases (as requested)
const PRELOADED_BOSS_CASES: BossCase[] = [
  {
    id: 'BOSS-601',
    todoistFormula: '5007097-84.2024.8.13.0713 | Mario Sérgio Máximo X Valéria Máximo',
    clientName: 'Mario Sérgio Máximo',
    opponentName: 'Valéria Máximo',
    subject: 'Execução de Alimentos',
    processNumber: '5007097-84.2024.8.13.0713',
    comarca: 'Belo Horizonte/MG',
    vara: '4ª Vara de Família',
    responsibleAttorney: 'Dr. Rafael Giffoni',
    status: 'Fase de Execução Ativa',
    driveFolder: 'Drive/BOSS-Compartilhado/Mario_Sergio_Alimentos_5007097',
    registrationDate: '15/02/2024'
  },
  {
    id: 'BOSS-602',
    todoistFormula: '5000000-00.2026.8.13.0713 | João Silva X Banco BMG',
    clientName: 'João Silva',
    opponentName: 'Banco BMG S.A.',
    subject: 'Revisional de Contrato',
    processNumber: '5000000-00.2026.8.13.0713',
    comarca: 'Contagem/MG',
    vara: '2ª Vara Cível',
    responsibleAttorney: 'Dra. Paula Costa',
    status: 'Saneado - Aguardando Sentença',
    driveFolder: 'Drive/BOSS-Compartilhado/Joao_Silva_BMG_Revisional_5000000',
    registrationDate: '10/01/2026'
  },
  {
    id: 'BOSS-603',
    todoistFormula: '5012345-67.2025.8.13.0713 | Ana Souza X Telefônica Vivo',
    clientName: 'Ana Souza',
    opponentName: 'Telefônica Brasil (Vivo) S.A.',
    subject: 'Indenização de Danos Morais',
    processNumber: '5012345-67.2025.8.13.0713',
    comarca: 'Uberlândia/MG',
    vara: '1ª Vara Cível',
    responsibleAttorney: 'Dr. Rafael Giffoni',
    status: 'Procedente em 1ª Instância',
    driveFolder: 'Drive/BOSS-Compartilhado/Ana_Souza_Vivo_Inden_5012345',
    registrationDate: '22/08/2025'
  },
  {
    id: 'BOSS-604',
    todoistFormula: '5005511-22.2025.8.13.0713 | Cláudio Duarte X INSS',
    clientName: 'Cláudio Duarte',
    opponentName: 'INSS - Instituto Nacional do Seguro Social',
    subject: 'Revisão da Vida Toda / Aposentadoria',
    processNumber: '5005511-22.2025.8.13.0713',
    comarca: 'Juiz de Fora/MG',
    vara: 'Federal Cível',
    responsibleAttorney: 'Dra. Luiza Castro',
    status: 'Perícia Realizada',
    driveFolder: 'Drive/BOSS-Compartilhado/Claudio_Duarte_INSS_Revisao_5005511',
    registrationDate: '05/11/2025'
  },
  {
    id: 'BOSS-605',
    todoistFormula: '5009988-11.2024.8.13.0713 | Juliana Mendes X Cemig S.A.',
    clientName: 'Juliana Mendes',
    opponentName: 'Cemig Distribuição S.A.',
    subject: 'Inexigibilidade de Débito - Energia',
    processNumber: '5009988-11.2024.8.13.0713',
    comarca: 'Montes Claros/MG',
    vara: 'Juizado Especial Cível',
    responsibleAttorney: 'Dra. Paula Costa',
    status: 'Sentença Homologatória',
    driveFolder: 'Drive/BOSS-Compartilhado/Juliana_Mendes_Cemig_8811',
    registrationDate: '19/12/2024'
  }
];

// Available Contract Types
const CONTRACT_TYPES = [
  { id: 'Honorários Fixos', label: 'Honorários Fixos', description: 'Remuneração fixa parcelada ou à vista por assessoria.', usesRateio: false },
  { id: 'Contrato de Êxito', label: 'Contrato de Êxito', description: 'Remuneração vinculada puramente ao êxito da causa.', usesRateio: false },
  { id: 'Contrato de Êxito com Rateio', label: 'Contrato de Êxito com Rateio', description: 'Faturamento bruto cindido entre cliente e escritório.', usesRateio: true },
  { id: 'Acordo Judicial', label: 'Acordo Judicial', description: 'Homologação em juízo com divisão de parcelas.', usesRateio: true },
  { id: 'Acordo Extrajudicial', label: 'Acordo Extrajudicial', description: 'Transação firmada diretamente entre as partes interessadas.', usesRateio: true },
  { id: 'Parcelamento Ex-Adverso', label: 'Parcelamento Ex-Adverso', description: 'Valores devidos pela parte adversa liquidados em parcelas.', usesRateio: true },
  { id: 'Honorários Sucumbenciais', label: 'Honorários Sucumbenciais', description: 'Arbitrados na sentença de mérito em favor do patrono.', usesRateio: false },
  { id: 'Recebimento Avulso', label: 'Recebimento Avulso', description: 'Liquidações eventuais, custas adicionais ou reembolsos.', usesRateio: false }
];

interface ContractInstallment {
  number: string;
  dueDate: string;
  grossValue: number;
  clientAmount: number;
  officeAmount: number;
  status: string;
}

interface ContractRegistrationProps {
  onBackToDashboard: () => void;
  onLogAction?: (action: string, status?: 'info' | 'success' | 'warning' | 'error') => void;
  onAddContract?: (contract: any) => void;
  onAddAgreement?: (agreement: any) => void;
}

export default function ContractRegistration({ onBackToDashboard, onLogAction, onAddContract, onAddAgreement }: ContractRegistrationProps) {
  // Stepper state
  // 1: Selecionar Caso, 2: Tipo de Contrato, 3: Dados Financeiros, 4: Cronograma, 5: Resumo & Ações
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<BossCase | null>(null);

  // Manual Custom Case registration states for clean system tests
  const [isCreatingManualCase, setIsCreatingManualCase] = useState<boolean>(false);
  const [manualCaseClient, setManualCaseClient] = useState<string>('');
  const [manualCaseOpponent, setManualCaseOpponent] = useState<string>('');
  const [manualCaseSubject, setManualCaseSubject] = useState<string>('');
  const [manualCaseProcessNumber, setManualCaseProcessNumber] = useState<string>('');
  const [manualCaseComarca, setManualCaseComarca] = useState<string>('');
  const [manualCaseVara, setManualCaseVara] = useState<string>('');
  const [manualCaseAttorney, setManualCaseAttorney] = useState<string>('Dr. Rafael Giffoni');

  // Financial inputs
  const [contractType, setContractType] = useState<string>('Contrato de Êxito com Rateio');
  const [totalValue, setTotalValue] = useState<number>(5000);
  const [installmentsCount, setInstallmentsCount] = useState<number>(10);
  const [firstInstallmentDate, setFirstInstallmentDate] = useState<string>('10/06/2026'); // DD/MM/AAAA Default format
  const [fixedDueDay, setFixedDueDay] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState<string>('Boleto');

  // Rateio Split rates (applicable to Rateio contracts)
  const [clientPercent, setClientPercent] = useState<number>(70);
  const [officePercent, setOfficePercent] = useState<number>(30);

  // Generated installments State
  const [installments, setInstallments] = useState<ContractInstallment[]>([]);
  const [isCronogramaGenerated, setIsCronogramaGenerated] = useState<boolean>(false);

  // Notification feedbacks
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Saved contract state representing persistent save simulation
  const [isContractSaved, setIsContractSaved] = useState<boolean>(false);

  // Show live PDF mock
  const [showPdfMock, setShowPdfMock] = useState<boolean>(false);

  // Derived Values auto calculation
  const isRateioApplicable = CONTRACT_TYPES.find(t => t.id === contractType)?.usesRateio ?? false;

  // Rateio amounts
  const totalClientAmount = isRateioApplicable ? Number((totalValue * (clientPercent / 100)).toFixed(2)) : 0;
  const totalOfficeAmount = isRateioApplicable ? Number((totalValue * (officePercent / 100)).toFixed(2)) : totalValue;

  const installmentGross = installmentsCount > 0 ? Number((totalValue / installmentsCount).toFixed(2)) : 0;
  const installmentClient = isRateioApplicable && installmentsCount > 0 ? Number((totalClientAmount / installmentsCount).toFixed(2)) : 0;
  const installmentOffice = installmentsCount > 0 ? Number((totalOfficeAmount / installmentsCount).toFixed(2)) : 0;

  // Sync percentages
  const handleClientPercentChange = (val: number) => {
    const p = Math.max(0, Math.min(100, val));
    setClientPercent(p);
    setOfficePercent(100 - p);
  };

  const handleOfficePercentChange = (val: number) => {
    const p = Math.max(0, Math.min(100, val));
    setOfficePercent(p);
    setClientPercent(100 - p);
  };

  // Helper: auto format text inputs as DD/MM/AAAA
  const formatAsDateMask = (val: string) => {
    const clean = val.replace(/\D/g, '');
    let formatted = '';
    if (clean.length > 0) {
      formatted += clean.substring(0, 2);
      if (clean.length > 2) {
        formatted += '/' + clean.substring(2, 4);
        if (clean.length > 4) {
          formatted += '/' + clean.substring(4, 8);
        }
      }
    }
    return formatted.substring(0, 10);
  };

  const triggerNotification = (text: string, type: 'success' | 'info' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Pre-load default Mario Máximo case on mount to demonstrate immediate readiness to the BOSS user
  useEffect(() => {
    setSelectedCase(PRELOADED_BOSS_CASES[0]);
  }, []);

  // Filter cases dynamically by multiple keys
  const filteredCases = PRELOADED_BOSS_CASES.filter(c => {
    const query = searchQuery.toLowerCase();
    return (
      c.todoistFormula.toLowerCase().includes(query) ||
      c.clientName.toLowerCase().includes(query) ||
      c.opponentName.toLowerCase().includes(query) ||
      c.processNumber.toLowerCase().includes(query) ||
      c.subject.toLowerCase().includes(query)
    );
  });

  // Calculate chronological list of installments based on inputs
  const handleGenerateCronograma = () => {
    if (!selectedCase) {
      triggerNotification('Selecione um caso do Portal BOSS antes de gerar o cronograma!', 'error');
      return;
    }

    // Parse date DD/MM/AAAA
    const parts = firstInstallmentDate.split('/');
    let startDay = fixedDueDay;
    let startMonth = 5; // default June
    let startYear = 2026;

    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1; // 0-indexed
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        startDay = d;
        startMonth = m;
        startYear = y;
      }
    }

    const arr: ContractInstallment[] = [];
    for (let i = 1; i <= installmentsCount; i++) {
      const curDate = new Date(startYear, startMonth + (i - 1), startDay);
      // Ensure specific fixedDueDay is maintained unless month overflow
      if (curDate.getDate() !== fixedDueDay) {
        // Handle variations (e.g. 31st vs 30th)
        curDate.setDate(0); // set to last day of previous month
      }

      const formattedDay = String(curDate.getDate()).padStart(2, '0');
      const formattedMonth = String(curDate.getMonth() + 1).padStart(2, '0');
      const formattedYear = curDate.getFullYear();
      const stringDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

      arr.push({
        number: String(i).padStart(3, '0'),
        dueDate: stringDate,
        grossValue: installmentGross,
        clientAmount: installmentClient,
        officeAmount: installmentOffice,
        status: i === 1 ? 'Vence hoje' : 'A vencer'
      });
    }

    setInstallments(arr);
    setIsCronogramaGenerated(true);
    triggerNotification(`Cronograma gerado com sucesso em ${installmentsCount} parcelas!`, 'success');
    if (onLogAction) {
      onLogAction(`Giffoni BOSS: Cronograma de faturamento gerado para "${selectedCase.clientName}" - valor por parcela: ${formatBRL(installmentGross)}.`, 'success');
    }
    // Advance to next step automatically to enhance productivity
    setCurrentStep(4);
  };

  // Perform contract preservation (Simulation)
  const handleSaveContract = () => {
    if (!selectedCase) {
      triggerNotification('Falta selecionar o caso para salvar!', 'error');
      return;
    }
    if (!isCronogramaGenerated) {
      triggerNotification('Gere o cronograma de faturamento antes de salvar!', 'error');
      return;
    }

    setIsContractSaved(true);
    triggerNotification('Contrato Financeiro registrado com êxito sob conformidade BOSS!', 'success');
    if (onLogAction) {
      onLogAction(`CONTRATO SALVO: Advogado ${selectedCase.responsibleAttorney} vinculou contrato de ${contractType} no valor de ${formatBRL(totalValue)}.`, 'success');
    }

    // Call state update listeners if provided
    if (onAddContract && contractType.includes('Êxito')) {
      onAddContract({
        id: `SC-${Math.floor(100 + Math.random() * 899)}`,
        client: selectedCase.clientName,
        subject: selectedCase.subject,
        processNumber: selectedCase.processNumber,
        expectedFee: totalOfficeAmount,
        probablePaymentDate: firstInstallmentDate,
        status: 'active'
      });
    } else if (onAddAgreement && (contractType.includes('Acordo') || contractType.includes('Parcelamento'))) {
      onAddAgreement({
        id: `AG-${Math.floor(100 + Math.random() * 899)}`,
        debtor: selectedCase.opponentName,
        processNumber: selectedCase.processNumber,
        totalValue: totalValue,
        clientShare: totalClientAmount,
        officeShare: totalOfficeAmount,
        installmentsPaid: 0,
        totalInstallments: installmentsCount,
        nextInstallmentDate: firstInstallmentDate,
        status: 'active'
      });
    }

    // Transition back to step 5 to see Summary & Action tools
    setCurrentStep(5);
  };

  // Send to NIBO simulator
  const handleSendToNibo = () => {
    triggerNotification('Lote de faturamento transmitido com sucesso à Fila de Conciliação NIBO!', 'success');
    if (onLogAction) {
      onLogAction(`Integração NIBO: Foram adicionamentos ${installments.length} lançamentos futuros de ${selectedCase?.clientName || 'Cliente'} na Fila Nibo.`, 'info');
    }
  };

  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  // Generate real CSV Planilha
  const handleExportPlanilha = () => {
    if (installments.length === 0) {
      triggerNotification('Gere o cronograma antes de exportar!', 'error');
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Parcela;Vencimento;Valor Bruto (BRL);Repasse Cliente (BRL);Escritório (BRL);Status\n';
    
    installments.forEach(item => {
      csvContent += `${item.number};${item.dueDate};${item.grossValue};${item.clientAmount};${item.officeAmount};${item.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const safeName = (selectedCase?.clientName || 'Contrato').replace(/\s+/g, '_');
    link.setAttribute('download', `Cronograma_BOSS_${safeName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('Planilha de amortização CSV baixada com sucesso!', 'success');
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 p-3 flex flex-col font-sans relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-3 bg-white p-3 rounded shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-[10px] font-black px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition duration-150 border border-slate-200 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Painel
          </button>
          
          <div className="h-6 w-[1.5px] bg-slate-350 hidden sm:block"></div>
          
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black tracking-normal uppercase">Giffoni BOSS</span>
              <span className="text-[9px] text-slate-500 font-mono font-bold tracking-widest uppercase">Mapeador Financeiro Sob 30 Segundos</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
              Cadastro de Contrato Financeiro Extraordinário
            </h1>
          </div>
        </div>

        {/* Top Fast KPI indicators */}
        {selectedCase && (
          <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-2 border border-slate-200 rounded text-right">
            <div className="text-xs">
              <span className="text-[8px] font-black uppercase text-slate-400 block">Vínculo Ativo</span>
              <span className="font-bold text-slate-800">{selectedCase.clientName}</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-200"></div>
            <div className="text-xs">
              <span className="text-[8px] font-black uppercase text-slate-400 block">Valores Pactuados</span>
              <span className="font-mono font-bold text-amber-600 block">{formatBRL(totalValue)}</span>
            </div>
          </div>
        )}
      </div>

      {/* FLOAT ALERTS */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-3.5 rounded-lg shadow-xl font-mono text-[11px] font-bold max-w-sm flex items-center gap-2 border ${
              notification.type === 'success' 
                ? 'bg-emerald-900 text-emerald-100 border-emerald-800' 
                : notification.type === 'error'
                ? 'bg-rose-900 text-rose-100 border-rose-800'
                : 'bg-slate-900 text-blue-100 border-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-current animate-ping"></span>
            <div className="flex-1">{notification.text}</div>
            <button onClick={() => setNotification(null)} className="text-white font-serif hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP PROGRESS TRACKER */}
      <div className="bg-slate-900 text-white rounded-lg p-3.5 mb-4 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest font-black">Meta de Execução</p>
              <h4 className="text-xs font-bold text-white uppercase tracking-normal">Opera em menos de 30 segundos usando Herança BOSS</h4>
            </div>
          </div>

          {/* Stepper links */}
          <div className="flex items-center flex-wrap gap-1 md:gap-2">
            {[
              { nr: 1, label: 'Caso Portal' },
              { nr: 2, label: 'Tipo Contrato' },
              { nr: 3, label: 'Parâmetros' },
              { nr: 4, label: 'Cronograma' },
              { nr: 5, label: 'Ações Finais' }
            ].map(step => (
              <React.Fragment key={step.nr}>
                <button
                  type="button"
                  onClick={() => {
                    if (step.nr > 1 && !selectedCase) {
                      triggerNotification('Por favor, primeiro selecione o caso operacional na Etapa 1.', 'error');
                      return;
                    }
                    setCurrentStep(step.nr);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all border ${
                    currentStep === step.nr
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-md transform scale-102'
                      : step.nr < currentStep
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-transparent text-slate-500 border-transparent hover:border-slate-850 hover:text-slate-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold ${
                    currentStep === step.nr ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.nr}
                  </span>
                  <span>{step.label}</span>
                </button>
                {step.nr < 5 && <ChevronRight className="w-3.5 h-3.5 text-slate-700 hidden sm:block" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1 mb-8">
        
        {/* LEFT WORKSPACE: STEP CARD WRAPPERS */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs min-h-[500px] flex flex-col justify-between">
          <div>
            
            {/* STEP 1: SELECT CASE (ETAPA 1 & ETAPA 1.1) */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold font-mono text-amber-600 block uppercase">ETAPA 1</span>
                    <h2 className="text-base font-black text-slate-900 uppercase">Qual caso deseja vincular ao contrato financeiro?</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Sincronize com o Portal BOSS digitando a Fórmula Todoist, nome do cliente, número do processo ou parte adversa. Ao clicar no caso, todos os dados cadastrais serão importados dinamicamente para mitigar redigitação!
                    </p>
                  </div>

                  {/* Smart Tab Selector */}
                  <div className="flex border-b border-slate-200 mb-3 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setIsCreatingManualCase(false)}
                      className={`flex-1 py-2 text-center border-b-2 uppercase tracking-wide transition-all ${
                        !isCreatingManualCase
                          ? 'border-amber-500 text-slate-900 font-extrabold'
                          : 'border-transparent text-slate-450 hover:text-slate-650'
                      }`}
                    >
                      Procurar no Portal BOSS ({filteredCases.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingManualCase(true)}
                      className={`flex-1 py-2 text-center border-b-2 uppercase tracking-wide transition-all ${
                        isCreatingManualCase
                          ? 'border-amber-500 text-slate-900 font-extrabold'
                          : 'border-transparent text-slate-450 hover:text-slate-650'
                      }`}
                    >
                      Cadastrar Caso de Teste do Zero +
                    </button>
                  </div>

                  {isCreatingManualCase ? (
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-3.5">
                      <div className="border-b border-slate-200 pb-2 mb-1 flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-850 uppercase flex items-center gap-1">
                          <Plus className="w-4 h-4 text-amber-500" /> Cadastrar Novo Caso Operacional para Testes
                        </h3>
                        <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold border border-amber-200 uppercase">Ambiente Limpo</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Nome Completo do Cliente <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            placeholder="Ex: Roberto Ramos Rodrigues"
                            value={manualCaseClient}
                            onChange={(e) => setManualCaseClient(e.target.value)}
                            className="bg-white border border-slate-250 rounded p-2 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Parte Adversa / Oponente <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            placeholder="Ex: Seguradora Itaú S.A."
                            value={manualCaseOpponent}
                            onChange={(e) => setManualCaseOpponent(e.target.value)}
                            className="bg-white border border-slate-250 rounded p-2 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Número Único do Processo (CNJ)</label>
                          <input
                            type="text"
                            placeholder="Ex: 5043921-65.2026.8.13.0024"
                            value={manualCaseProcessNumber}
                            onChange={(e) => setManualCaseProcessNumber(e.target.value)}
                            className="bg-white border border-slate-250 rounded p-2 text-xs font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Assunto / Categoria da Demanda</label>
                          <input
                            type="text"
                            placeholder="Ex: Revisão Contratual, Alimentos, Dano de Consumo"
                            value={manualCaseSubject}
                            onChange={(e) => setManualCaseSubject(e.target.value)}
                            className="bg-white border border-slate-250 rounded p-2 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Comarca de Origem</label>
                          <input
                            type="text"
                            placeholder="Ex: Uberlândia/MG"
                            value={manualCaseComarca}
                            onChange={(e) => setManualCaseComarca(e.target.value)}
                            className="bg-white border border-slate-250 rounded p-2 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Vara de Competência</label>
                          <input
                            type="text"
                            placeholder="Ex: 3ª Vara de Família e Sucessões"
                            value={manualCaseVara}
                            onChange={(e) => setManualCaseVara(e.target.value)}
                            className="bg-white border border-slate-250 rounded p-2 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!manualCaseClient || !manualCaseOpponent) {
                              triggerNotification('Cliente e Parte Adversa são obrigatórios para testes!', 'error');
                              return;
                            }
                            const customCase: BossCase = {
                              id: `MANUAL-${Math.floor(100 + Math.random() * 899)}`,
                              todoistFormula: `${manualCaseProcessNumber || '5007097-84.2024.8.13.0713'} | ${manualCaseClient} X ${manualCaseOpponent}`,
                              clientName: manualCaseClient,
                              opponentName: manualCaseOpponent,
                              subject: manualCaseSubject || 'Cobrança Extraordinária',
                              processNumber: manualCaseProcessNumber || 'Processo não judicializado',
                              comarca: manualCaseComarca || 'Belo Horizonte/MG',
                              vara: manualCaseVara || 'Câmara de Reconhecimento',
                              responsibleAttorney: manualCaseAttorney,
                              status: 'Fase de Atendimento Ativo',
                              driveFolder: `Drive/BOSS-Compartilhado/${manualCaseClient.replace(/\s+/g, '_')}_Fichamento`,
                              registrationDate: new Date().toLocaleDateString('pt-BR')
                            };
                            setSelectedCase(customCase);
                            setIsCreatingManualCase(false);
                            triggerNotification(`Caso de Teste de "${manualCaseClient}" criado e selecionado com sucesso!`, 'success');
                          }}
                          className="px-4 py-2 bg-slate-900 border border-slate-950 text-white font-mono text-[11px] font-black uppercase rounded shadow hover:bg-slate-800 transition-colors"
                        >
                          Confirmar e Vincular Caso de Teste
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Smart Search Field */}
                      <div className="relative">
                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Pesquise por Fórmula Todoist, Cliente, Processo, ou Parte Adversa... Exemplo: 'Valéria Máximo' ou 'BMG'"
                          className="w-full text-xs p-3.5 pl-9 bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white font-medium shadow-xs transition-colors"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-650"
                          >
                            Limpar
                          </button>
                        )}
                      </div>

                      {/* Interactive Quick select table list */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1">
                          Resultados Encontrados no Portal BOSS ({filteredCases.length})
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                          {filteredCases.map(item => {
                            const isChosen = selectedCase?.id === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCase(item);
                                  triggerNotification(`Caso "${item.clientName}" herança selecionado!`, 'info');
                                }}
                                className={`p-3 text-left rounded-lg border transition-all flex flex-col justify-between text-xs gap-1.5 ${
                                  isChosen 
                                    ? 'bg-amber-50/60 border-amber-400 text-amber-950 shadow-xs' 
                                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-1 w-full">
                                  <span className="text-[9px] font-mono bg-slate-200 text-slate-650 px-1 py-0.2 rounded group-hover:bg-amber-100">
                                    {item.id}
                                  </span>
                                  {isChosen && (
                                    <span className="bg-amber-500 text-slate-950 rounded-full p-0.5">
                                      <Check className="w-3 h-3 font-bold" />
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-[11px] leading-tight flex items-center gap-1">
                                    {item.clientName} <span className="text-slate-400 font-normal">X</span> {item.opponentName}
                                  </h4>
                                  <p className="text-[9.5px] text-slate-500 mt-1 truncate"><strong>Fórmula:</strong> {item.todoistFormula}</p>
                                  <p className="text-[9.5px] text-slate-500 truncate"><strong>Processo:</strong> {item.processNumber}</p>
                                  <p className="text-[9.5px] text-slate-400 font-mono mt-1">Clique para vincular</p>
                                </div>
                              </button>
                            );
                          })}
                          {filteredCases.length === 0 && (
                            <div className="col-span-2 py-8 text-center text-slate-400 italic bg-slate-50 rounded border border-dashed border-slate-200">
                              Nenhum caso encontrado para o termo "{searchQuery}". Tente buscar por outro nome ou termo.
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* ETAPA 1.1: AUTOMATIC DIGITAL CARD DEMONSTRATIVE OF CASE */}
                  {selectedCase && (
                    <div className="mt-4 bg-slate-900 text-slate-100 rounded-lg p-4 border border-slate-850 shadow-md">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="uppercase tracking-widest font-mono text-[9px]">ETAPA 1.1 — DEMONSTRATIVO AUTOMÁTICO DO CASO (BOSS HERITAGE)</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded font-black border border-emerald-800">
                          CONEXÃO OK
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[10px] sm:text-[11px]">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Cliente Vinculado</span>
                          <span className="font-bold text-white block truncate">{selectedCase.clientName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Parte Adversa</span>
                          <span className="font-bold text-white block truncate">{selectedCase.opponentName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Assunto da Pasta</span>
                          <span className="font-bold text-white block truncate">{selectedCase.subject}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Número do Processo</span>
                          <span className="font-bold font-mono text-white block truncate">{selectedCase.processNumber}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Comarca Origem</span>
                          <span className="font-bold text-white block truncate">{selectedCase.comarca}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Vara Distribuída</span>
                          <span className="font-bold text-white block truncate">{selectedCase.vara}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Advogado Responsável</span>
                          <span className="font-bold text-white block truncate">{selectedCase.responsibleAttorney}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Status do caso</span>
                          <span className="font-bold text-amber-400 block truncate">{selectedCase.status}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Pasta Google Drive</span>
                          <span className="font-mono text-slate-300 block truncate flex items-center gap-1">
                            {selectedCase.driveFolder} <ExternalLink className="w-2.5 h-2.5 inline text-blue-400 cursor-pointer" />
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <span>Data Cadastro: {selectedCase.registrationDate}</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" /> O usuário não precisa redigitar estas informações.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Navigation Footer Step 1 */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={!selectedCase}
                      onClick={() => setCurrentStep(2)}
                      className={`flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-lg transition-colors shadow-xs uppercase tracking-wider ${
                        selectedCase 
                          ? 'bg-slate-900 border border-slate-950 text-white hover:bg-slate-800' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-transparent'
                      }`}
                    >
                      Avançar para Tipo de Contrato <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CONTRACT TYPE (ETAPA 2) */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold font-mono text-amber-600 block uppercase">ETAPA 2</span>
                    <h2 className="text-base font-black text-slate-900 uppercase">Qual o Tipo de Contrato Financeiro?</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Selecione um dos moldes de contrato. Seu clique determina automaticamente as fórmulas tributárias adicionais e as regras de rateio incidentes no faturamento.
                    </p>
                  </div>

                  {/* Big Buttons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CONTRACT_TYPES.map(type => {
                      const isActive = contractType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setContractType(type.id);
                            triggerNotification(`Tipo de contrato mudado para "${type.label}"`, 'info');
                            
                            // Auto-advance config for 30s productivity:
                            // We can let them read momentarily or click next
                          }}
                          className={`p-4 text-left rounded-lg border-2 transition-all flex flex-col justify-between h-[100px] ${
                            isActive 
                              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm relative' 
                              : 'bg-slate-50 hover:bg-white hover:border-slate-350 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-black tracking-tight uppercase block leading-tight">{type.label}</span>
                            {isActive && (
                              <span className="bg-slate-950 text-amber-400 p-0.5 rounded-full">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] leading-snug font-medium mt-1 ${isActive ? 'text-slate-850 font-semibold' : 'text-slate-500'}`}>
                            {type.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation footer Step 2 */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider"
                    >
                      <ChevronLeft className="w-4 h-4" /> Voltar ao Caso
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-1.5 text-xs font-black px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs uppercase tracking-wider"
                    >
                      Definir Parâmetros <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: FINANCIAL PARAMETERS & RATEIO (ETAPA 3 & ETAPA 4) */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold font-mono text-amber-600 block uppercase">ETAPA 3 — DADOS FINANCEIROS & PARÂMETROS</span>
                    <h2 className="text-base font-black text-slate-900 uppercase">Configuração de Valores e Amortizações</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Especifique o valor contratado de forma direta. O sistema cuida da divisão harmônica de centavos e do dia exato de compensação contábil para o NIBO ERP.
                    </p>
                  </div>

                  {/* Form inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Valor Total */}
                    <div className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-0.5">
                        Valor Total do Contrato (R$) <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2.5 text-xs font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={totalValue}
                          onChange={(e) => setTotalValue(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full text-xs p-2.5 pl-8 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                          placeholder="Exemplo: 5000"
                        />
                      </div>
                    </div>

                    {/* Quantidade de parcelas */}
                    <div className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <label className="text-[10px] font-black text-slate-500 uppercase">
                        Quantidade de Parcelas <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="240"
                        value={installmentsCount}
                        onChange={(e) => setInstallmentsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Data da primeira parcela (DD/MM/AAAA) */}
                    <div className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <label className="text-[10px] font-black text-slate-500 uppercase flex items-center justify-between w-full">
                        <span>Data da Primeira Parcela <span className="text-rose-500 font-bold">*</span></span>
                        <span className="text-[8px] text-slate-400 font-mono">OBRIGATÓRIO: DD/MM/AAAA</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="DD/MM/AAAA"
                        value={firstInstallmentDate}
                        onChange={(e) => setFirstInstallmentDate(formatAsDateMask(e.target.value))}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Dia Fixo de Vencimento */}
                    <div className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Dia Fixo de Vencimento</label>
                      <div className="flex gap-1.5 items-center">
                        <div className="grid grid-cols-4 gap-1 flex-1">
                          {[10, 15, 20, 30].map(day => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                setFixedDueDay(day);
                                // Update first installment day to match
                                const parts = firstInstallmentDate.split('/');
                                if (parts.length === 3) {
                                  parts[0] = String(day).padStart(2, '0');
                                  setFirstInstallmentDate(parts.join('/'));
                                }
                              }}
                              className={`py-2 text-[10px] font-bold font-mono rounded border transition-colors ${
                                fixedDueDay === day 
                                  ? 'bg-amber-500 text-slate-950 border-amber-600' 
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              Dia {day}
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={fixedDueDay}
                          onChange={(e) => setFixedDueDay(Math.max(1, Math.min(31, parseInt(e.target.value, 10) || 1)))}
                          className="w-14 text-xs p-2 bg-white border border-slate-200 rounded font-mono font-bold focus:outline-none focus:border-amber-500 text-center"
                        />
                      </div>
                    </div>

                    {/* Forma de Pagamento */}
                    <div className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 sm:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Forma de Pagamento</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
                        {['PIX', 'Boleto', 'Transferência', 'Cartão', 'Dinheiro', 'Outro'].map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 px-1 text-[10px] font-bold rounded border transition-colors ${
                              paymentMethod === method 
                                ? 'bg-amber-500 text-slate-950 border-amber-600 font-black' 
                                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ETAPA 4: RATEIO (APENAS QUANDO EXISTIR) */}
                  {isRateioApplicable && (
                    <div className="mt-4 bg-amber-50/50 p-4 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-1.5 border-b border-amber-200/50 pb-2 mb-3">
                        <Percent className="w-4 h-4 text-amber-600 shrink-0" />
                        <h4 className="text-xs font-black text-amber-900 uppercase">ETAPA 4 — RATEIO DE QUOTA-LITIS (DADOS AUTOMÁTICOS)</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase block">Percentual Repassado ao Cliente</label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={clientPercent}
                                onChange={(e) => handleClientPercentChange(parseInt(e.target.value, 10))}
                                className="flex-1 accent-amber-500"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={clientPercent}
                                onChange={(e) => handleClientPercentChange(parseInt(e.target.value, 10) || 0)}
                                className="w-16 p-1.5 border border-amber-200 rounded font-mono text-xs font-bold text-center bg-white"
                              />
                              <span className="text-xs font-bold text-slate-600">%</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase block">Percentual Líquido do Escritório</label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={officePercent}
                                onChange={(e) => handleOfficePercentChange(parseInt(e.target.value, 10))}
                                className="flex-1 accent-amber-500"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={officePercent}
                                onChange={(e) => handleOfficePercentChange(parseInt(e.target.value, 10) || 0)}
                                className="w-16 p-1.5 border border-amber-200 rounded font-mono text-xs font-bold text-center bg-white"
                              />
                              <span className="text-xs font-bold text-slate-600">%</span>
                            </div>
                          </div>
                        </div>

                        {/* Calculations automatically */}
                        <div className="bg-white/80 p-3 rounded-lg border border-amber-200/40 text-xs text-slate-700 font-mono space-y-2">
                          <p className="font-sans text-[10px] font-black text-amber-800 uppercase tracking-wider pb-1">Cálculo de Split de Caixa Ativo</p>
                          <div className="flex justify-between border-b pb-1.5">
                            <span className="text-slate-500">Valor Total Cliente:</span>
                            <span className="text-slate-800 font-bold">{formatBRL(totalClientAmount)}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1.5">
                            <span className="text-slate-500">Valor Total Escritório:</span>
                            <span className="text-slate-800 font-bold text-amber-700">{formatBRL(totalOfficeAmount)}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1.5">
                            <span className="text-slate-500">Valor Parcela Cliente:</span>
                            <span className="text-slate-800 font-bold">{formatBRL(installmentClient)}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-slate-500">Valor Parcela Escritório:</span>
                            <span className="text-slate-800 font-bold text-amber-700">{formatBRL(installmentOffice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation footer Step 3 */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider"
                    >
                      <ChevronLeft className="w-4 h-4" /> Voltar ao Tipo
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateCronograma}
                      className="flex items-center gap-1.5 text-xs font-black px-5 py-2.5 bg-amber-500 text-slate-950 font-black rounded-lg hover:bg-amber-600 border border-amber-600 transition-colors shadow-xs uppercase tracking-wider animate-pulse hover:animate-none"
                    >
                      Gerar Cronograma <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: AUTOMATIC CRONOGRAMA TABLE (ETAPA 5) */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold font-mono text-amber-600 block uppercase">ETAPA 5 — CRONOGRAMA AUTOMÁTICO</span>
                    <h2 className="text-base font-black text-slate-900 uppercase">Demonstrativo Simulador de Parcelamento Judicial</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Todas as datas e rateios de centavos foram distribuídos ao longo das parcelas com base nas regras extraordinárias do Giffoni Advs.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="max-h-[260px] overflow-y-auto pr-1">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-250 bg-slate-200/50 text-slate-500 font-mono text-[9px] font-bold uppercase tracking-wider">
                            <th className="p-2">Parcela</th>
                            <th className="p-2">Vencimento</th>
                            <th className="p-2 text-right">Valor Bruto</th>
                            {isRateioApplicable && (
                              <>
                                <th className="p-2 text-right">Repasse Cliente</th>
                                <th className="p-2 text-right">Escritório</th>
                              </>
                            )}
                            <th className="p-2 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {installments.map((inst, index) => (
                            <tr key={index} className="border-b border-slate-150 last:border-0 hover:bg-white transition-colors">
                              <td className="p-2 font-mono font-bold text-slate-800">{inst.number}</td>
                              <td className="p-2 font-mono text-slate-600">{inst.dueDate}</td>
                              <td className="p-2 font-mono text-right font-black text-slate-700">{formatBRL(inst.grossValue)}</td>
                              {isRateioApplicable && (
                                <>
                                  <td className="p-2 font-mono text-right text-blue-800">{formatBRL(inst.clientAmount)}</td>
                                  <td className="p-2 font-mono text-right font-bold text-amber-700">{formatBRL(inst.officeAmount)}</td>
                                </>
                              )}
                              <td className="p-2 text-center text-[9px] font-bold">
                                <span className={`px-1.5 py-0.5 rounded uppercase font-mono ${
                                  inst.status === 'Vence hoje' 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                    : 'bg-slate-200 text-slate-650'
                                }`}>
                                  {inst.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Navigation footer Step 4 */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider"
                    >
                      <ChevronLeft className="w-4 h-4" /> Voltar a Parâmetros
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSaveContract}
                      className="flex items-center gap-1.5 text-xs font-black px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-xs uppercase tracking-wider"
                    >
                      <FileCheck className="w-4 h-4" /> Salvar Contrato Financeiro
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: FINAL RESOLUTIONS & ACTIONS (ETAPA 6 & ETAPA 7) */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold font-mono text-amber-600 block uppercase">ETAPA 6 — RESUMO EXECUTIVO</span>
                    <h2 className="text-base font-black text-slate-900 uppercase">Processo Operacional Concluído</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Revise o sumário consolidado e execute as conexões com NIBO ERP ou exportações para a controladoria.
                    </p>
                  </div>

                  {/* ETAPA 6 — RESUMO EXECUTIVO */}
                  {selectedCase && (
                    <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-950 shadow-md">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3.5">
                        <FileCheck2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <h4 className="text-xs font-black uppercase text-white tracking-widest">RESUMO EXECUTIVO DO CONTRATO</h4>
                          <span className="text-[8px] font-mono text-slate-400">Pactuado e Auditado sob Portal Giffoni BOSS</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Caso Vinculado:</span>
                          <span className="font-bold text-white max-w-[200px] truncate">{selectedCase.todoistFormula.slice(0, 30)}...</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Cliente:</span>
                          <span className="font-bold text-white truncate">{selectedCase.clientName}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Tipo de Contrato:</span>
                          <span className="font-bold text-amber-400 truncate">{contractType}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Valor Pactuado Total:</span>
                          <span className="font-bold text-white text-sm">{formatBRL(totalValue)}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Quant. Parcelas:</span>
                          <span className="font-bold text-white">{installmentsCount} parcelas</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Receita do Escritório:</span>
                          <span className="font-bold text-emerald-400 font-mono text-sm">{formatBRL(totalOfficeAmount)}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Repasse ao Cliente:</span>
                          <span className="font-bold text-slate-300 font-mono">{formatBRL(totalClientAmount)}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Previsão Mensal Faturada:</span>
                          <span className="font-bold text-amber-500 font-mono">{formatBRL(installmentOffice)} <span className="text-[8px] text-slate-400 font-normal">/parc</span></span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-sans">Primeiro Vencimento:</span>
                          <span className="font-bold text-white">{installments[0]?.dueDate || firstInstallmentDate}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-slate-400 font-sans">Último Vencimento:</span>
                          <span className="font-bold text-white">{installments[installments.length - 1]?.dueDate || 'Não gerado'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ETAPA 7 — AÇÕES (POWER ACTIONS CONTROLLER) */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
                      ETAPA 7 — AÇÕES CRÍTICAS DE CONTROLADORIA
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {/* Enviar para Nibo */}
                      <button
                        type="button"
                        onClick={handleSendToNibo}
                        className="flex items-center justify-center gap-1.5 text-[10px] font-black px-3.5 py-3 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-600 border border-amber-600 transition-colors uppercase tracking-wider font-extrabold focus:outline-none"
                      >
                        <Send className="w-4 h-4 shrink-0" /> Enviar para NIBO N1
                      </button>

                      {/* Exportar Planilha */}
                      <button
                        type="button"
                        onClick={handleExportPlanilha}
                        className="flex items-center justify-center gap-1.5 text-[10px] font-bold px-3.5 py-3 bg-slate-1050 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        <FileSpreadsheet className="w-4 h-4 shrink-0 text-emerald-400" /> Exportar Planilha
                      </button>

                      {/* Gerar PDF */}
                      <button
                        type="button"
                        onClick={() => setShowPdfMock(true)}
                        className="flex items-center justify-center gap-1.5 text-[10px] font-bold px-3.5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        <FileText className="w-4 h-4 shrink-0 text-red-500" /> Gerar PDF Contrato
                      </button>

                      {/* Editar */}
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="flex items-center justify-center gap-1.5 text-[10px] font-bold px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        <Edit3 className="w-4 h-4 shrink-0 text-slate-500" /> Editar Parâmetros
                      </button>

                      {/* Salvar Contrato */}
                      <button
                        type="button"
                        onClick={handleSaveContract}
                        className="flex items-center justify-center gap-1.5 text-[10px] font-bold px-3.5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        <Check className="w-4 h-4 shrink-0" /> Salvar Contrato
                      </button>

                      {/* Voltar ao Dashboard */}
                      <button
                        type="button"
                        onClick={onBackToDashboard}
                        className="flex items-center justify-center gap-1.5 text-[10px] font-bold px-3.5 py-3 bg-slate-100 hover:bg-slate-150 text-slate-700 border border-slate-200 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        <ArrowLeft className="w-4 h-4 shrink-0 text-slate-400" /> Voltar ao Painel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* LOWER BUTTONS PREV-NEXT */}
          <div className="pt-4 border-t border-slate-150 mt-6 flex justify-between items-center text-xs text-slate-500">
            <span>Passo {currentStep} de 5</span>
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded border hover:bg-slate-200 font-bold uppercase text-[9px] tracking-wider"
                >
                  Anterior
                </button>
              )}
              {currentStep < 5 && selectedCase && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 3 && !isCronogramaGenerated) {
                      handleGenerateCronograma();
                    } else {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-950 text-white rounded hover:bg-slate-800 font-bold uppercase text-[9px] tracking-wider"
                >
                  Próximo
                </button>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT WORKSPACE: LIVE INTERACTIVE SIDEBAR SUMMARY (IMMERSIVE CONSOLE) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* INTERACTIVE COMPACT SIDEBAR OF WHAT IS HAPPENING RIGHT NOW */}
          <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-850 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Building2 className="w-24 h-24 text-amber-500" />
            </div>

            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">
                Central de Herança BOSS
              </h3>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/55">
                <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">1. Caso Ativo Selecionado</span>
                {selectedCase ? (
                  <div className="mt-1 font-bold">
                    <p className="text-white text-xs">{selectedCase.clientName}</p>
                    <p className="text-amber-400 font-mono text-[9px] truncate mt-0.5">{selectedCase.todoistFormula}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic mt-1">Nenhum caso selecionado ainda</p>
                )}
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/55">
                <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">2. Tipo de Contrato</span>
                <p className="text-xs font-bold text-white mt-1 uppercase tracking-tight">{contractType}</p>
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/55">
                <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">3. Finanças e Parcelamento</span>
                <div className="flex justify-between mt-1 text-slate-200">
                  <span>Valor Total:</span>
                  <span className="font-mono font-bold text-amber-400">{formatBRL(totalValue)}</span>
                </div>
                <div className="flex justify-between text-slate-200 mt-1">
                  <span>Amortização:</span>
                  <span className="font-bold font-mono">{installmentsCount}x de {formatBRL(installmentGross)}</span>
                </div>
                <div className="flex justify-between text-slate-200 mt-1">
                  <span>Vencimento Fixo:</span>
                  <span className="font-mono font-bold">Dia {fixedDueDay} ({firstInstallmentDate})</span>
                </div>
                <div className="flex justify-between text-slate-200 mt-1">
                  <span>Forma:</span>
                  <span className="font-bold">{paymentMethod}</span>
                </div>
              </div>

              {isRateioApplicable && (
                <div className="bg-slate-850 p-2.5 rounded border border-slate-800">
                  <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">4. Divisão de Rateio ({clientPercent}% / {officePercent}%)</span>
                  <div className="flex justify-between mt-1 text-slate-300">
                    <span>Destinado Cliente:</span>
                    <span className="font-mono">{formatBRL(totalClientAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Destivado Escritório:</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatBRL(totalOfficeAmount)}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1 rounded overflow-hidden flex mt-2">
                    <div className="bg-blue-500 h-full" style={{ width: `${clientPercent}%` }}></div>
                    <div className="bg-emerald-500 h-full" style={{ width: `${officePercent}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[9px] text-slate-400 font-mono leading-relaxed leading-normal">
              <strong>Estratégia Giffoni:</strong> O cadastrador do contrato financeiro evita erros manuais puxando processos e drives em lote. A eficiência é mantida abaixo de 30 segundos globais.
            </div>
          </div>

          {/* INSTRUCTION TIPS */}
          <div className="bg-white rounded-lg p-4 border border-slate-200 text-xs text-slate-650 leading-relaxed space-y-2">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide flex items-center gap-1.5 pb-1 border-b">
              <Info className="w-4 h-4 text-blue-500 shrink-0" /> Dicas de Operação Rápida
            </h4>
            <p>
              1. <strong>Busca Dinâmica</strong>: Não perca tempo clicando em campos de texto. Use a busca inteligente na Etapa 1 para carregar instantaneamente o caso de alimentos ou o revisional.
            </p>
            <p>
              2. <strong>Cálculos de Rateio</strong>: Se mudar o valor bruto total, todos os repasses e cronogramas mensais calculam na hora.
            </p>
            <p>
              3. <strong>Sincronia Nibo ERP</strong>: O botão &quot;Enviar para NIBO&quot; integra o cronograma simulado com o financeiro principal no Dashboard central em 1 clique.
            </p>
          </div>

        </div>

      </div>

      {/* MODAL MOCK PRINTABLE CONTRACT PDF */}
      <AnimatePresence>
        {showPdfMock && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg border border-slate-350 shadow-2xl max-w-2xl w-full p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start border-b pb-3 mb-4">
                <div>
                  <span className="text-[8px] font-mono bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-black uppercase">PDF MOCK GENERATOR</span>
                  <h3 className="text-sm font-black uppercase text-slate-850 mt-1">Minuta Executiva de Contrato Financeiro</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPdfMock(false)}
                  className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Minuta textual */}
              <div className="bg-slate-50 p-4 rounded border font-serif text-[11px] text-slate-750 space-y-3 leading-relaxed max-h-[350px] overflow-y-auto">
                <div className="text-center font-bold text-xs uppercase mb-4 text-slate-900">
                  CONTRATO DE PACTUAÇÃO E AMORTIZAÇÃO FINANCEIRA DE ÊXITO
                </div>
                <p>
                  Pelo presente instrumento particular de prestação de serviços jurídicos e honorários advocatícios, de um lado, na qualidade de contratante, o Sr(a). <strong>{selectedCase?.clientName || 'NOME_CLIENTE'}</strong>, inscrito sob as regras contidas no preâmbulo do presente processo nº <strong>{selectedCase?.processNumber || 'Nº_PROCESSO'}</strong>.
                </p>
                <p>
                  E de outro lado, na qualidade de contratada, a sociedade de advogados <strong>GIFFONI ADVOGADOS ASSOCIADOS</strong>, sob responsabilidade do causídico principal <strong>{selectedCase?.responsibleAttorney || 'Dr. Rafael Giffoni'}</strong>.
                </p>
                <p className="font-bold">
                  CLÁUSULA PRIMEIRA - DO TIPO DE SERVIÇO E DO VALOR TOTAL
                </p>
                <p>
                  Fica avençado entre as partes a execução do assessoramento no escopo do processo judicial contendo as diretrizes de <strong>{selectedCase?.subject || 'EXECUÇÃO'}</strong>. O valor total financeiro consolidado estabelecido ascende ao patamar bruto global de <strong>{formatBRL(totalValue)}</strong>.
                </p>
                <p className="font-bold">
                  CLÁUSULA SEGUNDA - DA AMORTIZAÇÃO E DO RATEIO ({clientPercent}% / {officePercent}%)
                </p>
                <p>
                  Conforme as diretrizes pactuadas do tipo de contrato <strong>{contractType}</strong>, o valor será amortizado em <strong>{installmentsCount} parcelas mensais e sucessivas</strong> de <strong>{formatBRL(installmentGross)}</strong>.
                </p>
                {isRateioApplicable ? (
                  <p>
                    Deste quantitativo, resta em vigor a quota-litis onde <strong>{clientPercent}% ({formatBRL(totalClientAmount)})</strong> destina-se ao trânsito do cliente contratante, cabendo ao escritório a taxa de rentabilidade líquida de <strong>{officePercent}% ({formatBRL(totalOfficeAmount)})</strong>, equivalendo a parcelas escritoriais mensais fixas de <strong>{formatBRL(installmentOffice)}</strong>.
                  </p>
                ) : (
                  <p>
                    Não incidirá percentuais de repasse temporários nesta transação jurídica ordinária.
                  </p>
                )}
                <p className="font-bold">
                  CLÁUSULA TERCEIRA - DA LIQUIDAÇÃO E DO NIBO ERP
                </p>
                <p>
                  A data da primeira parcela dar-se-á em data fatal de <strong>{firstInstallmentDate}</strong>, vencendo-se as demais sucessivamente todo dia <strong>{fixedDueDay}</strong> de cada mês, via quitação por <strong>{paymentMethod}</strong>. Todas as parcelas em aberto já se encontram provisionadas para sincronia bancária.
                </p>
                <p className="text-right text-slate-500 font-sans italic text-[10px] mt-6">
                  Belo Horizonte, {new Date().toLocaleDateString('pt-BR')}.
                </p>
                <div className="flex justify-between gap-6 pt-6 font-sans text-center text-[10px] text-slate-500">
                  <div className="border-t border-slate-350 flex-1 pt-2 truncate">{selectedCase?.clientName || 'Contratante'}</div>
                  <div className="border-t border-slate-350 flex-1 pt-2 truncate">{selectedCase?.responsibleAttorney || 'Patrono Giffoni Advs'}</div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const content = document.querySelector('.bg-slate-50')?.innerHTML;
                    const win = window.open('', '', 'height=650,width=800');
                    if (win) {
                      win.document.write('<html><head><title>Imprimir Contrato BOSS</title><style>body{font-family:serif;padding:30px;} .flex{display:flex;} .justify-between{justify-content:space-between;} .flex-1{flex:1;} .border-t{border-top:1px solid #777;} .pt-2{padding-top:8px;} .text-center{text-align:center;} .text-right{text-align:right;} .font-bold{font-weight:bold;}</style></head><body>');
                      win.document.write(content || '');
                      win.document.write('</body></html>');
                      win.document.close();
                      win.print();
                    } else {
                      triggerNotification('Não foi possível abrir a janela de impressão no iFrame. Clique com o botão direito para imprimir.', 'info');
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white font-bold uppercase text-[9px] tracking-wider rounded-lg"
                >
                  Imprimir Minuta Real
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPdfMock(false);
                    triggerNotification('Ficha de PDF gerada e registrada com sucesso!', 'success');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold uppercase text-[9px] tracking-wider rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
