import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  
  resolve: {
    alias: [
      // "@": path.resolve(__dirname, "./client/src"),
      //"@shared": path.resolve(__dirname, "./shared"),
       { find: '@', replacement: path.resolve(__dirname, './client/src') },
       { find: '@shared', replacement: path.resolve(__dirname, './shared') },
    ],
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
     fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },

  },
});