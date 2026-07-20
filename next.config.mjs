/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bauk.uis.ac.id",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;