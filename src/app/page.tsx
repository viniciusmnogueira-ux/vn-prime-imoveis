'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Btn from '@/components/ui/Btn'
import Eyebrow from '@/components/ui/Eyebrow'
import { createClient } from '@/lib/supabase/client'

const HERO_PHOTOS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=85',
  'https://images.unsplash.com/photo-1582268611958-ebfd161df9d8?w=2400&q=85',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2400&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2400&q=85',
]

const SERVICOS = [
  {
    title: 'Área do Proprietário',
    subtitle: 'Venda com autonomia total',
    desc: 'Você define o preço, cadastra seu imóvel e conduz a venda. A VN Prime cuida da plataforma, suporte e qualificação de compradores. Fotografia e mídia são pacotes adicionais.',
    bullets: ['R$ 297 taxa fixa · ou 3% somente ao vender', 'Cadastro e gestão do anúncio pelo proprietário', 'Qualificação de compradores pela plataforma', 'Pacotes de fotografia e mídia à parte'],
    cta: 'Anunciar meu imóvel', href: '/proprietario',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
    accent: '#D4A857',
  },
  {
    title: 'Portal do Corretor',
    subtitle: 'Leads qualificados e comissão garantida',
    desc: 'Acesse o portfólio VN Prime, receba leads com contato completo e gerencie seu funil de vendas com CRM Kanban integrado. Comissão integral em cada venda.',
    bullets: ['Leads com WhatsApp + e-mail qualificados', 'CRM Kanban de funil de vendas', 'Portfólio premium VN Prime', 'Comissão integral garantida'],
    cta: 'Entrar como corretor parceiro', href: '/corretor',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80',
    accent: '#2F8674',
  },
  {
    title: 'Consórcio Imobiliário',
    subtitle: 'Compre sem juros, no seu ritmo',
    desc: 'A forma mais inteligente de adquirir seu imóvel. Sem juros, sem entrada obrigatória. Carta de crédito nominal contemplada por sorteio ou lance mensal.',
    bullets: ['Sem juros bancários; apenas taxa de administração conforme administradora', 'Prazo de até 12 anos', 'Contemplação por sorteio ou lance', '200+ consorciados em BH e região'],
    cta: 'Simular minha carta', href: '/consorcio',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',
    accent: '#059669',
  },
  {
    title: 'Due Diligence',
    subtitle: 'Compre com segurança jurídica total',
    desc: 'Antes de assinar qualquer contrato, a VN Prime analisa toda a documentação e realiza vistoria técnica. Relatório executivo completo entregue em até 48 horas.',
    bullets: ['30+ itens verificados', 'Relatório em até 48 horas', 'Análise jurídica + vistoria técnica', 'Sem surpresas no pós-venda'],
    cta: 'Solicitar análise', href: '/due-diligence',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80',
    accent: '#6366F1',
  },
  {
    title: 'Lançamentos',
    subtitle: 'Alta valorização, condições exclusivas',
    desc: 'Apartamentos, casas em condomínio e lotes no melhor da Grande BH. Compre na planta com entrada facilitada, fluxo baixo durante as obras e financiamento na entrega.',
    bullets: ['3 empreendimentos exclusivos em carteira', 'Valorização de 50–60% até as chaves', 'Entrada facilitada + financiamento bancário', 'Unidades a partir de R$ 320 mil'],
    cta: 'Ver lançamentos', href: '/lancamentos',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80',
    accent: '#D4A857',
  },
  {
    title: 'Calculadora ITBI',
    subtitle: 'Calcule todos os custos antes de fechar',
    desc: 'Saiba exatamente quanto vai pagar de ITBI, registro, escritura e demais custos cartorários antes de assinar qualquer contrato. Cálculo preciso em segundos.',
    bullets: ['ITBI + escritura + registro tudo junto', 'Resultado instantâneo e gratuito', 'Simule por valor de venda ou avaliação', 'Referência para negociação e planejamento'],
    cta: 'Calcular agora', href: '/calculadora',
    img: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=900&q=80',
    accent: '#6366F1',
  },
]

const PLANOS = [
  {
    name: 'Venda Direta',
    tag: 'Sem comissão',
    price: 'R$ 297',
    priceLabel: 'taxa única — você fica com 100% da venda',
    desc: 'Anuncie na maior vitrine premium de BH e venda mais sem pagar comissão. Você define o preço, conduz as visitas e fecha direto com o comprador.',
    bullets: ['Sem comissão — 0% sobre a venda', 'Anúncio por 90 dias na vitrine VN Prime', 'Gerador de descrição editorial com IA', 'Endereço privado — exibe só o bairro', 'Suporte por WhatsApp'],
    cta: 'Começar agora',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=85',
  },
  {
    name: 'Venda Assistida',
    tag: 'Mais escolhido · Você só paga se vender',
    price: '3%',
    priceLabel: 'você paga apenas quando vender — zero risco',
    desc: 'Venda mais rápido com o apoio da VN Prime. Você cadastra o imóvel e conduz o processo; a equipe VN Prime qualifica compradores, cuida do anúncio e mantém tudo otimizado até fechar o negócio.',
    bullets: ['Só paga se vender — 0 risco', 'Curadoria e descrição editorial com IA', 'Qualificação ativa de compradores', 'Time VN Prime nos bastidores', 'Pacotes de fotografia e mídia à parte'],
    cta: 'Escolher este plano',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=85',
  },
  {
    name: 'Venda Completa',
    tag: 'Mãos livres · Você só paga se vender',
    price: '6%',
    priceLabel: 'você paga apenas quando vender — você aprova a proposta e assina',
    desc: 'A VN Prime cuida de tudo. Corretor dedicado, fotos profissionais, mídia paga gerenciada, visitas conduzidas e negociação. Você só precisa aprovar a proposta e assinar a escritura.',
    bullets: ['Corretor parceiro dedicado à sua venda', 'Fotos do imóvel incluídas', 'Mídia paga em Meta, Google e portais', 'Visitas acompanhadas pelo corretor', 'Concierge de negociação', 'Suporte jurídico até a escritura'],
    cta: 'Quero mãos livres',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85',
  },
]

const STATS = [
  { value: 'BH e Grande BH', label: 'Área de atuação' },
  { value: '3 planos', label: 'De venda — sem custo de entrada' },
  { value: '0%', label: 'De comissão no plano direto' },
  { value: 'Jurídico', label: 'Due diligence + consórcio incluso' },
]

const SERVICE_PILLS = [
  { label: 'Proprietário',      href: '/proprietario',  accent: '#D4A857' },
  { label: 'Corretor Parceiro', href: '/corretor',       accent: '#2F8674' },
  { label: 'Consórcio',         href: '/consorcio',      accent: '#059669' },
  { label: 'Due Diligence',     href: '/due-diligence',  accent: '#4B5563' },
  { label: 'Lançamentos',       href: '/lancamentos',    accent: '#D4A857' },
  { label: 'Avaliação',         href: '/avaliacao',      accent: '#6B7280' },
  { label: 'Calculadora ITBI',  href: '/calculadora',    accent: '#6B7280' },
]

const QUICK_LINKS = ['Apartamentos em BH', 'Casas Grande BH', 'Coberturas BH', 'Lançamentos Grande BH', 'Aluguel BH', 'Acima de R$ 5 mi']

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

function ArrowBtn({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', [dir]: -20, top: '50%', transform: 'translateY(-50%)',
      zIndex: 10, width: 44, height: 44, borderRadius: '50%',
      background: '#fff', border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-soft)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, color: 'var(--navy)', lineHeight: 1,
    }}>
      {dir === 'left' ? '‹' : '›'}
    </button>
  )
}

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [serviceIdx, setServiceIdx] = useState(0)
  const [planoIdx, setPlanoIdx] = useState(0)
  const [searchQ, setSearchQ] = useState('')
  const [searchTipo, setSearchTipo] = useState('')
  const [searchValor, setSearchValor] = useState('')
  const [featured, setFeatured] = useState<any[]>([])
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [recentImoveis, setRecentImoveis] = useState<any[]>([])
  const [nlEmail, setNlEmail] = useState('')
  const [nlSent, setNlSent] = useState(false)
  const [nlSending, setNlSending] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_PHOTOS.length), 7000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('imoveis')
      .select('id, titulo, tipo, bairro, cidade, preco, area_m2, quartos, fotos, destaque')
      .eq('status', 'ativo')
      .order('destaque', { ascending: false })
      .order('criado_em', { ascending: false })
      .limit(6)
      .then(({ data }) => setFeatured(data || []))

    // Recently viewed
    const ids: string[] = JSON.parse(localStorage.getItem('vnp_recent') ?? '[]')
    setRecentIds(ids)
    if (ids.length > 0) {
      supabase.from('imoveis')
        .select('id, titulo, tipo, bairro, cidade, preco, area_m2, quartos, fotos, destaque')
        .in('id', ids)
        .eq('status', 'ativo')
        .then(({ data }) => {
          if (data) {
            const ordered = ids.map(id => data.find(d => d.id === id)).filter(Boolean)
            setRecentImoveis(ordered)
          }
        })
    }
  }, [])

  const sendNl = async () => {
    if (!nlEmail) return
    setNlSending(true)
    const supabase = createClient()
    await supabase.from('leads').insert({ nome: '', email: nlEmail, origem: 'newsletter' })
    setNlSent(true); setNlSending(false)
  }

  const searchHref = `/busca${searchQ || searchTipo || searchValor
    ? `?q=${encodeURIComponent(searchQ)}&tipo=${searchTipo}&valor=${searchValor}`
    : ''}`

  return (
    <main>
      {/* ── Hero ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 580, padding: '4rem 0 6rem',
        color: '#fff', textAlign: 'center',
        display: 'flex', alignItems: 'center',
      }}>
        {HERO_PHOTOS.map((photo, i) => (
          <div key={photo} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0, transition: 'opacity 1.6s ease', zIndex: 0,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(120deg, rgba(15,34,68,0.80) 0%, rgba(15,34,68,0.52) 45%, rgba(15,34,68,0.68) 100%)',
        }} />
        <div style={{
          position: 'absolute', top: -200, right: -200, width: 600, height: 600, zIndex: 1,
          background: 'radial-gradient(circle, rgba(212,168,87,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2, width: 'min(1280px,94vw)', margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>VN Prime Imóveis · Belo Horizonte e região</Eyebrow>
          <h1 style={{
            color: '#fff', fontSize: 'clamp(2rem,4.4vw,3.4rem)',
            textShadow: '0 2px 24px rgba(0,0,0,0.4)', margin: '0 0 16px',
            maxWidth: '20ch', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15,
          }}>
            Encontre seu próximo endereço{' '}
            <em className="italic-accent" style={{
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              de alto padrão
            </em>
          </h1>
          <p style={{ color: 'rgba(250,249,246,0.92)', fontSize: 16, maxWidth: 580, margin: '0 auto 28px', textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
            Compre, venda ou invista em imóveis com curadoria, tecnologia e segurança jurídica em BH e região.
          </p>

          {/* Search card */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '1.25rem',
            boxShadow: '0 22px 60px rgba(15,34,68,0.32)',
            display: 'grid', gap: 10, maxWidth: 920, margin: '0 auto',
            gridTemplateColumns: '1.6fr 1fr 1fr auto', alignItems: 'end',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Onde</div>
              <input type="text" placeholder="Cidade, bairro ou código (ex.: Nova Lima, VN-2048)"
                value={searchQ} onChange={e => setSearchQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (window.location.href = searchHref)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--navy)', background: 'transparent', fontFamily: 'var(--font-body)' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Tipo</div>
              <select value={searchTipo} onChange={e => setSearchTipo(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--navy)', background: 'transparent', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
                <option value="">Todos</option>
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Cobertura</option>
                <option>Studio</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Valor até</div>
              <select value={searchValor} onChange={e => setSearchValor(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--navy)', background: 'transparent', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
                <option value="">Sem limite</option>
                <option value="2000000">R$ 2 mi</option>
                <option value="5000000">R$ 5 mi</option>
                <option value="10000000">R$ 10 mi</option>
              </select>
            </div>
            <Link href={searchHref}><Btn variant="accent" size="lg">Buscar</Btn></Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center', minWidth: 110 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--gold-soft)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,249,246,0.8)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Service pills */}
          <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,248,250,0.45)', textAlign: 'center', marginBottom: 14 }}>
              Nossos serviços
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              {SERVICE_PILLS.map(s => (
                <Link key={s.href} href={s.href}>
                  <button style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: 999, padding: '7px 16px', color: '#fff', fontFamily: 'inherit',
                    fontSize: 12.5, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(6px)',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.accent + '28'; (e.currentTarget as HTMLElement).style.borderColor = s.accent + '66' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)' }}
                  >{s.label}</button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick links ── */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>Buscas frequentes</span>
          {QUICK_LINKS.map(q => (
            <Link key={q} href={`/busca?q=${encodeURIComponent(q)}`}
              style={{ fontSize: 13, color: 'var(--navy)', padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 999, textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
            >{q}</Link>
          ))}
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section style={{ padding: 'clamp(3rem,5vw,4.5rem) 0', background: '#fff' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <Eyebrow color="var(--gold-deep)">Simples e transparente</Eyebrow>
            <h2 style={{ margin: '10px 0 12px', fontSize: 'clamp(1.6rem,2.8vw,2.2rem)' }}>Como funciona a VN Prime</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Três passos para comprar ou anunciar com segurança e resultado.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28 }}>
            {([
              { n: '01', title: 'Busque ou cadastre', desc: 'Explore o portfólio curado ou anuncie seu imóvel em minutos. Sem burocracia, sem papelada.', icon: '🔍', accent: 'var(--gold)' },
              { n: '02', title: 'Qualificação e contato', desc: 'Compradores qualificados entram em contato diretamente. Proprietários recebem leads com nome, e-mail e WhatsApp.', icon: '👤', accent: '#059669' },
              { n: '03', title: 'Feche com segurança', desc: 'Due Diligence opcional, análise jurídica e acompanhamento VN Prime até a assinatura do contrato.', icon: '✓', accent: '#3B82F6' },
            ] as { n: string; title: string; desc: string; icon: string; accent: string }[]).map(s => (
              <div key={s.n} style={{ background: 'var(--cream)', borderRadius: 18, padding: '32px 28px', position: 'relative', border: '1px solid var(--border)' }}>
                <div style={{ position: 'absolute', top: -14, left: 24, background: s.accent, color: '#fff', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, letterSpacing: '-0.02em' }}>{s.n}</div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>{s.title}</div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destaques ── */}
      {featured.length > 0 && (
        <section style={{ padding: 'clamp(2.5rem,5vw,4rem) 0', background: 'var(--cream)' }}>
          <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 24, flexWrap: 'wrap' }}>
              <div>
                <Eyebrow color="var(--gold)">Seleção VN Prime · Em destaque</Eyebrow>
                <h2 style={{ margin: 0, fontSize: 'clamp(1.4rem,2.5vw,1.9rem)' }}>Endereços que valem a visita</h2>
              </div>
              <Link href="/busca"><Btn variant="ghost">Ver todos os imóveis →</Btn></Link>
            </div>
            <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
              {featured.map(im => {
                const foto = im.fotos?.[0] ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'
                return (
                  <Link key={im.id} href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', transition: 'transform 0.18s, box-shadow 0.18s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 44px rgba(15,34,68,0.14)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                      <div style={{ height: 200, backgroundImage: `url(${foto})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                        {im.destaque && <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase' }}>★ Destaque</span>}
                      </div>
                      <div style={{ padding: '18px 20px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 2 }}>Preço de pedida</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)', marginBottom: 6 }}>{im.preco ? fmt(im.preco) : 'Consulte'}</div>
                        <h3 style={{ fontSize: 15, color: 'var(--navy)', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.3 }}>{im.titulo}</h3>
                        <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{im.bairro}{im.bairro && im.cidade ? ', ' : ''}{im.cidade}</div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                          {im.area_m2 && <span>{im.area_m2} m²</span>}
                          {im.quartos && <span>{im.quartos} quartos</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Bairros ── */}
      <section style={{ padding: 'clamp(2rem,4vw,3.5rem) 0', background: '#fff' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 6 }}>Explorar por bairro</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.3rem,2.2vw,1.7rem)' }}>Regiões em destaque</h2>
            </div>
            <Link href="/busca" style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-deep)', textDecoration: 'none' }}>Ver todos →</Link>
          </div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
            {[
              { nome: 'Savassi', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&q=80' },
              { nome: 'Belvedere', img: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=400&q=80' },
              { nome: 'Lourdes', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
              { nome: 'Funcionários', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80' },
              { nome: 'Nova Lima', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80' },
              { nome: 'Serra', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
            ].map(b => (
              <Link key={b.nome} href={`/busca?q=${encodeURIComponent(b.nome)}`} style={{ textDecoration: 'none' }}>
                <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', paddingTop: '70%', background: `url(${b.img}) center/cover`, boxShadow: '0 2px 12px rgba(15,34,68,0.10)', transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(15,34,68,0.18)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(15,34,68,0.10)' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,24,36,0.75) 0%, transparent 55%)' }} />
                  <span style={{ position: 'absolute', bottom: 12, left: 14, color: '#fff', fontSize: 13, fontWeight: 700 }}>{b.nome}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section style={{ padding: 'clamp(3rem,5vw,4.5rem) 0', background: 'var(--navy)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow color="var(--gold)">O que nossos clientes dizem</Eyebrow>
            <h2 style={{ color: '#fff', margin: '8px 0 0', fontWeight: 400 }}>Histórias de quem vendeu e comprou com a VN Prime</h2>
          </div>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {[
              { nome: 'Fernanda Costa', cargo: 'Proprietária — Savassi', txt: 'Vendi meu apartamento em 18 dias. Recebi 5 leads qualificados na primeira semana e o processo foi completamente transparente do início ao fim.', stars: 5 },
              { nome: 'Rodrigo Lima', cargo: 'Comprador — Nova Lima', txt: 'A due diligence que a equipe fez me salvou de uma compra com problemas jurídicos sérios. Encontrei outro imóvel em 2 semanas e fechei com total segurança.', stars: 5 },
              { nome: 'Ana Paula Nunes', cargo: 'Corretora parceira', txt: 'O portal de corretor é o melhor que já usei. Leads qualificados chegam com histórico de interesse, pipeline visual e pagamento garantido em D+2.', stars: 5 },
            ].map(t => (
              <div key={t.nome} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px 28px', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, i) => <span key={i} style={{ color: 'var(--gold)', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ color: 'rgba(245,248,250,0.85)', fontSize: 14.5, lineHeight: 1.75, margin: '0 0 20px', fontStyle: 'italic' }}>"{t.txt}"</p>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>{t.nome}</div>
                  <div style={{ fontSize: 12, color: 'var(--gold-soft)' }}>{t.cargo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Serviços (carousel) ── */}
      <section id="home-servicos" style={{ padding: 'clamp(3rem,6vw,5rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <Eyebrow color="var(--gold)">Para quem anuncia e compra</Eyebrow>
            <h2 style={{ margin: '0 0 12px' }}>Nossos <em className="italic-accent">serviços</em></h2>
            <p style={{ color: 'var(--fg-2)', margin: 0 }}>
              Soluções completas para vender, comprar, financiar e documentar seu imóvel com segurança.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {serviceIdx > 0 && <ArrowBtn dir="left" onClick={() => setServiceIdx(i => i - 1)} />}
            {serviceIdx < SERVICOS.length - 1 && <ArrowBtn dir="right" onClick={() => setServiceIdx(i => i + 1)} />}

            <div style={{ overflow: 'hidden', borderRadius: 20 }}>
              <div style={{ display: 'flex', transform: `translateX(-${serviceIdx * 100}%)`, transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
                {SERVICOS.map(s => (
                  <div key={s.href} style={{ minWidth: '100%' }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 0,
                      borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-soft)', minHeight: 320,
                    }}>
                      {/* Photo */}
                      <div style={{
                        backgroundImage: `linear-gradient(135deg,rgba(15,22,32,0.45) 0%,rgba(15,22,32,0.15) 100%), url(${s.img})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        position: 'relative', minHeight: 380,
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,transparent 60%,rgba(255,255,255,1) 100%)' }} />
                        <div style={{ position: 'absolute', bottom: 32, left: 32 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', opacity: 0.8, marginBottom: 8 }}>{s.subtitle}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 600, color: '#fff', lineHeight: 1.2, maxWidth: '12ch' }}>{s.title}</div>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ background: '#fff', padding: 'clamp(28px,4vw,48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ width: 40, height: 3, background: s.accent, borderRadius: 2, marginBottom: 20 }} />
                        <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 24, margin: '0 0 24px' }}>{s.desc}</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {s.bullets.map(b => (
                            <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.5 }}>
                              <span style={{ color: s.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>{b}
                            </li>
                          ))}
                        </ul>
                        <div>
                          <Link href={s.href}>
                            <button style={{
                              background: s.accent, color: s.accent === '#D4A857' ? 'var(--navy-deep)' : '#fff',
                              border: 'none', borderRadius: 10, padding: '12px 24px',
                              fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                              boxShadow: `0 6px 20px ${s.accent}44`,
                            }}>{s.cta} →</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {SERVICOS.map((_, i) => (
                <button key={i} onClick={() => setServiceIdx(i)} style={{
                  width: i === serviceIdx ? 24 : 8, height: 8, borderRadius: 999,
                  background: i === serviceIdx ? 'var(--gold)' : 'var(--border)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.3s, background 0.3s',
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Planos (carousel) ── */}
      <section id="home-planos" style={{ padding: 'clamp(3rem,6vw,5rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <Eyebrow color="var(--gold)">Para quem vende</Eyebrow>
            <h2 style={{ margin: '0 0 12px' }}>Nossos <em className="italic-accent">planos</em></h2>
            <p style={{ color: 'var(--fg-2)', margin: 0 }}>
              Você escolhe o nível de envolvimento da plataforma. Sem custo de entrada — só paga se vender.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {planoIdx > 0 && <ArrowBtn dir="left" onClick={() => setPlanoIdx(i => i - 1)} />}
            {planoIdx < PLANOS.length - 1 && <ArrowBtn dir="right" onClick={() => setPlanoIdx(i => i + 1)} />}

            <div style={{ overflow: 'hidden', borderRadius: 22 }}>
              <div style={{ display: 'flex', transform: `translateX(-${planoIdx * 100}%)`, transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
                {PLANOS.map(p => (
                  <div key={p.name} style={{ minWidth: '100%' }}>
                    <div style={{
                      position: 'relative', borderRadius: 22, overflow: 'hidden',
                      minHeight: 440, display: 'flex', alignItems: 'center',
                      backgroundImage: `linear-gradient(110deg,rgba(15,22,32,0.92) 0%,rgba(15,22,32,0.65) 45%,rgba(15,22,32,0.40) 100%), url(${p.img})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }}>
                      <div style={{
                        position: 'relative', zIndex: 1, padding: 'clamp(36px,5vw,64px)',
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
                        gap: 'clamp(24px,4vw,48px)', alignItems: 'center', width: '100%',
                      }}>
                        <div>
                          <div style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--navy-deep)', borderRadius: 999, padding: '4px 14px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>{p.tag}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 600, color: '#fff', marginBottom: 8 }}>Plano {p.name}</div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 700, color: 'var(--gold-soft)', lineHeight: 1 }}>{p.price}</div>
                          </div>
                          <div style={{ fontSize: 13, color: 'rgba(245,248,250,0.7)', marginBottom: 24 }}>{p.priceLabel}</div>
                          <p style={{ fontSize: 15, color: 'rgba(245,248,250,0.88)', lineHeight: 1.75, margin: '0 0 28px' }}>{p.desc}</p>
                          <Link href="/proprietario">
                            <button style={{ background: 'var(--gold)', color: 'var(--navy-deep)', border: 'none', borderRadius: 10, padding: '14px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>{p.cta} →</button>
                          </Link>
                          <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(245,248,250,0.5)', letterSpacing: '0.01em' }}>
                            Faça o upgrade quando quiser — sem burocracia.
                          </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '28px' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 18 }}>O que está incluso</div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {p.bullets.map(b => (
                              <li key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, color: 'rgba(245,248,250,0.92)', lineHeight: 1.5 }}>
                                <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {PLANOS.map((_, i) => (
                <button key={i} onClick={() => setPlanoIdx(i)} style={{
                  width: i === planoIdx ? 28 : 8, height: 8, borderRadius: 999,
                  background: i === planoIdx ? 'var(--gold)' : 'var(--border)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.3s, background 0.3s',
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Segurança em cada etapa ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 0', background: 'var(--white)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 44px' }}>
            <Eyebrow color="var(--gold)">Nosso compromisso</Eyebrow>
            <h2 style={{ margin: '10px 0 12px' }}>Segurança em <em className="italic-accent">cada etapa</em></h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 15.5, margin: 0 }}>
              Do primeiro contato à escritura, cada passo da sua transação é protegido pela curadoria VN Prime.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 2 }}>
            {[
              { num: '01', title: 'Você só paga se vender', desc: 'Nos planos Assistida e Completa, zero adiantado. Comissão cobrada exclusivamente na conclusão do negócio.' },
              { num: '02', title: 'Due diligence incluso', desc: 'Análise de 30+ itens jurídicos e técnicos antes de qualquer assinatura. Sem surpresas no pós-venda.' },
              { num: '03', title: 'Dados protegidos', desc: 'Seus documentos e informações pessoais trafegam com criptografia. Nunca repassamos dados a terceiros sem autorização.' },
              { num: '04', title: 'Contrato transparente', desc: 'Termos claros, sem cláusulas surpresa. Você revisa e aprova tudo antes de assinar qualquer documento.' },
            ].map(item => (
              <div key={item.num} style={{ padding: '32px 28px', border: '1px solid var(--border)', background: '#FAFAF8' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.12em', marginBottom: 16 }}>{item.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', margin: '0 0 10px', lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vistos recentemente ── */}
      {recentImoveis.length > 0 && (
        <section style={{ padding: 'clamp(2rem,4vw,3rem) 0', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 'clamp(1.2rem,2vw,1.5rem)', margin: 0 }}>Vistos recentemente</h2>
              <button onClick={() => { localStorage.removeItem('vnp_recent'); setRecentImoveis([]) }} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--fg-3)', cursor: 'pointer', fontFamily: 'inherit' }}>Limpar histórico</button>
            </div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {recentImoveis.map(im => (
                <Link key={im.id} href={`/imovel/${im.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ width: 200, background: 'var(--cream)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'transform 0.18s', cursor: 'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}>
                    <div style={{ height: 120, background: im.fotos?.[0] ? `url(${im.fotos[0]}) center/cover` : 'var(--navy)', position: 'relative' }}>
                      {im.destaque && <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>★</span>}
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 2 }}>{fmt(im.preco)}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 3 }}>{im.titulo}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{im.bairro}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ── */}
      <section style={{ padding: 'clamp(2.5rem,5vw,3.5rem) 0', background: 'var(--navy-deep)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase' }}>Fique por dentro</div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}>Alertas do mercado imobiliário de BH</h2>
          <p style={{ color: 'rgba(245,248,250,0.65)', fontSize: 15, maxWidth: 480, margin: 0 }}>Receba novos imóveis em destaque, análises de mercado e oportunidades exclusivas diretamente no seu e-mail.</p>
          {nlSent ? (
            <div style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.4)', borderRadius: 10, padding: '14px 24px', color: '#34D399', fontSize: 14, fontWeight: 600 }}>
              ✅ Inscrito! Você receberá nossas atualizações em breve.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 0, maxWidth: 460, width: '100%', borderRadius: 10, overflow: 'hidden', border: '1.5px solid rgba(212,168,87,0.35)', background: 'rgba(255,255,255,0.05)' }}>
              <input type="email" placeholder="Seu melhor e-mail" value={nlEmail} onChange={e => setNlEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendNl()}
                style={{ flex: 1, padding: '14px 18px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)' }} />
              <button onClick={sendNl} disabled={!nlEmail || nlSending}
                style={{ padding: '14px 22px', background: 'var(--gold)', border: 'none', cursor: nlEmail ? 'pointer' : 'default', fontSize: 13.5, fontWeight: 700, color: 'var(--navy-deep)', fontFamily: 'var(--font-body)', opacity: nlEmail ? 1 : 0.5, transition: 'opacity 0.15s' }}>
                {nlSending ? '…' : 'Inscrever'}
              </button>
            </div>
          )}
          <p style={{ color: 'rgba(245,248,250,0.35)', fontSize: 11.5, margin: 0 }}>Sem spam. Cancele quando quiser. Conforme a LGPD.</p>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 0', background: 'var(--cream)' }}>
        <div style={{ width: 'min(1280px,94vw)', margin: '0 auto' }}>
          <div style={{
            background: 'var(--gradient-navy-hero)', borderRadius: 24,
            padding: 'clamp(48px,6vw,72px)', textAlign: 'center',
          }}>
            <Eyebrow color="var(--gold)">VN Prime Imóveis</Eyebrow>
            <h2 style={{ color: '#fff', margin: '16px 0 16px', fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>Pronto para dar o próximo passo?</h2>
            <p style={{ color: 'rgba(245,248,250,0.80)', fontSize: 16, marginBottom: 36, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
              Curadoria de alto padrão, segurança jurídica e tecnologia — tudo em Belo Horizonte e região.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/anunciar"><Btn variant="accent" size="lg">Anunciar meu imóvel</Btn></Link>
              <Link href="/corretor"><Btn variant="ghost-light" size="lg">Entrar como corretor parceiro</Btn></Link>
              <Link href="/consorcio"><Btn variant="ghost-light" size="lg">Simular minha carta</Btn></Link>
              <Link href="/busca"><Btn variant="ghost-light" size="lg">Ver oportunidades</Btn></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
