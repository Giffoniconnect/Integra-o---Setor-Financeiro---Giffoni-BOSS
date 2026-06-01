import { Transaction, NiboQueueItem, SuccessContract, AgreementInstallment, CriticalAlert, ConferenceLog } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-001',
    date: '2026-05-28',
    description: 'Honorários Mensais - Ambev S.A.',
    category: 'Honorários Mensais',
    value: 15400.00,
    type: 'income',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-002',
    date: '2026-05-25',
    description: 'Folha de Pagamento - Equipe Interna',
    category: 'Folha de Pagamento',
    value: 38200.00,
    type: 'expense',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-003',
    date: '2026-05-24',
    description: 'Êxito Judicial - Processo 5002931-10',
    category: 'Êxito Judicial',
    value: 45000.00,
    type: 'income',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-004',
    date: '2026-05-22',
    description: 'Aluguel do Escritório - Imobiliária Souza',
    category: 'Aluguel',
    value: 6500.00,
    type: 'expense',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-005',
    date: '2026-05-20',
    description: 'Software de Gestão - Nibo Assinatura',
    category: 'Softwares e SaaS',
    value: 349.90,
    type: 'expense',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-006',
    date: '2026-05-18',
    description: 'Consultoria Avulsa - Dr. Marcos Silva',
    category: 'Consultoria Avulsa',
    value: 4200.00,
    type: 'income',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-007',
    date: '2026-05-15',
    description: 'Provisão de Impostos - Simples Nacional',
    category: 'Impostos e Taxas',
    value: 12450.00,
    type: 'expense',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-008',
    date: '2026-05-12',
    description: 'Honorários Mensais - Metalúrgica Gerdau',
    category: 'Honorários Mensais',
    value: 18500.00,
    type: 'income',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-009',
    date: '2026-05-10',
    description: 'Campanha de Tráfego Pago - Meta Ads',
    category: 'Marketing',
    value: 5000.00,
    type: 'expense',
    status: 'paid',
    isNiboSynced: true
  },
  {
    id: 'TX-010',
    date: '2026-05-08',
    description: 'Parcelamento Convênio - Receita Federal',
    category: 'Impostos e Taxas',
    value: 2350.00,
    type: 'expense',
    status: 'paid',
    isNiboSynced: true
  },
  // Overdue / Pending in current context (June 1st, 2026)
  {
    id: 'TX-011',
    date: '2026-05-29',
    description: 'Atrasado - Honorários Consultoria - Carrefour Brasil',
    category: 'Consultoria Avulsa',
    value: 12000.00,
    type: 'income',
    status: 'overdue',
    isNiboSynced: false
  },
  {
    id: 'TX-012',
    date: '2020-05-30',
    description: 'Atrasado - Licença Core ERP - Totvs S.A.',
    category: 'Softwares e SaaS',
    value: 1890.00,
    type: 'expense',
    status: 'overdue',
    isNiboSynced: true
  },
  {
    id: 'TX-013',
    date: '2026-06-05',
    description: 'Futuro - Honorários Mensais - Banco Itaú',
    category: 'Honorários Mensais',
    value: 22000.00,
    type: 'income',
    status: 'pending',
    isNiboSynced: false
  },
  {
    id: 'TX-014',
    date: '2026-06-10',
    description: 'Futuro - Fornecedor TI - Cloud Server AWS',
    category: 'Softwares e SaaS',
    value: 1450.00,
    type: 'expense',
    status: 'pending',
    isNiboSynced: false
  },
  {
    id: 'TX-015',
    date: '2026-06-15',
    description: 'Futuro - Acordo Judicial - Empreiteira Rocha (Parc 04/12)',
    category: 'Acórdãos e Acordos',
    value: 8500.00,
    type: 'income',
    status: 'pending',
    isNiboSynced: false
  }
];

export const INITIAL_NIBO_QUEUE: NiboQueueItem[] = [
  {
    id: 'NQ-101',
    type: 'income',
    description: 'Honorários Mensais - Ambev S.A. (Mai/26)',
    value: 15400.00,
    date: '2026-05-28',
    status: 'synced',
    attempts: 1
  },
  {
    id: 'NQ-102',
    type: 'income',
    description: 'Consultoria Avulsa - Carrefour Brasil',
    value: 12000.00,
    date: '2026-05-29',
    status: 'failed',
    errorDescription: 'Erro de Autenticação NIBO API: Token expirado ou inválido.',
    attempts: 3
  },
  {
    id: 'NQ-103',
    type: 'expense',
    description: 'Licença Core ERP - Totvs S.A.',
    value: 1890.00,
    date: '2026-05-30',
    status: 'synced',
    attempts: 1
  },
  {
    id: 'NQ-104',
    type: 'income',
    description: 'Acordo Judicial - Empreiteira Rocha (Parc 04/12)',
    value: 8500.00,
    date: '2026-06-15',
    status: 'pending',
    attempts: 0
  },
  {
    id: 'NQ-105',
    type: 'expense',
    description: 'AWS Cloud Hosting - Junho 26',
    value: 1450.00,
    date: '2026-06-10',
    status: 'pending',
    attempts: 0
  }
];

export const INITIAL_SUCCESS_CONTRACTS: SuccessContract[] = [
  {
    id: 'SC-201',
    client: 'Metalúrgica Gerdau S.A.',
    processNumber: '5001224-88.2024.8.21.0001',
    baseValue: 1200000.00,
    percentFee: 15,
    expectedFee: 180000.00,
    probability: 'alta',
    status: 'ganho',
    expectedDate: '2026-07-15'
  },
  {
    id: 'SC-202',
    client: 'Construtora Tenda Ltda',
    processNumber: '1004952-30.2025.8.26.0100',
    baseValue: 450000.00,
    percentFee: 20,
    expectedFee: 90000.00,
    probability: 'media',
    status: 'ativo',
    expectedDate: '2026-10-10'
  },
  {
    id: 'SC-203',
    client: 'Cooperativa de Crédito Sicredi',
    processNumber: '5022931-45.2023.8.24.0023',
    baseValue: 800000.00,
    percentFee: 10,
    expectedFee: 80000.00,
    probability: 'alta',
    status: 'faturado',
    expectedDate: '2026-05-24'
  },
  {
    id: 'SC-204',
    client: 'Sindicato dos Transportadores RS',
    processNumber: '0020194-77.2024.5.04.0012',
    baseValue: 350000.00,
    percentFee: 12,
    expectedFee: 42000.00,
    probability: 'baixa',
    status: 'ativo',
    expectedDate: '2026-12-05'
  }
];

export const INITIAL_AGREEMENTS: AgreementInstallment[] = [
  {
    id: 'AG-301',
    debtor: 'Empreiteira Rocha RS',
    totalValue: 102000.00,
    installmentsCount: 12,
    currentInstallment: 4,
    installmentValue: 8500.00,
    nextDueDate: '2026-06-15',
    status: 'em_dia'
  },
  {
    id: 'AG-302',
    debtor: 'Distribuidora Fenix S/A',
    totalValue: 24000.00,
    installmentsCount: 6,
    currentInstallment: 2,
    installmentValue: 4000.00,
    nextDueDate: '2026-05-20',
    status: 'atrasado'
  },
  {
    id: 'AG-303',
    debtor: 'Supermercado TodoDia',
    totalValue: 30000.00,
    installmentsCount: 5,
    currentInstallment: 5,
    installmentValue: 6000.00,
    nextDueDate: '2026-05-10',
    status: 'quitado'
  },
  {
    id: 'AG-304',
    debtor: 'Tecnologia Avançada S.A.',
    totalValue: 60000.00,
    installmentsCount: 10,
    currentInstallment: 1,
    installmentValue: 6000.00,
    nextDueDate: '2026-06-25',
    status: 'em_dia'
  }
];

export const INITIAL_ALERTS: CriticalAlert[] = [
  {
    id: 'AL-401',
    type: 'overdue',
    message: 'Recebível Atrasado Detectado',
    subtext: 'Carrefour Brasil possui uma cobrança de R$ 12.000,00 vencida desde 2026-05-29.',
    date: '2026-05-30',
    severity: 'high',
    dismissed: false,
    linkToSection: 'tabela'
  },
  {
    id: 'AL-402',
    type: 'sync_fail',
    message: 'Falha Crítica na Sincronização NIBO',
    subtext: 'A cobrança de Carrefour Brasil falhou todas as tentativas devido a token de API expirado.',
    date: '2026-05-31',
    severity: 'high',
    dismissed: false,
    linkToSection: 'nibo'
  },
  {
    id: 'AL-403',
    type: 'agreement_delay',
    message: 'Parcela de Acordo em Atraso',
    subtext: 'Distribuidora Fenix S/A não realizou o pagamento da parcela 2/6 vencida em 2026-05-20.',
    date: '2026-05-21',
    severity: 'high',
    dismissed: false,
    linkToSection: 'acordos'
  },
  {
    id: 'AL-404',
    type: 'high_success_fee',
    message: 'Contrato de Êxito Alto Próximo a Vencer',
    subtext: 'Contrato com Gerdau S.A. possui uma expectativa alta de êxito de R$ 180.000,00 para 2026-07-15.',
    date: '2026-06-01',
    severity: 'medium',
    dismissed: false,
    linkToSection: 'exito'
  }
];

export const INITIAL_LOGS: ConferenceLog[] = [
  {
    id: 'LG-501',
    timestamp: '2026-06-01 09:15:32',
    action: 'Carga inicial do Dashboard Financeiro realizada com sucesso.',
    user: 'direito.rgr@gmail.com',
    status: 'success'
  },
  {
    id: 'LG-502',
    timestamp: '2026-06-01 10:30:14',
    action: 'Verificação da Fila de Sincronização NIBO automática executada.',
    user: 'Sistema NIBO',
    status: 'info'
  },
  {
    id: 'LG-503',
    timestamp: '2026-06-01 10:31:00',
    action: 'API NIBO retornou falha na sincronização da "Consultoria Avulsa - Carrefour Brasil" (Token Inválido).',
    user: 'Sistema NIBO',
    status: 'error'
  },
  {
    id: 'LG-504',
    timestamp: '2026-06-01 11:45:00',
    action: 'Geração de lote de faturamento mensal para Junho/2026.',
    user: 'direito.rgr@gmail.com',
    status: 'warning'
  }
];
