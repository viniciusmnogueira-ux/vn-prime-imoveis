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
      // Auto-create profile for OAuth users (Google etc.) if not yet exists
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const meta = user.user_metadata ?? {}
        const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || ''
        await supabase.from('profiles').upsert(
          { id: user.id, email: user.email, nome: displayName, tipo: 'proprietario', plano_ativo: false },
          { onConflict: 'id', ignoreDuplicates: true }
        )
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
