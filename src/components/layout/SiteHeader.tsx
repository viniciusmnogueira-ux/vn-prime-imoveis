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
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 8.5, letterSpacing: '0.42em', background: 'linear-gradient(90deg,#B8862E,#D4A857,#B8862E)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginTop: 4 }}>IMÓVEIS</span>
      </div>
    </div>
  )
}

const NAV = [
  { label: 'Início',      href: '/' },
  { label: 'Comprar',     href: '/busca' },
  { label: 'Anuncie',     href: '/vender' },
  { label: 'Lançamentos', href: '/lancamentos' },
  { label: 'Sobre',       href: '/sobre' },
  {
    label: 'Serviços', href: '#',
    dropdown: [
      { label: 'Proprietário Direto',  href: '/proprietario',  desc: 'Anuncie seu imóvel · taxa fixa ou comissão' },
      { label: 'Portal do Corretor',   href: '/corretor',       desc: 'Leads, CRM e portfólio premium de BH' },
      { label: 'Consórcio',            href: '/consorcio',      desc: 'Compre seu imóvel com parcelas acessíveis' },
      { label: 'Due Diligence',        href: '/due-diligence',  desc: 'Análise jurídica e técnica antes de comprar' },
      { label: 'Avaliação de Imóveis', href: '/avaliacao',      desc: 'Laudo judicial, extrajudicial ou estimativa IA' },
      { label: 'Calculadora ITBI',     href: '/calculadora',    desc: 'Calcule ITBI, escritura e registro em segundos' },
      { label: 'Relatório de Mercado', href: '/relatorio',      desc: 'Dados ao vivo do mercado imobiliário de BH' },
    ],
  },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [profileTipo, setProfileTipo] = useState<string | null>(null)
  const [profileNome, setProfileNome] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [sessionAck, setSessionAck] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [topBairros, setTopBairros] = useState<string[]>(['Savassi', 'Lourdes', 'Nova Lima', 'Belvedere', 'Funcionários'])

  const handleSignOut = () => { window.location.href = '/api/auth/signout' }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: p } = await supabase.from('profiles').select('tipo, nome').eq('id', data.user.id).single()
        setProfileTipo(p?.tipo ?? null)
        setProfileNome(p?.nome?.split(' ')[0] ?? null)
        if (!sessionStorage.getItem('vnp_session_ack')) setSessionAck(false)
      }
    })
    supabase.from('imoveis').select('bairro').eq('status', 'ativo').then(({ data }) => {
      if (!data) return
      const counts: Record<string, number> = {}
      data.forEach(i => { if (i.bairro) counts[i.bairro] = (counts[i.bairro] ?? 0) + 1 })
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([b]) => b)
      if (sorted.length >= 3) setTopBairros(sorted)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const supabase2 = createClient()
        const { data: p } = await supabase2.from('profiles').select('tipo, nome').eq('id', session.user.id).single()
        setProfileTipo(p?.tipo ?? null)
        setProfileNome(p?.nome?.split(' ')[0] ?? null)
      } else {
        setProfileTipo(null)
        setProfileNome(null)
        setSessionAck(true)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const ackSession = () => { sessionStorage.setItem('vnp_session_ack', '1'); setSessionAck(true) }

  if (pathname === '/login') return null

  const portalHref = profileTipo === 'admin' ? '/admin' : profileTipo === 'corretor' ? '/corretor' : '/proprietario'

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, height: 'var(--header-h)', background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <BrandLockup />
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }} className="desktop-nav">
            {NAV.map(item => (
              <div key={item.href} style={{ position: 'relative' }}
                onMouseEnter={() => item.dropdown && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}>
                <Link href={item.href} style={{
                  fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                  color: item.href === '/vender' ? 'var(--gold-deep)' : pathname === item.href ? 'var(--navy)' : 'var(--navy-muted)',
                  borderBottom: item.href === '/vender' ? '2px solid var(--gold)' : pathname === item.href ? '2px solid var(--gold)' : '2px solid transparent',
                  background: item.href === '/vender' ? 'rgba(212,168,87,0.10)' : 'transparent',
                  padding: item.href === '/vender' ? '6px 14px' : '8px 0',
                  borderRadius: item.href === '/vender' ? 8 : 0,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'background 0.15s',
                }}>
                  {item.label}
                  {item.dropdown && <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>}
                </Link>
                {item.dropdown && openMenu === item.label && (
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', padding: 10, marginTop: 4, minWidth: 320, zIndex: 200 }}>
                    {item.dropdown.map(d => (
                      <Link key={d.href} href={d.href}
                        style={{ display: 'block', padding: '12px 14px', borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-tint)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
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

          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }} className="desktop-nav">
            {/* Search icon */}
            <button onClick={() => setSearchOpen(true)} aria-label="Buscar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy-muted)', fontSize: 24, padding: '5px 8px', display: 'flex', alignItems: 'center', borderRadius: 8, transition: 'color 0.15s, background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.background = 'rgba(15,34,68,0.06)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            {/* Heart / Favoritos icon */}
            <Link href="/favoritos" aria-label="Meus favoritos" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 8, color: 'var(--navy-muted)', textDecoration: 'none', transition: 'color 0.15s, background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#DC2626'; (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.07)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--navy-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Link>
            <span style={{ width: 1, height: 22, background: 'var(--border)', display: 'inline-block', margin: '0 4px' }} />
            {user ? (
              <>
                {profileTipo === 'admin' && (
                  <Link href="/admin" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--gold-deep)', cursor: 'pointer', fontWeight: 700, textDecoration: 'none', border: '1px solid var(--gold)', padding: '4px 10px', borderRadius: 6 }}>Admin</Link>
                )}
                <Link href={portalHref} style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--navy)', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>
                  {profileNome ? `Olá, ${profileNome}` : 'Meu portal'}
                </Link>
                <Btn variant="ghost" size="sm" onClick={handleSignOut}>Sair</Btn>
              </>
            ) : (
              <Link href="/login"><Btn variant="accent" size="sm">Login</Btn></Link>
            )}
          </div>

          <div className="mobile-menu-btns" style={{ display: 'none', alignItems: 'center', gap: 10 }}>
            {user
              ? <Btn variant="accent" size="sm" onClick={handleSignOut}>Sair</Btn>
              : <Link href="/login"><Btn variant="accent" size="sm">Login</Btn></Link>
            }
            <button onClick={() => setMobileOpen(true)} aria-label="Menu" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
              <span style={{ width: 22, height: 2, background: 'var(--navy)', borderRadius: 2, display: 'block' }} />
              <span style={{ width: 22, height: 2, background: 'var(--navy)', borderRadius: 2, display: 'block' }} />
              <span style={{ width: 16, height: 2, background: 'var(--navy)', borderRadius: 2, display: 'block' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Quick search overlay */}
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(15,24,36,0.5)', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', width: 'min(560px,90vw)', background: '#fff', borderRadius: 16, boxShadow: '0 24px 64px rgba(15,34,68,0.22)', overflow: 'hidden' }}>
            <form onSubmit={e => { e.preventDefault(); if (searchQ.trim()) { window.location.href = `/busca?q=${encodeURIComponent(searchQ.trim())}`; setSearchOpen(false) } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 18, color: 'var(--navy-muted)', flexShrink: 0 }}>⌕</span>
                <input autoFocus type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Buscar imóveis, bairros, tipos…"
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, fontFamily: 'var(--font-body)', color: 'var(--navy)', background: 'transparent' }} />
                <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', fontSize: 16, padding: '2px 4px' }}>✕</button>
              </div>
            </form>
            <div style={{ padding: '12px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11.5, color: 'var(--fg-3)', width: '100%', marginBottom: 4 }}>Buscas rápidas</span>
              {topBairros.map(b => (
                <Link key={b} href={`/busca?q=${encodeURIComponent(b)}`} onClick={() => setSearchOpen(false)}
                  style={{ padding: '5px 12px', borderRadius: 99, border: '1px solid var(--border)', fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', textDecoration: 'none', background: '#F8FAFC', fontFamily: 'var(--font-body)' }}>
                  {b}
                </Link>
              ))}
              <Link href="/lancamentos" onClick={() => setSearchOpen(false)}
                style={{ padding: '5px 12px', borderRadius: 99, border: '1px solid var(--gold)', fontSize: 12.5, fontWeight: 700, color: 'var(--gold-deep)', textDecoration: 'none', background: 'rgba(212,168,87,0.08)', fontFamily: 'var(--font-body)' }}>
                Lançamentos
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Session banner — aparece uma vez por sessão quando logado */}
      {!sessionAck && user && profileNome && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'var(--navy-deep)', color: '#fff', borderRadius: 14, padding: '14px 22px', boxShadow: '0 8px 32px rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.12)' }}>
          <span style={{ fontSize: 14 }}>Você está logado como <strong style={{ color: 'var(--gold)' }}>{profileNome}</strong></span>
          <button onClick={ackSession}
            style={{ padding: '6px 16px', background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Continuar
          </button>
          <button onClick={handleSignOut}
            style={{ padding: '6px 14px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Trocar conta
          </button>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,24,36,0.5)', backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 285, background: '#fff', overflowY: 'auto', boxShadow: '-4px 0 28px rgba(15,24,36,0.20)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <BrandLockup />
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--navy)', padding: 4, lineHeight: 1 }}>✕</button>
            </div>
            <nav style={{ padding: '10px', flex: 1 }}>
              {NAV.map(item => (
                <div key={item.href}>
                  <Link href={item.dropdown ? '#' : item.href} onClick={() => !item.dropdown && setMobileOpen(false)}
                    style={{ display: 'block', padding: '11px 12px', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: item.href === '/vender' ? 'var(--gold-deep)' : 'var(--navy)', background: pathname === item.href ? 'rgba(212,168,87,0.12)' : 'transparent', textDecoration: 'none' }}>
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
                <>
                  {profileTipo === 'admin' && <Link href="/admin" onClick={() => setMobileOpen(false)}><Btn variant="ghost" size="lg" fullWidth>Painel Admin</Btn></Link>}
                  <Link href={portalHref} onClick={() => setMobileOpen(false)}>
                    <Btn variant="ghost" size="lg" fullWidth>{profileNome ? `Olá, ${profileNome}` : 'Meu portal'}</Btn>
                  </Link>
                  <Btn variant="primary" fullWidth onClick={handleSignOut}>Sair</Btn>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}><Btn variant="accent" size="lg" fullWidth>Login</Btn></Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp button */}
      {pathname !== '/admin' && (
        <a
          href="https://wa.me/5531984144250?text=Olá! Tenho interesse em imóveis VN Prime."
          target="_blank" rel="noopener noreferrer"
          aria-label="Falar pelo WhatsApp"
          style={{ position: 'fixed', bottom: 28, right: 24, zIndex: 9990, width: 52, height: 52, borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(37,211,102,0.5)', textDecoration: 'none', transition: 'transform 0.18s, box-shadow 0.18s', fontSize: 26 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 32px rgba(37,211,102,0.65)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(37,211,102,0.5)' }}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
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
