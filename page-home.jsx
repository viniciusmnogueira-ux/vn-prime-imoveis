// Pages: Home, SearchResults, PropertyDetail

const PLANOS_VENDA = [
  {
    id: 'direta',
    label: 'Venda Direta',
    price: 'R$ 197',
    priceSub: 'taxa fixa · 90 dias · sem comissão',
    badge: null,
    tagline: 'Você assume o controle total. Publica, conduz as visitas e fecha o negócio. Paga apenas a taxa de listagem e fica com 100% do valor da venda.',
    divisao: null,
    voce: [
      'Você publica e gerencia o anúncio',
      'Você agenda e conduz as visitas',
      'Você negocia diretamente com o comprador',
      'Você cuida da parte documental',
    ],
    vnprime: [
      'Curadoria editorial do anúncio antes de publicar',
      'IA para gerar a descrição do imóvel',
      'Orientação de fotos e sugestão de preço de mercado',
      'Distribuição e vitrine VN Prime',
    ],
    inclusos: [
      'Anúncio na vitrine VN Prime por 90 dias',
      'IA para criar a descrição do imóvel',
      'Tutorial de fotos + filtro editorial VN Prime',
      'Leads qualificados direto no seu WhatsApp',
      '30 dias grátis FactorOne (gestão financeira PF)',
      'Pacotes de foto profissional disponíveis (add-on)',
    ],
    cta: 'Anunciar por R$ 197',
    ctaVariant: 'ghostOnNavy',
  },
  {
    id: 'assistida',
    label: '3% Assistida',
    price: '3%',
    priceSub: 'sobre o valor da venda · zero se não vender',
    badge: 'Mais escolhido',
    tagline: 'Você conduz as visitas e negocia. A VN Prime apoia nos bastidores com IA, curadoria e BOOSTER. Paga apenas quando a venda fechar.',
    divisao: null,
    voce: [
      'Você agenda e conduz as visitas',
      'Você negocia as condições com o comprador',
      'Você assina os documentos de venda',
    ],
    vnprime: [
      'Curadoria editorial completa do anúncio',
      'IA para descrição, precificação e orientação de fotos',
      'BOOSTER de impulsionamento na vitrine',
      'Triagem prévia dos leads antes de enviar para você',
      'Suporte da curadoria VN Prime durante todo o processo',
    ],
    inclusos: [
      'Tudo do plano Venda Direta',
      'Suporte da curadoria VN Prime durante o processo',
      'BOOSTER de impulsionamento do anúncio (disponível)',
      'Leads qualificados com triagem prévia VN Prime',
      '30 dias grátis FactorOne (gestão financeira PF)',
      'Comissão zero se não vender — zero risco financeiro',
    ],
    cta: 'Começar com 3%',
    ctaVariant: 'accent',
  },
  {
    id: 'completa',
    label: '6% Completa',
    price: '6%',
    priceSub: 'sobre o valor da venda · zero se não vender',
    badge: null,
    tagline: 'A VN Prime assume tudo. Um corretor parceiro dedicado cuida de visitas, negociação e documentação. Você acompanha pelo portal e só assina no fechamento.',
    divisao: '3% corretor parceiro + 3% VN Prime',
    voce: [
      'Você aprova o preço e as condições de venda',
      'Você acompanha o processo pelo portal',
      'Você assina os documentos finais de fechamento',
    ],
    vnprime: [
      'Corretor parceiro VN Prime dedicado ao seu imóvel',
      'Agendamento e condução de todas as visitas',
      'Negociação das condições com o comprador',
      'Coordenação de toda a documentação e suporte jurídico',
      'Curadoria editorial e BOOSTER de impulsionamento',
    ],
    inclusos: [
      'Tudo do plano 3% Assistida',
      'Corretor parceiro VN Prime dedicado',
      'Visitas e negociação 100% coordenadas pelo corretor',
      'Suporte jurídico e documental completo',
      '30 dias grátis FactorOne (gestão financeira PF)',
      'Comissão zero se não vender — zero risco financeiro',
    ],
    cta: 'Começar com 6%',
    ctaVariant: 'ghostOnNavy',
  },
];

// ============================================================
// HOME — ImovelWeb-style hero search + featured + neighborhoods
// ============================================================
function HomePage({ onNav, density, accentMode }) {
  const [op, setOp] = useState('compra');
  const [filters, setFilters] = useState({ q: '', tipo: '', valorMax: '' });
  const [heroIdx, setHeroIdx] = useState(0);
  const [planIdx, setPlanIdx] = useState(1);
  const [planPhotoIdx, setPlanPhotoIdx] = useState(0);
  const PLAN_PHOTOS = [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=85',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=85',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85',
  ];
  const heroPhotos = [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=2400&q=85',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2400&q=85',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2400&q=85',
  ];
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroPhotos.length), 7000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setPlanPhotoIdx(i => (i + 1) % PLAN_PHOTOS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const featured = window.VN_CATALOG.filter(l => l.isFeatured).slice(0, 4);

  const onSearch = () => {
    if (op === 'venda') { onNav('proprietario'); return; }
    onNav('busca', { op, ...filters });
  };

  return (
    <main>
      {/* HERO with crossfade slideshow */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 580,
        display: 'flex', alignItems: 'center', padding: '4rem 0 6rem' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {heroPhotos.map((src, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: i === heroIdx ? 1 : 0, transition: 'opacity 1.6s ease, transform 8s ease',
              transform: i === heroIdx ? 'scale(1)' : 'scale(1.06)',
            }} />
          ))}
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(120deg, rgba(15,34,68,0.78) 0%, rgba(15,34,68,0.50) 45%, rgba(15,34,68,0.65) 100%)' }} />
          {/* gold radial accent */}
          <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(201,150,14,0.25) 0%, transparent 65%)',
            pointerEvents: 'none' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: 'min(1280px, 94vw)',
          margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>VN Prime Imóveis · Belo Horizonte e região</Eyebrow>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
            textShadow: '0 2px 24px rgba(0,0,0,0.4)', margin: '0 0 16px',
            maxWidth: '20ch', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15 }}>
            Encontre seu próximo endereço <span style={{
              background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text',
              backgroundClip: 'text', color: 'transparent', fontStyle: 'italic',
            }}>de alto padrão</span>
          </h1>
          <p style={{ color: 'rgba(250,249,246,0.92)', fontSize: 16, maxWidth: 580,
            margin: '0 auto 28px', textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
            Curadoria de residências em Nova Lima, BH e região, Belvedere, Vila da Serra e Alphaville.
          </p>

          {/* Operation tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <OperationTabs value={op} onChange={setOp} />
          </div>

          {/* Search card — ImovelWeb hero search */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '1.25rem',
            boxShadow: '0 22px 60px rgba(15,34,68,0.32)',
            display: 'grid', gap: 10, maxWidth: 920, margin: '0 auto',
            gridTemplateColumns: '1.6fr 1fr 1fr auto', alignItems: 'end',
          }}>
            <SearchField label={op === 'venda' ? 'Bairro do imóvel' : 'Onde'}>
              <input type="text"
                placeholder={op === 'venda' ? 'Ex.: BH e região, Belvedere, Nova Lima' : 'Bairro, cidade ou código (ex.: BH e região, VN-2048)'}
                value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                style={inputStyle} />
            </SearchField>
            <SearchField label="Tipo de imóvel">
              <select value={filters.tipo} onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                style={inputStyle}>
                <option value="">Todos</option>
                <option>Apartamento</option><option>Casa</option>
                <option>Cobertura</option><option>Studio</option>
              </select>
            </SearchField>
            <SearchField label={op === 'venda' ? 'Valor pedido' : 'Valor até'}>
              <select value={filters.valorMax} onChange={(e) => setFilters({ ...filters, valorMax: e.target.value })}
                style={inputStyle}>
                <option value="">Sem limite</option>
                <option value="2000000">R$ 2 mi</option>
                <option value="5000000">R$ 5 mi</option>
                <option value="10000000">R$ 10 mi</option>
              </select>
            </SearchField>
            <Btn variant="accent" size="lg" onClick={onSearch}>
              {op === 'venda'
                ? 'Anunciar →'
                : <React.Fragment><span style={{ fontSize: 16 }}>⌕</span> Buscar</React.Fragment>}
            </Btn>
          </div>

          {/* Trust bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
            {[
              ['142', 'Imóveis curados'],
              ['R$ 4,2 bi', 'Em portfólio'],
              ['96%', 'Satisfação'],
              ['18 dias', 'Tempo médio venda'],
            ].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center', minWidth: 110 }}>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 700,
                  color: 'var(--gold-soft)', lineHeight: 1 }}>{v}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'rgba(250,249,246,0.8)', marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button onClick={() => document.getElementById('planos-venda')?.scrollIntoView({ behavior: 'smooth' })} style={{
              background: 'transparent', border: '1px solid rgba(250,249,246,0.35)',
              color: 'rgba(250,249,246,0.85)', padding: '9px 24px', borderRadius: 99,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Ver planos de venda <span>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* QUICK LINKS — type filters chip row */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)',
        padding: '20px 0' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>
            Buscas frequentes
          </span>
          {['Apartamentos em Lourdes', 'Casas em Nova Lima', 'Coberturas Belvedere',
            'Lançamentos Vila da Serra', 'Aluguel Funcionários', 'Acima de R$ 5 mi'].map(q => (
            <a key={q} onClick={() => onNav('busca', { q })}
               style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--navy)',
                 padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 999,
                 cursor: 'pointer', textDecoration: 'none',
                 transition: 'border-color 0.15s ease, color 0.15s ease' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)';
                 e.currentTarget.style.color = 'var(--gold)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)';
                 e.currentTarget.style.color = 'var(--navy)'; }}>{q}</a>
          ))}
        </div>
      </section>

      {/* DESTAQUES — featured grid */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: 32, gap: 24, flexWrap: 'wrap' }}>
            <div>
              <Eyebrow color="var(--gold)">Curadoria · Em destaque</Eyebrow>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
                Endereços que valem a visita
              </h2>
              <p style={{ margin: '8px 0 0', maxWidth: 520, color: 'var(--fg-2)' }}>
                Quatro imóveis selecionados pela curadoria VN Prime esta semana.
              </p>
            </div>
            <Btn variant="ghost" onClick={() => onNav('busca')}>Ver todos os {window.VN_CATALOG.length} imóveis →</Btn>
          </div>
          <div style={{ display: 'grid', gap: 22,
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))' }}>
            {featured.map(l => (
              <ListingCard key={l.id} listing={l} onOpen={(x) => onNav('detalhe', { id: x.id })} />
            ))}
          </div>
        </div>
      </section>


      {/* PLANOS — carrossel */}
      <section id="planos-venda" style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--gradient-navy-hero)', color: '#fff' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow>Transparência total · sem letras miúdas</Eyebrow>
            <h2 style={{ color: '#fff', margin: '8px 0 16px' }}>Escolha como vender</h2>
            <p style={{ color: 'rgba(250,249,246,0.8)', maxWidth: 500, margin: '0 auto', fontSize: 15 }}>
              Três modalidades para atender cada perfil. Em todos: zero comissão se não vender.
            </p>
          </div>

          {/* Seletor visual — cards de plano */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
            {PLANOS_VENDA.map((p, i) => {
              const active = planIdx === i;
              const VISUALS = {
                direta:   { icon: 'D', sub: 'Você no controle', bar: 20 },
                assistida:{ icon: 'A', sub: 'Apoio VN Prime',   bar: 55 },
                completa: { icon: 'C', sub: 'VN Prime assume',  bar: 90 },
              };
              const v = VISUALS[p.id] || VISUALS.direta;
              return (
                <button key={p.id} onClick={() => setPlanIdx(i)} style={{
                  position: 'relative', padding: '20px 18px 18px', borderRadius: 16, cursor: 'pointer',
                  background: active ? 'rgba(201,150,14,0.14)' : 'rgba(255,255,255,0.04)',
                  border: active ? '2px solid rgba(201,150,14,0.55)' : '2px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s', textAlign: 'left',
                  boxShadow: active ? '0 8px 32px rgba(201,150,14,0.15)' : 'none',
                }}>
                  {p.badge && (
                    <span style={{
                      position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--gold)', color: 'var(--navy)', fontSize: 9, fontWeight: 800,
                      padding: '3px 10px', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>{p.badge}</span>
                  )}
                  {/* Price */}
                  <div style={{ fontFamily: 'Playfair Display', fontSize: 34, fontWeight: 700,
                    color: active ? 'var(--gold-soft)' : 'rgba(250,249,246,0.9)', lineHeight: 1, marginBottom: 4 }}>
                    {p.price}
                  </div>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 13,
                    color: active ? '#fff' : 'rgba(250,249,246,0.75)', marginBottom: 6 }}>{p.label}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(250,249,246,0.45)', marginBottom: 14 }}>{v.sub}</div>
                  {/* Visual bar — VN Prime coverage */}
                  <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${v.bar}%`, borderRadius: 99,
                      background: active ? 'var(--gold)' : 'rgba(201,150,14,0.45)',
                      transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ marginTop: 5, fontSize: 10, color: 'rgba(250,249,246,0.3)', fontFamily: 'DM Sans' }}>
                    VN Prime apoia {v.bar}%
                  </div>
                </button>
              );
            })}
          </div>

          {/* Card do plano ativo — 2 colunas: detalhes + carrossel de fotos */}
          {PLANOS_VENDA.map((p, i) => i === planIdx && (
            <div key={p.id} style={{
              background: p.badge ? 'rgba(201,150,14,0.10)' : 'rgba(255,255,255,0.06)',
              border: p.badge ? '2px solid rgba(201,150,14,0.45)' : '1px solid rgba(255,255,255,0.14)',
              borderRadius: 24, overflow: 'hidden',
              boxShadow: p.badge ? '0 24px 60px rgba(201,150,14,0.12)' : 'none',
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1.5fr) minmax(260px, 1fr)',
            }}>
              {/* LEFT: detalhes do plano */}
              <div style={{ padding: 'clamp(28px,4vw,44px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 8 }}>{p.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontFamily: 'Playfair Display', fontSize: 52, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{p.price}</span>
                      <span style={{ fontSize: 13, color: 'rgba(250,249,246,0.5)' }}>{p.priceSub}</span>
                    </div>
                    <p style={{ fontSize: 14.5, color: 'rgba(250,249,246,0.82)', lineHeight: 1.75, maxWidth: 580, margin: 0 }}>{p.tagline}</p>
                    {p.divisao && (
                      <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, padding: '5px 14px', fontSize: 12, color: 'rgba(250,249,246,0.7)' }}>
                        Divisão: {p.divisao}
                      </div>
                    )}
                  </div>
                  <Btn variant={p.ctaVariant} onClick={() => onNav('proprietario')} style={{ flexShrink: 0 }}>
                    {p.cta}
                  </Btn>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,249,246,0.45)', marginBottom: 14 }}>Você faz</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {p.voce.map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(250,249,246,0.88)' }}>
                          <span style={{ color: 'rgba(250,249,246,0.35)', marginTop: 4, flexShrink: 0, fontSize: 9 }}>&#9632;</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: 'rgba(201,150,14,0.08)', border: '1px solid rgba(201,150,14,0.2)', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 14 }}>VN Prime faz</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {p.vnprime.map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(250,249,246,0.88)' }}>
                          <span style={{ color: 'var(--gold)', marginTop: 4, flexShrink: 0, fontSize: 9 }}>&#9632;</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,249,246,0.45)', marginBottom: 14 }}>Incluso no plano</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
                    {p.inclusos.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(250,249,246,0.82)' }}>
                        <span style={{ color: 'var(--gold-soft)', marginTop: 4, flexShrink: 0, fontSize: 9 }}>&#9632;</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: carrossel de imóveis */}
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: 380 }}>
                {PLAN_PHOTOS.map((src, j) => (
                  <div key={j} style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: j === planPhotoIdx ? 1 : 0,
                    transition: 'opacity 1.2s ease',
                  }} />
                ))}
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(15,34,68,0.45) 0%, transparent 45%)' }} />
                <div style={{ position: 'absolute', top: 22, left: 22 }}>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(250,249,246,0.6)', marginBottom: 4 }}>Imóveis curados</div>
                  <div style={{ fontFamily: 'Playfair Display', fontSize: 16, color: '#fff', fontWeight: 600, lineHeight: 1.3 }}>
                    BH · BH e região · Alphaville
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', gap: 6 }}>
                  {PLAN_PHOTOS.map((_, j) => (
                    <button key={j} onClick={() => setPlanPhotoIdx(j)} style={{
                      width: j === planPhotoIdx ? 24 : 8, height: 8,
                      borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                      background: j === planPhotoIdx ? 'var(--gold)' : 'rgba(255,255,255,0.38)',
                      transition: 'all 0.35s ease',
                    }} />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(250,249,246,0.4)', marginTop: 28 }}>
            Em todos os planos: endereço completo permanece privado — a vitrine exibe apenas o bairro.
          </p>
        </div>
      </section>

      {/* QUAL O SEU PERFIL */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <Eyebrow color="var(--gold)">Para cada objetivo</Eyebrow>
            <h2 style={{ margin: '8px 0 16px' }}>Qual é o seu perfil?</h2>
            <p style={{ color: 'var(--fg-2)', maxWidth: 580, margin: '0 auto', fontSize: 15, lineHeight: 1.75 }}>
              VN Prime foi construída para atender proprietários, compradores, corretores, quem quer comprar sem juros e quem precisa de segurança jurídica — cada um com seu caminho.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {[
              {
                route: 'proprietario',
                bg: 'linear-gradient(140deg, #0F2244 0%, #1e3a6e 100%)',
                accent: '#C9960E',
                label: 'Proprietário',
                sub: 'Quero vender meu imóvel',
                desc: 'Coloque seu imóvel na vitrine VN Prime com curadoria editorial, IA de precificação e leads qualificados. Você escolhe o nível de envolvimento.',
                benefits: [
                  'Taxa fixa R$ 197 ou comissão apenas no fechamento',
                  'Zero comissão se não vender — zero risco',
                  'IA de precificação e curadoria editorial incluída',
                ],
                cta: 'Anunciar meu imóvel',
                icon: (
                  React.createElement('svg', { width: 64, height: 64, viewBox: '0 0 64 64', fill: 'none' },
                    React.createElement('path', { d: 'M8 28L32 8L56 28V58H8V28Z', fill: 'rgba(201,150,14,0.15)', stroke: 'rgba(201,150,14,0.7)', strokeWidth: '2.5', strokeLinejoin: 'round' }),
                    React.createElement('path', { d: 'M4 30L32 6L60 30', stroke: 'rgba(201,150,14,0.9)', strokeWidth: '3', strokeLinecap: 'round', fill: 'none' }),
                    React.createElement('rect', { x: '24', y: '40', width: '16', height: '18', rx: '2', fill: 'rgba(201,150,14,0.25)', stroke: 'rgba(201,150,14,0.6)', strokeWidth: '2' }),
                    React.createElement('circle', { cx: '32', cy: '49', r: '2.5', fill: 'rgba(201,150,14,0.8)' }),
                    React.createElement('rect', { x: '10', y: '34', width: '12', height: '12', rx: '2', fill: 'rgba(201,150,14,0.12)', stroke: 'rgba(201,150,14,0.5)', strokeWidth: '1.5' }),
                    React.createElement('line', { x1: '16', y1: '34', x2: '16', y2: '46', stroke: 'rgba(201,150,14,0.35)', strokeWidth: '1' }),
                    React.createElement('line', { x1: '10', y1: '40', x2: '22', y2: '40', stroke: 'rgba(201,150,14,0.35)', strokeWidth: '1' })
                  )
                ),
              },
              {
                route: 'busca',
                bg: 'linear-gradient(140deg, #1D4ED8 0%, #2563EB 100%)',
                accent: '#3B82F6',
                label: 'Comprador',
                sub: 'Quero encontrar meu imóvel',
                desc: 'Navegue por um portfólio curado de apartamentos, casas e coberturas de alto padrão em BH e região. Fotos profissionais, preços reais.',
                benefits: [
                  'Imóveis curados com fotografia profissional',
                  'Preços diretos — sem sobrepreço de corretagem',
                  'Fale com Vini IA para tirar dúvidas em segundos',
                ],
                cta: 'Explorar imóveis',
                icon: (
                  React.createElement('svg', { width: 64, height: 64, viewBox: '0 0 64 64', fill: 'none' },
                    React.createElement('circle', { cx: '26', cy: '26', r: '18', fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.6)', strokeWidth: '2.5' }),
                    React.createElement('circle', { cx: '26', cy: '26', r: '9', fill: 'rgba(255,255,255,0.12)', stroke: 'rgba(255,255,255,0.45)', strokeWidth: '2' }),
                    React.createElement('line', { x1: '39', y1: '39', x2: '58', y2: '58', stroke: 'rgba(255,255,255,0.8)', strokeWidth: '4.5', strokeLinecap: 'round' }),
                    React.createElement('path', { d: 'M20 24L26 18L32 24', stroke: 'rgba(255,255,255,0.6)', strokeWidth: '1.5', strokeLinecap: 'round', fill: 'none' }),
                    React.createElement('path', { d: 'M26 18L26 36', stroke: 'rgba(255,255,255,0.6)', strokeWidth: '1.5', strokeLinecap: 'round' })
                  )
                ),
              },
              {
                route: 'corretor-canal',
                bg: 'linear-gradient(140deg, #065F46 0%, #047857 100%)',
                accent: '#10B981',
                label: 'Corretor',
                sub: 'Quero parcerias e leads',
                desc: 'Acesse leads qualificados, portfólio exclusivo de imóveis em Venda Completa e ferramentas de CRM. Modelo freemium — comece grátis.',
                benefits: [
                  'Leads qualificados com contato desbloqueado',
                  'Portfólio exclusivo de imóveis premium',
                  'CRM Kanban + IA + suporte VN Prime',
                ],
                cta: 'Ser parceiro VN Prime',
                icon: (
                  React.createElement('svg', { width: 64, height: 64, viewBox: '0 0 64 64', fill: 'none' },
                    React.createElement('path', { d: 'M4 32C4 32 14 22 24 28L32 28', stroke: 'rgba(255,255,255,0.75)', strokeWidth: '3', strokeLinecap: 'round', fill: 'none' }),
                    React.createElement('path', { d: 'M60 32C60 32 50 22 40 28L32 28', stroke: 'rgba(255,255,255,0.75)', strokeWidth: '3', strokeLinecap: 'round', fill: 'none' }),
                    React.createElement('circle', { cx: '32', cy: '28', r: '5.5', fill: 'rgba(255,255,255,0.15)', stroke: 'rgba(255,255,255,0.75)', strokeWidth: '2.5' }),
                    React.createElement('path', { d: 'M4 32L8 48', stroke: 'rgba(255,255,255,0.5)', strokeWidth: '2.5', strokeLinecap: 'round' }),
                    React.createElement('path', { d: 'M60 32L56 48', stroke: 'rgba(255,255,255,0.5)', strokeWidth: '2.5', strokeLinecap: 'round' }),
                    React.createElement('path', { d: 'M8 48C8 48 20 56 32 48C44 40 56 48 56 48', stroke: 'rgba(255,255,255,0.4)', strokeWidth: '2', strokeLinecap: 'round', fill: 'none' })
                  )
                ),
              },
              {
                route: 'consorcio',
                bg: 'linear-gradient(140deg, #1E3A8A 0%, #1D4ED8 100%)',
                accent: '#60A5FA',
                label: 'Consórcio',
                sub: 'Quero comprar sem juros',
                desc: 'Compre sem pagar juros. Com a carta de crédito VN Prime você garante seu imóvel por contemplação em sorteio ou lance — com acesso à vitrine exclusiva.',
                benefits: [
                  'Zero juros — apenas taxa de administração',
                  'Carta de crédito a partir de R$ 200 mil',
                  'Contemplação por sorteio ou lance antecipado',
                ],
                cta: 'Simular meu consórcio',
                icon: (
                  React.createElement('svg', { width: 64, height: 64, viewBox: '0 0 64 64', fill: 'none' },
                    React.createElement('circle', { cx: '20', cy: '26', r: '13', fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.5)', strokeWidth: '2' }),
                    React.createElement('circle', { cx: '44', cy: '26', r: '13', fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.5)', strokeWidth: '2' }),
                    React.createElement('circle', { cx: '32', cy: '42', r: '14', fill: 'rgba(255,255,255,0.18)', stroke: 'rgba(255,255,255,0.85)', strokeWidth: '2.5' }),
                    React.createElement('text', { x: '32', y: '48', textAnchor: 'middle', fontSize: '15', fontWeight: '800', fill: 'rgba(255,255,255,0.95)', fontFamily: 'DM Sans, sans-serif' }, 'C'),
                    React.createElement('path', { d: 'M20 39C14 42 10 48 10 54', stroke: 'rgba(255,255,255,0.35)', strokeWidth: '1.8', strokeLinecap: 'round', fill: 'none' }),
                    React.createElement('path', { d: 'M44 39C50 42 54 48 54 54', stroke: 'rgba(255,255,255,0.35)', strokeWidth: '1.8', strokeLinecap: 'round', fill: 'none' })
                  )
                ),
              },
              {
                route: 'due-diligence',
                bg: 'linear-gradient(140deg, #3730A3 0%, #4F46E5 100%)',
                accent: '#A5B4FC',
                label: 'Due Diligence',
                sub: 'Quero comprar com segurança',
                desc: 'Análise jurídica e técnica completa do imóvel antes de assinar. Verificação de documentos, certidões, ônus reais e laudo técnico — relatório em 48h.',
                benefits: [
                  'Análise de matrícula, escritura e certidões',
                  'Verificação de ônus, hipotecas e pendências',
                  'Laudo técnico de vistoria e avaliação de mercado',
                ],
                cta: 'Solicitar análise',
                icon: (
                  React.createElement('svg', { width: 64, height: 64, viewBox: '0 0 64 64', fill: 'none' },
                    React.createElement('rect', { x: '8', y: '6', width: '34', height: '44', rx: '4', fill: 'rgba(165,180,252,0.12)', stroke: 'rgba(165,180,252,0.65)', strokeWidth: '2' }),
                    React.createElement('path', { d: 'M34 6L42 14H34Z', fill: 'rgba(165,180,252,0.2)', stroke: 'rgba(165,180,252,0.5)', strokeWidth: '1.5', strokeLinejoin: 'round' }),
                    React.createElement('line', { x1: '15', y1: '22', x2: '34', y2: '22', stroke: 'rgba(165,180,252,0.5)', strokeWidth: '1.5', strokeLinecap: 'round' }),
                    React.createElement('line', { x1: '15', y1: '30', x2: '34', y2: '30', stroke: 'rgba(165,180,252,0.5)', strokeWidth: '1.5', strokeLinecap: 'round' }),
                    React.createElement('line', { x1: '15', y1: '38', x2: '24', y2: '38', stroke: 'rgba(165,180,252,0.5)', strokeWidth: '1.5', strokeLinecap: 'round' }),
                    React.createElement('path', { d: 'M26 36L30 40L37 33', stroke: 'rgba(165,180,252,0.95)', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }),
                    React.createElement('circle', { cx: '48', cy: '49', r: '11', fill: 'rgba(165,180,252,0.1)', stroke: 'rgba(165,180,252,0.75)', strokeWidth: '2.5' }),
                    React.createElement('line', { x1: '55.5', y1: '56', x2: '62', y2: '62', stroke: 'rgba(165,180,252,0.85)', strokeWidth: '3.5', strokeLinecap: 'round' })
                  )
                ),
              },
            ].map(perfil => (
              <div key={perfil.route} style={{
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(15,34,68,0.12)',
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                cursor: 'pointer',
              }}
              onClick={() => onNav(perfil.route)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(15,34,68,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,34,68,0.12)'; }}
              >
                {/* Header ilustrado */}
                <div style={{
                  background: perfil.bg,
                  padding: '40px 32px 36px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                  <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>{perfil.icon}</div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700,
                      color: '#fff', marginBottom: 6, letterSpacing: '0.04em' }}>{perfil.label}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,0.72)',
                      fontWeight: 500 }}>{perfil.sub}</div>
                  </div>
                </div>

                {/* Body */}
                <div style={{
                  background: '#fff', flex: 1, padding: '28px 28px 32px',
                  display: 'flex', flexDirection: 'column', gap: 18,
                }}>
                  <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{perfil.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {perfil.benefits.map(b => (
                      <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--navy)' }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                          background: perfil.accent + '22', color: perfil.accent,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 9,
                        }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); onNav(perfil.route); }} style={{
                      width: '100%', padding: '13px',
                      background: perfil.accent,
                      color: perfil.accent === '#C9960E' ? 'var(--navy)' : '#fff',
                      border: 'none', borderRadius: 10, fontFamily: 'DM Sans',
                      fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      transition: 'filter 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                    >{perfil.cta} →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSSOS SERVIÇOS — 4 banners */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold)">Plataforma completa</Eyebrow>
            <h2 style={{ margin: '8px 0 12px' }}>Nossos serviços</h2>
            <p style={{ color: 'var(--fg-2)', maxWidth: 540, margin: '0 auto', fontSize: 15 }}>
              Um ecossistema completo para proprietários, corretores, fotógrafos e quem busca comprar com inteligência.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              {
                id: 'proprietario',
                tag: 'Proprietário',
                title: 'Área do Proprietário',
                photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80',
                desc: 'Anuncie seu imóvel com curadoria editorial, IA de precificação e leads qualificados. Você escolhe o nível de envolvimento — da taxa fixa à venda completa.',
                bullets: [
                  'Taxa fixa R$ 197 ou comissão só no fechamento',
                  'IA para descrição, preço e orientação de fotos',
                  'Endereço privado — exibimos apenas o bairro',
                  'Leads qualificados direto no seu WhatsApp',
                ],
                cta: 'Anunciar meu imóvel',
                ctaVariant: 'accent',
                accent: 'var(--gold)',
              },
              {
                id: 'corretor-canal',
                tag: 'Corretor Parceiro',
                title: 'Portal do Corretor',
                photo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80',
                desc: 'Acesse leads qualificados, imóveis em Venda Completa (6%) e um CRM completo. Modelo freemium — comece grátis e escale conforme cresce.',
                bullets: [
                  'Leads qualificados com contato desbloqueado',
                  'Portfólio de imóveis exclusivos Venda Completa',
                  'Funil Kanban + ferramentas de IA',
                  'R$ 49,90/mês — cancele quando quiser',
                ],
                cta: 'Criar conta de corretor',
                ctaVariant: 'primary',
                accent: '#059669',
              },
              {
                id: 'fotografo-canal',
                tag: 'Fotografia & Mídias',
                title: 'Canal do Fotógrafo',
                photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
                desc: 'Fotógrafos credenciados pela curadoria VN Prime recebem jobs diretamente pela plataforma. HDR, drone, vídeo e tour virtual para imóveis de alto padrão.',
                bullets: [
                  'Jobs recorrentes em imóveis premium de BH',
                  'Portfólio digital no ecossistema VN Prime',
                  'Pagamento via FactorOne após entrega',
                  'Credenciamento por curadoria — qualidade garantida',
                ],
                cta: 'Quero ser fotógrafo VN Prime',
                ctaVariant: 'ghost',
                accent: '#B87333',
              },
              {
                id: 'consorcio',
                tag: 'Consórcio',
                title: 'Consórcio Imobiliário',
                photo: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80',
                desc: 'Compre o imóvel dos seus sonhos sem pagar juros. Grupos de consórcio com carta de crédito, contemplação por sorteio ou lance e acesso à vitrine VN Prime.',
                bullets: [
                  'Zero juros — apenas taxa de administração',
                  'Carta de crédito para qualquer imóvel VN Prime',
                  'Contemplação por sorteio ou lance antecipado',
                  'Curadoria de imóveis para quem já tem carta',
                ],
                cta: 'Conhecer o consórcio',
                ctaVariant: 'ghost',
                accent: '#1D4ED8',
              },
              {
                id: 'due-diligence',
                tag: 'Due Diligence',
                title: 'Due Diligence Imobiliária',
                photo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80',
                desc: 'Análise jurídica e técnica completa antes de comprar. Verificação de escritura, certidões negativas, ônus reais e laudo de vistoria para uma compra 100% segura.',
                bullets: [
                  'Análise de matrícula, escritura e certidões',
                  'Verificação de ônus, hipotecas e pendências',
                  'Laudo técnico de vistoria com fotos',
                  'Relatório executivo entregue em 48h',
                ],
                cta: 'Solicitar análise agora',
                ctaVariant: 'ghost',
                accent: '#6366F1',
              },
            ].map(s => (
              <div key={s.id} style={{
                borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 12px 48px rgba(15,34,68,0.10)',
                border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 64px rgba(15,34,68,0.16)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(15,34,68,0.10)'; }}
              >
                {/* Photo banner */}
                <div style={{
                  height: 200, position: 'relative',
                  backgroundImage: `url(${s.photo})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}>
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15,34,68,0.08) 0%, rgba(15,34,68,0.72) 100%)' }} />
                  {/* Accent stripe */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: s.accent }} />
                  <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.65)', marginBottom: 5 }}>{s.tag}</div>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                      {s.title}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 26px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {s.bullets.map(b => (
                      <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--navy)' }}>
                        <span style={{ color: s.accent, fontWeight: 700, flexShrink: 0, fontSize: 9, marginTop: 5 }}>&#9632;</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                    <Btn variant={s.ctaVariant} onClick={() => onNav(s.id)} fullWidth>
                      {s.cta}
                    </Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SearchField({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
      <span style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  fontFamily: 'DM Sans', fontSize: 14, color: 'var(--navy)',
  border: '1px solid var(--border)', borderRadius: 8,
  padding: '0.7rem 0.85rem', background: 'var(--cream)', outline: 'none',
  width: '100%',
};

Object.assign(window, { HomePage });
