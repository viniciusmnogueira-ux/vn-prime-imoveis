'use client'
import { useState } from 'react'
import Link from 'next/link'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'
import { createClient } from '@/lib/supabase/client'

const PACOTES = [
  {
    id: 'essencial', nome: 'Essencial', preco: 'R$ 390', duracao: '60 min',
    itens: ['25 fotos editadas em alta', 'Tratamento de luz e cor', 'Entrega em 48h', 'Direito de uso comercial'],
  },
  {
    id: 'completo', nome: 'Completo', preco: 'R$ 690', duracao: '90 min', destaque: true,
    itens: ['40 fotos editadas em alta', 'Tour virtual 360°', 'Vídeo curto (30s vertical)', 'Planta humanizada', 'Entrega em 48h'],
  },
  {
    id: 'premium', nome: 'Premium · com drone', preco: 'R$ 1.190', duracao: '2h',
    itens: ['60 fotos + drone aéreo', 'Tour 360° + Matterport', 'Vídeo cinematográfico (60s)', 'Plantas + contexto urbano', 'Entrega em 24h'],
  },
]

const PASSOS = [
  { n: '01', t: 'Briefing',      d: 'Conversa rápida sobre o imóvel, estilo desejado e prazo' },
  { n: '02', t: 'Sessão no local', d: 'Equipe com equipamento profissional · 1 a 3h no imóvel' },
  { n: '03', t: 'Edição',        d: 'Tratamento de luz, cor, perspectiva e remoção de detalhes' },
  { n: '04', t: 'Entrega',       d: 'Galeria online + arquivos em alta para uso ilimitado' },
]

export default function FotografoPage() {
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', pacote: 'Completo', endereco: '', mensagem: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.telefone) return
    setSending(true)
    const supabase = createClient()
    await supabase.from('leads').insert({
      nome: form.nome, email: form.email, telefone: form.telefone,
      mensagem: `Pacote: ${form.pacote} | Endereço: ${form.endereco} | ${form.mensagem}`,
      origem: 'fotografo',
    })
    setSent(true); setSending(false)
  }

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* Hero */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(180deg, rgba(15,22,32,0.55) 0%, rgba(15,22,32,0.85) 100%), url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1900&q=85)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        color: '#fff', padding: 'clamp(80px,12vw,140px) 0 clamp(60px,9vw,100px)',
      }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto', maxWidth: 720 }}>
          <Eyebrow>Canal do Fotógrafo</Eyebrow>
          <h1 style={{ color: '#fff', margin: '12px 0 18px', fontSize: 'clamp(2.4rem,5vw,3.6rem)', lineHeight: 1.05 }}>
            Fotografia que <em style={{ fontStyle: 'italic', color: 'var(--gold-soft)' }}>vende</em> imóveis de alto padrão.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.88)', maxWidth: 560, marginBottom: 28 }}>
            Equipe especializada em fotografia imobiliária, tour virtual 360°, drone e vídeo cinematográfico. Atendemos toda a Grande BH.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#pacotes"><Btn variant="accent" size="lg">Contratar sessão</Btn></a>
            <Link href="/proprietario"><Btn variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>Área do Proprietário</Btn></Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ padding: 'clamp(50px,7vw,90px) 0' }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow>Como funciona</Eyebrow>
            <h2 style={{ margin: '8px 0' }}>4 passos · entrega em até 48h</h2>
          </div>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
            {PASSOS.map(s => (
              <div key={s.n} style={{ background: '#fff', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold-deep)', fontFamily: 'var(--font-display)', marginBottom: 10 }}>{s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pacotes */}
      <section id="pacotes" style={{ padding: 'clamp(50px,7vw,90px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1180px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow>Pacotes</Eyebrow>
            <h2 style={{ margin: '8px 0' }}>Escolha o tamanho do seu projeto</h2>
          </div>
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            {PACOTES.map(p => (
              <div key={p.id} style={{
                background: p.destaque ? 'var(--navy-deep)' : '#fff',
                color: p.destaque ? '#fff' : 'var(--navy)',
                padding: 28, borderRadius: 'var(--radius-lg)',
                border: p.destaque ? 'none' : '1px solid var(--border)',
                boxShadow: p.destaque ? 'var(--shadow-soft)' : 'none',
                position: 'relative',
              }}>
                {p.destaque && (
                  <div style={{ position: 'absolute', top: -12, left: 24, background: 'var(--gold)', color: 'var(--navy-deep)', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Mais escolhido
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.destaque ? 'var(--gold-soft)' : 'var(--gold-deep)', marginBottom: 10 }}>{p.nome}</div>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{p.preco}</div>
                <div style={{ fontSize: 13, color: p.destaque ? 'rgba(255,255,255,0.6)' : 'var(--fg-2)', marginBottom: 18 }}>sessão de {p.duracao}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.itens.map(it => (
                    <li key={it} style={{ fontSize: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: p.destaque ? 'var(--gold-soft)' : 'var(--gold-deep)', fontWeight: 700 }}>✓</span>
                      <span style={{ color: p.destaque ? 'rgba(255,255,255,0.85)' : 'var(--fg-1)' }}>{it}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/anunciar" style={{ display: 'block' }}>
                  <Btn variant={p.destaque ? 'accent' : 'primary'} size="md" style={{ width: '100%' }}>
                    Contratar {p.nome}
                  </Btn>
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--fg-3)' }}>
            Fotografia inclusa nos planos Venda Assistida e Venda Completa · <Link href="/vender" style={{ color: 'var(--gold-deep)', fontWeight: 600 }}>Ver planos</Link>
          </p>
        </div>
      </section>

      {/* Formulário de agendamento */}
      <section style={{ padding: 'clamp(50px,7vw,90px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(720px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow color="var(--gold-deep)">Agendar sessão</Eyebrow>
            <h2 style={{ margin: '8px 0 10px' }}>Solicite um orçamento</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>
              Preencha e entraremos em contato em até 2 horas para confirmar disponibilidade.
            </p>
          </div>
          {sent ? (
            <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 14, padding: '28px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📸</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#065F46', marginBottom: 6 }}>Solicitação recebida!</div>
              <div style={{ fontSize: 14, color: '#047857' }}>Nossa equipe entrará em contato em até 2 horas pelo WhatsApp ou e-mail informado.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: '32px 36px', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(15,34,68,0.06)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Nome *</label>
                  <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome completo" required style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>WhatsApp *</label>
                  <input value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(31) 99999-9999" type="tel" required style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>E-mail</label>
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com" type="email" style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Pacote desejado</label>
                <select value={form.pacote} onChange={e => set('pacote', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', color: 'var(--navy)', cursor: 'pointer' }}>
                  {PACOTES.map(p => <option key={p.id} value={p.nome}>{p.nome} — {p.preco}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Endereço do imóvel</label>
                <input value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Rua, número, bairro, cidade" style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', display: 'block', marginBottom: 5 }}>Observações</label>
                <textarea value={form.mensagem} onChange={e => set('mensagem', e.target.value)} placeholder="Disponibilidade, número de ambientes, estilo…" rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <Btn variant="accent" size="lg" style={{ width: '100%' }} loading={sending} disabled={!form.nome || !form.telefone}>
                {sending ? 'Enviando…' : 'Solicitar orçamento'}
              </Btn>
            </form>
          )}
        </div>
      </section>

    </main>
  )
}
