import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Meus Favoritos',
  description: 'Seus imóveis salvos na VN Prime. Compare, exporte e acompanhe os imóveis que mais te interessam em Belo Horizonte e região.',
  openGraph: { title: 'Favoritos | VN Prime', description: 'Seus imóveis favoritos salvos e organizados.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
