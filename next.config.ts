import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Suas configurações existentes permanecem aqui...
  
  // Configuração de headers para resolver CORS no desenvolvimento
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' 
              ? '*'  // Permite todas as origens em desenvolvimento
              : 'https://seusite.com' // Em produção, especifique seu domínio
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Cookie, Set-Cookie'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          }
        ],
      },
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://seusite.com'
          },
        ],
      },
    ]
  },
}

export default nextConfig