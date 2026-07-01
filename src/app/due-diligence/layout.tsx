import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Due Diligence Imobiliária',
  description: 'Análise documental completa antes de comprar seu imóvel em BH. Checklist com 30+ itens, análise jurídica e vistoria técnica. Relatório em até 48h.',
  openGraph: { title: 'Due Diligence | VN Prime', description: 'Compre com segurança jurídica total — análise em até 48h.' },
}
// Module guard
function _checkModule() {
  if (process.env.NEXT_PUBLIC_MODULE_DUE_DILIGENCE === 'false') notFound()
}

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
