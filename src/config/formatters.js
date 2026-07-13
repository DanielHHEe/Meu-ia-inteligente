// ============================================================
// formatters.js
// Formatadores de CPF, CNPJ, telefone, dinheiro e respostas
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

// ============================================================
// parseValor — converte qualquer formato de valor para número
// Suporta: "7000", "7.000", "7.000,50", "7000.50", "7,000.50"
//
// FIX: exportada (antes era privada) para ser reutilizada na camada de
// validação de integridade (validateContract, em api.js), que precisa
// reconhecer valores monetários/percentuais informados pelo usuário
// mesmo quando ele não digita o prefixo "R$" ou o símbolo "%" — sem
// alterar em nada o comportamento já existente desta função.
// ============================================================
export const parseValor = (valor) => {
  const s = String(valor).replace(/[R$\s]/g, '').trim();
  if (!s) return NaN;

  // Formato BR com vírgula decimal: 1.500,50
  if (s.includes(',')) {
    return parseFloat(s.replace(/\./g, '').replace(',', '.'));
  }

  const dots = (s.match(/\./g) || []).length;
  if (dots > 1) {
    // Múltiplos pontos = separadores de milhar: 1.000.000
    return parseFloat(s.replace(/\./g, ''));
  }
  if (dots === 1) {
    const afterDot = s.split('.')[1];
    // Exatamente 3 dígitos após ponto = separador de milhar: 4.500
    if (afterDot && afterDot.length === 3) return parseFloat(s.replace('.', ''));
    // Senão = decimal: 4500.50
    return parseFloat(s);
  }
  return parseFloat(s);
};

// ============================================================
// extensoMonetario — converte valor em texto por extenso
// Feito em código para NUNCA deixar a IA inventar o extenso.
// Ex: "7000"     → "sete mil reais"
// Ex: "4.500,50" → "quatro mil e quinhentos reais e cinquenta centavos"
// ============================================================
const UNIDADES = [
  '', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
  'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze',
  'dezesseis', 'dezessete', 'dezoito', 'dezenove',
];
const DEZENAS  = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos',
  'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

const bloco3 = (n) => {
  if (n === 0) return '';
  if (n === 100) return 'cem';
  const c    = Math.floor(n / 100);
  const rest = n % 100;
  const parC = c > 0 ? CENTENAS[c] : '';
  let parR = '';
  if (rest > 0 && rest < 20) {
    parR = UNIDADES[rest];
  } else if (rest >= 20) {
    const d = Math.floor(rest / 10);
    const u = rest % 10;
    parR = DEZENAS[d] + (u > 0 ? ' e ' + UNIDADES[u] : '');
  }
  return [parC, parR].filter(Boolean).join(' e ');
};

export const extensoMonetario = (valor) => {
  if (!valor) return '';
  const num = parseValor(valor);
  if (isNaN(num) || num < 0) return String(valor);

  const inteiro  = Math.floor(num);
  const centavos = Math.round((num - inteiro) * 100);
  const partes   = [];

  const bilhoes = Math.floor(inteiro / 1_000_000_000);
  const milhoes = Math.floor((inteiro % 1_000_000_000) / 1_000_000);
  const mil     = Math.floor((inteiro % 1_000_000) / 1_000);
  const resto   = inteiro % 1_000;

  if (bilhoes > 0) partes.push(bloco3(bilhoes) + (bilhoes === 1 ? ' bilhão' : ' bilhões'));
  if (milhoes > 0) partes.push(bloco3(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões'));
  if (mil     > 0) partes.push(bloco3(mil) + ' mil');
  if (resto   > 0) partes.push(bloco3(resto));

  const reaisStr   = partes.length > 0 ? partes.join(' e ') : 'zero';
  const reaisLabel = inteiro === 1 ? 'real' : 'reais';

  if (centavos === 0) return `${reaisStr} ${reaisLabel}`;
  const centLabel = centavos === 1 ? 'centavo' : 'centavos';
  return `${reaisStr} ${reaisLabel} e ${bloco3(centavos)} ${centLabel}`;
};

// ============================================================
// formatMoneyField — formata valor + extenso para o dataBlock
// Ex: "7000" → "R$ 7.000,00 (sete mil reais)"
// ============================================================
export const formatMoneyField = (valor) => {
  if (!valor) return valor;
  const num = parseValor(valor);
  if (isNaN(num)) return valor;
  const formatted = num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `R$ ${formatted} (${extensoMonetario(valor)})`;
};

// ============================================================
// formatAnswers — aplica todos os formatadores nas respostas
// ============================================================
export const formatAnswers = (answers) => {
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
  // Campos de valor monetário — recebem R$ formatado + extenso por extenso
  const moneyFields = [
    'valor_total', 'valor_projeto', 'valor_aluguel', 'valor_venda',
    'capital_social', 'aporte_inicial', 'multa_violacao',
  ];

  const out = { ...answers };
  cpfFields  .forEach(f => { if (out[f]) out[f] = formatDocumento(out[f]); });
  telFields  .forEach(f => { if (out[f]) out[f] = formatTelefone(out[f]); });
  moneyFields.forEach(f => { if (out[f]) out[f] = formatMoneyField(out[f]); });
  return out;
};