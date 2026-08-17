/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // remotePatterns is the non-deprecated form of `domains` in Next 14+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
