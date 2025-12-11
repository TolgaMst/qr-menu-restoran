/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Cloudflare Pages için static export
  distDir: 'out', // Cloudflare Pages için output directory
  images: {
    unoptimized: true, // Cloudflare Pages için
  },
}

module.exports = nextConfig



