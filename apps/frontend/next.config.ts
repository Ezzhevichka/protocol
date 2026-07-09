import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        qualities: [40, 50, 75],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.steamstatic.com',
            },
        ],
    },
};

export default nextConfig;
