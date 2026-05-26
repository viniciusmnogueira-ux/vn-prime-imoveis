'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import { fmtBRL } from '@/lib/utils'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'

type Imovel = any
type Profile = any

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  rascunho:  { label: 'Rascunho',   color: '#6B7280', bg: '#F3F4F6' },
  pendente:  { label: 'Em análise', color: '#B45309', bg: '#FEF3C7' },
  ativo:     { label: 'Ativo',      color: '#065F46', bg: '#D1FAE5' },
  pausado:   { label: 'Pausado',    color: '#1D4ED8', bg: '#DBEAFE' },
  vendido:   { label: 'Vendido',    color: '#7C3AED', bg: '#EDE9FE' },
}

export default function ProprietarioPage() {
  const router = useRouter()
  const params = useSearchParams()
  const novoId = params.get('novo')

  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [sec, setSec] = useState<'imoveis' | 'leads' | 'fotografo' | 'config'>('imoveis')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const [{ data: prof }, { data: imvs }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('imoveis').select('*').eq('proprietario_id', user.id).order('criado_em', { ascending: false }),
    ])
    setProfile(prof)
    setImoveis(imvs ?? [])
    setLoading(false)
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === 'ativo' ? 'pausado' : 'ativo'
    await supabase.from('imoveis').update({ status: next as any }).eq('id', id)
    setImoveis(prev => prev.map(im => im.id === id ? { ...im, status: next as any } : im))
  }

  async function deleteImovel(id: string) {
    if (!confirm('Excluir este anúncio?')) return
    await supabase.from('imoveis').delete().eq('id', id)
    setImoveis(prev => prev.filter(im => im.id !== id))
  }

  if (loading) return <LoadingScreen />
  if (!profile) return <ProprietarioLanding />

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header do portal */}
      <div style={{ background: 'var(--navy-deep)', padding: 'clamp(28px,4vw,48px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Eyebrow color="var(--gold)">Portal do Proprietário</Eyebrow>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem,3vw,2rem)', marginTop: 8 }}>
              Olá, {profile?.nome?.split(' ')[0] ?? 'bem-vindo'}
            </h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
              Plano: <span style={{ color: 'var(--gold)', fontWeight: 700, textTransform: 'capitalize' }}>{profile?.plano ?? 'sem plano'}</span>
            </div>
          </div>
          <Link href="/anunciar">
            <Btn variant="accent" size="lg">+ Novo anúncio</Btn>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', paddingTop: 32 }}>
        {novoId && (
          <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '14px 20px', marginBottom: 24, fontSize: 14, color: '#065F46', fontWeight: 600 }}>
            ✅ Imóvel publicado com sucesso! Ele aparecerá no site após revisão (geralmente em menos de 24h).
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Anúncios ativos', value: imoveis.filter(i => i.status === 'ativo').length },
            { label: 'Em análise', value: imoveis.filter(i => i.status === 'pendente').length },
            { label: 'Total de anúncios', value: imoveis.length },
            { label: 'Vendidos', value: imoveis.filter(i => i.status === 'vendido').length },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: 'var(--shadow-soft)' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>{s.value}</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-3)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border)', marginBottom: 28 }}>
          {([['imoveis','Meus imóveis'],['leads','Leads recebidos'],['fotografo','📸 Fotógrafo'],['config','Configurações']] as const).map(([id, lbl]) => (
            <button key={id} onClick={() => setSec(id)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13.5, fontWeight: 700,
              color: sec === id ? 'var(--navy)' : 'var(--fg-3)',
              borderBottom: `3px solid ${sec === id ? 'var(--gold)' : 'transparent'}`,
              marginBottom: -2, transition: 'all 0.15s',
            }}>{lbl}</button>
          ))}
        </div>

        {sec === 'imoveis' && (
          imoveis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
              <h3 style={{ marginBottom: 8 }}>Nenhum imóvel ainda</h3>
              <p style={{ color: 'var(--fg-2)', marginBottom: 24 }}>Publique seu primeiro anúncio e comece a receber contatos.</p>
              <Link href="/anunciar"><Btn variant="accent" size="lg">Anunciar agora</Btn></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {imoveis.map(im => {
                const st = STATUS_LABEL[im.status] ?? STATUS_LABEL.rascunho
                return (
                  <div key={im.id} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {im.fotos?.[0] && (
                      <div style={{ width: 120, height: 90, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--cream)' }}>
                        <img src={im.fotos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)' }}>{im.titulo}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 99 }}>{st.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{im.bairro}, {im.cidade} · {im.tipo}</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gold)', marginTop: 6 }}>{fmtBRL(im.preco)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {(im.status === 'ativo' || im.status === 'pausado') && (
                        <Btn variant="ghost" size="sm" onClick={() => toggleStatus(im.id, im.status)}>
                          {im.status === 'ativo' ? 'Pausar' : 'Ativar'}
                        </Btn>
                      )}
                      <Btn variant="danger" size="sm" onClick={() => deleteImovel(im.id)}>Excluir</Btn>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {sec === 'leads' && (
          <LeadsSection proprietarioId={profile?.id ?? ''} />
        )}

        {sec === 'fotografo' && <FotografoSection />}

        {sec === 'config' && (
          <ConfigSection profile={profile} onSave={loadData} />
        )}
      </div>
    </div>
  )
}

function LeadsSection({ proprietarioId }: { proprietarioId: string }) {
  const supabase = createClient()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*, imoveis(titulo)').eq('proprietario_id', proprietarioId)
      .order('criado_em', { ascending: false })
      .then(({ data }) => { setLeads(data ?? []); setLoading(false) })
  }, [proprietarioId])

  if (loading) return <LoadingScreen />
  if (leads.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg-2)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📩</div>
      <p>Nenhum lead recebido ainda. Ative seu anúncio para começar.</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {leads.map((l: any) => (
        <div key={l.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 22px', boxShadow: 'var(--shadow-soft)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{l.nome}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{l.email} {l.telefone ? `· ${l.telefone}` : ''}</div>
            {l.mensagem && <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4, fontStyle: 'italic' }}>"{l.mensagem}"</div>}
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>Imóvel: {l.imoveis?.titulo ?? '—'} · {new Date(l.criado_em).toLocaleDateString('pt-BR')}</div>
          </div>
          <a href={`https://wa.me/55${l.telefone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
            <Btn variant="accent" size="sm">WhatsApp</Btn>
          </a>
        </div>
      ))}
    </div>
  )
}

function ConfigSection({ profile, onSave }: { profile: Profile | null; onSave: () => void }) {
  const supabase = createClient()
  const [nome, setNome] = useState(profile?.nome ?? '')
  const [telefone, setTelefone] = useState(profile?.telefone ?? '')
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState(false)

  const save = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ nome, telefone }).eq('id', profile?.id!)
    setSaving(false); setOk(true); setTimeout(() => setOk(false), 2000)
    onSave()
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h3 style={{ fontSize: 18 }}>Meus dados</h3>
        <div>
          <label style={labelStyle}>Nome completo</label>
          <input style={cfgInput} value={nome} onChange={e => setNome(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>WhatsApp</label>
          <input style={cfgInput} value={telefone} onChange={e => setTelefone(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>E-mail</label>
          <input style={{ ...cfgInput, background: 'var(--cream)', color: 'var(--fg-3)' }} value={profile?.email ?? ''} readOnly />
        </div>
        <Btn variant="primary" onClick={save} loading={saving}>
          {ok ? '✓ Salvo' : 'Salvar alterações'}
        </Btn>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }
const cfgInput: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none' }

const FOTO_PACOTES = [
  { id: 'essencial', nome: 'Essencial', preco: 'R$ 390', duracao: '60 min',
    itens: ['25 fotos editadas em alta', 'Tratamento de luz e cor', 'Entrega em 48h', 'Direito de uso comercial'] },
  { id: 'completo', nome: 'Completo', preco: 'R$ 690', duracao: '90 min', destaque: true,
    itens: ['40 fotos editadas em alta', 'Tour virtual 360°', 'Vídeo curto (30s vertical)', 'Planta humanizada', 'Entrega em 48h'] },
  { id: 'premium', nome: 'Premium · com drone', preco: 'R$ 1.190', duracao: '2h',
    itens: ['60 fotos + drone aéreo', 'Tour 360° + Matterport', 'Vídeo cinematográfico (60s)', 'Plantas + contexto urbano', 'Entrega em 24h'] },
]

function FotografoSection() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 6 }}>Canal do Fotógrafo</div>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Contrate fotografia profissional para seu imóvel</h3>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14 }}>Equipe especializada em imóveis de alto padrão. Tour virtual 360°, drone e vídeo cinematográfico. Atendemos toda a Grande BH. Entrega em até 48h.</p>
      </div>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginBottom: 20 }}>
        {FOTO_PACOTES.map(p => (
          <div key={p.id} style={{
            background: p.destaque ? 'var(--navy)' : '#fff',
            padding: 24, borderRadius: 16,
            border: p.destaque ? 'none' : '1px solid var(--border)',
            boxShadow: p.destaque ? 'var(--shadow-soft)' : 'none',
            position: 'relative',
          }}>
            {p.destaque && (
              <div style={{ position: 'absolute', top: -11, left: 20, background: 'var(--gold)', color: 'var(--navy-deep)', padding: '3px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Mais escolhido
              </div>
            )}
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.destaque ? 'var(--gold-soft)' : 'var(--gold-deep)', marginBottom: 8 }}>{p.nome}</div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: p.destaque ? '#fff' : 'var(--navy)' }}>{p.preco}</div>
            <div style={{ fontSize: 12.5, color: p.destaque ? 'rgba(255,255,255,0.55)' : 'var(--fg-3)', marginBottom: 16 }}>sessão de {p.duracao}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {p.itens.map(it => (
                <li key={it} style={{ fontSize: 13.5, display: 'flex', gap: 9 }}>
                  <span style={{ color: p.destaque ? 'var(--gold-soft)' : 'var(--gold-deep)', fontWeight: 700 }}>✓</span>
                  <span style={{ color: p.destaque ? 'rgba(255,255,255,0.85)' : 'var(--fg-1)' }}>{it}</span>
                </li>
              ))}
            </ul>
            <Link href="/fotografo" style={{ display: 'block' }}>
              <Btn variant={p.destaque ? 'accent' : 'primary'} size="sm" style={{ width: '100%' }}>
                Contratar {p.nome}
              </Btn>
            </Link>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--fg-3)', textAlign: 'center' }}>
        Fotografia inclusa nos planos Venda Assistida e Venda Completa · <Link href="/vender" style={{ color: 'var(--gold-deep)', fontWeight: 600 }}>Ver planos</Link>
      </p>
    </div>
  )
}

function ProprietarioLanding() {
  const ACCENT = '#D4A857'
  const FEATURES = [
    { icon: '📸', title: 'Fotos Profissionais', desc: 'Sessão fotográfica inclusa nos planos Assistida e Completa. Imagens que destacam seu imóvel e aceleram a venda.' },
    { icon: '📣', title: 'Mídia Paga Gerenciada', desc: 'Anúncios no Google, Meta e portais imobiliários. A VN Prime gerencia o tráfego para você.' },
    { icon: '👥', title: 'Leads Qualificados', desc: 'Compradores verificados com perfil compatível com seu imóvel chegam direto no seu painel de controle.' },
    { icon: '⚖️', title: 'Suporte Jurídico', desc: 'Revisão de contratos, ITBI, cartório e escritura. Profissionais parceiros cuidam da parte burocrática.' },
  ]
  const BENEFITS = [
    {
      tag: '0% Comissão',
      img: 'https://images.unsplash.com/photo-1611095973763-414019e72400?w=900&q=80',
      title: 'Você vende sem pagar comissão',
      desc: 'Na VN Prime, o proprietário direto paga apenas uma taxa fixa de R$ 297 — e fica com 100% do valor de venda. Sem percentual, sem surpresa no fechamento.',
      points: [
        'Taxa fixa R$ 297 — vigência de 90 dias',
        'Você define o preço e as condições de negociação',
        'Nenhum corretor entre você e o comprador',
        'Para o plano 3%: você paga somente ao vender — zero adiantado',
      ],
      cta: 'Anunciar meu imóvel',
    },
    {
      tag: 'Você no controle',
      img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80',
      title: 'Gerencie tudo pelo seu painel',
      desc: 'Acompanhe visualizações, leads e visitas em tempo real. Você decide quem visita, quando visita, e como conduz a negociação.',
      points: [
        'Painel com métricas de desempenho do anúncio',
        'Gestão de agenda de visitas integrada',
        'Scripts de venda para cada etapa da negociação',
        'Booster para aumentar visibilidade na hora certa',
      ],
      reverse: true,
    },
    {
      tag: 'Visibilidade',
      img: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=900&q=80',
      title: 'Seu imóvel na maior vitrine premium de BH',
      desc: 'A VN Prime distribui seu anúncio nos principais portais, Google, Meta e na base qualificada de compradores ativos — gerando leads reais.',
      points: [
        'Distribuição automática em ZAP, Viva Real e OLX',
        'Campanha de mídia paga gerenciada pela VN Prime',
        'Fotos profissionais que aumentam em 3× o interesse',
        'Código exclusivo VN para rastreabilidade do anúncio',
      ],
    },
  ]

  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(160deg, rgba(15,22,32,0.72) 0%, rgba(15,22,32,0.88) 60%, rgba(15,22,32,0.96) 100%), url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85)`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        color: '#fff', padding: 'clamp(90px,14vw,160px) 0 clamp(70px,10vw,110px)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 80% 40%, ${ACCENT}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, width: 'min(1180px,92vw)', margin: '0 auto', maxWidth: 780 }}>
          <Eyebrow>Área do Proprietário</Eyebrow>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem,4.5vw,3.6rem)', lineHeight: 1.06, margin: '14px 0 20px' }}>
            Anuncie seu imóvel com{' '}
            <em style={{ color: '#F6D77A', fontStyle: 'italic' }}>liberdade total</em>
            {' '}— sem comissão, sem intermediários.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.86)', maxWidth: 600, marginBottom: 32, lineHeight: 1.6 }}>
            Você define o preço, conduz as visitas e fecha direto com o comprador. A VN Prime entra com plataforma, fotos profissionais, mídia paga e suporte jurídico.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
            <Link href="/login?redirect=/proprietario">
              <Btn variant="accent" size="lg">Entrar no portal</Btn>
            </Link>
            <Link href="/login?redirect=/proprietario&tab=cadastrar&tipo=proprietario">
              <Btn variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>Criar conta grátis</Btn>
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {[['R$ 297','Taxa fixa única'],['0%','De comissão'],['18 dias','Venda média'],['90 dias','De vigência']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: ACCENT, lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 52px' }}>
            <Eyebrow color="var(--gold-deep)">O que você encontra</Eyebrow>
            <h2 style={{ margin: '10px 0 12px' }}>Tudo que você precisa em um só lugar</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15.5 }}>Ferramentas criadas especificamente para o mercado imobiliário premium de Belo Horizonte.</p>
          </div>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fff', padding: '28px 26px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ACCENT}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits alternating */}
      {BENEFITS.map((b, idx) => (
        <section key={b.title} style={{ padding: 'clamp(60px,8vw,96px) 0', background: idx % 2 === 0 ? '#fff' : 'var(--cream)', borderTop: '1px solid var(--border)' }}>
          <div style={{ width: 'min(1180px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 'clamp(32px,5vw,72px)', alignItems: 'center', direction: b.reverse ? 'rtl' : 'ltr' }}>
            <div style={{ direction: 'ltr', position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 56px rgba(27,39,51,0.14)', aspectRatio: '4/3' }}>
              <img src={b.img} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(15,22,32,0.60) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 24, background: `${ACCENT}EE`, color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{b.tag}</div>
            </div>
            <div style={{ direction: 'ltr' }}>
              <div style={{ width: 40, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 20 }} />
              <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(1.5rem,2.8vw,2.1rem)' }}>{b.title}</h2>
              <p style={{ fontSize: 16, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 24 }}>{b.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {b.points.map(pt => (
                  <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 99, background: `${ACCENT}22`, color: ACCENT, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.55 }}>{pt}</span>
                  </li>
                ))}
              </ul>
              {b.cta && (
                <Link href="/login?redirect=/proprietario">
                  <Btn variant="accent" style={{ background: ACCENT, boxShadow: `0 4px 18px ${ACCENT}44` }}>{b.cta}</Btn>
                </Link>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Banner */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: 'linear-gradient(135deg,#0F1824 0%,#1B2733 100%)' }}>
        <div style={{ width: 'min(860px,92vw)', margin: '0 auto', textAlign: 'center', color: '#fff' }}>
          <Eyebrow>Acesso imediato</Eyebrow>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', margin: '14px 0 16px' }}>Pronto para começar?</h2>
          <p style={{ color: 'rgba(245,248,250,0.78)', fontSize: 17, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Faça login com sua conta VN Prime ou crie uma agora. Configuração em menos de 3 minutos.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login?redirect=/proprietario">
              <Btn variant="accent" size="lg">Acessar meu portal</Btn>
            </Link>
            <button onClick={() => window.dispatchEvent(new CustomEvent('vnprime:consultor'))}
              style={{ padding: '14px 28px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Falar com consultor
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div className="animate-spin" style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
    </div>
  )
}
