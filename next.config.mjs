// Static export for GitHub Pages (project site at /youseo).
// basePath prefixes both navigation links and /_next/ assets automatically, so
// no assetPrefix is needed (combining the two would double-prefix asset URLs).
// Next.js has no next/image usage here, so there is no optimizer to configure.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/youseo",
  trailingSlash: true,
};

export default nextConfig;