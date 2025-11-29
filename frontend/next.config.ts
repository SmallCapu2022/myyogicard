import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Force the client bundle to use the ESM/browser build of Firebase Firestore
    // to avoid server-only dependencies (grpc) being pulled into the browser.
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "firebase/firestore": "firebase/firestore/dist/index.esm.js",
      };
    }
    return config;
  },
};

export default nextConfig;
