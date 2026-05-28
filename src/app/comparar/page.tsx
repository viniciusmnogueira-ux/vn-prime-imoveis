'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { fmtBRL } from '@/lib/utils'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

const MAX = 3

function Spec({ label, values, highlight }: { label: string; values: (string | null)[]; highlight?: boolean }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border)', background: highlight ? 'rgba(212,168,87,0.05)' : 'transparent' }}>
      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', width: 140, verticalAlign: 'middle' }}>
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: v ? 'var(--navy)' : 'var(--fg-3)', textAlign: 'center', verticalAlign: 'middle' }}>
          {v ?? '—'}
        </td>
      ))}
    </tr>
  )
}

export default function CompararPage() {
  const [ids, setIds] = useState<string[]>([])
  const [imoveis, setImoveis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored: string[] = JSON.parse(localStorage.getItem('vnp_compare') ?? '[]')
    setIds(stored)
    if (!stored.length) { setLoading(false); return }
    const supabase = createClient()
    supabase.from('imoveis').select('*').in('id', stored).then(({ data }) => {
      if (data) {
        const ordered = stored.map(id => data.find(d => d.id === id)).filter(Boolean)
        setImoveis(ordered)
      }
      setLoading(false)
    })
  }, [])

  function remove(id: string) {
    const next = ids.filter(x => x !== id)
    setIds(next)
    setImoveis(prev => prev.filter(i => i.id !== id))
    localStorage.setItem('vnp_compare', JSON.stringify(next))
  }

  function clearAll() {
    setIds([])
    setImoveis([])
    localStorage.removeItem('vnp_compare')
  }

  const cols = imoveis.length

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Header */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div style={{ width: 'min(1200px,94vw)', margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Início</Link>
            {' › '}
            <Link href="/busca" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Busca</Link>
            {' › '}
            <span style={{ color: 'var(--navy)' }}>Comparar</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <Eyebrow color="var(--gold-deep)">Comparador</Eyebrow>
              <h1 style={{ marginTop: 6, fontSize: 'clamp(1.4rem,2.4vw,1.9rem)' }}>Comparar imóveis</h1>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {cols > 0 && (
                <button onClick={clearAll} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Limpar comparador
                </button>
              )}
              <Link href="/busca">
                <Btn variant="accent">+ Adicionar imóvel</Btn>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div style={{ width: 'min(1200px,94vw)', margin: '32px auto 0' }}>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div className="animate-spin" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
          </div>
        ) : cols === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '60px 30px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚖️</div>
            <h2 style={{ marginBottom: 8 }}>Nenhum imóvel selecionado</h2>
            <p style={{ color: 'var(--fg-2)', maxWidth: 360, margin: '0 auto 24px' }}>
              Na busca, clique em "Comparar" em até {MAX} imóveis para analisá-los lado a lado.
            </p>
            <Link href="/busca"><Btn variant="accent">Explorar imóveis</Btn></Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,34,68,0.06)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: cols * 260 + 140 }}>

                {/* Photo row */}
                <thead>
                  <tr>
                    <th style={{ width: 140 }} />
                    {imoveis.map(im => (
                      <th key={im.id} style={{ padding: '20px 16px', textAlign: 'center', verticalAlign: 'top', borderLeft: '1px solid var(--border)' }}>
                        <div style={{ position: 'relative', height: 180, borderRadius: 10, overflow: 'hidden', background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--navy)', marginBottom: 10 }}>
                          {im.verificado && (
                            <span style={{ position: 'absolute', top: 8, left: 8, background: '#059669', color: '#fff', fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>✓ Verificado</span>
                          )}
                          {im.destaque && (
                            <span style={{ position: 'absolute', top: im.verificado ? 30 : 8, left: 8, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>★ Destaque</span>
                          )}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4, lineHeight: 1.3 }}>{im.titulo}</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--gold)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>{fmtBRL(im.preco)}</div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Link href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '6px 14px', borderRadius: 7, background: 'var(--gradient-gold)', border: 'none', fontSize: 12, fontWeight: 700, color: 'var(--navy)', cursor: 'pointer', fontFamily: 'inherit' }}>
                              Ver imóvel
                            </button>
                          </Link>
                          <button onClick={() => remove(im.id)} style={{ padding: '6px 14px', borderRadius: 7, background: 'none', border: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', cursor: 'pointer', fontFamily: 'inherit' }}>
                            ✕ Remover
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* Placeholder column for adding more */}
                    {cols < MAX && (
                      <th style={{ padding: 20, textAlign: 'center', verticalAlign: 'middle', borderLeft: '1px solid var(--border)', opacity: 0.5 }}>
                        <Link href="/busca" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--fg-3)' }}>+</div>
                          <span style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 600 }}>Adicionar imóvel</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Comparison rows */}
                <tbody>
                  <tr style={{ background: 'rgba(212,168,87,0.08)', borderTop: '2px solid var(--border)' }}>
                    <td colSpan={cols + 2} style={{ padding: '8px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>Características</td>
                  </tr>
                  <Spec label="Tipo" values={imoveis.map(i => i.tipo ? i.tipo.charAt(0).toUpperCase() + i.tipo.slice(1) : null)} />
                  <Spec label="Operação" values={imoveis.map(i => i.operacao ?? null)} />
                  <Spec label="Área" values={imoveis.map(i => i.area_m2 ? `${i.area_m2} m²` : null)} highlight />
                  <Spec label="Quartos" values={imoveis.map(i => i.quartos ? `${i.quartos}` : null)} />
                  <Spec label="Suítes" values={imoveis.map(i => i.suites ? `${i.suites}` : null)} highlight />
                  <Spec label="Banheiros" values={imoveis.map(i => i.banheiros ? `${i.banheiros}` : null)} />
                  <Spec label="Vagas" values={imoveis.map(i => i.vagas ? `${i.vagas}` : null)} highlight />

                  <tr style={{ background: 'rgba(212,168,87,0.08)', borderTop: '2px solid var(--border)' }}>
                    <td colSpan={cols + 2} style={{ padding: '8px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>Financeiro</td>
                  </tr>
                  <Spec label="Preço" values={imoveis.map(i => fmtBRL(i.preco))} highlight />
                  <Spec label="Preço/m²" values={imoveis.map(i => i.preco && i.area_m2 ? `${fmtBRL(Math.round(i.preco / i.area_m2))}/m²` : null)} />
                  <Spec label="Condomínio" values={imoveis.map(i => i.condominio ? `${fmtBRL(i.condominio)}/mês` : null)} highlight />
                  <Spec label="IPTU" values={imoveis.map(i => i.iptu ? `${fmtBRL(i.iptu)}/ano` : null)} />

                  <tr style={{ background: 'rgba(212,168,87,0.08)', borderTop: '2px solid var(--border)' }}>
                    <td colSpan={cols + 2} style={{ padding: '8px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>Localização</td>
                  </tr>
                  <Spec label="Bairro" values={imoveis.map(i => i.bairro ?? null)} highlight />
                  <Spec label="Cidade" values={imoveis.map(i => i.cidade ?? null)} />

                  <tr style={{ background: 'rgba(212,168,87,0.08)', borderTop: '2px solid var(--border)' }}>
                    <td colSpan={cols + 2} style={{ padding: '8px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>Diferenciais</td>
                  </tr>
                  <Spec label="Verificado" values={imoveis.map(i => i.verificado ? '✓ Sim' : 'Não')} highlight />
                  <Spec label="Destaque" values={imoveis.map(i => i.destaque ? '★ Sim' : 'Não')} />
                  <Spec label="Lançamento" values={imoveis.map(i => i.operacao === 'lancamento' ? 'Sim' : 'Não')} highlight />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA */}
        {cols > 0 && !loading && (
          <div style={{ marginTop: 32, background: 'var(--navy)', borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Ficou em dúvida?</div>
              <div style={{ fontSize: 13.5, color: 'rgba(245,248,250,0.7)' }}>Um especialista VN Prime pode ajudá-lo a escolher o melhor imóvel para seu perfil.</div>
            </div>
            <a href="https://wa.me/5531984144250" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Btn variant="accent">Falar com especialista</Btn>
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
