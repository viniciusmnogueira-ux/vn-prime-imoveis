'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Btn from '@/components/ui/Btn'

function ShieldMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.13} viewBox="0 0 44 50" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="goldShield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2DDA9"/>
          <stop offset="45%" stopColor="#D4A857"/>
          <stop offset="62%" stopColor="#B8862E"/>
          <stop offset="100%" stopColor="#D4A857"/>
        </linearGradient>
      </defs>
      <path d="M22 1 L42 6 V24 C42 36 33 45 22 49 C11 45 2 36 2 24 V6 Z"
        stroke="url(#goldShield)" strokeWidth="2.2" fill="rgba(212,168,87,0.05)"/>
      <text x="22" y="32" textAnchor="middle"
        fontFamily="Cinzel, serif" fontSize="18" fontWeight="700"
        fill="url(#goldShield)" letterSpacing="0.03em">VN</text>
    </svg>
  )
}

function BrandLockup({ onNavy = false }: { onNavy?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <ShieldMark size={32} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 700, letterSpacing: '0.16em', color: onNavy ? '#F5F8FA' : 'var(--navy)' }}>VN PRIME</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 8.5, letterSpacing: '0.42em',
          background: 'linear-gradient(90deg,#B8862E,#D4A857,#B8862E)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginTop: 4,
        }}>IMÓVEIS</span>
      </div>
    </div>
  )
}

const NAV = [
  { label: 'Buscar',      href: '/busca' },
  { label: 'Lançamentos', href: '/lancamentos' },
  { label: 'Vender',      href: '/vender' },
  { label: 'Sobre',       href: '/sobre' },
  {
    label: 'Serviços', href: '#',
    dropdown: [
      { label: 'Proprietário Direto',  href: '/proprietario',  desc: 'Anuncie · taxa fixa ou comissão' },
      { label: 'Portal do Corretor',   href: '/corretor',       desc: 'Leads, CRM e portfólio premium' },
      { label: 'Consórcio',            href: '/consorcio',      desc: 'Compre sem juros com carta de crédito' },
      { label: 'Due Diligence',        href: '/due-diligence',  desc: 'Análise jurídica antes de comprar' },
      { label: 'Avaliação de Imóveis', href: '/avaliacao',      desc: 'Laudo judicial, extrajudicial ou IA' },
      { label: 'Calculadora ITBI',     href: '/calculadora',    desc: 'ITBI + escritura + registro gratuito' },
    ],
  },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--header-h)',
        background: 'rgba(245,248,250,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <BrandLockup />
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }} className="desktop-nav">
            {NAV.map(item => (
              <div key={item.href} style={{ position: 'relative' }}
                onMouseEnter={() => item.dropdown && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link href={item.href} style={{
                  fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                  color: item.href === '/vender'
                    ? 'var(--gold-deep)'
                    : pathname === item.href ? 'var(--navy)' : 'var(--navy-muted)',
                  borderBottom: item.href === '/vender'
                    ? '2px solid var(--gold)'
                    : pathname === item.href ? '2px solid var(--gold)' : '2px solid transparent',
                  background: item.href === '/vender' ? 'rgba(212,168,87,0.10)' : 'transparent',
                  padding: item.href === '/vender' ? '6px 14px' : '8px 0',
                  borderRadius: item.href === '/vender' ? 8 : 0,
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  transition: 'background 0.15s',
                }}>
                  {item.label}
                  {item.dropdown && <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>}
                </Link>

                {item.dropdown && openMenu === item.label && (
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    background: '#fff', borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)',
                    padding: 10, marginTop: 4, minWidth: 320, zIndex: 200,
                  }}>
                    {item.dropdown.map(d => (
                      <Link key={d.href} href={d.href}
                        style={{ display: 'block', padding: '12px 14px', borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-tint)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{d.label}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>{d.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <span style={{ width: 1, height: 22, background: 'var(--border)', display: 'inline-block' }} />
          </nav>

          {/* Auth */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }} className="desktop-nav">
            {user ? (
              <>
                <Link href="/proprietario"
                  style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--navy)', cursor: 'pointer', letterSpacing: 0, fontWeight: 600, textDecoration: 'none' }}>
                  Meu portal
                </Link>
                <Btn variant="ghost" size="sm" onClick={handleSignOut}>Sair</Btn>
              </>
            ) : (
              <>
                <Link href="/login"
                  style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--navy)', cursor: 'pointer', letterSpacing: 0, fontWeight: 600, textDecoration: 'none' }}>
                  Entrar
                </Link>
                <Link href="/anunciar"><Btn variant="accent" size="sm">Anunciar grátis</Btn></Link>
              </>
            )}
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="mobile-menu-btns" style={{ display: 'none', alignItems: 'center', gap: 10 }}>
            <Link href="/vender"><Btn variant="accent" size="sm">Anunciar</Btn></Link>
            <button onClick={() => setMobileOpen(true)} aria-label="Menu" style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
            }}>
              <span style={{ width: 22, height: 2, background: 'var(--navy)', borderRadius: 2, display: 'block' }} />
              <span style={{ width: 22, height: 2, background: 'var(--navy)', borderRadius: 2, display: 'block' }} />
              <span style={{ width: 16, height: 2, background: 'var(--navy)', borderRadius: 2, display: 'block' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — right-side panel */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
          {/* Backdrop */}
          <div onClick={() => setMobileOpen(false)} style={{
            position: 'absolute', inset: 0,
            background: 'rgba(15,24,36,0.5)', backdropFilter: 'blur(2px)',
          }} />
          {/* Panel */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 285,
            background: '#fff', overflowY: 'auto',
            boxShadow: '-4px 0 28px rgba(15,24,36,0.20)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <BrandLockup />
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--navy)', padding: 4, lineHeight: 1 }}>✕</button>
            </div>
            <nav style={{ padding: '10px', flex: 1 }}>
              {NAV.map(item => (
                <div key={item.href}>
                  <Link href={item.dropdown ? '#' : item.href}
                    onClick={() => !item.dropdown && setMobileOpen(false)}
                    style={{
                      display: 'block', padding: '11px 12px', borderRadius: 10,
                      fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                      color: item.href === '/vender' ? 'var(--gold-deep)' : 'var(--navy)',
                      background: pathname === item.href ? 'rgba(212,168,87,0.12)' : 'transparent',
                      textDecoration: 'none',
                    }}>
                    {item.label}
                    {item.dropdown && <span style={{ fontSize: 10, opacity: 0.45, marginLeft: 6 }}>▼</span>}
                  </Link>
                  {item.dropdown && (
                    <div style={{ paddingLeft: 16, marginBottom: 4 }}>
                      {item.dropdown.map(d => (
                        <Link key={d.href} href={d.href} onClick={() => setMobileOpen(false)}
                          style={{ display: 'block', padding: '8px 12px', borderRadius: 8, fontSize: 13.5, color: 'var(--fg-2)', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div style={{ padding: '14px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user ? (
                <Btn variant="primary" fullWidth onClick={handleSignOut}>Sair</Btn>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}><Btn variant="ghost" size="lg" fullWidth>Entrar</Btn></Link>
                  <Link href="/anunciar" onClick={() => setMobileOpen(false)}><Btn variant="accent" size="lg" fullWidth>Anunciar grátis</Btn></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btns { display: flex !important; }
        }
      `}</style>
    </>
  )
}
