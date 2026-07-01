import type { Metadata } from 'next'
import '@/styles/globals.css'

export const dynamic = 'force-dynamic'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemeProvider from '@/components/ThemeProvider'
import { SITE_CONFIG } from '@/lib/config'

const brandName = SITE_CONFIG.brand.name

export const metadata: Metadata = {
  title: { default: brandName, template: `%s | ${brandName}` },
  description: SITE_CONFIG.brand.description,
  keywords: ['imóveis BH', 'apartamentos Belo Horizonte', 'casas Nova Lima', 'imóveis alto padrão'],
  openGraph: {
    siteName: brandName,
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <ThemeProvider />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>
        <SiteHeader />
        <div style={{ minHeight: 'calc(100vh - var(--header-h))' }}>
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  )
}
