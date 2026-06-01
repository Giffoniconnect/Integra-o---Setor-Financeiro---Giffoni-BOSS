export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  status: 'paid' | 'pending' | 'overdue';
  isNiboSynced: boolean;
}

export interface NiboQueueItem {
  id: string;
  type: 'income' | 'expense';
  description: string;
  value: number;
  date: string;
  status: 'pending' | 'failed' | 'synced';
  errorDescription?: string;
  attempts: number;
}

export interface SuccessContract {
  id: string;
  client: string;
  processNumber: string;
  baseValue: number;
  percentFee: number;
  expectedFee: number;
  probability: 'alta' | 'media' | 'baixa';
  status: 'ativo' | 'ganho' | 'perdido' | 'faturado';
  expectedDate: string;
}

export interface AgreementInstallment {
  id: string;
  debtor: string;
  totalValue: number;
  installmentsCount: number;
  currentInstallment: number;
  installmentValue: number;
  nextDueDate: string;
  status: 'em_dia' | 'atrasado' | 'quitado';
}

export interface ConferenceLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface CriticalAlert {
  id: string;
  type: 'overdue' | 'sync_fail' | 'agreement_delay' | 'high_success_fee';
  message: string;
  subtext: string;
  date: string;
  severity: 'high' | 'medium';
  dismissed: boolean;
  linkToSection?: string;
  category?: string;
}
