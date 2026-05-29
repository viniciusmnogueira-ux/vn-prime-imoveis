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

function HeartBtn({ id }: { id: string }) {
  const [fav, setFav] = useState(false)
  useEffect(() => {
    const favs: string[] = JSON.parse(localStorage.getItem('vnp_favs') ?? '[]')
    setFav(favs.includes(id))
  }, [id])
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const favs: string[] = JSON.parse(localStorage.getItem('vnp_favs') ?? '[]')
    const next = fav ? favs.filter(f => f !== id) : [...favs, id]
    localStorage.setItem('vnp_favs', JSON.stringify(next))
    setFav(!fav)
  }
  return (
    <button onClick={toggle} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', color: fav ? '#DC2626' : '#94A3B8', transition: 'color 0.15s' }}>
      {fav ? '♥' : '♡'}
    </button>
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
          {im.verificado && (
            <span style={{ position: 'absolute', top: im.destaque ? 38 : 12, left: 12, background: '#059669', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>✓ Verificado</span>
          )}
          {im.novo && !im.destaque && !im.verificado && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: '#3B82F6', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase' }}>NOVO</span>
          )}
          <span style={{ position: 'absolute', bottom: 10, left: 12,
            background: 'rgba(15,34,68,0.85)', color: 'var(--gold-soft)',
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4,
            textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {im.plano_label ?? im.tipo}
          </span>
          <HeartBtn id={im.id} />
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
    <div style={{ background: '#fff', borderRadius: 14, padding: '48px 30px 36px', textAlign: 'center', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 40, color: 'var(--gold)' }}>◇</div>
      <h3 style={{ marginTop: 16, marginBottom: 8 }}>Nenhum imóvel encontrado</h3>
      <p style={{ color: 'var(--fg-2)', maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.6 }}>
        Nenhum imóvel combina com esses filtros agora. Tente ampliar a busca ou peça ajuda a um especialista.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
        <Btn variant="accent" onClick={onClear}>Limpar filtros</Btn>
        <a href="https://wa.me/5531984144250?text=Ol%C3%A1!%20N%C3%A3o%20encontrei%20o%20im%C3%B3vel%20que%20preciso.%20Pode%20me%20ajudar%3F"
          target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Btn variant="ghost">Falar com especialista</Btn>
        </a>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, fontSize: 13, color: 'var(--fg-2)', marginBottom: 12 }}>
        Sugestões de busca
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Savassi', 'Belvedere', 'Lourdes', 'Nova Lima', 'Apartamentos', 'Casas'].map(s => (
          <a key={s} href={`/busca?q=${encodeURIComponent(s)}`}
            style={{ padding: '5px 14px', borderRadius: 99, border: '1px solid var(--border)', fontSize: 13, color: 'var(--navy)', textDecoration: 'none', fontWeight: 600 }}>
            {s}
          </a>
        ))}
      </div>
    </div>
  )
}

const AMENIDADES_OPTS = ['Piscina', 'Academia', 'Churrasqueira', 'Varanda', 'Salão de festas', 'Pet-friendly', 'Playground', 'Segurança 24h']

const EMPTY_FILTERS = {
  op: 'compra', q: '', tipo: '',
  bairros: [] as string[],
  quartos: 0, suites: 0, vagas: 0,
  priceMin: '', priceMax: '', priceRange: '',
  areaMin: '', areaMax: '',
  amenidades: [] as string[],
  onlyFeatured: false, onlyNew: false, onlyWithPhotos: false,
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
  const [savedSearches, setSavedSearches] = useState<Array<{label: string; filters: typeof EMPTY_FILTERS}>>([])
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [shareCopied, setShareCopied] = useState(false)
  const [recentIds, setRecentIds] = useState<string[]>([])

  useEffect(() => {
    try { setSavedSearches(JSON.parse(localStorage.getItem('vnp_saved_searches') ?? '[]')) } catch {}
    try { setCompareIds(JSON.parse(localStorage.getItem('vnp_compare') ?? '[]')) } catch {}
    try { setRecentIds(JSON.parse(localStorage.getItem('vnp_recent') ?? '[]')) } catch {}
  }, [])

  const saveSearch = () => {
    const hasFilters = filters.q || filters.tipo || filters.bairros.length || filters.quartos || filters.priceRange || filters.priceMin || filters.priceMax
    if (!hasFilters) return
    const label = [filters.q, filters.tipo, filters.bairros.join('/'), filters.quartos ? `${filters.quartos}+ qtos` : '', filters.priceRange || (filters.priceMin ? `R$${filters.priceMin}+` : '')].filter(Boolean).join(' · ')
    const next = [{ label, filters }, ...savedSearches.filter(s => s.label !== label)].slice(0, 5)
    setSavedSearches(next)
    localStorage.setItem('vnp_saved_searches', JSON.stringify(next))
  }

  const removeSavedSearch = (label: string) => {
    const next = savedSearches.filter(s => s.label !== label)
    setSavedSearches(next)
    localStorage.setItem('vnp_saved_searches', JSON.stringify(next))
  }

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
      if (filters.onlyWithPhotos && (!l.fotos || l.fotos.length === 0)) return false
      if (filters.amenidades.length) {
        const desc = ((l.descricao ?? '') + ' ' + (l.titulo ?? '')).toLowerCase()
        const ams: string[] = l.amenidades ?? []
        for (const a of filters.amenidades) {
          if (!ams.includes(a) && !desc.includes(a.toLowerCase())) return false
        }
      }
      return true
    })
    if (sort === 'price_asc') r.sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0))
    if (sort === 'price_desc') r.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0))
    if (sort === 'area_desc') r.sort((a, b) => (b.area_m2 ?? 0) - (a.area_m2 ?? 0))
    if (sort === 'newest') r.sort((a, b) => (b.novo ? 1 : 0) - (a.novo ? 1 : 0))
    if (sort === 'price_m2_asc') r.sort((a, b) => {
      const aM2 = (a.area_m2 && a.preco) ? a.preco / a.area_m2 : Infinity
      const bM2 = (b.area_m2 && b.preco) ? b.preco / b.area_m2 : Infinity
      return aM2 - bM2
    })
    return r
  }, [allImoveis, filters, sort])

  const visible = results.slice(0, page * PER_PAGE)

  const setF = (partial: Partial<typeof EMPTY_FILTERS>) =>
    setFilters(f => ({ ...f, ...partial }))

  const clearFilters = () => setFilters(f => ({ ...EMPTY_FILTERS, op: f.op }))

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
      localStorage.setItem('vnp_compare', JSON.stringify(next))
      return next
    })
  }

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
            {isMobile && (() => {
              const activeCount = [filters.tipo, filters.priceRange || filters.priceMin || filters.priceMax, filters.quartos || null, filters.suites || null, filters.vagas || null, filters.areaMin || filters.areaMax || null, ...filters.bairros, ...filters.amenidades, filters.onlyFeatured || null, filters.onlyNew || null, filters.onlyWithPhotos || null].filter(Boolean).length
              return (
                <button onClick={() => setMobileFiltersOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.9rem',
                  border: mobileFiltersOpen ? '1px solid var(--gold)' : '1px solid var(--border)',
                  borderRadius: 8,
                  background: mobileFiltersOpen ? 'rgba(212,168,87,0.12)' : '#fff',
                  color: mobileFiltersOpen ? 'var(--gold-deep)' : 'var(--navy)',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer', position: 'relative',
                }}>
                  ⊞ Filtros
                  {activeCount > 0 && <span style={{ background: 'var(--gold)', color: 'var(--navy-deep)', borderRadius: 99, fontSize: 10, fontWeight: 800, padding: '1px 5px', marginLeft: 2 }}>{activeCount}</span>}
                </button>
              )
            })()}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/favoritos" style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 8, background: '#fff', whiteSpace: 'nowrap' }}>
              ♡ Favoritos
            </Link>
            <button onClick={() => {
              const p = new URLSearchParams()
              if (filters.op !== 'compra') p.set('op', filters.op)
              if (filters.q) p.set('q', filters.q)
              if (filters.tipo) p.set('tipo', filters.tipo)
              if (filters.priceRange) p.set('pr', filters.priceRange)
              if (filters.quartos) p.set('qtos', String(filters.quartos))
              const url = `${window.location.origin}/busca${p.toString() ? '?' + p.toString() : ''}`
              navigator.clipboard.writeText(url).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000) })
            }} style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: shareCopied ? '#059669' : 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 4, padding: '0.5rem 0.75rem', border: `1px solid ${shareCopied ? '#059669' : 'var(--border)'}`, borderRadius: 8, background: '#fff', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              {shareCopied ? '✓ Copiado!' : '↗ Compartilhar'}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowSavedSearches(s => !s)} style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 4, padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 8, background: '#fff', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                🔔 Alertas {savedSearches.length > 0 && <span style={{ background: 'var(--gold)', color: 'var(--navy-deep)', borderRadius: 99, fontSize: 10, fontWeight: 800, padding: '1px 5px' }}>{savedSearches.length}</span>}
              </button>
              {showSavedSearches && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 12, minWidth: 280, zIndex: 200, boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Buscas salvas</div>
                  {savedSearches.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--fg-2)', padding: '8px 4px' }}>Nenhuma busca salva ainda.</div>
                  ) : savedSearches.map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>
                      <button onClick={() => { setFilters(f => ({ ...f, ...s.filters })); setPage(1); setShowSavedSearches(false) }} style={{ flex: 1, background: 'none', border: 'none', textAlign: 'left', fontSize: 12.5, color: 'var(--navy)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0 }}>{s.label}</button>
                      <button onClick={() => removeSavedSearch(s.label)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 14, padding: '0 2px' }}>✕</button>
                    </div>
                  ))}
                  <button onClick={saveSearch} style={{ marginTop: 10, width: '100%', padding: '8px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    + Salvar busca atual
                  </button>
                </div>
              )}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ ...IS, padding: '0.5rem 0.7rem', fontSize: 13, width: 'auto' }}>
              <option value="relevance">Mais relevantes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="price_m2_asc">Menor preço/m²</option>
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

      {/* Active filters summary */}
      {(() => {
        const chips: { label: string; onRemove: () => void }[] = []
        if (filters.tipo) chips.push({ label: filters.tipo, onRemove: () => setF({ tipo: '' }) })
        if (filters.priceRange) chips.push({ label: { ate500: 'Até R$ 500k', '500-1M': 'R$ 500k–1M', '1M-2M': 'R$ 1M–2M', '2M-5M': 'R$ 2M–5M', acima5M: 'Acima R$ 5M' }[filters.priceRange] ?? filters.priceRange, onRemove: () => setF({ priceRange: '' }) })
        if (filters.priceMin) chips.push({ label: `Mín R$ ${filters.priceMin}`, onRemove: () => setF({ priceMin: '' }) })
        if (filters.priceMax) chips.push({ label: `Máx R$ ${filters.priceMax}`, onRemove: () => setF({ priceMax: '' }) })
        if (filters.quartos) chips.push({ label: `${filters.quartos}+ quartos`, onRemove: () => setF({ quartos: 0 }) })
        if (filters.suites) chips.push({ label: `${filters.suites}+ suítes`, onRemove: () => setF({ suites: 0 }) })
        if (filters.vagas) chips.push({ label: `${filters.vagas}+ vagas`, onRemove: () => setF({ vagas: 0 }) })
        if (filters.areaMin) chips.push({ label: `Área ≥ ${filters.areaMin}m²`, onRemove: () => setF({ areaMin: '' }) })
        if (filters.areaMax) chips.push({ label: `Área ≤ ${filters.areaMax}m²`, onRemove: () => setF({ areaMax: '' }) })
        filters.bairros.forEach(b => chips.push({ label: b, onRemove: () => setF({ bairros: filters.bairros.filter(x => x !== b) }) }))
        filters.amenidades.forEach(a => chips.push({ label: a, onRemove: () => setF({ amenidades: filters.amenidades.filter(x => x !== a) }) }))
        if (filters.onlyFeatured) chips.push({ label: 'Só destaques', onRemove: () => setF({ onlyFeatured: false }) })
        if (filters.onlyNew) chips.push({ label: 'Recém adicionados', onRemove: () => setF({ onlyNew: false }) })
        if (filters.onlyWithPhotos) chips.push({ label: 'Com fotos', onRemove: () => setF({ onlyWithPhotos: false }) })
        if (!chips.length) return null
        return (
          <div style={{ background: 'rgba(212,168,87,0.06)', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
            <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Filtros:</span>
              {chips.map(c => (
                <span key={c.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(212,168,87,0.15)', border: '1px solid rgba(212,168,87,0.35)', fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>
                  {c.label}
                  <button onClick={c.onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', fontSize: 13, lineHeight: 1, padding: 0 }}>✕</button>
                </span>
              ))}
              <button onClick={clearFilters} style={{ fontSize: 11, color: 'var(--gold-deep)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', textDecoration: 'underline', marginLeft: 4 }}>Limpar tudo</button>
            </div>
          </div>
        )
      })()}

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
                {['', 'Apartamento', 'Casa', 'Cobertura', 'Studio', 'Loft', 'Casa de condomínio', 'Condomínio', 'Terreno', 'Loteamento', 'Lote', 'Sala Comercial'].map(t => (
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

            <FilterGroup title="Amenidades">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {AMENIDADES_OPTS.map(a => (
                  <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--navy)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filters.amenidades.includes(a)}
                      onChange={e => { const next = e.target.checked ? [...filters.amenidades, a] : filters.amenidades.filter(x => x !== a); setF({ amenidades: next }); setPage(1) }}
                      style={{ accentColor: 'var(--gold)' }} />
                    {a}
                  </label>
                ))}
              </div>
            </FilterGroup>

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
                fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--navy)', cursor: 'pointer', marginBottom: 6 }}>
                <input type="checkbox" checked={filters.onlyNew}
                  onChange={e => { setF({ onlyNew: e.target.checked }); setPage(1) }}
                  style={{ accentColor: 'var(--gold)' }} />
                Recém adicionados
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--navy)', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.onlyWithPhotos}
                  onChange={e => { setF({ onlyWithPhotos: e.target.checked }); setPage(1) }}
                  style={{ accentColor: 'var(--gold)' }} />
                Apenas com fotos
              </label>
            </FilterGroup>
          </aside>

          {/* Results */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: 220, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                    <div style={{ padding: '18px 20px' }}>
                      <div style={{ height: 10, width: '45%', borderRadius: 4, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 8 }} />
                      <div style={{ height: 22, width: '60%', borderRadius: 6, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 8 }} />
                      <div style={{ height: 14, width: '80%', borderRadius: 4, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 6 }} />
                      <div style={{ height: 12, width: '55%', borderRadius: 4, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : layout === 'map' ? (
              <MapResults listings={results} />
            ) : visible.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <>
                {(() => {
                  const hasFilter = filters.q || filters.tipo || filters.bairros.length || filters.quartos || filters.priceRange || filters.priceMin || filters.priceMax || filters.amenidades.length || filters.onlyFeatured || filters.onlyNew
                  const recItems = recentIds.length > 0 && !hasFilter
                    ? allImoveis.filter(im => recentIds.includes(im.id)).slice(0, 4)
                    : []
                  if (!recItems.length) return null
                  return (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-3)', marginBottom: 12 }}>Vistos recentemente</div>
                      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
                        {recItems.map(im => (
                          <Link key={im.id} href={`/imovel/${im.id}`} style={{ textDecoration: 'none', flexShrink: 0, width: 200 }}>
                            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(15,34,68,0.12)' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                              <div style={{ height: 110, background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--cream)' }} />
                              <div style={{ padding: '10px 12px' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--gold)', marginBottom: 2 }}>{fmtBRL(im.preco)}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{im.titulo}</div>
                                <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 2 }}>{im.bairro}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })()}
                {results.length >= 2 && (() => {
                  const prices = results.filter(r => r.preco > 0).map(r => r.preco)
                  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
                  const minP = prices.length ? Math.min(...prices) : 0
                  const maxP = prices.length ? Math.max(...prices) : 0
                  return (
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14, padding: '10px 16px', background: 'rgba(212,168,87,0.07)', border: '1px solid rgba(212,168,87,0.22)', borderRadius: 10, alignItems: 'center' }}>
                      {[
                        { label: 'Preço médio', value: fmtBRL(avg) },
                        { label: 'Menor preço', value: fmtBRL(minP) },
                        { label: 'Maior preço', value: fmtBRL(maxP) },
                      ].map(s => (
                        <div key={s.label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600 }}>{s.label}:</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)' }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )
                })()}
                <div style={{
                  display: 'grid', gap: 20,
                  gridTemplateColumns: layout === 'list'
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(280px, 1fr))',
                }}>
                  {visible.map(l => {
                    const inCompare = compareIds.includes(l.id)
                    const atMax = compareIds.length >= 3 && !inCompare
                    return (
                      <div key={l.id} style={{ position: 'relative' }}>
                        <ImovelCard im={l} layout={layout === 'list' ? 'horizontal' : 'grid'} />
                        <button
                          onClick={e => { e.preventDefault(); if (!atMax) toggleCompare(l.id) }}
                          title={atMax ? 'Máximo de 3 imóveis para comparar' : (inCompare ? 'Remover da comparação' : 'Adicionar à comparação')}
                          style={{
                            position: 'absolute', bottom: layout === 'list' ? 16 : 12, right: layout === 'list' ? 16 : 12,
                            padding: '5px 11px', borderRadius: 7, border: `1.5px solid ${inCompare ? 'var(--gold)' : 'var(--border)'}`,
                            background: inCompare ? 'var(--gold)' : 'rgba(255,255,255,0.92)',
                            color: inCompare ? 'var(--navy-deep)' : atMax ? 'var(--fg-3)' : 'var(--navy)',
                            fontSize: 11.5, fontWeight: 700, cursor: atMax ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', backdropFilter: 'blur(4px)', opacity: atMax ? 0.5 : 1,
                            transition: 'all 0.15s', zIndex: 2,
                          }}>
                          {inCompare ? '✓ Comparar' : '⚖ Comparar'}
                        </button>
                      </div>
                    )
                  })}
                </div>
                {visible.length < results.length && (
                  <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <Btn variant="ghost" onClick={() => setPage(p => p + 1)}>
                      Mostrar mais {Math.min(PER_PAGE, results.length - visible.length)} imóveis
                    </Btn>
                  </div>
                )}

                {/* Floating compare bar */}
                {compareIds.length > 0 && (
                  <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'var(--navy)', borderRadius: 14, boxShadow: '0 8px 40px rgba(15,34,68,0.35)', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 16, minWidth: 320 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>
                      {compareIds.length} {compareIds.length === 1 ? 'imóvel' : 'imóveis'} selecionado{compareIds.length > 1 ? 's' : ''}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href="/comparar" style={{ textDecoration: 'none', padding: '8px 18px', borderRadius: 8, background: 'var(--gradient-gold)', color: 'var(--navy)', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
                        Comparar →
                      </Link>
                      <button onClick={() => { setCompareIds([]); localStorage.removeItem('vnp_compare') }} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Limpar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
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
