'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function BrandLockup() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={32} height={32 * 1.13} viewBox="0 0 44 50" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="goldShieldFt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F2DDA9"/>
            <stop offset="45%" stopColor="#D4A857"/>
            <stop offset="62%" stopColor="#B8862E"/>
            <stop offset="100%" stopColor="#D4A857"/>
          </linearGradient>
        </defs>
        <path d="M22 1 L42 6 V24 C42 36 33 45 22 49 C11 45 2 36 2 24 V6 Z"
          stroke="url(#goldShieldFt)" strokeWidth="2.2" fill="rgba(212,168,87,0.05)"/>
        <text x="22" y="32" textAnchor="middle"
          fontFamily="Cinzel, serif" fontSize="18" fontWeight="700"
          fill="url(#goldShieldFt)" letterSpacing="0.03em">VN</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 700, letterSpacing: '0.16em', color: '#F5F8FA' }}>VN PRIME</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 8.5, letterSpacing: '0.42em',
          background: 'linear-gradient(90deg,#B8862E,#D4A857,#B8862E)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginTop: 4,
        }}>IMÓVEIS</span>
      </div>
    </div>
  )
}

function FootCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 18 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'rgba(245,248,250,0.7)', textDecoration: 'none', fontWeight: 300 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,248,250,0.7)')}
            >{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SiteFooter() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [liveCount, setLiveCount] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('imoveis').select('id', { count: 'exact', head: true }).eq('status', 'ativo')
      .then(({ count }) => { if (count != null) setLiveCount(count) })
  }, [])

  if (pathname === '/login') return null

  const saveNewsletter = async () => {
    if (!email.includes('@')) return
    const supabase = createClient()
    await supabase.from('leads').insert({ email, nome: 'Newsletter', origem: 'newsletter', mensagem: 'Newsletter signup' })
    setSaved(true)
  }

  return (
    <>
    {showTop && (
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo"
        style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 9980, width: 44, height: 44, borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold)', border: '1.5px solid rgba(212,168,87,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 2px 12px rgba(15,34,68,0.22)', transition: 'opacity 0.2s', fontFamily: 'inherit' }}>
        ↑
      </button>
    )}
    <footer style={{ background: 'var(--navy)', color: 'rgba(245,248,250,0.72)', padding: '64px 0 32px', marginTop: 60 }}>
      <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>

        {/* Newsletter strip */}
        <div style={{
          background: 'rgba(212,168,87,0.10)', border: '1px solid rgba(212,168,87,0.22)',
          borderRadius: 16, padding: '28px 36px', marginBottom: 48,
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 8 }}>
              Fique por dentro
            </div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
              Receba novos imóveis e lançamentos em primeira mão.
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(245,248,250,0.62)' }}>
              Sem precisar criar uma conta — só nome e e-mail.
              {liveCount != null && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginLeft: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block', boxShadow: '0 0 6px #34D399' }} />
                  <span style={{ color: '#34D399', fontWeight: 600 }}>{liveCount} imóveis ativos agora</span>
                </span>
              )}
            </p>
          </div>
          {saved ? (
            <div style={{ color: '#6EE7B7', fontWeight: 600, fontSize: 14 }}>✓ Inscrito com sucesso!</div>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', width: 200 }} />
              <button onClick={saveNewsletter} style={{
                padding: '10px 22px', borderRadius: 10, border: 'none',
                background: 'var(--gradient-gold)', color: 'var(--navy)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}>Quero receber novidades</button>
            </div>
          )}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gap: 40, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: 40 }}>
          <div>
            <BrandLockup />
            <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 18, color: 'rgba(245,248,250,0.62)', fontWeight: 300, maxWidth: 280 }}>
              Curadoria de imóveis premium em Belo Horizonte, Nova Lima e região metropolitana.
            </p>
          </div>
          <FootCol title="Comprar" links={[
            { label: 'Apartamentos', href: '/busca?tipo=apartamento' },
            { label: 'Casas', href: '/busca?tipo=casa' },
            { label: 'Coberturas', href: '/busca?tipo=cobertura' },
            { label: 'Lançamentos', href: '/lancamentos' },
            { label: 'Por bairro', href: '/busca' },
          ]} />
          <FootCol title="Anuncie" links={[
            { label: 'Anunciar imóvel', href: '/anunciar' },
            { label: 'Como funciona', href: '/como-funciona' },
            { label: 'Para proprietários', href: '/proprietarios' },
            { label: 'Para corretores', href: '/corretores' },
            { label: 'Consórcio', href: '/consorcio' },
          ]} />
          <FootCol title="Empresa" links={[
            { label: 'Sobre', href: '/sobre' },
            { label: 'Due Diligence', href: '/due-diligence' },
            { label: 'Avaliação', href: '/avaliacao' },
            { label: 'Calculadora ITBI', href: '/calculadora' },
            { label: 'Relatório de Mercado', href: '/relatorio' },
            { label: 'Termos e Condições', href: '/termos' },
            { label: 'Política de Privacidade', href: '/politica' },
          ]} />
        </div>

        <div style={{ borderTop: '1px solid rgba(245,248,250,0.10)', paddingTop: 22, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
          <span>© {new Date().getFullYear()} VN Prime Imóveis</span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontStyle: 'italic', color: 'var(--gold-soft)', fontSize: 14, letterSpacing: '0.04em' }}>
              Curadoria silenciosa
            </span>
            <Link href="/politica" style={{ fontSize: 11, color: 'rgba(245,248,250,0.35)', textDecoration: 'none' }}>Privacidade</Link>
            <Link href="/termos" style={{ fontSize: 11, color: 'rgba(245,248,250,0.35)', textDecoration: 'none' }}>Termos</Link>
            <Link href="/admin" style={{ fontSize: 11, color: 'rgba(245,248,250,0.20)', textDecoration: 'none', letterSpacing: '0.1em' }}>admin</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
