// VN Prime — Listing card (ImovelWeb-style with VN Prime aesthetic)
function ListingCard({ listing, onOpen, layout = 'grid' }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [favorited, setFav] = useState(false);
  const { codigo, title, neighborhood, city, type, operation,
    price, condo, areaM2, quartos, suites, vagas, banheiros,
    photos, isFeatured, isNew } = listing;

  const isHorizontal = layout === 'horizontal';
  const priceLabel = '';

  return (
    <article
      onClick={() => onOpen && onOpen(listing)}
      style={{
        background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)',
        boxShadow: isFeatured ? '0 12px 40px rgba(201,150,14,0.18)' : '0 8px 32px rgba(15,34,68,0.08)',
        overflow: 'hidden', cursor: 'pointer',
        display: isHorizontal ? 'grid' : 'flex',
        gridTemplateColumns: isHorizontal ? '320px 1fr' : undefined,
        flexDirection: isHorizontal ? undefined : 'column',
        transition: 'transform 0.18s ease, box-shadow 0.2s',
        borderLeft: isFeatured ? '3px solid var(--gold)' : undefined,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(15,34,68,0.14)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isFeatured ? '0 12px 40px rgba(201,150,14,0.18)' : '0 8px 32px rgba(15,34,68,0.08)'; }}
    >
      {/* Photo carousel */}
      <div style={{
        position: 'relative',
        height: isHorizontal ? '100%' : 220,
        minHeight: isHorizontal ? 240 : 220,
        background: `url(${photos[photoIdx]}) center/cover`,
        transition: 'background-image 0.3s ease',
      }}>
        {/* Top-left badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {isFeatured && <Pill tone="featured">★ Destaque</Pill>}
          {isNew && <Pill tone="new">Novo</Pill>}
        </div>
        {/* Top-right favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); setFav(!favorited); }}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 34, height: 34, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: favorited ? 'var(--gold)' : 'var(--navy)',
            fontSize: 16,
          }}>{favorited ? '♥' : '♡'}</button>
        {/* Photo nav */}
        {photos.length > 1 && (
          <React.Fragment>
            <button
              onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx - 1 + photos.length) % photos.length); }}
              style={photoNavStyle('left')}>‹</button>
            <button
              onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx + 1) % photos.length); }}
              style={photoNavStyle('right')}>›</button>
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 4 }}>
              {photos.map((_, i) => (
                <span key={i} style={{
                  width: i === photoIdx ? 18 : 6, height: 4, borderRadius: 2,
                  background: i === photoIdx ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
                  transition: 'width 0.2s ease',
                }} />
              ))}
            </div>
          </React.Fragment>
        )}
        {/* bottom feature pills */}
        {listing.features && listing.features.length > 0 && (
          <div style={{ position: 'absolute', bottom: 10, left: 12, right: 56,
            display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {listing.features.slice(0, 2).map(f => (
              <span key={f} style={{ fontFamily: 'DM Sans', fontSize: 9.5, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px',
                borderRadius: 4, background: 'rgba(15,34,68,0.82)', color: 'var(--gold-soft)',
                backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}>{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Price first — ImovelWeb pattern */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 700,
            color: 'var(--gold)', lineHeight: 1 }}>{fmtBRL(price)}</span>
          {priceLabel && <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>{priceLabel}</span>}
        </div>
        {condo > 0 && (
          <div style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: -4 }}>
            Cond. {fmtBRL(condo)}
          </div>
        )}

        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 17, color: 'var(--navy)',
          fontWeight: 600, margin: '4px 0 2px', lineHeight: 1.3 }}>{title}</h3>

        <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: 'var(--fg-2)', display: 'flex', gap: 6 }}>
          <span style={{ color: 'var(--gold)' }}>◉</span>
          <span>{neighborhood}, {city}</span>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '8px 0 4px' }} />

        <FeatureRow areaM2={areaM2} quartos={quartos} suites={suites} vagas={vagas} compact />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>{codigo}</span>
          <Btn size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpen(listing); }}>
            Ver imóvel →
          </Btn>
        </div>
      </div>
    </article>
  );
}

function photoNavStyle(side) {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: 8, width: 30, height: 30, borderRadius: 999, border: 'none',
    background: 'rgba(255,255,255,0.92)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--navy)', fontSize: 18, fontWeight: 700, lineHeight: 1,
  };
}

Object.assign(window, { ListingCard });
