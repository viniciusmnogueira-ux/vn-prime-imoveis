'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { fmtBRL } from '@/lib/utils'
import Btn from '@/components/ui/Btn'

function ImovelCard({ im, onRemove }: { im: any; onRemove: (id: string) => void }) {
  const hover = (el: HTMLElement, on: boolean) => {
    el.style.transform = on ? 'translateY(-2px)' : 'none'
    el.style.boxShadow = on ? '0 16px 44px rgba(15,34,68,0.14)' : '0 4px 18px rgba(15,34,68,0.08)'
  }
  return (
    <article style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 18px rgba(15,34,68,0.08)', transition: 'transform 0.18s, box-shadow 0.18s' }}
      onMouseEnter={e => hover(e.currentTarget, true)}
      onMouseLeave={e => hover(e.currentTarget, false)}>
      <Link href={`/imovel/${im.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ height: 200, position: 'relative', background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--cream)' }}>
          {im.destaque && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase' }}>★ Destaque</span>
          )}
          <span style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(15,34,68,0.85)', color: 'var(--gold-soft)', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {im.tipo}
          </span>
        </div>
        <div style={{ padding: '18px 22px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 2 }}>Preço de pedida</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>{fmtBRL(im.preco)}</div>
          <h3 style={{ fontSize: 15, color: 'var(--navy)', fontWeight: 600, margin: '6px 0 4px', lineHeight: 1.3 }}>{im.titulo}</h3>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 10 }}>
            {im.bairro}{im.cidade && im.bairro ? ', ' : ''}{im.cidade}
          </div>
          {(im.area_m2 || im.quartos || im.vagas) && (
            <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: 'var(--fg-2)' }}>
              {im.area_m2 && <span>{im.area_m2} m²</span>}
              {im.quartos && <span>{im.quartos} qtos</span>}
              {im.vagas && <span>{im.vagas} vaga{im.vagas > 1 ? 's' : ''}</span>}
            </div>
          )}
        </div>
      </Link>
      <div style={{ padding: '0 22px 18px' }}>
        <button onClick={() => onRemove(im.id)} style={{ width: '100%', padding: '7px 0', borderRadius: 8, border: '1.5px solid #DC2626', background: '#FEF2F2', color: '#DC2626', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          ♥ Remover dos favoritos
        </button>
      </div>
    </article>
  )
}

type FavSort = 'price_asc' | 'price_desc' | 'area_desc' | 'recent'
const SORT_OPTS: { value: FavSort; label: string }[] = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'area_desc', label: 'Maior área' },
]

export default function FavoritosPage() {
  const [ids, setIds] = useState<string[]>([])
  const [imoveis, setImoveis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<FavSort>('recent')

  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem('vnp_favs') ?? '[]')
    setIds(saved)
    if (saved.length === 0) { setLoading(false); return }
    const supabase = createClient()
    supabase.from('imoveis').select('*').in('id', saved)
      .then(({ data }) => { setImoveis(data ?? []); setLoading(false) })
  }, [])

  const remove = (id: string) => {
    const next = ids.filter(f => f !== id)
    localStorage.setItem('vnp_favs', JSON.stringify(next))
    setIds(next)
    setImoveis(prev => prev.filter(im => im.id !== id))
  }

  const clearAll = () => {
    localStorage.setItem('vnp_favs', '[]')
    setIds([])
    setImoveis([])
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Início</Link>
            {' › '}
            <Link href="/busca" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Buscar</Link>
            {' › '}
            <span style={{ color: 'var(--navy)' }}>Meus Favoritos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem,2.4vw,1.9rem)' }}>
                ♥ Meus Favoritos
              </h1>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--fg-2)' }}>
                {loading ? 'Carregando…' : ids.length === 0 ? 'Nenhum imóvel salvo ainda.' : `${imoveis.length} imóvel${imoveis.length !== 1 ? 's' : ''} salvo${imoveis.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {imoveis.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => {
                  const cmp = imoveis.slice(0, 3).map(im => im.id)
                  localStorage.setItem('vnp_compare', JSON.stringify(cmp))
                  window.location.href = '/comparar'
                }} style={{ padding: '8px 18px', border: '1px solid var(--gold)', borderRadius: 8, background: 'rgba(212,168,87,0.10)', color: 'var(--gold-deep)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ⚖ Comparar {Math.min(imoveis.length, 3)} selecionados
                </button>
                <button onClick={() => {
                  const rows = ['Título,Bairro,Cidade,Preço,Área,Quartos', ...imoveis.map(im => `"${im.titulo}","${im.bairro ?? ''}","${im.cidade ?? ''}","${im.preco ?? ''}","${im.area_m2 ?? ''}","${im.quartos ?? ''}"`)]
                  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a'); a.href = url; a.download = 'favoritos-vnprime.csv'; a.click(); URL.revokeObjectURL(url)
                }} style={{ padding: '8px 18px', border: '1px solid var(--border)', borderRadius: 8, background: '#fff', color: 'var(--fg-2)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ↓ Exportar CSV
                </button>
                <button onClick={clearAll} style={{ padding: '8px 18px', border: '1px solid var(--border)', borderRadius: 8, background: '#fff', color: 'var(--fg-2)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Limpar tudo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ width: 'min(1280px,94vw)', margin: '40px auto 0' }}>
        {imoveis.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ordenar:</span>
            {SORT_OPTS.map(o => (
              <button key={o.value} onClick={() => setSort(o.value)}
                style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${sort === o.value ? 'var(--gold)' : 'var(--border)'}`, background: sort === o.value ? 'rgba(212,168,87,0.10)' : '#fff', color: sort === o.value ? 'var(--gold-deep)' : 'var(--fg-2)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                {o.label}
              </button>
            ))}
          </div>
        )}
        {!loading && imoveis.length >= 2 && (() => {
          const prices = imoveis.map(im => im.preco).filter(Boolean) as number[]
          const areas = imoveis.map(im => im.area_m2).filter(Boolean) as number[]
          const minP = Math.min(...prices)
          const maxP = Math.max(...prices)
          const avgArea = areas.length ? Math.round(areas.reduce((a, b) => a + b, 0) / areas.length) : null
          const fmt = (n: number) => n >= 1_000_000 ? `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')} mi` : `R$ ${(n / 1_000).toFixed(0)} mil`
          return (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              {[
                { label: 'Imóveis salvos', value: String(imoveis.length) },
                { label: 'Menor preço', value: prices.length ? fmt(minP) : '—' },
                { label: 'Maior preço', value: prices.length ? fmt(maxP) : '—' },
                { label: 'Área média', value: avgArea ? `${avgArea} m²` : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ flex: '1 1 140px', background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-3)', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--gold)' }}>{value}</div>
                </div>
              ))}
            </div>
          )
        })()}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : imoveis.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '60px 30px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, color: 'var(--gold)', marginBottom: 16 }}>♡</div>
            <h3>Nenhum favorito salvo</h3>
            <p style={{ color: 'var(--fg-2)', maxWidth: 360, margin: '0 auto 24px' }}>
              Explore os imóveis disponíveis e salve os que mais te interessam clicando no coração.
            </p>
            <Link href="/busca"><Btn variant="accent">Explorar imóveis</Btn></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {[...imoveis].sort((a, b) => {
              if (sort === 'price_asc') return (a.preco ?? Infinity) - (b.preco ?? Infinity)
              if (sort === 'price_desc') return (b.preco ?? 0) - (a.preco ?? 0)
              if (sort === 'area_desc') return (b.area_m2 ?? 0) - (a.area_m2 ?? 0)
              return 0
            }).map(im => <ImovelCard key={im.id} im={im} onRemove={remove} />)}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
