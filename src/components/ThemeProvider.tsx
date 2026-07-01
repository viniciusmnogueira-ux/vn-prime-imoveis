import { SITE_CONFIG } from '@/lib/config'

export default function ThemeProvider() {
  const { primary, accent, bg } = SITE_CONFIG.colors
  if (!primary && !accent && !bg) return null

  const rules: string[] = []
  if (primary) rules.push(`--navy:${primary};--navy-deep:color-mix(in srgb,${primary} 80%,#000);--navy-soft:color-mix(in srgb,${primary} 85%,#fff 15%);--navy-muted:color-mix(in srgb,${primary} 70%,#fff 30%);`)
  if (accent)  rules.push(`--gold:${accent};--gold-soft:color-mix(in srgb,${accent} 80%,#fff);--gold-bright:color-mix(in srgb,${accent} 60%,#fff);--gold-deep:color-mix(in srgb,${accent} 80%,#000);`)
  if (bg)      rules.push(`--cream:${bg};`)

  return <style>{`:root{${rules.join('')}}`}</style>
}
