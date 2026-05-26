'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Btn from '@/components/ui/Btn'

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/'
  const error = params.get('error')
  const tabParam = params.get('tab')
  const tipoParam = params.get('tipo') as 'proprietario' | 'corretor' | null

  const [tab, setTab] = useState<'entrar' | 'cadastrar'>(tabParam === 'cadastrar' ? 'cadastrar' : 'entrar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'proprietario' | 'corretor'>(tipoParam ?? 'proprietario')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(redirect)
    })
  }, [])

  const signInGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) { setMsg(error.message); setLoading(false) }
  }

  const signInEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMsg('E-mail ou senha incorretos.'); setLoading(false) }
    else router.replace(redirect)
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nome, tipo } },
    })
    if (error) { setMsg(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, email, nome, tipo,
        plano_ativo: false,
      })
    }
    setMsg('Confirme seu e-mail para ativar a conta.')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy-deep)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#fff', borderRadius: 20,
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: 'var(--navy-deep)', padding: '32px 36px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff' }}>VN Prime</div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 2 }}>Imóveis</div>
        </div>

        <div style={{ padding: '28px 36px 36px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--cream)', borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(['entrar', 'cadastrar'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setMsg('') }} style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? 'var(--navy)' : 'var(--fg-3)',
                fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
                boxShadow: tab === t ? 'var(--shadow-soft)' : 'none',
                transition: 'all 0.15s',
              }}>
                {t === 'entrar' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {/* Google */}
          <Btn variant="ghost" fullWidth size="lg" onClick={signInGoogle} loading={loading}
            style={{ border: '1.5px solid var(--border)', marginBottom: 20 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar com Google
          </Btn>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Error/success message */}
          {(error || msg) && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13,
              background: msg.includes('Confirme') ? '#D1FAE5' : '#FEE2E2',
              color: msg.includes('Confirme') ? '#065F46' : '#991B1B',
            }}>
              {error === 'auth_callback' ? 'Erro na autenticação. Tente novamente.' : msg}
            </div>
          )}

          {tab === 'entrar' ? (
            <form onSubmit={signInEmail} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required
                style={inputStyle} />
              <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required
                style={inputStyle} />
              <Btn type="submit" variant="primary" size="lg" fullWidth loading={loading}>Entrar</Btn>
            </form>
          ) : (
            <form onSubmit={signUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="text" placeholder="Seu nome completo" value={nome} onChange={e => setNome(e.target.value)} required
                style={inputStyle} />
              <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required
                style={inputStyle} />
              <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                style={inputStyle} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-2)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sou um</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {([['proprietario','Proprietário'],['corretor','Corretor']] as const).map(([v,l]) => (
                    <button key={v} type="button" onClick={() => setTipo(v)} style={{
                      flex: 1, padding: '10px 0', borderRadius: 9, border: `2px solid ${tipo === v ? 'var(--navy)' : 'var(--border)'}`,
                      background: tipo === v ? 'var(--navy)' : '#fff',
                      color: tipo === v ? '#fff' : 'var(--fg-2)',
                      fontWeight: 700, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.15s',
                    }}>{l}</button>
                  ))}
                </div>
              </div>
              <Btn type="submit" variant="primary" size="lg" fullWidth loading={loading}>Criar conta</Btn>
              <p style={{ fontSize: 11.5, color: 'var(--fg-3)', textAlign: 'center', lineHeight: 1.6 }}>
                Ao criar conta você concorda com os Termos de Uso e Política de Privacidade da VN Prime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '11px 14px', borderRadius: 9,
  border: '1.5px solid var(--border)',
  fontSize: 14, outline: 'none', background: '#fff',
  width: '100%',
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
