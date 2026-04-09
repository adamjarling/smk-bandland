import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["node-ical", "rrule-temporal", "@js-temporal/polyfill", "jsbi"],
};

export default nextConfig;
