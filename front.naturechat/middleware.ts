import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
    const isPrivateRoute = request.nextUrl.pathname.startsWith('/chat')

    // não logado tentando acessar rota privada
    if (!token && isPrivateRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // logado tentando acessar login
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/chat', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/chat/:path*', '/login'],
}
