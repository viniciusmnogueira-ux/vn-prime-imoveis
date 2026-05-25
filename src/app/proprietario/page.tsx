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
  const [sec, setSec] = useState<'imoveis' | 'leads' | 'config'>('imoveis')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?redirect=/proprietario'); return }

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
          {([['imoveis','Meus imóveis'],['leads','Leads recebidos'],['config','Configurações']] as const).map(([id, lbl]) => (
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

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div className="animate-spin" style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
    </div>
  )
}
