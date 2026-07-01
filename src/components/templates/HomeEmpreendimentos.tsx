'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SITE_CONFIG } from '@/lib/config'

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

const STATS = [
  { value: '3',          label: 'Empreendimentos em carteira' },
  { value: 'R$ 320k+',  label: 'Unidades a partir de' },
  { value: '0%',        label: 'Juros bancários na planta' },
  { value: '7 dias',    label: 'Para sua proposta' },
]

const DIFERENCIAIS = [
  { title: 'Compre na planta', desc: 'Entrada facilitada, parcelas baixas durante as obras e financiamento bancário na entrega das chaves.' },
  { title: 'Espelho de vendas', desc: 'Visualize em tempo real quais unidades estão disponíveis, reservadas ou vendidas por andar e tipologia.' },
  { title: 'Valorização garantida', desc: 'Análise de potencial de valorização baseada em dados de mercado antes da sua decisão de compra.' },
  { title: 'Due diligence incluso', desc: 'Verificação completa da incorporadora, memorial descritivo e documentação do empreendimento.' },
]

export default function HomeEmpreendimentos() {
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [slide, setSlide] = useState(0)
  const { brand } = SITE_CONFIG

  const HERO_PHOTOS = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2400&q=85',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2400&q=85',
  ]

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_PHOTOS.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const sb = createClient()
    sb.from('imoveis')
      .select('id,titulo,tipo,bairro,cidade,preco,area_m2,quartos,fotos,destaque')
      .eq('status', 'ativo')
      .in('tipo', ['Lançamento', 'Apartamento', 'Casa em Condomínio'])
      .order('destaque', { ascending: false })
      .limit(6)
      .then(({ data }) => setLancamentos(data || []))
  }, [])

  return (
    <main>
      {/* ── Hero cinematográfico ── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        {HERO_PHOTOS.map((photo, i) => (
          <div key={photo} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0,
            transition: 'opacity 2s ease', zIndex: 0,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to top, rgba(10,18,28,0.96) 0%, rgba(10,18,28,0.4) 50%, rgba(10,18,28,0.2) 100%)',
        }} />

        {/* Slide indicators */}
        <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 3, display: 'flex', gap: 8 }}>
          {HERO_PHOTOS.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? 28 : 8, height: 8, borderRadius: 99,
              background: i === slide ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer',
              transition: 'all .3s',
            }} />
          ))}
        </div>

        <div style={{
          position: 'relative', zIndex: 2,
          width: 'min(1280px,94vw)', margin: '0 auto',
          padding: 'clamp(3rem,6vw,6rem) 0',
        }}>
          <div style={{ maxWidth: 680 }}>
            <p style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(212,168,87,0.15)', border: '1px solid rgba(212,168,87,0.35)',
              color: 'var(--gold)', fontSize: 11, fontWeight: 700,
              letterSpacing: 2.5, textTransform: 'uppercase',
              padding: '7px 16px', borderRadius: 99, marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
              Lançamentos Premium · {brand.city}
            </p>

            <h1 style={{
              color: '#fff', fontSize: 'clamp(2.4rem,5vw,4rem)',
              fontFamily: 'var(--font-display)', fontWeight: 400,
              lineHeight: 1.1, marginBottom: 20,
            }}>
              Invista onde o<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>valor cresce</em><br />
              antes da entrega
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: '52ch' }}>
              Empreendimentos selecionados com análise de mercado, due diligence completo e condições exclusivas de planta.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/lancamentos" style={{
                background: 'var(--gold)', color: 'var(--navy)',
                padding: '15px 36px', borderRadius: 12,
                fontSize: 15, fontWeight: 800, textDecoration: 'none',
                letterSpacing: .3,
              }}>
                Ver empreendimentos
              </Link>
              <Link href="/avaliacao" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                padding: '15px 32px', borderRadius: 12,
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
                backdropFilter: 'blur(8px)',
              }}>
                Agendar apresentação
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ background: 'var(--navy)', padding: '0' }}>
        <div style={{
          width: 'min(1280px,94vw)', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: 'clamp(1.5rem,3vw,2.5rem) 24px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 'clamp(1.6rem,2.8vw,2.2rem)',
                fontFamily: 'var(--font-display)', fontWeight: 400,
                color: 'var(--gold)', marginBottom: 6,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', letterSpacing: .5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Empreendimentos em destaque ── */}
      <section style={{ padding: 'clamp(4rem,7vw,7rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 10 }}>
                Portfólio de lançamentos
              </p>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 400, color: 'var(--navy)', margin: 0 }}>
                Empreendimentos em carteira
              </h2>
            </div>
            <Link href="/lancamentos" style={{
              color: 'var(--navy)', fontSize: 14, fontWeight: 600,
              textDecoration: 'none', borderBottom: '2px solid var(--gold)', paddingBottom: 3,
            }}>
              Ver todos →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 28 }}>
            {lancamentos.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{
                  height: 380, borderRadius: 20,
                  background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
                }} />
              ))
              : lancamentos.map((im, idx) => {
                const foto = im.fotos?.[0]
                const isFirst = idx === 0
                return (
                  <Link key={im.id} href={`/imovel/${im.id}`}
                    style={{ textDecoration: 'none', gridColumn: isFirst ? 'span 2' : 'span 1' }}
                  >
                    <div style={{
                      borderRadius: 20, overflow: 'hidden',
                      background: '#fff', border: '1px solid var(--border)',
                      transition: 'transform .25s, box-shadow .25s',
                      height: isFirst ? 480 : 360,
                      position: 'relative',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 24px 56px rgba(0,0,0,0.14)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
                    >
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: foto ? `url(${foto}) center/cover` : 'var(--navy)',
                      }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(10,18,28,0.88) 0%, transparent 55%)',
                      }} />
                      {isFirst && (
                        <div style={{
                          position: 'absolute', top: 20, left: 20,
                          background: 'var(--gold)', color: 'var(--navy)',
                          fontSize: 11, fontWeight: 800, padding: '5px 14px',
                          borderRadius: 99, letterSpacing: 1, textTransform: 'uppercase',
                        }}>
                          Destaque
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px 26px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6 }}>
                          {im.bairro} · {im.cidade}
                        </p>
                        <h3 style={{
                          color: '#fff', fontSize: isFirst ? 22 : 17,
                          fontWeight: 700, marginBottom: 12, lineHeight: 1.3,
                        }}>
                          {im.titulo}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: isFirst ? 22 : 18, fontWeight: 800, color: 'var(--gold)' }}>
                            {fmt(im.preco)}
                          </span>
                          <span style={{
                            background: 'rgba(255,255,255,0.12)', color: '#fff',
                            fontSize: 12, padding: '5px 12px', borderRadius: 99,
                            backdropFilter: 'blur(8px)',
                          }}>
                            {im.area_m2 && `${im.area_m2}m²`}{im.quartos && ` · ${im.quartos}q`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(4rem,6vw,6rem) 0' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>
              Por que {brand.name}
            </p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', fontWeight: 400, margin: 0 }}>
              Segurança do início ao fim
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 2 }}>
            {DIFERENCIAIS.map((d, i) => (
              <div key={d.title} style={{
                padding: '36px 32px',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{
                  width: 40, height: 3,
                  background: 'var(--gold)', borderRadius: 2, marginBottom: 24,
                }} />
                <h3 style={{
                  color: '#fff', fontSize: 17, fontWeight: 700,
                  marginBottom: 12, fontFamily: 'var(--font-display)',
                }}>
                  {d.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{ padding: 'clamp(4rem,7vw,7rem) 0', background: 'var(--cream)', textAlign: 'center' }}>
        <div style={{ width: 'min(640px,92vw)', margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 16 }}>
            Próximo passo
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', fontWeight: 400, color: 'var(--navy)', marginBottom: 16 }}>
            Agende uma apresentação exclusiva
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            Nossa equipe apresenta os empreendimentos disponíveis, condições de planta e análise de valorização estimada.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/avaliacao" style={{
              background: 'var(--navy)', color: '#fff',
              padding: '15px 36px', borderRadius: 12,
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}>
              Agendar apresentação
            </Link>
            <a href={`https://wa.me/${brand.phone}`} target="_blank" rel="noopener noreferrer" style={{
              background: '#fff', color: 'var(--navy)',
              border: '1px solid var(--border)',
              padding: '15px 32px', borderRadius: 12,
              fontSize: 15, fontWeight: 600, textDecoration: 'none',
            }}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        @media (max-width: 768px) {
          a[style*="gridColumn: span 2"] { grid-column: span 1 !important; }
        }
      `}</style>
    </main>
  )
}
