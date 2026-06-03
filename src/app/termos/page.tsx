import Link from 'next/link'

export const metadata = { title: 'Termos e Condições — VN Prime Imóveis' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, color: 'var(--navy)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>{title}</h2>
      <div style={{ fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.9 }}>{children}</div>
    </section>
  )
}

export default function TermosPage() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: 'var(--navy-deep)', padding: '60px 0 48px' }}>
        <div style={{ width: 'min(860px,92vw)', margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Início</Link>
            {' › '}
            <span>Termos e Condições</span>
          </div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>Termos e Condições de Uso</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 10, fontSize: 14 }}>Última atualização: junho de 2026</p>
        </div>
      </div>

      <div style={{ width: 'min(860px,92vw)', margin: '48px auto 0' }}>
        <Section title="1. Aceitação dos termos">
          <p>Ao acessar ou utilizar a plataforma VN Prime Imóveis ("Plataforma"), você concorda com estes Termos e Condições. Se não concordar com alguma disposição, não utilize a Plataforma.</p>
        </Section>

        <Section title="2. Sobre a plataforma">
          <p>A VN Prime Imóveis é uma plataforma imobiliária híbrida que conecta proprietários, corretores parceiros e compradores em Belo Horizonte e região metropolitana. O proprietário escolhe o modelo de venda: direto (sem intermediação), assistido (com apoio da plataforma) ou completo (com corretor parceiro dedicado). A Plataforma não é parte contratante nas transações imobiliárias realizadas entre seus usuários — atua como facilitadora tecnológica e de qualificação.</p>
        </Section>

        <Section title="3. Cadastro e conta">
          <p>Para acessar determinadas funcionalidades, é necessário cadastro. Você é responsável pela veracidade das informações fornecidas e pela confidencialidade de suas credenciais de acesso. A VN Prime Imóveis reserva-se o direito de suspender contas com informações falsas ou em violação a estes Termos.</p>
        </Section>

        <Section title="4. Planos de anúncio">
          <p style={{ marginBottom: 12 }}>A Plataforma oferece os seguintes planos para proprietários:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}><strong>Plano Venda Direta (R$ 297 — taxa única por 90 dias):</strong> anúncio na vitrine VN Prime com suporte por WhatsApp. O proprietário conduz as negociações de forma autônoma e fica com 100% do valor da venda.</li>
            <li style={{ marginBottom: 6 }}><strong>Plano Venda Assistida (3% de comissão):</strong> a VN Prime Imóveis qualifica compradores e acompanha o processo. Comissão devida somente em caso de fechamento — zero risco antecipado.</li>
            <li style={{ marginBottom: 6 }}><strong>Plano Venda Completa (6% de comissão):</strong> gestão completa com corretor parceiro dedicado, marketing, atendimento e documentação. Comissão devida somente em caso de fechamento.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Valores e condições podem ser alterados mediante aviso prévio de 30 dias.</p>
        </Section>

        <Section title="5. Serviços de fotografia">
          <p>Os pacotes fotográficos (Fotos Profissionais, Booster Mídia e Booster Visibilidade) são contratados diretamente com parceiros credenciados. O pagamento é realizado no ato da contratação via WhatsApp ou e-mail. Não há reembolso após a realização do serviço.</p>
        </Section>

        <Section title="6. Due diligence e avaliação">
          <p>Os laudos de avaliação e relatórios de due diligence são elaborados por profissionais habilitados parceiros da VN Prime Imóveis. Os relatórios têm caráter informativo e não substituem assessoria jurídica ou técnica especializada. A VN Prime Imóveis não se responsabiliza por decisões tomadas com base exclusivamente nos laudos.</p>
        </Section>

        <Section title="7. Consórcio">
          <p>A VN Prime Imóveis atua como correspondente de administradoras de consórcio regulamentadas pelo Banco Central do Brasil. As condições específicas de cada consórcio — taxas de administração, prazos e regras de contemplação — constam no contrato de adesão da administradora.</p>
        </Section>

        <Section title="8. Política de leads">
          <p style={{ marginBottom: 10 }}>As informações fornecidas em formulários de contato, agendamento e proposta ("leads") são tratadas da seguinte forma:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>Leads gerados por imóveis do plano Venda Direta e Venda Assistida são encaminhados diretamente ao proprietário cadastrado.</li>
            <li style={{ marginBottom: 6 }}>Leads gerados por imóveis do plano Venda Completa são encaminhados ao corretor parceiro responsável pelo imóvel.</li>
            <li style={{ marginBottom: 6 }}>O lead consente, ao enviar o formulário, que seus dados sejam compartilhados com o responsável pelo imóvel para fins de contato comercial.</li>
            <li style={{ marginBottom: 6 }}>A VN Prime Imóveis não vende, aluga ou cede dados de leads a terceiros não relacionados à transação.</li>
          </ul>
          <p style={{ marginTop: 10 }}>Tratamos todos os dados conforme nossa Política de Privacidade e a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).</p>
        </Section>

        <Section title="9. Responsabilidades">
          <p style={{ marginBottom: 10 }}>A responsabilidade de cada parte é delimitada da seguinte forma:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}><strong>Plataforma (VN Prime Imóveis):</strong> responsável pela infraestrutura tecnológica, curadoria de anúncios, qualificação básica de compradores e suporte operacional. Não é responsável por negociações, contratos ou atos praticados diretamente entre usuários.</li>
            <li style={{ marginBottom: 6 }}><strong>Proprietário:</strong> responsável pela veracidade das informações do imóvel, documentação, regularidade jurídica e pelos termos de venda estabelecidos diretamente com o comprador.</li>
            <li style={{ marginBottom: 6 }}><strong>Corretor parceiro:</strong> responsável pelo atendimento ao lead, condução das visitas, negociação e intermediação nos imóveis sob sua responsabilidade. Deve possuir registro ativo no CRECI.</li>
            <li style={{ marginBottom: 6 }}><strong>Comprador:</strong> responsável pela diligência prévia antes de assinar qualquer contrato, podendo contratar o serviço de Due Diligence oferecido pela Plataforma.</li>
          </ul>
        </Section>

        <Section title="10. Comissionamento do corretor parceiro">
          <p style={{ marginBottom: 10 }}>Corretores parceiros que atuam em imóveis do plano Venda Completa têm direito à comissão conforme as seguintes condições:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>A comissão é devida exclusivamente em caso de fechamento — assinatura de contrato de compra e venda ou instrumento equivalente.</li>
            <li style={{ marginBottom: 6 }}>O percentual, prazo e forma de pagamento são definidos no acordo firmado entre o corretor e a VN Prime Imóveis no momento do cadastro.</li>
            <li style={{ marginBottom: 6 }}>A VN Prime Imóveis não se responsabiliza por comissões de transações realizadas fora da Plataforma ou sem o aceite formal das condições do imóvel.</li>
          </ul>
        </Section>

        <Section title="11. Conteúdo dos anúncios">
          <p>O responsável pelo anúncio é inteiramente responsável pela veracidade das informações, fotos e valores publicados. A VN Prime Imóveis realiza curadoria editorial e pode remover ou pausar anúncios que violem estes Termos ou a legislação aplicável, sem aviso prévio.</p>
        </Section>

        <Section title="12. Limitação de responsabilidade">
          <p>A VN Prime Imóveis não garante a disponibilidade contínua da Plataforma e não se responsabiliza por perdas decorrentes de falhas técnicas, atos de terceiros, informações incorretas fornecidas por usuários ou por resultados de negociações realizadas fora do ambiente da Plataforma.</p>
        </Section>

        <Section title="13. Foro e legislação aplicável">
          <p>Estes Termos são regidos pela legislação brasileira. Eventuais litígios serão dirimidos no Foro da Comarca de Belo Horizonte, Minas Gerais, com renúncia a qualquer outro, por mais privilegiado que seja.</p>
        </Section>

        <Section title="14. Contato">
          <p>Dúvidas sobre estes Termos podem ser enviadas para: <strong>contato@vnprimeimoveis.com.br</strong> ou via WhatsApp disponível na Plataforma.</p>
        </Section>

        <div style={{ marginTop: 48, padding: '24px 28px', background: '#fff', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: '0 0 16px' }}>Tem dúvidas sobre nossos planos ou serviços?</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/vender" style={{ textDecoration: 'none', padding: '10px 22px', background: 'var(--gold)', color: 'var(--navy-deep)', borderRadius: 9, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)' }}>Ver planos de anúncio</Link>
            <Link href="/sobre" style={{ textDecoration: 'none', padding: '10px 22px', background: 'transparent', color: 'var(--navy)', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)' }}>Sobre a VN Prime</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
