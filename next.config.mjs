/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/Shop',
                permanent: true,
            }, 
        ];
    }
};

export default nextConfig;
