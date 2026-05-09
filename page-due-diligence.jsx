// Due Diligence Imobiliária — VN Prime
// Rota: due-diligence | Exporta: window.DueDiligencePage

(function () {

// Inject blink keyframe once
(function() {
  if (!document.getElementById('dd-kf')) {
    const s = document.createElement('style');
    s.id = 'dd-kf';
    s.textContent = '@keyframes ddBlink{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}';
    document.head.appendChild(s);
  }
})();

const DD_INDIGO  = '#6366F1';
const DD_VIOLET  = '#818CF8';
const DD_GOLD    = 'var(--gold)';
const DD_GREEN   = '#059669';

// ─── Hero ─────────────────────────────────────────────────────────────────────
function DDHero({ onNav }) {
  const stats = [
    { val: '30+', lbl: 'itens verificados' },
    { val: '48h', lbl: 'entrega do relatório' },
    { val: '100%', lbl: 'cobertura documental' },
    { val: 'R$ 0', lbl: 'de surpresas jurídicas' },
  ];
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--gradient-navy-hero)', color: '#fff',
      padding: 'clamp(3.5rem, 8vw, 5.5rem) 0 clamp(3rem, 6vw, 4rem)',
    }}>
      <div style={{ position: 'absolute', top: -160, right: -120, width: 560, height: 560,
        background: `radial-gradient(circle, ${DD_INDIGO}33 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 360, height: 360,
        background: `radial-gradient(circle, ${DD_VIOLET}22 0%, transparent 65%)`, pointerEvents: 'none' }} />

      {/* IA ATIVA badge — top right */}
      <div style={{ position: 'absolute', top: 22, right: 24, zIndex: 10,
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(99,102,241,0.22)', border: `1px solid ${DD_INDIGO}66`,
        borderRadius: 999, padding: '6px 14px' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: DD_VIOLET,
          display: 'inline-block', boxShadow: `0 0 8px ${DD_VIOLET}` }} />
        <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: DD_VIOLET }}>
          IA ATIVA
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 48, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>

          {/* Copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${DD_INDIGO}30`, border: `1px solid ${DD_INDIGO}66`,
              borderRadius: 999, padding: '5px 14px', marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: DD_VIOLET, display: 'inline-block' }} />
              <span style={{ fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: DD_VIOLET }}>
                Proteção jurídica e técnica
              </span>
            </div>
            <h1 style={{ color: '#fff', margin: '0 0 18px', fontSize: 'clamp(1.9rem, 3.5vw, 3rem)', lineHeight: 1.12 }}>
              Compre com{' '}
              <em style={{ background: `linear-gradient(135deg, ${DD_VIOLET}, ${DD_INDIGO})`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic' }}>
                total segurança.
              </em>{' '}
              <span style={{ color: 'rgba(250,249,246,0.88)' }}>Sem riscos ocultos.</span>
            </h1>
            <p style={{ color: 'rgba(250,249,246,0.78)', fontSize: 16, lineHeight: 1.75, margin: '0 0 28px', maxWidth: 520 }}>
              Antes de assinar qualquer contrato, a VN Prime analisa toda a documentação jurídica e
              realiza vistoria técnica do imóvel. Você recebe um relatório executivo completo em até 48 horas.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="https://wa.me/5531984144250?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20Due%20Diligence%20imobili%C3%A1ria%20pela%20VN%20Prime."
                target="_blank" rel="noopener noreferrer" style={{
                background: `linear-gradient(135deg, ${DD_VIOLET}, ${DD_INDIGO})`,
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                padding: '0.9rem 1.8rem', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 15,
                boxShadow: `0 8px 28px ${DD_INDIGO}55`, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center' }}>
                Solicitar análise agora →
              </a>
              <button onClick={() => {
                const el = document.getElementById('dd-checklist');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1px solid rgba(250,249,246,0.3)', borderRadius: 10, cursor: 'pointer',
                padding: '0.9rem 1.5rem', fontFamily: 'DM Sans', fontWeight: 600, fontSize: 15 }}>
                Ver checklist completo
              </button>
            </div>
          </div>

          {/* Checklist visual card */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: DD_VIOLET, marginBottom: 16 }}>Checklist — relatório VN Prime</div>
              {[
                'Matrícula e cadeia dominial',
                'Certidões negativas do vendedor',
                'Ônus reais, hipotecas e penhoras',
                'IPTU e débitos municipais',
                'Situação condominial',
                'Laudo de vistoria técnica com fotos',
                'Relatório executivo em até 48h',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 0', borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: DD_INDIGO,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13.5, color: 'rgba(250,249,246,0.9)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          marginTop: 44, background: 'rgba(255,255,255,0.06)', borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '18px 20px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                color: DD_VIOLET, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(250,249,246,0.6)' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5 Etapas com IA ─────────────────────────────────────────────────────────
function DDEtapasAnalise() {
  const [open, setOpen] = React.useState(null);
  const [ai,   setAi]   = React.useState({});

  const upAi = (id, patch) => setAi(p => ({ ...p, [id]: { ...p[id], ...patch } }));

  const analisar = (id) => {
    const s = ai[id] || {};
    if (!s.desc) return;
    upAi(id, { loading: true, result: null });
    setTimeout(() => {
      const t = ((s.desc || '') + ' ' + (s.tipo || '') + ' ' + (s.valor || '')).toLowerCase();
      let risco = 'baixo';
      if (/fraude|indisponibilidade judicial|recupera[çc][ãa]o judicial|fal[eê]ncia|bloqueio/.test(t)) risco = 'crítico';
      else if (/a[çc][ãa]o judicial|processo|penhora|execu[çc][ãa]o|hipoteca ativa|aliena[çc][ãa]o/.test(t)) risco = 'alto';
      else if (/protesto|atraso|pend[eê]ncia|d[eé]bito|irregularidade|em aberto/.test(t)) risco = 'médio';
      const textos = {
        baixo:   'A situação descrita não apresenta irregularidades críticas. Os documentos indicam regularidade nesta etapa. Verifique se as certidões têm menos de 30 dias e prossiga com as demais etapas da due diligence.',
        médio:   'Foram identificadas pendências que requerem atenção antes da compra. Recomendamos obter certidões atualizadas, exigir quitação formal ou garantias contratuais, e avaliar desconto no preço proporcional ao risco identificado.',
        alto:    'Foram detectados riscos jurídicos significativos. Gravames ou ações em aberto podem impactar a transferência do imóvel ou criar passivo para o comprador. Consulte um advogado especializado em direito imobiliário antes de qualquer compromisso.',
        crítico: 'ALERTA: Situação de risco crítico. As pendências identificadas representam impedimento grave para uma compra segura. A transação não deve ser concluída sem resolução completa das irregularidades. Consulte um advogado imobiliário imediatamente.',
      };
      upAi(id, { loading: false, result: { risco, texto: textos[risco] } });
    }, 1500);
  };

  const riscoBadge = (r) => ({ baixo: { bg: 'rgba(5,150,105,.3)', color: '#6ee7b7' }, médio: { bg: 'rgba(201,150,14,.3)', color: '#fcd34d' }, alto: { bg: 'rgba(217,119,6,.3)', color: '#fbbf24' }, crítico: { bg: 'rgba(220,38,38,.3)', color: '#f87171' } })[r] || {};

  const etapas = [
    {
      id: 'matricula', num: '01', badgeLabel: 'Registro de Imóveis', badgeColor: '#1B3A6B',
      title: 'Registradores — ONR', subtitle: 'Matrícula, ônus reais e pesquisa de bens por CPF/CNPJ',
      portal: 'registradores.onr.org.br',
      verificar: ['Proprietário atual registrado e legitimidade de venda', 'Histórico completo de transmissões de propriedade', 'Hipotecas, penhoras, alienações fiduciárias e usufrutos', 'Indisponibilidade judicial de bens', 'Área, confrontações e descrição do imóvel'],
      atencao: [
        { t: 'Prazo da certidão', d: 'Sempre exija matrícula com menos de 30 dias. Gravames recentes podem não constar em documentos desatualizados.' },
        { t: 'Pesquisa por CPF', d: 'Verifique todos os imóveis do vendedor — outros podem estar penhorados em processos que afetam indiretamente este negócio.' },
      ],
      aiTitle: 'Análise por IA — Matrícula e Registro',
      aiDesc: 'Descreva o que encontrou na matrícula e receba uma análise de risco detalhada',
      aiLabel: 'O que você encontrou na matrícula? Descreva situação, ônus, irregularidades ou dúvidas',
      aiPH: 'Ex: A matrícula apresenta hipoteca registrada em 2019 em favor do Banco X, com valor de R$ 200.000. O vendedor afirma que está quitada mas não tem certidão...',
    },
    {
      id: 'protestos', num: '02', badgeLabel: 'Protesto Nacional', badgeColor: '#B5551A',
      title: 'CENPROT — Central de Protestos', subtitle: 'Verificação de protestos por CPF ou CNPJ do vendedor',
      portal: 'pesquisaprotesto.com.br',
      verificar: ['Volume e valor total de protestos em aberto', 'Protestos recentes (últimos 12 a 24 meses)', 'Natureza: cheques, notas promissórias, duplicatas', 'Protestos em nome de empresa (CNPJ) e sócios individualmente', 'Padrão temporal: deterioração financeira acelerada?'],
      atencao: [
        { t: 'Janela de vulnerabilidade', d: 'Entre a assinatura e o registro no cartório, credores podem conseguir penhoras sobre o imóvel.' },
        { t: 'PJ + sócios', d: 'Se o imóvel está em nome de empresa, pesquise o CNPJ e cada sócio administrador separadamente.' },
      ],
      aiTitle: 'Análise por IA — Saúde Financeira do Vendedor',
      aiDesc: 'Informe o resultado da consulta de protestos e receba avaliação do risco financeiro',
      aiLabel: 'Descreva os protestos encontrados (período, natureza, valores) ou escreva "sem protestos"',
      aiPH: 'Ex: 2 protestos de 2023, totalizando R$ 38.000, sendo 1 cheque e 1 duplicata. 1 protesto de 2024 de R$ 12.000 em aberto...',
    },
    {
      id: 'fiscal', num: '03', badgeLabel: 'Débitos Fiscais', badgeColor: '#2D6A4F',
      title: 'Receita Federal — PGFN', subtitle: 'Certidão de débitos fiscais — CPF, CNPJ e IPTU municipal',
      portal: 'servicos.receita.fazenda.gov.br',
      verificar: ['Certidão Negativa de Débitos da Receita Federal (CPF/CNPJ)', 'Dívida Ativa da União — PGFN', 'IPTU municipal — certidão negativa de débitos do imóvel', 'Certidão negativa de débitos estaduais', 'ITR (Imposto Territorial Rural) para imóveis rurais'],
      atencao: [
        { t: 'Débitos fiscais do imóvel', d: 'IPTU não pago acompanha o imóvel — mesmo após a venda, o comprador pode ser cobrado pelas dívidas anteriores.' },
        { t: 'Penhora fiscal', d: 'Débitos com a Receita Federal podem resultar em penhora automática de bens, incluindo o imóvel em negociação.' },
      ],
      aiTitle: 'Análise por IA — Situação Fiscal',
      aiDesc: 'Informe os débitos encontrados nas certidões fiscais',
      aiLabel: 'Descreva os débitos fiscais identificados ou escreva "certidões negativas"',
      aiPH: 'Ex: IPTU em atraso de 2022 e 2023, totalizando R$ 4.200. CND da Receita Federal negativa para o vendedor...',
    },
    {
      id: 'judicial', num: '04', badgeLabel: 'Processos Judiciais', badgeColor: '#7C3AED',
      title: 'Processos Judiciais — CNJ', subtitle: 'Ações cíveis, criminais, trabalhistas e execuções',
      portal: 'cnj.jus.br/pesquisapj',
      verificar: ['Ações cíveis em andamento no nome do vendedor', 'Execuções fiscais e trabalhistas com alto valor', 'Ações de despejo, usucapião ou reintegração de posse', 'Processos relacionados diretamente ao imóvel', 'Ações criminais com potencial impacto patrimonial'],
      atencao: [
        { t: 'Execuções trabalhistas', d: 'Empresa com dívidas trabalhistas em execução pode ter imóveis penhorados para garantir o pagamento.' },
        { t: 'Valor × risco', d: 'Compare o valor das execuções com o patrimônio declarado. Execução de R$ 2M em vendedor com 1 imóvel é risco crítico.' },
      ],
      aiTitle: 'Análise por IA — Processos Judiciais',
      aiDesc: 'Descreva os processos encontrados e receba avaliação de risco jurídico',
      aiLabel: 'Descreva as ações judiciais encontradas ou escreva "sem processos relevantes"',
      aiPH: 'Ex: Execução trabalhista de R$ 180.000 em andamento desde 2022. 2 ações cíveis de baixo valor encerradas...',
    },
    {
      id: 'falencia', num: '05', badgeLabel: 'Recuperação Judicial', badgeColor: '#0F766E',
      title: 'Falência e Recuperação Judicial', subtitle: 'RecuperaJud e juntas comerciais estaduais',
      portal: 'recuperajud.cnj.jus.br',
      verificar: ['Processo de falência ou recuperação judicial decretada', 'Pedido de recuperação em fase de análise', 'Situação na Junta Comercial estadual (JUCEMG)', 'Histórico de empresas anteriores dos sócios', 'Ata de deliberação autorizando a venda do imóvel (PJ)'],
      atencao: [
        { t: 'Comprador de boa-fé', d: 'Mesmo de boa-fé, imóveis adquiridos de empresa em recuperação podem ser declarados ineficazes pelo juízo da recuperação.' },
        { t: 'Autorização judicial', d: 'Vendas de ativos por empresas em recuperação dependem de autorização expressa do juízo competente.' },
      ],
      aiTitle: 'Análise por IA — Situação Empresarial',
      aiDesc: 'Informe a situação da empresa ou vendedor pessoa física',
      aiLabel: 'Descreva a situação da empresa vendedora ou do vendedor pessoa física',
      aiPH: 'Ex: Empresa em recuperação judicial desde março/2023. Pedido deferido. Ata de venda não encontrada no processo...',
    },
  ];

  const inputSt = {
    width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 3, padding: '9px 12px', color: '#fff', fontSize: 13,
    fontFamily: 'DM Sans', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1040px, 92vw)', margin: '0 auto' }}>
        {/* Intro */}
        <div style={{ maxWidth: 720, marginBottom: 52 }}>
          <Eyebrow color={DD_INDIGO}>5 fontes oficiais · IA em cada etapa</Eyebrow>
          <h2 style={{ margin: '8px 0 16px', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.2 }}>
            O risco não está no preço.<br/>Está nos documentos.
          </h2>
          <div style={{ width: 48, height: 2, background: 'var(--gold)', margin: '20px 0' }} />
          <p style={{ color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.8, maxWidth: 680 }}>
            Um imóvel com matrícula irregular ou vendedor com dívidas ativas pode transformar o maior investimento da sua vida em um processo judicial. Verifique cada etapa com o suporte de IA especializada — e receba uma análise de risco instantânea.
          </p>
        </div>

        {/* Step cards */}
        {etapas.map(etapa => {
          const isOpen = open === etapa.id;
          const s = ai[etapa.id] || {};
          const rb = riscoBadge(s.result?.risco);
          return (
            <div key={etapa.id} style={{
              background: '#fff', border: '1px solid var(--border)', borderRadius: 6,
              marginBottom: 14, overflow: 'hidden',
              boxShadow: isOpen ? '0 8px 40px rgba(15,34,68,0.10)' : '0 2px 8px rgba(15,34,68,0.04)',
              transition: 'box-shadow 0.25s',
            }}>
              {/* Header */}
              <div onClick={() => setOpen(o => o === etapa.id ? null : etapa.id)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '24px 28px',
                  cursor: 'pointer', userSelect: 'none',
                  background: isOpen ? 'rgba(15,34,68,0.015)' : '#fff', transition: 'background 0.2s' }}>
                <div style={{ width: 52, height: 52, background: 'var(--navy)', borderRadius: 4,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, textTransform: 'uppercase' }}>Etapa</span>
                  <span style={{ fontFamily: 'Playfair Display', fontSize: 19, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{etapa.num}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '1.5px',
                    textTransform: 'uppercase', padding: '3px 9px', borderRadius: 12, marginBottom: 7,
                    background: etapa.badgeColor + '18', color: etapa.badgeColor }}>
                    {etapa.badgeLabel}
                  </span>
                  <h3 style={{ margin: '0 0 3px', fontSize: 19, color: 'var(--navy)',
                    fontFamily: 'Playfair Display', fontWeight: 600 }}>{etapa.title}</h3>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>{etapa.subtitle}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 7,
                    fontSize: 11, color: 'var(--navy)', background: 'rgba(15,34,68,0.06)',
                    padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
                    🔗 {etapa.portal}
                  </div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${isOpen ? 'var(--navy)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10,
                  background: isOpen ? 'var(--navy)' : '#fff',
                  color: isOpen ? '#fff' : 'var(--navy)',
                  transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'all 0.3s' }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              {/* Body */}
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 24, padding: '24px 28px' }}>
                    <div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: 9.5, fontWeight: 700,
                        letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)',
                        marginBottom: 14 }}>O que verificar</div>
                      {etapa.verificar.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                          <div style={{ width: 18, height: 18, border: '1.5px solid var(--gold)',
                            borderRadius: 3, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                          <span style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: 9.5, fontWeight: 700,
                        letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)',
                        marginBottom: 14 }}>Pontos de atenção</div>
                      {etapa.atencao.map((a, i) => (
                        <div key={i} style={{ background: 'rgba(201,150,14,0.07)',
                          borderLeft: '3px solid var(--gold)', padding: '12px 14px',
                          borderRadius: '0 4px 4px 0', marginBottom: 10 }}>
                          <div style={{ fontSize: 12.5, color: 'var(--navy)', lineHeight: 1.65 }}>
                            <strong>{a.t}:</strong> {a.d}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Panel */}
                  <div style={{ borderTop: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, var(--navy) 0%, #1B3A6B 100%)',
                    padding: '22px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                      <div style={{ width: 36, height: 36, background: 'rgba(201,150,14,0.2)',
                        border: '1px solid rgba(201,150,14,0.4)', borderRadius: 4,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Playfair Display', fontSize: 15, fontWeight: 600, color: '#fff' }}>{etapa.aiTitle}</div>
                        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>{etapa.aiDesc}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px',
                          textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Tipo de imóvel</label>
                        <select value={s.tipo || ''} onChange={e => upAi(etapa.id, { tipo: e.target.value })}
                          style={{ ...inputSt, appearance: 'none' }}>
                          <option value="">Selecione...</option>
                          {['Apartamento residencial','Casa residencial','Imóvel comercial','Terreno urbano','Imóvel rural'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px',
                          textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Valor aproximado</label>
                        <input type="text" placeholder="Ex: R$ 850.000" value={s.valor || ''}
                          onChange={e => upAi(etapa.id, { valor: e.target.value })} style={inputSt}/>
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px',
                        textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{etapa.aiLabel}</label>
                      <textarea value={s.desc || ''} onChange={e => upAi(etapa.id, { desc: e.target.value })}
                        placeholder={etapa.aiPH}
                        style={{ ...inputSt, resize: 'vertical', minHeight: 68 }}/>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                      <button onClick={() => analisar(etapa.id)} disabled={!s.desc}
                        style={{ display: 'flex', alignItems: 'center', gap: 7,
                          background: s.desc ? 'var(--gold)' : 'rgba(201,150,14,0.3)',
                          color: s.desc ? 'var(--navy)' : 'rgba(255,255,255,0.4)',
                          border: 'none', padding: '11px 20px', borderRadius: 3,
                          fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                          cursor: s.desc ? 'pointer' : 'default', fontFamily: 'DM Sans' }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                        </svg>
                        Analisar com IA
                      </button>
                      {s.result && (
                        <button onClick={() => upAi(etapa.id, { result: null, desc: '', valor: '', tipo: '' })}
                          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.6)', padding: '11px 16px', borderRadius: 3,
                            fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans' }}>Limpar</button>
                      )}
                    </div>

                    {s.loading && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                        color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[0,1,2].map(i => (
                            <span key={i} style={{ width: 5, height: 5, borderRadius: '50%',
                              background: 'var(--gold)', display: 'inline-block',
                              animation: `ddBlink 1.4s ${i*0.2}s infinite` }} />
                          ))}
                        </div>
                        Analisando documentos...
                      </div>
                    )}

                    {s.result && (
                      <div style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 4, padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <span style={{ fontSize: 9.5, color: 'var(--gold)', letterSpacing: '2px',
                            textTransform: 'uppercase', fontWeight: 700 }}>Análise VN Prime IA</span>
                          <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 10.5, fontWeight: 700,
                            letterSpacing: '0.5px', textTransform: 'capitalize',
                            background: rb.bg, color: rb.color }}>
                            Risco {s.result.risco}
                          </span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
                          {s.result.texto}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Como funciona ────────────────────────────────────────────────────────────
function DDComoFunciona() {
  const passos = [
    { num: '01', color: DD_INDIGO, title: 'Solicitação',          desc: 'Envie o endereço ou matrícula do imóvel pelo WhatsApp ou formulário. Sem burocracia inicial.' },
    { num: '02', color: DD_GOLD,   title: 'Análise documental',   desc: 'Nossa equipe jurídica levanta matrícula, certidões, ônus, débitos e situação fiscal em até 24h.' },
    { num: '03', color: DD_GREEN,  title: 'Vistoria técnica',     desc: 'Engenheiro ou arquiteto parceiro visita o imóvel e elabora laudo técnico detalhado com fotos.' },
    { num: '04', color: '#B87333', title: 'Relatório executivo',  desc: 'Você recebe em até 48h um relatório com semáforo de risco e recomendações claras para negociação.' },
  ];
  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 60px' }}>
          <Eyebrow color={DD_INDIGO}>Processo transparente</Eyebrow>
          <h2 style={{ margin: '8px 0 16px', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>Como funciona a Due Diligence VN Prime</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.75 }}>
            Da solicitação ao relatório final em 4 etapas claras. Você compra com informação — não com esperança.
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
                color: p.color === DD_GOLD ? 'var(--navy)' : '#fff',
                fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700 }}>{p.num}</div>
              <h3 style={{ margin: '0 0 10px', fontSize: 18, color: 'var(--navy)' }}>{p.title}</h3>
              <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Checklist interativo ─────────────────────────────────────────────────────
function DDDocumentChecklist() {
  const categorias = [
    {
      titulo: 'Documentos do Imóvel',
      cor: DD_INDIGO,
      docs: [
        'Matrícula atualizada (Cartório de Imóveis)',
        'Planta aprovada pela prefeitura',
        'Habite-se ou auto de conclusão',
        'IPTU — certidão negativa de débitos',
        'Certidão de ônus reais',
        'Certidão de inteiro teor',
        'CCIR e ITR (imóveis rurais)',
      ],
    },
    {
      titulo: 'Certidões do Vendedor (PF)',
      cor: '#B87333',
      docs: [
        'RG/CPF ou identidade válida',
        'Certidão de nascimento ou casamento',
        'Certidão negativa da Receita Federal (CPF)',
        'Certidão negativa trabalhista (TST)',
        'Certidão negativa estadual e federal',
        'Certidão negativa de protesto',
        'Certidão de ações cíveis e criminais',
      ],
    },
    {
      titulo: 'Certidões do Vendedor (PJ)',
      cor: DD_GREEN,
      docs: [
        'Contrato social e alterações',
        'CNPJ ativo e regular',
        'Certidão negativa de débitos federais',
        'Certidão negativa de falência e recuperação judicial',
        'Ata / deliberação autorizando a venda do imóvel',
        'Certidão negativa trabalhista da empresa',
        'Certidão de regularidade do FGTS',
      ],
    },
  ];

  const [checked, setChecked] = React.useState({});
  const toggle = (catIdx, docIdx) => {
    const key = `${catIdx}-${docIdx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const catCount = (catIdx) => categorias[catIdx].docs.filter((_, i) => checked[`${catIdx}-${i}`]).length;
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const totalDocs    = categorias.reduce((s, c) => s + c.docs.length, 0);

  return (
    <section id="dd-checklist" style={{ background: 'var(--navy)', padding: 'clamp(4rem, 7vw, 6rem) 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500,
        background: `radial-gradient(circle, ${DD_INDIGO}18 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,150,14,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {/* IA ATIVA inline badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 16,
            background: 'rgba(99,102,241,0.2)', border: `1px solid ${DD_INDIGO}55`,
            borderRadius: 999, padding: '5px 14px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: DD_VIOLET,
              display: 'inline-block', boxShadow: `0 0 6px ${DD_VIOLET}` }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: DD_VIOLET }}>
              IA ATIVA — Checklist inteligente
            </span>
          </div>
          <Eyebrow>Documentação completa</Eyebrow>
          <h2 style={{ color: '#fff', margin: '8px 0 12px', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
            Marque o que você já tem
          </h2>
          <p style={{ color: 'rgba(250,249,246,0.65)', fontSize: 15, margin: '0 0 20px' }}>
            Use o checklist abaixo para acompanhar quais documentos já foram reunidos.
          </p>
          {/* Progress geral */}
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 24px' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(250,249,246,0.5)', marginBottom: 6 }}>
              Progresso geral
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 180, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                <div style={{ height: '100%', borderRadius: 99, background: DD_VIOLET,
                  width: (totalChecked / totalDocs * 100) + '%', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontFamily: 'Playfair Display', fontSize: 15, fontWeight: 700, color: DD_VIOLET }}>
                {totalChecked} de {totalDocs}
              </span>
            </div>
          </div>
        </div>

        {/* 3 colunas de categoria */}
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {categorias.map((cat, catIdx) => {
            const count = catCount(catIdx);
            const pct   = count / cat.docs.length * 100;
            return (
              <div key={cat.titulo} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 24px' }}>
                {/* Header da categoria */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.cor, flexShrink: 0 }} />
                  <div style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700,
                    color: 'rgba(250,249,246,0.9)', flex: 1 }}>{cat.titulo}</div>
                </div>
                {/* Progress bar da categoria */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99, marginBottom: 6 }}>
                  <div style={{ height: '100%', borderRadius: 99, background: cat.cor,
                    width: pct + '%', transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(250,249,246,0.4)', marginBottom: 18 }}>
                  {count} de {cat.docs.length} documentos
                </div>
                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {cat.docs.map((doc, docIdx) => {
                    const key  = `${catIdx}-${docIdx}`;
                    const done = !!checked[key];
                    return (
                      <label key={docIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                        background: done ? `${cat.cor}18` : 'transparent',
                        border: `1px solid ${done ? cat.cor + '44' : 'transparent'}`,
                        transition: 'all 0.15s' }}>
                        <div onClick={() => toggle(catIdx, docIdx)} style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                          border: `1.5px solid ${done ? cat.cor : 'rgba(255,255,255,0.25)'}`,
                          background: done ? cat.cor : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s', cursor: 'pointer' }}>
                          {done && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 13, lineHeight: 1.5,
                          color: done ? 'rgba(250,249,246,0.95)' : 'rgba(250,249,246,0.65)',
                          textDecoration: done ? 'none' : 'none', fontWeight: done ? 500 : 400 }}>
                          {doc}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA se progresso > 0 */}
        {totalChecked > 0 && (
          <div style={{ marginTop: 32, background: `rgba(99,102,241,0.12)`,
            border: `1px solid ${DD_INDIGO}44`, borderRadius: 16, padding: '22px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                Você reuniu {totalChecked} de {totalDocs} documentos
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(250,249,246,0.6)' }}>
                Nossa equipe pode completar a análise dos documentos restantes para você.
              </div>
            </div>
            <a href="https://wa.me/5531984144250?text=Ol%C3%A1!%20Estou%20reunindo%20documentos%20para%20Due%20Diligence%20e%20gostaria%20de%20ajuda."
              target="_blank" rel="noopener noreferrer"
              style={{ background: `linear-gradient(135deg, ${DD_VIOLET}, ${DD_INDIGO})`,
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                padding: '12px 22px', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              Solicitar análise agora →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Fotos ────────────────────────────────────────────────────────────────────
function DDFotos() {
  const imgs = [
    { url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80', label: 'Análise documental',   sub: 'Cartório e certidões' },
    { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', label: 'Vistoria in loco',      sub: 'Laudo técnico com fotos' },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', label: 'Relatório executivo', sub: 'Entrega em 48h' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', label: 'Consultor jurídico',  sub: 'Equipe especializada' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', label: 'Compra segura',       sub: 'Assinatura tranquila' },
    { url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80', label: 'Patrimônio protegido','sub': 'Sem surpresas jurídicas' },
  ];
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Eyebrow color={DD_GOLD}>Processo visual</Eyebrow>
          <h2 style={{ margin: '8px 0 12px' }}>Da análise à assinatura segura</h2>
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
                <div style={{ fontSize: 12, color: 'rgba(250,249,246,0.65)' }}>{img.sub}</div>
              </div>
              <div style={{ position: 'absolute', top: 12, left: 12, background: DD_INDIGO, color: '#fff',
                borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700 }}>DD</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Semáforo de risco ────────────────────────────────────────────────────────
function DDSemaforo() {
  const niveis = [
    { cor: DD_GREEN,   label: 'Verde — Aprovado',    desc: 'Documentação regular, sem pendências. Imóvel apto para compra imediata. Recomendamos prosseguir com o contrato.' },
    { cor: '#D97706',  label: 'Amarelo — Atenção',   desc: 'Pendências menores identificadas. Possível renegociação de preço ou condições contratuais. Compra possível com ressalvas documentadas.' },
    { cor: '#DC2626',  label: 'Vermelho — Risco',    desc: 'Irregularidades graves detectadas — ônus ocultos, fraude, dívidas fiscais ou passivo jurídico elevado. Recomendamos não prosseguir.' },
  ];
  return (
    <section style={{ background: 'var(--cream)', padding: 'clamp(3.5rem, 7vw, 5.5rem) 0' }}>
      <div style={{ width: 'min(860px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <Eyebrow color={DD_INDIGO}>Resultado do relatório</Eyebrow>
          <h2 style={{ margin: '8px 0 12px' }}>Semáforo de risco</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, margin: 0 }}>
            Cada relatório termina com um semáforo claro. Você sabe exatamente onde está.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {niveis.map(n => (
            <div key={n.label} style={{ background: '#fff', border: '1px solid var(--border)',
              borderRadius: 16, padding: '22px 28px', display: 'flex', gap: 20, alignItems: 'flex-start',
              boxShadow: '0 4px 16px rgba(15,34,68,0.06)' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: n.cor,
                flexShrink: 0, marginTop: 3, boxShadow: `0 0 12px ${n.cor}` }} />
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 15, fontWeight: 700, color: n.cor, marginBottom: 6 }}>{n.label}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }}>{n.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function DDFAQ() {
  const [open, setOpen] = React.useState(null);
  const faqs = [
    { q: 'Quanto tempo leva a Due Diligence?',               a: 'O relatório completo é entregue em até 48 horas úteis após o recebimento de toda a documentação necessária.' },
    { q: 'Qual é o custo do serviço?',                       a: 'O valor varia conforme o tipo do imóvel e a profundidade da análise solicitada. Entre em contato para receber um orçamento personalizado.' },
    { q: 'A Due Diligence substitui a vistoria do comprador?','a': 'Sim — inclui laudo técnico fotográfico completo. Recomendamos também que o comprador visite o imóvel antes da assinatura.' },
    { q: 'E se o imóvel reprovar?',                          a: 'Você recebe o relatório com o diagnóstico detalhado. Isso lhe dá poder de negociação — ou a decisão correta de não comprar.' },
    { q: 'O serviço é exclusivo para imóveis VN Prime?',     a: 'Não. Você pode solicitar Due Diligence para qualquer imóvel em BH e região, mesmo que não esteja em nossa vitrine.' },
    { q: 'Quem realiza a análise jurídica?',                 a: 'Nossa equipe jurídica parceira especializada em direito imobiliário, com apoio de engenheiros e arquitetos credenciados.' },
  ];
  return (
    <section style={{ padding: 'clamp(3.5rem, 7vw, 5.5rem) 0', background: '#fff' }}>
      <div style={{ width: 'min(800px, 92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow color={DD_GOLD}>Dúvidas frequentes</Eyebrow>
          <h2 style={{ margin: '8px 0 12px' }}>Perguntas e respostas</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: 12, background: open === i ? `${DD_INDIGO}0a` : '#fff',
                border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14.5, color: 'var(--navy)' }}>{faq.q}</span>
                <span style={{ color: DD_INDIGO, fontSize: 18, fontWeight: 300, flexShrink: 0,
                  transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 20px 16px', fontFamily: 'DM Sans', fontSize: 14,
                  color: 'var(--fg-2)', lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function DDCtaFinal({ onNav }) {
  return (
    <section style={{ padding: 'clamp(3.5rem, 7vw, 5rem) 0', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400,
        background: `radial-gradient(circle, ${DD_INDIGO}20 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ width: 'min(860px, 92vw)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow>Conte com especialistas</Eyebrow>
          <h2 style={{ color: '#fff', margin: '8px 0 16px', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', lineHeight: 1.2 }}>
            Precisa de suporte em uma<br />transação específica?
          </h2>
          <p style={{ color: 'rgba(250,249,246,0.7)', fontSize: 16, lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
            Nossa equipe de especialistas em Due Diligence está pronta para analisar qualquer
            imóvel em BH e região — com relatório completo em até 48 horas.
          </p>
        </div>

        {/* 3 cards de suporte */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 44 }}>
          {[
            {
              cor: DD_INDIGO, titulo: 'Análise completa',
              desc: 'Relatório jurídico + vistoria técnica + semáforo de risco em até 48h.',
              cta: 'Solicitar análise',
              href: 'https://wa.me/5531984144250?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20Due%20Diligence%20completa.',
            },
            {
              cor: '#B87333', titulo: 'Consulta pontual',
              desc: 'Tem uma dúvida jurídica sobre um imóvel? Fale diretamente com nosso especialista.',
              cta: 'Falar com especialista',
              href: 'https://wa.me/5531984144250?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20jur%C3%ADdica%20sobre%20um%20im%C3%B3vel.',
            },
            {
              cor: DD_GREEN, titulo: 'Due Diligence rápida',
              desc: 'Análise documental expressa em até 24h — ideal para decisões urgentes.',
              cta: 'Solicitar urgente',
              href: 'https://wa.me/5531984144250?text=Ol%C3%A1!%20Preciso%20de%20Due%20Diligence%20urgente%20em%2024h.',
            },
          ].map(card => (
            <div key={card.titulo} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: '28px 24px',
              display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: card.cor,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{card.titulo}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13.5, color: 'rgba(250,249,246,0.65)', lineHeight: 1.6 }}>{card.desc}</div>
              </div>
              <a href={card.href} target="_blank" rel="noopener noreferrer"
                style={{ marginTop: 'auto', padding: '11px 16px', borderRadius: 9, textAlign: 'center',
                  background: `${card.cor}22`, border: `1px solid ${card.cor}55`,
                  color: '#fff', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 13.5,
                  textDecoration: 'none', transition: 'background 0.2s' }}>
                {card.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* Garantias */}
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Relatório em 48h','Sem espera excessiva'],['Mais de 30 itens','Cobertura completa'],['Equipe especializada','Jurídico + Engenharia']].map(([t,d]) => (
            <div key={t} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 700, color: DD_VIOLET, marginBottom: 2 }}>✓ {t}</div>
              <div style={{ fontSize: 12, color: 'rgba(250,249,246,0.45)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
function DueDiligencePage({ onNav }) {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <DDHero onNav={onNav} />
      <DDComoFunciona />
      <DDEtapasAnalise />
      <DDDocumentChecklist />
      <DDFotos />
      <DDSemaforo />
      <DDFAQ />
      <DDCtaFinal onNav={onNav} />
    </main>
  );
}

Object.assign(window, { DueDiligencePage });

})();
