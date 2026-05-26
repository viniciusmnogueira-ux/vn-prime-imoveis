'use client'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useMemo, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtBRL } from '@/lib/utils'
import Link from 'next/link'
import Btn from '@/components/ui/Btn'

const PRICE_RANGES: Record<string, [number, number]> = {
  ate500:   [0, 500000],
  '500-1M': [500000, 1000000],
  '1M-2M':  [1000000, 2000000],
  '2M-5M':  [2000000, 5000000],
  acima5M:  [5000000, Infinity],
}

const IS: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.7rem',
  border: '1px solid var(--border)', borderRadius: 8,
  fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
  background: '#fff', color: 'var(--navy)', boxSizing: 'border-box',
}

const PER_PAGE = 9

function fmtBRLshort(price: number) {
  if (price >= 1000000) return `R$${(price / 1000000).toFixed(1)}M`
  if (price >= 1000) return `R$${(price / 1000).toFixed(0)}k`
  return `R$${price}`
}

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const chk = () => setM(window.innerWidth <= 768)
    chk()
    window.addEventListener('resize', chk)
    return () => window.removeEventListener('resize', chk)
  }, [])
  return m
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function OperationTabsLight({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {([['compra', 'Comprar'], ['lancamento', 'Lançamentos']] as const).map(([id, label]) => {
        const active = value === id
        return (
          <button key={id} onClick={() => onChange(id)} style={{
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
            padding: '0.55rem 1.1rem', borderRadius: 7, cursor: 'pointer', border: '1px solid',
            borderColor: active ? 'var(--navy)' : 'var(--border)',
            background: active ? 'var(--navy)' : '#fff',
            color: active ? 'var(--gold)' : 'var(--navy-muted)',
          }}>{label}</button>
        )
      })}
    </div>
  )
}

function ImovelCard({ im, layout = 'grid' }: { im: any; layout?: 'grid' | 'horizontal' }) {
  const hover = (el: HTMLElement, on: boolean) => {
    el.style.transform = on ? 'translateY(-2px)' : 'none'
    el.style.boxShadow = on ? '0 16px 44px rgba(15,34,68,0.14)' : 'var(--shadow-card)'
  }

  if (layout === 'horizontal') {
    return (
      <Link href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
        <article style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
          overflow: 'hidden', display: 'flex', boxShadow: 'var(--shadow-card)',
          transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'pointer' }}
          onMouseEnter={e => hover(e.currentTarget, true)}
          onMouseLeave={e => hover(e.currentTarget, false)}
        >
          <div style={{ width: 200, flexShrink: 0, minHeight: 140,
            background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--cream)',
            position: 'relative' }}>
            {im.destaque && (
              <span style={{ position: 'absolute', top: 10, left: 10, background: 'var(--gold)',
                color: 'var(--navy-deep)', fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 99, textTransform: 'uppercase' }}>★ Destaque</span>
            )}
          </div>
          <div style={{ padding: '16px 20px', flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 2 }}>Preço de pedida</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
              color: 'var(--gold)', marginBottom: 6 }}>{fmtBRL(im.preco)}</div>
            <h3 style={{ fontSize: 15, color: 'var(--navy)', fontWeight: 600,
              margin: '0 0 4px', lineHeight: 1.3 }}>{im.titulo}</h3>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 8 }}>
              {im.bairro}{im.cidade && im.bairro ? ', ' : ''}{im.cidade}
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--fg-2)', flexWrap: 'wrap' }}>
              {im.area_m2 && <span>{im.area_m2} m²</span>}
              {im.quartos && <span>{im.quartos} qtos</span>}
              {im.suites && <span>{im.suites} suítes</span>}
              {im.vagas && <span>{im.vagas} vaga{im.vagas > 1 ? 's' : ''}</span>}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
      <article style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
        overflow: 'hidden', boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'pointer' }}
        onMouseEnter={e => hover(e.currentTarget, true)}
        onMouseLeave={e => hover(e.currentTarget, false)}
      >
        <div style={{ height: 220, position: 'relative',
          background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--cream)' }}>
          {im.destaque && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gold)',
              color: 'var(--navy-deep)', fontSize: 10, fontWeight: 700, padding: '3px 10px',
              borderRadius: 99, textTransform: 'uppercase' }}>★ Destaque</span>
          )}
          <span style={{ position: 'absolute', bottom: 10, left: 12,
            background: 'rgba(15,34,68,0.85)', color: 'var(--gold-soft)',
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4,
            textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {im.plano_label ?? im.tipo}
          </span>
        </div>
        <div style={{ padding: '18px 22px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 2 }}>Preço de pedida</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
            color: 'var(--gold)', marginBottom: 4 }}>{fmtBRL(im.preco)}</div>
          <h3 style={{ fontSize: 16, color: 'var(--navy)', fontWeight: 600,
            margin: '8px 0 4px', lineHeight: 1.3 }}>{im.titulo}</h3>
          <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
            {im.bairro}{im.cidade && im.bairro ? ', ' : ''}{im.cidade}
          </div>
          {(im.area_m2 || im.quartos || im.vagas) && (
            <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12.5, color: 'var(--fg-2)' }}>
              {im.area_m2 && <span>{im.area_m2} m²</span>}
              {im.quartos && <span>{im.quartos} qtos</span>}
              {im.vagas && <span>{im.vagas} vaga{im.vagas > 1 ? 's' : ''}</span>}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

function MapResults({ listings }: { listings: any[] }) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return
    import('leaflet').then(({ default: L }) => {
      const map = L.map(mapDivRef.current!, { center: [-19.963, -43.950], zoom: 12 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      listings.forEach(l => {
        if (!l.lat || !l.lng) return
        const makeIcon = (active: boolean) => L.divIcon({
          html: `<div class="vnp-map-pin${active ? ' active' : ''}">${fmtBRLshort(l.preco)}</div>`,
          iconAnchor: [0, 40],
          className: '',
        })
        const marker = L.marker([l.lat, l.lng], { icon: makeIcon(false) })
        marker.addTo(map)
        marker.bindPopup(
          `<div style="min-width:180px">` +
          `<div style="font-weight:700;font-size:14px;margin-bottom:4px">${l.titulo}</div>` +
          `<div style="color:#555;font-size:12px;margin-bottom:6px">${l.bairro}, ${l.cidade}</div>` +
          `<div style="font-weight:800;font-size:16px;color:#1B2733">${fmtBRL(l.preco)}</div>` +
          `<div style="margin-top:8px"><a href="/imovel/${l.id}" style="color:#D4A857;font-weight:700;font-size:13px">Ver imóvel →</a></div>` +
          `</div>`,
          { maxWidth: 220 }
        )
        marker.on('mouseover', () => { marker.setIcon(makeIcon(true)); setActiveId(l.id) })
        marker.on('mouseout', () => { marker.setIcon(makeIcon(false)); setActiveId(null) })
      })

      mapRef.current = map
      setTimeout(() => map.invalidateSize(), 120)
    })
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18,
      height: 'calc(100vh - 200px)', minHeight: 460 }}>
      <div ref={mapDivRef} style={{ borderRadius: 14, overflow: 'hidden',
        border: '1px solid var(--border)', minHeight: 460, zIndex: 0 }} />
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 4 }}>
        {listings.map(l => (
          <div key={l.id} style={{ outline: activeId === l.id ? '2px solid var(--gold)' : 'none',
            borderRadius: 14, transition: 'outline 0.15s' }}>
            <ImovelCard im={l} layout="horizontal" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '60px 30px',
      textAlign: 'center', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 40, color: 'var(--gold)' }}>◇</div>
      <h3 style={{ marginTop: 16 }}>Nenhum imóvel encontrado</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 360, margin: '0 auto 18px' }}>
        Tente ajustar seus filtros ou ampliar a busca para outros bairros.
      </p>
      <Btn variant="accent" onClick={onClear}>Limpar filtros</Btn>
    </div>
  )
}

const EMPTY_FILTERS = {
  op: 'compra', q: '', tipo: '',
  bairros: [] as string[],
  quartos: 0, suites: 0, vagas: 0,
  priceMin: '', priceMax: '', priceRange: '',
  areaMin: '', areaMax: '',
  onlyFeatured: false, onlyNew: false,
}

function BuscaContent() {
  const params = useSearchParams()
  const supabase = createClient()
  const isMobile = useIsMobile()

  const [allImoveis, setAllImoveis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    op: params.get('op') ?? 'compra',
    q: params.get('q') ?? '',
    tipo: params.get('tipo') ?? '',
  })
  const [sort, setSort] = useState('relevance')
  const [layout, setLayout] = useState<'grid' | 'list' | 'map'>('grid')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    if (!supabase) return
    setLoading(true)
    supabase.from('imoveis').select('*').eq('status', 'ativo')
      .order('destaque', { ascending: false })
      .order('criado_em', { ascending: false })
      .then(({ data }) => {
        setAllImoveis(data ?? [])
        setLoading(false)
      })
  }, [])

  const allBairros = useMemo(() => {
    const seen = new Set<string>()
    allImoveis.forEach(l => l.bairro && seen.add(l.bairro))
    return Array.from(seen)
  }, [allImoveis])

  const results = useMemo(() => {
    let r = allImoveis.filter(l => {
      if (filters.op === 'compra' && l.operacao !== 'venda') return false
      if (filters.op === 'lancamento' && l.operacao !== 'lancamento') return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (
          !(l.titulo ?? '').toLowerCase().includes(q) &&
          !(l.bairro ?? '').toLowerCase().includes(q) &&
          !(l.cidade ?? '').toLowerCase().includes(q) &&
          !(l.codigo ?? '').toLowerCase().includes(q)
        ) return false
      }
      if (filters.tipo && (l.tipo ?? '').toLowerCase() !== filters.tipo.toLowerCase()) return false
      if (filters.bairros.length && !filters.bairros.includes(l.bairro)) return false
      if (filters.quartos && (l.quartos ?? 0) < filters.quartos) return false
      if (filters.suites && (l.suites ?? 0) < filters.suites) return false
      if (filters.vagas && (l.vagas ?? 0) < filters.vagas) return false
      const effMin = filters.priceRange
        ? PRICE_RANGES[filters.priceRange]?.[0]
        : (filters.priceMin ? +filters.priceMin : null)
      const effMax = filters.priceRange
        ? PRICE_RANGES[filters.priceRange]?.[1]
        : (filters.priceMax ? +filters.priceMax : null)
      if (effMin && (l.preco ?? 0) < effMin) return false
      if (effMax && (l.preco ?? 0) > effMax) return false
      if (filters.areaMin && (l.area_m2 ?? 0) < +filters.areaMin) return false
      if (filters.areaMax && (l.area_m2 ?? 0) > +filters.areaMax) return false
      if (filters.onlyFeatured && !l.destaque) return false
      if (filters.onlyNew && !l.novo) return false
      return true
    })
    if (sort === 'price_asc') r.sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0))
    if (sort === 'price_desc') r.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0))
    if (sort === 'area_desc') r.sort((a, b) => (b.area_m2 ?? 0) - (a.area_m2 ?? 0))
    if (sort === 'newest') r.sort((a, b) => (b.novo ? 1 : 0) - (a.novo ? 1 : 0))
    return r
  }, [allImoveis, filters, sort])

  const visible = results.slice(0, page * PER_PAGE)

  const setF = (partial: Partial<typeof EMPTY_FILTERS>) =>
    setFilters(f => ({ ...f, ...partial }))

  const clearFilters = () => setFilters(f => ({ ...EMPTY_FILTERS, op: f.op }))

  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: '6px 11px', border: '1px solid',
    borderColor: active ? 'var(--gold)' : 'var(--border)',
    background: active ? 'rgba(201,150,14,0.10)' : '#fff',
    color: active ? 'var(--navy)' : 'var(--fg-2)',
    cursor: 'pointer', borderRadius: 20, fontFamily: 'var(--font-body)',
    fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
  })

  const counterBtn = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '0.45rem 0', border: '1px solid',
    borderColor: active ? 'var(--gold)' : 'var(--border)',
    background: active ? 'rgba(201,150,14,0.1)' : '#fff',
    color: 'var(--navy)', cursor: 'pointer', borderRadius: 6,
    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
  })

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Breadcrumb + headline */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-2)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>Início</Link>
            {' › '}
            <span style={{ color: 'var(--navy)' }}>
              {filters.op === 'lancamento' ? 'Lançamentos' : 'Comprar'}
              {filters.q && ` · ${filters.q}`}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem,2.4vw,1.9rem)', margin: 0 }}>
            {loading ? 'Buscando…' : (
              <>
                {results.length} {results.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                {filters.q && <span style={{ color: 'var(--gold)' }}> em "{filters.q}"</span>}
              </>
            )}
          </h1>
        </div>
      </section>

      {/* Toolbar */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)',
        padding: '12px 0', position: 'sticky', top: 60, zIndex: 50 }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'flex',
          alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <OperationTabsLight value={filters.op} onChange={v => { setF({ op: v }); setPage(1) }} />
            {isMobile && (
              <button onClick={() => setMobileFiltersOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.9rem',
                border: mobileFiltersOpen ? '1px solid var(--gold)' : '1px solid var(--border)',
                borderRadius: 8,
                background: mobileFiltersOpen ? 'rgba(212,168,87,0.12)' : '#fff',
                color: mobileFiltersOpen ? 'var(--gold-deep)' : 'var(--navy)',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>⊞ Filtros</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ ...IS, padding: '0.5rem 0.7rem', fontSize: 13, width: 'auto' }}>
              <option value="relevance">Mais relevantes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="area_desc">Maior área</option>
              <option value="newest">Recém adicionados</option>
            </select>
            {!isMobile && (
              <div style={{ display: 'inline-flex', border: '1px solid var(--border)',
                borderRadius: 8, overflow: 'hidden' }}>
                {([['grid', '▦'], ['list', '☰'], ['map', '◉']] as const).map(([id, icon]) => (
                  <button key={id} onClick={() => setLayout(id)} style={{
                    border: 'none', cursor: 'pointer', padding: '0.5rem 0.85rem',
                    background: layout === id ? 'var(--navy)' : 'transparent',
                    color: layout === id ? 'var(--gold)' : 'var(--navy)',
                    fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600,
                  }}>{icon}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '24px 0 60px' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'grid',
          gap: 24, gridTemplateColumns: isMobile ? '1fr' : '280px 1fr' }}>

          {/* Sidebar filters */}
          <aside style={{
            position: isMobile ? 'static' : 'sticky', top: 130, alignSelf: 'start',
            background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
            padding: 20, boxShadow: '0 8px 32px rgba(15,34,68,0.06)',
            maxHeight: isMobile ? 'none' : 'calc(100vh - 150px)', overflowY: 'auto',
            display: isMobile && !mobileFiltersOpen ? 'none' : 'block',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600,
              color: 'var(--navy)', marginBottom: 4 }}>Refinar busca</div>
            <button onClick={clearFilters} style={{
              background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 600, padding: 0,
              marginBottom: 18, textDecoration: 'underline',
            }}>Limpar filtros</button>

            <FilterGroup title="Localização">
              <input type="text" placeholder="Bairro, cidade ou código"
                value={filters.q} onChange={e => { setF({ q: e.target.value }); setPage(1) }}
                style={IS} />
            </FilterGroup>

            <FilterGroup title="Tipo de imóvel">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['', 'Apartamento', 'Casa', 'Cobertura', 'Studio', 'Loft', 'Casa de condomínio', 'Terreno', 'Loteamento'].map(t => (
                  <button key={t} onClick={() => { setF({ tipo: t }); setPage(1) }}
                    style={pillBtn(filters.tipo === t)}>
                    {t || 'Todos'}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Faixa de preço">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {([
                  ['', 'Qualquer'],
                  ['ate500', 'Até R$ 500k'],
                  ['500-1M', 'R$ 500k–1M'],
                  ['1M-2M', 'R$ 1M–2M'],
                  ['2M-5M', 'R$ 2M–5M'],
                  ['acima5M', 'Acima R$ 5M'],
                ] as const).map(([k, lbl]) => (
                  <button key={k} onClick={() => { setF({ priceRange: k, priceMin: '', priceMax: '' }); setPage(1) }}
                    style={{ ...pillBtn(filters.priceRange === k), fontSize: 11.5 }}>
                    {lbl}
                  </button>
                ))}
              </div>
              {!filters.priceRange && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" placeholder="Mín R$" value={filters.priceMin}
                    onChange={e => { setF({ priceMin: e.target.value }); setPage(1) }}
                    style={{ ...IS, fontSize: 12.5 }} />
                  <input type="number" placeholder="Máx R$" value={filters.priceMax}
                    onChange={e => { setF({ priceMax: e.target.value }); setPage(1) }}
                    style={{ ...IS, fontSize: 12.5 }} />
                </div>
              )}
            </FilterGroup>

            <FilterGroup title="Quartos">
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => { setF({ quartos: n }); setPage(1) }}
                    style={counterBtn(filters.quartos === n)}>
                    {n === 0 ? 'T' : `${n}+`}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Suítes">
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => { setF({ suites: n }); setPage(1) }}
                    style={counterBtn(filters.suites === n)}>
                    {n === 0 ? 'T' : `${n}+`}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Vagas de garagem">
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => { setF({ vagas: n }); setPage(1) }}
                    style={counterBtn(filters.vagas === n)}>
                    {n === 0 ? 'T' : `${n}+`}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Área (m²)">
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="number" placeholder="Mín" value={filters.areaMin}
                  onChange={e => { setF({ areaMin: e.target.value }); setPage(1) }}
                  style={{ ...IS, fontSize: 12.5 }} />
                <input type="number" placeholder="Máx" value={filters.areaMax}
                  onChange={e => { setF({ areaMax: e.target.value }); setPage(1) }}
                  style={{ ...IS, fontSize: 12.5 }} />
              </div>
            </FilterGroup>

            {allBairros.length > 0 && (
              <FilterGroup title="Bairros">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {allBairros.map(b => (
                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--navy)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={filters.bairros.includes(b)}
                        onChange={e => {
                          const next = e.target.checked
                            ? [...filters.bairros, b]
                            : filters.bairros.filter(x => x !== b)
                          setF({ bairros: next })
                          setPage(1)
                        }}
                        style={{ accentColor: 'var(--gold)' }} />
                      {b}
                    </label>
                  ))}
                </div>
              </FilterGroup>
            )}

            <FilterGroup title="Outros">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--navy)',
                cursor: 'pointer', marginBottom: 6 }}>
                <input type="checkbox" checked={filters.onlyFeatured}
                  onChange={e => { setF({ onlyFeatured: e.target.checked }); setPage(1) }}
                  style={{ accentColor: 'var(--gold)' }} />
                Apenas em destaque
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.onlyNew}
                  onChange={e => { setF({ onlyNew: e.target.checked }); setPage(1) }}
                  style={{ accentColor: 'var(--gold)' }} />
                Recém adicionados
              </label>
            </FilterGroup>
          </aside>

          {/* Results */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%',
                  border: '3px solid var(--border)', borderTopColor: 'var(--gold)',
                  animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : layout === 'map' ? (
              <MapResults listings={results} />
            ) : visible.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <>
                <div style={{
                  display: 'grid', gap: 20,
                  gridTemplateColumns: layout === 'list'
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(280px, 1fr))',
                }}>
                  {visible.map(l => (
                    <ImovelCard key={l.id} im={l} layout={layout === 'list' ? 'horizontal' : 'grid'} />
                  ))}
                </div>
                {visible.length < results.length && (
                  <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <Btn variant="ghost" onClick={() => setPage(p => p + 1)}>
                      Mostrar mais {Math.min(PER_PAGE, results.length - visible.length)} imóveis
                    </Btn>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .vnp-map-pin {
          background: var(--navy-deep); color: var(--gold);
          font-family: var(--font-body); font-size: 11px; font-weight: 700;
          padding: 4px 8px; border-radius: 6px; white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 1.5px solid var(--gold);
          position: relative;
        }
        .vnp-map-pin::after {
          content: ''; position: absolute; bottom: -6px; left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: var(--navy-deep);
        }
        .vnp-map-pin.active {
          background: var(--gold); color: var(--navy-deep);
        }
        .vnp-map-pin.active::after {
          border-top-color: var(--gold);
        }
      `}</style>
    </main>
  )
}

export default function BuscaPage() {
  return <Suspense><BuscaContent /></Suspense>
}
