import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: command === "serve" ? "/" : "/static/frontend/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL("../static/frontend", import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (asset) => (
          asset.name?.endsWith(".css")
            ? "assets/app.css"
            : "assets/[name][extname]"
        ),
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
}));
