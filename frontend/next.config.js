/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ replaces "next export"
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
