(function () {

const ADMIN_EMAIL = 'vinicius.mnogueira@gmail.com';

// Mock plan prices (editable)
const PLANOS_INICIAL = [
  { id: 'direta',   label: 'Venda Direta',   preco: 'R$ 197',  tipo: 'taxa fixa',   vigencia: '90 dias' },
  { id: 'assistida', label: '3% Assistida',  preco: '3%',      tipo: 'comissão',    vigencia: 'até venda' },
  { id: 'completa',  label: '6% Completa',   preco: '6%',      tipo: 'comissão',    vigencia: 'até venda' },
  { id: 'foto-p1',   label: 'Foto Pacote P1', preco: 'R$ 490', tipo: 'taxa fixa',   vigencia: 'por job' },
  { id: 'foto-p2',   label: 'Foto Pacote P2', preco: 'R$ 790', tipo: 'taxa fixa',   vigencia: 'por job' },
  { id: 'foto-p3',   label: 'Foto Pacote P3', preco: 'R$ 1.190', tipo: 'taxa fixa', vigencia: 'por job' },
  { id: 'membro',    label: 'Corretor Membro', preco: 'R$ 49,90', tipo: 'assinatura', vigencia: '/mês' },
];

const LEADS_MOCK = [
  { id: 1, nome: 'Marina Ferreira',   email: 'marina@email.com',  telefone: '(31) 99123-4567', origem: 'Home',      interesse: 'Compra · Savassi',    status: 'Novo',      data: '2026-05-06' },
  { id: 2, nome: 'Carlos Drummond',   email: 'carlos@email.com',  telefone: '(31) 98765-4321', origem: 'Anunciar',  interesse: 'Venda · Lourdes',     status: 'Contatado', data: '2026-05-05' },
  { id: 3, nome: 'Juliana Motta',     email: 'juliana@email.com', telefone: '(31) 99000-1111', origem: 'Lançamentos', interesse: 'Compra · Nova Lima', status: 'Proposta',  data: '2026-05-04' },
  { id: 4, nome: 'Roberto Alvares',   email: 'roberto@email.com', telefone: '(31) 97777-2222', origem: 'Corretor',  interesse: 'Parceria',            status: 'Fechado',   data: '2026-05-03' },
  { id: 5, nome: 'Patricia Gomes',    email: 'patricia@email.com',telefone: '(31) 96666-3333', origem: 'Home',      interesse: 'Compra · Buritis',    status: 'Perdido',   data: '2026-05-02' },
  { id: 6, nome: 'André Silveira',    email: 'andre@email.com',   telefone: '(31) 95555-4444', origem: 'Foto',      interesse: 'Fotografia · job',    status: 'Novo',      data: '2026-05-06' },
  { id: 7, nome: 'Camila Rodrigues',  email: 'camila@email.com',  telefone: '(31) 94444-5555', origem: 'Home',      interesse: 'Compra · Serra',      status: 'Contatado', data: '2026-05-01' },
];

const CONS_LEADS_MOCK = [
  { id: 1, nome: 'Beatriz Martins',  email: 'beatriz@email.com', telefone: '(31) 99111-2222', carta: 'R$ 600.000', parcela: 'R$ 5.160', prazo: '120 meses', status: 'Novo',      data: '2026-05-06' },
  { id: 2, nome: 'Lucas Carvalho',   email: 'lucas@email.com',   telefone: '(31) 98222-3333', carta: 'R$ 850.000', parcela: 'R$ 8.076', prazo: '120 meses', status: 'Enviado',   data: '2026-05-05' },
  { id: 3, nome: 'Ana Paula Silva',  email: 'ana@email.com',     telefone: '(31) 97333-4444', carta: 'R$ 400.000', parcela: 'R$ 3.440', prazo: '120 meses', status: 'Contatado', data: '2026-05-04' },
  { id: 4, nome: 'Felipe Duarte',    email: 'felipe@email.com',  telefone: '(31) 96444-5555', carta: 'R$ 1.200.000', parcela: 'R$ 11.600', prazo: '120 meses', status: 'Novo',   data: '2026-05-03' },
];

const CURADORIA_MOCK = [
  { id: 1, titulo: 'Apto 3q · Savassi · 120m²',    proprietario: 'Mario Andrade',   preco: 'R$ 1.200.000', plano: '3% Assistida', data: '2026-05-06', status: 'pendente' },
  { id: 2, titulo: 'Casa 4q · Nova Lima · 280m²',   proprietario: 'Flávia Torres',   preco: 'R$ 2.800.000', plano: '6% Completa',  data: '2026-05-05', status: 'pendente' },
  { id: 3, titulo: 'Cobertura · Lourdes · 200m²',   proprietario: 'Renato Costa',    preco: 'R$ 3.500.000', plano: 'Venda Direta', data: '2026-05-04', status: 'aprovado' },
  { id: 4, titulo: 'Apto 2q · Buritis · 80m²',      proprietario: 'Sônia Batista',   preco: 'R$ 580.000',   plano: 'Venda Direta', data: '2026-05-03', status: 'reprovado' },
  { id: 5, titulo: 'Apto 3q · Funcionários · 95m²', proprietario: 'Igor Mendes',     preco: 'R$ 980.000',   plano: '3% Assistida', data: '2026-05-06', status: 'pendente' },
];

const AGENDA_MOCK = [
  { id: 1, tipo: 'visita',  imovel: 'Apto 3q · Savassi · VN-2048',           contato: 'Marina Ferreira',          tel: '(31) 99123-4567', data: '2026-05-09', hora: '10:00', status: 'confirmada', obs: '' },
  { id: 2, tipo: 'visita',  imovel: 'Casa 4q · Nova Lima · VN-3012',          contato: 'André Lima',               tel: '(31) 98000-1234', data: '2026-05-09', hora: '14:30', status: 'pendente',   obs: '' },
  { id: 3, tipo: 'foto',    imovel: 'Cobertura · Lourdes · VN-4501',          contato: 'Carlos Mendes (Fotógrafo)', tel: '(31) 97111-2222', data: '2026-05-10', hora: '09:00', status: 'confirmada', obs: 'Pacote P3 — drone + interior' },
  { id: 4, tipo: 'visita',  imovel: 'Apto 2q · Buritis · VN-1823',           contato: 'Juliana Costa',            tel: '(31) 96222-3333', data: '2026-05-10', hora: '11:00', status: 'pendente',   obs: '' },
  { id: 5, tipo: 'foto',    imovel: 'Apto 3q · Funcionários · VN-2341',       contato: 'Ana Beatriz (Fotógrafo)',  tel: '(31) 95333-4444', data: '2026-05-11', hora: '08:30', status: 'confirmada', obs: 'Pacote P2 — interior + exterior' },
  { id: 6, tipo: 'visita',  imovel: 'Studio · Savassi · VN-5012',            contato: 'Roberto Dias',             tel: '(31) 94444-5555', data: '2026-05-12', hora: '16:00', status: 'confirmada', obs: '' },
  { id: 7, tipo: 'reuniao', imovel: 'Serra Verde — lançamento',               contato: 'Incorporadora Serra Verde', tel: '',               data: '2026-05-13', hora: '09:30', status: 'pendente',   obs: 'Apresentação portfólio lançamentos' },
  { id: 8, tipo: 'visita',  imovel: 'Cobertura · Belvedere · VN-6100',       contato: 'Fernanda Alves',           tel: '(31) 93555-6666', data: '2026-05-14', hora: '10:00', status: 'pendente',   obs: '' },
  { id: 9, tipo: 'foto',    imovel: 'Casa · Nova Lima · VN-7230',             contato: 'João Paulo (Fotógrafo)',   tel: '(31) 92666-7777', data: '2026-05-15', hora: '07:30', status: 'pendente',   obs: 'Pacote P1 — fotos interiores' },
];

const PORTAIS_STATS = {
  proprietario: { ativos: 12, pendentes: 5, emVenda: 28, fechadosMes: 3 },
  corretor:     { membros: 18, emTriagem: 4, leadsEnviados: 47, comissoesMes: 2 },
  fotografo:    { credenciados: 7, jobsAbertos: 3, jobsConcluidos: 22, pagamentosPendentes: 1 },
  consorcio:    { simulacoes: 34, leadsQualificados: 8, enviados: 5, conversoes: 2 },
};

const STATUS_LEAD = ['Novo', 'Contatado', 'Proposta', 'Fechado', 'Perdido'];
const STATUS_COLORS = {
  Novo: '#2563eb',
  Contatado: '#7c3aed',
  Proposta: '#d97706',
  Fechado: '#059669',
  Perdido: '#dc2626',
};

function AdminPage({ onNav, authUser }) {
  const [tab, setTab] = React.useState('agenda');
  const [planos, setPlanos] = React.useState(PLANOS_INICIAL);
  const [leads, setLeads] = React.useState(LEADS_MOCK);
  const [curadoria, setCuradoria] = React.useState(CURADORIA_MOCK);
  const [consLeads, setConsLeads] = React.useState(CONS_LEADS_MOCK);
  const [agenda, setAgenda] = React.useState(AGENDA_MOCK);
  const [emailModal, setEmailModal] = React.useState(null);
  const [editIdx, setEditIdx] = React.useState(null);
  const [editBuf, setEditBuf] = React.useState({});
  const [toast, setToast] = React.useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const isAdmin = !authUser || authUser.email === ADMIN_EMAIL || authUser.role === 'admin';

  if (!isAdmin) {
    return (
      <main style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <Eyebrow color="var(--gold)">Acesso restrito</Eyebrow>
        <h1 style={{ color: 'var(--navy)' }}>Portal Admin</h1>
        <p style={{ color: 'var(--fg-2)', maxWidth: 420, margin: '0 auto 24px' }}>
          Esta área é restrita à administração VN Prime.
        </p>
        <Btn variant="accent" onClick={() => onNav('home')}>Voltar ao início</Btn>
      </main>
    );
  }

  const tabs = [
    { id: 'agenda',    label: 'Calendário' },
    { id: 'curadoria', label: 'Curadoria' },
    { id: 'leads',     label: 'Leads' },
    { id: 'consorcio', label: 'Consórcio' },
    { id: 'portais',   label: 'Gestão de Portais' },
    { id: 'valores',   label: 'Valores e Planos' },
  ];
  if (tab === 'valores' || !tabs.find(t => t.id === tab)) {} // keep tab var in scope

  const th = { padding: '10px 14px', textAlign: 'left', fontFamily: 'DM Sans', fontSize: 11.5,
    fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--fg-2)', borderBottom: '2px solid var(--border)', background: 'var(--cream)' };
  const td = { padding: '12px 14px', fontSize: 13.5, fontFamily: 'DM Sans',
    borderBottom: '1px solid var(--border)', verticalAlign: 'middle' };

  return (
    <main style={{ minHeight: '80vh', background: 'var(--cream)', paddingBottom: 80 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--navy)', color: '#fff', padding: '11px 22px', borderRadius: 10,
          fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14, zIndex: 999,
          boxShadow: '0 8px 28px rgba(15,34,68,0.25)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '36px 0 0' }}>
        <div style={{ width: 'min(1200px, 94vw)', margin: '0 auto' }}>
          <Eyebrow color="var(--gold-soft)">VN Prime Admin</Eyebrow>
          <h1 style={{ color: '#fff', margin: '6px 0 28px', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
            Painel de administração
          </h1>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 20px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13.5,
                border: 'none', cursor: 'pointer', borderRadius: '8px 8px 0 0',
                background: tab === t.id ? 'var(--cream)' : 'rgba(255,255,255,0.08)',
                color: tab === t.id ? 'var(--navy)' : 'rgba(255,255,255,0.7)',
                transition: 'background 0.15s, color 0.15s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: 'min(1200px, 94vw)', margin: '0 auto', paddingTop: 32 }}>

        {/* ── TAB: VALORES ── */}
        {tab === 'valores' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--navy)' }}>Planos e preços</h2>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg-2)' }}>Clique em Editar para alterar um valor</p>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(15,34,68,0.07)', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Plano</th>
                    <th style={th}>Preço</th>
                    <th style={th}>Tipo</th>
                    <th style={th}>Vigência</th>
                    <th style={{ ...th, textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {planos.map((p, i) => (
                    <tr key={p.id} style={{ background: editIdx === i ? 'rgba(201,150,14,0.04)' : '#fff' }}>
                      <td style={{ ...td, fontWeight: 700, color: 'var(--navy)' }}>
                        {editIdx === i ? (
                          <input value={editBuf.label || ''} onChange={e => setEditBuf(b => ({ ...b, label: e.target.value }))}
                            style={{ width: '100%', fontWeight: 700 }} />
                        ) : p.label}
                      </td>
                      <td style={td}>
                        {editIdx === i ? (
                          <input value={editBuf.preco || ''} onChange={e => setEditBuf(b => ({ ...b, preco: e.target.value }))}
                            style={{ width: 120, fontWeight: 700, color: 'var(--gold)' }} />
                        ) : (
                          <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{p.preco}</span>
                        )}
                      </td>
                      <td style={{ ...td, color: 'var(--fg-2)' }}>
                        {editIdx === i ? (
                          <input value={editBuf.tipo || ''} onChange={e => setEditBuf(b => ({ ...b, tipo: e.target.value }))}
                            style={{ width: 110 }} />
                        ) : p.tipo}
                      </td>
                      <td style={{ ...td, color: 'var(--fg-2)' }}>
                        {editIdx === i ? (
                          <input value={editBuf.vigencia || ''} onChange={e => setEditBuf(b => ({ ...b, vigencia: e.target.value }))}
                            style={{ width: 110 }} />
                        ) : p.vigencia}
                      </td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        {editIdx === i ? (
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                              const copy = [...planos];
                              copy[i] = { ...copy[i], ...editBuf };
                              setPlanos(copy);
                              setEditIdx(null);
                              showToast('Valor atualizado com sucesso');
                            }} style={{ padding: '6px 14px', background: 'var(--navy)', color: '#fff',
                              border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                              Salvar
                            </button>
                            <button onClick={() => setEditIdx(null)} style={{ padding: '6px 12px', background: 'transparent',
                              color: 'var(--fg-2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12.5, cursor: 'pointer' }}>
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditIdx(i); setEditBuf({ ...p }); }}
                            style={{ padding: '6px 14px', background: 'transparent', color: 'var(--navy)',
                              border: '1px solid var(--border)', borderRadius: 6, fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: LEADS ── */}
        {tab === 'leads' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--navy)' }}>
                Leads captados
                <span style={{ marginLeft: 10, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 400, color: 'var(--fg-2)' }}>
                  {leads.length} total · {leads.filter(l => l.status === 'Novo').length} novos
                </span>
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {STATUS_LEAD.map(s => (
                  <span key={s} style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: STATUS_COLORS[s] + '15', color: STATUS_COLORS[s] }}>
                    {s}: {leads.filter(l => l.status === s).length}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(15,34,68,0.07)', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Nome</th>
                    <th style={th}>Contato</th>
                    <th style={th}>Origem</th>
                    <th style={th}>Interesse</th>
                    <th style={th}>Data</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, i) => (
                    <tr key={l.id} style={{ background: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,34,68,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <td style={{ ...td, fontWeight: 700, color: 'var(--navy)' }}>{l.nome}</td>
                      <td style={{ ...td, fontSize: 12.5 }}>
                        <div>{l.email}</div>
                        <div style={{ color: 'var(--fg-2)' }}>{l.telefone}</div>
                      </td>
                      <td style={{ ...td, color: 'var(--fg-2)' }}>{l.origem}</td>
                      <td style={{ ...td, fontSize: 12.5 }}>{l.interesse}</td>
                      <td style={{ ...td, color: 'var(--fg-2)', fontSize: 12.5 }}>{l.data}</td>
                      <td style={td}>
                        <select value={l.status} onChange={e => {
                          const next = [...leads];
                          next[i] = { ...next[i], status: e.target.value };
                          setLeads(next);
                          showToast('Status atualizado');
                        }} style={{
                          padding: '5px 10px', borderRadius: 6, fontSize: 12.5, fontWeight: 700,
                          border: `1.5px solid ${STATUS_COLORS[l.status]}`,
                          color: STATUS_COLORS[l.status],
                          background: STATUS_COLORS[l.status] + '10', cursor: 'pointer',
                        }}>
                          {STATUS_LEAD.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: CURADORIA ── */}
        {tab === 'curadoria' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--navy)' }}>
                Fila de curadoria
                <span style={{ marginLeft: 10, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 400, color: 'var(--fg-2)' }}>
                  {curadoria.filter(c => c.status === 'pendente').length} pendentes
                </span>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {curadoria.map((c, i) => (
                <div key={c.id} style={{
                  background: '#fff', borderRadius: 14, padding: '20px 24px',
                  border: c.status === 'pendente' ? '1px solid rgba(201,150,14,0.35)' :
                          c.status === 'aprovado' ? '1px solid rgba(5,150,105,0.3)' :
                          '1px solid rgba(220,38,38,0.2)',
                  boxShadow: '0 2px 12px rgba(15,34,68,0.06)',
                  display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
                }}>
                  {/* Status indicator */}
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: c.status === 'pendente' ? 'var(--gold)' :
                                c.status === 'aprovado' ? '#059669' : '#dc2626',
                  }} />
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 4 }}>
                      {c.titulo}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-2)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span>Proprietário: <b style={{ color: 'var(--navy)' }}>{c.proprietario}</b></span>
                      <span>Plano: <b style={{ color: 'var(--navy)' }}>{c.plano}</b></span>
                      <span>Preço: <b style={{ color: 'var(--gold)' }}>{c.preco}</b></span>
                      <span>Enviado: {c.data}</span>
                    </div>
                  </div>
                  {/* Status badge + actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 700,
                      background: c.status === 'pendente' ? 'rgba(201,150,14,0.12)' :
                                  c.status === 'aprovado' ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.12)',
                      color: c.status === 'pendente' ? '#92600A' :
                             c.status === 'aprovado' ? '#065F46' : '#991B1B',
                      textTransform: 'capitalize',
                    }}>{c.status}</span>
                    {c.status === 'pendente' && (
                      <>
                        <button onClick={() => {
                          const copy = [...curadoria];
                          copy[i] = { ...copy[i], status: 'aprovado' };
                          setCuradoria(copy);
                          showToast('Anúncio aprovado e publicado');
                        }} style={{ padding: '7px 16px', background: '#059669', color: '#fff',
                          border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                          Aprovar
                        </button>
                        <button onClick={() => {
                          const copy = [...curadoria];
                          copy[i] = { ...copy[i], status: 'reprovado' };
                          setCuradoria(copy);
                          showToast('Anúncio reprovado — proprietário será notificado');
                        }} style={{ padding: '7px 16px', background: 'transparent', color: '#dc2626',
                          border: '1.5px solid #dc2626', borderRadius: 7, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                          Reprovar
                        </button>
                      </>
                    )}
                    {c.status !== 'pendente' && (
                      <button onClick={() => {
                        const copy = [...curadoria];
                        copy[i] = { ...copy[i], status: 'pendente' };
                        setCuradoria(copy);
                        showToast('Anúncio reaberto para revisão');
                      }} style={{ padding: '6px 12px', background: 'transparent', color: 'var(--fg-2)',
                        border: '1px solid var(--border)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>
                        Reabrir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: CONSÓRCIO LEADS ── */}
        {tab === 'consorcio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--navy)' }}>
                Leads Consórcio
                <span style={{ marginLeft: 10, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 400, color: 'var(--fg-2)' }}>
                  {consLeads.filter(l => l.status === 'Novo').length} novos · {consLeads.length} total
                </span>
              </h2>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: 'var(--fg-2)' }}>
                Parceiro: <strong style={{ color: 'var(--navy)' }}>Ademicon</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {consLeads.map((lead, i) => (
                <div key={lead.id} style={{
                  background: '#fff', borderRadius: 14, padding: '20px 24px',
                  border: lead.status === 'Novo' ? '1px solid rgba(201,150,14,0.35)' : '1px solid var(--border)',
                  boxShadow: '0 2px 12px rgba(15,34,68,0.06)',
                  display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: lead.status === 'Novo' ? 'var(--gold)' : lead.status === 'Enviado' ? '#059669' : '#6366F1',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 4 }}>
                      {lead.nome}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-2)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                      <span>{lead.email}</span>
                      <span>{lead.telefone}</span>
                      <span>Carta: <b style={{ color: 'var(--gold)' }}>{lead.carta}</b></span>
                      <span>Parcela: <b style={{ color: 'var(--navy)' }}>{lead.parcela}</b></span>
                      <span>Prazo: {lead.prazo}</span>
                      <span>Data: {lead.data}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 700,
                      background: lead.status === 'Novo' ? 'rgba(201,150,14,0.12)' :
                                  lead.status === 'Enviado' ? 'rgba(5,150,105,0.12)' : 'rgba(99,102,241,0.12)',
                      color: lead.status === 'Novo' ? '#92600A' :
                             lead.status === 'Enviado' ? '#065F46' : '#4338CA',
                    }}>{lead.status}</span>
                    <button onClick={() => setEmailModal(lead)} style={{
                      padding: '7px 16px', background: 'var(--navy)', color: '#fff',
                      border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                    }}>Enviar para parceiro</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: AGENDA ── */}
        {tab === 'agenda' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--navy)' }}>
                Calendário
                <span style={{ marginLeft: 10, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 400, color: 'var(--fg-2)' }}>
                  {agenda.filter(e => e.status === 'pendente').length} pendentes
                </span>
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['visita','Visita','#2563EB'],['foto','Foto','#B87333'],['reuniao','Reunião','#7C3AED']].map(([tipo, label, cor]) => (
                  <span key={tipo} style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 700,
                    background: cor + '15', color: cor }}>
                    {label}: {agenda.filter(e => e.tipo === tipo).length}
                  </span>
                ))}
              </div>
            </div>

            {Object.entries(
              agenda.reduce((acc, e) => { if (!acc[e.data]) acc[e.data] = []; acc[e.data].push(e); return acc; }, {})
            ).sort(([a],[b]) => a.localeCompare(b)).map(([data, eventos]) => (
              <div key={data} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: 8, padding: '4px 16px',
                    fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0 }}>
                    {new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 11.5, color: 'var(--fg-2)' }}>{eventos.length} evento{eventos.length > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {eventos.sort((a,b) => a.hora.localeCompare(b.hora)).map(ev => {
                    const tipoInfo = { visita: { cor: '#2563EB', lbl: 'Visita' }, foto: { cor: '#B87333', lbl: 'Fotografia' }, reuniao: { cor: '#7C3AED', lbl: 'Reunião' } };
                    const { cor, lbl } = tipoInfo[ev.tipo] || { cor: '#6366F1', lbl: ev.tipo };
                    return (
                      <div key={ev.id} style={{
                        background: '#fff', borderRadius: 12, padding: '14px 18px',
                        border: ev.status === 'concluido' ? '1px solid var(--border)' : ev.status === 'confirmada' ? `1.5px solid ${cor}25` : '1.5px solid rgba(201,150,14,0.3)',
                        boxShadow: '0 2px 10px rgba(15,34,68,0.06)',
                        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
                        opacity: ev.status === 'concluido' ? 0.55 : 1,
                      }}>
                        <div style={{ background: cor + '12', border: `1.5px solid ${cor}30`, borderRadius: 8, padding: '6px 12px', textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 700, color: cor, lineHeight: 1 }}>{ev.hora}</div>
                          <div style={{ fontFamily: 'DM Sans', fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: cor, marginTop: 2 }}>{lbl}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 3 }}>{ev.imovel || ev.obs}</div>
                          <div style={{ fontSize: 12, color: 'var(--fg-2)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            <span>Contato: <b style={{ color: 'var(--navy)' }}>{ev.contato}</b></span>
                            {ev.tel && <span>{ev.tel}</span>}
                            {ev.obs && ev.imovel && <span style={{ color: cor, fontStyle: 'italic' }}>{ev.obs}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 7, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                            background: ev.status === 'confirmada' ? '#05966912' : ev.status === 'concluido' ? 'rgba(15,34,68,0.06)' : 'rgba(201,150,14,0.12)',
                            color: ev.status === 'confirmada' ? '#065F46' : ev.status === 'concluido' ? 'var(--fg-2)' : '#92600A',
                            textTransform: 'capitalize',
                          }}>{ev.status}</span>
                          {ev.status === 'pendente' && (
                            <button onClick={() => { setAgenda(p => p.map(e => e.id === ev.id ? {...e, status: 'confirmada'} : e)); showToast('Confirmado'); }}
                              style={{ padding: '5px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 11.5, cursor: 'pointer' }}>
                              Confirmar
                            </button>
                          )}
                          {ev.status === 'confirmada' && (
                            <button onClick={() => { setAgenda(p => p.map(e => e.id === ev.id ? {...e, status: 'concluido'} : e)); showToast('Concluído'); }}
                              style={{ padding: '5px 12px', background: 'transparent', color: 'var(--fg-2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11.5, cursor: 'pointer' }}>
                              Concluir
                            </button>
                          )}
                          {ev.tel && (
                            <a href={`https://wa.me/55${ev.tel.replace(/\D/g,'')}`} target="_blank" rel="noopener" style={{
                              padding: '5px 12px', background: '#25D36615', color: '#059669',
                              border: '1px solid #25D36630', borderRadius: 6, fontWeight: 700, fontSize: 11.5,
                              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                            }}>WA</a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: GESTÃO DE PORTAIS ── */}
        {tab === 'portais' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 6px', fontSize: 18, color: 'var(--navy)' }}>Gestão de Portais</h2>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)' }}>Visão consolidada de todos os canais da plataforma VN Prime.</p>
            </div>

            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 32 }}>
              {[
                { label: 'Área do Proprietário', accent: '#C9960E', stats: [{ l: 'Imóveis ativos', v: PORTAIS_STATS.proprietario.ativos }, { l: 'Aguard. curadoria', v: PORTAIS_STATS.proprietario.pendentes }, { l: 'Em carteira', v: PORTAIS_STATS.proprietario.emVenda }, { l: 'Fechamentos/mês', v: PORTAIS_STATS.proprietario.fechadosMes }], acoes: [{ label: 'Curadoria', t: 'curadoria' }, { label: 'Leads', t: 'leads' }] },
                { label: 'Portal do Corretor', accent: '#059669', stats: [{ l: 'Membros ativos', v: PORTAIS_STATS.corretor.membros }, { l: 'Em triagem', v: PORTAIS_STATS.corretor.emTriagem }, { l: 'Leads enviados', v: PORTAIS_STATS.corretor.leadsEnviados }, { l: 'Comissões/mês', v: PORTAIS_STATS.corretor.comissoesMes }], acoes: [{ label: 'Leads', t: 'leads' }] },
                { label: 'Canal do Fotógrafo', accent: '#B87333', stats: [{ l: 'Credenciados', v: PORTAIS_STATS.fotografo.credenciados }, { l: 'Jobs em aberto', v: PORTAIS_STATS.fotografo.jobsAbertos }, { l: 'Jobs concluídos', v: PORTAIS_STATS.fotografo.jobsConcluidos }, { l: 'Pagtos pendentes', v: PORTAIS_STATS.fotografo.pagamentosPendentes }], acoes: [{ label: 'Calendário', t: 'agenda' }] },
                { label: 'Consórcio Imobiliário', accent: '#1D4ED8', stats: [{ l: 'Simulações', v: PORTAIS_STATS.consorcio.simulacoes }, { l: 'Leads qualif.', v: PORTAIS_STATS.consorcio.leadsQualificados }, { l: 'Enviados Ademicon', v: PORTAIS_STATS.consorcio.enviados }, { l: 'Conversões', v: PORTAIS_STATS.consorcio.conversoes }], acoes: [{ label: 'Leads Consórcio', t: 'consorcio' }] },
              ].map(portal => (
                <div key={portal.label} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,34,68,0.07)', border: '1px solid var(--border)' }}>
                  <div style={{ height: 4, background: portal.accent }} />
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ fontFamily: 'Playfair Display', fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>{portal.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      {portal.stats.map(s => (
                        <div key={s.l} style={{ background: 'var(--cream)', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, color: portal.accent, lineHeight: 1 }}>{s.v}</div>
                          <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-2)', marginTop: 4 }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      {portal.acoes.map(a => (
                        <button key={a.label} onClick={() => setTab(a.t)} style={{
                          padding: '7px 14px', background: 'transparent', color: portal.accent,
                          border: `1.5px solid ${portal.accent}40`, borderRadius: 7,
                          fontFamily: 'DM Sans', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                        }}>{a.label} →</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 14, padding: '22px 24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>Próximos eventos</div>
                <button onClick={() => setTab('agenda')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600, color: 'var(--gold)' }}>Ver calendário completo →</button>
              </div>
              {agenda.filter(e => e.status !== 'concluido').slice(0,4).map((ev, i, arr) => {
                const tipoColors = { visita: '#2563EB', foto: '#B87333', reuniao: '#7C3AED' };
                const tipoLabels = { visita: 'Visita', foto: 'Foto', reuniao: 'Reunião' };
                const cor = tipoColors[ev.tipo] || '#6366F1';
                return (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10.5, fontWeight: 700, background: cor + '15', color: cor, flexShrink: 0 }}>{tipoLabels[ev.tipo]}</span>
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>{ev.imovel || ev.obs}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-2)', flexShrink: 0 }}>{ev.data} · {ev.hora}</div>
                    <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, flexShrink: 0,
                      background: ev.status === 'confirmada' ? '#05966912' : 'rgba(201,150,14,0.12)',
                      color: ev.status === 'confirmada' ? '#065F46' : '#92600A' }}>{ev.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Email modal */}
      {emailModal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setEmailModal(null); }} style={{
          position: 'fixed', inset: 0, zIndex: 600,
          background: 'rgba(15,34,68,0.72)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden',
            width: '100%', maxWidth: 680, boxShadow: '0 32px 80px rgba(15,34,68,0.28)', position: 'relative' }}>
            <div style={{ background: 'var(--navy)', padding: '22px 28px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 4 }}>
                  Email profissional · Lead qualificado
                </div>
                <div style={{ color: '#fff', fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 600 }}>
                  Enviar lead para Ademicon
                </div>
              </div>
              <button onClick={() => setEmailModal(null)} style={{
                border: 'none', background: 'rgba(255,255,255,0.12)',
                color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: 'var(--cream)', borderRadius: 14, padding: '24px 28px',
                border: '2px solid var(--border)', fontFamily: 'DM Sans', fontSize: 14, lineHeight: 1.75 }}>
                {/* Email preview */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--fg-2)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>De</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>VN Prime Imóveis &lt;parceiros@vnprime.com.br&gt;</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--fg-2)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Para</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Comercial Ademicon &lt;leads@ademicon.com.br&gt;</div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--navy)', marginBottom: 16 }}>
                  Novo lead qualificado — Consórcio Imobiliário VN Prime
                </div>
                <p style={{ color: 'var(--fg-2)', margin: '0 0 16px' }}>Prezados,</p>
                <p style={{ color: 'var(--fg-2)', margin: '0 0 16px' }}>
                  Encaminhou-se um lead qualificado captado via portal VN Prime Imóveis. O interessado passou por simulação
                  interativa e manifestou interesse em receber uma proposta oficial de consórcio imobiliário.
                </p>
                <div style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', border: '1.5px solid rgba(201,150,14,0.3)', marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Dados do lead</div>
                  {[
                    ['Nome completo', emailModal.nome],
                    ['E-mail', emailModal.email],
                    ['Telefone / WhatsApp', emailModal.telefone],
                    ['Carta de crédito desejada', emailModal.carta],
                    ['Parcela estimada aceita', emailModal.parcela],
                    ['Prazo de interesse', emailModal.prazo],
                    ['Data de captação', emailModal.data],
                    ['Origem', 'Portal VN Prime Imóveis — Simulador Consórcio'],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                      borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                      <span style={{ color: 'var(--fg-2)' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{val}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color: 'var(--fg-2)', margin: '0 0 10px' }}>
                  Por favor, entre em contato com o interessado em até 24 horas para apresentação da proposta personalizada.
                </p>
                <p style={{ color: 'var(--fg-2)', margin: 0, fontSize: 12.5 }}>
                  Atenciosamente,<br />
                  <strong>VN Prime Imóveis · Parcerias</strong><br />
                  parceiros@vnprime.com.br · vnprime.com.br
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button onClick={() => setEmailModal(null)} style={{
                  padding: '10px 20px', background: 'transparent', color: 'var(--fg-2)',
                  border: '1px solid var(--border)', borderRadius: 9, fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button onClick={() => {
                  const copy = [...consLeads];
                  const idx = copy.findIndex(l => l.id === emailModal.id);
                  if (idx > -1) copy[idx] = { ...copy[idx], status: 'Enviado' };
                  setConsLeads(copy);
                  setEmailModal(null);
                  showToast('Lead enviado para Ademicon com sucesso');
                }} style={{
                  padding: '10px 24px', background: 'var(--navy)', color: '#fff',
                  border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
                }}>
                  Confirmar envio ao parceiro →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

window.AdminPage = AdminPage;

})();
