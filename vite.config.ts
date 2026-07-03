import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserPage = repositoryName?.endsWith(".github.io");
const pagesBase =
  process.env.VITE_BASE_PATH ?? (process.env.GITHUB_ACTIONS && repositoryName && !isUserPage ? `/${repositoryName}/` : "/");

export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        entryFileNames: "assets/app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
