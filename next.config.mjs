/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Add fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: 'crypto-browserify',
        querystring: 'querystringify',
        http: 'stream-http',
        https: 'stream-http',
        stream: 'stream-browserify',
      };
      return config;
    },
  };
  
  export default nextConfig;