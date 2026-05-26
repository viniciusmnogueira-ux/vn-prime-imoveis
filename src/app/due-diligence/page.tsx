'use client'
import { useState } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import { createClient } from '@/lib/supabase/client'

const CHECKLIST = [
  {
    categoria: 'Documentação do Imóvel',
    itens: [
      'Certidão de inteiro teor atualizada (< 30 dias)',
      'Certidão negativa de ônus e alienações',
      'Habite-se e alvará de construção',
      'Planta aprovada pela prefeitura',
      'Regularização perante a Receita Federal (DIRF)',
    ],
  },
  {
    categoria: 'Documentação do Vendedor',
    itens: [
      'Certidão negativa de débitos federais',
      'Certidão negativa de débitos estaduais',
      'Certidão negativa de débitos municipais (IPTU)',
      'Certidões dos distribuidores cíveis e criminais',
      'Consulta ao SERASA/SPC do vendedor',
    ],
  },
  {
    categoria: 'Aspectos Jurídicos',
    itens: [
      'Análise da cadeia dominial (histórico de proprietários)',
      'Verificação de penhoras, hipotecas e alienações',
      'Checagem de processos trabalhistas vinculados',
      'Conformidade com o perímetro urbano/rural',
      'Verificação de área de preservação permanente (APP)',
    ],
  },
  {
    categoria: 'Aspectos Técnicos',
    itens: [
      'Vistoria técnica de estrutura e instalações',
      'Laudo de conformidade elétrica e hidráulica',
      'Área construída vs área averbada',
      'Estado de conservação geral',
    ],
  },
]

export default function DueDiligencePage() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [imovel, setImovel] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('leads').insert({
      nome,
      telefone,
      email,
      mensagem: `Due Diligence — Imóvel: ${imovel}`,
      origem: 'due-diligence',
    })
    setEnviado(true)
    setLoading(false)
  }

  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, rgba(15,24,36,0.94) 0%, rgba(27,39,51,0.90) 100%),
                     url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1900&q=85) center/cover`,
        padding: 'clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)',
        color: '#fff',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', maxWidth: 680 }}>
          <Eyebrow color="var(--gold)">Segurança antes de comprar</Eyebrow>
          <h1 style={{ color: '#fff', margin: '14px 0 18px' }}>
            Due Diligence{' '}
            <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>imobiliária.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.85)', lineHeight: 1.7, marginBottom: 36 }}>
            Análise jurídica e técnica completa antes de assinar qualquer contrato. Proteja seu patrimônio com a due diligence VN Prime.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#solicitar">
              <Btn variant="accent" size="lg">Solicitar análise</Btn>
            </a>
            <a href="#checklist">
              <Btn variant="ghost-light" size="lg">Ver checklist</Btn>
            </a>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 32 }}>
          {[
            { t: 'Análise documental', d: 'Verificamos a cadeia dominial, certidões negativas, IPTU, existência de ônus ou penhoras sobre o imóvel e o vendedor.' },
            { t: 'Vistoria técnica', d: 'Avaliação do estado real do imóvel: estrutura, instalações, área construída vs averbada. Sem surpresas pós-compra.' },
            { t: 'Laudo jurídico', d: 'Parecer de advogado especializado em direito imobiliário sobre os riscos e recomendações antes do contrato.' },
            { t: 'Relatório completo', d: 'Entregamos um relatório estruturado com todos os achados, riscos classificados e recomendações de mitigação.' },
          ].map(d => (
            <div key={d.t}>
              <div style={{ width: 36, height: 3, background: 'var(--gold)', marginBottom: 16, borderRadius: 2 }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{d.t}</div>
              <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6 }}>{d.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist + Formulário */}
      <section id="checklist" style={{ padding: 'clamp(50px,7vw,80px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'start' }}>

          {/* Checklist */}
          <div>
            <Eyebrow color="var(--gold-deep)">O que analisamos</Eyebrow>
            <h2 style={{ margin: '12px 0 28px' }}>Checklist completo</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {CHECKLIST.map(cat => (
                <div key={cat.categoria}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 12 }}>{cat.categoria}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cat.itens.map(item => (
                      <div key={item} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--fg-2)' }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div id="solicitar" style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', border: '1px solid var(--border)', position: 'sticky', top: 100 }}>
            {enviado ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>Solicitação enviada!</div>
                <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6 }}>
                  Nossa equipe entrará em contato em até 24h úteis com um orçamento personalizado.
                </div>
                <div style={{ marginTop: 20 }}>
                  <a href={`https://wa.me/5531984144250?text=Olá! Solicitei a Due Diligence no site VN Prime. Quero acelerar o processo.`} target="_blank" rel="noopener noreferrer">
                    <Btn variant="primary">Falar agora no WhatsApp</Btn>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <Eyebrow color="var(--gold-deep)">Solicitar análise</Eyebrow>
                <h3 style={{ margin: '10px 0 22px' }}>Fale com um especialista</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { ph: 'Nome completo', val: nome, set: setNome, type: 'text' },
                    { ph: 'WhatsApp', val: telefone, set: setTelefone, type: 'tel' },
                    { ph: 'E-mail', val: email, set: setEmail, type: 'email' },
                  ].map(f => (
                    <input key={f.ph} type={f.type} placeholder={f.ph} value={f.val} required
                      onChange={e => f.set(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  ))}
                  <textarea
                    placeholder="Descreva o imóvel (endereço, tipo, valor aproximado)"
                    value={imovel} onChange={e => setImovel(e.target.value)} rows={3} required
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  <Btn variant="primary" type="submit" style={{ opacity: loading ? 0.6 : 1 }}>
                    {loading ? 'Enviando...' : 'Solicitar due diligence'}
                  </Btn>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', textAlign: 'center' }}>
                    Retorno em até 24h úteis · orçamento sem compromisso
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
