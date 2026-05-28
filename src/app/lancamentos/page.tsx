'use client'
import { useState } from 'react'
import Link from 'next/link'
import Btn from '@/components/ui/Btn'

// ─── Dados ───────────────────────────────────────────────────────────────────

const EMP = {
  nome: 'Madison Square',
  tagline: 'Viver no Vila Castela pode ser uma experiência transformadora.',
  sub: 'Apartamentos de 1 e 2 suítes com lazer completo do térreo ao rooftop, em um dos endereços mais valorizados de Nova Lima.',
  status: 'Em construção',
  bairro: 'Vila Castela · Nova Lima / MG',
  entrega: 'Previsão 2027',
  suites: '1 e 2 suítes',
  area: '49 – 82 m²',
  vagas: '1 a 2 vagas',
  unidades: '230 unidades',
  terreno: '10.984 m²',
  precoFrom: 'A partir de R$ 490 mil',
  progresso: 12,

  galeria: [
    { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=85', alt: 'Fachada' },
    { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85', alt: 'Sala de estar' },
    { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85', alt: 'Varanda' },
    { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85', alt: 'Vista aérea' },
    { src: 'https://images.unsplash.com/photo-1560185127-6a8d51938e01?w=1200&q=85', alt: 'Piscina' },
    { src: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=85', alt: 'Área de lazer' },
  ],

  plantas: [
    { tipo: '1 Suíte', area: '49 m²', vagas: 1, img: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=700&q=80' },
    { tipo: '2 Suítes', area: '68 m²', vagas: 1, img: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=700&q=80' },
    { tipo: '2 Suítes Plus', area: '82 m²', vagas: 2, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80', destaque: true },
  ],

  amenidades: [
    {
      categoria: 'Lazer',
      itens: ['Piscina adulto', 'Piscina infantil', 'Piscina coberta aquecida', 'Deck molhado', 'Espaço gourmet', 'Churrasqueira', 'Salão de festas', 'Rooftop com vista panorâmica'],
    },
    {
      categoria: 'Bem-estar',
      itens: ['Academia completa', 'Spa', 'Sauna seca e úmida', 'Sala de massagem', 'Espaço de meditação'],
    },
    {
      categoria: 'Esporte',
      itens: ['Quadra de padel', 'Espaço de crossfit', 'Bicicletário coberto', 'Pet place com banho'],
    },
    {
      categoria: 'Convivência',
      itens: ['Coworking', 'Sala de cinema', 'Sala de jogos', 'Playground', 'Minimercado', 'Lavanderia coletiva'],
    },
    {
      categoria: 'Infraestrutura',
      itens: ['Portaria 24h com câmeras', 'Elevadores privativos', 'Depósito por unidade', 'Gerador de energia', 'Ponto de recarga elétrica'],
    },
    {
      categoria: 'Sustentabilidade',
      itens: ['Energia solar nas áreas comuns', 'Reuso de água da chuva', 'Coleta seletiva', 'Vidros com isolamento térmico'],
    },
  ],

  diferenciais: [
    { titulo: 'Acabamento alto padrão', desc: 'Porcelanato 90×90 cm em toda a unidade, metais Deca e marcenaria sob medida.' },
    { titulo: 'Automação residencial', desc: 'Controle de iluminação, climatização e fechaduras pelo app, em todas as tipologias.' },
    { titulo: 'Varanda gourmet', desc: 'Varanda integrada à sala com infraestrutura para churrasqueira nas tipologias a partir de 68 m².' },
    { titulo: 'Ar-condicionado', desc: 'Split pré-instalado em todos os dormitórios e sala de estar.' },
  ],
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function GoldLine() {
  return <div style={{ width: 48, height: 3, background: '#D4A857', borderRadius: 2, marginBottom: 20 }} />
}

function StatusBadge() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(212,168,87,0.5)', borderRadius: 4, padding: '5px 14px', marginBottom: 24 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A857', display: 'inline-block' }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4A857' }}>{EMP.status}</span>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function LancamentosPage() {
  const [fotoAtiva, setFotoAtiva] = useState(0)
  const [plantaIdx, setPlantaIdx] = useState(2)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', tipologia: '' })
  const [enviado, setEnviado] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <main style={{ background: '#fff', color: '#1B2733' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '92vh' }} className="hero-grid">
        {/* Texto */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(48px,7vw,96px) clamp(32px,5vw,72px)',
          background: '#0F1824',
        }}>
          <StatusBadge />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', marginBottom: 12 }}>{EMP.bairro}</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(2.4rem,4.5vw,3.8rem)',
            fontWeight: 700, lineHeight: 1.08,
            color: '#fff', margin: '0 0 20px',
          }}>
            {EMP.nome}
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.4vw,18px)', color: 'rgba(245,248,250,0.72)', lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
            {EMP.tagline}
          </p>

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              ['Tipologia', EMP.suites],
              ['Área privativa', EMP.area],
              ['Vagas', EMP.vagas],
              ['Unidades', EMP.unidades],
              ['Terreno', EMP.terreno],
              ['Entrega', EMP.entrega],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#contato">
              <button style={btnGold}>Quero ser contactado</button>
            </a>
            <a href="#plantas">
              <button style={btnGhost}>Ver plantas</button>
            </a>
          </div>
        </div>

        {/* Foto hero */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
          <img
            src={EMP.galeria[fotoAtiva].src}
            alt={EMP.galeria[fotoAtiva].alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.6s' }}
          />
          <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
            {EMP.galeria.map((_, i) => (
              <button key={i} onClick={() => setFotoAtiva(i)} style={{
                width: i === fotoAtiva ? 28 : 8, height: 8,
                borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
                background: i === fotoAtiva ? '#D4A857' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
          <div style={{
            position: 'absolute', bottom: 56, left: 24,
            background: 'rgba(15,24,36,0.82)', backdropFilter: 'blur(12px)',
            borderRadius: 8, padding: '12px 18px',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>A partir de</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#D4A857' }}>{EMP.precoFrom}</div>
          </div>
        </div>
      </section>

      {/* ── Progresso da obra ────────────────────────────────────────── */}
      <div style={{ background: '#F5F8FA', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', padding: '28px 0', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280', flexShrink: 0 }}>Progresso da obra</div>
          <div style={{ flex: 1, minWidth: 200, height: 6, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${EMP.progresso}%`, height: '100%', background: 'linear-gradient(90deg,#D4A857,#F6D77A)', borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#D4A857', flexShrink: 0 }}>{EMP.progresso}% concluído</div>
          <div style={{ fontSize: 13, color: '#6B7280', flexShrink: 0 }}>{EMP.entrega}</div>
        </div>
      </div>

      {/* ── Sobre ────────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(72px,10vw,120px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,480px),1fr))', gap: 'clamp(48px,7vw,96px)', alignItems: 'center' }}>
          <div>
            <GoldLine />
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 700, lineHeight: 1.12, margin: '0 0 20px' }}>
              Um projeto inspirador<br />em todos os sentidos.
            </h2>
            <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.8, marginBottom: 28 }}>
              {EMP.sub}
            </p>
            <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.8 }}>
              Inspire-se todos os dias com uma arquitetura que valoriza a luz natural, os espaços amplos e a integração com a paisagem de Nova Lima — uma das regiões de maior valorização imobiliária de Minas Gerais.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {EMP.galeria.slice(1, 5).map((f, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }} onClick={() => setFotoAtiva(i + 1)}>
                <img src={f.src} alt={f.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diferenciais ─────────────────────────────────────────────── */}
      <section style={{ background: '#F5F8FA', padding: 'clamp(72px,10vw,120px) 0', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <GoldLine />
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, margin: '0 0 48px' }}>
            Acabamento que você sente na primeira visita.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', background: '#E5E7EB' }}>
            {EMP.diferenciais.map((d, i) => (
              <div key={i} style={{ background: '#fff', padding: '32px 28px' }}>
                <div style={{ width: 32, height: 2, background: '#D4A857', borderRadius: 1, marginBottom: 18 }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1B2733', marginBottom: 10 }}>{d.titulo}</div>
                <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plantas ──────────────────────────────────────────────────── */}
      <section id="plantas" style={{ padding: 'clamp(72px,10vw,120px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <GoldLine />
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, margin: '0 0 12px' }}>
            Plantas que otimizam cada metro quadrado.
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 48 }}>
            Tipologias com varanda integrada e aproveitamento inteligente de espaço.
          </p>

          {/* Seletor */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E5E7EB', marginBottom: 48 }}>
            {EMP.plantas.map((p, i) => (
              <button key={i} onClick={() => setPlantaIdx(i)} style={{
                padding: '14px 28px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                color: plantaIdx === i ? '#1B2733' : '#9CA3AF',
                borderBottom: `3px solid ${plantaIdx === i ? '#D4A857' : 'transparent'}`,
                marginBottom: -2, transition: 'all 0.15s', position: 'relative',
              }}>
                {p.tipo}
                {p.destaque && <span style={{ position: 'absolute', top: 8, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#D4A857', display: 'block' }} />}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 64, alignItems: 'center' }}>
            <div style={{ background: '#F5F8FA', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src={EMP.plantas[plantaIdx].img} alt={EMP.plantas[plantaIdx].tipo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4A857', marginBottom: 12 }}>Tipologia selecionada</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', fontWeight: 700, margin: '0 0 6px' }}>
                {EMP.plantas[plantaIdx].tipo}
              </h3>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1B2733', marginBottom: 28 }}>{EMP.plantas[plantaIdx].area}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', marginBottom: 36 }}>
                {[
                  ['Área privativa', EMP.plantas[plantaIdx].area],
                  ['Vagas', `${EMP.plantas[plantaIdx].vagas} vaga${EMP.plantas[plantaIdx].vagas > 1 ? 's' : ''}`],
                  ['Varanda', 'Integrada à sala'],
                  ['Suíte', 'Com closet'],
                  ['Lavanderia', 'Interna'],
                  ['Acabamento', 'Alto padrão'],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2733' }}>{v}</div>
                  </div>
                ))}
              </div>
              <a href="#contato"><button style={btnGold}>Solicitar memorial descritivo</button></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Amenidades ───────────────────────────────────────────────── */}
      <section style={{ background: '#0F1824', padding: 'clamp(72px,10vw,120px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <GoldLine />
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
            Lazer completo do térreo ao rooftop.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 56 }}>
            {EMP.amenidades.reduce((acc, c) => acc + c.itens.length, 0)} itens de lazer e infraestrutura.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 40 }}>
            {EMP.amenidades.map(cat => (
              <div key={cat.categoria}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4A857', marginBottom: 16 }}>{cat.categoria}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cat.itens.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 16, height: 1, background: '#D4A857', display: 'inline-block', flexShrink: 0, marginTop: 10 }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galeria full ─────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(72px,10vw,120px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <GoldLine />
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, margin: '0 0 48px' }}>
            Galeria
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'auto auto', gap: 10 }}>
            {EMP.galeria.map((f, i) => (
              <div key={i} onClick={() => setFotoAtiva(i)} style={{
                borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                aspectRatio: i === 0 ? '16/7' : '4/3',
                gridColumn: i === 0 ? '1 / -1' : 'auto',
              }}>
                <img src={f.src} alt={f.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contato ──────────────────────────────────────────────────── */}
      <section id="contato" style={{ background: '#F5F8FA', borderTop: '1px solid #E5E7EB', padding: 'clamp(72px,10vw,120px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 'clamp(48px,7vw,96px)', alignItems: 'center' }}>

          {/* Copy */}
          <div>
            <GoldLine />
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.12 }}>
              Garanta sua unidade<br />no {EMP.nome}.
            </h2>
            <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.8, marginBottom: 36 }}>
              Preencha o formulário e um especialista VN Prime entra em contato em até 2 horas com tabela de preços, condições de pagamento e disponibilidade de unidades.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                ['Localização', EMP.bairro],
                ['Entrega', EMP.entrega],
                ['Preço', EMP.precoFrom],
                ['Tipologias', EMP.suites + ' · ' + EMP.area],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ flex: '0 0 100px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', paddingTop: 2 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2733' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,44px)', border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(27,39,51,0.07)' }}>
            {enviado ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22 }}>✓</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, margin: '0 0 10px' }}>Recebemos seu contato</h3>
                <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                  Um especialista VN Prime vai entrar em contato em até 2 horas com as melhores condições.
                </p>
                <a href={`https://wa.me/5531984144250?text=${encodeURIComponent('Olá! Tenho interesse no Madison Square em Vila Castela, Nova Lima.')}`} target="_blank" rel="noopener noreferrer">
                  <button style={{ ...btnGold, width: '100%' }}>Falar via WhatsApp agora</button>
                </a>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 6px' }}>Quero mais informações</h3>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 28px' }}>Sem compromisso. Resposta em até 2 horas.</p>
                <form onSubmit={e => { e.preventDefault(); setEnviado(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelSt}>Nome completo</label>
                    <input value={form.nome} onChange={e => set('nome', e.target.value)} required style={inputSt} placeholder="Seu nome" />
                  </div>
                  <div>
                    <label style={labelSt}>E-mail</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required style={inputSt} placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label style={labelSt}>WhatsApp</label>
                    <input type="tel" value={form.telefone} onChange={e => set('telefone', e.target.value)} required style={inputSt} placeholder="(31) 9 0000-0000" />
                  </div>
                  <div>
                    <label style={labelSt}>Tipologia de interesse</label>
                    <select value={form.tipologia} onChange={e => set('tipologia', e.target.value)} style={{ ...inputSt, color: form.tipologia ? '#1B2733' : '#9CA3AF' }}>
                      <option value="">Selecione</option>
                      {EMP.plantas.map(p => <option key={p.tipo} value={p.tipo}>{p.tipo} · {p.area}</option>)}
                    </select>
                  </div>
                  <button type="submit" style={{ ...btnGold, marginTop: 8 }}>Quero ser contactado</button>
                  <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                    Seus dados estão seguros. Não compartilhamos com terceiros.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── WhatsApp fixo ────────────────────────────────────────────── */}
      <a href={`https://wa.me/5531984144250?text=${encodeURIComponent('Olá! Tenho interesse no Madison Square em Vila Castela, Nova Lima.')}`}
        target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, width: 52, height: 52, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.45)', textDecoration: 'none' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { min-height: 55vw; }
        }
      `}</style>
    </main>
  )
}

// ─── Estilos base ─────────────────────────────────────────────────────────────

const btnGold: React.CSSProperties = {
  padding: '13px 28px', borderRadius: 6, border: 'none',
  background: '#D4A857', color: '#0F1824',
  fontSize: 14, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit', letterSpacing: '0.04em',
  transition: 'opacity 0.15s',
}

const btnGhost: React.CSSProperties = {
  padding: '13px 28px', borderRadius: 6,
  border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent',
  color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit', letterSpacing: '0.04em',
}

const labelSt: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: '#6B7280', marginBottom: 7,
}

const inputSt: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none',
  background: '#fff', fontFamily: 'inherit', color: '#1B2733',
  boxSizing: 'border-box',
}
