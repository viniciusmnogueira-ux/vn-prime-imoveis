import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Relatório de Mercado BH',
  description: 'Dados ao vivo do mercado imobiliário de Belo Horizonte e Grande BH. Preços médios, tendências por bairro e distribuição do portfólio VN Prime.',
  openGraph: { title: 'Relatório de Mercado | VN Prime', description: 'Inteligência de mercado imobiliário em tempo real — BH e Grande BH.' },
}
// Module guard
function _checkModule() {
  if (process.env.NEXT_PUBLIC_MODULE_RELATORIO === 'false') notFound()
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
