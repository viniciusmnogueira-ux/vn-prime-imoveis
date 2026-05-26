'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Btn from '@/components/ui/Btn'

const HERO_PHOTOS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=85',
  'https://images.unsplash.com/photo-1582268611958-ebfd161df9d8?w=2400&q=85',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2400&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2400&q=85',
]

const SERVICOS = [
  { label: 'Proprietário',      href: '/proprietario',  accent: '#D4A857' },
  { label: 'Corretor Parceiro', href: '/corretor',       accent: '#2F8674' },
  { label: 'Consórcio',         href: '/consorcio',      accent: '#059669' },
  { label: 'Due Diligence',     href: '/due-diligence',  accent: '#4B5563' },
  { label: 'Lançamentos',       href: '/lancamentos',    accent: '#D4A857' },
  { label: 'Avaliação',         href: '/avaliacao',      accent: '#6B7280' },
  { label: 'Calculadora ITBI',  href: '/calculadora',    accent: '#6B7280' },
]

const STATS = [
  { value: '142',      label: 'Imóveis disponíveis' },
  { value: 'R$ 4,2 bi', label: 'Em portfólio' },
  { value: '96%',      label: 'Satisfação' },
  { value: '18 dias',  label: 'Tempo médio de venda' },
]

const QUICK_LINKS = [
  'Apartamentos em BH',
  'Casas Grande BH',
  'Coberturas BH',
  'Lançamentos Grande BH',
  'Aluguel BH',
  'Acima de R$ 5 mi',
]

const SERVICE_CARDS = [
  {
    title: 'Área do Proprietário',
    subtitle: 'Anuncie sem burocracia',
    desc: 'Publique seu imóvel com taxa fixa ou comissão somente ao vender. Painel completo para acompanhar visitas e propostas.',
    bullets: ['Taxa fixa R$ 297 por 90 dias', 'Comissão de 3% só ao vender', 'Painel em tempo real'],
    cta: 'Anunciar meu imóvel',
    href: '/proprietario',
    accent: '#D4A857',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  },
  {
    title: 'Portal do Corretor',
    subtitle: 'Mais negócios, menos esforço',
    desc: 'Acesse portfólio exclusivo, receba leads qualificados e use scripts de venda prontos para fechar mais em BH.',
    bullets: ['Leads qualificados', 'CRM e agenda integrados', 'Scripts de venda prontos'],
    cta: 'Acessar portal',
    href: '/corretor',
    accent: '#2F8674',
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80',
  },
  {
    title: 'Consórcio Imobiliário',
    subtitle: 'Compre sem juros',
    desc: 'Adquira seu imóvel com carta de crédito. Zero juros, contemplação por sorteio ou lance, parcelas que cabem no bolso.',
    bullets: ['0% de juros', 'Contemplação por sorteio ou lance', 'Simule em segundos'],
    cta: 'Simular consórcio',
    href: '/consorcio',
    accent: '#059669',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
  },
  {
    title: 'Due Diligence',
    subtitle: 'Segurança jurídica total',
    desc: 'Análise completa da documentação antes de fechar negócio. Evite surpresas e compre com total tranquilidade.',
    bullets: ['Análise de matrícula e certidões', 'Relatório em até 5 dias úteis', 'Consultoria jurídica inclusa'],
    cta: 'Solicitar análise',
    href: '/due-diligence',
    accent: '#6366F1',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
  },
  {
    title: 'Lançamentos',
    subtitle: 'Primeiros na fila',
    desc: 'Acesso antecipado aos melhores lançamentos de BH e Grande BH. Condições exclusivas e plantões presenciais.',
    bullets: ['Pré-lançamentos exclusivos', 'Condições especiais de pré-venda', 'Atendimento presencial'],
    cta: 'Ver lançamentos',
    href: '/lancamentos',
    accent: '#D4A857',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  },
]

const PLANS = [
  {
    name: 'Venda Direta',
    price: 'R$ 297',
    priceNote: 'taxa única',
    desc: 'Publique seu imóvel e gerencie as negociações com suporte básico da plataforma.',
    features: ['Anúncio por 90 dias', 'Fotos profissionais (opcional)', 'Painel do proprietário', 'Suporte por chat'],
    cta: 'Começar agora',
    href: '/anunciar?plano=direto',
    featured: false,
  },
  {
    name: 'Venda Assistida',
    price: '3%',
    priceNote: 'somente ao vender',
    desc: 'Nossa equipe cuida de tudo: fotos, visitas, negociação e documentação.',
    features: ['Tudo do plano Direta', 'Corretor dedicado VN Prime', 'Fotos e vídeo profissional', 'Gestão completa de visitas', 'Negociação e proposta'],
    cta: 'Falar com consultor',
    href: '/anunciar?plano=assistida',
    featured: true,
  },
  {
    name: 'Venda Completa',
    price: '6%',
    priceNote: 'somente ao vender',
    desc: 'O serviço mais completo: marketing premium, home staging, due diligence e acompanhamento jurídico.',
    features: ['Tudo do plano Assistida', 'Home staging incluso', 'Due diligence jurídica', 'Marketing em portais premium', 'Acompanhamento até o cartório'],
    cta: 'Falar com consultor',
    href: '/anunciar?plano=completa',
    featured: false,
  },
]

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [searchQ, setSearchQ] = useState('')
  const [searchTipo, setSearchTipo] = useState('')
  const [searchValor, setSearchValor] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_PHOTOS.length), 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 580,
        padding: '4rem 0 6rem',
        color: '#fff',
        textAlign: 'center',
      }}>
        {/* Slideshow backgrounds */}
        {HERO_PHOTOS.map((photo, i) => (
          <div key={photo} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0,
            transition: 'opacity 1.6s ease',
            zIndex: 0,
          }} />
        ))}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(120deg, rgba(15,34,68,0.80) 0%, rgba(15,34,68,0.52) 45%, rgba(15,34,68,0.68) 100%)',
        }} />

        {/* Gold radial glow top-right */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', zIndex: 1,
          background: 'radial-gradient(circle, rgba(212,168,87,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, width: 'min(1200px,92vw)', margin: '0 auto' }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 20,
          }}>
            VN Prime Imóveis · Belo Horizonte e região
          </div>

          <h1 style={{ color: '#fff', margin: '0 0 18px', fontSize: 'clamp(2.5rem,5vw,3.8rem)' }}>
            Encontre seu próximo endereço{' '}
            <em style={{
              fontStyle: 'normal',
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>de alto padrão</em>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.88)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Imóveis premium em Belo Horizonte e Grande BH, selecionados pelo time VN Prime.
          </p>

          {/* Search card */}
          <div style={{
            background: '#fff',
            borderRadius: 18,
            padding: '1.25rem',
            boxShadow: '0 22px 60px rgba(15,34,68,0.32)',
            maxWidth: 780,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr auto',
            gap: 12,
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Onde?</div>
              <input
                type="text"
                placeholder="Cidade, bairro ou código..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: 'var(--navy)', background: 'transparent', fontFamily: 'var(--font-body)' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Tipo</div>
              <select
                value={searchTipo}
                onChange={e => setSearchTipo(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: 'var(--navy)', background: 'transparent', fontFamily: 'var(--font-body)', cursor: 'pointer' }}
              >
                <option value="">Todos</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="cobertura">Cobertura</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Valor até</div>
              <select
                value={searchValor}
                onChange={e => setSearchValor(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: 'var(--navy)', background: 'transparent', fontFamily: 'var(--font-body)', cursor: 'pointer' }}
              >
                <option value="">Sem limite</option>
                <option value="2000000">R$ 2 mi</option>
                <option value="5000000">R$ 5 mi</option>
                <option value="10000000">R$ 10 mi</option>
              </select>
            </div>
            <Link href={`/busca${searchQ || searchTipo || searchValor ? `?q=${encodeURIComponent(searchQ)}&tipo=${searchTipo}&valor=${searchValor}` : ''}`}>
              <Btn variant="accent" size="md">Buscar</Btn>
            </Link>
          </div>

          {/* Email alert link */}
          <div style={{ marginTop: 14 }}>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(245,248,250,0.72)', fontSize: 13, fontFamily: 'var(--font-body)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>
              ✉ Receber alertas desta busca por e-mail
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 'clamp(24px,4vw,56px)',
            flexWrap: 'wrap', marginTop: 44,
          }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800,
                  background: 'var(--gradient-gold)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  lineHeight: 1,
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(245,248,250,0.72)', marginTop: 4, letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Services pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 36 }}>
            {SERVICOS.map(s => (
              <Link key={s.href} href={s.href}>
                <button style={{
                  padding: '8px 18px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'var(--font-body)',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = s.accent + '33'
                    ;(e.currentTarget as HTMLElement).style.borderColor = s.accent
                    ;(e.currentTarget as HTMLElement).style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'
                  }}
                >
                  {s.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick links bar ─────────────────────────────────── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '14px 0',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 6, flexShrink: 0 }}>
            Buscas frequentes:
          </span>
          {QUICK_LINKS.map(q => (
            <Link key={q} href={`/busca?q=${encodeURIComponent(q)}`} style={{
              padding: '5px 14px', borderRadius: 999,
              background: 'var(--cream)', border: '1px solid var(--border)',
              fontSize: 13, fontWeight: 500, color: 'var(--navy-muted)',
              textDecoration: 'none', transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--cream-tint)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--navy)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--cream)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--navy-muted)'
              }}
            >
              {q}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Services section ────────────────────────────────── */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--gold-deep)', marginBottom: 12,
            }}>
              Nossos Serviços
            </div>
            <h2>Por que escolher a VN Prime?</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
          }}>
            {SERVICE_CARDS.map(card => (
              <div key={card.href} style={{
                background: '#fff',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  height: 200,
                  backgroundImage: `url(${card.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }} />
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: 36, height: 3, background: card.accent, borderRadius: 2, marginBottom: 14 }} />
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{card.title}</h3>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: card.accent, marginBottom: 10, letterSpacing: '0.03em' }}>{card.subtitle}</div>
                  <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.65, marginBottom: 14 }}>{card.desc}</p>
                  <ul style={{ padding: 0, margin: '0 0 20px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {card.bullets.map(b => (
                      <li key={b} style={{ fontSize: 13, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 16, height: 16, borderRadius: '50%', background: card.accent + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: card.accent, display: 'block' }} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto' }}>
                    <Link href={card.href}>
                      <Btn variant="primary" style={{ background: card.accent, color: card.accent === '#D4A857' ? 'var(--navy)' : '#fff' }}>
                        {card.cta} →
                      </Btn>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans section ───────────────────────────────────── */}
      <section style={{ background: '#fff', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--gold-deep)', marginBottom: 12,
            }}>
              Para proprietários
            </div>
            <h2>Escolha como quer vender</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            alignItems: 'start',
          }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                borderRadius: 20,
                padding: '32px 28px',
                border: plan.featured ? '2px solid var(--gold)' : '1px solid var(--border)',
                background: plan.featured ? 'linear-gradient(160deg, #fffdf7 0%, #fff 100%)' : '#fff',
                position: 'relative',
                boxShadow: plan.featured ? 'var(--shadow-accent)' : 'none',
              }}>
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg,#D4A857 0%,#B8862E 100%)',
                    color: 'var(--navy)', fontSize: 11, fontWeight: 700,
                    padding: '4px 16px', borderRadius: 999, letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}>
                    MAIS POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    fontSize: 36, fontWeight: 800,
                    background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: 'var(--fg-3)', marginLeft: 6 }}>{plan.priceNote}</span>
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.65, marginBottom: 20 }}>{plan.desc}</p>
                <ul style={{ padding: 0, margin: '0 0 24px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 13.5, color: 'var(--fg-1)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Btn variant={plan.featured ? 'accent' : 'ghost'} fullWidth>
                    {plan.cta}
                  </Btn>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px,8vw,100px) 0',
        background: 'linear-gradient(135deg, #0F1824 0%, #1B2733 50%, #243341 100%)',
        textAlign: 'center',
      }}>
        <div style={{ width: 'min(700px,92vw)', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 16,
          }}>
            VN Prime Imóveis
          </div>
          <h2 style={{ color: '#fff', margin: '0 0 16px' }}>Pronto para dar o próximo passo?</h2>
          <p style={{ color: 'rgba(245,248,250,0.80)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
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
