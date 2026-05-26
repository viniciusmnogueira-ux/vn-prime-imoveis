'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Btn from '@/components/ui/Btn'

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
        background: 'rgba(245,248,250,0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 32 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.02em' }}>VN Prime</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700, color: 'var(--gold-deep)', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 1 }}>Imóveis</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="desktop-nav">
            {NAV.map(item => (
              <div key={item.href} style={{ position: 'relative' }}
                onMouseEnter={() => item.dropdown && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link href={item.href} style={{
                  padding: '7px 13px', borderRadius: 8,
                  fontSize: 13.5, fontWeight: 600,
                  color: pathname === item.href ? 'var(--navy)' : 'var(--navy-muted)',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 4,
                  borderBottom: pathname === item.href ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'color 0.15s',
                  background: item.href === '/vender' ? 'rgba(212,168,87,0.10)' : 'transparent',
                }}>
                  {item.label}
                  {item.dropdown && <span style={{ fontSize: 9, opacity: 0.55 }}>▼</span>}
                </Link>

                {item.dropdown && openMenu === item.label && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, minWidth: 260,
                    background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-strong)', padding: '8px 0', zIndex: 200,
                    marginTop: 4,
                  }}>
                    {item.dropdown.map(d => (
                      <Link key={d.href} href={d.href}
                        style={{ display: 'block', padding: '11px 18px', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)' }}>{d.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{d.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto', flexShrink: 0 }}>
            {user ? (
              <>
                <Link href="/proprietario"
                  style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold-deep)', padding: '8px 14px', textDecoration: 'none' }}>
                  Meu portal
                </Link>
                <Btn variant="ghost" size="sm" onClick={handleSignOut}>Sair</Btn>
              </>
            ) : (
              <>
                <Link href="/login"
                  style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--navy-muted)', padding: '8px 14px', textDecoration: 'none' }}>
                  Entrar
                </Link>
                <Link href="/anunciar">
                  <Btn variant="accent" size="sm">Anunciar imóvel</Btn>
                </Link>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn"
              style={{ background: 'none', border: 'none', color: 'var(--navy)', fontSize: 22, padding: '4px 8px', display: 'none', cursor: 'pointer' }}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#fff',
          paddingTop: 'var(--header-h)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '24px 24px 48px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV.flatMap(item => item.dropdown
              ? item.dropdown.map(d => ({ label: d.label, href: d.href }))
              : [{ label: item.label, href: item.href }]
            ).map(item => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{ padding: '14px 8px', fontSize: 16, fontWeight: 600, color: 'var(--navy)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                {item.label}
              </Link>
            ))}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {user ? (
                <Btn variant="primary" fullWidth onClick={handleSignOut}>Sair</Btn>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}><Btn variant="ghost" size="lg" fullWidth>Entrar</Btn></Link>
                  <Link href="/anunciar" onClick={() => setMobileOpen(false)}><Btn variant="accent" size="lg" fullWidth>Anunciar imóvel</Btn></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
