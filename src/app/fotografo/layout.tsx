import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Fotografia de Imóveis',
  description: 'Fotografia profissional para imóveis de alto padrão em BH e Grande BH. Pacotes com fotos, tour 360°, drone e vídeo cinematográfico. Entrega em 24–48h.',
  openGraph: { title: 'Fotografia de Imóveis | VN Prime', description: 'Fotografia que vende imóveis de alto padrão.' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
