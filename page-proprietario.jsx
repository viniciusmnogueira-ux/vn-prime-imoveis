// Canal do Proprietário — landing page pré-login
// Apresenta tudo: tutorial de fotos, IA de imagem, gerador de descrição,
// BOOSTER, card social, fotógrafo e planos. CTA abre auth → anunciar.

function ProprietarioPage({ onNav }) {
  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Back to Vender */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
          <button onClick={() => onNav('vender')} style={{
            background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', gap: 7, fontFamily: 'DM Sans', fontSize: 13,
            fontWeight: 600, color: 'var(--fg-2)', padding: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Voltar para perfis
          </button>
        </div>
      </div>
      <ProprHero onNav={onNav} />
      <ProprPassos />
      <ProprTutorialFotos />
      <ProprIAImagem />
      <ProprIADescricao />
      <ProprBooster onNav={onNav} />
      <ProprCardSocial />
      <ProprFotografo />
      <ProprPlanos onNav={onNav} />
      <ProprSeguranca />
      <ProprCtaFinal onNav={onNav} />
    </main>
  );
}

// ─── 1. HERO ─────────────────────────────────────────────────────────────────
function ProprHero({ onNav }) {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--gradient-navy-hero)', color: '#fff',
      padding: 'clamp(4rem, 8vw, 6rem) 0 clamp(3rem, 6vw, 4.5rem)',
    }}>
      <div style={{ position: 'absolute', top: -200, right: -200, width: 640, height: 640,
        background: 'radial-gradient(circle, rgba(201,150,14,0.28) 0%, transparent 65%)',
        pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -120, left: -120, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,150,14,0.12) 0%, transparent 65%)',
        pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1180px, 94vw)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 52, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,150,14,0.18)', border: '1px solid rgba(201,150,14,0.35)',
            borderRadius: 999, padding: '5px 14px', marginBottom: 18 }}>
            <span style={{ color: 'var(--gold-soft)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase' }}>Área do Proprietário</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
            margin: '0 0 20px', lineHeight: 1.15 }}>
            Venda seu imóvel com{' '}
            <em style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text',
              backgroundClip: 'text', color: 'transparent', fontStyle: 'italic' }}>
              inteligência e autonomia
            </em>
          </h1>
          <p style={{ color: 'rgba(250,249,246,0.88)', fontSize: 16, lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>
            Anuncie na vitrine VN Prime com taxa fixa de R$ 197 ou 3% só quando vender.
            IA para fotos, descrição e impulsionamento. Você no controle — nós nos bastidores.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn variant="accent" size="lg" onClick={() => onNav('anunciar')}>
              Anunciar meu imóvel
            </Btn>
            <Btn variant="ghostOnNavy" size="lg" onClick={() => {
              document.getElementById('propr-passos')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Como funciona ↓
            </Btn>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
            {[['R$ 197', 'ou 3% sobre venda'], ['30 dias', 'FactorOne grátis'], ['24h', 'aprovação curadoria']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, color: 'var(--gold-soft)', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(250,249,246,0.6)', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mockup card */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            boxShadow: '0 32px 80px rgba(15,34,68,0.30)',
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ height: 200,
              backgroundImage: 'url(https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                <Pill tone="featured">★ Destaque</Pill>
                <Pill tone="new">Novo</Pill>
              </div>
              {/* AI badge overlay */}
              <div style={{ position: 'absolute', bottom: 10, right: 10,
                background: 'rgba(15,34,68,0.88)', backdropFilter: 'blur(6px)',
                borderRadius: 8, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--gold-soft)', fontSize: 11 }}>✦</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>
                  IA APLICADA
                </span>
              </div>
            </div>
            <div style={{ padding: '16px 20px 20px' }}>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 700, color: 'var(--gold)', lineHeight: 1, marginBottom: 4 }}>
                R$ 1.890.000
              </div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 16, color: 'var(--navy)', fontWeight: 600, marginBottom: 6 }}>
                Apartamento panorâmico · Lourdes
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginBottom: 10 }}>
                ◉ Lourdes, Belo Horizonte
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: 'var(--fg-2)' }}>
                {[['142', 'm²'], ['3', 'qtos'], ['2', 'suítes'], ['2', 'vagas']].map(([v,l]) => (
                  <span key={l}><b style={{ color: 'var(--navy)' }}>{v}</b> {l}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Floating badge */}
          <div style={{ position: 'absolute', top: -16, right: -16,
            background: 'var(--gold)', borderRadius: 14, padding: '12px 16px',
            boxShadow: '0 8px 28px rgba(201,150,14,0.5)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', fontFamily: 'Playfair Display', lineHeight: 1 }}>3%</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--navy)', marginTop: 3 }}>só no sucesso</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. PASSOS — como funciona ────────────────────────────────────────────────
function ProprPassos() {
  const passos = [
    { n: '01', icon: '📋', color: '#4F46E5',
      title: 'Cadastre o imóvel',
      desc: 'Preencha os dados em minutos. Bairro, tipo, área, quartos e preço. A VN Prime não exibe o endereço completo — apenas o bairro na vitrine.' },
    { n: '02', icon: '📸', color: 'var(--gold)',
      title: 'Adicione as fotos',
      desc: 'Tire as fotos com o celular seguindo nosso tutorial. A IA ajusta luz, brilho e nitidez automaticamente. Ou contrate um fotógrafo credenciado.' },
    { n: '03', icon: '✦', color: '#059669',
      title: 'A IA escreve por você',
      desc: 'Nossa IA gera 3 versões de descrição editorial baseadas nos dados do imóvel. Escolha a que mais combina e publique em segundos.' },
    { n: '04', icon: '🤝', color: '#B87333',
      title: 'Receba leads e venda',
      desc: 'Compradores qualificados chegam direto no seu WhatsApp. Você conduz as visitas — ou um corretor parceiro VN Prime assume tudo no plano 6%.' },
  ];

  return (
    <section id="propr-passos" style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <Eyebrow color="var(--gold)">Simples do começo ao fim</Eyebrow>
          <h2 style={{ margin: '8px 0 16px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Como funciona o processo de venda
          </h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 540, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Quatro passos para ter seu imóvel na vitrine VN Prime. Tudo feito pelo portal — sem sair de casa.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {passos.map((p, i) => (
            <div key={p.n} style={{
              background: 'var(--cream)', borderRadius: 20, padding: '32px 26px',
              border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(15,34,68,0.06)',
            }}>
              <div style={{
                position: 'absolute', top: 12, right: 18,
                fontFamily: 'Cinzel, serif', fontSize: 68, fontWeight: 700,
                color: 'rgba(15,34,68,0.04)', lineHeight: 1, userSelect: 'none',
              }}>{p.n}</div>
              {/* Connector line */}
              {i < passos.length - 1 && (
                <div style={{ position: 'absolute', top: 40, right: -10,
                  width: 20, height: 2, background: 'var(--border)', zIndex: 2,
                  display: 'none' }} />
              )}
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${p.color}18`, color: p.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 18,
              }}>{p.icon}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: p.color, marginBottom: 8 }}>Passo {p.n}</div>
              <h3 style={{ margin: '0 0 10px', fontSize: 19, lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 3. TUTORIAL DE FOTOS ─────────────────────────────────────────────────────
const FOTO_DICAS = [
  { icon: '☀️', title: 'Luz natural é rei', cor: '#F59E0B',
    desc: 'Abra todas as janelas e apague as luzes artificiais. Fotografe entre 9h e 16h para aproveitar a luz do dia sem sombras duras.',
    do_: ['Janelas abertas', 'Hora certa do dia', 'Luzes apagadas'],
    dont: ['Flash direto', 'Contra-luz', 'Luz amarela do teto'] },
  { icon: '📐', title: 'Ângulo certo', cor: '#4F46E5',
    desc: 'Posicione o celular a 1,20m do chão, no canto do ambiente. Mantenha o celular na horizontal e capture o máximo do espaço.',
    do_: ['Celular horizontal', 'Canto da sala', '1,20m de altura'],
    dont: ['Foto na vertical', 'Centro do cômodo', 'Muito alto ou baixo'] },
  { icon: '🛋️', title: 'Organize antes', cor: '#059669',
    desc: 'Retire objetos pessoais, fotos e documentos visíveis. Coloque almofadas simétricas, feche tampas de vaso sanitário e organize bancadas.',
    do_: ['Ambiente limpo', 'Almofadas organizadas', 'Superfícies livres'],
    dont: ['Objetos pessoais', 'Cama bagunçada', 'Lixo aparente'] },
  { icon: '🔆', title: 'Capa que converte', cor: '#B87333',
    desc: 'A primeira foto define o clique. Use sempre o ângulo mais amplo e bem iluminado — sala com varanda ou cozinha com ilha funcionam melhor.',
    do_: ['Sala + varanda', 'Cozinha ampla', 'Vista externa'],
    dont: ['Quarto pequeno', 'Banheiro de serviço', 'Corredor'] },
  { icon: '🚪', title: 'Sequência certa', cor: '#7C3AED',
    desc: 'Siga uma ordem lógica: entrada → sala → cozinha → quartos (master primeiro) → banheiros → área de serviço → área externa.',
    do_: ['Ordem lógica', 'Todos os ambientes', 'Áreas externas por último'],
    dont: ['Ordem aleatória', 'Pular cômodos', 'Fotos repetidas'] },
];

const FOTO_FOTOS = [
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&q=80',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=700&q=80',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=700&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80',
];

function ProprTutorialFotos() {
  const [ativa, setAtiva] = React.useState(0);

  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: '#fff',
      borderTop: '1px solid var(--border)' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Eyebrow color="var(--gold)">Guia exclusivo VN Prime</Eyebrow>
          <h2 style={{ margin: '8px 0 10px', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}>
            Tutorial de fotos que vendem
          </h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 520, margin: '0 auto', fontSize: 15, lineHeight: 1.6 }}>
            Imóveis com fotos bem feitas vendem até 4× mais rápido. Tire fotos profissionais com o celular.
          </p>
        </div>

        {/* Half + Half layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>

          {/* Left: compact tip list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FOTO_DICAS.map((d, i) => (
              <button key={i} onClick={() => setAtiva(i)} style={{
                background: ativa === i ? `${d.cor}10` : '#fff',
                border: `1.5px solid ${ativa === i ? d.cor : 'var(--border)'}`,
                borderRadius: 14, padding: '14px 18px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.18s', boxShadow: ativa === i ? `0 4px 18px ${d.cor}20` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: ativa === i ? 10 : 0 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                    background: `${d.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18 }}>{d.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase', color: d.cor, marginBottom: 2 }}>
                      Dica {String(i+1).padStart(2,'0')}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--navy)' }}>{d.title}</div>
                  </div>
                  <span style={{ color: 'var(--fg-2)', fontSize: 14, transition: 'transform 0.2s',
                    transform: ativa === i ? 'rotate(90deg)' : 'none' }}>›</span>
                </div>
                {ativa === i && (
                  <div>
                    <p style={{ color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.7, margin: '0 0 12px' }}>{d.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#15803d', marginBottom: 6 }}>✓ Faça</div>
                        {d.do_.map(x => (
                          <div key={x} style={{ fontSize: 12.5, color: '#15803d', marginBottom: 3, display: 'flex', gap: 5 }}>
                            <span style={{ flexShrink: 0 }}>✓</span>{x}
                          </div>
                        ))}
                      </div>
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#dc2626', marginBottom: 6 }}>✕ Evite</div>
                        {d.dont.map(x => (
                          <div key={x} style={{ fontSize: 12.5, color: '#dc2626', marginBottom: 3, display: 'flex', gap: 5 }}>
                            <span style={{ flexShrink: 0 }}>✕</span>{x}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Right: photo gallery */}
          <div style={{ position: 'sticky', top: 90 }}>
            {/* Main photo */}
            <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 12,
              boxShadow: '0 16px 48px rgba(15,34,68,0.15)', position: 'relative' }}>
              <img src={FOTO_FOTOS[ativa]} alt="Foto de exemplo"
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block',
                  transition: 'opacity 0.3s' }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,34,68,0.6) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', top: 14, left: 14,
                background: 'rgba(15,34,68,0.75)', backdropFilter: 'blur(8px)',
                borderRadius: 99, padding: '5px 14px',
                fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: FOTO_DICAS[ativa]?.cor || 'var(--gold)' }}>
                Dica {String(ativa+1).padStart(2,'0')} · {FOTO_DICAS[ativa]?.title}
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16,
                fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, color: '#fff' }}>
                Exemplo de boa foto
              </div>
            </div>
            {/* Thumbnail strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {FOTO_FOTOS.map((src, i) => (
                <div key={i} onClick={() => setAtiva(i)} style={{
                  borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${ativa === i ? 'var(--gold)' : 'transparent'}`,
                  transition: 'border-color 0.15s', opacity: ativa === i ? 1 : 0.65,
                }}>
                  <img src={src} alt={`Dica ${i+1}`}
                    style={{ width: '100%', height: 44, objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. IA DE IMAGEM — tratamento automático ──────────────────────────────────
function ProprIAImagem() {
  const [processando, setProcessando] = React.useState(false);
  const [processado, setProcessado] = React.useState(false);

  const simularProcessamento = () => {
    if (processado) { setProcessado(false); return; }
    setProcessando(true);
    setTimeout(() => { setProcessando(false); setProcessado(true); }, 2200);
  };

  const ANTES = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=50';
  const DEPOIS = 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=90';

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 52, alignItems: 'center' }}>

        {/* Visual side */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(15,34,68,0.16)' }}>
            {/* Antes */}
            <div style={{ position: 'relative' }}>
              <div style={{ height: 260, backgroundImage: `url(${ANTES})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: processado ? 'brightness(0.68) saturate(0.6) contrast(0.85)' : 'brightness(0.68) saturate(0.6) contrast(0.85)',
                transition: 'filter 0.8s ease' }} />
              <div style={{ position: 'absolute', bottom: 8, left: 8,
                background: 'rgba(15,34,68,0.88)', borderRadius: 6, padding: '3px 10px',
                fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>
                ANTES
              </div>
            </div>
            {/* Depois */}
            <div style={{ position: 'relative' }}>
              {processando ? (
                <div style={{ height: 260, background: 'rgba(15,34,68,0.9)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999,
                    border: '3px solid rgba(201,150,14,0.25)', borderTopColor: 'var(--gold)',
                    animation: 'spin 0.8s linear infinite' }} />
                  <div style={{ color: 'var(--gold-soft)', fontSize: 11.5, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase' }}>IA processando</div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <div style={{ height: 260,
                    backgroundImage: `url(${processado ? DEPOIS : ANTES})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: processado ? 'brightness(1.08) saturate(1.25) contrast(1.06)' : 'brightness(0.68) saturate(0.6) contrast(0.85)',
                    transition: 'filter 0.8s ease, background-image 0.3s' }} />
                  {processado && (
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'transparent',
                      animation: 'iaFlash 0.4s ease-out' }} />
                  )}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 8, right: 8,
                background: processado ? 'rgba(5,150,105,0.95)' : 'rgba(15,34,68,0.88)',
                borderRadius: 6, padding: '3px 10px',
                fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '0.08em',
                transition: 'background 0.4s' }}>
                {processado ? '✓ IA APLICADA' : 'DEPOIS'}
              </div>
              <style>{`@keyframes iaFlash { from { background: rgba(201,150,14,0.3); } to { background: transparent; } }`}</style>
            </div>
          </div>

          {/* Action button */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={simularProcessamento} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              background: processado ? 'rgba(5,150,105,0.1)' : 'rgba(201,150,14,0.12)',
              border: processado ? '1px solid rgba(5,150,105,0.3)' : '1px solid rgba(201,150,14,0.3)',
              borderRadius: 999, padding: '8px 18px',
              fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 700,
              color: processado ? '#059669' : 'var(--navy)', transition: 'all 0.3s',
            }}>
              {processando ? '⏳ Processando...' : processado ? '↺ Ver foto original' : '✦ Simular tratamento IA'}
            </button>
          </div>

          {/* Floating stats */}
          <div style={{ position: 'absolute', top: -14, right: -14,
            background: '#fff', borderRadius: 12, padding: '10px 16px',
            boxShadow: '0 8px 28px rgba(15,34,68,0.14)', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>4×</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--fg-2)', textAlign: 'center' }}>mais cliques</div>
          </div>
        </div>

        {/* Text side */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,150,14,0.1)', border: '1px solid rgba(201,150,14,0.25)',
            borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
            <span style={{ color: 'var(--gold)', fontSize: 13 }}>✦</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>
              IA de imagem · automático
            </span>
          </div>
          <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            Fotos tiradas no celular. Resultado de fotógrafo profissional.
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
            Quando você envia suas fotos, nossa IA aplica automaticamente um tratamento editorial:
            ajuste de exposição, balanço de branco, saturação, nitidez e perspectiva — tudo calibrado
            para o padrão VN Prime.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {[
              ['Exposição', 'Corrige fotos escuras ou estouradas automaticamente'],
              ['Balanço de branco', 'Remove tons amarelados de luz artificial'],
              ['Nitidez', 'Detalha texturas de madeira, pedra e tecido'],
              ['Perspectiva', 'Endereiça linhas tortas sem distorção'],
              ['Saturação editorial', 'Cores vivas sem artificialidade'],
            ].map(([t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 22, height: 22, borderRadius: 5,
                  background: 'rgba(201,150,14,0.15)', color: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>{t}</span>
                  <span style={{ color: 'var(--fg-2)', fontSize: 13 }}> — {d}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--fg-2)', fontStyle: 'italic', margin: 0 }}>
            ✦ O tratamento é aplicado automaticamente ao publicar. Você sempre vê o antes e o depois antes de confirmar.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 5. IA DE DESCRIÇÃO ───────────────────────────────────────────────────────
const DEMO_PITCHES = [
  { label: 'Curto e direto',
    text: 'Apartamento de 142 m² no Lourdes — 3 quartos, 2 suítes e 2 vagas. Vista urbana privilegiada, varanda gourmet e acabamentos premium. Curadoria VN Prime. Endereço disponível após contato qualificado.' },
  { label: 'Editorial e descritivo',
    text: 'Localizado no Lourdes, este apartamento de 142 m² foi projetado para quem valoriza espaço e qualidade de acabamento. São 3 quartos, sendo 2 suítes, 2 vagas e varanda gourmet. Vista urbana sem obstáculos e cozinha com ilha em quartzo. Disponibilidade mediante agendamento pelo portal VN Prime.' },
  { label: 'Foco em estilo de vida',
    text: 'Lourdes é o bairro mais central e valorizado de BH — e este apartamento de 142 m² está no coração dele. Varanda gourmet e cozinha com ilha fazem parte do dia a dia. 3 quartos, sendo 2 suítes e 2 vagas. Para quem busca referência sem abrir mão de localização.' },
];

function ProprIADescricao() {
  const [escolhido, setEscolhido] = React.useState(null);
  const [gerando, setGerando] = React.useState(false);
  const [gerado, setGerado] = React.useState(false);

  const gerar = () => {
    if (gerado) { setGerado(false); setEscolhido(null); return; }
    setGerando(true);
    setTimeout(() => { setGerando(false); setGerado(true); }, 2500);
  };

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 52, alignItems: 'flex-start' }}>

        {/* Text side */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,150,14,0.1)', border: '1px solid rgba(201,150,14,0.25)',
            borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
            <span style={{ color: 'var(--gold)', fontSize: 13 }}>✦</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>
              IA de copy · gerador de pitch
            </span>
          </div>
          <h2 style={{ margin: '0 0 18px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            Descrição profissional gerada para você em segundos
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
            Nossa IA lê os dados do seu imóvel — tipo, bairro, área, quartos, suítes, vagas e diferenciais — e gera <strong style={{ color: 'var(--navy)' }}>3 versões de descrição editorial</strong> com voz de marca VN Prime.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {['Texto em português brasileiro calibrado para alto padrão',
              'Nunca usa "exclusivo", "luxo" ou "imperdível"',
              'Foco em concreto: metragem, materiais, localização',
              'Você escolhe e edita antes de publicar',
              'Regera quantas vezes quiser'].map(x => (
              <div key={x} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--fg-2)' }}>
                <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>{x}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive demo */}
        <div>
          <div style={{ background: 'var(--cream)', borderRadius: 18, padding: 24,
            border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(15,34,68,0.07)' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--fg-2)', marginBottom: 14 }}>Demo · Imóvel exemplo</div>

            {/* Mock form preview */}
            <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px',
              border: '1px solid var(--border)', marginBottom: 14,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['Tipo', 'Apartamento'], ['Bairro', 'Lourdes'], ['Área', '142 m²'],
                ['Quartos', '3'], ['Suítes', '2'], ['Vagas', '2']].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{v}</div>
                </div>
              ))}
            </div>

            <button onClick={gerar} disabled={gerando} style={{
              width: '100%', padding: '11px', borderRadius: 10,
              background: gerado ? '#059669' : 'var(--navy)', color: gerado ? '#fff' : 'var(--gold)',
              border: 'none', cursor: gerando ? 'default' : 'pointer',
              fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, marginBottom: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.3s',
            }}>
              {gerando ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: 999,
                    border: '2px solid rgba(201,150,14,0.3)', borderTopColor: 'var(--gold)',
                    animation: 'spin 0.8s linear infinite', display: 'block' }} />
                  Gerando pitches...
                </>
              ) : gerado ? '↺ Regerar 3 versões' : '✦ Gerar 3 pitches com IA'}
            </button>

            {gerado && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DEMO_PITCHES.map((p, i) => {
                  const sel = escolhido === i;
                  return (
                    <div key={i} onClick={() => setEscolhido(i)} style={{
                      background: sel ? 'rgba(201,150,14,0.06)' : '#fff',
                      border: sel ? '2px solid var(--gold)' : '1px solid var(--border)',
                      borderRadius: 10, padding: '14px 16px', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                          {p.label}
                        </span>
                        {sel && <span style={{ fontSize: 10.5, fontWeight: 700, color: '#059669' }}>✓ Escolhido</span>}
                      </div>
                      <p style={{ fontSize: 12.5, color: 'var(--fg-1)', lineHeight: 1.6, margin: 0 }}>{p.text}</p>
                    </div>
                  );
                })}
                {escolhido !== null && (
                  <div style={{ padding: '8px 12px', background: 'rgba(5,150,105,0.08)',
                    border: '1px solid rgba(5,150,105,0.25)', borderRadius: 8,
                    fontSize: 12.5, color: '#059669', fontWeight: 600 }}>
                    ✓ Pitch selecionado — você ainda pode editar antes de publicar.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. BOOSTER ───────────────────────────────────────────────────────────────
function ProprBooster({ onNav }) {
  const [ativo, setAtivo] = React.useState('premium');

  const planos = [
    { id: 'basico', label: 'Impulso Básico', price: 'R$ 49,90',
      duration: '7 dias', accent: 'var(--navy)', featured: false,
      perks: [
        'Posição de destaque na vitrine',
        'Distribuição ampliada por 7 dias',
        'Badge "Destaque" no card',
        'Mais exposição nos resultados de busca',
      ] },
    { id: 'premium', label: 'Impulso Premium', price: 'R$ 99,00',
      duration: '15 dias', accent: 'var(--gold)', featured: true,
      perks: [
        'Topo da vitrine por 15 dias',
        'Distribuição VIP + redes parceiras',
        'Badge "Premium" em destaque máximo',
        'Relatório de alcance e visualizações',
        'Notificação push para compradores salvos',
      ] },
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0',
      background: 'var(--gradient-navy-hero)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(201,150,14,0.22), transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 52, alignItems: 'center' }}>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201,150,14,0.20)', border: '1px solid rgba(201,150,14,0.4)',
              borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ color: 'var(--gold-soft)', fontSize: 13 }}>⚡</span>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-soft)' }}>
                Upsell · BOOSTER de anúncio
              </span>
            </div>
            <h2 style={{ color: '#fff', margin: '0 0 18px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Seu anúncio na frente de todos
            </h2>
            <p style={{ color: 'rgba(250,249,246,0.82)', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
              O BOOSTER impulsiona seu imóvel para o topo da vitrine e amplifica a distribuição nas plataformas parceiras.
              Disponível a qualquer momento pelo portal — ative quando quiser acelerar as visitas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Anúncio padrão fica no meio do resultado de busca',
                'BOOSTER coloca seu imóvel nos primeiros resultados',
                'Badge especial que chama atenção na vitrine',
                'Ampliação para a rede de parceiros e corretores',
                'Você ativa e desativa quando quiser'].map(x => (
                <div key={x} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'rgba(250,249,246,0.82)' }}>
                  <span style={{ color: 'var(--gold-soft)', flexShrink: 0 }}>⚡</span>{x}
                </div>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {planos.map(p => (
              <div key={p.id} onClick={() => setAtivo(p.id)} style={{
                background: ativo === p.id ? 'rgba(201,150,14,0.12)' : 'rgba(255,255,255,0.06)',
                border: ativo === p.id ? '2px solid rgba(201,150,14,0.55)' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16, padding: '22px 24px', cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s',
                boxShadow: ativo === p.id && p.featured ? '0 12px 40px rgba(201,150,14,0.2)' : 'none',
              }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -12, right: 20,
                    background: 'var(--gold)', color: 'var(--navy)', borderRadius: 999,
                    fontFamily: 'DM Sans', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '3px 12px', whiteSpace: 'nowrap' }}>
                    Mais popular
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--gold-soft)', marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 700,
                      color: '#fff', lineHeight: 1 }}>{p.price}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(250,249,246,0.55)', marginTop: 3 }}>{p.duration}</div>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 999,
                    border: `2px solid ${ativo === p.id ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
                    background: ativo === p.id ? 'var(--gold)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ativo === p.id ? 'var(--navy)' : 'transparent', fontWeight: 700, fontSize: 13,
                    transition: 'all 0.2s', flexShrink: 0 }}>✓</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {p.perks.map(x => (
                    <div key={x} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(250,249,246,0.82)' }}>
                      <span style={{ color: 'var(--gold-soft)', flexShrink: 0 }}>✓</span>{x}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11.5, color: 'rgba(250,249,246,0.45)', textAlign: 'center', margin: '4px 0 0' }}>
              Disponível no portal após publicar o anúncio · pode reativar a qualquer momento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. CARD PARA REDES SOCIAIS ───────────────────────────────────────────────
function ProprCardSocial() {
  const [tipo, setTipo] = React.useState('Apartamento');
  const [bairro, setBairro] = React.useState('Lourdes');
  const [preco, setPreco] = React.useState('1.890.000');
  const [area, setArea] = React.useState('142');
  const [gerando, setGerando] = React.useState(false);
  const [gerado, setGerado] = React.useState(false);

  const gerar = () => {
    setGerando(true);
    setTimeout(() => { setGerando(false); setGerado(true); }, 1800);
  };

  const FOTOS_DEMO = [
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=85',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=85',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=85',
  ];
  const [fotoIdx, setFotoIdx] = React.useState(0);

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow color="var(--gold)">IA de mídia social · exclusivo VN Prime</Eyebrow>
          <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Card profissional para Instagram e WhatsApp
          </h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 560, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Gere um card visual com a identidade VN Prime para compartilhar nas redes sociais.
            A IA posiciona foto, preço, localização e o selo da plataforma — pronto para postar.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'flex-start' }}>

          {/* Configurador */}
          <div style={{ background: '#fff', borderRadius: 18, padding: 24,
            border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(15,34,68,0.07)' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 16 }}>
              Configure seu card
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Tipo', val: tipo, set: setTipo, opts: ['Apartamento','Casa','Cobertura','Studio'] },
                { label: 'Bairro', val: bairro, set: setBairro, opts: ['Lourdes','Savassi','Belvedere','Vale do Sereno','Vila da Serra'] },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 5 }}>{f.label}</div>
                  <select value={f.val} onChange={e => { f.set(e.target.value); setGerado(false); }}
                    style={{ width: '100%', fontFamily: 'DM Sans', fontSize: 13.5, padding: '8px 10px',
                      border: '1px solid var(--border)', borderRadius: 8, background: 'var(--cream)', color: 'var(--navy)' }}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {[{ label: 'Preço (R$)', val: preco, set: setPreco, ph: '1.890.000' },
                { label: 'Área (m²)', val: area, set: setArea, ph: '142' }].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 5 }}>{f.label}</div>
                  <input value={f.val} placeholder={f.ph}
                    onChange={e => { f.set(e.target.value); setGerado(false); }}
                    style={{ width: '100%', fontFamily: 'DM Sans', fontSize: 13.5, padding: '8px 10px',
                      border: '1px solid var(--border)', borderRadius: 8, background: 'var(--cream)', color: 'var(--navy)',
                      outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              {/* Foto selector */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 8 }}>Foto de capa</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {FOTOS_DEMO.map((f, i) => (
                    <button key={i} onClick={() => { setFotoIdx(i); setGerado(false); }} style={{
                      flex: 1, height: 50, borderRadius: 7, border: i === fotoIdx ? '2px solid var(--gold)' : '1px solid var(--border)',
                      backgroundImage: `url(${f})`, backgroundSize: 'cover', backgroundPosition: 'center',
                      cursor: 'pointer', padding: 0, transition: 'border 0.15s',
                    }} />
                  ))}
                </div>
              </div>
            </div>
            <button onClick={gerar} disabled={gerando} style={{
              width: '100%', marginTop: 18, padding: '11px',
              background: 'var(--navy)', color: 'var(--gold)', border: 'none',
              borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14,
              cursor: gerando ? 'default' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}>
              {gerando ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: 999,
                    border: '2px solid rgba(201,150,14,0.3)', borderTopColor: 'var(--gold)',
                    animation: 'spin 0.8s linear infinite', display: 'block' }} />
                  Gerando card...
                </>
              ) : '✦ Gerar card social'}
            </button>
          </div>

          {/* Preview do card */}
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 12 }}>
              Preview · formato Instagram (1:1)
            </div>
            <div style={{ maxWidth: 360, margin: '0 auto' }}>
              {/* Card mockup */}
              <div style={{
                borderRadius: 16, overflow: 'hidden', aspectRatio: '1',
                boxShadow: '0 20px 60px rgba(15,34,68,0.18)',
                position: 'relative',
                backgroundImage: `url(${FOTOS_DEMO[fotoIdx]})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: gerado ? 'brightness(1.05) saturate(1.2)' : 'brightness(0.9)',
                transition: 'filter 0.8s ease',
              }}>
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(15,34,68,0.15) 0%, transparent 40%, rgba(15,34,68,0.88) 100%)' }} />

                {/* Gerando overlay */}
                {gerando && (
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'rgba(15,34,68,0.85)', backdropFilter: 'blur(4px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 999,
                      border: '3px solid rgba(201,150,14,0.25)', borderTopColor: 'var(--gold)',
                      animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ color: 'var(--gold-soft)', fontSize: 12, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase' }}>IA compondo card...</div>
                  </div>
                )}

                {/* Top: VN Prime badge */}
                <div style={{ position: 'absolute', top: 14, left: 14,
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(15,34,68,0.90)', backdropFilter: 'blur(8px)',
                  borderRadius: 8, padding: '5px 10px',
                  opacity: gerado ? 1 : 0.4, transition: 'opacity 0.5s' }}>
                  <ShieldMark size={18} />
                  <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, fontWeight: 700,
                    color: '#fff', letterSpacing: '0.1em' }}>VN PRIME</span>
                </div>

                {/* Top right: curated badge */}
                {gerado && (
                  <div style={{ position: 'absolute', top: 14, right: 14,
                    background: 'var(--gold)', borderRadius: 6, padding: '4px 10px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--navy)',
                      letterSpacing: '0.1em', textTransform: 'uppercase' }}>★ Curado</span>
                  </div>
                )}

                {/* Bottom info */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px 18px' }}>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--gold-soft)', marginBottom: 5,
                    opacity: gerado ? 1 : 0.5, transition: 'opacity 0.5s' }}>
                    ◉ {bairro}, Belo Horizonte
                  </div>
                  <div style={{ fontFamily: 'Playfair Display', fontSize: 17, fontWeight: 700,
                    color: '#fff', lineHeight: 1.2, marginBottom: 8,
                    opacity: gerado ? 1 : 0.5, transition: 'opacity 0.6s' }}>
                    {tipo} · {area} m²
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                      color: 'var(--gold-soft)', lineHeight: 1,
                      opacity: gerado ? 1 : 0.5, transition: 'opacity 0.7s' }}>
                      R$ {preco}
                    </div>
                    {gerado && (
                      <div style={{ fontSize: 10, color: 'rgba(250,249,246,0.65)', fontFamily: 'DM Sans' }}>
                        vnprimeimoveis.com.br
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {gerado && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button style={{
                    flex: 1, padding: '9px', border: 'none', borderRadius: 8,
                    background: 'var(--navy)', color: '#fff',
                    fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  }}>↓ Baixar PNG</button>
                  <button style={{
                    flex: 1, padding: '9px', border: '1px solid var(--border)', borderRadius: 8,
                    background: '#fff', color: 'var(--navy)',
                    fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  }}>📤 Compartilhar</button>
                </div>
              )}
              {gerado && (
                <p style={{ fontSize: 11.5, color: 'var(--fg-2)', textAlign: 'center', margin: '10px 0 0' }}>
                  Download e compartilhamento disponíveis após publicar o anúncio no portal.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. FOTÓGRAFO CREDENCIADO ─────────────────────────────────────────────────
function ProprFotografo() {
  const pacotes = [
    { icon: '📸', nome: 'Ensaio Fotográfico', preco: 'R$ 899',
      desc: 'Fotografia HDR profissional de todos os ambientes com edição editorial VN Prime.', tag: null },
    { icon: '🚁', nome: 'Drone + Aéreo', preco: 'R$ 1.299',
      desc: 'Imagens aéreas do imóvel, condomínio e entorno. Perspectiva que valoriza a localização.', tag: null },
    { icon: '🎬', nome: 'Foto + Vídeo', preco: 'R$ 1.999',
      desc: 'Tour virtual cinematográfico com narração e trilha. Ideal para imóveis acima de R$ 2 mi.', tag: null },
    { icon: '⭐', nome: 'Pacote Completo', preco: 'R$ 2.999',
      desc: 'Foto + Vídeo + Drone. Cobertura total para imóveis de alto padrão. Melhor custo-benefício.', tag: 'Mais solicitado' },
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 52, alignItems: 'center', marginBottom: 40 }}>
          <div>
            <Eyebrow color="var(--gold)">Add-on · qualquer plano</Eyebrow>
            <h2 style={{ margin: '8px 0 16px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Fotógrafo credenciado VN Prime
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.8, marginBottom: 18 }}>
              Não quer fotografar? Contrate um fotógrafo credenciado pela plataforma e receba imagens profissionais, editadas no padrão VN Prime. Disponível como add-on em qualquer plano de venda.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Fotógrafos avaliados e aprovados pela curadoria',
                'Agendamento pelo portal em até 48h',
                'Entrega em até 3 dias úteis',
                'Fotos já com tratamento editorial incluído',
                'Sem vínculo com o plano de venda escolhido'].map(x => (
                <div key={x} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--fg-2)' }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>{x}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: 18, overflow: 'hidden', height: 320,
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=85)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            boxShadow: '0 24px 60px rgba(15,34,68,0.14)' }} />
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {pacotes.map(p => (
            <div key={p.nome} style={{
              background: p.tag ? 'linear-gradient(145deg, rgba(201,150,14,0.08), #fff)' : 'var(--cream)',
              border: p.tag ? '2px solid rgba(201,150,14,0.4)' : '1px solid var(--border)',
              borderRadius: 16, padding: '24px 22px', position: 'relative',
              boxShadow: p.tag ? '0 12px 40px rgba(201,150,14,0.12)' : '0 4px 20px rgba(15,34,68,0.05)',
            }}>
              {p.tag && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'DM Sans',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '3px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>{p.tag}</div>
              )}
              <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 6 }}>{p.nome}</div>
              <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55, margin: '0 0 12px' }}>{p.desc}</p>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 700, color: 'var(--gold)' }}>
                {p.preco}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. PLANOS ────────────────────────────────────────────────────────────────
function ProprPlanos({ onNav }) {
  const planos = [
    { id: 'direta', label: 'Venda Direta', pct: 'R$ 197', sub: 'taxa fixa · 90 dias · sem comissão',
      accent: 'var(--navy)', featured: false,
      desc: 'Você publica, conduz e fecha. Paga uma vez e fica com 100% do valor da venda.',
      bullets: ['Anúncio na vitrine por 90 dias', 'IA de descrição incluída', 'Tutorial de fotos + IA de imagem',
        'Leads direto no seu WhatsApp', '30 dias grátis FactorOne', 'Pacotes de foto como add-on'] },
    { id: '3', label: 'Venda Assistida', pct: '3%', sub: 'sobre o valor da venda',
      accent: 'var(--gold)', featured: true,
      desc: 'Você conduz as visitas. A VN Prime apoia com IA e curadoria. Paga só quando vender.',
      bullets: ['Tudo da Venda Direta', 'Suporte da curadoria VN Prime', 'BOOSTER disponível',
        'Card social IA incluído', '30 dias grátis FactorOne', 'Comissão 0% se não vender'] },
    { id: '6', label: 'Venda Completa', pct: '6%', sub: 'sobre o valor da venda',
      accent: 'var(--navy)', featured: false,
      desc: 'A VN Prime assume tudo. Corretor parceiro dedicado conduz visitas, negociação e documentação.',
      bullets: ['Tudo do plano 3%', 'Corretor parceiro dedicado', 'Visitas e negociação coordenadas',
        'Suporte jurídico e documental', '30 dias grátis FactorOne', 'Divisão: 3% corretor + 3% VN Prime'] },
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0',
      background: 'var(--gradient-navy-hero)', color: '#fff' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow>Transparência total · sem letras miúdas</Eyebrow>
          <h2 style={{ color: '#fff', margin: '8px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Escolha como quer vender
          </h2>
          <p style={{ color: 'rgba(250,249,246,0.8)', maxWidth: 540, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Em todos os planos: endereço privado na vitrine, IA de imagem e descrição, 30 dias grátis FactorOne.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {planos.map(p => (
            <div key={p.id} style={{
              background: p.featured ? 'rgba(201,150,14,0.10)' : 'rgba(255,255,255,0.06)',
              border: p.featured ? '2px solid rgba(201,150,14,0.55)' : '1px solid rgba(255,255,255,0.13)',
              borderRadius: 20, padding: '30px 26px',
              position: 'relative',
              boxShadow: p.featured ? '0 20px 60px rgba(201,150,14,0.15)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {p.featured && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'DM Sans',
                  fontSize: 10.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '5px 18px', borderRadius: 999 }}>Mais escolhido</div>
              )}
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--gold-soft)', marginBottom: 8 }}>{p.label}</div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 44, fontWeight: 700,
                  color: '#fff', lineHeight: 1, marginBottom: 3 }}>{p.pct}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,249,246,0.5)' }}>{p.sub}</div>
              </div>
              <p style={{ fontSize: 13.5, color: 'rgba(250,249,246,0.82)', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.bullets.map(b => (
                  <li key={b} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(250,249,246,0.88)' }}>
                    <span style={{ color: 'var(--gold-soft)', flexShrink: 0, marginTop: 1 }}>✓</span>{b}
                  </li>
                ))}
              </ul>
              <Btn variant={p.featured ? 'accent' : 'ghostOnNavy'}
                onClick={() => onNav('anunciar')} style={{ marginTop: 'auto' }}>
                {p.id === 'direta' ? 'Publicar por R$ 197' : `Publicar com ${p.pct}`}
              </Btn>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'rgba(250,249,246,0.45)', marginTop: 24 }}>
          Nos planos 3% e 6%: comissão zero se não vender. Venda Direta: taxa fixa paga no cadastro.
        </p>
      </div>
    </section>
  );
}

// ─── 10. SEGURANÇA DA PLATAFORMA ─────────────────────────────────────────────
function ProprSeguranca() {
  const items = [
    { icon: '🔒', title: 'Endereço privado',
      desc: 'A vitrine pública exibe apenas o bairro. O endereço completo só é revelado após o comprador iniciar contato qualificado pelo portal.' },
    { icon: '👁️', title: 'Curadoria real',
      desc: 'Todos os imóveis passam por revisão antes de ir à vitrine. Foto, descrição e preço são verificados pela equipe VN Prime.' },
    { icon: '🛡️', title: 'Dados protegidos',
      desc: 'Seus dados pessoais nunca são exibidos publicamente. Contato do proprietário só vai para o comprador após aprovação de contato.' },
    { icon: '📊', title: 'Transparência total',
      desc: 'Você acompanha em tempo real: visualizações, favoritos, contatos e origem de cada lead — tudo no portal do proprietário.' },
    { icon: '💳', title: 'Pagamento seguro',
      desc: 'Taxa fixa e comissões processadas por gateway certificado PCI-DSS. Sem surpresas no valor cobrado.' },
    { icon: '⚖️', title: 'Suporte jurídico',
      desc: 'No plano Venda Completa (6%), orientação jurídica e documental incluída — do contrato de compra ao registro em cartório.' },
  ];

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow color="var(--gold)">Sua tranquilidade em primeiro lugar</Eyebrow>
          <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Segurança e privacidade da plataforma
          </h2>
          <p style={{ color: 'var(--fg-2)', maxWidth: 540, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Você tem controle total sobre o que é exibido ao público — e nós cuidamos do resto.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {items.map(it => (
            <div key={it.title} style={{ background: '#fff', borderRadius: 16, padding: '24px 22px',
              border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(15,34,68,0.05)',
              display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: 'rgba(201,150,14,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {it.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 6 }}>{it.title}</div>
                <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.65, margin: 0 }}>{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 11. CTA FINAL ────────────────────────────────────────────────────────────
function ProprCtaFinal({ onNav }) {
  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5rem) 0', background: '#fff',
      borderTop: '1px solid var(--border)' }}>
      <div style={{ width: 'min(720px, 94vw)', margin: '0 auto', textAlign: 'center' }}>
        <ShieldMark size={52} />
        <h2 style={{ margin: '18px 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          Pronto para anunciar?
        </h2>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.75, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
          Crie sua conta gratuita, cadastre o imóvel e escolha o plano. Em até 24h seu imóvel estará na vitrine VN Prime.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn variant="accent" size="lg" onClick={() => onNav('anunciar')}>
            Criar conta e anunciar
          </Btn>
          <Btn variant="ghost" size="lg" onClick={() => onNav('vender')}>
            Ver todos os perfis
          </Btn>
        </div>
        <p style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 18 }}>
          Cadastro gratuito · sem compromisso · você publica e paga conforme o plano escolhido
        </p>
      </div>
    </section>
  );
}

Object.assign(window, { ProprietarioPage });
