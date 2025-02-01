import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import { name as packageName } from "./package.json";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    },
    build: {
      manifest: true,
      lib: {
        entry: resolve(__dirname, "src/main.ce.ts"),
        name: packageName,
        fileName: 'index',
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue3",
          },
        },
      },
    },
  };
});
