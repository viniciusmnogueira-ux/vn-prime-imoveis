'use client'
import { useState, useEffect } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const fmtCur = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

function PricingSimulator() {
  const [valor, setValor] = useState(1000000)
  const planos = [
    { nome: 'Venda Direta', custo: 297, pct: 0, color: '#6366F1', descCusto: 'taxa única' },
    { nome: 'Venda Assistida', custo: 0, pct: 0.03, color: '#D4A857', descCusto: '3% sobre a venda' },
    { nome: 'Venda Completa', custo: 0, pct: 0.06, color: '#2F8674', descCusto: '6% sobre a venda (corretor + VN)' },
  ]
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(28px,4vw,44px)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(15,34,68,0.08)' }}>
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: 12 }}>
          Valor do imóvel: <span style={{ color: 'var(--gold)', fontSize: 20 }}>{fmtCur(valor)}</span>
        </label>
        <input type="range" min={200000} max={5000000} step={50000} value={valor}
          onChange={e => setValor(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
          <span>R$ 200 mil</span><span>R$ 5 mi</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
        {planos.map(p => {
          const comissao = Math.round(valor * p.pct) + p.custo
          const liquido = valor - comissao
          return (
            <div key={p.nome} style={{ border: `2px solid ${p.color}22`, borderRadius: 14, padding: '18px 20px', background: `${p.color}06` }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: p.color, marginBottom: 8 }}>{p.nome}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 16 }}>{p.descCusto}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-2)' }}>Custo VN Prime</span>
                  <span style={{ fontWeight: 700, color: '#DC2626' }}>{fmtCur(comissao)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--navy)', fontWeight: 600 }}>Você recebe</span>
                  <span style={{ fontWeight: 800, color: p.color, fontSize: 16 }}>{fmtCur(liquido)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 16, textAlign: 'center' }}>Simulação estimada. Valores reais podem variar conforme negociação.</p>
    </div>
  )
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '18px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'inherit' }}>
            <span style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>{item.q}</span>
            <span style={{ fontSize: 18, color: 'var(--gold)', flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
          </button>
          {open === i && (
            <p style={{ fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.75, margin: '0 0 18px', paddingRight: 32 }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

const PLANOS_PROP = [
  {
    id: 'essencial', tag: 'Plano Essencial', tagColor: '#6366F1',
    title: 'Anuncie seu imóvel.', sub: 'R$ 99/mês',
    period: 'Até 1 imóvel ativo',
    desc: 'Publique na vitrine VN Prime com autonomia total. Você define o preço, agenda visitas e negocia diretamente com o comprador — sem pagar comissão.',
    bullets: [
      'Até 1 imóvel ativo',
      'Gestão completa pelo portal do proprietário',
      'Leads com nome, e-mail e WhatsApp',
      'Endereço protegido — exibe só o bairro',
      'Descrição editorial gerada por IA',
      'Suporte por chat',
    ],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80',
    cta: 'Começar agora', accent: '#6366F1',
  },
  {
    id: 'plus', tag: 'Plano Plus', tagColor: '#D4A857',
    title: 'Venda mais de um imóvel.', sub: 'R$ 399 / 6 meses',
    period: 'Até 3 imóveis ativos',
    desc: 'Para proprietários com mais de um imóvel. Curadoria VN Prime nos anúncios, análise de precificação por IA e relatório de desempenho mensal.',
    bullets: [
      'Até 3 imóveis ativos',
      'Curadoria ativa dos anúncios',
      'Análise de precificação por IA',
      'Qualificação de leads antes do contato',
      'Relatório de desempenho mensal',
      'Suporte prioritário',
    ],
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80',
    cta: 'Escolher Plus', accent: '#D4A857',
  },
  {
    id: 'pro', tag: 'Plano Pro', tagColor: '#2F8674',
    title: 'Para investidores.', sub: 'R$ 799 / 12 meses',
    period: 'Até 10 imóveis ativos',
    desc: 'Estrutura completa para quem tem múltiplos imóveis. Painel gerencial consolidado, curadoria dedicada e suporte direto da equipe VN Prime.',
    bullets: [
      'Até 10 imóveis ativos',
      'Painel gerencial com performance consolidada',
      'Curadoria dedicada em todos os anúncios',
      'Relatório de mercado e benchmarks mensais',
      'Suporte dedicado da equipe VN Prime',
      'Materiais de apoio e indicações',
    ],
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
    cta: 'Assinar Pro', accent: '#2F8674',
  },
]

const BENEFICIOS_CORRETOR = [
  { title: 'Carteira VN Prime', desc: 'Acesso ao portfólio curado com imóveis disponíveis para intermediação — com dados do proprietário.' },
  { title: 'CRM e Pipeline', desc: 'Pipeline kanban, histórico de contatos, agendamento de visitas e acompanhamento do funil de vendas.' },
  { title: 'Estrutura sem imobiliária', desc: 'Vitrine premium, suporte técnico e estrutura de captação — sem custos fixos de escritório.' },
  { title: 'Comissão integral', desc: 'Você fecha o negócio e recebe a comissão. Sem desconto de franquia ou taxa de plataforma.' },
]

export default function VenderPage() {
  const [perfil, setPerfil] = useState<null | 'proprietario' | 'corretor'>(null)
  const [liveStats, setLiveStats] = useState<{ ativos: number; vendidos: number; avgPreco: number } | null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.from('imoveis').select('status, preco').in('status', ['ativo', 'vendido']).then(({ data }) => {
      if (!data) return
      const ativos = data.filter(i => i.status === 'ativo').length
      const vendidos = data.filter(i => i.status === 'vendido').length
      const comPreco = data.filter(i => i.status === 'ativo' && i.preco > 0)
      const avgPreco = comPreco.length ? Math.round(comPreco.reduce((s, i) => s + i.preco, 0) / comPreco.length) : 0
      setLiveStats({ ativos, vendidos, avgPreco })
    })
  }, [])
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Hero — Seletor de perfil */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--gradient-navy-hero)', color: '#fff',
        padding: 'clamp(3.5rem,7vw,5.5rem) 0 clamp(2.5rem,4vw,3.5rem)',
      }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(212,168,87,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, width: 'min(1100px,92vw)', margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>VN Prime · Anuncie</Eyebrow>
          <h1 style={{ color: '#fff', margin: '8px 0 14px', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.15 }}>
            Qual é o seu perfil?
          </h1>
          <p style={{ color: 'rgba(245,248,250,0.78)', maxWidth: 500, margin: '0 auto 36px', fontSize: 16, lineHeight: 1.7 }}>
            Caminhos diferentes, padrão VN Prime em todos.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 20, maxWidth: 700, margin: '0 auto' }}>
            {[
              { id: 'proprietario' as const, label: 'Sou proprietário', sub: 'Quero vender meu imóvel', accent: '#D4A857', detail: 'R$ 99/mês Essencial · R$ 399 / 6 meses Plus · R$ 799 / 12 meses Pro' },
              { id: 'corretor' as const, label: 'Sou corretor', sub: 'Quero trabalhar com a VN Prime', accent: '#10B981', detail: 'CRM + carteira VN Prime · Comissão integral ao fechar' },
            ].map(p => (
              <button key={p.id} onClick={() => setPerfil(perfil === p.id ? null : p.id)} style={{
                border: perfil === p.id ? `2px solid ${p.accent}` : '2px solid rgba(255,255,255,0.15)',
                borderRadius: 18, padding: '28px 24px', textAlign: 'left', cursor: 'pointer',
                background: perfil === p.id ? `${p.accent}18` : 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)', transition: 'all 0.2s', color: '#fff',
              }}>
                <div style={{ width: 36, height: 3, background: p.accent, borderRadius: 2, marginBottom: 16 }} />
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 5 }}>{p.label}</div>
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.72)', marginBottom: 10 }}>{p.sub}</div>
                <div style={{ fontSize: 11.5, color: p.accent, fontWeight: 600, letterSpacing: '0.04em' }}>{p.detail}</div>
                {perfil === p.id && (
                  <div style={{ marginTop: 14, fontSize: 11, fontWeight: 700, color: p.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Selecionado ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {perfil && (
            <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              Role para baixo para ver as opções
            </p>
          )}
        </div>
      </section>

      {/* Live market stats strip */}
      {liveStats && (
        <section style={{ background: 'var(--navy-deep)', padding: '18px 0' }}>
          <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { n: liveStats.ativos.toString(), label: 'imóveis ativos na vitrine' },
              { n: liveStats.vendidos.toString(), label: 'vendidos pela VN Prime' },
              { n: liveStats.avgPreco >= 1_000_000
                  ? `R$ ${(liveStats.avgPreco / 1_000_000).toFixed(1).replace('.', ',')} mi`
                  : `R$ ${(liveStats.avgPreco / 1_000).toFixed(0)} mil`,
                label: 'ticket médio do portfólio' },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '8px 32px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontSize: 'clamp(1.3rem,2.2vw,1.6rem)', fontWeight: 900, color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{s.n}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── BLOCO PROPRIETÁRIO ── */}
      {(!perfil || perfil === 'proprietario') && (
        <section style={{ padding: 'clamp(3rem,5vw,4.5rem) 0', borderTop: '1px solid var(--border)', background: '#fff' }}>
          <div style={{ width: 'min(1180px,94vw)', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <Eyebrow>Para proprietários</Eyebrow>
              <h2 style={{ margin: '8px 0 12px' }}>Escolha o seu plano</h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 15.5, maxWidth: 520, margin: '0 auto' }}>
                Todos os planos incluem vitrine VN Prime, leads qualificados e suporte de plataforma.
              </p>
            </div>

            {/* Banners empilhados — mesmo padrão do Como Funciona */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(PLANOS_PROP as typeof PLANOS_PROP).map((p, idx) => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 0, overflow: 'hidden', border: '1px solid rgba(27,39,51,0.10)', direction: idx % 2 === 1 ? 'rtl' : 'ltr' }}>
                  {/* Imagem */}
                  <div style={{ height: 'min(280px,60vw)', minHeight: 220, position: 'relative', backgroundImage: `url(${'img' in p ? p.img : ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,22,32,0.08) 0%, rgba(15,22,32,0.80) 100%)' }} />
                    {idx === 1 && (
                      <div style={{ position: 'absolute', top: 16, left: 16, direction: 'ltr', background: p.accent, color: idx === 1 ? 'var(--navy-deep)' : '#fff', borderRadius: 999, padding: '4px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        Mais popular
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 24, left: 24, direction: 'ltr' }}>
                      <div style={{ display: 'inline-block', background: p.accent + '22', border: `1px solid ${p.accent}55`, borderRadius: 999, padding: '4px 13px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.accent, marginBottom: 8 }}>{p.tag}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,2.4vw,2.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 4 }}>{'sub' in p ? p.sub : ''}</div>
                      <div style={{ fontSize: 13, color: 'rgba(245,248,250,0.75)', fontWeight: 600 }}>{'period' in p ? p.period : ''}</div>
                    </div>
                  </div>
                  {/* Conteúdo */}
                  <div style={{ background: idx === 1 ? `${p.accent}06` : '#fff', padding: 'clamp(28px,4vw,44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', direction: 'ltr', borderLeft: idx === 1 ? `3px solid ${p.accent}` : 'none' }}>
                    <div style={{ width: 36, height: 3, background: p.accent, borderRadius: 2, marginBottom: 16 }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,1.8vw,1.5rem)', fontWeight: 700, color: 'var(--navy)', margin: '0 0 10px' }}>{p.title}</h3>
                    <p style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.75, margin: '0 0 20px' }}>{p.desc}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {p.bullets.map(b => (
                        <li key={b} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.5 }}>
                          <span style={{ color: p.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{b}
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Link href="/anunciar">
                        <button style={{ padding: '12px 26px', borderRadius: 10, border: 'none', cursor: 'pointer', background: p.accent, color: p.accent === '#D4A857' ? 'var(--navy-deep)' : '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, boxShadow: `0 6px 20px ${p.accent}33` }}>
                          {p.cta} →
                        </button>
                      </Link>
                      <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>Cancele quando quiser</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BLOCO CORRETOR ── */}
      {(!perfil || perfil === 'corretor') && (
        <section style={{ padding: 'clamp(3rem,5vw,4.5rem) 0',
          borderTop: '1px solid var(--border)', background: 'var(--cream)' }}>
          <div style={{ width: 'min(1180px,94vw)', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))',
              gap: 'clamp(32px,5vw,64px)', alignItems: 'center' }}>

              {/* Esquerda — copy */}
              <div>
                <Eyebrow>Para corretores</Eyebrow>
                <h2 style={{ margin: '10px 0 16px' }}>
                  Traga sua carteira.{' '}
                  <em className="italic-accent">Receba leads qualificados.</em>
                </h2>
                <p style={{ fontSize: 15.5, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 28 }}>
                  Na VN Prime o corretor parceiro acessa a carteira VN Prime, usa CRM integrado e pipeline de vendas profissional — sem precisar montar uma imobiliária. Você fecha o negócio e recebe a comissão integral.
                </p>
                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', marginBottom: 32 }}>
                  {BENEFICIOS_CORRETOR.map(b => (
                    <div key={b.title} style={{ background: '#fff', borderRadius: 14, padding: '20px 18px',
                      border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(15,34,68,0.05)' }}>
                      <div style={{ width: 28, height: 3, background: '#10B981', borderRadius: 2, marginBottom: 12 }} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>{b.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>{b.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/corretor">
                    <button style={{
                      padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: '#10B981', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 15,
                      boxShadow: '0 6px 20px #10B98144',
                    }}>Acessar Portal do Corretor</button>
                  </Link>
                  <Link href="/login">
                    <button style={{
                      padding: '14px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                      fontWeight: 600, fontSize: 14, background: 'transparent',
                      border: '1.5px solid var(--border)', color: 'var(--navy)',
                    }}>Criar conta grátis</button>
                  </Link>
                </div>
              </div>

              {/* Direita — preço */}
              <div style={{ background: 'var(--navy)', borderRadius: 24, padding: 'clamp(28px,4vw,48px)',
                color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200,
                  background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 65%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: '#10B981', marginBottom: 18 }}>Portal do Corretor</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.8rem)',
                    fontWeight: 800, lineHeight: 1, color: '#fff', marginBottom: 6 }}>R$ 49,90</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 28 }}>/mês · cancele quando quiser</div>
                  {[
                    '30 dias grátis para começar',
                    'Leads qualificados incluídos',
                    'CRM e agenda de visitas',
                    'Portfólio exclusivo VN Prime',
                    '3% de comissão garantida em contrato',
                    'Suporte direto da equipe VN Prime',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start',
                      marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.82)' }}>
                      <span style={{ color: '#10B981', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {item}
                    </div>
                  ))}
                  <Link href="/corretor" style={{ display: 'block', marginTop: 8 }}>
                    <button style={{
                      width: '100%', padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: '#10B981', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 15,
                    }}>Começar 30 dias grátis</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Simulator */}
      <section style={{ padding: 'clamp(3rem,5vw,5rem) 0', background: '#fff' }}>
        <div style={{ width: 'min(900px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow color="var(--gold-deep)">Simulador interativo</Eyebrow>
            <h2 style={{ margin: '8px 0 12px' }}>Quanto você recebe em cada plano?</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>
              Arraste o slider e veja o custo real de cada modalidade com base no valor do seu imóvel.
            </p>
          </div>
          <PricingSimulator />
        </div>
      </section>

      {/* FAQ */}
      {(() => {
        const FAQS = [
          { q: 'Quanto tempo leva para meu imóvel aparecer na vitrine?', a: 'Após o envio, nossa equipe de curadoria revisa em até 24 horas úteis. Imóveis com fotos profissionais e descrição completa são aprovados mais rápido.' },
          { q: 'Posso anunciar sem usar corretor?', a: 'Sim. No plano Venda Direta você mantém controle total da negociação. A VN Prime entra com a vitrine, distribuição em portais e suporte de plataforma.' },
          { q: 'Como a VN Prime garante que o comprador é qualificado?', a: 'Todo comprador que entra em contato passa pelo nosso formulário de qualificação — perfil, faixa de orçamento e intenção de compra. Você recebe o lead pré-filtrado.' },
          { q: 'O que está incluso no plano de 6%?', a: 'Sessão fotográfica profissional, mídia paga em Meta e Google, corretor dedicado para visitas e negociação, e suporte jurídico da minuta até a escritura.' },
          { q: 'Posso pausar ou cancelar a qualquer momento?', a: 'Sim. No plano Direta você tem 90 dias de vigência e pode pausar a qualquer momento pelo painel. Nos planos de comissão não há prazo mínimo.' },
          { q: 'E se meu imóvel não vender?', a: 'No plano Direta você paga apenas a taxa de publicação (R$ 297). Nos planos de comissão (3% ou 6%) não há cobrança se não houver venda.' },
        ]
        return (
          <section style={{ padding: 'clamp(3rem,5vw,5rem) 0', background: 'var(--cream)' }}>
            <div style={{ width: 'min(820px,94vw)', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Eyebrow color="var(--gold-deep)">Dúvidas frequentes</Eyebrow>
                <h2 style={{ margin: '8px 0 0' }}>Perguntas e respostas</h2>
              </div>
              <FaqList items={FAQS} />
            </div>
          </section>
        )
      })()}

      {/* Trust strip */}
      <section style={{ padding: 'clamp(3rem,5vw,4rem) 0', background: 'var(--navy)', color: '#fff' }}>
        <div style={{ width: 'min(1180px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow>Padrão VN Prime</Eyebrow>
            <h2 style={{ color: '#fff', margin: '8px 0 0', fontWeight: 400 }}>Por que trabalhar conosco?</h2>
          </div>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
            {[
              ['Vitrine de alto padrão', 'Imóveis selecionados com rigor técnico e posicionamento de mercado. Não somos um classificado.'],
              ['Só paga ao vender', 'Taxa fixa de publicação ou comissão sobre o valor de venda — nenhum risco de entrada.'],
              ['Inteligência de mercado', 'Comparativos de preço da região, tempo médio de venda e análise de demanda por localização.'],
              ['Suporte do início ao fim', 'Time VN Prime acompanha da publicação do anúncio até a assinatura da escritura.'],
            ].map(([t, d]) => (
              <div key={t} style={{ borderTop: '2px solid rgba(212,168,87,0.35)', paddingTop: 18 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600,
                  color: 'var(--gold-soft)', marginBottom: 8 }}>{t}</div>
                <p style={{ color: 'rgba(245,248,250,0.72)', fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
