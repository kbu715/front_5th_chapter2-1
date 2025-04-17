import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig, loadEnv } from "vite";
import path from "node:path";

const mode = process.env.NODE_ENV || "development";
const env = loadEnv(mode, process.cwd(), "");

export default mergeConfig(
  defineConfig({
    base: env.VITE_BASE_PATH,
    resolve: {
      alias: {
        "@advanced": path.resolve(__dirname, "./src/advanced")
      }
    }
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "src/setupTests.js"
    }
  })
);
