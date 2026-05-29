import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Portal do Corretor',
  description: 'Torne-se corretor parceiro VN Prime. Acesse leads qualificados, gerencie seu funil de vendas com CRM Kanban e receba comissão integral em cada negócio.',
  openGraph: { title: 'Portal do Corretor | VN Prime', description: 'Leads qualificados e comissão garantida para corretores parceiros.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
