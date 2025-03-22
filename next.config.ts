import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://auth-module.lautaroayosa.com.ar/api',
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },

};

export default nextConfig;
