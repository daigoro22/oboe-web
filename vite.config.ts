import path from "node:path";
import build from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import svgr from "vite-plugin-svgr";

import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
	plugins: [
		build(),
		devServer({
			adapter,
			entry: "src/index.tsx",
		}),
		commonjs({
			filter(id) {
				if (id.includes("node_modules/cookie")) {
					return true;
				}
			},
		}),
		svgr(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	ssr: { external: ["react", "react-dom"] },
});
