'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ─── Dados ───────────────────────────────────────────────────────────────────

type Status = 'Breve lançamento' | 'Em construção' | 'Pronto para morar'

interface Lancamento {
  id: string
  nome: string
  bairro: string
  cidade: string
  tipo: string
  status: Status
  suites: string
  area: string
  vagas: string
  precoFrom: string
  entrega: string
  tag?: string
  img: string
  imgSecundaria: string
  destaque?: boolean
}

const LANCAMENTOS: Lancamento[] = [
  {
    id: 'madison-square',
    nome: 'Madison Square',
    bairro: 'Vila Castela',
    cidade: 'Nova Lima',
    tipo: 'Apartamento',
    status: 'Em construção',
    suites: '1 e 2 suítes',
    area: '49 – 82 m²',
    vagas: '1 a 2',
    precoFrom: 'R$ 490 mil',
    entrega: 'Entrega 2027',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85',
    imgSecundaria: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=85',
    destaque: true,
  },
  {
    id: 'reserva-belvedere',
    nome: 'Reserva Belvedere',
    bairro: 'Belvedere',
    cidade: 'Belo Horizonte',
    tipo: 'Cobertura',
    status: 'Breve lançamento',
    suites: '3 e 4 suítes',
    area: '180 – 320 m²',
    vagas: '3 a 4',
    precoFrom: 'R$ 3,2 mi',
    entrega: 'Entrega 2028',
    tag: 'Exclusivo',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85',
    imgSecundaria: 'https://images.unsplash.com/photo-1560185127-6a8d51938e01?w=900&q=85',
  },
  {
    id: 'serra-verde',
    nome: 'Residencial Serra Verde',
    bairro: 'Vila da Serra',
    cidade: 'Nova Lima',
    tipo: 'Apartamento',
    status: 'Em construção',
    suites: '2 e 3 suítes',
    area: '78 – 142 m²',
    vagas: '2',
    precoFrom: 'R$ 1,2 mi',
    entrega: 'Entrega 2029',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85',
    imgSecundaria: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=900&q=85',
  },
  {
    id: 'vila-nova-savassi',
    nome: 'Vila Nova Savassi',
    bairro: 'Savassi',
    cidade: 'Belo Horizonte',
    tipo: 'Apartamento',
    status: 'Pronto para morar',
    suites: '1 suíte',
    area: '42 – 65 m²',
    vagas: '1',
    precoFrom: 'R$ 680 mil',
    entrega: 'Pronto',
    tag: 'Últimas unidades',
    img: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=900&q=85',
    imgSecundaria: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=85',
  },
  {
    id: 'alto-do-mangabeiras',
    nome: 'Alto do Mangabeiras',
    bairro: 'Mangabeiras',
    cidade: 'Belo Horizonte',
    tipo: 'Casa',
    status: 'Breve lançamento',
    suites: '4 suítes',
    area: '380 – 520 m²',
    vagas: '4',
    precoFrom: 'R$ 4,8 mi',
    entrega: 'Entrega 2028',
    tag: 'Pré-lançamento',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85',
    imgSecundaria: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&q=85',
  },
  {
    id: 'parkview-barreiro',
    nome: 'Parkview Barreiro',
    bairro: 'Barreiro',
    cidade: 'Belo Horizonte',
    tipo: 'Apartamento',
    status: 'Em construção',
    suites: '2 suítes',
    area: '58 – 74 m²',
    vagas: '1 a 2',
    precoFrom: 'R$ 420 mil',
    entrega: 'Entrega 2026',
    img: 'https://images.unsplash.com/photo-1582268611958-ebfd161df9d8?w=900&q=85',
    imgSecundaria: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85',
  },
]

const STATUS_CONFIG: Record<Status, { bg: string; color: string; dot: string }> = {
  'Breve lançamento': { bg: 'rgba(99,102,241,0.12)', color: '#4338CA', dot: '#6366F1' },
  'Em construção':    { bg: 'rgba(212,168,87,0.14)', color: '#92650A', dot: '#D4A857' },
  'Pronto para morar':{ bg: 'rgba(16,185,129,0.12)', color: '#065F46', dot: '#10B981' },
}

const FILTROS_STATUS: (Status | 'Todos')[] = ['Todos', 'Breve lançamento', 'Em construção', 'Pronto para morar']
const FILTROS_TIPO = ['Todos', 'Apartamento', 'Cobertura', 'Casa']

// ─── Animações ────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.52, delay: i * 0.08, ease: EASE },
  }),
}

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
  exit:    { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.28 } },
}

function parsePreco(s: string): number {
  const n = parseFloat(s.replace('R$', '').replace(/\s/g, '').replace(',', '.').replace(/[^0-9.]/g, ''))
  if (s.toLowerCase().includes(' mi')) return n * 1_000_000
  if (s.toLowerCase().includes('mil')) return n * 1_000
  return n
}

function installment(precoFrom: string): number {
  const v = parsePreco(precoFrom)
  if (!v) return 0
  const fin = v * 0.8
  const taxa = 0.0089
  const prazo = 360
  const fator = (taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1)
  return Math.round(fin * fator)
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function LancamentoCard({ item, index }: { item: Lancamento; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [showNotify, setShowNotify] = useState(false)
  const [notifyForm, setNotifyForm] = useState({ nome: '', contato: '' })
  const [notifySent, setNotifySent] = useState(false)
  const st = STATUS_CONFIG[item.status]

  const sendNotify = async () => {
    if (!notifyForm.nome || !notifyForm.contato) return
    const sb = createClient()
    await sb.from('leads').insert({
      tipo: 'notificacao_lancamento',
      nome: notifyForm.nome,
      contato: notifyForm.contato,
      mensagem: `Notificar quando abrir: ${item.nome} (${item.bairro}, ${item.cidade})`,
      origem: 'lancamentos',
    })
    setNotifySent(true)
  }

  return (
    <motion.div
      layout
      key={item.id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        border: `1.5px solid ${hovered ? '#D4A857' : '#E5E7EB'}`,
        boxShadow: hovered
          ? '0 20px 48px rgba(27,39,51,0.14)'
          : '0 2px 12px rgba(27,39,51,0.06)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Imagem */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/2', flexShrink: 0 }}>
        <motion.img
          src={item.img}
          alt={item.nome}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(15,24,36,0.65) 0%, transparent 55%)',
            display: 'flex', alignItems: 'flex-end', padding: 20,
          }}
        >
          <span style={{
            color: '#fff', fontSize: 13, fontWeight: 600,
            borderBottom: '1.5px solid #D4A857', paddingBottom: 2,
            letterSpacing: '0.04em',
          }}>
            Ver empreendimento →
          </span>
        </motion.div>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            background: st.bg, color: st.color,
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '5px 10px', borderRadius: 4,
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
            {item.status}
          </span>
          {item.tag && (
            <span style={{
              background: 'rgba(15,24,36,0.78)', color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '5px 10px', borderRadius: 4, backdropFilter: 'blur(8px)',
            }}>
              {item.tag}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
          {item.bairro} · {item.cidade}
        </div>
        <h3 style={{
          fontSize: 20, fontWeight: 800, color: '#0F1824',
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          margin: '0 0 14px', lineHeight: 1.15,
        }}>
          {item.nome}
        </h3>

        {/* Specs */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          {[
            { label: item.suites, sub: 'Suítes' },
            { label: item.area, sub: 'Área' },
            { label: `${item.vagas} vaga${item.vagas !== '1' ? 's' : ''}`, sub: 'Garagem' },
          ].map(s => (
            <div key={s.sub} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1B2733' }}>{s.label}</span>
              <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.sub}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>A partir de</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#D4A857', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{item.precoFrom}</div>
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{item.entrega}</div>
          </div>
          {(() => {
            const inst = installment(item.precoFrom)
            if (!inst) return null
            const fmtInst = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(inst)
            return (
              <div style={{ background: 'rgba(15,24,36,0.04)', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6B7280' }}>Parcela est. (80% · PRICE 8,9% · 360m)</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2733' }}>~{fmtInst}/mês</span>
              </div>
            )
          })()}
        </div>

        {/* Notificar-me */}
        {notifySent ? (
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 10, fontSize: 13, color: '#065F46', textAlign: 'center', fontWeight: 600 }}>
            ✓ Avisaremos quando abrir!
          </div>
        ) : !showNotify ? (
          <button
            onClick={e => { e.stopPropagation(); setShowNotify(true) }}
            style={{ marginTop: 14, width: '100%', padding: '10px', border: '1.5px solid #D4A857', borderRadius: 10, background: 'transparent', color: '#92650A', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            🔔 Me avise quando abrir
          </button>
        ) : (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }} onClick={e => e.stopPropagation()}>
            <input
              type="text" placeholder="Seu nome"
              value={notifyForm.nome}
              onChange={e => setNotifyForm(f => ({ ...f, nome: e.target.value }))}
              style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <input
              type="text" placeholder="WhatsApp ou e-mail"
              value={notifyForm.contato}
              onChange={e => setNotifyForm(f => ({ ...f, contato: e.target.value }))}
              style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={sendNotify} disabled={!notifyForm.nome || !notifyForm.contato} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: '#0F1824', color: '#D4A857', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Confirmar
              </button>
              <button onClick={() => setShowNotify(false)} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#9CA3AF', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Seção animada ────────────────────────────────────────────────────────────

function AnimatedSection({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={style}>
      {children}
    </motion.div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

const fmtBRL = (n: number) => n >= 1_000_000
  ? `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')} mi`
  : `R$ ${(n / 1_000).toFixed(0)} mil`

export default function LancamentosPage() {
  const [filtroStatus, setFiltroStatus] = useState<Status | 'Todos'>('Todos')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [livePortfolio, setLivePortfolio] = useState<any[]>([])

  useEffect(() => {
    const sb = createClient()
    sb.from('imoveis')
      .select('id, titulo, tipo, bairro, cidade, preco, area_m2, quartos, fotos')
      .eq('status', 'ativo')
      .order('destaque', { ascending: false })
      .order('criado_em', { ascending: false })
      .limit(4)
      .then(({ data }) => setLivePortfolio(data ?? []))
  }, [])

  const filtrados = LANCAMENTOS.filter(l => {
    const okStatus = filtroStatus === 'Todos' || l.status === filtroStatus
    const okTipo = filtroTipo === 'Todos' || l.tipo === filtroTipo
    return okStatus && okTipo
  })

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        background: '#0F1824',
        padding: 'clamp(64px,10vw,112px) 0 clamp(48px,7vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #D4A857 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,87,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', position: 'relative' }}>
          <AnimatedSection>
            <motion.div variants={fadeUp} custom={0}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(212,168,87,0.35)', borderRadius: 4, padding: '5px 14px', marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A857', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4A857' }}>Portfólio VN Prime</span>
              </div>
            </motion.div>
            <motion.h1
              variants={fadeUp} custom={1}
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(2.8rem,5.5vw,4.8rem)',
                fontWeight: 700, color: '#fff', lineHeight: 1.06,
                margin: '0 0 20px', maxWidth: '14ch',
              }}
            >
              Lançamentos<br />
              <em style={{ color: '#D4A857', fontStyle: 'italic' }}>selecionados.</em>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} style={{ fontSize: 17, color: 'rgba(245,248,250,0.65)', maxWidth: 480, lineHeight: 1.75 }}>
              Empreendimentos de alto padrão em Belo Horizonte e Nova Lima — da planta à entrega, com curadoria VN Prime.
            </motion.p>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection style={{ marginTop: 52 }}>
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {[
                ['6', 'Empreendimentos'],
                ['Nova Lima & BH', 'Localização'],
                ['R$ 420 mil – R$ 4,8 mi', 'Faixa de preço'],
              ].map(([v, l], i) => (
                <motion.div key={l} variants={fadeUp} custom={i + 3}>
                  <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 700, color: '#D4A857', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5 }}>{l}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Filtros ───────────────────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: 'var(--header-h)', zIndex: 40, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', padding: '16px 0', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Status */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTROS_STATUS.map(f => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFiltroStatus(f as any)}
                style={{
                  padding: '7px 16px', borderRadius: 6, border: `1.5px solid ${filtroStatus === f ? '#0F1824' : '#E5E7EB'}`,
                  background: filtroStatus === f ? '#0F1824' : '#fff',
                  color: filtroStatus === f ? '#fff' : '#6B7280',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.18s',
                }}
              >
                {f}
              </motion.button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: '#E5E7EB', flexShrink: 0 }} className="divider-desktop" />

          {/* Tipo */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTROS_TIPO.map(f => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFiltroTipo(f)}
                style={{
                  padding: '7px 16px', borderRadius: 6, border: `1.5px solid ${filtroTipo === f ? '#D4A857' : '#E5E7EB'}`,
                  background: filtroTipo === f ? '#D4A857' : '#fff',
                  color: filtroTipo === f ? '#0F1824' : '#6B7280',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.18s',
                }}
              >
                {f}
              </motion.button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>
            {filtrados.length} empreendimento{filtrados.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── ROI Strip ────────────────────────────────────────────────── */}
      <div style={{ background: 'rgba(212,168,87,0.08)', borderBottom: '1px solid rgba(212,168,87,0.2)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', padding: '12px 0', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Valorização média BH (5 anos)', value: '+47%' },
            { label: 'Ganho planta → pronto', value: '20–35%' },
            { label: 'Aluguel yield estimado', value: '4–6% a.a.' },
            { label: 'Tempo médio de valorização', value: '36 meses' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{label}:</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#92650A' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <section style={{ width: 'min(1200px,92vw)', margin: '0 auto', padding: 'clamp(48px,6vw,80px) 0' }}>
        <AnimatePresence mode="popLayout">
          {filtrados.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '80px 0', color: '#9CA3AF' }}
            >
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>—</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Nenhum empreendimento nesta combinação de filtros.</div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,360px),1fr))',
                gap: 28,
              }}
            >
              {filtrados.map((item, i) => (
                <LancamentoCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Portfólio disponível agora ───────────────────────────────── */}
      {livePortfolio.length > 0 && (
        <section style={{ background: '#F5F8FA', borderTop: '1px solid #E5E7EB', padding: 'clamp(48px,7vw,72px) 0' }}>
          <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'inline-block', boxShadow: '0 0 6px #34D399' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#059669' }}>Disponível agora</span>
                </div>
                <h2 style={{ margin: 0, fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0F1824' }}>
                  Do nosso portfólio pronto
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6B7280' }}>Imóveis disponíveis para visita e entrega imediata.</p>
              </div>
              <Link href="/busca" style={{ fontSize: 13, fontWeight: 700, color: '#0F1824', textDecoration: 'none', borderBottom: '1.5px solid #D4A857', paddingBottom: 2, whiteSpace: 'nowrap' }}>
                Ver portfólio completo →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 20 }}>
              {livePortfolio.map(im => (
                <Link key={im.id} href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #E5E7EB', boxShadow: '0 2px 12px rgba(27,39,51,0.06)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D4A857'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(27,39,51,0.13)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(27,39,51,0.06)' }}>
                    <div style={{ height: 170, background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : '#F3F4F6', position: 'relative' }}>
                      {im.tipo && (
                        <span style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(15,24,36,0.82)', color: '#D4A857', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                          {im.tipo}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '16px 18px 18px' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 800, color: '#D4A857', marginBottom: 4 }}>{im.preco ? fmtBRL(im.preco) : '—'}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F1824', marginBottom: 3, lineHeight: 1.3 }}>{im.titulo}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{im.bairro}{im.cidade && im.bairro ? ', ' : ''}{im.cidade}</div>
                      {(im.area_m2 || im.quartos) && (
                        <div style={{ marginTop: 8, display: 'flex', gap: 12, fontSize: 12, color: '#6B7280' }}>
                          {im.area_m2 && <span>{im.area_m2} m²</span>}
                          {im.quartos && <span>{im.quartos} qto{im.quartos !== 1 ? 's' : ''}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section style={{ background: '#F5F8FA', borderTop: '1px solid #E5E7EB', padding: 'clamp(64px,9vw,96px) 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ width: 'min(720px,92vw)', margin: '0 auto', textAlign: 'center' }}
        >
          <div style={{ width: 40, height: 2, background: '#D4A857', borderRadius: 1, margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.12 }}>
            Não encontrou o que procura?
          </h2>
          <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.75, marginBottom: 36 }}>
            Cadastre seu perfil de comprador e receba em primeira mão quando surgir um empreendimento compatível com você.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.a
              href={`https://wa.me/5531984144250?text=${encodeURIComponent('Olá! Gostaria de saber sobre os lançamentos VN Prime.')}`}
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-block', padding: '14px 32px', borderRadius: 8,
                background: '#0F1824', color: '#fff',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              Falar com especialista
            </motion.a>
            <motion.a
              href="/busca"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-block', padding: '14px 32px', borderRadius: 8,
                border: '1.5px solid #D4A857', color: '#92650A',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                letterSpacing: '0.04em', background: 'transparent',
              }}
            >
              Buscar imóveis prontos
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* WhatsApp fixo */}
      <motion.a
        href={`https://wa.me/5531984144250?text=${encodeURIComponent('Olá! Tenho interesse nos lançamentos VN Prime.')}`}
        target="_blank" rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 52, height: 52, borderRadius: '50%', background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.45)', textDecoration: 'none',
        }}
        aria-label="Falar no WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </main>
  )
}
