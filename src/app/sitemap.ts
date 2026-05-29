import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

const BASE = 'https://vnprimeimoveis.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('imoveis')
    .select('id, criado_em')
    .eq('status', 'ativo')
    .order('criado_em', { ascending: false })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/busca`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/lancamentos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/vender`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/consorcio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/avaliacao`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/calculadora`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/due-diligence`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/relatorio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/anunciar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/fotografo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const imovelRoutes: MetadataRoute.Sitemap = (data ?? []).map(im => ({
    url: `${BASE}/imovel/${im.id}`,
    lastModified: im.criado_em ? new Date(im.criado_em) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...imovelRoutes]
}
