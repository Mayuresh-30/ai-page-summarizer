import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"


export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        background: "src/background/background.ts",
        content: "src/content/content.ts"
      },
      output: {
        entryFileNames: "[name].js"
      }
    }
  }
});