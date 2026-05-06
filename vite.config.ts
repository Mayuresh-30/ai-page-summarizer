import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "emit-extension-manifest",
      apply: "build",
      generateBundle() {
        const manifest = readFileSync(resolve(__dirname, "src/manifest.json"), "utf-8");
        this.emitFile({
          type: "asset",
          fileName: "manifest.json",
          source: manifest,
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        "popup/index": "src/popup/index.html",
        "background/background": "src/background/background.ts",
        "content/content": "src/content/content.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});