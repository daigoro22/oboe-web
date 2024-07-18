import path from "node:path";
import build from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import svgr from "vite-plugin-svgr";

import { defineConfig } from "vite";

const cjsPackages = [
  "cookie",
  "seedrandom",
  "qs",
  "side-channel",
  "get-intrinsic",
  "es-errors",
  "has-symbols",
  "has-proto",
  "function-bind",
  "hasown",
  "call-bind",
  "set-function-length",
  "define-data-property",
  "es-define-property",
  "gopd",
  "has-property-descriptors",
  "object-inspect",
  "crypto-browserify",
  "randombytes",
  "safe-buffer",
];

export default defineConfig({
  plugins: [
    build(),
    devServer({
      adapter,
      entry: "src/index.tsx",
    }),
    svgr(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    external: [...["react", "react-dom"], ...cjsPackages],
    target: "webworker",
  },
});
