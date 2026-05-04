// Portal do Proprietário
(function () {

const MOCK_IMOVEL = {
  id: 'vn-draft-01',
  titulo: 'Apartamento — Lourdes',
  bairro: 'Lourdes',
  tipo: 'Apartamento',
  area: 142,
  quartos: 3,
  suites: 2,
  vagas: 2,
  preco: 1_890_000,
  plano: '3',
  status: 'em_analise', // 'em_analise' | 'ativo' | 'vendido' | 'pausado'
  foto: null,
  publicadoEm: null,
  visitas: 0,
  contatos: 0,
  favoritos: 0,
};

const PLANO_LABELS = { 'direta': 'Venda Direta · R$ 197', '3': 'Venda Assistida · 3%', '6': 'Venda Completa · 6%' };
const STATUS_LABELS = {
  em_analise: { label: 'Em análise', color: '#D97706', bg: '#FEF3C7' },
  ativo:      { label: 'Ativo',      color: '#059669', bg: '#D1FAE5' },
  vendido:    { label: 'Vendido',    color: '#6B7280', bg: '#F3F4F6' },
  pausado:    { label: 'Pausado',    color: '#EF4444', bg: '#FEE2E2' },
};

const FMT_BRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const BOOSTER_PLANS = [
  {
    id: 'basico',
    label: 'Impulso Básico',
    price: 49.90,
    duration: '7 dias',
    perks: [
      'Posição de destaque na vitrine',
      'Distribuição ampliada por 7 dias',
      'Badge "Destaque" no card',
    ],
  },
  {
    id: 'premium',
    label: 'Impulso Premium',
    price: 99.00,
    duration: '15 dias',
    perks: [
      'Topo da vitrine por 15 dias',
      'Distribuição VIP + redes parceiras',
      'Badge "Premium" em destaque',
      'Relatório de alcance ao final',
    ],
    featured: true,
  },
];

const FOTO_PACKAGES = [
  { id: 'fotos',    label: 'Ensaio Fotográfico',    price: 899,   desc: 'Fotos profissionais com edição editorial', icon: '📸' },
  { id: 'drone',    label: 'Drone + Aéreo',          price: 1299,  desc: 'Vistas aéreas e implantação', icon: '🚁' },
  { id: 'video',    label: 'Foto + Vídeo',           price: 1999,  desc: 'Tour virtual cinematográfico', icon: '🎬' },
  { id: 'completo', label: 'Pacote Completo ⭐',      price: 2999,  desc: 'Foto + Vídeo + Drone — melhor custo-benefício', icon: '✨', featured: true },
];

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon, sub }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>{value}</span>
      <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{label}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 2 }}>{sub}</span>}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.em_analise;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 600,
      color: s.color,
      background: s.bg,
    }}>{s.label}</span>
  );
}

// ── Property summary card ────────────────────────────────────────────────────
function ImovelCard({ imovel, onBooster, onFoto }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Photo placeholder */}
      <div style={{
        height: 180,
        background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a6e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: 48, opacity: 0.3 }}>🏠</span>
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}>
          <StatusBadge status={imovel.status} />
        </div>
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 8,
          padding: '4px 10px',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
        }}>{PLANO_LABELS[imovel.plano]}</div>
      </div>

      {/* Info */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--navy)' }}>{imovel.titulo}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{imovel.bairro} · {imovel.area} m² · {imovel.quartos} quartos · {imovel.vagas} vagas</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--gold)', whiteSpace: 'nowrap' }}>{FMT_BRL(imovel.preco)}</div>
        </div>

        {imovel.status === 'em_analise' && (
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: 8,
            fontSize: 13,
            color: '#92400E',
          }}>
            ⏳ Seu anúncio está em análise pela equipe VN Prime. Você receberá um e-mail em até 24 horas.
          </div>
        )}

        {imovel.status === 'ativo' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 12 }}>
            {[
              { label: 'Visualizações', value: imovel.visitas },
              { label: 'Contatos', value: imovel.contatos },
              { label: 'Favoritos', value: imovel.favoritos },
            ].map(k => (
              <div key={k.label} style={{
                textAlign: 'center',
                background: 'var(--cream)',
                borderRadius: 8,
                padding: '10px 8px',
              }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--navy)' }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>{k.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <button onClick={onBooster} style={{
            flex: 1,
            minWidth: 140,
            padding: '9px 16px',
            background: 'linear-gradient(135deg, var(--gold) 0%, #e6a800 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}>⚡ Impulsionar anúncio</button>
          {imovel.plano === '3' && (
            <button onClick={onFoto} style={{
              flex: 1,
              minWidth: 140,
              padding: '9px 16px',
              background: 'transparent',
              color: 'var(--navy)',
              border: '1.5px solid var(--border)',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}>📸 Contratar fotógrafo</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Booster modal ─────────────────────────────────────────────────────────────
function BoosterModal({ onClose }) {
  const [selected, setSelected] = React.useState('premium');
  const [done, setDone] = React.useState(false);

  if (done) return (
    <div style={overlayStyle()}>
      <div style={modalBoxStyle(480)}>
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>⚡</div>
          <h2 style={{ margin: '0 0 8px', color: 'var(--navy)' }}>Impulso ativado!</h2>
          <p style={{ color: 'var(--fg-2)', margin: '0 0 24px' }}>
            Seu anúncio já está ganhando destaque na vitrine VN Prime.
          </p>
          <Btn variant="accent" onClick={onClose}>Voltar ao portal</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={overlayStyle()}>
      <div style={modalBoxStyle(560)}>
        <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--navy)' }}>Impulsionar anúncio</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>Apareça no topo da vitrine e alcance mais compradores</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--fg-2)', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BOOSTER_PLANS.map(plan => (
            <div key={plan.id} onClick={() => setSelected(plan.id)} style={{
              border: selected === plan.id ? '2px solid var(--gold)' : '1.5px solid var(--border)',
              borderRadius: 12,
              padding: '18px 20px',
              cursor: 'pointer',
              background: plan.featured && selected === plan.id ? 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' : selected === plan.id ? '#FAFAF7' : '#fff',
              transition: 'all 0.15s',
              position: 'relative',
            }}>
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  right: 16,
                  background: 'var(--gold)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '0 0 6px 6px',
                  letterSpacing: '0.05em',
                }}>RECOMENDADO</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>{plan.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>{plan.duration} de impulso</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--gold)' }}>
                  {plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <ul style={{ margin: '10px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {plan.perks.map(p => (
                  <li key={p} style={{ fontSize: 13, color: 'var(--fg-2)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--gold)', marginTop: 1 }}>✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 28px 28px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', color: 'var(--navy)' }}>
            Cancelar
          </button>
          <button onClick={() => setDone(true)} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, var(--gold) 0%, #e6a800 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            ⚡ Ativar impulso
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Foto packages modal ───────────────────────────────────────────────────────
function FotoModal({ onClose }) {
  const [selected, setSelected] = React.useState('completo');
  const [done, setDone] = React.useState(false);

  if (done) return (
    <div style={overlayStyle()}>
      <div style={modalBoxStyle(480)}>
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📸</div>
          <h2 style={{ margin: '0 0 8px', color: 'var(--navy)' }}>Solicitação enviada!</h2>
          <p style={{ color: 'var(--fg-2)', margin: '0 0 24px' }}>
            A equipe VN Prime entrará em contato para agendar o ensaio com um fotógrafo credenciado.
          </p>
          <Btn variant="accent" onClick={onClose}>Voltar ao portal</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={overlayStyle()}>
      <div style={modalBoxStyle(600)}>
        <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--navy)' }}>Pacotes de mídia profissional</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>Fotógrafos credenciados VN Prime · Edição editorial inclusa</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--fg-2)', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {FOTO_PACKAGES.map(pkg => (
            <div key={pkg.id} onClick={() => setSelected(pkg.id)} style={{
              border: selected === pkg.id ? '2px solid var(--gold)' : '1.5px solid var(--border)',
              borderRadius: 12,
              padding: '16px 18px',
              cursor: 'pointer',
              background: pkg.featured && selected === pkg.id ? 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' : selected === pkg.id ? '#FAFAF7' : '#fff',
              transition: 'all 0.15s',
              position: 'relative',
            }}>
              {pkg.featured && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  right: 12,
                  background: 'var(--gold)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '0 0 6px 6px',
                  letterSpacing: '0.05em',
                }}>MELHOR CUSTO</div>
              )}
              <div style={{ fontSize: 26, marginBottom: 8 }}>{pkg.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>{pkg.label}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 10, lineHeight: 1.4 }}>{pkg.desc}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}>
                {pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 28px 28px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', color: 'var(--navy)' }}>
            Cancelar
          </button>
          <button onClick={() => setDone(true)} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, var(--gold) 0%, #e6a800 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            📸 Solicitar ensaio
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function overlayStyle() {
  return {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,34,68,0.55)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };
}
function modalBoxStyle(maxW) {
  return {
    background: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: maxW,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  };
}

// ── Main portal page ──────────────────────────────────────────────────────────
function PortalPage({ onNav, authUser }) {
  const [modal, setModal] = React.useState(null); // 'booster' | 'foto' | null
  const nome = authUser?.name || 'Proprietário';
  const inicial = nome.trim()[0]?.toUpperCase() || 'P';
  const imovel = MOCK_IMOVEL;

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>
      {modal === 'booster' && <BoosterModal onClose={() => setModal(null)} />}
      {modal === 'foto'    && <FotoModal    onClose={() => setModal(null)} />}

      {/* Hero strip */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a6e 100%)',
        padding: '48px 24px 40px',
        color: '#fff',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 20,
              color: '#fff',
              flexShrink: 0,
            }}>{inicial}</div>
            <div>
              <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 2 }}>Portal do Proprietário</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>Olá, {nome.split(' ')[0]}</div>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 12 }}>
            <div style={kpiTileStyle()}>
              <div style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>Anúncios ativos</div>
              <div style={{ fontWeight: 800, fontSize: 28 }}>0</div>
            </div>
            <div style={kpiTileStyle()}>
              <div style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>Visualizações</div>
              <div style={{ fontWeight: 800, fontSize: 28 }}>—</div>
            </div>
            <div style={kpiTileStyle()}>
              <div style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>Contatos recebidos</div>
              <div style={{ fontWeight: 800, fontSize: 28 }}>—</div>
            </div>
            <div style={kpiTileStyle()}>
              <div style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>Favoritos</div>
              <div style={{ fontWeight: 800, fontSize: 28 }}>—</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Meu imóvel */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--navy)', fontWeight: 700 }}>Meu imóvel</h2>
            <button onClick={() => onNav('anunciar')} style={{
              padding: '8px 16px',
              background: 'var(--gold)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}>+ Novo anúncio</button>
          </div>

          <ImovelCard
            imovel={imovel}
            onBooster={() => setModal('booster')}
            onFoto={() => setModal('foto')}
          />
        </section>

        {/* BOOSTER callout */}
        <section style={{
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: 16,
          padding: '24px 28px',
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 40 }}>⚡</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', marginBottom: 4 }}>
              BOOSTER — Impulsione seu anúncio
            </div>
            <div style={{ fontSize: 14, color: '#78350F', lineHeight: 1.5 }}>
              Apareça no topo da vitrine e nas distribuições VN Prime. A partir de{' '}
              <strong>R$ 49,90</strong> por 7 dias.
            </div>
          </div>
          <button onClick={() => setModal('booster')} style={{
            padding: '11px 22px',
            background: 'linear-gradient(135deg, var(--gold) 0%, #e6a800 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>Ver opções</button>
        </section>

        {/* Pacotes de foto */}
        <section>
          <h2 style={{ margin: '0 0 6px', fontSize: 18, color: 'var(--navy)', fontWeight: 700 }}>Mídia profissional</h2>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--fg-2)' }}>
            Contrate um fotógrafo credenciado VN Prime e eleve a apresentação do seu imóvel.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
            {FOTO_PACKAGES.map(pkg => (
              <div key={pkg.id} style={{
                background: '#fff',
                border: pkg.featured ? '2px solid var(--gold)' : '1px solid var(--border)',
                borderRadius: 12,
                padding: '18px 20px',
                position: 'relative',
              }}>
                {pkg.featured && (
                  <div style={{
                    position: 'absolute',
                    top: -1,
                    right: 14,
                    background: 'var(--gold)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '0 0 6px 6px',
                    letterSpacing: '0.05em',
                  }}>MELHOR CUSTO</div>
                )}
                <div style={{ fontSize: 28, marginBottom: 8 }}>{pkg.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>{pkg.label}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 12, lineHeight: 1.4 }}>{pkg.desc}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--gold)', marginBottom: 12 }}>
                  {pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                </div>
                <button onClick={() => setModal('foto')} style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  border: '1.5px solid var(--border)',
                  borderRadius: 7,
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                  color: 'var(--navy)',
                }}>Solicitar</button>
              </div>
            ))}
          </div>
        </section>

        {/* FactorOne banner */}
        <section style={{
          background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
          border: '1px solid #BFDBFE',
          borderRadius: 16, padding: '20px 24px',
          display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 36 }}>📊</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#1E40AF' }}>FactorOne — Gestão financeira pessoal</div>
            <div style={{ fontSize: 13, color: '#3B82F6', marginTop: 3, lineHeight: 1.5 }}>
              30 dias grátis inclusos no seu plano · controle de receitas, custos e fluxo de caixa PF
            </div>
          </div>
          <button style={{ padding: '9px 18px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Ativar 30 dias grátis
          </button>
        </section>

        {/* Quick actions */}
        <section>
          <h2 style={{ margin: '0 0 16px', fontSize: 18, color: 'var(--navy)', fontWeight: 700 }}>Acesso rápido</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 10 }}>
            {[
              { icon: '🏠', label: 'Editar imóvel',     action: () => onNav('anunciar') },
              { icon: '🔍', label: 'Ver na vitrine',    action: () => onNav('busca') },
              { icon: '📞', label: 'Falar com suporte', action: () => {} },
            ].map(a => (
              <button key={a.label} onClick={a.action} style={{
                padding: '16px',
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                color: 'var(--navy)',
                textAlign: 'left',
              }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function kpiTileStyle() {
  return {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '14px 16px',
    color: '#fff',
  };
}

Object.assign(window, { PortalPage });
})();
