import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@advanced": path.resolve(__dirname, "./src/advanced")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.js"
  }
});
