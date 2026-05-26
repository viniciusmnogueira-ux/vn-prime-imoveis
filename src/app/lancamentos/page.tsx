'use client'
import { useState } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'

// ─── Static data ────────────────────────────────────────────────────────────

interface Empreendimento {
  id: string
  tipo: string
  selo: string
  nome: string
  bairro: string
  descricao: string
  precoFrom: string
  entrega: string
  unidades: string
  plantas: string
  valorizacao: string
  fotos: string[]
  lazer: string[]
}

const EMPREENDIMENTOS: Empreendimento[] = [
  {
    id: 'serra-verde',
    tipo: 'apartamento',
    selo: 'BREVE LANÇAMENTO',
    nome: 'Residencial Serra Verde',
    bairro: 'Vila da Serra · Nova Lima',
    descricao:
      'Arquitetura contemporânea com vista para o Vale do Sereno. Apartamentos de 2 a 3 suítes com varanda gourmet integrada, em uma das áreas mais valorizadas da Grande BH.',
    precoFrom: 'R$ 1,2 mi',
    entrega: '12/2029',
    unidades: '64 apts',
    plantas: '2-3 suítes · 78-142 m²',
    valorizacao: '50-60%',
    fotos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=85',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85',
    ],
    lazer: [
      'Piscina infinita', 'Academia', 'Espaço gourmet', 'Coworking',
      'Spa & sauna', 'Sala de jogos', 'Brinquedoteca', 'Portaria 24h',
      'Garagem coberta', 'Área verde', 'Pet place', 'Rooftop view',
    ],
  },
  {
    id: 'reserva-belvedere',
    tipo: 'casas',
    selo: 'PRÉ-LANÇAMENTO',
    nome: 'Reserva Belvedere',
    bairro: 'Vale dos Cristais · Nova Lima',
    descricao:
      'Casas de design assinado em condomínio fechado. Privacidade absoluta em meio à mata nativa do Vale dos Cristais. Lotes de 460 a 800 m² com casas de 4 a 5 suítes.',
    precoFrom: 'R$ 3,8 mi',
    entrega: '06/2028',
    unidades: '24 casas',
    plantas: '4-5 suítes · 380-560 m²',
    valorizacao: '40-55%',
    fotos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=85',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=85',
      'https://images.unsplash.com/photo-1582268611958-ebfd161df9d8?w=1600&q=85',
    ],
    lazer: [
      'Piscina aquecida', 'Quadra esportiva', 'Casa de hóspedes', 'Segurança 24h',
      'Área de churrasqueira', 'Playground', 'Pista de caminhada', 'Pomar comunitário',
    ],
  },
  {
    id: 'mirante-vale',
    tipo: 'lotes',
    selo: 'EM VENDAS',
    nome: 'Mirante do Vale Sul · Lotes',
    bairro: 'Vale do Sereno · Nova Lima',
    descricao:
      'Loteamento de alto padrão com infraestrutura completa. Vista panorâmica do Vale do Sereno. Construa a casa dos seus sonhos com lotes de 450 a 800 m² entregues prontos.',
    precoFrom: 'R$ 320 mil',
    entrega: 'Pronto p/ construir',
    unidades: '48 lotes',
    plantas: 'Loteamento · 450-800 m²',
    valorizacao: 'Já entregue',
    fotos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=85',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=85',
    ],
    lazer: [
      'Condomínio fechado', 'Áreas de lazer', 'Energia subterrânea', 'Rede de esgoto',
      'Vias asfaltadas', 'Pista de caminhada', 'Áreas de convívio', 'Vista panorâmica',
    ],
  },
]

// ─── KPI card ────────────────────────────────────────────────────────────────

function KpiCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.14)',
      borderRadius: 16,
      padding: '22px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 'clamp(26px,3.5vw,36px)', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(245,248,250,0.72)', marginTop: 6, letterSpacing: '0.03em' }}>
        {label}
      </div>
    </div>
  )
}

// ─── EmpreendimentoCard ───────────────────────────────────────────────────────

interface CardProps {
  emp: Empreendimento
  flip: boolean
  onInteresse: () => void
}

function EmpreendimentoCard({ emp, flip, onInteresse }: CardProps) {
  const [foto, setFoto] = useState(0)

  const prev = () => setFoto(f => (f - 1 + emp.fotos.length) % emp.fotos.length)
  const next = () => setFoto(f => (f + 1) % emp.fotos.length)

  const seloColor: Record<string, string> = {
    'BREVE LANÇAMENTO': 'var(--gold)',
    'PRÉ-LANÇAMENTO': '#E67E22',
    'EM VENDAS': '#27AE60',
  }

  const visibleLazer = emp.lazer.slice(0, 6)
  const extraLazer = emp.lazer.length - 6

  const photoCol = (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 380 }}>
      {/* Main photo */}
      <div style={{
        width: '100%',
        paddingBottom: '62%',
        background: `url(${emp.fotos[foto]}) center/cover`,
        position: 'relative',
      }}>
        {/* Counter */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(0,0,0,0.55)', color: '#fff',
          fontSize: 12, fontWeight: 600, borderRadius: 99,
          padding: '4px 10px', backdropFilter: 'blur(4px)',
        }}>
          {foto + 1} / {emp.fotos.length}
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Foto anterior"
          style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: 'var(--navy)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          ‹
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Próxima foto"
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: 'var(--navy)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          ›
        </button>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 10px 0',
        background: '#0F1620',
      }}>
        {emp.fotos.map((src, i) => (
          <button
            key={i}
            onClick={() => setFoto(i)}
            style={{
              width: 60, height: 44, borderRadius: 6, overflow: 'hidden',
              border: i === foto ? '2px solid var(--gold)' : '2px solid transparent',
              padding: 0, cursor: 'pointer', flexShrink: 0,
              background: `url(${src}) center/cover`,
            }}
            aria-label={`Ver foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )

  const infoCol = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
      {/* Selo + tipo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          background: seloColor[emp.selo] ?? 'var(--gold)',
          color: emp.selo === 'EM VENDAS' ? '#fff' : 'var(--navy-deep)',
          fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
          padding: '4px 12px', borderRadius: 99,
        }}>
          {emp.selo}
        </span>
        <span style={{ fontSize: 12, color: 'var(--fg-3)', textTransform: 'capitalize', letterSpacing: '0.04em' }}>
          {emp.tipo}
        </span>
      </div>

      {/* Nome + bairro */}
      <div>
        <h2 style={{ margin: '0 0 4px', fontSize: 'clamp(22px,3vw,30px)', color: 'var(--navy)' }}>
          {emp.nome}
        </h2>
        <div style={{ fontSize: 14, color: 'var(--fg-2)' }}>{emp.bairro}</div>
      </div>

      {/* Preço */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 2 }}>A partir de</div>
        <div style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: 'var(--gold-deep)' }}>
          {emp.precoFrom}
        </div>
      </div>

      {/* Descrição */}
      <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.7, margin: 0 }}>
        {emp.descricao}
      </p>

      {/* Specs grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px',
        background: 'var(--cream)', borderRadius: 14, padding: '14px 16px',
      }}>
        {[
          { label: 'Entrega', value: emp.entrega },
          { label: 'Unidades', value: emp.unidades },
          { label: 'Tipologia', value: emp.plantas },
          { label: 'Valorização', value: emp.valorizacao },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginTop: 2 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Lazer pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {visibleLazer.map(item => (
          <span key={item} style={{
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99,
            background: 'rgba(15,22,32,0.07)', color: 'var(--fg-1)',
          }}>
            {item}
          </span>
        ))}
        {extraLazer > 0 && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99,
            background: 'rgba(212,168,87,0.15)', color: 'var(--gold-deep)',
          }}>
            +{extraLazer} mais
          </span>
        )}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
        <Btn variant="accent" onClick={onInteresse}>
          Tenho interesse
        </Btn>
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <Btn variant="ghost">Tabela de preços</Btn>
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: flip ? '1fr 1.3fr' : '1.3fr 1fr',
      gap: 'clamp(24px,4vw,60px)',
      alignItems: 'start',
      padding: 'clamp(32px,5vw,56px) 0',
      borderBottom: '1px solid var(--border)',
    }}>
      {flip ? (
        <>
          {infoCol}
          {photoCol}
        </>
      ) : (
        <>
          {photoCol}
          {infoCol}
        </>
      )}
    </div>
  )
}

// ─── TabelaInteresse ─────────────────────────────────────────────────────────

interface FormState {
  nome: string
  whatsapp: string
  objetivo: 'Morar' | 'Investir' | 'Ambos' | ''
  orcamento: string
  prazo: string
  selecionados: string[]
}

function TabelaInteresse() {
  const [form, setForm] = useState<FormState>({
    nome: '', whatsapp: '', objetivo: '', orcamento: '', prazo: '', selecionados: [],
  })
  const [enviado, setEnviado] = useState(false)

  function toggleEmp(id: string) {
    setForm(f => ({
      ...f,
      selecionados: f.selecionados.includes(id)
        ? f.selecionados.filter(x => x !== id)
        : [...f.selecionados, id],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nomes = EMPREENDIMENTOS
      .filter(em => form.selecionados.includes(em.id))
      .map(em => em.nome)
      .join(', ') || 'Não especificado'

    const msg = encodeURIComponent(
      `Olá! Tenho interesse nos lançamentos da VN Prime.\n\n` +
      `*Nome:* ${form.nome}\n` +
      `*Empreendimentos:* ${nomes}\n` +
      `*Objetivo:* ${form.objetivo || 'Não informado'}\n` +
      `*Faixa de orçamento:* ${form.orcamento || 'Não informado'}\n` +
      `*Prazo para compra:* ${form.prazo || 'Não informado'}`
    )
    window.open(`https://wa.me/5531984144250?text=${msg}`, '_blank')
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div style={{ textAlign: 'center', padding: 'clamp(50px,7vw,80px) 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: 'var(--navy)', marginBottom: 12 }}>Interesse enviado!</h2>
        <p style={{ fontSize: 16, color: 'var(--fg-2)', maxWidth: 480, margin: '0 auto 28px' }}>
          Nossa equipe vai entrar em contato pelo WhatsApp em breve com as informações dos empreendimentos selecionados.
        </p>
        <Btn variant="accent" onClick={() => setEnviado(false)}>Enviar outro interesse</Btn>
      </div>
    )
  }

  const orcamentos = [
    'Até R$ 500 mil', 'R$ 500 mil – R$ 1 mi', 'R$ 1 mi – R$ 2 mi',
    'R$ 2 mi – R$ 5 mi', 'Acima de R$ 5 mi',
  ]

  const prazos = ['Imediato', '3-6 meses', '6-12 meses', 'Mais de 1 ano']

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'var(--navy)', borderRadius: '20px 20px 0 0',
        padding: 'clamp(24px,4vw,40px) clamp(24px,5vw,52px)',
        color: '#fff',
      }}>
        <Eyebrow color="var(--gold)">Demonstre seu interesse</Eyebrow>
        <h2 style={{ color: '#fff', margin: '10px 0 4px', fontSize: 'clamp(20px,2.8vw,28px)' }}>
          Tabela de interesse — Lançamentos VN Prime
        </h2>
        <p style={{ color: 'rgba(245,248,250,0.7)', fontSize: 14, margin: 0 }}>
          Selecione os empreendimentos de interesse e preencha seus dados. Entraremos em contato pelo WhatsApp.
        </p>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} style={{
        background: '#fff', borderRadius: '0 0 20px 20px',
        border: '1px solid var(--border)', borderTop: 'none',
        padding: 'clamp(24px,4vw,48px) clamp(24px,5vw,52px)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(24px,4vw,48px)',
        }}>
          {/* Left: empreendimentos */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 12, letterSpacing: '0.04em' }}>
              Selecione os empreendimentos *
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EMPREENDIMENTOS.map(emp => {
                const selected = form.selecionados.includes(emp.id)
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => toggleEmp(emp.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                      border: selected ? '2px solid var(--gold)' : '2px solid var(--border)',
                      background: selected ? 'rgba(212,168,87,0.07)' : '#fff',
                      textAlign: 'left', transition: 'border-color 0.15s, background 0.15s',
                      width: '100%',
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 52, height: 40, borderRadius: 8, flexShrink: 0,
                      background: `url(${emp.fotos[0]}) center/cover`,
                    }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>
                        {emp.nome}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
                        {emp.bairro} · {emp.precoFrom}
                      </div>
                    </div>
                    {/* Checkmark */}
                    <div style={{
                      marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%',
                      border: selected ? '2px solid var(--gold)' : '2px solid var(--border)',
                      background: selected ? 'var(--gold)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      {selected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#1B2733" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Nome */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                Nome *
              </label>
              <input
                required
                type="text"
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '11px 14px', borderRadius: 10,
                  border: '1.5px solid var(--border)', fontSize: 14,
                  outline: 'none', color: 'var(--navy)', fontFamily: 'inherit',
                }}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                WhatsApp *
              </label>
              <input
                required
                type="tel"
                placeholder="(31) 9 0000-0000"
                value={form.whatsapp}
                onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '11px 14px', borderRadius: 10,
                  border: '1.5px solid var(--border)', fontSize: 14,
                  outline: 'none', color: 'var(--navy)', fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Objetivo */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.05em', marginBottom: 8 }}>
                Objetivo
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['Morar', 'Investir', 'Ambos'] as const).map(op => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, objetivo: f.objetivo === op ? '' : op }))}
                    style={{
                      flex: 1, padding: '9px 8px', borderRadius: 10,
                      border: form.objetivo === op ? '2px solid var(--gold)' : '2px solid var(--border)',
                      background: form.objetivo === op ? 'rgba(212,168,87,0.1)' : '#fff',
                      fontSize: 13, fontWeight: 600,
                      color: form.objetivo === op ? 'var(--gold-deep)' : 'var(--fg-1)',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa de orçamento */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                Faixa de orçamento
              </label>
              <select
                value={form.orcamento}
                onChange={e => setForm(f => ({ ...f, orcamento: e.target.value }))}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '11px 14px', borderRadius: 10,
                  border: '1.5px solid var(--border)', fontSize: 14,
                  outline: 'none', color: 'var(--navy)', fontFamily: 'inherit',
                  background: '#fff', cursor: 'pointer',
                }}
              >
                <option value="">Selecione...</option>
                {orcamentos.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Prazo */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.05em', marginBottom: 8 }}>
                Prazo para compra
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {prazos.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, prazo: f.prazo === p ? '' : p }))}
                    style={{
                      padding: '9px 8px', borderRadius: 10,
                      border: form.prazo === p ? '2px solid var(--gold)' : '2px solid var(--border)',
                      background: form.prazo === p ? 'rgba(212,168,87,0.1)' : '#fff',
                      fontSize: 12, fontWeight: 600,
                      color: form.prazo === p ? 'var(--gold-deep)' : 'var(--fg-1)',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Btn
              type="submit"
              variant="accent"
              fullWidth
              size="lg"
              style={{ marginTop: 8 }}
            >
              Enviar interesse pelo WhatsApp
            </Btn>
            <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: 0, textAlign: 'center' }}>
              Seus dados são usados apenas para contato pela equipe VN Prime.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LancamentosPage() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(95deg, rgba(15,22,32,0.88) 0%, rgba(15,22,32,0.78) 55%, rgba(15,22,32,0.62) 100%), url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=85) center/cover`,
        minHeight: 480,
        padding: 'clamp(60px,8vw,110px) 0',
        color: '#fff',
      }}>
        <div style={{
          width: 'min(1200px,92vw)', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            <Eyebrow color="var(--gold)">Lançamentos exclusivos · VN Prime · Vale dos Cristais</Eyebrow>
            <h1 style={{ color: '#fff', margin: '16px 0 20px', fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.15 }}>
              Alta valorização.{' '}
              <em className="italic-accent" style={{ color: 'var(--gold-soft)', fontStyle: 'italic' }}>
                Condições que cabem no seu momento.
              </em>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(245,248,250,0.82)', lineHeight: 1.75, marginBottom: 36, maxWidth: 520 }}>
              Empreendimentos de alto padrão no Vale dos Cristais e Nova Lima, selecionados pela VN Prime para quem busca valorização real com qualidade de vida incomparável.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn variant="accent" size="lg" onClick={() => scrollTo('empreendimentos')}>
                Ver empreendimentos
              </Btn>
              <a
                href="https://wa.me/5531984144250?text=Olá! Quero saber mais sobre os lançamentos VN Prime."
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Btn
                  variant="primary"
                  size="lg"
                  style={{ background: '#25D366', color: '#fff', boxShadow: '0 4px 18px rgba(37,211,102,0.35)' }}
                >
                  WhatsApp
                </Btn>
              </a>
            </div>
          </div>

          {/* Right: KPI grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <KpiCard value="3" label="Empreendimentos" />
            <KpiCard value="136" label="Unidades" />
            <KpiCard value="4 anos" label="Ciclo médio" />
            <KpiCard value="50-60%" label="Valorização" />
          </div>
        </div>
      </section>

      {/* ── Section 2: Empreendimentos ───────────────────────────────────── */}
      <section id="empreendimentos" style={{ padding: 'clamp(50px,7vw,90px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <div style={{ marginBottom: 'clamp(24px,4vw,48px)' }}>
            <Eyebrow>Portfólio exclusivo</Eyebrow>
            <h2 style={{ margin: '12px 0 10px', fontSize: 'clamp(24px,3.5vw,40px)' }}>
              Empreendimentos em{' '}
              <em className="italic-accent" style={{ color: 'var(--gold-deep)', fontStyle: 'italic' }}>destaque</em>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-2)', maxWidth: 560, lineHeight: 1.7 }}>
              Conheça cada projeto em detalhe: arquitetura, lazer, localização e condições de pagamento sob medida.
            </p>
          </div>

          {EMPREENDIMENTOS.map((emp, i) => (
            <EmpreendimentoCard
              key={emp.id}
              emp={emp}
              flip={i % 2 === 1}
              onInteresse={() => scrollTo('tabela-interesse')}
            />
          ))}
        </div>
      </section>

      {/* ── Section 3: Como comprar na planta ───────────────────────────── */}
      <section style={{ background: '#fff', padding: 'clamp(50px,7vw,90px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ maxWidth: 640, marginBottom: 'clamp(32px,5vw,60px)' }}>
            <Eyebrow>Passo a passo</Eyebrow>
            <h2 style={{ margin: '12px 0 14px', fontSize: 'clamp(22px,3.2vw,38px)' }}>
              Como comprar{' '}
              <em className="italic-accent" style={{ color: 'var(--gold-deep)', fontStyle: 'italic' }}>na planta</em>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-2)', lineHeight: 1.75 }}>
              Comprar na planta oferece preços menores, mais tempo para pagar e valorização garantida até a entrega. Veja como funciona o processo do início ao fim.
            </p>
          </div>

          {/* 6 steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(16px,3vw,28px)',
            marginBottom: 'clamp(40px,6vw,72px)',
          }}>
            {[
              { n: '01', title: 'Escolha o empreendimento', desc: 'Compare localização, tipologia, prazo de entrega e potencial de valorização com nossa equipe.' },
              { n: '02', title: 'Reserve sua unidade', desc: 'Pague uma sinal simbólico para garantir a unidade escolhida antes do lançamento oficial.' },
              { n: '03', title: 'Assine o contrato', desc: 'Contrato direto com a incorporadora. A VN Prime acompanha toda a revisão jurídica.' },
              { n: '04', title: 'Pague durante a obra', desc: 'Parcelas mensais corrigidas pelo INCC durante a fase de construção, sem juros bancários.' },
              { n: '05', title: 'Financie o saldo na entrega', desc: 'Na entrega das chaves, o saldo residual é financiado por banco com taxas competitivas.' },
              { n: '06', title: 'Receba as chaves', desc: 'Imóvel entregue com valorização acumulada. Você mora, aluga ou revende com lucro.' },
            ].map(step => (
              <div key={step.n} style={{
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: 18, padding: 'clamp(20px,3vw,30px)',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.12em',
                  color: 'var(--gold)', marginBottom: 10,
                }}>
                  {step.n}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, lineHeight: 1.3 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.65 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div style={{
            background: 'var(--navy)',
            borderRadius: 20, overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{ padding: 'clamp(20px,3vw,32px) clamp(24px,4vw,40px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: '#fff', margin: 0, fontSize: 'clamp(15px,2.2vw,20px)', fontWeight: 700 }}>
                Comprar na planta vs. pronto — comparativo
              </h3>
            </div>

            {/* Table body */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '14px clamp(16px,3vw,32px)', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'rgba(245,248,250,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', width: '36%' }}>
                      Critério
                    </th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Na planta
                    </th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(245,248,250,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Pronto
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { criterio: 'Preço de entrada', planta: 'Menor (10-30% do total)', pronto: 'Maior (30-50% + saldo)' },
                    { criterio: 'Valorização', planta: '40-60% até a entrega', pronto: 'Depende do mercado' },
                    { criterio: 'Forma de pagamento', planta: 'Parcelado na obra + banco', pronto: 'À vista ou financiamento' },
                    { criterio: 'Juros durante a obra', planta: 'Apenas INCC (inflação)', pronto: 'Não se aplica' },
                    { criterio: 'Personalização', planta: 'Possível em alguns casos', pronto: 'Limitada / reforma' },
                    { criterio: 'Prazo', planta: '2-5 anos até a entrega', pronto: 'Imediato' },
                  ].map((row, i) => (
                    <tr key={row.criterio} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                      <td style={{ padding: '14px clamp(16px,3vw,32px)', fontSize: 13, fontWeight: 600, color: 'rgba(245,248,250,0.85)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {row.criterio}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: 13, color: 'var(--gold-soft)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {row.planta}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: 13, color: 'rgba(245,248,250,0.55)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {row.pronto}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Tabela de Interesse ──────────────────────────────── */}
      <section id="tabela-interesse" style={{ padding: 'clamp(50px,7vw,90px) 0' }}>
        <div style={{ width: 'min(960px,92vw)', margin: '0 auto' }}>
          <TabelaInteresse />
        </div>
      </section>

    </main>
  )
}
