'use client'
import { useState, useRef } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import { createClient } from '@/lib/supabase/client'

const fmtC = (n: number) => 'R$ ' + new Intl.NumberFormat('pt-BR').format(n)

function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
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

const MODALIDADES = [
  {
    id: 'judicial', badge: 'Validade judicial', nome: 'Laudo Judicial',
    uso: 'Inventários, divórcio, desapropriação e ações judiciais.',
    executor: 'Perito judicial nomeado (CNAI)', prazo: '30–60 dias úteis', valor: 'Valor a consultar', destaque: false,
    quandoUsar: ['Inventário e partilha de bens', 'Processo de divórcio com disputa', 'Desapropriação pelo poder público', 'Ação judicial que exige laudo oficial', 'Perícia técnica determinada pelo juiz'],
    cta: 'Solicitar laudo judicial',
    svgPath: 'M12 3l9 4.5v5c0 4.5-3.5 8.7-9 10-5.5-1.3-9-5.5-9-10V7.5L12 3z',
  },
  {
    id: 'extrajudicial', badge: 'Mais solicitado', nome: 'Laudo Extrajudicial (PTAM)',
    uso: 'Compra/venda, garantia bancária, financiamento, seguro e herança amigável.',
    executor: 'Engenheiro avaliador credenciado CNAI', prazo: '7–15 dias úteis', valor: 'Valor a consultar', destaque: true,
    quandoUsar: ['Compra ou venda de imóvel', 'Garantia para financiamento bancário', 'Seguro de imóvel (ajuste de valor segurado)', 'Partilha amigável em herança', 'Atualização de valor patrimonial'],
    cta: 'Solicitar PTAM',
    svgPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    id: 'ia', badge: 'Grátis clientes VN', nome: 'Estimativa IA',
    uso: 'Referência rápida pré-negociação e check de mercado.',
    executor: 'Algoritmo VN Prime (comparativos BH/MG)', prazo: 'Instantânea', valor: 'Grátis para clientes VN Prime', destaque: false,
    quandoUsar: ['Verificar se o preço pedido é justo', 'Orientação antes de fazer proposta', 'Comparativo rápido com o mercado de BH/MG', 'Clientes VN Prime em pré-negociação'],
    cta: 'Estimar agora',
    svgPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
]

function openConsultor() {
  window.dispatchEvent(new CustomEvent('vnprime:consultor'))
}

export default function AvaliacaoPage() {
  const estimSectionRef = useRef<HTMLDivElement>(null)
  const [showEstimForm, setShowEstimForm] = useState(false)
  const [estimForm, setEstimForm] = useState({ bairro: '', tipo: 'Apartamento', area: '', quartos: '2' })
  const [estimLoading, setEstimLoading] = useState(false)
  const [estimResult, setEstimResult] = useState<{ low: number; high: number; mid: number; m2low: number; m2high: number } | null>(null)
  const [marketData, setMarketData] = useState<{ count: number; avgPreco: number; avgM2: number } | null>(null)
  const [userEstimValue, setUserEstimValue] = useState('')
  const laudoSectionRef = useRef<HTMLDivElement>(null)
  const [laudoForm, setLaudoForm] = useState({ nome: '', email: '', telefone: '', bairro: '', tipo: 'Apartamento', finalidade: 'Compra ou Venda', modalidade: 'Laudo PTAM (Extrajudicial)' })
  const [laudoLoading, setLaudoLoading] = useState(false)
  const [laudoEnviado, setLaudoEnviado] = useState(false)

  function scrollToLaudo() {
    laudoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToEstimativa() {
    setShowEstimForm(true)
    setTimeout(() => {
      estimSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  function runEstimativa() {
    if (!estimForm.area) return
    setEstimLoading(true)
    setEstimResult(null)
    setMarketData(null)
    setUserEstimValue('')
    setTimeout(() => {
      const area = parseFloat(estimForm.area) || 80
      const quartos = parseInt(estimForm.quartos) || 2
      const baseM2 = estimForm.tipo === 'Casa' ? 6200 : estimForm.tipo === 'Comercial' ? 5800 : 7400
      const bLow = estimForm.bairro.toLowerCase()
      const bairroMult =
        (bLow.includes('belvedere') || bLow.includes('vale dos')) ? 1.45 :
        (bLow.includes('lourdes') || bLow.includes('sao pedro') || bLow.includes('são pedro')) ? 1.30 :
        (bLow.includes('savassi') || bLow.includes('funcionarios') || bLow.includes('funcionários')) ? 1.25 :
        (bLow.includes('nova lima') || bLow.includes('vila da serra')) ? 1.35 :
        (bLow.includes('pampulha') || bLow.includes('castelo')) ? 1.10 : 1.0
      const quartosMult = quartos >= 4 ? 1.12 : quartos === 3 ? 1.06 : 1.0
      const mBase = baseM2 * bairroMult * quartosMult
      const low = Math.round(area * mBase * 0.92 / 5000) * 5000
      const high = Math.round(area * mBase * 1.08 / 5000) * 5000
      const mid = Math.round((low + high) / 2 / 1000) * 1000
      setEstimResult({ low, high, mid, m2low: Math.round(mBase * 0.92), m2high: Math.round(mBase * 1.08) })
      setEstimLoading(false)
      if (estimForm.bairro.trim().length >= 3) {
        const sb = createClient()
        sb.from('imoveis')
          .select('preco, area_m2')
          .eq('status', 'ativo')
          .ilike('bairro', `%${estimForm.bairro.trim()}%`)
          .then(({ data }) => {
            if (!data) return
            const valid = data.filter(i => i.preco > 0 && i.area_m2 > 0)
            if (valid.length === 0) return
            const avgPreco = Math.round(valid.reduce((s, i) => s + i.preco, 0) / valid.length)
            const avgM2 = Math.round(valid.reduce((s, i) => s + (i.preco / i.area_m2), 0) / valid.length)
            setMarketData({ count: valid.length, avgPreco, avgM2 })
          })
      }
    }, 2200)
  }

  const IS: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 9,
    border: '1.5px solid var(--border)', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', background: '#fff',
  }

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* Hero */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(180deg, rgba(15,22,32,0.70) 0%, rgba(15,22,32,0.94) 100%), url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1900&q=85)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        color: '#fff', padding: 'clamp(80px,12vw,140px) 0 clamp(60px,9vw,100px)',
      }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto', maxWidth: 720 }}>
          <Eyebrow>Avaliação de Imóveis</Eyebrow>
          <h1 style={{ color: '#fff', margin: '12px 0 18px', fontSize: 'clamp(2.4rem,5vw,3.6rem)', lineHeight: 1.05 }}>
            Saiba o valor real do seu{' '}
            <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>imóvel.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.88)', maxWidth: 560, marginBottom: 28 }}>
            Três modalidades para cada situação — laudo judicial, extrajudicial ou estimativa instantânea com IA.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn variant="accent" size="lg" onClick={scrollToLaudo}>Solicitar laudo</Btn>
            <Btn variant="ghost-light" size="lg" onClick={scrollToEstimativa}>Estimar agora</Btn>
          </div>
        </div>
      </section>

      {/* Cards 3 modalidades */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 52px' }}>
            <Eyebrow color="var(--gold-deep)">3 modalidades</Eyebrow>
            <h2 style={{ margin: '8px 0 12px' }}>Escolha o laudo certo para cada situação</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15.5 }}>
              De uma estimativa instantânea até um laudo com validade judicial. A VN Prime conecta você ao avaliador adequado.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
            {MODALIDADES.map(m => (
              <div key={m.id} style={{
                background: m.destaque ? 'var(--navy-deep,#0F1824)' : '#fff',
                borderRadius: 20,
                border: m.destaque ? 'none' : '1px solid var(--border)',
                boxShadow: m.destaque ? '0 12px 40px rgba(15,22,32,0.22)' : '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: -1, right: 24,
                  background: m.destaque ? '#D4A857' : 'var(--navy)',
                  color: m.destaque ? '#0F1824' : '#fff',
                  padding: '4px 14px', borderRadius: '0 0 8px 8px',
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {m.badge}
                </div>
                <div style={{ padding: '32px 28px 20px',
                  borderBottom: m.destaque ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: m.destaque ? 'rgba(212,168,87,0.18)' : '#1B2733',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#D4A857" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={m.svgPath} />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: m.destaque ? '#fff' : 'var(--navy)', lineHeight: 1.2 }}>{m.nome}</div>
                      <div style={{ fontSize: 12, color: m.destaque ? 'rgba(255,255,255,0.55)' : 'var(--fg-3)', fontWeight: 500, marginTop: 3 }}>{m.executor}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: m.destaque ? 'rgba(255,255,255,0.72)' : 'var(--fg-2)', margin: 0, lineHeight: 1.65 }}>{m.uso}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, padding: '18px 28px 0', flexWrap: 'wrap' }}>
                  <span style={{ background: m.destaque ? 'rgba(255,255,255,0.08)' : 'var(--cream)',
                    color: m.destaque ? 'rgba(255,255,255,0.75)' : 'var(--navy)',
                    padding: '5px 12px', borderRadius: 99, fontSize: 12.5, fontWeight: 600 }}>
                    {m.prazo}
                  </span>
                  <span style={{ background: m.destaque ? 'rgba(212,168,87,0.15)' : '#D4A85714',
                    color: '#D4A857', border: m.destaque ? 'none' : '1px solid #D4A85730',
                    padding: '5px 12px', borderRadius: 99, fontSize: 12.5, fontWeight: 700 }}>
                    {m.valor}
                  </span>
                </div>
                <div style={{ padding: '18px 28px', flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: m.destaque ? 'rgba(255,255,255,0.35)' : 'var(--fg-3)', marginBottom: 12 }}>
                    Quando usar
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {m.quandoUsar.map(q => (
                      <li key={q} style={{ fontSize: 13.5, display: 'flex', gap: 9, alignItems: 'flex-start',
                        color: m.destaque ? 'rgba(255,255,255,0.82)' : 'var(--fg-1)' }}>
                        <span style={{ color: '#D4A857', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: '16px 28px 28px' }}>
                  <button
                    onClick={m.id === 'ia' ? scrollToEstimativa : scrollToLaudo}
                    style={{
                      width: '100%', padding: '13px 20px', borderRadius: 10, border: 'none',
                      background: m.destaque ? '#D4A857' : 'var(--navy)',
                      color: m.destaque ? '#0F1824' : '#fff',
                      fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >{m.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laudo Request Form */}
      <section ref={laudoSectionRef} style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff', scrollMarginTop: 80 }}>
        <div style={{ width: 'min(720px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow color="var(--gold-deep)">Solicitar Laudo</Eyebrow>
            <h2 style={{ margin: '8px 0 10px' }}>Peça seu laudo agora</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15 }}>
              Um especialista VN Prime entrará em contato em até 2h úteis com prazo e proposta.
            </p>
          </div>
          {laudoEnviado ? (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 18, padding: '44px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 19, fontWeight: 700, color: '#065F46', marginBottom: 8 }}>Solicitação recebida!</div>
              <div style={{ fontSize: 14, color: '#065F46', lineHeight: 1.55, marginBottom: 24 }}>Nossa equipe entrará em contato em até 2h úteis com prazo e proposta personalizada.</div>
              <a href={`https://wa.me/5531984144250?text=${encodeURIComponent(`Olá! Solicitei um laudo de avaliação pelo site. Meu nome é ${laudoForm.nome}.`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>
                Ou fale agora pelo WhatsApp →
              </a>
            </div>
          ) : (
            <form onSubmit={async e => {
              e.preventDefault()
              setLaudoLoading(true)
              const sb = createClient()
              await sb.from('leads').insert({ nome: laudoForm.nome, email: laudoForm.email, telefone: laudoForm.telefone, mensagem: `Laudo: ${laudoForm.modalidade} · ${laudoForm.tipo} em ${laudoForm.bairro} · Finalidade: ${laudoForm.finalidade}`, origem: 'avaliacao' })
              setLaudoEnviado(true)
              setLaudoLoading(false)
            }}
              style={{ background: 'var(--cream)', borderRadius: 18, padding: 'clamp(28px,4vw,44px)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
                {([
                  { label: 'Nome completo', key: 'nome', type: 'text', ph: 'Seu nome' },
                  { label: 'E-mail', key: 'email', type: 'email', ph: 'seu@email.com' },
                  { label: 'WhatsApp', key: 'telefone', type: 'tel', ph: '(31) 99999-9999' },
                  { label: 'Bairro / Cidade', key: 'bairro', type: 'text', ph: 'Ex.: Savassi, BH' },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} required value={laudoForm[f.key]}
                      onChange={e => setLaudoForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={IS} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>Tipo do imóvel</label>
                  <select value={laudoForm.tipo} onChange={e => setLaudoForm(p => ({ ...p, tipo: e.target.value }))} style={IS}>
                    {['Apartamento','Casa','Cobertura','Sala Comercial','Terreno','Loteamento'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>Finalidade</label>
                  <select value={laudoForm.finalidade} onChange={e => setLaudoForm(p => ({ ...p, finalidade: e.target.value }))} style={IS}>
                    {['Compra ou Venda','Inventário / Herança','Financiamento / Garantia','Processo Judicial','Outro'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>Modalidade desejada</label>
                  <select value={laudoForm.modalidade} onChange={e => setLaudoForm(p => ({ ...p, modalidade: e.target.value }))} style={IS}>
                    {['Laudo PTAM (Extrajudicial)','Laudo Judicial','Não sei — quero indicação'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={laudoLoading}
                style={{ padding: '14px 0', borderRadius: 10, border: 'none', background: 'var(--navy)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: laudoLoading ? 0.7 : 1 }}>
                {laudoLoading ? 'Enviando…' : 'Solicitar laudo — sem compromisso'}
              </button>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', textAlign: 'center' }}>Resposta em até 2h úteis · Dados protegidos · Sem compromisso</div>
            </form>
          )}
        </div>
      </section>

      {/* Estimativa IA — Interactive Section */}
      {showEstimForm && (
        <section ref={estimSectionRef} style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff', scrollMarginTop: 80 }}>
          <div style={{ width: 'min(800px,92vw)', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <Eyebrow color="var(--gold-deep)">Estimativa IA · Gratuita</Eyebrow>
              <h2 style={{ margin: '8px 0 10px' }}>Qual o valor do seu imóvel?</h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 15 }}>
                Estimativa baseada em comparativos de mercado em BH e região. Referência pré-negociação — não substitui laudo técnico.
              </p>
            </div>

            {!estimResult && !estimLoading && (
              <div style={{ background: 'var(--cream)', borderRadius: 18, padding: 'clamp(28px,4vw,44px)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>Bairro / Cidade</label>
                    <input type="text" placeholder="Ex.: Savassi, Nova Lima..."
                      value={estimForm.bairro}
                      onChange={e => setEstimForm(f => ({ ...f, bairro: e.target.value }))}
                      style={IS} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>Tipo</label>
                    <select value={estimForm.tipo}
                      onChange={e => setEstimForm(f => ({ ...f, tipo: e.target.value }))}
                      style={IS}>
                      <option>Apartamento</option>
                      <option>Casa</option>
                      <option>Comercial</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>Área privativa (m²)</label>
                    <input type="number" placeholder="Ex.: 90"
                      value={estimForm.area}
                      onChange={e => setEstimForm(f => ({ ...f, area: e.target.value }))}
                      style={IS} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>Quartos</label>
                    <select value={estimForm.quartos}
                      onChange={e => setEstimForm(f => ({ ...f, quartos: e.target.value }))}
                      style={IS}>
                      {['1','2','3','4','5+'].map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 22, textAlign: 'center' }}>
                  <button onClick={runEstimativa} disabled={!estimForm.area}
                    style={{ padding: '13px 36px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700,
                      background: estimForm.area ? 'var(--navy)' : '#ccc',
                      color: '#fff', cursor: estimForm.area ? 'pointer' : 'not-allowed',
                      transition: 'opacity 0.15s', fontFamily: 'inherit' }}>
                    Calcular estimativa
                  </button>
                </div>
              </div>
            )}

            {estimLoading && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: '4px solid var(--border)',
                  borderTopColor: 'var(--gold)', margin: '0 auto 20px',
                  animation: 'spin 0.9s linear infinite' }} />
                <p style={{ color: 'var(--fg-2)', fontSize: 15 }}>Analisando comparativos de mercado em BH/MG…</p>
              </div>
            )}

            {estimResult && (
              <div>
                <div style={{ background: 'var(--navy-deep,#0F1824)', borderRadius: 18, padding: 'clamp(28px,4vw,44px)', color: '#fff', marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                        Estimativa de mercado VN Prime
                      </div>
                      <div style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, color: '#D4A857', lineHeight: 1 }}>
                        {fmtC(estimResult.low)} — {fmtC(estimResult.high)}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>
                        Intervalo médio: {fmtC(estimResult.mid)} · {fmtC(estimResult.m2low)}–{fmtC(estimResult.m2high)}/m²
                      </div>
                    </div>
                    <button onClick={() => { setEstimResult(null); setMarketData(null); setUserEstimValue('') }}
                      style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
                        background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit' }}>
                      Nova busca
                    </button>
                  </div>

                  <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>
                      Referências de mercado — compare também em
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {[
                        { label: 'FipeZap', url: 'https://fipezap.zapimoveis.com.br' },
                        { label: 'ZAP Imóveis', url: 'https://www.zapimoveis.com.br' },
                        { label: 'Viva Real', url: 'https://www.vivareal.com.br' },
                        { label: 'OLX Imóveis', url: 'https://www.olx.com.br/imoveis' },
                      ].map(b => (
                        <a key={b.label} href={b.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                            borderRadius: 8, background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)',
                            fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,168,87,0.18)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                          {b.label}
                        </a>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 12 }}>
                      Estimativa baseada em comparativos internos. Para validade jurídica, solicite um Laudo PTAM.
                    </div>
                  </div>
                </div>

                {marketData && (
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 16, padding: 'clamp(20px,3vw,32px)', marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563EB', marginBottom: 16 }}>
                      Mercado real — {estimForm.bairro}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 16, marginBottom: 14 }}>
                      {[
                        { label: 'Imóveis ativos', value: String(marketData.count) },
                        { label: 'Preço médio de lista', value: fmtC(marketData.avgPreco) },
                        { label: 'Média por m²', value: `${fmtC(marketData.avgM2)}/m²` },
                      ].map(s => (
                        <div key={s.label}>
                          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4, fontWeight: 500 }}>{s.label}</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#1E3A5F' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                    {(() => {
                      if (!estimResult) return null
                      const estMidM2 = Math.round((estimResult.m2low + estimResult.m2high) / 2)
                      const diff = marketData.avgM2 - estMidM2
                      const pct = Math.round((diff / estMidM2) * 100)
                      if (Math.abs(pct) < 5) return (
                        <div style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>
                          ✓ Estimativa alinhada com o mercado real do bairro
                        </div>
                      )
                      return (
                        <div style={{ fontSize: 13, color: pct > 0 ? '#B45309' : '#1D4ED8', fontWeight: 600 }}>
                          {pct > 0
                            ? `Mercado real ${pct}% acima da estimativa — imóveis mais valorizados que a média regional`
                            : `Mercado real ${Math.abs(pct)}% abaixo da estimativa — tipologia mais econômica que a média regional`}
                        </div>
                      )
                    })()}
                    <div style={{ marginTop: 10, fontSize: 11.5, color: '#94A3B8' }}>
                      {marketData.count} imóvel{marketData.count !== 1 ? 's' : ''} ativo{marketData.count !== 1 ? 's' : ''} VN Prime no bairro · Dados ao vivo
                    </div>
                  </div>
                )}

                <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(24px,3vw,36px)' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A857" strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--navy)', marginBottom: 4 }}>Na sua opinião, quanto vale?</div>
                      <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.55 }}>
                        O preço de pedida é diferente do valor de mercado. Qual o valor que você acha justo para este imóvel?
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input type="text" placeholder="Ex.: R$ 680.000"
                      value={userEstimValue}
                      onChange={e => setUserEstimValue(e.target.value)}
                      style={{ flex: '1 1 200px', padding: '11px 16px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 15, fontWeight: 600, outline: 'none', background: '#fff' }} />
                    {(() => {
                      const raw = userEstimValue.replace(/\D/g, '')
                      const uVal = parseInt(raw, 10)
                      if (!uVal || uVal < 10000 || !estimResult) return null
                      const diff = uVal - estimResult.mid
                      const pct = Math.round((diff / estimResult.mid) * 100)
                      const above = diff > 0
                      const within = Math.abs(pct) <= 8
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 10,
                          background: within ? '#D4A85718' : above ? '#FFF3CD' : '#E3F0FF',
                          border: `1.5px solid ${within ? '#D4A857' : above ? '#F0C040' : '#90B8D8'}`,
                          fontSize: 13, fontWeight: 700,
                          color: within ? '#8B6914' : above ? '#7A5C00' : '#1a5276' }}>
                          {within ? '✓ Dentro da faixa de mercado' : above ? `↑ ${pct}% acima da estimativa` : `↓ ${Math.abs(pct)}% abaixo da estimativa`}
                        </div>
                      )
                    })()}
                  </div>
                  <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a href="https://wa.me/5531984144250" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><Btn variant="primary">Discutir com consultor</Btn></a>
                    <Btn variant="ghost" onClick={() => window.open('https://fipezap.zapimoveis.com.br', '_blank')}>Ver FipeZap</Btn>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ padding: 'clamp(3rem,5vw,5rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(820px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow color="var(--gold-deep)">Dúvidas frequentes</Eyebrow>
            <h2 style={{ margin: '8px 0 0' }}>Avaliação — perguntas e respostas</h2>
          </div>
          <FaqAccordion items={[
            { q: 'O que é a Estimativa IA da VN Prime?', a: 'Nossa ferramenta analisa imóveis similares cadastrados na VN Prime e na região para sugerir uma faixa de valor de mercado. É uma estimativa indicativa — não substitui o laudo ABNT.' },
            { q: 'Para que serve o Laudo de Avaliação ABNT?', a: 'O laudo formal é exigido por bancos para aprovação de financiamento, por cartórios em inventários e em disputas judiciais. Emitido por engenheiro ou arquiteto com habilitação CNAI.' },
            { q: 'Em quanto tempo recebo o laudo?', a: 'Após visita técnica, o laudo completo é entregue em até 5 dias úteis. Para urgências, consulte disponibilidade de prazo reduzido.' },
            { q: 'Qual a diferença entre avaliação e Due Diligence?', a: 'A avaliação determina o valor de mercado do imóvel. A Due Diligence investiga a situação jurídica e documental — débitos, ônus, área real, conformidade legal. São serviços complementares.' },
            { q: 'A estimativa é gratuita?', a: 'Sim. A Estimativa IA está disponível para todos os visitantes. O Laudo ABNT é um serviço pago realizado por profissional habilitado.' },
          ]} />
        </div>
      </section>

      {/* Valorize antes de vender */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
            <Eyebrow color="var(--gold-deep)">Dicas de valorização</Eyebrow>
            <h2 style={{ margin: '8px 0 10px' }}>Pequenas melhorias que aumentam o valor</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15 }}>Imóveis bem preparados vendem mais rápido e por preços até 15% maiores. Veja o que faz diferença.</p>
          </div>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            {[
              { icon: '🎨', titulo: 'Pintura e acabamento', impacto: '+3–6%', desc: 'Pintura neutra nova elimina marcas e odores. Pequenos reparos em rejuntes, rodapés e tomadas passam sensação de cuidado.' },
              { icon: '💡', titulo: 'Iluminação', impacto: '+2–4%', desc: 'Lâmpadas de LED quente em pontos estratégicos ampliam visualmente o espaço e valorizam ambientes na visita e nas fotos.' },
              { icon: '🌿', titulo: 'Home staging', impacto: '+5–10%', desc: 'Imóveis decorados com poucos móveis e plantas fotografam 3× melhor. Desapego de objetos pessoais é o primeiro passo.' },
              { icon: '📸', titulo: 'Fotografia profissional', impacto: '+12–20% vistas', desc: 'Anúncios com fotos profissionais recebem até 3× mais cliques. Na VN Prime, a fotografia já está incluída nos planos Assistida e Completa.' },
              { icon: '🏗️', titulo: 'Regularização de área', impacto: 'Segurança jurídica', desc: 'Imóveis com matrícula atualizada e área averbada conforme o real transmitem confiança e facilitam aprovação de financiamento.' },
              { icon: '🧹', titulo: 'Limpeza e organização', impacto: 'Percepção imediata', desc: 'Banheiros impecáveis, janelas limpas e armários organizados. A primeira impressão em visita define se o comprador quer voltar.' },
            ].map(d => (
              <div key={d.titulo} style={{ background: 'var(--cream)', borderRadius: 14, padding: '22px 22px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{d.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{d.titulo}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--gold)', color: 'var(--navy-deep)', padding: '2px 9px', borderRadius: 99, flexShrink: 0, marginLeft: 8 }}>{d.impacto}</span>
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--fg-1)', margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: 'clamp(50px,7vw,90px) 0', background: '#fff' }}>
        <div style={{ width: 'min(900px,92vw)', margin: '0 auto',
          background: 'var(--gradient-navy-hero)', color: '#fff',
          padding: 'clamp(36px,5vw,56px)', borderRadius: 'var(--radius-xl)',
          textAlign: 'center', boxShadow: 'var(--shadow-soft)' }}>
          <Eyebrow>Avaliação VN Prime</Eyebrow>
          <h2 style={{ color: '#fff', margin: '14px 0 12px', fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', fontWeight: 800 }}>
            Não arrisque comprar ou vender pelo preço errado.
          </h2>
          <p style={{ color: 'rgba(245,248,250,0.85)', fontSize: 16, maxWidth: 520, margin: '0 auto 28px' }}>
            Um laudo profissional protege sua negociação, facilita financiamentos e dá segurança jurídica à transação.
          </p>
          <a href="https://wa.me/5531984144250" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><Btn variant="accent" size="lg">Falar com consultor</Btn></a>
          <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            Clientes VN Prime têm acesso gratuito à Estimativa IA
          </div>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
