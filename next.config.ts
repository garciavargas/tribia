import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Worldcoin Mini Apps
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://*.worldcoin.org https://*.worldscan.org",
              "frame-ancestors 'self' https://*.worldcoin.org https://worldcoin.org",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://worldcoin.org",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
