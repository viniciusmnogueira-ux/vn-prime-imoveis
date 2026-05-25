'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'

type Step = 'voce' | 'imovel' | 'fotos' | 'plano' | 'publicar'
const STEPS: Step[] = ['voce', 'imovel', 'fotos', 'plano', 'publicar']
const STEP_LABELS = ['Você', 'Imóvel', 'Fotos', 'Plano', 'Publicar']

const PLANOS = [
  {
    id: 'direta', nome: 'Venda Direta', preco: 'R$ 297', sub: 'taxa única',
    desc: 'Você anuncia, você vende. Sem comissão sobre a venda.',
    bullets: ['Anúncio por 90 dias', 'Sem comissão', 'Suporte por chat'],
    accent: '#6366F1',
  },
  {
    id: 'assistida', nome: 'Venda Assistida', preco: '3%', sub: 'somente ao vender',
    desc: 'Curadoria VN Prime + IA para fechar mais rápido.',
    bullets: ['Pitch IA automático', 'Curador dedicado', 'Qualificação de leads'],
    badge: 'Mais escolhido', accent: '#D4A857',
  },
  {
    id: 'completa', nome: 'Venda Completa', preco: '6%', sub: 'sobre a venda',
    desc: 'Corretor dedicado + toda a estrutura VN Prime.',
    bullets: ['Corretor exclusivo', 'Fotografia profissional', 'Acompanhamento jurídico'],
    accent: '#2F8674',
  },
]

export default function AnunciarPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('voce')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [form, setForm] = useState({
    nome: '', email: '', telefone: '',
    titulo: '', descricao: '',
    tipo: 'apartamento', operacao: 'venda',
    preco: '', area_m2: '', quartos: '2', suites: '0', banheiros: '1', vagas: '1',
    condominio: '', iptu: '',
    endereco: '', bairro: '', cidade: 'Belo Horizonte', estado: 'MG', cep: '',
    plano: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const stepIndex = STEPS.indexOf(step)
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  const handlePhotos = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files).slice(0, 10)
    setPhotos(arr)
    setPreviews(arr.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()

      let ownerId = user?.id
      if (!user) {
        // Cadastro rápido com magic link
        const { data, error: authErr } = await supabase.auth.signInWithOtp({
          email: form.email,
          options: { data: { nome: form.nome, tipo: 'proprietario' } },
        })
        if (authErr) throw authErr
        // Para magic link, guardamos lead e avisamos
        setError('Verifique seu e-mail para ativar a conta e publicar o anúncio.')
        setLoading(false)
        return
      }

      // Upsert profile
      await supabase.from('profiles').upsert({
        id: user.id, email: user.email!, nome: form.nome || user.user_metadata?.nome,
        telefone: form.telefone, tipo: 'proprietario', plano: form.plano as any, plano_ativo: true,
      })

      // Upload fotos
      const fotoUrls: string[] = []
      for (const file of photos) {
        const ext = file.name.split('.').pop()
        const path = `imoveis/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('imoveis').upload(path, file)
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('imoveis').getPublicUrl(path)
          fotoUrls.push(publicUrl)
        }
      }

      // Insert imóvel
      const { data: imovel, error: insertErr } = await supabase.from('imoveis').insert({
        proprietario_id: user.id,
        titulo: form.titulo,
        descricao: form.descricao,
        tipo: form.tipo as any,
        operacao: form.operacao as any,
        preco: parseFloat(form.preco.replace(/\D/g, '')),
        area_m2: form.area_m2 ? parseFloat(form.area_m2) : null,
        quartos: parseInt(form.quartos) || null,
        suites: parseInt(form.suites) || null,
        banheiros: parseInt(form.banheiros) || null,
        vagas: parseInt(form.vagas) || null,
        condominio: form.condominio ? parseFloat(form.condominio.replace(/\D/g, '')) : null,
        iptu: form.iptu ? parseFloat(form.iptu.replace(/\D/g, '')) : null,
        endereco: form.endereco, bairro: form.bairro,
        cidade: form.cidade, estado: form.estado, cep: form.cep,
        fotos: fotoUrls, caracteristicas: [],
        status: 'pendente',
        plano_label: form.plano,
        destaque: false,
      }).select().single()

      if (insertErr) throw insertErr

      router.push(`/proprietario?novo=${imovel.id}`)
    } catch (e: any) {
      setError(e.message || 'Erro ao publicar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Progress header */}
      <div style={{ background: 'var(--navy-deep)', padding: '24px 0 0' }}>
        <div style={{ width: 'min(700px,92vw)', margin: '0 auto' }}>
          <Eyebrow color="var(--gold)">Anunciar imóvel</Eyebrow>
          <div style={{ display: 'flex', gap: 0, marginTop: 20 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: i < stepIndex ? 'pointer' : 'default' }}
                onClick={() => i < stepIndex && setStep(s)}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i < stepIndex ? 'var(--gold)' : i === stepIndex ? '#fff' : 'rgba(255,255,255,0.15)',
                  color: i < stepIndex ? 'var(--navy-deep)' : i === stepIndex ? 'var(--navy)' : 'rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, border: i === stepIndex ? '2px solid var(--gold)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: i === stepIndex ? '#fff' : 'rgba(255,255,255,0.4)', paddingBottom: 14 }}>
                  {STEP_LABELS[i]}
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gold)', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ width: 'min(700px,92vw)', margin: '0 auto', paddingTop: 40 }}>
        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 24, fontSize: 13,
            background: error.includes('e-mail') ? '#D1FAE5' : '#FEE2E2',
            color: error.includes('e-mail') ? '#065F46' : '#991B1B', border: `1px solid ${error.includes('e-mail') ? '#6EE7B7' : '#FECACA'}` }}>
            {error}
          </div>
        )}

        {step === 'voce' && (
          <Card title="Seus dados" desc="Para entrar em contato com você sobre o anúncio.">
            <Field label="Nome completo" required>
              <input style={iStyle} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome" />
            </Field>
            <Field label="E-mail" required>
              <input style={iStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />
            </Field>
            <Field label="WhatsApp">
              <input style={iStyle} value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(31) 9 0000-0000" />
            </Field>
            <NavBtns onNext={() => setStep('imovel')} canNext={!!form.email} />
          </Card>
        )}

        {step === 'imovel' && (
          <Card title="Sobre o imóvel" desc="Informações básicas do imóvel que você quer anunciar.">
            <Field label="Título do anúncio" required>
              <input style={iStyle} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex.: Apartamento 3 quartos · Savassi" />
            </Field>
            <Field label="Descrição">
              <textarea style={{ ...iStyle, height: 100, resize: 'vertical' }} value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descreva o imóvel..." />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Tipo">
                <select style={iStyle} value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                  {['apartamento','casa','cobertura','terreno','comercial','loja'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Operação">
                <select style={iStyle} value={form.operacao} onChange={e => set('operacao', e.target.value)}>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </Field>
            </div>
            <Field label="Preço (R$)" required>
              <input style={iStyle} value={form.preco} onChange={e => set('preco', e.target.value)} placeholder="Ex.: 850000" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <Field label="Área m²"><input style={iStyle} type="number" value={form.area_m2} onChange={e => set('area_m2', e.target.value)} /></Field>
              <Field label="Quartos"><input style={iStyle} type="number" min="0" max="10" value={form.quartos} onChange={e => set('quartos', e.target.value)} /></Field>
              <Field label="Vagas"><input style={iStyle} type="number" min="0" max="10" value={form.vagas} onChange={e => set('vagas', e.target.value)} /></Field>
            </div>
            <Field label="Endereço">
              <input style={iStyle} value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Rua, número" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Bairro" required><input style={iStyle} value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Savassi" /></Field>
              <Field label="Cidade"><input style={iStyle} value={form.cidade} onChange={e => set('cidade', e.target.value)} /></Field>
            </div>
            <NavBtns onBack={() => setStep('voce')} onNext={() => setStep('fotos')} canNext={!!form.titulo && !!form.preco && !!form.bairro} />
          </Card>
        )}

        {step === 'fotos' && (
          <Card title="Fotos do imóvel" desc="Até 10 fotos. Imóveis com fotos recebem 5x mais contatos.">
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: '2px dashed var(--border)', borderRadius: 14, padding: '48px 32px', textAlign: 'center', cursor: 'pointer', background: '#fff', transition: 'border-color 0.15s' }}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--gold)' }}
              onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
              onDrop={e => { e.preventDefault(); handlePhotos(e.dataTransfer.files) }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
              <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>Arraste fotos ou clique para selecionar</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>JPG, PNG · Máximo 10 fotos · 10MB cada</div>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handlePhotos(e.target.files)} />
            </div>
            {previews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: 10, marginTop: 16 }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => { setPhotos(p => p.filter((_,j) => j !== i)); setPreviews(p => p.filter((_,j) => j !== i)) }}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <NavBtns onBack={() => setStep('imovel')} onNext={() => setStep('plano')} canNext={true} nextLabel="Continuar" />
          </Card>
        )}

        {step === 'plano' && (
          <Card title="Escolha seu plano" desc="Como você quer vender? Você pode trocar de plano a qualquer momento.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PLANOS.map(p => (
                <div key={p.id} onClick={() => set('plano', p.id)}
                  style={{ border: `2px solid ${form.plano === p.id ? p.accent : 'var(--border)'}`, borderRadius: 14, padding: '20px 24px', cursor: 'pointer', background: form.plano === p.id ? '#fff' : '#fafafa', transition: 'all 0.15s', position: 'relative' }}>
                  {p.badge && <span style={{ position: 'absolute', top: -1, right: 20, background: p.accent, color: '#0F1824', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 12px', borderRadius: '0 0 8px 8px' }}>{p.badge}</span>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--navy)' }}>{p.nome}</div>
                      <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>{p.desc}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: p.accent }}>{p.preco}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{p.sub}</div>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                    {p.bullets.map(b => (
                      <li key={b} style={{ fontSize: 12.5, color: 'var(--fg-2)', display: 'flex', gap: 6 }}>
                        <span style={{ color: p.accent, fontWeight: 700 }}>✓</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <NavBtns onBack={() => setStep('fotos')} onNext={() => setStep('publicar')} canNext={!!form.plano} />
          </Card>
        )}

        {step === 'publicar' && (
          <Card title="Revisar e publicar" desc="Confira tudo antes de publicar.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Título', form.titulo],
                ['Tipo / Operação', `${form.tipo} · ${form.operacao}`],
                ['Preço', `R$ ${Number(form.preco.replace(/\D/g,'')).toLocaleString('pt-BR')}`],
                ['Localização', `${form.bairro}, ${form.cidade}`],
                ['Fotos', `${photos.length} foto(s) selecionada(s)`],
                ['Plano', PLANOS.find(p => p.id === form.plano)?.nome ?? ''],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 600 }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
              <Btn variant="ghost" onClick={() => setStep('plano')}>← Voltar</Btn>
              <Btn variant="accent" size="lg" onClick={handleSubmit} loading={loading} style={{ flex: 1 }}>
                Publicar anúncio
              </Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(24px,4vw,40px)', boxShadow: 'var(--shadow-card)' }}>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>{title}</h2>
      <p style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 28 }}>{desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-2)', display: 'block', marginBottom: 7 }}>
        {label}{required && <span style={{ color: 'var(--gold)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function NavBtns({ onBack, onNext, canNext = true, nextLabel = 'Continuar →' }: { onBack?: () => void; onNext?: () => void; canNext?: boolean; nextLabel?: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingTop: 8, marginTop: 8 }}>
      {onBack && <Btn variant="ghost" onClick={onBack}>← Voltar</Btn>}
      {onNext && <Btn variant="primary" onClick={onNext} disabled={!canNext} style={{ marginLeft: 'auto' }}>{nextLabel}</Btn>}
    </div>
  )
}

const iStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 9,
  border: '1.5px solid var(--border)', fontSize: 14,
  outline: 'none', background: '#fff',
}
