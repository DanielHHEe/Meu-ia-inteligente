const PoliticaPrivacidade = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080d14', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 60px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px', textDecoration: 'none' }}>
          ← Voltar ao início
        </a>
        <div style={{ marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Parkinsans', sans-serif" }}>Contratify</span>
          <h1 style={{ fontSize: '40px', fontWeight: '800', marginTop: '12px', marginBottom: '12px', lineHeight: 1.2 }}>Política de Privacidade</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Última atualização: 20 de maio de 2026</p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '40px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {[
            { title: '1. Dados que Coletamos', text: 'Coletamos os dados fornecidos durante o cadastro (nome e e-mail), as informações inseridas para geração de contratos, dados de pagamento processados pelo Mercado Pago, e dados de uso da plataforma como páginas visitadas e ações realizadas. Não armazenamos dados de cartão de crédito.' },
            { title: '2. Como Usamos seus Dados', text: 'Utilizamos seus dados para criar e entregar os contratos solicitados, processar pagamentos, enviar comunicações relacionadas ao serviço, melhorar nossa plataforma, e cumprir obrigações legais. Não vendemos seus dados a terceiros.' },
            { title: '3. Compartilhamento de Dados', text: 'Compartilhamos dados apenas com parceiros essenciais para a operação do serviço: o Mercado Pago para processamento de pagamentos, e provedores de infraestrutura de nuvem para hospedagem segura. Todos os parceiros seguem políticas rígidas de proteção de dados.' },
            { title: '4. Armazenamento e Segurança', text: 'Seus dados são armazenados em servidores seguros com criptografia. Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou destruição. Os contratos gerados ficam disponíveis para download por 30 dias.' },
            { title: '5. Seus Direitos (LGPD)', text: 'Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados pessoais, corrigir dados incorretos, solicitar a exclusão de seus dados, revogar o consentimento a qualquer momento, e ser informado sobre o uso de seus dados.' },
            { title: '6. Cookies', text: 'Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para entender como os usuários interagem com o site. Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar algumas funcionalidades.' },
            { title: '7. Retenção de Dados', text: 'Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para cumprir obrigações legais. Após a exclusão da conta, seus dados são removidos em até 90 dias, exceto quando a retenção for exigida por lei.' },
            { title: '8. Contato', text: 'Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato: contratify2026@mail.com' },
          ].map((item) => (
            <div key={item.title}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>{item.title}</h2>
              <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.5)' }}>{item.text}</p>
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '24px', borderRadius: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
              Dúvidas sobre privacidade? Entre em contato: <span style={{ color: '#10b981' }}>contratify2026@mail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PoliticaPrivacidade;