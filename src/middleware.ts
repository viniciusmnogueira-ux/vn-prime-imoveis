import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/incorporadora', '/admin', '/anunciar']

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se env vars não estiverem disponíveis, deixa passar sem auth check
  if (!url || !key) return NextResponse.next({ request })

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(toSet: { name: string; value: string; options?: any }[]) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          toSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    const isProtected = PROTECTED.some(p => path.startsWith(p))
    if (isProtected && !user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }
  } catch {
    // Em caso de erro do Supabase, deixa passar sem bloquear
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
