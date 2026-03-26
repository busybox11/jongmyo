import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],

  vite: () => ({
    define: {
      "import.meta.env.JONGMYO_DEBUG": JSON.stringify(
        process.env.JONGMYO_DEBUG ?? "",
      ),
    },
    build: {
      rollupOptions: {
        external: ["moduleRaid"],
      },
    },
  }),

  manifest: {
    host_permissions: [
      "http://127.0.0.1/*",
      "http://172.16.42.1/*",
      "http://localhost/*",
    ],
    web_accessible_resources: [
      {
        resources: [
          "media-session-main-world.js",
          "soundcloud-enricher-main-world.js",
        ],
        matches: ["*://*/*"],
      },
    ],
  },

  dev: {
    server: {
      port: 7046,
    },
  },
});
