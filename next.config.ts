import createNextIntlPlugin from 'next-intl/plugin';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {rules: {'*.wgsl': {loaders: ['@vgpu/wgsl/loader-webpack'], as: '*.js'}}},
  webpack(config) {
    config.module.rules.push({test: /\.wgsl$/, loader: '@vgpu/wgsl/loader-webpack'});
    return config;
  },
};
export default createNextIntlPlugin('./i18n/request.ts')(nextConfig);
