import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Consórcio Imobiliário',
  description: 'Compre seu imóvel sem juros via consórcio. Simule sua carta de crédito, calcule parcelas e descubra como adquirir imóveis de alto padrão em BH sem juros bancários.',
  openGraph: { title: 'Consórcio Imobiliário | VN Prime', description: 'Compre sem juros — simule sua carta de crédito.' },
}
// Module guard
function _checkModule() {
  if (process.env.NEXT_PUBLIC_MODULE_CONSORCIO === 'false') notFound()
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
