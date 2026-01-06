/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  // ✅ Unblock Render builds by skipping ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Keep this strict (recommended). Only turn true as a short-term emergency.
  typescript: {
    ignoreBuildErrors: false,
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },

  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "images.pexels.com",
    ],
  },
};

export default config;
