import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Suppress punycode deprecation warning
  serverExternalPackages: ['punycode'],
};

export default withNextIntl(nextConfig);
