import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Task Tree Manager",
				short_name: "TaskTree",
				start_url: "/",
				display: "standalone",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				icons: [
					{ src: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
					{ src: "/icons/icon-72.png", sizes: "72x72", type: "image/png" },
					{ src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
					{ src: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
					{ src: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
					{
						src: "/icons/icon-192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/icons/icon-256.png",
						sizes: "256x256",
						type: "image/png",
					},
					{
						src: "/icons/icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
					{
						src: "/icons/icon-1024.png",
						sizes: "1024x1024",
						type: "image/png",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
