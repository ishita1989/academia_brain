/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Smaller prod bundle for Railway (Nixpacks copies .next + standalone only)
  output: "standalone",
};

module.exports = nextConfig;
