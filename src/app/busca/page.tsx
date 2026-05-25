'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtBRL } from '@/lib/utils'
import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

function BuscaContent() {
  const params = useSearchParams()
  const supabase = createClient()

  const [imoveis, setImoveis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    operacao: params.get('operacao') ?? 'venda',
    tipo: params.get('tipo') ?? '',
    bairro: params.get('bairro') ?? '',
    precoMax: '',
  })

  useEffect(() => { buscar() }, [filtros.operacao, filtros.tipo])

  async function buscar() {
    setLoading(true)
    let q = supabase.from('imoveis').select('*').eq('status', 'ativo').eq('operacao', filtros.operacao).order('destaque', { ascending: false }).order('criado_em', { ascending: false })
    if (filtros.tipo) q = q.eq('tipo', filtros.tipo)
    if (filtros.bairro) q = q.ilike('bairro', `%${filtros.bairro}%`)
    if (filtros.precoMax) q = q.lte('preco', parseFloat(filtros.precoMax.replace(/\D/g, '')))
    const { data } = await q.limit(50)
    setImoveis(data ?? [])
    setLoading(false)
  }

  const set = (k: string, v: string) => setFiltros(f => ({ ...f, [k]: v }))

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Filtros */}
      <div style={{ background: 'var(--navy-deep)', padding: '28px 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <Eyebrow color="var(--gold)">Buscar imóveis</Eyebrow>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            {/* Operação */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
              {['venda','aluguel'].map(op => (
                <button key={op} onClick={() => set('operacao', op)} style={{
                  padding: '9px 18px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  background: filtros.operacao === op ? 'var(--gold)' : 'transparent',
                  color: filtros.operacao === op ? 'var(--navy-deep)' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.15s',
                }}>{op === 'venda' ? 'Comprar' : 'Alugar'}</button>
              ))}
            </div>
            <input placeholder="Bairro ou cidade..." value={filtros.bairro} onChange={e => set('bairro', e.target.value)}
              style={{ padding: '9px 14px', borderRadius: 8, border: 'none', fontSize: 13, minWidth: 180, outline: 'none' }}
              onKeyDown={e => e.key === 'Enter' && buscar()} />
            <select value={filtros.tipo} onChange={e => set('tipo', e.target.value)}
              style={{ padding: '9px 14px', borderRadius: 8, border: 'none', fontSize: 13, outline: 'none' }}>
              <option value="">Todos os tipos</option>
              {['apartamento','casa','cobertura','terreno','comercial'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
              ))}
            </select>
            <Btn variant="accent" size="sm" onClick={buscar}>Buscar</Btn>
          </div>
        </div>
      </div>

      <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', padding: '32px 0' }}>
        <div style={{ marginBottom: 20, fontSize: 14, color: 'var(--fg-2)' }}>
          {loading ? 'Buscando...' : `${imoveis.length} imóvel(is) encontrado(s)`}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="animate-spin" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
          </div>
        ) : imoveis.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ marginBottom: 8 }}>Nenhum imóvel encontrado</h3>
            <p style={{ color: 'var(--fg-2)' }}>Tente outros filtros ou{' '}
              <Link href="/anunciar" style={{ color: 'var(--gold)', fontWeight: 700 }}>anuncie o seu</Link>.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {imoveis.map(im => (
              <ImovelCard key={im.id} im={im} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ImovelCard({ im }: { im: any }) {
  return (
    <Link href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
      <article style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'pointer' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 44px rgba(15,34,68,0.14)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)' }}
      >
        <div style={{ height: 220, background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--cream)', position: 'relative' }}>
          {im.destaque && <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase' }}>★ Destaque</span>}
          <span style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(15,34,68,0.85)', color: 'var(--gold-soft)', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {im.plano_label ?? im.tipo}
          </span>
        </div>
        <div style={{ padding: '18px 22px 22px' }}>
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 2 }}>Preço de pedida</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: 'var(--gold)' }}>{fmtBRL(im.preco)}</div>
          </div>
          <h3 style={{ fontSize: 16, color: 'var(--navy)', fontWeight: 600, margin: '8px 0 4px', lineHeight: 1.3 }}>{im.titulo}</h3>
          <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{im.bairro}{im.cidade && im.bairro ? ', ' : ''}{im.cidade}</div>
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

export default function BuscaPage() {
  return <Suspense><BuscaContent /></Suspense>
}
