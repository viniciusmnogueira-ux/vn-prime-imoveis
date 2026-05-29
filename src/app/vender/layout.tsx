import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Vender Meu Imóvel',
  description: 'Venda seu imóvel com curadoria VN Prime. Três planos: taxa fixa R$ 297, 3% assistido ou 6% completo com corretor dedicado. Imóveis premium em BH e região.',
  openGraph: { title: 'Vender Imóvel | VN Prime', description: 'Venda com curadoria, tecnologia e segurança jurídica.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
