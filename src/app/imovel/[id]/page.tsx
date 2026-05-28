'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtBRL } from '@/lib/utils'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'

export default function ImovelPage() {
  const { id } = useParams<{ id: string }>()
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
      .then(({ data }) => { setIm(data); setLoading(false) })
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
      {/* Fotos */}
      <div style={{ position: 'relative', height: 'min(520px, 55vw)', background: fotos[photoIdx] ? `url(${fotos[photoIdx]}) center/cover` : 'var(--navy)', overflow: 'hidden' }}>
        {fotos.length > 1 && (
          <>
            <button onClick={() => setPhotoIdx((photoIdx - 1 + fotos.length) % fotos.length)} style={navBtn('left')}>‹</button>
            <button onClick={() => setPhotoIdx((photoIdx + 1) % fotos.length)} style={navBtn('right')}>›</button>
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {fotos.map((_, i) => <span key={i} style={{ width: i === photoIdx ? 20 : 7, height: 5, borderRadius: 3, background: i === photoIdx ? 'var(--gold)' : 'rgba(255,255,255,0.5)', transition: 'width 0.2s' }} />)}
            </div>
          </>
        )}
        {fotos.length === 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 64 }}>🏠</div>}
      </div>

      <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', paddingTop: 40, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) min(380px, 38%)', gap: 40, alignItems: 'start' }}>
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
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 90 }}>
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
        </div>
      </div>
    </div>
  )
}

const navBtn = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  [side]: 16, width: 44, height: 44,
  background: 'rgba(255,255,255,0.88)', border: 'none', borderRadius: '50%',
  fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
})
