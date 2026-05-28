'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtN = (n: number, d = 1) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })

interface BairroStat {
  bairro: string
  count: number
  avgPreco: number
  avgM2: number
  minPreco: number
  maxPreco: number
}

interface Stats {
  total: number
  ativos: number
  avgPreco: number
  avgM2: number
  totalValue: number
  byTipo: { tipo: string; count: number }[]
  byBairro: BairroStat[]
  recentes: any[]
  destaques: number
}

export default function RelatorioPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [month] = useState(() => {
    const d = new Date()
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  })

  useEffect(() => {
    const sb = createClient()
    sb.from('imoveis').select('*').eq('status', 'ativo').then(({ data }) => {
      if (!data) { setLoading(false); return }

      const total = data.length
      const ativos = data.filter(i => i.status === 'ativo').length
      const comPreco = data.filter(i => i.preco > 0)
      const avgPreco = comPreco.length ? comPreco.reduce((s, i) => s + i.preco, 0) / comPreco.length : 0
      const totalValue = comPreco.reduce((s, i) => s + i.preco, 0)
      const comM2 = data.filter(i => (i.area_m2 || i.area) && i.preco > 0)
      const avgM2 = comM2.length ? comM2.reduce((s, i) => s + i.preco / (i.area_m2 || i.area), 0) / comM2.length : 0
      const destaques = data.filter(i => i.destaque).length

      // by tipo
      const tipoMap: Record<string, number> = {}
      data.forEach(i => { if (i.tipo) tipoMap[i.tipo] = (tipoMap[i.tipo] ?? 0) + 1 })
      const byTipo = Object.entries(tipoMap).sort((a, b) => b[1] - a[1]).map(([tipo, count]) => ({ tipo, count }))

      // by bairro
      const bairroMap: Record<string, { prices: number[]; m2s: number[] }> = {}
      data.forEach(i => {
        if (!i.bairro) return
        if (!bairroMap[i.bairro]) bairroMap[i.bairro] = { prices: [], m2s: [] }
        if (i.preco > 0) bairroMap[i.bairro].prices.push(i.preco)
        if ((i.area_m2 || i.area) && i.preco > 0) bairroMap[i.bairro].m2s.push(i.preco / (i.area_m2 || i.area))
      })
      const byBairro: BairroStat[] = Object.entries(bairroMap)
        .map(([bairro, { prices, m2s }]) => ({
          bairro,
          count: prices.length,
          avgPreco: prices.length ? prices.reduce((s, v) => s + v, 0) / prices.length : 0,
          avgM2: m2s.length ? m2s.reduce((s, v) => s + v, 0) / m2s.length : 0,
          minPreco: prices.length ? Math.min(...prices) : 0,
          maxPreco: prices.length ? Math.max(...prices) : 0,
        }))
        .filter(b => b.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 12)

      const recentes = [...data].sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()).slice(0, 6)

      setStats({ total, ativos, avgPreco, avgM2, totalValue, byTipo, byBairro, recentes, destaques })
      setLoading(false)
    })
  }, [])

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: 'var(--gradient-navy-hero)', color: '#fff', padding: 'clamp(60px,9vw,100px) 0 clamp(40px,6vw,70px)' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <Eyebrow color="var(--gold)">Mercado Imobiliário</Eyebrow>
          <h1 style={{ color: '#fff', margin: '12px 0 14px', fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
            Relatório de Mercado BH
          </h1>
          <p style={{ color: 'rgba(245,248,250,0.78)', fontSize: 16, maxWidth: 560, marginBottom: 0 }}>
            Dados ao vivo do portfólio VN Prime — imóveis ativos, preços médios e tendências por bairro em Belo Horizonte.
          </p>
          <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Atualizado em tempo real · {month}</div>
        </div>
      </section>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : !stats ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--fg-2)' }}>Sem dados disponíveis.</div>
      ) : (
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', padding: '40px 0 80px' }}>

          {/* KPI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { label: 'Imóveis ativos', value: stats.ativos.toString(), sub: 'no portfólio VN Prime', accent: 'var(--navy)' },
              { label: 'Preço médio', value: fmt(stats.avgPreco), sub: 'por imóvel', accent: 'var(--gold-deep)' },
              { label: 'Preço médio m²', value: fmt(stats.avgM2), sub: 'portfólio BH/MG', accent: '#059669' },
              { label: 'Volume total', value: `R$ ${(stats.totalValue / 1e6).toFixed(1)}M`, sub: 'em portfólio ativo', accent: '#7C3AED' },
              { label: 'Em destaque', value: stats.destaques.toString(), sub: 'imóveis premium', accent: '#D97706' },
            ].map(k => (
              <div key={k.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 20px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: k.accent, letterSpacing: '-0.02em', marginBottom: 2 }}>{k.value}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', marginBottom: 2 }}>{k.label}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,480px),1fr))', gap: 24, marginBottom: 32 }}>

            {/* Por bairro */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>Imóveis por bairro</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>Preço médio e m² por bairro</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Bairro', 'Imóveis', 'Preço médio', 'R$/m²'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byBairro.map((b, i) => (
                      <tr key={b.bairro} style={{ borderTop: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                        <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{b.bairro}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ height: 6, borderRadius: 3, background: 'var(--gold)', width: `${Math.max(8, (b.count / stats.byBairro[0].count) * 80)}px` }} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>{b.count}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--navy)', fontWeight: 600 }}>{fmt(b.avgPreco)}</td>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--gold-deep)', fontWeight: 700 }}>{b.avgM2 > 0 ? fmt(b.avgM2) : '—'}</td>
                      </tr>
                    ))}
                    {stats.byBairro.length === 0 && (
                      <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--fg-3)', fontSize: 13 }}>Sem dados de bairro disponíveis.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Por tipo + adicionados recentemente */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Por tipo */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '18px 22px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Distribuição por tipo</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.byTipo.map(t => (
                    <div key={t.tipo} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, fontSize: 13, color: 'var(--navy)', fontWeight: 600 }}>{t.tipo}</div>
                      <div style={{ flex: 2, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--gold)', borderRadius: 4, width: `${(t.count / stats.byTipo[0].count) * 100}%`, transition: 'width 0.6s ease' }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', minWidth: 28, textAlign: 'right' }}>{t.count}</div>
                    </div>
                  ))}
                  {stats.byTipo.length === 0 && <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>Sem dados.</div>}
                </div>
              </div>

              {/* Recém adicionados */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '18px 22px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>Recém adicionados</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.recentes.map(im => (
                    <Link key={im.id} href={`/imovel/${im.id}`}
                      style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ width: 48, height: 40, borderRadius: 8, background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--cream)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{im.titulo}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>{im.bairro} · {im.preco ? fmt(im.preco) : '—'}</div>
                      </div>
                    </Link>
                  ))}
                  {stats.recentes.length === 0 && <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>Sem imóveis recentes.</div>}
                </div>
                <Link href="/busca" style={{ display: 'block', marginTop: 14, textAlign: 'center', fontSize: 13, color: 'var(--gold-deep)', fontWeight: 700, textDecoration: 'none' }}>
                  Ver todos os imóveis →
                </Link>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: 'var(--gradient-navy-hero)', borderRadius: 20, padding: 'clamp(32px,4vw,52px)', textAlign: 'center', color: '#fff' }}>
            <Eyebrow color="var(--gold)">Quer estar neste relatório?</Eyebrow>
            <h2 style={{ color: '#fff', margin: '14px 0 12px', fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>Publique seu imóvel na VN Prime</h2>
            <p style={{ color: 'rgba(245,248,250,0.78)', fontSize: 15, maxWidth: 480, margin: '0 auto 28px' }}>
              Imóveis VN Prime aparecem neste relatório e são distribuídos nos maiores portais do Brasil.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/vender" style={{ padding: '13px 28px', borderRadius: 10, background: 'var(--gold)', color: 'var(--navy-deep)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Anunciar imóvel</Link>
              <Link href="/busca" style={{ padding: '13px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>Ver portfólio</Link>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
