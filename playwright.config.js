import { defineConfig } from "@playwright/test";

const fullStack = Boolean(process.env.QA_E2E_FULL);
const externalBase = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: externalBase || (fullStack ? "http://127.0.0.1:3000" : "http://127.0.0.1:4173"),
    trace: "on-first-retry",
  },
  webServer: externalBase
    ? undefined
    : fullStack
      ? {
          command: "npm run dev",
          url: "http://127.0.0.1:3000",
          reuseExistingServer: !process.env.CI,
          cwd: "..",
          timeout: 120_000,
        }
      : {
          command: "npm run preview -w frontend -- --port 4173 --host 127.0.0.1",
          url: "http://127.0.0.1:4173",
          reuseExistingServer: !process.env.CI,
          cwd: "..",
          timeout: 120_000,
        },
});
