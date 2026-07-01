export type Template = 'vitrine' | 'completa' | 'empreendimentos'

export const SITE_CONFIG = {
  template: (process.env.NEXT_PUBLIC_TEMPLATE || 'completa') as Template,
  brand: {
    name:    process.env.NEXT_PUBLIC_BRAND_NAME    || 'VN Prime Imóveis',
    tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Belo Horizonte e região',
    phone:   process.env.NEXT_PUBLIC_BRAND_PHONE   || '5531984144250',
    city:    process.env.NEXT_PUBLIC_BRAND_CITY    || 'BH e Grande BH',
  },
}
