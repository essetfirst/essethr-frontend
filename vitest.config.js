import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      api: path.resolve(__dirname, "src/api"),
      components: path.resolve(__dirname, "src/components"),
      features: path.resolve(__dirname, "src/features"),
      hooks: path.resolve(__dirname, "src/hooks"),
      helpers: path.resolve(__dirname, "src/helpers"),
      layouts: path.resolve(__dirname, "src/layouts"),
      providers: path.resolve(__dirname, "src/providers"),
      stores: path.resolve(__dirname, "src/stores"),
      theme: path.resolve(__dirname, "src/theme"),
      utils: path.resolve(__dirname, "src/utils"),
    },
  },
});
