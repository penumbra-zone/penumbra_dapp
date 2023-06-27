/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	images: { unoptimized: true },
	trailingSlash: true,
	distDir: 'docroot',
}

module.exports = nextConfig
