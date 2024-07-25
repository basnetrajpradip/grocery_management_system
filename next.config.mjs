/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ijebvl3tygt9ozil.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
