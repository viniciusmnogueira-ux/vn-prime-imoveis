import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Anunciar Imóvel',
  description: 'Anuncie seu imóvel na VN Prime em minutos. Crie seu anúncio passo a passo, escolha seu plano e chegue a compradores qualificados em BH e Grande BH.',
  openGraph: { title: 'Anunciar Imóvel | VN Prime', description: 'Anuncie e venda com curadoria e tecnologia VN Prime.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
