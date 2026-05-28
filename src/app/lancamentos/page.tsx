'use client'
import { useState } from 'react'
import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'

// ─── Dados do empreendimento ─────────────────────────────────────────────────

const EMP = {
  nome: 'Madison Square',
  subtitulo: 'A brand new start',
  status: 'EM CONSTRUÇÃO',
  bairro: 'Vila Castela · Nova Lima / MG',
  descricao: 'Madison Square oferece apartamentos modernos com localização estratégica, plantas inteligentes e lazer completo do térreo à cobertura. Um novo começo em um dos endereços mais valorizados da Grande BH.',
  suites: '1 e 2 suítes',
  area: '49 – 82 m²',
  vagas: '1 a 2 vagas',
  unidades: '230 unidades',
  terreno: '10.984 m²',
  entrega: '2027',
  precoFrom: 'R$ 490 mil',
  construtora: 'VN Prime Desenvolvimento Imobiliário',
  arquitetura: 'Escritório De Castro Arquitetura',
  paisagismo: 'Verde Urbano Paisagismo',
  progresso: 12,

  galeria: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=85',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=85',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85',
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=1400&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1400&q=85',
  ],

  lazer: [
    { icon: '🏊', nome: 'Piscina adulto' },
    { icon: '🧒', nome: 'Piscina infantil' },
    { icon: '🔥', nome: 'Piscina coberta aquecida' },
    { icon: '💆', nome: 'Spa & sauna' },
    { icon: '🏋️', nome: 'Academia completa' },
    { icon: '🎾', nome: 'Quadra de padel' },
    { icon: '🍖', nome: 'Espaço gourmet & churrasqueira' },
    { icon: '💻', nome: 'Coworking' },
    { icon: '🎬', nome: 'Sala de cinema' },
    { icon: '🎮', nome: 'Sala de jogos' },
    { icon: '🐾', nome: 'Pet place' },
    { icon: '🌳', nome: 'Área verde & jardim' },
    { icon: '🚗', nome: 'Portaria 24h com câmeras' },
    { icon: '📦', nome: 'Depósito por unidade' },
    { icon: '🛗', nome: 'Elevadores privativos' },
    { icon: '🌇', nome: 'Rooftop com vista panorâmica' },
  ],

  plantas: [
    { tipo: '1 Suíte · 49 m²', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', vagas: 1 },
    { tipo: '2 Suítes · 68 m²', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', vagas: 1 },
    { tipo: '2 Suítes · 82 m²', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80', vagas: 2, destaque: true },
    { tipo: 'Cobertura · 110 m²', img: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=600&q=80', vagas: 2 },
  ],

  sustentabilidade: [
    { icon: '☀️', titulo: 'Energia solar', desc: 'Painéis fotovoltaicos nas áreas comuns reduzem em até 60% o custo do condomínio.' },
    { icon: '💧', titulo: 'Reuso de água', desc: 'Sistema de captação de água da chuva para irrigação e limpeza das áreas externas.' },
    { icon: '♻️', titulo: 'Gestão de resíduos', desc: 'Central de coleta seletiva com gestão integrada de recicláveis e orgânicos.' },
    { icon: '🌡️', titulo: 'Eficiência térmica', desc: 'Vidros duplos e isolamento nas fachadas para conforto e economia de energia.' },
  ],

  diferenciais: [
    'Acabamento alto padrão — porcelanato 90×90 em toda a unidade',
    'Ar-condicionado split pré-instalado em todos os dormitórios',
    'Automação residencial integrada via app',
    'Fechadura digital biométrica',
    'Varanda gourmet em todos os apartamentos a partir de 68 m²',
    'Estrutura para ponto de recarga de veículos elétricos',
  ],
}

// ─── Componentes auxiliares ──────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 800, color: '#D4A857', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5 }}>{label}</div>
    </div>
  )
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto clamp(36px,5vw,56px)' }}>
      {eyebrow && <Eyebrow color="var(--gold-deep)">{eyebrow}</Eyebrow>}
      <h2 style={{ margin: '10px 0 12px', fontSize: 'clamp(1.6rem,3vw,2.3rem)' }}>{title}</h2>
      {sub && <p style={{ color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function LancamentosPage() {
  const [activePhoto, setActivePhoto] = useState(0)
  const [plantaIdx, setPlantaIdx] = useState(0)
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' })
  const [formSent, setFormSent] = useState(false)

  const setField = (k: string, v: string) => setFormData(f => ({ ...f, [k]: v }))

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
  }

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* ── Hero Gallery ──────────────────────────────── */}
      <section style={{ position: 'relative', height: 'clamp(480px,65vh,780px)', overflow: 'hidden' }}>
        <img
          src={EMP.galeria[activePhoto]}
          alt={EMP.nome}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,24,36,0.82) 0%, rgba(15,24,36,0.30) 60%, transparent 100%)' }} />

        {/* Thumbnails */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {EMP.galeria.map((src, i) => (
            <button key={i} onClick={() => setActivePhoto(i)} style={{
              width: i === activePhoto ? 48 : 36, height: 36,
              borderRadius: 6, overflow: 'hidden', border: `2px solid ${i === activePhoto ? '#D4A857' : 'rgba(255,255,255,0.4)'}`,
              padding: 0, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
            }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>

        {/* Hero text */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4A857', color: '#0F1824', padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1824', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              {EMP.status}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6, letterSpacing: '0.05em' }}>{EMP.bairro}</div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2.4rem,5vw,4rem)', fontFamily: 'Cormorant Garamond, serif', fontWeight: 800, lineHeight: 1.05, margin: '0 0 8px' }}>
              {EMP.nome}
            </h1>
            <p style={{ color: 'rgba(245,248,250,0.8)', fontSize: 18, fontStyle: 'italic', marginBottom: 28 }}>{EMP.subtitulo}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#contato">
                <Btn variant="accent" size="lg">Quero saber mais</Btn>
              </a>
              <a href="#plantas">
                <Btn variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Ver plantas</Btn>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────── */}
      <div style={{ background: '#1B2733', padding: 'clamp(24px,4vw,40px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 28 }}>
          <StatBadge value={EMP.suites} label="Dormitórios" />
          <StatBadge value={EMP.area} label="Área privativa" />
          <StatBadge value={EMP.vagas} label="Vagas" />
          <StatBadge value={EMP.unidades} label="Unidades" />
          <StatBadge value={EMP.terreno} label="Área total" />
          <StatBadge value={EMP.entrega} label="Previsão de entrega" />
        </div>
      </div>

      {/* ── Sobre o empreendimento ─────────────────────── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))', gap: 'clamp(36px,6vw,80px)', alignItems: 'center' }}>
          <div>
            <Eyebrow color="var(--gold-deep)">O empreendimento</Eyebrow>
            <h2 style={{ margin: '10px 0 20px', fontSize: 'clamp(1.6rem,3vw,2.3rem)' }}>Onde design e<br/>localização se encontram</h2>
            <p style={{ fontSize: 16, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 24 }}>{EMP.descricao}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {EMP.diferenciais.map(d => (
                <li key={d} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ width: 20, height: 20, borderRadius: 99, background: 'rgba(212,168,87,0.18)', color: '#D4A857', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.5 }}>{d}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#contato"><Btn variant="accent">Agendar visita</Btn></a>
              <a href="#plantas"><Btn variant="ghost">Ver plantas</Btn></a>
            </div>
          </div>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 56px rgba(27,39,51,0.14)', aspectRatio: '4/3' }}>
            <img src={EMP.galeria[1]} alt={EMP.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(15,24,36,0.80)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>A partir de</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#D4A857', fontFamily: 'Cormorant Garamond, serif' }}>{EMP.precoFrom}</div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 16 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Entrega {EMP.entrega}</div>
                <div>Progresso: {EMP.progresso}%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lazer ─────────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <SectionTitle
            eyebrow="Área de lazer"
            title="Do térreo ao rooftop"
            sub={`${EMP.lazer.length} itens de lazer pensados para quem valoriza tempo de qualidade.`}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 14 }}>
            {EMP.lazer.map((l, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 14, padding: '20px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
                border: '1px solid var(--border)', transition: 'box-shadow 0.2s',
              }}>
                <div style={{ fontSize: 26 }}>{l.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>{l.nome}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plantas ───────────────────────────────────── */}
      <section id="plantas" style={{ padding: 'clamp(60px,8vw,96px) 0', background: '#fff' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <SectionTitle
            eyebrow="Plantas"
            title="Escolha sua planta"
            sub="Tipologias com aproveitamento inteligente de espaço e varanda gourmet a partir dos 68 m²."
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
            {EMP.plantas.map((p, i) => (
              <button key={i} onClick={() => setPlantaIdx(i)} style={{
                padding: '9px 20px', borderRadius: 99, border: `2px solid ${plantaIdx === i ? '#1B2733' : '#E5E7EB'}`,
                background: plantaIdx === i ? '#1B2733' : '#fff',
                color: plantaIdx === i ? '#fff' : '#6B7280',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                position: 'relative',
              }}>
                {p.tipo}
                {p.destaque && <span style={{ position: 'absolute', top: -8, right: -8, background: '#D4A857', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 99, letterSpacing: '0.05em' }}>MAIS VENDIDA</span>}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 40, alignItems: 'center' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(27,39,51,0.10)', aspectRatio: '1', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={EMP.plantas[plantaIdx].img} alt={EMP.plantas[plantaIdx].tipo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 10 }}>Tipologia selecionada</div>
              <h3 style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', margin: '0 0 16px' }}>{EMP.plantas[plantaIdx].tipo}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  `${EMP.plantas[plantaIdx].vagas} vaga${EMP.plantas[plantaIdx].vagas > 1 ? 's' : ''} de garagem`,
                  'Varanda integrada à sala',
                  'Suite com closet',
                  'Lavanderia interna',
                  'Acabamento alto padrão',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: 'var(--fg-1)', alignItems: 'center' }}>
                    <span style={{ color: '#D4A857', fontWeight: 700 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="#contato"><Btn variant="accent" size="lg">Solicitar memorial descritivo</Btn></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sustentabilidade ──────────────────────────── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 0', background: '#0F1824' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <SectionTitle
            eyebrow="Sustentabilidade"
            title={<span style={{ color: '#fff' }}>Construção com responsabilidade</span> as any}
            sub={<span style={{ color: 'rgba(245,248,250,0.65)' }}>Soluções ecológicas integradas ao projeto desde a concepção.</span> as any}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {EMP.sustentabilidade.map(s => (
              <div key={s.titulo} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{s.titulo}</div>
                <div style={{ fontSize: 13.5, color: 'rgba(245,248,250,0.6)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galeria ───────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          <SectionTitle eyebrow="Galeria" title="Imagens do empreendimento" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'auto', gap: 10 }}>
            {EMP.galeria.map((src, i) => (
              <div key={i} onClick={() => setActivePhoto(i)} style={{
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                aspectRatio: i === 0 ? '16/9' : '4/3',
                gridColumn: i === 0 ? '1 / -1' : 'auto',
                boxShadow: '0 4px 16px rgba(27,39,51,0.10)',
              }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Construtora ───────────────────────────────── */}
      <section style={{ padding: 'clamp(40px,6vw,72px) 0', background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-around', alignItems: 'center' }}>
          {[
            { label: 'Incorporadora', value: EMP.construtora },
            { label: 'Arquitetura', value: EMP.arquitetura },
            { label: 'Paisagismo', value: EMP.paisagismo },
          ].map(c => (
            <div key={c.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{c.value}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Progresso da obra</div>
            <div style={{ width: 140, height: 8, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${EMP.progresso}%`, height: '100%', background: 'linear-gradient(90deg,#D4A857,#F6D77A)', borderRadius: 99, transition: 'width 1s' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 5 }}>{EMP.progresso}% concluído</div>
          </div>
        </div>
      </section>

      {/* ── Formulário de contato ─────────────────────── */}
      <section id="contato" style={{ padding: 'clamp(60px,8vw,100px) 0', background: 'linear-gradient(135deg,#0F1824 0%,#1B2733 100%)' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 60, alignItems: 'center' }}>
          {/* Copy */}
          <div style={{ color: '#fff' }}>
            <Eyebrow>Interesse</Eyebrow>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', margin: '14px 0 16px' }}>
              Garanta sua unidade no {EMP.nome}
            </h2>
            <p style={{ color: 'rgba(245,248,250,0.72)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
              Preencha o formulário e um especialista VN Prime entrará em contato em até 2 horas com condições exclusivas, tabela de preços e disponibilidade de unidades.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '📍', text: EMP.bairro },
                { icon: '🏗️', text: `Entrega prevista: ${EMP.entrega}` },
                { icon: '💰', text: `A partir de ${EMP.precoFrom}` },
                { icon: '🔑', text: `${EMP.unidades} · ${EMP.suites}` },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 14.5, color: 'rgba(245,248,250,0.8)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(28px,4vw,44px)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 22, margin: '0 0 8px' }}>Recebemos seu contato!</h3>
                <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6 }}>
                  Um especialista VN Prime vai entrar em contato em até 2 horas com as melhores condições para você.
                </p>
                <div style={{ marginTop: 24 }}>
                  <a href={`https://wa.me/5531984144250?text=${encodeURIComponent(`Olá! Tenho interesse no ${EMP.nome} em ${EMP.bairro}.`)}`} target="_blank" rel="noopener noreferrer">
                    <Btn variant="accent" size="lg" style={{ width: '100%' }}>💬 Falar via WhatsApp agora</Btn>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 20, margin: '0 0 6px' }}>Quero mais informações</h3>
                <p style={{ fontSize: 13.5, color: 'var(--fg-2)', margin: '0 0 24px' }}>Sem compromisso. Resposta em até 2 horas.</p>
                <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input type="text" placeholder="Seu nome" value={formData.nome} onChange={e => setField('nome', e.target.value)} required style={formInp} />
                  <input type="email" placeholder="E-mail" value={formData.email} onChange={e => setField('email', e.target.value)} required style={formInp} />
                  <input type="tel" placeholder="WhatsApp (com DDD)" value={formData.telefone} onChange={e => setField('telefone', e.target.value)} required style={formInp} />
                  <select style={{ ...formInp, color: 'var(--fg-2)' }} defaultValue="">
                    <option value="" disabled>Qual tipologia te interessa?</option>
                    {EMP.plantas.map(p => <option key={p.tipo} value={p.tipo}>{p.tipo}</option>)}
                  </select>
                  <button type="submit" style={{
                    padding: '14px 0', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg,#D4A857 0%,#B8862E 100%)',
                    color: '#0F1824', fontSize: 15, fontWeight: 800, cursor: 'pointer',
                    fontFamily: 'inherit', boxShadow: '0 4px 18px rgba(212,168,87,0.36)',
                  }}>
                    Quero saber mais →
                  </button>
                  <p style={{ fontSize: 11.5, color: 'var(--fg-3)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
                    Seus dados estão seguros. Não compartilhamos com terceiros.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── WhatsApp fixo ─────────────────────────────── */}
      <a
        href={`https://wa.me/5531984144250?text=${encodeURIComponent(`Olá! Tenho interesse no ${EMP.nome} em ${EMP.bairro}.`)}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25D366', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.50)',
          textDecoration: 'none', transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Falar no WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </main>
  )
}

const formInp: React.CSSProperties = {
  padding: '12px 14px', borderRadius: 9, border: '1.5px solid #E5E7EB',
  fontSize: 14, outline: 'none', background: '#fff',
  width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
}
