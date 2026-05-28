// ============================================================
// CONFIG
// ============================================================
export const API_CONFIG = {
  model: 'gpt-4o-mini',
};

const isLocalDev = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const callAI = async (endpoint, body, forceDirect = false) => {
  const useDirect = isLocalDev || forceDirect;
  const url = useDirect ? 'https://api.openai.com/v1/chat/completions' : endpoint;
  const headers = useDirect
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` }
    : { 'Content-Type': 'application/json' };
  const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || err.error || 'Erro na API');
  }
  return response.json();
};

// ============================================================
// FORMATADORES — CPF, CNPJ, telefone
// ============================================================
const formatCPF = (v) => {
  const d = v.replace(/\D/g, '');
  if (d.length !== 11) return v;
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatCNPJ = (v) => {
  const d = v.replace(/\D/g, '');
  if (d.length !== 14) return v;
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const formatTelefone = (v) => {
  const d = v.replace(/\D/g, '');
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return v;
};

const formatDocumento = (v) => {
  if (!v) return v;
  const d = v.replace(/\D/g, '');
  if (d.length === 11) return formatCPF(v);
  if (d.length === 14) return formatCNPJ(v);
  return v;
};

const formatAnswers = (answers) => {
  const cpfFields = [
    'contratante_cpf_cnpj', 'contratado_cpf_cnpj', 'locador_cpf_cnpj', 'locatario_cpf_cnpj',
    'parte_a_cpf_cnpj', 'parte_b_cpf_cnpj', 'revelador_cpf_cnpj', 'receptor_cpf_cnpj',
    'freelancer_cpf', 'vendedor_cpf_cnpj', 'comprador_cpf_cnpj', 'empreiteiro_cpf_cnpj',
    'socio_a_cpf', 'socio_b_cpf', 'representada_cnpj', 'representante_cpf_cnpj',
    'comodante_cpf_cnpj', 'comodatario_cpf_cnpj',
  ];
  const telFields = [
    'contratante_telefone', 'contratado_telefone', 'locador_telefone', 'locatario_telefone',
    'parte_a_telefone', 'parte_b_telefone', 'revelador_telefone', 'receptor_telefone',
    'freelancer_telefone', 'vendedor_telefone', 'comprador_telefone', 'empreiteiro_telefone',
    'socio_a_telefone', 'socio_b_telefone', 'representada_telefone', 'representante_telefone',
    'comodante_telefone', 'comodatario_telefone',
  ];
  const out = { ...answers };
  cpfFields.forEach(f => { if (out[f]) out[f] = formatDocumento(out[f]); });
  telFields.forEach(f => { if (out[f]) out[f] = formatTelefone(out[f]); });
  return out;
};

// ============================================================
// TEMPLATES
// ============================================================
export const CONTRACT_TEMPLATES = {
  'prestacao-servicos': {
    title: 'Contrato de Prestação de Serviços',
    template: `
      CONTRATANTE: {contratante_nome}
      CPF/CNPJ: {contratante_cpf_cnpj}
      TELEFONE: {contratante_telefone}
      EMAIL: {contratante_email}

      CONTRATADO: {contratado_nome}
      CPF/CNPJ: {contratado_cpf_cnpj}
      TELEFONE: {contratado_telefone}
      EMAIL: {contratado_email}

      OBJETO: {descricao_servico}
      LOCAL DE PRESTAÇÃO: {local_prestacao}
      NÚMERO DE REVISÕES: {numero_revisoes}
      INSUMOS/MATERIAIS: {responsavel_insumos}
      SUBCONTRATAÇÃO PERMITIDA: {permite_subcontratacao}
      PROPRIEDADE INTELECTUAL: {propriedade_intelectual}
      ACESSOS/EQUIPAMENTOS FORNECIDOS: {acessos_fornecidos}
      CLÁUSULA DE NÃO-CONCORRÊNCIA: {nao_concorrencia}
      CANAL OFICIAL DE COMUNICAÇÃO: {canal_comunicacao}
      GARANTIA PÓS-ENTREGA: {garantia_pos_entrega}

      VALOR TOTAL: R$ {valor_total}
      FORMA DE PAGAMENTO: {forma_pagamento}
      PRAZO DE EXECUÇÃO: {prazo_execucao}

      MULTA POR ATRASO (CONTRATADO): {multa_atraso_contratado}% ao dia, limitado a {multa_limite}%
      MULTA POR RESCISÃO: {multa_rescisao}%

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'aluguel': {
    title: 'Contrato de Locação de Imóvel',
    template: `
      LOCADOR: {locador_nome}
      ESTADO CIVIL: {locador_estado_civil}
      CPF/CNPJ: {locador_cpf_cnpj}
      TELEFONE: {locador_telefone}
      EMAIL: {locador_email}

      LOCATÁRIO: {locatario_nome}
      ESTADO CIVIL: {locatario_estado_civil}
      CPF/CNPJ: {locatario_cpf_cnpj}
      TELEFONE: {locatario_telefone}
      EMAIL: {locatario_email}

      IMÓVEL: {descricao_imovel}
      ENDEREÇO: {endereco_imovel}
      MATRÍCULA DO IMÓVEL: {matricula_imovel}
      DÍVIDAS/PENDÊNCIAS DO IMÓVEL: {dividas_imovel}

      VALOR DO ALUGUEL: R$ {valor_aluguel}
      DIA DE VENCIMENTO: {dia_vencimento}
      DATA DE INÍCIO: {data_inicio}
      PRAZO DA LOCAÇÃO: {prazo_locacao} meses

      GARANTIA LOCATÍCIA: {tipo_garantia}
      RESPONSÁVEL PELO IPTU: {responsavel_iptu}
      RESPONSÁVEL PELO CONDOMÍNIO: {responsavel_condominio}
      PERMITE SUBLOCAÇÃO: {permite_sublocacao}
      PERMITE ANIMAIS: {permite_animais}
      MANUTENÇÃO ORDINÁRIA/EXTRAORDINÁRIA: {responsavel_manutencao}
      VISTORIA DE ENTRADA COM LAUDO: {vistoria_entrada}
      IMÓVEL MOBILIADO/INVENTÁRIO: {imovel_mobiliado}
      PREFERÊNCIA DE COMPRA DO LOCATÁRIO: {preferencia_compra}
      AVISO PRÉVIO PARA RESCISÃO: {aviso_previo_rescisao}

      MULTA POR ATRASO: {multa_atraso}%
      JUROS POR ATRASO: {juros_atraso}% ao mês
      CORREÇÃO MONETÁRIA: {correcao_monetaria}
      PRAZO DE TOLERÂNCIA: {prazo_tolerancia} dias

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'parceria': {
    title: 'Contrato de Parceria Comercial',
    template: `
      PARTE A: {parte_a_nome}
      CPF/CNPJ: {parte_a_cpf_cnpj}
      TELEFONE: {parte_a_telefone}
      EMAIL: {parte_a_email}

      PARTE B: {parte_b_nome}
      CPF/CNPJ: {parte_b_cpf_cnpj}
      TELEFONE: {parte_b_telefone}
      EMAIL: {parte_b_email}

      OBJETO DA PARCERIA: {objeto_parceria}
      NATUREZA JURÍDICA: {natureza_juridica}

      CONTRIBUIÇÕES DA PARTE A: {contribuicao_a}
      CONTRIBUIÇÕES DA PARTE B: {contribuicao_b}
      APORTE FINANCEIRO INICIAL: {aporte_inicial}

      PARTICIPAÇÃO NOS RESULTADOS: {participacao_resultados}
      DISTRIBUIÇÃO DE PERDAS: {distribuicao_perdas}
      PODERES DE REPRESENTAÇÃO: {poderes_representacao}
      PRESTAÇÃO DE CONTAS: {periodicidade_contas}
      LIQUIDAÇÃO EM CASO DE ENCERRAMENTO: {liquidacao_encerramento}
      DESCUMPRIMENTO GRAVE: {descumprimento_grave}
      SEGURO EMPRESARIAL: {seguro_empresarial}

      PRAZO DA PARCERIA: {prazo_parceria}
      CLÁUSULA DE NÃO-CONCORRÊNCIA: {nao_concorrencia}
      CONTA BANCÁRIA CONJUNTA: {conta_conjunta}

      MULTA POR DESCUMPRIMENTO: {multa_descumprimento}%
      MULTA POR RESCISÃO ANTECIPADA: {multa_rescisao}%

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'confidencialidade': {
    title: 'Acordo de Confidencialidade (NDA)',
    template: `
      MODALIDADE DO ACORDO: {modalidade_nda}

      PARTE REVELADORA: {revelador_nome}
      CPF/CNPJ: {revelador_cpf_cnpj}
      TELEFONE: {revelador_telefone}
      EMAIL: {revelador_email}

      PARTE RECEPTORA: {receptor_nome}
      CPF/CNPJ: {receptor_cpf_cnpj}
      TELEFONE: {receptor_telefone}
      EMAIL: {receptor_email}

      FINALIDADE DO COMPARTILHAMENTO: {finalidade_compartilhamento}
      INFORMAÇÕES CONFIDENCIAIS: {informacoes_confidenciais}
      COMPARTILHAMENTO COM TERCEIROS VINCULADOS: {compartilhamento_terceiros}
      DESTINAÇÃO AO TÉRMINO: {destinacao_termino}
      EXCEÇÕES DE CONFIDENCIALIDADE: {excecoes_confidencialidade}
      PRAZO DE CONFIDENCIALIDADE: {prazo_confidencialidade}

      MULTA POR VIOLAÇÃO: R$ {multa_violacao}
      PERDAS E DANOS: {perdas_danos}

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'trabalho-freelancer': {
    title: 'Contrato de Trabalho Freelancer',
    template: `
      CONTRATANTE: {contratante_nome}
      CPF/CNPJ: {contratante_cpf_cnpj}
      TELEFONE: {contratante_telefone}
      EMAIL: {contratante_email}

      FREELANCER: {freelancer_nome}
      CPF: {freelancer_cpf}
      REGIME FISCAL: {freelancer_regime_fiscal}
      RETENÇÃO DE IMPOSTOS: {retencao_impostos}
      TELEFONE: {freelancer_telefone}
      EMAIL: {freelancer_email}

      ESCOPO DO TRABALHO: {escopo_trabalho}
      NÚMERO DE REVISÕES INCLUSAS: {numero_revisoes}
      USO EM PORTFÓLIO: {uso_portfolio}
      CESSÃO DE DIREITOS AUTORAIS: {cessao_direitos}
      BRIEFING FORMAL: {briefing_formal}
      APROVAÇÃO SEM JUSTIFICATIVA: {aprovacao_sem_justificativa}
      DIREITOS EM CASO DE CANCELAMENTO: {direitos_cancelamento}
      FERRAMENTAS E CUSTOS OPERACIONAIS: {ferramentas_custos}
      EXCLUSIVIDADE DURANTE EXECUÇÃO: {exclusividade_execucao}

      VALOR DO PROJETO: R$ {valor_projeto}
      FORMA DE PAGAMENTO: {forma_pagamento}
      PRAZO DE ENTREGA: {prazo_entrega}

      MULTA POR ATRASO NA ENTREGA: {multa_atraso_entrega}% ao dia
      MULTA POR ATRASO NO PAGAMENTO: {multa_atraso_pagamento}% ao dia
      MULTA POR RESCISÃO: {multa_rescisao}%

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'compra-venda': {
    title: 'Contrato de Compra e Venda',
    template: `
      VENDEDOR: {vendedor_nome}
      CPF/CNPJ: {vendedor_cpf_cnpj}
      TELEFONE: {vendedor_telefone}
      EMAIL: {vendedor_email}

      COMPRADOR: {comprador_nome}
      CPF/CNPJ: {comprador_cpf_cnpj}
      TELEFONE: {comprador_telefone}
      EMAIL: {comprador_email}

      CATEGORIA DO BEM: {categoria_bem}
      BEM: {descricao_bem}
      ESTADO DE CONSERVAÇÃO: {estado_conservacao}
      DEFEITOS CONHECIDOS: {defeitos_conhecidos}
      ÔNUS OU GRAVAMES: {onus_gravames}
      COPROPRIETÁRIOS: {coproprietarios}

      VALOR DA VENDA: R$ {valor_venda}
      FORMA DE PAGAMENTO: {forma_pagamento}
      ARRAS/SINAL: {arras}
      DESPESAS DE TRANSFERÊNCIA: {despesas_transferencia}
      PRAZO DE ENTREGA DO BEM: {prazo_entrega_bem}
      DOCUMENTAÇÃO A ENTREGAR: {documentacao_entrega}
      VISTORIA FORMAL: {vistoria_formal}
      GARANTIA CONTRATUAL: {garantia_contratual}

      MULTA POR ATRASO NO PAGAMENTO: {multa_atraso_pagamento}% ao dia
      MULTA POR DESISTÊNCIA: {multa_desistencia}%

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'empreitada': {
    title: 'Contrato de Empreitada',
    template: `
      CONTRATANTE: {contratante_nome}
      CPF/CNPJ: {contratante_cpf_cnpj}
      TELEFONE: {contratante_telefone}
      EMAIL: {contratante_email}

      EMPREITEIRO: {empreiteiro_nome}
      CPF/CNPJ: {empreiteiro_cpf_cnpj}
      TELEFONE: {empreiteiro_telefone}
      EMAIL: {empreiteiro_email}
      REGISTRO PROFISSIONAL: {empreiteiro_registro}

      TIPO DE OBRA/SERVIÇO: {tipo_obra}
      DESCRIÇÃO DA OBRA: {descricao_obra}
      ENDEREÇO DA OBRA: {endereco_obra}
      MODALIDADE DA EMPREITADA: {modalidade_empreitada}

      RESPONSÁVEL PELOS MATERIAIS: {responsavel_materiais}
      RESPONSÁVEL PELOS EQUIPAMENTOS: {responsavel_equipamentos}
      SUBEMPREITADA PERMITIDA: {permite_subempreitada}
      RESPONSÁVEL PELO ART/RRT: {responsavel_art}
      SEGURO DE OBRA: {seguro_obra}
      LICENÇAS E ALVARÁS: {responsavel_licencas}

      VALOR TOTAL: R$ {valor_total}
      FORMA DE PAGAMENTO: {forma_pagamento}
      CRONOGRAMA DE MEDIÇÕES: {cronograma_medicoes}
      PRAZO DE EXECUÇÃO: {prazo_execucao}
      PRAZO DE GARANTIA DA OBRA: {prazo_garantia}

      MULTA POR ATRASO: {multa_atraso}% ao dia, limitado a {multa_limite}%
      MULTA POR RESCISÃO: {multa_rescisao}%

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'sociedade': {
    title: 'Contrato Social de Sociedade Simples',
    template: `
      SÓCIO A: {socio_a_nome}
      CPF: {socio_a_cpf}
      ESTADO CIVIL: {socio_a_estado_civil}
      TELEFONE: {socio_a_telefone}
      EMAIL: {socio_a_email}
      QUOTA: {socio_a_quota}%

      SÓCIO B: {socio_b_nome}
      CPF: {socio_b_cpf}
      ESTADO CIVIL: {socio_b_estado_civil}
      TELEFONE: {socio_b_telefone}
      EMAIL: {socio_b_email}
      QUOTA: {socio_b_quota}%

      SÓCIOS ADICIONAIS: {socios_adicionais}

      RAZÃO SOCIAL: {razao_social}
      NOME FANTASIA: {nome_fantasia}
      OBJETO SOCIAL: {objeto_social}
      SEDE: {endereco_sede}
      CAPITAL SOCIAL: R$ {capital_social}
      INTEGRALIZAÇÃO DO CAPITAL: {integralizacao_capital}

      ADMINISTRAÇÃO: {administracao}
      PODERES DO ADMINISTRADOR: {poderes_administrador}
      PRÓ-LABORE: {pro_labore}
      DISTRIBUIÇÃO DE LUCROS: {distribuicao_lucros}
      DISTRIBUIÇÃO DE PERDAS: {distribuicao_perdas}
      RETIRADA DE SÓCIOS: {retirada_socios}
      TRANSFERÊNCIA DE QUOTAS: {transferencia_quotas}
      PRAZO DA SOCIEDADE: {prazo_sociedade}
      NÃO-CONCORRÊNCIA: {nao_concorrencia}

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'representacao-comercial': {
    title: 'Contrato de Representação Comercial',
    template: `
      REPRESENTADA: {representada_nome}
      CNPJ: {representada_cnpj}
      TELEFONE: {representada_telefone}
      EMAIL: {representada_email}

      REPRESENTANTE: {representante_nome}
      CPF/CNPJ: {representante_cpf_cnpj}
      REGISTRO CORE: {representante_core}
      TELEFONE: {representante_telefone}
      EMAIL: {representante_email}

      PRODUTOS/SERVIÇOS REPRESENTADOS: {produtos_representados}
      TERRITÓRIO DE ATUAÇÃO: {territorio_atuacao}
      EXCLUSIVIDADE TERRITORIAL: {exclusividade_territorial}
      CLIENTES EXCLUÍDOS DA REPRESENTAÇÃO: {clientes_excluidos}

      COMISSÃO: {percentual_comissao}% sobre {base_calculo_comissao}
      PRAZO DE PAGAMENTO DA COMISSÃO: {prazo_pagamento_comissao}
      ESTORNO DE COMISSÃO: {estorno_comissao}
      META MÍNIMA DE VENDAS: {meta_minima}
      CONSEQUÊNCIA DE NÃO ATINGIR META: {consequencia_meta}

      PRAZO DO CONTRATO: {prazo_contrato}
      AVISO PRÉVIO PARA RESCISÃO: {aviso_previo}
      INDENIZAÇÃO POR RESCISÃO SEM JUSTA CAUSA: {indenizacao_rescisao}

      MULTA POR DESCUMPRIMENTO: {multa_descumprimento}%

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  },
  'comodato': {
    title: 'Contrato de Comodato',
    template: `
      COMODANTE: {comodante_nome}
      CPF/CNPJ: {comodante_cpf_cnpj}
      TELEFONE: {comodante_telefone}
      EMAIL: {comodante_email}

      COMODATÁRIO: {comodatario_nome}
      CPF/CNPJ: {comodatario_cpf_cnpj}
      TELEFONE: {comodatario_telefone}
      EMAIL: {comodatario_email}

      BEM EMPRESTADO: {descricao_bem}
      ESTADO DE CONSERVAÇÃO NA ENTREGA: {estado_conservacao}
      FINALIDADE DO USO: {finalidade_uso}
      LOCAL DE USO DO BEM: {local_uso}
      VISTORIA DE ENTREGA COM LAUDO: {vistoria_entrega}

      PRAZO DO COMODATO: {prazo_comodato}
      RENOVAÇÃO AUTOMÁTICA: {renovacao_automatica}
      AVISO PRÉVIO PARA DEVOLUÇÃO: {aviso_previo_devolucao}

      RESPONSÁVEL PELA MANUTENÇÃO: {responsavel_manutencao}
      RESPONSÁVEL PELO SEGURO: {responsavel_seguro}
      PERMITE SUBEMPRÉSTIMO: {permite_subemprestimo}
      PERMITE MODIFICAÇÕES NO BEM: {permite_modificacoes}

      MULTA POR DANO AO BEM: {multa_dano}
      MULTA POR ATRASO NA DEVOLUÇÃO: {multa_atraso_devolucao}% ao dia

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  }
};

// ============================================================
// CAMPOS OBRIGATÓRIOS POR CONTRATO
// ============================================================
export const FIELD_ORDER_BY_CONTRACT = {
  'prestacao-servicos': [
    'contratante_nome', 'contratante_telefone', 'contratante_email', 'contratante_cpf_cnpj',
    'contratado_nome', 'contratado_telefone', 'contratado_email', 'contratado_cpf_cnpj',
    'responsavel_insumos', 'permite_subcontratacao', 'propriedade_intelectual', 'acessos_fornecidos',
    'nao_concorrencia', 'canal_comunicacao', 'garantia_pos_entrega',
    'descricao_servico', 'local_prestacao', 'numero_revisoes',
    'valor_total', 'forma_pagamento', 'prazo_execucao',
    'multa_atraso_contratado', 'multa_limite', 'multa_rescisao',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'aluguel': [
    'locador_nome', 'locador_telefone', 'locador_email', 'locador_cpf_cnpj', 'locador_estado_civil',
    'locatario_nome', 'locatario_telefone', 'locatario_email', 'locatario_cpf_cnpj', 'locatario_estado_civil',
    'descricao_imovel', 'endereco_imovel', 'matricula_imovel', 'dividas_imovel',
    'valor_aluguel', 'dia_vencimento', 'data_inicio', 'prazo_locacao',
    'tipo_garantia', 'responsavel_iptu', 'responsavel_condominio',
    'permite_sublocacao', 'permite_animais',
    'responsavel_manutencao', 'vistoria_entrada', 'imovel_mobiliado',
    'preferencia_compra', 'aviso_previo_rescisao',
    'multa_atraso', 'juros_atraso', 'correcao_monetaria', 'prazo_tolerancia',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'parceria': [
    'parte_a_nome', 'parte_a_telefone', 'parte_a_email', 'parte_a_cpf_cnpj',
    'parte_b_nome', 'parte_b_telefone', 'parte_b_email', 'parte_b_cpf_cnpj',
    'objeto_parceria', 'natureza_juridica',
    'contribuicao_a', 'contribuicao_b', 'aporte_inicial',
    'participacao_resultados', 'distribuicao_perdas',
    'poderes_representacao', 'periodicidade_contas',
    'liquidacao_encerramento', 'descumprimento_grave', 'seguro_empresarial',
    'prazo_parceria', 'nao_concorrencia', 'conta_conjunta',
    'multa_descumprimento', 'multa_rescisao',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'confidencialidade': [
    'modalidade_nda',
    'revelador_nome', 'revelador_telefone', 'revelador_email', 'revelador_cpf_cnpj',
    'receptor_nome', 'receptor_telefone', 'receptor_email', 'receptor_cpf_cnpj',
    'finalidade_compartilhamento', 'informacoes_confidenciais',
    'compartilhamento_terceiros', 'destinacao_termino', 'excecoes_confidencialidade',
    'prazo_confidencialidade', 'multa_violacao', 'perdas_danos',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'trabalho-freelancer': [
    'contratante_nome', 'contratante_telefone', 'contratante_email', 'contratante_cpf_cnpj',
    'freelancer_nome', 'freelancer_telefone', 'freelancer_email', 'freelancer_cpf',
    'freelancer_regime_fiscal', 'retencao_impostos',
    'escopo_trabalho', 'numero_revisoes',
    'uso_portfolio', 'cessao_direitos', 'briefing_formal', 'aprovacao_sem_justificativa',
    'direitos_cancelamento', 'ferramentas_custos', 'exclusividade_execucao',
    'valor_projeto', 'forma_pagamento', 'prazo_entrega',
    'multa_atraso_entrega', 'multa_atraso_pagamento', 'multa_rescisao',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'compra-venda': [
    'vendedor_nome', 'vendedor_telefone', 'vendedor_email', 'vendedor_cpf_cnpj',
    'comprador_nome', 'comprador_telefone', 'comprador_email', 'comprador_cpf_cnpj',
    'categoria_bem', 'descricao_bem', 'estado_conservacao', 'defeitos_conhecidos',
    'onus_gravames', 'coproprietarios',
    'valor_venda', 'forma_pagamento',
    'arras', 'despesas_transferencia', 'prazo_entrega_bem',
    'documentacao_entrega', 'vistoria_formal', 'garantia_contratual',
    'multa_atraso_pagamento', 'multa_desistencia',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'empreitada': [
    'contratante_nome', 'contratante_telefone', 'contratante_email', 'contratante_cpf_cnpj',
    'empreiteiro_nome', 'empreiteiro_telefone', 'empreiteiro_email', 'empreiteiro_cpf_cnpj',
    'empreiteiro_registro',
    'tipo_obra', 'descricao_obra', 'endereco_obra', 'modalidade_empreitada',
    'responsavel_materiais', 'responsavel_equipamentos', 'permite_subempreitada',
    'responsavel_art', 'seguro_obra', 'responsavel_licencas',
    'valor_total', 'forma_pagamento', 'cronograma_medicoes', 'prazo_execucao', 'prazo_garantia',
    'multa_atraso', 'multa_limite', 'multa_rescisao',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'sociedade': [
    'socio_a_nome', 'socio_a_cpf', 'socio_a_estado_civil', 'socio_a_telefone', 'socio_a_email', 'socio_a_quota',
    'socio_b_nome', 'socio_b_cpf', 'socio_b_estado_civil', 'socio_b_telefone', 'socio_b_email', 'socio_b_quota',
    'socios_adicionais',
    'razao_social', 'nome_fantasia', 'objeto_social', 'endereco_sede',
    'capital_social', 'integralizacao_capital',
    'administracao', 'poderes_administrador', 'pro_labore',
    'distribuicao_lucros', 'distribuicao_perdas',
    'retirada_socios', 'transferencia_quotas', 'prazo_sociedade', 'nao_concorrencia',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'representacao-comercial': [
    'representada_nome', 'representada_cnpj', 'representada_telefone', 'representada_email',
    'representante_nome', 'representante_cpf_cnpj', 'representante_core', 'representante_telefone', 'representante_email',
    'produtos_representados', 'territorio_atuacao', 'exclusividade_territorial', 'clientes_excluidos',
    'percentual_comissao', 'base_calculo_comissao', 'prazo_pagamento_comissao',
    'estorno_comissao', 'meta_minima', 'consequencia_meta',
    'prazo_contrato', 'aviso_previo', 'indenizacao_rescisao',
    'multa_descumprimento',
    'modalidade_assinatura', 'cidade', 'estado'
  ],
  'comodato': [
    'comodante_nome', 'comodante_telefone', 'comodante_email', 'comodante_cpf_cnpj',
    'comodatario_nome', 'comodatario_telefone', 'comodatario_email', 'comodatario_cpf_cnpj',
    'descricao_bem', 'estado_conservacao', 'finalidade_uso', 'local_uso', 'vistoria_entrega',
    'prazo_comodato', 'renovacao_automatica', 'aviso_previo_devolucao',
    'responsavel_manutencao', 'responsavel_seguro', 'permite_subemprestimo', 'permite_modificacoes',
    'multa_dano', 'multa_atraso_devolucao',
    'modalidade_assinatura', 'cidade', 'estado'
  ]
};

const ASSINATURA_INSTRUCTION = `
PERGUNTA FINAL OBRIGATÓRIA — faça SEMPRE como penúltima pergunta:
- Pergunte: "A assinatura do contrato será presencial ou online (por plataforma digital)?"
- Se o usuário responder PRESENCIAL: pergunte a cidade e depois o estado (UF) onde o contrato será assinado
- Se o usuário responder ONLINE: NÃO pergunte cidade nem estado. Registre modalidade_assinatura como "online" e deixe cidade e estado como "não aplicável"`;

const REQUIRED_FIELDS_INSTRUCTION = {
  'prestacao-servicos': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do CONTRATANTE (quem paga pelo serviço)
2. Número de telefone do CONTRATANTE
3. Email do CONTRATANTE
4. CPF ou CNPJ do CONTRATANTE
5. Nome completo do CONTRATADO (quem presta o serviço)
6. Número de telefone do CONTRATADO
7. Email do CONTRATADO
8. CPF ou CNPJ do CONTRATADO
9. O serviço inclui compra de materiais ou insumos? Se sim, quem é responsável por esses custos — o contratante ou o contratado?
10. O contratado pode subcontratar terceiros para executar parte do serviço, ou deve executar tudo pessoalmente?
11. Quem ficará com a propriedade intelectual do resultado final (ex: design, código, texto criado)? O contratante, o contratado, ou será compartilhada?
12. O contratante deve fornecer algum acesso, credencial ou equipamento para o contratado executar o serviço? Se sim, descreva o que será fornecido. Se não, informe "nenhum".
13. O contratado pode prestar serviços para empresas concorrentes do contratante durante o contrato? (sim ou não — se não, informe por quanto tempo após o término essa restrição vale)
14. Qual canal será considerado oficial para comunicações e aprovações entre as partes? (ex: email, WhatsApp, plataforma específica)
15. Haverá garantia sobre o serviço após a entrega? Se sim, por quanto tempo o contratado responde por falhas ou vícios no que foi entregue?
16. Descrição detalhada do serviço a ser prestado
17. Local de prestação do serviço (ex: remoto, presencial no endereço X, híbrido)
18. Número de revisões inclusas no valor (ex: 2 revisões, ilimitadas, nenhuma)
19. Valor total do serviço (ex: R$ 5.000,00)
20. Forma de pagamento (ex: PIX, boleto, transferência, parcelado)
21. Prazo de execução (ex: 30 dias, 3 meses)
22. Percentual de multa por atraso na entrega pelo CONTRATADO, por dia (ex: 0,5% ao dia)
23. Limite máximo da multa por atraso (ex: 10% do valor total)
24. Percentual de multa por rescisão antecipada (ex: 20% do valor total)
${ASSINATURA_INSTRUCTION}`,
  'aluguel': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do LOCADOR (proprietário)
2. Número de telefone do LOCADOR
3. Email do LOCADOR
4. CPF ou CNPJ do LOCADOR
5. Estado civil do LOCADOR
6. Nome completo do LOCATÁRIO (inquilino)
7. Número de telefone do LOCATÁRIO
8. Email do LOCATÁRIO
9. CPF ou CNPJ do LOCATÁRIO
10. Estado civil do LOCATÁRIO
11. Descrição do imóvel (tipo, características)
12. Endereço completo do imóvel
13. Número de matrícula do imóvel no cartório
14. O imóvel possui alguma dívida pendente de IPTU, condomínio ou financiamento?
15. Valor mensal do aluguel
16. Dia do mês para vencimento (ex: dia 10)
17. Data de início da locação
18. Prazo da locação em meses
19. Tipo de garantia locatícia (ex: caução, fiador, seguro fiança, sem garantia)
20. Quem é responsável pelo pagamento do IPTU — locador ou locatário?
21. Quem é responsável pelo pagamento do condomínio — locador ou locatário?
22. É permitida sublocação do imóvel? (sim ou não)
23. É permitida a presença de animais de estimação? (sim ou não)
24. Quem é responsável pelos reparos de manutenção ordinária e extraordinária?
25. Será realizada vistoria formal com laudo fotográfico? (sim ou não)
26. O imóvel será entregue mobiliado? Haverá inventário?
27. Em caso de venda, o locatário terá direito de preferência? Em qual prazo?
28. Qual o prazo de aviso prévio para desocupação?
29. Percentual de multa por atraso no pagamento (ex: 10%)
30. Percentual de juros ao mês por atraso (ex: 1% ao mês)
31. Índice de correção monetária anual (ex: IGPM, IPCA)
32. Prazo de tolerância para pagamento em dias (ex: 5 dias)
${ASSINATURA_INSTRUCTION}`,
  'parceria': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo da PARTE A
2. Número de telefone da PARTE A
3. Email da PARTE A
4. CPF/CNPJ da PARTE A
5. Nome completo da PARTE B
6. Número de telefone da PARTE B
7. Email da PARTE B
8. CPF/CNPJ da PARTE B
9. Objeto da parceria (o que será feito em conjunto)
10. Natureza jurídica desta parceria (ex: parceria simples, SCP, joint venture)
11. Contribuição da PARTE A
12. Contribuição da PARTE B
13. Haverá aporte financeiro inicial? Se sim, qual o valor de cada parte?
14. Divisão dos resultados/lucros (ex: 50%/50%)
15. Como serão distribuídas as perdas?
16. Quem terá poderes para assinar em nome da parceria?
17. Periodicidade da prestação de contas (ex: mensal, trimestral)
18. O que acontece com os ativos em caso de encerramento?
19. O que será considerado descumprimento grave?
20. Haverá seguro empresarial? Quem contrata?
21. Prazo da parceria (ex: 12 meses, indeterminado)
22. Haverá cláusula de não-concorrência? Se sim, por quanto tempo?
23. Haverá conta bancária conjunta? (sim ou não)
24. Percentual de multa por descumprimento (ex: 10%)
25. Percentual de multa por rescisão antecipada (ex: 15%)
${ASSINATURA_INSTRUCTION}`,
  'confidencialidade': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Este acordo é unilateral ou bilateral/mútuo?
2. Nome completo da parte REVELADORA
3. Número de telefone da parte REVELADORA
4. Email da parte REVELADORA
5. CPF/CNPJ da parte REVELADORA
6. Nome completo da parte RECEPTORA
7. Número de telefone da parte RECEPTORA
8. Email da parte RECEPTORA
9. CPF/CNPJ da parte RECEPTORA
10. Finalidade do compartilhamento das informações confidenciais
11. Descrição das informações confidenciais
12. A parte receptora pode compartilhar com funcionários ou subcontratados? Com responsabilidade solidária?
13. O que fazer com os documentos ao término do prazo?
14. Há exceções à confidencialidade (informações já públicas)?
15. Prazo de confidencialidade (ex: 2 anos, 5 anos)
16. Valor da multa por violação (ex: R$ 50.000,00)
17. Além da multa, haverá cobrança de perdas e danos? (sim ou não)
${ASSINATURA_INSTRUCTION}`,
  'trabalho-freelancer': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do CONTRATANTE (cliente)
2. Número de telefone do CONTRATANTE
3. Email do CONTRATANTE
4. CPF/CNPJ do CONTRATANTE
5. Nome completo do FREELANCER
6. Número de telefone do FREELANCER
7. Email do FREELANCER
8. CPF do FREELANCER
9. O freelancer atua como MEI, PJ com CNPJ ou pessoa física?
10. Haverá retenção de impostos? Quem recolhe?
11. Escopo detalhado do trabalho
12. Quantas rodadas de revisão estão inclusas?
13. O freelancer pode exibir o trabalho em portfólio? (sim ou não)
14. A cessão dos direitos autorais é total ou apenas licença de uso?
15. O contratante fornecerá briefing formal? Em qual prazo?
16. Após quantas tentativas sem aprovação justificada o trabalho é considerado entregue?
17. Em caso de cancelamento, como ficam os direitos sobre o material produzido?
18. Haverá custos operacionais extras? Quem paga?
19. O freelancer pode trabalhar para concorrentes durante o projeto? (sim ou não)
20. Valor do projeto (ex: R$ 3.000,00)
21. Forma de pagamento
22. Prazo de entrega
23. Multa por atraso na entrega, por dia (ex: 0,5% ao dia)
24. Multa por atraso no pagamento pelo contratante, por dia
25. Percentual de multa por rescisão antecipada (ex: 20%)
${ASSINATURA_INSTRUCTION}`,
  'compra-venda': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do VENDEDOR
2. Número de telefone do VENDEDOR
3. Email do VENDEDOR
4. CPF/CNPJ do VENDEDOR
5. Nome completo do COMPRADOR
6. Número de telefone do COMPRADOR
7. Email do COMPRADOR
8. CPF/CNPJ do COMPRADOR
9. Qual é a categoria do bem sendo vendido?
10. Descrição detalhada do bem
11. Estado de conservação do bem
12. Existem defeitos conhecidos? Se sim, descreva. Se não, informe "nenhum".
13. O bem possui ônus ou gravames? (sim ou não — se sim, descreva)
14. O bem é de propriedade exclusiva do vendedor, ou há coproprietários?
15. Valor total da venda
16. Forma de pagamento
17. Haverá pagamento de sinal (arras)? Se sim, qual o valor e o tipo?
18. Quem arca com as despesas de transferência?
19. Prazo para entrega do bem
20. Quais documentos serão entregues com o bem?
21. Será realizada vistoria formal? (sim ou não)
22. Haverá garantia contratual além da legal? Se sim, por quanto tempo e o que cobre?
23. Multa por atraso no pagamento, por dia (ex: 0,5% ao dia)
24. Percentual de multa por desistência/rescisão (ex: 20%)
${ASSINATURA_INSTRUCTION}`,
  'empreitada': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do CONTRATANTE (dono da obra)
2. Número de telefone do CONTRATANTE
3. Email do CONTRATANTE
4. CPF ou CNPJ do CONTRATANTE
5. Nome completo do EMPREITEIRO
6. Número de telefone do EMPREITEIRO
7. Email do EMPREITEIRO
8. CPF ou CNPJ do EMPREITEIRO
9. O empreiteiro possui registro profissional (CREA, CAU)? Se sim, informe o número.
10. Qual é o tipo de obra ou serviço?
11. Descrição detalhada da obra
12. Endereço onde a obra será executada
13. A empreitada é por preço global ou por medição/etapas?
14. Quem fornece os materiais?
15. Quem fornece os equipamentos?
16. É permitida subempreitada? (sim ou não)
17. Quem emite a ART ou RRT?
18. Haverá seguro de obra? Quem contrata?
19. Quem obtém as licenças e alvarás?
20. Valor total da empreitada
21. Forma de pagamento
22. Como será feita a medição do avanço?
23. Prazo total para conclusão da obra
24. Prazo de garantia da obra após entrega
25. Multa por atraso na entrega, por dia
26. Limite máximo da multa por atraso
27. Percentual de multa por rescisão antecipada
${ASSINATURA_INSTRUCTION}`,
  'sociedade': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do SÓCIO A
2. CPF do SÓCIO A
3. Estado civil do SÓCIO A
4. Número de telefone do SÓCIO A
5. Email do SÓCIO A
6. Percentual de quota do SÓCIO A (ex: 50%)
7. Nome completo do SÓCIO B
8. CPF do SÓCIO B
9. Estado civil do SÓCIO B
10. Número de telefone do SÓCIO B
11. Email do SÓCIO B
12. Percentual de quota do SÓCIO B (ex: 50%)
13. Há mais sócios além do A e B? Se sim, informe os dados de cada um.
14. Razão social da empresa
15. Nome fantasia (se não houver, informe "sem nome fantasia")
16. Objeto social (o que a empresa vai fazer)
17. Endereço da sede
18. Valor do capital social
19. Como o capital será integralizado?
20. Quem administrará a empresa?
21. Quais os poderes do administrador?
22. Haverá pró-labore? Se sim, qual o valor para cada sócio?
23. Como será feita a distribuição dos lucros?
24. Como serão distribuídas as perdas?
25. O que acontece se um sócio quiser sair?
26. Um sócio pode transferir sua quota sem aprovação dos demais? (sim ou não)
27. Qual o prazo de duração da sociedade? (ex: indeterminado, 5 anos)
28. Haverá proibição de concorrência? Por quanto tempo após a saída?
${ASSINATURA_INSTRUCTION}`,
  'representacao-comercial': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome ou razão social da empresa REPRESENTADA
2. CNPJ da REPRESENTADA
3. Número de telefone da REPRESENTADA
4. Email da REPRESENTADA
5. Nome do REPRESENTANTE COMERCIAL
6. CPF ou CNPJ do REPRESENTANTE
7. O representante possui registro no CORE? Se sim, informe o número.
8. Número de telefone do REPRESENTANTE
9. Email do REPRESENTANTE
10. Quais produtos ou serviços serão representados?
11. Qual o território de atuação?
12. O representante terá exclusividade territorial? (sim ou não)
13. Há clientes excluídos da representação? Se sim, liste-os.
14. Percentual de comissão (ex: 5%)
15. A comissão é calculada sobre o quê?
16. Em qual prazo a comissão será paga?
17. Se o cliente não pagar, a comissão será estornada? (sim ou não)
18. Haverá meta mínima de vendas? Se sim, qual?
19. O que acontece se a meta não for atingida?
20. Prazo de duração do contrato
21. Prazo de aviso prévio para encerramento
22. Em caso de rescisão sem justa causa, haverá indenização? Se sim, qual o critério?
23. Percentual de multa por descumprimento
${ASSINATURA_INSTRUCTION}`,
  'comodato': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do COMODANTE (dono do bem)
2. Número de telefone do COMODANTE
3. Email do COMODANTE
4. CPF ou CNPJ do COMODANTE
5. Nome completo do COMODATÁRIO
6. Número de telefone do COMODATÁRIO
7. Email do COMODATÁRIO
8. CPF ou CNPJ do COMODATÁRIO
9. O que está sendo emprestado? Descreva com detalhes.
10. Estado de conservação do bem na entrega
11. Para qual finalidade o comodatário usará o bem?
12. Onde o bem ficará durante o comodato?
13. Será realizada vistoria formal na entrega? (sim ou não)
14. Prazo do empréstimo (ex: 30 dias, 6 meses, indeterminado)
15. O contrato se renova automaticamente? (sim ou não)
16. Com quanto tempo de antecedência o comodatário deve avisar a devolução?
17. Quem é responsável pela manutenção do bem?
18. Haverá seguro? Quem contrata?
19. É permitido subempréstimo? (sim ou não)
20. É permitido fazer modificações no bem? (sim ou não)
21. Como será calculada a indenização em caso de dano?
22. Percentual de multa por dia de atraso na devolução
${ASSINATURA_INSTRUCTION}`
};

const CONTRACT_CLAUSES = {
  'prestacao-servicos': [
    'CLÁUSULA 1ª — DO OBJETO E DO ESCOPO DOS SERVIÇOS',
    'CLÁUSULA 2ª — DAS OBRIGAÇÕES DO CONTRATADO',
    'CLÁUSULA 3ª — DAS OBRIGAÇÕES DO CONTRATANTE',
    'CLÁUSULA 4ª — DOS INSUMOS, MATERIAIS E DESPESAS OPERACIONAIS',
    'CLÁUSULA 5ª — DA SUBCONTRATAÇÃO',
    'CLÁUSULA 6ª — DO PREÇO, DA FORMA E DAS CONDIÇÕES DE PAGAMENTO',
    'CLÁUSULA 7ª — DO PRAZO DE EXECUÇÃO E DA ENTREGA',
    'CLÁUSULA 8ª — DAS REVISÕES E ALTERAÇÕES DO ESCOPO',
    'CLÁUSULA 9ª — DA GARANTIA PÓS-ENTREGA E DA RESPONSABILIDADE POR VÍCIOS',
    'CLÁUSULA 10ª — DAS PENALIDADES, DA MORA E DAS MULTAS CONTRATUAIS',
    'CLÁUSULA 11ª — DA PROPRIEDADE INTELECTUAL E DOS DIREITOS AUTORAIS',
    'CLÁUSULA 12ª — DA NÃO-CONCORRÊNCIA',
    'CLÁUSULA 13ª — DO CANAL OFICIAL DE COMUNICAÇÃO E DAS APROVAÇÕES',
    'CLÁUSULA 14ª — DA CONFIDENCIALIDADE E DO SIGILO PROFISSIONAL',
    'CLÁUSULA 15ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 16ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 17ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 18ª — DA RESCISÃO E DO DISTRATO',
    'CLÁUSULA 19ª — DAS DISPOSIÇÕES GERAIS E DA INDEPENDÊNCIA DAS CLÁUSULAS',
    'CLÁUSULA 20ª — DO FORO DE ELEIÇÃO'
  ],
  'aluguel': [
    'CLÁUSULA 1ª — DO OBJETO E DA IDENTIFICAÇÃO DO IMÓVEL',
    'CLÁUSULA 2ª — DO PRAZO, DO INÍCIO E DO TÉRMINO DA LOCAÇÃO',
    'CLÁUSULA 3ª — DO VALOR DO ALUGUEL E DA FORMA DE PAGAMENTO',
    'CLÁUSULA 4ª — DA GARANTIA LOCATÍCIA',
    'CLÁUSULA 5ª — DA CORREÇÃO MONETÁRIA E DO REAJUSTE ANUAL',
    'CLÁUSULA 6ª — DAS PENALIDADES, DA MORA E DOS ENCARGOS POR ATRASO',
    'CLÁUSULA 7ª — DAS OBRIGAÇÕES DO LOCADOR',
    'CLÁUSULA 8ª — DAS OBRIGAÇÕES DO LOCATÁRIO',
    'CLÁUSULA 9ª — DAS DESPESAS, DO IPTU E DO CONDOMÍNIO',
    'CLÁUSULA 10ª — DA SUBLOCAÇÃO E DO USO DO IMÓVEL',
    'CLÁUSULA 11ª — DAS BENFEITORIAS, REPAROS E RESPONSABILIDADES DE MANUTENÇÃO',
    'CLÁUSULA 12ª — DA VISTORIA DE ENTRADA E DO LAUDO DE CONSERVAÇÃO',
    'CLÁUSULA 13ª — DO INVENTÁRIO DE MÓVEIS E EQUIPAMENTOS',
    'CLÁUSULA 14ª — DO DIREITO DE PREFERÊNCIA DO LOCATÁRIO EM CASO DE VENDA (art. 27 Lei 8.245/91)',
    'CLÁUSULA 15ª — DA RESCISÃO ANTECIPADA E DO AVISO PRÉVIO',
    'CLÁUSULA 16ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 17ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 18ª — DA VISTORIA DE SAÍDA E DA RESTITUIÇÃO DO IMÓVEL',
    'CLÁUSULA 19ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 20ª — DO FORO DE ELEIÇÃO'
  ],
  'parceria': [
    'CLÁUSULA 1ª — DO OBJETO E DA NATUREZA JURÍDICA DA PARCERIA',
    'CLÁUSULA 2ª — DAS CONTRIBUIÇÕES E APORTES DE CADA PARTE',
    'CLÁUSULA 3ª — DA PARTICIPAÇÃO NOS RESULTADOS, LUCROS E PERDAS',
    'CLÁUSULA 4ª — DA ADMINISTRAÇÃO, REPRESENTAÇÃO E ALÇADA DE DECISÃO',
    'CLÁUSULA 5ª — DA PRESTAÇÃO DE CONTAS E DOS RELATÓRIOS FINANCEIROS',
    'CLÁUSULA 6ª — DA CONTA BANCÁRIA E DA MOVIMENTAÇÃO FINANCEIRA',
    'CLÁUSULA 7ª — DO SEGURO EMPRESARIAL',
    'CLÁUSULA 8ª — DO PRAZO E DA VIGÊNCIA',
    'CLÁUSULA 9ª — DA NÃO-CONCORRÊNCIA',
    'CLÁUSULA 10ª — DAS PENALIDADES, DA MORA E DAS MULTAS CONTRATUAIS',
    'CLÁUSULA 11ª — DA CONFIDENCIALIDADE E DO SIGILO COMERCIAL',
    'CLÁUSULA 12ª — DA PROPRIEDADE INTELECTUAL DESENVOLVIDA EM PARCERIA',
    'CLÁUSULA 13ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 14ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 15ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 16ª — DA RESCISÃO, DO DISTRATO E DA LIQUIDAÇÃO DOS ATIVOS',
    'CLÁUSULA 17ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 18ª — DO FORO DE ELEIÇÃO'
  ],
  'confidencialidade': [
    'CLÁUSULA 1ª — DO OBJETO, DA MODALIDADE E DA FINALIDADE DO ACORDO',
    'CLÁUSULA 2ª — DA DEFINIÇÃO E DO ESCOPO DAS INFORMAÇÕES CONFIDENCIAIS',
    'CLÁUSULA 3ª — DAS OBRIGAÇÕES E RESTRIÇÕES DA PARTE RECEPTORA',
    'CLÁUSULA 4ª — DO COMPARTILHAMENTO COM TERCEIROS VINCULADOS E DA RESPONSABILIDADE SOLIDÁRIA',
    'CLÁUSULA 5ª — DAS EXCEÇÕES À OBRIGAÇÃO DE CONFIDENCIALIDADE',
    'CLÁUSULA 6ª — DO PRAZO DE VIGÊNCIA E DA SOBREVIVÊNCIA DAS OBRIGAÇÕES',
    'CLÁUSULA 7ª — DA DESTINAÇÃO DAS INFORMAÇÕES AO TÉRMINO DO ACORDO',
    'CLÁUSULA 8ª — DAS PENALIDADES, DA MULTA E DAS PERDAS E DANOS',
    'CLÁUSULA 9ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 10ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 11ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 12ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 13ª — DO FORO DE ELEIÇÃO'
  ],
  'trabalho-freelancer': [
    'CLÁUSULA 1ª — DO OBJETO E DO ESCOPO DO TRABALHO',
    'CLÁUSULA 2ª — DAS OBRIGAÇÕES DO FREELANCER',
    'CLÁUSULA 3ª — DAS OBRIGAÇÕES DO CONTRATANTE',
    'CLÁUSULA 4ª — DO REGIME FISCAL E DAS OBRIGAÇÕES TRIBUTÁRIAS',
    'CLÁUSULA 5ª — DAS FERRAMENTAS, SOFTWARES E CUSTOS OPERACIONAIS',
    'CLÁUSULA 6ª — DA EXCLUSIVIDADE DURANTE A EXECUÇÃO DO PROJETO',
    'CLÁUSULA 7ª — DO VALOR, DA FORMA E DAS CONDIÇÕES DE PAGAMENTO',
    'CLÁUSULA 8ª — DO PRAZO DE ENTREGA, DAS REVISÕES E DO BRIEFING',
    'CLÁUSULA 9ª — DO CRITÉRIO DE APROVAÇÃO E DA RECUSA INJUSTIFICADA',
    'CLÁUSULA 10ª — DOS DIREITOS SOBRE O MATERIAL EM CASO DE CANCELAMENTO',
    'CLÁUSULA 11ª — DAS PENALIDADES, DA MORA E DAS MULTAS CONTRATUAIS',
    'CLÁUSULA 12ª — DA PROPRIEDADE INTELECTUAL E DA CESSÃO DE DIREITOS AUTORAIS',
    'CLÁUSULA 13ª — DO USO EM PORTFÓLIO E DA DIVULGAÇÃO DO TRABALHO',
    'CLÁUSULA 14ª — DA CONFIDENCIALIDADE E DO SIGILO PROFISSIONAL',
    'CLÁUSULA 15ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 16ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 17ª — DA AUSÊNCIA DE VÍNCULO EMPREGATÍCIO',
    'CLÁUSULA 18ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 19ª — DA RESCISÃO E DO DISTRATO',
    'CLÁUSULA 20ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 21ª — DO FORO DE ELEIÇÃO'
  ],
  'compra-venda': [
    'CLÁUSULA 1ª — DO OBJETO, DA CATEGORIA E DA DESCRIÇÃO DO BEM',
    'CLÁUSULA 2ª — DO ESTADO DE CONSERVAÇÃO E DOS DEFEITOS CONHECIDOS',
    'CLÁUSULA 3ª — DOS ÔNUS, GRAVAMES E DECLARAÇÕES DE REGULARIDADE',
    'CLÁUSULA 4ª — DO PREÇO, DAS ARRAS E DAS CONDIÇÕES DE PAGAMENTO',
    'CLÁUSULA 5ª — DAS DESPESAS DE TRANSFERÊNCIA E REGULARIZAÇÃO',
    'CLÁUSULA 6ª — DA ENTREGA, DA TRADIÇÃO E DA DOCUMENTAÇÃO DO BEM',
    'CLÁUSULA 7ª — DA VISTORIA E DO LAUDO DE INSPEÇÃO',
    'CLÁUSULA 8ª — DAS GARANTIAS LEGAIS E CONTRATUAIS (Vícios Redibitórios)',
    'CLÁUSULA 9ª — DAS PENALIDADES, DA MORA E DAS MULTAS CONTRATUAIS',
    'CLÁUSULA 10ª — DAS DECLARAÇÕES E GARANTIAS DO VENDEDOR',
    'CLÁUSULA 11ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 12ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 13ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 14ª — DA RESCISÃO E DO VENCIMENTO ANTECIPADO',
    'CLÁUSULA 15ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 16ª — DO FORO DE ELEIÇÃO'
  ],
  'empreitada': [
    'CLÁUSULA 1ª — DO OBJETO, DO TIPO E DA DESCRIÇÃO DA OBRA',
    'CLÁUSULA 2ª — DA MODALIDADE DA EMPREITADA E DO ESCOPO DOS SERVIÇOS',
    'CLÁUSULA 3ª — DAS OBRIGAÇÕES DO EMPREITEIRO',
    'CLÁUSULA 4ª — DAS OBRIGAÇÕES DO CONTRATANTE',
    'CLÁUSULA 5ª — DOS MATERIAIS, EQUIPAMENTOS E INSUMOS',
    'CLÁUSULA 6ª — DA SUBEMPREITADA',
    'CLÁUSULA 7ª — DA RESPONSABILIDADE TÉCNICA, ART/RRT E LICENÇAS',
    'CLÁUSULA 8ª — DO SEGURO DE OBRA E DE RESPONSABILIDADE CIVIL',
    'CLÁUSULA 9ª — DO PREÇO, DAS MEDIÇÕES E DAS CONDIÇÕES DE PAGAMENTO',
    'CLÁUSULA 10ª — DO PRAZO DE EXECUÇÃO E DO CRONOGRAMA',
    'CLÁUSULA 11ª — DA GARANTIA DA OBRA E DA RESPONSABILIDADE POR VÍCIOS (art. 618 CC)',
    'CLÁUSULA 12ª — DAS PENALIDADES, DA MORA E DAS MULTAS CONTRATUAIS',
    'CLÁUSULA 13ª — DA SEGURANÇA DO TRABALHO E DAS OBRIGAÇÕES TRABALHISTAS',
    'CLÁUSULA 14ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 15ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 16ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 17ª — DA RESCISÃO E DO DISTRATO',
    'CLÁUSULA 18ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 19ª — DO FORO DE ELEIÇÃO'
  ],
  'sociedade': [
    'CLÁUSULA 1ª — DA DENOMINAÇÃO, DA SEDE E DO PRAZO DE DURAÇÃO',
    'CLÁUSULA 2ª — DO OBJETO SOCIAL',
    'CLÁUSULA 3ª — DO CAPITAL SOCIAL, DAS QUOTAS E DA INTEGRALIZAÇÃO',
    'CLÁUSULA 4ª — DOS DIREITOS E OBRIGAÇÕES DOS SÓCIOS',
    'CLÁUSULA 5ª — DA ADMINISTRAÇÃO E DOS PODERES DO ADMINISTRADOR',
    'CLÁUSULA 6ª — DO PRÓ-LABORE E DA REMUNERAÇÃO DOS SÓCIOS',
    'CLÁUSULA 7ª — DA APURAÇÃO DE RESULTADOS E DA DISTRIBUIÇÃO DE LUCROS',
    'CLÁUSULA 8ª — DA DISTRIBUIÇÃO DE PERDAS E DA RESPONSABILIDADE DOS SÓCIOS',
    'CLÁUSULA 9ª — DA CESSÃO E TRANSFERÊNCIA DE QUOTAS',
    'CLÁUSULA 10ª — DA RETIRADA, EXCLUSÃO E FALECIMENTO DE SÓCIO',
    'CLÁUSULA 11ª — DA NÃO-CONCORRÊNCIA E DO SIGILO COMERCIAL',
    'CLÁUSULA 12ª — DA DISSOLUÇÃO E LIQUIDAÇÃO DA SOCIEDADE',
    'CLÁUSULA 13ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 14ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 15ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 16ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 17ª — DO FORO DE ELEIÇÃO'
  ],
  'representacao-comercial': [
    'CLÁUSULA 1ª — DO OBJETO E DA NATUREZA DA REPRESENTAÇÃO',
    'CLÁUSULA 2ª — DO TERRITÓRIO DE ATUAÇÃO E DA EXCLUSIVIDADE',
    'CLÁUSULA 3ª — DOS PRODUTOS E SERVIÇOS REPRESENTADOS',
    'CLÁUSULA 4ª — DAS OBRIGAÇÕES DO REPRESENTANTE',
    'CLÁUSULA 5ª — DAS OBRIGAÇÕES DA REPRESENTADA',
    'CLÁUSULA 6ª — DA COMISSÃO, DO CÁLCULO E DO PRAZO DE PAGAMENTO',
    'CLÁUSULA 7ª — DO ESTORNO DE COMISSÃO E DA INADIMPLÊNCIA DO CLIENTE',
    'CLÁUSULA 8ª — DAS METAS E DOS RESULTADOS MÍNIMOS',
    'CLÁUSULA 9ª — DO PRAZO DE VIGÊNCIA E DO AVISO PRÉVIO',
    'CLÁUSULA 10ª — DA RESCISÃO, DA INDENIZAÇÃO E DOS DIREITOS DO REPRESENTANTE (Lei 4.886/65)',
    'CLÁUSULA 11ª — DAS PENALIDADES E DAS MULTAS CONTRATUAIS',
    'CLÁUSULA 12ª — DA CONFIDENCIALIDADE E DO SIGILO COMERCIAL',
    'CLÁUSULA 13ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 14ª — DA ANTICORRUPÇÃO E DA CONFORMIDADE LEGAL (Lei 12.846/2013)',
    'CLÁUSULA 15ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 16ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 17ª — DO FORO DE ELEIÇÃO'
  ],
  'comodato': [
    'CLÁUSULA 1ª — DO OBJETO E DA DESCRIÇÃO DO BEM EMPRESTADO',
    'CLÁUSULA 2ª — DA FINALIDADE E DO LOCAL DE USO DO BEM',
    'CLÁUSULA 3ª — DA VISTORIA DE ENTREGA E DO ESTADO DE CONSERVAÇÃO',
    'CLÁUSULA 4ª — DO PRAZO DO COMODATO E DA RENOVAÇÃO',
    'CLÁUSULA 5ª — DAS OBRIGAÇÕES DO COMODATÁRIO',
    'CLÁUSULA 6ª — DAS OBRIGAÇÕES DO COMODANTE',
    'CLÁUSULA 7ª — DA MANUTENÇÃO E DOS REPAROS DO BEM',
    'CLÁUSULA 8ª — DO SEGURO DO BEM',
    'CLÁUSULA 9ª — DA PROIBIÇÃO DE SUBEMPRÉSTIMO E DE MODIFICAÇÕES',
    'CLÁUSULA 10ª — DA DEVOLUÇÃO DO BEM E DO AVISO PRÉVIO',
    'CLÁUSULA 11ª — DA RESPONSABILIDADE POR DANOS E DA INDENIZAÇÃO',
    'CLÁUSULA 12ª — DAS PENALIDADES E DAS MULTAS CONTRATUAIS',
    'CLÁUSULA 13ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD — Lei 13.709/2018)',
    'CLÁUSULA 14ª — DO CASO FORTUITO E DA FORÇA MAIOR',
    'CLÁUSULA 15ª — DA RESCISÃO ANTECIPADA',
    'CLÁUSULA 16ª — DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 17ª — DO FORO DE ELEIÇÃO'
  ]
};

const LEGAL_REF = {
  'prestacao-servicos': 'segundo o Código Civil Brasileiro (arts. 593 a 609) e legislação aplicável',
  'aluguel': 'segundo a Lei 8.245/91 (Lei do Inquilinato) e o Código Civil Brasileiro',
  'parceria': 'segundo o Código Civil Brasileiro e a legislação comercial aplicável',
  'confidencialidade': 'segundo o Código Civil, a Lei de Propriedade Industrial (Lei 9.279/96) e a LGPD (Lei 13.709/2018)',
  'trabalho-freelancer': 'segundo a Lei 11.196/05, LC 128/08, a Lei 9.610/98 (Direitos Autorais) e o Código Civil',
  'compra-venda': 'segundo o Código Civil Brasileiro (arts. 481 a 532) e o Código de Defesa do Consumidor',
  'empreitada': 'segundo o Código Civil Brasileiro (arts. 610 a 626), as normas da ABNT e a legislação trabalhista aplicável',
  'sociedade': 'segundo o Código Civil Brasileiro (arts. 997 a 1.038) e a legislação empresarial aplicável',
  'representacao-comercial': 'segundo a Lei 4.886/65, a Lei 8.420/92 e o Código Civil Brasileiro',
  'comodato': 'segundo o Código Civil Brasileiro (arts. 579 a 585)'
};

const SYSTEM_PROMPT = `Você é um advogado experiente que está ajudando uma pessoa a montar um contrato.

Seu trabalho é fazer perguntas simples e diretas, uma de cada vez, para coletar as informações necessárias. Fale como se estivesse conversando com alguém que não é da área jurídica — use palavras do dia a dia, frases curtas e evite termos difíceis. Quando precisar usar um termo técnico, explique brevemente o que ele significa.

REGRAS DE FORMATAÇÃO — NUNCA VIOLE:
- NUNCA use markdown: sem asteriscos (**), sem underline (__), sem hashtags (#), sem backticks
- Escreva apenas em texto simples
- Suas perguntas devem ser frases diretas e fáceis de entender

REGRAS DE CONDUÇÃO — NUNCA VIOLE:
1. Faça APENAS UMA pergunta por vez
2. Siga a lista de campos obrigatórios em ordem — não pule nenhum campo
3. NÃO gere o contrato durante a entrevista
4. NÃO invente respostas nem complete informações que o usuário não deu
5. Quando coletar TODOS os campos da lista, pergunte: "Deseja adicionar algo a mais para por no contrato?"
6. Se o usuário disser "não" ou "nada", responda EXATAMENTE: "Perfeito! Vou gerar seu contrato agora."
7. Se o usuário quiser adicionar algo, colete e repita a pergunta do passo 5
8. NUNCA encerre sem ter coletado todos os campos, incluindo telefone e email de todas as partes
9. CONFIRMAÇÃO FINAL: Após coletar todos os campos, antes de perguntar "Deseja adicionar algo a mais?", apresente um resumo com os dados principais (nomes das partes, valor, prazo) e pergunte: "Esses dados estão corretos? Posso confirmar e prosseguir?" — se o usuário confirmar, aí pergunte sobre adições.
10. REGRA DE ASSINATURA: Sempre pergunte se a assinatura será presencial ou online ANTES de pedir cidade e estado. Se online, NÃO peça cidade nem estado — vá direto para a confirmação dos dados.
11. IMPORTANTE — NÃO valide email, CPF nem CNPJ: Aceite sempre a resposta do usuário para esses campos e passe imediatamente para a próxima pergunta.`;

export const getInitialPrompt = (contractType) => {
  const prompts = {
    'prestacao-servicos': `Ótimo! Você escolheu o Contrato de Prestação de Serviços. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo do CONTRATANTE (quem vai pagar pelo serviço)?`,
    'aluguel': `Ótimo! Você escolheu o Contrato de Aluguel. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo do LOCADOR (proprietário do imóvel)?`,
    'compra-venda': `Ótimo! Você escolheu o Contrato de Compra e Venda. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo do VENDEDOR?`,
    'parceria': `Ótimo! Você escolheu o Contrato de Parceria. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo da PARTE A?`,
    'confidencialidade': `Ótimo! Você escolheu o Termo de Confidencialidade (NDA). Vou fazer algumas perguntas para montar seu contrato completo.\n\nEste acordo será unilateral (apenas uma parte recebe informações confidenciais) ou bilateral/mútuo (ambas as partes trocarão informações entre si)?`,
    'trabalho-freelancer': `Ótimo! Você escolheu o Contrato Freelancer. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo do CONTRATANTE (o cliente que vai pagar)?`,
    'empreitada': `Ótimo! Você escolheu o Contrato de Empreitada. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo do CONTRATANTE (o dono da obra)?`,
    'sociedade': `Ótimo! Você escolheu o Contrato Social de Sociedade. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo do SÓCIO A?`,
    'representacao-comercial': `Ótimo! Você escolheu o Contrato de Representação Comercial. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome ou razão social da empresa REPRESENTADA (quem fabrica ou vende o produto)?`,
    'comodato': `Ótimo! Você escolheu o Contrato de Comodato. Comodato é um empréstimo gratuito de um bem — o dono empresta sem cobrar nada por isso. Vou fazer algumas perguntas para montar seu contrato completo.\n\nQual o nome completo do COMODANTE (o dono do bem que vai emprestar)?`
  };
  return prompts[contractType] || `Ótimo! Vamos montar seu contrato.\n\nQual o nome completo da parte contratante?`;
};

const stripMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`{1,3}[^`]*`{1,3}/gs, (match) => match.replace(/`/g, ''));
};

export const sendMessageToIA = async (messages, contractType) => {
  const userResponses = messages.filter(m => m.role === 'user').length;
  const totalFields = (FIELD_ORDER_BY_CONTRACT[contractType] || []).length;
  const fieldsInstruction = REQUIRED_FIELDS_INSTRUCTION[contractType] || '';
  let progressNote = '';
  if (userResponses >= totalFields - 2) {
    progressNote = `\n\n⚠️ ATENÇÃO: Você já recebeu ${userResponses} respostas. O total de campos é ${totalFields}. Verifique se TODOS foram coletados.`;
  }
  const data = await callAI('/api/chat', {
    model: API_CONFIG.model,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}${progressNote}\n\nTipo de contrato: ${contractType}\n${fieldsInstruction}` },
      ...messages
    ],
    temperature: 0.5,
    max_tokens: 500,
  });
  return stripMarkdown(data.choices[0].message.content);
};

export const extractAnswersFromConversation = async (messages, contractType) => {
  const fieldOrder = FIELD_ORDER_BY_CONTRACT[contractType] || [];
  const conversationText = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => `${m.role === 'assistant' ? 'ASSISTENTE' : 'USUÁRIO'}: ${m.content}`)
    .join('\n\n');
  const extractionPrompt = `Leia a conversa abaixo entre um assistente jurídico e um usuário.
Extraia EXATAMENTE os valores fornecidos pelo usuário para cada campo listado.

CAMPOS ESPERADOS:
${JSON.stringify(fieldOrder, null, 2)}

CONVERSA:
${conversationText}

REGRAS ABSOLUTAS:
1. Retorne SOMENTE um objeto JSON válido — sem texto, sem markdown, sem blocos de código
2. Para cada campo, use o contexto da pergunta do assistente para identificar a qual campo pertence a resposta do usuário
3. Se um campo não foi respondido, use string vazia ""
4. NÃO invente valores — use apenas exatamente o que o usuário disse
5. O campo "modalidade_assinatura" deve ser "presencial" ou "online" conforme informado pelo usuário
6. Se a modalidade for "online", os campos "cidade" e "estado" devem ser "não aplicável"
7. Se a modalidade for "presencial", extraia cidade e estado normalmente

Formato de saída esperado: {"campo1":"valor","campo2":"outro valor"}`;
  try {
    // Extração usa /api/chat normalmente — é rápida, não vai dar timeout
    const data = await callAI('/api/chat', {
      model: API_CONFIG.model,
      messages: [
        { role: 'system', content: 'Você é um extrator de dados preciso. Retorne APENAS JSON válido, sem nenhum texto adicional, sem markdown.' },
        { role: 'user', content: extractionPrompt }
      ],
      temperature: 0,
      max_tokens: 1500,
    });
    let raw = data.choices[0].message.content.trim();
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(raw);
  } catch (err) {
    console.error('[extractAnswers] Fallback por posição:', err);
    const answers = {};
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    fieldOrder.forEach((field, index) => {
      if (index < userMessages.length) answers[field] = userMessages[index];
    });
    return answers;
  }
};

export const generateContractFromConversation = async (messages, contractType) => {
  const rawAnswers = await extractAnswersFromConversation(messages, contractType);
  const answers = formatAnswers(rawAnswers);
  const selectedTemplate = CONTRACT_TEMPLATES[contractType] || CONTRACT_TEMPLATES['prestacao-servicos'];
  const contractTitle = selectedTemplate.title.toUpperCase();
  const legalRef = LEGAL_REF[contractType] || 'segundo o Código Civil Brasileiro';
  const hoje = new Date();
  const dataAtual = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const isOnline = answers.modalidade_assinatura?.toLowerCase().includes('online');
  let filledTemplate = selectedTemplate.template;
  Object.keys(answers).forEach(key => {
    filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, 'g'), answers[key] || '');
  });
  filledTemplate = filledTemplate.replace(/{[^}]+}/g, '');
  const dataBlock = Object.entries(answers)
    .filter(([, v]) => v && v.trim() !== '')
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n');
  const clausulasList = (CONTRACT_CLAUSES[contractType] || []).map(c => `   - ${c}`).join('\n');
  const foroInstrucao = isOnline
    ? `A assinatura será realizada de forma ONLINE/DIGITAL. Na cláusula de foro de eleição, informe que as partes elegem o foro do domicílio do réu.`
    : `A assinatura será PRESENCIAL na cidade de ${answers.cidade || ''}, Estado do ${answers.estado || ''}. Use esses dados na cláusula de eleição de foro.`;
  const prompt = `Você é um Advogado Sênior especialista em Direito Civil e Empresarial Brasileiro. Elabore o instrumento contratual abaixo com rigor técnico-jurídico.

⚠️ DATA OBRIGATÓRIA: A data de assinatura deste contrato é ${dataAtual}. USE EXATAMENTE ESTA DATA.

Com base nas informações abaixo, redija um ${contractTitle} completo, ${legalRef}.

DADOS DO CONTRATO:
${dataBlock}

TEMPLATE DE REFERÊNCIA:
${filledTemplate}

INSTRUÇÕES OBRIGATÓRIAS:
1. USE SOMENTE os dados fornecidos — JAMAIS invente valores
2. NÃO utilize placeholders — substitua TUDO pelos valores reais
3. CADA CLÁUSULA deve ter cabeçalho em NEGRITO e CAIXA ALTA, parágrafos numerados (§1º, §2º...)
4. Inclua LGPD, Anticorrupção e Força Maior
5. NÃO inclua seção de assinaturas ou testemunhas
6. A frase de encerramento: "E, por estarem assim justas e contratadas, as partes firmam o presente instrumento."
7. ${foroInstrucao}

ESTRUTURA OBRIGATÓRIA:
${clausulasList}

REDIJA O CONTRATO COMPLETO AGORA.`;

  const systemMessages = [
    { role: 'system', content: 'Você é um Advogado Sênior especialista em Direito Civil e Empresarial com 20+ anos de experiência. Redija contratos profissionais, extensos e juridicamente impecáveis. NUNCA use placeholders. NUNCA invente dados. NUNCA mencione testemunhas.' },
    { role: 'user', content: prompt }
  ];

  let contractResponse;
  if (isLocalDev) {
    contractResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` },
      body: JSON.stringify({ model: API_CONFIG.model, messages: systemMessages, temperature: 0.2, max_tokens: 8000, stream: true }),
    });
  } else {
    contractResponse = await fetch('/api/generate-contract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: API_CONFIG.model, messages: systemMessages, temperature: 0.2, max_tokens: 8000 }),
    });
  }

  if (!contractResponse.ok) {
    const err = await contractResponse.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || 'Erro ao gerar contrato');
  }

  const reader = contractResponse.body.getReader();
  const decoder = new TextDecoder();
  let contractText = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      const t = line.trim();
      if (!t || t === 'data: [DONE]' || !t.startsWith('data: ')) continue;
      try {
        const json = JSON.parse(t.slice(6));
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) contractText += delta;
      } catch (_e) { /* ignora linha inválida */ }
    }
  }

  let contract = contractText;
  contract = contract.replace(/\[[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ\s_]+\]/gi, '');
  contract = contract.replace(/\{[^}]+\}/g, '');
  Object.keys(answers).forEach(key => {
    const value = answers[key] || '';
    [new RegExp(`{${key}}`, 'gi'), new RegExp(`\\[${key}\\]`, 'gi')]
      .forEach(p => { contract = contract.replace(p, value); });
  });
  return contract;
};