import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Comparar Imóveis',
  description: 'Compare até 3 imóveis lado a lado. Analise preço, área, especificações técnicas e parcela estimada de financiamento para tomar a melhor decisão.',
  openGraph: { title: 'Comparar Imóveis | VN Prime', description: 'Compare imóveis lado a lado com análise financeira integrada.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
