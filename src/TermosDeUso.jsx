const TermosDeUso = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080d14', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 60px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px', textDecoration: 'none' }}>
          ← Voltar ao início
        </a>

        <div style={{ marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Parkinsans', sans-serif" }}>Contratify</span>
          <h1 style={{ fontSize: '40px', fontWeight: '800', marginTop: '12px', marginBottom: '12px', lineHeight: 1.2 }}>Termos de Uso</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Última atualização: 20 de maio de 2026</p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '40px', display: 'flex', flexDirection: 'column', gap: '36px' }}>

          {[
            {
              title: '1. Aceitação dos Termos',
              text: 'Ao acessar e utilizar a plataforma Contratify, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nossos serviços. O uso continuado da plataforma após alterações nos termos constitui aceitação das mudanças.',
            },
            {
              title: '2. Descrição do Serviço',
              text: 'A Contratify é uma plataforma digital que utiliza Inteligência Artificial para gerar contratos personalizados. Os contratos são elaborados com base nas informações fornecidas pelo usuário e seguem modelos revisados juridicamente. A plataforma não substitui a consultoria jurídica profissional para casos complexos.',
            },
            {
              title: '3. Cadastro e Conta',
              text: 'Para utilizar nossos serviços, você deve criar uma conta com informações verdadeiras e mantê-las atualizadas. Você é responsável pela confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente em caso de uso não autorizado.',
            },
            {
              title: '4. Pagamento e Reembolso',
              text: 'Os pagamentos são realizados via Pix e processados de forma instantânea. Após a confirmação do pagamento e geração do contrato, não realizamos reembolsos, pois o produto digital é entregue imediatamente. Em caso de falha técnica comprovada, analisamos o caso individualmente.',
            },
            {
              title: '5. Uso Adequado',
              text: 'Você se compromete a utilizar a plataforma apenas para fins lícitos. É proibido usar o Contratify para gerar contratos com fins ilegais, fraudulentos ou que violem direitos de terceiros. Reservamo-nos o direito de suspender contas que violem estas condições.',
            },
            {
              title: '6. Propriedade Intelectual',
              text: 'Os contratos gerados pertencem ao usuário que os adquiriu. A tecnologia, o design e os algoritmos da plataforma Contratify são de propriedade exclusiva da empresa e protegidos por direito autoral. É vedada a cópia, reprodução ou engenharia reversa de nossos sistemas.',
            },
            {
              title: '7. Limitação de Responsabilidade',
              text: 'A Contratify não se responsabiliza por perdas decorrentes do uso dos contratos gerados em situações não contempladas pelo modelo padrão, por informações incorretas fornecidas pelo usuário, ou por decisões judiciais contrárias. Recomendamos sempre consultar um advogado para casos específicos.',
            },
            {
              title: '8. Modificações',
              text: 'Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou por aviso na plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.',
            },
            {
              title: '9. Foro',
              text: 'Estes termos são regidos pelas leis brasileiras. Qualquer controvérsia será resolvida no foro da comarca de Imperatriz, Estado do Maranhão, com renúncia a qualquer outro, por mais privilegiado que seja.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>{item.title}</h2>
              <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.5)' }}>{item.text}</p>
            </div>
          ))}

          <div style={{ marginTop: '16px', padding: '24px', borderRadius: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>
              Dúvidas sobre estes termos? Entre em contato: <span style={{ color: '#10b981' }}>contratify2026@mail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermosDeUso;