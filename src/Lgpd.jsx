const LGPD = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080d14', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 60px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px', textDecoration: 'none' }}>
          ← Voltar ao início
        </a>
        <div style={{ marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Parkinsans', sans-serif" }}>Contratify</span>
          <h1 style={{ fontSize: '40px', fontWeight: '800', marginTop: '12px', marginBottom: '12px', lineHeight: 1.2 }}>LGPD</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Lei Geral de Proteção de Dados — Lei nº 13.709/2018</p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '40px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
          <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
              A Contratify está comprometida com a conformidade à Lei Geral de Proteção de Dados Pessoais (LGPD), garantindo transparência, segurança e respeito aos direitos dos titulares de dados.
            </p>
          </div>
          {[
            { title: 'O que é a LGPD?', text: 'A Lei nº 13.709/2018 (LGPD) é a legislação brasileira que regula o tratamento de dados pessoais por pessoas físicas e jurídicas, com o objetivo de proteger os direitos fundamentais de liberdade e privacidade dos cidadãos. Ela entrou em vigor em setembro de 2020.' },
            { title: 'Base Legal para Tratamento', text: 'Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas na LGPD: (i) execução de contrato — para gerar e entregar os contratos solicitados; (ii) legítimo interesse — para melhorar nossos serviços e prevenir fraudes; (iii) cumprimento de obrigação legal — para atender exigências fiscais e regulatórias.' },
            { title: 'Seus Direitos como Titular', text: 'Conforme o Art. 18 da LGPD, você possui os seguintes direitos: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade dos dados; eliminação dos dados tratados com consentimento; informação sobre compartilhamento; possibilidade de não fornecer consentimento e as consequências disso; e revogação do consentimento.' },
            { title: 'Como Exercer seus Direitos', text: 'Para exercer qualquer um dos direitos previstos na LGPD, entre em contato pelo e-mail contratify2026@mail.com com o assunto "LGPD — [seu direito]". Responderemos em até 15 dias úteis, conforme exigido pela lei.' },
            { title: 'Encarregado de Dados (DPO)', text: 'O Encarregado pelo Tratamento de Dados Pessoais da Contratify é responsável por atender às solicitações dos titulares e se comunicar com a Autoridade Nacional de Proteção de Dados (ANPD). Contato: contratify2026@mail.com' },
            { title: 'Transferência Internacional', text: 'Eventualmente, dados podem ser processados em servidores fora do Brasil. Nestes casos, garantimos que os países ou organizações destinatárias ofereçam grau de proteção de dados pessoais adequado ao previsto na LGPD.' },
            { title: 'Incidentes de Segurança', text: 'Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, comunicaremos à ANPD e aos titulares afetados dentro do prazo legal, com informações sobre a natureza dos dados afetados e as medidas tomadas.' },
            { title: 'Autoridade Nacional (ANPD)', text: 'Caso não esteja satisfeito com nossa resposta, você tem o direito de reclamar à Autoridade Nacional de Proteção de Dados (ANPD), o órgão responsável por zelar pela proteção de dados pessoais no Brasil. Acesse: gov.br/anpd' },
          ].map((item) => (
            <div key={item.title}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>{item.title}</h2>
              <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.5)' }}>{item.text}</p>
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
              Última revisão: 20 de maio de 2026 · Encarregado de Dados: <span style={{ color: '#10b981' }}>contratify2026@mail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LGPD;