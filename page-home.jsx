// Pages: Home, SearchResults, PropertyDetail

// ============================================================
// HOME — ImovelWeb-style hero search + featured + neighborhoods
// ============================================================
function HomePage({ onNav, density, accentMode }) {
  const [op, setOp] = useState('compra');
  const [filters, setFilters] = useState({ q: '', tipo: '', valorMax: '' });
  const [heroIdx, setHeroIdx] = useState(0);
  const heroPhotos = [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=2400&q=85',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2400&q=85',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2400&q=85',
  ];
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroPhotos.length), 7000);
    return () => clearInterval(t);
  }, []);

  const featured = window.VN_CATALOG.filter(l => l.isFeatured).slice(0, 4);

  const onSearch = () => onNav('busca', { op, ...filters });

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
            Curadoria de residências em Nova Lima, Savassi, Belvedere, Vila da Serra e Alphaville.
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
            <SearchField label="Onde">
              <input type="text" placeholder="Bairro, cidade ou código (ex.: Savassi, VN-2048)"
                value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                style={inputStyle} />
            </SearchField>
            <SearchField label="Tipo">
              <select value={filters.tipo} onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                style={inputStyle}>
                <option value="">Todos</option>
                <option>Apartamento</option><option>Casa</option>
                <option>Cobertura</option><option>Studio</option>
              </select>
            </SearchField>
            <SearchField label="Valor até">
              <select value={filters.valorMax} onChange={(e) => setFilters({ ...filters, valorMax: e.target.value })}
                style={inputStyle}>
                <option value="">Sem limite</option>
                <option value="2000000">R$ 2 mi</option>
                <option value="5000000">R$ 5 mi</option>
                <option value="10000000">R$ 10 mi</option>
              </select>
            </SearchField>
            <Btn variant="accent" size="lg" onClick={onSearch}>
              <span style={{ fontSize: 16 }}>⌕</span> Buscar
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

      {/* COMO FUNCIONA */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 52px' }}>
            <Eyebrow color="var(--gold)">O jeito VN Prime · transparência total</Eyebrow>
            <h2 style={{ margin: '8px 0 16px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
              Como funciona o processo de venda
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              Somos um portal imobiliário de alto padrão com um diferencial único: você escolhe o nível de suporte. Do cadastro até a entrega das chaves.
            </p>
          </div>

          {/* 3 passos */}
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 60 }}>
            {[
              {
                step: '01',
                icon: '🏠',
                title: 'Cadastre seu imóvel',
                desc: 'Preencha os dados em minutos. Nossa IA gera a descrição editorial, sugere preço de mercado e orienta você nas fotos — ou contrate um fotógrafo credenciado VN Prime.',
              },
              {
                step: '02',
                icon: '📋',
                title: 'Escolha como quer vender',
                desc: 'Venda Direta (R$ 197 fixo), Venda Assistida (3%) ou Venda Completa (6%). Em todos: comissão zero se não vender. Sem surpresas, sem letras miúdas.',
              },
              {
                step: '03',
                icon: '🤝',
                title: 'Negocie e feche negócio',
                desc: 'Leads qualificados chegam direto no seu WhatsApp. Se quiser, um corretor parceiro VN Prime assume visitas, negociação e toda a documentação.',
              },
            ].map(s => (
              <div key={s.step} style={{
                background: 'var(--cream)', borderRadius: 20, padding: '36px 30px',
                position: 'relative', overflow: 'hidden', border: '1px solid var(--border)',
                boxShadow: '0 4px 24px rgba(15,34,68,0.06)',
              }}>
                <div style={{
                  position: 'absolute', top: 16, right: 20,
                  fontFamily: 'Cinzel, serif', fontSize: 72, fontWeight: 700,
                  color: 'rgba(15,34,68,0.04)', lineHeight: 1, userSelect: 'none',
                }}>{s.step}</div>
                <div style={{ fontSize: 40, marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: 20, color: 'var(--navy)',
                  margin: '0 0 12px', fontWeight: 600 }}>{s.title}</h3>
                <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* VENDA ASSISTIDA — diferencial */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderRadius: 24, overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(15,34,68,0.14)',
          }}>
            <div style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&q=85)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              minHeight: 380, position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(15,34,68,0.22) 0%, rgba(15,34,68,0.06) 100%)' }} />
            </div>
            <div style={{
              background: 'var(--navy)', padding: 'clamp(36px, 5vw, 52px) clamp(28px, 4vw, 44px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20,
            }}>
              <Eyebrow>Diferencial exclusivo · Novo no mercado</Eyebrow>
              <h2 style={{ color: '#fff', margin: 0, fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)', lineHeight: 1.2 }}>
                Venda Assistida — o modelo que ninguém mais oferece
              </h2>
              <p style={{ color: 'rgba(250,249,246,0.82)', fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>
                Você conduz as visitas e a negociação. A VN Prime apoia com IA, curadoria editorial e BOOSTER de impulsionamento. Paga apenas{' '}
                <strong style={{ color: '#fff' }}>3% quando vender</strong> — zero se não vender.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Você controla o processo — VN Prime apoia',
                  '3% sobre o valor de venda · zero se não vender',
                  'Leads qualificados direto no seu WhatsApp',
                  'IA para descrição, precificação e orientação de fotos',
                  'BOOSTER de impulsionamento do anúncio',
                  '30 dias grátis FactorOne (gestão financeira PF)',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                    fontSize: 13.5, color: 'rgba(250,249,246,0.88)' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
                <Btn variant="accent" onClick={() => onNav('anunciar')}>Começar com 3%</Btn>
                <Btn variant="ghostOnNavy" onClick={() => onNav('vender')}>Ver todas as modalidades</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS DE VENDA — 3 modalidades detalhadas */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--gradient-navy-hero)', color: '#fff' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>Transparência total · sem letras miúdas</Eyebrow>
            <h2 style={{ color: '#fff', margin: '8px 0 16px' }}>Você escolhe como quer vender</h2>
            <p style={{ color: 'rgba(250,249,246,0.8)', maxWidth: 560, margin: '0 auto', fontSize: 15 }}>
              Três modalidades com níveis distintos de envolvimento. Em todos: 30 dias grátis de gestão financeira FactorOne e endereço privado na vitrine.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

            {/* VENDA DIRETA */}
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 10 }}>Venda Direta</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'Playfair Display', fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1 }}>R$ 197</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(250,249,246,0.5)', marginTop: 4 }}>taxa fixa · 90 dias de anúncio · sem comissão</div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(250,249,246,0.85)', lineHeight: 1.6, margin: 0 }}>
                Você publica, conduz e fecha. Paga uma taxa fixa para listar e fica com 100% do valor da venda. Sem comissão sobre o negócio.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Anúncio na vitrine VN Prime por 90 dias',
                  'IA para criar a descrição do imóvel',
                  'Tutorial de fotos + filtro editorial',
                  'Leads direto no seu WhatsApp',
                  '30 dias grátis FactorOne (gestão financeira)',
                  'Pacotes de foto disponíveis como add-on',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(250,249,246,0.9)' }}>
                    <span style={{ color: 'var(--gold-soft)', marginTop: 1, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Btn variant="ghostOnNavy" onClick={() => onNav('anunciar')} style={{ marginTop: 'auto' }}>
                Anunciar por R$ 197
              </Btn>
            </div>

            {/* 3% VENDA ASSISTIDA — destaque */}
            <div style={{
              background: 'rgba(201,150,14,0.12)', border: '2px solid rgba(201,150,14,0.55)',
              borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 16,
              position: 'relative', boxShadow: '0 20px 60px rgba(201,150,14,0.15)',
            }}>
              <div style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'DM Sans',
                fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '5px 18px', borderRadius: 999,
              }}>Mais escolhido</div>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 10 }}>Venda Assistida</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1 }}>3%</span>
                  <span style={{ fontSize: 13, color: 'rgba(250,249,246,0.6)' }}>sobre o valor da venda</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(250,249,246,0.85)', lineHeight: 1.6, margin: 0 }}>
                Você conduz as visitas e a negociação. A VN Prime apoia com IA, curadoria e distribuição. Paga apenas quando vender.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Tudo do plano Venda Direta',
                  'Suporte da curadoria VN Prime',
                  'Gestão financeira FactorOne 30 dias grátis',
                  'BOOSTER para impulsionar o anúncio',
                  'Pacotes de foto disponíveis como add-on',
                  'Comissão 0% se não vender',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(250,249,246,0.9)' }}>
                    <span style={{ color: 'var(--gold)', marginTop: 1, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Btn variant="accent" onClick={() => onNav('anunciar')} style={{ marginTop: 'auto' }}>
                Começar com 3%
              </Btn>
            </div>

            {/* 6% VENDA COMPLETA */}
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 10 }}>Venda Completa</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1 }}>6%</span>
                  <span style={{ fontSize: 13, color: 'rgba(250,249,246,0.6)' }}>sobre o valor da venda</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(250,249,246,0.85)', lineHeight: 1.6, margin: 0 }}>
                A VN Prime assume tudo. Um corretor parceiro dedicado conduz visitas, negociação e documentação. Divisão: 3% corretor + 3% VN Prime.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Tudo do plano 3% Assistida',
                  'Corretor parceiro VN Prime dedicado',
                  'Visitas e negociação coordenadas',
                  'Suporte jurídico e documental',
                  'Gestão financeira FactorOne 30 dias grátis',
                  'Pacotes de foto disponíveis como add-on',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(250,249,246,0.9)' }}>
                    <span style={{ color: 'var(--gold-soft)', marginTop: 1, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Btn variant="ghostOnNavy" onClick={() => onNav('anunciar')} style={{ marginTop: 'auto' }}>
                Começar com 6%
              </Btn>
            </div>

          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(250,249,246,0.5)', marginTop: 32 }}>
            Em todos os planos: endereço completo permanece privado — a vitrine exibe apenas o bairro.
          </p>
        </div>
      </section>

      {/* PACOTES DE MÍDIA */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow color="var(--gold)">Fotógrafos credenciados VN Prime</Eyebrow>
            <h2 style={{ margin: '8px 0 12px' }}>Pacotes de mídia profissional</h2>
            <p style={{ color: 'var(--fg-2)', maxWidth: 520, margin: '0 auto', fontSize: 15 }}>
              Add-on disponível em qualquer plano. Contratados diretamente pela plataforma com fotógrafos credenciados pela curadoria VN Prime.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {[
              { icon: '📸', nome: 'Fotos', desc: 'Fotografia HDR profissional de todos os ambientes', preco: 'R$ 899', tag: null },
              { icon: '🚁', nome: 'Drone', desc: 'Imagens aéreas e perspectiva do entorno e condomínio', preco: 'R$ 1.299', tag: null },
              { icon: '🎬', nome: 'Foto + Vídeo', desc: 'Fotografia HDR e vídeo cinematográfico do imóvel', preco: 'R$ 1.999', tag: null },
              { icon: '⭐', nome: 'Completo', desc: 'Foto + Vídeo + Drone — cobertura editorial total', preco: 'R$ 2.999', tag: 'Melhor custo-benefício' },
            ].map(p => (
              <div key={p.nome} style={{
                background: p.tag ? 'linear-gradient(145deg, rgba(201,150,14,0.08), #fff)' : 'var(--surface)',
                border: p.tag ? '2px solid rgba(201,150,14,0.4)' : '1px solid var(--border)',
                borderRadius: 16, padding: '28px 24px',
                boxShadow: p.tag ? '0 12px 40px rgba(201,150,14,0.12)' : 'var(--shadow-card)',
                position: 'relative', display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {p.tag && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'DM Sans',
                    fontSize: 10.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                  }}>{p.tag}</div>
                )}
                <div style={{ fontSize: 32 }}>{p.icon}</div>
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 4 }}>
                    {p.nome}
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--fg-2)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 700, color: 'var(--gold)', marginTop: 4 }}>
                  {p.preco}
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--fg-2)', margin: 0 }}>
                  Agendado após cadastro · fotógrafo credenciado VN Prime
                </p>
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
