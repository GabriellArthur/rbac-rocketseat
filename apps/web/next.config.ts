import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

export default nextConfig
