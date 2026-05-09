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

// ImovelWeb-style operation tabs (Comprar / Vender)
function OperationTabs({ value, onChange }) {
  const tabs = [
    { id: 'compra', label: 'Comprar' },
    { id: 'venda',  label: 'Vender' },
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
  corretor:     { label: 'Meu portal',           route: 'corretor' },
  fotografo:    { label: 'Meus jobs',            route: 'fotografo' },
  comprador:    { label: 'Anunciar imóvel', route: null },
};

const SERVICOS_ITEMS = [
  { id: 'proprietario',   label: 'Área do Proprietário', desc: 'Anuncie seu imóvel — taxa fixa ou comissão' },
  { id: 'corretor-canal', label: 'Portal do Corretor',   desc: 'Leads, CRM e portfólio premium de BH' },
  { id: 'consorcio',      label: 'Consórcio',            desc: 'Compre sem juros com carta de crédito' },
  { id: 'due-diligence',  label: 'Due Diligence',        desc: 'Análise jurídica e técnica antes de comprar' },
  { id: 'fotografo-canal',label: 'Fotógrafo',            desc: 'Fotografia e mídias para imóveis de alto padrão' },
];

function SiteHeader({ active, onNav, density = 'comfortable', authUser, onAuthOpen, onLogout }) {
  const pad = density === 'compact' ? '10px 0' : '14px 0';
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDrop, setOpenDrop] = React.useState(null);
  const [servicosMob, setServicosMob] = React.useState(false);
  const navRef = React.useRef(null);

  const portalRoute = authUser ? (ROLE_PORTAL[authUser.role] || 'portal') : null;
  const avatarColor = authUser ? (ROLE_AVATAR_COLOR[authUser.role] || 'var(--gold)') : null;
  const cta = authUser ? (ROLE_CTA[authUser.role] || ROLE_CTA.comprador) : null;

  const handleCta = () => {
    setMobileOpen(false);
    if (!authUser) { onNav('vender'); return; }
    if (cta.route) onNav(cta.route);
  };
  const go = (id) => { setMobileOpen(false); setOpenDrop(null); setServicosMob(false); onNav(id); };

  React.useEffect(() => { setMobileOpen(false); setOpenDrop(null); }, [active]);

  React.useEffect(() => {
    if (!openDrop) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDrop(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDrop]);

  const navItems = [
    { id: 'home',        label: 'Início' },
    { id: 'busca',       label: 'Comprar' },
    { id: 'vender',      label: 'Vender' },
    { id: 'lancamentos', label: 'Lançamentos' },
    { id: 'sobre',       label: 'Sobre' },
  ];

  const servicosActive = ['anunciar', 'proprietario', 'corretor', 'corretor-canal', 'portal', 'consorcio', 'due-diligence', 'fotografo-canal', 'fotografo'].includes(active);

  const linkBase = (isActive) => ({
    fontFamily: 'DM Sans', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
    color: isActive ? 'var(--gold)' : 'var(--navy-muted)',
    borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
    padding: '4px 0', textDecoration: 'none', whiteSpace: 'nowrap',
  });

  function DropMenu({ items }) {
    return (
      <div style={{
        position: 'absolute', top: 'calc(100% + 12px)', left: 0,
        background: '#fff', borderRadius: 14, padding: '8px',
        boxShadow: '0 20px 56px rgba(15,34,68,0.18), 0 0 0 1px rgba(15,34,68,0.08)',
        minWidth: 240, zIndex: 200,
      }}>
        <div style={{ position: 'absolute', top: -7, left: 24, width: 0, height: 0,
          borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
          borderBottom: '7px solid #fff',
          filter: 'drop-shadow(0 -1px 0 rgba(15,34,68,0.06))',
        }} />
        {items.map(it => (
          <button key={it.id} onClick={() => go(it.id)} style={{
            display: 'block', width: '100%', padding: '10px 14px',
            borderRadius: 8, border: 'none',
            background: active === it.id ? 'rgba(201,150,14,0.08)' : 'transparent',
            cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,34,68,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = active === it.id ? 'rgba(201,150,14,0.08)' : 'transparent'}
          >
            <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 13.5,
              color: active === it.id ? 'var(--gold)' : 'var(--navy)', marginBottom: 2 }}>{it.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-2)', lineHeight: 1.4 }}>{it.desc}</div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(250,249,246,0.97)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div ref={navRef} style={{ width: 'min(1280px, 94vw)', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: pad, gap: 16 }}>

        {/* Logo */}
        <a onClick={(e) => { e.preventDefault(); go('home'); }}
           style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <BrandLockup />
        </a>

        {/* Desktop nav */}
        <nav className="vnp-nav-desktop" style={{ alignItems: 'center', gap: 22 }}>
          {navItems.map(it => (
            <a key={it.id} onClick={(e) => { e.preventDefault(); go(it.id); }}
               style={linkBase(active === it.id)}>{it.label}</a>
          ))}

          {/* SERVICOS dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setOpenDrop(o => o === 'servicos' ? null : 'servicos')} style={{
              ...linkBase(servicosActive),
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            }}>
              Serviços
              <span style={{ fontSize: 9, opacity: 0.65, display: 'inline-block',
                transform: openDrop === 'servicos' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>{'▾'}</span>
            </button>
            {openDrop === 'servicos' && <DropMenu items={SERVICOS_ITEMS} />}
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
              {(authUser.email === 'vinicius.mnogueira@gmail.com' || authUser.role === 'admin') && (
                <a onClick={() => go('admin')} title="Portal Admin" style={{
                  fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  color: 'var(--gold)', cursor: 'pointer', textDecoration: 'none',
                  padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(201,150,14,0.1)', border: '1px solid rgba(201,150,14,0.3)',
                }}>ADMIN</a>
              )}
              <button onClick={onLogout} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: 12, color: 'var(--fg-2)',
              }}>Sair</button>
            </div>
          ) : (
            <button onClick={() => onAuthOpen('entrar')} style={{
              fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em',
              color: 'var(--navy)', border: '1.5px solid rgba(15,34,68,0.25)',
              background: 'transparent', borderRadius: 8, padding: '6px 16px',
              cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
            }}>ENTRAR</button>
          )}
          <Btn size="sm" variant="accent" onClick={handleCta}>
            {authUser ? cta.label : 'Anunciar grátis'}
          </Btn>
        </nav>

        {/* Hamburger (mobile only) */}
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

      {/* Mobile drawer */}
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

          {/* Servicos expandable */}
          <div>
            <button onClick={() => setServicosMob(o => !o)} style={{
              width: '100%', padding: '13px 16px', borderRadius: 10,
              fontFamily: 'DM Sans', fontSize: 16, fontWeight: servicosActive ? 700 : 500,
              color: servicosActive ? 'var(--gold)' : 'var(--navy)',
              background: servicosActive ? 'rgba(201,150,14,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              Serviços
              <span style={{ fontSize: 12, opacity: 0.55 }}>{servicosMob ? '▴' : '▾'}</span>
            </button>
            {servicosMob && (
              <div style={{ paddingLeft: 16, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {SERVICOS_ITEMS.map(s => (
                  <a key={s.id} onClick={() => go(s.id)} style={{
                    padding: '10px 16px', borderRadius: 8,
                    fontFamily: 'DM Sans', fontSize: 14, fontWeight: active === s.id ? 700 : 400,
                    color: active === s.id ? 'var(--gold)' : 'var(--navy)',
                    background: active === s.id ? 'rgba(201,150,14,0.08)' : 'transparent',
                    cursor: 'pointer', textDecoration: 'none', display: 'block',
                  }}>{s.label}</a>
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
            }}>ENTRAR</button>
            <button onClick={handleCta} style={{
              padding: '13px',
              background: 'linear-gradient(135deg, var(--gold) 0%, #e6a800 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Anunciar grátis</button>
          </div>
        )}
      </div>
    </header>
  );
}

// Auth modal — login + criar conta (com seleção de perfil)
const ROLES = [
  { id: 'proprietario', label: 'Proprietário', desc: 'Quero anunciar meu imóvel', initial: 'P', accent: 'var(--gold)' },
  { id: 'corretor',     label: 'Corretor',          desc: 'Sou parceiro VN Prime',      initial: 'C', accent: '#059669' },
  { id: 'fotografo',    label: 'Fotógrafo',    desc: 'Ofereço serviços de mídia', initial: 'F', accent: '#B87333' },
  { id: 'comprador',    label: 'Comprador',          desc: 'Quero encontrar um imóvel', initial: 'B', accent: 'var(--navy)' },
];

const ROLE_LABELS = { proprietario: 'Proprietário', corretor: 'Corretor', fotografo: 'Fotógrafo', comprador: 'Comprador' };

function AuthModal({ isOpen, defaultTab = 'entrar', onClose, onAuth, presetRole = null }) {
  const [tab, setTab] = useState(defaultTab);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [role, setRole] = useState(presetRole || '');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setTab(defaultTab);
    setStep(1);
    setError('');
    setRole(presetRole || '');
    setShowPass(false);
  }, [defaultTab, presetRole, isOpen]);

  if (!isOpen) return null;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      setError('Preencha todos os campos obrigatórios.'); return;
    }
    if (presetRole) {
      // Role already determined — skip selection step
      const user = { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), role: presetRole };
      localStorage.setItem('vnprime_user', JSON.stringify(user));
      onAuth(user); return;
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

  const handleGoogleLogin = () => {
    if (typeof google === 'undefined') {
      setError('Login com Google não disponível. Tente pelo formulário.');
      return;
    }
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: (response) => {
        try {
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          setForm(f => ({ ...f, name: payload.name || '', email: payload.email || '' }));
          setTab('criar');
          setStep(2);
        } catch {
          setError('Erro ao processar login Google. Tente novamente.');
        }
      },
    });
    google.accounts.id.prompt();
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
        }}>{'✕'}</button>

        <div style={{ textAlign: 'center', marginBottom: presetRole ? 12 : 24 }}><BrandLockup /></div>

        {/* Role context badge */}
        {presetRole && (
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 999,
              background: presetRole === 'corretor' ? '#05966918' : presetRole === 'fotografo' ? '#B8733318' : 'var(--gold-soft)18',
              border: `1px solid ${presetRole === 'corretor' ? '#05966930' : presetRole === 'fotografo' ? '#B8733330' : 'var(--gold)30'}`,
              fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: presetRole === 'corretor' ? '#059669' : presetRole === 'fotografo' ? '#B87333' : 'var(--gold)',
            }}>
              Área do {ROLE_LABELS[presetRole] || presetRole}
            </span>
          </div>
        )}

        {/* Tabs */}
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
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', margin: '0 auto 10px',
                    background: role === r.id ? r.accent : r.accent + '18',
                    border: `2px solid ${r.accent}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 16,
                    color: role === r.id ? '#fff' : r.accent,
                    transition: 'background 0.15s, color 0.15s',
                  }}>{r.initial}</div>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-2)', lineHeight: 1.4 }}>{r.desc}</div>
                </button>
              ))}
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
            <Btn variant="accent" fullWidth onClick={handleFinish}>
              Criar minha conta {'→'}
            </Btn>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button type="button" onClick={() => { setStep(1); setError(''); }} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--fg-2)', textDecoration: 'underline',
              }}>{'←'} Voltar</button>
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
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder={showPass ? 'sua senha' : '••••••••'}
                  required style={{ width: '100%', paddingRight: 40, boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'var(--fg-2)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
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

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 11, color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>ou continue com</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Google OAuth */}
            <button type="button" onClick={handleGoogleLogin} style={{
              width: '100%', padding: '11px', border: '1.5px solid var(--border)',
              borderRadius: 8, background: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14, color: 'var(--navy)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(15,34,68,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

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
        { label: 'Anunciar imóvel',  action: () => nav('vender') },
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
        { label: 'Política de privacidade', action: () => {} },
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
          <span>{'©'} 2026 VN Prime Imóveis {'·'} CRECI-MG 12.345-J</span>
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
    { icon: '⌿', val: areaM2, lbl: 'm²' },
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
