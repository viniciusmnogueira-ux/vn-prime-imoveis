// Search results page — ImovelWeb-style with sidebar filters + map toggle

function SearchResultsPage({ onNav, initial = {}, density = 'comfortable' }) {
  const [filters, setFilters] = useState({
    op: initial.op || 'compra',
    q: initial.q || '',
    tipo: initial.tipo || '',
    bairros: [],
    quartos: 0,
    priceMin: '', priceMax: '',
    areaMin: '',
    onlyFeatured: false,
    onlyNew: false,
  });
  const [sort, setSort] = useState('relevance');
  const [layout, setLayout] = useState('grid'); // grid | list | map
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const results = useMemo(() => {
    let r = window.VN_CATALOG.filter(l => {
      if (filters.op && l.operation !== filters.op) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!l.title.toLowerCase().includes(q)
          && !l.neighborhood.toLowerCase().includes(q)
          && !l.city.toLowerCase().includes(q)
          && !l.codigo.toLowerCase().includes(q)) return false;
      }
      if (filters.tipo && l.type !== filters.tipo) return false;
      if (filters.bairros.length && !filters.bairros.includes(l.neighborhood)) return false;
      if (filters.quartos && l.quartos < filters.quartos) return false;
      if (filters.priceMin && l.price < +filters.priceMin) return false;
      if (filters.priceMax && l.price > +filters.priceMax) return false;
      if (filters.areaMin && l.areaM2 < +filters.areaMin) return false;
      if (filters.onlyFeatured && !l.isFeatured) return false;
      if (filters.onlyNew && !l.isNew) return false;
      return true;
    });
    if (sort === 'price_asc') r.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') r.sort((a, b) => b.price - a.price);
    if (sort === 'area_desc') r.sort((a, b) => b.areaM2 - a.areaM2);
    if (sort === 'newest') r.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return r;
  }, [filters, sort]);

  const visible = results.slice(0, page * PER_PAGE);
  const allBairros = [...new Set(window.VN_CATALOG.map(l => l.neighborhood))];

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* breadcrumb + headline */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--fg-2)', marginBottom: 8 }}>
            <a onClick={() => onNav('home')} style={{ color: 'var(--fg-2)', cursor: 'pointer', textDecoration: 'none' }}>Início</a>
            {' › '}
            <span style={{ color: 'var(--navy)' }}>
              {filters.op === 'lancamento' ? 'Lançamentos' : 'Comprar'}
              {filters.q && ` · ${filters.q}`}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', margin: 0 }}>
            {results.length} {results.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            {filters.q && <span style={{ color: 'var(--gold)' }}> em "{filters.q}"</span>}
          </h1>
        </div>
      </section>

      {/* Toolbar */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)',
        padding: '12px 0', position: 'sticky', top: 60, zIndex: 50,
        backdropFilter: 'blur(8px)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto', display: 'flex',
          alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <OperationTabsLight value={filters.op} onChange={(v) => setFilters({ ...filters, op: v })} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              style={{ ...inputStyle, padding: '0.5rem 0.7rem', fontSize: 13 }}>
              <option value="relevance">Mais relevantes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="area_desc">Maior área</option>
              <option value="newest">Recém adicionados</option>
            </select>
            <div style={{ display: 'inline-flex', border: '1px solid var(--border)',
              borderRadius: 8, overflow: 'hidden' }}>
              {[['grid', '▦'], ['list', '☰'], ['map', '◉']].map(([id, icon]) => (
                <button key={id} onClick={() => setLayout(id)}
                  style={{
                    border: 'none', cursor: 'pointer', padding: '0.5rem 0.85rem',
                    background: layout === id ? 'var(--navy)' : 'transparent',
                    color: layout === id ? 'var(--gold)' : 'var(--navy)',
                    fontSize: 14, fontFamily: 'DM Sans', fontWeight: 600,
                  }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '24px 0 60px' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto', display: 'grid',
          gap: 24, gridTemplateColumns: layout === 'map' ? '280px 1fr' : '280px 1fr' }}>

          {/* Sidebar filters */}
          <aside style={{ position: 'sticky', top: 130, alignSelf: 'start',
            background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
            padding: '20px', boxShadow: '0 8px 32px rgba(15,34,68,0.06)',
            maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 17, fontWeight: 600,
              color: 'var(--navy)', marginBottom: 4 }}>Refinar busca</div>
            <button onClick={() => setFilters({ op: filters.op, q: '', tipo: '', bairros: [],
              quartos: 0, priceMin: '', priceMax: '', areaMin: '', onlyFeatured: false, onlyNew: false })}
              style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 600, padding: 0,
                marginBottom: 18, textDecoration: 'underline' }}>Limpar filtros</button>

            <FilterGroup title="Localização">
              <input type="text" placeholder="Bairro ou cidade"
                value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                style={{ ...inputStyle, fontSize: 13 }} />
            </FilterGroup>

            <FilterGroup title="Tipo de imóvel">
              <select value={filters.tipo} onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                style={{ ...inputStyle, fontSize: 13 }}>
                <option value="">Todos os tipos</option>
                <option>Apartamento</option><option>Casa</option><option>Cobertura</option>
              </select>
            </FilterGroup>

            <FilterGroup title="Quartos">
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => setFilters({ ...filters, quartos: n })}
                    style={{
                      flex: 1, padding: '0.5rem 0', border: '1px solid',
                      borderColor: filters.quartos === n ? 'var(--gold)' : 'var(--border)',
                      background: filters.quartos === n ? 'rgba(201,150,14,0.1)' : '#fff',
                      color: 'var(--navy)', cursor: 'pointer', borderRadius: 6,
                      fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600,
                    }}>{n === 0 ? 'Todos' : `${n}+`}</button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Faixa de preço">
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="number" placeholder="Mín" value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  style={{ ...inputStyle, fontSize: 12.5 }} />
                <input type="number" placeholder="Máx" value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  style={{ ...inputStyle, fontSize: 12.5 }} />
              </div>
            </FilterGroup>

            <FilterGroup title="Área mínima (m²)">
              <input type="number" placeholder="Ex.: 100" value={filters.areaMin}
                onChange={(e) => setFilters({ ...filters, areaMin: e.target.value })}
                style={{ ...inputStyle, fontSize: 13 }} />
            </FilterGroup>

            <FilterGroup title="Bairros populares">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {allBairros.map(b => (
                  <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'DM Sans', fontSize: 13, color: 'var(--navy)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filters.bairros.includes(b)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...filters.bairros, b]
                          : filters.bairros.filter(x => x !== b);
                        setFilters({ ...filters, bairros: next });
                      }}
                      style={{ accentColor: 'var(--gold)' }} />
                    {b}
                  </label>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Outros">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'DM Sans', fontSize: 13, color: 'var(--navy)', cursor: 'pointer', marginBottom: 6 }}>
                <input type="checkbox" checked={filters.onlyFeatured}
                  onChange={(e) => setFilters({ ...filters, onlyFeatured: e.target.checked })}
                  style={{ accentColor: 'var(--gold)' }} />
                Apenas em destaque
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'DM Sans', fontSize: 13, color: 'var(--navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.onlyNew}
                  onChange={(e) => setFilters({ ...filters, onlyNew: e.target.checked })}
                  style={{ accentColor: 'var(--gold)' }} />
                Recém adicionados
              </label>
            </FilterGroup>
          </aside>

          {/* Results */}
          <div>
            {layout === 'map' ? (
              <MapResults listings={results} onOpen={(l) => onNav('detalhe', { id: l.id })} />
            ) : visible.length === 0 ? (
              <EmptyState onClear={() => setFilters({ op: 'compra', q: '', tipo: '', bairros: [],
                quartos: 0, priceMin: '', priceMax: '', areaMin: '', onlyFeatured: false, onlyNew: false })} />
            ) : (
              <React.Fragment>
                <div style={{
                  display: 'grid', gap: 20,
                  gridTemplateColumns: layout === 'list'
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(280px, 1fr))',
                }}>
                  {visible.map(l => (
                    <ListingCard key={l.id} listing={l}
                      onOpen={(x) => onNav('detalhe', { id: x.id })}
                      layout={layout === 'list' ? 'horizontal' : 'grid'} />
                  ))}
                </div>
                {visible.length < results.length && (
                  <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <Btn variant="ghost" onClick={() => setPage(page + 1)}>
                      Mostrar mais {Math.min(PER_PAGE, results.length - visible.length)} imóveis
                    </Btn>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)',
        marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function OperationTabsLight({ value, onChange }) {
  const tabs = [
    { id: 'compra', label: 'Comprar' },
    { id: 'lancamento', label: 'Lançamentos' },
  ];
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {tabs.map(t => {
        const active = value === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600,
              padding: '0.55rem 1.1rem', borderRadius: 7, cursor: 'pointer',
              border: '1px solid', borderColor: active ? 'var(--navy)' : 'var(--border)',
              background: active ? 'var(--navy)' : '#fff',
              color: active ? 'var(--gold)' : 'var(--navy-muted)',
            }}>{t.label}</button>
        );
      })}
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '60px 30px',
      textAlign: 'center', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 40, color: 'var(--gold)' }}>◇</div>
      <h3 style={{ marginTop: 16 }}>Nenhum imóvel encontrado</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 360, margin: '0 auto 18px' }}>
        Tente ajustar seus filtros ou ampliar a busca para outros bairros.
      </p>
      <Btn variant="accent" onClick={onClear}>Limpar filtros</Btn>
    </div>
  );
}

// Map view — stylized abstract map (no real tiles)
function MapResults({ listings, onOpen }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18,
      height: 'calc(100vh - 200px)', minHeight: 600,
    }}>
      {/* Faux map */}
      <div style={{
        position: 'relative', borderRadius: 14, overflow: 'hidden',
        background: 'linear-gradient(135deg, #E8EEF6 0%, #D6DEE8 100%)',
        border: '1px solid var(--border)',
      }}>
        {/* abstract grid lines */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(15,34,68,0.08)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
          {/* fake roads */}
          <path d="M0 240 Q300 200 600 280 T1200 250" stroke="rgba(255,255,255,0.7)" strokeWidth="6" fill="none"/>
          <path d="M180 0 Q200 200 280 400 T380 800" stroke="rgba(255,255,255,0.6)" strokeWidth="5" fill="none"/>
          <path d="M0 460 L600 480" stroke="rgba(255,255,255,0.5)" strokeWidth="4" fill="none"/>
        </svg>
        {/* pins */}
        {listings.slice(0, 12).map((l, i) => {
          const x = 12 + ((i * 137) % 78);
          const y = 14 + ((i * 59) % 72);
          const active = hovered === l.id;
          return (
            <button key={l.id}
              onMouseEnter={() => setHovered(l.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onOpen(l)}
              style={{
                position: 'absolute', left: `${x}%`, top: `${y}%`,
                transform: 'translate(-50%, -100%)',
                background: active ? 'var(--navy)' : 'var(--gold)',
                color: active ? 'var(--gold)' : 'var(--navy)',
                border: '2px solid #fff', borderRadius: 999, padding: '5px 11px',
                fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(15,34,68,0.25)',
                transition: 'all 0.18s ease', zIndex: active ? 10 : 1,
              }}>{fmtBRLshort(l.price)}</button>
          );
        })}
        <div style={{ position: 'absolute', bottom: 14, left: 14,
          background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: 6,
          fontFamily: 'DM Sans', fontSize: 11, color: 'var(--fg-2)',
          backdropFilter: 'blur(6px)' }}>
          BH · Nova Lima · Região metropolitana
        </div>
      </div>
      {/* List on side */}
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 4 }}>
        {listings.slice(0, 12).map(l => (
          <div key={l.id}
            onMouseEnter={() => setHovered(l.id)}
            onMouseLeave={() => setHovered(null)}>
            <ListingCard listing={l} onOpen={onOpen} layout="horizontal" />
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { SearchResultsPage });
