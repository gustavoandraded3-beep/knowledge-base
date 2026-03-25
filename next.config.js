/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Content-Disposition", value: "inline" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;