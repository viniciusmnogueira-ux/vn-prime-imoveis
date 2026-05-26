'use client'
import { useState } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'

const PLANOS_PROP = [
  {
    id: 'direta', tag: 'Venda Direta', tagColor: '#D4A857',
    title: 'Você no comando.', sub: 'Taxa fixa R$ 297',
    desc: 'Você publica, define o preço e conduz a negociação. A VN Prime entra com a vitrine, a distribuição em portais e o suporte de plataforma.',
    bullets: [
      'Taxa fixa R$ 297 — vigência de 90 dias',
      'Cadastro e gestão de anúncio pelo portal do proprietário',
      'Descrição editorial gerada por IA',
      'Agenda de visitas e leads pelo painel',
      'Endereço protegido — exibe só o bairro na vitrine',
      'Pacotes de fotografia e mídia disponíveis à parte',
    ],
    cta: 'Anunciar agora — R$ 297', accent: '#D4A857',
  },
  {
    id: 'assistida', tag: 'Venda Assistida', tagColor: '#2F8674',
    title: 'A VN Prime apoia.', sub: '3% somente ao vender',
    desc: 'Você continua à frente, mas a VN Prime entra com IA de curadoria, sugestões de preço, análise de leads e acompanhamento ativo do anúncio.',
    bullets: [
      '3% de comissão — você paga somente ao vender',
      'Análise de precificação por IA com comparativos da região',
      'Curadoria ativa do anúncio e sugestões de melhoria',
      'Qualificação de leads antes de chegar até você',
      'Relatório semanal de desempenho e benchmarks',
      '30 dias grátis de FactorOne incluso',
    ],
    cta: 'Começar — sem custo inicial', accent: '#2F8674',
  },
  {
    id: 'completa', tag: 'Venda Completa', tagColor: '#B8862E',
    title: 'Corretor dedicado.', sub: '6% sobre a venda',
    desc: 'Um corretor credenciado VN Prime assume tudo: fotos profissionais, mídia paga, visitas acompanhadas, negociação e suporte jurídico até a escritura.',
    bullets: [
      '6% de comissão — 3% corretor + 3% VN Prime',
      'Corretor parceiro credenciado e dedicado ao seu imóvel',
      'Sessão fotográfica profissional inclusa',
      'Mídia paga gerenciada em Meta, Google e portais',
      'Visitas acompanhadas e compradores qualificados',
      'Suporte jurídico da minuta até a escritura',
    ],
    cta: 'Contratar corretor', accent: '#B8862E',
  },
]

const BENEFICIOS_CORRETOR = [
  { icon: '🎯', title: 'Leads qualificados direto no painel', desc: 'Compradores verificados com perfil e orçamento confirmados. Alerta imediato por WhatsApp.' },
  { icon: '📊', title: 'CRM visual completo', desc: 'Pipeline kanban, histórico de contatos, agendamento de visitas e relatório de comissões.' },
  { icon: '🏠', title: 'Portfólio exclusivo VN Prime', desc: 'Acesso antecipado a imóveis premium em BH 72h antes do mercado público.' },
  { icon: '💳', title: 'Comissão 3% + pagamento D+2', desc: 'Extrato detalhado, NF automática e pagamento em até 2 dias úteis após o fechamento.' },
]

export default function VenderPage() {
  const [perfil, setPerfil] = useState<null | 'proprietario' | 'corretor'>(null)

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
              { id: 'proprietario' as const, label: 'Sou proprietário', sub: 'Quero vender meu imóvel', icon: '🏠', accent: '#D4A857', detail: 'Taxa fixa R$ 297 · 3% assistida · 6% completa' },
              { id: 'corretor' as const, label: 'Sou corretor', sub: 'Quero trabalhar com a VN Prime', icon: '🤝', accent: '#10B981', detail: 'Leve sua carteira · receba leads · R$ 49,90/mês' },
            ].map(p => (
              <button key={p.id} onClick={() => setPerfil(perfil === p.id ? null : p.id)} style={{
                border: perfil === p.id ? `2px solid ${p.accent}` : '2px solid rgba(255,255,255,0.15)',
                borderRadius: 18, padding: '28px 24px', textAlign: 'left', cursor: 'pointer',
                background: perfil === p.id ? `${p.accent}18` : 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)', transition: 'all 0.2s', color: '#fff',
              }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{p.icon}</div>
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

      {/* ── BLOCO PROPRIETÁRIO ── */}
      {(!perfil || perfil === 'proprietario') && (
        <section style={{ padding: 'clamp(3rem,5vw,4.5rem) 0',
          borderTop: '1px solid var(--border)', background: '#fff' }}>
          <div style={{ width: 'min(1180px,94vw)', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <Eyebrow>Para proprietários</Eyebrow>
              <h2 style={{ margin: '8px 0 12px' }}>Escolha o seu plano</h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 15.5, maxWidth: 520, margin: '0 auto' }}>
                Todos os planos incluem vitrine VN Prime, distribuição em portais e suporte de plataforma.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))' }}>
              {PLANOS_PROP.map((p, i) => (
                <div key={p.id} style={{
                  background: '#fff', borderRadius: 20,
                  border: i === 2 ? `2px solid ${p.accent}` : '1px solid var(--border)',
                  padding: '28px 26px', display: 'flex', flexDirection: 'column',
                  boxShadow: i === 2 ? `0 8px 32px ${p.accent}22` : '0 2px 12px rgba(15,34,68,0.06)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {i === 2 && (
                    <div style={{ position: 'absolute', top: 16, right: 16,
                      background: p.accent, color: '#fff', borderRadius: 999,
                      padding: '3px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Mais vendido
                    </div>
                  )}
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ background: `${p.accent}18`, color: p.accent, borderRadius: 999,
                      padding: '4px 12px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {p.tag}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
                    color: 'var(--navy)', margin: '14px 0 4px', letterSpacing: '-0.02em' }}>{p.sub}</div>
                  <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65, margin: '0 0 20px', flex: 1 }}>{p.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {p.bullets.map(b => (
                      <li key={b} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.5 }}>
                        <span style={{ color: p.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href="/anunciar" style={{ display: 'block' }}>
                    <button style={{
                      width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: i === 2 ? p.accent : 'var(--navy)', color: '#fff',
                      fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                      boxShadow: i === 2 ? `0 6px 20px ${p.accent}44` : 'none',
                    }}>{p.cta}</button>
                  </Link>
                  <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11.5, color: 'var(--fg-3)', letterSpacing: '0.01em' }}>
                    Faça o upgrade quando quiser — sem burocracia.
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
                  Na VN Prime o corretor parceiro trabalha com a melhor base de imóveis de alto padrão de BH, recebe leads verificados e usa CRM profissional — por R$ 49,90/mês.
                </p>
                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', marginBottom: 32 }}>
                  {BENEFICIOS_CORRETOR.map(b => (
                    <div key={b.title} style={{ background: '#fff', borderRadius: 14, padding: '20px 18px',
                      border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(15,34,68,0.05)' }}>
                      <div style={{ fontSize: 24, marginBottom: 10 }}>{b.icon}</div>
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
