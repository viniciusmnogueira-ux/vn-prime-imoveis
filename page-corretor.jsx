// Portal do Corretor — freemium com paywall + seletor de áreas de atuação
(function () {

// ── Áreas da Grande BH ────────────────────────────────────────────────────────
const AREAS_GBH = [
  {
    grupo: 'BH — Centro-Sul',
    cor: '#4F46E5',
    areas: ['Savassi', 'Funcionários', 'Lourdes', 'Serra', 'Santo Agostinho', 'Anchieta', 'São Pedro', 'Cruzeiro', 'São Lucas', 'Mangabeiras', 'Santa Efigênia'],
  },
  {
    grupo: 'BH — Oeste',
    cor: '#0891B2',
    areas: ['Buritis', 'Estoril', 'Nova Suíça', 'Gutierrez', 'Jardim América', 'Santo Antônio', 'Calafate', 'Gameleira'],
  },
  {
    grupo: 'BH — Pampulha',
    cor: '#059669',
    areas: ['Pampulha', 'Santa Lúcia', 'Castelo', 'Planalto', 'Universitário', 'Itapoã', 'São Francisco', 'Caiçaras'],
  },
  {
    grupo: 'BH — Norte / Noroeste',
    cor: '#7C3AED',
    areas: ['Carlos Prates', 'Coração Eucarístico', 'Caiçara', 'Dom Bosco', 'Lagoinha', 'Concórdia', 'Padre Eustáquio', 'Pompéia'],
  },
  {
    grupo: 'BH — Nordeste / Leste',
    cor: '#B45309',
    areas: ['Santa Inês', 'Horto Florestal', 'Floresta', 'Cidade Nova', 'São Geraldo', 'Sagrada Família', 'Gorduras', 'São Paulo'],
  },
  {
    grupo: 'BH — Barreiro',
    cor: '#DC2626',
    areas: ['Barreiro', 'Lindeia', 'Bairro das Indústrias', 'Tirol', 'Jatobá'],
  },
  {
    grupo: 'BH — Venda Nova',
    cor: '#D97706',
    areas: ['Venda Nova', 'Jardim Leblon', 'São João Batista', 'Mantiqueira', 'Ernesto do Nascimento'],
  },
  {
    grupo: 'Vetor Sul',
    cor: '#0F766E',
    areas: ['Nova Lima', 'Vale do Sereno', 'Alphaville BH', 'Brumadinho', 'Rio Acima', 'Raposos', 'Mário Campos'],
  },
  {
    grupo: 'Vetor Norte',
    cor: '#6D28D9',
    areas: ['Santa Luzia', 'Vespasiano', 'Lagoa Santa', 'Pedro Leopoldo', 'Ribeirão das Neves', 'Confins', 'Esmeraldas'],
  },
  {
    grupo: 'Vetor Oeste',
    cor: '#1D4ED8',
    areas: ['Betim', 'Contagem', 'Ibirité', 'Sarzedo', 'Mateus Leme', 'Juatuba', 'Jardim Riacho'],
  },
  {
    grupo: 'Vetor Leste',
    cor: '#92400E',
    areas: ['Sabará', 'Caeté', 'Santa Bárbara', 'Barão de Cocais', 'João Monlevade'],
  },
];

// Mapa de área → grupo (para filtrar por grupo selecionado)
const AREA_TO_GRUPO = {};
AREAS_GBH.forEach(g => g.areas.forEach(a => { AREA_TO_GRUPO[a] = g.grupo; }));

// ── Mock data expandido ───────────────────────────────────────────────────────
const MOCK_LEADS = [
  { id:  1, nome: 'Ana Carolina M.',   bairro: 'Savassi',          tipo: 'Apartamento', orcamento: '1.2M–1.8M', quente: true  },
  { id:  2, nome: 'Ricardo T.',        bairro: 'Lourdes',          tipo: 'Cobertura',   orcamento: '2M–3M',     quente: true  },
  { id:  3, nome: 'Família Oliveira',  bairro: 'Serra',            tipo: 'Casa',        orcamento: '800k–1.2M', quente: false },
  { id:  4, nome: 'Marcelo S.',        bairro: 'Funcionários',     tipo: 'Apartamento', orcamento: '1M–1.5M',   quente: false },
  { id:  5, nome: 'Carla P.',          bairro: 'Buritis',          tipo: 'Apartamento', orcamento: '600k–900k', quente: true  },
  { id:  6, nome: 'João V.',           bairro: 'Nova Suíça',       tipo: 'Casa',        orcamento: '900k–1.3M', quente: false },
  { id:  7, nome: 'Fernanda L.',       bairro: 'Pampulha',         tipo: 'Apartamento', orcamento: '500k–750k', quente: false },
  { id:  8, nome: 'Bruno A.',          bairro: 'Castelo',          tipo: 'Casa',        orcamento: '700k–1M',   quente: true  },
  { id:  9, nome: 'Patrícia R.',       bairro: 'Nova Lima',        tipo: 'Casa',        orcamento: '1.5M–2.5M', quente: true  },
  { id: 10, nome: 'Eduardo M.',        bairro: 'Vale do Sereno',   tipo: 'Casa',        orcamento: '2M–3.5M',   quente: true  },
  { id: 11, nome: 'Daniela C.',        bairro: 'Betim',            tipo: 'Apartamento', orcamento: '300k–500k', quente: false },
  { id: 12, nome: 'Rafael O.',         bairro: 'Contagem',         tipo: 'Casa',        orcamento: '400k–600k', quente: false },
  { id: 13, nome: 'Luciana F.',        bairro: 'Lagoa Santa',      tipo: 'Casa',        orcamento: '600k–900k', quente: false },
  { id: 14, nome: 'Rodrigo B.',        bairro: 'Pedro Leopoldo',   tipo: 'Casa',        orcamento: '350k–550k', quente: false },
  { id: 15, nome: 'Camila G.',         bairro: 'Santa Luzia',      tipo: 'Apartamento', orcamento: '250k–400k', quente: false },
  { id: 16, nome: 'Thiago N.',         bairro: 'Sabará',           tipo: 'Casa',        orcamento: '450k–700k', quente: false },
  { id: 17, nome: 'Marina V.',         bairro: 'Horto Florestal',  tipo: 'Apartamento', orcamento: '550k–800k', quente: true  },
  { id: 18, nome: 'Felipe K.',         bairro: 'Venda Nova',       tipo: 'Apartamento', orcamento: '200k–350k', quente: false },
  { id: 19, nome: 'Isabela S.',        bairro: 'Barreiro',         tipo: 'Casa',        orcamento: '280k–450k', quente: false },
  { id: 20, nome: 'Gustavo H.',        bairro: 'Carlos Prates',    tipo: 'Apartamento', orcamento: '480k–700k', quente: true  },
  { id: 21, nome: 'Renata Q.',         bairro: 'Brumadinho',       tipo: 'Sítio',       orcamento: '800k–1.5M', quente: false },
  { id: 22, nome: 'André L.',          bairro: 'Alphaville BH',    tipo: 'Casa',        orcamento: '1.8M–3M',   quente: true  },
  { id: 23, nome: 'Vanessa M.',        bairro: 'Ibirité',          tipo: 'Casa',        orcamento: '220k–380k', quente: false },
  { id: 24, nome: 'Diego P.',          bairro: 'Ribeirão das Neves', tipo: 'Apartamento', orcamento: '180k–300k', quente: false },
];

const MOCK_IMOVEIS = [
  { id: 'vn-6001', titulo: 'Cobertura duplex',        bairro: 'Savassi',        area: 280, quartos: 4, preco: 3_200_000 },
  { id: 'vn-6002', titulo: 'Apartamento alto padrão', bairro: 'Lourdes',        area: 180, quartos: 3, preco: 2_100_000 },
  { id: 'vn-6003', titulo: 'Penthouse',                bairro: 'Serra',          area: 320, quartos: 4, preco: 4_500_000 },
  { id: 'vn-6004', titulo: 'Casa com piscina',         bairro: 'Nova Lima',      area: 420, quartos: 5, preco: 3_800_000 },
  { id: 'vn-6005', titulo: 'Mansão em condomínio',     bairro: 'Alphaville BH',  area: 600, quartos: 6, preco: 6_200_000 },
  { id: 'vn-6006', titulo: 'Apartamento garden',       bairro: 'Buritis',        area: 160, quartos: 3, preco: 1_100_000 },
  { id: 'vn-6007', titulo: 'Apartamento vista lago',   bairro: 'Pampulha',       area: 140, quartos: 3, preco:   950_000 },
  { id: 'vn-6008', titulo: 'Casa em condomínio',       bairro: 'Lagoa Santa',    area: 260, quartos: 4, preco: 1_400_000 },
  { id: 'vn-6009', titulo: 'Sobrado moderno',          bairro: 'Contagem',       area: 190, quartos: 3, preco:   720_000 },
  { id: 'vn-6010', titulo: 'Apartamento 3 quartos',    bairro: 'Carlos Prates',  area: 110, quartos: 3, preco:   680_000 },
];

const KANBAN_COLS = [
  { id: 'novo',       label: 'Novos leads',   color: '#6366F1', count: 2 },
  { id: 'contato',    label: 'Em contato',    color: '#F59E0B', count: 1 },
  { id: 'visita',     label: 'Visita agend.', color: '#3B82F6', count: 1 },
  { id: 'proposta',   label: 'Proposta',      color: '#8B5CF6', count: 0 },
  { id: 'fechamento', label: 'Fechamento',    color: '#059669', count: 0 },
];

const FMT_BRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const LS_KEY = 'vnprime_corretor_areas';
const loadAreas = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
const saveAreas = (a) => { try { localStorage.setItem(LS_KEY, JSON.stringify(a)); } catch {} };

// ── Paywall modal ─────────────────────────────────────────────────────────────
function PaywallModal({ onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,34,68,0.6)', backdropFilter:'blur(6px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:20, maxWidth:480, width:'100%', overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,0.3)' }}>
        <div style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1e3a6e 100%)', padding:'32px 32px 28px', textAlign:'center', color:'#fff' }}>
          <div style={{ fontSize:44, marginBottom:10 }}>🤝</div>
          <div style={{ fontWeight:800, fontSize:22, marginBottom:6 }}>Torne-se membro VN Prime</div>
          <div style={{ opacity:0.75, fontSize:14, lineHeight:1.5 }}>Acesse leads qualificados, imóveis exclusivos e ferramentas profissionais</div>
        </div>
        <div style={{ padding:'24px 32px 0', textAlign:'center' }}>
          <div style={{ color:'var(--fg-2)', fontSize:13, marginBottom:4 }}>Assinatura mensal</div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:4 }}>
            <span style={{ fontSize:42, fontWeight:800, color:'var(--gold)' }}>R$ 49</span>
            <span style={{ fontSize:22, fontWeight:700, color:'var(--gold)' }}>,90</span>
            <span style={{ fontSize:14, color:'var(--fg-2)' }}>/mês</span>
          </div>
        </div>
        <div style={{ padding:'16px 32px', display:'flex', flexDirection:'column', gap:8 }}>
          {['Leads qualificados com contato completo','Imóveis em Venda Completa (6%)','Funil Kanban de vendas','IA para descrição de imóveis','30 dias de gestão financeira','Compliance documental'].map(p => (
            <div key={p} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:'#374151' }}>
              <span style={{ color:'var(--gold)', fontWeight:700, marginTop:1 }}>✓</span>{p}
            </div>
          ))}
        </div>
        <div style={{ padding:'16px 32px 28px', display:'flex', flexDirection:'column', gap:10 }}>
          <button style={{ padding:'13px', background:'linear-gradient(135deg,var(--gold) 0%,#e6a800 100%)', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor:'pointer' }}>
            Assinar agora — R$ 49,90/mês
          </button>
          <button onClick={onClose} style={{ padding:'11px', background:'transparent', color:'var(--fg-2)', border:'none', cursor:'pointer', fontSize:13 }}>
            Agora não, continuar explorando
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Seletor de áreas ──────────────────────────────────────────────────────────
function AreasTab({ selected, onChange }) {
  const totalAreas = AREAS_GBH.reduce((s, g) => s + g.areas.length, 0);
  const gruposSelecionados = [...new Set(selected.map(a => AREA_TO_GRUPO[a]).filter(Boolean))];

  const toggleArea = (area) => {
    onChange(selected.includes(area) ? selected.filter(x => x !== area) : [...selected, area]);
  };

  const toggleGrupo = (grupo) => {
    const areasDoGrupo = AREAS_GBH.find(g => g.grupo === grupo)?.areas || [];
    const todasSelecionadas = areasDoGrupo.every(a => selected.includes(a));
    if (todasSelecionadas) {
      onChange(selected.filter(a => !areasDoGrupo.includes(a)));
    } else {
      const novas = areasDoGrupo.filter(a => !selected.includes(a));
      onChange([...selected, ...novas]);
    }
  };

  const selectAll = () => onChange(AREAS_GBH.flatMap(g => g.areas));
  const clearAll  = () => onChange([]);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ margin:0, fontSize:17, color:'var(--navy)' }}>Áreas de atuação</h2>
          <p style={{ margin:'4px 0 0', fontSize:13, color:'var(--fg-2)' }}>
            Selecione onde você atua — leads e imóveis serão filtrados automaticamente
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:13, color:'var(--fg-2)' }}>
            <strong style={{ color:'var(--navy)' }}>{selected.length}</strong> / {totalAreas} áreas
          </span>
          <button onClick={selectAll} style={{ padding:'6px 12px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
            Selecionar tudo
          </button>
          <button onClick={clearAll} style={{ padding:'6px 12px', background:'transparent', color:'var(--fg-2)', border:'1px solid var(--border)', borderRadius:6, fontSize:12, cursor:'pointer' }}>
            Limpar
          </button>
        </div>
      </div>

      {/* Grupos selecionados — chips resumo */}
      {gruposSelecionados.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {gruposSelecionados.map(g => {
            const grupo = AREAS_GBH.find(x => x.grupo === g);
            const count = (grupo?.areas || []).filter(a => selected.includes(a)).length;
            return (
              <span key={g} style={{ padding:'3px 10px', borderRadius:99, fontSize:12, fontWeight:600, background:`${grupo.cor}18`, color:grupo.cor, border:`1px solid ${grupo.cor}40` }}>
                {g} · {count}
              </span>
            );
          })}
        </div>
      )}

      {/* Grupos */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {AREAS_GBH.map(grupo => {
          const selecionadasNoGrupo = grupo.areas.filter(a => selected.includes(a));
          const todasSel = selecionadasNoGrupo.length === grupo.areas.length;
          const algumaSel = selecionadasNoGrupo.length > 0;

          return (
            <div key={grupo.grupo} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
              {/* Grupo header */}
              <div
                onClick={() => toggleGrupo(grupo.grupo)}
                style={{
                  padding:'12px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer',
                  background: todasSel ? `${grupo.cor}10` : algumaSel ? `${grupo.cor}06` : '#fff',
                  borderBottom:'1px solid var(--border)',
                }}
              >
                {/* Checkbox grupo */}
                <div style={{
                  width:20, height:20, borderRadius:5, flexShrink:0,
                  border: todasSel ? `2px solid ${grupo.cor}` : algumaSel ? `2px solid ${grupo.cor}` : '2px solid var(--border)',
                  background: todasSel ? grupo.cor : algumaSel ? `${grupo.cor}30` : '#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {todasSel && <span style={{ color:'#fff', fontSize:12, fontWeight:900 }}>✓</span>}
                  {algumaSel && !todasSel && <span style={{ color:grupo.cor, fontSize:14, fontWeight:900, lineHeight:1 }}>–</span>}
                </div>
                <div style={{ flex:1 }}>
                  <span style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>{grupo.grupo}</span>
                  <span style={{ marginLeft:8, fontSize:12, color:'var(--fg-2)' }}>{grupo.areas.length} áreas</span>
                </div>
                {algumaSel && (
                  <span style={{ padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:700, background:grupo.cor, color:'#fff' }}>
                    {selecionadasNoGrupo.length} sel.
                  </span>
                )}
              </div>

              {/* Chips de área */}
              <div style={{ padding:'12px 16px', display:'flex', flexWrap:'wrap', gap:8 }}>
                {grupo.areas.map(area => {
                  const sel = selected.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => toggleArea(area)}
                      style={{
                        padding:'5px 12px', borderRadius:99, fontSize:12, fontWeight:sel ? 700 : 500,
                        cursor:'pointer', transition:'all 0.12s',
                        background: sel ? grupo.cor : 'transparent',
                        color: sel ? '#fff' : 'var(--navy)',
                        border: sel ? `1.5px solid ${grupo.cor}` : '1.5px solid var(--border)',
                      }}
                    >{area}</button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save feedback */}
      <div style={{ padding:'12px 16px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, fontSize:13, color:'#15803D', display:'flex', alignItems:'center', gap:8 }}>
        <span>✓</span>
        <span>Suas áreas são salvas automaticamente e aplicadas aos leads e imóveis.</span>
      </div>
    </div>
  );
}

// ── Empty state quando área não tem leads ──────────────────────────────────────
function EmptyFiltered({ tipo, onTab }) {
  return (
    <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--fg-2)' }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🗺</div>
      <div style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:6 }}>
        Nenhum {tipo} nas suas áreas
      </div>
      <div style={{ fontSize:13, marginBottom:20 }}>
        Expanda sua cobertura geográfica para ver mais oportunidades
      </div>
      <button onClick={onTab} style={{ padding:'9px 20px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' }}>
        Gerenciar áreas
      </button>
    </div>
  );
}

// ── Lead row ──────────────────────────────────────────────────────────────────
function LeadRow({ lead, onPaywall }) {
  const grupo = AREAS_GBH.find(g => g.areas.includes(lead.bairro));
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'14px 18px', display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
      <div style={{ width:38, height:38, borderRadius:'50%', background: lead.quente ? '#FEF3C7' : 'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
        {lead.quente ? '🔥' : '👤'}
      </div>
      <div style={{ flex:1, minWidth:140 }}>
        <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>{lead.nome}</div>
        <div style={{ fontSize:12, color:'var(--fg-2)', marginTop:2, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <span>{lead.tipo}</span>
          <span>·</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
            {grupo && <span style={{ width:8, height:8, borderRadius:'50%', background:grupo.cor, display:'inline-block' }} />}
            {lead.bairro}
          </span>
          <span>·</span>
          <span>{lead.orcamento}</span>
        </div>
      </div>
      <div style={{ padding:'6px 12px', background:'var(--cream)', borderRadius:7, fontSize:13, color:'var(--fg-2)', filter:'blur(4px)', userSelect:'none', pointerEvents:'none', minWidth:120 }}>
        (31) 9••••-••••
      </div>
      <button onClick={onPaywall} style={{ padding:'7px 14px', background:'var(--gold)', color:'#fff', border:'none', borderRadius:7, fontWeight:700, fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
        Ver contato
      </button>
    </div>
  );
}

// ── Kanban preview ────────────────────────────────────────────────────────────
function KanbanPreview({ onPaywall }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8 }}>
        {KANBAN_COLS.map(col => (
          <div key={col.id} style={{ minWidth:160, background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', flexShrink:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={{ fontWeight:700, fontSize:12, color:'var(--navy)' }}>{col.label}</span>
              <span style={{ background:col.color, color:'#fff', borderRadius:99, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>{col.count}</span>
            </div>
            {col.count > 0 ? Array.from({ length: col.count }).map((_, i) => (
              <div key={i} style={{ background:'var(--cream)', borderRadius:7, padding:'8px 10px', marginBottom:6, fontSize:12, color:'var(--fg-2)', filter:'blur(2.5px)', userSelect:'none' }}>Lead #{i + 1} · Savassi</div>
            )) : (
              <div style={{ fontSize:11, color:'var(--fg-2)', textAlign:'center', padding:'8px 0', opacity:0.5 }}>vazio</div>
            )}
          </div>
        ))}
      </div>
      <div onClick={onPaywall} style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(255,255,255,0) 0%,rgba(255,255,255,0.85) 60%)', display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:16, cursor:'pointer', borderRadius:10 }}>
        <span style={{ background:'var(--navy)', color:'#fff', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:700 }}>🔒 Desbloquear funil completo</span>
      </div>
    </div>
  );
}

// ── Imóvel row ────────────────────────────────────────────────────────────────
function ImovelRow({ im, onPaywall }) {
  const grupo = AREAS_GBH.find(g => g.areas.includes(im.bairro));
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'14px 18px', display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
      <div style={{ width:44, height:44, borderRadius:8, background:'linear-gradient(135deg,var(--navy),#1e3a6e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🏠</div>
      <div style={{ flex:1, minWidth:160 }}>
        <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>{im.titulo}</div>
        <div style={{ fontSize:12, color:'var(--fg-2)', marginTop:2, display:'flex', gap:6, alignItems:'center' }}>
          {grupo && <span style={{ width:8, height:8, borderRadius:'50%', background:grupo.cor, display:'inline-block', flexShrink:0 }} />}
          {im.bairro} · {im.area} m² · {im.quartos} quartos
        </div>
      </div>
      <div style={{ fontWeight:800, fontSize:16, color:'var(--gold)' }}>{FMT_BRL(im.preco)}</div>
      <div style={{ background:'#D1FAE5', color:'#059669', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 }}>Venda Completa 6%</div>
      <button onClick={onPaywall} style={{ padding:'7px 14px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:7, fontWeight:700, fontSize:12, cursor:'pointer' }}>
        Entrar em contato
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
function CorretorPage({ onNav, authUser }) {
  const [paywall, setPaywall]   = React.useState(false);
  const [tab, setTab]           = React.useState('leads');
  const [areas, setAreas]       = React.useState(loadAreas);

  const nome = authUser?.name || 'Corretor';

  const handleAreas = (novas) => { setAreas(novas); saveAreas(novas); };

  // Filtragem por áreas selecionadas
  const semFiltro = areas.length === 0;
  const leadsVisiveis   = semFiltro ? MOCK_LEADS   : MOCK_LEADS.filter(l  => areas.includes(l.bairro));
  const imoveisVisiveis = semFiltro ? MOCK_IMOVEIS : MOCK_IMOVEIS.filter(im => areas.includes(im.bairro));

  const TABS = [
    { id: 'leads',       label: '🔥 Leads',        badge: leadsVisiveis.length },
    { id: 'imoveis',     label: '🏠 Imóveis (6%)',  badge: imoveisVisiveis.length },
    { id: 'kanban',      label: '📋 Funil Kanban',  badge: null },
    { id: 'ferramentas', label: '🛠 Ferramentas',   badge: null },
    { id: 'areas',       label: '🗺 Minhas áreas',  badge: areas.length || null, badgeColor: '#059669' },
  ];

  return (
    <main style={{ background:'var(--cream)', minHeight:'100vh', paddingBottom:80 }}>
      {paywall && <PaywallModal onClose={() => setPaywall(false)} />}

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1e3a6e 100%)', padding:'48px 24px 40px', color:'#fff' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
            <div style={{ width:50, height:50, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, color:'#fff', flexShrink:0 }}>
              {nome[0]?.toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ opacity:0.7, fontSize:13, marginBottom:2 }}>Portal do Corretor · Freemium</div>
              <div style={{ fontWeight:700, fontSize:22 }}>Olá, {nome.split(' ')[0]}</div>
            </div>
            <button onClick={() => setPaywall(true)} style={{ padding:'10px 20px', background:'linear-gradient(135deg,var(--gold) 0%,#e6a800 100%)', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              ⭐ Tornar-se membro · R$ 49,90/mês
            </button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12 }}>
            {[
              { label:'Leads na sua área',  value: semFiltro ? MOCK_LEADS.length   : leadsVisiveis.length },
              { label:'Imóveis (6%)',        value: semFiltro ? MOCK_IMOVEIS.length : imoveisVisiveis.length },
              { label:'Áreas cobertas',      value: semFiltro ? '—' : areas.length },
              { label:'Contatos liberados',  value:'🔒', locked:true },
            ].map(k => (
              <div key={k.label} onClick={k.locked ? () => setPaywall(true) : undefined} style={{ background:'rgba(255,255,255,0.1)', borderRadius:10, padding:'14px 16px', color:'#fff', cursor:k.locked ? 'pointer' : 'default', border:k.locked ? '1px dashed rgba(255,255,255,0.3)' : 'none' }}>
                <div style={{ opacity:0.65, fontSize:12, marginBottom:4 }}>{k.label}</div>
                <div style={{ fontWeight:800, fontSize:26 }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Resumo de áreas selecionadas no hero */}
          {areas.length > 0 && (
            <div style={{ marginTop:14, display:'flex', flexWrap:'wrap', gap:6 }}>
              {[...new Set(areas.map(a => AREA_TO_GRUPO[a]).filter(Boolean))].map(g => {
                const grupo = AREAS_GBH.find(x => x.grupo === g);
                const count = (grupo?.areas || []).filter(a => areas.includes(a)).length;
                return (
                  <span key={g} style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.25)' }}>
                    {g} · {count}
                  </span>
                );
              })}
              <button onClick={() => setTab('areas')} style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:'transparent', color:'rgba(255,255,255,0.7)', border:'1px dashed rgba(255,255,255,0.4)', cursor:'pointer' }}>
                + editar
              </button>
            </div>
          )}
          {areas.length === 0 && (
            <div style={{ marginTop:14 }}>
              <button onClick={() => setTab('areas')} style={{ padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:700, background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px dashed rgba(255,255,255,0.5)', cursor:'pointer' }}>
                🗺 Definir áreas de atuação → veja todos os {MOCK_LEADS.length} leads disponíveis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:'1px solid var(--border)', background:'#fff', overflowX:'auto' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex', minWidth:'max-content' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'14px 18px', background:'none', border:'none', fontWeight:tab === t.id ? 700 : 500, fontSize:13, cursor:'pointer', color:tab === t.id ? 'var(--navy)' : 'var(--fg-2)', borderBottom:tab === t.id ? '2.5px solid var(--gold)' : '2.5px solid transparent', transition:'all 0.15s', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:6 }}>
              {t.label}
              {t.badge != null && (
                <span style={{ padding:'1px 7px', borderRadius:99, fontSize:11, fontWeight:700, background:t.badgeColor || (tab === t.id ? 'var(--navy)' : '#E5E7EB'), color:t.badgeColor ? '#fff' : (tab === t.id ? '#fff' : 'var(--fg-2)') }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:960, margin:'0 auto', padding:'28px 24px' }}>

        {/* LEADS */}
        {tab === 'leads' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
              <div>
                <h2 style={{ margin:0, fontSize:17, color:'var(--navy)' }}>Leads qualificados</h2>
                <p style={{ margin:'4px 0 0', fontSize:13, color:'var(--fg-2)' }}>
                  {semFiltro
                    ? `${MOCK_LEADS.length} leads disponíveis — defina suas áreas para filtrar`
                    : `${leadsVisiveis.length} leads nas suas áreas (${MOCK_LEADS.length} no total)`}
                </p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ background:'#FEF3C7', color:'#92400E', padding:'5px 12px', borderRadius:99, fontSize:12, fontWeight:600 }}>
                  🔒 Assine para desbloquear contato
                </div>
                <button onClick={() => setTab('areas')} style={{ padding:'5px 12px', background:'transparent', border:'1px solid var(--border)', borderRadius:99, fontSize:12, color:'var(--navy)', cursor:'pointer', fontWeight:600 }}>
                  🗺 Filtrar por área
                </button>
              </div>
            </div>
            {leadsVisiveis.length === 0
              ? <EmptyFiltered tipo="lead" onTab={() => setTab('areas')} />
              : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {leadsVisiveis.map(lead => <LeadRow key={lead.id} lead={lead} onPaywall={() => setPaywall(true)} />)}
                </div>
            }
          </div>
        )}

        {/* IMÓVEIS */}
        {tab === 'imoveis' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
              <div>
                <h2 style={{ margin:0, fontSize:17, color:'var(--navy)' }}>Imóveis em Venda Completa</h2>
                <p style={{ margin:'4px 0 0', fontSize:13, color:'var(--fg-2)' }}>
                  {semFiltro
                    ? 'Proprietários no plano 6% — você conduz a venda e recebe 3% de comissão'
                    : `${imoveisVisiveis.length} imóveis nas suas áreas (${MOCK_IMOVEIS.length} no total)`}
                </p>
              </div>
              <button onClick={() => setTab('areas')} style={{ padding:'5px 12px', background:'transparent', border:'1px solid var(--border)', borderRadius:99, fontSize:12, color:'var(--navy)', cursor:'pointer', fontWeight:600 }}>
                🗺 Filtrar por área
              </button>
            </div>
            {imoveisVisiveis.length === 0
              ? <EmptyFiltered tipo="imóvel" onTab={() => setTab('areas')} />
              : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {imoveisVisiveis.map(im => <ImovelRow key={im.id} im={im} onPaywall={() => setPaywall(true)} />)}
                </div>
            }
          </div>
        )}

        {/* KANBAN */}
        {tab === 'kanban' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <h2 style={{ margin:0, fontSize:17, color:'var(--navy)' }}>Funil de vendas</h2>
              <p style={{ margin:'4px 0 0', fontSize:13, color:'var(--fg-2)' }}>Gerencie seu pipeline completo — disponível para membros</p>
            </div>
            <KanbanPreview onPaywall={() => setPaywall(true)} />
          </div>
        )}

        {/* FERRAMENTAS */}
        {tab === 'ferramentas' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div>
              <h2 style={{ margin:0, fontSize:17, color:'var(--navy)' }}>Ferramentas do corretor</h2>
              <p style={{ margin:'4px 0 0', fontSize:13, color:'var(--fg-2)' }}>Disponíveis para membros · assine por R$ 49,90/mês</p>
            </div>

            {/* FactorOne banner */}
            <div style={{ background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border:'1px solid #BFDBFE', borderRadius:12, padding:'16px 20px', display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ fontSize:32 }}>📊</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#1E40AF' }}>FactorOne — Gestão financeira</div>
                <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>30 dias grátis para todos · controle de comissões, custos e fluxo de caixa</div>
              </div>
              <button style={{ padding:'8px 16px', background:'#1D4ED8', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>Ativar grátis</button>
            </div>

            {/* Ferramentas — grid */}
            {[
              {
                categoria: 'Vendas & CRM',
                tools: [
                  { icon:'🤖', label:'IA — Descrição de imóveis', desc:'Gere textos com linguagem de alto padrão para qualquer imóvel', locked:false },
                  { icon:'👥', label:'CRM inteligente',            desc:'Gestão completa de clientes, histórico e oportunidades', locked:true },
                  { icon:'📋', label:'Controle de tarefas',        desc:'To-do por negócio, lembretes e acompanhamento de follow-up', locked:true },
                  { icon:'🏆', label:'Funil Sales Pipe',           desc:'Pipeline visual de negócios do primeiro contato ao fechamento', locked:true },
                ],
              },
              {
                categoria: 'Agenda & Comunicação',
                tools: [
                  { icon:'📅', label:'Gestão de agendamento',      desc:'Agenda de visitas integrada, confirmação automática por WhatsApp', locked:true },
                  { icon:'📧', label:'Email marketing',            desc:'Campanhas segmentadas para leads e carteira de clientes', locked:true },
                ],
              },
              {
                categoria: 'Inteligência de Mercado',
                tools: [
                  { icon:'🔍', label:'Pesquisa de mercado',        desc:'Comparativos de preço por bairro, tempo médio de venda e absorção', locked:true },
                  { icon:'📈', label:'Relatórios de desempenho',   desc:'Taxa de conversão, comissão acumulada e ranking de bairros', locked:true },
                ],
              },
              {
                categoria: 'Marketing Digital',
                tools: [
                  { icon:'📱', label:'Geração de stories e feed',  desc:'Templates prontos para Instagram com fotos dos imóveis', locked:true },
                  { icon:'🌐', label:'Posicionamento em redes',    desc:'Estratégia de conteúdo e calendário editorial personalizado', locked:true },
                ],
              },
              {
                categoria: 'Capacitação',
                tools: [
                  { icon:'🎓', label:'Curso de vendas VN Prime',   desc:'Módulos de negociação, objeções, fechamento e rapport com alto padrão', locked:true },
                ],
              },
            ].map(({ categoria, tools }) => (
              <div key={categoria}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--fg-2)', marginBottom:10 }}>{categoria}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10 }}>
                  {tools.map(tool => (
                    <div key={tool.label} onClick={tool.locked ? () => setPaywall(true) : undefined}
                      style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:12, padding:'18px', cursor:tool.locked ? 'pointer' : 'default', position:'relative', transition:'box-shadow 0.15s' }}>
                      {tool.locked && <div style={{ position:'absolute', top:12, right:12, fontSize:13, color:'var(--fg-2)' }}>🔒</div>}
                      <div style={{ fontSize:28, marginBottom:8 }}>{tool.icon}</div>
                      <div style={{ fontWeight:700, fontSize:13, color:'var(--navy)', marginBottom:4 }}>{tool.label}</div>
                      <div style={{ fontSize:12, color:'var(--fg-2)', lineHeight:1.5 }}>{tool.desc}</div>
                      {!tool.locked && (
                        <button style={{ marginTop:12, padding:'6px 14px', background:'var(--navy)', color:'#fff', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>Acessar</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ÁREAS */}
        {tab === 'areas' && (
          <AreasTab selected={areas} onChange={handleAreas} />
        )}
      </div>
    </main>
  );
}

Object.assign(window, { CorretorPage });
})();
