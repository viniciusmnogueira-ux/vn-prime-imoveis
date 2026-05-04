// Canal do Fotógrafo — landing page pública
// Rota: fotografo-canal | Exporta: window.FotografoCanalPage
// Accent: bronze #B87333 / #D08F4F

const FOTO_BRONZE = '#B87333';
const FOTO_BRONZE_LIGHT = '#D08F4F';

function FotografoCanalPage({ onNav }) {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <FotoHero onNav={onNav} />
      <FotoPassos />
      <FotoJobs />
      <FotoPacotes onNav={onNav} />
      <FotoPortfolio />
      <FotoFactorOne />
      <FotoCtaFinal onNav={onNav} />
    </main>
  );
}

function FotoJobCardMock() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: 20, minWidth: 260 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: FOTO_BRONZE_LIGHT }}>Job disponível</span>
        <span style={{ background: '#22c55e22', color: '#4ade80', border: '1px solid #4ade8044',
          borderRadius: 999, padding: '2px 10px', fontSize: 10.5, fontWeight: 700 }}>Novo</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>Apartamento · Lourdes</div>
      <div style={{ fontSize: 12.5, color: 'rgba(250,249,246,0.6)', marginBottom: 14 }}>Belo Horizonte — 240 m²</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {['Foto', 'Drone', 'Tour 3D'].map(t => (
          <span key={t} style={{ background: `${FOTO_BRONZE}22`, color: FOTO_BRONZE_LIGHT,
            border: `1px solid ${FOTO_BRONZE}44`, borderRadius: 6, padding: '3px 8px',
            fontSize: 10, fontWeight: 600 }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, color: FOTO_BRONZE_LIGHT, lineHeight: 1 }}>R$750</div>
          <div style={{ fontSize: 11, color: 'rgba(250,249,246,0.45)', marginTop: 2 }}>pacote full</div>
        </div>
        <button style={{ background: FOTO_BRONZE, color: '#fff', border: 'none', borderRadius: 8,
          padding: '8px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Aceitar job</button>
      </div>
    </div>
  );
}

function FotoHero({ onNav }) {
  const stats = [
    { val: '40+', lbl: 'imóveis/mês em carteira' },
    { val: 'R$250–750', lbl: 'por job concluído' },
    { val: '30 dias', lbl: 'prazo de pagamento' },
    { val: '100%', lbl: 'da comissão é sua' },
  ];
  return (
    <section style={{ position: 'relative', overflow: 'hidden',
      background: 'var(--gradient-navy-hero)', color: '#fff',
      padding: 'clamp(3.5rem, 8vw, 5.5rem) 0 clamp(3rem, 6vw, 4rem)' }}>
      <div style={{ position: 'absolute', top: -200, right: -150, width: 600, height: 600,
        background: `radial-gradient(circle, ${FOTO_BRONZE}28 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 380, height: 380,
        background: `radial-gradient(circle, ${FOTO_BRONZE}18 0%, transparent 65%)`, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 48,
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>

          {/* Copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${FOTO_BRONZE}22`, border: `1px solid ${FOTO_BRONZE}55`,
              borderRadius: 999, padding: '5px 14px', marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: FOTO_BRONZE, display: 'inline-block' }} />
              <span style={{ fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: FOTO_BRONZE_LIGHT }}>
                Fotógrafo Credenciado VN Prime
              </span>
            </div>
            <h1 style={{ color: '#fff', margin: '0 0 18px', fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', lineHeight: 1.18 }}>
              Fotografe imóveis de{' '}
              <em style={{ background: `linear-gradient(135deg, ${FOTO_BRONZE_LIGHT}, ${FOTO_BRONZE})`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic' }}>
                alto padrão.
              </em>{' '}
              <span style={{ color: 'rgba(250,249,246,0.88)' }}>Cresça seu portfólio.</span>
            </h1>
            <p style={{ color: 'rgba(250,249,246,0.8)', fontSize: 16, lineHeight: 1.7, margin: '0 0 28px', maxWidth: 520 }}>
              VN Prime credencia fotógrafos profissionais para cobrir imóveis premium em BH e região.
              Você recebe os jobs, fotografa com liberdade e recebe com segurança via FactorOne.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => onNav('fotografo')} style={{
                background: `linear-gradient(135deg, ${FOTO_BRONZE_LIGHT}, ${FOTO_BRONZE})`,
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                padding: '0.9rem 1.8rem', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 15,
                boxShadow: `0 8px 28px ${FOTO_BRONZE}55` }}>
                Quero ser credenciado →
              </button>
              <button onClick={() => document.getElementById('foto-pacotes')?.scrollIntoView({ behavior: 'smooth' })} style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1px solid rgba(250,249,246,0.3)', borderRadius: 10, cursor: 'pointer',
                padding: '0.9rem 1.5rem', fontFamily: 'DM Sans', fontWeight: 600, fontSize: 15 }}>
                Ver pacotes e ganhos
              </button>
            </div>
          </div>

          {/* Job card mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <FotoJobCardMock />
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          marginTop: 44, background: 'rgba(255,255,255,0.06)', borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '18px 20px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                color: FOTO_BRONZE_LIGHT, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(250,249,246,0.6)',
                letterSpacing: '0.04em' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FotoPassos() {
  const passos = [
    { num: '01', title: 'Monte seu portfólio', desc: 'Cadastre suas melhores fotos de imóveis. Nossa equipe avalia seu estilo e técnica.', icon: '📸' },
    { num: '02', title: 'Curadoria VN Prime', desc: 'Um curador aprova seu credenciamento em até 5 dias úteis. Feedback garantido.', icon: '✓' },
    { num: '03', title: 'Receba jobs', desc: 'Jobs chegam filtrados por bairro e disponibilidade. Você aceita ou recusa — sem obrigação.', icon: '📲' },
    { num: '04', title: 'Fotografe e receba', desc: 'Entregue as fotos pela plataforma. Pagamento automático em até 30 dias via FactorOne.', icon: '💰' },
  ];
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow color={FOTO_BRONZE}>Como funciona</Eyebrow>
          <h2 style={{ margin: '4px 0 12px' }}>Do portfólio ao pagamento</h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 480, margin: '0 auto', fontSize: 15 }}>
            Um processo simples para você focar no que sabe fazer: fotografar imóveis incríveis.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {passos.map((p) => (
            <div key={p.num} style={{ background: 'var(--cream)', borderRadius: 16, padding: '28px 24px',
              border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `${FOTO_BRONZE}15`, color: FOTO_BRONZE,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.icon}</div>
                <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.16em', color: `${FOTO_BRONZE}88`, textTransform: 'uppercase' }}>
                  Passo {p.num}
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 17, lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FotoJobs() {
  const jobs = [
    { tipo: 'Apartamento', bairro: 'Lourdes', size: '240 m²', pkg: 'Full', val: 750, tags: ['Foto', 'Drone', 'Tour 3D'], status: 'novo', urgente: false },
    { tipo: 'Casa', bairro: 'Mangabeiras', size: '380 m²', pkg: 'Premium', val: 450, tags: ['Foto', 'Edição avançada'], status: 'disponível', urgente: true },
    { tipo: 'Cobertura', bairro: 'Savassi', size: '190 m²', pkg: 'Full', val: 750, tags: ['Foto', 'Drone', 'Tour 3D'], status: 'novo', urgente: false },
    { tipo: 'Apartamento', bairro: 'Buritis', size: '120 m²', pkg: 'Básico', val: 250, tags: ['Foto', 'Edição básica'], status: 'disponível', urgente: false },
    { tipo: 'Penthouse', bairro: 'Serra', size: '320 m²', pkg: 'Full', val: 750, tags: ['Foto', 'Drone', 'Tour 3D'], status: 'agendado', urgente: false },
    { tipo: 'Casa', bairro: 'Nova Lima', size: '420 m²', pkg: 'Premium', val: 450, tags: ['Foto', 'Edição avançada'], status: 'disponível', urgente: true },
  ];
  const statusStyle = {
    'novo':       ['#22c55e22', '#4ade80',        '#4ade8044'],
    'disponível': [`${FOTO_BRONZE}22`, FOTO_BRONZE_LIGHT, `${FOTO_BRONZE}44`],
    'agendado':   ['rgba(99,102,241,0.15)', '#818cf8', 'rgba(99,102,241,0.3)'],
  };
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Eyebrow color={FOTO_BRONZE}>Jobs disponíveis</Eyebrow>
            <h2 style={{ margin: '4px 0 6px' }}>Oportunidades em tempo real</h2>
            <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14 }}>
              Amostra de jobs ativos. Você escolhe os que quiser aceitar.
            </p>
          </div>
          <div style={{ background: '#22c55e15', color: '#16a34a', border: '1px solid #22c55e44',
            borderRadius: 999, padding: '6px 16px', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            12 jobs ativos agora
          </div>
        </div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {jobs.map((j, i) => {
            const [sbg, sfg, sbd] = statusStyle[j.status] || statusStyle['disponível'];
            return (
              <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
                padding: '18px 20px', boxShadow: '0 4px 16px rgba(15,34,68,0.07)', position: 'relative', overflow: 'hidden' }}>
                {j.urgente && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#ef444415',
                    color: '#ef4444', borderBottomLeftRadius: 8, padding: '3px 10px',
                    fontSize: 10, fontWeight: 700 }}>URGENTE</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--navy)', marginBottom: 2 }}>
                      {j.tipo} · {j.bairro}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>{j.size} — Pacote {j.pkg}</div>
                  </div>
                  <span style={{ background: sbg, color: sfg, border: `1px solid ${sbd}`,
                    borderRadius: 999, padding: '3px 10px', fontSize: 10.5, fontWeight: 700,
                    flexShrink: 0, marginLeft: 8 }}>{j.status}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {j.tags.map(t => (
                    <span key={t} style={{ background: `${FOTO_BRONZE}10`, color: FOTO_BRONZE,
                      border: `1px solid ${FOTO_BRONZE}30`, borderRadius: 6, padding: '2px 8px',
                      fontSize: 10.5, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <span style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 700, color: FOTO_BRONZE }}>
                    R${j.val}
                  </span>
                  <button disabled={j.status === 'agendado'} style={{
                    background: j.status === 'agendado' ? 'rgba(15,34,68,0.06)' : FOTO_BRONZE,
                    color: j.status === 'agendado' ? 'var(--fg-2)' : '#fff',
                    border: 'none', borderRadius: 8, padding: '7px 14px',
                    fontFamily: 'DM Sans', fontWeight: 700, fontSize: 12.5,
                    cursor: j.status === 'agendado' ? 'default' : 'pointer' }}>
                    {j.status === 'agendado' ? 'Agendado' : 'Ver detalhes'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--fg-2)', fontSize: 13, marginTop: 24 }}>
          Acesse todos os jobs ao se tornar fotógrafo credenciado VN Prime.
        </p>
      </div>
    </section>
  );
}

function FotoPacotes({ onNav }) {
  const [selected, setSelected] = React.useState('premium');
  const pkgs = [
    {
      id: 'basico', label: 'Básico', price: 'R$250',
      desc: 'Perfeito para apartamentos e imóveis menores.',
      items: ['20 fotos profissionais', 'Edição básica inclusa', 'Entrega em 48h', 'Drone não incluso', 'Tour virtual não incluso'],
      ok: [true, true, true, false, false], accent: 'var(--fg-2)',
    },
    {
      id: 'premium', label: 'Premium', price: 'R$450',
      desc: 'O mais pedido — ideal para casas e coberturas.',
      items: ['35 fotos profissionais', 'Edição avançada inclusa', 'Entrega em 24h', 'Drone incluso', 'Tour virtual não incluso'],
      ok: [true, true, true, true, false], accent: FOTO_BRONZE, popular: true,
    },
    {
      id: 'full', label: 'Full', price: 'R$750',
      desc: 'Para imóveis de altíssimo padrão e lançamentos.',
      items: ['50+ fotos profissionais', 'Edição premium inclusa', 'Entrega em 12h', 'Drone incluso', 'Tour virtual 3D incluso'],
      ok: [true, true, true, true, true], accent: 'var(--navy)',
    },
  ];
  const estMensal = { basico: 'R$2.500', premium: 'R$4.500', full: 'R$7.500' };
  return (
    <section id="foto-pacotes" style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow color={FOTO_BRONZE}>Pacotes e ganhos</Eyebrow>
          <h2 style={{ margin: '4px 0 12px' }}>Quanto você recebe por job</h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 500, margin: '0 auto', fontSize: 15 }}>
            100% do valor vai para você. O VN Prime cobra do proprietário — nunca do fotógrafo.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))', marginBottom: 28 }}>
          {pkgs.map(pkg => (
            <div key={pkg.id} onClick={() => setSelected(pkg.id)} style={{
              background: '#fff', borderRadius: 16, cursor: 'pointer', position: 'relative',
              border: `2px solid ${selected === pkg.id ? pkg.accent : 'var(--border)'}`,
              boxShadow: selected === pkg.id ? `0 12px 40px ${pkg.accent === 'var(--fg-2)' ? 'rgba(0,0,0,0.1)' : pkg.accent + '22'}` : '0 4px 16px rgba(15,34,68,0.06)',
              padding: '24px 22px', transition: 'all 0.2s' }}>
              {pkg.popular && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  background: FOTO_BRONZE, color: '#fff', borderRadius: 999,
                  padding: '4px 14px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Mais popular</div>
              )}
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: pkg.accent, marginBottom: 6 }}>{pkg.label}</div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 700,
                color: pkg.accent, lineHeight: 1, marginBottom: 4 }}>{pkg.price}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 14 }}>por job · você recebe 100%</div>
              <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: '0 0 18px', lineHeight: 1.5 }}>{pkg.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pkg.items.map((item, i) => (
                  <li key={item} style={{ display: 'flex', gap: 8, alignItems: 'center',
                    fontFamily: 'DM Sans', fontSize: 13,
                    color: pkg.ok[i] ? 'var(--navy)' : 'var(--fg-2)', opacity: pkg.ok[i] ? 1 : 0.5 }}>
                    <span style={{ color: pkg.ok[i] ? pkg.accent : 'var(--fg-2)', fontWeight: 700, flexShrink: 0 }}>
                      {pkg.ok[i] ? '✓' : '×'}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Income estimator */}
        <div style={{ background: 'var(--cream)', borderRadius: 16, padding: '22px 26px',
          border: '1px solid var(--border)', display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 5 }}>Estimativa mensal</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 700, color: FOTO_BRONZE }}>
              {estMensal[selected]}
              <span style={{ fontSize: 14, color: 'var(--fg-2)', fontFamily: 'DM Sans', fontWeight: 400 }}> /mês</span>
            </div>
          </div>
          <div style={{ width: 1, height: 46, background: 'var(--border)', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 5 }}>Base de cálculo</div>
            <div style={{ fontSize: 14, color: 'var(--navy)', fontWeight: 600 }}>
              10 jobs/mês × {pkgs.find(p => p.id === selected)?.price}/job
            </div>
          </div>
          <p style={{ flex: 1, minWidth: 200, margin: 0, fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            Fotógrafos ativos realizam 8–14 jobs/mês dependendo de disponibilidade e localização.
          </p>
          <button onClick={() => onNav('fotografo')} style={{ background: FOTO_BRONZE, color: '#fff',
            border: 'none', borderRadius: 10, padding: '11px 22px',
            fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Começar agora →
          </button>
        </div>
      </div>
    </section>
  );
}

function FotoPortfolio() {
  const photos = [
    { room: 'Sala de estar', bairro: 'Lourdes', type: 'Grande angular', wide: false },
    { room: 'Fachada aérea', bairro: 'Savassi', type: 'Drone', wide: true },
    { room: 'Cozinha gourmet', bairro: 'Mangabeiras', type: 'Interior', wide: false },
    { room: 'Suíte master', bairro: 'Serra', type: 'Interior', wide: false },
    { room: 'Área externa', bairro: 'Nova Lima', type: 'Drone', wide: true },
    { room: 'Hall de entrada', bairro: 'Buritis', type: 'Interior', wide: false },
  ];
  const palettes = [
    `linear-gradient(135deg, rgba(184,115,51,0.35) 0%, rgba(15,34,68,0.75) 100%)`,
    `linear-gradient(135deg, rgba(15,34,68,0.55) 0%, rgba(184,115,51,0.45) 100%)`,
    `linear-gradient(135deg, rgba(184,115,51,0.25) 0%, rgba(15,34,68,0.65) 100%)`,
    `linear-gradient(135deg, rgba(15,34,68,0.45) 0%, rgba(208,143,79,0.55) 100%)`,
    `linear-gradient(135deg, rgba(184,115,51,0.4) 0%, rgba(15,34,68,0.6) 100%)`,
    `linear-gradient(135deg, rgba(15,34,68,0.6) 0%, rgba(184,115,51,0.3) 100%)`,
  ];
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 48, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', alignItems: 'center' }}>

          {/* Photo grid mockup */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {photos.map((p, i) => (
              <div key={i} style={{
                background: palettes[i], borderRadius: 10, overflow: 'hidden',
                aspectRatio: p.wide ? '16/9' : '4/3',
                gridColumn: p.wide ? 'span 2' : 'span 1',
                display: 'flex', alignItems: 'flex-end', padding: '10px 12px',
                border: `1px solid ${FOTO_BRONZE}22`,
              }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, color: '#fff' }}>{p.room}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 9.5, color: 'rgba(255,255,255,0.6)' }}>{p.bairro} · {p.type}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <Eyebrow color={FOTO_BRONZE}>Portfólio digital</Eyebrow>
            <h2 style={{ margin: '4px 0 16px' }}>Seu trabalho, sua vitrine</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
              Cada job concluído é automaticamente adicionado ao seu portfólio público na plataforma.
              Proprietários e incorporadoras encontram você pelo estilo do seu trabalho.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['URL pública', 'vnprime.com.br/foto/seu-nome — compartilhe com qualquer cliente.'],
                ['Organizado por categoria', 'Interiores, drone, tour virtual — cada especialidade em destaque.'],
                ['Estatísticas', 'Visualizações e leads gerados pelo seu portfólio.'],
                ['Avaliações verificadas', 'Proprietários avaliam cada job — sua reputação cresce.'],
              ].map(([t, d]) => (
                <div key={t} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${FOTO_BRONZE}15`,
                    color: FOTO_BRONZE, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13, flexShrink: 0 }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--navy)', marginBottom: 2 }}>{t}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FotoFactorOne() {
  const pagamentos = [
    { label: 'Cobertura · Savassi', date: '28 abr', val: 'R$750', pago: true },
    { label: 'Casa · Mangabeiras', date: '22 abr', val: 'R$450', pago: true },
    { label: 'Apt · Lourdes', date: '12 mai', val: 'R$750', pago: false },
  ];
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0F2244 100%)',
          borderRadius: 20, padding: 'clamp(2rem, 4vw, 3rem)',
          display: 'grid', gap: 40, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${FOTO_BRONZE}22`, border: `1px solid ${FOTO_BRONZE}44`,
              borderRadius: 999, padding: '4px 12px', marginBottom: 18 }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                color: FOTO_BRONZE_LIGHT, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Parceiro FactorOne
              </span>
            </div>
            <h2 style={{ color: '#fff', margin: '0 0 14px', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Pagamento garantido.<br />Gestão financeira incluída.
            </h2>
            <p style={{ color: 'rgba(250,249,246,0.75)', fontSize: 15, lineHeight: 1.65, margin: '0 0 24px' }}>
              Todos os fotógrafos VN Prime têm acesso a 30 dias grátis do FactorOne — plataforma de gestão
              financeira com emissão automática de NF.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                ['NF automática', 'Emissão por job, sem burocracia'],
                ['Pagamento 30d', 'Garantido após entrega aprovada'],
                ['Dashboard', 'Histórico e projeção de ganhos'],
              ].map(([t, d]) => (
                <div key={t} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10,
                  padding: '14px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 12.5, color: FOTO_BRONZE_LIGHT, marginBottom: 4 }}>{t}</div>
                  <div style={{ fontSize: 11, color: 'rgba(250,249,246,0.6)', lineHeight: 1.5 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(250,249,246,0.45)', marginBottom: 4 }}>Histórico de pagamentos</div>
            {pagamentos.map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)', padding: '12px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: '#fff' }}>{p.label}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(250,249,246,0.45)' }}>{p.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 17, color: FOTO_BRONZE_LIGHT }}>{p.val}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: p.pago ? '#4ade80' : FOTO_BRONZE_LIGHT }}>
                    {p.pago ? '✓ pago' : '⏱ a receber'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FotoCtaFinal({ onNav }) {
  return (
    <section style={{ padding: 'clamp(3.5rem, 7vw, 5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(760px, 92vw)', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `${FOTO_BRONZE}18`, color: FOTO_BRONZE,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>📸</div>
        <Eyebrow color={FOTO_BRONZE}>Pronto para começar?</Eyebrow>
        <h2 style={{ margin: '6px 0 16px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          Fotografe os imóveis mais bonitos de BH
        </h2>
        <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.7, margin: '0 auto 32px', maxWidth: 540 }}>
          Credenciamento simples, jobs recorrentes e pagamento garantido.
          Cadastre seu portfólio agora e entre para a rede VN Prime.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          <button onClick={() => onNav('fotografo')} style={{
            background: `linear-gradient(135deg, ${FOTO_BRONZE_LIGHT}, ${FOTO_BRONZE})`,
            color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
            padding: '1rem 2rem', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 16,
            boxShadow: `0 8px 28px ${FOTO_BRONZE}44` }}>
            Candidatar-me ao credenciamento →
          </button>
          <button onClick={() => document.getElementById('foto-pacotes')?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: 'transparent', color: 'var(--navy)',
            border: '1.5px solid var(--border)', borderRadius: 12, cursor: 'pointer',
            padding: '1rem 1.5rem', fontFamily: 'DM Sans', fontWeight: 600, fontSize: 16 }}>
            Ver pacotes e ganhos
          </button>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            ['Sem mensalidade', 'Grátis para começar'],
            ['Curadoria em 5 dias', 'Aprovação rápida'],
            ['Jobs imediatos', 'Assim que aprovado'],
          ].map(([t, d]) => (
            <div key={t} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 700, color: FOTO_BRONZE, marginBottom: 2 }}>✓ {t}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { FotografoCanalPage });
