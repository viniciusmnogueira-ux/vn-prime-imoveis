'use client'
import { useState } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

function getEmolumentos(v: number) {
  const faixas = [
    { max:  100000, reg:  350, esc:  720 },
    { max:  300000, reg:  680, esc: 1250 },
    { max:  500000, reg: 1050, esc: 1850 },
    { max:  800000, reg: 1450, esc: 2600 },
    { max: 1200000, reg: 1950, esc: 3400 },
    { max: 2000000, reg: 2900, esc: 4900 },
    { max: 4000000, reg: 4600, esc: 7600 },
    { max: 6000000, reg: 7200, esc:10200 },
    { max: Infinity, reg: 9500, esc:13000 },
  ]
  return faixas.find(f => v <= f.max)!
}

export default function CalculadoraPage() {
  const [valor, setValor] = useState(1000000)
  const [taxaItbi, setTaxaItbi] = useState(3)
  const [financiado, setFinanciado] = useState(false)
  const [entradaPct, setEntradaPct] = useState(20)

  const itbi = Math.round(valor * taxaItbi / 100)
  const em = getEmolumentos(valor)
  const total = itbi + em.reg + em.esc
  const pct = ((total / valor) * 100).toFixed(1)
  const entrada = Math.round(valor * entradaPct / 100)

  const rows = [
    { label: 'ITBI', hint: `${taxaItbi}% sobre o valor`, valor: itbi, accent: true },
    { label: 'Escritura pública', hint: 'Tabela TJMG · Tabelionato', valor: em.esc, accent: false },
    { label: 'Registro de Imóveis', hint: 'Tabela TJMG · Cartório', valor: em.reg, accent: false },
  ]

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(180deg,#0F1824 0%,#1B2733 100%)', padding: 'clamp(70px,10vw,120px) 0 clamp(50px,7vw,80px)', color: '#fff' }}>
        <div style={{ width: 'min(900px,92vw)', margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow color="var(--gold)">Ferramenta gratuita</Eyebrow>
          <h1 style={{ color: '#fff', margin: '14px 0 18px' }}>
            Calculadora ITBI<br />
            <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>+ Custos de Cartório</em>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(245,248,250,0.82)', maxWidth: 520, margin: '0 auto' }}>
            ITBI, escritura pública e registro de imóveis — calculados pela Tabela de Emolumentos TJMG 2024.
          </p>
        </div>
      </section>

      {/* Calculadora */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))' }}>

          {/* Inputs */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Parâmetros</div>

            <label>
              <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 6 }}>Valor do imóvel (R$)</div>
              <input type="number" value={valor}
                onChange={e => setValor(Math.max(50000, Number(e.target.value)))}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 17, fontWeight: 700, color: 'var(--navy)', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 5 }}>{fmt(valor)}</div>
            </label>

            <label>
              <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 6 }}>
                Alíquota ITBI — <strong>{taxaItbi}%</strong>
              </div>
              <input type="range" min="0.5" max="5" step="0.5" value={taxaItbi}
                onChange={e => setTaxaItbi(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4A857' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                <span>BH: 3%</span><span>Nova Lima: 2%</span><span>Contagem: 2,5%</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={financiado} onChange={e => setFinanciado(e.target.checked)}
                style={{ accentColor: '#D4A857', width: 16, height: 16 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Financiado</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Mostra o desembolso real com entrada</div>
              </div>
            </label>

            {financiado && (
              <label>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 6 }}>
                  Entrada — <strong>{entradaPct}%</strong> ({fmt(entrada)})
                </div>
                <input type="range" min="10" max="80" step="5" value={entradaPct}
                  onChange={e => setEntradaPct(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#D4A857' }} />
              </label>
            )}
          </div>

          {/* Resultado */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rows.map(r => (
              <div key={r.label} style={{ background: r.accent ? 'var(--navy)' : '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: r.accent ? '#fff' : 'var(--navy)', marginBottom: 3 }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: r.accent ? 'rgba(255,255,255,0.6)' : 'var(--fg-3)' }}>{r.hint}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: r.accent ? 'var(--gold-soft)' : 'var(--navy)' }}>{fmt(r.valor)}</div>
              </div>
            ))}

            <div style={{ background: 'var(--cream)', borderRadius: 16, padding: '22px 24px', border: '2px solid var(--gold)', marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>Total de custos</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--navy)' }}>{fmt(total)}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{pct}% sobre o valor do imóvel</div>
              {financiado && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: 'var(--fg-2)' }}>Entrada ({entradaPct}%)</span>
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{fmt(entrada)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>Desembolso total no ato</span>
                    <span style={{ fontWeight: 800, color: 'var(--gold-deep)' }}>{fmt(entrada + total)}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6, padding: '0 4px' }}>
              * Valores estimados. ITBI calculado sobre o maior entre valor declarado e valor venal. Emolumentos conforme Tabela TJMG 2024. Consulte seu tabelião.
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section style={{ padding: 'clamp(40px,5vw,60px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {[
            { t: 'O que é ITBI?', d: 'Imposto de Transmissão de Bens Imóveis — municipal, incide sobre toda compra/venda de imóveis. Em BH é 3%, em Nova Lima 2%, em Contagem 2,5%.' },
            { t: 'Escritura pública', d: 'Lavrada em cartório de notas. Obrigatória para imóveis pagos à vista. No financiamento o banco costuma substituir pelo contrato particular registrado.' },
            { t: 'Registro de Imóveis', d: 'Sem registro o imóvel não muda de dono legalmente. É lavrado no Cartório de Registro de Imóveis da circunscrição do bem.' },
            { t: 'Dica VN Prime', d: 'Inclua estes custos no seu planejamento: para um imóvel de R$ 1M em BH, reserve cerca de R$ 45–60 mil para documentação e cartório.' },
          ].map(b => (
            <div key={b.t} style={{ padding: '22px 20px' }}>
              <div style={{ width: 32, height: 3, background: 'var(--gold)', marginBottom: 14, borderRadius: 2 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{b.t}</div>
              <div style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.65 }}>{b.d}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
