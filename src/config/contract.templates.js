// ============================================================
// contract.templates.js
// Templates de dados por tipo de contrato e ordem dos campos
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

      VALOR TOTAL: {valor_total}
      FORMA DE PAGAMENTO: {forma_pagamento}
      PRAZO DE EXECUÇÃO: {prazo_execucao}

      MULTA FIXA POR ATRASO (CONTRATADO): {multa_atraso_fixa_contratado}
      MULTA POR ATRASO (CONTRATADO): {multa_atraso_contratado} ao dia, limitado a {multa_limite}
      MULTA POR RESCISÃO: {multa_rescisao}

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

      VALOR DO ALUGUEL: {valor_aluguel}
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

      MULTA POR ATRASO: {multa_atraso}
      JUROS POR ATRASO: {juros_atraso} ao mês
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

      MULTA POR DESCUMPRIMENTO: {multa_descumprimento}
      MULTA POR RESCISÃO ANTECIPADA: {multa_rescisao}

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

      MULTA POR VIOLAÇÃO: {multa_violacao}
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

      VALOR DO PROJETO: {valor_projeto}
      FORMA DE PAGAMENTO: {forma_pagamento}
      PRAZO DE ENTREGA: {prazo_entrega}

      MULTA FIXA POR ATRASO NA ENTREGA: {multa_atraso_fixa_entrega}
      MULTA POR ATRASO NA ENTREGA: {multa_atraso_entrega} ao dia
      MULTA FIXA POR ATRASO NO PAGAMENTO: {multa_atraso_fixa_pagamento}
      MULTA POR ATRASO NO PAGAMENTO: {multa_atraso_pagamento} ao dia
      MULTA POR RESCISÃO: {multa_rescisao}

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

      VALOR DA VENDA: {valor_venda}
      FORMA DE PAGAMENTO: {forma_pagamento}
      ARRAS/SINAL: {arras}
      DESPESAS DE TRANSFERÊNCIA: {despesas_transferencia}
      PRAZO DE ENTREGA DO BEM: {prazo_entrega_bem}
      DOCUMENTAÇÃO A ENTREGAR: {documentacao_entrega}
      VISTORIA FORMAL: {vistoria_formal}
      GARANTIA CONTRATUAL: {garantia_contratual}

      MULTA FIXA POR ATRASO NO PAGAMENTO: {multa_atraso_fixa_pagamento}
      MULTA POR ATRASO NO PAGAMENTO: {multa_atraso_pagamento} ao dia
      MULTA POR DESISTÊNCIA: {multa_desistencia}

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

      VALOR TOTAL: {valor_total}
      FORMA DE PAGAMENTO: {forma_pagamento}
      CRONOGRAMA DE MEDIÇÕES: {cronograma_medicoes}
      PRAZO DE EXECUÇÃO: {prazo_execucao}
      PRAZO DE GARANTIA DA OBRA: {prazo_garantia}

      MULTA FIXA POR ATRASO: {multa_atraso_fixa}
      MULTA POR ATRASO: {multa_atraso} ao dia, limitado a {multa_limite}
      MULTA POR RESCISÃO: {multa_rescisao}

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
      QUOTA: {socio_a_quota}

      SÓCIO B: {socio_b_nome}
      CPF: {socio_b_cpf}
      ESTADO CIVIL: {socio_b_estado_civil}
      TELEFONE: {socio_b_telefone}
      EMAIL: {socio_b_email}
      QUOTA: {socio_b_quota}

      SÓCIOS ADICIONAIS: {socios_adicionais}

      RAZÃO SOCIAL: {razao_social}
      NOME FANTASIA: {nome_fantasia}
      OBJETO SOCIAL: {objeto_social}
      SEDE: {endereco_sede}
      CAPITAL SOCIAL: {capital_social}
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

      COMISSÃO: {percentual_comissao} sobre {base_calculo_comissao}
      PRAZO DE PAGAMENTO DA COMISSÃO: {prazo_pagamento_comissao}
      ESTORNO DE COMISSÃO: {estorno_comissao}
      META MÍNIMA DE VENDAS: {meta_minima}
      CONSEQUÊNCIA DE NÃO ATINGIR META: {consequencia_meta}

      PRAZO DO CONTRATO: {prazo_contrato}
      AVISO PRÉVIO PARA RESCISÃO: {aviso_previo}
      INDENIZAÇÃO POR RESCISÃO SEM JUSTA CAUSA: {indenizacao_rescisao}

      MULTA POR DESCUMPRIMENTO: {multa_descumprimento}

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
      MULTA FIXA POR ATRASO NA DEVOLUÇÃO: {multa_atraso_fixa_devolucao}
      MULTA POR ATRASO NA DEVOLUÇÃO: {multa_atraso_devolucao} ao dia

      MODALIDADE DE ASSINATURA: {modalidade_assinatura}
      CIDADE: {cidade}
      ESTADO: {estado}
    `
  }
};

export const FIELD_ORDER_BY_CONTRACT = {
  'prestacao-servicos': [
    'contratante_nome', 'contratante_telefone', 'contratante_email', 'contratante_cpf_cnpj',
    'contratado_nome', 'contratado_telefone', 'contratado_email', 'contratado_cpf_cnpj',
    'responsavel_insumos', 'permite_subcontratacao', 'propriedade_intelectual', 'acessos_fornecidos',
    'nao_concorrencia', 'canal_comunicacao', 'garantia_pos_entrega',
    'descricao_servico', 'local_prestacao', 'numero_revisoes',
    'valor_total', 'forma_pagamento', 'prazo_execucao',
    'multa_atraso_fixa_contratado', 'multa_atraso_contratado', 'multa_limite', 'multa_rescisao',
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
    'multa_atraso_fixa_entrega', 'multa_atraso_entrega',
    'multa_atraso_fixa_pagamento', 'multa_atraso_pagamento', 'multa_rescisao',
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
    'multa_atraso_fixa_pagamento', 'multa_atraso_pagamento', 'multa_desistencia',
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
    'multa_atraso_fixa', 'multa_atraso', 'multa_limite', 'multa_rescisao',
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
    'multa_dano', 'multa_atraso_fixa_devolucao', 'multa_atraso_devolucao',
    'modalidade_assinatura', 'cidade', 'estado'
  ]
};