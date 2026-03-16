/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'
    const backendUrl = 'http://localhost:8080' // Votre URL Spring Boot
    
    return [
      {
        source: '/(.*)',
        headers: [
          // ... vos autres en-têtes
          {
            key: 'Content-Security-Policy',
            value: isDev
              ? // 🔓 Configuration plus permissive pour le développement
                [
                  "default-src 'self'",
                  "connect-src 'self' http://localhost:* ws://localhost:*",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: https:",
                  "font-src 'self'",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "frame-ancestors 'self'",
                  "block-all-mixed-content"
                ].join('; ')
              : // 🔒 Configuration stricte pour la production
                [
                  "default-src 'self'",
                  `connect-src 'self' ${backendUrl}`,
                  "script-src 'self'",
                  "style-src 'self'",
                  "img-src 'self' data: https:",
                  "font-src 'self'",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "frame-ancestors 'self'",
                  "block-all-mixed-content",
                  "upgrade-insecure-requests"
                ].join('; ')
          }
        ]
      }
    ]
  }
}