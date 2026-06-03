import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

export const metadata = {
  title: 'Como Funciona a VN Prime — Venda direto, assistida ou completa',
  description: 'Entenda o modelo híbrido da VN Prime: você escolhe entre vender direto, com apoio da plataforma ou com corretor dedicado. Simples, transparente e sem burocracia.',
}

const CAMINHOS = [
  {
    id: 'direta',
    nome: 'Venda Direta',
    subtitulo: 'Você no controle — 0% de comissão',
    custo: 'R$ 297 taxa única',
    img: 'https://images.unsplash.com/photo-1611095973763-414019e72400?w=1000&q=85',
    accent: '#6366F1',
    desc: 'Ideal para quem quer autonomia total e não quer pagar comissão. Você define o preço, cadastra o imóvel e conduz as negociações diretamente com o comprador. A VN Prime garante a vitrine, a distribuição e a qualificação básica.',
    como: [
      'Cadastre seu imóvel pela plataforma em minutos',
      'Seu anúncio é distribuído em ZAP, Viva Real e OLX automaticamente',
      'Leads chegam com nome, e-mail e WhatsApp',
      'Você conduz as visitas e negocia direto com o comprador',
      'A VN Prime acompanha a qualidade do processo — sem se interpor',
    ],
    paradquem: 'Proprietário com experiência em negociação e tempo para conduzir o processo.',
  },
  {
    id: 'assistida',
    nome: 'Venda Assistida',
    subtitulo: 'Apoio da plataforma — você paga somente se vender',
    custo: '3% somente no sucesso',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&q=85',
    accent: '#D4A857',
    desc: 'A VN Prime assume a qualificação ativa dos compradores, mantém o anúncio otimizado e garante que apenas interessados reais cheguem até você. Zero risco: você paga somente ao fechar o negócio.',
    como: [
      'Cadastre seu imóvel — a equipe VN Prime revisa e otimiza',
      'Compradores são qualificados antes do primeiro contato',
      'Leads chegam com histórico de interesse e perfil verificado',
      'Você acompanha pelo painel e decide quando negociar',
      'Comissão de 3% cobrada somente na conclusão da venda',
    ],
    paradquem: 'Proprietário que quer resultado sem ocupar tempo excessivo com o processo.',
  },
  {
    id: 'completa',
    nome: 'Venda Completa',
    subtitulo: 'Mãos livres — corretor dedicado — você só aprova',
    custo: '6% somente no sucesso',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=85',
    accent: '#2F8674',
    desc: 'Um corretor parceiro VN Prime assume a venda do início ao fim: fotos profissionais, mídia paga, visitas acompanhadas e negociação conduzida. Você recebe a proposta para aprovar e assina a escritura.',
    como: [
      'Corretor parceiro dedicado assume a gestão da venda',
      'Fotos profissionais realizadas no imóvel',
      'Mídia paga gerenciada em Meta, Google e portais',
      'Visitas acompanhadas e negociação conduzida pelo corretor',
      'Você aprova a proposta — suporte jurídico até a escritura',
    ],
    paradquem: 'Proprietário que prefere delegar e não quer se preocupar com o processo.',
  },
]

const COMPARATIVO = [
  { feature: 'Custo antecipado', direta: 'R$ 297', assistida: 'R$ 0', completa: 'R$ 0' },
  { feature: 'Comissão na venda', direta: '0%', assistida: '3%', completa: '6%' },
  { feature: 'Você fica com', direta: '100%', assistida: '97%', completa: '94%' },
  { feature: 'Qualificação de leads', direta: 'Básica', assistida: 'Ativa', completa: 'Completa' },
  { feature: 'Fotos profissionais', direta: 'Pacote à parte', assistida: 'Pacote à parte', completa: 'Incluso' },
  { feature: 'Corretor dedicado', direta: '—', assistida: '—', completa: 'Sim' },
  { feature: 'Suporte jurídico', direta: 'Disponível', assistida: 'Disponível', completa: 'Incluso' },
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
            <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(1.4rem,2.3vw,1.8rem)' }}>Venda Direta vs Assistida vs Completa</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 16px', background: '#0F1824', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', borderRight: '1px solid rgba(255,255,255,0.08)' }}>Comparativo</th>
                  {['Venda Direta', 'Venda Assistida', 'Venda Completa'].map(n => (
                    <th key={n} style={{ textAlign: 'center', padding: '14px 16px', background: '#0F1824', color: 'var(--gold)', fontSize: 12, fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.08)' }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARATIVO.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? '#fff' : 'var(--cream)' }}>
                    <td style={{ padding: '13px 16px', color: 'var(--navy)', fontWeight: 600, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{row.feature}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', color: '#6366F1', fontWeight: 700, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{row.direta}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', color: '#D4A857', fontWeight: 700, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{row.assistida}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', color: '#2F8674', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>{row.completa}</td>
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
