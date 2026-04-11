export const API_CONFIG = {
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo-16k',
};

// ============================================================
// TEMPLATES — espelham exatamente todos os campos coletados
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
    'cidade', 'estado'
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
    'cidade', 'estado'
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
    'cidade', 'estado'
  ],
  'confidencialidade': [
    'modalidade_nda',
    'revelador_nome', 'revelador_telefone', 'revelador_email', 'revelador_cpf_cnpj',
    'receptor_nome', 'receptor_telefone', 'receptor_email', 'receptor_cpf_cnpj',
    'finalidade_compartilhamento', 'informacoes_confidenciais',
    'compartilhamento_terceiros', 'destinacao_termino', 'excecoes_confidencialidade',
    'prazo_confidencialidade', 'multa_violacao', 'perdas_danos',
    'cidade', 'estado'
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
    'cidade', 'estado'
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
    'cidade', 'estado'
  ]
};

// ============================================================
// LISTA DE CAMPOS PARA O SYSTEM PROMPT DE COLETA
// ============================================================
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
15. Haverá garantia sobre o serviço após a entrega? Se sim, por quanto tempo o contratado responde por falhas ou vícios no que foi entregue? (ex: 90 dias, 6 meses — se não houver garantia além da legal, informe "somente garantia legal")
16. Descrição detalhada do serviço a ser prestado
17. Local de prestação do serviço (ex: remoto, presencial no endereço X, híbrido)
18. Número de revisões inclusas no valor (ex: 2 revisões, ilimitadas, nenhuma)
19. Valor total do serviço (ex: R$ 5.000,00)
20. Forma de pagamento (ex: PIX, boleto, transferência, parcelado)
21. Prazo de execução (ex: 30 dias, 3 meses)
22. Percentual de multa por atraso na entrega pelo CONTRATADO, por dia (ex: 0,5% ao dia)
23. Limite máximo da multa por atraso (ex: 10% do valor total)
24. Percentual de multa por rescisão antecipada (ex: 20% do valor total)
25. Cidade onde o contrato será assinado
26. Estado (UF)`,

  'aluguel': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do LOCADOR (proprietário)
2. Número de telefone do LOCADOR
3. Email do LOCADOR
4. CPF ou CNPJ do LOCADOR
5. Estado civil do LOCADOR (se casado, o cônjuge também precisará assinar o contrato)
6. Nome completo do LOCATÁRIO (inquilino)
7. Número de telefone do LOCATÁRIO
8. Email do LOCATÁRIO
9. CPF ou CNPJ do LOCATÁRIO
10. Estado civil do LOCATÁRIO (se casado, o cônjuge também precisará assinar o contrato)
11. Descrição do imóvel (tipo, características)
12. Endereço completo do imóvel
13. Qual o número de matrícula do imóvel no cartório de registro de imóveis?
14. O imóvel possui alguma dívida pendente de IPTU, condomínio ou financiamento? (sim ou não — se sim, descreva)
15. Valor mensal do aluguel
16. Dia do mês para vencimento (ex: dia 10)
17. Data de início da locação
18. Prazo da locação em meses
19. Tipo de garantia locatícia (ex: caução em dinheiro, fiador/avalista, seguro fiança, título de capitalização, sem garantia)
20. Quem é responsável pelo pagamento do IPTU — locador ou locatário?
21. Quem é responsável pelo pagamento do condomínio, se houver — locador ou locatário?
22. É permitida sublocação do imóvel? (sim ou não)
23. É permitida a presença de animais de estimação? (sim ou não)
24. Quem é responsável pelos reparos de manutenção ordinária do imóvel (pequenos consertos do dia a dia)? E pelos reparos extraordinários (estruturais, elétricos, hidráulicos)? (ex: manutenção ordinária fica com o locatário e extraordinária com o locador)
25. Será realizada vistoria formal do imóvel antes da entrega das chaves, com laudo fotográfico? (sim ou não)
26. O imóvel será entregue mobiliado? Se sim, haverá inventário de móveis e equipamentos assinado pelas partes? (sim ou não — se não mobiliado, informe "não mobiliado")
27. Em caso de venda do imóvel durante a locação, o locatário terá direito de preferência para compra? Em qual prazo deverá manifestar interesse após ser notificado? (ex: sim, 30 dias / não haverá preferência)
28. Qual o prazo de aviso prévio que o locatário deve dar ao locador para desocupar o imóvel antes do término do contrato? E em quais situações o locador pode retomar o imóvel antecipadamente? (ex: locatário deve avisar com 30 dias de antecedência)
29. Percentual de multa por atraso no pagamento (ex: 10%)
30. Percentual de juros ao mês por atraso (ex: 1% ao mês)
31. Índice de correção monetária anual (ex: IGPM, IPCA, INPC)
32. Prazo de tolerância para pagamento em dias (ex: 5 dias)
33. Cidade onde o contrato será assinado
34. Estado (UF)`,

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
10. Qual é a natureza jurídica desta parceria? (ex: parceria operacional simples sem personalidade jurídica, sociedade em conta de participação — SCP, joint venture com CNPJ próprio)
11. Contribuição da PARTE A (o que ela entra com — capital, conhecimento, estrutura, clientes etc.)
12. Contribuição da PARTE B (o que ela entra com)
13. Haverá aporte financeiro inicial de cada parte? Se sim, qual o valor e o prazo para cada uma? (se não houver, informe "sem aporte inicial")
14. Divisão dos resultados/lucros (ex: 50%/50%, 60%/40%)
15. Como serão distribuídas as perdas em caso de prejuízo? (ex: na mesma proporção dos lucros)
16. Quem terá poderes para assinar contratos e compromissos financeiros em nome da parceria? Há algum limite de valor para decisões unilaterais?
17. Com qual periodicidade será feita a prestação de contas e apresentação de relatórios financeiros entre as partes? (ex: mensalmente, trimestralmente)
18. O que acontece com os clientes, contratos em andamento e ativos da parceria em caso de encerramento? Como será feita a divisão?
19. O que será considerado descumprimento grave, capaz de ensejar rescisão imediata sem pagamento de multa? (ex: desvio de recursos, violação de sigilo, concorrência desleal)
20. Haverá seguro empresarial cobrindo a atividade da parceria? Se sim, quem contrata e quem arca com o custo? (se não houver, informe "sem seguro empresarial")
21. Prazo da parceria (ex: 12 meses, 2 anos, indeterminado)
22. Haverá cláusula de não-concorrência? Se sim, por quanto tempo e em qual área? (ex: sim, 2 anos na área de design gráfico / não)
23. Haverá conta bancária conjunta para movimentação dos recursos da parceria? (sim ou não)
24. Percentual de multa por descumprimento das obrigações (ex: 10%)
25. Percentual de multa por rescisão antecipada (ex: 15%)
26. Cidade onde o contrato será assinado
27. Estado (UF)`,

  'confidencialidade': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Este acordo é unilateral (apenas uma parte recebe informações confidenciais) ou bilateral/mútuo (ambas as partes trocarão informações confidenciais entre si)?
2. Nome completo da parte REVELADORA
3. Número de telefone da parte REVELADORA
4. Email da parte REVELADORA
5. CPF/CNPJ da parte REVELADORA
6. Nome completo da parte RECEPTORA
7. Número de telefone da parte RECEPTORA
8. Email da parte RECEPTORA
9. CPF/CNPJ da parte RECEPTORA
10. Qual é a finalidade do compartilhamento das informações confidenciais? (ex: negociação de parceria, prestação de serviços, avaliação de investimento)
11. Descrição das informações confidenciais que serão compartilhadas
12. A parte receptora poderá compartilhar as informações confidenciais com seus próprios funcionários, sócios ou subcontratados para fins de análise? Se sim, ela será solidariamente responsável por qualquer violação cometida por eles? (ex: sim, com responsabilidade solidária / não é permitido compartilhamento)
13. Ao término do prazo de confidencialidade, o que deverá ser feito com os documentos, arquivos e dados confidenciais recebidos? (ex: devolvidos à parte reveladora, destruídos com confirmação por escrito, mantidos em arquivo interno restrito)
14. Há informações que, mesmo relacionadas ao objeto deste acordo, já são de domínio público ou poderão se tornar públicas por meio lícito? Essas informações estarão excluídas da obrigação de sigilo? (ex: sim, informações já publicadas em meios oficiais / não há exceções)
15. Prazo de confidencialidade (ex: 2 anos, 5 anos)
16. Valor da multa por violação da confidencialidade (ex: R$ 50.000,00)
17. As perdas e danos também serão cobradas além da multa? (sim ou não)
18. Cidade onde o contrato será assinado
19. Estado (UF)`,

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
9. O freelancer atua como MEI, pessoa jurídica com CNPJ próprio ou pessoa física sem CNPJ?
10. Haverá retenção de impostos na nota fiscal emitida pelo freelancer (ISS, PIS, COFINS, CSLL, IR)? Quem é responsável pelo recolhimento — contratante ou freelancer?
11. Escopo detalhado do trabalho (o que será entregue)
12. Quantas rodadas de revisão estão inclusas no valor? (ex: 2 revisões, 3 revisões, ilimitadas)
13. O freelancer poderá exibir este trabalho em seu portfólio pessoal ou divulgá-lo nas redes sociais após a conclusão? (sim ou não — se não, por quanto tempo essa restrição vale)
14. A cessão dos direitos autorais sobre o trabalho é total e definitiva (o contratante passa a ser o único titular) ou é apenas uma licença de uso? Se licença, informe o prazo e o território.
15. O contratante fornecerá um briefing formal por escrito antes do início do trabalho? Em qual prazo após a assinatura do contrato?
16. Caso o contratante não aprove a entrega sem apresentar justificativa técnica objetiva, após quantas tentativas de ajuste o freelancer poderá considerar o trabalho entregue e exigir o pagamento integral?
17. Em caso de cancelamento pelo contratante após início do trabalho, como ficam os direitos sobre o material produzido até então? (ex: o freelancer retém os direitos / o contratante recebe o que foi produzido proporcionalmente ao valor pago)
18. O freelancer utilizará ferramentas, softwares ou licenças pagas especificamente para executar este trabalho? Se sim, quem arca com esses custos — o freelancer ou o contratante? (se não houver custos extras, informe "sem custos operacionais adicionais")
19. Durante a execução deste projeto, o freelancer pode trabalhar em projetos concorrentes ou similares para outros clientes? (sim ou não — se não, informe por quanto tempo essa restrição vale após o término)
20. Valor do projeto (ex: R$ 3.000,00)
21. Forma de pagamento (ex: 50% na assinatura e 50% na entrega)
22. Prazo de entrega (ex: 30 dias após assinatura)
23. Percentual de multa por atraso na entrega, por dia (ex: 0,5% ao dia)
24. Percentual de multa por atraso no pagamento pelo contratante, por dia (ex: 0,5% ao dia)
25. Percentual de multa por rescisão antecipada (ex: 20%)
26. Cidade onde o contrato será assinado
27. Estado (UF)`,

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
9. Qual é a categoria do bem sendo vendido? (ex: imóvel, veículo, equipamento, maquinário, eletrônico, mercadoria, outro — descreva)
10. Descrição detalhada do bem (o que está sendo vendido)
11. Estado de conservação do bem (ex: novo, seminovo, usado em bom estado, usado com desgaste)
12. Existem defeitos conhecidos no bem? Se sim, descreva-os. Se não, informe "nenhum defeito conhecido".
13. O bem possui alienação fiduciária, financiamento em aberto, penhora, hipoteca ou qualquer outro ônus ou gravame? (sim ou não — se sim, descreva e informe se será regularizado antes ou na data da transferência)
14. O bem é de propriedade exclusiva do vendedor, ou há coproprietários, herdeiros ou cônjuge que também precisará assinar? (se houver, informe os dados)
15. Valor total da venda
16. Forma de pagamento
17. Haverá pagamento de sinal (arras) no ato da assinatura? Se sim, qual o valor? Essas arras são confirmatórias (apenas garantem o negócio) ou penitenciais (quem desistir perde o sinal ou devolve em dobro)? (se não houver sinal, informe "sem arras")
18. Quem arca com as despesas de transferência e regularização do bem? (ex: vendedor, comprador ou dividido entre ambos)
19. Prazo para entrega do bem (ex: na assinatura, 7 dias, 30 dias)
20. Quais documentos serão entregues junto com o bem para comprovar sua regularidade e titularidade? (descreva livremente conforme o tipo do bem)
21. Será realizada vistoria ou inspeção formal do bem antes da assinatura, com laudo descritivo? (sim ou não)
22. Haverá garantia contratual além da garantia legal? Se sim, por quanto tempo e o que ela cobre? (ex: sim, 6 meses cobrindo defeitos de funcionamento / somente garantia legal)
23. Percentual de multa por atraso no pagamento, por dia (ex: 0,5% ao dia)
24. Percentual de multa por desistência/rescisão (ex: 20% do valor)
25. Cidade onde o contrato será assinado
26. Estado (UF)`
};

// ============================================================
// CLÁUSULAS PROFISSIONAIS POR CONTRATO
// ============================================================
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
  ]
};

const LEGAL_REF = {
  'prestacao-servicos': 'segundo o Código Civil Brasileiro (arts. 593 a 609) e legislação aplicável',
  'aluguel': 'segundo a Lei 8.245/91 (Lei do Inquilinato) e o Código Civil Brasileiro',
  'parceria': 'segundo o Código Civil Brasileiro e a legislação comercial aplicável',
  'confidencialidade': 'segundo o Código Civil, a Lei de Propriedade Industrial (Lei 9.279/96) e a LGPD (Lei 13.709/2018)',
  'trabalho-freelancer': 'segundo a Lei 11.196/05, LC 128/08, a Lei 9.610/98 (Direitos Autorais) e o Código Civil',
  'compra-venda': 'segundo o Código Civil Brasileiro (arts. 481 a 532) e o Código de Defesa do Consumidor'
};

// ============================================================
// SYSTEM PROMPT — coleta de dados
// ============================================================
const SYSTEM_PROMPT = `Você é um Advogado Especialista em Direito Civil e Contratos Empresariais, com mais de 20 anos de experiência em escritório de advocacia sênior.

Conduza uma entrevista técnica, profissional e objetiva para coletar todas as informações necessárias à elaboração de um instrumento contratual juridicamente válido e robusto.

REGRAS ABSOLUTAS DE FORMATAÇÃO — NUNCA VIOLE:
- NUNCA use markdown nas suas respostas: sem asteriscos (**), sem underline (__), sem hashtags (#), sem backticks
- Escreva APENAS em texto puro e simples
- Suas perguntas devem ser frases diretas, sem nenhum símbolo especial antes ou depois

REGRAS ABSOLUTAS DE CONDUÇÃO — NUNCA VIOLE:
1. Faça APENAS UMA pergunta por vez, de forma clara e direta
2. Siga RIGOROSAMENTE a lista de campos obrigatórios fornecida — não pule NENHUM campo, incluindo telefone e email
3. NÃO gere o contrato durante a entrevista
4. NÃO antecipe respostas nem invente valores
5. Somente após coletar TODOS os campos da lista, pergunte: "Deseja adicionar algo a mais para por no contrato ?"
6. Aguarde a resposta. Se o usuário disser "não" ou "nada", responda EXATAMENTE: "Perfeito! Vou gerar seu contrato agora."
7. Se o usuário quiser adicionar informações, colete-as e repita a pergunta do passo 5
8. NUNCA encerre sem ter coletado todos os campos da lista, incluindo telefone e email de todas as partes`;

// ============================================================
// PROMPT INICIAL — sem markdown
// ============================================================
export const getInitialPrompt = (contractType) => {
  const prompts = {
    'prestacao-servicos': `Ótimo! Você escolheu o Contrato de Prestação de Serviços. Vou fazer algumas perguntas para montar seu contrato completo.

Qual o nome completo do CONTRATANTE (quem vai pagar pelo serviço)?`,

    'aluguel': `Ótimo! Você escolheu o Contrato de Aluguel. Vou fazer algumas perguntas para montar seu contrato completo.

Qual o nome completo do LOCADOR (proprietário do imóvel)?`,

    'compra-venda': `Ótimo! Você escolheu o Contrato de Compra e Venda. Vou fazer algumas perguntas para montar seu contrato completo.

Qual o nome completo do VENDEDOR?`,

    'parceria': `Ótimo! Você escolheu o Contrato de Parceria. Vou fazer algumas perguntas para montar seu contrato completo.

Qual o nome completo da PARTE A?`,

    'confidencialidade': `Ótimo! Você escolheu o Termo de Confidencialidade (NDA). Vou fazer algumas perguntas para montar seu contrato completo.

Este acordo será unilateral (apenas uma parte recebe informações confidenciais) ou bilateral/mútuo (ambas as partes trocarão informações entre si)?`,

    'trabalho-freelancer': `Ótimo! Você escolheu o Contrato Freelancer. Vou fazer algumas perguntas para montar seu contrato completo.

Qual o nome completo do CONTRATANTE (o cliente que vai pagar)?`
  };
  return prompts[contractType] || `Ótimo! Vamos montar seu contrato.\n\nQual o nome completo da parte contratante?`;
};

// ============================================================
// HELPER — remove markdown residual da resposta da IA
// ============================================================
const stripMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`{1,3}[^`]*`{1,3}/gs, (match) => match.replace(/`/g, ''));
};

// ============================================================
// ENVIO DE MENSAGEM PARA A IA (coleta)
// ============================================================
export const sendMessageToIA = async (messages, contractType) => {
  if (!API_CONFIG.openaiApiKey) {
    throw new Error('Chave da API não configurada. Verifique o arquivo .env');
  }

  const userResponses = messages.filter(m => m.role === 'user').length;
  const totalFields = (FIELD_ORDER_BY_CONTRACT[contractType] || []).length;
  const fieldsInstruction = REQUIRED_FIELDS_INSTRUCTION[contractType] || '';

  let progressNote = '';
  if (userResponses >= totalFields - 1) {
    progressNote = `\n\n⚠️ ATENÇÃO: Você já recebeu ${userResponses} respostas. O total de campos é ${totalFields}. Verifique se TODOS foram coletados antes de perguntar sobre informações adicionais. NÃO encerre antes de coletar todos, incluindo telefone e email de cada parte.`;
  }

  try {
    const response = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: `${SYSTEM_PROMPT}${progressNote}\n\nTipo de contrato: ${contractType}\n${fieldsInstruction}`
          },
          ...messages
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro ao comunicar com a IA');
    }

    const data = await response.json();
    return stripMarkdown(data.choices[0].message.content);
  } catch (error) {
    console.error('Erro na IA:', error);
    throw error;
  }
};

// ============================================================
// EXTRAÇÃO DE DADOS VIA IA (JSON estruturado)
// ============================================================
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
5. Os campos "cidade" e "estado" são SOMENTE para eleição de foro — não confunda com endereço do imóvel ou outros campos
6. Os campos de telefone e email devem ser extraídos corretamente para cada parte
7. O campo "categoria_bem" deve refletir exatamente o tipo de bem informado pelo usuário (ex: veículo, imóvel, equipamento, maquinário etc.)
8. O campo "modalidade_nda" deve ser "unilateral" ou "bilateral/mútuo" conforme informado
9. O campo "garantia_pos_entrega" deve refletir exatamente o prazo e escopo de garantia informado pelo usuário
10. O campo "garantia_contratual" deve refletir exatamente o prazo e cobertura da garantia contratual informada
11. O campo "preferencia_compra" deve refletir se há ou não direito de preferência e o prazo informado
12. O campo "aviso_previo_rescisao" deve refletir os prazos e condições de aviso prévio informados

Formato de saída esperado (exemplo):
{"campo1":"valor respondido","campo2":"outro valor","campo3":""}`;

  try {
    const response = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um extrator de dados preciso. Leia conversas e extraia valores para campos específicos, incluindo telefone e email de cada parte. Retorne APENAS JSON válido, sem nenhum texto adicional, sem markdown.'
          },
          { role: 'user', content: extractionPrompt }
        ],
        temperature: 0,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) throw new Error('Erro na extração de dados');

    const data = await response.json();
    let raw = data.choices[0].message.content.trim();
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    const answers = JSON.parse(raw);
    console.log('[extractAnswers] answers:', answers);
    return answers;

  } catch (err) {
    console.error('[extractAnswers] Falha na extração via IA — fallback por posição:', err);
    const answers = {};
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    fieldOrder.forEach((field, index) => {
      if (index < userMessages.length) answers[field] = userMessages[index];
    });
    return answers;
  }
};

// ============================================================
// GERAÇÃO DO CONTRATO FINAL — NÍVEL ESCRITÓRIO SÊNIOR
// ============================================================
export const generateContractFromConversation = async (messages, contractType) => {
  if (!API_CONFIG.openaiApiKey) throw new Error('Chave da API não configurada');

  const answers = await extractAnswersFromConversation(messages, contractType);
  const selectedTemplate = CONTRACT_TEMPLATES[contractType] || CONTRACT_TEMPLATES['prestacao-servicos'];
  const contractTitle = selectedTemplate.title.toUpperCase();
  const legalRef = LEGAL_REF[contractType] || 'segundo o Código Civil Brasileiro';

  // Data real do momento da geração — nunca deixar a IA inventar
  const hoje = new Date();
  const dataAtual = hoje.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let filledTemplate = selectedTemplate.template;
  Object.keys(answers).forEach(key => {
    filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, 'g'), answers[key] || '');
  });
  filledTemplate = filledTemplate.replace(/{[^}]+}/g, '');

  const dataBlock = Object.entries(answers)
    .filter(([, v]) => v && v.trim() !== '')
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n');

  const clausulasList = (CONTRACT_CLAUSES[contractType] || [])
    .map(c => `   - ${c}`)
    .join('\n');

  const prompt = `Você é um Advogado Sênior especialista em Direito Civil e Empresarial Brasileiro. Elabore o instrumento contratual abaixo com rigor técnico-jurídico, vocabulário formal e estrutura de escritório de advocacia de alto padrão.

⚠️ DATA OBRIGATÓRIA: A data de assinatura deste contrato é ${dataAtual}. USE EXATAMENTE ESTA DATA em toda menção a data, local e data, ou encerramento do contrato. NUNCA invente outra data.

Com base nas informações abaixo, redija um ${contractTitle} completo, robusto e juridicamente impecável, ${legalRef}.

═══════════════════════════════════════════════════
DADOS DO CONTRATO (USE EXATAMENTE ESTES VALORES)
═══════════════════════════════════════════════════
${dataBlock}

═══════════════════════════════════════════════════
TEMPLATE DE REFERÊNCIA
═══════════════════════════════════════════════════
${filledTemplate}

═══════════════════════════════════════════════════
INSTRUÇÕES OBRIGATÓRIAS DE REDAÇÃO
═══════════════════════════════════════════════════
1. USE SOMENTE os dados fornecidos — JAMAIS invente valores, nomes ou percentuais
2. NÃO utilize placeholders — substitua TUDO pelos valores reais informados
3. NUNCA coloque CPF/CNPJ no campo de nome, nem endereço no campo de cidade
4. "cidade" e "estado" destinam-se EXCLUSIVAMENTE à cláusula de eleição de foro
5. As cláusulas de penalidades DEVEM refletir com precisão os valores de multa informados
6. No PREÂMBULO, inclua telefone e email de cada parte na qualificação completa
7. Para contratos de compra e venda, adapte a linguagem jurídica conforme a categoria do bem informada — as cláusulas de entrega, documentação, transferência e garantia devem ser coerentes com o tipo específico de bem (imóvel, veículo, equipamento, mercadoria etc.), sem presumir que é sempre um veículo ou imóvel
8. Para contratos de aluguel, a cláusula de direito de preferência deve referenciar expressamente o art. 27 da Lei 8.245/91 e o prazo informado pelas partes; a cláusula de rescisão antecipada deve referenciar o art. 4º da Lei 8.245/91
9. CADA CLÁUSULA deve ser redigida de forma EXTENSA e DETALHADA, com:
   - Cabeçalho em NEGRITO e CAIXA ALTA (ex: **CLÁUSULA 1ª — DO OBJETO**)
   - Corpo jurídico completo com parágrafos numerados (§1º, §2º, §3º...)
   - Uso de terminologia técnica: "mora", "vencimento antecipado", "caráter irretratável",
     "sub-rogação", "solidariedade", "notificação extrajudicial", "ato ilícito", "perdas e danos"
   - Referência explícita aos dispositivos legais aplicáveis (artigos do CC, leis específicas)

10. CLÁUSULA DE LGPD: deve conter obrigações de controlador/operador, finalidade do tratamento,
    base legal (art. 7º Lei 13.709/18), direitos dos titulares e medidas de segurança adotadas

11. CLÁUSULA DE ANTICORRUPÇÃO: deve referenciar a Lei 12.846/2013, proibir atos de corrupção,
    suborno, pagamentos indevidos a agentes públicos e prever rescisão imediata em caso de violação

12. CLÁUSULA DE FORÇA MAIOR: deve definir hipóteses (pandemias, desastres naturais, atos de guerra,
    decisões governamentais), estabelecer prazo de comunicação (máximo 5 dias úteis) e consequências

13. Inicie o documento com o PREÂMBULO completo identificando as partes, qualificação completa
    (nome, CPF/CNPJ, telefone, email, estado civil se pessoa física, sede se jurídica) e a declaração de livre vontade

14. NÃO inclua seção de assinaturas ou testemunhas (adicionada separadamente pelo sistema)

ESTRUTURA OBRIGATÓRIA — DESENVOLVA CADA CLÁUSULA COM CORPO JURÍDICO COMPLETO:
${clausulasList}

REDIJA O INSTRUMENTO CONTRATUAL COMPLETO AGORA, sem resumos, sem omissões e sem placeholders.`;

  try {
    const response = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: `Você é um Advogado Sênior especialista em Direito Civil e Empresarial com 20+ anos de experiência. Redija contratos profissionais, extensos e juridicamente impecáveis, com linguagem técnica formal, parágrafos numerados e referências legais precisas. NUNCA use placeholders. NUNCA invente dados. NUNCA troque campos. Use terminologia jurídica brasileira de alto padrão: "mora", "vencimento antecipado", "caráter irretratável", "sub-rogação", "perdas e danos", "notificação extrajudicial". Cada cláusula deve ter pelo menos 3 parágrafos detalhados. Para contratos de compra e venda, adapte integralmente as cláusulas ao tipo específico de bem informado, sem presumir veículo ou imóvel. Para contratos de aluguel, referencie expressamente a Lei 8.245/91 nas cláusulas de preferência de compra (art. 27) e rescisão antecipada (art. 4º).`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) throw new Error('Erro ao gerar contrato');

    const data = await response.json();
    let contract = data.choices[0].message.content;

    // Remove placeholders residuais
    contract = contract.replace(/\[[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ\s_]+\]/gi, '');
    contract = contract.replace(/\{[^}]+\}/g, '');

    // Substitui variáveis remanescentes
    Object.keys(answers).forEach(key => {
      const value = answers[key] || '';
      [
        new RegExp(`{${key}}`, 'gi'),
        new RegExp(`\\[${key}\\]`, 'gi'),
        new RegExp(`\\[${key.replace(/_/g, ' ')}\\]`, 'gi'),
      ].forEach(p => { contract = contract.replace(p, value); });
    });

    return contract;
  } catch (error) {
    console.error('Erro na geração:', error);
    throw error;
  }
};