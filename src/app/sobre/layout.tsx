import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Sobre a VN Prime',
  description: 'Conheça a VN Prime Imóveis — plataforma de alto padrão para imóveis em Belo Horizonte e região metropolitana. Curadoria, tecnologia e segurança jurídica.',
  openGraph: { title: 'Sobre | VN Prime Imóveis', description: 'A plataforma imobiliária premium da Grande BH.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
