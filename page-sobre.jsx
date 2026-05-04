// Página Sobre — VN Prime Imóveis
function SobrePage({ onNav }) {
  return (
    <main>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: 440, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=2000&q=85)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(120deg, rgba(15,34,68,0.90) 0%, rgba(15,34,68,0.60) 60%, rgba(15,34,68,0.72) 100%)' }} />
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(201,150,14,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, width: 'min(1280px, 94vw)', margin: '0 auto', padding: '5rem 0' }}>
          <Eyebrow>VN Prime Imóveis · Belo Horizonte e região</Eyebrow>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
            margin: '10px 0 20px', maxWidth: '18ch', lineHeight: 1.15,
            textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}>
            Quem somos e como trabalhamos
          </h1>
          <p style={{ color: 'rgba(250,249,246,0.88)', fontSize: 16, maxWidth: 560, lineHeight: 1.75 }}>
            Plataforma imobiliária de alto padrão com foco em BH e região metropolitana. Tecnologia, curadoria e estratégia a serviço do seu imóvel.
          </p>
        </div>
      </section>

      {/* SOBRE — texto + imagem */}
      <section style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto',
          display: 'grid', gap: 64, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>
          <div>
            <Eyebrow color="var(--gold)">Nossa missão</Eyebrow>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: '8px 0 28px' }}>A VN Prime Imóveis</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
              A VN Prime Imóveis é uma plataforma imobiliária de alto padrão, com atuação em Belo Horizonte e região metropolitana, especialmente em mercados estratégicos como Nova Lima, Alphaville, Belvedere e Savassi.
            </p>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
              Conectamos proprietários, corretores e especialistas em um único ecossistema, combinando tecnologia, curadoria e estratégia comercial para gerar mais eficiência na venda de imóveis.
            </p>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.85, margin: 0 }}>
              Nossa atuação prioriza <strong style={{ color: 'var(--navy)' }}>privacidade, qualidade e resultado</strong>: o endereço completo do imóvel é protegido, enquanto a vitrine pública exibe apenas as informações essenciais para atrair interessados qualificados.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(15,34,68,0.18)',
              height: 460,
              backgroundImage: 'url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{
              position: 'absolute', bottom: -20, left: -20,
              background: '#fff', borderRadius: 16, padding: '16px 22px',
              boxShadow: '0 12px 40px rgba(15,34,68,0.14)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold) 0%, #B8892A 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cinzel', fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0 }}>VN</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--navy)' }}>Curadoria VN Prime</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>BH · Nova Lima · Alphaville</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--navy)', padding: '3.5rem 0' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
          {[
            { v: '142', l: 'Imóveis curados' },
            { v: 'R$ 4,2 bi', l: 'Em portfólio' },
            { v: '96%', l: 'Satisfação' },
            { v: '18 dias', l: 'Tempo médio venda' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 36, fontWeight: 700,
                color: 'var(--gold-soft)', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(250,249,246,0.6)', marginTop: 10 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* POSICIONAMENTO */}
      <section style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 52px' }}>
            <Eyebrow color="var(--gold)">Posicionamento</Eyebrow>
            <h2 style={{ margin: '8px 0 16px' }}>Modelo híbrido — o melhor de dois mundos</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.75 }}>
              Unimos imobiliária de alto padrão com marketplace de serviços especializados. Cada cliente escolhe o nível de autonomia e suporte desejado, com comissionamento 100% transparente.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 52 }}>
            {[
              {
                icon: '🏠',
                title: 'Venda Direta',
                tag: 'R$ 197 · Taxa fixa',
                desc: 'Você publica, conduz e fecha. Paga uma taxa fixa de anúncio e fica com 100% do valor. Zero comissão.',
                dark: false,
              },
              {
                icon: '📱',
                title: 'Venda Assistida',
                tag: '3% · Sobre o valor da venda',
                desc: 'Você conduz o processo; a VN Prime apoia com IA, curadoria, BOOSTER e suporte. Paga apenas quando vender.',
                dark: true,
              },
              {
                icon: '🤝',
                title: 'Venda Completa',
                tag: '6% · Sobre o valor da venda',
                desc: 'VN Prime assume tudo. Corretor parceiro dedicado conduz visitas, negociação e documentação completa.',
                dark: false,
              },
            ].map(p => (
              <div key={p.title} style={{
                background: p.dark ? 'var(--navy)' : 'var(--cream)',
                border: p.dark ? '2px solid rgba(201,150,14,0.35)' : '1px solid var(--border)',
                borderRadius: 18, padding: '32px 28px',
                boxShadow: p.dark ? '0 20px 60px rgba(15,34,68,0.18)' : '0 4px 24px rgba(15,34,68,0.06)',
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{p.icon}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--gold-soft)', marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700,
                  color: p.dark ? '#fff' : 'var(--navy)', marginBottom: 14 }}>{p.tag}</div>
                <p style={{ color: p.dark ? 'rgba(250,249,246,0.78)' : 'var(--fg-2)',
                  fontSize: 14, lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* faixa de imagens */}
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)',
            borderRadius: 20, overflow: 'hidden', height: 260 }}>
            {[
              'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
              'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
            ].map((src, i) => (
              <div key={i} style={{
                backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : 0,
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section style={{ padding: 'clamp(3rem, 5vw, 4.5rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow color="var(--gold)">Por que VN Prime</Eyebrow>
            <h2 style={{ margin: '8px 0 0' }}>Diferenciais da plataforma</h2>
          </div>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {[
              { icon: '🔒', title: 'Privacidade garantida', desc: 'Endereço completo protegido na vitrine. Exibido apenas após contato qualificado com o proprietário.' },
              { icon: '🤖', title: 'IA editorial', desc: 'Geração automática de descrição, pitches comerciais e orientação de precificação com base no mercado.' },
              { icon: '📸', title: 'Fotógrafos credenciados', desc: 'Rede de fotógrafos profissionais disponíveis como add-on em qualquer plano de venda.' },
              { icon: '📊', title: 'FactorOne gratuito', desc: '30 dias de gestão financeira pessoal incluso em todos os planos, para proprietários, corretores e fotógrafos.' },
            ].map(d => (
              <div key={d.title} style={{
                background: '#fff', borderRadius: 16, padding: '28px 24px',
                border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(15,34,68,0.05)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{d.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 8 }}>{d.title}</div>
                <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px, 94vw)', margin: '0 auto',
          display: 'grid', gap: 64, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>

          <div>
            <Eyebrow color="var(--gold)">Contato direto</Eyebrow>
            <h2 style={{ margin: '8px 0 28px' }}>Fale com a VN Prime</h2>

            <div style={{
              background: 'var(--cream)', borderRadius: 20, padding: '28px 26px',
              border: '1px solid var(--border)', marginBottom: 24,
              display: 'flex', alignItems: 'flex-start', gap: 20,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--gold) 0%, #B8892A 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cinzel', fontWeight: 700, fontSize: 20, color: '#fff',
              }}>VN</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--navy)', marginBottom: 3 }}>Vinicius Nogueira</div>
                <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, marginBottom: 16 }}>
                  VN Prime Imóveis · Fundador
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="tel:+5531984144250" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 14, color: 'var(--navy)', textDecoration: 'none', fontWeight: 500,
                  }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,150,14,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
                    }}>📞</span>
                    (31) 98414-4250
                  </a>
                  <a href="https://www.vnprimeimoveis.com.br" target="_blank" rel="noopener" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 14, color: 'var(--navy)', textDecoration: 'none', fontWeight: 500,
                  }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,150,14,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
                    }}>🌐</span>
                    www.vnprimeimoveis.com.br
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn variant="accent" onClick={() => onNav('busca')}>Ver imóveis</Btn>
              <Btn variant="ghost" onClick={() => onNav('home')}>Voltar à home</Btn>
            </div>
          </div>

          {/* imagem lateral */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 20, overflow: 'hidden', height: 440,
              backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              boxShadow: '0 32px 80px rgba(15,34,68,0.18)',
            }} />
            <div style={{
              position: 'absolute', bottom: 24, right: -12,
              background: 'var(--navy)', borderRadius: 14, padding: '18px 22px',
              boxShadow: '0 12px 40px rgba(15,34,68,0.24)', maxWidth: 210,
            }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--gold-soft)', marginBottom: 8 }}>Portfólio</div>
              <div style={{ color: 'rgba(250,249,246,0.88)', fontSize: 13.5, lineHeight: 1.55 }}>
                BH · Nova Lima · Alphaville · Belvedere · Savassi
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

Object.assign(window, { SobrePage });
