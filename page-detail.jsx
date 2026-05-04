// Property detail page — VN Prime aesthetic, ImovelWeb structure

function PropertyDetailPage({ id, onNav }) {
  const listing = window.VN_CATALOG.find(l => l.id === id) || window.VN_CATALOG[0];
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const { codigo, title, neighborhood, city, type, operation,
    price, condo, iptu, areaM2, quartos, suites, vagas, banheiros,
    photos, isFeatured, isNew, planLabel, description, features } = listing;

  const priceLabel = '';
  const related = window.VN_CATALOG
    .filter(l => l.id !== id && (l.neighborhood === neighborhood || l.type === type))
    .slice(0, 3);

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
          {/* Left — content */}
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

            {/* Map placeholder */}
            <div style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 14, padding: '24px 28px 0', marginBottom: 24, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(15,34,68,0.06)' }}>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Localização</h3>
              <div style={{ position: 'relative', height: 240, borderRadius: 10, overflow: 'hidden',
                background: 'linear-gradient(135deg, #E8EEF6 0%, #D6DEE8 100%)',
                marginBottom: 24 }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
                  <defs>
                    <pattern id="detail-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M32 0 L0 0 0 32" fill="none" stroke="rgba(15,34,68,0.08)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#detail-grid)" />
                  <path d="M0 120 Q200 100 400 140 T800 130" stroke="rgba(255,255,255,0.7)" strokeWidth="6" fill="none"/>
                  <path d="M120 0 Q140 100 200 200 T280 400" stroke="rgba(255,255,255,0.6)" strokeWidth="5" fill="none"/>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    background: 'var(--gold)', color: 'var(--navy)', border: '2px solid #fff',
                    borderRadius: 999, padding: '6px 14px',
                    fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(15,34,68,0.3)',
                  }}>{neighborhood}</div>
                  <div style={{ width: 0, height: 0,
                    borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                    borderTop: '8px solid var(--gold)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — sticky sidebar with price + CTA */}
          <aside style={{ position: 'sticky', top: 90, alignSelf: 'start' }}>
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
                {priceLabel && <span style={{ fontSize: 14, color: 'var(--fg-2)', marginLeft: 6 }}>{priceLabel}</span>}
              </div>
              {(condo > 0 || iptu > 0) && (
                <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: 'var(--fg-2)',
                  paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                  {condo > 0 && <div>Condomínio: {fmtBRL(condo)}</div>}
                  {iptu > 0 && <div>IPTU: {fmtBRL(iptu)}/ano</div>}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <Btn variant="accent" fullWidth onClick={() => setShowContact(true)}>
                  Falar com curador
                </Btn>
                <Btn variant="primary" fullWidth>
                  Agendar visita
                </Btn>
                <Btn variant="ghost" fullWidth>♡ Salvar imóvel</Btn>
              </div>

              {/* Curator card */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center',
                paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--navy), var(--navy-muted))',
                  color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>VN</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>
                    Vinícius Nogueira
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-2)' }}>Curador VN Prime · CRECI 12345</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <a style={{ flex: 1, padding: '0.55rem', borderRadius: 6,
                  background: '#25D366', color: '#fff', textAlign: 'center',
                  fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600,
                  textDecoration: 'none', cursor: 'pointer' }}>WhatsApp</a>
                <a style={{ flex: 1, padding: '0.55rem', borderRadius: 6,
                  background: 'rgba(15,34,68,0.08)', color: 'var(--navy)', textAlign: 'center',
                  fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600,
                  textDecoration: 'none', cursor: 'pointer' }}>Telefone</a>
              </div>
            </div>

            {/* Trust insert */}
            <div style={{ background: 'var(--navy)', color: '#fff',
              borderRadius: 14, padding: '20px', marginTop: 16,
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(201,150,14,0.18), transparent 60%)' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--gold-soft)', marginBottom: 8 }}>VN Prime garante</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, lineHeight: 1.7 }}>
                <li>✓ Documentação verificada</li>
                <li>✓ Curadoria de fotografia</li>
                <li>✓ Concierge de visita</li>
                <li>✓ Suporte jurídico</li>
              </ul>
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
          <input placeholder="Seu nome completo" style={{ ...inputStyle, padding: '0.75rem 0.9rem' }} />
          <input placeholder="WhatsApp" style={{ ...inputStyle, padding: '0.75rem 0.9rem' }} />
          <input placeholder="E-mail" style={{ ...inputStyle, padding: '0.75rem 0.9rem' }} />
          <textarea placeholder={`Olá, tenho interesse no imóvel ${listing.codigo}...`}
            style={{ ...inputStyle, padding: '0.75rem 0.9rem', minHeight: 80, resize: 'vertical' }} />
          <Btn variant="accent" fullWidth>Enviar mensagem</Btn>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--fg-2)',
            cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, marginTop: 4 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PropertyDetailPage });
