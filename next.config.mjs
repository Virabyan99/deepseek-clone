/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Only apply the fallback on the client-side, not the server
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback, // Preserve any existing fallbacks
          crypto: 'crypto-browserify', // Use crypto-browserify as a fallback
        };
      }
      return config;
    },
  };
  
  export default nextConfig;