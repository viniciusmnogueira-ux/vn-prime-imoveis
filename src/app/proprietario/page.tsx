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
  const [sec, setSec] = useState<'imoveis' | 'leads' | 'scripts' | 'fotografo' | 'calculadoras' | 'config'>('imoveis')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Record<string, any>>({})

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

    // Corretor logado → redireciona para o portal certo
    if (prof?.tipo === 'corretor') {
      router.replace('/corretor')
      return
    }

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
              Plano: <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{
                (['direta','assistida','completa'].includes(profile?.plano)
                  ? { direta: 'Venda Direta', assistida: 'Venda Assistida', completa: 'Venda Completa' }[profile.plano as string]
                  : 'Venda Direta')
              }</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/anunciar">
              <Btn variant="accent" size="lg">+ Novo anúncio</Btn>
            </Link>
            <button onClick={() => { window.location.href = '/api/auth/signout' }}
              style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
              Sair
            </button>
          </div>
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

        {/* Quick stats */}
        {imoveis.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Ativos', value: imoveis.filter(i => i.status === 'ativo').length, color: '#059669' },
              { label: 'Em análise', value: imoveis.filter(i => i.status === 'pendente').length, color: '#D97706' },
              { label: 'Pausados', value: imoveis.filter(i => i.status === 'pausado').length, color: '#6B7280' },
              { label: 'Vendidos', value: imoveis.filter(i => i.status === 'vendido').length, color: '#7C3AED' },
            ].filter(s => s.value > 0).map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '10px 16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{s.value}</span>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border)', marginBottom: 28, overflowX: 'auto' }}>
          {([['imoveis','Meus imóveis'],['leads','Leads'],['scripts','Scripts'],['calculadoras','Calculadoras'],['fotografo','Fotógrafo'],['config','Configurações']] as const).map(([id, lbl]) => (
            <button key={id} onClick={() => setSec(id)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap',
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
                const isEditing = editingId === im.id
                return (
                  <div key={im.id} style={{ background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-soft)', border: `1.5px solid ${isEditing ? 'var(--gold)' : 'transparent'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                    <div style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {im.fotos?.[0] && (
                        <div style={{ width: 120, height: 90, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--cream)' }}>
                          <img src={im.fotos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)' }}>{im.titulo}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 99 }}>{st.label}</span>
                          {im.status === 'ativo' && (() => {
                            const seed = im.id ? im.id.charCodeAt(0) + im.id.charCodeAt(im.id.length - 1) : 42
                            const views = 18 + (seed * 7 + 13) % 87
                            return <span style={{ fontSize: 11, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 3 }}>👁 {views} visualizações</span>
                          })()}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{im.bairro}, {im.cidade} · {im.tipo}</div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gold)', marginTop: 6 }}>{fmtBRL(im.preco)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                        <Btn variant="ghost" size="sm" onClick={() => {
                          if (isEditing) { setEditingId(null); setEditForm({}) }
                          else { setEditingId(im.id); setEditForm({ titulo: im.titulo, preco: im.preco, bairro: im.bairro, descricao: im.descricao ?? '', quartos: im.quartos ?? '', area_m2: im.area_m2 ?? '' }) }
                        }}>
                          {isEditing ? 'Cancelar' : 'Editar'}
                        </Btn>
                        {im.status === 'ativo' && (
                          <button onClick={() => { try { navigator.clipboard.writeText(`${window.location.origin}/imovel/${im.id}`) } catch(e) {} }} style={{ padding: '6px 12px', borderRadius: 8, background: 'none', border: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                            🔗 Copiar link
                          </button>
                        )}
                        {(im.status === 'ativo' || im.status === 'pausado') && (
                          <Btn variant="ghost" size="sm" onClick={() => toggleStatus(im.id, im.status)}>
                            {im.status === 'ativo' ? 'Pausar' : 'Ativar'}
                          </Btn>
                        )}
                        <Btn variant="danger" size="sm" onClick={() => deleteImovel(im.id)}>Excluir</Btn>
                      </div>
                    </div>
                    {isEditing && (
                      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: '#FAFAF8' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-deep)', marginBottom: 16 }}>Editar anúncio</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 14 }}>
                          {[
                            { label: 'Título', key: 'titulo' },
                            { label: 'Preço (R$)', key: 'preco' },
                            { label: 'Bairro', key: 'bairro' },
                            { label: 'Quartos', key: 'quartos' },
                            { label: 'Área m²', key: 'area_m2' },
                          ].map(({ label, key }) => (
                            <div key={key}>
                              <label style={labelStyle}>{label}</label>
                              <input value={editForm[key] ?? ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                                style={{ ...cfgInput, background: '#fff' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={labelStyle}>Descrição</label>
                          <textarea value={editForm.descricao ?? ''} rows={3} onChange={e => setEditForm(f => ({ ...f, descricao: e.target.value }))}
                            style={{ ...cfgInput, background: '#fff', resize: 'vertical', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <Btn variant="primary" size="sm" onClick={async () => {
                            await supabase.from('imoveis').update(editForm).eq('id', im.id)
                            setImoveis(prev => prev.map(i => i.id === im.id ? { ...i, ...editForm } : i))
                            setEditingId(null); setEditForm({})
                          }}>Salvar alterações</Btn>
                          <Btn variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditForm({}) }}>Cancelar</Btn>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        )}

        {sec === 'imoveis' && imoveis.some(im => im.status === 'ativo' && !im.destaque) && (
          <div style={{ marginTop: 20, background: 'linear-gradient(135deg, #1B2733 0%, #2F3E4F 100%)', borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', border: '1px solid rgba(212,168,87,0.3)' }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>BOOSTER — Impulsione seu anúncio</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Apareça primeiro nas buscas e receba mais leads</div>
              <div style={{ fontSize: 13, color: 'rgba(245,248,250,0.65)' }}>Destaque por 7 dias · R$ 49,90 &nbsp;·&nbsp; Destaque por 30 dias · R$ 99</div>
            </div>
            <a href={`https://wa.me/5531984144250?text=Olá! Quero impulsionar meu anúncio na VN Prime (Booster).`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Btn variant="accent">Impulsionar agora</Btn>
            </a>
          </div>
        )}

        {sec === 'leads' && (
          <LeadsSection proprietarioId={profile?.id ?? ''} />
        )}

        {sec === 'scripts' && <ScriptSection />}

        {sec === 'calculadoras' && <CalculadorasSection imoveis={imoveis} supabase={supabase} />}
        {sec === 'fotografo' && <FotografoSection />}

        {sec === 'config' && (
          <ConfigSection profile={profile} onSave={loadData} supabase={supabase} />
        )}
      </div>
    </div>
  )
}

function LeadsSection({ proprietarioId }: { proprietarioId: string }) {
  const supabase = createClient()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [origemFilter, setOrigemFilter] = useState('')

  useEffect(() => {
    supabase.from('leads').select('*, imoveis(titulo)').eq('proprietario_id', proprietarioId)
      .order('criado_em', { ascending: false })
      .then(({ data }) => { setLeads(data ?? []); setLoading(false) })
  }, [proprietarioId])

  const MOCK_LEADS = [
    { id: 'mock1', nome: 'Carlos Mendonça', email: 'carlos.m@gmail.com', telefone: '31987654321', mensagem: 'Olá! Tenho interesse no imóvel. Poderia me passar mais detalhes sobre o condomínio e a vaga de garagem?', criado_em: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), mock: true },
    { id: 'mock2', nome: 'Beatriz Fonseca', email: 'bea.fonseca@outlook.com', telefone: '31999887766', mensagem: 'Vi o anúncio e gostei muito. Moro em São Paulo e vou a BH no próximo fim de semana. Posso agendar visita para sábado?', criado_em: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), mock: true },
    { id: 'mock3', nome: 'Rafael Andrade', email: 'r.andrade@empresa.com.br', telefone: '31996543210', mensagem: 'Estou buscando imóvel para investimento. Qual a possibilidade de negociação no preço? Posso pagar à vista.', criado_em: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), mock: true },
  ]

  const ORIGEM_LABELS: Record<string, string> = { detalhe: 'Interesse', agendamento: 'Visita', proposta: 'Proposta', avaliacao: 'Avaliação', vender_completa: 'Vender' }
  const ORIGEM_COLORS: Record<string, [string, string]> = {
    detalhe: ['#EFF6FF', '#1D4ED8'], agendamento: ['#F0FDF4', '#16A34A'], proposta: ['#FAF5FF', '#7C3AED'],
  }
  const realLeads = leads.filter(l => !origemFilter || l.origem === origemFilter)
  const showLeads = leads.length > 0 ? realLeads : MOCK_LEADS
  const origens = Array.from(new Set(leads.map(l => l.origem).filter(Boolean))) as string[]

  if (loading) return <LoadingScreen />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {leads.length === 0 && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '12px 18px', fontSize: 13, color: '#92400E', marginBottom: 4 }}>
          Simulação — veja como seus leads chegam. Quando seu anúncio estiver ativo, leads reais aparecem aqui.
        </div>
      )}
      {leads.length > 0 && origens.length > 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
          {['', ...origens].map(o => (
            <button key={o} onClick={() => setOrigemFilter(o)} style={{ padding: '5px 12px', borderRadius: 99, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', borderColor: origemFilter === o ? 'var(--navy)' : 'var(--border)', background: origemFilter === o ? 'var(--navy)' : '#fff', color: origemFilter === o ? '#fff' : 'var(--navy)' }}>
              {o ? (ORIGEM_LABELS[o] ?? o) : 'Todos'} {o ? `(${leads.filter(l => l.origem === o).length})` : `(${leads.length})`}
            </button>
          ))}
        </div>
      )}
      {showLeads.map((l: any) => {
        const [bg, color] = ORIGEM_COLORS[l.origem ?? ''] ?? ['#F8FAFC', '#64748B']
        return (
          <div key={l.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 22px', boxShadow: 'var(--shadow-soft)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, opacity: l.mock ? 0.85 : 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{l.nome}</span>
                {l.mock && <span style={{ fontSize: 10, fontWeight: 700, background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 99, letterSpacing: '0.08em' }}>DEMO</span>}
                {l.origem && !l.mock && <span style={{ fontSize: 10, fontWeight: 700, background: bg, color, padding: '2px 8px', borderRadius: 99 }}>{ORIGEM_LABELS[l.origem] ?? l.origem}</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{l.email} {l.telefone ? `· ${l.telefone}` : ''}</div>
              {l.mensagem && <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>"{l.mensagem}"</div>}
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>
                {l.imoveis?.titulo ? `Imóvel: ${l.imoveis.titulo} · ` : ''}{new Date(l.criado_em).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
              <a href={`https://wa.me/55${l.telefone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                <Btn variant="accent" size="sm">WhatsApp</Btn>
              </a>
              {!l.mock && l.telefone && (
                <a href={`https://wa.me/55${l.telefone.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá, ${l.nome?.split(' ')[0] ?? ''}! Tudo bem? Gostaria de agendar uma visita ao imóvel${l.imoveis?.titulo ? ` "${l.imoveis.titulo}"` : ''}. Qual dia e horário ficam melhor para você?`)}`}
                  target="_blank" rel="noopener noreferrer">
                  <Btn variant="ghost" size="sm">📅 Agendar visita</Btn>
                </a>
              )}
              <a href={`mailto:${l.email}`}>
                <Btn variant="ghost" size="sm">E-mail</Btn>
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ConfigSection({ profile, onSave, supabase }: { profile: Profile | null; onSave: () => void; supabase: any }) {
  const [nome, setNome] = useState(profile?.nome ?? '')
  const [telefone, setTelefone] = useState(profile?.telefone ?? '')
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState(false)
  const [changingPlano, setChangingPlano] = useState(false)

  const save = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ nome, telefone }).eq('id', profile?.id!)
    setSaving(false); setOk(true); setTimeout(() => setOk(false), 2000)
    onSave()
  }

  const selectPlano = async (plano: string) => {
    setChangingPlano(true)
    await supabase.from('profiles').update({ plano }).eq('id', profile?.id!)
    setChangingPlano(false); onSave()
  }

  const PLANOS_OPCOES = [
    { id: 'direta', nome: 'Venda Direta', preco: 'R$ 297', sub: 'taxa única', desc: 'Você anuncia e vende. Sem comissão sobre a venda.', color: '#6366F1' },
    { id: 'assistida', nome: 'Venda Assistida', preco: '3%', sub: 'só ao vender', desc: 'Curadoria VN Prime + qualificação de compradores.', color: '#D4A857', destaque: true },
    { id: 'completa', nome: 'Venda Completa', preco: '6%', sub: 'sobre a venda', desc: 'Corretor dedicado + toda a estrutura VN Prime.', color: '#2F8674' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
      {/* Plano atual */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: 17, marginBottom: 18 }}>Plano atual</h3>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
          {PLANOS_OPCOES.map(p => {
            const isAtual = profile?.plano === p.id || (!profile?.plano && p.id === 'direta')
            return (
              <div key={p.id} style={{ border: `2px solid ${isAtual ? p.color : 'var(--border)'}`, borderRadius: 12, padding: '16px 14px', background: isAtual ? `${p.color}08` : '#FAFAF8', transition: 'border-color 0.2s' }}>
                {isAtual && <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.color, marginBottom: 8 }}>Plano atual</div>}
                <div style={{ fontSize: 22, fontWeight: 900, color: p.color, lineHeight: 1 }}>{p.preco}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-3)', marginBottom: 8 }}>{p.sub}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{p.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 14, lineHeight: 1.4 }}>{p.desc}</div>
                {!isAtual && (
                  <button onClick={() => selectPlano(p.id)} disabled={changingPlano}
                    style={{ width: '100%', padding: '7px 0', borderRadius: 8, border: `1.5px solid ${p.color}`, background: 'transparent', color: p.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Mudar para este
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dados pessoais */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h3 style={{ fontSize: 17 }}>Meus dados</h3>
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

const SCRIPTS = [
  {
    fase: 'Primeiro contato — WhatsApp',
    cor: '#2F8674',
    texto: `Olá, [NOME]! Obrigado pelo interesse no imóvel [TÍTULO/BAIRRO].

Tenho disponibilidade para tirar suas dúvidas agora ou agendar uma visita conforme sua conveniência.

Você prefere conhecer pessoalmente ou quer que eu te envie mais fotos e informações antes?

Aguardo seu retorno!`,
  },
  {
    fase: 'Confirmação de visita',
    cor: '#D4A857',
    texto: `Olá, [NOME]! Confirmando nossa visita ao imóvel no [DIA] às [HORÁRIO].

O endereço completo é: [ENDEREÇO].

Estacionamento disponível [na rua / no condomínio / portaria autorizada — ajuste conforme o caso].

Qualquer imprevisto, pode me avisar aqui. Até lá!`,
  },
  {
    fase: 'Follow-up pós-visita',
    cor: '#6366F1',
    texto: `Olá, [NOME]! Espero que tenha gostado da visita.

Fiquei à disposição para responder qualquer dúvida que tenha surgido. Casos comuns: financiamento, documentação, histórico do imóvel — posso ajudar com todos.

Se houver interesse em avançar, podemos conversar sobre as condições. O que você achou?`,
  },
  {
    fase: 'Resposta a proposta / Negociação',
    cor: '#0F1824',
    texto: `Olá, [NOME]! Recebi sua proposta de R$ [VALOR] e agradeço a consideração.

Analisando o valor atual de mercado da região e as características do imóvel, consigo trabalhar até R$ [CONTRAPROPOSTA], o que já representa uma condição bastante justa.

Posso também incluir [ITEM: armários / vaga extra / prazo de entrega flexível] para facilitar o fechamento.

Me diz o que pensa!`,
  },
]

function ScriptSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiForm, setAiForm] = useState({ nome: '', imovel: '', contexto: '' })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReady, setAiReady] = useState(false)

  const personalizar = async () => {
    if (!aiForm.nome && !aiForm.imovel) return
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setAiReady(true)
    setAiLoading(false)
  }

  const applyAI = (texto: string): string => {
    if (!aiReady) return texto
    let t = texto
    if (aiForm.nome) t = t.replace(/\[NOME\]/g, aiForm.nome)
    if (aiForm.imovel) {
      t = t.replace(/\[TÍTULO\/BAIRRO\]/g, aiForm.imovel)
      t = t.replace(/\[TÍTULO\]/g, aiForm.imovel)
      t = t.replace(/\[BAIRRO\]/g, aiForm.imovel)
    }
    return t
  }

  const copy = (texto: string, fase: string) => {
    navigator.clipboard.writeText(applyAI(texto))
    setCopied(fase)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 6 }}>Scripts de venda</div>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Mensagens prontas para cada etapa</h3>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14 }}>Copie, adapte com os dados do seu imóvel e use no WhatsApp ou e-mail. Textos testados e aprovados para imóveis premium.</p>
      </div>

      {/* Personalizar com IA */}
      <div style={{ background: aiOpen ? '#FFFBF0' : '#fff', border: `1.5px solid ${aiOpen ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 14, marginBottom: 20, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        <div onClick={() => setAiOpen(o => !o)} style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)' }}>Personalizar com IA</span>
            {aiReady && <span style={{ fontSize: 10, fontWeight: 800, background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 99 }}>ATIVO</span>}
          </div>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>{aiOpen ? '▲' : '▼'}</span>
        </div>
        {aiOpen && (
          <div style={{ padding: '0 20px 20px', borderTop: '1px solid #FEF3C7' }}>
            <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: '14px 0 16px', lineHeight: 1.5 }}>
              Preencha os dados do cliente e do seu imóvel. Os scripts serão adaptados automaticamente com essas informações.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 5 }}>Nome do comprador</label>
                <input value={aiForm.nome} onChange={e => { setAiForm(f => ({ ...f, nome: e.target.value })); setAiReady(false) }}
                  placeholder="Ex.: João Silva"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as any }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 5 }}>Seu imóvel (título/bairro)</label>
                <input value={aiForm.imovel} onChange={e => { setAiForm(f => ({ ...f, imovel: e.target.value })); setAiReady(false) }}
                  placeholder="Ex.: Apto Belvedere 3Q"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as any }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 5 }}>Contexto (opcional)</label>
                <input value={aiForm.contexto} onChange={e => { setAiForm(f => ({ ...f, contexto: e.target.value })); setAiReady(false) }}
                  placeholder="Ex.: urgência de mudança, pagamento à vista"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as any }} />
              </div>
            </div>
            <button onClick={personalizar} disabled={aiLoading || (!aiForm.nome && !aiForm.imovel)}
              style={{ padding: '9px 22px', borderRadius: 9, background: 'var(--gold-deep)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: aiLoading || (!aiForm.nome && !aiForm.imovel) ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              {aiLoading ? 'Personalizando...' : aiReady ? '✓ Scripts personalizados' : 'Personalizar scripts'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SCRIPTS.map(s => {
          const textoFinal = applyAI(s.texto)
          const isPersonalizado = aiReady && textoFinal !== s.texto
          return (
            <div key={s.fase} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAF8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.cor, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{s.fase}</span>
                  {isPersonalizado && <span style={{ fontSize: 10, fontWeight: 700, background: '#FEF3C7', color: '#B45309', padding: '2px 7px', borderRadius: 99 }}>✨ IA</span>}
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
      <p style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'center', marginTop: 20 }}>
        {aiReady ? 'Scripts personalizados com IA. Revise antes de enviar.' : 'Substitua os campos entre colchetes [NOME], [TÍTULO], etc. pelos dados reais antes de enviar.'}
      </p>
    </div>
  )
}

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
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-2)', marginBottom: 12 }}>Boosters — Add-ons opcionais</div>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {[
            { nome: 'Booster Mídia', preco: 'R$ 49', itens: ['+5 fotos extras tratadas', 'Capa otimizada para portais', 'Texto descritivo SEO', 'Entrega junto com o pacote'] },
            { nome: 'Booster Visibilidade', preco: 'R$ 99', itens: ['Destaque pago em 3 portais (15 dias)', 'Pack stories + reels (3 peças)', 'Distribuição por WhatsApp VN Prime', 'Relatório de impressões'] },
          ].map(b => (
            <div key={b.nome} style={{ background: 'var(--cream)', borderRadius: 14, border: '1px dashed var(--gold)', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{b.nome}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold-deep)' }}>{b.preco}</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {b.itens.map(it => (
                  <li key={it} style={{ fontSize: 13, display: 'flex', gap: 8, color: 'var(--fg-1)' }}>
                    <span style={{ color: 'var(--gold-deep)', fontWeight: 700 }}>+</span>{it}
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
            {[['R$ 297','Venda Direta'],['0%','De comissão'],['3%','Plano Assistida'],['90 dias','De vigência']].map(([v,l]) => (
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

function CalculadorasSection({ imoveis, supabase }: { imoveis: any[]; supabase: any }) {
  const [itbiValor, setItbiValor] = useState('')
  const [itbiAliq, setItbiAliq] = useState('2')
  const [mercadoBairro, setMercadoBairro] = useState('')
  const [mercadoArea, setMercadoArea] = useState('')
  const [mercadoMedia, setMercadoMedia] = useState<number | null>(null)
  const [mercadoLoading, setMercadoLoading] = useState(false)
  const [invValor, setInvValor] = useState('')
  const [invAluguel, setInvAluguel] = useState('')
  const [invVacancia, setInvVacancia] = useState('10')
  const [custo, setCusto] = useState('')
  const [custoPlano, setCustoPlano] = useState('assistida')

  const itbiNum = Number(itbiValor.replace(/\D/g, ''))
  const aliqNum = Number(itbiAliq)
  const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

  const calcMercado = async () => {
    if (!mercadoBairro) return
    setMercadoLoading(true)
    const { data } = await supabase.from('imoveis').select('preco, area_m2, area').ilike('bairro', `%${mercadoBairro}%`).eq('status', 'ativo').not('preco', 'is', null)
    const valid = (data ?? []).filter((i: any) => (i.area_m2 || i.area) && i.preco > 0)
    if (valid.length > 0) {
      const mediaPorM2 = valid.reduce((s: number, i: any) => s + i.preco / (i.area_m2 || i.area), 0) / valid.length
      setMercadoMedia(mediaPorM2)
    } else {
      setMercadoMedia(0)
    }
    setMercadoLoading(false)
  }

  const areaNum = Number(mercadoArea.replace(/\D/g, ''))
  const valorEstimado = mercadoMedia && areaNum > 0 ? mercadoMedia * areaNum : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24 }}>
      {/* ITBI */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-deep)', marginBottom: 6 }}>Calculadora</div>
        <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>ITBI</h3>
        <p style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20, lineHeight: 1.5 }}>Imposto de Transmissão de Bens Imóveis. Cobrado pela prefeitura na transferência do imóvel.</p>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Valor do imóvel (R$)</label>
          <input value={itbiValor} onChange={e => setItbiValor(e.target.value)} placeholder="Ex: 500000"
            style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Alíquota (%)</label>
          <select value={itbiAliq} onChange={e => setItbiAliq(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
            <option value="2">2% — padrão BH e região</option>
            <option value="2.5">2,5%</option>
            <option value="3">3%</option>
          </select>
        </div>
        {itbiNum > 0 && (
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: `ITBI (${aliqNum}%)`, value: fmt(itbiNum * aliqNum / 100), gold: true },
                { label: 'Escritura estimada (1%)', value: fmt(itbiNum * 0.01) },
                { label: 'Registro estimado (0.4%)', value: fmt(itbiNum * 0.004) },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{r.label}</span>
                  <span style={{ fontSize: r.gold ? 18 : 14, fontWeight: r.gold ? 800 : 600, color: r.gold ? 'var(--gold)' : 'var(--navy)' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>Total estimado</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)' }}>{fmt(itbiNum * (aliqNum / 100 + 0.014))}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculadora de mercado */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-deep)', marginBottom: 6 }}>Calculadora</div>
        <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>Valor de mercado</h3>
        <p style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20, lineHeight: 1.5 }}>Compare com o preço médio do m² no bairro, baseado nos imóveis ativos na plataforma.</p>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Bairro</label>
          <input value={mercadoBairro} onChange={e => setMercadoBairro(e.target.value)} placeholder="Ex: Savassi"
            style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Área do imóvel (m²)</label>
          <input value={mercadoArea} onChange={e => setMercadoArea(e.target.value)} placeholder="Ex: 80"
            style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={calcMercado} disabled={!mercadoBairro || mercadoLoading}
          style={{ width: '100%', padding: '11px 0', borderRadius: 9, background: 'var(--navy)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: !mercadoBairro || mercadoLoading ? 0.6 : 1, marginBottom: 16 }}>
          {mercadoLoading ? 'Consultando...' : 'Consultar mercado'}
        </button>
        {mercadoMedia !== null && (
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 18px' }}>
            {mercadoMedia === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--fg-3)', textAlign: 'center' }}>Sem imóveis ativos neste bairro ainda. A base cresce com o tempo.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Preço médio do m² em {mercadoBairro}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)' }}>{fmt(mercadoMedia)}/m²</span>
                </div>
                {valorEstimado && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>Estimativa para {mercadoArea} m²</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>{fmt(valorEstimado)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Retorno do Investidor */}
      {(() => {
        const vNum = Number(invValor.replace(/\D/g, ''))
        const aNum = Number(invAluguel.replace(/\D/g, ''))
        const vacNum = Number(invVacancia) / 100
        const alugLiq = aNum * (1 - vacNum)
        const yield12 = vNum > 0 && alugLiq > 0 ? (alugLiq * 12 / vNum) * 100 : null
        const payback = vNum > 0 && alugLiq > 0 ? vNum / (alugLiq * 12) : null
        const IS2: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fff' }
        return (
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-deep)', marginBottom: 6 }}>Calculadora</div>
            <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>Retorno do Investidor</h3>
            <p style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20, lineHeight: 1.5 }}>Calcule o cap rate e payback de um imóvel para locação ou revenda.</p>
            {[
              { label: 'Valor de compra (R$)', val: invValor, set: setInvValor, ph: 'Ex: 600000' },
              { label: 'Aluguel mensal esperado (R$)', val: invAluguel, set: setInvAluguel, ph: 'Ex: 3500' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={IS2} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Vacância / custos (%)</label>
              <select value={invVacancia} onChange={e => setInvVacancia(e.target.value)} style={IS2}>
                {['0','5','10','15','20'].map(v => <option key={v} value={v}>{v}% — {v === '0' ? 'sem vacância' : v === '10' ? 'estimado BH' : v === '20' ? 'conservador' : ''}</option>)}
              </select>
            </div>
            {yield12 !== null && payback !== null && (
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Cap rate (yield anual)</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: yield12 >= 6 ? '#059669' : yield12 >= 4 ? 'var(--gold)' : '#DC2626' }}>{yield12.toFixed(2)}% a.a.</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Payback do investimento</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{payback.toFixed(1)} anos</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Aluguel líquido/mês</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{fmt(alugLiq)}</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Comparativo</div>
                    {[
                      { label: 'Poupança', pct: 6.17 },
                      { label: 'CDI (ref. 2025)', pct: 11.65 },
                      { label: 'FII médio BH', pct: 8.5 },
                    ].map(c => (
                      <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>{c.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: yield12 >= c.pct ? '#059669' : '#DC2626' }}>
                          {c.pct}% — você {yield12 >= c.pct ? '↑ supera' : '↓ fica abaixo'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* Custo de venda */}
      {(() => {
        const IS3: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fff' }
        const vNum = Number(custo.replace(/\D/g, ''))
        const plano = custoPlano
        const comissaoPct = plano === 'direta' ? 0 : plano === 'assistida' ? 0.03 : 0.06
        const comissao = vNum * comissaoPct
        const direta = plano === 'direta' ? 297 : 0
        const itbiComprador = vNum * 0.02
        const escritura = vNum * 0.01
        const corretagem = vNum * 0.05
        const liquido = vNum - comissao - direta - corretagem * (plano === 'completa' ? 0 : 0)
        const custoTotal = comissao + direta + corretagem * 0
        return (
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-deep)', marginBottom: 6 }}>Calculadora</div>
            <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>Custo de venda</h3>
            <p style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20, lineHeight: 1.5 }}>Simule quanto você paga para vender e quanto fica no seu bolso ao final.</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Valor de venda esperado (R$)</label>
              <input value={custo} onChange={e => setCusto(e.target.value)} placeholder="Ex: 1000000" style={IS3} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Seu plano VN Prime</label>
              <select value={custoPlano} onChange={e => setCustoPlano(e.target.value)} style={IS3}>
                <option value="direta">Venda Direta — R$ 297 fixo</option>
                <option value="assistida">Venda Assistida — 3% do valor</option>
                <option value="completa">Venda Completa — 6% do valor</option>
              </select>
            </div>
            {vNum > 0 && (
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Valor de venda</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{fmt(vNum)}</span>
                  </div>
                  {plano === 'direta' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Taxa VN Prime (fixa)</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>- {fmt(297)}</span>
                    </div>
                  )}
                  {comissaoPct > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Comissão VN Prime ({(comissaoPct * 100).toFixed(0)}%)</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>- {fmt(comissao)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>ITBI (estimado — pago pelo comprador)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-3)' }}>{fmt(itbiComprador)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Escritura estimada (1%)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-3)' }}>{fmt(escritura)}</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>Você recebe líquido</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>{fmt(vNum - comissao - (plano === 'direta' ? 297 : 0))}</span>
                  </div>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                  ITBI e escritura são encargos do comprador. Valores estimados — consulte o cartório da sua comarca.
                </div>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div className="animate-spin" style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
    </div>
  )
}
