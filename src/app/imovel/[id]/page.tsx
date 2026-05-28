'use client'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { fmtBRL } from '@/lib/utils'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const chk = () => setM(window.innerWidth <= 768)
    chk(); window.addEventListener('resize', chk)
    return () => window.removeEventListener('resize', chk)
  }, [])
  return m
}

export default function ImovelPage() {
  const { id } = useParams<{ id: string }>()
  const isMobile = useIsMobile()
  const supabase = createClient()
  const [im, setIm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [lead, setLead] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [showVisita, setShowVisita] = useState(false)
  const [visita, setVisita] = useState({ nome: '', email: '', telefone: '', data: '' })
  const [visitaSending, setVisitaSending] = useState(false)
  const [visitaSent, setVisitaSent] = useState(false)
  const [showProposta, setShowProposta] = useState(false)
  const [proposta, setProposta] = useState({ nome: '', email: '', telefone: '', valor: '', condicoes: '' })
  const [propostaSending, setPropostaSending] = useState(false)
  const [propostaSent, setPropostaSent] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [similares, setSimilares] = useState<any[]>([])
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    const favs: string[] = JSON.parse(localStorage.getItem('vnp_favs') ?? '[]')
    setIsFav(favs.includes(id))
  }, [id])

  function toggleFav() {
    const favs: string[] = JSON.parse(localStorage.getItem('vnp_favs') ?? '[]')
    const next = isFav ? favs.filter(f => f !== id) : [...favs, id]
    localStorage.setItem('vnp_favs', JSON.stringify(next))
    setIsFav(!isFav)
  }

  useEffect(() => {
    supabase.from('imoveis').select('*, profiles!proprietario_id(nome, telefone)').eq('id', id).single()
      .then(({ data }) => {
        setIm(data); setLoading(false)
        if (data?.tipo && data?.bairro) {
          supabase.from('imoveis').select('id, titulo, tipo, bairro, cidade, preco, fotos')
            .eq('status', 'ativo').eq('tipo', data.tipo).neq('id', id).limit(4)
            .then(({ data: sims }) => setSimilares(sims ?? []))
        }
      })
  }, [id])

  const sendLead = async () => {
    if (!lead.nome || !lead.email) return
    setSending(true)
    await supabase.from('leads').insert({
      imovel_id: id,
      proprietario_id: im?.proprietario_id,
      corretor_id: im?.corretor_id,
      nome: lead.nome, email: lead.email,
      telefone: lead.telefone, mensagem: lead.mensagem,
      origem: 'detalhe',
    })
    setSent(true); setSending(false)
  }

  const sendVisita = async () => {
    if (!visita.nome || !visita.email || !visita.data) return
    setVisitaSending(true)
    await supabase.from('leads').insert({
      imovel_id: id,
      proprietario_id: im?.proprietario_id,
      corretor_id: im?.corretor_id,
      nome: visita.nome, email: visita.email, telefone: visita.telefone,
      mensagem: `Agendamento de visita solicitado para: ${visita.data}`,
      origem: 'agendamento',
    })
    setVisitaSent(true); setVisitaSending(false)
  }

  useEffect(() => {
    if (!im?.lat || !im?.lng || !mapRef.current || mapInstance.current) return
    import('leaflet').then(({ default: L }) => {
      const map = L.map(mapRef.current!, { center: [im.lat, im.lng], zoom: 15, zoomControl: true })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map)
      L.circle([im.lat, im.lng], { radius: 120, color: 'var(--gold)', fillColor: 'var(--gold)', fillOpacity: 0.15, weight: 2 }).addTo(map)
      mapInstance.current = map
      setTimeout(() => map.invalidateSize(), 100)
    })
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [im])

  const sendProposta = async () => {
    if (!proposta.nome || !proposta.email || !proposta.valor) return
    setPropostaSending(true)
    await supabase.from('leads').insert({
      imovel_id: id,
      proprietario_id: im?.proprietario_id,
      corretor_id: im?.corretor_id,
      nome: proposta.nome, email: proposta.email, telefone: proposta.telefone,
      mensagem: `Proposta de R$ ${proposta.valor}${proposta.condicoes ? ` | Condições: ${proposta.condicoes}` : ''}`,
      origem: 'proposta',
    })
    setPropostaSent(true); setPropostaSending(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
    </div>
  )
  if (!im) return <div style={{ textAlign: 'center', padding: '80px 0' }}><h2>Imóvel não encontrado.</h2></div>

  const fotos: string[] = im.fotos ?? []

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Lightbox */}
      {lightbox !== null && fotos.length > 0 && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + fotos.length) % fotos.length) }} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', ...lbBtn }}>‹</button>
          <img src={fotos[lightbox]} alt="" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }} />
          <button onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % fotos.length) }} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', ...lbBtn }}>›</button>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 24, ...lbBtn, fontSize: 20 }}>✕</button>
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {fotos.map((_, i) => <span key={i} onClick={e => { e.stopPropagation(); setLightbox(i) }} style={{ width: i === lightbox ? 20 : 7, height: 5, borderRadius: 3, background: i === lightbox ? 'var(--gold)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'width 0.2s' }} />)}
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: 24, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{lightbox + 1} / {fotos.length}</div>
        </div>
      )}

      {/* Fotos */}
      <div onClick={() => fotos.length > 0 && setLightbox(photoIdx)} style={{ position: 'relative', height: 'min(520px, 55vw)', background: fotos[photoIdx] ? `url(${fotos[photoIdx]}) center/cover` : 'var(--navy)', overflow: 'hidden', cursor: fotos.length > 0 ? 'zoom-in' : 'default' }}>
        {fotos.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); setPhotoIdx((photoIdx - 1 + fotos.length) % fotos.length) }} style={navBtn('left')}>‹</button>
            <button onClick={e => { e.stopPropagation(); setPhotoIdx((photoIdx + 1) % fotos.length) }} style={navBtn('right')}>›</button>
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {fotos.map((_, i) => <span key={i} style={{ width: i === photoIdx ? 20 : 7, height: 5, borderRadius: 3, background: i === photoIdx ? 'var(--gold)' : 'rgba(255,255,255,0.5)', transition: 'width 0.2s' }} />)}
            </div>
            <span style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>⊞ Ver todas ({fotos.length})</span>
          </>
        )}
        {fotos.length === 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 64 }}>🏠</div>}
      </div>

      <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', paddingTop: 40, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) min(380px, 38%)', gap: isMobile ? 28 : 40, alignItems: 'start' }}>
        {/* Main */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Eyebrow color="var(--gold-deep)">{im.tipo?.charAt(0).toUpperCase() + im.tipo?.slice(1)} · {im.operacao}</Eyebrow>
            {im.verificado && (
              <span style={{ background: '#059669', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 99, letterSpacing: '0.06em' }}>✓ VN Prime Verificado</span>
            )}
          </div>
          <h1 style={{ marginTop: 10, marginBottom: 8 }}>{im.titulo}</h1>
          <div style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 24 }}>
            {[im.endereco, im.bairro, im.cidade, im.estado].filter(Boolean).join(', ')}
          </div>

          {/* Specs */}
          {(im.area_m2 || im.quartos || im.suites || im.banheiros || im.vagas) && (
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
              {[
                [im.area_m2, `${im.area_m2} m²`],
                [im.quartos, `${im.quartos} quarto${im.quartos !== 1 ? 's' : ''}`],
                [im.suites, `${im.suites} suíte${im.suites !== 1 ? 's' : ''}`],
                [im.banheiros, `${im.banheiros} banheiro${im.banheiros !== 1 ? 's' : ''}`],
                [im.vagas, `${im.vagas} vaga${im.vagas !== 1 ? 's' : ''}`],
              ].filter(([v]) => v).map(([, l]) => (
                <div key={String(l)} style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{l as string}</div>
              ))}
            </div>
          )}

          {im.descricao && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 12 }}>Descrição</h3>
              <p style={{ fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{im.descricao}</p>
            </div>
          )}

          {/* Proposta online */}
          <div style={{ marginTop: 40, background: '#fff', borderRadius: 16, padding: 28, border: '1px solid var(--border)', boxShadow: '0 4px 18px rgba(15,34,68,0.06)' }}>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>📝 Fazer uma proposta</h3>
            <p style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 20 }}>Envie sua oferta diretamente ao responsável. Todas as propostas são registradas e rastreáveis.</p>
            {propostaSent ? (
              <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: '#065F46', textAlign: 'center' }}>
                ✅ Proposta enviada! O responsável analisará e retornará em breve.
              </div>
            ) : !showProposta ? (
              <Btn variant="ghost" onClick={() => setShowProposta(true)}>Enviar proposta de compra</Btn>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" placeholder="Seu nome *" value={proposta.nome}
                    onChange={e => setProposta(p => ({ ...p, nome: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                  <input type="email" placeholder="Seu e-mail *" value={proposta.email}
                    onChange={e => setProposta(p => ({ ...p, email: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                  <input type="tel" placeholder="WhatsApp" value={proposta.telefone}
                    onChange={e => setProposta(p => ({ ...p, telefone: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                  <input type="number" placeholder="Valor da proposta (R$) *" value={proposta.valor}
                    onChange={e => setProposta(p => ({ ...p, valor: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                </div>
                <textarea placeholder="Condições (pagamento à vista, financiamento, prazo…)" rows={2} value={proposta.condicoes}
                  onChange={e => setProposta(p => ({ ...p, condicoes: e.target.value }))}
                  style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', resize: 'none' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn variant="accent" onClick={sendProposta} loading={propostaSending} disabled={!proposta.nome || !proposta.email || !proposta.valor}>Enviar proposta</Btn>
                  <Btn variant="ghost" onClick={() => setShowProposta(false)}>Cancelar</Btn>
                </div>
              </div>
            )}
          </div>

          {/* Agendar visita */}
          <div style={{ marginTop: 40, background: '#fff', borderRadius: 16, padding: 28, border: '1px solid var(--border)', boxShadow: '0 4px 18px rgba(15,34,68,0.06)' }}>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>📅 Agendar visita</h3>
            <p style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 20 }}>Escolha uma data e entraremos em contato para confirmar o horário.</p>
            {visitaSent ? (
              <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: '#065F46', textAlign: 'center' }}>
                ✅ Visita solicitada! Entraremos em contato em breve para confirmar.
              </div>
            ) : !showVisita ? (
              <Btn variant="primary" onClick={() => setShowVisita(true)}>Quero agendar uma visita</Btn>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" placeholder="Seu nome *" value={visita.nome}
                    onChange={e => setVisita(v => ({ ...v, nome: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                  <input type="email" placeholder="Seu e-mail *" value={visita.email}
                    onChange={e => setVisita(v => ({ ...v, email: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                  <input type="tel" placeholder="WhatsApp" value={visita.telefone}
                    onChange={e => setVisita(v => ({ ...v, telefone: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                  <input type="date" value={visita.data}
                    onChange={e => setVisita(v => ({ ...v, data: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', color: visita.data ? 'var(--navy)' : 'var(--fg-3)' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn variant="accent" onClick={sendVisita} loading={visitaSending} disabled={!visita.nome || !visita.email || !visita.data}>Confirmar agendamento</Btn>
                  <Btn variant="ghost" onClick={() => setShowVisita(false)}>Cancelar</Btn>
                </div>
              </div>
            )}
          </div>
          {/* Mapa */}
          {(im.lat && im.lng) && (
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 18, marginBottom: 12 }}>Localização</h3>
              <p style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 16 }}>Localização aproximada — endereço exato fornecido após contato.</p>
              <div ref={mapRef} style={{ height: 320, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', zIndex: 0 }} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position: isMobile ? 'static' : 'sticky', top: 90 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-strong)', borderTop: '3px solid var(--gold)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 6 }}>Preço de pedida</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--gold)', lineHeight: 1, marginBottom: 4 }}>{fmtBRL(im.preco)}</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginBottom: 16 }}>Valor sujeito a negociação</div>

            {im.condominio && <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 4 }}>Condomínio: {fmtBRL(im.condominio)}/mês</div>}
            {im.iptu && <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 12 }}>IPTU: {fmtBRL(im.iptu)}/ano</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <button onClick={toggleFav} style={{ padding: '8px 0', borderRadius: 8, border: `1.5px solid ${isFav ? '#DC2626' : 'var(--border)'}`, background: isFav ? '#FEF2F2' : 'transparent', color: isFav ? '#DC2626' : 'var(--fg-2)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.15s' }}>
                <span>{isFav ? '♥' : '♡'}</span>
                {isFav ? 'Salvo' : 'Salvar'}
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`${im.titulo} — ${fmtBRL(im.preco)}\n${typeof window !== 'undefined' ? window.location.href : ''}`)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 0', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--fg-2)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, textDecoration: 'none', transition: 'all 0.15s' }}>
                ↗ Compartilhar
              </a>
            </div>

            {!sent ? (
              <>
                {!showContact ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Btn variant="accent" fullWidth size="lg" onClick={() => setShowContact(true)}>Tenho interesse</Btn>
                    {im.profiles?.telefone && (
                      <a href={`https://wa.me/55${im.profiles.telefone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Btn variant="ghost" fullWidth>WhatsApp direto</Btn>
                      </a>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { ph: 'Seu nome *', key: 'nome', type: 'text' },
                      { ph: 'Seu e-mail *', key: 'email', type: 'email' },
                      { ph: 'WhatsApp', key: 'telefone', type: 'tel' },
                    ].map(({ ph, key, type }) => (
                      <input key={key} type={type} placeholder={ph} value={(lead as any)[key]}
                        onChange={e => setLead(l => ({ ...l, [key]: e.target.value }))}
                        style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none' }} />
                    ))}
                    <textarea placeholder="Mensagem (opcional)" rows={3} value={lead.mensagem}
                      onChange={e => setLead(l => ({ ...l, mensagem: e.target.value }))}
                      style={{ padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', resize: 'none' }} />
                    <Btn variant="accent" fullWidth onClick={sendLead} loading={sending}
                      disabled={!lead.nome || !lead.email}>Enviar mensagem</Btn>
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: '#065F46', textAlign: 'center' }}>
                ✅ Mensagem enviada! O responsável entrará em contato em breve.
              </div>
            )}
          </div>

          {/* Simulador rápido de financiamento */}
          {im.preco && (() => {
            const entrada = im.preco * 0.2
            const financiado = im.preco - entrada
            const taxa = 0.0089
            const prazo = 360
            const fator = (taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1)
            const parcelaPrice = Math.round(financiado * fator)
            return (
              <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-deep)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Simulação rápida</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Financiamento bancário</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                  <div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>Entrada (20%)</div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 13 }}>R$ {Math.round(entrada).toLocaleString('pt-BR')}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>Parcela PRICE</div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 13 }}>R$ {parcelaPrice.toLocaleString('pt-BR')}/mês</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>Taxa</div>
                    <div style={{ fontWeight: 600, color: 'var(--fg-2)', fontSize: 13 }}>8,9% a.a.</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>Prazo</div>
                    <div style={{ fontWeight: 600, color: 'var(--fg-2)', fontSize: 13 }}>360 meses</div>
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--fg-3)', marginTop: 10 }}>Simulação estimada. Sujeita a aprovação de crédito.</div>
              </div>
            )
          })()}

          {/* Consórcio CTA */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Alternativa ao financiamento</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Compre via Consórcio</div>
            {im.preco && (() => {
              const parcela = Math.round((im.preco * 1.17) / 180)
              return <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 12 }}>A partir de <strong style={{ color: 'var(--navy)' }}>R$ {parcela.toLocaleString('pt-BR')}/mês</strong> · 0% juros bancários</div>
            })()}
            <Link href="/consorcio" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: '9px', background: 'rgba(5,150,105,0.08)', border: '1.5px solid rgba(5,150,105,0.3)', borderRadius: 9, fontSize: 13, fontWeight: 700, color: '#059669', fontFamily: 'var(--font-body)' }}>
              Simular consórcio →
            </Link>
          </div>
        </div>
      </div>

      {/* Imóveis similares */}
      {similares.length > 0 && (
        <div style={{ width: 'min(1200px,92vw)', margin: '60px auto 0' }}>
          <h3 style={{ fontSize: 22, marginBottom: 24 }}>Imóveis similares</h3>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {similares.map(s => (
              <Link key={s.id} href={`/imovel/${s.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', transition: 'transform 0.18s, box-shadow 0.18s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 44px rgba(15,34,68,0.14)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)' }}>
                  <div style={{ height: 180, background: s.fotos?.[0] ? `url(${s.fotos[0]}) center/cover` : 'var(--cream)' }} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>{fmtBRL(s.preco)}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>{s.titulo}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{s.bairro}{s.cidade && s.bairro ? ', ' : ''}{s.cidade}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const lbBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
  width: 44, height: 44, fontSize: 22, cursor: 'pointer', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const navBtn = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  [side]: 16, width: 44, height: 44,
  background: 'rgba(255,255,255,0.88)', border: 'none', borderRadius: '50%',
  fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
})
