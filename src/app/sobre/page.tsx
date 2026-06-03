'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'

function LiveStats() {
  const [stats, setStats] = useState<{ imoveis: number; bairros: number; avgPreco: number } | null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.from('imoveis').select('preco, bairro').eq('status', 'ativo').then(({ data }) => {
      if (!data) return
      const withPreco = data.filter(i => i.preco > 0)
      setStats({
        imoveis: data.length,
        bairros: new Set(data.map(i => i.bairro).filter(Boolean)).size,
        avgPreco: withPreco.length ? Math.round(withPreco.reduce((s, i) => s + i.preco, 0) / withPreco.length) : 0,
      })
    })
  }, [])

  if (!stats) return null
  const fmtM = (n: number) => n >= 1_000_000 ? `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')} mi` : `R$ ${(n / 1_000).toFixed(0)} mil`

  return (
    <section style={{ background: 'var(--navy)', padding: 'clamp(28px,4vw,44px) 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Números ao vivo</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>atualizado em tempo real</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Imóveis em vitrine', value: String(stats.imoveis), sub: 'curados e ativos' },
            { label: 'Bairros atendidos', value: String(stats.bairros), sub: 'na Grande BH' },
            { label: 'Preço médio', value: stats.avgPreco ? fmtM(stats.avgPreco) : '—', sub: 'do portfólio ativo' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: '1 1 200px', textAlign: 'center', padding: '20px 28px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 800, color: 'var(--gold)', lineHeight: 1.1, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
    </section>
  )
}

export default function SobrePage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        position: 'relative',
        backgroundImage: `linear-gradient(120deg, rgba(15,22,32,0.90) 0%, rgba(15,22,32,0.70) 100%), url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=85)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'clamp(70px,10vw,120px) 0',
        color: '#fff',
      }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 18,
          }}>
            Nossa missão
          </div>
          <h1 style={{
            color: '#fff', margin: '0 0 24px',
            fontSize: 'clamp(2.4rem,4.6vw,4rem)',
            fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, maxWidth: 800,
          }}>
            A plataforma imobiliária de alto padrão da Grande BH.
          </h1>
          <p style={{
            color: 'rgba(245,248,250,0.85)', fontSize: 18, lineHeight: 1.7,
            maxWidth: 640, margin: 0,
          }}>
            Conectamos proprietários, corretores e especialistas em um único ecossistema, combinando tecnologia, curadoria e estratégia comercial.
          </p>
        </div>
      </section>

      <LiveStats />

      {/* Quem somos */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{
          width: 'min(1280px,94vw)', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 80, alignItems: 'start',
        }}>

          {/* Left column */}
          <div>
            <Eyebrow color="var(--gold-deep)">Quem somos</Eyebrow>
            <h2 style={{
              margin: '10px 0 24px',
              fontSize: 'clamp(1.8rem,2.8vw,2.6rem)',
              fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
            }}>
              A VN Prime Imóveis
            </h2>
            <div style={{
              fontSize: 16, lineHeight: 1.8, color: 'var(--fg-1)',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              <p style={{ margin: 0 }}>
                A VN Prime Imóveis é uma plataforma imobiliária de alto padrão, com atuação em Belo Horizonte e região metropolitana, especialmente em mercados estratégicos como Nova Lima, Alphaville, Belvedere e BH e região.
              </p>
              <p style={{ margin: 0 }}>
                Conectamos proprietários, corretores e especialistas em um único ecossistema, combinando tecnologia, curadoria e estratégia comercial para gerar mais eficiência na venda de imóveis.
              </p>
              <p style={{ margin: 0 }}>
                Nossa atuação prioriza privacidade, qualidade e resultado: o endereço completo do imóvel é protegido, enquanto a vitrine pública exibe apenas as informações essenciais para atrair interessados qualificados.
              </p>
            </div>
          </div>

          {/* Right column — value cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {([
              ['Privacidade', 'O endereço completo é protegido na vitrine. Apenas o bairro é exibido — compradores qualificados têm acesso mediante contato.'],
              ['Curadoria', 'Cada imóvel passa por análise de qualidade antes de entrar na vitrine. Fotos, descrição e informações são revisadas pela equipe VN Prime.'],
              ['Tecnologia', 'IA editorial, gerador de descrição, qualificação automatizada de leads e relatórios de performance para proprietários e corretores.'],
              ['Resultado', 'Modelos de negócio flexíveis — taxa fixa, comissão ou plano enterprise — para que cada cliente escolha a solução mais adequada ao seu perfil.'],
            ] as [string, string][]).map(([title, desc]) => (
              <div key={title} style={{
                padding: '22px 24px', background: 'var(--white)',
                borderRadius: 16, border: '1px solid var(--border)',
                borderLeft: '4px solid var(--gold)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{title}</div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mercados de atuação */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">Onde atuamos</Eyebrow>
            <h2 style={{ margin: '10px 0 14px' }}>Mercados estratégicos</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.7 }}>
              Atuamos nos mercados de maior potencial de valorização da Grande Belo Horizonte, com conhecimento profundo de cada microregião.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 16,
          }}>
            {([
              ['Nova Lima', 'Alphaville · Vale dos Cristais · Quintas do Sol · Retiro do Chalé'],
              ['Belvedere', 'O bairro mais valorizado de BH — alto padrão residencial e corporativo'],
              ['Savassi & Lourdes', 'Mercado premium urbano no coração de Belo Horizonte'],
              ['Alphaville BH', 'Condomínios de alto padrão com infraestrutura completa'],
              ['Mangabeiras', 'Residências exclusivas com vista panorâmica da cidade'],
              ['Centro-Sul BH', 'Coberturas e apartamentos de luxo em localização privilegiada'],
            ] as [string, string][]).map(([bairro, desc]) => (
              <div key={bairro} style={{
                padding: '22px 20px', background: 'var(--white)',
                borderRadius: 14, border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>{bairro}</div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ maxWidth: 560, marginBottom: 52 }}>
            <Eyebrow color="var(--gold-deep)">Nossa história</Eyebrow>
            <h2 style={{ margin: '10px 0 14px' }}>Uma trajetória de curadoria</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.7 }}>
              Construída para os que entendem que imóvel de alto padrão merece uma plataforma à altura.
            </p>
          </div>
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
            {([
              { year: '2024', title: 'Fundação', desc: 'VN Prime Imóveis nasce com a missão de criar uma plataforma de alto padrão para BH e região metropolitana, combinando curadoria editorial com tecnologia.' },
              { year: '2025', title: 'Plataforma digital', desc: 'Lançamos o portal completo com busca inteligente, portais dedicados para proprietários e corretores, fotografia profissional e geração de pitch com IA.' },
              { year: '2026', title: 'Expansão regional', desc: 'Consolidamos presença em Nova Lima, Alphaville e Grande BH. Chegamos a centenas de imóveis curados, com parceiros corretores credenciados em toda a região.' },
            ] as { year: string; title: string; desc: string }[]).map((t, i) => (
              <div key={t.year} style={{ display: 'flex', gap: 24, marginBottom: i < 2 ? 40 : 0, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -32, top: 6, width: 16, height: 16, borderRadius: '50%', background: 'var(--gold)', border: '3px solid #fff', boxShadow: '0 0 0 2px var(--gold)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 4 }}>{t.year}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>{t.title}</div>
                  <p style={{ margin: 0, fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.7 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">A equipe</Eyebrow>
            <h2 style={{ margin: '10px 0 14px' }}>Quem está por trás da VN Prime</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.7 }}>
              Especialistas em mercado imobiliário, tecnologia e experiência do cliente reunidos em um só lugar.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            {([
              { nome: 'VN Prime', cargo: 'Fundador & CEO', desc: 'Especialista em mercado imobiliário premium da Grande BH, com foco em tecnologia e curadoria de alto padrão.', inicial: 'VN' },
              { nome: 'Equipe Comercial', cargo: 'Corretores Parceiros', desc: 'Rede de corretores CRECI certificados, especializados nos mercados de Nova Lima, Belvedere e Savassi.', inicial: 'CC' },
              { nome: 'Equipe de Curadoria', cargo: 'Análise & Qualidade', desc: 'Responsáveis pela revisão de cada anúncio — fotos, descrição e documentação — antes de entrar na vitrine.', inicial: 'CQ' },
            ] as { nome: string; cargo: string; desc: string; inicial: string }[]).map(m => (
              <div key={m.nome} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid var(--border)', boxShadow: '0 4px 18px rgba(15,34,68,0.06)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 16 }}>
                  {m.inicial}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{m.nome}</div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 12 }}>{m.cargo}</div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portais & Certificações */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: 'clamp(40px,6vw,70px) 0' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow color="var(--gold-deep)">Integração e credenciais</Eyebrow>
            <h2 style={{ margin: '8px 0 10px', fontSize: 'clamp(1.4rem,2.4vw,2rem)' }}>Distribuição e credenciais</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>Nossos imóveis são distribuídos automaticamente nas maiores plataformas do Brasil.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {['ZAP Imóveis', 'Viva Real', 'ImovelWeb', 'OLX Imóveis', 'Mercado Livre'].map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Credenciais e conformidade</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { badge: 'CRECI-MG', desc: 'Corretores parceiros credenciados' },
                { badge: 'COFECI', desc: 'Conselho Federal' },
                { badge: 'LGPD', desc: 'Dados protegidos' },
                { badge: 'SSL 256-bit', desc: 'Conexão criptografada' },
                { badge: 'PCI DSS', desc: 'Pagamento seguro' },
              ].map(c => (
                <div key={c.badge} style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--cream)', minWidth: 120 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>{c.badge}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'var(--cream)', borderTop: '1px solid var(--border)',
        padding: 'clamp(50px,7vw,80px) 0', textAlign: 'center',
      }}>
        <div style={{ width: 'min(640px,94vw)', margin: '0 auto' }}>
          <h2 style={{
            margin: '0 0 16px',
            fontSize: 'clamp(1.8rem,3vw,2.4rem)',
            fontWeight: 800,
          }}>
            Faça parte da plataforma
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 16, margin: '0 0 32px', lineHeight: 1.65 }}>
            Proprietário, corretor, incorporadora ou fotógrafo — há um espaço para você na VN Prime Imóveis.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login?redirect=/proprietario"><Btn variant="accent" size="lg">Anunciar meu imóvel</Btn></Link>
            <Link href="/login?redirect=/proprietario&tab=cadastrar"><Btn variant="ghost" size="lg">Criar minha conta</Btn></Link>
          </div>
        </div>
      </section>

      {/* Contato, Redes Sociais e Mapa */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(50px,7vw,80px) 0' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gap: 'clamp(32px,5vw,64px)',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            alignItems: 'start',
          }}>

            {/* Left column: contact info */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14,
                }}>Contato</div>
                {([
                  { icon: '✆', label: 'WhatsApp', val: '(31) 98414-4250',              href: 'https://wa.me/5531984144250' },
                  { icon: '@', label: 'E-mail',   val: 'contato@vnprimeimoveis.com.br', href: 'mailto:contato@vnprimeimoveis.com.br' },
                  { icon: '⊕', label: 'Site',     val: 'www.vnprimeimoveis.com.br',     href: 'https://www.vnprimeimoveis.com.br' },
                ] as { icon: string; label: string; val: string; href: string }[]).map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14,
                      textDecoration: 'none', color: 'inherit',
                    }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'rgba(212,168,87,0.15)',
                      border: '1px solid rgba(212,168,87,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, color: '#D4A857', flexShrink: 0,
                    }}>
                      {c.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 11, color: 'rgba(245,248,250,0.45)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2,
                      }}>{c.label}</div>
                      <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{c.val}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14,
                }}>Endereço</div>
                <div style={{ fontSize: 14, color: 'rgba(245,248,250,0.75)', lineHeight: 1.75 }}>
                  Belo Horizonte — MG<br />
                  Grande BH · Nova Lima · Região Metropolitana<br />
                  <span style={{ fontSize: 12, color: 'rgba(245,248,250,0.45)' }}>
                    Atendimento presencial com hora marcada
                  </span>
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14,
                }}>Redes Sociais</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {([
                    { label: 'Instagram', icon: 'IG', href: 'https://instagram.com/vnprimeimoveis' },
                    { label: 'LinkedIn',  icon: 'in', href: 'https://linkedin.com/company/vnprimeimoveis' },
                    { label: 'WhatsApp',  icon: 'WA', href: 'https://wa.me/5531984144250' },
                    { label: 'YouTube',   icon: 'YT', href: 'https://youtube.com/@vnprimeimoveis' },
                  ] as { label: string; icon: string; href: string }[]).map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      title={s.label}
                      style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 11, textDecoration: 'none',
                      }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: map */}
            <div style={{
              borderRadius: 18, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)', minHeight: 340,
            }}>
              <iframe
                title="VN Prime Imóveis — Belo Horizonte"
                src="https://maps.google.com/maps?q=Savassi,Belo+Horizonte,MG,Brasil&output=embed&z=13"
                width="100%" height="360"
                style={{ display: 'block', border: 'none', filter: 'saturate(0.7) brightness(0.9)' }}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Footer bar */}
          <div style={{
            marginTop: 48, paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ fontSize: 12, color: 'rgba(245,248,250,0.35)' }}>
              © {new Date().getFullYear()} VN Prime Imóveis · Todos os direitos reservados
            </div>
            <div style={{ fontSize: 12, color: 'rgba(245,248,250,0.35)' }}>
              Belo Horizonte · MG · Brasil
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
