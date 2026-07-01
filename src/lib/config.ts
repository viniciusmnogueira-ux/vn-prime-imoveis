export type Template = 'vitrine' | 'completa' | 'empreendimentos'

export const SITE_CONFIG = {
  template: (process.env.NEXT_PUBLIC_TEMPLATE || 'completa') as Template,
  brand: {
    name:        process.env.NEXT_PUBLIC_BRAND_NAME        || 'VN Prime Imóveis',
    display1:    process.env.NEXT_PUBLIC_BRAND_DISPLAY1    || 'VN PRIME',
    display2:    process.env.NEXT_PUBLIC_BRAND_DISPLAY2    || 'IMÓVEIS',
    initials:    process.env.NEXT_PUBLIC_BRAND_INITIALS    || 'VN',
    tagline:     process.env.NEXT_PUBLIC_BRAND_TAGLINE     || 'Belo Horizonte e região',
    phone:       process.env.NEXT_PUBLIC_BRAND_PHONE       || '5531984144250',
    city:        process.env.NEXT_PUBLIC_BRAND_CITY        || 'BH e Grande BH',
    logoUrl:     process.env.NEXT_PUBLIC_LOGO_URL          || '',
    slogan:      process.env.NEXT_PUBLIC_BRAND_SLOGAN      || 'Curadoria silenciosa',
    description: process.env.NEXT_PUBLIC_BRAND_DESCRIPTION || 'Curadoria de imóveis premium em Belo Horizonte, Nova Lima e região metropolitana.',
  },
  colors: {
    primary: process.env.NEXT_PUBLIC_COLOR_PRIMARY || '',
    accent:  process.env.NEXT_PUBLIC_COLOR_ACCENT  || '',
    bg:      process.env.NEXT_PUBLIC_COLOR_BG      || '',
  },
}

// Flag helper — default true, seta como "false" no .env para desligar
const on = (key: string) => (process.env[`NEXT_PUBLIC_MODULE_${key}`] ?? 'true') !== 'false'

export const MODULES = {
  lancamentos:         on('LANCAMENTOS'),
  consorcio:           on('CONSORCIO'),
  dueDiligence:        on('DUE_DILIGENCE'),
  avaliacao:           on('AVALIACAO'),
  calculadora:         on('CALCULADORA'),
  relatorio:           on('RELATORIO'),
  fotografo:           on('FOTOGRAFO'),
  portalCorretor:      on('PORTAL_CORRETOR'),
  portalProprietario:  on('PORTAL_PROPRIETARIO'),
  vender:              on('VENDER'),
  comoFunciona:        on('COMO_FUNCIONA'),
  sobre:               on('SOBRE'),
}
