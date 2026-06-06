import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

export const metadata = {
  title: 'Para Proprietários — Anuncie seu imóvel com a VN Prime',
  description: 'Planos de assinatura sem comissão: Essencial, Plus ou Pro. Anuncie na vitrine VN Prime, receba leads qualificados e venda com autonomia em BH e região.',
}

const PLANOS = [
  {
    nome: 'Plano Essencial',
    custo: 'R$ 99',
    label: '/mês · 1 imóvel ativo',
    destaque: false,
    desc: 'Publique na vitrine VN Prime com autonomia total. Você define o preço, agenda visitas e fecha direto com o comprador — sem pagar comissão sobre a venda.',
    bullets: [
      'Até 1 imóvel ativo',
      '0% de comissão — você fica com 100%',
      'Leads com nome, e-mail e WhatsApp',
      'Descrição editorial gerada por IA',
      'Endereço protegido — exibe só o bairro',
      'Suporte por chat',
    ],
    cta: 'Começar agora',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85',
    accent: '#6366F1',
  },
  {
    nome: 'Plano Plus',
    custo: 'R$ 399',
    label: '/ 6 meses · até 3 imóveis ativos',
    destaque: true,
    desc: 'Para quem tem mais de um imóvel. A VN Prime cuida da curadoria dos anúncios, qualifica compradores e entrega relatório de desempenho mensal.',
    bullets: [
      'Até 3 imóveis ativos',
      '0% de comissão — você fica com 100%',
      'Curadoria ativa dos anúncios',
      'Qualificação de leads antes do contato',
      'Relatório de desempenho mensal',
      'Suporte prioritário',
    ],
    cta: 'Escolher Plus',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85',
    accent: '#D4A857',
  },
  {
    nome: 'Plano Pro',
    custo: 'R$ 799',
    label: '/ 12 meses · até 10 imóveis ativos',
    destaque: false,
    desc: 'Estrutura completa para investidores. Painel gerencial consolidado, curadoria dedicada em todos os anúncios, relatórios mensais e suporte direto da equipe VN Prime.',
    bullets: [
      'Até 10 imóveis ativos',
      '0% de comissão — você fica com 100%',
      'Painel gerencial consolidado',
      'Curadoria dedicada em todos os anúncios',
      'Relatório de mercado e benchmarks mensais',
      'Suporte dedicado da equipe VN Prime',
    ],
    cta: 'Assinar Pro',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
    accent: '#2F8674',
  },
]

const ETAPAS = [
  {
    n: '01',
    title: 'Cadastre seu imóvel',
    desc: 'Crie sua conta, preencha as informações do imóvel e publique o anúncio em minutos. Sem papelada, sem visita presencial obrigatória.',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  },
  {
    n: '02',
    title: 'Receba compradores qualificados',
    desc: 'Leads chegam direto no seu painel com contato completo. Você decide quem visita e quando. Acompanhe tudo em tempo real.',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  },
  {
    n: '03',
    title: 'Feche com segurança',
    desc: 'Due Diligence disponível antes de assinar. Materiais de apoio em cada etapa. Você aprova cada etapa antes de avançar.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  },
]

const FAQ = [
  { q: 'Preciso de corretor para vender?', a: 'Não. Em todos os planos você conduz as negociações de forma autônoma. A VN Prime cuida da vitrine, qualificação de leads e suporte de plataforma — sem intermediários obrigatórios.' },
  { q: 'Como funciona a cobrança?', a: 'Os planos são de assinatura: Essencial (R$ 99/mês · 1 imóvel), Plus (R$ 399 / 6 meses · até 3 imóveis) e Pro (R$ 799 / 12 meses · até 10 imóveis). Nenhum cobra comissão sobre a venda — você fica com 100% do valor.' },
  { q: 'Posso trocar de plano depois?', a: 'Sim. Faça o upgrade quando quiser pelo seu painel, sem burocracia e sem penalidade.' },
  { q: 'Meu endereço fica visível no anúncio?', a: 'Não. Exibimos apenas o bairro e a cidade até que o comprador demonstre interesse qualificado.' },
  { q: 'A fotografia profissional está incluída?', a: 'A fotografia profissional é um serviço adicional disponível para todos os proprietários VN Prime. Acesse o portal do proprietário para solicitar um pacote.' },
]

export default function ProprietariosPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 520, display: 'flex', alignItems: 'center',
        padding: 'clamp(80px,12vw,140px) 0',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=85)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(15,34,68,0.88) 0%, rgba(15,34,68,0.60) 50%, rgba(15,34,68,0.75) 100%)' }} />
        <div style={{ position: 'absolute', top: -160, right: -160, width: 480, height: 480, background: 'radial-gradient(circle, rgba(212,168,87,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <Eyebrow>Para Proprietários · VN Prime</Eyebrow>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem,4.2vw,3.2rem)', lineHeight: 1.1, margin: '14px 0 20px', maxWidth: '18ch' }}>
            Você escolhe como{' '}
            <em style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic' }}>
              vender seu imóvel
            </em>
          </h1>
          <p style={{ color: 'rgba(245,248,250,0.88)', fontSize: 17, maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}>
            Planos de assinatura sem comissão sobre a venda — Essencial, Plus ou Pro. Você anuncia, recebe leads qualificados e negocia direto com o comprador.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/anunciar"><Btn variant="accent" size="lg">Publicar meu imóvel</Btn></Link>
            <Link href="#planos"><button style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(212,168,87,0.45)', background: 'transparent', color: 'var(--gold)', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Ver os planos</button></Link>
          </div>
        </div>
      </section>

      {/* Números rápidos */}
      <section style={{ background: '#0F1824', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { val: 'R$ 99/mês', label: 'Plano Essencial · 1 imóvel ativo' },
            { val: 'R$ 399', label: 'Plano Plus · 6 meses · até 3 imóveis' },
            { val: 'R$ 799', label: 'Plano Pro · 12 meses · até 10 imóveis' },
            { val: '0%', label: 'de comissão sobre a venda' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '10px 28px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" style={{ padding: 'clamp(48px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">Escolha seu modelo de venda</Eyebrow>
            <h2 style={{ margin: '10px 0 12px', fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>Três planos, uma plataforma</h2>
            <p style={{ color: 'var(--fg-2)', maxWidth: 480, margin: '0 auto', fontSize: 15.5 }}>
              Do mais autônomo ao mais assistido — você decide o nível de envolvimento da VN Prime.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 2 }}>
            {PLANOS.map(p => (
              <div key={p.nome} style={{ overflow: 'hidden', border: p.destaque ? '2px solid var(--gold)' : '1px solid var(--border)', position: 'relative', background: '#fff' }}>
                {p.destaque && (
                  <div style={{ background: 'var(--gold)', color: 'var(--navy-deep)', textAlign: 'center', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '6px 0' }}>
                    Mais escolhido
                  </div>
                )}
                <div style={{ height: 180, position: 'relative', backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,22,32,0.10) 0%, rgba(15,22,32,0.82) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 20, left: 24 }}>
                    <div style={{ display: 'inline-block', background: p.accent + '22', border: `1px solid ${p.accent}55`, borderRadius: 999, padding: '4px 13px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.accent, marginBottom: 8 }}>
                      {p.nome}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{p.custo}</div>
                    <div style={{ fontSize: 12, color: 'rgba(245,248,250,0.65)', marginTop: 4 }}>{p.label}</div>
                  </div>
                </div>
                <div style={{ padding: '24px 24px 28px' }}>
                  <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7, margin: '0 0 20px' }}>{p.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {p.bullets.map(b => (
                      <li key={b} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.45 }}>
                        <span style={{ color: p.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>{b}
                      </li>
                    ))}
                  </ul>
                  <Link href="/anunciar">
                    <button style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: p.accent, color: p.accent === '#D4A857' ? 'var(--navy-deep)' : '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', boxShadow: `0 4px 16px ${p.accent}44` }}>
                      {p.cta} →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(48px,7vw,80px) 0', background: '#0F1824' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07 }} />
        <div style={{ position: 'relative', zIndex: 1, width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold)">Do cadastro ao fechamento</Eyebrow>
            <h2 style={{ margin: '10px 0 12px', color: '#fff', fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>Como funciona para o proprietário</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 2 }}>
            {ETAPAS.map(e => (
              <div key={e.n} style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ height: 190, position: 'relative', backgroundImage: `url(${e.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,22,32,0.10) 0%, rgba(15,22,32,0.88) 100%)' }} />
                  <div style={{ position: 'absolute', top: 14, right: 18, fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1 }}>{e.n}</div>
                  <div style={{ position: 'absolute', bottom: 18, left: 24 }}>
                    <div style={{ display: 'inline-block', background: 'rgba(212,168,87,0.22)', border: '1px solid rgba(212,168,87,0.55)', borderRadius: 999, padding: '4px 13px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4A857' }}>
                      Etapa {e.n}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 'clamp(22px,3vw,30px)', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10, lineHeight: 1.25 }}>{e.title}</div>
                  <p style={{ margin: 0, fontSize: 14, color: 'rgba(245,248,250,0.68)', lineHeight: 1.75 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: '#fff' }}>
        <div style={{ width: 'min(820px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <Eyebrow color="var(--gold-deep)">Perguntas frequentes</Eyebrow>
            <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(1.4rem,2.3vw,1.8rem)' }}>Dúvidas do proprietário</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {FAQ.map((f, i) => (
              <div key={f.q} style={{ borderTop: '1px solid var(--border)', padding: '22px 0', borderBottom: i === FAQ.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>{f.q}</div>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.75 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ background: 'var(--gradient-navy-hero)', borderRadius: 24, padding: 'clamp(44px,6vw,68px)', textAlign: 'center' }}>
            <Eyebrow color="var(--gold)">Comece hoje</Eyebrow>
            <h2 style={{ color: '#fff', margin: '14px 0 16px', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)' }}>Pronto para anunciar?</h2>
            <p style={{ color: 'rgba(245,248,250,0.75)', fontSize: 16, maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Cadastre seu imóvel em minutos. Escolha o plano no ato ou depois — sem burocracia.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/anunciar"><Btn variant="accent" size="lg">Publicar meu imóvel</Btn></Link>
              <Link href="/calculadora"><Btn variant="ghost-light" size="lg">Calcular ITBI e custos</Btn></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
