import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Avaliação de Imóvel',
  description: 'Descubra o valor do seu imóvel com nossa estimativa inteligente. Cruzamos dados de mercado de BH e Grande BH com referências comparativas do bairro.',
  openGraph: { title: 'Avaliação de Imóvel | VN Prime', description: 'Estimativa inteligente baseada em dados reais do mercado.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
