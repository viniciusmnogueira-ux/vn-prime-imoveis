'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { fmtBRL } from '@/lib/utils'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'

type Profile = any
type Sec = 'dashboard' | 'imoveis' | 'carteira6' | 'crm' | 'pipeline' | 'todo' | 'financas' | 'scripts' | 'fotografo'
type PipelineCard = { id: string; nome: string; imovel: string; valor: string; nota: string; col: string }
type TodoItem = { id: string; texto: string; done: boolean }

const ACCENT = '#2F8674'
const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

const PIPELINE_COLS = [
  { key: 'prospect', label: 'Prospect', color: '#6366F1' },
  { key: 'contato', label: 'Contato', color: '#0EA5E9' },
  { key: 'visita', label: 'Visita', color: '#D4A857' },
  { key: 'proposta', label: 'Proposta', color: '#F97316' },
  { key: 'fechamento', label: 'Fechamento', color: '#059669' },
]

const labelSt: React.CSSProperties = { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }
const inputSt: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function CorretorPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [corretor, setCorretor] = useState<any>(null)
  const [leads, setLeads] = useState<any[]>([])
  const [imoveis, setImoveis] = useState<any[]>([])
  const [imoveis6, setImoveis6] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sec, setSec] = useState<Sec | 'cadastro'>('dashboard')

  // localStorage state — pipeline, todo, crm
  const [pipeline, setPipelineState] = useState<PipelineCard[]>([])
  const [todos, setTodosState] = useState<TodoItem[]>([])
  const [crmStatus, setCrmStatusState] = useState<Record<string, string>>({})
  const [crmNota, setCrmNotaState] = useState<Record<string, string>>({})
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({ nome: '', imovel: '', valor: '', nota: '' })
  const [newTodo, setNewTodo] = useState('')

  const uid = profile?.id as string | undefined

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!uid) return
    const p = localStorage.getItem(`vnp_pipeline_${uid}`)
    const t = localStorage.getItem(`vnp_todo_${uid}`)
    const cs = localStorage.getItem(`vnp_crms_${uid}`)
    const cn = localStorage.getItem(`vnp_crmn_${uid}`)
    if (p) setPipelineState(JSON.parse(p))
    if (t) setTodosState(JSON.parse(t))
    if (cs) setCrmStatusState(JSON.parse(cs))
    if (cn) setCrmNotaState(JSON.parse(cn))
  }, [uid])

  const savePipeline = (cards: PipelineCard[]) => {
    setPipelineState(cards)
    if (uid) localStorage.setItem(`vnp_pipeline_${uid}`, JSON.stringify(cards))
  }
  const saveTodos = (items: TodoItem[]) => {
    setTodosState(items)
    if (uid) localStorage.setItem(`vnp_todo_${uid}`, JSON.stringify(items))
  }
  const saveCrmStatus = (s: Record<string, string>) => {
    setCrmStatusState(s)
    if (uid) localStorage.setItem(`vnp_crms_${uid}`, JSON.stringify(s))
  }
  const saveCrmNota = (n: Record<string, string>) => {
    setCrmNotaState(n)
    if (uid) localStorage.setItem(`vnp_crmn_${uid}`, JSON.stringify(n))
  }

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const [{ data: prof }, { data: cor }, { data: imvs }, { data: lds }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('corretores').select('*').eq('profile_id', user.id).single(),
      supabase.from('imoveis').select('*').eq('corretor_id', user.id).order('criado_em', { ascending: false }),
      supabase.from('leads').select('*, imoveis(titulo, preco)').eq('corretor_id', user.id).order('criado_em', { ascending: false }),
    ])

    if (prof && prof.tipo !== 'corretor' && prof.tipo !== 'admin') {
      setLoading(false); return
    }

    const { data: imvs6 } = await supabase
      .from('imoveis')
      .select('*, profiles(nome, email, telefone)')
      .eq('plano_label', 'completa')
      .eq('status', 'ativo')
      .neq('proprietario_id', user.id)
      .order('criado_em', { ascending: false })

    setProfile(prof)
    setCorretor(cor)
    setImoveis(imvs ?? [])
    setLeads(lds ?? [])
    setImoveis6(imvs6 ?? [])
    setLoading(false)
    if (!cor) setSec('cadastro')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
    </div>
  )

  if (!profile) return <CorretorLanding />

  if (sec === 'cadastro') return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 16px' }}>
      <CadastroCorretor profile={profile} corretor={corretor} onSaved={loadData} />
    </div>
  )

  const TABS: [Sec, string][] = [
    ['dashboard', 'Dashboard'],
    ['imoveis', 'Meus Imóveis'],
    ['carteira6', `Carteira 6% (${imoveis6.length})`],
    ['crm', `CRM (${leads.length})`],
    ['pipeline', 'Pipeline'],
    ['todo', 'To-do'],
    ['financas', 'Finanças'],
    ['scripts', 'Scripts IA'],
    ['fotografo', 'Fotógrafo'],
  ]

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--navy-deep)', padding: 'clamp(20px,3vw,36px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Eyebrow color={ACCENT}>Portal do Corretor</Eyebrow>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', marginTop: 6 }}>
              {profile?.nome?.split(' ')[0] ?? 'Corretor'}
              {corretor?.creci && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 12 }}>CRECI {corretor.creci}</span>}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/"><Btn variant="ghost-light" size="sm">← Site</Btn></Link>
            <button onClick={() => setSec('cadastro')}
              style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Meus dados
            </button>
            <button onClick={() => { window.location.href = '/api/auth/signout' }}
              style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '2px solid var(--border)', overflowX: 'auto' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex' }}>
          {TABS.map(([id, lbl]) => (
            <button key={id} onClick={() => setSec(id)} style={{
              padding: '13px 18px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap',
              color: sec === id ? ACCENT : 'var(--fg-3)',
              borderBottom: `3px solid ${sec === id ? ACCENT : 'transparent'}`,
              marginBottom: -2, transition: 'all 0.15s',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', paddingTop: 28, paddingBottom: 60 }}>
        {sec === 'dashboard' && (
          <DashboardSection
            profile={profile} corretor={corretor} leads={leads}
            imoveis={imoveis} imoveis6={imoveis6} pipeline={pipeline}
            onNavigate={(s: Sec) => setSec(s)}
          />
        )}
        {sec === 'imoveis' && <ImoveisSection imoveis={imoveis} />}
        {sec === 'carteira6' && <Carteira6Section imoveis6={imoveis6} />}
        {sec === 'crm' && (
          <CRMSection
            leads={leads}
            crmStatus={crmStatus} setCrmStatus={saveCrmStatus}
            crmNota={crmNota} setCrmNota={saveCrmNota}
          />
        )}
        {sec === 'pipeline' && (
          <PipelineSection
            pipeline={pipeline} savePipeline={savePipeline}
            draggingId={draggingId} setDraggingId={setDraggingId}
            newCard={newCard} setNewCard={setNewCard}
            showAddCard={showAddCard} setShowAddCard={setShowAddCard}
          />
        )}
        {sec === 'todo' && <TodoSection todos={todos} saveTodos={saveTodos} newTodo={newTodo} setNewTodo={setNewTodo} />}
        {sec === 'financas' && <FinancasSection leads={leads} imoveis={imoveis} pipeline={pipeline} />}
        {sec === 'scripts' && <ScriptCorretorSection />}
        {sec === 'fotografo' && <FotografoSection />}
      </div>
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardSection({ profile, corretor, leads, imoveis, imoveis6, pipeline, onNavigate }: any) {
  const fechados = pipeline.filter((c: PipelineCard) => c.col === 'fechamento')
  const comissaoPotencial = imoveis6.reduce((s: number, im: any) => s + (im.preco ?? 0) * 0.06, 0)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Leads recebidos', value: leads.length, color: ACCENT, sec: 'crm' },
          { label: 'Carteira 6%', value: imoveis6.length, color: '#D4A857', sec: 'carteira6' },
          { label: 'No pipeline', value: pipeline.length, color: '#6366F1', sec: 'pipeline' },
          { label: 'Fechamentos', value: fechados.length, color: '#059669', sec: 'financas' },
        ].map(s => (
          <div key={s.label} onClick={() => onNavigate(s.sec)} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: 'var(--shadow-soft)', borderLeft: `4px solid ${s.color}`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-soft)')}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {comissaoPotencial > 0 && (
        <div style={{ background: 'linear-gradient(135deg,#0F1824,#1E3A2F)', borderRadius: 16, padding: '24px 28px', marginBottom: 20, color: '#fff' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>Comissão potencial — carteira 6% ativa</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{fmt(comissaoPotencial)}</div>
          <div style={{ fontSize: 13, opacity: 0.55, marginTop: 4 }}>{imoveis6.length} imóveis disponíveis para negociar</div>
        </div>
      )}

      {!corretor && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '18px 24px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Complete seu cadastro de corretor</div>
          <div style={{ fontSize: 13, color: '#B45309', marginBottom: 12 }}>Adicione seu CRECI para desbloquear todos os recursos do portal.</div>
          <Btn variant="accent" size="sm" onClick={() => onNavigate('cadastro' as any)}>Completar cadastro</Btn>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
        {[
          { title: 'CRM Pro', desc: 'Gerencie seus contatos, histórico e status de cada lead.', sec: 'crm', color: ACCENT },
          { title: 'Pipeline Kanban', desc: 'Acompanhe cada cliente do contato ao fechamento.', sec: 'pipeline', color: '#6366F1' },
          { title: 'Finanças', desc: 'Comissões, projeções e calculadora de vendas.', sec: 'financas', color: '#D4A857' },
        ].map(c => (
          <div key={c.title} onClick={() => onNavigate(c.sec as Sec)}
            style={{ background: '#fff', borderRadius: 14, padding: '22px 24px', boxShadow: 'var(--shadow-soft)', cursor: 'pointer', border: `1px solid ${c.color}22`, transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = `${c.color}66`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = `${c.color}22`)}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── IMÓVEIS PRÓPRIOS ─────────────────────────────────────────────────────────
function ImoveisSection({ imoveis }: { imoveis: any[] }) {
  const ST: Record<string, { label: string; color: string; bg: string }> = {
    rascunho: { label: 'Rascunho', color: '#6B7280', bg: '#F3F4F6' },
    pendente: { label: 'Em análise', color: '#B45309', bg: '#FEF3C7' },
    ativo: { label: 'Ativo', color: '#065F46', bg: '#D1FAE5' },
    pausado: { label: 'Pausado', color: '#1D4ED8', bg: '#DBEAFE' },
    vendido: { label: 'Vendido', color: '#7C3AED', bg: '#EDE9FE' },
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)' }}>Meus imóveis ({imoveis.length})</div>
        <Link href="/anunciar"><Btn variant="accent" size="sm">+ Novo anúncio</Btn></Link>
      </div>
      {imoveis.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Nenhum imóvel cadastrado</div>
          <Link href="/anunciar"><Btn variant="accent">Anunciar agora</Btn></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {imoveis.map((im: any) => {
            const st = ST[im.status] ?? ST.rascunho
            return (
              <div key={im.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 22px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {im.fotos?.[0] && <img src={im.fotos[0]} alt="" style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 3 }}>{im.titulo}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{im.bairro}, {im.cidade} · {im.tipo}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)', marginTop: 4 }}>{fmt(im.preco ?? 0)}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 99 }}>{st.label}</span>
                <Link href={`/imovel/${im.id}`} target="_blank"><Btn variant="ghost" size="sm">Ver</Btn></Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── CARTEIRA 6% ─────────────────────────────────────────────────────────────
function Carteira6Section({ imoveis6 }: { imoveis6: any[] }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Carteira 6% — Imóveis disponíveis ({imoveis6.length})</div>
        <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>Proprietários no plano Venda Completa. Sua comissão garantida: 6% sobre o valor de venda.</div>
      </div>
      {imoveis6.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 14, padding: '60px 24px', textAlign: 'center', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Nenhum imóvel disponível no momento</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>Imóveis do plano 6% aprovados aparecerão aqui automaticamente.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
          {imoveis6.map((im: any) => (
            <div key={im.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)' }}>
              {im.fotos?.[0]
                ? <img src={im.fotos[0]} alt="" style={{ width: '100%', height: 190, objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: 190, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🏠</div>
              }
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 3 }}>{im.titulo}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 8 }}>{im.bairro}, {im.cidade} · {im.tipo}</div>
                {im.quartos && <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8 }}>{im.quartos} quartos · {im.area_m2 ?? im.area ?? '—'} m²</div>}
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>{fmt(im.preco ?? 0)}</div>
                <div style={{ fontSize: 12, color: '#059669', fontWeight: 700, marginBottom: 12 }}>Sua comissão: {fmt((im.preco ?? 0) * 0.06)}</div>
                {im.profiles?.nome && (
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 14, padding: '8px 12px', background: '#F8FAFC', borderRadius: 8 }}>
                    Proprietário: <strong>{im.profiles.nome}</strong>
                    {im.profiles.telefone && <> · {im.profiles.telefone}</>}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  {im.profiles?.telefone && (
                    <a href={`https://wa.me/55${im.profiles.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                      <Btn variant="accent" size="sm" style={{ width: '100%', background: ACCENT }}>WhatsApp</Btn>
                    </a>
                  )}
                  <Link href={`/imovel/${im.id}`} target="_blank" style={{ flex: 1 }}>
                    <Btn variant="ghost" size="sm" style={{ width: '100%' }}>Ver imóvel</Btn>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
const CRM_STATUS_OPTS = [
  { key: 'novo', label: 'Novo', color: '#6B7280' },
  { key: 'contatado', label: 'Contatado', color: '#0EA5E9' },
  { key: 'negociando', label: 'Negociando', color: '#D4A857' },
  { key: 'visita', label: 'Visita agendada', color: '#6366F1' },
  { key: 'fechado', label: 'Fechado', color: '#059669' },
  { key: 'perdido', label: 'Perdido', color: '#DC2626' },
]

function CRMSection({ leads, crmStatus, setCrmStatus, crmNota, setCrmNota }: any) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const MOCK = [
    { id: 'mock1', nome: 'Carlos Mendonça', email: 'carlos.m@gmail.com', telefone: '31987654321', mensagem: 'Interesse em apartamento no Savassi', criado_em: new Date(Date.now() - 7200000).toISOString(), mock: true },
    { id: 'mock2', nome: 'Beatriz Fonseca', email: 'bea@gmail.com', telefone: '31999887766', mensagem: 'Quer agendar visita no fim de semana', criado_em: new Date(Date.now() - 86400000).toISOString(), mock: true },
    { id: 'mock3', nome: 'Rafael Andrade', email: 'r.andrade@email.com', telefone: '31996543210', mensagem: 'Compra à vista, urgência alta', criado_em: new Date(Date.now() - 172800000).toISOString(), mock: true },
  ]
  const base = leads.length > 0 ? leads : MOCK
  const show = base.filter((l: any) => {
    const q = search.toLowerCase()
    const matchSearch = !q || l.nome?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.telefone?.includes(q)
    const matchStatus = !filterStatus || (crmStatus[l.id] ?? 'novo') === filterStatus
    return matchSearch && matchStatus
  })

  const agingBadge = (criado_em: string) => {
    const days = Math.floor((Date.now() - new Date(criado_em).getTime()) / 86400000)
    if (days <= 1) return { label: 'Novo', bg: '#D1FAE5', color: '#065F46' }
    if (days <= 7) return { label: `${days}d`, bg: '#FEF3C7', color: '#B45309' }
    return { label: `${days}d`, bg: '#FEE2E2', color: '#991B1B' }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', flex: 1 }}>CRM Pro — {base.length} contatos</div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, e-mail ou telefone…"
          style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', width: 260 }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', color: 'var(--navy)' }}>
          <option value="">Todos os status</option>
          {CRM_STATUS_OPTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>
      {leads.length === 0 && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#92400E', marginBottom: 16 }}>
          Demonstração — leads reais aparecem aqui quando você receber contatos de imóveis.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {show.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--fg-3)', fontSize: 13 }}>Nenhum contato encontrado.</div>
        )}
        {show.map((l: any) => {
          const stKey = crmStatus[l.id] ?? 'novo'
          const st = CRM_STATUS_OPTS.find(s => s.key === stKey) ?? CRM_STATUS_OPTS[0]
          const isOpen = openId === l.id
          const aging = agingBadge(l.criado_em)
          return (
            <div key={l.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-soft)', border: `1.5px solid ${isOpen ? st.color : 'transparent'}`, transition: 'border-color 0.2s' }}>
              <div onClick={() => setOpenId(isOpen ? null : l.id)}
                style={{ padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${st.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: st.color, flexShrink: 0 }}>
                  {l.nome?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>{l.nome}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{l.email}</div>
                </div>
                {l.mock && <span style={{ fontSize: 10, fontWeight: 700, background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 99 }}>DEMO</span>}
                {l.origem === 'agendamento' && <span style={{ fontSize: 10, fontWeight: 700, background: '#F0FDF4', color: '#16A34A', padding: '2px 8px', borderRadius: 99 }}>📅 Visita</span>}
                {l.origem === 'proposta' && <span style={{ fontSize: 10, fontWeight: 700, background: '#FAF5FF', color: '#7C3AED', padding: '2px 8px', borderRadius: 99 }}>📝 Proposta</span>}
                <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: aging.bg, color: aging.color }}>{aging.label}</span>
                <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: `${st.color}18`, color: st.color }}>{st.label}</span>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: '#FAFAF8' }}>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 14 }}>
                    {l.telefone && <div>📱 {l.telefone}</div>}
                    {l.mensagem && <div style={{ marginTop: 4, fontStyle: 'italic' }}>"{l.mensagem}"</div>}
                    {l.imoveis?.titulo && <div style={{ marginTop: 4, color: 'var(--fg-3)' }}>Imóvel: {l.imoveis.titulo}</div>}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={labelSt}>Status do contato</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {CRM_STATUS_OPTS.map(s => (
                        <button key={s.key} onClick={() => setCrmStatus({ ...crmStatus, [l.id]: s.key })}
                          style={{ padding: '4px 11px', borderRadius: 99, fontSize: 11, fontWeight: 700, border: `1.5px solid ${s.color}`, background: stKey === s.key ? s.color : 'transparent', color: stKey === s.key ? '#fff' : s.color, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={labelSt}>Anotações</div>
                    <textarea value={crmNota[l.id] ?? ''} rows={2}
                      onChange={e => setCrmNota({ ...crmNota, [l.id]: e.target.value })}
                      placeholder="Observações sobre este contato..."
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {l.telefone && <a href={`https://wa.me/55${l.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><Btn variant="accent" size="sm" style={{ background: ACCENT }}>WhatsApp</Btn></a>}
                    <a href={`mailto:${l.email}`}><Btn variant="ghost" size="sm">E-mail</Btn></a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── PIPELINE KANBAN ──────────────────────────────────────────────────────────
function PipelineSection({ pipeline, savePipeline, draggingId, setDraggingId, newCard, setNewCard, showAddCard, setShowAddCard }: any) {
  const addCard = () => {
    if (!newCard.nome.trim()) return
    const card: PipelineCard = { id: Date.now().toString(), col: 'prospect', nome: newCard.nome, imovel: newCard.imovel, valor: newCard.valor, nota: newCard.nota }
    savePipeline([...pipeline, card])
    setNewCard({ nome: '', imovel: '', valor: '', nota: '' })
    setShowAddCard(false)
  }
  const moveCard = (id: string, col: string) => savePipeline(pipeline.map((c: PipelineCard) => c.id === id ? { ...c, col } : c))
  const removeCard = (id: string) => savePipeline(pipeline.filter((c: PipelineCard) => c.id !== id))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)' }}>Pipeline de vendas — {pipeline.length} cards</div>
        <Btn variant="accent" size="sm" onClick={() => setShowAddCard(true)} style={{ background: ACCENT }}>+ Adicionar</Btn>
      </div>

      {showAddCard && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>Novo card no pipeline</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 12 }}>
            {[
              { key: 'nome', label: 'Cliente *', placeholder: 'Nome do cliente' },
              { key: 'imovel', label: 'Imóvel', placeholder: 'Ex: Apto Savassi 3Q' },
              { key: 'valor', label: 'Valor R$', placeholder: 'Ex: 450000' },
              { key: 'nota', label: 'Nota', placeholder: 'Observação rápida' },
            ].map(f => (
              <div key={f.key}>
                <label style={labelSt}>{f.label}</label>
                <input value={(newCard as any)[f.key]} placeholder={f.placeholder}
                  onChange={e => setNewCard((p: any) => ({ ...p, [f.key]: e.target.value }))}
                  style={inputSt} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="primary" size="sm" onClick={addCard}>Adicionar ao pipeline</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setShowAddCard(false)}>Cancelar</Btn>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PIPELINE_COLS.length}, minmax(160px,1fr))`, gap: 12, overflowX: 'auto' }}>
        {PIPELINE_COLS.map(col => {
          const cards = pipeline.filter((c: PipelineCard) => c.col === col.key)
          return (
            <div key={col.key}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (draggingId) { moveCard(draggingId, col.key); setDraggingId(null) } }}
              style={{ background: '#fff', borderRadius: 12, border: `2px solid ${col.color}22`, minHeight: 280 }}>
              {(() => {
                const colTotal = cards.reduce((s: number, c: PipelineCard) => s + (Number(c.valor?.replace(/\D/g, '') ?? 0) || 0), 0)
                return (
                  <div style={{ padding: '10px 12px', borderBottom: `2px solid ${col.color}33` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: col.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.label}</span>
                      <span style={{ fontSize: 11, background: `${col.color}22`, color: col.color, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>{cards.length}</span>
                    </div>
                    {colTotal > 0 && <div style={{ fontSize: 10, color: col.color, opacity: 0.75, marginTop: 2, fontWeight: 700 }}>{fmt(colTotal)}</div>}
                  </div>
                )
              })()}
              <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cards.map((card: PipelineCard) => (
                  <div key={card.id} draggable
                    onDragStart={() => setDraggingId(card.id)}
                    onDragEnd={() => setDraggingId(null)}
                    style={{ background: draggingId === card.id ? '#F0FFF8' : '#FAFAF8', border: `1px solid ${draggingId === card.id ? col.color : 'var(--border)'}`, borderRadius: 8, padding: '10px 12px', cursor: 'grab', transition: 'all 0.15s' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 2 }}>{card.nome}</div>
                    {card.imovel && <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 2 }}>{card.imovel}</div>}
                    {card.valor && (() => {
                      const n = Number(card.valor.replace(/\D/g, ''))
                      return <div style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{n > 0 ? fmt(n) : card.valor}</div>
                    })()}
                    {card.nota && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontStyle: 'italic' }}>{card.nota}</div>}
                    <button onClick={() => removeCard(card.id)}
                      style={{ marginTop: 6, fontSize: 10, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                      ✕ remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── TO-DO ────────────────────────────────────────────────────────────────────
function TodoSection({ todos, saveTodos, newTodo, setNewTodo }: any) {
  const add = () => {
    if (!newTodo.trim()) return
    saveTodos([...todos, { id: Date.now().toString(), texto: newTodo.trim(), done: false }])
    setNewTodo('')
  }
  const toggle = (id: string) => saveTodos(todos.map((t: TodoItem) => t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id: string) => saveTodos(todos.filter((t: TodoItem) => t.id !== id))
  const pending = todos.filter((t: TodoItem) => !t.done)
  const done = todos.filter((t: TodoItem) => t.done)

  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Lista de tarefas</div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: 'var(--shadow-soft)', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Nova tarefa... (Enter para adicionar)"
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
          <Btn variant="accent" onClick={add} style={{ background: ACCENT }}>Adicionar</Btn>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pending.map((t: TodoItem) => (
          <div key={t.id} style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', boxShadow: 'var(--shadow-soft)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="checkbox" checked={false} onChange={() => toggle(t.id)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: ACCENT }} />
            <span style={{ flex: 1, fontSize: 14, color: 'var(--navy)' }}>{t.texto}</span>
            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 16, lineHeight: 1 }}>✕</button>
          </div>
        ))}
        {done.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-3)', marginTop: 8, paddingLeft: 4 }}>Concluídas ({done.length})</div>
            {done.map((t: TodoItem) => (
              <div key={t.id} style={{ background: '#F8FAFC', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.65 }}>
                <input type="checkbox" checked={true} onChange={() => toggle(t.id)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: ACCENT }} />
                <span style={{ flex: 1, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'line-through' }}>{t.texto}</span>
                <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 16, lineHeight: 1 }}>✕</button>
              </div>
            ))}
          </>
        )}
        {todos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--fg-3)', fontSize: 13 }}>
            Nenhuma tarefa. Adicione uma acima.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FINANÇAS ─────────────────────────────────────────────────────────────────
function FinancasSection({ leads, imoveis, pipeline }: any) {
  const [calcValor, setCalcValor] = useState('')
  const [finValor, setFinValor] = useState('')
  const [finEntrada, setFinEntrada] = useState('20')
  const [finTaxa, setFinTaxa] = useState('10.5')
  const [finPrazo, setFinPrazo] = useState('360')
  const [finSistema, setFinSistema] = useState<'SAC' | 'PRICE'>('SAC')
  const fechados = pipeline.filter((c: PipelineCard) => c.col === 'fechamento')
  const totalFechado = fechados.reduce((s: number, c: PipelineCard) => s + (Number(c.valor?.replace(/\D/g, '') ?? 0) || 0), 0)
  const potencial = pipeline.reduce((s: number, c: PipelineCard) => s + (Number(c.valor?.replace(/\D/g, '') ?? 0) || 0), 0)
  const calcNum = Number(calcValor.replace(/\D/g, ''))

  return (
    <div>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Finanças do Corretor</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Deals fechados', value: fechados.length.toString(), color: '#059669' },
          { label: 'Volume fechado', value: fmt(totalFechado), color: '#059669' },
          { label: 'Comissão (6%)', value: fmt(totalFechado * 0.06), color: '#D4A857' },
          { label: 'Volume potencial', value: fmt(potencial), color: '#6366F1' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: 'var(--shadow-soft)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 14, padding: '24px 28px', boxShadow: 'var(--shadow-soft)', maxWidth: 460, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Calculadora de comissão</div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelSt}>Valor do imóvel (R$)</label>
          <input value={calcValor} onChange={e => setCalcValor(e.target.value)} placeholder="Ex: 450000" style={inputSt} />
        </div>
        {calcNum > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ pct: 3, label: 'Plano Assistida (3%)' }, { pct: 6, label: 'Plano Completo (6%)' }].map(p => (
              <div key={p.pct} style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{p.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)' }}>{fmt(calcNum * p.pct / 100)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulador de financiamento */}
      {(() => {
        const vNum = Number(finValor.replace(/\D/g, ''))
        const entNum = vNum * Number(finEntrada) / 100
        const financiado = vNum - entNum
        const taxaM = Number(finTaxa) / 100 / 12
        const prazo = Number(finPrazo)
        const amortSAC = financiado / prazo
        const jurosPrim = financiado * taxaM
        const primSAC = amortSAC + jurosPrim
        const totalJurosSAC = financiado * taxaM * (prazo + 1) / 2
        const parcelaPrice = taxaM > 0
          ? financiado * (taxaM * Math.pow(1 + taxaM, prazo)) / (Math.pow(1 + taxaM, prazo) - 1)
          : financiado / prazo
        const totalJurosPrice = parcelaPrice * prazo - financiado
        const IS3: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fff' }
        return (
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px 28px', boxShadow: 'var(--shadow-soft)', marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Simulador de Financiamento</div>
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', marginBottom: 14 }}>
              {[
                { label: 'Valor do imóvel (R$)', val: finValor, set: setFinValor, ph: '500000' },
                { label: 'Entrada (%)', val: finEntrada, set: setFinEntrada, ph: '20', isSelect: false },
                { label: 'Juros a.a. (%)', val: finTaxa, set: setFinTaxa, ph: '10.5' },
              ].map(f => (
                <div key={f.label}>
                  <label style={labelSt}>{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={IS3} />
                </div>
              ))}
              <div>
                <label style={labelSt}>Prazo (meses)</label>
                <select value={finPrazo} onChange={e => setFinPrazo(e.target.value)} style={IS3}>
                  {[120, 180, 240, 300, 360, 420].map(p => <option key={p} value={p}>{p}m ({p/12} anos)</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: vNum > 0 ? 16 : 0 }}>
              {(['SAC', 'PRICE'] as const).map(s => (
                <button key={s} onClick={() => setFinSistema(s)}
                  style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid', borderColor: finSistema === s ? 'var(--navy)' : 'var(--border)', background: finSistema === s ? 'var(--navy)' : '#fff', color: finSistema === s ? '#fff' : 'var(--navy)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {s}
                </button>
              ))}
            </div>
            {vNum > 0 && financiado > 0 && (
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {finSistema === 'SAC' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>1ª parcela (SAC)</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)' }}>{fmt(primSAC)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>Última parcela</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{fmt(amortSAC * (1 + taxaM))}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>Total de juros (est.)</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>{fmt(totalJurosSAC)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Parcela fixa (PRICE)</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)' }}>{fmt(parcelaPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>Total de juros</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>{fmt(totalJurosPrice)}</span>
                    </div>
                  </>
                )}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>Total pago</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy)' }}>{fmt(finSistema === 'SAC' ? financiado + totalJurosSAC + entNum : parcelaPrice * prazo + entNum)}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Entrada {finEntrada}% = {fmt(entNum)} · Financiado: {fmt(financiado)} · {finTaxa}% a.a.</div>
              </div>
            )}
          </div>
        )
      })()}

      {fechados.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: '24px 28px', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Histórico de fechamentos</div>
          {fechados.map((c: PipelineCard) => {
            const val = Number(c.valor?.replace(/\D/g, '') ?? 0) || 0
            return (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{c.nome}</div>
                  {c.imovel && <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{c.imovel}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{val > 0 ? fmt(val) : '—'}</div>
                  {val > 0 && <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Comissão: {fmt(val * 0.06)}</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── SCRIPTS IA ───────────────────────────────────────────────────────────────
const SCRIPTS_CORRETOR = [
  {
    fase: 'Apresentação ao comprador — WhatsApp', cor: '#2F8674',
    texto: `Olá, [NOME]! Sou [SEU NOME], corretor parceiro da VN Prime.\n\nEntrei em contato pois temos um imóvel em [BAIRRO] que se encaixa no perfil que você está buscando: [TIPOLOGIA E CARACTERÍSTICAS].\n\nPosso te enviar fotos e detalhes completos agora. Teria 5 minutos para conversar?`,
  },
  {
    fase: 'Qualificação de interesse', cor: '#D4A857',
    texto: `Ótimo, [NOME]! Para encontrar o imóvel ideal, me conta:\n\n1. Qual faixa de valor você está pensando?\n2. Quantos quartos? Precisa de vaga de garagem?\n3. Tem preferência de bairro ou pode ser na Grande BH?\n4. Prazo para mudança — tem urgência?\n5. Vai usar financiamento, FGTS ou pagamento à vista?\n\nCom essas informações já consigo selecionar as melhores opções para você!`,
  },
  {
    fase: 'Pós-visita — Levantando interesse', cor: '#6366F1',
    texto: `[NOME], que ótima visita hoje!\n\nComo você pode ver, o imóvel oferece [TIPOLOGIA E CARACTERÍSTICAS].\n\nTemos outros interessados, mas quero garantir que você tenha a chance de fazer sua proposta primeiro.\n\nO que mais te chamou atenção? Tem algum ponto que ficou dúvida?`,
  },
  {
    fase: 'Encaminhando proposta', cor: '#0F1824',
    texto: `[NOME], fico feliz com seu interesse!\n\nPara formalizar sua proposta ao proprietário, preciso de:\n— Valor proposto\n— Forma de pagamento (à vista / financiamento / FGTS)\n— Prazo desejado para a transferência\n— Alguma condição especial\n\nVou apresentar ao proprietário e te retorno em até 24h. Podemos avançar?`,
  },
  {
    fase: 'Fechamento e próximos passos', cor: '#059669',
    texto: `[NOME], excelente notícia — proposta aceita!\n\nPróximos passos:\n1. Assinatura do contrato de compra e venda\n2. Pagamento de sinal (geralmente 10% do valor)\n3. Análise de crédito / aprovação de financiamento (se aplicável)\n4. Vistoria e laudo técnico\n5. Escritura e registro em cartório\n\nNossa equipe jurídica acompanha todo o processo. Vou te mandar o checklist completo aqui. Parabéns pela decisão!`,
  },
]

function ScriptCorretorSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiForm, setAiForm] = useState({ nome: '', bairro: '', tipo: '', contexto: '' })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReady, setAiReady] = useState(false)

  const personalizar = async () => {
    if (!aiForm.nome && !aiForm.bairro) return
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setAiReady(true); setAiLoading(false)
  }
  const applyAI = (texto: string) => {
    if (!aiReady) return texto
    let t = texto
    if (aiForm.nome) t = t.replace(/\[NOME\]/g, aiForm.nome)
    if (aiForm.bairro) t = t.replace(/\[BAIRRO\]/g, aiForm.bairro)
    if (aiForm.tipo) t = t.replace(/\[TIPOLOGIA E CARACTERÍSTICAS\]/g, aiForm.tipo)
    if (aiForm.contexto) t = t.replace(/\[CONTEXTO\]/g, aiForm.contexto)
    return t
  }
  const copy = (texto: string, fase: string) => {
    navigator.clipboard.writeText(applyAI(texto))
    setCopied(fase); setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 6 }}>Scripts do Corretor</div>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Mensagens prontas para cada etapa da venda</h3>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14 }}>Do primeiro contato ao fechamento. Personalize com os dados do cliente e use no WhatsApp.</p>
      </div>
      <div style={{ background: aiOpen ? '#F0FFF8' : '#fff', border: `1.5px solid ${aiOpen ? ACCENT : 'var(--border)'}`, borderRadius: 14, marginBottom: 20, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        <div onClick={() => setAiOpen(o => !o)} style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)' }}>Personalizar com IA</span>
            {aiReady && <span style={{ fontSize: 10, fontWeight: 800, background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: 99 }}>ATIVO</span>}
          </div>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>{aiOpen ? '▲' : '▼'}</span>
        </div>
        {aiOpen && (
          <div style={{ padding: '0 20px 20px', borderTop: '1px solid #D1FAE5' }}>
            <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: '14px 0 16px', lineHeight: 1.5 }}>Preencha os dados do cliente e do imóvel. Os scripts serão adaptados automaticamente.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 14 }}>
              {[
                { key: 'nome', label: 'Nome do cliente', placeholder: 'Ex.: Maria' },
                { key: 'bairro', label: 'Bairro / imóvel', placeholder: 'Ex.: Belvedere' },
                { key: 'tipo', label: 'Tipologia', placeholder: 'Ex.: Apto 3Q com suíte' },
                { key: 'contexto', label: 'Contexto (opcional)', placeholder: 'Ex.: comprando com FGTS' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={labelSt}>{label}</label>
                  <input value={(aiForm as any)[key]}
                    onChange={e => { setAiForm(f => ({ ...f, [key]: e.target.value })); setAiReady(false) }}
                    placeholder={placeholder} style={inputSt} />
                </div>
              ))}
            </div>
            <button onClick={personalizar} disabled={aiLoading || (!aiForm.nome && !aiForm.bairro)}
              style={{ padding: '9px 22px', borderRadius: 9, background: ACCENT, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: (aiLoading || (!aiForm.nome && !aiForm.bairro)) ? 0.6 : 1 }}>
              {aiLoading ? 'Personalizando...' : aiReady ? '✓ Scripts personalizados' : 'Personalizar scripts'}
            </button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SCRIPTS_CORRETOR.map(s => {
          const textoFinal = applyAI(s.texto)
          const isPersonalizado = aiReady && textoFinal !== s.texto
          return (
            <div key={s.fase} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAF8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.cor, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{s.fase}</span>
                  {isPersonalizado && <span style={{ fontSize: 10, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '2px 7px', borderRadius: 99 }}>✨ IA</span>}
                </div>
                <button onClick={() => copy(s.texto, s.fase)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${copied === s.fase ? '#059669' : 'var(--border)'}`, background: copied === s.fase ? '#D1FAE5' : '#fff', color: copied === s.fase ? '#065F46' : 'var(--fg-2)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {copied === s.fase ? '✓ Copiado!' : 'Copiar'}
                </button>
              </div>
              <pre style={{ margin: 0, padding: '18px 20px', fontSize: 13.5, lineHeight: 1.7, color: 'var(--fg-1)', fontFamily: 'var(--font-body)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{textoFinal}</pre>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── FOTÓGRAFO ────────────────────────────────────────────────────────────────
const FOTO_PACOTES_C = [
  { id: 'essencial', nome: 'Essencial', preco: 'R$ 390', duracao: '60 min', itens: ['25 fotos editadas em alta', 'Tratamento de luz e cor', 'Entrega em 48h', 'Direito de uso comercial'] },
  { id: 'completo', nome: 'Completo', preco: 'R$ 690', duracao: '90 min', destaque: true, itens: ['40 fotos editadas em alta', 'Tour virtual 360°', 'Vídeo curto (30s vertical)', 'Planta humanizada', 'Entrega em 48h'] },
  { id: 'premium', nome: 'Premium · com drone', preco: 'R$ 1.190', duracao: '2h', itens: ['60 fotos + drone aéreo', 'Tour 360° + Matterport', 'Vídeo cinematográfico (60s)', 'Plantas + contexto urbano', 'Entrega em 24h'] },
]

function FotografoSection() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 6 }}>Canal do Fotógrafo</div>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Contrate fotografia profissional para seus clientes</h3>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14 }}>Fotografia, tour virtual 360°, drone e vídeo cinematográfico. Imóveis com fotos profissionais vendem até 3× mais rápido. Atendemos toda a Grande BH. Entrega em até 48h.</p>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--fg-3)', background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, lineHeight: 1.5 }}>
          A VN Prime atua como portal de indicação. A contratação do serviço fotográfico é realizada diretamente com o profissional, e a VN Prime não se responsabiliza pela execução do serviço.
        </p>
      </div>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginBottom: 20 }}>
        {FOTO_PACOTES_C.map(p => (
          <div key={p.id} style={{ background: p.destaque ? 'var(--navy)' : '#fff', padding: 24, borderRadius: 16, border: p.destaque ? 'none' : '1px solid var(--border)', position: 'relative' }}>
            {p.destaque && <div style={{ position: 'absolute', top: -11, left: 20, background: 'var(--gold)', color: 'var(--navy-deep)', padding: '3px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Mais escolhido</div>}
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.destaque ? 'var(--gold-soft)' : 'var(--gold-deep)', marginBottom: 8 }}>{p.nome}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: p.destaque ? '#fff' : 'var(--navy)' }}>{p.preco}</div>
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
              <Btn variant={p.destaque ? 'accent' : 'primary'} size="sm" style={{ width: '100%' }}>Contratar {p.nome}</Btn>
            </Link>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 12 }}>Boosters — Add-ons opcionais</div>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {[
            { nome: 'Booster Mídia', preco: 'R$ 49', itens: ['+5 fotos extras tratadas', 'Capa otimizada para portais', 'Texto descritivo SEO', 'Entrega junto com o pacote'] },
            { nome: 'Booster Visibilidade', preco: 'R$ 99', itens: ['Destaque pago em 3 portais (15 dias)', 'Pack stories + reels (3 peças)', 'Distribuição por WhatsApp VN Prime', 'Relatório de impressões'] },
          ].map(b => (
            <div key={b.nome} style={{ background: '#F8FAFC', borderRadius: 14, border: '1px dashed var(--gold)', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{b.nome}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{b.preco}</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {b.itens.map(it => (
                  <li key={it} style={{ fontSize: 13, display: 'flex', gap: 8, color: 'var(--fg-1)' }}>
                    <span style={{ color: ACCENT, fontWeight: 700 }}>+</span>{it}
                  </li>
                ))}
              </ul>
              <Link href="/fotografo" style={{ display: 'block' }}>
                <Btn variant="ghost" size="sm" style={{ width: '100%' }}>Adicionar booster</Btn>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CADASTRO CORRETOR ────────────────────────────────────────────────────────
function CadastroCorretor({ profile, corretor, onSaved }: { profile: Profile | null; corretor: any; onSaved: () => void }) {
  const supabase = createClient()
  const [form, setForm] = useState({ nome: profile?.nome ?? '', telefone: profile?.telefone ?? '', creci: corretor?.creci ?? '', bio: corretor?.bio ?? '', especialidades: (corretor?.especialidades ?? []).join(', ') })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.creci) { setError('CRECI é obrigatório.'); return }
    setSaving(true); setError('')
    try {
      await supabase.from('profiles').upsert({ id: profile!.id, email: profile!.email, nome: form.nome, telefone: form.telefone, plano_ativo: true }, { onConflict: 'id' })
      await supabase.from('corretores').upsert({ profile_id: profile!.id, creci: form.creci, bio: form.bio, especialidades: form.especialidades.split(',').map((s: string) => s.trim()).filter(Boolean), ativo: true })
      onSaved()
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 560, width: '100%' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(24px,4vw,40px)', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>{corretor ? 'Meus dados' : 'Complete seu cadastro'}</h2>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 28 }}>{corretor ? 'Atualize suas informações.' : 'Para acessar o Portal do Corretor, preencha seus dados profissionais.'}</p>
        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[{ label: 'Nome completo', key: 'nome', placeholder: 'Seu nome' }, { label: 'WhatsApp', key: 'telefone', placeholder: '(31) 9 0000-0000' }, { label: 'CRECI *', key: 'creci', placeholder: 'Ex.: 45678-F/MG' }, { label: 'Especialidades (separadas por vírgula)', key: 'especialidades', placeholder: 'Alto padrão, Nova Lima, Investimento' }].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>{label}</label>
              <input value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>Bio (opcional)</label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Sobre você e sua experiência..." style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', resize: 'vertical' }} />
          </div>
          <Btn variant="primary" size="lg" onClick={save} loading={saving}>{corretor ? 'Salvar alterações' : 'Ativar Portal do Corretor'}</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqAccordionCorretor() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: 'Quanto custa participar como corretor parceiro?', a: 'O plano freemium é grátis. Você acessa o portfólio e recebe leads sem custo mensal. O modelo de receita é por comissão sobre vendas concluídas — sem mensalidade fixa.' },
    { q: 'Como os leads chegam até mim?', a: 'Quando um comprador demonstra interesse em um imóvel do seu portfólio (mensagem, agendamento ou proposta), você recebe uma notificação com nome, e-mail e WhatsApp do interessado diretamente no painel.' },
    { q: 'Preciso ter CRECI ativo?', a: 'Sim. A VN Prime trabalha apenas com corretores devidamente registrados no CRECI-MG. Isso protege proprietários e compradores e garante a qualidade do serviço.' },
    { q: 'Posso cadastrar meus próprios imóveis na plataforma?', a: 'Sim. Corretores parceiros podem cadastrar imóveis de seus clientes diretamente no portal, vinculados ao seu perfil. A curadoria VN Prime revisa antes de publicar.' },
    { q: 'Como funciona a comissão?', a: 'A comissão padrão é de 6% sobre o valor da venda — sendo 3% VN Prime e 3% do corretor. Em casos de venda direta (proprietário + comprador), a comissão é negociada individualmente.' },
    { q: 'Posso usar o CRM para clientes de outros portais?', a: 'Sim. O pipeline Kanban e o módulo de to-do são ferramentas pessoais que você pode usar para gerenciar qualquer lead, independentemente da origem.' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {faqs.map((f, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'inherit' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>{f.q}</span>
            <span style={{ color: 'var(--gold)', fontSize: 18, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
          </button>
          {open === i && (
            <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
              <div style={{ paddingTop: 14 }}>{f.a}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function CorretorLanding() {
  const FEATURES = [
    { icon: '🎯', title: 'Leads Qualificados', desc: 'Compradores verificados com perfil e orçamento compatível com seu portfólio. Sem spam, sem perda de tempo.' },
    { icon: '📊', title: 'CRM Visual', desc: 'Pipeline kanban, histórico completo de contatos, agendamento de visitas e alertas automáticos por WhatsApp.' },
    { icon: '🏠', title: 'Portfólio Exclusivo', desc: 'Acesso antecipado a imóveis premium em BH antes de irem ao mercado público — vantagem competitiva real.' },
    { icon: '💳', title: 'Comissões Transparentes', desc: 'Extrato mensal detalhado com histórico de vendas e comissões. Sem surpresas.' },
  ]
  return (
    <main style={{ background: 'var(--cream)' }}>
      <section style={{ position: 'relative', background: `linear-gradient(160deg, rgba(15,22,32,0.72) 0%, rgba(15,22,32,0.88) 60%, rgba(15,22,32,0.96) 100%), url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&q=85)`, backgroundSize: 'cover', backgroundPosition: 'center top', color: '#fff', padding: 'clamp(90px,14vw,160px) 0 clamp(70px,10vw,110px)' }}>
        <div style={{ position: 'relative', zIndex: 1, width: 'min(1180px,92vw)', margin: '0 auto', maxWidth: 780 }}>
          <Eyebrow>Portal do Corretor</Eyebrow>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem,4.5vw,3.6rem)', lineHeight: 1.06, margin: '14px 0 20px' }}>
            Leads qualificados, CRM completo e portfólio{' '}
            <em style={{ color: '#6EE7B7', fontStyle: 'italic' }}>premium</em>{' '}— tudo em um só lugar.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.86)', maxWidth: 600, marginBottom: 32, lineHeight: 1.6 }}>Acesse imóveis exclusivos VN Prime, receba leads qualificados diretamente no seu painel e acompanhe suas vendas em tempo real.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
            <Link href="/login?redirect=/corretor"><Btn variant="accent" size="lg" style={{ background: ACCENT, boxShadow: `0 6px 24px ${ACCENT}44` }}>Entrar no portal</Btn></Link>
            <Link href="/login?redirect=/corretor&tab=cadastrar&tipo=corretor"><Btn variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>Criar conta grátis</Btn></Link>
          </div>
          {/* Platform preview illustration */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, maxWidth: 560 }}>
            {[
              { label: 'Leads hoje', value: '12', icon: '👤', color: '#6EE7B7' },
              { label: 'Imóveis ativos', value: '47', icon: '🏠', color: '#D4A857' },
              { label: 'Em negociação', value: '5', icon: '⚖️', color: '#93C5FD' },
              { label: 'Comissão est.', value: 'R$ 38k', icon: '💰', color: '#6EE7B7' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: 'clamp(60px,8vw,100px) 0' }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 52px' }}>
            <Eyebrow color="var(--gold-deep)">O que você encontra</Eyebrow>
            <h2 style={{ margin: '10px 0 12px' }}>Tudo que você precisa em um só lugar</h2>
          </div>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fff', padding: '32px 28px', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(15,34,68,0.06)', transition: 'transform 0.18s, box-shadow 0.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(15,34,68,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(15,34,68,0.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--navy-deep,#0F1824)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 18 }}>{f.icon}</div>
                <div style={{ width: 32, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 14 }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)', marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats strip */}
      <section style={{ background: 'var(--navy-deep)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '22px 0' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { n: '500+', label: 'leads gerados/mês' },
            { n: '47', label: 'corretores parceiros' },
            { n: 'D+2', label: 'pagamento garantido' },
            { n: '4.9★', label: 'avaliação do portal' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '8px 32px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 900, color: ACCENT, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 52px' }}>
            <Eyebrow color={ACCENT}>Como funciona</Eyebrow>
            <h2 style={{ margin: '10px 0 12px' }}>Em 3 passos até os seus primeiros leads</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 0, position: 'relative' }}>
            {[
              { n: '01', icon: '✍️', title: 'Crie sua conta', desc: 'Cadastre-se gratuitamente com CRECI-MG válido. Aprovação em até 24h úteis após validação dos dados.', color: ACCENT },
              { n: '02', icon: '📋', title: 'Complete seu perfil', desc: 'Adicione foto, especialidades e regiões de atuação. Quanto mais completo, mais leads qualificados você recebe.', color: '#D4A857' },
              { n: '03', icon: '🚀', title: 'Receba e converta', desc: 'Leads chegam com contato completo no seu painel. Gerencie no CRM Kanban e feche vendas mais rápido.', color: '#6366F1' },
            ].map((step, i) => (
              <div key={step.n} style={{ padding: 'clamp(28px,4vw,44px)', position: 'relative', borderLeft: i > 0 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: step.color + '18', border: `2px solid ${step.color}44`, fontSize: 28, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: step.color, textTransform: 'uppercase', marginBottom: 10 }}>Passo {step.n}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--navy)', marginBottom: 12 }}>{step.title}</div>
                <p style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(860px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 44px' }}>
            <Eyebrow color={ACCENT}>Perguntas frequentes</Eyebrow>
            <h2 style={{ margin: '10px 0 12px' }}>Tudo que você precisa saber</h2>
          </div>
          <FaqAccordionCorretor />
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: 'linear-gradient(135deg,#0F1824 0%,#1B2733 100%)' }}>
        <div style={{ width: 'min(860px,92vw)', margin: '0 auto', textAlign: 'center', color: '#fff' }}>
          <Eyebrow>Comece hoje</Eyebrow>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', margin: '14px 0 16px' }}>Acesse o portal do corretor VN Prime</h2>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login?redirect=/corretor"><Btn variant="accent" size="lg" style={{ background: ACCENT, boxShadow: `0 6px 24px ${ACCENT}44` }}>Acessar meu portal</Btn></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
