// Portal do Fotógrafo — jobs + perfil
(function () {

const MOCK_JOBS = [
  {
    id: 'job-01',
    titulo: 'Ensaio Fotográfico',
    bairro: 'Savassi',
    tipo: 'Apartamento',
    area: 180,
    pacote: 'fotos',
    pacoteLabel: 'Ensaio Fotográfico · R$ 899',
    valor: 899,
    data: '2026-05-06',
    status: 'aberto',
  },
  {
    id: 'job-02',
    titulo: 'Foto + Vídeo + Drone',
    bairro: 'Lourdes',
    tipo: 'Cobertura',
    area: 320,
    pacote: 'completo',
    pacoteLabel: 'Pacote Completo · R$ 2.999',
    valor: 2999,
    data: '2026-05-08',
    status: 'aberto',
  },
  {
    id: 'job-03',
    titulo: 'Drone + Aéreo',
    bairro: 'Serra',
    tipo: 'Casa',
    area: 240,
    pacote: 'drone',
    pacoteLabel: 'Drone · R$ 1.299',
    valor: 1299,
    data: '2026-05-10',
    status: 'aberto',
  },
  {
    id: 'job-04',
    titulo: 'Foto + Vídeo',
    bairro: 'Funcionários',
    tipo: 'Apartamento',
    area: 140,
    pacote: 'video',
    pacoteLabel: 'Foto + Vídeo · R$ 1.999',
    valor: 1999,
    data: '2026-05-12',
    status: 'aberto',
  },
];

const PACOTE_COLORS = {
  fotos:    { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  drone:    { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  video:    { bg: '#FDF4FF', color: '#7E22CE', border: '#E9D5FF' },
  completo: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
};

const FMT_BRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
const FMT_DATE = (d) => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ job, onClose }) {
  const [done, setDone] = React.useState(false);
  const liquido = Math.round(job.valor * 0.85); // 15% VN Prime example

  if (done) return (
    <div style={overlayStyle()}>
      <div style={boxStyle(440)}>
        <div style={{ textAlign: 'center', padding: '44px 28px' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
          <h2 style={{ margin: '0 0 8px', color: 'var(--navy)' }}>Job confirmado!</h2>
          <p style={{ color: 'var(--fg-2)', margin: '0 0 8px', fontSize: 14, lineHeight: 1.6 }}>
            A equipe VN Prime vai compartilhar os detalhes do endereço e os dados de contato do proprietário em até 2 horas.
          </p>
          <p style={{ color: 'var(--fg-2)', margin: '0 0 24px', fontSize: 13 }}>
            Valor líquido: <strong style={{ color: 'var(--gold)' }}>{FMT_BRL(liquido)}</strong> (após taxa VN Prime de 15%)
          </p>
          <Btn variant="accent" onClick={onClose}>Ver meus jobs</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={overlayStyle()}>
      <div style={boxStyle(480)}>
        <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--navy)' }}>Aceitar job</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{job.titulo} · {job.bairro}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--fg-2)', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '20px 28px' }}>
          {/* Job summary */}
          <div style={{
            background: 'var(--cream)', borderRadius: 10, padding: '16px 18px',
            display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16,
          }}>
            {[
              ['Imóvel',   `${job.tipo} · ${job.bairro} · ${job.area} m²`],
              ['Pacote',   job.pacoteLabel],
              ['Data sugerida', FMT_DATE(job.data)],
              ['Valor bruto',  FMT_BRL(job.valor)],
              ['Taxa VN Prime', '15%'],
              ['Valor líquido', FMT_BRL(liquido)],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--fg-2)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5, marginBottom: 20 }}>
            Ao aceitar, você se compromete a realizar o ensaio na data combinada com o proprietário.
            O pagamento é processado após entrega das imagens editadas.
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', color: 'var(--navy)' }}>
              Cancelar
            </button>
            <button onClick={() => setDone(true)} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, var(--gold) 0%, #e6a800 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              ✓ Aceitar job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job, onAccept }) {
  const colors = PACOTE_COLORS[job.pacote] || PACOTE_COLORS.fotos;
  const liquido = Math.round(job.valor * 0.85);
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
      padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        background: colors.bg, border: `1.5px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>
        {job.pacote === 'fotos' ? '📸' : job.pacote === 'drone' ? '🚁' : job.pacote === 'video' ? '🎬' : '✨'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{job.titulo}</span>
          <span style={{
            padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
            color: colors.color, background: colors.bg, border: `1px solid ${colors.border}`,
          }}>Disponível</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>
          {job.tipo} · {job.bairro} · {job.area} m² · {FMT_DATE(job.data)}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ textAlign: 'right', minWidth: 100 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--gold)' }}>{FMT_BRL(liquido)}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>líquido (–15% VN Prime)</div>
      </div>

      <button onClick={() => onAccept(job)} style={{
        padding: '9px 18px', background: 'var(--navy)',
        color: '#fff', border: 'none', borderRadius: 8,
        fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
      }}>Aceitar job</button>
    </div>
  );
}

// ── Profile tab ───────────────────────────────────────────────────────────────
function PerfilTab({ authUser }) {
  const [form, setForm] = React.useState({
    bio: '',
    instagram: '',
    site: '',
    especialidade: '',
    cidade: 'Belo Horizonte',
  });
  const [saved, setSaved] = React.useState(false);

  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 17, color: 'var(--navy)' }}>Perfil profissional</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-2)' }}>
          Seu perfil é exibido aos proprietários que contratam serviços de mídia
        </p>
      </div>

      {/* Avatar + nome */}
      <div style={{
        background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px',
        display: 'flex', gap: 16, alignItems: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg,#B87333,#D08F4F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 26, color: '#fff', flexShrink: 0,
        }}>{(authUser?.name || 'F')[0].toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>{authUser?.name || 'Fotógrafo'}</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{authUser?.email || ''}</div>
          <div style={{
            display: 'inline-block', marginTop: 6,
            background: '#FEF3C7', color: '#92400E',
            padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          }}>Fotógrafo credenciado VN Prime</div>
        </div>
      </div>

      {/* Form */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>Bio profissional</label>
          <textarea
            value={form.bio}
            onChange={e => update('bio', e.target.value)}
            placeholder="Especialista em fotografia de imóveis de alto padrão em Belo Horizonte..."
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>Especialidade</label>
            <select value={form.especialidade} onChange={e => update('especialidade', e.target.value)} style={{ width: '100%' }}>
              <option value="">Selecione</option>
              <option value="foto">Fotografia</option>
              <option value="video">Vídeo</option>
              <option value="drone">Drone</option>
              <option value="completo">Completo (foto, vídeo, drone)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>Cidade de atuação</label>
            <input value={form.cidade} onChange={e => update('cidade', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>Instagram</label>
            <input value={form.instagram} onChange={e => update('instagram', e.target.value)} placeholder="@seuperfil" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>Site / portfólio</label>
            <input value={form.site} onChange={e => update('site', e.target.value)} placeholder="seuperfil.com.br" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setSaved(true)} style={{
            padding: '10px 22px',
            background: 'var(--navy)', color: '#fff',
            border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>Salvar perfil</button>
          {saved && <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>✓ Salvo com sucesso</span>}
        </div>
      </div>

      {/* Portfolio placeholder */}
      <div style={{ background: '#fff', border: '1.5px dashed var(--border)', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🖼</div>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 4 }}>Portfólio</div>
        <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 16 }}>
          Adicione fotos dos seus melhores trabalhos para se destacar junto aos proprietários
        </div>
        <button style={{
          padding: '9px 20px', background: 'transparent',
          border: '1.5px solid var(--border)', borderRadius: 8,
          fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--navy)',
        }}>+ Adicionar fotos</button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function overlayStyle() {
  return {
    position: 'fixed', inset: 0,
    background: 'rgba(15,34,68,0.55)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  };
}
function boxStyle(maxW) {
  return {
    background: '#fff', borderRadius: 16,
    width: '100%', maxWidth: maxW,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
function FotografoPage({ onNav, authUser }) {
  const [tab, setTab] = React.useState('jobs');
  const [confirmJob, setConfirmJob] = React.useState(null);
  const nome = authUser?.name || 'Fotógrafo';
  const ganhos = 0;

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>
      {confirmJob && <ConfirmModal job={confirmJob} onClose={() => setConfirmJob(null)} />}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a6e 100%)',
        padding: '48px 24px 40px', color: '#fff',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%',
              background: '#B87333',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 20, color: '#fff', flexShrink: 0,
            }}>{nome[0]?.toUpperCase()}</div>
            <div>
              <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 2 }}>Portal do Fotógrafo · VN Prime</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>Olá, {nome.split(' ')[0]}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 12 }}>
            {[
              { label: 'Jobs disponíveis', value: MOCK_JOBS.length },
              { label: 'Jobs aceitos',     value: 0 },
              { label: 'Ganhos do mês',    value: FMT_BRL(ganhos) },
              { label: 'Avaliação',        value: '—' },
            ].map(k => (
              <div key={k.label} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '14px 16px', color: '#fff',
              }}>
                <div style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontWeight: 800, fontSize: 24 }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex' }}>
          {[
            { id: 'jobs',        label: '📸 Jobs disponíveis' },
            { id: 'meus',        label: '✅ Meus jobs' },
            { id: 'ferramentas', label: '🛠 Ferramentas' },
            { id: 'perfil',      label: '👤 Meu perfil' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '14px 20px', background: 'none', border: 'none',
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 13, cursor: 'pointer',
              color: tab === t.id ? 'var(--navy)' : 'var(--fg-2)',
              borderBottom: tab === t.id ? '2.5px solid var(--gold)' : '2.5px solid transparent',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>

        {tab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, color: 'var(--navy)' }}>Jobs disponíveis</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-2)' }}>
                Imóveis aguardando fotógrafo credenciado VN Prime — aceite e combine com o proprietário
              </p>
            </div>

            {/* How it works */}
            <div style={{
              background: '#EFF6FF', border: '1px solid #BFDBFE',
              borderRadius: 10, padding: '14px 16px',
              display: 'flex', gap: 24, flexWrap: 'wrap',
            }}>
              {[
                ['1', 'Aceite o job'],
                ['2', 'Combine data com o proprietário'],
                ['3', 'Realize o ensaio'],
                ['4', 'Entregue as fotos editadas'],
                ['5', 'Receba o pagamento (–15% VN Prime)'],
              ].map(([n, s]) => (
                <div key={n} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#1D4ED8' }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#1D4ED8', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{n}</span>
                  {s}
                </div>
              ))}
            </div>

            {MOCK_JOBS.map(job => (
              <JobCard key={job.id} job={job} onAccept={j => setConfirmJob(j)} />
            ))}
          </div>
        )}

        {tab === 'meus' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--fg-2)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)', marginBottom: 8 }}>Nenhum job aceito ainda</div>
            <div style={{ fontSize: 14 }}>Acesse a aba "Jobs disponíveis" para começar</div>
          </div>
        )}

        {tab === 'ferramentas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, color: 'var(--navy)' }}>Ferramentas do fotógrafo</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-2)' }}>Cursos gratuitos + ferramentas disponíveis com plano pago</p>
            </div>

            {/* FactorOne banner */}
            <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '1px solid #BFDBFE', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 32 }}>📊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1E40AF' }}>FactorOne — Gestão financeira</div>
                <div style={{ fontSize: 13, color: '#3B82F6', marginTop: 2 }}>30 dias grátis · controle de ganhos, custos de equipamento e fluxo de caixa</div>
              </div>
              <button style={{ padding: '8px 16px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Ativar grátis</button>
            </div>

            {/* Cursos gratuitos — YouTube */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 10 }}>Cursos gratuitos</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
                {[
                  { icon: '🎬', label: 'Como fotografar imóveis', desc: 'Técnicas de luz natural, ângulos e composição para alto padrão', tag: 'YouTube · Gratuito', url: 'https://www.youtube.com/results?search_query=como+fotografar+imoveis+profissional' },
                  { icon: '✂️', label: 'Edição de vídeo imobiliário', desc: 'Corte, color grading e trilha para tours virtuais cinematográficos', tag: 'YouTube · Gratuito', url: 'https://www.youtube.com/results?search_query=edicao+video+tour+imobiliario' },
                  { icon: '🚁', label: 'Fotografia com drone', desc: 'Manobras, regulamentações ANAC e composições aéreas para imóveis', tag: 'YouTube · Gratuito', url: 'https://www.youtube.com/results?search_query=fotografia+drone+imoveis+tutorial' },
                  { icon: '💡', label: 'Iluminação de interiores', desc: 'Flash, difusores e blend de exposições para ambientes fechados', tag: 'YouTube · Gratuito', url: 'https://www.youtube.com/results?search_query=iluminacao+fotografia+imobiliaria' },
                ].map(c => (
                  <a key={c.label} href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '18px', cursor: 'pointer', transition: 'box-shadow 0.15s', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 28 }}>{c.icon}</span>
                        <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{c.tag}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5 }}>{c.desc}</div>
                      <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>▶ Assistir no YouTube →</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Ferramentas profissionais — pagas */}
            {[
              {
                categoria: 'Edição & Produção',
                tools: [
                  { icon: '🖼', label: 'Tratamento de fotos',    desc: 'Ajuste de exposição, remoção de reflexos, correção de perspectiva e HDR', locked: true },
                  { icon: '🎞', label: 'Edição de vídeo',        desc: 'Montagem de tours, color grading e exportação otimizada para web', locked: true },
                ],
              },
              {
                categoria: 'Gestão & Clientes',
                tools: [
                  { icon: '👥', label: 'CRM inteligente',        desc: 'Histórico de clientes, follow-up automático e gestão de portfólio', locked: true },
                  { icon: '📅', label: 'Gestão de agendamento',  desc: 'Agenda de ensaios, confirmação automática e disponibilidade online', locked: true },
                  { icon: '📋', label: 'Controle de tarefas',    desc: 'Checklist por job, entrega de arquivos e acompanhamento pós-ensaio', locked: true },
                  { icon: '📧', label: 'Email marketing',        desc: 'Prospecção de novos clientes e reativação de carteira', locked: true },
                ],
              },
              {
                categoria: 'Marketing Digital',
                tools: [
                  { icon: '📱', label: 'Geração de stories e feed', desc: 'Templates para Instagram com suas melhores fotos de imóveis', locked: true },
                  { icon: '🌐', label: 'Posicionamento em redes',   desc: 'Calendário editorial e estratégia de conteúdo para fotógrafo imobiliário', locked: true },
                ],
              },
            ].map(({ categoria, tools }) => (
              <div key={categoria}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 10 }}>{categoria} · <span style={{ color: '#D97706' }}>Plano pago</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
                  {tools.map(tool => (
                    <div key={tool.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '18px', position: 'relative', opacity: 0.8, cursor: 'pointer' }}>
                      <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 13, color: 'var(--fg-2)' }}>🔒</div>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{tool.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>{tool.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5 }}>{tool.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'perfil' && <PerfilTab authUser={authUser} />}
      </div>
    </main>
  );
}

Object.assign(window, { FotografoPage });
})();
