// vite.config.ts
import { defineConfig } from "file:///D:/Work/KnightVault/tokenization-knightsbridge-alpha/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Work/KnightVault/tokenization-knightsbridge-alpha/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///D:/Work/KnightVault/tokenization-knightsbridge-alpha/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\Work\\KnightVault\\tokenization-knightsbridge-alpha";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    // lets your app be loaded from anywhere during dev (optional)
    proxy: {
      "/rpc": {
        target: "https://mainnet-rpc.kxcoscan.com/",
        changeOrigin: true,
        secure: true,
        // forward as POST with same body
        rewrite: (path2) => "/"
        // upstream expects root
      }
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3JrXFxcXEtuaWdodFZhdWx0XFxcXHRva2VuaXphdGlvbi1rbmlnaHRzYnJpZGdlLWFscGhhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxXb3JrXFxcXEtuaWdodFZhdWx0XFxcXHRva2VuaXphdGlvbi1rbmlnaHRzYnJpZGdlLWFscGhhXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Xb3JrL0tuaWdodFZhdWx0L3Rva2VuaXphdGlvbi1rbmlnaHRzYnJpZGdlLWFscGhhL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIGNvcnM6IHRydWUsIC8vIGxldHMgeW91ciBhcHAgYmUgbG9hZGVkIGZyb20gYW55d2hlcmUgZHVyaW5nIGRldiAob3B0aW9uYWwpXHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9ycGNcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwczovL21haW5uZXQtcnBjLmt4Y29zY2FuLmNvbS9cIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiB0cnVlLFxyXG4gICAgICAgIC8vIGZvcndhcmQgYXMgUE9TVCB3aXRoIHNhbWUgYm9keVxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBcIi9cIiwgLy8gdXBzdHJlYW0gZXhwZWN0cyByb290XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiZcclxuICAgIGNvbXBvbmVudFRhZ2dlcigpLFxyXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1YsU0FBUyxvQkFBb0I7QUFDblgsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBO0FBQUEsUUFFUixTQUFTLENBQUNBLFVBQVM7QUFBQTtBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
