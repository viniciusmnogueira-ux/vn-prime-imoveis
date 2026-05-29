import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Buscar Imóveis',
  description: 'Busque apartamentos, casas, coberturas e lotes de alto padrão em Belo Horizonte, Nova Lima e região metropolitana. Filtros por bairro, preço e tipo.',
  openGraph: { title: 'Buscar Imóveis | VN Prime', description: 'Portfólio curado de imóveis premium em BH e Grande BH.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
