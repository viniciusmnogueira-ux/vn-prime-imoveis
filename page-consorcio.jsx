// Consórcio Imobiliário — VN Prime
// Rota: consorcio | Exporta: window.ConsorcioPage

(function () {

const CONS_GREEN  = '#059669';
const CONS_LIME   = '#6ee7b7';
const CONS_GOLD   = 'var(--gold)';

function fmtBRL(n) {
  if (!n && n !== 0) return '—';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

// ─── Wizard 5 passos ─────────────────────────────────────────────────────────
function ConsWizard() {
  const [step, setStep]       = React.useState(1);
  const [cat,  setCat]        = React.useState(null);
  const [valor, setValor]     = React.useState(500000);
  const [prazo, setPrazo]     = React.useState(120);
  const [dados, setDados]     = React.useState({ nome: '', tel: '', email: '' });
  const [sent,  setSent]      = React.useState(false);

  const taxaAdm = 0.16;
  const parcela  = Math.round(valor * (1 + taxaAdm) / prazo);
  const economia = Math.round(valor * 0.72);

  const cats = [
    {
      id: 'imovel', label: 'Imóvel',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
    },
    {
      id: 'veiculo', label: 'Veículo',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-4h8l2 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"/>
          <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
        </svg>
      ),
    },
    {
      id: 'outros', label: 'Outros bens',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
        </svg>
      ),
    },
  ];

  const catMax = cat === 'veiculo' ? 350000 : cat === 'outros' ? 200000 : 2000000;
  const catMin = cat === 'veiculo' ? 30000  : cat === 'outros' ? 10000  : 100000;
  const catStep = cat === 'veiculo' ? 10000 : cat === 'outros' ? 5000   : 50000;

  const inputSt = {
    width: '100%', marginBottom: 10, padding: '10px 14px',
    borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.07)', color: '#fff',
    fontFamily: 'DM Sans', fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
  };

  const nextBtn = (label, onClick, disabled) => (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '12px', background: disabled ? 'rgba(5,150,105,0.35)' : CONS_GREEN,
      color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'DM Sans',
      fontWeight: 700, fontSize: 14, cursor: disabled ? 'default' : 'pointer', marginTop: 4,
    }}>{label}</button>
  );

  const backBtn = (toStep) => (
    <button onClick={() => setStep(toStep)} style={{
      background: 'transparent', color: 'rgba(250,249,246,0.45)', border: 'none',
      fontFamily: 'DM Sans', fontSize: 12, cursor: 'pointer', padding: '6px 0', display: 'block',
    }}>← Voltar</button>
  );

  const progress = sent ? 100 : ((step - 1) / 4) * 100;

  return (
    <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, padding: 28 }}>

      {/* Header + progress */}
      <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: CONS_LIME, marginBottom: 12 }}>
        Simulador inteligente
      </div>
      <div style={{ fontFamily: 'DM Sans', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
        {sent ? 'Proposta enviada!' : 'Monte seu consórcio ideal'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 10.5, color: 'rgba(250,249,246,0.45)', fontFamily: 'DM Sans' }}>
          {sent ? 'Concluído' : `PASSO ${step} DE 5`}
        </span>
        <span style={{ fontSize: 10.5, color: 'rgba(250,249,246,0.45)', fontFamily: 'DM Sans' }}>
          {Math.round(progress)}% concluído
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, marginBottom: 22 }}>
        <div style={{ height: '100%', borderRadius: 99, background: CONS_GREEN,
          width: progress + '%', transition: 'width 0.35s ease' }} />
      </div>

      {/* Step 1 — categoria */}
      {!sent && step === 1 && (
        <div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 14.5, fontWeight: 600, color: 'rgba(250,249,246,0.9)', marginBottom: 16 }}>
            O que você quer consoriar?
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => { setCat(c.id); if (c.id !== 'imovel') setValor(c.id === 'veiculo' ? 80000 : 30000); setStep(2); }}
                style={{ flex: 1, padding: '16px 8px', borderRadius: 12, textAlign: 'center',
                  border: `1.5px solid ${cat === c.id ? CONS_GREEN : 'rgba(255,255,255,0.14)'}`,
                  background: cat === c.id ? `rgba(5,150,105,0.2)` : 'rgba(255,255,255,0.04)',
                  color: '#fff', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600,
                  fontSize: 12.5, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = CONS_GREEN; e.currentTarget.style.background = 'rgba(5,150,105,0.15)'; }}
                onMouseLeave={e => { if (cat !== c.id) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}>
                <div style={{ color: CONS_LIME, marginBottom: 8 }}>{c.icon}</div>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — valor */}
      {!sent && step === 2 && (
        <div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 14.5, fontWeight: 600, color: 'rgba(250,249,246,0.9)', marginBottom: 14 }}>
            Qual o valor da carta?
          </div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 700,
            color: '#fcd34d', lineHeight: 1, marginBottom: 14 }}>{fmtBRL(valor)}</div>
          <input type="range" min={catMin} max={catMax} step={catStep}
            value={Math.min(valor, catMax)} onChange={e => setValor(+e.target.value)}
            style={{ width: '100%', accentColor: CONS_GREEN, marginBottom: 6 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11,
            color: 'rgba(250,249,246,0.4)', marginBottom: 20, fontFamily: 'DM Sans' }}>
            <span>{fmtBRL(catMin)}</span><span>{fmtBRL(catMax)}</span>
          </div>
          {nextBtn('Continuar →', () => setStep(3))}
          {backBtn(1)}
        </div>
      )}

      {/* Step 3 — prazo + preview */}
      {!sent && step === 3 && (
        <div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 14.5, fontWeight: 600, color: 'rgba(250,249,246,0.9)', marginBottom: 14 }}>
            Escolha o prazo
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[60, 84, 120, 180].map(p => (
              <button key={p} onClick={() => setPrazo(p)} style={{
                padding: '12px 8px', borderRadius: 10, border: `1.5px solid ${prazo === p ? CONS_GREEN : 'rgba(255,255,255,0.15)'}`,
                background: prazo === p ? `rgba(5,150,105,0.25)` : 'rgba(255,255,255,0.05)',
                color: '#fff', cursor: 'pointer', fontFamily: 'DM Sans',
                fontWeight: prazo === p ? 700 : 500, fontSize: 13, textAlign: 'center',
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: prazo === p ? CONS_LIME : '#fff' }}>{p}</div>
                <div style={{ fontSize: 10, color: 'rgba(250,249,246,0.5)', marginTop: 2 }}>meses · {Math.round(p/12)} anos</div>
              </button>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(250,249,246,0.55)', fontFamily: 'DM Sans' }}>Parcela estimada</span>
              <span style={{ fontFamily: 'Playfair Display', fontSize: 17, fontWeight: 700, color: CONS_LIME }}>{fmtBRL(parcela)}/mês</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'rgba(250,249,246,0.55)', fontFamily: 'DM Sans' }}>Economia vs. financiamento</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fcd34d', fontFamily: 'DM Sans' }}>~{fmtBRL(economia)}</span>
            </div>
          </div>
          {nextBtn('Continuar →', () => setStep(4))}
          {backBtn(2)}
        </div>
      )}

      {/* Step 4 — dados */}
      {!sent && step === 4 && (
        <div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 14.5, fontWeight: 600, color: 'rgba(250,249,246,0.9)', marginBottom: 14 }}>
            Seus dados para a proposta
          </div>
          {[['nome','Nome completo','text'],['tel','WhatsApp / Telefone','tel'],['email','E-mail','email']].map(([k,ph,t]) => (
            <input key={k} type={t} placeholder={ph} value={dados[k]}
              onChange={e => setDados(d => ({ ...d, [k]: e.target.value }))}
              style={inputSt} />
          ))}
          {nextBtn('Receber proposta →', () => setSent(true), !dados.nome || !dados.tel)}
          {backBtn(3)}
        </div>
      )}

      {/* Step 5 — confirmação */}
      {sent && (
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: CONS_GREEN,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', fontSize: 22, color: '#fff', fontWeight: 700 }}>✓</div>
          <p style={{ color: 'rgba(250,249,246,0.75)', fontSize: 13.5, margin: '0 0 18px', lineHeight: 1.65 }}>
            Um consultor VN Prime entrará em contato em até 24h com sua proposta personalizada.
          </p>
          <div style={{ background: `rgba(5,150,105,0.15)`, border: `1px solid rgba(5,150,105,0.35)`,
            borderRadius: 10, padding: '10px 16px', fontSize: 12.5, color: CONS_LIME, fontWeight: 600 }}>
            Parceiro oficial Ademicon · Regulamentado BACEN
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function ConsHero({ onNav }) {
  const stats = [
    { val: '0%',     lbl: 'de juros — nunca' },
    { val: '200+',   lbl: 'consorciados em BH' },
    { val: '100%',   lbl: 'carta de crédito nominal' },
    { val: '12 anos',lbl: 'prazo máximo disponível' },
  ];
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--gradient-navy-hero)', color: '#fff',
      padding: 'clamp(3.5rem, 8vw, 5.5rem) 0 clamp(3rem, 6vw, 4rem)',
    }}>
      <div style={{ position: 'absolute', top: -160, right: -120, width: 560, height: 560,
        background: 'radial-gradient(circle, rgba(5,150,105,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(201,150,14,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 48, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>

          {/* Copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(5,150,105,0.18)', border: '1px solid rgba(5,150,105,0.4)',
              borderRadius: 999, padding: '5px 14px', marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: CONS_GREEN, display: 'inline-block' }} />
              <span style={{ fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: CONS_LIME }}>
                Consórcio sem juros · Administrado por especialistas
              </span>
            </div>
            <h1 style={{ color: '#fff', margin: '0 0 18px', fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', lineHeight: 1.12 }}>
              Realize seu{' '}
              <em style={{ background: 'linear-gradient(135deg, #fcd34d, var(--gold))',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic' }}>
                próximo grande
              </em>{' '}
              <span style={{ color: 'rgba(250,249,246,0.92)' }}>patrimônio.</span>
            </h1>
            <p style={{ color: 'rgba(250,249,246,0.78)', fontSize: 16, lineHeight: 1.75, margin: '0 0 28px', maxWidth: 500 }}>
              Compre imóveis, veículos e muito mais sem pagar juros. O consórcio é a forma mais
              inteligente de adquirir bens de alto valor — e a VN Prime cuida de tudo para você,
              da simulação ao contemplado.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => {
                const el = document.getElementById('cons-como-funciona');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} style={{
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: '1px solid rgba(250,249,246,0.3)', borderRadius: 10, cursor: 'pointer',
                padding: '0.9rem 1.5rem', fontFamily: 'DM Sans', fontWeight: 600, fontSize: 15 }}>
                Como funciona
              </button>
              <a href="https://wa.me/5531984144250?text=Ol%C3%A1!%20Tenho%20interesse%20em%20cons%C3%B3rcio%20imobili%C3%A1rio%20pela%20VN%20Prime."
                target="_blank" rel="noopener noreferrer"
                style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                  padding: '0.9rem 1.4rem', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.117 1.522 5.846L0 24l6.335-1.506A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.497-5.187-1.362l-.371-.22-3.762.895.939-3.652-.241-.383A9.974 9.974 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Wizard */}
          <ConsWizard />
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          marginTop: 44, background: 'rgba(255,255,255,0.06)', borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '18px 20px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                color: CONS_LIME, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(250,249,246,0.6)' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Como funciona ────────────────────────────────────────────────────────────
function ConsComoFunciona() {
  const passos = [
    { num: '01', color: CONS_GREEN,  title: 'Você entra no grupo',    desc: 'Um grupo de consorciados se reúne com o mesmo objetivo. Cada um contribui mensalmente para o fundo coletivo.' },
    { num: '02', color: CONS_GOLD,   title: 'Assembleias mensais',    desc: 'Todo mês há sorteio entre os participantes. Você também pode ofertar um lance maior para antecipar sua contemplação.' },
    { num: '03', color: '#6366F1',   title: 'Contemplação',           desc: 'Ao ser contemplado — por sorteio ou lance — você recebe a carta de crédito no valor total contratado.' },
    { num: '04', color: '#B87333',   title: 'Compra o bem',           desc: 'Com a carta em mãos, você compra imóvel, veículo ou outros bens — novo, usado, lote ou na planta.' },
  ];
  return (
    <section id="cons-como-funciona" style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 60px' }}>
          <Eyebrow color={CONS_GREEN}>Entenda de vez</Eyebrow>
          <h2 style={{ margin: '8px 0 16px', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>Como funciona o consórcio</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.75 }}>
            Sem juros, sem burocracia de banco. Um modelo coletivo e transparente — regulamentado pelo Banco Central desde 1991.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {passos.map((p) => (
            <div key={p.num} style={{ background: 'var(--cream)', borderRadius: 18, padding: '32px 26px',
              border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 18, fontFamily: 'Cinzel, serif', fontSize: 64,
                fontWeight: 700, color: 'rgba(15,34,68,0.04)', lineHeight: 1, userSelect: 'none' }}>{p.num}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: p.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                color: p.color === CONS_GOLD ? 'var(--navy)' : '#fff',
                fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700 }}>{p.num}</div>
              <h3 style={{ margin: '0 0 10px', fontSize: 18, color: 'var(--navy)' }}>{p.title}</h3>
              <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ margin: '48px 0 0', background: 'var(--cream)', borderRadius: 16, padding: '28px 32px', border: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 18 }}>Linha do tempo — prazo 120 meses</div>
          <div style={{ position: 'relative', height: 12, background: 'rgba(15,34,68,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
            {[[15,'#059669'],[60,'rgba(201,150,14,0.6)'],[25,'var(--navy)']].reduce((acc, [w, color], i, arr) => {
              const left = arr.slice(0,i).reduce((s,[x]) => s+x, 0);
              acc.push(<div key={i} style={{ position: 'absolute', top:0, bottom:0, left:left+'%', width:w+'%', background:color }} />);
              return acc;
            }, [])}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[['#059669','Entrada (1–3 meses)'],['rgba(201,150,14,0.7)','Parcelas mensais'],['var(--navy)','Pós-contemplação']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--fg-2)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Consórcio vs Financiamento ───────────────────────────────────────────────
function ConsVsFinanciamento() {
  const rows = [
    { label: 'Juros',            cons: 'Zero',                 fin: '10–12% a.a.',         winCons: true },
    { label: 'Custo adicional',  cons: 'Taxa adm. ~16%',       fin: 'Juros totais 70–120%', winCons: true },
    { label: 'Velocidade',       cons: 'Sorteio / lance',       fin: 'Imediato',             winCons: false },
    { label: 'Entrada',          cons: 'Não obrigatória',       fin: '20–30% exigida',       winCons: true },
    { label: 'Aprovação',        cons: 'Simples (sem score)',   fin: 'Depende de score',     winCons: true },
    { label: 'Flexibilidade',    cons: 'Imóveis, veículos etc.','fin': 'Imóvel aprovado',    winCons: true },
  ];
  return (
    <section style={{ background: 'var(--cream)', padding: 'clamp(3.5rem, 7vw, 5.5rem) 0' }}>
      <div style={{ width: 'min(900px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow color={CONS_GREEN}>Comparativo</Eyebrow>
          <h2 style={{ margin: '8px 0 12px' }}>Consórcio vs. Financiamento</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, margin: 0 }}>Entenda as diferenças antes de decidir.</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(15,34,68,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div style={{ padding: '16px 24px', background: 'var(--cream)', borderBottom: '1px solid var(--border)' }} />
            <div style={{ padding: '16px 24px', background: 'rgba(5,150,105,0.08)', borderLeft: '1px solid var(--border)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: 13, color: CONS_GREEN, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Consórcio</div>
            </div>
            <div style={{ padding: '16px 24px', background: 'rgba(220,38,38,0.04)', borderLeft: '1px solid var(--border)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: 13, color: '#dc2626', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Financiamento</div>
            </div>
          </div>
          {rows.map((row, i) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < rows.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '16px 24px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13.5, color: 'var(--navy)', background: 'var(--cream)' }}>{row.label}</div>
              <div style={{ padding: '16px 24px', background: row.winCons ? 'rgba(5,150,105,0.06)' : '#fff', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {row.winCons && <span style={{ color: CONS_GREEN, fontWeight: 700, fontSize: 13 }}>✓</span>}
                <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: row.winCons ? CONS_GREEN : 'var(--navy)', fontWeight: row.winCons ? 600 : 400 }}>{row.cons}</span>
              </div>
              <div style={{ padding: '16px 24px', background: '#fff', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {!row.winCons && <span style={{ color: CONS_GREEN, fontWeight: 700, fontSize: 13 }}>✓</span>}
                <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: !row.winCons ? CONS_GREEN : 'var(--fg-2)' }}>{row.fin}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--fg-2)', marginTop: 20 }}>
          O consórcio é ideal para quem tem tempo e disciplina financeira. O financiamento é indicado para quem precisa do bem imediatamente.
        </p>
      </div>
    </section>
  );
}

// ─── Fotos ────────────────────────────────────────────────────────────────────
function ConsFotos() {
  const imgs = [
    { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', label: 'Apartamento · BH e região', size: '120 m²' },
    { url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80', label: 'Casa · BH e região',     size: '420 m²' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', label: 'Cobertura · BH e região',    size: '280 m²' },
    { url: 'https://images.unsplash.com/photo-1613977257363-707e934c7d2f?w=800&q=80', label: 'Casa · BH e região',     size: '560 m²' },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', label: 'Apartamento · BH e região',size: '160 m²' },
    { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', label: 'Penthouse · BH e região',  size: '320 m²' },
  ];
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Eyebrow color={CONS_GOLD}>Portfólio contemplado</Eyebrow>
          <h2 style={{ margin: '8px 0 12px' }}>Imóveis comprados via consórcio VN Prime</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, margin: 0 }}>Clientes que usaram a carta de crédito para adquirir o imóvel dos sonhos.</p>
        </div>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {imgs.map((img, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 8px 28px rgba(15,34,68,0.12)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ height: 200, backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(10,24,48,0.85))', padding: '28px 16px 14px' }}>
                <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 13.5, color: '#fff' }}>{img.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,249,246,0.65)' }}>{img.size} · Contemplado via consórcio</div>
              </div>
              <div style={{ position: 'absolute', top: 12, left: 12, background: CONS_GREEN, color: '#fff',
                borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700 }}>Contemplado</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quiz profissional ────────────────────────────────────────────────────────
function ConsQuiz() {
  const STEPS = [
    {
      id: 'renda', q: 'Qual é a sua renda mensal?',
      hint: 'Usamos para calcular a parcela ideal sem comprometer suas finanças.',
      opts: [
        { txt: 'Até R$ 3.000',         val: 'ate3k' },
        { txt: 'R$ 3.000 – R$ 6.000',  val: '3k6k' },
        { txt: 'R$ 6.000 – R$ 12.000', val: '6k12k' },
        { txt: 'Acima de R$ 12.000',   val: 'acima12k' },
      ],
    },
    {
      id: 'objetivo', q: 'Qual o seu objetivo com o consórcio?',
      hint: 'Entendendo seu objetivo, conectamos você ao plano mais adequado.',
      opts: [
        { txt: 'Comprar meu primeiro imóvel',    val: 'primeiro' },
        { txt: 'Investimento / segundo imóvel',  val: 'investimento' },
        { txt: 'Trocar de imóvel atual',         val: 'trocar' },
        { txt: 'Construir ou reformar',          val: 'reforma' },
      ],
    },
    {
      id: 'valor', q: 'Qual faixa de crédito você busca?',
      hint: 'A carta de crédito cobre 100% do valor do bem no momento da contemplação.',
      opts: [
        { txt: 'R$ 100k – R$ 300k',   val: '100_300' },
        { txt: 'R$ 300k – R$ 600k',   val: '300_600' },
        { txt: 'R$ 600k – R$ 1,2M',   val: '600_1200' },
        { txt: 'Acima de R$ 1,2M',    val: 'acima1200' },
      ],
    },
    {
      id: 'urgencia', q: 'Quando você precisaria ser contemplado?',
      hint: 'Você pode antecipar com lance — falaremos sobre estratégias.',
      opts: [
        { txt: 'Posso aguardar 2+ anos',         val: 'aguardar' },
        { txt: 'Entre 1 e 2 anos',               val: '1a2anos' },
        { txt: 'Em até 12 meses (lance)',         val: '12meses' },
        { txt: 'Não tenho pressa definida',       val: 'sempressa' },
      ],
    },
    {
      id: 'situacao', q: 'Como está sua situação atual?',
      hint: 'Informação confidencial — usada apenas para qualificar a proposta.',
      opts: [
        { txt: 'Nunca fiz consórcio',              val: 'nunca' },
        { txt: 'Tenho ou tive outro consórcio',    val: 'tem' },
        { txt: 'Estou pesquisando opções',         val: 'pesquisando' },
        { txt: 'Quero substituir um financiamento',val: 'substituir' },
      ],
    },
  ];

  const [step, setStep]       = React.useState(0);
  const [respostas, setResp]  = React.useState({});
  const [contato, setContato] = React.useState({ nome: '', tel: '', email: '' });
  const [done, setDone]       = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const pick = (val) => {
    const next = { ...respostas, [STEPS[step].id]: val };
    setResp(next);
    if (step + 1 >= STEPS.length) { setShowForm(true); }
    else setStep(step + 1);
  };

  const totalSteps = STEPS.length + 1; // +1 for contact form
  const progress = showForm ? 100 : ((step / STEPS.length) * 90);

  const inputSt = {
    width: '100%', marginBottom: 10, padding: '12px 16px',
    borderRadius: 10, border: '1.5px solid var(--border)',
    background: '#fff', color: 'var(--navy)',
    fontFamily: 'DM Sans', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  };

  const getRec = () => {
    const v = respostas.valor;
    if (v === 'acima1200') return { credito: 'R$ 1,2M+', prazo: '180 meses', parcela: 'a partir de R$ 8.900/mês' };
    if (v === '600_1200')  return { credito: 'R$ 600k – R$ 1,2M', prazo: '120 meses', parcela: 'a partir de R$ 5.600/mês' };
    if (v === '300_600')   return { credito: 'R$ 300k – R$ 600k', prazo: '120 meses', parcela: 'a partir de R$ 2.800/mês' };
    return { credito: 'R$ 100k – R$ 300k', prazo: '84 meses', parcela: 'a partir de R$ 1.400/mês' };
  };

  return (
    <section style={{ padding: 'clamp(3.5rem, 7vw, 5.5rem) 0',
      background: 'linear-gradient(135deg, #F9F5EE 0%, #FEF9F0 50%, #F9F5EE 100%)',
      borderTop: '1px solid #e8dfc8', borderBottom: '1px solid #e8dfc8',
      position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(201,150,14,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ width: 'min(680px, 92vw)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,150,14,0.12)', border: '1px solid rgba(201,150,14,0.3)',
            borderRadius: 999, padding: '5px 16px', marginBottom: 14 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Quiz · {STEPS.length} perguntas
            </span>
          </div>
          <h2 style={{ margin: '0 0 10px', color: 'var(--navy)', fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' }}>
            Descubra seu plano ideal
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, margin: 0 }}>
            Responda em 1 minuto e receba uma proposta personalizada.
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 22, padding: '32px 30px',
          boxShadow: '0 12px 48px rgba(15,34,68,0.10)', border: '1px solid #f0e8d0' }}>

          {/* Progress bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-2)', fontFamily: 'DM Sans' }}>
              {showForm ? 'Quase lá!' : `Pergunta ${step + 1} de ${STEPS.length}`}
            </span>
            <span style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'DM Sans', fontWeight: 600 }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: 5, background: '#f0e8d0', borderRadius: 99, marginBottom: 28 }}>
            <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, var(--gold), #fcd34d)',
              width: progress + '%', transition: 'width 0.4s ease' }} />
          </div>

          {!showForm && !done && (
            <div>
              {STEPS[step].hint && (
                <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 14, fontFamily: 'DM Sans',
                  padding: '8px 12px', background: '#f9f5ee', borderRadius: 8 }}>
                  💡 {STEPS[step].hint}
                </div>
              )}
              <h3 style={{ margin: '0 0 20px', color: 'var(--navy)', fontSize: 18, lineHeight: 1.35 }}>
                {STEPS[step].q}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {STEPS[step].opts.map((opt, i) => (
                  <button key={i} onClick={() => pick(opt.val)} style={{
                    width: '100%', padding: '14px 18px', textAlign: 'left',
                    background: '#fff', border: '1.5px solid var(--border)',
                    borderRadius: 12, color: 'var(--navy)', fontFamily: 'DM Sans',
                    fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='#fef9f0'; e.currentTarget.style.borderColor='var(--gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='var(--border)'; }}>
                    <span>{opt.txt}</span>
                    <span style={{ color: 'var(--border)', fontSize: 16 }}>→</span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{
                  marginTop: 14, background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans', fontSize: 12, color: 'var(--fg-2)', padding: 0,
                }}>← Voltar</button>
              )}
            </div>
          )}

          {showForm && !done && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(201,150,14,0.12)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎯</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>Pré-análise pronta!</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>Com base no seu perfil, estimamos:</div>
                  </div>
                </div>
                {(() => { const r = getRec(); return (
                  <div style={{ background: '#f9f5ee', borderRadius: 12, padding: '14px 16px',
                    border: '1px solid #e8dfc8', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[['Crédito sugerido', r.credito], ['Prazo ideal', r.prazo], ['Parcela estimada', r.parcela]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 11, color: 'var(--fg-2)', fontWeight: 600,
                          letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</div>
                        <div style={{ fontFamily: 'Playfair Display', fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                ); })()}
              </div>
              <h3 style={{ margin: '0 0 6px', color: 'var(--navy)', fontSize: 16 }}>
                Para onde enviamos sua proposta?
              </h3>
              <p style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 16 }}>
                Um consultor entra em contato em até 2h úteis.
              </p>
              <input type="text" placeholder="Seu nome completo" value={contato.nome}
                onChange={e => setContato(c => ({ ...c, nome: e.target.value }))} style={inputSt} />
              <input type="tel" placeholder="WhatsApp (com DDD)" value={contato.tel}
                onChange={e => setContato(c => ({ ...c, tel: e.target.value }))} style={inputSt} />
              <input type="email" placeholder="E-mail" value={contato.email}
                onChange={e => setContato(c => ({ ...c, email: e.target.value }))} style={inputSt} />
              <button onClick={() => setDone(true)}
                disabled={!contato.nome || !contato.tel}
                style={{
                  width: '100%', padding: '14px', background: contato.nome && contato.tel ? CONS_GREEN : '#ccc',
                  color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'DM Sans',
                  fontWeight: 700, fontSize: 15, cursor: contato.nome && contato.tel ? 'pointer' : 'default',
                  marginTop: 4, transition: 'background 0.2s',
                }}>
                Receber proposta personalizada →
              </button>
              <p style={{ fontSize: 11, color: 'var(--fg-2)', textAlign: 'center', marginTop: 10 }}>
                Parceiro oficial Ademicon · Regulamentado BACEN · Sem compromisso
              </p>
            </div>
          )}

          {done && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: CONS_GREEN,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', fontSize: 28, color: '#fff', fontWeight: 700 }}>✓</div>
              <h3 style={{ color: 'var(--navy)', margin: '0 0 10px', fontSize: 20 }}>
                Proposta a caminho!
              </h3>
              <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' }}>
                Um consultor VN Prime entrará em contato em até 2h com sua proposta personalizada.
                Fique de olho no WhatsApp.
              </p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 10, padding: '10px 16px', fontSize: 12.5, color: '#15803d', fontWeight: 600 }}>
                Parceiro oficial Ademicon · Regulamentado BACEN
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


// ─── FAQ ──────────────────────────────────────────────────────────────────────
function ConsFAQ() {
  const [open, setOpen] = React.useState(null);
  const faqs = [
    { q: 'Posso ser contemplado logo no início?',    a: 'Sim. Nos primeiros meses já há sorteios. Além disso, você pode ofertar um lance de até 30% da carta para antecipar sua contemplação.' },
    { q: 'O que é taxa de administração?',           a: 'É a remuneração da administradora (Ademicon) pelo gerenciamento do grupo. Fica em torno de 16% diluído ao longo do prazo — muito menor que juros bancários.' },
    { q: 'Posso usar a carta em qualquer bem?',      a: 'Imóvel residencial, comercial, lote, na planta, veículo ou outros bens — em qualquer lugar do Brasil. Novo ou usado.' },
    { q: 'E se eu quiser desistir?',                 a: 'Você pode sair do grupo a qualquer momento. O valor pago é devolvido com correção, participando dos sorteios de desistentes.' },
    { q: 'A Ademicon é segura?',                     a: 'Sim. Regulamentada pelo Banco Central e ativa há mais de 30 anos. É a maior administradora de consórcios do Brasil.' },
    { q: 'Como funciona o lance?',                   a: 'Um lance é uma oferta de pagamento antecipado de parcelas. O maior lance vence a contemplação do mês.' },
  ];
  return (
    <section style={{ padding: 'clamp(3.5rem, 7vw, 5.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(800px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow color={CONS_GOLD}>Dúvidas frequentes</Eyebrow>
          <h2 style={{ margin: '8px 0 12px' }}>Perguntas e respostas</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: 12, background: open === i ? 'rgba(201,150,14,0.05)' : '#fff',
                border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14.5, color: 'var(--navy)' }}>{faq.q}</span>
                <span style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 300, flexShrink: 0,
                  transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 20px 16px', fontFamily: 'DM Sans', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function ConsCtaFinal() {
  return (
    <section style={{ padding: 'clamp(3.5rem, 7vw, 5rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(760px, 92vw)', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: CONS_GREEN,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </div>
        <Eyebrow color={CONS_GREEN}>Pronto para começar?</Eyebrow>
        <h2 style={{ margin: '6px 0 16px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          Seu patrimônio sem pagar um centavo de juros
        </h2>
        <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.7, margin: '0 auto 32px', maxWidth: 540 }}>
          Faça sua simulação gratuita, receba uma proposta personalizada e dê o primeiro passo
          para o bem dos seus sonhos — sem comprometer o seu futuro financeiro.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          <a href="https://wa.me/5531984144250?text=Ol%C3%A1!%20Tenho%20interesse%20em%20cons%C3%B3rcio%20imobili%C3%A1rio%20pela%20VN%20Prime."
            target="_blank" rel="noreferrer"
            style={{ background: `linear-gradient(135deg, #34d399, ${CONS_GREEN})`,
              color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
              padding: '1rem 2rem', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 16,
              boxShadow: '0 8px 28px rgba(5,150,105,0.35)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.117 1.522 5.846L0 24l6.335-1.506A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.497-5.187-1.362l-.371-.22-3.762.895.939-3.652-.241-.383A9.974 9.974 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Simular no WhatsApp →
          </a>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Simulação gratuita','Sem compromisso'],['Parceiro Ademicon','Regulamentado BACEN'],['Proposta em 24h','Consultor dedicado']].map(([t,d]) => (
            <div key={t} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 700, color: CONS_GREEN, marginBottom: 2 }}>✓ {t}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
function ConsorcioPage({ onNav, authUser, onAuthOpen }) {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <ConsHero onNav={onNav} />
      <ConsQuiz />
      <ConsComoFunciona />
      <ConsVsFinanciamento />
      <ConsFAQ />
      <ConsCtaFinal />
    </main>
  );
}

Object.assign(window, { ConsorcioPage });

})();
