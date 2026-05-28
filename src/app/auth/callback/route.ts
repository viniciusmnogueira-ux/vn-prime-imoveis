import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(toSet: { name: string; value: string; options?: any }[]) {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Auto-create or update profile for OAuth users (Google etc.)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const meta = user.user_metadata ?? {}
        const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || ''

        // Check if profile already exists
        const { data: existing } = await supabase
          .from('profiles')
          .select('id, plano, tipo')
          .eq('id', user.id)
          .single()

        if (!existing) {
          // New user — create full profile
          await supabase.from('profiles').insert({
            id: user.id, email: user.email, nome: displayName,
            tipo: 'proprietario', plano_ativo: false, plano: 'direta',
          })
        } else if (!existing.plano) {
          // Existing user sem plano — adiciona plano sem sobrescrever tipo
          await supabase.from('profiles')
            .update({ plano: 'direta', nome: displayName })
            .eq('id', user.id)
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
