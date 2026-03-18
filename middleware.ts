import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Inicializamos a resposta que o Next.js vai dar
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Criamos um cliente do Supabase específico para o servidor
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Consultamos o Supabase para ver se existe um usuário logado nos cookies
  const { data: { user } } = await supabase.auth.getUser()

  // Definimos quais rotas são públicas (não precisam de login)
  const isPublicRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'

  // REGRA 1: Se NÃO estiver logado e tentar acessar uma rota privada (como a Home, /create-workout, etc)
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url) // Chuta de volta para o login
  }

  // REGRA 2: Se ESTIVER logado e tentar acessar a tela de login ou register
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url) // Manda direto para o Dashboard
  }

  // Se passou pelas regras, deixa a requisição seguir normalmente
  return supabaseResponse
}

// O Matcher diz ao Next.js em quais rotas ele deve rodar esse middleware
export const config = {
  matcher: [
    /*
     * Ignora arquivos estáticos e imagens para não pesar o servidor à toa:
     * - _next/static (arquivos estáticos)
     * - _next/image (imagens otimizadas)
     * - favicon.ico (ícone do site)
     * - qualquer arquivo com extensão de imagem (svg, png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}