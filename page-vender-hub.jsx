// Vender hub — profile picker (Proprietário Direto / Imobiliária Corretor / Incorporadoras)

function VenderHubPage({ onNav }) {
  const profiles = [
    {
      id: 'proprietario',
      title: 'Proprietário',
      subtitle: 'Quero vender meu imóvel',
      desc: 'Escolha entre taxa fixa sem comissão, 3% com suporte VN Prime ou 6% com corretor dedicado. Em todos: 30 dias grátis de gestão financeira FactorOne.',
      modality: 'Direta · Assistida · Completa',
      price: 'a partir de R$ 197',
      priceLabel: 'ou 3% / 6% sobre a venda',
      bullets: [
        'R$ 197 taxa fixa ou comissão só no sucesso',
        'IA para descrição · tutorial de fotos',
        'Endereço privado — vitrine exibe só o bairro',
        'Pacotes de foto como add-on (qualquer plano)',
        '30 dias grátis FactorOne — gestão financeira',
      ],
      icon: 'P',
      accent: 'var(--gold)',
      cta: 'Anunciar meu imóvel',
    },
    {
      id: 'corretor',
      title: 'Corretor parceiro',
      subtitle: 'Sou corretor credenciado',
      desc: 'Acesse leads qualificados, imóveis em Venda Completa (6%) e ferramentas de gestão. Freemium com upgrade por R$ 49,90/mês.',
      modality: 'Rede de Corretores',
      price: 'R$ 49,90',
      priceLabel: 'por mês · freemium disponível',
      bullets: [
        'Leads com contato completo',
        'Imóveis VN Prime em plano 6%',
        'Funil Kanban de vendas',
        'IA para descrição de imóveis',
        '3% de comissão garantida',
      ],
      icon: 'C',
      accent: '#059669',
      cta: 'Acessar portal do corretor',
    },
    {
      id: 'incorporadora',
      title: 'Incorporadoras',
      subtitle: 'Tenho um lançamento',
      desc: 'Plano enterprise com vitrine exclusiva, plantas interativas e equipe de plantão VN Prime dedicada.',
      modality: 'Lançamentos',
      price: 'Sob consulta',
      priceLabel: 'plano dedicado',
      bullets: [
        'Página dedicada do empreendimento',
        'Plantas e tour virtual 3D',
        'Equipe de plantão exclusiva',
        'Mídia paga compartilhada',
        'BOOSTER para unidades em estoque',
      ],
      icon: 'I',
      accent: '#B87333',
      cta: 'Falar com comercial',
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
              onClick={() => onNav(p.id === 'proprietario' ? 'proprietario' : p.id === 'corretor' ? 'corretor' : 'lancamentos')} />
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
        background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
        boxShadow: hovered ? '0 22px 60px rgba(15,34,68,0.18)' : '0 12px 40px rgba(15,34,68,0.10)',
        padding: 0, cursor: 'pointer', textAlign: 'left',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        borderTop: `4px solid ${p.accent}`,
      }}>
      <div style={{ padding: '24px 26px 6px' }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: `${p.accent}15`, color: p.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Cinzel, serif', fontSize: 24, fontWeight: 700, marginBottom: 16,
        }}>{p.icon}</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: p.accent, marginBottom: 6 }}>{p.subtitle}</div>
        <h3 style={{ margin: '0 0 8px', fontSize: 22, lineHeight: 1.2 }}>{p.title}</h3>
        <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 700, color: p.accent, lineHeight: 1 }}>{p.price}</span>
          <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>{p.priceLabel}</span>
        </div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 14 }}>{p.modality}</div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '18px 26px', flex: 1,
        background: hovered ? 'rgba(250,249,244,0.6)' : 'transparent', transition: 'background 0.2s' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p.bullets.map(b => (
            <li key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start',
              fontFamily: 'DM Sans', fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
              <span style={{ color: p.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '18px 26px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontFamily: 'DM Sans', fontSize: 14, fontWeight: 600,
          color: hovered ? p.accent : 'var(--navy)' }}>{p.cta}</span>
        <span style={{ width: 32, height: 32, borderRadius: 999,
          background: hovered ? p.accent : 'rgba(15,34,68,0.06)',
          color: hovered ? '#fff' : 'var(--navy)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 600, transition: 'all 0.2s' }}>→</span>
      </div>
    </button>
  );
}

Object.assign(window, { VenderHubPage });
