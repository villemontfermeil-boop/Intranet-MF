/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const backendUrl = "http://localhost:8080";

    const csp = isDev
      ? [
        "default-src 'self'",
        "connect-src 'self' http://localhost:* ws://localhost:*",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",

        "img-src 'self' data: blob: http://localhost:8080 https:",
        "media-src 'self' blob: http://localhost:8080 https:",

        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "block-all-mixed-content"
      ].join("; ")
      : [
        "default-src 'self'",
        `connect-src 'self' ${backendUrl}`,
        "script-src 'self'",
        "style-src 'self'",

        "img-src 'self' data: blob: https:",
        "media-src 'self' blob: https:",

        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "block-all-mixed-content",
        "upgrade-insecure-requests"
      ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ...(isDev
            ? []
            : [
              {
                key: "Strict-Transport-Security",
                value: "max-age=31536000; includeSubDomains"
              }
            ])
        ]
      }
    ];
  }
};

module.exports = nextConfig;

