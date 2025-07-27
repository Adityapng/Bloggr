import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.*", '192.168.2.*', 'localhost', '10.206.239.*']
};

export default nextConfig;
