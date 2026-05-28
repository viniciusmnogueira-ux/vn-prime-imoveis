'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'
import FinanceiroTab from './FinanceiroTab'

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtDate = (s: string) => new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

type Tab = 'dashboard' | 'curadoria' | 'imoveis' | 'leads' | 'crm' | 'pipeline' | 'usuarios' | 'financeiro'

const STATUS_COLORS: Record<string, string> = {
  pendente: '#D97706', ativo: '#059669', pausado: '#6B7280', vendido: '#7C3AED', rascunho: '#94A3B8',
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('dashboard')

  const [stats, setStats] = useState({ imoveis: 0, pendentes: 0, leads: 0, usuarios: 0 })
  const [imoveis, setImoveis] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [openCuradoria, setOpenCuradoria] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Record<string, any>>({})
  const [notasInternas, setNotasInternas] = useState<Record<string, string>>({})
  const [adminEditId, setAdminEditId] = useState<string | null>(null)
  const [adminEditFields, setAdminEditFields] = useState<Record<string, any>>({})
  const [leadStatus, setLeadStatus] = useState<Record<string, string>>({})
  const [leadNota, setLeadNota] = useState<Record<string, string>>({})
  const [leadLido, setLeadLido] = useState<Record<string, boolean>>({})
  const [leadsOrigemFilter, setLeadsOrigemFilter] = useState('')
  const [newAccessEmail, setNewAccessEmail] = useState('')
  const [newAccessTipo, setNewAccessTipo] = useState('proprietario')
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser()
        if (authErr || !user) { window.location.href = '/login?redirect=/admin'; return }
        setUser(user)
        const { data: p, error: profErr } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profErr || !p) {
          // Perfil não encontrado — cria um básico e redireciona para login para tentar novamente
          window.location.href = '/login?redirect=/admin'; return
        }
        if (p.tipo !== 'admin') { window.location.href = '/'; return }
        setProfile(p)
        setLoading(false)
      } catch {
        window.location.href = '/login?redirect=/admin'
      }
    }
    checkAuth()
  }, [])

  const loadAll = useCallback(async () => {
    const [imRes, ldRes, usRes] = await Promise.all([
      supabase.from('imoveis').select('*, profiles(nome, email)').order('criado_em', { ascending: false }),
      supabase.from('leads').select('*').order('criado_em', { ascending: false }),
      supabase.from('profiles').select('*').order('criado_em', { ascending: false }),
    ])
    const imData = imRes.data || []
    const ldData = ldRes.data || []
    const usData = usRes.data || []
    setImoveis(imData)
    setLeads(ldData)
    setUsuarios(usData)
    setStats({
      imoveis: imData.length,
      pendentes: imData.filter((i: any) => i.status === 'pendente').length,
      leads: ldData.length,
      usuarios: usData.length,
    })
  }, [])

  useEffect(() => { if (!loading) loadAll() }, [loading, loadAll])

  useEffect(() => {
    if (loading) return
    const ls = localStorage.getItem('vnp_admin_leadstatus')
    const ln = localStorage.getItem('vnp_admin_leadnota')
    const ll = localStorage.getItem('vnp_admin_leadlido')
    if (ls) try { setLeadStatus(JSON.parse(ls)) } catch {}
    if (ln) try { setLeadNota(JSON.parse(ln)) } catch {}
    if (ll) try { setLeadLido(JSON.parse(ll)) } catch {}
  }, [loading])

  async function setImovelStatus(id: string, status: string) {
    await supabase.from('imoveis').update({ status }).eq('id', id)
    setImoveis(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    setStats(s => ({
      ...s,
      pendentes: imoveis.filter(i => (i.id === id ? status : i.status) === 'pendente').length,
    }))
  }

  async function deleteImovel(id: string) {
    if (!confirm('Excluir este imóvel?')) return
    await supabase.from('imoveis').delete().eq('id', id)
    setImoveis(prev => prev.filter(i => i.id !== id))
  }

  async function setUserTipo(id: string, tipo: string) {
    await supabase.from('profiles').update({ tipo }).eq('id', id)
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, tipo } : u))
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 15, color: '#64748B' }}>Verificando acesso...</div>
      </main>
    )
  }

  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'curadoria', label: 'Curadoria', badge: stats.pendentes || undefined },
    { key: 'imoveis', label: 'Imóveis' },
    { key: 'leads', label: 'Leads', badge: stats.leads || undefined },
    { key: 'crm', label: 'CRM' },
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'usuarios', label: 'Usuários' },
    { key: 'financeiro', label: 'Financeiro' },
  ]

  return (
    <main style={{ background: '#F1F5F9', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--navy)', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: 'min(1300px,96vw)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
            VN Prime — Painel Admin
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{profile?.nome || user?.email}</span>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Site</Link>
            <button onClick={() => { window.location.href = '/api/auth/signout' }}
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ width: 'min(1300px,96vw)', margin: '0 auto', display: 'flex', gap: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '14px 20px', border: 'none', background: 'none',
                fontSize: 13.5, fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? 'var(--navy)' : '#64748B',
                borderBottom: tab === t.key ? '2px solid var(--gold)' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'color 0.15s',
              }}>
              {t.label}
              {t.badge ? (
                <span style={{ background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>{t.badge}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: 'min(1300px,96vw)', margin: '0 auto', padding: '28px 0 60px' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Imóveis cadastrados', value: stats.imoveis, accent: 'var(--navy)' },
                { label: 'Imóveis pendentes', value: stats.pendentes, accent: '#D97706' },
                { label: 'Leads recebidos', value: stats.leads, accent: '#059669' },
                { label: 'Usuários', value: stats.usuarios, accent: '#7C3AED' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.accent, letterSpacing: '-0.03em' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Imóveis pendentes */}
            {stats.pendentes > 0 && (
              <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E', marginBottom: 12 }}>
                  {stats.pendentes} imóvel(is) aguardando aprovação
                </div>
                {imoveis.filter(i => i.status === 'pendente').map(im => (
                  <div key={im.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #FED7AA', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{im.titulo}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{im.bairro}, {im.cidade} · {im.preco ? fmt(im.preco) : '—'} · por {im.profiles?.nome || im.profiles?.email || '—'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Btn variant="primary" size="sm" onClick={() => setImovelStatus(im.id, 'ativo')}>Aprovar</Btn>
                      <Btn variant="danger" size="sm" onClick={() => setImovelStatus(im.id, 'rascunho')}>Rejeitar</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Últimos leads */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>Últimos leads</div>
                <button onClick={() => setTab('leads')} style={{ fontSize: 12, color: 'var(--gold-deep)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>Ver todos →</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Nome', 'Contato', 'Origem', 'Data'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice(0, 5).map(l => (
                      <tr key={l.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{l.nome}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>
                          <div>{l.email}</div>
                          <div>{l.telefone}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>{l.origem || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>{fmtDate(l.criado_em)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* IMÓVEIS */}
        {tab === 'imoveis' && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{imoveis.length} imóveis cadastrados</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Imóvel', 'Proprietário', 'Preço', 'Status', 'Data', 'Ações'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {imoveis.map(im => (<>
                    <tr key={im.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', maxWidth: 220 }}>{im.titulo}</div>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{im.bairro}, {im.cidade} · {im.tipo}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>
                        <div>{im.profiles?.nome || '—'}</div>
                        <div style={{ fontSize: 11 }}>{im.profiles?.email}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--navy)', whiteSpace: 'nowrap' }}>
                        {im.preco ? fmt(im.preco) : '—'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: `${STATUS_COLORS[im.status]}18`, color: STATUS_COLORS[im.status],
                        }}>{im.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', whiteSpace: 'nowrap' }}>{fmtDate(im.criado_em)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {im.status === 'pendente' && (
                            <button onClick={() => setImovelStatus(im.id, 'ativo')}
                              style={{ padding: '4px 10px', borderRadius: 6, background: '#059669', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                              Aprovar
                            </button>
                          )}
                          {im.status === 'ativo' && (
                            <button onClick={() => setImovelStatus(im.id, 'pausado')}
                              style={{ padding: '4px 10px', borderRadius: 6, background: '#6B7280', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                              Pausar
                            </button>
                          )}
                          {im.status === 'pausado' && (
                            <button onClick={() => setImovelStatus(im.id, 'ativo')}
                              style={{ padding: '4px 10px', borderRadius: 6, background: '#059669', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                              Reativar
                            </button>
                          )}
                          <Link href={`/imovel/${im.id}`} target="_blank"
                            style={{ padding: '4px 10px', borderRadius: 6, background: '#F1F5F9', color: 'var(--navy)', border: 'none', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
                            Ver
                          </Link>
                          <button onClick={() => {
                              if (adminEditId === im.id) { setAdminEditId(null); setAdminEditFields({}) }
                              else { setAdminEditId(im.id); setAdminEditFields({ titulo: im.titulo ?? '', preco: im.preco ?? '', bairro: im.bairro ?? '', cidade: im.cidade ?? '', area: im.area ?? im.area_m2 ?? '', quartos: im.quartos ?? '', descricao: im.descricao ?? '' }) }
                            }}
                            style={{ padding: '4px 10px', borderRadius: 6, background: adminEditId === im.id ? 'var(--navy)' : '#EFF8FF', color: adminEditId === im.id ? '#fff' : '#0369A1', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            {adminEditId === im.id ? 'Fechar' : 'Editar'}
                          </button>
                          <button onClick={() => deleteImovel(im.id)}
                            style={{ padding: '4px 10px', borderRadius: 6, background: '#FEF2F2', color: '#DC2626', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                    {adminEditId === im.id && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0 14px 16px' }}>
                          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '18px 20px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0369A1', marginBottom: 14 }}>Editar imóvel — {im.titulo}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 10, marginBottom: 12 }}>
                              {[
                                { label: 'Título', key: 'titulo' }, { label: 'Preço (R$)', key: 'preco' },
                                { label: 'Bairro', key: 'bairro' }, { label: 'Cidade', key: 'cidade' },
                                { label: 'Área m²', key: 'area' }, { label: 'Quartos', key: 'quartos' },
                              ].map(({ label, key }) => (
                                <div key={key}>
                                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                                  <input value={adminEditFields[key] ?? ''} onChange={e => setAdminEditFields(p => ({ ...p, [key]: e.target.value }))}
                                    style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                              ))}
                            </div>
                            <div style={{ marginBottom: 12 }}>
                              <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', display: 'block', marginBottom: 4 }}>Descrição</label>
                              <textarea value={adminEditFields.descricao ?? ''} rows={2} onChange={e => setAdminEditFields(p => ({ ...p, descricao: e.target.value }))}
                                style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                              <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', display: 'block', marginBottom: 4 }}>Status</label>
                              <select value={im.status} onChange={e => { setImovelStatus(im.id, e.target.value); setAdminEditFields(p => ({ ...p })) }}
                                style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                                {['pendente','ativo','pausado','vendido','rascunho'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={async () => {
                                  await supabase.from('imoveis').update(adminEditFields).eq('id', im.id)
                                  setImoveis(prev => prev.map(i => i.id === im.id ? { ...i, ...adminEditFields } : i))
                                  setAdminEditId(null); setAdminEditFields({})
                                }}
                                style={{ padding: '7px 16px', borderRadius: 8, background: 'var(--navy)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Salvar
                              </button>
                              <button onClick={() => { setAdminEditId(null); setAdminEditFields({}) }}
                                style={{ padding: '7px 12px', borderRadius: 8, background: '#F1F5F9', color: '#64748B', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEADS */}
        {tab === 'leads' && (() => {
          const ORIGENS = Array.from(new Set(leads.map(l => l.origem).filter(Boolean))) as string[]
          const filtered = leadsOrigemFilter ? leads.filter(l => l.origem === leadsOrigemFilter) : leads
          const naoLidos = leads.filter(l => !leadLido[l.id]).length
          const toggleLido = (id: string) => {
            const next = { ...leadLido, [id]: !leadLido[id] }
            setLeadLido(next)
            localStorage.setItem('vnp_admin_leadlido', JSON.stringify(next))
          }
          const ORIGEM_COLORS: Record<string, string> = {
            detalhe: '#3B82F6', agendamento: '#059669', proposta: '#7C3AED',
            avaliacao: '#D97706', vender_completa: '#DC2626', 'vender-completa': '#DC2626',
          }
          return (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{filtered.length} leads {leadsOrigemFilter ? `(${leadsOrigemFilter})` : 'recebidos'}</div>
                  {naoLidos > 0 && <div style={{ fontSize: 12, color: '#DC2626', marginTop: 2 }}>{naoLidos} não lidos</div>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['', ...ORIGENS].map(o => (
                    <button key={o} onClick={() => setLeadsOrigemFilter(o)}
                      style={{ padding: '4px 12px', borderRadius: 99, border: '1px solid', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', borderColor: leadsOrigemFilter === o ? 'var(--navy)' : '#E2E8F0', background: leadsOrigemFilter === o ? 'var(--navy)' : '#fff', color: leadsOrigemFilter === o ? '#fff' : '#64748B' }}>
                      {o || 'Todos'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['', 'Nome', 'E-mail', 'Telefone', 'Mensagem', 'Origem', 'Data'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(l => {
                      const lido = !!leadLido[l.id]
                      return (
                        <tr key={l.id} style={{ borderTop: '1px solid #F1F5F9', background: lido ? 'transparent' : 'rgba(59,130,246,0.04)' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <button onClick={() => toggleLido(l.id)} title={lido ? 'Marcar como não lido' : 'Marcar como lido'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: lido ? '#CBD5E1' : '#3B82F6' }}>
                              {lido ? '○' : '●'}
                            </button>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: lido ? 400 : 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>{l.nome}</td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>
                            <a href={`mailto:${l.email}`} style={{ color: 'var(--gold-deep)', textDecoration: 'none' }}>{l.email}</a>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>
                            {l.telefone ? <a href={`https://wa.me/55${l.telefone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>{l.telefone}</a> : '—'}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', maxWidth: 260 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.mensagem || '—'}</div>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: 11 }}>
                            <span style={{ background: ORIGEM_COLORS[l.origem ?? ''] ? `${ORIGEM_COLORS[l.origem]}20` : '#F1F5F9', color: ORIGEM_COLORS[l.origem ?? ''] ?? '#64748B', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>{l.origem || '—'}</span>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', whiteSpace: 'nowrap' }}>{fmtDate(l.criado_em)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })()}

        {/* CURADORIA */}
        {tab === 'curadoria' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
                Curadoria de imóveis — {imoveis.filter(i => i.status === 'pendente' || i.status === 'rascunho').length} pendentes
              </div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Revise, edite e aprove cada imóvel antes de publicar.</div>
            </div>
            {imoveis.filter(i => i.status === 'pendente' || i.status === 'rascunho').length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>Nenhum imóvel pendente</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>Todos os imóveis foram revisados.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {imoveis.filter(i => i.status === 'pendente' || i.status === 'rascunho').map(im => {
                  const isOpen = openCuradoria === im.id
                  const ef = editFields[im.id] ?? {}
                  return (
                    <div key={im.id} style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${isOpen ? 'var(--gold)' : '#E2E8F0'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                      <div style={{ padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setOpenCuradoria(isOpen ? null : im.id)}>
                        {im.fotos?.[0] && <img src={im.fotos[0]} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{im.titulo}</span>
                            <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: `${STATUS_COLORS[im.status]}18`, color: STATUS_COLORS[im.status] }}>{im.status}</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{im.bairro}, {im.cidade} · {im.tipo} · {im.preco ? fmt(im.preco) : '—'}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>por {im.profiles?.nome || im.profiles?.email || '—'} · {fmtDate(im.criado_em)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                          <button onClick={e => { e.stopPropagation(); setImovelStatus(im.id, 'ativo') }}
                            style={{ padding: '6px 14px', borderRadius: 8, background: '#059669', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Aprovar</button>
                          <button onClick={e => { e.stopPropagation(); setImovelStatus(im.id, 'rascunho') }}
                            style={{ padding: '6px 14px', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Rejeitar</button>
                          <span style={{ fontSize: 16, color: '#94A3B8', userSelect: 'none' }}>{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {isOpen && (
                        <div style={{ borderTop: '1px solid #F1F5F9', padding: 20 }}>
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#64748B', textTransform: 'uppercase' }}>
                                Fotos {im.fotos?.length > 0 ? `(${im.fotos.length})` : '— nenhuma'}
                              </div>
                              <label style={{ padding: '5px 12px', borderRadius: 7, background: '#EFF8FF', color: '#0369A1', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid #BAE6FD' }}>
                                + Adicionar fotos
                                <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                  onChange={async e => {
                                    const files = Array.from(e.target.files || [])
                                    if (!files.length) return
                                    const urls: string[] = []
                                    for (const file of files) {
                                      const ext = file.name.split('.').pop()
                                      const path = `imoveis/${im.proprietario_id ?? 'admin'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                                      const { error: upErr } = await supabase.storage.from('imoveis').upload(path, file)
                                      if (!upErr) {
                                        const { data: { publicUrl } } = supabase.storage.from('imoveis').getPublicUrl(path)
                                        urls.push(publicUrl)
                                      }
                                    }
                                    if (urls.length) {
                                      const newFotos = [...(im.fotos ?? []), ...urls]
                                      await supabase.from('imoveis').update({ fotos: newFotos }).eq('id', im.id)
                                      setImoveis(prev => prev.map(i => i.id === im.id ? { ...i, fotos: newFotos } : i))
                                    }
                                  }} />
                              </label>
                            </div>
                            {im.fotos?.length > 0 && (
                              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                                {im.fotos.map((f: string, idx: number) => (
                                  <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                                    <img src={f} alt="" style={{ height: 90, width: 130, objectFit: 'cover', borderRadius: 8 }} />
                                    <button onClick={async () => {
                                      const newFotos = im.fotos.filter((_: string, i: number) => i !== idx)
                                      await supabase.from('imoveis').update({ fotos: newFotos }).eq('id', im.id)
                                      setImoveis(prev => prev.map(i => i.id === im.id ? { ...i, fotos: newFotos } : i))
                                    }} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220,38,38,0.85)', color: '#fff', border: 'none', borderRadius: 99, width: 20, height: 20, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>✕</button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 14 }}>
                            {[
                              { label: 'Título', key: 'titulo', val: ef.titulo ?? im.titulo ?? '' },
                              { label: 'Preço (R$)', key: 'preco', val: ef.preco ?? im.preco ?? '' },
                              { label: 'Bairro', key: 'bairro', val: ef.bairro ?? im.bairro ?? '' },
                              { label: 'Cidade', key: 'cidade', val: ef.cidade ?? im.cidade ?? '' },
                              { label: 'Área m²', key: 'area', val: ef.area ?? im.area ?? '' },
                              { label: 'Quartos', key: 'quartos', val: ef.quartos ?? im.quartos ?? '' },
                            ].map(({ label, key, val }) => (
                              <div key={key}>
                                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                                <input value={val} onChange={e => setEditFields(prev => ({ ...prev, [im.id]: { ...(prev[im.id] ?? {}), [key]: e.target.value } }))}
                                  style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
                              </div>
                            ))}
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', display: 'block', marginBottom: 4 }}>Descrição</label>
                            <textarea value={ef.descricao ?? im.descricao ?? ''} rows={3}
                              onChange={e => setEditFields(prev => ({ ...prev, [im.id]: { ...(prev[im.id] ?? {}), descricao: e.target.value } }))}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', background: '#FAFAFA', boxSizing: 'border-box' }} />
                          </div>
                          <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', display: 'block', marginBottom: 4 }}>Notas internas (não visíveis ao proprietário)</label>
                            <textarea value={notasInternas[im.id] ?? ''} rows={2}
                              onChange={e => setNotasInternas(prev => ({ ...prev, [im.id]: e.target.value }))}
                              placeholder="Observações de curadoria, pendências, histórico..."
                              style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px dashed #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', background: '#FFFBF0', color: '#92400E', boxSizing: 'border-box' }} />
                          </div>
                          {editFields[im.id] && Object.keys(editFields[im.id]).length > 0 && (
                            <div style={{ display: 'flex', gap: 10 }}>
                              <button onClick={async () => {
                                await supabase.from('imoveis').update(editFields[im.id]).eq('id', im.id)
                                setImoveis(prev => prev.map(i => i.id === im.id ? { ...i, ...editFields[im.id] } : i))
                                setEditFields(prev => { const n = { ...prev }; delete n[im.id]; return n })
                              }} style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--navy)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Salvar edições
                              </button>
                              <button onClick={() => setEditFields(prev => { const n = { ...prev }; delete n[im.id]; return n })}
                                style={{ padding: '8px 14px', borderRadius: 8, background: '#F1F5F9', color: '#64748B', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Descartar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* CRM */}
        {tab === 'crm' && (() => {
          const CRM_OPTS = ['novo','contatado','qualificado','proposta','fechado','sem interesse']
          const ST_COLOR: Record<string, string> = {
            novo: '#6366F1', contatado: '#D97706', qualificado: '#0369A1',
            proposta: '#7C3AED', fechado: '#059669', 'sem interesse': '#94A3B8',
          }
          const saveSt = (id: string, val: string) => {
            const ns = { ...leadStatus, [id]: val }
            setLeadStatus(ns)
            localStorage.setItem('vnp_admin_leadstatus', JSON.stringify(ns))
          }
          const saveNota = (id: string, val: string) => {
            const nn = { ...leadNota, [id]: val }
            setLeadNota(nn)
            localStorage.setItem('vnp_admin_leadnota', JSON.stringify(nn))
          }
          return (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>CRM de Leads — {leads.length} contatos</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Gerencie o status e notas de cada lead. Dados salvos localmente.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {leads.map(l => {
                  const st = leadStatus[l.id] ?? 'novo'
                  const nota = leadNota[l.id] ?? ''
                  return (
                    <div key={l.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 2 }}>{l.nome}</div>
                          <div style={{ fontSize: 12, color: '#64748B' }}>{l.email}{l.telefone ? ` · ${l.telefone}` : ''}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{l.origem ?? '—'} · {fmtDate(l.criado_em)}</div>
                          {l.mensagem && <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontStyle: 'italic' }}>"{l.mensagem.slice(0, 120)}{l.mensagem.length > 120 ? '…' : ''}"</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: `${ST_COLOR[st]}18`, color: ST_COLOR[st] }}>{st}</span>
                          <select value={st} onChange={e => saveSt(l.id, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', color: 'var(--navy)' }}>
                            {CRM_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                          {l.telefone && (
                            <a href={`https://wa.me/55${l.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                              style={{ padding: '4px 12px', borderRadius: 6, background: '#DCFCE7', color: '#166534', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>WhatsApp</a>
                          )}
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <textarea value={nota} rows={1} placeholder="Notas sobre este lead..."
                          onChange={e => saveNota(l.id, e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box', color: 'var(--navy)' }} />
                      </div>
                    </div>
                  )
                })}
                {leads.length === 0 && (
                  <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '60px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>Nenhum lead ainda.</div>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* PIPELINE */}
        {tab === 'pipeline' && (() => {
          const COLS = ['novo', 'contatado', 'qualificado', 'proposta', 'fechado']
          const COL_LABELS: Record<string, string> = { novo: 'Novos', contatado: 'Contatados', qualificado: 'Qualificados', proposta: 'Proposta', fechado: 'Fechados' }
          const COL_COLORS: Record<string, string> = { novo: '#6366F1', contatado: '#D97706', qualificado: '#0369A1', proposta: '#7C3AED', fechado: '#059669' }
          return (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Pipeline de Leads</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Visualização kanban dos leads por status. Altere o status no CRM para mover os cards.</div>
              </div>
              <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12, alignItems: 'flex-start' }}>
                {COLS.map(col => {
                  const colLeads = leads.filter(l => (leadStatus[l.id] ?? 'novo') === col)
                  return (
                    <div key={col} style={{ minWidth: 210, flex: '1 0 210px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '0 4px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COL_COLORS[col], flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{COL_LABELS[col]}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, background: `${COL_COLORS[col]}18`, color: COL_COLORS[col], padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{colLeads.length}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {colLeads.map(l => (
                          <div key={l.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 2 }}>{l.nome}</div>
                            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>{l.origem ?? '—'} · {fmtDate(l.criado_em)}</div>
                            {leadNota[l.id] && <div style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic', marginBottom: 6 }}>"{leadNota[l.id].slice(0, 60)}{leadNota[l.id].length > 60 ? '…' : ''}"</div>}
                            {l.telefone && (
                              <a href={`https://wa.me/55${l.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: 11, color: '#25D366', textDecoration: 'none', fontWeight: 700 }}>WhatsApp →</a>
                            )}
                          </div>
                        ))}
                        {colLeads.length === 0 && (
                          <div style={{ background: '#F8FAFC', borderRadius: 10, border: '1px dashed #E2E8F0', padding: '20px 14px', textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>Sem leads</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {tab === 'financeiro' && <FinanceiroTab imoveis={imoveis} leads={leads} />}

        {/* USUÁRIOS */}
        {tab === 'usuarios' && (
          <div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '18px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Convidar novo usuário</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <input type="email" placeholder="E-mail do usuário" value={newAccessEmail}
                onChange={e => setNewAccessEmail(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', minWidth: 240 }} />
              <select value={newAccessTipo} onChange={e => setNewAccessTipo(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, fontFamily: 'inherit', outline: 'none', cursor: 'pointer', background: '#fff', color: 'var(--navy)' }}>
                {['proprietario', 'corretor', 'incorporadora', 'admin'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={() => {
                if (!newAccessEmail) return
                const msg = encodeURIComponent(`Olá! Você foi convidado para acessar o portal VN Prime Imóveis como ${newAccessTipo}. Acesse vnprimeimoveis.com/login e cadastre-se com este e-mail: ${newAccessEmail}`)
                window.open(`https://wa.me/?text=${msg}`, '_blank')
              }}
                style={{ padding: '8px 16px', borderRadius: 8, background: '#25D366', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Enviar convite WhatsApp
              </button>
              <button onClick={() => {
                if (!newAccessEmail) return
                window.location.href = `mailto:${newAccessEmail}?subject=Convite%20VN%20Prime%20Im%C3%B3veis&body=Ol%C3%A1!%20Voc%C3%AA%20foi%20convidado%20para%20o%20portal%20VN%20Prime%20Im%C3%B3veis%20como%20${newAccessTipo}.%20Acesse%20vnprimeimoveis.com%2Flogin%20e%20cadastre-se%20com%20este%20e-mail.`
              }}
                style={{ padding: '8px 16px', borderRadius: 8, background: '#EFF8FF', color: '#0369A1', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Enviar por e-mail
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>Após o cadastro, altere o tipo do usuário na tabela abaixo.</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{usuarios.length} usuários cadastrados</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Nome', 'E-mail', 'Tipo', 'CRECI', 'Cadastro', 'Ações'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{u.nome || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>{u.email}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: u.tipo === 'admin' ? '#1B273318' : u.tipo === 'corretor' ? '#05966918' : '#D4A85718',
                          color: u.tipo === 'admin' ? 'var(--navy)' : u.tipo === 'corretor' ? '#059669' : '#92400E',
                        }}>{u.tipo}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>{u.creci || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', whiteSpace: 'nowrap' }}>{fmtDate(u.criado_em)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        {u.id !== user?.id && (
                          <select value={u.tipo} onChange={e => setUserTipo(u.id, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', background: '#fff', color: 'var(--navy)' }}>
                            {['proprietario', 'corretor', 'incorporadora', 'admin'].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}
      </div>
    </main>
  )
}
