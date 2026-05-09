// Página Lançamentos — VN Prime Imóveis  (estilo Costa del Sole)
(function () {

// ─── dados dos empreendimentos ──────────────────────────────────────────────
const LANCAMENTOS = [
  {
    id: 'lc-01',
    nome: 'Residencial Serra Verde',
    slogan: 'Onde o horizonte da Serra vira o seu quintal',
    tipo: 'Apartamentos de alto padrão',
    bairro: 'Vila da Serra', cidade: 'Nova Lima',
    entrega: 'Dezembro de 2029', obras: '48 meses',
    unidades: 64,
    precoMin: 1200000, precoMax: 3800000,
    status: 'Lançamento', statusColor: 'var(--gold)',
    destaque: true,
    sobre: 'O Residencial Serra Verde redefine o padrão de morar em Nova Lima. Fachada contemporânea com arquitetura assinada, área de lazer completa e localização estratégica na Vila da Serra — o bairro mais valorizado da Grande BH nos últimos 5 anos.',
    fotos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=85',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=85',
    ],
    plantas: [
      { nome: 'Planta A — 2 Quartos', area: 89, quartos: 2, suites: 1, vagas: 2, preco: 'A partir de R$ 1,2 mi', rooms: ['Sala', 'Cozinha', '2 Quartos', '1 Suíte', '2 Banheiros', 'Varanda', '2 Vagas'] },
      { nome: 'Planta B — 3 Suítes', area: 118, quartos: 3, suites: 3, vagas: 2, preco: 'A partir de R$ 1,8 mi', rooms: ['Sala ampliada', 'Cozinha americana', '3 Suítes', '3 Banheiros', 'Varanda gourmet', '2 Vagas'] },
      { nome: 'Planta C — 4 Suítes', area: 142, quartos: 4, suites: 4, vagas: 3, preco: 'A partir de R$ 2,6 mi', rooms: ['Living integrado', 'Cozinha com ilha', '4 Suítes', 'Suíte master 40m²', 'Varanda 28m²', '3 Vagas', 'Lavabo'] },
    ],
    amenidades: [
      { label: 'Piscina infinita' }, { label: 'Academia' },
      { label: 'Espaço gourmet' }, { label: 'Coworking' },
      { label: 'Spa & sauna' }, { label: 'Salão de jogos' },
      { label: 'Brinquedoteca' }, { label: 'Portaria 24h' },
      { label: 'Garagem coberta' }, { label: 'Área verde' },
      { label: 'Pet place' }, { label: 'Rooftop view' },
    ],
  },
  {
    id: 'lc-02',
    nome: 'Reserva Belvedere',
    slogan: 'Privacidade absoluta. Belvedere na sua melhor forma',
    tipo: 'Casas em condomínio fechado',
    bairro: 'Belvedere', cidade: 'Belo Horizonte',
    entrega: 'Junho de 2028', obras: '36 meses',
    unidades: 24,
    precoMin: 3800000, precoMax: 9500000,
    status: 'Pré-lançamento', statusColor: '#B87333',
    destaque: false,
    sobre: 'Condomínio fechado de casas de luxo no Belvedere — o endereço mais exclusivo de BH. Cada unidade tem piscina privativa, lote entre 450 e 900 m² e acesso ao clube de uso exclusivo dos moradores.',
    fotos: [
      'https://images.unsplash.com/photo-1613977257363-707e934c7d2f?w=1600&q=85',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=85',
    ],
    plantas: [
      { nome: 'Casa A — 4 Suítes', area: 280, quartos: 4, suites: 4, vagas: 4, preco: 'A partir de R$ 3,8 mi', rooms: ['Sala de estar + jantar', 'Cozinha gourmet', '4 Suítes', 'Suíte master 60m²', 'Piscina privativa', 'Deck em ipê', '4 Vagas', 'Jardim privativo'] },
      { nome: 'Casa B — 5 Suítes', area: 480, quartos: 5, suites: 5, vagas: 6, preco: 'A partir de R$ 6,2 mi', rooms: ['Living 80m² integrado', 'Cozinha com ilha dupla', '5 Suítes', 'Home office', 'Piscina + hidro', 'Adega climatizada', '6 Vagas', 'Heliponto'] },
    ],
    amenidades: [
      { label: 'Piscina privativa por casa' }, { label: 'Campo de golfe' },
      { label: 'Quadras esportivas' }, { label: 'Clube exclusivo' },
      { label: 'Segurança 24h' }, { label: 'Área verde preservada' },
      { label: 'Heliponto' }, { label: 'Fitness exclusivo' },
    ],
  },
  {
    id: 'lc-03',
    nome: 'Mirante do Vale — Lotes',
    slogan: 'Construa o imóvel dos seus sonhos. Do seu jeito',
    tipo: 'Loteamento em condomínio fechado',
    bairro: 'Vetor Sul', cidade: 'Nova Lima',
    entrega: 'Pronto para construir', obras: '—',
    unidades: 48,
    precoMin: 320000, precoMax: 750000,
    status: 'Disponível', statusColor: '#059669',
    destaque: false,
    sobre: 'Lotes exclusivos no Vetor Sul com infraestrutura completa, vista para a Serra do Curral e topografia privilegiada. Cada lote tem entre 450 e 900 m² e escritura já disponível.',
    fotos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=85',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=85',
      'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=1600&q=85',
    ],
    plantas: [
      { nome: 'Lote A — 450 m²', area: 450, quartos: null, suites: null, vagas: null, preco: 'A partir de R$ 320 mil', rooms: ['Vista lateral serra', 'Topografia plana', 'Rua interna', 'Infraestrutura completa', 'Escritura inclusa'] },
      { nome: 'Lote B — 650 m²', area: 650, quartos: null, suites: null, vagas: null, preco: 'A partir de R$ 480 mil', rooms: ['Vista frontal serra', 'Esquina privilegiada', 'Topografia plana', 'Escritura inclusa'] },
      { nome: 'Lote C — 900 m²', area: 900, quartos: null, suites: null, vagas: null, preco: 'A partir de R$ 690 mil', rooms: ['Lote de esquina', 'Vista panorâmica', 'Topografia plana', 'Escritura inclusa', 'Maior lote disponível'] },
    ],
    amenidades: [
      { label: 'Condomínio fechado' }, { label: 'Área verde 30%' },
      { label: 'Energia subterrânea' }, { label: 'Rede de água/esgoto' },
      { label: 'Vista Serra do Curral' }, { label: 'Escritura pronta' },
      { label: 'Área de lazer coletiva' }, { label: 'Vias asfaltadas' },
    ],
  },
];

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtMi = (n) => n >= 1000000
  ? 'R$ ' + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1).replace('.', ',') + ' mi'
  : 'R$ ' + Math.round(n / 1000) + ' mil';

function whatsApp(msg) {
  window.open('https://wa.me/5531984144250?text=' + encodeURIComponent(msg || 'Olá! Tenho interesse em um lançamento VN Prime. Pode me enviar mais informações?'), '_blank');
}

// ─── Planta Modal ────────────────────────────────────────────────────────────
function PlantaModal({ planta, nome, onClose }) {
  if (!planta) return null;
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, zIndex: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'rgba(15,34,68,0.72)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, overflow: 'hidden',
        width: '100%', maxWidth: 700,
        boxShadow: '0 32px 80px rgba(15,34,68,0.28)', position: 'relative',
      }}>
        <div style={{ background: 'var(--navy)', padding: '20px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 4 }}>
              {nome}
            </div>
            <div style={{ color: '#fff', fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 600 }}>
              {planta.nome}
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.12)',
            color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 320 }}>
          {/* planta ilustrada */}
          <div style={{
            background: 'linear-gradient(145deg, #f0f4f8 0%, #e8edf4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 32, position: 'relative',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--fg-2)', marginBottom: 16 }}>Área Total</div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 56, fontWeight: 700,
                color: 'var(--navy)', lineHeight: 1 }}>{planta.area}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 18, color: 'var(--gold)', fontWeight: 600, marginTop: 4 }}>m²</div>
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {planta.quartos != null && (
                  <div style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>{planta.quartos}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-2)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>quartos</div>
                  </div>
                )}
                {planta.suites != null && (
                  <div style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>{planta.suites}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-2)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>suítes</div>
                  </div>
                )}
                {planta.vagas != null && (
                  <div style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', textAlign: 'center', gridColumn: planta.quartos == null && planta.suites == null ? 'span 2' : 'auto' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>{planta.vagas}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-2)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>vagas</div>
                  </div>
                )}
              </div>
            </div>
            {/* watermark blueprint */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <rect x="20" y="20" width="160" height="160" stroke="#0F2244" strokeWidth="2"/>
                <rect x="20" y="20" width="90" height="80" stroke="#0F2244" strokeWidth="1.5"/>
                <rect x="110" y="20" width="70" height="80" stroke="#0F2244" strokeWidth="1.5"/>
                <rect x="20" y="100" width="160" height="80" stroke="#0F2244" strokeWidth="1.5"/>
                <line x1="20" y1="140" x2="110" y2="140" stroke="#0F2244" strokeWidth="1"/>
                <line x1="110" y1="100" x2="110" y2="180" stroke="#0F2244" strokeWidth="1"/>
              </svg>
            </div>
          </div>

          {/* ambientes */}
          <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 14 }}>Ambientes</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {planta.rooms.map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 13.5, color: 'var(--navy)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                color: 'var(--gold)', marginBottom: 14 }}>{planta.preco}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => {
                  alert('Planta em PDF — ' + planta.nome + ' — ' + nome + '\n\nO PDF seria gerado aqui em produção com plantas técnicas, especificações e tabela de preços.');
                }} style={{
                  padding: '11px 16px', background: 'var(--gold)', color: 'var(--navy)',
                  border: 'none', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 700,
                  fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>Baixar planta em PDF</button>
                <button onClick={() => whatsApp('Tenho interesse na ' + planta.nome + ' do ' + nome + '. Pode me enviar mais informações?')}
                  style={{
                    padding: '11px 16px', background: '#25d366', color: '#fff',
                    border: 'none', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 700,
                    fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>Quero mais informações</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Formulário de interesse ─────────────────────────────────────────────────
function FormInteresse({ lancNome, compact = false }) {
  const [form, setForm] = React.useState({ nome: '', tel: '', email: '' });
  const [sent, setSent] = React.useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.tel) return;
    setSent(true);
  };
  if (sent) return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#fff', fontSize: 22, fontWeight: 700 }}>✓</div>
      <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 16, color: compact ? '#fff' : 'var(--navy)' }}>
        Recebemos seu interesse!
      </div>
      <div style={{ fontSize: 13, color: compact ? 'rgba(255,255,255,0.7)' : 'var(--fg-2)', marginTop: 6 }}>
        Um consultor VN Prime entrará em contato em breve.
      </div>
    </div>
  );
  const inputSt = {
    width: '100%', fontFamily: 'DM Sans', fontSize: 14, padding: '0.75rem 1rem',
    borderRadius: 10, border: compact ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid var(--border)',
    background: compact ? 'rgba(255,255,255,0.08)' : '#fff',
    color: compact ? '#fff' : 'var(--navy)', outline: 'none', boxSizing: 'border-box',
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input type="text" placeholder="Seu nome" value={form.nome} onChange={set('nome')} style={inputSt} required />
      <input type="tel" placeholder="WhatsApp (31) 9xxxx-xxxx" value={form.tel} onChange={set('tel')} style={inputSt} required />
      <input type="email" placeholder="E-mail (opcional)" value={form.email} onChange={set('email')} style={inputSt} />
      <button type="submit" style={{
        padding: '13px', background: 'var(--gold)', color: 'var(--navy)',
        border: 'none', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 800,
        fontSize: 14, cursor: 'pointer', letterSpacing: '0.04em',
      }}>
        {lancNome ? `Quero saber mais sobre ${lancNome}` : 'Receber informações exclusivas →'}
      </button>
      <p style={{ fontSize: 11, color: compact ? 'rgba(255,255,255,0.5)' : 'var(--fg-2)', margin: 0, textAlign: 'center' }}>
        Sem spam. Suas informações são sigilosas.
      </p>
    </form>
  );
}

// ─── Card de empreendimento (full-width section) ─────────────────────────────
function LancamentoSection({ lc, reverse = false }) {
  const [photoIdx, setPhotoIdx] = React.useState(0);
  const [formOpen, setFormOpen] = React.useState(false);

  return (
    <section style={{ background: lc.destaque ? 'var(--cream)' : '#fff',
      borderTop: '1px solid var(--border)', padding: 'clamp(3rem, 6vw, 5rem) 0' }}>

      <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>

        {/* cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{
                background: lc.statusColor, color: lc.status === 'Disponível' || lc.status === 'Lançamento' ? (lc.status === 'Lançamento' ? 'var(--navy)' : '#fff') : '#fff',
                fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '4px 14px', borderRadius: 999,
              }}>{lc.status}</span>
              {lc.destaque && (
                <span style={{
                  background: 'rgba(201,150,14,0.12)', color: 'var(--gold)',
                  fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: 999,
                }}>★ Destaque VN Prime</span>
              )}
            </div>
            <Eyebrow color="var(--gold)">{lc.bairro} · {lc.cidade}</Eyebrow>
            <h2 style={{ margin: '4px 0 8px', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', lineHeight: 1.1 }}>{lc.nome}</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, fontStyle: 'italic', margin: 0 }}>{lc.slogan}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 4 }}>A partir de</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 34, fontWeight: 700,
              color: 'var(--gold)', lineHeight: 1 }}>{fmtMi(lc.precoMin)}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 4 }}>
              {lc.unidades} unidades · Entrega {lc.entrega}
            </div>
          </div>
        </div>

        {/* 2-column: foto + sobre */}
        <div style={{ display: 'grid', gap: 40,
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginBottom: 48, alignItems: 'start' }}>
          {/* galeria */}
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(15,34,68,0.16)' }}>
            <div style={{ height: 380,
              backgroundImage: `url(${lc.fotos[photoIdx]})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              transition: 'background-image 0.4s ease' }} />
            {lc.fotos.length > 1 && (
              <React.Fragment>
                <button onClick={() => setPhotoIdx(i => (i - 1 + lc.fotos.length) % lc.fotos.length)}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    width: 36, height: 36, borderRadius: 999, border: 'none',
                    background: 'rgba(255,255,255,0.92)', cursor: 'pointer',
                    fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                <button onClick={() => setPhotoIdx(i => (i + 1) % lc.fotos.length)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    width: 36, height: 36, borderRadius: 999, border: 'none',
                    background: 'rgba(255,255,255,0.92)', cursor: 'pointer',
                    fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: 5 }}>
                  {lc.fotos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)} style={{
                      width: i === photoIdx ? 22 : 7, height: 4, borderRadius: 2, border: 'none', padding: 0,
                      background: i === photoIdx ? 'var(--gold)' : 'rgba(255,255,255,0.65)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }} />
                  ))}
                </div>
              </React.Fragment>
            )}
            {/* miniaturas */}
            <div style={{ display: 'flex', gap: 8, padding: 12, background: 'rgba(15,34,68,0.04)' }}>
              {lc.fotos.map((f, i) => (
                <div key={i} onClick={() => setPhotoIdx(i)} style={{
                  flex: 1, height: 56, borderRadius: 8, cursor: 'pointer',
                  backgroundImage: `url(${f})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  outline: i === photoIdx ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'outline 0.15s',
                }} />
              ))}
            </div>
          </div>

          {/* sobre + form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--fg-2)', marginBottom: 10 }}>Sobre o empreendimento</div>
              <p style={{ color: 'var(--fg-2)', fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>{lc.sobre}</p>
            </div>

            {/* stats rápidos */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { l: 'Unidades', v: lc.unidades },
                { l: 'Entrega', v: lc.entrega.split(' ').slice(-1)[0] },
                { l: 'Tipo', v: lc.tipo.split(' ')[0] },
              ].map(s => (
                <div key={s.l} style={{ background: 'rgba(201,150,14,0.08)', borderRadius: 12,
                  padding: '12px 18px', border: '1px solid rgba(201,150,14,0.2)' }}>
                  <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                    color: 'var(--navy)', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* form rápido */}
            <div style={{ background: 'var(--navy)', borderRadius: 18, padding: '24px 22px' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--gold-soft)', marginBottom: 4 }}>Tenho interesse</div>
              <div style={{ color: '#fff', fontFamily: 'Playfair Display', fontSize: 16,
                fontWeight: 600, marginBottom: 18 }}>Receba a tabela de preços e condições exclusivas</div>
              <FormInteresse lancNome={lc.nome} compact />
            </div>
          </div>
        </div>

        {/* AMENIDADES */}
        <div>
          <Eyebrow color="var(--gold)">Lazer & infraestrutura</Eyebrow>
          <h3 style={{ margin: '4px 0 20px', fontSize: 22 }}>
            {lc.amenidades.length} itens de lazer e serviços
          </h3>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {lc.amenidades.map(a => (
              <div key={a.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(201,150,14,0.06)', borderRadius: 10,
                padding: '12px 14px', border: '1px solid rgba(201,150,14,0.14)',
              }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(201,150,14,0.2)',
                  color: 'var(--gold)', display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600,
                  color: 'var(--navy)', lineHeight: 1.3 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Seção "Como funciona o pagamento" ──────────────────────────────────────
function SecaoPagamento({ onNav }) {
  const steps = [
    {
      num: '01', color: '#C9960E',
      title: 'Assinatura & Entrada',
      sub: '10% a 20% do valor',
      desc: 'Você assina o contrato e parcela a entrada em até 36 meses. Parcelas acessíveis — você não sente o peso enquanto a obra avança.',
      tag: 'Entrada facilitada',
    },
    {
      num: '02', color: '#059669',
      title: 'Durante as obras',
      sub: 'Fluxo mensal reduzido',
      desc: 'Ao longo dos 48 meses de construção, você paga parcelas mensais de baixo valor — calculadas para caber no seu orçamento sem sacrifícios.',
      tag: '~4 anos de obra',
    },
    {
      num: '03', color: '#B87333',
      title: 'Entrega das chaves',
      sub: '50% a 60% pago',
      desc: 'Na entrega, você terá quitado entre 50% e 60% do valor total. Sem surpresas, sem revisão de preço — tudo corrigido pelo INCC conforme contrato.',
      tag: 'Chaves em mãos',
    },
    {
      num: '04', color: '#6366F1',
      title: 'Financiamento bancário',
      sub: 'Saldo restante',
      desc: 'O saldo (40% a 50%) é financiado via Caixa Econômica, Banco do Brasil ou banco de sua escolha — com prazo de até 30 anos e taxas competitivas.',
      tag: 'Em até 30 anos',
    },
  ];

  return (
    <section style={{ background: 'var(--navy)', padding: 'clamp(4rem, 7vw, 6rem) 0', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(201,150,14,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,150,14,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 60px' }}>
          <Eyebrow>Condições exclusivas · Compre na planta</Eyebrow>
          <h2 style={{ color: '#fff', margin: '10px 0 18px', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1.15 }}>
            Como funciona o pagamento durante a obra
          </h2>
          <p style={{ color: 'rgba(250,249,246,0.80)', fontSize: 15.5, lineHeight: 1.8 }}>
            Comprar na planta com a VN Prime é acessível, transparente e sem letra miúda. Você paga de forma gradual enquanto o seu imóvel é construído — e financia o restante com o banco na entrega.
          </p>
        </div>

        {/* timeline steps */}
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 60 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.10)',
              padding: '32px 26px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 16, right: 18,
                fontFamily: 'Cinzel, serif', fontSize: 60, fontWeight: 700,
                color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none',
              }}>{s.num}</div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: s.color === '#C9960E' ? 'var(--navy)' : '#fff', fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700 }}>{s.num}</div>
              <div style={{
                display: 'inline-block', background: s.color,
                color: s.color === '#C9960E' ? 'var(--navy)' : '#fff',
                fontFamily: 'DM Sans', fontSize: 10, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: 999, marginBottom: 12,
              }}>{s.tag}</div>
              <h3 style={{ color: '#fff', fontFamily: 'Playfair Display', fontSize: 19,
                margin: '0 0 6px', fontWeight: 600 }}>{s.title}</h3>
              <div style={{ color: 'var(--gold-soft)', fontFamily: 'DM Sans', fontSize: 13,
                fontWeight: 700, marginBottom: 12 }}>{s.sub}</div>
              <p style={{ color: 'rgba(250,249,246,0.75)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              {/* connector line */}
              {i < steps.length - 1 && (
                <div style={{ display: 'none' }} /> // no connector in grid mode
              )}
            </div>
          ))}
        </div>

        {/* barra de progresso visual */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '32px 36px',
          border: '1px solid rgba(255,255,255,0.10)', marginBottom: 48 }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 20 }}>
            Estrutura de pagamento · exemplo real
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { label: 'Entrada parcelada (durante obras)', pct: 20, color: '#C9960E', desc: '~20% em até 36x mensais' },
              { label: 'Parcelas durante a obra (baixo fluxo)', pct: 35, color: '#059669', desc: '~35% em 48x mensais reduzidas' },
              { label: 'Saldo financiado na entrega (banco)', pct: 45, color: '#6366F1', desc: '~45% financiado em até 30 anos' },
            ].map(b => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(250,249,246,0.85)' }}>{b.label}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, color: b.color }}>{b.pct}%</span>
                </div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }}>
                  <div style={{
                    height: '100%', borderRadius: 999, background: b.color,
                    width: b.pct + '%', transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(250,249,246,0.45)', marginTop: 4 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* benefícios do comprar na planta */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            { title: 'Valorização garantida', desc: 'Imóveis na planta costumam valorizar 30 a 50% entre a assinatura e a entrega. Você compra no melhor momento.' },
            { title: 'Preço pré-lançamento', desc: 'O preço do lançamento é sempre o menor da tabela. Cada etapa da obra sobe o valor do imóvel.' },
            { title: 'Preço fixado em contrato', desc: 'Após assinar, o preço é seu. Correção apenas pelo INCC (índice da construção civil) — sem revisão de valores.' },
            { title: 'Financiamento facilitado', desc: 'Na entrega, você usa seu FGTS, comprovante de renda e o financiamento bancário com as melhores taxas do mercado.' },
          ].map(b => (
            <div key={b.title} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '24px 20px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ width: 32, height: 4, background: 'var(--gold)', borderRadius: 2, marginBottom: 16 }} />
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>{b.title}</div>
              <p style={{ color: 'rgba(250,249,246,0.68)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Calculadoras ────────────────────────────────────────────────────────────
function Calculadoras() {
  const [tab, setTab] = React.useState('fin');
  // financiamento state
  const [vF, setVF] = React.useState(1200000);
  const [entF, setEntF] = React.useState(20);
  const [prazoF, setPrazoF] = React.useState(360);
  const [taxaF, setTaxaF] = React.useState(10.5);
  // investimento state
  const [vI, setVI] = React.useState(1200000);
  const [valI, setValI] = React.useState(12);
  const [anosI, setAnosI] = React.useState(4);
  const [alugI, setAlugI] = React.useState(0.5);

  // financiamento calc
  const principal = vF * (1 - entF / 100);
  const tmens = taxaF / 100 / 12;
  const parcela = principal * (tmens * Math.pow(1 + tmens, prazoF)) / (Math.pow(1 + tmens, prazoF) - 1);
  const totalPago = parcela * prazoF + vF * (entF / 100);

  // investimento calc
  const vFinal = vI * Math.pow(1 + valI / 100, anosI);
  const ganho = vFinal - vI;
  const alugueis = vI * (alugI / 100) * 12 * anosI;

  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
          <Eyebrow color="var(--gold)">Ferramentas · Planejamento</Eyebrow>
          <h2 style={{ margin: '8px 0 12px' }}>Calcule e planeje sua compra</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Simule o financiamento ou projete a valorização do seu investimento ao longo do tempo.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#e8e4da', borderRadius: 14,
          padding: 4, width: 'fit-content', margin: '0 auto 32px' }}>
          {[['fin', 'Simulador de Financiamento'], ['inv', 'Retorno do Investimento']].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '11px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans', fontSize: 13.5, fontWeight: 600,
              background: tab === id ? '#fff' : 'transparent',
              color: tab === id ? 'var(--navy)' : 'var(--fg-2)',
              boxShadow: tab === id ? '0 2px 12px rgba(15,34,68,0.10)' : 'none', transition: 'all 0.2s',
            }}>{lbl}</button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(24px, 4vw, 40px)',
          boxShadow: '0 8px 40px rgba(15,34,68,0.08)', border: '1px solid var(--border)' }}>
          {tab === 'fin' ? (
            <React.Fragment>
              <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 32 }}>
                {[
                  { l: 'Valor do imóvel', v: vF, s: setVF, min: 300000, max: 15000000, step: 50000, f: v => fmtBRL(v) },
                  { l: 'Entrada (%)', v: entF, s: setEntF, min: 10, max: 70, step: 5, f: v => v + '%' },
                  { l: 'Prazo (meses)', v: prazoF, s: setPrazoF, min: 60, max: 420, step: 12, f: v => v + ' meses (' + Math.round(v/12) + ' anos)' },
                  { l: 'Taxa anual', v: taxaF, s: setTaxaF, min: 6, max: 18, step: 0.5, f: v => v.toFixed(1) + '% a.a.' },
                ].map(f => (
                  <div key={f.l}>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 6 }}>{f.l}</div>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 700,
                      color: 'var(--gold)', marginBottom: 8 }}>{f.f(f.v)}</div>
                    <input type="range" min={f.min} max={f.max} step={f.step} value={f.v}
                      onChange={e => f.s(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                background: 'var(--cream)', borderRadius: 16, padding: '20px 24px' }}>
                {[
                  { l: 'Valor financiado', v: fmtBRL(Math.round(principal)) },
                  { l: 'Parcela mensal', v: fmtBRL(Math.round(parcela)), accent: true },
                  { l: 'Total pago', v: fmtBRL(Math.round(totalPago)) },
                  { l: 'Total em juros', v: fmtBRL(Math.round(totalPago - vF)) },
                ].map(r => (
                  <div key={r.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: r.accent ? 28 : 20,
                      fontWeight: 700, color: r.accent ? 'var(--gold)' : 'var(--navy)', lineHeight: 1 }}>{r.v}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-2)', marginTop: 6 }}>{r.l}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 12, marginBottom: 0 }}>
                * Simulação SAC — parcelas decrescentes. Consulte condições reais junto ao banco.
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 32 }}>
                {[
                  { l: 'Valor do imóvel', v: vI, s: setVI, min: 300000, max: 15000000, step: 50000, f: v => fmtBRL(v) },
                  { l: 'Valorização anual (%)', v: valI, s: setValI, min: 3, max: 25, step: 0.5, f: v => v.toFixed(1) + '% a.a.' },
                  { l: 'Horizonte (anos)', v: anosI, s: setAnosI, min: 1, max: 20, step: 1, f: v => v + ' anos' },
                  { l: 'Rendimento aluguel/mês', v: alugI, s: setAlugI, min: 0, max: 1.5, step: 0.05, f: v => v.toFixed(2) + '% a.m.' },
                ].map(f => (
                  <div key={f.l}>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 6 }}>{f.l}</div>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 700,
                      color: 'var(--gold)', marginBottom: 8 }}>{f.f(f.v)}</div>
                    <input type="range" min={f.min} max={f.max} step={f.step} value={f.v}
                      onChange={e => f.s(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
              {/* gráfico de barras */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 12 }}>Evolução do valor</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100, padding: '0 4px' }}>
                  {Array.from({ length: anosI + 1 }, (_, i) => {
                    const v = vI * Math.pow(1 + valI / 100, i);
                    const vMax = vI * Math.pow(1 + valI / 100, anosI);
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <div style={{
                          width: '100%', borderRadius: '4px 4px 0 0',
                          height: (v / vMax) * 84,
                          background: i === anosI ? 'var(--gold)' : 'rgba(201,150,14,' + (0.25 + (i / anosI) * 0.6) + ')',
                          transition: 'height 0.4s ease',
                        }} />
                        <span style={{ fontSize: 9, color: 'var(--fg-2)', fontWeight: 600 }}>
                          {i === 0 ? 'Hoje' : i + 'a'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                background: 'var(--cream)', borderRadius: 16, padding: '20px 24px' }}>
                {[
                  { l: 'Valor hoje', v: fmtBRL(vI) },
                  { l: `Valor em ${anosI} anos`, v: fmtBRL(Math.round(vFinal)), accent: true },
                  { l: 'Ganho de capital', v: fmtBRL(Math.round(ganho)) },
                  { l: 'Receita aluguel', v: fmtBRL(Math.round(alugueis)) },
                  { l: 'Retorno total', v: (((ganho + alugueis) / vI) * 100).toFixed(1) + '%' },
                ].map(r => (
                  <div key={r.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: r.accent ? 26 : 18,
                      fontWeight: 700, color: r.accent ? 'var(--gold)' : 'var(--navy)', lineHeight: 1 }}>{r.v}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-2)', marginTop: 6 }}>{r.l}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 12, marginBottom: 0 }}>
                * Projeção baseada em valorização constante. Referência indicativa — não constitui promessa de rentabilidade.
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── PÁGINA PRINCIPAL ────────────────────────────────────────────────────────
function LancamentosPage({ onNav }) {
  return (
    <main style={{ position: 'relative' }}>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: 520, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2200&q=85)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(120deg, rgba(15,34,68,0.88) 0%, rgba(15,34,68,0.60) 55%, rgba(15,34,68,0.75) 100%)' }} />
        <div style={{ position: 'absolute', top: -100, right: -60, width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(201,150,14,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, width: 'min(1280px, 94vw)', margin: '0 auto',
          padding: '5rem 0', display: 'grid', gap: 48,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          <div>
            <Eyebrow>Lançamentos exclusivos · VN Prime Imóveis</Eyebrow>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
              margin: '10px 0 20px', lineHeight: 1.12, maxWidth: '18ch',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              Alta valorização. Condições que cabem no seu momento.
            </h1>
            <p style={{ color: 'rgba(250,249,246,0.88)', fontSize: 16, maxWidth: 520, lineHeight: 1.8, marginBottom: 28 }}>
              Apartamentos, casas em condomínio e lotes no melhor da Grande BH. Compre na planta com entrada facilitada, fluxo baixo durante as obras e financiamento bancário na entrega.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => whatsApp()} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 26px', background: '#25d366', color: '#fff',
                border: 'none', borderRadius: 10, fontFamily: 'DM Sans',
                fontWeight: 800, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(37,211,102,0.35)',
              }}>Falar no WhatsApp</button>
              <Btn variant="ghostOnNavy" size="lg" onClick={() => document.getElementById('lancamentos-lista')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver empreendimentos ↓
              </Btn>
            </div>
          </div>

          {/* stats hero */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { v: LANCAMENTOS.length, l: 'Empreendimentos' },
              { v: LANCAMENTOS.reduce((a, b) => a + b.unidades, 0), l: 'Unidades' },
              { v: '4 anos', l: 'Ciclo médio de obras' },
              { v: '50–60%', l: 'Pago até as chaves' },
            ].map(s => (
              <div key={s.l} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 16,
                padding: '20px 18px', border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ width: 6, height: 4, background: 'var(--gold)', borderRadius: 2, marginBottom: 12 }} />
                <div style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 700,
                  color: 'var(--gold-soft)', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'rgba(250,249,246,0.65)', marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA O PAGAMENTO */}
      {/* LISTA DE EMPREENDIMENTOS */}
      <div id="lancamentos-lista">
        {LANCAMENTOS.map((lc, i) => (
          <LancamentoSection key={lc.id} lc={lc} reverse={i % 2 === 1} />
        ))}
      </div>

      {/* CALCULADORAS */}
      <Calculadoras />

      {/* CTA FINAL */}
      <section style={{ padding: 'clamp(4rem, 6vw, 5rem) 0', background: 'var(--navy)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto',
          display: 'grid', gap: 52, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          <div>
            <Eyebrow>Incorporadoras & construtoras</Eyebrow>
            <h2 style={{ color: '#fff', margin: '10px 0 18px', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}>
              Tem um empreendimento para lançar?
            </h2>
            <p style={{ color: 'rgba(250,249,246,0.78)', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
              A VN Prime distribui seu lançamento para compradores qualificados em BH e região metropolitana. Curadoria, fotografia profissional e estratégia digital dedicada.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => whatsApp('Tenho um empreendimento e gostaria de conversar sobre uma parceria com a VN Prime.')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 22px', background: '#25d366', color: '#fff',
                border: 'none', borderRadius: 10, fontFamily: 'DM Sans',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>WhatsApp</button>
              <Btn variant="ghostOnNavy" onClick={() => onNav('sobre')}>Sobre a VN Prime</Btn>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20,
            padding: '32px 28px', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div style={{ color: 'var(--gold-soft)', fontFamily: 'DM Sans', fontSize: 12,
              fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>
              Receber informações exclusivas
            </div>
            <FormInteresse compact />
          </div>
        </div>
      </section>

    </main>
  );
}

window.LancamentosPage = LancamentosPage;

})();
