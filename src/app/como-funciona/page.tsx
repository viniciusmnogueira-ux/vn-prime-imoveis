import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

export const metadata = {
  title: 'Como Funciona a VN Prime — Planos Essencial, Plus e Pro',
  description: 'Entenda o modelo da VN Prime: escolha o plano que faz mais sentido para você — Essencial, Plus ou Pro. Anuncie, receba leads qualificados e venda com autonomia.',
}

const CAMINHOS = [
  {
    id: 'essencial',
    nome: 'Plano Essencial',
    subtitulo: '1 imóvel ativo — sem comissão sobre a venda',
    custo: 'R$ 99/mês',
    img: 'https://images.unsplash.com/photo-1611095973763-414019e72400?w=1000&q=85',
    accent: '#6366F1',
    desc: 'Ideal para quem quer autonomia total e não quer pagar comissão. Você define o preço, cadastra o imóvel e conduz as negociações diretamente com o comprador. A VN Prime garante a vitrine, a qualificação básica e o suporte de plataforma.',
    como: [
      'Cadastre seu imóvel pela plataforma em minutos',
      'Seu anúncio entra na vitrine VN Prime imediatamente',
      'Leads chegam com nome, e-mail e WhatsApp',
      'Você conduz as visitas e negocia direto com o comprador',
      'A VN Prime acompanha a qualidade do processo — sem se interpor',
    ],
    paradquem: 'Proprietário com experiência em negociação e tempo para conduzir o processo.',
  },
  {
    id: 'plus',
    nome: 'Plano Plus',
    subtitulo: 'Até 3 imóveis ativos — curadoria e qualificação ativa',
    custo: 'R$ 399 / 6 meses',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&q=85',
    accent: '#D4A857',
    desc: 'A VN Prime assume a qualificação ativa dos compradores, mantém os anúncios otimizados e garante que apenas interessados reais cheguem até você. Para quem tem mais de um imóvel e quer resultado sem abrir mão do controle.',
    como: [
      'Cadastre seus imóveis — a equipe VN Prime revisa e otimiza',
      'Compradores são qualificados antes do primeiro contato',
      'Leads chegam com histórico de interesse e perfil verificado',
      'Você acompanha pelo painel e decide quando negociar',
      'Relatório mensal de desempenho e benchmarks do mercado',
    ],
    paradquem: 'Proprietário que quer resultado sem ocupar tempo excessivo com o processo.',
  },
  {
    id: 'pro',
    nome: 'Plano Pro',
    subtitulo: 'Até 10 imóveis ativos — para investidores',
    custo: 'R$ 799 / 12 meses',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=85',
    accent: '#2F8674',
    desc: 'Estrutura completa para investidores com múltiplos imóveis. Painel gerencial consolidado, curadoria dedicada em todos os anúncios, relatórios detalhados e suporte direto da equipe VN Prime.',
    como: [
      'Gerencie até 10 imóveis ativos pelo painel consolidado',
      'Curadoria dedicada em cada anúncio da carteira',
      'Relatório de mercado e benchmarks mensais por imóvel',
      'Suporte dedicado da equipe VN Prime',
      'Materiais de apoio e indicações disponíveis em cada etapa',
    ],
    paradquem: 'Investidor ou proprietário com múltiplos imóveis que prefere estrutura e relatórios.',
  },
]

const COMPARATIVO = [
  { feature: 'Assinatura', essencial: 'R$ 99/mês', plus: 'R$ 399/6m', pro: 'R$ 799/12m' },
  { feature: 'Imóveis ativos', essencial: '1', plus: 'Até 3', pro: 'Até 10' },
  { feature: 'Comissão na venda', essencial: '0%', plus: '0%', pro: '0%' },
  { feature: 'Qualificação de leads', essencial: 'Básica', plus: 'Ativa', pro: 'Completa' },
  { feature: 'Curadoria dedicada', essencial: '—', plus: 'Sim', pro: 'Sim' },
  { feature: 'Relatório de desempenho', essencial: '—', plus: 'Mensal', pro: 'Mensal' },
  { feature: 'Materiais de apoio', essencial: 'Disponível', plus: 'Disponível', pro: 'Indicações' },
]

export default function ComoFuncionaPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center', padding: 'clamp(80px,12vw,130px) 0' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=2000&q=85)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(15,34,68,0.90) 0%, rgba(15,34,68,0.62) 50%, rgba(15,34,68,0.80) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <Eyebrow>Como funciona · VN Prime</Eyebrow>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem,4.2vw,3.2rem)', lineHeight: 1.1, margin: '14px 0 20px', maxWidth: '20ch' }}>
            Uma plataforma,{' '}
            <em style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic' }}>
              três caminhos
            </em>
          </h1>
          <p style={{ color: 'rgba(245,248,250,0.88)', fontSize: 17, maxWidth: 540, lineHeight: 1.7, marginBottom: 36 }}>
            A VN Prime é uma plataforma imobiliária híbrida. O proprietário escolhe o nível de envolvimento — do mais autônomo ao totalmente assistido — e paga de acordo com o serviço escolhido.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="#caminhos"><Btn variant="accent" size="lg">Ver os três caminhos</Btn></Link>
            <Link href="/anunciar"><button style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(212,168,87,0.45)', background: 'transparent', color: 'var(--gold)', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Anunciar meu imóvel</button></Link>
          </div>
        </div>
      </section>

      {/* Três caminhos */}
      <section id="caminhos" style={{ padding: 'clamp(48px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">Escolha seu modelo</Eyebrow>
            <h2 style={{ margin: '10px 0 12px', fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>Três formas de vender com a VN Prime</h2>
            <p style={{ color: 'var(--fg-2)', maxWidth: 500, margin: '0 auto', fontSize: 15.5 }}>
              Cada proprietário tem uma realidade diferente. Escolha o caminho que faz mais sentido para você.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {CAMINHOS.map((c, idx) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 0, overflow: 'hidden', border: '1px solid var(--border)', direction: idx % 2 === 1 ? 'rtl' : 'ltr' }}>
                <div style={{ height: 'min(320px,55vw)', minHeight: 240, position: 'relative', backgroundImage: `url(${c.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, background: idx % 2 === 1 ? 'linear-gradient(to left, rgba(15,22,32,0.15) 0%, rgba(15,22,32,0.70) 100%)' : 'linear-gradient(to right, rgba(15,22,32,0.15) 0%, rgba(15,22,32,0.70) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 24, left: 28, direction: 'ltr' }}>
                    <div style={{ display: 'inline-block', background: c.accent + '22', border: `1px solid ${c.accent}55`, borderRadius: 999, padding: '5px 14px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.accent, marginBottom: 10 }}>{c.nome}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 6 }}>{c.custo}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(245,248,250,0.65)' }}>{c.subtitulo}</div>
                  </div>
                </div>
                <div style={{ background: '#fff', padding: 'clamp(28px,4vw,48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', direction: 'ltr' }}>
                  <div style={{ width: 36, height: 3, background: c.accent, borderRadius: 2, marginBottom: 18 }} />
                  <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.75, margin: '0 0 22px' }}>{c.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {c.como.map(item => (
                      <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.5 }}>
                        <span style={{ color: c.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-3)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', lineHeight: 1.55 }}>
                    <strong style={{ color: 'var(--navy)' }}>Ideal para:</strong> {c.paradquem}
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Link href="/anunciar">
                      <button style={{ padding: '11px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', background: c.accent, color: c.accent === '#D4A857' ? 'var(--navy-deep)' : '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>
                        Escolher {c.nome} →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativo */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1000px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <Eyebrow color="var(--gold-deep)">Comparativo</Eyebrow>
            <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(1.4rem,2.3vw,1.8rem)' }}>Essencial vs Plus vs Pro</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 16px', background: '#0F1824', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', borderRight: '1px solid rgba(255,255,255,0.08)' }}>Comparativo</th>
                  {['Plano Essencial', 'Plano Plus', 'Plano Pro'].map(n => (
                    <th key={n} style={{ textAlign: 'center', padding: '14px 16px', background: '#0F1824', color: 'var(--gold)', fontSize: 12, fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.08)' }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARATIVO.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? '#fff' : 'var(--cream)' }}>
                    <td style={{ padding: '13px 16px', color: 'var(--navy)', fontWeight: 600, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{row.feature}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', color: '#6366F1', fontWeight: 700, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{row.essencial}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', color: '#D4A857', fontWeight: 700, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{row.plus}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', color: '#2F8674', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ background: 'var(--gradient-navy-hero)', borderRadius: 24, padding: 'clamp(44px,6vw,68px)', textAlign: 'center' }}>
            <Eyebrow color="var(--gold)">Escolha o seu caminho</Eyebrow>
            <h2 style={{ color: '#fff', margin: '14px 0 16px', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)' }}>Pronto para anunciar?</h2>
            <p style={{ color: 'rgba(245,248,250,0.75)', fontSize: 16, maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Cadastre seu imóvel agora. Você escolhe o plano no ato ou pode mudar depois — sem burocracia.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/anunciar"><Btn variant="accent" size="lg">Publicar meu imóvel</Btn></Link>
              <Link href="/busca"><Btn variant="ghost-light" size="lg">Ver imóveis à venda</Btn></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
