import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Obter a origem da requisição
  const origin = request.headers.get('origin') || ''
  
  // Lista de origens permitidas
  const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.0.100:3000',
    'http://127.0.0.1:3000',
  ]
  
  // Se a origem estiver na lista de permitidas, adicione os headers CORS
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/_next/static/:path*',
    '/_next/image/:path*',
    '/favicon.ico',
  ],
}