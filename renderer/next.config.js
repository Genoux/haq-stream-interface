/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  transpilePackages: ["geist"],
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}
