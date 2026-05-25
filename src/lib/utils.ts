export const fmtBRL = (n: number) =>
  'R$ ' + new Intl.NumberFormat('pt-BR').format(n)

export const fmtBRLshort = (n: number): string => {
  if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')} mi`
  if (n >= 1_000)     return `R$ ${(n / 1_000).toFixed(0)} mil`
  return fmtBRL(n)
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

export const phoneHref = (tel: string) =>
  'https://wa.me/55' + tel.replace(/\D/g, '')
