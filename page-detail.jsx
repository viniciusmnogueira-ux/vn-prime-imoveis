// Property detail page — VN Prime aesthetic, QuintoAndar-style info depth

const BAIRRO_DATA = {
  'Savassi':       { scores: [8,10,8,9,8,9], pois: ['Supermercado BH','Drogaria Araújo','Colégio Loyola','BH Shopping','Smart Fit','Restaurante Xapuri'] },
  'Lourdes':       { scores: [8,9,9,9,8,9],  pois: ['Pão de Açúcar','Farmácia São João','Colégio Pitágoras','Diamond Mall','Bodytech','Área Gourmet'] },
  'Funcionários':  { scores: [9,9,8,9,9,9],  pois: ['Mercado Mineirinho','Drogasil','Santo Agostinho Escola','Pátio Savassi','Academia Top','Bar da Fifi'] },
  'Belvedere':     { scores: [6,8,10,8,8,10], pois: ['Pão de Açúcar','Farmácia Pague Menos','Escola Anchieta','Belvedere Shopping','Academia Velocity','Restaurante Stravaganze'] },
  'Vale do Sereno':{ scores: [5,7,10,8,7,10], pois: ['Supermercado BH','Drogaria Araújo','Escola Marista','Nova Lima Shopping','SmartFit','Cozinha da Serra'] },
  'Vila da Serra': { scores: [5,8,10,8,8,10], pois: ['Empório Jardins','Farmácia Araújo','Escola Padre Eustáquio','Shopping Vila','Studio Pilates','Quina do Futuro'] },
  'Alphaville':    { scores: [4,7,10,7,7,10], pois: ['Supermercado Central','Drogasil','Colégio Vértice','Parque das Mangabeiras','CrossFit BH','Restaurante Alphaville'] },
  'Mangabeiras':   { scores: [6,8,9,9,8,9],   pois: ['Mercado Central','Farmácia Pacheco','Escola Santa Maria','Shopping Cidade','Swim','Bar do Lulu'] },
  'Buritis':       { scores: [8,9,7,8,8,8],   pois: ['Extra Hiper','Drogaria Araújo','Colégio Mackenzie','Buritis Shopping','Smart Fit','Sushi Ryo'] },
  'Nova Suíça':    { scores: [7,8,8,8,8,8],   pois: ['BH Supermercados','Drogasil','Colégio da Polícia Militar','Shopping Contagem','Fit Academia','Pizza Bella'] },
  'Serra':         { scores: [7,9,8,9,8,9],   pois: ['Hortifruti da Serra','Farmácia São João','Colégio Marista','Sierra Center','Bio Ritmo','Bar do Museu'] },
  'Pampulha':      { scores: [7,7,7,9,8,8],   pois: ['BH Market','Drogaria Araújo','UFMG','Shopping Norte','Academia Vila','Restaurante do Lago'] },
};
const BAIRRO_DEFAULT = { scores: [7,8,8,8,8,8], pois: ['Supermercado Local','Farmácia','Escola da região','Shopping próximo','Academia','Restaurante'] };

const SCORE_LABELS = ['Mobilidade', 'Comércio e serviços', 'Segurança', 'Lazer e gastronomia', 'Educação', 'Valorização'];
const POI_TIPOS    = ['Mercado', 'Farmácia', 'Escola', 'Shopping', 'Academia', 'Restaurante'];

function PropertyDetailPage({ id, onNav }) {
  const listing = window.VN_CATALOG.find(l => l.id === id) || window.VN_CATALOG[0];
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const { codigo, title, neighborhood, city, type, operation,
    price, condo, iptu, areaM2, quartos, suites, vagas, banheiros,
    photos, isFeatured, isNew, planLabel, description, features, coords } = listing;

  const bairroData = BAIRRO_DATA[neighborhood] || BAIRRO_DEFAULT;

  const related = window.VN_CATALOG
    .filter(l => l.id !== id && (l.neighborhood === neighborhood || l.type === type))
    .slice(0, 3);

  // Financing estimate: 20% down, 30yr, ~10% a.a.
  const entrada = price * 0.2;
  const financiado = price - entrada;
  const taxaMensal = 0.0082;
  const parcelaEst = Math.round(financiado * taxaMensal / (1 - Math.pow(1 + taxaMensal, -360)));
  const totalMensal = parcelaEst + (condo || 0) + Math.round((iptu || 0) / 12);

  // Google Maps embed URL using coords or neighborhood search
  const mapsQuery = coords
    ? `${coords[0]},${coords[1]}`
    : encodeURIComponent(`${neighborhood}, ${city}, MG, Brasil`);
  const mapsEmbed = coords
    ? `https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=15`
    : `https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=14`;

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto',
          fontFamily: 'DM Sans', fontSize: 12, color: 'var(--fg-2)' }}>
          <a onClick={() => onNav('home')} style={{ color: 'var(--fg-2)', cursor: 'pointer', textDecoration: 'none' }}>Início</a>
          {' › '}
          <a onClick={() => onNav('busca', { op: operation })} style={{ color: 'var(--fg-2)', cursor: 'pointer', textDecoration: 'none' }}>
            {operation === 'lancamento' ? 'Lançamentos' : 'Comprar'}
          </a>
          {' › '}
          <a onClick={() => onNav('busca', { q: neighborhood })} style={{ color: 'var(--fg-2)', cursor: 'pointer', textDecoration: 'none' }}>
            {neighborhood}
          </a>
          {' › '}<span style={{ color: 'var(--navy)' }}>{codigo}</span>
        </div>
      </section>

      {/* Photo gallery — magazine-style */}
      <section style={{ width: 'min(1280px, 94vw)', margin: '24px auto 0' }}>
        <div style={{ display: 'grid', gap: 8,
          gridTemplateColumns: photos.length >= 3 ? '2fr 1fr 1fr' : '1fr',
          gridTemplateRows: photos.length >= 3 ? '320px 320px' : '480px',
          borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            gridRow: photos.length >= 3 ? 'span 2' : 'auto',
            backgroundImage: `url(${photos[0]})`, backgroundSize: 'cover',
            backgroundPosition: 'center', cursor: 'pointer', position: 'relative',
          }} onClick={() => setPhotoIdx(0)}>
            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {isFeatured && <Pill tone="featured">★ Destaque</Pill>}
              {isNew && <Pill tone="new">Novo</Pill>}
            </div>
          </div>
          {photos.slice(1, 5).map((p, i) => (
            <div key={i} style={{
              backgroundImage: `url(${p})`, backgroundSize: 'cover',
              backgroundPosition: 'center', cursor: 'pointer', position: 'relative',
            }} onClick={() => setPhotoIdx(i + 1)}>
              {i === 3 && photos.length > 5 && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,34,68,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontFamily: 'Playfair Display', fontSize: 22 }}>
                  + {photos.length - 4} fotos
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Two-column body */}
      <section style={{ width: 'min(1280px, 94vw)', margin: '32px auto 0' }}>
        <div style={{ display: 'grid', gap: 32,
          gridTemplateColumns: 'minmax(0, 1fr) 360px' }}>

          {/* ── Left — content ── */}
          <div>
            <Eyebrow color="var(--gold)">{type} · {neighborhood}</Eyebrow>
            <h1 style={{ margin: '6px 0 8px', fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>{title}</h1>
            <div style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'var(--fg-2)',
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <span style={{ color: 'var(--gold)' }}>◉</span>
              {neighborhood}, {city}
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase' }}>{codigo}</span>
            </div>

            {/* KPI bar */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '20px 24px', boxShadow: '0 8px 32px rgba(15,34,68,0.06)',
              display: 'grid', gap: 8,
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', marginBottom: 24 }}>
              {[
                ['Área', areaM2 + ' m²'],
                ['Quartos', quartos],
                ['Suítes', suites],
                ['Banheiros', banheiros],
                ['Vagas', vagas],
              ].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center', padding: '4px 0',
                  borderRight: '1px solid var(--border)' }} className="kpi-cell">
                  <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                    color: 'var(--navy)', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--fg-2)', marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '24px 28px', marginBottom: 24,
              boxShadow: '0 8px 32px rgba(15,34,68,0.06)' }}>
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>Sobre o imóvel</h3>
              <p style={{ color: 'var(--fg-1)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                {description}
              </p>
            </div>

            {/* Features grid */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '24px 28px', marginBottom: 24,
              boxShadow: '0 8px 32px rgba(15,34,68,0.06)' }}>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Diferenciais</h3>
              <div style={{ display: 'grid', gap: 10,
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: 'DM Sans', fontSize: 14, color: 'var(--navy)' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 4,
                      background: 'rgba(201,150,14,0.15)', color: 'var(--gold)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 12, flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* MAPA REAL — Google Maps embed */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, overflow: 'hidden', marginBottom: 24,
              boxShadow: '0 8px 32px rgba(15,34,68,0.06)' }}>
              <div style={{ padding: '24px 28px 16px' }}>
                <h3 style={{ marginTop: 0, marginBottom: 4 }}>Localização</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)' }}>
                  {neighborhood}, {city} — endereço exato disponível após contato qualificado.
                </p>
              </div>
              <iframe
                title={`Mapa — ${neighborhood}, ${city}`}
                src={mapsEmbed}
                style={{ width: '100%', height: 300, border: 'none', display: 'block' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={{ padding: '10px 20px', background: 'rgba(201,150,14,0.06)',
                borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--gold)', fontSize: 9 }}>&#9632;</span>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11.5, color: 'var(--fg-2)' }}>
                  Por privacidade, exibimos o bairro. O endereço completo é liberado após contato qualificado.
                </span>
              </div>
            </div>

            {/* BAIRRO — scores + POIs */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '24px 28px', marginBottom: 24,
              boxShadow: '0 8px 32px rgba(15,34,68,0.06)' }}>
              <h3 style={{ marginTop: 0, marginBottom: 20 }}>O bairro · {neighborhood}</h3>

              {/* Score bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 28 }}>
                {SCORE_LABELS.map((label, i) => {
                  const score = bairroData.scores[i];
                  const color = score >= 8 ? '#059669' : score >= 6 ? 'var(--gold)' : '#dc2626';
                  return (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, color }}>{score}/10</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${score * 10}%`, borderRadius: 99,
                          background: color, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nearby POIs */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 14 }}>
                  Pontos próximos
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {bairroData.pois.map((nome, i) => (
                    <div key={nome} style={{ background: 'var(--cream)', borderRadius: 10,
                      padding: '10px 14px', border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--fg-2)', marginBottom: 3 }}>{POI_TIPOS[i]}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{nome}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — sticky sidebar ── */}
          <aside style={{ position: 'sticky', top: 90, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Price card */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '24px', boxShadow: '0 18px 50px rgba(15,34,68,0.12)',
              borderTop: '3px solid var(--gold)' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--fg-2)', marginBottom: 6 }}>
                Valor de venda
              </div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 700,
                color: 'var(--gold)', lineHeight: 1, marginBottom: 8 }}>
                {fmtBRL(price)}
              </div>
              {(condo > 0 || iptu > 0) && (
                <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: 'var(--fg-2)',
                  paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                  {condo > 0 && <div>Condomínio: {fmtBRL(condo)}/mês</div>}
                  {iptu > 0 && <div>IPTU: {fmtBRL(iptu)}/ano</div>}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* WhatsApp — Vini IA */}
                <a href="https://wa.me/5531984144250?text=Olá%20Vini!%20Tenho%20interesse%20no%20imóvel%20VN%20Prime%20código%20${codigo}" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#25D366', color: '#fff', padding: '12px 16px', borderRadius: 10,
                    fontFamily: 'DM Sans', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.117 1.522 5.846L0 24l6.335-1.506A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.497-5.187-1.362l-.371-.22-3.762.895.939-3.652-.241-.383A9.974 9.974 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Vini — IA VN Prime
                </a>

                {/* Fale conosco — email + portal */}
                <button onClick={() => setShowContact(true)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'var(--navy)', color: '#fff', padding: '12px 16px', borderRadius: 10,
                    fontFamily: 'DM Sans', fontSize: 14, fontWeight: 700, border: 'none',
                    cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Fale conosco
                </button>

                {/* Agendar — portal calendar */}
                <button onClick={() => onNav('portal')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'transparent', color: 'var(--navy)', padding: '11px 16px', borderRadius: 10,
                    fontFamily: 'DM Sans', fontSize: 14, fontWeight: 600,
                    border: '1.5px solid rgba(15,34,68,0.25)', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Marcar uma visita
                </button>
              </div>
            </div>

            {/* Custo mensal estimado */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '20px 24px',
              boxShadow: '0 4px 20px rgba(15,34,68,0.07)' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 14 }}>
                Custo mensal estimado
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  { label: 'Parcela financiamento', sub: '20% entrada · 30 anos · 10% a.a.', val: parcelaEst },
                  { label: 'Condomínio', sub: null, val: condo || 0 },
                  { label: 'IPTU mensal', sub: null, val: Math.round((iptu || 0) / 12) },
                ].map(({ label, sub, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: 'var(--fg-2)' }}>{label}</div>
                      {sub && <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, color: 'var(--fg-2)', opacity: 0.7 }}>{sub}</div>}
                    </div>
                    <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: 'var(--navy)', flexShrink: 0 }}>
                      {fmtBRL(val)}
                    </span>
                  </div>
                ))}
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>Total estimado</span>
                  <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: 'var(--gold)' }}>{fmtBRL(totalMensal)}</span>
                </div>
                <p style={{ fontFamily: 'DM Sans', fontSize: 10.5, color: 'var(--fg-2)', margin: '2px 0 0', lineHeight: 1.5 }}>
                  Estimativa. Consulte condições reais com um agente financeiro credenciado.
                </p>
              </div>
            </div>

            {/* VN Prime garante */}
            <div style={{ background: 'var(--navy)', color: '#fff',
              borderRadius: 14, padding: '20px 24px',
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(201,150,14,0.18), transparent 60%)' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--gold-soft)', marginBottom: 12 }}>VN Prime garante</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  'Documentação verificada',
                  'Curadoria de fotografia',
                  'Concierge de visita',
                  'Suporte jurídico',
                  'Endereço privado até contato',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'DM Sans', fontSize: 13 }}>
                    <span style={{ width: 18, height: 18, borderRadius: 4,
                      background: 'rgba(201,150,14,0.2)', color: 'var(--gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: '60px 0 40px' }}>
          <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
            <Eyebrow color="var(--gold)">Também em {neighborhood}</Eyebrow>
            <h2 style={{ marginBottom: 24 }}>Imóveis similares</h2>
            <div style={{ display: 'grid', gap: 20,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {related.map(l => (
                <ListingCard key={l.id} listing={l}
                  onOpen={(x) => { onNav('detalhe', { id: x.id }); window.scrollTo(0, 0); }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {showContact && <ContactModal listing={listing} onClose={() => setShowContact(false)} />}
    </main>
  );
}

function ContactModal({ listing, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(15,34,68,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 22, padding: '32px',
        maxWidth: 480, width: '100%', boxShadow: '0 18px 50px rgba(15,34,68,0.3)' }}
        onClick={(e) => e.stopPropagation()}>
        <Eyebrow color="var(--gold)">Falar com curador · {listing.codigo}</Eyebrow>
        <h3 style={{ margin: '4px 0 16px' }}>Vamos agendar uma conversa?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Seu nome completo" style={{ padding: '0.75rem 0.9rem' }} />
          <input placeholder="WhatsApp" style={{ padding: '0.75rem 0.9rem' }} />
          <input placeholder="E-mail" style={{ padding: '0.75rem 0.9rem' }} />
          <textarea placeholder={`Olá, tenho interesse no imóvel ${listing.codigo}...`}
            style={{ padding: '0.75rem 0.9rem', minHeight: 80, resize: 'vertical' }} />
          <Btn variant="accent" fullWidth>Enviar mensagem</Btn>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--fg-2)',
            cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, marginTop: 4 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PropertyDetailPage });
