import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'

export default function VenderPage() {
  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, rgba(15,24,36,0.92) 0%, rgba(27,39,51,0.88) 100%),
                     url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1900&q=85) center/cover`,
        padding: 'clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)',
        color: '#fff',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', maxWidth: 680 }}>
          <Eyebrow color="var(--gold)">Para proprietários</Eyebrow>
          <h1 style={{ color: '#fff', margin: '14px 0 18px' }}>
            Venda seu imóvel{' '}
            <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>do seu jeito.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.85)', lineHeight: 1.7, marginBottom: 36 }}>
            Taxa fixa sem comissão, ou venda assistida com curadoria completa. Você escolhe o nível de envolvimento — sem risco de entrada.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/anunciar"><Btn variant="accent" size="lg">Anunciar meu imóvel</Btn></Link>
            <a href="https://wa.me/5531984144250?text=Olá! Quero saber mais sobre vender meu imóvel pela VN Prime." target="_blank" rel="noopener noreferrer">
              <Btn variant="ghost-light" size="lg">Falar com consultor</Btn>
            </a>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">Modalidades</Eyebrow>
            <h2 style={{ margin: '10px 0 12px' }}>Escolha como quer vender</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15.5 }}>Duas opções transparentes. Sem pegadinhas.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>
            {/* Direto */}
            <div style={{ background: 'var(--cream)', borderRadius: 20, padding: 'clamp(28px,4vw,40px)', border: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 4, background: 'var(--gold)', borderRadius: 2, marginBottom: 20 }} />
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 8 }}>Proprietário Direto</div>
              <h3 style={{ fontSize: 24, marginBottom: 6 }}>R$ 297</h3>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 20 }}>taxa fixa · 90 dias de anúncio</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Anúncio ativo por 90 dias',
                  'Você gerencia direto no portal',
                  'Compradores qualificados pela plataforma',
                  'Fotos e mídia — pacotes à parte',
                  'Sem comissão sobre a venda',
                ].map(i => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--fg-2)' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <Link href="/anunciar"><Btn variant="primary">Anunciar agora</Btn></Link>
            </div>

            {/* Assistida */}
            <div style={{ background: 'var(--navy)', borderRadius: 20, padding: 'clamp(28px,4vw,40px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 20, right: 20, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 99, letterSpacing: '0.06em' }}>MAIS ESCOLHIDO</div>
              <div style={{ width: 40, height: 4, background: 'var(--gold)', borderRadius: 2, marginBottom: 20 }} />
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Venda Assistida</div>
              <h3 style={{ fontSize: 24, marginBottom: 6, color: '#fff' }}>3%</h3>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>somente ao vender — zero risco</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Só paga se vender — 0% de entrada',
                  'Curadoria e descrição editorial com IA',
                  'Qualificação ativa de compradores',
                  'Time VN Prime nos bastidores',
                  'Análise de preço e estratégia de venda',
                  'Fotos e mídia — pacotes à parte',
                ].map(i => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/5531984144250?text=Olá! Tenho interesse na venda assistida VN Prime." target="_blank" rel="noopener noreferrer">
                <Btn variant="accent" style={{ width: '100%', justifyContent: 'center' }}>Contratar venda assistida</Btn>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">Processo</Eyebrow>
            <h2 style={{ margin: '10px 0 0' }}>Como funciona</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
            {[
              { n: '01', t: 'Cadastre seu imóvel', d: 'Preencha as informações, faça upload das fotos e escolha o plano. Leva menos de 10 minutos.' },
              { n: '02', t: 'Anúncio publicado', d: 'Seu imóvel entra no portal VN Prime com visibilidade para compradores qualificados de BH e região.' },
              { n: '03', t: 'Leads chegam', d: 'Receba contatos diretamente pelo portal ou via WhatsApp. Acompanhe tudo no dashboard.' },
              { n: '04', t: 'Feche o negócio', d: 'Na venda direta você negocia. Na assistida o time VN Prime cuida de tudo até o contrato.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--border)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{s.t}</div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: '#fff' }}>
        <div style={{ width: 'min(900px,92vw)', margin: '0 auto', background: 'var(--gradient-navy-hero)', borderRadius: 24, padding: 'clamp(40px,5vw,64px)', textAlign: 'center', color: '#fff' }}>
          <Eyebrow color="var(--gold)">Comece agora</Eyebrow>
          <h2 style={{ color: '#fff', margin: '16px 0 14px' }}>Pronto para anunciar?</h2>
          <p style={{ color: 'rgba(245,248,250,0.8)', fontSize: 16, maxWidth: 440, margin: '0 auto 32px' }}>
            Cadastre seu imóvel em menos de 10 minutos e comece a receber leads qualificados.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/anunciar"><Btn variant="accent" size="lg">Anunciar meu imóvel</Btn></Link>
            <Link href="/proprietario"><Btn variant="ghost-light" size="lg">Acessar portal</Btn></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
