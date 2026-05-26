'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import Link from 'next/link'
import { fmtBRL } from '@/lib/utils'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'

type Profile = any

export default function CorretorPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [corretor, setCorretor] = useState<any>(null)
  const [leads, setLeads] = useState<any[]>([])
  const [imoveis, setImoveis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sec, setSec] = useState<'dashboard' | 'cadastro' | 'imoveis' | 'leads' | 'fotografo'>('dashboard')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?redirect=/corretor'); return }

    const [{ data: prof }, { data: cor }, { data: imvs }, { data: lds }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('corretores').select('*').eq('profile_id', user.id).single(),
      supabase.from('imoveis').select('*').eq('corretor_id', user.id).order('criado_em', { ascending: false }).limit(20),
      supabase.from('leads').select('*, imoveis(titulo, preco)').eq('corretor_id', user.id).order('criado_em', { ascending: false }).limit(20),
    ])
    setProfile(prof)
    setCorretor(cor)
    setImoveis(imvs ?? [])
    setLeads(lds ?? [])
    setLoading(false)

    if (!cor) setSec('cadastro')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)' }} />
    </div>
  )

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--navy-deep)', padding: 'clamp(28px,4vw,48px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Eyebrow color="#2F8674">Portal do Corretor</Eyebrow>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem,3vw,2rem)', marginTop: 8 }}>
              {profile?.nome?.split(' ')[0] ?? 'Corretor'}
              {corretor?.creci && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginLeft: 12, fontFamily: 'DM Sans' }}>CRECI {corretor.creci}</span>}
            </h1>
          </div>
          {corretor && (
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="ghost-light" size="sm" onClick={() => setSec('leads')}>Leads ({leads.length})</Btn>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', paddingTop: 32 }}>
        {/* Tabs */}
        {(() => {
          const tabs: [string, string][] = corretor
            ? [['dashboard','Dashboard'],['imoveis','Imóveis'],['leads','Leads'],['fotografo','📸 Fotógrafo'],['cadastro','Meus dados']]
            : [['cadastro','Completar cadastro']]
          return (
            <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border)', marginBottom: 32 }}>
              {tabs.map(([id, lbl]) => (
                <button key={id} onClick={() => setSec(id as any)} style={{
                  padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13.5, fontWeight: 700,
                  color: sec === id ? 'var(--navy)' : 'var(--fg-3)',
                  borderBottom: `3px solid ${sec === id ? '#2F8674' : 'transparent'}`,
                  marginBottom: -2, transition: 'all 0.15s',
                }}>{lbl}</button>
              ))}
            </div>
          )
        })()}

        {sec === 'dashboard' && corretor && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Imóveis em carteira', value: imoveis.length },
                { label: 'Imóveis ativos', value: imoveis.filter(i => i.status === 'ativo').length },
                { label: 'Leads recebidos', value: leads.length },
                { label: 'Leads esta semana', value: leads.filter(l => { const d = new Date(l.criado_em); return Date.now() - d.getTime() < 7*24*60*60*1000 }).length },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>{s.value}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-3)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {leads.slice(0, 5).length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-soft)' }}>
                <h3 style={{ fontSize: 16, marginBottom: 16 }}>Últimos leads</h3>
                {leads.slice(0, 5).map((l: any) => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{l.nome}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>{l.email} · {l.imoveis?.titulo ?? '—'}</div>
                    </div>
                    <a href={`https://wa.me/55${l.telefone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                      <Btn variant="accent" size="sm">WhatsApp</Btn>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {sec === 'imoveis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {imoveis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg-2)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
                <p>Nenhum imóvel em carteira ainda.</p>
              </div>
            ) : imoveis.map(im => (
              <div key={im.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 22px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {im.fotos?.[0] && <img src={im.fotos[0]} alt="" style={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{im.titulo}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{im.bairro}, {im.cidade}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)', marginTop: 4 }}>{fmtBRL(im.preco)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sec === 'leads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg-2)' }}>Nenhum lead ainda.</div>
            ) : leads.map((l: any) => (
              <div key={l.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 22px', boxShadow: 'var(--shadow-soft)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{l.nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{l.email} {l.telefone ? `· ${l.telefone}` : ''}</div>
                  {l.mensagem && <div style={{ fontSize: 13, color: 'var(--fg-2)', fontStyle: 'italic', marginTop: 4 }}>"{l.mensagem}"</div>}
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                    {l.imoveis?.titulo ?? '—'} · {new Date(l.criado_em).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                {l.telefone && (
                  <a href={`https://wa.me/55${l.telefone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                    <Btn variant="accent" size="sm">WhatsApp</Btn>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {sec === 'fotografo' && <FotografoSection />}

        {sec === 'cadastro' && (
          <CadastroCorretor
            profile={profile}
            corretor={corretor}
            onSaved={() => { loadData(); setSec('dashboard') }}
          />
        )}
      </div>
    </div>
  )
}

function CadastroCorretor({ profile, corretor, onSaved }: { profile: Profile | null; corretor: any; onSaved: () => void }) {
  const supabase = createClient()
  const [form, setForm] = useState({
    nome: profile?.nome ?? '',
    telefone: profile?.telefone ?? '',
    creci: corretor?.creci ?? '',
    bio: corretor?.bio ?? '',
    especialidades: (corretor?.especialidades ?? []).join(', '),
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.creci) { setError('CRECI é obrigatório.'); return }
    setSaving(true); setError('')
    try {
      await supabase.from('profiles').upsert({ id: profile!.id, email: profile!.email, nome: form.nome, telefone: form.telefone, tipo: 'corretor', plano_ativo: true })
      await supabase.from('corretores').upsert({
        profile_id: profile!.id,
        creci: form.creci,
        bio: form.bio,
        especialidades: form.especialidades.split(',').map((s: string) => s.trim()).filter(Boolean),
        ativo: true,
      })
      onSaved()
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(24px,4vw,40px)', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>{corretor ? 'Meus dados' : 'Complete seu cadastro'}</h2>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 28 }}>
          {corretor ? 'Atualize suas informações.' : 'Para acessar o Portal do Corretor, preencha seus dados profissionais.'}
        </p>
        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { label: 'Nome completo', key: 'nome', placeholder: 'Seu nome' },
            { label: 'WhatsApp', key: 'telefone', placeholder: '(31) 9 0000-0000' },
            { label: 'CRECI *', key: 'creci', placeholder: 'Ex.: 45678-F/MG' },
            { label: 'Especialidades (separadas por vírgula)', key: 'especialidades', placeholder: 'Alto padrão, Nova Lima, Investimento' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>{label}</label>
              <input value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>Bio (opcional)</label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Sobre você e sua experiência..."
              style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', resize: 'vertical' }} />
          </div>
          <Btn variant="primary" size="lg" onClick={save} loading={saving}>
            {corretor ? 'Salvar alterações' : 'Ativar Portal do Corretor'}
          </Btn>
        </div>
      </div>
    </div>
  )
}

const FOTO_PACOTES_C = [
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
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2F8674', marginBottom: 6 }}>Canal do Fotógrafo</div>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Contrate fotografia profissional para seus clientes</h3>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14 }}>Fotografia, tour virtual 360°, drone e vídeo cinematográfico. Imóveis com fotos profissionais vendem até 3× mais rápido. Atendemos toda a Grande BH. Entrega em até 48h.</p>
      </div>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginBottom: 20 }}>
        {FOTO_PACOTES_C.map(p => (
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
        Incluso nos planos Venda Assistida e Venda Completa · <Link href="/vender" style={{ color: 'var(--gold-deep)', fontWeight: 600 }}>Ver planos</Link>
      </p>
    </div>
  )
}
