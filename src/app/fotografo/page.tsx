'use client'
import { useState } from 'react'

function FaqFotografo() {
  const [open, setOpen] = useState<number | null>(null)
  const items = [
    { q: 'Vocês atendem qual região?', a: 'Atendemos toda a Grande BH — Belo Horizonte, Nova Lima, Contagem, Betim e municípios da RMBH. Para imóveis fora da região metropolitana, consulte disponibilidade.' },
    { q: 'Como funciona o prazo de entrega?', a: 'Prazos por pacote: Essencial em 48h, Completo em 48h e Premium em 24h após a sessão. Entregamos galeria online com link de acesso e arquivos em alta resolução.' },
    { q: 'Preciso organizar o imóvel antes?', a: 'Sim! Um imóvel arrumado é fundamental para boas fotos. Nossa equipe orienta sobre organização antes da sessão: remova objetos pessoais, abra cortinas, ligue pontos de luz.' },
    { q: 'O que está incluso no tour 360°?', a: 'Tour virtual interativo hospedado por 12 meses, link compartilhável para WhatsApp e portais, visualização em desktop e mobile. Disponível nos pacotes Completo e Premium.' },
    { q: 'Posso usar as fotos em portais e redes sociais?', a: 'Sim, todas as fotos incluem direito de uso comercial irrestrito. Você pode publicar em Zap, Viva Real, OLX, Instagram, WhatsApp e qualquer outro canal.' },
  ]
  return (
    <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: '#fff' }}>
      <div style={{ width: 'min(760px,92vw)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 8 }}>Dúvidas frequentes</div>
          <h2 style={{ margin: 0 }}>Tudo sobre a sessão fotográfica</h2>
        </div>
        {items.map((it, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '18px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'inherit' }}>
              <span style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>{it.q}</span>
              <span style={{ fontSize: 18, color: 'var(--gold)', flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
            </button>
            {open === i && <p style={{ fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.75, margin: '0 0 18px', paddingRight: 32 }}>{it.a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
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

      {/* Stats strip */}
      <section style={{ background: 'var(--navy-deep)', padding: '22px 0' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { n: '500+', label: 'sessões realizadas' },
              { n: '48h', label: 'entrega média' },
              { n: '4.9★', label: 'avaliação média' },
              { n: '3×', label: 'mais visitas com fotos profissionais' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '8px 28px', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontWeight: 900, color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2, whiteSpace: 'nowrap' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impacto nas vendas */}
      <section style={{ padding: 'clamp(50px,7vw,90px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Eyebrow color="var(--gold-deep)">Dados comprovados</Eyebrow>
            <h2 style={{ margin: '8px 0 12px' }}>Fotografia que multiplica resultados</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Imóveis com fotos profissionais vendem mais rápido e por preços maiores.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 20 }}>
            {[
              {
                label: '❌ Sem fotografia profissional', borderColor: '#FCA5A5', headerColor: '#DC2626',
                items: [
                  { label: 'Tempo no mercado', value: '67 dias' },
                  { label: 'Visualizações/semana', value: '18' },
                  { label: 'Taxa de conversão', value: '1,2%' },
                  { label: 'Leads qualificados', value: '2–3/mês' },
                ],
              },
              {
                label: '✅ Com fotografia VN Prime', borderColor: '#86EFAC', headerColor: '#059669',
                items: [
                  { label: 'Tempo no mercado', value: '28 dias', delta: '−58%' },
                  { label: 'Visualizações/semana', value: '64', delta: '+256%' },
                  { label: 'Taxa de conversão', value: '4,1%', delta: '+242%' },
                  { label: 'Leads qualificados', value: '8–12/mês', delta: '+300%' },
                ],
              },
            ].map(col => (
              <div key={col.label} style={{ background: '#fff', borderRadius: 16, border: `2px solid ${col.borderColor}`, padding: '26px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: col.headerColor, marginBottom: 18 }}>{col.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.items.map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{s.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--navy)' }}>{s.value}</span>
                        {'delta' in s && s.delta && (
                          <span style={{ fontSize: 11, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '2px 7px', borderRadius: 99 }}>{s.delta}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--fg-3)', marginTop: 20 }}>
            Dados baseados em médias do portfólio VN Prime. Resultados individuais podem variar.
          </p>
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

      <FaqFotografo />

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
