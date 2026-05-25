import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer style={{ background: 'var(--navy-deep)', color: 'rgba(255,255,255,0.7)', paddingTop: 56, paddingBottom: 32 }}>
      <div style={{ width: 'min(1200px,92vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>VN Prime Imóveis</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
              Imóveis de alto padrão em Belo Horizonte e região. Tecnologia, curadoria e transparência em cada transação.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Comprar</div>
            {[['Buscar imóveis','/busca'],['Lançamentos','/lancamentos'],['Calculadora ITBI','/calculadora'],['Due Diligence','/due-diligence']].map(([l,h]) => (
              <Link key={h} href={h} style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Vender</div>
            {[['Anunciar imóvel','/anunciar'],['Portal Proprietário','/proprietario'],['Avaliação','/avaliacao'],['Consórcio','/consorcio']].map(([l,h]) => (
              <Link key={h} href={h} style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Contato</div>
            <a href="https://wa.me/5531984144250" style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textDecoration: 'none' }}>(31) 98414-4250</a>
            <a href="mailto:contato@vnprimeimoveis.com.br" style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textDecoration: 'none' }}>contato@vnprimeimoveis.com.br</a>
            <Link href="/sobre" style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textDecoration: 'none' }}>Sobre nós</Link>
            <Link href="/admin" style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 24, textDecoration: 'none' }}>Admin</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>© {new Date().getFullYear()} VN Prime Imóveis. Todos os direitos reservados.</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>CRECI-MG · BH e Região Metropolitana</div>
        </div>
      </div>
    </footer>
  )
}
