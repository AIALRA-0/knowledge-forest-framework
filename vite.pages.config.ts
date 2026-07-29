import { fileURLToPath } from "node:url";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(root, "static"),
  base: "/knowledge-forest-framework/",
  publicDir: path.join(root, "public"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    },
  },
  build: {
    outDir: path.join(root, "pages-dist"),
    emptyOutDir: true,
  },
});
