import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true, // lets your app be loaded from anywhere during dev (optional)
    proxy: {
      "/rpc": {
        target: "https://mainnet-rpc.kxcoscan.com/",
        changeOrigin: true,
        secure: true,
        // forward as POST with same body
        rewrite: (path) => "/", // upstream expects root
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
