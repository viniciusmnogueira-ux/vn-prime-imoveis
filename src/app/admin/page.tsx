'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'
import FinanceiroTab from './FinanceiroTab'

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtDate = (s: string) => new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

type Tab = 'dashboard' | 'curadoria' | 'imoveis' | 'leads' | 'usuarios' | 'financeiro'

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
                  {imoveis.map(im => (
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
                          <button onClick={() => deleteImovel(im.id)}
                            style={{ padding: '4px 10px', borderRadius: 6, background: '#FEF2F2', color: '#DC2626', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEADS */}
        {tab === 'leads' && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{leads.length} leads recebidos</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Nome', 'E-mail', 'Telefone', 'Mensagem', 'Origem', 'Data'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--navy)', whiteSpace: 'nowrap' }}>{l.nome}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B' }}>
                        <a href={`mailto:${l.email}`} style={{ color: 'var(--gold-deep)', textDecoration: 'none' }}>{l.email}</a>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>
                        {l.telefone ? <a href={`https://wa.me/55${l.telefone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>{l.telefone}</a> : '—'}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', maxWidth: 260 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.mensagem || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748B' }}>{l.origem || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', whiteSpace: 'nowrap' }}>{fmtDate(l.criado_em)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {tab === 'financeiro' && <FinanceiroTab imoveis={imoveis} leads={leads} />}

        {/* USUÁRIOS */}
        {tab === 'usuarios' && (
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
        )}
      </div>
    </main>
  )
}
