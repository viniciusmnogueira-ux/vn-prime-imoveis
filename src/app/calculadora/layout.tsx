import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calculadora ITBI e Custos',
  description: 'Calcule ITBI, escritura, registro e todos os custos cartorários na compra de imóveis em Belo Horizonte e Minas Gerais. Simulação gratuita e instantânea.',
  openGraph: { title: 'Calculadora ITBI | VN Prime', description: 'Calcule todos os custos antes de fechar o negócio.' },
}
// Module guard
function _checkModule() {
  if (process.env.NEXT_PUBLIC_MODULE_CALCULADORA === 'false') notFound()
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
