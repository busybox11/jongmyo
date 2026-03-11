import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  source: {
    preEntry: "./bundler/performance-stub.ts",
  },
  output: {
    polyfill: "usage",
    target: "web",
    overrideBrowserslist: ["chrome >= 69"],
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
