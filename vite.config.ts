import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "Just Be",
        short_name: "Just Be",
        description: "A simple app for guided breathing exercises.",
        theme_color: "#0f172a", // Corresponds to slate-900
        background_color: "#0f172a",
        start_url: ".",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        categories: ["health", "wellness", "mindfulness"],
        lang: "en-US",
        scope: "/",
        orientation: "portrait",
        display_override: ["window-controls-overlay"],
      },
    }),
  ],
});
