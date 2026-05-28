import Link from 'next/link'

export const metadata = { title: 'Política de Privacidade — VN Prime Imóveis' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, color: 'var(--navy)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>{title}</h2>
      <div style={{ fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.9 }}>{children}</div>
    </section>
  )
}

export default function PoliticaPage() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: 'var(--navy-deep)', padding: '60px 0 48px' }}>
        <div style={{ width: 'min(860px,92vw)', margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Início</Link>
            {' › '}
            <span>Política de Privacidade</span>
          </div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>Política de Privacidade</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 10, fontSize: 14 }}>Última atualização: maio de 2026 · em conformidade com a LGPD (Lei 13.709/2018)</p>
        </div>
      </div>

      <div style={{ width: 'min(860px,92vw)', margin: '48px auto 0' }}>
        <Section title="1. Controlador dos dados">
          <p>A VN Prime Imóveis, pessoa jurídica de direito privado, é responsável pelo tratamento dos dados pessoais coletados por meio desta Plataforma. Contato do encarregado (DPO): <strong>privacidade@vnprimeimoveis.com.br</strong>.</p>
        </Section>

        <Section title="2. Dados coletados">
          <p style={{ marginBottom: 12 }}>Coletamos os seguintes dados pessoais:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}><strong>Dados de cadastro:</strong> nome completo, e-mail, telefone/WhatsApp, CPF (quando necessário para documentação).</li>
            <li style={{ marginBottom: 6 }}><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas e tempo de navegação (via cookies analíticos).</li>
            <li style={{ marginBottom: 6 }}><strong>Dados de formulários:</strong> mensagens de contato, propostas, solicitações de agendamento e laudos de avaliação.</li>
            <li style={{ marginBottom: 6 }}><strong>Dados de preferência:</strong> imóveis salvos como favoritos (armazenados localmente no seu dispositivo).</li>
          </ul>
        </Section>

        <Section title="3. Finalidade do tratamento">
          <p style={{ marginBottom: 12 }}>Seus dados são utilizados para:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>Intermediar o contato entre compradores, vendedores e corretores.</li>
            <li style={{ marginBottom: 6 }}>Processar cadastros, propostas, agendamentos e solicitações de serviço.</li>
            <li style={{ marginBottom: 6 }}>Enviar comunicações relacionadas ao serviço contratado.</li>
            <li style={{ marginBottom: 6 }}>Cumprir obrigações legais e regulatórias.</li>
            <li style={{ marginBottom: 6 }}>Melhorar a experiência de uso da Plataforma.</li>
          </ul>
        </Section>

        <Section title="4. Base legal">
          <p>O tratamento de dados é realizado com base no consentimento do titular (art. 7º, I da LGPD), na execução de contrato ou procedimentos preliminares (art. 7º, V) e no cumprimento de obrigação legal (art. 7º, II), conforme aplicável a cada operação.</p>
        </Section>

        <Section title="5. Compartilhamento de dados">
          <p>Seus dados poderão ser compartilhados com:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>Proprietários e corretores parceiros, para fins de intermediação imobiliária.</li>
            <li style={{ marginBottom: 6 }}>Prestadores de serviço (hospedagem, e-mail transacional, analytics) que operam sob acordos de confidencialidade.</li>
            <li style={{ marginBottom: 6 }}>Autoridades públicas, quando exigido por lei.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Não vendemos dados pessoais a terceiros.</p>
        </Section>

        <Section title="6. Retenção de dados">
          <p>Os dados são armazenados pelo prazo necessário ao cumprimento das finalidades descritas ou conforme exigido por obrigação legal, respeitado o prazo mínimo de 5 anos para dados relacionados a transações imobiliárias.</p>
        </Section>

        <Section title="7. Seus direitos (LGPD)">
          <p style={{ marginBottom: 12 }}>Você tem direito a:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>Confirmar a existência de tratamento de seus dados.</li>
            <li style={{ marginBottom: 6 }}>Acessar, corrigir ou atualizar seus dados.</li>
            <li style={{ marginBottom: 6 }}>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
            <li style={{ marginBottom: 6 }}>Revogar o consentimento a qualquer momento.</li>
            <li style={{ marginBottom: 6 }}>Opor-se ao tratamento realizado em desconformidade com a LGPD.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Para exercer seus direitos, envie solicitação para <strong>privacidade@vnprimeimoveis.com.br</strong> com seu nome completo e e-mail cadastrado.</p>
        </Section>

        <Section title="8. Cookies">
          <p>Utilizamos cookies estritamente necessários (autenticação e sessão) e cookies analíticos (comportamento de navegação agregado). Você pode desativar cookies analíticos nas configurações do seu navegador sem impacto nas funcionalidades essenciais da Plataforma.</p>
        </Section>

        <Section title="9. Segurança">
          <p>Adotamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição, incluindo criptografia TLS em trânsito e controle de acesso baseado em função (RBAC).</p>
        </Section>

        <Section title="10. Alterações a esta política">
          <p>Podemos atualizar esta Política periodicamente. Alterações relevantes serão comunicadas por e-mail (para usuários cadastrados) ou por aviso na Plataforma com antecedência mínima de 15 dias.</p>
        </Section>

        <div style={{ marginTop: 48, padding: '24px 28px', background: '#fff', borderRadius: 14, border: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Dúvidas sobre privacidade?</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>privacidade@vnprimeimoveis.com.br</div>
          </div>
          <Link href="/termos" style={{ textDecoration: 'none', padding: '10px 22px', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 14, fontWeight: 600, color: 'var(--navy)', fontFamily: 'var(--font-body)' }}>Ver Termos de Uso</Link>
        </div>
      </div>
    </div>
  )
}
