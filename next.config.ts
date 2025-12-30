import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.gavern.org/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "shdw-drive.genesysgo.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.website-files.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pyth.network",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uploads-ssl.webflow.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.discordapp.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.foresight.exchange",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "socean-git-enhancement-orca-price-feed-lieuzhenghong.vercel.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "govern.jetassociation.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "linktr.ee",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.meta-collective.digital",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "worldtop.mypinata.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "superteam.fun",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.hellomoon.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "snipboard.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "3376093563-files.gitbook.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "artivive.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "xandeum.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.ipfs.nftstorage.link",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
