'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import { createClient } from '@/lib/supabase/client'

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

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtN = (n: number, d = 1) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n)
const TAX = 0.17
const TAX_FUNDO = 0.03
const PRAZOS = [60, 80, 100, 120, 150, 180, 200, 220, 240]

function SimuladorConsorcio() {
  const [credito, setCredito] = useState(500000)
  const [prazo, setPrazo] = useState(180)
  const [nome, setNome] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [matchImoveis, setMatchImoveis] = useState<any[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const sb = createClient()
      sb.from('imoveis').select('id, titulo, tipo, bairro, preco, fotos')
        .eq('status', 'ativo')
        .gte('preco', Math.round(credito * 0.78))
        .lte('preco', Math.round(credito * 1.22))
        .limit(4)
        .then(({ data }) => setMatchImoveis(data ?? []))
    }, 700)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [credito])

  const totalPagar = credito * (1 + TAX)
  const parcela = totalPagar / prazo
  const economia = credito * 0.35

  const pctFmt = (v: number, max: number) => `${Math.round((v / max) * 100)}%`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('leads').insert({
      nome,
      telefone: tel,
      email,
      mensagem: `Consórcio — Carta: ${fmt(credito)}, Prazo: ${prazo} meses, Parcela: ${fmt(parcela)}`,
      origem: 'consorcio',
    })
    setEnviado(true)
    setLoading(false)
  }

  return (
    <section id="simulador" style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff' }}>
      <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow color="var(--gold-deep)">Simulador</Eyebrow>
          <h2 style={{ margin: '8px 0 10px' }}>Quanto você quer de carta de crédito?</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15 }}>Ajuste os valores e veja sua parcela estimada em tempo real · sem juros bancários</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 32, alignItems: 'start' }}>
          {/* Sliders */}
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>Valor da carta</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>{fmt(credito)}</span>
              </div>
              <div style={{ position: 'relative', height: 6, background: 'var(--border)', borderRadius: 999, margin: '8px 0 6px' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#D4A857,#B8862E)', width: pctFmt(credito - 120000, 2000000 - 120000) }} />
              </div>
              <input type="range" min={120000} max={2000000} step={10000} value={credito}
                onChange={e => setCredito(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4A857', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
                <span>R$ 120k</span><span>R$ 2M</span>
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>Prazo</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{prazo} meses</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PRAZOS.map(p => (
                  <button key={p} onClick={() => setPrazo(p)}
                    style={{
                      padding: '7px 14px', borderRadius: 999, border: '1.5px solid',
                      borderColor: prazo === p ? 'var(--gold)' : 'var(--border)',
                      background: prazo === p ? 'linear-gradient(135deg,#D4A857,#B8862E)' : '#fff',
                      color: prazo === p ? 'var(--navy)' : 'var(--fg-1)',
                      fontWeight: prazo === p ? 700 : 500, fontSize: 12,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>{p}m</button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--cream)', borderRadius: 16, padding: 22, border: '1px solid var(--border)' }}>
              {[
                ['Carta de crédito', fmt(credito)],
                ['Taxa de administração (17%)', fmt(credito * TAX)],
                ['Total a pagar', fmt(totalPagar)],
                ['Economia vs financiamento', `~${fmt(economia)}`],
              ].map(([l, v], i) => (
                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: i === 3 ? 700 : 600, color: i === 3 ? '#059669' : 'var(--navy)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resultado + formulário */}
          <div>
            <div style={{ background: 'var(--gradient-navy-hero)', borderRadius: 20, padding: '28px 26px 22px', color: '#fff', marginBottom: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 6 }}>Parcela estimada</div>
              <div style={{ fontSize: 'clamp(2.6rem,5vw,3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{fmt(parcela)}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>por mês · 0% juros bancários</div>
              <div style={{ marginTop: 20, display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-soft)' }}>{prazo}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>meses</div>
                </div>
                <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-soft)' }}>17%</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>taxa adm.</div>
                </div>
                <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#34D399' }}>0%</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>juros</div>
                </div>
              </div>
            </div>

            {enviado ? (
              <div style={{ background: '#F0FDF4', borderRadius: 16, padding: 28, border: '1px solid #BBF7D0', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 17, marginBottom: 8 }}>Simulação enviada!</div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5, marginBottom: 20 }}>
                  Um especialista VN Prime entrará em contato em até 2h úteis com sua proposta personalizada.
                </div>
                <a href={`https://wa.me/5531984144250?text=${encodeURIComponent(`Olá! Simulei um consórcio de ${fmt(credito)} em ${prazo} meses. Quero saber mais.`)}`}
                  target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                  Ou fale agora pelo <strong style={{ color: '#25D366' }}>WhatsApp</strong>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Receba sua proposta personalizada</div>
                {[
                  { ph: 'Nome completo', val: nome, set: setNome, type: 'text' },
                  { ph: 'WhatsApp', val: tel, set: setTel, type: 'tel' },
                  { ph: 'E-mail', val: email, set: setEmail, type: 'email' },
                ].map(f => (
                  <input key={f.ph} type={f.type} placeholder={f.ph} value={f.val}
                    onChange={e => f.set(e.target.value)} required
                    style={{ padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                ))}
                <Btn variant="accent" size="lg" type="submit" style={{ opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Enviando...' : `Quero esta cota — ${fmt(parcela)}/mês`}
                </Btn>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', textAlign: 'center' }}>
                  Simulação sem compromisso · valores aproximados · sujeito a aprovação
                </div>
              </form>
            )}
          </div>
        </div>

        {matchImoveis.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--fg-3)', marginBottom: 14 }}>
              Imóveis compatíveis com sua carta de crédito
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
              {matchImoveis.map(im => (
                <Link key={im.id} href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', transition: 'box-shadow 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(15,34,68,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                    <div style={{ height: 120, background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : '#1B2733', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>
                        {fmt(im.preco)}
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{im.titulo}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 3 }}>{im.bairro ?? im.tipo}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function SimuladorComparativo() {
  const [valor, setValor] = useState(500000)
  const [entrada, setEntrada] = useState(100000)
  const [prazo, setPrazo] = useState(180)
  const [taxa, setTaxa] = useState(12)
  const [sistema, setSistema] = useState('SAC')

  const financiado = valor - entrada
  const taxaMensal = taxa / 100 / 12

  const amortSAC = financiado / prazo
  const jurosPrimeiraSAC = financiado * taxaMensal
  const parcelaPrimeiraSAC = amortSAC + jurosPrimeiraSAC

  let totalSAC = 0
  let saldo = financiado
  for (let i = 0; i < prazo; i++) {
    totalSAC += amortSAC + saldo * taxaMensal
    saldo -= amortSAC
  }

  const parcelaPrice = taxaMensal > 0
    ? financiado * (taxaMensal * Math.pow(1 + taxaMensal, prazo)) / (Math.pow(1 + taxaMensal, prazo) - 1)
    : financiado / prazo
  const totalPrice = parcelaPrice * prazo

  const totalFin = sistema === 'SAC' ? totalSAC : totalPrice
  const parcelaFin = sistema === 'SAC' ? parcelaPrimeiraSAC : parcelaPrice

  const totalConsorc = valor * (1 + TAX + TAX_FUNDO)
  const parcelaConsorc = totalConsorc / prazo
  const economiaBruta = totalFin - totalConsorc + entrada

  return (
    <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: 'var(--cream)' }}>
      <div style={{ width: 'min(1140px,92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow color="var(--gold-deep)">Comparativo</Eyebrow>
          <h2 style={{ margin: '0 0 10px' }}>Consórcio vs Financiamento</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
            Simule lado a lado e descubra quanto você economiza com o consórcio.
          </p>
        </div>

        {/* Inputs */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '28px 30px', marginBottom: 32, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
          {[
            { label: 'Valor do imóvel', val: valor, set: (v: number) => { setValor(v); if (entrada > v * 0.9) setEntrada(Math.floor(v * 0.2)) }, min: 200000, max: 3000000, step: 10000, fmt: (v: number) => fmt(v), hint: ['R$ 200k', 'R$ 3M'] },
            { label: 'Entrada', val: entrada, set: setEntrada, min: 0, max: Math.floor(valor * 0.8), step: 5000, fmt: (v: number) => `${fmt(v)} (${fmtN(v / valor * 100)}%)`, hint: ['R$ 0', '80%'] },
            { label: 'Prazo', val: prazo, set: setPrazo, min: 60, max: 360, step: 12, fmt: (v: number) => `${v} meses (${fmtN(v / 12, 0)} anos)`, hint: ['5 anos', '30 anos'] },
            { label: 'Juros financiamento', val: taxa, set: setTaxa, min: 6, max: 20, step: 0.5, fmt: (v: number) => `${fmtN(v)}% a.a.`, hint: ['6%', '20%'] },
          ].map(f => (
            <div key={f.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-2)' }}>{f.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy)' }}>{f.fmt(f.val)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4A857' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
                <span>{f.hint[0]}</span><span>{f.hint[1]}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 13, color: 'var(--fg-2)', fontWeight: 600 }}>Sistema:</span>
          {['SAC', 'PRICE'].map(s => (
            <button key={s} onClick={() => setSistema(s)}
              style={{ padding: '6px 18px', borderRadius: 999, border: '1.5px solid', borderColor: sistema === s ? 'var(--navy)' : 'var(--border)', background: sistema === s ? 'var(--navy)' : '#fff', color: sistema === s ? '#fff' : 'var(--fg-1)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 20, marginBottom: 24 }}>
          {/* Consórcio */}
          <div style={{ background: 'linear-gradient(145deg,var(--navy),#0F1824)', borderRadius: 16, padding: '28px 26px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(212,168,87,0.1)' }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Consórcio VN Prime</div>
            <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{fmt(parcelaConsorc)}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>/mês estimado · 0% juros</div>
            {[['Carta de crédito', fmt(valor)], ['Taxa adm. (17%)', fmt(valor * TAX)], ['Fundo reserva (3%)', fmt(valor * TAX_FUNDO)], ['Total a pagar', fmt(totalConsorc)]].map(([l, v], i) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: i === 3 ? 800 : 600, color: i === 3 ? 'var(--gold)' : '#fff' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 10px', background: 'rgba(52,211,153,0.15)', color: '#34D399', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>0% juros</span>
              <span style={{ padding: '4px 10px', background: 'rgba(212,168,87,0.15)', color: 'var(--gold)', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Sem entrada obrigatória</span>
            </div>
          </div>

          {/* Financiamento */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 26px', border: '2px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(220,38,38,0.05)' }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 6 }}>Financiamento · {sistema}</div>
            <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--navy)', lineHeight: 1 }}>{fmt(parcelaFin)}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 20 }}>{sistema === 'SAC' ? '1ª parcela (decresce)' : '/mês fixo'} · {fmtN(taxa)}% a.a.</div>
            {[['Entrada necessária', fmt(entrada)], [`Total financiado (${sistema})`, fmt(totalFin)], ['Total pago (entrada + parcelas)', fmt(totalFin + entrada)]].map(([l, v], i) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: i === 2 ? 800 : 600, color: i === 2 ? '#DC2626' : 'var(--navy)' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <span style={{ padding: '4px 10px', background: 'rgba(220,38,38,0.08)', color: '#DC2626', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{fmtN(taxa)}% a.a. de juros</span>
            </div>
          </div>

          {/* Economia */}
          <div style={{ background: '#F0FDF4', borderRadius: 16, padding: '28px 26px', border: '2px solid #BBF7D0', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#059669', marginBottom: 12 }}>Você economiza</div>
            <div style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#059669', lineHeight: 1, marginBottom: 8 }}>{fmt(Math.max(0, economiaBruta))}</div>
            <div style={{ fontSize: 13, color: '#166534' }}>escolhendo o consórcio</div>
            <div style={{ marginTop: 24, fontSize: 12, color: '#166534', lineHeight: 1.5 }}>
              Sem entrada imediata obrigatória · Carta forte no momento da contemplação
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'center' }}>
          * Valores estimados. Consórcio: taxa adm. 17% + fundo reserva 3%. Financiamento: {sistema} com {fmtN(taxa)}% a.a. Consulte as condições reais com seu assessor.
        </div>
      </div>
    </section>
  )
}

export default function ConsorcioPage() {
  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, rgba(5,150,105,0.15) 0%, rgba(15,24,36,0.95) 50%) ,
                     url(https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=1900&q=85) center/cover`,
        padding: 'clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)',
        color: '#fff',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', maxWidth: 680 }}>
          <Eyebrow color="var(--gold)">VN Prime Imóveis</Eyebrow>
          <h1 style={{ color: '#fff', margin: '14px 0 18px', fontSize: 'clamp(2.4rem,5vw,3.6rem)', lineHeight: 1.05 }}>
            Compre seu imóvel{' '}
            <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>com parcelas acessíveis</em>.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.88)', maxWidth: 560, marginBottom: 28 }}>
            Carta de crédito de R$ 120 mil a R$ 2 milhões. Use como entrada, lance ou compra à vista — paga à vista, paga melhor.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#simulador"><Btn variant="accent" size="lg">Simular minha cota</Btn></a>
            <a href={`https://wa.me/5531984144250?text=Olá! Quero saber mais sobre consórcio imobiliário VN Prime.`} target="_blank" rel="noopener noreferrer">
              <Btn variant="ghost-light" size="lg">Falar com consultor</Btn>
            </a>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0' }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto', display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {[
            { t: '0% Juros Bancários', d: 'Apenas taxa de administração de 17%. Economia de até 38% comparado ao financiamento bancário.' },
            { t: 'Lance livre', d: 'Use FGTS, recursos próprios ou parcelas adiantadas para antecipar sua contemplação.' },
            { t: 'Carta forte', d: 'Poder de compra à vista para o vendedor — posição de negociação superior ao financiado.' },
            { t: 'Use como entrada', d: 'Combine carta com financiamento para imóveis de maior valor. Sem burocracia adicional.' },
          ].map(d => (
            <div key={d.t}>
              <div style={{ width: 36, height: 3, background: 'var(--gold)', marginBottom: 16, borderRadius: 2 }} />
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{d.t}</div>
              <div style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>{d.d}</div>
            </div>
          ))}
        </div>
      </section>

      <SimuladorConsorcio />
      <SimuladorComparativo />

      {/* FAQ */}
      {(() => {
        const FAQS = [
          { q: 'Qual é a diferença entre consórcio e financiamento?', a: 'No financiamento você paga juros bancários (tipicamente 8–12% a.a.) sobre o saldo devedor. No consórcio você paga apenas taxa de administração (17% diluída em todo o prazo), sem juros. A desvantagem é que não há liberação imediata — você aguarda contemplação ou dá um lance.' },
          { q: 'Como funciona a contemplação?', a: 'Mensalmente o grupo realiza um sorteio entre todos os cotistas. Você também pode dar um lance (oferta acima da parcela) para antecipar a contemplação. O maior lance do mês leva a carta.' },
          { q: 'Posso usar FGTS no consórcio?', a: 'Sim. O FGTS pode ser usado como lance para antecipar a contemplação ou para quitar parcelas após ser contemplado, desde que o imóvel se enquadre nas regras do FGTS.' },
          { q: 'E se eu precisar cancelar?', a: 'Em caso de desistência, você recebe de volta as parcelas pagas (descontada a taxa de administração) no próximo sorteio de devoluções do grupo.' },
          { q: 'Qual o prazo máximo?', a: 'Trabalhamos com grupos de 60 a 240 meses. Quanto maior o prazo, menor a parcela mensal — mas maior o tempo esperado para contemplação sem lance.' },
          { q: 'A carta pode ser usada em qualquer imóvel?', a: 'Sim, desde que o valor esteja dentro da carta contratada. Pode ser usado em imóvel novo, usado, na planta ou terreno.' },
        ]
        return (
          <section style={{ padding: 'clamp(3rem,5vw,5rem) 0', background: 'var(--cream)' }}>
            <div style={{ width: 'min(820px,94vw)', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Eyebrow color="var(--gold-deep)">Dúvidas frequentes</Eyebrow>
                <h2 style={{ margin: '8px 0 0' }}>Consórcio — perguntas e respostas</h2>
              </div>
              <FaqAccordion items={FAQS} />
            </div>
          </section>
        )
      })()}

      {/* CTA final */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: '#fff' }}>
        <div style={{ width: 'min(900px,92vw)', margin: '0 auto', background: 'var(--gradient-navy-hero)', borderRadius: 24, padding: 'clamp(40px,5vw,64px)', textAlign: 'center', color: '#fff' }}>
          <Eyebrow color="var(--gold)">Próximo passo</Eyebrow>
          <h2 style={{ color: '#fff', margin: '16px 0 14px' }}>Pronto para começar?</h2>
          <p style={{ color: 'rgba(245,248,250,0.8)', fontSize: 16, maxWidth: 480, margin: '0 auto 32px' }}>
            Nossos consultores ajudam a encontrar o grupo certo para o seu perfil. Sem compromisso.
          </p>
          <a href={`https://wa.me/5531984144250?text=Olá! Quero iniciar um consórcio imobiliário pela VN Prime.`} target="_blank" rel="noopener noreferrer">
            <Btn variant="accent" size="lg">Falar com consultor agora</Btn>
          </a>
        </div>
      </section>
    </main>
  )
}
