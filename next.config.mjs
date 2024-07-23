import path from 'path';
import {fileURLToPath} from "node:url";

// `import.meta.url`을 사용하여 현재 파일의 URL을 가져옵니다
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true
    }
};

export default nextConfig;
