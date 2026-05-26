'use client'
import { useState } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import { createClient } from '@/lib/supabase/client'

export default function AvaliacaoPage() {
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', endereco: '', tipo: 'extrajudicial', obs: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('leads').insert({
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      mensagem: `Avaliação ${form.tipo} — Endereço: ${form.endereco}. Obs: ${form.obs}`,
      origem: 'avaliacao',
    })
    setEnviado(true)
    setLoading(false)
  }

  const planos = [
    {
      tipo: 'estimativa',
      titulo: 'Estimativa por IA',
      preco: 'Gratuita',
      sub: 'resultado imediato',
      desc: 'Algoritmo VN Prime com dados de mercado de BH e RMBH. Boa para ter uma referência rápida antes de negociar.',
      bullets: ['Resultado em segundos', 'Base: histórico de transações BH/RMBH', 'Sem visita ao imóvel', 'Sem valor legal'],
      accent: '#6B7280',
      badge: '',
    },
    {
      tipo: 'extrajudicial',
      titulo: 'Laudo Extrajudicial',
      preco: 'Valor a consultar',
      sub: 'conforme complexidade',
      desc: 'Laudo técnico assinado por engenheiro ou arquiteto credenciado. Válido para inventários, partilhas e negociações particulares.',
      bullets: ['Vistoria presencial', 'Relatório fotográfico completo', 'Assinado por profissional credenciado', 'CREA/CAU — validade jurídica'],
      accent: '#D4A857',
      badge: 'MAIS SOLICITADO',
    },
    {
      tipo: 'judicial',
      titulo: 'Laudo Judicial',
      preco: 'Valor a consultar',
      sub: 'conforme complexidade',
      desc: 'Laudo pericial para processos judiciais, herança contestada, divórcio litigioso ou licitação. Perito nomeado pelo tribunal.',
      bullets: ['Perito judicial ou assistente técnico', 'Norma NBR 14653 rigorosa', 'Aceito em qualquer instância', 'Prazo sob demanda judicial'],
      accent: '#1B2733',
      badge: '',
    },
  ]

  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, rgba(15,24,36,0.92) 0%, rgba(27,39,51,0.88) 100%),
                     url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1900&q=85) center/cover`,
        padding: 'clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)',
        color: '#fff',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', maxWidth: 680 }}>
          <Eyebrow color="var(--gold)">Avaliação de Imóveis</Eyebrow>
          <h1 style={{ color: '#fff', margin: '14px 0 18px' }}>
            Quanto vale{' '}
            <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>o seu imóvel?</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.85)', lineHeight: 1.7, marginBottom: 36 }}>
            Estimativa por IA, laudo extrajudicial para inventários e negociações, ou laudo judicial para processos. Escolha o nível de formalidade que você precisa.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#solicitar"><Btn variant="accent" size="lg">Solicitar avaliação</Btn></a>
            <a href="#planos"><Btn variant="ghost-light" size="lg">Ver modalidades</Btn></a>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow color="var(--gold-deep)">Modalidades</Eyebrow>
            <h2 style={{ margin: '10px 0 0' }}>Escolha a avaliação certa</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 24 }}>
            {planos.map(p => (
              <div key={p.tipo} style={{
                background: p.tipo === 'extrajudicial' ? 'var(--navy)' : 'var(--cream)',
                borderRadius: 20,
                padding: 'clamp(26px,3.5vw,36px)',
                border: p.tipo === 'extrajudicial' ? 'none' : '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: 20, right: 20, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, letterSpacing: '0.06em' }}>{p.badge}</div>
                )}
                <div style={{ width: 36, height: 3, background: p.accent, borderRadius: 2, marginBottom: 18 }} />
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: p.tipo === 'extrajudicial' ? 'rgba(255,255,255,0.5)' : 'var(--fg-3)', marginBottom: 6 }}>{p.titulo}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: p.tipo === 'extrajudicial' ? 'var(--gold-soft)' : 'var(--navy)', marginBottom: 3 }}>{p.preco}</div>
                <div style={{ fontSize: 12, color: p.tipo === 'extrajudicial' ? 'rgba(255,255,255,0.45)' : 'var(--fg-3)', marginBottom: 16 }}>{p.sub}</div>
                <div style={{ fontSize: 13.5, color: p.tipo === 'extrajudicial' ? 'rgba(255,255,255,0.7)' : 'var(--fg-2)', lineHeight: 1.6, marginBottom: 20 }}>{p.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.bullets.map(b => (
                    <li key={b} style={{ display: 'flex', gap: 10, fontSize: 13, color: p.tipo === 'extrajudicial' ? 'rgba(255,255,255,0.65)' : 'var(--fg-2)' }}>
                      <span style={{ color: p.accent === '#D4A857' ? 'var(--gold)' : p.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section id="solicitar" style={{ padding: 'clamp(50px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(700px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow color="var(--gold-deep)">Solicitação</Eyebrow>
            <h2 style={{ margin: '10px 0 10px' }}>Solicitar avaliação</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15 }}>Retorno em até 24h úteis com orçamento e prazo.</p>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', border: '1px solid var(--border)' }}>
            {enviado ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>Solicitação enviada!</div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 24 }}>
                  Nossa equipe entrará em contato em até 24h úteis com orçamento e disponibilidade.
                </div>
                <a href={`https://wa.me/5531984144250?text=Olá! Solicitei avaliação de imóvel no site VN Prime. Gostaria de confirmar.`} target="_blank" rel="noopener noreferrer">
                  <Btn variant="primary">Confirmar pelo WhatsApp</Btn>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                  {[
                    { ph: 'Nome completo', key: 'nome', type: 'text' },
                    { ph: 'WhatsApp', key: 'telefone', type: 'tel' },
                    { ph: 'E-mail', key: 'email', type: 'email' },
                  ].map(f => (
                    <input key={f.key} type={f.type} placeholder={f.ph} value={(form as any)[f.key]} required
                      onChange={e => set(f.key, e.target.value)}
                      style={{ padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                  ))}
                </div>
                <input type="text" placeholder="Endereço do imóvel" value={form.endereco} required
                  onChange={e => set('endereco', e.target.value)}
                  style={{ padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />

                <div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 10, fontWeight: 600 }}>Tipo de avaliação</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                      { v: 'estimativa', l: 'Estimativa IA (gratuita)' },
                      { v: 'extrajudicial', l: 'Laudo Extrajudicial' },
                      { v: 'judicial', l: 'Laudo Judicial' },
                    ].map(o => (
                      <button key={o.v} type="button" onClick={() => set('tipo', o.v)}
                        style={{
                          padding: '8px 16px', borderRadius: 99, border: '1.5px solid',
                          borderColor: form.tipo === o.v ? 'var(--gold)' : 'var(--border)',
                          background: form.tipo === o.v ? 'var(--gold)' : '#fff',
                          color: form.tipo === o.v ? 'var(--navy-deep)' : 'var(--fg-1)',
                          fontSize: 13, fontWeight: form.tipo === o.v ? 700 : 500, cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}>{o.l}</button>
                    ))}
                  </div>
                </div>

                <textarea placeholder="Observações (metragem, tipo do imóvel, finalidade)" value={form.obs}
                  onChange={e => set('obs', e.target.value)} rows={3}
                  style={{ padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} />

                <Btn variant="primary" type="submit" style={{ opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Enviando...' : 'Solicitar avaliação'}
                </Btn>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', textAlign: 'center' }}>
                  Retorno em até 24h úteis · orçamento sem compromisso
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
