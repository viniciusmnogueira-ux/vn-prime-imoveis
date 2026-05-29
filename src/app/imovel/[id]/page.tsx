import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ImovelDetail from './ImovelDetail'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('imoveis')
    .select('titulo, bairro, cidade, preco, tipo, descricao, fotos')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Imóvel não encontrado' }

  const fmtBRL = (n: number) =>
    n >= 1_000_000
      ? `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')} mi`
      : `R$ ${(n / 1_000).toFixed(0)} mil`

  const tipo = data.tipo ? data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1) : 'Imóvel'
  const local = [data.bairro, data.cidade].filter(Boolean).join(', ')
  const preco = data.preco ? ` · ${fmtBRL(data.preco)}` : ''
  const description = `${tipo} à venda em ${local}${preco}. ${data.descricao ? data.descricao.slice(0, 120) + '…' : 'Imóvel de alto padrão com curadoria VN Prime.'}`
  const foto = data.fotos?.[0] ?? undefined

  return {
    title: data.titulo,
    description,
    openGraph: {
      title: `${data.titulo} | VN Prime Imóveis`,
      description,
      type: 'website',
      images: foto ? [{ url: foto, width: 1200, height: 630, alt: data.titulo }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.titulo,
      description,
      images: foto ? [foto] : [],
    },
  }
}

export default function ImovelPage() {
  return <ImovelDetail />
}
