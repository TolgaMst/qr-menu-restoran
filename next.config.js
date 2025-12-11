/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Cloudflare Pages için static export
  images: {
    unoptimized: true, // Cloudflare Pages için
  },
}

module.exports = nextConfig



