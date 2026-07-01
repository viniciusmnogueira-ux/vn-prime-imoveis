import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Lançamentos Imobiliários',
  description: 'Empreendimentos de alto padrão em lançamento em Belo Horizonte e Nova Lima. Breve lançamento, em construção e prontos para morar com curadoria VN Prime.',
  openGraph: { title: 'Lançamentos | VN Prime', description: 'Empreendimentos premium em BH e Nova Lima — da planta à entrega.' },
}
// Module guard
function _checkModule() {
  if (process.env.NEXT_PUBLIC_MODULE_LANCAMENTOS === 'false') notFound()
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
