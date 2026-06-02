import { Transaction, NiboQueueItem, SuccessContract, AgreementInstallment, CriticalAlert, ConferenceLog } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_NIBO_QUEUE: NiboQueueItem[] = [];

export const INITIAL_SUCCESS_CONTRACTS: SuccessContract[] = [];

export const INITIAL_AGREEMENTS: AgreementInstallment[] = [];

export const INITIAL_ALERTS: CriticalAlert[] = [];

export const INITIAL_LOGS: ConferenceLog[] = [
  {
    id: 'LG-INIT',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    action: 'Carga inicial do Dashboard. Banco de dados limpo para testes.',
    user: 'direito.rgr@gmail.com',
    status: 'success'
  }
];
