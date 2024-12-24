import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isLoggedIn = request.cookies.get('admin_token')
    const isLoginPage = request.nextUrl.pathname === '/admin/login'

    if (!isLoggedIn && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
} 