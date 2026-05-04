// Shared chrome — header, footer, brand mark, buttons, pills, formatters
const { useState, useEffect, useRef, useMemo } = React;

const fmtBRL = (n) => 'R$ ' + new Intl.NumberFormat('pt-BR').format(n);
const fmtBRLshort = (n) => {
  if (n >= 1_000_000) return 'R$ ' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace('.', ',') + ' mi';
  if (n >= 1_000) return 'R$ ' + Math.round(n / 1_000) + ' mil';
  return fmtBRL(n);
};

function ShieldMark({ size = 28 }) {
  return (
    <svg width={size} height={size * 1.13} viewBox="0 0 44 50" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="goldShield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5D78E"/>
          <stop offset="45%" stopColor="#C9A84C"/>
          <stop offset="62%" stopColor="#A07830"/>
          <stop offset="100%" stopColor="#C9A84C"/>
        </linearGradient>
      </defs>
      <path d="M22 1 L42 6 V24 C42 36 33 45 22 49 C11 45 2 36 2 24 V6 Z"
        stroke="url(#goldShield)" strokeWidth="2.2" fill="rgba(201,150,14,0.05)"/>
      <text x="22" y="32" textAnchor="middle"
        fontFamily="Cinzel, serif" fontSize="18" fontWeight="700"
        fill="url(#goldShield)" letterSpacing="0.03em">VN</text>
    </svg>
  );
}

function BrandLockup({ onNavy = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <ShieldMark size={32} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 18, letterSpacing: '0.14em',
          color: onNavy ? '#fff' : 'var(--navy)' }}>VN PRIME</span>
        <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 9, letterSpacing: '0.42em',
          background: 'linear-gradient(90deg,#B8892A,#D4A84A,#B8892A)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginTop: 4 }}>IMÓVEIS</span>
      </div>
    </div>
  );
}

function Btn({ variant = 'primary', size = 'md', children, onClick, type, style = {}, fullWidth = false }) {
  const sizes = {
    md: { padding: '0.75rem 1.35rem', fontSize: 14 },
    sm: { padding: '0.5rem 0.95rem', fontSize: 12.5 },
    lg: { padding: '0.95rem 1.7rem', fontSize: 15 },
    xs: { padding: '0.35rem 0.7rem', fontSize: 11.5 },
  };
  const variants = {
    primary: { background: 'var(--navy)', color: 'var(--cream)', boxShadow: '0 4px 20px rgba(15,34,68,0.25)' },
    accent:  { background: 'var(--gold)', color: 'var(--navy)', boxShadow: '0 4px 24px rgba(201,150,14,0.35)', fontWeight: 700 },
    ghost:   { background: 'transparent', color: 'var(--navy)', border: '1px solid var(--border-strong)' },
    ghostOnNavy: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(250,249,246,0.4)' },
    text:    { background: 'transparent', color: 'var(--navy)', boxShadow: 'none' },
  };
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'DM Sans, sans-serif', fontWeight: 600, border: 'none', cursor: 'pointer',
        borderRadius: 8, transition: 'transform 0.15s ease, box-shadow 0.2s, background 0.2s, filter 0.2s',
        width: fullWidth ? '100%' : undefined,
        ...sizes[size], ...variants[variant], ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.04)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >{children}</button>
  );
}

function Eyebrow({ children, color }) {
  return (
    <div style={{ fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase', color: color || 'var(--gold-soft)',
      marginBottom: 10 }}>{children}</div>
  );
}

// ImovelWeb-style operation tabs (Comprar / Alugar / Lançamentos)
function OperationTabs({ value, onChange }) {
  const tabs = [
    { id: 'compra', label: 'Comprar' },
    { id: 'lancamento', label: 'Lançamentos' },
  ];
  return (
    <div style={{ display: 'inline-flex', background: 'rgba(15,34,68,0.55)',
      borderRadius: 10, padding: 4, gap: 2, border: '1px solid rgba(255,255,255,0.12)' }}>
      {tabs.map(t => {
        const active = value === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600,
              padding: '0.55rem 1.1rem', borderRadius: 7, cursor: 'pointer', border: 'none',
              background: active ? 'var(--gold)' : 'transparent',
              color: active ? 'var(--navy)' : 'rgba(250,249,246,0.85)',
              letterSpacing: '0.02em',
              transition: 'background 0.15s ease, color 0.15s ease',
            }}>{t.label}</button>
        );
      })}
    </div>
  );
}

function Pill({ children, tone = 'gold', solid = false, style = {} }) {
  const tones = {
    gold: { bg: solid ? 'var(--gold)' : 'rgba(201,150,14,0.15)', fg: solid ? 'var(--navy)' : 'var(--navy)' },
    navy: { bg: solid ? 'var(--navy)' : 'rgba(15,34,68,0.08)', fg: solid ? '#fff' : 'var(--navy)' },
    new:  { bg: '#065F46', fg: '#fff' },
    featured: { bg: 'var(--gold)', fg: 'var(--navy)' },
  };
  const t = tones[tone] || tones.gold;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999,
      background: t.bg, color: t.fg, ...style,
    }}>{children}</span>
  );
}

// Serviços dropdown card (desktop)
function ServCard({ card, isActive, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov || isActive ? card.accent + '12' : 'transparent',
        border: `2px solid ${isActive ? card.accent : hov ? card.accent + '55' : 'var(--border)'}`,
        borderRadius: 12, padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s ease', width: '100%',
      }}>
      <div style={{ fontSize: 22, marginBottom: 10, lineHeight: 1 }}>{card.icon}</div>
      <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 13.5, lineHeight: 1.2,
        color: isActive || hov ? card.accent : 'var(--navy)', marginBottom: 4 }}>{card.label}</div>
      <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 600,
        color: card.accent, marginBottom: 6, letterSpacing: '0.04em' }}>{card.tagline}</div>
      <div style={{ fontSize: 11.5, color: 'var(--fg-2)', lineHeight: 1.4 }}>{card.desc}</div>
    </button>
  );
}

// Site header — sticky w/ blur
const ROLE_PORTAL = {
  proprietario: 'portal',
  corretor:     'corretor',
  fotografo:    'fotografo',
  comprador:    'busca',
};
const ROLE_AVATAR_COLOR = {
  proprietario: 'var(--gold)',
  corretor:     '#059669',
  fotografo:    '#B87333',
  comprador:    'var(--navy)',
};
const ROLE_CTA = {
  proprietario: { label: 'Anunciar imóvel', route: 'anunciar' },
  corretor:     { label: 'Meu portal',      route: 'corretor' },
  fotografo:    { label: 'Meus jobs',       route: 'fotografo' },
  comprador:    { label: 'Anunciar imóvel', route: null },
};

function SiteHeader({ active, onNav, density = 'comfortable', authUser, onAuthOpen, onLogout }) {
  const pad = density === 'compact' ? '10px 0' : '14px 0';
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [servOpen, setServOpen] = React.useState(false);
  const [dropOpen, setDropOpen] = React.useState(false);
  const dropRef = React.useRef(null);

  const portalRoute = authUser ? (ROLE_PORTAL[authUser.role] || 'portal') : null;
  const avatarColor = authUser ? (ROLE_AVATAR_COLOR[authUser.role] || 'var(--gold)') : null;
  const cta = authUser ? (ROLE_CTA[authUser.role] || ROLE_CTA.comprador) : null;

  const handleCta = () => {
    setMobileOpen(false);
    if (!authUser) { onAuthOpen('criar'); return; }
    if (cta.route) onNav(cta.route);
  };
  const go = (id) => { setMobileOpen(false); setServOpen(false); setDropOpen(false); onNav(id); };

  React.useEffect(() => { setMobileOpen(false); setServOpen(false); setDropOpen(false); }, [active]);

  React.useEffect(() => {
    if (!dropOpen) return;
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  const navItems = [
    { id: 'home',        label: 'Início' },
    { id: 'busca',       label: 'Compra' },
    { id: 'vender',      label: 'Venda' },
    { id: 'lancamentos', label: 'Lançamentos' },
    { id: 'sobre',       label: 'Sobre' },
  ];

  const servCards = [
    { id: 'proprietario',    icon: '🏠', label: 'Proprietário',        tagline: 'Venda seu imóvel',           desc: 'Taxa fixa, assistida ou completa — você escolhe como anunciar.', accent: 'var(--gold)' },
    { id: 'corretor-canal',  icon: '🤝', label: 'Corretor Parceiro',   tagline: 'Leads + CRM + imóveis',      desc: 'Acesse o portfólio premium de BH com ferramentas exclusivas.',    accent: '#059669' },
    { id: 'fotografo-canal', icon: '📷', label: 'Fotógrafo',           tagline: 'Jobs + portfólio + pagamento', desc: 'Fotografe imóveis de alto padrão e receba por job via FactorOne.', accent: '#B87333' },
  ];

  const servActive = ['corretor', 'fotografo', 'anunciar', 'portal', 'proprietario', 'corretor-canal', 'fotografo-canal'].includes(active);

  const linkBase = (isActive) => ({
    fontFamily: 'DM Sans', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
    color: isActive ? 'var(--gold)' : 'var(--navy-muted)',
    borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
    padding: '4px 0', textDecoration: 'none', whiteSpace: 'nowrap',
  });

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(250,249,246,0.97)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: pad, gap: 16 }}>

        {/* Logo */}
        <a onClick={(e) => { e.preventDefault(); go('home'); }}
           style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <BrandLockup />
        </a>

        {/* ── Desktop nav ── */}
        <nav className="vnp-nav-desktop" style={{ alignItems: 'center', gap: 22 }}>
          {navItems.map(it => (
            <a key={it.id} onClick={(e) => { e.preventDefault(); go(it.id); }}
               style={linkBase(active === it.id)}>{it.label}</a>
          ))}

          {/* SERVIÇOS dropdown — click-based, 3 visual cards */}
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button onClick={() => setDropOpen(o => !o)} style={{
              ...linkBase(servActive),
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            }}>
              Serviços
              <span style={{ fontSize: 9, opacity: 0.65, display: 'inline-block',
                transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
            </button>
            {dropOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff', borderRadius: 16, padding: '10px',
                boxShadow: '0 20px 56px rgba(15,34,68,0.18), 0 0 0 1px rgba(15,34,68,0.08)',
                width: 510, zIndex: 200,
              }}>
                {/* Arrow */}
                <div style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
                  borderBottom: '7px solid #fff',
                  filter: 'drop-shadow(0 -1px 0 rgba(15,34,68,0.06))',
                }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {servCards.map(card => (
                    <ServCard key={card.id} card={card} isActive={active === card.id} onClick={() => go(card.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <span style={{ width: 1, height: 22, background: 'var(--border)' }} />

          {authUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <a onClick={() => go(portalRoute)} style={{
                fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600,
                color: 'var(--navy)', cursor: 'pointer', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <span style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: avatarColor, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                }}>{authUser.name.charAt(0).toUpperCase()}</span>
                {authUser.name.split(' ')[0]}
              </a>
              <button onClick={onLogout} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: 12, color: 'var(--fg-2)',
              }}>Sair</button>
            </div>
          ) : (
            <a onClick={() => onAuthOpen('entrar')} style={{
              fontFamily: 'DM Sans', fontSize: 13, color: 'var(--navy-muted)', cursor: 'pointer',
            }}>Entrar</a>
          )}
          <Btn size="sm" variant="primary" onClick={handleCta}>
            {authUser ? cta.label : 'Cadastrar'}
          </Btn>
        </nav>

        {/* ── Hamburger (mobile only) ── */}
        <button className="vnp-hamburger" onClick={() => setMobileOpen(o => !o)}
          style={{
            width: 40, height: 40, background: 'none', border: '1px solid var(--border)',
            borderRadius: 8, cursor: 'pointer', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5, padding: 0,
          }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 20, height: 2,
              background: 'var(--navy)', borderRadius: 2, transition: 'all 0.2s',
              transform: mobileOpen
                ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                : i === 2 ? 'rotate(-45deg) translate(5px,-5px)'
                : 'scaleX(0)'
                : 'none',
            }} />
          ))}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`vnp-drawer${mobileOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
          {navItems.map(it => (
            <a key={it.id} onClick={() => go(it.id)} style={{
              padding: '13px 16px', borderRadius: 10,
              fontFamily: 'DM Sans', fontSize: 16, fontWeight: active === it.id ? 700 : 500,
              color: active === it.id ? 'var(--gold)' : 'var(--navy)',
              background: active === it.id ? 'rgba(201,150,14,0.08)' : 'transparent',
              cursor: 'pointer', textDecoration: 'none', display: 'block',
            }}>{it.label}</a>
          ))}

          {/* Serviços expandable */}
          <div>
            <button onClick={() => setServOpen(o => !o)} style={{
              width: '100%', padding: '13px 16px', borderRadius: 10,
              fontFamily: 'DM Sans', fontSize: 16, fontWeight: servActive ? 700 : 500,
              color: servActive ? 'var(--gold)' : 'var(--navy)',
              background: servActive ? 'rgba(201,150,14,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              Serviços
              <span style={{ fontSize: 12, opacity: 0.55 }}>{servOpen ? '▴' : '▾'}</span>
            </button>
            {servOpen && (
              <div style={{ paddingLeft: 16, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {servCards.map(s => (
                  <a key={s.id} onClick={() => go(s.id)} style={{
                    padding: '10px 16px', borderRadius: 8,
                    fontFamily: 'DM Sans', fontSize: 14, fontWeight: active === s.id ? 700 : 400,
                    color: active === s.id ? s.accent : 'var(--navy)',
                    background: active === s.id ? 'rgba(201,150,14,0.08)' : 'transparent',
                    cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span>{s.icon}</span>{s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

        {authUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 4px', marginBottom: 4 }}>
              <span style={{
                width: 40, height: 40, borderRadius: '50%',
                background: avatarColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 16, flexShrink: 0,
              }}>{authUser.name.charAt(0).toUpperCase()}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{authUser.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', textTransform: 'capitalize' }}>{authUser.role}</div>
              </div>
            </div>
            <button onClick={() => go(portalRoute)} style={{
              padding: '13px', background: 'var(--navy)', color: '#fff',
              border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Meu portal</button>
            <button onClick={() => { setMobileOpen(false); onLogout(); }} style={{
              padding: '11px', background: 'transparent', color: 'var(--fg-2)',
              border: '1px solid var(--border)', borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: 'pointer',
            }}>Sair</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { setMobileOpen(false); onAuthOpen('entrar'); }} style={{
              padding: '13px', background: 'transparent', color: 'var(--navy)',
              border: '1.5px solid var(--border)', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}>Entrar</button>
            <button onClick={handleCta} style={{
              padding: '13px',
              background: 'linear-gradient(135deg, var(--gold) 0%, #e6a800 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Cadastrar</button>
          </div>
        )}
      </div>
    </header>
  );
}

// Auth modal — login + criar conta (com seleção de perfil)
const ROLES = [
  {
    id: 'proprietario',
    label: 'Proprietário',
    desc: 'Quero anunciar meu imóvel',
    icon: '🏠',
    accent: 'var(--gold)',
  },
  {
    id: 'corretor',
    label: 'Corretor',
    desc: 'Sou parceiro VN Prime',
    icon: '🤝',
    accent: '#059669',
  },
  {
    id: 'fotografo',
    label: 'Fotógrafo',
    desc: 'Ofereço serviços de mídia',
    icon: '📷',
    accent: '#B87333',
  },
  {
    id: 'comprador',
    label: 'Comprador',
    desc: 'Quero encontrar um imóvel',
    icon: '🔍',
    accent: 'var(--navy)',
  },
];

function AuthModal({ isOpen, defaultTab = 'entrar', onClose, onAuth }) {
  const [tab, setTab] = useState(defaultTab);
  const [step, setStep] = useState(1); // 1: dados, 2: perfil
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setTab(defaultTab);
    setStep(1);
    setError('');
    setRole('');
  }, [defaultTab, isOpen]);

  if (!isOpen) return null;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      setError('Preencha todos os campos obrigatórios.'); return;
    }
    setStep(2);
  };

  const handleFinish = () => {
    if (!role) { setError('Selecione seu perfil para continuar.'); return; }
    const user = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role,
    };
    localStorage.setItem('vnprime_user', JSON.stringify(user));
    onAuth(user);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const stored = localStorage.getItem('vnprime_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.email === form.email.trim()) { onAuth(user); return; }
    }
    setError('E-mail não encontrado. Crie uma conta para continuar.');
  };

  const fl = { display: 'flex', flexDirection: 'column', gap: 6 };
  const lb = {
    fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-2)',
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'rgba(15,34,68,0.58)', backdropFilter: 'blur(5px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '2rem',
        width: '100%', maxWidth: 460,
        boxShadow: '0 28px 64px rgba(15,34,68,0.24)', position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, border: 'none',
          background: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--fg-2)', lineHeight: 1,
        }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}><BrandLockup /></div>

        {/* Tabs — só visíveis no step 1 */}
        {step === 1 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            {[['entrar', 'Entrar'], ['criar', 'Criar conta']].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setError(''); }} style={{
                flex: 1, padding: '0.65rem', border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: 14, fontWeight: 600,
                color: tab === id ? 'var(--gold)' : 'var(--fg-2)',
                borderBottom: tab === id ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: -1,
              }}>{label}</button>
            ))}
          </div>
        )}

        {/* STEP 2 — Seleção de perfil */}
        {tab === 'criar' && step === 2 ? (
          <div>
            <p style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 15, color: 'var(--navy)', margin: '0 0 6px', textAlign: 'center' }}>
              Olá, {form.name.split(' ')[0]}! Quem é você?
            </p>
            <p style={{ fontSize: 13, color: 'var(--fg-2)', textAlign: 'center', margin: '0 0 20px' }}>
              Vamos personalizar sua experiência na plataforma.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {ROLES.map(r => (
                <button key={r.id} type="button" onClick={() => { setRole(r.id); setError(''); }} style={{
                  border: `2px solid ${role === r.id ? r.accent : 'var(--border)'}`,
                  borderRadius: 14, padding: '18px 14px', cursor: 'pointer', background: '#fff',
                  textAlign: 'center', transition: 'border-color 0.15s, box-shadow 0.15s',
                  boxShadow: role === r.id ? `0 0 0 3px ${r.accent}22` : 'none',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{r.icon}</div>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-2)', lineHeight: 1.4 }}>{r.desc}</div>
                </button>
              ))}
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
            <Btn variant="accent" fullWidth onClick={handleFinish}>
              Criar minha conta →
            </Btn>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button type="button" onClick={() => { setStep(1); setError(''); }} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--fg-2)', textDecoration: 'underline',
              }}>← Voltar</button>
            </div>
          </div>
        ) : (
          /* STEP 1 — Formulário */
          <form onSubmit={tab === 'criar' ? handleStep1 : handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tab === 'criar' && (
              <div style={fl}>
                <label style={lb}>Nome completo *</label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Seu nome completo" required />
              </div>
            )}
            <div style={fl}>
              <label style={lb}>E-mail *</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required />
            </div>
            {tab === 'criar' && (
              <div style={fl}>
                <label style={lb}>WhatsApp *</label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="(31) 99999-9999" required />
              </div>
            )}
            <div style={fl}>
              <label style={lb}>Senha *</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>}

            {tab === 'criar' && (
              <p style={{ fontSize: 12, color: 'var(--fg-2)', margin: 0, lineHeight: 1.6 }}>
                Ao criar sua conta você concorda com os{' '}
                <a href="#" style={{ color: 'var(--gold)' }}>termos de uso</a> e{' '}
                <a href="#" style={{ color: 'var(--gold)' }}>política de privacidade</a>.
              </p>
            )}

            <Btn type="submit" variant="accent" fullWidth style={{ marginTop: 4 }}>
              {tab === 'entrar' ? 'Entrar na plataforma' : 'Continuar →'}
            </Btn>

            <div style={{ textAlign: 'center' }}>
              <button type="button" onClick={() => { setTab(tab === 'entrar' ? 'criar' : 'entrar'); setError(''); }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--navy)', textDecoration: 'underline' }}>
                {tab === 'entrar' ? 'Ainda não tem conta? Criar agora' : 'Já tenho uma conta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function SiteFooter({ onNav }) {
  const nav = onNav || (() => {});
  const cols = [
    {
      title: 'Comprar',
      items: [
        { label: 'Apartamentos',   action: () => nav('busca', { tipo: 'Apartamento' }) },
        { label: 'Casas',          action: () => nav('busca', { tipo: 'Casa' }) },
        { label: 'Coberturas',     action: () => nav('busca', { tipo: 'Cobertura' }) },
        { label: 'Lançamentos',    action: () => nav('lancamentos') },
        { label: 'Ver todos',      action: () => nav('busca') },
      ],
    },
    {
      title: 'Vender',
      items: [
        { label: 'Anunciar imóvel',  action: () => nav('anunciar') },
        { label: 'Modalidades',      action: () => nav('vender') },
        { label: 'Para corretores',  action: () => nav('corretor') },
        { label: 'Para fotógrafos',  action: () => nav('fotografo') },
        { label: 'BOOSTER',          action: () => nav('portal') },
      ],
    },
    {
      title: 'Empresa',
      items: [
        { label: 'Sobre',                  action: () => nav('sobre') },
        { label: 'Como funciona',          action: () => nav('vender') },
        { label: 'Contato',                action: () => {} },
        { label: 'Política de privacidade',action: () => {} },
      ],
    },
  ];

  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(250,249,246,0.75)', padding: '48px 0 28px', marginTop: 60 }}>
      <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <BrandLockup onNavy />
            <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 16, color: 'rgba(250,249,246,0.7)' }}>
              Inteligência aplicada ao mercado imobiliário. BH, Nova Lima e região metropolitana.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              {['Instagram', 'LinkedIn', 'YouTube'].map(s => (
                <span key={s} style={{
                  padding: '5px 10px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  color: 'rgba(250,249,246,0.7)',
                  letterSpacing: '0.04em',
                }}>{s}</span>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 14 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.items.map(it => (
                  <li key={it.label}>
                    <a onClick={it.action} style={{
                      fontSize: 13, color: 'rgba(250,249,246,0.75)',
                      textDecoration: 'none', cursor: 'pointer',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(250,249,246,0.75)'}
                    >{it.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(250,249,246,0.12)', paddingTop: 18,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
          <span>© 2026 VN Prime Imóveis · CRECI-MG 12.345-J</span>
          <span style={{ color: 'var(--gold-soft)', fontFamily: 'DM Sans', letterSpacing: '0.1em' }}>
            INTELIGÊNCIA APLICADA AO MERCADO IMOBILIÁRIO
          </span>
        </div>
      </div>
    </footer>
  );
}

// Property feature row (icons + numbers) — used on cards & detail
function FeatureRow({ areaM2, quartos, suites, vagas, banheiros, compact = false }) {
  const items = [
    { icon: '⌗', val: areaM2, lbl: 'm²' },
    { icon: '⌂', val: quartos, lbl: quartos === 1 ? 'qto' : 'qtos' },
    { icon: '✦', val: suites, lbl: suites === 1 ? 'suíte' : 'suítes' },
    { icon: '⛌', val: vagas, lbl: vagas === 1 ? 'vaga' : 'vagas' },
  ];
  if (banheiros !== undefined) items.splice(3, 0, { icon: '☂', val: banheiros, lbl: banheiros === 1 ? 'banh.' : 'banhs.' });
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: compact ? 12 : 18,
      fontFamily: 'DM Sans', fontSize: compact ? 12 : 13, color: 'var(--fg-2)' }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: 'var(--gold)', fontSize: compact ? 13 : 15, lineHeight: 1 }}>{it.icon}</span>
          <b style={{ color: 'var(--navy)', fontWeight: 600 }}>{it.val}</b>
          <span>{it.lbl}</span>
        </span>
      ))}
    </div>
  );
}

Object.assign(window, {
  fmtBRL, fmtBRLshort,
  ShieldMark, BrandLockup, Btn, Eyebrow, OperationTabs, Pill,
  SiteHeader, SiteFooter, FeatureRow, AuthModal,
});
