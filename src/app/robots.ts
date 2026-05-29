import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/proprietario', '/corretor', '/login'],
      },
    ],
    sitemap: 'https://vnprimeimoveis.com.br/sitemap.xml',
  }
}
