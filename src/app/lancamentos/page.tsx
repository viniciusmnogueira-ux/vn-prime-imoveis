'use client'
import { useState, useEffect } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

export default function LancamentosPage() {
  const [imoveis, setImoveis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [bairro, setBairro] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let q = supabase
        .from('imoveis')
        .select('id, titulo, tipo, bairro, cidade, preco, area, quartos, fotos, status')
        .eq('status', 'ativo')
        .eq('operacao', 'venda')
        .order('created_at', { ascending: false })
        .limit(12)

      if (bairro.trim()) q = q.ilike('bairro', `%${bairro.trim()}%`)

      const { data } = await q
      setImoveis(data || [])
      setLoading(false)
    }
    load()
  }, [bairro])

  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, rgba(15,24,36,0.92) 0%, rgba(27,39,51,0.88) 100%),
                     url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1900&q=85) center/cover`,
        padding: 'clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)',
        color: '#fff',
      }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto', maxWidth: 680 }}>
          <Eyebrow color="var(--gold)">Novidades VN Prime</Eyebrow>
          <h1 style={{ color: '#fff', margin: '14px 0 18px' }}>
            Lançamentos e{' '}
            <em className="italic-accent" style={{ color: 'var(--gold-soft)' }}>novidades.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(245,248,250,0.85)', lineHeight: 1.7, marginBottom: 36 }}>
            Imóveis recém-cadastrados e lançamentos de alto padrão em BH e região metropolitana. Seja o primeiro a saber.
          </p>
          <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.97)', borderRadius: 12, overflow: 'hidden', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
            <input type="text" placeholder="Filtrar por bairro..."
              value={bairro} onChange={e => setBairro(e.target.value)}
              style={{ flex: 1, padding: '14px 18px', border: 'none', fontSize: 14, outline: 'none', background: 'transparent', color: 'var(--navy)' }} />
            <div style={{ padding: '0 16px', background: 'var(--gold)', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 700, color: 'var(--navy-deep)' }}>
              Buscar
            </div>
          </div>
        </div>
      </section>

      {/* Cadastre-se para alertas */}
      <section style={{ background: 'var(--navy)', padding: '20px 0' }}>
        <div style={{ width: 'min(1100px,92vw)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
            Quer ser avisado quando chegar um imóvel do seu perfil?
          </div>
          <a href="https://wa.me/5531984144250?text=Olá! Quero receber alertas de novos lançamentos VN Prime." target="_blank" rel="noopener noreferrer">
            <Btn variant="accent" size="sm">Ativar alertas pelo WhatsApp</Btn>
          </a>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0' }}>
        <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg-3)', fontSize: 15 }}>Carregando lançamentos...</div>
          ) : imoveis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🏗️</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>Em breve novos lançamentos</div>
              <div style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 24 }}>
                {bairro ? `Nenhum imóvel encontrado em "${bairro}".` : 'Novos imóveis chegando em breve.'} Ative alertas para ser avisado primeiro.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {bairro && <button onClick={() => setBairro('')} style={{ padding: '10px 20px', borderRadius: 99, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-1)' }}>Limpar filtro</button>}
                <Link href="/busca"><Btn variant="primary">Ver todos os imóveis</Btn></Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {imoveis.map(im => {
                const foto = im.fotos?.[0] ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'
                return (
                  <Link key={im.id} href={`/imovel/${im.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                      <div style={{ height: 200, background: `url(${foto}) center/cover`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gold)', color: 'var(--navy-deep)', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, letterSpacing: '0.06em' }}>NOVO</div>
                      </div>
                      <div style={{ padding: '18px 20px' }}>
                        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>{im.tipo} · {im.bairro}, {im.cidade}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 10, lineHeight: 1.3 }}>{im.titulo}</div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}>
                          {im.area && <span>{im.area} m²</span>}
                          {im.quartos && <span>{im.quartos} quartos</span>}
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>
                          {im.preco ? fmt(im.preco) : 'Consulte'}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {imoveis.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/busca"><Btn variant="primary" size="lg">Ver todos os imóveis</Btn></Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA incorporadoras */}
      <section style={{ padding: 'clamp(50px,7vw,80px) 0', background: '#fff' }}>
        <div style={{ width: 'min(900px,92vw)', margin: '0 auto', background: 'var(--gradient-navy-hero)', borderRadius: 24, padding: 'clamp(40px,5vw,64px)', textAlign: 'center', color: '#fff' }}>
          <Eyebrow color="var(--gold)">Incorporadoras</Eyebrow>
          <h2 style={{ color: '#fff', margin: '16px 0 14px' }}>Lançando um empreendimento?</h2>
          <p style={{ color: 'rgba(245,248,250,0.8)', fontSize: 16, maxWidth: 480, margin: '0 auto 32px' }}>
            A VN Prime oferece gestão de leads e visibilidade para incorporadores em BH e região. Fale com nossa equipe.
          </p>
          <a href="https://wa.me/5531984144250?text=Olá! Tenho um empreendimento para lançar e gostaria de saber sobre parceria com a VN Prime." target="_blank" rel="noopener noreferrer">
            <Btn variant="accent" size="lg">Falar com o time VN Prime</Btn>
          </a>
        </div>
      </section>
    </main>
  )
}
