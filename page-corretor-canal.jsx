// Canal do Corretor — landing page pré-login
function CorretorCanalPage({ onNav }) {
  return (
    <main style={{ background: 'var(--cream)' }}>
      <CorretorHero onNav={onNav} />
      <CorretorPassos />
      <CorretorFeatures />
      <CorretorKanban />
      <CorretorPlanos onNav={onNav} />
      <CorretorAreas />
      <CorretorBeneficios />
      <CorretorCtaFinal onNav={onNav} />
    </main>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function CorretorHero({ onNav }) {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0F2244 0%, #1E3560 60%, #0F2244 100%)',
      color: '#fff', padding: 'clamp(4rem, 8vw, 6rem) 0 clamp(3rem, 6vw, 4.5rem)',
    }}>
      <div style={{ position: 'absolute', top: -180, right: -180, width: 560, height: 560,
        background: 'radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 65%)',
        pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,150,14,0.12) 0%, transparent 65%)',
        pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1180px, 94vw)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 52, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(5,150,105,0.18)', border: '1px solid rgba(5,150,105,0.35)',
            borderRadius: 999, padding: '5px 14px', marginBottom: 18 }}>
            <span style={{ color: '#10B981', fontSize: 13 }}>🤝</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: '#10B981' }}>
              Canal · Corretor Parceiro
            </span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
            margin: '0 0 20px', lineHeight: 1.15 }}>
            Feche mais com{' '}
            <em style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic' }}>
              leads qualificados
            </em>{' '}e portfólio premium
          </h1>
          <p style={{ color: 'rgba(250,249,246,0.88)', fontSize: 16, lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>
            Acesse o portfólio VN Prime, receba leads pré-qualificados e gerencie seu pipeline
            em um único lugar. Freemium disponível — sem risco de entrada.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn variant="accent" size="lg" onClick={() => onNav('corretor')}>
              Acessar portal do corretor
            </Btn>
            <Btn variant="ghostOnNavy" size="lg" onClick={() => {
              document.getElementById('corretor-planos')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Ver planos ↓
            </Btn>
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 32, flexWrap: 'wrap' }}>
            {[['340+', 'corretores parceiros'], ['R$ 49,90', 'por mês · freemium disp.'], ['3%', 'comissão garantida']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, color: '#10B981', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(250,249,246,0.6)', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini CRM mockup */}
        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18, padding: 20, position: 'relative' }}>
          <div style={{ fontSize: 10.5, color: 'rgba(250,249,246,0.6)', letterSpacing: '0.1em',
            textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 14 }}>
            ▸ Dashboard · Pipeline
          </div>
          {[
            ['Leads novos hoje', '12', '#10B981', '↑ 3 vs ontem'],
            ['Em agendamento', '5', '#F59E0B', '2 confirmados'],
            ['Em proposta', '3', '#3B82F6', 'R$ 8,4M total'],
            ['Fechado este mês', 'R$ 4,2M', 'var(--gold)', '3 unidades'],
          ].map(([l, v, c, sub]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ color: 'rgba(250,249,246,0.85)', fontFamily: 'DM Sans', fontSize: 13.5 }}>{l}</div>
                <div style={{ color: 'rgba(250,249,246,0.45)', fontSize: 11, marginTop: 2 }}>{sub}</div>
              </div>
              <span style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
            {['Leads', 'Visitas', 'Propostas', 'Contratos'].map((s, i) => (
              <div key={s} style={{ flex: 1, borderRadius: 6, height: 6,
                background: i === 0 ? '#10B981' : i === 1 ? '#F59E0B' : i === 2 ? '#3B82F6' : 'var(--gold)',
                opacity: [1, 0.8, 0.6, 0.4][i] }} />
            ))}
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            {['Leads', 'Visitas', 'Propostas', 'Contratos'].map(s => (
              <div key={s} style={{ fontSize: 9.5, color: 'rgba(250,249,246,0.45)', fontFamily: 'DM Sans' }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COMO FUNCIONA ────────────────────────────────────────────────────────────
function CorretorPassos() {
  const passos = [
    { n: '01', icon: '🔑', color: '#059669',
      title: 'Crie sua conta gratuita',
      desc: 'Cadastro sem custo. No modelo freemium você já vê o portfólio, leads e ferramentas — sem precisar pagar nada para começar.' },
    { n: '02', icon: '🏠', color: 'var(--gold)',
      title: 'Acesse o portfólio VN Prime',
      desc: 'Imóveis em Venda Completa (6%) disponíveis para você intermediar. Fotos profissionais, descrição editorial e preço de mercado já prontos.' },
    { n: '03', icon: '📲', color: '#3B82F6',
      title: 'Receba leads qualificados',
      desc: 'Compradores que passaram pelo filtro VN Prime chegam direto para você. Contato completo, perfil e interesse já documentados.' },
    { n: '04', icon: '💰', color: '#B87333',
      title: 'Feche e receba 3%',
      desc: 'Comissão de 3% garantida sobre o valor da venda. Processamento pelo portal, sem negociação de percentual a cada negócio.' },
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow color="#059669">Jornada do corretor parceiro</Eyebrow>
          <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Como funciona a parceria VN Prime
          </h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 520, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Do cadastro ao recebimento da comissão — tudo pelo portal, sem burocracia.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {passos.map(p => (
            <div key={p.n} style={{ background: 'var(--cream)', borderRadius: 20, padding: '32px 26px',
              border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(15,34,68,0.06)' }}>
              <div style={{ position: 'absolute', top: 12, right: 18,
                fontFamily: 'Cinzel, serif', fontSize: 68, fontWeight: 700,
                color: 'rgba(15,34,68,0.04)', lineHeight: 1, userSelect: 'none' }}>{p.n}</div>
              <div style={{ width: 52, height: 52, borderRadius: 14,
                background: `${p.color === 'var(--gold)' ? '#C9960E' : p.color}18`, color: p.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 18 }}>{p.icon}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: p.color, marginBottom: 8 }}>Passo {p.n}</div>
              <h3 style={{ margin: '0 0 10px', fontSize: 19, lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
function CorretorFeatures() {
  const features = [
    { icon: '📋', title: 'Portfólio premium',
      desc: 'Acesso a imóveis curados em plano 6% — fotos profissionais, descrição editorial e preço validado pela curadoria VN Prime.' },
    { icon: '🎯', title: 'Leads pré-qualificados',
      desc: 'Compradores que passaram pela VN Prime: perfil, orçamento e interesse documentados. Você não perde tempo filtrando curiosos.' },
    { icon: '🤖', title: 'IA de descrição grátis',
      desc: 'Gere descrições editoriais para qualquer imóvel da sua carteira particular — o mesmo gerador da plataforma, sem custo adicional.' },
    { icon: '📊', title: 'Funil Kanban',
      desc: 'CRM integrado com pipeline visual: leads → agendamento → visita → proposta → contrato. Histórico completo de cada negociação.' },
    { icon: '📚', title: 'Material de marketing',
      desc: 'Templates prontos para Instagram, WhatsApp e apresentações. Personalizáveis com sua identidade e os imóveis da VN Prime.' },
    { icon: '⚖️', title: 'Compliance e documentação',
      desc: 'Modelos de contrato, CRECI verificado, suporte jurídico básico e checklist documental para cada etapa da venda.' },
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow color="#059669">Ferramentas pensadas para fechar mais</Eyebrow>
          <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Tudo que você precisa em um portal
          </h2>
        </div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 16, padding: '24px 22px',
              border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(15,34,68,0.05)',
              display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: 'rgba(5,150,105,0.1)', color: '#059669',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 6 }}>{f.title}</div>
                <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── KANBAN PREVIEW ───────────────────────────────────────────────────────────
function CorretorKanban() {
  const colunas = [
    { label: 'Leads novos', color: '#10B981', cards: [
      { nome: 'Carlos M.', imovel: 'Apto · Savassi', valor: 'R$ 2,1M', tempo: 'há 2h' },
      { nome: 'Ana L.', imovel: 'Casa · Nova Lima', valor: 'R$ 4,8M', tempo: 'há 5h' },
    ]},
    { label: 'Em visita', color: '#F59E0B', cards: [
      { nome: 'Pedro R.', imovel: 'Cobertura · Lourdes', valor: 'R$ 6,2M', tempo: 'amanhã 10h' },
    ]},
    { label: 'Em proposta', color: '#3B82F6', cards: [
      { nome: 'Família S.', imovel: 'Casa · Belvedere', valor: 'R$ 9,5M', tempo: '3 dias' },
    ]},
    { label: 'Contratos', color: 'var(--gold)', cards: [
      { nome: 'Ricardo F.', imovel: 'Apto · Funcionários', valor: 'R$ 1,9M', tempo: 'assinado' },
    ]},
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 52, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ color: '#3B82F6', fontSize: 13 }}>📊</span>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>
                CRM integrado · Funil Kanban
              </span>
            </div>
            <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Seu pipeline visual, tudo em um lugar
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
              Gerencie cada lead desde o primeiro contato até o contrato assinado.
              Arraste os cards entre colunas, adicione notas e acompanhe prazos — sem planilha, sem WhatsApp perdido.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Visualização Kanban em 4 etapas',
                'Histórico completo de contatos e visitas',
                'Alertas de follow-up automáticos',
                'Exportação para PDF e Excel',
                'Acesso mobile — funciona no celular'].map(x => (
                <div key={x} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--fg-2)' }}>
                  <span style={{ color: '#059669', flexShrink: 0 }}>✓</span>{x}
                </div>
              ))}
            </div>
          </div>

          {/* Kanban mockup */}
          <div style={{ background: 'var(--cream)', borderRadius: 18, padding: 16,
            border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(15,34,68,0.07)',
            overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 150px)', gap: 10, minWidth: 640 }}>
              {colunas.map(col => (
                <div key={col.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: col.color }} />
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>
                      {col.label}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {col.cards.map(c => (
                      <div key={c.nome} style={{ background: '#fff', borderRadius: 10, padding: '10px 12px',
                        border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(15,34,68,0.05)',
                        borderLeft: `3px solid ${col.color}` }}>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--navy)', marginBottom: 3 }}>{c.nome}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 3 }}>{c.imovel}</div>
                        <div style={{ fontFamily: 'Playfair Display', fontSize: 13, fontWeight: 700,
                          color: 'var(--gold)' }}>{c.valor}</div>
                        <div style={{ fontSize: 10, color: 'var(--fg-2)', marginTop: 4 }}>{c.tempo}</div>
                      </div>
                    ))}
                    <div style={{ border: '1px dashed var(--border)', borderRadius: 8,
                      height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, color: 'var(--border)', cursor: 'pointer' }}>+</div>
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

// ─── PLANOS ───────────────────────────────────────────────────────────────────
function CorretorPlanos({ onNav }) {
  const planos = [
    { id: 'free', label: 'Freemium', pct: 'Grátis', sub: 'sempre · sem cartão',
      accent: '#059669', featured: false,
      desc: 'Acesse e explore. Ao clicar em qualquer recurso pago, o upgrade é solicitado.',
      bullets: ['Visualizar portfólio VN Prime', 'Ver pipeline de leads', 'IA de descrição (3/mês)',
        'Funil Kanban (visualização)', '30 dias FactorOne grátis'],
      cta: 'Entrar grátis' },
    { id: 'pago', label: 'Corretor Parceiro', pct: 'R$ 49,90', sub: '/mês · cancele quando quiser',
      accent: 'var(--gold)', featured: true,
      desc: 'Acesso completo. Leads com contato, portfólio 6% completo, Kanban e materiais.',
      bullets: ['Tudo do plano grátis', 'Leads com contato completo (WhatsApp + e-mail)',
        'Portfólio completo de imóveis 6%', 'IA de descrição ilimitada', 'Funil Kanban completo',
        'Material de marketing personalizável', 'Suporte dedicado VN Prime'],
      cta: 'Assinar por R$ 49,90/mês' },
  ];

  return (
    <section id="corretor-planos" style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0',
      background: 'var(--gradient-navy-hero)', color: '#fff' }}>
      <div style={{ width: 'min(860px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <Eyebrow>Sem risco · comece grátis</Eyebrow>
          <h2 style={{ color: '#fff', margin: '8px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Planos do corretor parceiro
          </h2>
          <p style={{ color: 'rgba(250,249,246,0.8)', maxWidth: 500, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Entre grátis, explore e só pague quando quiser acessar leads com contato completo.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {planos.map(p => (
            <div key={p.id} style={{
              background: p.featured ? 'rgba(201,150,14,0.10)' : 'rgba(255,255,255,0.06)',
              border: p.featured ? '2px solid rgba(201,150,14,0.55)' : '1px solid rgba(255,255,255,0.13)',
              borderRadius: 20, padding: '30px 26px', position: 'relative',
              boxShadow: p.featured ? '0 20px 60px rgba(201,150,14,0.15)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {p.featured && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'DM Sans',
                  fontSize: 10.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '5px 18px', borderRadius: 999 }}>Acesso completo</div>
              )}
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--gold-soft)', marginBottom: 8 }}>{p.label}</div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 42, fontWeight: 700,
                  color: '#fff', lineHeight: 1, marginBottom: 3 }}>{p.pct}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,249,246,0.5)' }}>{p.sub}</div>
              </div>
              <p style={{ fontSize: 13.5, color: 'rgba(250,249,246,0.82)', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.bullets.map(b => (
                  <li key={b} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(250,249,246,0.88)' }}>
                    <span style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }}>✓</span>{b}
                  </li>
                ))}
              </ul>
              <Btn variant={p.featured ? 'accent' : 'ghostOnNavy'}
                onClick={() => onNav('corretor')} style={{ marginTop: 'auto' }}>
                {p.cta}
              </Btn>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(250,249,246,0.4)', marginTop: 20 }}>
          Primeira mensalidade só após sua primeira visita agendada pelo portal.
        </p>
      </div>
    </section>
  );
}

// ─── ÁREAS ───────────────────────────────────────────────────────────────────
function CorretorAreas() {
  const grupos = [
    { grupo: 'BH — Centro-Sul', cor: '#4F46E5', areas: ['Savassi', 'Funcionários', 'Lourdes', 'Serra', 'Anchieta', 'Santo Agostinho'] },
    { grupo: 'BH — Oeste',      cor: '#0891B2', areas: ['Buritis', 'Estoril', 'Nova Suíça', 'Gutierrez', 'Santo Antônio'] },
    { grupo: 'BH — Pampulha',   cor: '#059669', areas: ['Pampulha', 'Santa Lúcia', 'Castelo', 'Itapoã', 'Universitário'] },
    { grupo: 'Vetor Sul',        cor: '#0F766E', areas: ['Nova Lima', 'Vale do Sereno', 'Alphaville BH', 'Brumadinho'] },
    { grupo: 'Vetor Norte',      cor: '#6D28D9', areas: ['Lagoa Santa', 'Santa Luzia', 'Vespasiano', 'Pedro Leopoldo'] },
    { grupo: 'BH — Venda Nova',  cor: '#D97706', areas: ['Venda Nova', 'Jardim Leblon', 'São João Batista'] },
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <Eyebrow color="#059669">76+ bairros · Grande BH</Eyebrow>
          <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            Áreas de cobertura VN Prime
          </h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 500, margin: '0 auto', fontSize: 15 }}>
            Você seleciona quais bairros quer atender no seu perfil — leads filtrados pela sua área de atuação.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {grupos.map(g => (
            <div key={g.grupo} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px',
              border: '1px solid var(--border)', borderLeft: `4px solid ${g.cor}` }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: g.cor, marginBottom: 10 }}>{g.grupo}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {g.areas.map(a => (
                  <span key={a} style={{ fontFamily: 'DM Sans', fontSize: 12, padding: '3px 10px',
                    borderRadius: 999, background: `${g.cor}12`, color: g.cor,
                    fontWeight: 500, border: `1px solid ${g.cor}28` }}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BENEFÍCIOS ───────────────────────────────────────────────────────────────
function CorretorBeneficios() {
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: '#fff',
      borderTop: '1px solid var(--border)' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
        {[
          { icon: '📊', title: '30 dias FactorOne grátis',
            desc: 'Gestão financeira pessoal inclusa para todos os corretores cadastrados, independente do plano.' },
          { icon: '🎓', title: 'Capacitação mensal',
            desc: 'Workshops sobre alto padrão, técnicas de fechamento, finanças imobiliárias e ferramentas VN Prime.' },
          { icon: '🤝', title: 'Split transparente',
            desc: '3% garantidos em cada venda. Percentual definido antes do primeiro contato — sem renegociação.' },
          { icon: '🔒', title: 'CRECI verificado',
            desc: 'Sua credencial é validada na entrada. Compradores sabem que estão falando com corretores certificados.' },
        ].map(b => (
          <div key={b.title} style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{b.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 8 }}>{b.title}</div>
            <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA FINAL ────────────────────────────────────────────────────────────────
function CorretorCtaFinal({ onNav }) {
  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5rem) 0',
      background: 'linear-gradient(135deg, #0F2244 0%, #1E3560 100%)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ width: 'min(720px, 94vw)', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 20px',
          background: 'rgba(5,150,105,0.2)', border: '2px solid rgba(5,150,105,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🤝</div>
        <h2 style={{ color: '#fff', margin: '0 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          Pronto para entrar na rede VN Prime?
        </h2>
        <p style={{ color: 'rgba(250,249,246,0.82)', fontSize: 15, lineHeight: 1.75,
          maxWidth: 480, margin: '0 auto 28px' }}>
          Crie sua conta grátis e comece a explorar. Quando quiser acesso completo aos leads, o upgrade leva menos de 2 minutos.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn variant="accent" size="lg" onClick={() => onNav('corretor')}>
            Entrar grátis no portal
          </Btn>
          <Btn variant="ghostOnNavy" size="lg" onClick={() => onNav('vender')}>
            Ver outros perfis
          </Btn>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(250,249,246,0.4)', marginTop: 18 }}>
          Sem cartão de crédito · freemium disponível · cancele quando quiser
        </p>
      </div>
    </section>
  );
}

Object.assign(window, { CorretorCanalPage });
