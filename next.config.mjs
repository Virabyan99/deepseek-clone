/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          crypto: 'crypto-browserify',
        };
      }
      return config;
    },
  };
  
  export default nextConfig;