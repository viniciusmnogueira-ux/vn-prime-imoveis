import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'

export default function SobrePage() {
  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(180deg, rgba(15,24,36,0.88) 0%, rgba(15,24,36,0.96) 100%), url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1900&q=85) center/cover`,
        padding: 'clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)',
        color: '#fff',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', maxWidth: 680 }}>
          <Eyebrow>Sobre a VN Prime</Eyebrow>
          <h1 style={{ color: '#fff', margin: '14px 0 18px' }}>
            Imóveis de alto padrão com <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>transparência real.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.85)', lineHeight: 1.7 }}>
            A VN Prime nasceu para democratizar o acesso a imóveis de alto padrão em Belo Horizonte e região metropolitana, com tecnologia, curadoria e transparência em cada etapa.
          </p>
        </div>
      </section>

      {/* Sobre */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <Eyebrow color="var(--gold-deep)">Nossa missão</Eyebrow>
            <h2 style={{ margin: '12px 0 20px' }}>Conectar pessoas ao imóvel certo</h2>
            <p style={{ fontSize: 15.5, color: 'var(--fg-2)', lineHeight: 1.8, marginBottom: 20 }}>
              Acreditamos que a compra de um imóvel deve ser transparente, sem surpresas e sem comissões abusivas. Por isso criamos um modelo que combina tecnologia com curadoria humana.
            </p>
            <p style={{ fontSize: 15.5, color: 'var(--fg-2)', lineHeight: 1.8 }}>
              Para o proprietário, a liberdade de anunciar com taxa fixa ou optar por suporte completo. Para o comprador, imóveis verificados e consultores honestos.
            </p>
          </div>
          <div style={{ background: 'var(--cream)', borderRadius: 20, padding: 40, border: '1px solid var(--border)' }}>
            <div style={{ marginBottom: 28 }}>
              <Eyebrow color="var(--gold-deep)">Fundador</Eyebrow>
              <div style={{ marginTop: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>V</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)' }}>Vinicius Nogueira</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 3 }}>Fundador & CEO</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '📱', label: 'WhatsApp', value: '(31) 98414-4250', href: 'https://wa.me/5531984144250' },
                { icon: '✉️', label: 'E-mail', value: 'contato@vnprimeimoveis.com.br', href: 'mailto:contato@vnprimeimoveis.com.br' },
                { icon: '🌐', label: 'Site', value: 'vnprimeimoveis.com.br', href: 'https://vnprimeimoveis.com.br' },
              ].map(c => (
                <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none' }}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{c.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Redes + Mapa */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 40 }}>
          <div>
            <Eyebrow color="var(--gold-deep)">Redes sociais</Eyebrow>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Instagram', href: 'https://instagram.com/vnprimeimoveis', color: '#E1306C' },
                { label: 'LinkedIn', href: 'https://linkedin.com/company/vnprimeimoveis', color: '#0A66C2' },
                { label: 'YouTube', href: 'https://youtube.com/@vnprimeimoveis', color: '#FF0000' },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', borderRadius: 99, background: '#fff', border: '1.5px solid var(--border)', fontSize: 13.5, fontWeight: 700, color: s.color, textDecoration: 'none' }}>
                  {s.label}
                </a>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Eyebrow color="var(--gold-deep)">Endereço</Eyebrow>
              <p style={{ marginTop: 12, fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Belo Horizonte — MG<br />
                Atendimento presencial e remoto<br />
                Área de atuação: RMBH e Sul de MG
              </p>
            </div>
            <div style={{ marginTop: 28 }}>
              <Link href="/anunciar"><Btn variant="primary" size="lg">Anunciar meu imóvel</Btn></Link>
            </div>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234941.74826249373!2d-44.09955689624451!3d-19.91266887516693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa690d739c26fe5%3A0xd6a8a14e4cdf2e34!2sBelo%20Horizonte%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1715000000000!5m2!1spt-BR!2sbr"
              width="100%" height="300"
              style={{ border: 0, borderRadius: 16 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
