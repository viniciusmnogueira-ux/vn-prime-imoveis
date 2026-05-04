// Corretor portal & Incorporadora landing — placeholder hi-fi pages

function CorretorPage({ onNav }) {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--gradient-navy-hero)', color: '#fff',
        padding: 'clamp(3rem, 7vw, 5rem) 0 clamp(2.5rem, 5vw, 3.5rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(5,150,105,0.25), transparent 65%)' }} />
        <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto', position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <Eyebrow>Portal do Corretor</Eyebrow>
            <h1 style={{ color: '#fff', margin: '8px 0 14px', fontSize: 'clamp(2.2rem, 4.4vw, 3rem)' }}>
              Sua carteira VN Prime, <em style={{
                background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic',
              }}>com leads qualificados</em>
            </h1>
            <p style={{ color: 'rgba(250,249,246,0.85)', fontSize: 17, lineHeight: 1.65, marginBottom: 26 }}>
              Acesso ao portfólio premium, CRM integrado, split de comissão claro e capacitação contínua. Para corretores autônomos e imobiliárias parceiras.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn variant="accent" size="lg">Quero ser parceiro</Btn>
              <Btn variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                Já sou parceiro · Login
              </Btn>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[['R$ 49,90', 'mensalidade'], ['+340', 'corretores'], ['82%', 'fechamento']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 700, color: '#10B981' }}>{n}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(250,249,246,0.65)',
                    letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Sans' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Mock dashboard */}
          <div style={{ background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 11, color: 'rgba(250,249,246,0.6)', letterSpacing: '0.1em',
              textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 12 }}>
              ▸ Dashboard · Pipeline
            </div>
            {[
              ['Leads novos', '23', '#10B981'],
              ['Em visita', '8', '#F59E0B'],
              ['Em proposta', '4', '#3B82F6'],
              ['Fechado · Mês', 'R$ 4,2M', 'var(--gold)'],
            ].map(([l,v,c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'rgba(250,249,246,0.85)', fontFamily: 'DM Sans', fontSize: 13.5 }}>{l}</span>
                <span style={{ fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 600, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow color="#059669">Tudo o que você precisa</Eyebrow>
            <h2 style={{ marginTop: 6 }}>Ferramentas pensadas pra fechar mais</h2>
          </div>
          <div style={{ display: 'grid', gap: 18,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {[
              ['Carteira premium', 'Acesso a 800+ imóveis curados, com fotos profissionais e descrição pronta.'],
              ['Leads qualificados', 'Compradores que chegaram pela VN Prime — pré-qualificados antes de irem para você.'],
              ['CRM + Pipeline', 'Funil de vendas, agendamentos, propostas e contratos no mesmo lugar.'],
              ['Split transparente', 'Sua porcentagem é definida no início de cada negócio. Sem surpresas.'],
              ['Material de marketing', 'Templates de Stories, posts e apresentações personalizáveis.'],
              ['Capacitação', 'Workshops mensais sobre alto padrão, finanças imobiliárias e fechamento.'],
            ].map(([t,d]) => (
              <div key={t} style={{ padding: 20, background: 'var(--cream)', borderRadius: 12,
                border: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(5,150,105,0.12)',
                  color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cinzel', fontWeight: 700, marginBottom: 12 }}>✓</div>
                <h3 style={{ fontSize: 17, margin: '0 0 6px' }}>{t}</h3>
                <p style={{ color: 'var(--fg-2)', fontSize: 13.5, margin: 0, lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '50px 0 60px', background: 'var(--cream)' }}>
        <div style={{ width: 'min(720px, 94vw)', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12 }}>Pronto para entrar na rede?</h2>
          <p style={{ color: 'var(--fg-2)', marginBottom: 22 }}>
            Cadastre-se gratuitamente. Primeira mensalidade só após sua primeira visita agendada.
          </p>
          <Btn variant="accent" size="lg">Quero ser parceiro VN Prime</Btn>
          <div style={{ marginTop: 14 }}>
            <button onClick={() => onNav('vender')} style={{ background: 'none', border: 'none',
              color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13 }}>
              ← Trocar perfil
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function IncorporadoraPage({ onNav }) {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--gradient-navy-hero)', color: '#fff',
        padding: 'clamp(3rem, 7vw, 5rem) 0 clamp(2.5rem, 5vw, 3.5rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(184,115,51,0.28), transparent 65%)' }} />
        <div style={{ width: 'min(1080px, 94vw)', margin: '0 auto', position: 'relative', zIndex: 1,
          textAlign: 'center' }}>
          <Eyebrow>Para Incorporadoras & Construtoras</Eyebrow>
          <h1 style={{ color: '#fff', margin: '8px 0 16px', fontSize: 'clamp(2.4rem, 5vw, 3.4rem)' }}>
            Lançamentos com <em style={{
              background: 'linear-gradient(135deg, #B87333 0%, #D08F4F 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic',
            }}>vitrine premium</em>
          </h1>
          <p style={{ color: 'rgba(250,249,246,0.85)', fontSize: 17.5, lineHeight: 1.65,
            maxWidth: 640, margin: '0 auto 28px' }}>
            Página dedicada do empreendimento, plantas interativas, tour virtual e equipe de plantão exclusiva. Plano enterprise sob medida.
          </p>
          <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Btn variant="accent" size="lg">Falar com comercial</Btn>
            <Btn variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Ver case
            </Btn>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div style={{ width: 'min(1180px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow color="#B87333">Plano Enterprise</Eyebrow>
            <h2 style={{ marginTop: 6 }}>Como vendemos seu lançamento</h2>
          </div>
          <div style={{ display: 'grid', gap: 22,
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {[
              ['01', 'Página dedicada', 'URL exclusiva, identidade visual do empreendimento, plantas e galeria magazine.'],
              ['02', 'Plantas interativas', 'Visualização 2D + 3D, configurador de unidades e simulador de financiamento.'],
              ['03', 'Plantão dedicado', 'Equipe VN Prime no estande físico ou virtual, treinada na sua narrativa.'],
              ['04', 'Mídia paga', 'Investimento conjunto em Meta, Google e portais. Relatórios semanais.'],
              ['05', 'BOOSTER!', 'Plano Plus para unidades estratégicas com mais visibilidade e visitas direcionadas.'],
              ['06', 'CRM espelhado', 'Você acessa o pipeline em tempo real — leads, visitas, propostas, fechamentos.'],
            ].map(([n,t,d]) => (
              <div key={n} style={{ padding: 22, background: 'var(--cream)', borderRadius: 14,
                border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Cinzel', fontSize: 22, fontWeight: 700,
                  color: '#B87333', marginBottom: 10, letterSpacing: '0.05em' }}>{n}</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{t}</h3>
                <p style={{ color: 'var(--fg-2)', fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '50px 0 70px', background: 'var(--cream)' }}>
        <div style={{ width: 'min(720px, 94vw)', margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px, 4vw, 40px)',
            border: '1px solid var(--border)', boxShadow: '0 16px 50px rgba(15,34,68,0.10)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>Vamos conversar?</h2>
            <p style={{ color: 'var(--fg-2)', marginBottom: 22 }}>
              Conte sobre seu empreendimento. Nosso head de incorporadoras retorna em até 1 dia útil.
            </p>
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }}>
              <input placeholder="Nome" style={{ width: '100%' }} />
              <input placeholder="Cargo" style={{ width: '100%' }} />
              <input placeholder="Incorporadora" style={{ width: '100%', gridColumn: '1 / -1' }} />
              <input placeholder="E-mail" style={{ width: '100%' }} />
              <input placeholder="Telefone" style={{ width: '100%' }} />
              <textarea placeholder="Sobre o empreendimento (localização, VGV, prazo)"
                style={{ width: '100%', gridColumn: '1 / -1', minHeight: 90, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <Btn variant="accent" size="lg">Enviar contato</Btn>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => onNav('vender')} style={{ background: 'none', border: 'none',
              color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13 }}>
              ← Trocar perfil
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { IncorporadoraPage });
