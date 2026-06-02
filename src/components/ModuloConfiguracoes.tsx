import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  User, 
  Link, 
  Lock, 
  Shield, 
  Key, 
  Check, 
  Copy, 
  RotateCw, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  Play, 
  Sliders, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  Info, 
  ExternalLink, 
  FileSpreadsheet, 
  Terminal, 
  Smartphone, 
  Mail, 
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Workflow,
  Network,
  Share2,
  Trash2,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { ConferenceLog } from '../types';
import ConferenceLogs from './ConferenceLogs';

interface ModuloConfiguracoesProps {
  onLogAction: (action: string, status?: 'info' | 'success' | 'warning' | 'error') => void;
  logs: ConferenceLog[];
  onAddManualLog: (note: string) => void;
  onClearLogs: () => void;
}

// Pre-seeded logs of authentication and integration events
interface IntegrationLog {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  eventType: string;
  status: 'importado' | 'sucesso' | 'erro' | 'alerta';
  message: string;
  caseId: string;
  contractId: string;
}

export default function ModuloConfiguracoes({ onLogAction, logs, onAddManualLog, onClearLogs }: ModuloConfiguracoesProps) {
  // --- STATES FOR BLOCKS ---
  
  // 1. Conexão com Portal BOSS
  const [bossUrl, setBossUrl] = useState('https://portal.giffoniboss.com.br/api/v1');
  const [bossBuildId, setBossBuildId] = useState('BUILD-BOSS-MAIN-2026-X4');
  const [bossAuthKey, setBossAuthKey] = useState('giffoni-boss-sec-9x45v8-prod-key');
  const [showBossKey, setShowBossKey] = useState(false);
  const [bossStatus, setBossStatus] = useState<'Conectado' | 'Desconectado' | 'Erro de autenticação' | 'Aguardando configuração'>('Conectado');
  const [bossLastSync, setBossLastSync] = useState('01/06/2026 14:12:05');
  const [loadingBossTest, setLoadingBossTest] = useState(false);
  const [loadingBossCases, setLoadingBossCases] = useState(false);

  // 2. Conexão com Portal do Cliente
  const [clientUrl, setClientUrl] = useState('https://cliente.giffoniboss.com.br');
  const [clientTestId, setClientTestId] = useState('CLI-901');
  const [caseTestId, setCaseTestId] = useState('CAS-4022-Gerdau');
  const [allowClientFinancial, setAllowClientFinancial] = useState(true);
  const [allowClientInstallments, setAllowClientInstallments] = useState(true);
  const [allowClientReceipts, setAllowClientReceipts] = useState(false);
  const [allowClientDueDateAlerts, setAllowClientDueDateAlerts] = useState(true);
  const [loadingClientTest, setLoadingClientTest] = useState(false);
  const [loadingClientSync, setLoadingClientSync] = useState(false);
  const [showClientPreviewModal, setShowClientPreviewModal] = useState(false);

  // 4. Segurança e Autenticação
  const [finApiKey, setFinApiKey] = useState('pk_boss_financeiro_live_9a0x889c20268571f');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'teste' | 'producao'>('producao');
  const [tokenActive, setTokenActive] = useState(true);
  const [expirationDate, setExpirationDate] = useState('01/06/2027');
  const [copiedHeaderFeedback, setCopiedHeaderFeedback] = useState(false);
  const [showFinKey, setShowFinKey] = useState(false);

  // 5. Permissões de Exibição
  const [permissions, setPermissions] = useState({
    admin: { total: true },
    financeiro: { contratos: true, parcelas: true, nibo: true, comprovantes: true },
    advogado: { visionPropria: true, visionGeral: false },
    cliente: { parcelas: true, vencimentos: true, comprovantes: false, resumoAutorizado: true }
  });

  // 6. Sincronização totals
  const [syncTotals, setSyncTotals] = useState({
    casosRecebidos: 0,
    contratosEnviados: 0,
    dadosLiberadosCliente: 0,
    pendenciasSinc: 0,
    errosSinc: 0
  });
  const [loadingGlobalSync, setLoadingGlobalSync] = useState(false);
  const [loadingReprocessFailures, setLoadingReprocessFailures] = useState(false);

  // 7. Logs e Auditoria Table
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [newManualLogText, setNewManualLogText] = useState('');
  const [filterLogStatus, setFilterLogStatus] = useState<string>('all');
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);

  // 8. Integrações Futuras Configuration states
  const [futureIntegrations, setFutureIntegrations] = useState([
    {
      id: 'nibo',
      name: 'NIBO ERP',
      status: 'Pronto p/ Uso',
      color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20',
      desc: 'Integração de lançamentos agendados, fluxo de caixa e conciliação bancária de faturas diárias.',
      customKey: 'nibo_token_bearer_109249x882',
      logs: ['[01/06 14:02] Token validado no NIBO Gateway.', '[01/06 14:10] Executando sync com 0 pendências.']
    },
    {
      id: 'gdrive',
      name: 'Google Drive',
      status: 'Conectado parciais',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      desc: 'Sincronização bidirecional de comprovantes PDF com pastas automáticas por Cliente/Caso.',
      customKey: 'gdrive_client_oauth2_id_94951_giffoni_groot',
      logs: ['[01/06 09:12] Ouvindo eventos de criação de pastas.', '[01/06 10:20] 3 comprovantes anexados via API Docs.']
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      status: 'Planejado [Sprint 3]',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25',
      desc: 'Disparo de PDFs e notificações de vencimento de parcelas de acordos em tempo real ao financeiro do cliente.',
      customKey: '',
      logs: ['[SandBox Inativo] Contas meta em verificação jurídica de templates oficiais.']
    },
    {
      id: 'gmail',
      name: 'Gmail Automations',
      status: 'Configurável',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      desc: 'Emails corporativos periódicos de alerta com demonstrativo financeiro e link para o portal.',
      customKey: 'gmail_api_cred_ok_giffoni',
      logs: ['[01/06 08:22] Ouvido eventos de faturamento pendente.', '[01/06 12:00] Email diário gerado e armazenado na fila.']
    },
    {
      id: 'gcal',
      name: 'Google Agenda',
      status: 'Manual',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      desc: 'Vinculação automática de datas de repasse sob êxito às agendas dos advogados encarregados.',
      customKey: '',
      logs: ['[Fila inativa] Aguardando escopo das rotinas de comissões de sócios.']
    }
  ]);

  // States specific to ASAAS & Stripe under the strict anti-duplication guidelines
  const [asaasStatusConexao, setAsaasStatusConexao] = useState<'Conectado' | 'Parcial' | 'Desconectado'>('Conectado');
  const [asaasLastRead, setAsaasLastRead] = useState('01/06/2026 14:10:22');
  const [asaasChargesCount, setAsaasChargesCount] = useState(148);
  const [asaasTotalSynced, setAsaasTotalSynced] = useState(74000.00);
  const [asaasDivergences, setAsaasDivergences] = useState(0);
  const [asaasStateVal, setAsaasStateVal] = useState<'Sincronizado' | 'Aguardando leitura' | 'Divergente' | 'Precisa revisar na plataforma original' | 'Erro de sincronização' | 'Link externo disponível'>('Sincronizado');
  const [loadingAsaasSync, setLoadingAsaasSync] = useState(false);
  const [showAsaasLogs, setShowAsaasLogs] = useState(false);
  const [asaasLogsList, setAsaasLogsList] = useState<string[]>([
    '[01/06 14:10] Sync concluído. 148 cobranças identificadas em espelho.',
    '[01/06 14:05] Sincronia passiva ativada via Webhook com as APIs do asaas.com.',
    '[31/05 10:24] Sucesso: 0 discrepâncias e 148 registros validados.'
  ]);

  const [stripeStatusConexao, setStripeStatusConexao] = useState<'Conectado' | 'Parcial' | 'Desconectado'>('Conectado');
  const [stripeLastRead, setStripeLastRead] = useState('01/06/2026 13:45:15');
  const [stripeChargesCount, setStripeChargesCount] = useState(56);
  const [stripeTotalSynced, setStripeTotalSynced] = useState(124500.00);
  const [stripeDivergences, setStripeDivergences] = useState(2);
  const [stripeStateVal, setStripeStateVal] = useState<'Sincronizado' | 'Aguardando leitura' | 'Divergente' | 'Precisa revisar na plataforma original' | 'Erro de sincronização' | 'Link externo disponível'>('Divergente');
  const [loadingStripeSync, setLoadingStripeSync] = useState(false);
  const [showStripeLogs, setShowStripeLogs] = useState(false);
  const [stripeLogsList, setStripeLogsList] = useState<string[]>([
    '[01/06 13:45] Atenção: 2 faturas divergem do valor de comissão local (Divergente).',
    '[01/06 13:40] Leitura de assinaturas e links de pagamento concluída.',
    '[31/05 09:12] Conexão certificada com Stripe Connect.'
  ]);

  // Modals for safe outbound redirection simulation
  const [showExternalLinkModal, setShowExternalLinkModal] = useState(false);
  const [currentExternalLinkPlatform, setCurrentExternalLinkPlatform] = useState<'ASAAS' | 'Stripe'>('ASAAS');

  const [activeFutureConfigId, setActiveFutureConfigId] = useState<string | null>(null);
  const [futureConfigKeys, setFutureConfigKeys] = useState<{ [key: string]: string }>({
    nibo: 'nibo_token_bearer_109249x882',
    gdrive: 'gdrive_client_oauth2_id_94951_giffoni_groot',
    whatsapp: '',
    gmail: 'gmail_api_cred_ok_giffoni',
    gcal: ''
  });

  // --- ACTIONS HANDLERS ---

  // Refreshes / Tests BOSS API Connection
  const handleTestBossConnection = () => {
    setLoadingBossTest(true);
    onLogAction('CONFIGURAÇÕES: Testando conexões com Portal BOSS...', 'info');
    
    setTimeout(() => {
      setLoadingBossTest(false);
      // Simulates successful recovery
      setBossStatus('Conectado');
      const nowStr = new Date().toLocaleString('pt-BR');
      setBossLastSync(nowStr);
      
      const newLog: IntegrationLog = {
        id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: nowStr,
        source: 'Build Financeiro',
        destination: 'Portal BOSS',
        eventType: 'Check Conexão',
        status: 'sucesso',
        message: 'Aperto de mão (Handshake) validado. Conexão ESTÁVEL com Portal BOSS.',
        caseId: 'GLOBAL',
        contractId: 'GLOBAL'
      };
      setIntegrationLogs(prev => [newLog, ...prev]);
      onLogAction('CONFIGURAÇÕES: Conexão estrita com Portal BOSS estabelecida com sucesso.', 'success');
    }, 1200);
  };

  // Synchronizes Cases from Portal BOSS
  const handleSyncBossCases = () => {
    setLoadingBossCases(true);
    onLogAction('CONFIGURAÇÕES: Disparando varredura e importação de casos do Portal BOSS...', 'info');
    
    setTimeout(() => {
      setLoadingBossCases(false);
      const nowStr = new Date().toLocaleString('pt-BR');
      setBossLastSync(nowStr);
      setSyncTotals(prev => ({
        ...prev,
        casosRecebidos: prev.casosRecebidos + 14,
        pendenciasSinc: 1
      }));
      
      const newLog: IntegrationLog = {
        id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: nowStr,
        source: 'Portal BOSS',
        destination: 'Build Financeiro',
        eventType: 'Sincronizar Casos',
        status: 'importado',
        message: 'Varredura concluída. 14 novos casos localizados e importados sob fila pendente.',
        caseId: 'CAS-BATCH-994',
        contractId: 'N/A'
      };
      setIntegrationLogs(prev => [newLog, ...prev]);
      onLogAction('CONFIGURAÇÕES: 14 novos casos baixados com sucesso do Portal BOSS!', 'success');
    }, 1500);
  };

  // Test Customer Portal Client Connection
  const handleTestClientConnection = () => {
    setLoadingClientTest(true);
    onLogAction(`CONFIGURAÇÕES: Validando conformidade com cliente ID ${clientTestId} no portal...`, 'info');
    
    setTimeout(() => {
      setLoadingClientTest(false);
      const nowStr = new Date().toLocaleString('pt-BR');
      
      const newLog: IntegrationLog = {
        id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: nowStr,
        source: 'Build Financeiro',
        destination: 'Portal do Cliente',
        eventType: 'Check Cliente',
        status: 'sucesso',
        message: `Vínculo com cliente ${clientTestId} ativo. Caso ${caseTestId} liberado.`,
        caseId: caseTestId,
        contractId: 'AG-103'
      };
      setIntegrationLogs(prev => [newLog, ...prev]);
      onLogAction(`CONFIGURAÇÕES: Vínculo verificado. Cliente ${clientTestId} sincronizado no Portal do Cliente.`, 'success');
    }, 1000);
  };

  // Trigger Client Portal Data Sync
  const handleSyncClientPortal = () => {
    setLoadingClientSync(true);
    onLogAction(`CONFIGURAÇÕES: Exportando tabelas de amortizações habilitadas ao Portal do Cliente...`, 'info');
    
    setTimeout(() => {
      setLoadingClientSync(false);
      const nowStr = new Date().toLocaleString('pt-BR');
      setSyncTotals(prev => ({
        ...prev,
        dadosLiberadosCliente: prev.dadosLiberadosCliente + 5
      }));
      
      const newLog: IntegrationLog = {
        id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: nowStr,
        source: 'Build Financeiro',
        destination: 'Portal do Cliente',
        eventType: 'Sincronizar Visão',
        status: 'sucesso',
        message: 'Resumo autorizado de parcelamentos e datas de vencimento enviado aos celulares vinculados.',
        caseId: 'ALL-ALLOWED',
        contractId: 'ALL-ALLOWED'
      };
      setIntegrationLogs(prev => [newLog, ...prev]);
      onLogAction('CONFIGURAÇÕES: Sincronização do Portal do Cliente concluída com exito.', 'success');
    }, 1300);
  };

  // Generates new Finance API key with namespace check
  const handleGenerateNewFinKey = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = `pk_boss_financeiro_${selectedEnvironment === 'producao' ? 'live' : 'test'}_${randomHex.substring(0, 16)}`;
    setFinApiKey(newKey);
    setTokenActive(true);
    
    const nowStr = new Date().toLocaleString('pt-BR');
    const newLog: IntegrationLog = {
      id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: nowStr,
      source: 'Build Financeiro',
      destination: 'Auditoria de Acesso',
      eventType: 'Secret Alterado',
      status: 'alerta',
      message: `Nova chave de integração financeira gerada com sucesso (${selectedEnvironment.toUpperCase()}). Namespace restrito ativado.`,
      caseId: 'SECURE',
      contractId: 'SECURE'
    };
    setIntegrationLogs(prev => [newLog, ...prev]);
    onLogAction(`CONFIGURAÇÕES: Nova chave Namespace gerada (${selectedEnvironment}). Chaves antigas expirarão.`, 'warning');
  };

  // Revoke security token
  const handleRevokeFinKey = () => {
    setTokenActive(false);
    const nowStr = new Date().toLocaleString('pt-BR');
    const newLog: IntegrationLog = {
      id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: nowStr,
      source: 'Build Financeiro',
      destination: 'Auditoria de Acesso',
      eventType: 'Token Revogado',
      status: 'erro',
      message: 'Token de integração do Giffoni BOSS Financeiro REVOGADO e BLOQUEADO para chamados externos.',
      caseId: 'SECURITY_SHUTDOWN',
      contractId: 'SECURITY_SHUTDOWN'
    };
    setIntegrationLogs(prev => [newLog, ...prev]);
    onLogAction('CONFIGURAÇÕES: ALERTA SISTEMA! Chave de integração foi revogada. Nenhuma sincronização ocorrerá.', 'error');
  };

  // Copies header string to clipboard
  const handleCopyHeaderString = () => {
    const headerStr = `X-BOSS-Financeiro-Integration-Key: ${finApiKey}`;
    navigator.clipboard.writeText(headerStr).then(() => {
      setCopiedHeaderFeedback(true);
      setTimeout(() => setCopiedHeaderFeedback(false), 2000);
      onLogAction('CONFIGURAÇÕES: Header de integração obrigatório copiado para a área de transferência.', 'info');
    });
  };

  // Handles toggle checked values for permissions
  const handleTogglePerm = (profile: 'financeiro' | 'advogado' | 'cliente', category: string) => {
    setPermissions(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[profile][category] = !copy[profile][category];
      return copy;
    });
    onLogAction('CONFIGURAÇÕES: Permissões de exibição atualizadas.', 'info');
  };

  // Simulates Global Synchronizer Animation
  const handleGlobalSyncNow = () => {
    setLoadingGlobalSync(true);
    onLogAction('CONFIGURAÇÕES: Iniciando reconciliação global programada...', 'info');
    
    setTimeout(() => {
      setLoadingGlobalSync(false);
      const nowStr = new Date().toLocaleString('pt-BR');
      setSyncTotals(prev => ({
        ...prev,
        casosRecebidos: prev.casosRecebidos + 3,
        contratosEnviados: prev.contratosEnviados + 2,
        pendenciasSinc: 0,
        errosSinc: 0
      }));
      
      const newLog: IntegrationLog = {
        id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: nowStr,
        source: 'Sincronizador Global',
        destination: 'Consolidação BOSS/Cliente/Nibo',
        eventType: 'Sincronismo Total',
        status: 'sucesso',
        message: 'Reconciliação completa. Fila unificada de repasses e despesas com 100% de estabilidade.',
        caseId: 'GLOBAL-RUN',
        contractId: 'GLOBAL-RUN'
      };
      setIntegrationLogs(prev => [newLog, ...prev]);
      onLogAction('CONFIGURAÇÕES: Reconciliação global concluída com sucesso! 0 divergências pendentes.', 'success');
    }, 2000);
  };

  // Reprocess failed items
  const handleReprocessFailedQueue = () => {
    setLoadingReprocessFailures(true);
    onLogAction('CONFIGURAÇÕES: Selecionando registros rotulados com erro ou instrução instável...', 'info');
    
    setTimeout(() => {
      setLoadingReprocessFailures(false);
      const nowStr = new Date().toLocaleString('pt-BR');
      setSyncTotals(prev => ({
        ...prev,
        errosSinc: 0,
        contratosEnviados: prev.contratosEnviados + 1
      }));
      
      // Clear errors from integration logs
      setIntegrationLogs(prev => 
        prev.map(l => l.status === 'erro' ? { ...l, status: 'sucesso', message: `Sucesso pós-reprocessamento: ${l.message}` } : l)
      );

      const newLog: IntegrationLog = {
        id: `ILOG-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: nowStr,
        source: 'Reprocessador Integrativo',
        destination: 'Portal BOSS',
        eventType: 'Correção Sincronia',
        status: 'sucesso',
        message: 'Casos pendentes reprocessados sucessivamente.',
        caseId: 'CAS-BATCH-RETRY',
        contractId: 'N/A'
      };
      setIntegrationLogs(prev => [newLog, ...prev]);
      onLogAction('CONFIGURAÇÕES: Fila de reprocessamento despachada. Logs retificados.', 'success');
    }, 1500);
  };

  // Appends a manual mock log item
  const handleAddNewManualMockLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManualLogText.trim()) return;
    const nowStr = new Date().toLocaleString('pt-BR');
    const newLog: IntegrationLog = {
      id: `ILOG-${Math.floor(100 + Math.random() * 899)}`,
      timestamp: nowStr,
      source: 'Consola Operador',
      destination: 'Audit Trail',
      eventType: 'Nota Operacional',
      status: 'sucesso',
      message: `Nota manual: ${newManualLogText}`,
      caseId: 'CAS-MANUAL-01',
      contractId: 'SC-MANUAL-01'
    };
    setIntegrationLogs(prev => [newLog, ...prev]);
    onLogAction('CONFIGURAÇÕES: Nota manual anexada aos logs integrados.', 'info');
    setNewManualLogText('');
  };

  // Export Integrated Logs Simulated Download
  const handleExportSimulatedLogs = () => {
    const header = 'ID;DATA;ORIGEM;DESTINO;EVENTO;STATUS;MENSAGEM;CASE_ID;CONTRACT_ID\r\n';
    const rows = integrationLogs.map(l => 
      `${l.id};${l.timestamp};${l.source};${l.destination};${l.eventType};${l.status.toUpperCase()};${l.message};${l.caseId};${l.contractId}`
    ).join('\r\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `giffoni-boss-logs-configuracoes-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogAction('CONFIGURAÇÕES: Planilha de auditoria gerada e baixada com sucesso (formato CSV).', 'success');
  };

  // Sets active key config for future API slots
  const handleSaveFutureIntegrationKey = (id: string) => {
    const updated = futureIntegrations.map(item => {
      if (item.id === id) {
        const val = futureConfigKeys[id];
        return {
          ...item,
          status: val ? 'Configurado' : 'Aguardando',
          color: val ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-400 bg-slate-100 border-slate-200',
          logs: [...item.logs, `[01/06 14:47] Credenciais manuais salvas: "${val.substring(0, 8)}..."`]
        };
      }
      return item;
    });
    setFutureIntegrations(updated);
    setActiveFutureConfigId(null);
    onLogAction(`CONFIGURAÇÕES: Credenciais da API externa salvaguardadas de imediato em modo sandbox.`, 'success');
  };

  // Simulates call tests for future integrations
  const handleTestCallFutureIntegration = (id: string) => {
    onLogAction(`CONFIGURAÇÕES: Conectando fia de teste sandbox em ${id.toUpperCase()}...`, 'info');
    
    // update logs
    const updated = futureIntegrations.map(item => {
      if (item.id === id) {
        return {
          ...item,
          logs: [...item.logs, `[Teste de Chamado 14:47] Ping real-time enviando retorno 200 OK. Sistema simulado em repouso.`]
        };
      }
      return item;
    });
    setFutureIntegrations(updated);
    onLogAction(`CONFIGURAÇÕES: Resposta sandbox de ${id.toUpperCase()} de imediato: 200 OK (Mecanismo Mockado).`, 'success');
  };

  const handleSyncAsaasNow = () => {
    setLoadingAsaasSync(true);
    onLogAction('CONFIGURAÇÕES: Sincronizando espelho ASAAS em tempo real...', 'info');
    setTimeout(() => {
      setLoadingAsaasSync(false);
      const nowStr = new Date().toLocaleString('pt-BR');
      setAsaasLastRead(nowStr);
      setAsaasChargesCount(prev => prev + 4);
      setAsaasTotalSynced(prev => prev + 2000.00);
      setAsaasLogsList(prev => [
        `[${nowStr.substring(0, 5)} ${nowStr.substring(11, 16)}] [Sucesso] Sincronização concluída. 4 novas faturas espelhadas para conferência.`,
        ...prev
      ]);
      onLogAction('CONFIGURAÇÕES: Sincronia passiva ASAAS finalizada com êxito.', 'success');
    }, 1200);
  };

  const handleSyncStripeNow = () => {
    setLoadingStripeSync(true);
    onLogAction('CONFIGURAÇÕES: Escaneando webhook e assinaturas Stripe...', 'info');
    setTimeout(() => {
      setLoadingStripeSync(false);
      const nowStr = new Date().toLocaleString('pt-BR');
      setStripeLastRead(nowStr);
      setStripeChargesCount(prev => prev + 1);
      setStripeTotalSynced(prev => prev + 1500.00);
      setStripeLogsList(prev => [
        `[${nowStr.substring(0, 5)} ${nowStr.substring(11, 16)}] [Informação] 1 nova cobrança de faturamento estrangeiro detectada em espelho.`,
        ...prev
      ]);
      onLogAction('CONFIGURAÇÕES: Sincronia passiva Stripe concluída.', 'success');
    }, 1200);
  };

  // Filters
  const filteredLogs = integrationLogs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.caseId.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchLogQuery.toLowerCase());
    
    if (filterLogStatus === 'all') return matchesSearch;
    if (filterLogStatus === 'sucesso') return matchesSearch && log.status === 'sucesso';
    if (filterLogStatus === 'alerta') return matchesSearch && log.status === 'alerta';
    if (filterLogStatus === 'erro') return matchesSearch && log.status === 'erro';
    if (filterLogStatus === 'importado') return matchesSearch && log.status === 'importado';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans select-none pb-8" id="modulo-configuracoes-financeiras">
      
      {/* Visual Header Banner - BOSS Compliance Styling */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-5 rounded-lg border border-slate-705 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 p-8 opacity-[0.05] flex items-center">
          <Workflow className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              MÓDULO 11 • HUB CONFIGURAÇÃO INTEGRATIVA
            </span>
            <div className="flex items-center gap-1 text-[9px] bg-slate-800 border border-slate-700/80 px-2 py-0.5 rounded font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              PROTÓTIPO INTEGRADO (NÃO OPERACIONAL REAL)
            </div>
          </div>
          
          <h2 className="text-xl font-black font-display text-white mt-1.5 uppercase tracking-tight">
            CONFIGURAÇÕES DO SETOR FINANCEIRO — GIFFONI BOSS
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-snug">
            Esta área consolida a preparação visual, técnica e lógica para a futura unificação do ecossistema Giffoni BOSS. Configure as chaves de Namespace, defina permissões por papel processual, teste handshakes simulados, e audite o tráfego esperado de dados entre builds descentralizados.
          </p>
        </div>
      </div>

      {/* Grid of Section Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* BLOCK 1: Conexão com Portal BOSS */}
        <section className="bg-white p-4 border border-slate-200/90 rounded-lg shadow-xs flex flex-col justify-between" id="section-status-portal-boss">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" /> 1. Conexão com Portal BOSS
              </h3>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full px-2.5 ${
                bossStatus === 'Conectado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                bossStatus === 'Desconectado' ? 'bg-slate-100 text-slate-500' :
                bossStatus === 'Erro de autenticação' ? 'bg-rose-50 text-rose-700 font-black animate-pulse' : 'bg-amber-50 text-amber-600'
              }`}>
                ● {bossStatus}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal mb-3.5">
              O Portal BOSS principal é o controlador mestre que armazena os casos criminais ou cíveis, clientes cadastrados e advogados responsáveis. O Financeiro necessita de conexão estrita para traduzir contratos em parcelas de cobranças.
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">URL da API do Portal BOSS</label>
                <input 
                  type="text" 
                  value={bossUrl}
                  onChange={(e) => setBossUrl(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded px-2.5 py-1.5 shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">Build ID do Portal BOSS</label>
                  <input 
                    type="text" 
                    value={bossBuildId}
                    onChange={(e) => setBossBuildId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">Status Sincronia</label>
                  <div className="bg-slate-100 text-slate-700 rounded px-2.5 py-1.8 flex items-center justify-between text-[10px]">
                    <span>Último sync:</span>
                    <span className="font-bold text-slate-900">{bossLastSync}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">Chave de Integração Secreta</label>
                <div className="relative flex">
                  <input 
                    type={showBossKey ? 'text' : 'password'} 
                    value={bossAuthKey}
                    onChange={(e) => setBossAuthKey(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-l px-2.5 py-1.5 focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowBossKey(!showBossKey)}
                    className="bg-slate-100 border border-l-0 border-slate-200 px-3 rounded-r text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    {showBossKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => {
                setBossStatus('Desconectado');
                onLogAction('CONFIGURAÇÕES: Portal BOSS desconectado voluntariamente pelo painel.', 'warning');
              }}
              className="text-[10px] font-bold px-3 py-1.8 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded border border-slate-200 transition-all uppercase"
            >
              Simular Off-line
            </button>
            <button
              onClick={() => {
                setBossStatus('Erro de autenticação');
                onLogAction('CONFIGURAÇÕES: Portal BOSS sinalizando erro de autenticação provisório.', 'error');
              }}
              className="text-[10px] font-bold px-3 py-1.8 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded border border-rose-200 transition-all uppercase"
            >
              Simular Erro Auth
            </button>
            <button
              onClick={handleTestBossConnection}
              disabled={loadingBossTest}
              className="text-[10px] font-bold px-3 py-1.8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-all uppercase flex items-center gap-1"
            >
              {loadingBossTest ? <RotateCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Testar Conexão
            </button>
            <button
              onClick={handleSyncBossCases}
              disabled={loadingBossCases || bossStatus !== 'Conectado'}
              className="text-[10px] font-black px-3.5 py-1.8 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 rounded transition-all uppercase flex items-center gap-1.5 shadow-xs"
            >
              {loadingBossCases ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Sincronizar Casos BOSS
            </button>
          </div>
        </section>

        {/* BLOCK 2: Conexão com Portal do Cliente */}
        <section className="bg-white p-4 border border-slate-200/90 rounded-lg shadow-xs flex flex-col justify-between" id="section-status-portal-cliente">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-600" /> 2. Conexão com Portal do Cliente
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200/60 font-bold uppercase">
                <Smartphone className="w-3 h-3 text-cyan-600" /> PORTAL SMART APP
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal mb-3.5">
              O Portal do Cliente (individual) fornece uma visão restrita autorizada ao autor da demanda para acompanhar faturas a vencer, enviar anexos de comprovantes e conferir termos quitados de amortização sem fricção de contatos.
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">URL base do Portal do Cliente</label>
                <input 
                  type="text" 
                  value={clientUrl}
                  onChange={(e) => setClientUrl(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">ID Cliente de Teste</label>
                  <input 
                    type="text" 
                    value={clientTestId}
                    onChange={(e) => setClientTestId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">ID Caso Vinculado de Teste</label>
                  <input 
                    type="text" 
                    value={caseTestId}
                    onChange={(e) => setCaseTestId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles Checklist */}
              <div className="pt-2">
                <label className="block text-[10px] text-slate-400 uppercase font-sans font-bold mb-2">Visibilidade de dados liberados ao Cliente</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => setAllowClientFinancial(!allowClientFinancial)}
                    className="flex items-center justify-between p-2 rounded border border-slate-100 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <span>Exibição financeira</span>
                    {allowClientFinancial ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">SIM</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded">NÃO</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAllowClientInstallments(!allowClientInstallments)}
                    className="flex items-center justify-between p-2 rounded border border-slate-100 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <span>Exibição de parcelas</span>
                    {allowClientInstallments ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">SIM</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded">NÃO</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAllowClientReceipts(!allowClientReceipts)}
                    className="flex items-center justify-between p-2 rounded border border-slate-100 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <span>Exibição de comprovantes</span>
                    {allowClientReceipts ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">SIM</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded">NÃO</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAllowClientDueDateAlerts(!allowClientDueDateAlerts)}
                    className="flex items-center justify-between p-2 rounded border border-slate-100 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <span>Alertas de vencimento</span>
                    {allowClientDueDateAlerts ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">SIM</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded">NÃO</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
            <button
              onClick={handleTestClientConnection}
              disabled={loadingClientTest}
              className="text-[10px] font-bold px-3 py-1.8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-all uppercase flex items-center gap-1"
            >
              {loadingClientTest ? <RotateCw className="w-3 h-3 animate-spin" /> : <Sliders className="w-3 h-3" />}
              Testar Vínculo
            </button>
            <button
              onClick={() => setShowClientPreviewModal(true)}
              className="text-[10px] font-bold px-3.5 py-1.8 bg-slate-800 hover:bg-slate-900 text-white rounded transition-all uppercase flex items-center gap-1.5 shadow-sm"
              title="Ver protótipo do que o cliente acessa no Smartphone"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              Pré-visualizar Portal do Cliente
            </button>
            <button
              onClick={handleSyncClientPortal}
              disabled={loadingClientSync}
              className="text-[10px] font-black px-3.5 py-1.8 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-all uppercase flex items-center gap-1.5"
            >
              {loadingClientSync ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Sincronizar Portal Cliente
            </button>
          </div>
        </section>

      </div>

      {/* BLOCK 3: Contrato de Dados entre Builds - FLOW CHART & FIELDS METAKEYS */}
      <section className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs" id="section-contrato-dados-builds">
        <div className="border-b border-slate-100 pb-2.5 mb-3.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Workflow className="w-4 h-4 text-purple-600" /> 3. Contrato Estrito de Organização de Dados entre Builds
          </h3>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal mb-4">
          Para garantir consistência estrita sem replicação de bancos gigantescos, definimos um protocolo estrito (Contrato de Payload JSON). Esta tabela mútua documenta as propriedades obrigatórias trocadas na sincronização de rotinas financeiras.
        </p>

        {/* Visual Diagram flow */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 mb-4 text-white">
          <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block mb-1">Diagrama Unificado de Fluxo Bilateral</span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-[10px] font-mono leading-tight py-2">
            <div className="bg-[#1E293B] border border-blue-500/20 p-2 rounded w-full sm:w-36">
              <span className="text-blue-400 block font-bold">1. Portal BOSS</span>
              <span className="text-[9px] text-slate-400">Emite Dados de Casos</span>
            </div>
            <div className="text-slate-500 font-bold hidden sm:block">➔</div>
            <div className="bg-slate-800 border border-amber-500/30 p-2 rounded w-full sm:w-40 animate-pulse">
              <span className="text-amber-400 block font-bold">✏️ Build Financeiro</span>
              <span className="text-[9px] text-slate-300">Processa contrato & parcelas</span>
            </div>
            <div className="text-slate-500 font-bold hidden sm:block">➔</div>
            <div className="bg-[#1E293B] border border-cyan-500/20 p-2 rounded w-full sm:w-36">
              <span className="text-cyan-400 block font-bold">3. Portal do Cliente</span>
              <span className="text-[9px] text-slate-400">Acessa amortizações</span>
            </div>
            <div className="text-slate-500 font-bold hidden sm:block">➔</div>
            <div className="bg-slate-900 border border-emerald-500/20 p-2 rounded w-full sm:w-36">
              <span className="text-emerald-400 block font-bold">4. Retorno BOSS</span>
              <span className="text-[9px] text-slate-400">Atualiza status total</span>
            </div>
          </div>
        </div>

        {/* Expected Fields vs Received Fields split grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Expected from Portal BOSS */}
          <div className="bg-slate-50/50 p-3 rounded border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest pb-1.5 mb-2 border-b border-slate-200/50 flex items-center justify-between">
                <span>📥 Campos Esperados do Portal BOSS</span>
                <span className="text-[9px] text-blue-600 bg-blue-50 font-bold px-1 rounded uppercase">Via Ingress Webhook</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">caseId</span>
                  <span className="text-[9px] text-slate-400 font-sans">string UUID</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">clientId</span>
                  <span className="text-[9px] text-slate-400 font-sans">string UUID</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded col-span-1 sm:col-span-2">
                  <span className="text-slate-700">todoistPreviewFormula</span>
                  <span className="text-[9px] text-slate-400 font-sans">regra-cron string</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-750 font-bold">nomeCliente</span>
                  <span className="text-[9px] text-blue-500 font-sans">obrigatorio</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">parteAdversa</span>
                  <span className="text-[9px] text-slate-400 font-sans">string</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-750 font-bold">assunto</span>
                  <span className="text-[9px] text-blue-500 font-sans">string</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">numeroProcesso</span>
                  <span className="text-[9px] text-slate-400 font-sans">CNJ ID</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">comarca</span>
                  <span className="text-[9px] text-slate-400 font-sans">string</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">vara</span>
                  <span className="text-[9px] text-slate-400 font-sans">string</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">advogadoResponsavel</span>
                  <span className="text-[9px] text-slate-400 font-sans">email</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">googleDriveFolderId</span>
                  <span className="text-[9px] text-slate-400 font-sans">ID</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700 font-bold">statusCaso</span>
                  <span className="text-[9px] text-slate-400 font-sans">enum</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-blue-50/50 text-[10px] text-slate-600 rounded flex items-start gap-1 font-sans">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>O preenchimento incompleto de campos obrigatórios do BOSS (como <strong>nomeCliente</strong> ou <strong>assunto</strong>) impede o cálculo de faturamento automático e joga o caso para Alertas Críticos (M2).</span>
            </div>
          </div>

          {/* Sent by Giffoni Financeiro */}
          <div className="bg-slate-50/50 p-3 rounded border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest pb-1.5 mb-2 border-b border-slate-200/50 flex items-center justify-between">
                <span>📤 Campos Enviados pelo Financeiro</span>
                <span className="text-[9px] text-emerald-600 bg-emerald-50 font-bold px-1 rounded uppercase">Via Devolução Sync</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">financialContractId</span>
                  <span className="text-[9px] text-slate-400 font-sans">string</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">tipoContrato</span>
                  <span className="text-[9px] text-slate-400 font-sans">enum</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-750 font-bold">valorTotal</span>
                  <span className="text-[9px] text-emerald-500 font-sans">float</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">quantidadeParcelas</span>
                  <span className="text-[9px] text-slate-400 font-sans">int</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded max-w-full truncate col-span-1 sm:col-span-2">
                  <span className="text-slate-700">vencimentos</span>
                  <span className="text-[9px] text-slate-400 font-sans">array string dates</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-750 font-bold">statusContrato</span>
                  <span className="text-[9px] text-slate-400 font-sans">enum</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">parcelasPagas</span>
                  <span className="text-[9px] text-slate-400 font-sans">int</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">parcelasAbertas</span>
                  <span className="text-[9px] text-slate-400 font-sans">int</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700 font-bold">parcelasAtrasadas</span>
                  <span className="text-[9px] text-rose-500 font-sans">int</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">receitaEscritorio</span>
                  <span className="text-[9px] text-slate-400 font-sans">float</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-700">repasseCliente</span>
                  <span className="text-[9px] text-slate-400 font-sans">float</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                  <span className="text-slate-705">niboStatus</span>
                  <span className="text-[9px] text-slate-400 font-sans">enum</span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-emerald-50/50 text-[10px] text-slate-600 rounded flex items-start gap-1 font-sans">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>O faturamento devolve o <strong>repasseCliente</strong> para controle final e auditagem no respectivo painel BOSS de relatoria.</span>
            </div>
          </div>

        </div>
      </section>

      {/* Grid of panels (4 & 5) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* BLOCK 4: Segurança e Autenticação */}
        <section className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs flex flex-col justify-between" id="section-seguranca">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" /> 4. Segurança e Autenticação (Chaves Namespace)
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                tokenActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {tokenActive ? '✓ TOKEN ATIVO' : '✗ BLOQUEADO/REVOGADO'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal mb-3.5">
              Conexões integradoras requerem uma chave com o namespace restrito <code>X-BOSS-Financeiro-Integration-Key</code>. Não use chaves genéricas de sistema para requisições de caixa.
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Ambiente Ativo</label>
                  <div className="flex border border-slate-200 rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEnvironment('teste');
                        onLogAction('CONFIGURAÇÕES: Ambiente financeiro alternado para TESTES.', 'warning');
                      }}
                      className={`flex-1 text-[10px] py-1.5 font-bold transition-all ${
                        selectedEnvironment === 'teste' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🧪 Teste / Sandbox
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEnvironment('producao');
                        onLogAction('CONFIGURAÇÕES: Ambiente financeiro alternado para PRODUCTION LIVE.', 'info');
                      }}
                      className={`flex-1 text-[10px] py-1.5 font-bold transition-all ${
                        selectedEnvironment === 'producao' ? 'bg-emerald-600 text-white font-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      ⚡ Produção (Live)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Data de Expiração Chave</label>
                  <input 
                    type="text" 
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">Chave de Integração Financeira do Setor</label>
                <div className="relative flex">
                  <input 
                    type={showFinKey ? 'text' : 'password'} 
                    value={finApiKey}
                    readOnly
                    className="w-full bg-slate-50 text-slate-500 border border-slate-200 rounded-l px-2.5 py-1.5 focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowFinKey(!showFinKey)}
                    className="bg-slate-100 border border-l-0 border-slate-200 px-3 rounded-r text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    {showFinKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-[#0F172A] text-slate-300 p-2.5 rounded text-[10px] leading-snug border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">Demonstrativo Header HTTP Obrigatório</span>
                <span className="text-yellow-400 font-black">X-BOSS-Financeiro-Integration-Key: </span>
                <span className="text-slate-200 select-all">{finApiKey}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
            <button
              onClick={handleRevokeFinKey}
              className="text-[10px] font-bold px-3 py-1.8 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded border border-rose-200 transition-all uppercase flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Revogar Chave
            </button>
            <button
              onClick={handleCopyHeaderString}
              className="text-[10px] font-bold px-3.5 py-1.8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-all uppercase flex items-center gap-1.5"
            >
              {copiedHeaderFeedback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHeaderFeedback ? 'Copiado!' : 'Copiar Header'}
            </button>
            <button
              onClick={handleGenerateNewFinKey}
              className="text-[10px] font-black px-3.5 py-1.8 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-all uppercase flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-emerald-200" /> Gerar Nova Chave
            </button>
          </div>
        </section>

        {/* BLOCK 5: Permissões de Exibição */}
        <section className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs flex flex-col justify-between" id="section-permissoes-exibicao">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" /> 5. Controle de Permissões de Exibição
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold">ROLES RULES</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal mb-3.5">
              Assinale quais dados ou ferramentas estão visíveis para cada perfil operando em builds descentralizados do BOSS.
            </p>

            <div className="space-y-3 font-sans text-xs">
              
              {/* Administrador */}
              <div className="p-2 border border-slate-100 rounded bg-slate-50/50">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>👑 Administrador</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded uppercase">Total</span>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Acesso ilimitado e absoluto a chaves, permissões, logs brutos e cancelamentos gerais sem restrição de fluxo. (Bloqueado no mestre).
                </p>
              </div>

              {/* Financeiro */}
              <div className="p-2 border border-slate-100 rounded">
                <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>💼 Operador Financeiro</span>
                  <span className="text-[9px] text-slate-400 font-mono">Compartimentado</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                  <button
                    onClick={() => handleTogglePerm('financeiro', 'contratos')}
                    className={`p-1.5 rounded border text-center font-bold ${
                      permissions.financeiro.contratos ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    Contratos {permissions.financeiro.contratos ? '✓' : '✗'}
                  </button>
                  <button
                    onClick={() => handleTogglePerm('financeiro', 'parcelas')}
                    className={`p-1.5 rounded border text-center font-bold ${
                      permissions.financeiro.parcelas ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    Parcelas {permissions.financeiro.parcelas ? '✓' : '✗'}
                  </button>
                  <button
                    onClick={() => handleTogglePerm('financeiro', 'nibo')}
                    className={`p-1.5 rounded border text-center font-bold ${
                      permissions.financeiro.nibo ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    NIBO {permissions.financeiro.nibo ? '✓' : '✗'}
                  </button>
                  <button
                    onClick={() => handleTogglePerm('financeiro', 'comprovantes')}
                    className={`p-1.5 rounded border text-center font-bold ${
                      permissions.financeiro.comprovantes ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    Comprov. {permissions.financeiro.comprovantes ? '✓' : '✗'}
                  </button>
                </div>
              </div>

              {/* Advogado */}
              <div className="p-2 border border-slate-100 rounded">
                <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>⚖️ Advogado Responsável</span>
                  <span className="text-[9px] text-slate-400 font-mono">Restrito por Caso</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 font-sans text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleTogglePerm('advogado', 'visionPropria')}
                    className="flex items-center gap-2 p-1.5 rounded border border-slate-100 hover:bg-slate-50 text-left text-slate-700"
                  >
                    {permissions.advogado.visionPropria ? <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-350 shrink-0" />}
                    <span>Visualizar contratos dos próprios casos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePerm('advogado', 'visionGeral')}
                    className="flex items-center gap-2 p-1.5 rounded border border-slate-100 hover:bg-slate-50 text-left text-slate-700"
                  >
                    {permissions.advogado.visionGeral ? <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-350 shrink-0" />}
                    <span>Visualizar faturamento geral escritório</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                onLogAction('CONFIGURAÇÕES: Todas as diretrizes de permissões foram gravadas em cookie local.', 'success');
              }}
              className="text-[10px] font-black px-4 py-1.8 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded transition-all uppercase"
            >
              Gravar Diretrizes de Acesso
            </button>
          </div>
        </section>

      </div>

      {/* BLOCK 6: Sincronização KPI Stats */}
      <section className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs" id="section-sincronizacao">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2.5 mb-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" /> 6. Núcleo Estatístico de Integrações e Sincronização
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">CONTROLES AUTOMÁTICOS</span>
        </div>

        {/* 5 KPI Mini Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-4 font-sans text-center">
          
          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] text-slate-450 uppercase block font-bold">Importados BOSS</span>
            <span className="text-lg font-mono font-black text-slate-900 mt-1 block">{syncTotals.casosRecebidos}</span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">Casos mapeados</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] text-slate-450 uppercase block font-bold">Faturados BOSS</span>
            <span className="text-lg font-mono font-black text-slate-900 mt-1 block">{syncTotals.contratosEnviados}</span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">Contratos salvos</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] text-slate-450 uppercase block font-bold">Liberado Cliente</span>
            <span className="text-lg font-mono font-black text-slate-900 mt-1 block">{syncTotals.dadosLiberadosCliente}</span>
            <span className="text-[9px] text-cyan-600 bg-cyan-50 font-bold px-1.5 py-0.2 rounded mx-auto text-[8px] mt-1 uppercase">Celulares ativos</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] text-slate-450 uppercase block font-bold">Pendências Sync</span>
            <span className={`text-lg font-mono font-black mt-1 block ${syncTotals.pendenciasSinc > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
              {syncTotals.pendenciasSinc}
            </span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">Fila de espera</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] text-slate-450 uppercase block font-bold">Erros Integração</span>
            <span className={`text-lg font-mono font-black mt-1 block ${syncTotals.errosSinc > 0 ? 'text-rose-600 font-black animate-bounce' : 'text-slate-400'}`}>
              {syncTotals.errosSinc}
            </span>
            <span className="text-[9px] text-slate-450 font-mono mt-0.5">Pendentes reparos</span>
          </div>

        </div>

        {/* Buttons Action bar */}
        <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-3">
          <button
            onClick={handleExportSimulatedLogs}
            className="text-[10px] font-bold px-3 py-1.8 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded transition-all uppercase flex items-center gap-1"
            title="Exportar planilhas para consolidação física"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Exportar Dados de Sincronia
          </button>
          
          <button
            onClick={handleReprocessFailedQueue}
            disabled={loadingReprocessFailures}
            className="text-[10px] font-bold px-3.5 py-1.8 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded transition-all uppercase flex items-center gap-1.5"
          >
            {loadingReprocessFailures ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5" />}
            Reprocessar Falhas Pendentes
          </button>
          
          <button
            onClick={handleGlobalSyncNow}
            disabled={loadingGlobalSync}
            className="text-[10px] font-black px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-all uppercase flex items-center gap-2 shadow-xs"
          >
            {loadingGlobalSync ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-blue-200" />}
            Sincronizar Tudo Agora
          </button>
        </div>
      </section>

      {/* BLOCK 7: Logs de Conferência e Auditoria - Módulo 09 (Rastreabilidade completa de conciliações em conformidade regulatória) */}
      <ConferenceLogs 
        logs={logs}
        onAddManualLog={onAddManualLog}
        onClearLogs={onClearLogs}
      />

      {/* BLOCK 8: Integrações Futuras com cards dedicados */}
      <section className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs" id="section-futuras-integracoes">
        <div className="border-b border-slate-100 pb-2.5 mb-3.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-600" /> 8. Integrações Corporativas Segregadas (ERP & Drive)
          </h3>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal mb-4">
          Configure tokens locais, caminhos OAuth e credenciais de Sandbox para replicação de documentos em nuvem, controle interno de ERP e automações secundárias. O tráfego de dados é efetuado de forma passiva.
        </p>

        {/* Grid of future slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {futureIntegrations.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-50/50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between h-[230px]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-150 pb-1.5 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{item.name}</h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${item.color}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium font-sans">
                  {item.desc}
                </p>
              </div>

              {/* Collapsible/Interactive setup inline box */}
              {activeFutureConfigId === item.id ? (
                <div className="bg-white p-2 border border-slate-200 rounded space-y-1.5 my-1.5">
                  <label className="block text-[8px] text-slate-400 font-bold uppercase">Token de API / Credentials String</label>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      placeholder="Colar token sandbox..."
                      value={futureConfigKeys[item.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFutureConfigKeys(prev => ({ ...prev, [item.id]: val }));
                      }}
                      className="flex-1 text-[9px] border px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                    <button
                      onClick={() => handleSaveFutureIntegrationKey(item.id)}
                      className="text-[8px] bg-emerald-600 text-white px-2 rounded font-black uppercase"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-150 pt-2 text-[9px] text-slate-500 font-mono space-y-0.5 my-1.5 overflow-hidden max-h-[60px]">
                  <span className="text-[8px] font-sans font-bold uppercase text-slate-400 block">Atividades Recentes:</span>
                  {item.logs.slice(-2).map((log, idx) => (
                    <div key={idx} className="truncate text-slate-600">{log}</div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-slate-150 pt-2 flex items-center justify-between mt-auto">
                <button
                  type="button"
                  onClick={() => setActiveFutureConfigId(activeFutureConfigId === item.id ? null : item.id)}
                  className="text-[9px] text-[#1E293B] hover:bg-slate-100 py-1 px-2 border border-slate-200 rounded uppercase font-bold"
                >
                  {activeFutureConfigId === item.id ? 'Fechar' : 'Configurar Token'}
                </button>
                <button
                  type="button"
                  onClick={() => handleTestCallFutureIntegration(item.id)}
                  className="text-[9px] bg-slate-800 hover:bg-slate-900 text-white py-1 px-2.5 rounded uppercase font-black"
                >
                  Testar Conexão
                </button>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* BLOCK 9: REGRA ANTI-DUPLICAÇÃO DE DASHBOARDS EXTERNOS (ASAAS & STRIPE) */}
      <section className="bg-slate-900 text-slate-100 p-5 border border-slate-800 rounded-lg shadow-md" id="section-anti-duplicacao-financeira">
        <div className="border-b border-slate-800 pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-red-500 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                DIRETRIZ DE PROTEÇÃO TRANSACIONAL
              </span>
              <span className="text-[9px] bg-slate-800 border border-slate-700 font-mono px-2 py-0.5 rounded text-slate-300">
                REGRA ANTI-DUPLICAÇÃO
              </span>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" /> CENTRAL INTELIGENTE DE LEITURA E CONFERÊNCIA (ASAAS & STRIPE)
            </h3>
          </div>
          <div className="text-[10px] text-slate-400 max-w-sm font-sans leading-tight bg-slate-950 p-2 rounded border border-slate-850">
            <strong>Diretriz:</strong> É expressamente proibido criar novos dashboards de cadastro de clientes ou edição interna de cobranças nestas abas. Use os botões de desvio para editar direto nas plataformas oficiais.
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal mb-5">
          O Build Financeiro Giffoni BOSS funciona como espelhamento de leitura e reconciliação em tempo real. Toda e qualquer edição de clientes, cobranças, boletos, links de pagamentos, assinaturas ou renegociações é delegada exclusivamente às plataformas originais do <strong>ASAAS</strong> ou <strong>Stripe Brasil</strong> para mitigar conflito de comissões e divergência fiscal.
        </p>

        {/* The two cards representing ASAAS and Stripe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Card 1: ASAAS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded bg-blue-400"></div>
                  <h4 className="text-xs font-black text-white tracking-wider uppercase">Plataforma ASAAS</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Estado do Espelho:</span>
                  <select 
                    value={asaasStateVal} 
                    onChange={(e: any) => {
                      setAsaasStateVal(e.target.value);
                      onLogAction(`CONFIGURAÇÕES: Status do espelho ASAAS alterado para "${e.target.value}"`, 'info');
                    }}
                    className="bg-slate-900 border border-slate-750 text-white text-[10px] rounded p-1 focus:outline-none"
                  >
                    <option value="Sincronizado">Sincronizado</option>
                    <option value="Aguardando leitura">Aguardando leitura</option>
                    <option value="Divergente">Divergente</option>
                    <option value="Precisa revisar na plataforma original">Precisa revisar na plataforma original</option>
                    <option value="Erro de sincronização">Erro de sincronização</option>
                    <option value="Link externo disponível">Link externo disponível</option>
                  </select>
                </div>
              </div>

              {/* Status and expected parameters under the guidelines */}
              <div className="space-y-2 bg-slate-900/60 p-3 rounded border border-slate-850/50 font-mono text-[11px]">
                
                {/* 1. Status da conexão */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Status de Conexão:</span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={asaasStatusConexao}
                      onChange={(e: any) => setAsaasStatusConexao(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded p-0.5 focus:outline-none"
                    >
                      <option value="Conectado">● API Conectada</option>
                      <option value="Parcial">▲ Parcial (Offline logs)</option>
                      <option value="Desconectado">✖ Desconectado</option>
                    </select>
                  </div>
                </div>

                {/* 2. Última leitura */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Última Leitura Reconciliada:</span>
                  <span className="text-slate-200 font-bold">{asaasLastRead}</span>
                </div>

                {/* 3. Quantidade de cobranças lidas */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Qtd. Cobranças Lidas:</span>
                  <span className="bg-blue-950 text-blue-300 px-1.5 font-bold rounded">{asaasChargesCount} faturas</span>
                </div>

                {/* 4. Total sincronizado */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Total Sincronizado:</span>
                  <span className="text-emerald-400 font-bold">R$ {asaasTotalSynced.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* 5. Divergências encontradas */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Divergências Encontradas:</span>
                  {asaasDivergences > 0 ? (
                    <span className="bg-rose-950 text-rose-300 font-bold px-1.5 rounded animate-pulse">{asaasDivergences} inconformidades</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">✓ 0 discrepâncias</span>
                  )}
                </div>

              </div>

              {/* Estado Visual Alert Box */}
              <div className={`p-2.5 rounded border text-[10px] mt-3 flex gap-2 items-start ${
                asaasStateVal === 'Sincronizado' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900' :
                asaasStateVal === 'Aguardando leitura' ? 'bg-blue-950/40 text-blue-300 border-blue-900' :
                asaasStateVal === 'Divergente' ? 'bg-amber-950/40 text-amber-300 border-amber-900' :
                asaasStateVal === 'Precisa revisar na plataforma original' ? 'bg-purple-950/40 text-purple-300 border-purple-900' :
                asaasStateVal === 'Erro de sincronização' ? 'bg-rose-950/40 text-rose-300 border-rose-900' :
                'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block uppercase text-[9px]">Estado Atual: {asaasStateVal}</strong>
                  {asaasStateVal === 'Sincronizado' && 'Os dados de faturas do ASAAS coincidem 100% com o controle local do Giffoni BOSS.'}
                  {asaasStateVal === 'Aguardando leitura' && 'O sistema aguarda o próximo disparo do webhook passivo ou cron diário para varredura.'}
                  {asaasStateVal === 'Divergente' && 'Identificamos desacordos entre os valores liquidados. Favor clicar em "Abrir painel original" para conciliar.'}
                  {asaasStateVal === 'Precisa revisar na plataforma original' && 'Mora ou multa inconsistente. Altere diretamente na conta ASAAS (Acesse abaixo).'}
                  {asaasStateVal === 'Erro de sincronização' && 'Falha crítica no aperto de mãos TLS com asaas.com. Verifique chaves de criptografia.'}
                  {asaasStateVal === 'Link externo disponível' && 'As rotas síncronas de redirecionamento seguro estão desimpedidas para este operador.'}
                </div>
              </div>
            </div>

            {/* Inline Terminal Logs */}
            {showAsaasLogs && (
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[9px] font-mono space-y-1 text-slate-400 max-h-[85px] overflow-y-auto">
                <span className="text-slate-500 font-bold block uppercase text-[8px]">Logs de Reconciliação Passiva (ASAAS)</span>
                {asaasLogsList.map((log, idx) => (
                  <div key={idx} className="truncate border-l-2 border-blue-500 pl-1">{log}</div>
                ))}
              </div>
            )}

            {/* Action Buttons required: Sincronizar agora / Abrir painel original / Ver logs */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3">
              <button
                type="button"
                onClick={handleSyncAsaasNow}
                disabled={loadingAsaasSync || asaasStatusConexao === 'Desconectado'}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-[10px] py-2 px-1 rounded uppercase tracking-tight flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                {loadingAsaasSync ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCw className="w-3.5 h-3.5" />}
                Sincronizar
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setCurrentExternalLinkPlatform('ASAAS');
                  setShowExternalLinkModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] py-2 px-1 rounded uppercase tracking-tight flex items-center justify-center gap-1 transition-colors"
                title="Abrir no ASAAS"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Painel Original
              </button>

              <button
                type="button"
                onClick={() => setShowAsaasLogs(!showAsaasLogs)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[10px] py-2 px-1 rounded uppercase tracking-tight flex items-center justify-center gap-1 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                {showAsaasLogs ? 'Ocultar Logs' : 'Ver Logs'}
              </button>
            </div>
            
          </div>

          {/* Card 2: Stripe */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded bg-indigo-500"></div>
                  <h4 className="text-xs font-black text-white tracking-wider uppercase">Plataforma Stripe</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Estado do Espelho:</span>
                  <select 
                    value={stripeStateVal} 
                    onChange={(e: any) => {
                      setStripeStateVal(e.target.value);
                      if (e.target.value === 'Divergente') {
                        setStripeDivergences(2);
                      } else {
                        setStripeDivergences(0);
                      }
                      onLogAction(`CONFIGURAÇÕES: Status do espelho Stripe alterado para "${e.target.value}"`, 'info');
                    }}
                    className="bg-slate-900 border border-slate-750 text-white text-[10px] rounded p-1 focus:outline-none"
                  >
                    <option value="Sincronizado">Sincronizado</option>
                    <option value="Aguardando leitura">Aguardando leitura</option>
                    <option value="Divergente">Divergente</option>
                    <option value="Precisa revisar na plataforma original">Precisa revisar na plataforma original</option>
                    <option value="Erro de sincronização">Erro de sincronização</option>
                    <option value="Link externo disponível">Link externo disponível</option>
                  </select>
                </div>
              </div>

              {/* Status and expected parameters under the guidelines */}
              <div className="space-y-2 bg-slate-900/60 p-3 rounded border border-slate-850/50 font-mono text-[11px]">
                
                {/* 1. Status da conexão */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Status de Conexão:</span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={stripeStatusConexao}
                      onChange={(e: any) => setStripeStatusConexao(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded p-0.5 focus:outline-none"
                    >
                      <option value="Conectado">● API Conectada</option>
                      <option value="Parcial">▲ Parcial (Offline logs)</option>
                      <option value="Desconectado">✖ Desconectado</option>
                    </select>
                  </div>
                </div>

                {/* 2. Última leitura */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Última Leitura Reconciliada:</span>
                  <span className="text-slate-200 font-bold">{stripeLastRead}</span>
                </div>

                {/* 3. Quantidade de cobranças lidas */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Qtd. Cobranças Lidas:</span>
                  <span className="bg-indigo-950 text-indigo-300 px-1.5 font-bold rounded">{stripeChargesCount} faturas</span>
                </div>

                {/* 4. Total sincronizado */}
                <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Total Sincronizado:</span>
                  <span className="text-emerald-400 font-bold">R$ {stripeTotalSynced.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* 5. Divergências encontradas */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-450 font-sans text-[10px] uppercase font-semibold">Divergências Encontradas:</span>
                  {stripeDivergences > 0 ? (
                    <span className="bg-amber-950 text-amber-300 font-bold px-1.5 rounded animate-pulse">{stripeDivergences} inconformidades</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">✓ 0 discrepâncias</span>
                  )}
                </div>

              </div>

              {/* Estado Visual Alert Box */}
              <div className={`p-2.5 rounded border text-[10px] mt-3 flex gap-2 items-start ${
                stripeStateVal === 'Sincronizado' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900' :
                stripeStateVal === 'Aguardando leitura' ? 'bg-blue-950/40 text-blue-300 border-blue-900' :
                stripeStateVal === 'Divergente' ? 'bg-amber-950/40 text-amber-300 border-amber-900' :
                stripeStateVal === 'Precisa revisar na plataforma original' ? 'bg-purple-950/40 text-purple-300 border-purple-900' :
                stripeStateVal === 'Erro de sincronização' ? 'bg-rose-950/40 text-rose-300 border-rose-900' :
                'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block uppercase text-[9px]">Estado Atual: {stripeStateVal}</strong>
                  {stripeStateVal === 'Sincronizado' && 'Instâncias de comissionamento internacional e liquidação encontram-se reconciliados.'}
                  {stripeStateVal === 'Aguardando leitura' && 'A fila de leitura ativa do Stripe Connect está à espera de novos eventos.'}
                  {stripeStateVal === 'Divergente' && 'Identificadas 2 assinaturas com discrepâncias de comissão local (Divergente). Corrija abrindo a Stripe abaixo.'}
                  {stripeStateVal === 'Precisa revisar na plataforma original' && 'O contrato de êxito estrangeiro de faturamento exige modificação no painel da Stripe.'}
                  {stripeStateVal === 'Erro de sincronização' && 'Token restrito desativado ou webhook bloqueado temporariamente por IP.'}
                  {stripeStateVal === 'Link externo disponível' && 'Operador possui permissão mútua de navegação em painéis originais.'}
                </div>
              </div>
            </div>

            {/* Inline Terminal Logs */}
            {showStripeLogs && (
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[9px] font-mono space-y-1 text-slate-400 max-h-[85px] overflow-y-auto">
                <span className="text-slate-500 font-bold block uppercase text-[8px]">Logs de Reconciliação Passiva (Stripe)</span>
                {stripeLogsList.map((log, idx) => (
                  <div key={idx} className="truncate border-l-2 border-indigo-500 pl-1">{log}</div>
                ))}
              </div>
            )}

            {/* Action Buttons required: Sincronizar agora / Abrir painel original / Ver logs */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3">
              <button
                type="button"
                onClick={handleSyncStripeNow}
                disabled={loadingStripeSync || stripeStatusConexao === 'Desconectado'}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-[10px] py-2 px-1 rounded uppercase tracking-tight flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                {loadingStripeSync ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCw className="w-3.5 h-3.5" />}
                Sincronizar
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setCurrentExternalLinkPlatform('Stripe');
                  setShowExternalLinkModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] py-2 px-1 rounded uppercase tracking-tight flex items-center justify-center gap-1 transition-colors"
                title="Abrir no Stripe"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Painel Original
              </button>

              <button
                type="button"
                onClick={() => setShowStripeLogs(!showStripeLogs)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[10px] py-2 px-1 rounded uppercase tracking-tight flex items-center justify-center gap-1 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                {showStripeLogs ? 'Ocultar Logs' : 'Ver Logs'}
              </button>
            </div>
            
          </div>

        </div>
      </section>

      {/* FOOTNOTE DISCLAIMER */}
      <div className="p-3.5 bg-[#FAF5FF] border border-purple-200 text-purple-750 text-[11px] leading-snug rounded-lg flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Diretriz Operacional do Setor Giffoni BOSS:</span> Esta aba configura as fundações estéticas, as portas lógicas e os esquemas de validação XML/JSON para as futuras integrações. Chaves inseridas ou geradas permanecem segregadas na sandbox local para fins de demonstração visual e treinamento de equipe até a aprovação das APIs de produção.
        </div>
      </div>

      {/* MODAL PRE-VISUALIZAÇÃO PORTAL DO CLIENTE (PORTAL SMART APP PREVIEW) */}
      {showClientPreviewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl w-full max-w-sm text-left shadow-2xl relative">
            
            {/* Phone Frame Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-white block uppercase tracking-wider">PORTAL GIFFONI SMART</span>
                  <span className="text-[8px] font-mono text-cyan-400 block">VIRTUAL SIMULATOR v1.0</span>
                </div>
              </div>
              <button
                onClick={() => setShowClientPreviewModal(false)}
                className="text-slate-400 hover:text-white font-mono text-xs p-1 bg-slate-800 rounded-md"
              >
                ✖ Fechar Preview
              </button>
            </div>

            {/* Smart Screen Canvas Body */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-3 prose text-slate-100 max-h-[380px] overflow-y-auto">
              
              {/* Virtual User banner */}
              <div className="p-2.5 bg-[#1E293B] border border-cyan-500/15 rounded-lg">
                <span className="text-[8px] text-cyan-300 font-mono font-bold block uppercase tracking-widest">Acesso Cliente Codificado</span>
                <h4 className="text-xs font-bold text-slate-100 block mt-0.5">Tenda Construtora S/A</h4>
                <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                  <span>Inadimplente:</span>
                  <span className="text-emerald-400 font-bold bg-[#10B981]/15 px-1 py-0.2 rounded uppercase">Zerar Mora</span>
                </div>
              </div>

              {/* Conditional Block depending on checklist statuses */}
              {allowClientFinancial ? (
                <div className="space-y-2 text-xs">
                  <div className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">💸 Status de repasses contratuais autorizados</div>
                  
                  {/* Ledger card */}
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Total do Caso:</span>
                      <span className="font-mono font-bold text-white">R$ 150.000,00</span>
                    </div>
                    
                    {allowClientInstallments ? (
                      <div className="border-t border-slate-850 pt-1.5 space-y-1 text-[10px]">
                        <span className="text-[8px] text-slate-405 font-semibold block uppercase">Amortizações Planejadas:</span>
                        <div className="flex justify-between text-slate-300 bg-slate-950 p-1.5 rounded border border-slate-850">
                          <span>Parc. 1 (Quitada):</span>
                          <span className="text-emerald-400 font-bold font-mono">R$ 5.000,00</span>
                        </div>
                        <div className="flex justify-between text-slate-300 bg-slate-950 p-1.5 rounded border border-slate-850">
                          <span>Parc. 2 (10/06):</span>
                          <span className="text-amber-400 font-semibold font-mono">R$ 5.000,00</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-1.5 bg-slate-950 border border-slate-850 text-[9px] text-rose-300/85 text-center mt-1.5">
                        ⚠️ O detalhamento de parcelas individuais foi ocultado por diretriz do financeiro.
                      </div>
                    )}

                    {allowClientReceipts ? (
                      <div className="border-t border-slate-850 pt-1.5">
                        <span className="text-[8px] text-slate-405 font-semibold block uppercase mb-1">Comprovantes Conciliados:</span>
                        <div className="p-1.5 rounded bg-[#10B981]/10 text-[#34D399] flex items-center justify-between text-[9px] border border-[#10B981]/15">
                          <span className="truncate">comprovante_itau_34x19.pdf</span>
                          <span className="font-bold underline text-[8px] uppercase shrink-0">Baixar</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-1.5 bg-slate-950 border border-slate-850 text-[9px] text-slate-500 text-center mt-1.5">
                        ℹ️ Comprovantes de repasse ocultados no Portal do Cliente.
                      </div>
                    )}

                    {allowClientDueDateAlerts && (
                      <div className="p-1.5 rounded bg-amber-500/10 text-amber-300 text-[9px] border border-amber-500/20 text-center mt-1">
                        ⏰ Alertas automáticos de boleto ativos via Push/WhatsApp.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1C1917] p-4 text-center rounded border border-orange-500/20 space-y-1">
                  <span className="text-orange-400 font-black text-sm block">🚫 ACESSO RESTRITO</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                    Não há exibições financeiras liberadas para auditoria externa deste cliente. Contate o advogado encarregado para requisitar relatórios em PDF do General Ledger.
                  </p>
                </div>
              )}

              {/* Default persistent instructions */}
              <div className="pt-2 text-[9px] text-slate-400 leading-normal border-t border-slate-850">
                O cliente terá acesso exclusivo a este painel mediante SMS Token de autenticação sem senha, operando como uma SPA segura de alta fidelidade.
              </div>

            </div>

            {/* Simulated home indicator */}
            <div className="w-20 h-1 bg-slate-700 mx-auto rounded-full mt-4"></div>

          </div>
        </div>
      )}

      {/* MODAL REDIRECIONAMENTO SEGURO (REGRA ANTI-DUPLICAÇÃO) */}
      {showExternalLinkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md text-left shadow-2xl relative text-slate-100">
            
            <div className="flex items-start gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Desvio Seguro: Painel Original {currentExternalLinkPlatform}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
                  Diretriz Estrita de Proteção de Integridade Financeira Giffoni BOSS.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-950 rounded border border-slate-800/80 text-[11px] text-slate-350">
                <strong className="text-white block mb-1">Regra contra a Duplicação de Dashboards:</strong>
                O Build Financeiro Giffoni BOSS funciona estritamente como uma central de espelhamento passivo e reconciliação cruzada. 
                É <strong className="text-red-400">expressamente proibido</strong> efetuar qualquer edição de cadastros, assinaturas, boletos ou cobranças nesta interface local.
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono block">Instruções para o Operador:</span>
                <p className="text-[11px] text-slate-300">
                  Para efetuar as seguintes ações, utilize o botão abaixo para desviar com segurança para a plataforma oficial do <strong className="text-white">{currentExternalLinkPlatform}</strong>:
                </p>
                <ul className="list-disc pl-5 text-[11px] text-slate-400 space-y-1">
                  <li>Alterar dados cadastrais, e-mail do cliente ou CPF/CNPJ;</li>
                  <li>Inativar faturas, conceder descontos manuais ou renegociar;</li>
                  <li>Configurar links de pagamentos avulsos ou réguas automáticas;</li>
                  <li>Estornar valores liquidados sob litígio.</li>
                </ul>
              </div>
            </div>

            {/* Custom Redirect Simulation Button */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3 font-semibold text-xs">
              <button
                type="button"
                onClick={() => setShowExternalLinkModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors uppercase font-bold"
              >
                Voltar ao Giffoni BOSS
              </button>
              <a
                href={currentExternalLinkPlatform === 'ASAAS' ? 'https://www.asaas.com' : 'https://dashboard.stripe.com'}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setShowExternalLinkModal(false);
                  onLogAction(`CONFIGURAÇÕES: Operador desviou com segurança para painel original do ${currentExternalLinkPlatform}.`, 'info');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded transition-colors uppercase font-black font-sans flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir no {currentExternalLinkPlatform}
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
