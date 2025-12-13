/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // allow any domain
          port: '',
          pathname: '/**', // allow any path
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  