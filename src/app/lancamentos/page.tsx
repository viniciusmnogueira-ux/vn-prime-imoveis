import Eyebrow from '@/components/ui/Eyebrow'
import Btn from '@/components/ui/Btn'
import Link from 'next/link'

export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(180deg, #0F1824 0%, #1B2733 100%)', padding: 'clamp(80px,12vw,140px) 0', color: '#fff', textAlign: 'center' }}>
        <div style={{ width: 'min(700px,92vw)', margin: '0 auto' }}>
          <Eyebrow color="var(--gold)">VN Prime Imóveis</Eyebrow>
          <h1 style={{ color: '#fff', margin: '16px 0 20px', textTransform: 'capitalize' }}>lancamentos</h1>
          <p style={{ fontSize: 17, color: 'rgba(245,248,250,0.8)', marginBottom: 32 }}>Esta página está sendo migrada para o novo sistema. Em breve com todas as funcionalidades.</p>
          <Link href="/"><Btn variant="accent" size="lg">Voltar para o início</Btn></Link>
        </div>
      </section>
    </main>
  )
}
