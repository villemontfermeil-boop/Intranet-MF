/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ['192.168.56.11'],

  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const backendUrl = "http://192.168.56.11:8080";

    const csp = [
      "default-src 'self'",

      // 🔥 IMPORTANT Keycloak + API + WebSocket
      "connect-src 'self' http: https: ws: wss: http://localhost:* ws://localhost:* http://192.168.56.11:8080 http://keycloak.montfermeil.local:8081 https://prim.iledefrance-mobilites.fr",

      // ⚠️ Next.js nécessite unsafe-inline
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

      "style-src 'self' 'unsafe-inline'",

      // 🔥 images backend + blob upload + keycloak
      "img-src 'self' data: blob: http: https:",

      // 🔥 vidéos / fichiers upload
      "media-src 'self' blob: http: https:",

      "font-src 'self' data:",

      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'"
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  }
};

module.exports = nextConfig;


