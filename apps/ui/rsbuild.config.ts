import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const daemonPort = process.env.JONGMYO_DAEMON_PORT ?? "8787";
const daemonWs =
  process.env.PUBLIC_JONGMYO_DAEMON_WS ?? `ws://172.16.42.1:${daemonPort}/ws`;

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  source: {
    preEntry: "./bundler/performance-stub.ts",
    define: {
      "import.meta.env.PUBLIC_JONGMYO_DAEMON_WS": JSON.stringify(daemonWs),
    },
    include: [/[\\/]node_modules[\\/]zod[\\/]/],
  },
  output: {
    polyfill: "usage",
    target: "web",
    overrideBrowserslist: ["chrome >= 69"],
  },
  server: {
    proxy: {
      "/daemon": {
        target: `http://127.0.0.1:${daemonPort}`,
        changeOrigin: true,
        pathRewrite: {
          "^/daemon": "",
        },
      },
    },
  },
  tools: {
    swc: {
      jsc: {
        externalHelpers: true,
      },
    },
  },
  plugins: [
    pluginReact({
      enableProfiler: false,
    }),
  ],
});
