import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Due Diligence Imobiliária',
  description: 'Análise documental completa antes de comprar seu imóvel em BH. Checklist com 30+ itens, análise jurídica e vistoria técnica. Relatório em até 48h.',
  openGraph: { title: 'Due Diligence | VN Prime', description: 'Compre com segurança jurídica total — análise em até 48h.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
