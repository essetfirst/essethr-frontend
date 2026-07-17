import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const src = path.resolve(__dirname, "src");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = env.VITE_API_PORT || env.REACT_APP_API_PORT || "4000";
  const apiTarget = env.VITE_API_URL || env.REACT_APP_API_URL || `http://127.0.0.1:${apiPort}`;

  return {
    plugins: [react({ include: /\.(jsx|js|tsx|ts)$/ })],
    envPrefix: ["VITE_", "REACT_APP_"],
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      include: ["dayjs", "@mui/x-date-pickers/AdapterDayjs", "@essethr/shared/schemas/auth"],
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    resolve: {
      alias: {
        features: path.join(src, "features"),
        components: path.join(src, "components"),
        api: path.join(src, "api"),
        hooks: path.join(src, "hooks"),
        layouts: path.join(src, "layouts"),
        providers: path.join(src, "providers"),
        constants: path.join(src, "constants"),
        utils: path.join(src, "utils"),
        theme: path.join(src, "theme"),
        config: path.join(src, "config"),
        stores: path.join(src, "stores"),
        "@essethr/shared": path.resolve(__dirname, "../packages/shared"),
        i18n: path.join(src, "i18n"),
        helpers: path.join(src, "helpers"),
        assets: path.join(src, "assets"),
        icons: path.join(src, "icons"),
      },
    },
    server: {
      port: Number(env.PORT || 3000),
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "build",
      sourcemap: mode !== "production",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            mui: ["@mui/material", "@mui/icons-material"],
            charts: ["chart.js", "react-chartjs-2"],
            query: ["@tanstack/react-query", "zustand"],
          },
        },
      },
      chunkSizeWarningLimit: 900,
    },
  };
});
