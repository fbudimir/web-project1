import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s.gravatar.com",
				port: "",
				pathname: "/avatar/**",
			},
		],
	},
};

export default nextConfig;
