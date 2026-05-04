// Anunciar — Proprietário Direto · Wizard de venda direta
// 5 passos: Identificação → Imóvel → Fotos → Pitch IA → Publicar

function AnunciarPage({ onNav, authUser }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    nome: authUser?.name || '', email: authUser?.email || '', whatsapp: authUser?.phone || '',
    titulo: '', tipo: 'Apartamento', bairro: '', cidade: 'Belo Horizonte',
    preco: '', area: '', quartos: 3, suites: 2, banheiros: 2, vagas: 2,
    diferenciais: [], fotos: [], descricao: '', pitches: [], pitchEscolhido: '',
    plano: '',
  });

  const update = (patch) => setData(d => ({ ...d, ...patch }));
  const next = () => setStep(s => Math.min(s + 1, 5));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    { n: 1, title: 'Você' },
    { n: 2, title: 'Imóvel' },
    { n: 3, title: 'Fotos' },
    { n: 4, title: 'Pitch IA' },
    { n: 5, title: 'Publicar' },
  ];

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '32px 0 60px' }}>
      <div style={{ width: 'min(960px, 94vw)', margin: '0 auto' }}>
        {/* Top */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => onNav('vender')}
            style={{ background: 'none', border: 'none', color: 'var(--fg-2)', cursor: 'pointer',
              fontFamily: 'DM Sans', fontSize: 12.5, padding: 0, marginBottom: 12 }}>
            ← Trocar perfil
          </button>
          <Eyebrow color="var(--gold)">Proprietário · VN Prime Imóveis</Eyebrow>
          <h1 style={{ margin: '4px 0 6px' }}>Anuncie seu imóvel</h1>
          <p style={{ color: 'var(--fg-2)', margin: 0 }}>
            Preencha em 5 passos. Seu anúncio passa por curadoria e vai para a vitrine após aprovação.
          </p>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          {steps.map((s, i) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <div key={s.n} style={{ flex: 1, minWidth: 110 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: done ? 'var(--gold)' : active ? 'var(--navy)' : 'rgba(15,34,68,0.08)',
                    color: done ? 'var(--navy)' : active ? 'var(--gold)' : 'var(--fg-2)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, flexShrink: 0,
                  }}>{done ? '✓' : s.n}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600,
                    color: active ? 'var(--navy)' : 'var(--fg-2)' }}>{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ height: 2, background: done ? 'var(--gold)' : 'var(--border)',
                    marginTop: 14, marginLeft: 28, marginRight: -6 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Panel */}
        <div style={{
          background: '#fff', borderRadius: 18, padding: 'clamp(24px, 4vw, 40px)',
          boxShadow: '0 18px 50px rgba(15,34,68,0.10)', border: '1px solid var(--border)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {step === 1 && <StepYou data={data} update={update} />}
          {step === 2 && <StepProperty data={data} update={update} />}
          {step === 3 && <StepPhotos data={data} update={update} />}
          {step === 4 && <StepPitch data={data} update={update} />}
          {step === 5 && <StepPublish data={data} onNav={onNav} />}

          {/* Nav buttons */}
          {step < 5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10,
              marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <Btn variant="ghost" onClick={prev} style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>
                ← Voltar
              </Btn>
              <Btn variant="accent" onClick={next}>
                {step === 4 ? 'Revisar e publicar' : 'Continuar'} →
              </Btn>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </main>
  );
}

function StepYou({ data, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Como te encontramos?</h2>
      <p style={{ color: 'var(--fg-2)', margin: '-8px 0 0' }}>
        Seu contato fica visível só após o comprador iniciar conversa. Sua privacidade é prioridade.
      </p>
      <FieldLabel label="Seu nome completo">
        <input value={data.nome} onChange={(e) => update({ nome: e.target.value })}
          placeholder="Como aparecerá no anúncio" style={fullInput} />
      </FieldLabel>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }}>
        <FieldLabel label="WhatsApp">
          <input value={data.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })}
            placeholder="(31) 9..." style={fullInput} />
        </FieldLabel>
        <FieldLabel label="E-mail">
          <input value={data.email} onChange={(e) => update({ email: e.target.value })}
            placeholder="seu@email.com" style={fullInput} />
        </FieldLabel>
      </div>
    </div>
  );
}

function StepProperty({ data, update }) {
  const difs = ['Vista panorâmica', 'Varanda gourmet', 'Piscina', 'Pé-direito alto',
    'Reformado', 'Mobiliado', 'Andar alto', 'Sol da manhã', 'Lazer completo',
    'Automação', 'Cozinha integrada', 'Closet', 'Lavabo', 'Quintal'];
  const toggleDif = (d) => update({
    diferenciais: data.diferenciais.includes(d)
      ? data.diferenciais.filter(x => x !== d)
      : [...data.diferenciais, d],
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Sobre o imóvel</h2>
      <FieldLabel label="Título do anúncio">
        <input value={data.titulo} onChange={(e) => update({ titulo: e.target.value })}
          placeholder="Ex.: Apartamento com vista panorâmica em Lourdes" style={fullInput} />
      </FieldLabel>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr 1fr' }}>
        <FieldLabel label="Tipo">
          <select value={data.tipo} onChange={(e) => update({ tipo: e.target.value })} style={fullInput}>
            <option>Apartamento</option><option>Casa</option><option>Cobertura</option><option>Studio</option><option>Terreno</option>
          </select>
        </FieldLabel>
        <FieldLabel label="Bairro">
          <input value={data.bairro} onChange={(e) => update({ bairro: e.target.value })}
            placeholder="Ex.: Lourdes" style={fullInput} />
        </FieldLabel>
        <FieldLabel label="Cidade">
          <input value={data.cidade} onChange={(e) => update({ cidade: e.target.value })} style={fullInput} />
        </FieldLabel>
      </div>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }}>
        <FieldLabel label="Preço de venda (R$)">
          <input type="number" value={data.preco} onChange={(e) => update({ preco: e.target.value })}
            placeholder="Ex.: 1850000" style={fullInput} />
        </FieldLabel>
        <FieldLabel label="Área útil (m²)">
          <input type="number" value={data.area} onChange={(e) => update({ area: e.target.value })}
            placeholder="Ex.: 110" style={fullInput} />
        </FieldLabel>
      </div>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <FieldLabel label="Quartos"><Stepper v={data.quartos} on={(v) => update({ quartos: v })} /></FieldLabel>
        <FieldLabel label="Suítes"><Stepper v={data.suites} on={(v) => update({ suites: v })} /></FieldLabel>
        <FieldLabel label="Banheiros"><Stepper v={data.banheiros} on={(v) => update({ banheiros: v })} /></FieldLabel>
        <FieldLabel label="Vagas"><Stepper v={data.vagas} on={(v) => update({ vagas: v })} /></FieldLabel>
      </div>
      <div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 10 }}>
          Diferenciais (selecione os que se aplicam)
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {difs.map(d => {
            const on = data.diferenciais.includes(d);
            return (
              <button key={d} onClick={() => toggleDif(d)}
                style={{
                  fontFamily: 'DM Sans', fontSize: 12.5, padding: '6px 12px', borderRadius: 999,
                  border: '1px solid', borderColor: on ? 'var(--gold)' : 'var(--border)',
                  background: on ? 'rgba(201,150,14,0.12)' : '#fff',
                  color: on ? 'var(--navy)' : 'var(--fg-2)',
                  cursor: 'pointer', fontWeight: on ? 600 : 500,
                }}>{on ? '✓ ' : ''}{d}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stepper({ v, on }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'var(--cream)', borderRadius: 8, border: '1px solid var(--border)',
      padding: 3, width: 'fit-content' }}>
      <button onClick={() => on(Math.max(0, v - 1))} style={stepperBtn}>−</button>
      <span style={{ minWidth: 28, textAlign: 'center', fontFamily: 'DM Sans',
        fontWeight: 600, color: 'var(--navy)' }}>{v}</span>
      <button onClick={() => on(v + 1)} style={stepperBtn}>+</button>
    </div>
  );
}
const stepperBtn = {
  width: 28, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer',
  background: '#fff', color: 'var(--navy)', fontSize: 14, fontWeight: 700,
  fontFamily: 'DM Sans',
};

const PHOTO_TIPS = [
  { icon: '☀️', title: 'Luz natural', tip: 'Fotografe com janelas abertas durante o dia. Apague luzes artificiais para evitar tons amarelados.' },
  { icon: '📐', title: 'Ângulo correto', tip: 'Posicione a câmera a 1,20m do chão, no canto do ambiente. Capture o máximo do espaço em um único clique.' },
  { icon: '🛋️', title: 'Organize antes', tip: 'Retire objetos pessoais, feche tampas de vaso e organize almofadas. Menos é mais em imóveis de alto padrão.' },
  { icon: '🚪', title: 'Sequência lógica', tip: 'Comece pela sala, siga para a cozinha, quartos e finalize com banheiros e áreas externas.' },
  { icon: '🔆', title: 'Primeira foto', tip: 'A capa define o clique. Use o ângulo mais amplo e bem iluminado do imóvel — sala ou varanda funcionam melhor.' },
];

function StepPhotos({ data, update }) {
  const fileRef = useRef(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const handlePick = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(f => URL.createObjectURL(f));
    update({ fotos: [...data.fotos, ...urls].slice(0, 25) });
  };
  const remove = (i) => update({ fotos: data.fotos.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Fotos do imóvel</h2>
          <p style={{ color: 'var(--fg-2)', margin: '6px 0 0' }}>
            Mínimo 6 fotos · Máximo 25 · Resolução acima de 1600px. A primeira foto é a capa.
          </p>
        </div>
        <button onClick={() => setTutorialOpen(o => !o)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(201,150,14,0.1)', border: '1px solid rgba(201,150,14,0.3)',
          borderRadius: 999, padding: '6px 14px', cursor: 'pointer',
          fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600, color: 'var(--navy)',
        }}>
          {tutorialOpen ? '✕' : '💡'} {tutorialOpen ? 'Fechar' : 'Como fotografar bem'}
        </button>
      </div>

      {/* Tutorial */}
      {tutorialOpen && (
        <div style={{
          background: 'linear-gradient(145deg, #0f2244, #1e3560)',
          borderRadius: 16, padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-soft)' }}>
            Guia rápido · Fotos que vendem
          </div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {PHOTO_TIPS.map(t => (
              <div key={t.title} style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 13,
                    color: '#fff', marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(250,249,246,0.78)', lineHeight: 1.5 }}>{t.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtro natural — informativo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(201,150,14,0.07)', border: '1px solid rgba(201,150,14,0.25)',
        borderRadius: 10, padding: '10px 16px',
      }}>
        <span style={{ fontSize: 18 }}>✨</span>
        <p style={{ margin: 0, fontFamily: 'DM Sans', fontSize: 13, color: 'var(--navy)' }}>
          <strong>Filtro editorial aplicado automaticamente:</strong> suas fotos recebem ajuste de luz natural e balanço de cores ao serem publicadas na vitrine.
        </p>
      </div>

      {/* Upload area */}
      <div onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed var(--border-strong)', borderRadius: 14, padding: '36px 24px',
          textAlign: 'center', cursor: 'pointer', background: 'var(--cream)',
          transition: 'border-color 0.2s, background 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,150,14,0.04)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--cream)'; }}>
        <div style={{ fontSize: 38, color: 'var(--gold)', marginBottom: 8 }}>↑</div>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 18, color: 'var(--navy)' }}>
          Arraste fotos aqui ou clique para selecionar
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 6 }}>JPG ou PNG · até 8MB cada</div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePick} />
      </div>

      {data.fotos.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 10 }}>
            {data.fotos.length} foto{data.fotos.length === 1 ? '' : 's'} · arraste para reordenar
          </div>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
            {data.fotos.map((url, i) => (
              <div key={i} style={{
                position: 'relative', height: 90, borderRadius: 8,
                backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center',
                border: i === 0 ? '2px solid var(--gold)' : '1px solid var(--border)',
                filter: 'brightness(1.04) contrast(1.04) saturate(1.08)',
              }}>
                {i === 0 && <span style={{
                  position: 'absolute', top: 4, left: 4, background: 'var(--gold)', color: 'var(--navy)',
                  fontFamily: 'DM Sans', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4,
                }}>Capa</span>}
                <button onClick={() => remove(i)} style={{
                  position: 'absolute', top: 4, right: 4, width: 22, height: 22,
                  borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: 'rgba(15,34,68,0.85)', color: '#fff', fontSize: 12,
                }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.fotos.length === 0 && (
        <button onClick={() => update({ fotos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
        ]})} style={{
          background: 'transparent', border: '1px dashed var(--border-strong)',
          color: 'var(--fg-2)', padding: '10px 14px', borderRadius: 8,
          fontFamily: 'DM Sans', fontSize: 12.5, cursor: 'pointer',
        }}>▸ Usar fotos de exemplo (para testar)</button>
      )}
    </div>
  );
}

function StepPitch({ data, update }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (mode = 'pack') => {
    setLoading(true); setError(null);
    try {
      const prompt = `Você é um copywriter premium da VN Prime Imóveis (alto padrão, BH).
Gere 3 textos diferentes para anúncio do seguinte imóvel:

Tipo: ${data.tipo}
Título: ${data.titulo || '(sem título)'}
Localização: ${data.bairro}, ${data.cidade}
Área: ${data.area || '?'} m² · ${data.quartos} quartos · ${data.suites} suítes · ${data.vagas} vagas
Preço: R$ ${data.preco || '?'}
Diferenciais: ${data.diferenciais.join(', ') || 'não informado'}

Voz da marca: confiante, premium, prática, em português brasileiro. Use "você" (informal). Foque em concretude (números, espaços, materiais), não adjetivos vazios. NUNCA use as palavras "luxo", "exclusivo", "incrível", "imperdível".

Retorne APENAS um JSON válido neste formato exato:
{"pitches":[
  {"label":"Curto e direto","text":"..."},
  {"label":"Editorial e descritivo","text":"..."},
  {"label":"Foco em estilo de vida","text":"..."}
]}

Cada texto entre 60 e 120 palavras. Sem markdown, sem emojis.`;

      const raw = await window.claude.complete(prompt);
      const json = JSON.parse(raw.replace(/```json\n?|```\n?/g, '').trim());
      update({ pitches: json.pitches || [] });
    } catch (err) {
      console.error(err);
      setError('Não consegui gerar agora. Tente novamente em alguns segundos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(201,150,14,0.12)', color: 'var(--navy)',
          padding: '5px 12px', borderRadius: 999, marginBottom: 12,
          fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase' }}>
          ✦ Assistente VN Prime · IA
        </div>
        <h2 style={{ margin: 0 }}>Pitch perfeito, gerado para você</h2>
        <p style={{ color: 'var(--fg-2)', marginTop: 6 }}>
          Nossa IA cria três versões com base nos seus dados. Escolha a que mais combina, edite se quiser.
        </p>
      </div>

      {data.pitches.length === 0 && !loading && (
        <div style={{
          background: 'var(--gradient-navy-hero)', color: '#fff',
          borderRadius: 14, padding: '28px 30px', textAlign: 'center',
          backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(201,150,14,0.22), transparent 60%), var(--gradient-navy-hero)',
        }}>
          <div style={{ fontSize: 38, color: 'var(--gold-soft)', marginBottom: 10 }}>✦</div>
          <h3 style={{ color: '#fff', margin: '0 0 8px' }}>Pronto para gerar 3 pitches?</h3>
          <p style={{ color: 'rgba(250,249,246,0.85)', margin: '0 auto 18px', maxWidth: 440, fontSize: 14 }}>
            Vamos cruzar os dados do seu imóvel com as melhores práticas de copywriting do mercado de alto padrão.
          </p>
          <Btn variant="accent" onClick={() => generate('pack')}>✦ Gerar pitches</Btn>
        </div>
      )}

      {loading && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14,
          padding: '40px 24px', textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999, margin: '0 auto 14px',
            border: '3px solid rgba(201,150,14,0.2)', borderTopColor: 'var(--gold)',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ fontFamily: 'Playfair Display', fontSize: 17, color: 'var(--navy)' }}>
            Escrevendo seus pitches...
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 4 }}>
            Levamos cerca de 8 segundos
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ background: '#FEF3C7', color: '#92400E', padding: 14, borderRadius: 8,
          fontFamily: 'DM Sans', fontSize: 13 }}>
          {error} <button onClick={() => generate('pack')} style={{ background: 'none',
            border: 'none', color: '#92400E', textDecoration: 'underline', cursor: 'pointer',
            fontFamily: 'inherit' }}>Tentar de novo</button>
        </div>
      )}

      {data.pitches.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.pitches.map((p, i) => {
            const selected = data.pitchEscolhido === p.text;
            return (
              <div key={i}
                onClick={() => update({ pitchEscolhido: p.text, descricao: p.text })}
                style={{
                  background: selected ? 'rgba(201,150,14,0.06)' : '#fff',
                  border: selected ? '2px solid var(--gold)' : '1px solid var(--border)',
                  borderRadius: 12, padding: '18px 22px', cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--gold)' }}>{p.label}</div>
                  {selected && <Pill tone="gold" solid>Escolhido</Pill>}
                </div>
                <p style={{ margin: 0, color: 'var(--fg-1)', fontSize: 14, lineHeight: 1.65 }}>
                  {p.text}
                </p>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Btn variant="ghost" size="sm" onClick={() => generate('pack')}>↻ Gerar outras 3 versões</Btn>
          </div>

          {data.pitchEscolhido && (
            <div style={{ marginTop: 8 }}>
              <FieldLabel label="Edite se quiser (opcional)">
                <textarea value={data.descricao}
                  onChange={(e) => update({ descricao: e.target.value })}
                  style={{ ...fullInput, minHeight: 130, resize: 'vertical', lineHeight: 1.6 }} />
              </FieldLabel>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PLANOS = [
  {
    id: 'direta',
    label: 'Venda Direta',
    pct: 'R$ 197',
    pctSub: 'taxa fixa · 90 dias · sem comissão',
    desc: 'Você publica e conduz tudo. Paga uma vez e fica com 100% do valor da venda.',
    bullets: ['Anúncio na vitrine por 90 dias', 'IA para descrição do imóvel', 'Tutorial de fotos + filtro editorial', '30 dias grátis FactorOne', 'Pacotes de foto como add-on'],
    cta: 'Publicar por R$ 197',
    accent: 'var(--navy)',
    featured: false,
  },
  {
    id: '3',
    label: 'Venda Assistida',
    pct: '3%',
    pctSub: 'sobre o valor da venda',
    desc: 'Você conduz as visitas. A VN Prime apoia com IA e curadoria. Paga só quando vender.',
    bullets: ['Tudo da Venda Direta', 'Suporte da curadoria VN Prime', 'BOOSTER disponível', '30 dias grátis FactorOne', 'Pacotes de foto como add-on'],
    cta: 'Publicar com 3%',
    accent: 'var(--gold)',
    featured: true,
  },
  {
    id: '6',
    label: 'Venda Completa',
    pct: '6%',
    pctSub: 'sobre o valor da venda',
    desc: 'A VN Prime assume tudo. Corretor parceiro dedicado conduz visitas, negociação e documentação.',
    bullets: ['Tudo do plano 3%', 'Corretor parceiro dedicado', 'Visitas e negociação coordenadas', 'Suporte jurídico e documental', '30 dias grátis FactorOne'],
    cta: 'Publicar com 6%',
    accent: 'var(--navy)',
    featured: false,
  },
];

function StepPublish({ data, update, onNav }) {
  const [submitted, setSubmitted] = useState(false);
  const [terms, setTerms] = useState(false);

  const handlePublish = () => {
    if (!data.plano) return;
    if (!terms) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: 68, height: 68, borderRadius: 999, margin: '0 auto 18px',
          background: 'rgba(201,150,14,0.15)', color: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, fontWeight: 700,
        }}>✓</div>
        <h2 style={{ margin: '0 0 10px' }}>Imóvel enviado para curadoria!</h2>
        <p style={{ color: 'var(--fg-2)', maxWidth: 420, margin: '0 auto 24px', fontSize: 14, lineHeight: 1.6 }}>
          Nossa equipe valida fotos e descrição em até 24h. Após aprovação, seu imóvel entra na vitrine VN Prime.
          Você receberá os leads direto no WhatsApp <strong>{data.whatsapp || '—'}</strong>.
        </p>
        <div style={{ display: 'inline-flex', gap: 10 }}>
          <Btn variant="ghost" onClick={() => onNav('home')}>Ir para o início</Btn>
          <Btn variant="accent" onClick={() => onNav('portal')}>Acompanhar no portal</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h2 style={{ margin: 0 }}>Escolha seu plano de venda</h2>
        <p style={{ color: 'var(--fg-2)', margin: '6px 0 0' }}>
          Venda Direta: taxa fixa R$ 197. Assistida e Completa: comissão <strong>só quando vender</strong>. Todos incluem 30 dias grátis de gestão financeira FactorOne.
        </p>
      </div>

      {/* Preview do imóvel */}
      <div style={{ background: 'var(--cream)', borderRadius: 12, padding: 18, border: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 10 }}>Resumo do anúncio</div>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14, alignItems: 'center' }}>
          <div style={{
            height: 100, borderRadius: 8,
            background: data.fotos[0] ? `url(${data.fotos[0]}) center/cover` : 'rgba(15,34,68,0.08)',
            filter: 'brightness(1.04) contrast(1.04) saturate(1.08)',
          }} />
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 700,
              color: 'var(--gold)', lineHeight: 1, marginBottom: 4 }}>
              {data.preco ? fmtBRL(+data.preco) : 'R$ —'}
            </div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 15, color: 'var(--navy)', fontWeight: 600 }}>
              {data.titulo || 'Título do imóvel'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 4 }}>
              {data.bairro || '—'} · {data.tipo} · {data.area || '—'} m²
            </div>
          </div>
        </div>
      </div>

      {/* Seleção de plano */}
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {PLANOS.map(p => {
          const sel = data.plano === p.id;
          return (
            <div key={p.id} onClick={() => update({ plano: p.id })} style={{
              border: sel ? `2px solid ${p.accent}` : '1px solid var(--border)',
              borderRadius: 16, padding: '22px 20px', cursor: 'pointer',
              background: sel ? (p.featured ? 'rgba(201,150,14,0.06)' : 'rgba(15,34,68,0.03)') : '#fff',
              boxShadow: sel && p.featured ? '0 8px 30px rgba(201,150,14,0.15)' : 'none',
              position: 'relative', transition: 'all 0.18s ease',
            }}>
              {p.featured && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'DM Sans',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '3px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                }}>Mais escolhido</div>
              )}
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: p.accent, marginBottom: 8 }}>{p.label}</div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 36, fontWeight: 700,
                color: 'var(--navy)', lineHeight: 1, marginBottom: 4 }}>{p.pct}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 12 }}>{p.pctSub}</div>
              <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: '0 0 12px', lineHeight: 1.5 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {p.bullets.map(b => (
                  <li key={b} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--fg-1)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>✓</span>{b}
                  </li>
                ))}
              </ul>
              {sel && (
                <div style={{ marginTop: 14, padding: '6px 12px', background: p.accent,
                  color: p.featured ? 'var(--navy)' : '#fff', borderRadius: 8,
                  fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                  ✓ Selecionado
                </div>
              )}
            </div>
          );
        })}
      </div>

      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'DM Sans', fontSize: 13, color: 'var(--fg-2)', cursor: 'pointer' }}>
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
          style={{ accentColor: 'var(--gold)', width: 16, height: 16 }} />
        Aceito os <a href="#" style={{ color: 'var(--gold)' }}>termos de uso</a> e a política de curadoria VN Prime
      </label>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn variant="accent" size="lg"
          onClick={handlePublish}
          style={{ opacity: data.plano && terms ? 1 : 0.45, cursor: data.plano && terms ? 'pointer' : 'not-allowed' }}>
          {data.plano ? PLANOS.find(p => p.id === data.plano)?.cta : 'Selecione um plano'}
        </Btn>
      </div>
    </div>
  );
}

function FieldLabel({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>{label}</span>
      {children}
    </label>
  );
}

const fullInput = {
  fontFamily: 'DM Sans', fontSize: 14, color: 'var(--navy)',
  border: '1px solid var(--border)', borderRadius: 8,
  padding: '0.75rem 0.9rem', background: 'var(--cream)', outline: 'none',
  width: '100%',
};

Object.assign(window, { AnunciarPage });
