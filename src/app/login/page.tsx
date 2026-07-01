'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/'
  const tabParam = params.get('tab')
  const tipoParam = params.get('tipo') as 'proprietario' | 'corretor' | null

  const [tab, setTab] = useState<'entrar' | 'cadastrar'>(tabParam === 'cadastrar' ? 'cadastrar' : 'entrar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'proprietario' | 'corretor'>(tipoParam ?? 'proprietario')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(redirect)
    })
  }, [])

  const signInEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMsg('E-mail ou senha incorretos.'); setMsgOk(false); setLoading(false) }
    else router.replace(redirect)
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nome, tipo } },
    })
    if (error) { setMsg(error.message); setMsgOk(false); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, email, nome, tipo, plano_ativo: false, plano: 'direta',
      })
    }
    if (data.session) {
      router.replace(redirect)
    } else {
      setMsg('Conta criada! Verifique seu e-mail para ativar.'); setMsgOk(true); setLoading(false)
    }
  }

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/login`,
    })
    setLoading(false)
    if (error) { setMsg(error.message); setMsgOk(false) }
    else { setResetSent(true); setMsgOk(true) }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>

      {/* Left panel */}
      <div style={{
        flex: '0 0 52%', position: 'relative',
        background: `linear-gradient(160deg,rgba(15,24,36,0.55) 0%,rgba(15,24,36,0.82) 100%),
                     url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 'clamp(32px,4vw,52px)',
      }} className="login-panel-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="30" height="34" viewBox="0 0 44 50" fill="none">
            <defs>
              <linearGradient id="gs" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F2DDA9"/>
                <stop offset="45%" stopColor="#D4A857"/>
                <stop offset="100%" stopColor="#D4A857"/>
              </linearGradient>
            </defs>
            <path d="M22 1 L42 6 V24 C42 36 33 45 22 49 C11 45 2 36 2 24 V6 Z"
              stroke="url(#gs)" strokeWidth="2.2" fill="rgba(212,168,87,0.07)"/>
            <text x="22" y="32" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="18"
              fontWeight="700" fill="url(#gs)" letterSpacing="0.03em">VN</text>
          </svg>
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.16em', color: '#fff' }}>VN PRIME</div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.4em', background: 'linear-gradient(90deg,#B8862E,#D4A857)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 2 }}>IMÓVEIS</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4A857', marginBottom: 14 }}>Alto padrão · Belo Horizonte</div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', lineHeight: 1.1, margin: '0 0 16px', fontFamily: 'Cormorant Garamond,serif' }}>
            Imóveis que cabem<br/>no seu estilo de vida.
          </h2>
          <p style={{ color: 'rgba(245,248,250,0.7)', fontSize: 15, lineHeight: 1.65, maxWidth: 380 }}>
            Acesse seu portal e gerencie seus imóveis, leads e negócios em um só lugar.
          </p>
          <div style={{ marginTop: 32, padding: '18px 22px', background: 'rgba(255,255,255,0.07)', borderRadius: 12, backdropFilter: 'blur(8px)', borderLeft: '3px solid #D4A857' }}>
            <p style={{ color: 'rgba(245,248,250,0.88)', fontSize: 13.5, fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 10px' }}>
              "Vendi meu apartamento em 18 dias pelo preço que queria. Sem corretor no meio."
            </p>
            <div style={{ fontSize: 12, color: '#D4A857', fontWeight: 700 }}>Ricardo M. · Proprietário Direto</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 'clamp(32px,5vw,64px) clamp(24px,4vw,56px)', background: '#fff', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="login-mobile-logo" style={{ display: 'none', marginBottom: 32 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Cinzel,serif', fontSize: 15, fontWeight: 700, color: '#1B2733', letterSpacing: '0.12em' }}>VN PRIME</span>
            </Link>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, color: '#1B2733', margin: '0 0 6px' }}>
            {resetMode ? 'Redefinir senha' : tab === 'entrar' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>
            {resetMode ? 'Enviaremos um link para redefinir sua senha.' : tab === 'entrar' ? 'Entre com seu e-mail e senha.' : 'Sem cartão de crédito.'}
          </p>

          {/* Tabs */}
          {!resetMode && (
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 4, marginBottom: 24 }}>
              {(['entrar', 'cadastrar'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setMsg('') }} style={{
                  flex: 1, padding: '9px 0', borderRadius: 7, border: 'none',
                  background: tab === t ? '#fff' : 'transparent',
                  color: tab === t ? '#1B2733' : '#9CA3AF',
                  fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                  {t === 'entrar' ? 'Entrar' : 'Criar conta'}
                </button>
              ))}
            </div>
          )}

          {/* Feedback */}
          {msg && (
            <div style={{
              padding: '11px 14px', borderRadius: 9, marginBottom: 16, fontSize: 13,
              background: msgOk ? '#D1FAE5' : '#FEE2E2',
              color: msgOk ? '#065F46' : '#991B1B', fontWeight: 500,
            }}>
              {msg}
            </div>
          )}

          {/* Reset enviado */}
          {resetSent ? (
            <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✉️</div>
              <div style={{ fontWeight: 700, color: '#065F46', marginBottom: 6 }}>Link enviado!</div>
              <div style={{ fontSize: 13, color: '#047857', lineHeight: 1.55 }}>
                Verifique sua caixa de entrada em <strong>{email}</strong>. O link expira em 1 hora.
              </div>
              <button onClick={() => { setResetMode(false); setResetSent(false); setMsg('') }}
                style={{ marginTop: 16, fontSize: 13, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                Voltar ao login
              </button>
            </div>

          ) : resetMode ? (
            <form onSubmit={sendReset} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={inp} autoFocus />
              <button type="submit" disabled={loading || !email} style={btnPrimary}>
                {loading ? 'Enviando…' : 'Enviar link de redefinição'}
              </button>
              <button type="button" onClick={() => { setResetMode(false); setMsg('') }}
                style={{ fontSize: 13, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', textDecoration: 'underline', fontFamily: 'inherit' }}>
                Cancelar
              </button>
            </form>

          ) : tab === 'entrar' ? (
            <form onSubmit={signInEmail} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required style={inp} autoFocus />
              <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required style={inp} />
              <button type="submit" disabled={loading} style={btnPrimary}>
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
              <div style={{ textAlign: 'right', marginTop: -4 }}>
                <button type="button" onClick={() => { setResetMode(true); setMsg('') }}
                  style={{ fontSize: 13, color: '#D4A857', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                  Esqueci minha senha
                </button>
              </div>
            </form>

          ) : (
            <form onSubmit={signUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" placeholder="Seu nome completo" value={nome} onChange={e => setNome(e.target.value)} required style={inp} autoFocus />
              <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required style={inp} />
              <input type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={inp} />
              <div style={{ display: 'flex', gap: 8 }}>
                {(['proprietario', 'corretor'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setTipo(t)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                      border: `2px solid ${tipo === t ? '#1B2733' : '#E5E7EB'}`,
                      background: tipo === t ? '#1B2733' : '#fff',
                      color: tipo === t ? '#fff' : '#6B7280',
                      fontSize: 13, fontWeight: tipo === t ? 700 : 500, transition: 'all 0.15s',
                    }}>
                    {t === 'proprietario' ? 'Proprietário' : 'Corretor'}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={loading} style={btnPrimary}>
                {loading ? 'Criando conta…' : 'Criar conta'}
              </button>
              <p style={{ fontSize: 11.5, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
                Ao criar conta você concorda com os{' '}
                <Link href="/termos" style={{ color: '#D4A857' }}>Termos de Uso</Link>
                {' '}e{' '}
                <Link href="/politica" style={{ color: '#D4A857' }}>Política de Privacidade</Link>.
              </p>
            </form>
          )}

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>← Voltar ao site</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-panel-left { display: none !important; }
          .login-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

const inp: React.CSSProperties = {
  padding: '12px 14px', borderRadius: 9, border: '1.5px solid #E5E7EB',
  fontSize: 14, outline: 'none', background: '#fff',
  width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color 0.15s',
}

const btnPrimary: React.CSSProperties = {
  padding: '13px 0', borderRadius: 10, border: 'none',
  background: 'linear-gradient(135deg,#1B2733 0%,#0F1824 100%)',
  color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  width: '100%', fontFamily: 'inherit', letterSpacing: '0.02em',
  boxShadow: '0 4px 16px rgba(27,39,51,0.25)',
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
