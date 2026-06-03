import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

export const metadata = {
  title: 'Para Corretores Autônomos — Portal VN Prime',
  description: 'O corretor autônomo ganha estrutura de captação, CRM, vitrine premium e pipeline de vendas — sem precisar montar uma imobiliária.',
}

const DIFERENCIAIS = [
  {
    title: 'Carteira VN Prime',
    desc: 'Acesso a imóveis de alto padrão em BH disponíveis para intermediação. Veja o portfólio completo, entre em contato com o proprietário e feche com suporte da plataforma.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
    accent: '#2F8674',
  },
  {
    title: 'CRM e Pipeline Integrado',
    desc: 'Pipeline kanban com 5 etapas, histórico completo de contatos, agendamento de visitas e acompanhamento do funil — tudo em um só painel.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80',
    accent: '#D4A857',
  },
  {
    title: 'Carteira 6%',
    desc: 'Imóveis do plano Venda Completa com dados do proprietário disponíveis. Você capta, conduz as visitas e fecha. A VN Prime cuida da estrutura.',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80',
    accent: '#6366F1',
  },
  {
    title: 'Comissão Integral',
    desc: 'Você fecha o negócio e recebe a comissão integral. Sem desconto de franquia, sem taxa mensal de plataforma. Custo zero para começar.',
    img: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=700&q=80',
    accent: '#6EE7B7',
  },
]

const ETAPAS = [
  {
    n: '01',
    title: 'Crie sua conta',
    desc: 'Cadastre-se gratuitamente. Aprovação em até 24h úteis após validação dos seus dados de corretor.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80',
  },
  {
    n: '02',
    title: 'Complete seu perfil',
    desc: 'Adicione especialidades, regiões de atuação e sua foto. Quanto mais completo, maior a visibilidade no portfólio.',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80',
  },
  {
    n: '03',
    title: 'Acesse a carteira e feche',
    desc: 'Explore a carteira VN Prime, use o CRM integrado e conduza suas vendas com o suporte completo da plataforma.',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80',
  },
]

const FAQ = [
  { q: 'Preciso pagar para acessar o portal?', a: 'Não. O acesso ao portal é gratuito. Você paga zero para se cadastrar e ter acesso ao portfólio e ao CRM. A plataforma é remunerada como parte do processo de venda nos imóveis do plano Venda Completa.' },
  { q: 'Preciso ter CRECI para entrar?', a: 'Sim. O portal é exclusivo para corretores com CRECI ativo. Validamos os dados no cadastro para manter a qualidade da rede parceira.' },
  { q: 'O que é a Carteira 6%?', a: 'São imóveis cujo proprietário contratou o plano Venda Completa — com corretor dedicado. Esses imóveis ficam disponíveis no portal para corretores parceiros, com os dados do proprietário acessíveis para contato e condução da venda.' },
  { q: 'Posso trazer minha própria carteira de imóveis?', a: 'Sim. No portal você pode cadastrar imóveis da sua própria carteira e gerenciá-los com o CRM e pipeline integrados.' },
  { q: 'Como é o pagamento da comissão?', a: 'A comissão é devida somente ao fechar o negócio. O percentual e as condições são definidos no acordo firmado com a VN Prime no momento do cadastro.' },
]

export default function CorretoresPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 540, display: 'flex', alignItems: 'center',
        padding: 'clamp(80px,12vw,140px) 0',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=2000&q=85)', backgroundSize: 'cover', backgroundPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(15,34,68,0.90) 0%, rgba(15,34,68,0.65) 55%, rgba(15,34,68,0.80) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <Eyebrow>Para Corretores Autônomos · VN Prime</Eyebrow>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem,4.2vw,3.2rem)', lineHeight: 1.1, margin: '14px 0 20px', maxWidth: '22ch' }}>
            Estrutura completa de captação e vendas —{' '}
            <em style={{ color: '#6EE7B7', fontStyle: 'italic' }}>sem precisar montar uma imobiliária.</em>
          </h1>
          <p style={{ color: 'rgba(245,248,250,0.88)', fontSize: 17, maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
            O corretor autônomo ganha vitrine premium, CRM integrado, pipeline de vendas e acesso à carteira VN Prime. Você fecha o negócio. A plataforma cuida do resto.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/login?redirect=/corretor&tab=cadastrar&tipo=corretor"><Btn variant="accent" size="lg" style={{ background: '#2F8674', boxShadow: '0 6px 24px rgba(47,134,116,0.40)' }}>Criar conta grátis</Btn></Link>
            <Link href="/corretor"><button style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.30)', background: 'transparent', color: '#fff', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Acessar o portal</button></Link>
          </div>

          {/* Preview cards */}
          <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, maxWidth: 540 }}>
            {[
              { label: 'Portfólio ativo', value: '47+', color: '#D4A857' },
              { label: 'Carteira 6%', value: '12', color: '#6EE7B7' },
              { label: 'CRM integrado', value: '5 etapas', color: '#93C5FD' },
              { label: 'Custo inicial', value: 'R$ 0', color: '#6EE7B7' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', marginTop: 6, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: '#0F1824', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { val: 'R$ 0', label: 'para começar' },
            { val: '100%', label: 'da comissão para você' },
            { val: 'D+2', label: 'pagamento ao fechar' },
            { val: 'BH', label: 'mercado alto padrão' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '10px 28px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', fontWeight: 800, color: '#2F8674', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Diferenciais */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">O que você encontra</Eyebrow>
            <h2 style={{ margin: '10px 0 12px', fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>Tudo que você precisa — em um só lugar</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 2 }}>
            {DIFERENCIAIS.map(d => (
              <div key={d.title} style={{ background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ height: 155, backgroundImage: `url(${d.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(15,22,32,0.65) 100%)' }} />
                </div>
                <div style={{ padding: '22px 24px 26px' }}>
                  <div style={{ width: 28, height: 3, background: d.accent, borderRadius: 2, marginBottom: 12 }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{d.title}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.7 }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(48px,7vw,80px) 0', background: '#0F1824' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=2000&q=60)', backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.07 }} />
        <div style={{ position: 'relative', zIndex: 1, width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold)">Simples e rápido</Eyebrow>
            <h2 style={{ margin: '10px 0 12px', color: '#fff', fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>Três passos para acessar o portal</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 2 }}>
            {ETAPAS.map(e => (
              <div key={e.n} style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ height: 190, position: 'relative', backgroundImage: `url(${e.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,22,32,0.15) 0%, rgba(15,22,32,0.88) 100%)' }} />
                  <div style={{ position: 'absolute', top: 14, right: 18, fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1 }}>{e.n}</div>
                  <div style={{ position: 'absolute', bottom: 18, left: 24 }}>
                    <div style={{ display: 'inline-block', background: 'rgba(47,134,116,0.22)', border: '1px solid rgba(47,134,116,0.55)', borderRadius: 999, padding: '4px 13px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6EE7B7' }}>
                      Passo {e.n}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 'clamp(22px,3vw,30px)', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{e.title}</div>
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
            <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(1.4rem,2.3vw,1.8rem)' }}>Dúvidas do corretor</h2>
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

      {/* CTA */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ background: 'var(--gradient-navy-hero)', borderRadius: 24, padding: 'clamp(44px,6vw,68px)', textAlign: 'center' }}>
            <Eyebrow color="var(--gold)">Faça parte da rede</Eyebrow>
            <h2 style={{ color: '#fff', margin: '14px 0 16px', fontSize: 'clamp(1.5rem,2.8vw,2.2rem)' }}>Acesse o portal do corretor</h2>
            <p style={{ color: 'rgba(245,248,250,0.75)', fontSize: 16, maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Sem custo de entrada. Crie sua conta em minutos e comece a trabalhar com o portfólio VN Prime.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login?redirect=/corretor&tab=cadastrar&tipo=corretor"><Btn variant="accent" size="lg" style={{ background: '#2F8674', boxShadow: '0 6px 24px rgba(47,134,116,0.40)' }}>Criar conta grátis</Btn></Link>
              <Link href="/corretor"><Btn variant="ghost-light" size="lg">Já tenho conta — entrar</Btn></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
