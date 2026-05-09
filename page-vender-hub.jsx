// Vender hub — profile picker (Proprietário Direto / Imobiliária Corretor / Incorporadoras)

function VenderHubPage({ onNav }) {
  const profiles = [
    {
      id: 'proprietario',
      title: 'Proprietário',
      subtitle: 'Quero vender meu imóvel',
      desc: 'Taxa fixa sem comissão, 3% com suporte VN Prime ou 6% com corretor dedicado. Em todos: 30 dias grátis de gestão financeira.',
      modality: 'Direta · Assistida · Completa',
      price: 'a partir de R$ 197',
      priceLabel: 'ou 3% / 6% sobre a venda',
      photo: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=700&q=80',
      bullets: [
        'R$ 197 taxa fixa ou comissão só no sucesso',
        'IA para descrição · tutorial de fotos',
        'Endereço privado — vitrine exibe só o bairro',
        'Pacotes de foto como add-on',
        '30 dias grátis FactorOne — gestão financeira',
      ],
      icon: 'P',
      accent: 'var(--gold)',
      accentHex: '#C9960E',
      cta: 'Anunciar meu imóvel',
      portalLabel: 'Portal do Proprietário',
    },
    {
      id: 'corretor',
      title: 'Corretor parceiro',
      subtitle: 'Sou corretor credenciado',
      desc: 'Leads qualificados, imóveis em Venda Completa (6%) e CRM Kanban. Freemium disponível — comece sem pagar nada.',
      modality: 'Rede de Corretores',
      price: 'R$ 49,90',
      priceLabel: 'por mês · freemium disponível',
      photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80',
      bullets: [
        'Leads com contato completo (WhatsApp + e-mail)',
        'Portfólio de imóveis em plano 6%',
        'Funil Kanban de vendas integrado',
        'IA para descrição de imóveis',
        '3% de comissão garantida em cada venda',
      ],
      icon: 'C',
      accent: '#059669',
      accentHex: '#059669',
      cta: 'Acessar portal do corretor',
      portalLabel: 'Portal do Corretor',
    },
    {
      id: 'incorporadora',
      title: 'Incorporadoras',
      subtitle: 'Tenho um lançamento',
      desc: 'Plano enterprise com vitrine exclusiva, plantas interativas e gestão de mídias VN Prime dedicada.',
      modality: 'Lançamentos',
      price: 'Sob consulta',
      priceLabel: 'plano dedicado',
      photo: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80',
      bullets: [
        'Página dedicada do empreendimento',
        'Plantas e tour virtual 3D',
        'Gestão de mídias e portfólio exclusivo',
        'Mídia paga compartilhada',
        'BOOSTER para unidades em estoque',
      ],
      icon: 'I',
      accent: '#B87333',
      accentHex: '#B87333',
      cta: 'Falar com comercial',
      portalLabel: 'Canal de Lançamentos',
    },
  ];

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--gradient-navy-hero)', color: '#fff',
        padding: 'clamp(3rem, 7vw, 5rem) 0 clamp(2rem, 5vw, 3rem)',
      }}>
        <div style={{ position: 'absolute', top: -180, right: -180, width: 540, height: 540,
          background: 'radial-gradient(circle, rgba(201,150,14,0.28) 0%, transparent 65%)',
          pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, width: 'min(1080px, 92vw)',
          margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>Anuncie com VN Prime</Eyebrow>
          <h1 style={{ color: '#fff', margin: '6px 0 14px', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
            Com qual perfil você <em style={{
              background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text',
              backgroundClip: 'text', color: 'transparent', fontStyle: 'italic',
            }}>se identifica?</em>
          </h1>
          <p style={{ color: 'rgba(250,249,246,0.85)', maxWidth: 540, margin: '0 auto', fontSize: 16 }}>
            Selecione o perfil que melhor descreve sua necessidade. Cada caminho com sua estrutura, suas ferramentas e seu plano.
          </p>
        </div>
      </section>

      {/* Profile cards */}
      <section style={{ padding: '0 0 60px', marginTop: -40, position: 'relative', zIndex: 2 }}>
        <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto',
          display: 'grid', gap: 22,
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
          {profiles.map(p => (
            <ProfileCard key={p.id} profile={p}
              onClick={() => onNav(p.id === 'proprietario' ? 'proprietario' : p.id === 'corretor' ? 'corretor-canal' : 'lancamentos')} />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ padding: '40px 0 60px', background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow color="var(--gold)">Padrão VN Prime</Eyebrow>
          <h2 style={{ marginBottom: 28 }}>Por que anunciar conosco?</h2>
          <div style={{ display: 'grid', gap: 24,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', textAlign: 'left' }}>
            {[
              ['Curadoria real', 'Não somos um classificado. Cada imóvel passa pela curadoria VN Prime antes de ir à vitrine.'],
              ['Comissão só no sucesso', 'Você paga apenas quando o imóvel é vendido — 3% ou 6% conforme o plano escolhido.'],
              ['Inteligência de mercado', 'Comparativos de preço da região, tempo médio de venda e análise de demanda por bairro.'],
              ['Concierge de visita', 'Curador VN Prime qualifica compradores e acompanha visitas nos planos Premium e Completo.'],
            ].map(([t, d]) => (
              <div key={t}>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 600,
                  color: 'var(--navy)', marginBottom: 6 }}>{t}</div>
                <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileCard({ profile, onClick }) {
  const [hovered, setHovered] = useState(false);
  const p = profile;
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 20, border: '1px solid var(--border)',
        boxShadow: hovered ? '0 28px 70px rgba(15,34,68,0.20)' : '0 12px 40px rgba(15,34,68,0.10)',
        padding: 0, cursor: 'pointer', textAlign: 'left',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'transform 0.22s ease, box-shadow 0.22s',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
      }}>

      {/* Photo header */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img src={p.photo} alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${p.accentHex}cc 0%, rgba(0,0,0,0.3) 50%, transparent 100%)` }} />
        {/* Portal badge */}
        <div style={{ position: 'absolute', top: 12, right: 12,
          background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 999, padding: '4px 12px',
          fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
          {p.portalLabel}
        </div>
        {/* Icon + title overlay */}
        <div style={{ position: 'absolute', bottom: 14, left: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
            border: '1.5px solid rgba(255,255,255,0.45)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700 }}>{p.icon}</div>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>{p.subtitle}</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 700,
              color: '#fff', lineHeight: 1.1 }}>{p.title}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 22px 6px' }}>
        <p style={{ color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <span style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 700,
            color: p.accentHex, lineHeight: 1 }}>{p.price}</span>
          <span style={{ fontSize: 11.5, color: 'var(--fg-2)' }}>{p.priceLabel}</span>
        </div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 14 }}>{p.modality}</div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '14px 22px', flex: 1,
        background: hovered ? `${p.accentHex}06` : 'transparent', transition: 'background 0.2s' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: 7 }}>
          {p.bullets.map(b => (
            <li key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start',
              fontFamily: 'DM Sans', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
              <span style={{ color: p.accentHex, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '16px 22px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        borderTop: `3px solid ${hovered ? p.accentHex : 'transparent'}`, transition: 'border-color 0.2s' }}>
        <span style={{ fontFamily: 'DM Sans', fontSize: 14, fontWeight: 600,
          color: hovered ? p.accentHex : 'var(--navy)', transition: 'color 0.2s' }}>{p.cta}</span>
        <span style={{ width: 34, height: 34, borderRadius: 999,
          background: hovered ? p.accentHex : 'rgba(15,34,68,0.06)',
          color: hovered ? '#fff' : 'var(--navy)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 600, transition: 'all 0.2s', flexShrink: 0 }}>→</span>
      </div>
    </button>
  );
}

Object.assign(window, { VenderHubPage });
