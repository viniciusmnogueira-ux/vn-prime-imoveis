import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

const SERVICOS = [
  { label: 'Proprietário',     href: '/proprietario',  accent: '#D4A857' },
  { label: 'Corretor Parceiro',href: '/corretor',       accent: '#2F8674' },
  { label: 'Consórcio',        href: '/consorcio',      accent: '#059669' },
  { label: 'Due Diligence',    href: '/due-diligence',  accent: '#4B5563' },
  { label: 'Lançamentos',      href: '/lancamentos',    accent: '#D4A857' },
  { label: 'Avaliação',        href: '/avaliacao',      accent: '#6B7280' },
  { label: 'Calculadora ITBI', href: '/calculadora',    accent: '#6B7280' },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, rgba(15,24,36,0.92) 0%, rgba(27,39,51,0.88) 100%),
                     url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1900&q=85) center/cover`,
        color: '#fff',
        padding: 'clamp(80px,12vw,160px) 0 clamp(60px,8vw,120px)',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ maxWidth: 680 }}>
            <Eyebrow color="var(--gold)">VN Prime Imóveis · BH e Região</Eyebrow>
            <h1 style={{ color: '#fff', margin: '16px 0 20px', fontSize: 'clamp(2.6rem,5.5vw,4rem)' }}>
              O imóvel certo,{' '}
              <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>sem complicação.</em>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.85)', maxWidth: 520, marginBottom: 36, lineHeight: 1.7 }}>
              Compre, venda ou anuncie imóveis de alto padrão em BH com curadoria, tecnologia e transparência VN Prime.
            </p>

            {/* Quick search */}
            <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.97)', borderRadius: 12, overflow: 'hidden', maxWidth: 560, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
              <input
                type="text" placeholder="Bairro, cidade ou tipo de imóvel..."
                style={{ flex: 1, padding: '16px 20px', border: 'none', fontSize: 15, outline: 'none', background: 'transparent', color: 'var(--navy)' }}
              />
              <Link href="/busca">
                <button style={{ padding: '0 24px', background: 'var(--gold)', border: 'none', color: 'var(--navy-deep)', fontWeight: 700, fontSize: 15, cursor: 'pointer', height: '100%' }}>
                  Buscar
                </button>
              </Link>
            </div>

            {/* Services grid */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 32 }}>
              {SERVICOS.map(s => (
                <Link key={s.href} href={s.href}>
                  <button style={{
                    padding: '8px 16px', borderRadius: 99,
                    background: 'rgba(255,255,255,0.09)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.accent + '33'; (e.currentTarget as HTMLElement).style.borderColor = s.accent; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)' }}
                  >
                    {s.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Anunciar */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>
          {[
            { title: 'Proprietário Direto', desc: 'Anuncie sem comissão. Taxa fixa de R$ 297 por 90 dias, ou venda assistida com curadoria VN Prime.', cta: 'Anunciar imóvel', href: '/anunciar', accent: '#D4A857' },
            { title: 'Corretor Parceiro', desc: 'Acesse o portfólio exclusivo VN Prime, receba leads qualificados e feche mais negócios em BH.', cta: 'Acessar portal', href: '/corretor', accent: '#2F8674' },
            { title: 'Consórcio Imobiliário', desc: 'Compre sem juros com carta de crédito. 0% de juros, contemplação por sorteio ou lance.', cta: 'Simular consórcio', href: '/consorcio', accent: '#059669' },
          ].map(c => (
            <div key={c.href} style={{ background: 'var(--cream)', borderRadius: 18, padding: 'clamp(28px,4vw,40px)', border: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 4, background: c.accent, borderRadius: 2, marginBottom: 18 }} />
              <h3 style={{ fontSize: 20, marginBottom: 10 }}>{c.title}</h3>
              <p style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.7, marginBottom: 24 }}>{c.desc}</p>
              <Link href={c.href}>
                <Btn variant="primary" style={{ background: c.accent === '#D4A857' ? 'var(--gold)' : c.accent, color: c.accent === '#D4A857' ? 'var(--navy-deep)' : '#fff' }}>
                  {c.cta} →
                </Btn>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: 'clamp(50px,7vw,90px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(900px,92vw)', margin: '0 auto', background: 'var(--gradient-navy-hero)', borderRadius: 24, padding: 'clamp(40px,5vw,64px)', textAlign: 'center', color: '#fff' }}>
          <Eyebrow color="var(--gold)">VN Prime Imóveis</Eyebrow>
          <h2 style={{ color: '#fff', margin: '16px 0 14px' }}>Pronto para dar o próximo passo?</h2>
          <p style={{ color: 'rgba(245,248,250,0.8)', fontSize: 16, maxWidth: 480, margin: '0 auto 32px' }}>
            Cadastre-se gratuitamente e acesse o portal do proprietário ou do corretor.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/anunciar"><Btn variant="accent" size="lg">Anunciar meu imóvel</Btn></Link>
            <Link href="/busca"><Btn variant="ghost-light" size="lg">Buscar imóveis</Btn></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
