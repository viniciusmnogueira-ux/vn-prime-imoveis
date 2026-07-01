'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SITE_CONFIG } from '@/lib/config'

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

export default function HomeVitrine() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [pmax, setPmax] = useState('')
  const [imoveis, setImoveis] = useState<any[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const { brand } = SITE_CONFIG

  useEffect(() => {
    const sb = createClient()
    sb.from('imoveis')
      .select('id,titulo,tipo,bairro,cidade,preco,area_m2,quartos,fotos')
      .eq('status', 'ativo')
      .order('destaque', { ascending: false })
      .order('criado_em', { ascending: false })
      .limit(9)
      .then(({ data }) => setImoveis(data || []))

    sb.from('imoveis')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'ativo')
      .then(({ count }) => { if (count != null) setTotal(count) })
  }, [])

  const href = `/busca${q || tipo || pmax
    ? `?q=${encodeURIComponent(q)}${tipo ? `&tipo=${tipo}` : ''}${pmax ? `&pmax=${pmax}` : ''}`
    : ''}`

  return (
    <main>
      {/* ── Hero busca ── */}
      <section style={{
        position: 'relative', minHeight: '72vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--navy-deep)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=85)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,24,36,0.6) 0%, rgba(15,24,36,0.92) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, width: 'min(820px,92vw)', textAlign: 'center' }}>
          <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            {brand.tagline}
          </p>
          <h1 style={{
            color: '#fff', fontSize: 'clamp(2rem,4.5vw,3.4rem)',
            fontFamily: 'var(--font-display)', fontWeight: 400,
            lineHeight: 1.15, marginBottom: 12,
          }}>
            Encontre o imóvel<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>certo para você</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 17, marginBottom: 36 }}>
            {total != null ? `${total} imóveis disponíveis` : 'Imóveis selecionados'} · {brand.city}
          </p>

          {/* Search box */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: '6px 6px 6px 20px',
            display: 'flex', gap: 8, alignItems: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && router.push(href)}
              placeholder="Buscar por bairro, cidade ou tipo…"
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 15.5,
                color: 'var(--navy)', background: 'transparent', minWidth: 0,
              }}
            />
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              style={{
                border: 'none', outline: 'none', fontSize: 14, color: 'var(--navy)',
                background: '#F8F9FB', padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
              }}
            >
              <option value="">Tipo</option>
              {['Apartamento','Casa','Cobertura','Studio','Terreno','Comercial'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              value={pmax}
              onChange={e => setPmax(e.target.value)}
              style={{
                border: 'none', outline: 'none', fontSize: 14, color: 'var(--navy)',
                background: '#F8F9FB', padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
              }}
            >
              <option value="">Até</option>
              {[['300000','R$ 300 mil'],['500000','R$ 500 mil'],['800000','R$ 800 mil'],['1200000','R$ 1,2 mi'],['2000000','R$ 2 mi']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <Link href={href} style={{
              background: 'var(--navy)', color: '#fff',
              padding: '12px 28px', borderRadius: 12,
              fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
              textDecoration: 'none', flexShrink: 0,
              transition: 'background .15s',
            }}>
              Buscar
            </Link>
          </div>

          {/* Quick tags */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            {['Apartamentos BH','Casas condomínio','Coberturas','Acima de R$ 1mi','Lançamentos'].map(tag => (
              <Link key={tag} href={`/busca?q=${encodeURIComponent(tag)}`} style={{
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)',
                padding: '6px 14px', borderRadius: 99, fontSize: 12.5,
                textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all .15s',
              }}>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Imóveis ── */}
      <section style={{ padding: 'clamp(3rem,5vw,5rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 6 }}>
                Portfólio
              </p>
              <h2 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, color: 'var(--navy)' }}>
                Imóveis disponíveis
              </h2>
            </div>
            <Link href="/busca" style={{
              color: 'var(--navy)', fontSize: 14, fontWeight: 600,
              textDecoration: 'none', borderBottom: '1px solid var(--navy)',
              paddingBottom: 2,
            }}>
              Ver todos →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
            gap: 24,
          }}>
            {imoveis.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  height: 320, borderRadius: 16,
                  background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                }} />
              ))
              : imoveis.map(im => {
                const foto = im.fotos?.[0]
                return (
                  <Link key={im.id} href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff', borderRadius: 16,
                      overflow: 'hidden', border: '1px solid var(--border)',
                      transition: 'transform .2s, box-shadow .2s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
                    >
                      <div style={{
                        height: 200,
                        background: foto ? `url(${foto}) center/cover` : 'var(--navy)',
                        position: 'relative',
                      }}>
                        <span style={{
                          position: 'absolute', top: 12, left: 12,
                          background: 'rgba(15,24,36,0.75)', color: '#fff',
                          fontSize: 11, fontWeight: 700, padding: '4px 10px',
                          borderRadius: 99, backdropFilter: 'blur(4px)',
                        }}>
                          {im.tipo}
                        </span>
                      </div>
                      <div style={{ padding: '16px 18px 18px' }}>
                        <p style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 4 }}>
                          {im.bairro} · {im.cidade}
                        </p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 10, lineHeight: 1.3 }}>
                          {im.titulo}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>
                            {fmt(im.preco)}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                            {im.area_m2 && `${im.area_m2}m²`}
                            {im.quartos && ` · ${im.quartos}q`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </section>

      {/* ── CTA anunciar ── */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(3rem,5vw,4rem) 0' }}>
        <div style={{
          width: 'min(860px,92vw)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 400, margin: '0 0 8px' }}>
              Quer anunciar seu imóvel?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, margin: 0 }}>
              Cadastre em minutos e receba leads qualificados
            </p>
          </div>
          <Link href="/anunciar" style={{
            background: 'var(--gold)', color: 'var(--navy)',
            padding: '14px 32px', borderRadius: 12,
            fontSize: 15, fontWeight: 700, textDecoration: 'none',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Anunciar agora
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </main>
  )
}
